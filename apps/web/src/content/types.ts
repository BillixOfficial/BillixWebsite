/**
 * Billix content schema.
 *
 * Phase 1 keeps editorial content as typed data in this folder (a file-based CMS).
 * Pages read it only through `src/lib/content.ts`, so the storage can move to the
 * API/database later without touching page components.
 *
 * Inline text in `string` fields supports a tiny markup:
 *   **bold**            -> <strong>
 *   [label](/path)      -> link (internal paths or https URLs)
 *   [^2]                -> citation marker linking to sources[1] (1-based)
 */

export type ISODate = string // "YYYY-MM-DD"

export type CategorySlug =
  | 'electricity'
  | 'heating-cooling'
  | 'water-sewer'
  | 'internet-phone'
  | 'housing'
  | 'insurance'
  | 'transportation'
  | 'home-services'
  | 'banking-debt'
  | 'healthcare-family'
  | 'subscriptions'
  | 'government-fees'

export type StateCode =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'DC' | 'FL' | 'GA' | 'HI' | 'ID'
  | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO'
  | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA'
  | 'RI' | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY'

/** A citation. Every URL must be a real, verified page from the named publisher. */
export interface Source {
  title: string
  publisher: string
  url: string
  /** Date the page was checked, YYYY-MM-DD. */
  accessed: ISODate
  note?: string
}

/** Where a piece of information applies. */
export interface Geography {
  scope: 'national' | 'multi-state' | 'state' | 'local'
  states?: StateCode[]
  /** Human label, e.g. "United States", "Northeast heating-oil states". */
  label: string
}

export interface TitledText {
  title: string
  body: string
}

export interface Faq {
  q: string
  a: string
}

export type ToolSlug =
  | 'electricity-cost'
  | 'appliance-cost'
  | 'ac-cost'
  | 'ev-charging'
  | 'solar-payback'
  | 'heating-comparison'
  | 'heat-pump-cost'
  | 'water-usage'
  | 'water-bill'
  | 'leak-cost'
  | 'mortgage'
  | 'property-tax'
  | 'rent-vs-buy'
  | 'internet-plans'
  | 'subscription-tracker'
  | 'car-loan'
  | 'credit-card-interest'
  | 'household-planner'

export interface BillCategory {
  slug: CategorySlug
  name: string
  /** Short label for cards/nav, e.g. "Water & Sewer". */
  shortName: string
  /** One sentence for cards. */
  tagline: string
  /** 1. Category introduction (1–3 paragraphs). */
  intro: string[]
  /** 2. How the bill works. */
  howItWorks: { summary: string; points: TitledText[] }
  /** 3. Common charges and fees seen on this kind of bill. */
  commonCharges: { name: string; description: string }[]
  /** 4. Why costs increase. */
  whyCostsRise: TitledText[]
  /** 5. How to understand the bill: step-by-step reading guide. */
  readingYourBill: TitledText[]
  /** 6. Practical ways to review expenses (education, not advice). */
  reviewTips: TitledText[]
  /** 7. Relevant calculators. */
  relatedTools: ToolSlug[]
  /** 8. Cost comparisons: what is worth comparing and how. No made-up prices. */
  comparisons: TitledText[]
  /** 11. FAQ. */
  faqs: Faq[]
  /** 12. What varies by state and who oversees it. */
  stateNotes: { summary: string; whoRegulates: string }
  sources: Source[]
  lastReviewed: ISODate
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'callout'; tone: 'tip' | 'note' | 'warning'; title?: string; text: string }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }

export interface ArticleSection {
  /** Anchor id, kebab-case. */
  id: string
  heading: string
  blocks: ArticleBlock[]
}

export type AlicePose =
  | 'presenting'
  | 'holding-bill'
  | 'holding-calculator'
  | 'holding-magnifier'
  | 'holding-phone'
  | 'point-up'
  | 'thinking'
  | 'counting'
  | 'celebrating'
  | 'showing-bill'

