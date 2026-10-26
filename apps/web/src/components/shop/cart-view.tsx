'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { products, formatPrice } from '@/content/products'
import { useCart } from './cart'
import { ProductImage } from './product-ui'
import { WaitlistForm } from '@/components/forms/waitlist-form'
import { ButtonLink } from '@/components/ui/primitives'

export function CartView() {
  const { lines, setQty, remove, subtotalCents, count } = useCart()
  const [checkout, setCheckout] = useState(false)

  if (lines.length === 0) {
    return (
      <div className="grid place-items-center py-16 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-gold-soft text-teal-deep"><ShoppingBag className="size-8" aria-hidden /></span>
        <h1 className="mt-6 text-4xl font-extrabold text-teal-deep">Your bag is empty</h1>
        <p className="mt-3 text-lg text-muted">Guides, planners and Billix gear are waiting in the shop.</p>
        <ButtonLink href="/shop" className="mt-8" arrow>Browse the shop</ButtonLink>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <div>
        <h1 className="text-4xl font-extrabold text-teal-deep">Your bag <span className="text-muted">({count})</span></h1>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {lines.map((l, i) => {
            const p = products.find((x) => x.slug === l.slug)!
            return (
              <li key={i} className="flex gap-4 py-5">
                <Link href={`/shop/${p.slug}`} className="shrink-0"><ProductImage p={p} options={l.options} className="size-24 rounded-xl sm:size-28" sizes="112px" /></Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <Link href={`/shop/${p.slug}`} className="font-display font-bold text-teal-deep hover:underline">{p.name}</Link>
                    <p className="font-semibold tabular-nums">{formatPrice(p.priceCents * l.qty)}</p>
                  </div>
                  {Object.entries(l.options).length > 0 && <p className="mt-1 text-sm text-muted">{Object.entries(l.options).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full ring-1 ring-line">
                      <button type="button" onClick={() => setQty(i, l.qty - 1)} className="grid size-9 place-items-center rounded-full hover:bg-mist" aria-label="Decrease quantity"><Minus className="size-3.5" aria-hidden /></button>
                      <span className="w-7 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                      <button type="button" onClick={() => setQty(i, l.qty + 1)} className="grid size-9 place-items-center rounded-full hover:bg-mist" aria-label="Increase quantity"><Plus className="size-3.5" aria-hidden /></button>
                    </div>
                    <button type="button" onClick={() => remove(i)} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-danger"><Trash2 className="size-4" aria-hidden />Remove</button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <Link href="/shop" className="mt-6 inline-block font-semibold text-teal-ink hover:underline">&larr; Keep shopping</Link>
      </div>

      <aside className="h-fit rounded-[var(--radius-panel)] bg-paper p-6 ring-1 ring-line lg:sticky lg:top-24">
        <h2 className="text-xl font-bold text-teal-deep">Order summary</h2>
        <dl className="mt-5 space-y-3 text-[0.95rem]">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-semibold tabular-nums">{formatPrice(subtotalCents)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="text-muted">Calculated at checkout</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd className="text-muted">Calculated at checkout</dd></div>
        </dl>
        <button type="button" onClick={() => setCheckout(true)} className="mt-6 h-12 w-full rounded-full bg-gold font-semibold text-teal-night transition hover:bg-highlight">Checkout</button>
        <p className="mt-3 text-center text-xs text-muted">Secure checkout by card. Your bag is saved on this device.</p>
      </aside>

      {checkout && (
        <div role="dialog" aria-modal="true" aria-labelledby="co-title" className="fixed inset-0 z-50 grid place-items-center bg-teal-night/50 p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setCheckout(false)}>
          <div className="relative w-full max-w-md rounded-[var(--radius-panel)] bg-paper p-7 shadow-[var(--shadow-lift)]">
            <button type="button" onClick={() => setCheckout(false)} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full hover:bg-mist" aria-label="Close"><X className="size-5" aria-hidden /></button>
            <h2 id="co-title" className="text-2xl font-extrabold text-teal-deep">Checkout opens at launch</h2>
            <p className="mt-2 text-muted">The Billix Shop is opening soon and we aren&rsquo;t taking payments yet. Your bag will be waiting here. Leave your email and we&rsquo;ll tell you the moment checkout is live.</p>
            <div className="mt-5"><WaitlistForm list="shop" cta="Notify me" /></div>
          </div>
        </div>
      )}
    </div>
  )
}
