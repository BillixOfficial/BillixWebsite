/**
 * Daily data updates: checks EIA and BLS for new releases and turns each one into a
 * dated, sourced "update" article in src/content/data-updates.json.
 *
 * Every sentence is a template filled with numbers straight from the official API, so
 * nothing here is written by a model. Run daily by .github/workflows/daily-updates.yml:
 *
 *   npx tsx scripts/updates/data-updates.ts            # write new items
 *   npx tsx scripts/updates/data-updates.ts --dry-run  # print what would be added
 *
 * EIA_API_KEY (free at eia.gov/opendata) raises EIA's rate limit; DEMO_KEY works for a
 * daily run. BLS_API_KEY is optional (the keyless API allows 25 requests a day).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Article, ArticleBlock, CategorySlug, Source } from '../../src/content/types'

export const DATA_FILE = fileURLToPath(new URL('../../src/content/data-updates.json', import.meta.url))

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

export interface Point {
  period: string // YYYY-MM-DD (weekly) or YYYY-MM (monthly)
  value: number
}

async function getJson(url: string, init?: RequestInit, attempts = 3): Promise<unknown> {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(20_000) })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      return await res.json()
    } catch (err) {
      if (i >= attempts) throw new Error(`${url.replace(/api_key=[^&]+/, 'api_key=***')}: ${(err as Error).message}`)
      // EIA's shared DEMO_KEY rate-limits quickly; back off longer before retrying.
      await new Promise((r) => setTimeout(r, (/429/.test((err as Error).message) ? 20_000 : 2000) * i))
    }
  }
}

/** Newest first. `field` is "value" for most series, "price" for electricity retail sales. */
export async function eiaSeries(id: string, length = 60, field = 'value'): Promise<Point[]> {
  const key = process.env.EIA_API_KEY || 'DEMO_KEY'
  const url = `https://api.eia.gov/v2/seriesid/${id}?api_key=${key}&length=${length}&sort[0][column]=period&sort[0][direction]=desc`
  const json = (await getJson(url)) as { response?: { data?: Record<string, unknown>[] } }
  const rows = json.response?.data ?? []
  return rows
    .map((r) => ({ period: String(r.period), value: Number(r[field]) }))
    .filter((p) => p.period && Number.isFinite(p.value))
}

/** Newest first, monthly only (M13 annual averages dropped). */
export async function blsSeries(ids: string[]): Promise<Record<string, Point[]>> {
  const key = process.env.BLS_API_KEY
  const year = new Date().getUTCFullYear()
  const body = { seriesid: ids, startyear: String(year - 2), endyear: String(year), ...(key ? { registrationkey: key } : {}) }
  const url = `https://api.bls.gov/publicAPI/${key ? 'v2' : 'v1'}/timeseries/data/`
  const json = (await getJson(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })) as {
    status: string
    message?: string[]
    Results?: { series: { seriesID: string; data: { year: string; period: string; value: string }[] }[] }
  }
  if (json.status !== 'REQUEST_SUCCEEDED') throw new Error(`BLS: ${json.status} ${json.message?.join(' ')}`)
  const out: Record<string, Point[]> = {}
  for (const s of json.Results?.series ?? []) {
    out[s.seriesID] = s.data
      .filter((d) => /^M(0[1-9]|1[0-2])$/.test(d.period) && d.value !== '-')
      .map((d) => ({ period: `${d.year}-${d.period.slice(1)}`, value: Number(d.value) }))
  }
  return out
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthName = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`
const dayName = (ymd: string) => `${MONTHS[Number(ymd.slice(5, 7)) - 1]} ${Number(ymd.slice(8, 10))}, ${ymd.slice(0, 4)}`
const usd3 = (n: number) => `$${n.toFixed(3)}`
const usd2 = (n: number) => `$${n.toFixed(2)}`
const signed = (n: number, fmt: (x: number) => string) => (n >= 0 ? `+${fmt(n)}` : `-${fmt(-n)}`)
const pct = (now: number, then: number) => ((now / then - 1) * 100)
const pct1 = (n: number) => `${Math.abs(n).toFixed(1)}%`
const upDown = (n: number) => (n > 0 ? 'up' : n < 0 ? 'down' : 'unchanged')
const higherLower = (n: number) => (n > 0 ? 'higher' : 'lower')
const titleCase = (t: string) => t.replace(/\b(?!and\b)[a-z]/g, (c) => c.toUpperCase())
const daysBetween = (a: string, b: string) => Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000)

/** The point closest to 52 weeks before `period` (within 4 days), for weekly series. */
export function yearAgoWeekly(points: Point[], period: string) {
  return points.find((p) => Math.abs(daysBetween(period, p.period) - 364) <= 4)
}
const yearAgoMonthly = (points: Point[], ym: string) => points.find((p) => p.period === `${Number(ym.slice(0, 4)) - 1}${ym.slice(4)}`)

function src(title: string, publisher: string, url: string, accessed: string, note?: string): Source {
  return note ? { title, publisher, url, accessed, note } : { title, publisher, url, accessed }
}

function article(a: Omit<Article, 'kind' | 'authorId' | 'reviewedAt'> & { publishedAt: string }): Article {
  return { ...a, kind: 'update', authorId: 'billix-editorial', reviewedAt: a.publishedAt }
}

/** Readers should know these were generated, not written. */
const howMade = (what: string) => ({
  id: 'how-this-was-made',
  heading: 'How this update was made',
  blocks: [{ type: 'p', text: `Billix publishes this update automatically when ${what}. The numbers come straight from the agency's data service and the wording follows a fixed template, so nothing here is estimated or rewritten.` } as ArticleBlock],
})