export interface Article {
  slug: string
  title: string
  /** 1–2 sentence summary used for cards and meta description. */
  description: string
  category: CategorySlug
  /** 'update' items appear in "Latest Bill Updates". */
  kind: 'guide' | 'explainer' | 'update'
  authorId: 'billix-editorial'
  publishedAt: ISODate
  reviewedAt: ISODate
  geography: Geography
  keyTakeaways: string[]
  sections: ArticleSection[]
  sources: Source[]
  alicePose?: AlicePose
  /** Slug of a related video in content/videos.ts. */
  relatedVideo?: string
  relatedTools?: ToolSlug[]
}

export interface GlossaryTerm {
  slug: string
  term: string
  /** Optional expansion, e.g. "kilowatt-hour". */
  aka?: string
  definition: string
  /** Optional worked example in plain language. */
  example?: string
  categories: CategorySlug[]
  related?: string[]
}

export interface Video {
  slug: string
  title: string
  description: string
  kind: 'video' | 'short'
  /** null until the video is public on YouTube. Set via content once published. */
  youtubeId: string | null
  /** When the video went public on YouTube (ISO 8601). Used for VideoObject structured data. */
  uploadedAt?: string
  duration: string
  category: CategorySlug | 'channel'
  thumbnail: string
  chapters?: { time: string; label: string }[]
  /** Plain-text transcript when available. */
  transcript?: string
  sources: Source[]
  relatedArticles?: string[]
  relatedTools?: ToolSlug[]
}

export type ProductStatus = 'draft' | 'coming_soon' | 'published'

export type ShopCollection =
  | 'books'
  | 'digital'
  | 'workbooks'
  | 'apparel'
  | 'accessories'
  | 'bundles'

export interface Product {
  slug: string
  name: string
  collection: ShopCollection
  /** Proposed price in US cents; 0 = free. Configurable, not final. */
  priceCents: number
  format: 'paperback' | 'hardcover' | 'ebook' | 'digital-download' | 'apparel' | 'accessory' | 'bundle'
  status: ProductStatus
  description: string
  categories?: CategorySlug[]
  /** Phase 1 launch priority items. */
  featured?: boolean
  /** Selectable options, e.g. Size or Color. */
  variants?: { name: string; options: string[] }[]
  /** Short selling points shown on the product page. */
  details?: string[]
  /** Chapter list for a book, shown under "What's inside". */
  inside?: string[]
  /** Label and value pairs for a book's specifications. */
  specs?: { label: string; value: string }[]
  /** A free file the visitor can download now, without checkout. */
  downloadUrl?: string
}

/** A named official resource on a state guide. `summary` may use inline markup and citations. */
export interface StateLink {
  name: string
  url: string
  summary: string
}

/**
 * A researched state guide. Every text field uses Billix inline markup, and every
 * factual claim cites `sources` with [^n]. Leave a section out (null / empty) rather
 * than guess; the page says so plainly.
 */
export interface StateGuide {
  code: StateCode
  lastReviewed: ISODate
  /** One or two sentences: the big picture for household bills in this state. */
  intro: string
  /** The state utility commission: what it oversees and how to complain. */
  regulator: { name: string; url: string; complaintUrl: string; text: string }
  /** Regulated (one utility sets the price), choice (you can pick a supplier statewide) or partial (some areas / some customers). */
  electricity: { market: 'regulated' | 'choice' | 'partial'; text: string; shopping: { name: string; url: string } | null }
  gas: { text: string; shopping: { name: string; url: string } | null }
  water: { text: string }
  /** Disconnection protections: winter/summer rules, medical certificates, notice periods. */
  shutoff: { text: string }
  /** Bill-payment help. The first entry is the state's LIHEAP office. */
  help: StateLink[]
  /** State consumer protection office, usually the attorney general. */
  consumer: StateLink
  /** Efficiency and rebate programs run or listed by the state. May be empty. */
  rebates: StateLink[]
  sources: Source[]
}
