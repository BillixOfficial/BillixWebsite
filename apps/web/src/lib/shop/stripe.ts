import Stripe from 'stripe'

/**
 * Server-only Stripe client. Checkout is live only when STRIPE_SECRET_KEY is set
 * (a test key locally, the live key in production); without it the shop keeps
 * saying checkout opens at launch and nothing can be charged.
 */
let client: Stripe | null | undefined

export function getStripe(): Stripe | null {
  if (client === undefined) {
    const key = process.env.STRIPE_SECRET_KEY?.trim()
    client = key ? new Stripe(key, { appInfo: { name: 'Billix shop' } }) : null
  }
  return client
}

export const checkoutLive = () => !!process.env.STRIPE_SECRET_KEY?.trim()