const NOT_ADVICE: ArticleBlock = {
  type: 'callout',
  tone: 'note',
  text: 'National averages are a yardstick, not the price you will pay. Your bill depends on your provider, your state and how much you use.',
}

// ---------------------------------------------------------------------------
// Builders: one per kind of release. Each returns null when there is nothing new.
// ---------------------------------------------------------------------------

export const EIA = {
  heatingOil: 'PET.W_EPD2F_PRS_NUS_DPG.W',
  propane: 'PET.W_EPLLPA_PRS_NUS_DPG.W',
  gasoline: 'PET.EMM_EPMR_PTE_NUS_DPG.W',
  electricity: 'ELEC.PRICE.US-RES.M',
  naturalGas: 'NG.N3010US3.M',
} as const

const leaf = (s: string) => `https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=${s}&f=W`

/** Weekly residential heating oil and propane (EIA surveys these October through March). */
export function buildHeatingFuels(oil: Point[], propane: Point[], today: string): Article | null {
  const [o, oPrev] = oil
  const p = propane.find((x) => x.period === o?.period)
  if (!o || !oPrev || !p) return null
  // EIA only surveys heating fuels in season; skip a stale off-season figure.
  if (daysBetween(today, o.period) > 14) return null
  const pPrev = propane.find((x) => x.period === oPrev.period)
  const oYear = yearAgoWeekly(oil, o.period)
  const pYear = yearAgoWeekly(propane, p.period)
  const week = dayName(o.period)
  const oWeek = o.value - oPrev.value

  const lines = [
    `For the week of **${week}**, EIA's survey put the U.S. average residential heating oil price at **${usd3(o.value)} per gallon**, ${upDown(oWeek)} ${usd3(Math.abs(oWeek))} from the week before[^1][^2].`,
    oYear ? `A year earlier, for the week of ${dayName(oYear.period)}, it was ${usd3(oYear.value)}, so heating oil is ${pct1(pct(o.value, oYear.value))} ${higherLower(o.value - oYear.value)} than last year (Billix calculation)[^2].` : null,
    `Residential propane averaged **${usd3(p.value)} per gallon** the same week${pPrev ? `, ${upDown(p.value - pPrev.value)} ${usd3(Math.abs(p.value - pPrev.value))} from the week before` : ''}${pYear ? ` and ${pct1(pct(p.value, pYear.value))} ${higherLower(p.value - pYear.value)} than a year earlier (Billix calculation)` : ''}[^3].`,
    `EIA's residential heating fuel prices exclude taxes and are not adjusted for inflation[^1].`,
  ].filter(Boolean) as string[]

  const rows = [
    ['Heating oil', usd3(o.value), signed(oWeek, usd3), oYear ? signed(o.value - oYear.value, usd3) : 'n/a'],
    ['Propane', usd3(p.value), pPrev ? signed(p.value - pPrev.value, usd3) : 'n/a', pYear ? signed(p.value - pYear.value, usd3) : 'n/a'],
  ]
  return article({
    slug: `heating-fuel-prices-week-of-${o.period}`,
    title: `Heating Oil Averaged ${usd2(o.value)} a Gallon the Week of ${week.replace(/, \d{4}$/, '')}`,
    description: `EIA's weekly survey for the week of ${week}: U.S. residential heating oil at ${usd3(o.value)} a gallon and propane at ${usd3(p.value)}, before taxes.`,
    category: 'heating-cooling',
    publishedAt: today,
    geography: { scope: 'national', label: 'United States' },
    relatedTools: ['heating-comparison'],
    keyTakeaways: [
      `Heating oil: ${usd3(o.value)} per gallon for the week of ${week}, ${upDown(oWeek)} ${usd3(Math.abs(oWeek))} from the week before[^2].`,
      `Propane: ${usd3(p.value)} per gallon the same week[^3].`,
      'Prices are U.S. averages before taxes; what your dealer charges can differ[^1].',
    ],
    sections: [
      { id: 'the-numbers', heading: 'The numbers', blocks: [...lines.map((text): ArticleBlock => ({ type: 'p', text })), { type: 'table', caption: `U.S. residential prices, week of ${week}, dollars per gallon excluding taxes`, headers: ['Fuel', 'Price', 'Change from prior week', 'Change from a year earlier'], rows }] },
      { id: 'what-it-means', heading: 'What it means for your bill', blocks: [NOT_ADVICE, { type: 'p', text: 'Comparing oil, propane, gas or a heat pump? Compare the cost of the same amount of heat, not the price per gallon: see [Leaving oil heat: gas, heat pump or mini-splits?](/learn/leaving-oil-heat-options).' }] },
      howMade('EIA releases its weekly heating oil and propane survey (October through March)'),
    ],
    sources: [
      src('Heating Oil and Propane Update', 'U.S. Energy Information Administration', 'https://www.eia.gov/petroleum/heatingoilpropane/', today),
      src('Weekly U.S. No. 2 Heating Oil Residential Price (W_EPD2F_PRS_NUS_DPG)', 'U.S. Energy Information Administration', leaf('W_EPD2F_PRS_NUS_DPG'), today, `Week of ${week}.`),
      src('Weekly U.S. Propane Residential Price (W_EPLLPA_PRS_NUS_DPG)', 'U.S. Energy Information Administration', leaf('W_EPLLPA_PRS_NUS_DPG'), today, `Week of ${week}.`),
    ],
  })
}

