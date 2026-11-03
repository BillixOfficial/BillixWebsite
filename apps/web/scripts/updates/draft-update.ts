/**
 * Daily drafted update: asks Claude to research one new, national household-bill
 * development from official sources and write it up in the site's article format.
 * The draft is added to src/content/daily-updates.json on a branch; the workflow opens a
 * pull request, and nothing goes live until that pull request is merged.
 *
 *   ANTHROPIC_API_KEY=... npx tsx scripts/updates/draft-update.ts
 *
 * Outputs (for .github/workflows/daily-updates.yml): writes draft-pr-body.md next to the
 * repo root and prints `slug=<slug>` / `title=<title>` to $GITHUB_OUTPUT. Exits 0 with no
 * output when Claude finds nothing worth publishing today.
 */
import Anthropic from '@anthropic-ai/sdk'
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Article, CategorySlug, StateCode } from '../../src/content/types'
import { updates } from '../../src/content/updates'
import { articles as guideArticles } from '../../src/content/articles'
import { categoryIndex } from '../../src/content/category-index'
import { tokenize } from '../../src/lib/inline'

const DAILY_FILE = fileURLToPath(new URL('../../src/content/daily-updates.json', import.meta.url))
const PR_BODY_FILE = fileURLToPath(new URL('../../../../draft-pr-body.md', import.meta.url))
const MODEL = 'claude-opus-5-5'
const MAX_TURNS = 12

const today = new Date().toISOString().slice(0, 10)
const categories = categoryIndex.map((c) => c.slug) as CategorySlug[]
const STATES: StateCode[] = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

const str = { type: 'string' } as const
const strArr = { type: 'array', items: str } as const
const obj = (properties: Record<string, unknown>) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false })

const blockSchema = {
  anyOf: [
    obj({ type: { type: 'string', enum: ['p'] }, text: str }),
    obj({ type: { type: 'string', enum: ['list'] }, items: strArr, ordered: { type: 'boolean' } }),
    obj({ type: { type: 'string', enum: ['table'] }, caption: str, headers: strArr, rows: { type: 'array', items: strArr } }),
  ],
}

const articleSchema = obj({
  slug: { ...str, description: 'kebab-case, unique, e.g. "fcc-ends-xyz-fee-october-2026"' },
  title: { ...str, description: 'Headline in title case, under 90 characters, no clickbait' },
  description: { ...str, description: '1-2 plain sentences for cards and search results; no citation markers' },
  category: { type: 'string', enum: categories },
  geography: obj({
    scope: { type: 'string', enum: ['national', 'multi-state', 'state', 'local'] },
    states: { type: 'array', items: { type: 'string', enum: STATES } },
    label: { ...str, description: 'e.g. "United States" or "Northeast heating-oil states"' },
  }),
  keyTakeaways: { ...strArr, description: '2-4 short sentences, each ending with its [^n] citation' },
  sections: {
    type: 'array',
    items: obj({ id: { ...str, description: 'kebab-case anchor' }, heading: str, blocks: { type: 'array', items: blockSchema } }),
  },
  sources: {
    type: 'array',
    items: obj({
      title: str,
      publisher: str,
      url: { ...str, description: 'https URL of a page you actually opened with web_fetch' },
      note: { ...str, description: 'Data date or release date, e.g. "Released October 14, 2026." Empty string if none.' },
    }),
  },
})

const tools: Anthropic.Beta.BetaToolUnion[] = [
  { type: 'web_search_20260209', name: 'web_search', max_uses: 10 },
  { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 15 },
  {
    name: 'submit_update',
    description: 'Submit the finished update for editor review. Call exactly once, when the article is complete and every claim is cited.',
    strict: true,
    input_schema: obj({ article: articleSchema, why_it_matters: { ...str, description: 'One sentence for the editor: why this is worth publishing today' } }) as Anthropic.Beta.BetaTool.InputSchema,
  },
  {
    name: 'skip_today',
    description: 'Call instead of submit_update when nothing new in the last 7 days meets the bar, or it is already covered.',
    strict: true,
    input_schema: obj({ reason: str }) as Anthropic.Beta.BetaTool.InputSchema,
  },
]

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

