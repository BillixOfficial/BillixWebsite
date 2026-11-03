import { describe, expect, it } from 'vitest'
import { buildCpi, buildGasoline, buildHeatingFuels, buildHomeEnergy, CPI, yearAgoWeekly, type Point } from '../../scripts/updates/data-updates'
import { tokenize } from '@/lib/inline'
import type { Article } from '@/content/types'

const TODAY = '2026-10-16'

// Values as EIA and BLS reported them in October 2026.
const oil: Point[] = [
  { period: '2026-10-12', value: 6.138 },
  { period: '2026-10-05', value: 6.042 },
  { period: '2025-10-13', value: 3.6 },
]
const propane: Point[] = [
  { period: '2026-10-12', value: 2.638 },
  { period: '2026-10-05', value: 2.586 },
]
const gasoline: Point[] = [
  { period: '2026-10-12', value: 4.331 },
  { period: '2026-10-05', value: 4.354 },
]

function text(a: Article) {
  return [a.title, a.description, ...a.keyTakeaways, ...a.sections.flatMap((s) => s.blocks.flatMap((b) => (b.type === 'list' ? b.items : b.type === 'table' ? [...b.headers, ...b.rows.flat()] : [b.text])))].join('\n')
}
function citationsResolve(a: Article) {
  return a.keyTakeaways.concat(a.sections.flatMap((s) => s.blocks.flatMap((b) => (b.type === 'p' || b.type === 'callout' ? [b.text] : [])))).every((t) =>
    tokenize(t).every((tok) => tok.type !== 'cite' || (tok.n >= 1 && tok.n <= a.sources.length)),
  )
}

describe('data updates', () => {
  it('writes the weekly heating-fuel update from EIA numbers', () => {
    const a = buildHeatingFuels(oil, propane, TODAY)!
    expect(a.slug).toBe('heating-fuel-prices-week-of-2026-10-12')
    expect(a.title).toBe('Heating Oil Averaged $6.14 a Gallon the Week of October 12')
    expect(text(a)).toContain('**$6.138 per gallon**, up $0.096 from the week before')
    expect(text(a)).toContain('70.5% higher than last year')
    expect(a.publishedAt).toBe(TODAY)
    expect(citationsResolve(a)).toBe(true)
  })

  it('skips heating fuels out of season and when propane lags a week', () => {
    expect(buildHeatingFuels(oil, propane, '2027-05-01')).toBeNull()
    expect(buildHeatingFuels(oil, propane.slice(1), TODAY)).toBeNull()
  })

  it('writes the weekly gasoline update, saying when prices fell', () => {
    const a = buildGasoline(gasoline, TODAY)!
    expect(a.slug).toBe('gasoline-prices-week-of-2026-10-12')
    expect(a.description).toContain('down $0.023 from the week before')
    expect(citationsResolve(a)).toBe(true)
  })

  it('waits until electricity and gas both have the same month', () => {
    expect(buildHomeEnergy([{ period: '2026-08', value: 18.5 }], [{ period: '2026-07', value: 26.45 }], TODAY)).toBeNull()
    const a = buildHomeEnergy([{ period: '2026-07', value: 18.31 }, { period: '2025-07', value: 17.62 }], [{ period: '2026-07', value: 26.45 }], TODAY)!
    expect(a.title).toBe('Home Electricity Averaged 18.31 Cents a Kilowatt-Hour in July 2026')
    expect(a.keyTakeaways[0]).toContain('3.9% higher than a year earlier')
  })

  it('compares each bill in the CPI with overall inflation', () => {
    const s = (now: number, then: number): Point[] => [{ period: '2026-09', value: now }, { period: '2025-09', value: then }]
    const a = buildCpi(
      {
        [CPI.all.id]: s(336.94, 324.8),
        CUUR0000SEHF01: s(309.852, 296.887),
        CUUR0000SEHF02: s(264.25, 251.728),
        CUUR0000SEHG: s(335.364, 319.867),
        CUUR0000SETE: s(846.102, 890.473),
      },
      TODAY,
    )!
    expect(a.title).toBe('Natural Gas Prices Led Household Bill Increases in September 2026')
    expect(a.category).toBe('heating-cooling')
    expect(a.keyTakeaways[0]).toContain('3.7% higher in September 2026')
    expect(a.sections[0].blocks[1]).toMatchObject({ type: 'table', rows: expect.arrayContaining([['Motor vehicle insurance', '-5.0%']]) })
    expect(citationsResolve(a)).toBe(true)
  })

  it('finds the same week a year earlier', () => {
    expect(yearAgoWeekly(oil, '2026-10-12')?.period).toBe('2025-10-13')
  })

  it('never writes emoji or exclamation marks', () => {
    const all = [buildHeatingFuels(oil, propane, TODAY)!, buildGasoline(gasoline, TODAY)!].map(text).join('\n')
    expect(/\p{Extended_Pictographic}|!/u.test(all)).toBe(false)
  })
})
