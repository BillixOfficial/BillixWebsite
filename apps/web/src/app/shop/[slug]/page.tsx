import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Download, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { collections, formatPrice, visibleProducts } from '@/content/products'
import { productImages } from '@/content/product-images'
import { siteUrl } from '@/config/site'
import { AddToBag, ProductCard, ProductOptionsProvider, ProductGallery } from '@/components/shop/product-ui'
import { ShopNotice } from '@/components/shop/shop-chrome'
import { checkoutLive } from '@/lib/shop/stripe'
import { finalSaleNote, madeToOrderNote, shippingNote } from '@/lib/shop/terms'

export function generateStaticParams() {
  return visibleProducts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/shop/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const p = visibleProducts.find((x) => x.slug === slug)
  if (!p) return {}
  const img = productImages[p.slug]?.[0]
  return { title: `${p.name} | Shop`, description: p.description, alternates: { canonical: `/shop/${p.slug}` }, openGraph: img ? { images: [img] } : undefined }
}

const formatLabel = { paperback: 'Paperback', ebook: 'Ebook (PDF)', 'digital-download': 'Printable PDF', apparel: 'Apparel', accessory: 'Accessory', bundle: 'Bundle' } as const

export default async function ProductPage({ params }: PageProps<'/shop/[slug]'>) {
  const { slug } = await params
  const p = visibleProducts.find((x) => x.slug === slug)
  if (!p) notFound()
  const col = collections.find((c) => c.slug === p.collection)!
  const related = visibleProducts.filter((x) => x.collection === p.collection && x.slug !== p.slug).slice(0, 4)
  const digital = p.format === 'ebook' || p.format === 'digital-download'

  // Product JSON-LD without availability or offers until checkout is live.
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description, brand: { '@type': 'Brand', name: 'Billix' }, image: (productImages[p.slug] ?? []).map((i) => siteUrl(i)) }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ShopNotice />
      <div className="container-x py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/shop" className="hover:underline">Shop</Link> <span aria-hidden>/</span> <Link href={`/shop/collections/${col.slug}`} className="hover:underline">{col.name}</Link>
        </nav>
        <ProductOptionsProvider p={p}>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ProductGallery p={p} />
          <div className="lg:pt-4">
            <p className="text-sm font-semibold text-teal-ink">{formatLabel[p.format]}</p>
            <h1 className="mt-2 text-[clamp(2rem,4vw,2.9rem)] font-extrabold leading-[1.05] text-teal-deep">{p.name}</h1>
            <p className="mt-4 font-display text-3xl font-bold text-teal-deep">{formatPrice(p.priceCents)}</p>
            <p className="prose-billix mt-5 text-muted">{p.description}</p>
            {p.details && (
              <ul className="mt-5 space-y-2">
                {p.details.map((d) => <li key={d} className="flex items-center gap-2.5 text-[0.97rem]"><Check className="size-4 text-teal" aria-hidden />{d}</li>)}
              </ul>
            )}
            <div className="mt-8">
              {p.downloadUrl ? (
                <a href={p.downloadUrl} download className="inline-flex items-center gap-2.5 rounded-full bg-teal-deep px-7 py-3.5 font-semibold text-cream transition hover:bg-teal-night">
                  <Download className="size-5" aria-hidden />Download the free PDF
                </a>
              ) : (
                <AddToBag p={p} />
              )}
            </div>
            <ul className="mt-8 divide-y divide-line rounded-2xl bg-paper text-sm ring-1 ring-line">
              <li className="flex gap-3 p-4"><Truck className="size-5 shrink-0 text-teal" aria-hidden /><span>{p.downloadUrl ? 'Downloads right away as a PDF.' : digital ? 'Download the PDF right after checkout, with a copy of the link by email.' : `${madeToOrderNote} ${shippingNote}`}</span></li>
              <li className="flex gap-3 p-4"><RotateCcw className="size-5 shrink-0 text-teal" aria-hidden /><span>{!p.downloadUrl && <>{finalSaleNote} </>}See our <Link href="/legal/returns" className="font-semibold underline">returns</Link> and <Link href="/legal/shipping" className="font-semibold underline">shipping</Link> policies.</span></li>
              <li className="flex gap-3 p-4"><ShieldCheck className="size-5 shrink-0 text-teal" aria-hidden /><span>{p.downloadUrl ? 'Free to download and print for your household. No account needed.' : checkoutLive() ? 'Secure checkout by Stripe: card, Apple Pay or Google Pay.' : 'Checkout opens at launch. Nothing is charged until then.'}</span></li>
            </ul>
          </div>
        </div>
        </ProductOptionsProvider>
        {(p.inside || p.specs) && (
          <section className="mt-16 grid gap-8 rounded-[var(--radius-panel)] bg-paper p-6 ring-1 ring-line sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14" aria-labelledby="inside">
            {p.inside && (
              <div>
                <h2 id="inside" className="text-2xl font-extrabold text-teal-deep sm:text-3xl">What&rsquo;s inside</h2>
                <ol className="mt-6 space-y-2.5">
                  {p.inside.map((item, i) => (
                    <li key={item} className="flex gap-4 border-b border-line-soft pb-2.5 last:border-0">
                      <span className="w-7 shrink-0 font-display font-bold text-teal">{i === 0 || i === p.inside!.length - 1 ? '' : i}</span>
                      <span className="text-[0.97rem] text-ink">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {p.specs && (
              <div>
                <h2 className="text-2xl font-extrabold text-teal-deep sm:text-3xl">The details</h2>
                <dl className="mt-6 divide-y divide-line rounded-2xl bg-cream/60 ring-1 ring-line">
                  {p.specs.map((s) => (
                    <div key={s.label} className="flex justify-between gap-4 px-5 py-3.5 text-[0.95rem]">
                      <dt className="font-semibold text-teal-deep">{s.label}</dt>
                      <dd className="text-right text-muted">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>
        )}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-extrabold text-teal-deep sm:text-3xl">You might also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
          </section>
        )}
      </div>
    </>
  )
}
