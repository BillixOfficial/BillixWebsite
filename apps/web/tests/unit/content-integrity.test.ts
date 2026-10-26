/**
 * Guards the trust rules: every citation points at a real source, every source
 * looks valid, every internal link resolves, and nothing is falsely "available".
 */
import { describe, expect, it } from 'vitest'
import { getAllArticles, getCategories, getGlossary, getVideos, getTools } from '@/lib/content'
import { tokenize } from '@/lib/inline'
import { products } from '@/content/products'
import { states } from '@/content/states'
import { infoPages } from '@/content/pages'
import { legalPages } from '@/content/legal'
import { categoryIndex } from '@/content/category-index'
import { checkoutLive } from '@/lib/shop/stripe'
import type { ArticleBlock, Source } from '@/content/types'

const blockStrings = (b: ArticleBlock): string[] =>
  b.type === 'list' ? b.items : b.type === 'table' ? [...b.headers, ...b.rows.flat()] : [b.text]

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(allStrings)
  if (value && typeof value === 'object') return Object.entries(value).filter(([k]) => k !== 'sources').flatMap(([, v]) => allStrings(v))
  return []
}

const staticRoutes = new Set(['/', '/categories', '/learn', '/videos', '/updates', '/glossary', '/tools', '/tools/electricity-cost', '/compare', '/compare/electricity-plans', '/shop', '/cart', '/account', '/community', '/community/guidelines', '/bill-of-the-month', '/app', '/social', '/states', '/ask-alice', '/newsletter', '/meet-alice', '/contact', '/business', '/search'])
const dynamicRoutes = new Set([
  ...getCategories().map((c) => `/categories/${c.slug}`),
  ...getAllArticles().map((a) => `/learn/${a.slug}`),
  ...getVideos().map((v) => `/videos/${v.slug}`),
  ...states.map((s) => `/states/${s.slug}`),
  ...infoPages.map((p) => `/${p.slug}`),
  ...legalPages.map((p) => `/legal/${p.slug}`),
  ...products.map((p) => `/shop/${p.slug}`),
])
const glossarySlugs = new Set(getGlossary().map((t) => t.slug))

function checkLink(href: string): string | null {
  if (/^(https?:|mailto:)/.test(href)) return null
  if (/\.(png|jpe?g|pdf|svg|webp)$/.test(href)) return null
  const [pathAndQuery, hash] = href.split('#')
  const path = pathAndQuery.split('?')[0] || '/'
  if (!staticRoutes.has(path) && !dynamicRoutes.has(path)) return `unknown route ${href}`
  if (path === '/glossary' && hash && !glossarySlugs.has(hash)) return `unknown glossary term ${href}`
  return null
}

function checkStrings(where: string, strings: string[], sources: Source[] | null) {
  const problems: string[] = []
  for (const s of strings) {
    for (const t of tokenize(s)) {
      if (t.type === 'cite' && (sources === null || t.n < 1 || t.n > sources.length)) problems.push(`${where}: citation [^${t.n}] has no source`)
      if (t.type === 'link') {
        const p = checkLink(t.href)
        if (p) problems.push(`${where}: ${p}`)
      }
    }
  }
  return problems
}