const SYSTEM = `You are a researcher and writer for Billix, a nonprofit-style education site that explains the household bills every U.S. home pays: electricity, heating and cooling, water and sewer, internet and phone, housing, insurance, transportation, home services, banking and debt, healthcare and family, subscriptions, and government fees.

Each day you draft at most one short "Bill Update": a dated, sourced news item about something that changed what households pay or how their bills work. An editor reviews every draft before it is published, so accuracy matters far more than speed or output.

What qualifies:
- A development from the last 7 days: a new official data release, a federal rule or rule change, a regulator decision, a utility-commission order affecting many customers, a program opening or closing (for example energy assistance), or a significant new government report.
- National, or regional when it affects several states. A single-state item only when it is large (for example a statewide rate case decided).
- Primary sources: federal agencies (EIA, BLS, FERC, FCC, CFPB, HUD, HHS, EPA, FTC, Treasury, IRS), state utility commissions, state attorneys general, and official program pages. Reputable news can help you find a story, but every factual claim must be cited to a primary source you opened with web_fetch.

What does not qualify: opinion, predictions presented as fact, single-company promotions, anything you cannot confirm on a primary source, Reddit or social posts, and topics already covered by an existing Billix update (the list is in the user message). Weekly EIA fuel prices and the monthly CPI are already published automatically, so do not write about those releases on their own.

How to write:
- Plain English at about an 8th-grade reading level. Short sentences. Explain any term a reader might not know.
- Every sentence that states a fact, number or date ends with a citation marker [^n], where n is the 1-based position of the source in your sources list. Keep numbers exactly as the source gives them and say what date the data covers.
- Inline markup available: **bold**, [label](https://...) links. No emoji, no exclamation marks, no hype, no advice about what an individual should buy or do with their money. Say what changed, who it affects, when, and where to learn more.
- Structure: 2-4 key takeaways; 2-3 sections (for example "What changed", "Who it affects", "What to watch"), each with 1-3 blocks. About 250-450 words in total.
- Only cite URLs you opened with web_fetch and confirmed say what you cite them for.

If nothing meets the bar, call skip_today. A skipped day is a good outcome; a weak or unsourced draft is not.`

function userMessage() {
  const recent = [...updates, ...guideArticles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 60)
    .map((a) => `- ${a.publishedAt} | ${a.kind} | ${a.title}`)
    .join('\n')
  return `Today is ${today}. Find and draft one Bill Update.

Already published on Billix (do not repeat these):
${recent}

When you are done researching, call submit_update or skip_today.`
}

// ---------------------------------------------------------------------------
// Checks on the draft
// ---------------------------------------------------------------------------

type Draft = Omit<Article, 'kind' | 'authorId' | 'publishedAt' | 'reviewedAt' | 'sources'> & {
  sources: { title: string; publisher: string; url: string; note: string }[]
}

function problemsWith(d: Draft): string[] {
  const p: string[] = []
  const slugs = new Set([...updates, ...guideArticles].map((a) => a.slug))
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) p.push(`slug "${d.slug}" is not kebab-case`)
  if (slugs.has(d.slug)) p.push(`slug "${d.slug}" already exists`)
  if (!d.sources.length) p.push('no sources')
  const texts = [d.title, d.description, ...d.keyTakeaways, ...d.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap((b) => (b.type === 'p' ? [b.text] : b.type === 'list' ? b.items : b.type === 'table' ? [...b.headers, ...b.rows.flat()] : []))])]
  if (texts.some((t) => /\p{Extended_Pictographic}/u.test(t))) p.push('contains emoji')
  for (const t of texts) {
    for (const tok of tokenize(t)) {
      if (tok.type === 'cite' && (tok.n < 1 || tok.n > d.sources.length)) p.push(`citation [^${tok.n}] has no source`)
    }
  }
  for (const s of d.sources) if (!/^https:\/\//.test(s.url)) p.push(`non-https source ${s.url}`)
  return p
}

