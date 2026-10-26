import type Stripe from 'stripe'
import { products } from '@/content/products'
import { isDigital } from './terms'
import { getStripe } from './stripe'

/**
 * A paid order as Stripe records it. Stripe is the order book: every payment, its
 * items, options and shipping address live in the Stripe dashboard, so the site keeps
 * no database of its own for orders.
 */
export interface OrderLine {
  name: string
  slug: string | null
  options: Record<string, string>
  qty: number
  amountCents: number
  digital: boolean
}

export interface Order {
  id: string
  paid: boolean
  email: string | null
  lines: OrderLine[]
  subtotalCents: number
  shippingCents: number
  taxCents: number
  totalCents: number
  hasEbook: boolean
  hasPhysical: boolean
  shipTo: string | null
}

const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,}$/

export async function getOrder(sessionId: string): Promise<Order | null> {
  const stripe = getStripe()
  if (!stripe || !SESSION_ID.test(sessionId)) return null
  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items.data.price.product'] })
  } catch {
    return null
  }
  const lines: OrderLine[] = (session.line_items?.data ?? []).map((li) => {
    const product = li.price?.product && typeof li.price.product === 'object' && !('deleted' in li.price.product) ? li.price.product : null
    const slug = product?.metadata?.slug ?? null
    let options: Record<string, string> = {}
    try {
      options = JSON.parse(product?.metadata?.options ?? '{}')
    } catch {
      /* older or hand-made line: no options */
    }
    const known = products.find((p) => p.slug === slug)
    return { name: li.description ?? product?.name ?? 'Item', slug, options, qty: li.quantity ?? 1, amountCents: li.amount_total, digital: known ? isDigital(known) : false }
  })
  const ship = session.collected_information?.shipping_details
  const a = ship?.address
  return {
    id: session.id,
    paid: session.payment_status === 'paid' || session.payment_status === 'no_payment_required',
    email: session.customer_details?.email ?? null,
    lines,
    subtotalCents: session.amount_subtotal ?? 0,
    shippingCents: session.total_details?.amount_shipping ?? 0,
    taxCents: session.total_details?.amount_tax ?? 0,
    totalCents: session.amount_total ?? 0,
    hasEbook: lines.some((l) => l.digital && products.find((p) => p.slug === l.slug)?.format === 'ebook'),
    hasPhysical: lines.some((l) => !l.digital),
    shipTo: ship && a ? [ship.name, a.line1, a.line2, `${a.city ?? ''}, ${a.state ?? ''} ${a.postal_code ?? ''}`.trim()].filter(Boolean).join(', ') : null,
  }
}