function checkSources(where: string, sources: Source[]) {
  return sources.flatMap((s) => {
    const p: string[] = []
    if (!/^https:\/\//.test(s.url)) p.push(`${where}: non-https source ${s.url}`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.accessed)) p.push(`${where}: bad accessed date on ${s.url}`)
    if (!s.title || !s.publisher) p.push(`${where}: source missing title/publisher`)
    return p
  })
}

describe('content integrity', () => {
  it('has all 12 categories in index order', () => {
    expect(getCategories().map((c) => c.slug)).toEqual(categoryIndex.map((c) => c.slug))
  })

  it('category citations and links resolve', () => {
    const problems = getCategories().flatMap((c) => [...checkStrings(c.slug, allStrings(c), c.sources), ...checkSources(c.slug, c.sources)])
    expect(problems).toEqual([])
  })

  it('article citations and links resolve, and articles have dates and geography', () => {
    const problems = getAllArticles().flatMap((a) => {
      const strings = [...a.keyTakeaways, ...a.sections.flatMap((s) => s.blocks.flatMap(blockStrings))]
      const p = [...checkStrings(a.slug, strings, a.sources), ...checkSources(a.slug, a.sources)]
      if (!/^\d{4}-\d{2}-\d{2}$/.test(a.publishedAt)) p.push(`${a.slug}: bad publishedAt`)
      if (!a.geography.label) p.push(`${a.slug}: missing geography`)
      if (a.relatedVideo && !getVideos().some((v) => v.slug === a.relatedVideo)) p.push(`${a.slug}: unknown video ${a.relatedVideo}`)
      return p
    })
    expect(problems).toEqual([])
  })

  it('has unique slugs', () => {
    const slugs = getAllArticles().map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    const terms = getGlossary().map((t) => t.slug)
    expect(new Set(terms).size).toBe(terms.length)
  })

  it('glossary related terms exist and text has no citations without sources', () => {
    const problems = getGlossary().flatMap((t) => [
      ...(t.related ?? []).filter((r) => !glossarySlugs.has(r)).map((r) => `${t.slug}: unknown related ${r}`),
      ...checkStrings(t.slug, [t.definition, t.example ?? ''], null),
    ])
    expect(problems).toEqual([])
  })

  it('company and legal pages link to real routes', () => {
    const problems = [...infoPages, ...legalPages].flatMap((p) => checkStrings(p.slug, p.sections.flatMap((s) => s.blocks.flatMap(blockStrings)), null))
    expect(problems).toEqual([])
  })

  it('state guides cite real sources and link to https pages', () => {
    const problems = states.filter((s) => s.guide).flatMap((s) => {
      const g = s.guide!
      const where = `state ${s.code}`
      const p = [...checkStrings(where, allStrings(g), g.sources), ...checkSources(where, g.sources)]
      if (g.code !== s.code) p.push(`${where}: guide code ${g.code} does not match`)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(g.lastReviewed)) p.push(`${where}: bad lastReviewed`)
      const urls = [g.regulator.url, g.regulator.complaintUrl, g.electricity.shopping?.url, g.gas.shopping?.url, ...[...g.help, g.consumer, ...g.rebates].map((l) => l.url)]
      for (const u of urls) if (u !== undefined && !/^https:\/\//.test(u)) p.push(`${where}: non-https link ${u}`)
      if (g.help.length === 0) p.push(`${where}: no bill-help programs`)
      const cited = new Set(allStrings(g).flatMap((t) => tokenize(t)).flatMap((t) => (t.type === 'cite' ? [t.n] : [])))
      g.sources.forEach((src, i) => { if (!cited.has(i + 1)) p.push(`${where}: source ${i + 1} is never cited (${src.url})`) })
      return p
    })
    expect(problems).toEqual([])
  })

  it('contains no emoji', () => {
    const emoji = /\p{Extended_Pictographic}/u
    const offenders = [...allStrings(getCategories()), ...allStrings(getAllArticles()), ...allStrings(getGlossary()), ...allStrings(getVideos()), ...allStrings(states.map((s) => s.guide))].filter((s) => emoji.test(s))
    expect(offenders).toEqual([])
  })

  it('never marks unbuilt features as available', () => {
    expect(products.every((p) => p.status !== 'published')).toBe(true)
    const key = process.env.STRIPE_SECRET_KEY
    delete process.env.STRIPE_SECRET_KEY
    expect(checkoutLive()).toBe(false) // checkout opens only when a Stripe key is configured
    if (key !== undefined) process.env.STRIPE_SECRET_KEY = key
    for (const t of getTools().filter((x) => x.status === 'available')) expect(t.href).toMatch(/^\/tools\//)
  })
})
