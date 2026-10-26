import type { Product } from '@/content/types'

/**
 * Shop terms shown on product pages, in the bag and at Stripe checkout, kept in one
 * place so they always agree. Clothing, mugs and totes are made to order once orders
 * come in, so they ship later; ebooks download right after payment.
 */
export const shopTerms = {
  /** Flat U.S. shipping for an order with any physical item, in cents. */
  shippingCents: 695,
  /** Orders whose physical items total at least this ship free, in cents. */
  freeShippingFromCents: 7500,
  /** Delivery window for made-to-order items, in weeks. */
  shipWeeks: { min: 4, max: 6 },
}

export const madeToOrderNote = `Made to order. Ships in about ${shopTerms.shipWeeks.min}–${shopTerms.shipWeeks.max} weeks.`

export const finalSaleNote = 'All sales are final: no returns or exchanges.'

export const shippingNote = `$${(shopTerms.shippingCents / 100).toFixed(2)} U.S. shipping, free on orders of $${shopTerms.freeShippingFromCents / 100} or more.`

/** Ebooks and printables: delivered as a download, never shipped. */
export const isDigital = (p: Pick<Product, 'format'>) => p.format === 'ebook' || p.format === 'digital-download'

/** Shipping for an order, given the subtotal of its physical items. */
export function shippingCentsFor(physicalSubtotalCents: number) {
  if (physicalSubtotalCents <= 0) return 0
  return physicalSubtotalCents >= shopTerms.freeShippingFromCents ? 0 : shopTerms.shippingCents
}
