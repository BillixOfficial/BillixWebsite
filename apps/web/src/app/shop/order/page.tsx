import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { connection } from 'next/server'
import { CheckCircle2, Download, Package } from 'lucide-react'
import { formatPrice } from '@/content/products'
import { getOrder } from '@/lib/shop/orders'
import { shopTerms } from '@/lib/shop/terms'
import { ClearBag } from '@/components/shop/clear-bag'
import { ButtonLink, EmptyState } from '@/components/ui/primitives'

export const metadata: Metadata = { title: 'Your order', robots: { index: false, follow: false } }

async function Order({ searchParams }: { searchParams: PageProps<'/shop/order'>['searchParams'] }) {
  await connection() // always look the order up at request time
  const sp = await searchParams
  const id = typeof sp.session_id === 'string' ? sp.session_id : ''
  const order = await getOrder(id)
  if (!order || !order.paid) {
    return (
      <EmptyState title="We couldn’t find a paid order for this link" action={<ButtonLink href="/contact?topic=support" variant="ghost" size="sm">Contact us</ButtonLink>}>
        If you just paid, give it a minute and refresh. If it still doesn&rsquo;t show, contact us with the email you used and we&rsquo;ll sort it out.
      </EmptyState>
    )
  }
  return (
    <>
      <ClearBag />
      <div className="flex items-center gap-3 text-cash">
        <CheckCircle2 className="size-7" aria-hidden />
        <p className="font-semibold">Payment received</p>
      </div>
      <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-tight text-teal-deep">Thank you for your order</h1>
      {order.email && <p className="mt-3 text-lg text-muted">A receipt is on its way to {order.email}.</p>}

      {order.hasEbook && (
        <section className="mt-8 rounded-[var(--radius-panel)] bg-teal-deep p-6 text-cream sm:p-8">
          <h2 className="text-2xl font-extrabold">Your handbook is ready</h2>
          <p className="mt-2 text-cream/85">Download the PDF now. Bookmark this page or keep the email: the link keeps working.</p>
          <a href={`/api/shop/ebook?session_id=${order.id}`} className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 font-semibold text-teal-night transition hover:bg-highlight">
            <Download className="size-5" aria-hidden />Download the handbook (PDF)
          </a>
        </section>
      )}

      {order.hasPhysical && (
        <section className="mt-6 flex gap-4 rounded-[var(--radius-panel)] bg-paper p-6 ring-1 ring-line">
          <Package className="mt-0.5 size-6 shrink-0 text-teal" aria-hidden />
          <div>
            <h2 className="font-display text-lg font-bold text-teal-deep">Made to order</h2>
            <p className="mt-1 text-muted">
              We make your clothing, mugs and totes once your order comes in, so they ship in about {shopTerms.shipWeeks.min}–{shopTerms.shipWeeks.max} weeks. We&rsquo;ll email you when they ship.
              {order.shipTo && <> Shipping to {order.shipTo}.</>}
            </p>
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold text-teal-deep">Order summary</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {order.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-4 py-3.5">
              <div>
                <p className="font-semibold text-teal-deep">{l.name} <span className="font-normal text-muted">× {l.qty}</span></p>
                {Object.keys(l.options).length > 0 && <p className="text-sm text-muted">{Object.entries(l.options).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>}
              </div>
              <p className="font-semibold tabular-nums">{formatPrice(l.amountCents)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-[0.95rem]">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatPrice(order.subtotalCents)}</dd></div>
          {order.hasPhysical && <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="tabular-nums">{order.shippingCents ? formatPrice(order.shippingCents) : 'Free'}</dd></div>}
          {order.taxCents > 0 && <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd className="tabular-nums">{formatPrice(order.taxCents)}</dd></div>}
          <div className="flex justify-between border-t border-line pt-2 font-bold text-teal-deep"><dt>Total</dt><dd className="tabular-nums">{formatPrice(order.totalCents)}</dd></div>
        </dl>
      </section>
      <p className="mt-8 text-sm text-muted">
        Questions about your order? <Link href="/contact?topic=support" className="font-semibold text-teal-ink underline">Contact us</Link>. See our <Link href="/legal/returns" className="font-semibold text-teal-ink underline">returns</Link> and <Link href="/legal/shipping" className="font-semibold text-teal-ink underline">shipping</Link> policies.
      </p>
    </>
  )
}

export default function OrderPage({ searchParams }: PageProps<'/shop/order'>) {
  return (
    <div className="container-x max-w-3xl py-12 sm:py-16">
      <Suspense fallback={<p className="text-muted">Loading your order…</p>}>
        <Order searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