/** Weekly U.S. regular gasoline (EIA, released Mondays). */
export function buildGasoline(gas: Point[], today: string): Article | null {
  const [g, gPrev] = gas
  if (!g || !gPrev) return null
  const gYear = yearAgoWeekly(gas, g.period)
  const week = dayName(g.period)
  const d = g.value - gPrev.value
  return article({
    slug: `gasoline-prices-week-of-${g.period}`,
    title: `Regular Gasoline Averaged ${usd2(g.value)} a Gallon the Week of ${week.replace(/, \d{4}$/, '')}`,
    description: `EIA's weekly survey for the week of ${week}: U.S. regular gasoline at ${usd3(g.value)} a gallon, ${upDown(d)} ${usd3(Math.abs(d))} from the week before.`,
    category: 'transportation',
    publishedAt: today,
    geography: { scope: 'national', label: 'United States' },
    keyTakeaways: [
      `Regular gasoline: ${usd3(g.value)} per gallon for the week of ${week}[^2].`,
      `That is ${upDown(d)} ${usd3(Math.abs(d))} from the week before${gYear ? ` and ${pct1(pct(g.value, gYear.value))} ${higherLower(g.value - gYear.value)} than a year earlier (Billix calculation)` : ''}[^2].`,
    ],
    sections: [
      {
        id: 'the-numbers',
        heading: 'The numbers',
        blocks: [
          { type: 'p', text: `EIA's weekly survey of retail gasoline put the U.S. average price of regular gasoline (all formulations) at **${usd3(g.value)} per gallon** for the week of **${week}**, including taxes[^1][^2].` },
          gYear
            ? { type: 'p', text: `A year earlier, for the week of ${dayName(gYear.period)}, it was ${usd3(gYear.value)}. Prices are not adjusted for inflation[^2].` }
            : { type: 'p', text: 'Prices are not adjusted for inflation[^2].' },
          { type: 'table', caption: `U.S. regular gasoline, dollars per gallon`, headers: ['Week of', 'Price'], rows: gas.slice(0, 5).map((x) => [dayName(x.period), usd3(x.value)]) },
          NOT_ADVICE,
        ],
      },
      howMade('EIA releases its weekly retail gasoline survey'),
    ],
    sources: [
      src('Gasoline and Diesel Fuel Update', 'U.S. Energy Information Administration', 'https://www.eia.gov/petroleum/gasdiesel/', today),
      src('U.S. Regular All Formulations Retail Gasoline Prices (EMM_EPMR_PTE_NUS_DPG)', 'U.S. Energy Information Administration', leaf('EMM_EPMR_PTE_NUS_DPG'), today, `Week of ${week}.`),
    ],
  })
}

