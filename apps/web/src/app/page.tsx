import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Bell, Calculator, MessageCircle, Play, ScanLine } from 'lucide-react'
import { getCategories, getGlossary, getUpdates, getVideos } from '@/lib/content'
import { toPlainText } from '@/lib/inline'
import { products } from '@/content/products'
import { categoryMeta } from '@/content/category-index'
import { appStores, features } from '@/config/site'
import { AliceAvatar, AliceFace } from '@/components/brand/alice'
import { PhoneMock } from '@/components/brand/mockups'
import { BillDecoder } from '@/components/home/bill-decoder'
import { CategoryExplorer } from '@/components/home/category-explorer'
import { BillQuiz } from '@/components/home/bill-quiz'
import { QuickEstimate } from '@/components/home/quick-estimate'
import { SearchBox } from '@/components/content/search-box'
import { ProductCard } from '@/components/shop/product-ui'
import { NewsletterForm } from '@/components/forms/newsletter-form'
import { WaitlistForm } from '@/components/forms/waitlist-form'
import { Reveal } from '@/components/ui/reveal'
import { SocialCards } from '@/components/brand/social-links'
import { formatDate } from '@/components/ui/primitives'

function Heading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(2rem,4.2vw,3.2rem)] font-extrabold leading-[1.02] text-teal-deep">{children}</h2>
      </div>
      {action}
    </div>
  )
}

