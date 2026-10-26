import { getOrder } from '@/lib/shop/orders'
import { sendOrderEmails } from '@/lib/shop/email'
import { getStripe } from '@/lib/shop/stripe'

/**
 * Stripe calls this when a checkout is paid. Set it up in the Stripe dashboard
 * (Developers → Webhooks → endpoint https://<site>/api/stripe/webhook, events
 * checkout.session.completed and checkout.session.async_payment_succeeded) and put the
 * endpoint's signing secret in STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!stripe || !secret) return new Response('Stripe webhooks are not set up.', { status: 503 })
  const body = await request.text()
  let event
  try {
    event = stripe.webhooks.constructEvent(body, request.headers.get('stripe-signature') ?? '', secret)
  } catch {
    return new Response('Invalid signature.', { status: 400 })
  }
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const order = await getOrder(event.data.object.id)
    if (order?.paid) await sendOrderEmails(order, event.id)
  }
  return Response.json({ received: true })
}