/** Monthly average residential electricity and natural gas prices (EIA, about two months' lag). */
export function buildHomeEnergy(elec: Point[], gas: Point[], today: string): Article | null {
  const e = elec[0]
  const g = gas.find((x) => x.period === e?.period)
  if (!e || !g) return null
  const eYear = yearAgoMonthly(elec, e.period)
  const gYear = yearAgoMonthly(gas, g.period)
  const month = monthName(e.period)
  const eChange = eYear ? pct(e.value, eYear.value) : null
  const gChange = gYear ? pct(g.value, gYear.value) : null
  return article({
    slug: `home-energy-prices-${e.period}`,
    title: `Home Electricity Averaged ${e.value.toFixed(2)} Cents a Kilowatt-Hour in ${month}`,
    description: `EIA's latest monthly data: U.S. homes paid an average of ${e.value.toFixed(2)} cents per kWh for electricity and ${usd2(g.value)} per thousand cubic feet for natural gas in ${month}.`,
    category: 'electricity',
    publishedAt: today,
    geography: { scope: 'national', label: 'United States' },
    relatedTools: ['electricity-cost'],
    keyTakeaways: [
      `Electricity: ${e.value.toFixed(2)} cents per kWh in ${month}${eChange !== null ? `, ${pct1(eChange)} ${higherLower(eChange)} than a year earlier (Billix calculation)` : ''}[^1].`,
      `Natural gas: ${usd2(g.value)} per thousand cubic feet in ${month}${gChange !== null ? `, ${pct1(gChange)} ${higherLower(gChange)} than a year earlier (Billix calculation)` : ''}[^2].`,
      'These are national averages across all homes; your rate depends on your utility and state.',
    ],
    sections: [
      {
        id: 'the-numbers',
        heading: 'The numbers',
        blocks: [
          { type: 'p', text: `EIA's data for **${month}** show U.S. residential customers paid an average of **${e.value.toFixed(2)} cents per kilowatt-hour** for electricity${eYear ? `, compared with ${eYear.value.toFixed(2)} cents in ${monthName(eYear.period)}` : ''}[^1].` },
          { type: 'p', text: `Homes paid an average of **${usd2(g.value)} per thousand cubic feet** of natural gas${gYear ? `, compared with ${usd2(gYear.value)} in ${monthName(gYear.period)}` : ''}[^2].` },
          { type: 'table', caption: 'U.S. average residential prices', headers: ['Month', 'Electricity (cents/kWh)', 'Natural gas ($/Mcf)'], rows: elec.slice(0, 4).map((x) => [monthName(x.period), x.value.toFixed(2), gas.find((y) => y.period === x.period) ? usd2(gas.find((y) => y.period === x.period)!.value) : 'n/a']) },
          { type: 'p', text: 'EIA publishes these figures about two months after the month they cover, and recent months can be revised.' },
        ],
      },
      { id: 'what-it-means', heading: 'What it means for your bill', blocks: [NOT_ADVICE, { type: 'p', text: 'To see what your own rate is, divide your bill total by the kWh you used, or try the [electricity cost calculator](/tools/electricity-cost).' }] },
      howMade('EIA publishes new monthly electricity and natural gas prices'),
    ],
    sources: [
      src('Electric Power Monthly, Table 5.6.A: Average Price of Electricity to Ultimate Customers by End-Use Sector', 'U.S. Energy Information Administration', 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_06_a', today, `Data for ${month}.`),
      src('U.S. Price of Natural Gas Delivered to Residential Consumers', 'U.S. Energy Information Administration', 'https://www.eia.gov/dnav/ng/hist/n3010us3m.htm', today, `Data for ${month}.`),
    ],
  })
}

export const CPI = {
  all: { id: 'CUUR0000SA0', label: 'All items (overall inflation)' },
  items: [
    { id: 'CUUR0000SEHF01', label: 'Electricity', short: 'Electricity', category: 'electricity' },
    { id: 'CUUR0000SEHF02', label: 'Utility (piped) gas service', short: 'Natural gas', category: 'heating-cooling' },
    { id: 'CUUR0000SEHG', label: 'Water, sewer and trash collection', short: 'Water and sewer', category: 'water-sewer' },
    { id: 'CUUR0000SEHA', label: 'Rent of primary residence', short: 'Rent', category: 'housing' },
    { id: 'CUUR0000SETE', label: 'Motor vehicle insurance', short: 'Car insurance', category: 'insurance' },
    { id: 'CUUR0000SEEE03', label: 'Internet services', short: 'Internet', category: 'internet-phone' },
  ],
} as const

/** Monthly CPI: how household bill prices moved over the year, vs. overall inflation. */
export function buildCpi(series: Record<string, Point[]>, today: string): Article | null {
  const all = series[CPI.all.id]
  const latest = all?.[0]
  if (!latest) return null
  const allYear = yearAgoMonthly(all, latest.period)
  if (!allYear) return null
  const month = monthName(latest.period)
  const rows = CPI.items.flatMap((item) => {
    const s = series[item.id]
    const now = s?.find((p) => p.period === latest.period)
    const then = s && yearAgoMonthly(s, latest.period)
    return now && then ? [{ ...item, change: pct(now.value, then.value) }] : []
  })
  if (rows.length < 3) return null
  const overall = pct(latest.value, allYear.value)
  const sorted = [...rows].sort((a, b) => b.change - a.change)
  const top = sorted[0]
  const faster = rows.filter((r) => r.change > overall)
  const fmt = (n: number) => `${n >= 0 ? '+' : '-'}${pct1(n)}`
  return article({
    slug: `household-bill-prices-cpi-${latest.period}`,
    title: top.change > 0 ? `${titleCase(top.short)} Prices Led Household Bill Increases in ${month}` : `Household Bill Prices Fell or Held Steady in ${month}`,
    description: `In the Consumer Price Index for ${month}, ${top.short.toLowerCase()} prices were ${pct1(top.change)} ${higherLower(top.change)} than a year earlier, compared with ${pct1(overall)} for all items.`,
    category: top.category as CategorySlug,
    publishedAt: today,
    geography: { scope: 'national', label: 'United States' },
    keyTakeaways: [
      `Overall consumer prices were ${pct1(overall)} ${higherLower(overall)} in ${month} than a year earlier (Billix calculation from BLS index values)[^1][^2].`,
      `${top.label} ${top.change > 0 ? 'rose' : 'changed'} the most of the household bills we track: ${fmt(top.change)}[^2].`,
      faster.length ? `${faster.length} of ${rows.length} bill types rose faster than overall prices[^2].` : `None of the ${rows.length} bill types rose faster than overall prices[^2].`,
    ],
    sections: [
      {
        id: 'the-numbers',
        heading: 'The numbers',
        blocks: [
          { type: 'p', text: `The Bureau of Labor Statistics measures price changes for what households buy in the Consumer Price Index (CPI)[^1]. Comparing ${month} with ${monthName(allYear.period)}, using the U.S. city average indexes that are not seasonally adjusted (Billix calculation)[^2]:` },
          { type: 'table', caption: `Change in prices, ${monthName(allYear.period)} to ${month}`, headers: ['What you pay for', 'Change over 12 months'], rows: [...sorted.map((r) => [r.label, fmt(r.change)]), [CPI.all.label, fmt(overall)]] },
          { type: 'p', text: 'The CPI tracks prices, not bills: what you pay also depends on how much you use and on fees and taxes where you live. Changes are rounded to one decimal place.' },
        ],
      },
      { id: 'what-it-means', heading: 'What it means for your bill', blocks: [NOT_ADVICE, { type: 'p', text: 'To check a bill line by line, start with the [bill guides](/categories).' }] },
      howMade('the Bureau of Labor Statistics releases the monthly Consumer Price Index'),
    ],
    sources: [
      src('Consumer Price Index', 'U.S. Bureau of Labor Statistics', 'https://www.bls.gov/cpi/', today),
      src(`CPI-U U.S. city average series (${[CPI.all.id, ...rows.map((r) => r.id)].join(', ')})`, 'U.S. Bureau of Labor Statistics', `https://data.bls.gov/timeseries/${CPI.all.id}`, today, `Not seasonally adjusted. Data for ${month}.`),
    ],
  })
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

export function readDataUpdates(): Article[] {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8')) as Article[]
  } catch {
    return []
  }
}

/** Collects every builder's latest article; a failing source is logged and skipped. */
export async function collect(today: string): Promise<Article[]> {
  const tasks: [string, () => Promise<Article | null>][] = [
    ['heating fuels', async () => buildHeatingFuels(await eiaSeries(EIA.heatingOil), await eiaSeries(EIA.propane), today)],
    ['gasoline', async () => buildGasoline(await eiaSeries(EIA.gasoline), today)],
    ['home energy', async () => buildHomeEnergy(await eiaSeries(EIA.electricity, 30, 'price'), await eiaSeries(EIA.naturalGas, 30), today)],
    ['cpi', async () => buildCpi(await blsSeries([CPI.all.id, ...CPI.items.map((i) => i.id)]), today)],
  ]
  const out: Article[] = []
  for (const [name, run] of tasks) {
    try {
      const a = await run()
      if (a) out.push(a)
    } catch (err) {
      console.error(`[data-updates] ${name} skipped: ${(err as Error).message}`)
    }
  }
  return out
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const today = new Date().toISOString().slice(0, 10)
  if (!process.env.EIA_API_KEY) console.log('::warning::EIA_API_KEY is not set; EIA\'s shared DEMO_KEY is often rate-limited, so EIA updates may be skipped.')
  const existing = readDataUpdates()
  const known = new Set(existing.map((a) => a.slug))
  const fresh = (await collect(today)).filter((a) => !known.has(a.slug))
  for (const a of fresh) console.log(`[data-updates] new: ${a.slug}`)
  if (!fresh.length) console.log('[data-updates] nothing new today')
  if (!dryRun && fresh.length) writeFileSync(DATA_FILE, JSON.stringify([...fresh, ...existing], null, 2) + '\n')
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