/** Some .gov sites block scripts (403); those are flagged for the editor, not rejected. */
async function checkUrls(urls: string[]) {
  const ua = 'Mozilla/5.0 (compatible; BillixEditorialCheck/1.0; +https://billixapp.com/editorial-standards)'
  return Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { headers: { 'User-Agent': ua }, redirect: 'follow', signal: AbortSignal.timeout(15_000) })
        return { url, status: res.status }
      } catch {
        return { url, status: 0 }
      }
    }),
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function output(key: string, value: string) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value.replace(/\n/g, ' ')}\n`)
}

async function main() {
  const client = new Anthropic()
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: userMessage() }]
  let usage = { input: 0, output: 0 }

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' },
      system: SYSTEM,
      tools,
      // One client tool call per turn, so a correction round-trip answers exactly one call.
      tool_choice: { type: 'auto', disable_parallel_tool_use: true },
      messages,
    })
    const msg = await stream.finalMessage()
    usage = { input: usage.input + msg.usage.input_tokens, output: usage.output + msg.usage.output_tokens }

    if (msg.stop_reason === 'refusal') {
      console.log('[draft-update] the model declined this request; no draft today')
      return
    }
    if (msg.stop_reason === 'pause_turn') {
      // A long server-side search turn paused; send it back to let it continue.
      messages.push({ role: 'assistant', content: msg.content })
      continue
    }

    const call = msg.content.find((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use')
    if (!call) {
      console.log('[draft-update] finished without submitting; no draft today')
      return
    }
    if (call.name === 'skip_today') {
      console.log(`[draft-update] skipped: ${(call.input as { reason: string }).reason}`)
      return
    }

    const { article: d, why_it_matters } = call.input as { article: Draft; why_it_matters: string }
    const problems = problemsWith(d)
    if (problems.length && turn < MAX_TURNS) {
      // Ask for a corrected submission instead of opening a broken pull request.
      messages.push({ role: 'assistant', content: msg.content })
      messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: call.id, is_error: true, content: `Fix these and call submit_update again:\n- ${problems.join('\n- ')}` }] })
      continue
    }
    if (problems.length) throw new Error(`draft still has problems: ${problems.join('; ')}`)

    const article: Article = {
      ...d,
      kind: 'update',
      authorId: 'billix-editorial',
      publishedAt: today,
      reviewedAt: today,
      sources: d.sources.map((s) => (s.note ? { ...s, accessed: today } : { title: s.title, publisher: s.publisher, url: s.url, accessed: today })),
    }
    const existing = JSON.parse(readFileSync(DAILY_FILE, 'utf8')) as Article[]
    writeFileSync(DAILY_FILE, JSON.stringify([article, ...existing], null, 2) + '\n')

    const checks = await checkUrls(article.sources.map((s) => s.url))
    const cost = (usage.input * 4 + usage.output * 20) / 1_000_000
    writeFileSync(
      PR_BODY_FILE,
      [
        `Daily drafted Bill Update for ${today}. **Nothing is published until you merge this.** Close it to discard the draft.`,
        '',
        `### ${article.title}`,
        article.description,
        '',
        `**Why today:** ${why_it_matters}`,
        `**Category:** ${article.category} · **Applies to:** ${article.geography.label}`,
        '',
        '**Key takeaways**',
        ...article.keyTakeaways.map((k) => `- ${k}`),
        '',
        '**Sources** (please open each one and check the numbers)',
        ...article.sources.map((s, i) => {
          const c = checks[i]
          const flag = c.status >= 200 && c.status < 400 ? 'loads' : c.status === 403 ? 'blocks scripts, check in a browser' : `**did not load (${c.status || 'no response'})**`
          return `${i + 1}. [${s.title}](${s.url}), ${s.publisher}${'note' in s && s.note ? `. ${s.note}` : ''} (${flag})`
        }),
        '',
        `After merging, it appears at https://billixapp.com/learn/${article.slug} and in "What changed, and where" on the homepage.`,
        `To edit before publishing, change the entry at the top of \`apps/web/src/content/daily-updates.json\` on this branch.`,
        '',
        `<sub>Drafted by ${MODEL} with web search. Approximate cost: $${cost.toFixed(2)} in tokens plus search fees.</sub>`,
      ].join('\n'),
    )
    output('slug', article.slug)
    output('title', article.title)
    console.log(`[draft-update] drafted ${article.slug}`)
    return
  }
  console.log('[draft-update] ran out of turns; no draft today')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
