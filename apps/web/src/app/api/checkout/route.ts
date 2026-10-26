import { siteUrl } from '@/config/site'
import { planCheckout, sessionParams } from '@/lib/shop/checkout'
import { getStripe } from '@/lib/shop/stripe'

/** Start Stripe Checkout for the bag. Body: { lines: [{ slug, options, qty }] }. Returns { url }. */
export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe) return Response.json({ error: 'Checkout opens at launch.' }, { status: 503 })
  let body: { lines?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'We couldn’t read your bag. Please try again.' }, { status: 400 })
  }
  const plan = planCheckout(body?.lines)
  if ('error' in plan) return Response.json({ error: plan.error }, { status: 400 })
  try {
    const origin = siteUrl('/').replace(/\/$/, '')
    const session = await stripe.checkout.sessions.create(sessionParams(plan, origin, { automaticTax: process.env.STRIPE_AUTOMATIC_TAX === 'on' }))
    return Response.json({ url: session.url })
  } catch (e) {
    console.error('checkout_failed', e instanceof Error ? e.message : e)
    return Response.json({ error: 'Checkout is having trouble right now. Please try again in a minute.' }, { status: 502 })
  }
}