const more = (href: string, label: string) => (
  <Link href={href} className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-teal-ink">
    {label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
  </Link>
)

export default function HomePage() {
  const explorer = getCategories().map((c) => ({
    slug: c.slug,
    shortName: categoryMeta(c.slug).shortName,
    tagline: toPlainText(c.tagline),
    charges: c.commonCharges.slice(0, 5).map((x) => x.name),
    whyRise: c.whyCostsRise.slice(0, 3).map((x) => toPlainText(x.title)),
    faq: c.faqs[0]?.q,
  }))
  const ticker = getGlossary().slice(0, 28)
  const videos = getVideos()
  const feature = videos.find((v) => v.slug === 'electric-bill-line-by-line')!
  const rail = videos.filter((v) => v.slug !== feature.slug && v.category !== 'channel')
  const updates = getUpdates().slice(0, 3)
  const shopPicks = ['household-utility-savings-handbook', 'monthly-bill-tracker', 'classic-tee', 'ceramic-mug'].map((s) => products.find((p) => p.slug === s)!).filter(Boolean)

  return (
    <>
      {/* Hero: interactive bill */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-x grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_29rem] lg:gap-16 lg:py-20">
          <div className="animate-rise">
            <h1 className="text-[clamp(2.9rem,7.2vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-teal-deep">
              Your bills shouldn&rsquo;t be a <span className="mark whitespace-nowrap text-teal-night">mystery.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">Understand what you&rsquo;re paying, discover your options, and make smarter decisions about everyday expenses. Free, sourced and in plain English.</p>
            <SearchBox size="md" className="mt-8 max-w-xl" />
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/categories" className="group inline-flex items-center gap-2 rounded-full bg-teal-deep px-6 py-3.5 font-semibold text-cream transition hover:bg-teal-night">Explore your bills <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
              <Link href="/tools" className="font-semibold text-teal-deep underline decoration-gold decoration-2 underline-offset-4 hover:decoration-4">Try the free tools</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <BillDecoder />
          </div>
        </div>
      </section>

      {/* Bill of the Month promo */}
      <section aria-labelledby="botm-h" className="border-b border-line bg-highlight">
        <div className="container-x flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="botm-h" className="text-2xl font-extrabold leading-tight text-teal-night sm:text-3xl">Bill of the Month: $50 toward a bill, every round.</h2>
            <p className="mt-1 text-teal-night/80">Free to enter. No bill needed. One random winner each round.</p>
          </div>
          <Link href="/bill-of-the-month" className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-teal-night px-6 py-3.5 font-semibold text-cream transition hover:bg-teal-deep">Enter now <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
        </div>
      </section>

      {/* Ticker of bill terms */}
      <div className="group overflow-hidden border-b border-line bg-paper py-3" aria-label="Billing terms from the glossary">
        <ul className="flex w-max animate-[marquee_60s_linear_infinite] gap-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...ticker, ...ticker].map((t, i) => (
            <li key={i} aria-hidden={i >= ticker.length}>
              <Link href={`/glossary#${t.slug}`} tabIndex={i >= ticker.length ? -1 : undefined} className="block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold text-teal-deep ring-1 ring-line transition hover:bg-highlight hover:ring-highlight">
                {t.term}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Explore categories */}
      <section className="container-x py-20 sm:py-24">
        <Reveal><Heading action={more('/categories', 'All bill guides')}>Pick a bill. See what&rsquo;s really in it.</Heading></Reveal>
        <Reveal className="mt-10"><CategoryExplorer categories={explorer} /></Reveal>
      </section>

      {/* Quiz + quick estimate */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="container-x space-y-16">
          <Reveal><BillQuiz /></Reveal>
          <div>
            <Reveal><Heading action={more('/tools', 'All tools')}>What would your electric bill be?</Heading></Reveal>
            <Reveal className="mt-10"><QuickEstimate /></Reveal>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="container-x py-20 sm:py-24">
        <Reveal><Heading action={more('/videos', 'Video library')}>Bills explained in a few minutes</Heading></Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <Link href={`/videos/${feature.slug}`} className="group block overflow-hidden rounded-[var(--radius-panel)] bg-teal-night">
              <div className="relative aspect-video">
                <Image src={feature.thumbnail} alt="" fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 grid place-items-center"><span className="grid size-20 place-items-center rounded-full bg-gold text-teal-night shadow-2xl transition group-hover:scale-110"><Play className="ml-1 size-8" fill="currentColor" aria-hidden /></span></span>
              </div>
              <div className="flex items-center justify-between gap-4 p-5 text-cream">
                <p className="font-display text-xl font-bold leading-snug">{feature.title}</p>
                <span className="shrink-0 rounded-md bg-cream/10 px-2 py-1 text-sm">{feature.duration}</span>
              </div>
            </Link>
          </Reveal>
          <ul className="grid gap-3">
            {rail.slice(0, 4).map((v, i) => (
              <Reveal as="li" key={v.slug} delay={i * 60}>
                <Link href={`/videos/${v.slug}`} className="group flex items-center gap-4 rounded-2xl bg-paper p-2.5 pr-4 ring-1 ring-line transition hover:ring-teal/40">
                  <span className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-xl bg-teal-night">
                    <Image src={v.thumbnail} alt="" fill sizes="144px" className="object-cover object-top transition group-hover:scale-105" />
                  </span>
                  <span>
                    <span className="text-xs font-bold text-teal-ink">{v.kind === 'short' ? 'Short' : 'Video'} · {v.duration}</span>
                    <span className="mt-0.5 block font-display font-bold leading-snug text-teal-deep">{v.title}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
        {!videos.some((v) => v.youtubeId) && <p className="mt-4 text-sm text-muted">New videos premiere on YouTube soon and will play right here.</p>}
      </section>

      {/* Updates: editorial list */}
      <section className="border-y border-line bg-paper py-20 sm:py-24">
        <div className="container-x">
          <Reveal><Heading action={more('/updates', 'All updates')}>What changed, and where</Heading></Reveal>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {updates.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={i * 80}>
                <Link href={`/learn/${a.slug}`} className="group grid gap-3 py-7 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-8">
                  <time dateTime={a.publishedAt} className="font-mono text-sm font-bold text-teal-ink">{formatDate(a.publishedAt)}</time>
                  <span>
                    <span className="block font-display text-[clamp(1.25rem,2.2vw,1.65rem)] font-bold leading-snug text-teal-deep group-hover:underline group-hover:decoration-gold group-hover:decoration-[3px] group-hover:underline-offset-4">{a.title}</span>
                    <span className="mt-1.5 block text-muted">{a.description}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm text-muted sm:flex-col sm:items-end">
                    <span className="rounded-full bg-mist px-3 py-1 font-semibold text-teal-deep">{a.geography.label}</span>
                    <ArrowUpRight className="hidden size-6 text-teal-deep/40 transition group-hover:text-teal sm:block" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Shop */}
      <section className="container-x py-20 sm:py-24">
        <Reveal><Heading action={more('/shop', 'Shop all')}>Guides, planners and good gear</Heading></Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
          {shopPicks.map((p, i) => <Reveal key={p.slug} delay={i * 70}><ProductCard p={p} /></Reveal>)}
        </div>
      </section>

      {/* App + newsletter */}
      <section className="container-x pb-20 sm:pb-24">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Reveal className="relative overflow-hidden rounded-[var(--radius-panel)] bg-teal-deep p-8 text-cream sm:p-10">
            <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-bold text-gold">The Billix app{features.appLaunched ? '' : ' · coming soon'}</p>
                <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-[1.05]">Every household bill, one calm screen.</h2>
                <ul className="mt-6 grid gap-2.5 text-cream/85">
                  {[{ I: Bell, t: 'Due-date reminders' }, { I: ScanLine, t: 'Scan a bill to understand it' }, { I: MessageCircle, t: 'Ask Alice' }, { I: Calculator, t: 'Calculators on the go' }].map(({ I, t }) => (
                    <li key={t} className="flex items-center gap-2.5"><I className="size-4.5 text-gold" aria-hidden />{t}</li>
                  ))}
                </ul>
                <div className="mt-7 max-w-md">
                  {features.appLaunched ? (
                    <div className="flex gap-3">{appStores.ios && <Link href={appStores.ios} className="rounded-full bg-gold px-5 py-3 font-semibold text-teal-night">App Store</Link>}{appStores.android && <Link href={appStores.android} className="rounded-full bg-gold px-5 py-3 font-semibold text-teal-night">Google Play</Link>}</div>
                  ) : (
                    <WaitlistForm list="app" dark />
                  )}
                </div>
              </div>
              <PhoneMock className="mx-auto hidden rotate-[4deg] sm:block" />
            </div>
          </Reveal>
          <Reveal delay={100} className="flex flex-col rounded-[var(--radius-panel)] bg-gold-soft p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <AliceAvatar size={56} mood="wink" />
              <p className="font-display text-xl font-extrabold text-teal-deep">The Billix Brief</p>
            </div>
            <h2 className="mt-5 text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold leading-[1.05] text-teal-deep">Smarter bills, delivered to your inbox.</h2>
            <p className="mb-6 mt-3 text-teal-deep/80">One short, sourced email about the bills you pay. No spam.</p>
            <div className="mt-auto"><NewsletterForm source="home" /></div>
          </Reveal>
        </div>
      </section>

      {/* Social */}
      <section className="container-x pb-20 sm:pb-24">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[clamp(2rem,4.2vw,3.2rem)] font-extrabold leading-[1.02] text-teal-deep">Follow Alice for new bill tips</h2>
            {more('/social', 'Social hub')}
          </div>
        </Reveal>
        <Reveal className="mt-8"><SocialCards /></Reveal>
      </section>

      {/* Trust */}
      <section className="border-t border-line bg-mist py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          <AliceFace mood="relieved" size={150} />
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold text-teal-deep sm:text-3xl">Education first. Every fact sourced.</h2>
            <p className="mt-3 text-muted">We cite government agencies, regulators and research, date every guide, and never invent rates, rebates or savings. Spot a mistake? <Link href="/contact?topic=correction" className="font-semibold text-teal-ink underline">Tell us</Link>.</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <Link href="/editorial-standards" className="text-teal-ink hover:underline">Editorial standards</Link>
              <Link href="/about" className="text-teal-ink hover:underline">About Billix</Link>
              <Link href="/meet-alice" className="text-teal-ink hover:underline">Meet Alice</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
