import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Check, Download, ShieldCheck, Truck } from 'lucide-react'
import { collections, formatPrice, visibleProducts } from '@/content/products'
import { productImages } from '@/content/product-images'
import { ProductCard } from '@/components/shop/product-ui'
import { CollectionNav, ShopNotice } from '@/components/shop/shop-chrome'
import { AliceFace } from '@/components/brand/alice'
import { Reveal } from '@/components/ui/reveal'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'The Billix Household Utility Savings Handbook, printable bill trackers and planners, apparel, mugs and gifts for people who like knowing where their money goes.',
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  const featured = visibleProducts.filter((p) => p.featured)
  const handbook = visibleProducts.find((p) => p.slug === 'household-utility-savings-handbook')
  const heroImg = productImages['household-utility-savings-handbook']?.[1] ?? productImages['classic-tee']?.[1]
  return (
    <>
      <ShopNotice />
      <section className="container-x pt-10 sm:pt-14">
        <div className="grid overflow-hidden rounded-[var(--radius-panel)] bg-teal-deep text-cream lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-tight">Good things for people who <span className="mark text-teal-night">read their bills</span>.</h1>
            <p className="mt-5 max-w-md text-lg text-cream/80">Plain-English guides, printable trackers and Billix gear. Every purchase helps us keep the guides free.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#all" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-teal-night hover:bg-highlight">Shop everything <ArrowRight className="size-4" aria-hidden /></Link>
              <Link href="/shop/household-utility-savings-handbook" className="rounded-full px-6 py-3 font-semibold ring-1 ring-cream/30 hover:bg-cream/10">The handbook</Link>
            </div>
          </div>
          <div className="relative min-h-72 bg-teal-night/40">
            {heroImg ? (
              <Image src={heroImg} alt="Pages from The Billix Household Utility Savings Handbook" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div className="grid h-full place-items-center"><AliceFace mood="shopping" size={260} /></div>
            )}
          </div>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          {[
            { I: Download, t: 'Free printables from the handbook' },
            { I: BookOpen, t: 'Written by the Billix team' },
            { I: Truck, t: 'U.S. shipping on physical items' },
            { I: ShieldCheck, t: 'Facts checked and dated' },
          ].map(({ I, t }) => (
            <li key={t} className="flex items-center gap-2.5 rounded-xl bg-paper px-4 py-3 ring-1 ring-line"><I className="size-5 shrink-0 text-teal" aria-hidden /><span className="font-medium text-teal-deep">{t}</span></li>
          ))}
        </ul>
      </section>

      {handbook && (
        <section className="container-x pt-14" aria-labelledby="handbook">
          <div className="grid items-center gap-10 overflow-hidden rounded-[var(--radius-panel)] bg-paper p-6 ring-1 ring-line sm:p-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-14">
            <Link href={`/shop/${handbook.slug}`} className="relative mx-auto block aspect-square w-full max-w-md overflow-hidden rounded-2xl">
              <Image src={productImages[handbook.slug]![0]} alt="Cover of The Billix Household Utility Savings Handbook, 2026 edition" fill sizes="(min-width: 1024px) 26rem, 90vw" className="object-cover" />
            </Link>
            <div>
              <p className="font-semibold text-teal-ink">New for 2026 &middot; PDF ebook</p>
              <h2 id="handbook" className="mt-2 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.02] tracking-tight text-teal-deep">The Billix Household Utility <span className="mark text-teal-night">Savings</span> Handbook</h2>
              <p className="mt-4 font-display text-xl text-ink">Understand every bill. Cut what you can. Prove what you save.</p>
              <p className="mt-4 max-w-xl text-muted">{handbook.description}</p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {(handbook.details ?? []).slice(0, 4).map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[0.97rem] text-teal-deep"><Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />{d}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={`/shop/${handbook.slug}`} className="inline-flex items-center gap-2 rounded-full bg-teal-deep px-6 py-3 font-semibold text-cream transition hover:bg-teal-night">See what&rsquo;s inside <ArrowRight className="size-4" aria-hidden /></Link>
                <p className="font-display text-2xl font-bold text-teal-deep">{formatPrice(handbook.priceCents)}</p>
              </div>
              <p className="mt-3 text-sm text-muted">Coming soon. Checkout opens at launch, and nothing is charged until then.</p>
            </div>
          </div>
        </section>
      )}

      <section className="container-x py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold text-teal-deep sm:text-4xl">Start here</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
          {featured.slice(0, 8).map((p, i) => <Reveal key={p.slug} delay={(i % 4) * 70}><ProductCard p={p} priority={i < 4} /></Reveal>)}
        </div>
      </section>

      <section id="all" className="scroll-mt-24 border-t border-line bg-mist py-14">
        <div className="container-x">
          <CollectionNav />
          {collections.map((c) => {
            const items = visibleProducts.filter((p) => p.collection === c.slug)
            if (!items.length) return null
            return (
              <section key={c.slug} className="mt-14" aria-labelledby={`col-${c.slug}`}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 id={`col-${c.slug}`} className="text-2xl font-extrabold text-teal-deep sm:text-3xl">{c.name}</h2>
                    <p className="mt-1 text-muted">{c.description}</p>
                  </div>
                  <Link href={`/shop/collections/${c.slug}`} className="shrink-0 font-semibold text-teal-ink hover:underline">See all {items.length}</Link>
                </div>
                <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
                  {items.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}
                </div>
              </section>
            )
          })}
        </div>
      </section>
    </>
  )
}
