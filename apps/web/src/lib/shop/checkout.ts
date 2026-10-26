import type Stripe from 'stripe'
import type { Product } from '@/content/types'
import { visibleProducts } from '@/content/products'
import { imageForOptions, productImages } from '@/content/product-images'
import { finalSaleNote, isDigital, madeToOrderNote, shippingCentsFor, shopTerms } from './terms'

/**
 * Turns a bag (from the visitor's browser) into a Stripe Checkout Session. Prices,
 * names and options always come from products.ts, never from the request, so a
 * tampered bag can't change what anyone pays.
 */

export interface CheckoutItem {
  product: Product
  options: Record<string, string>
  qty: number
}

export interface CheckoutPlan {
  items: CheckoutItem[]
  physicalSubtotalCents: number
  hasEbook: boolean
  hasPhysical: boolean
}

const MAX_LINES = 30
const MAX_QTY = 20

export function planCheckout(lines: unknown): CheckoutPlan | { error: string } {
  if (!Array.isArray(lines) || lines.length === 0) return { error: 'Your bag is empty.' }
  if (lines.length > MAX_LINES) return { error: 'Your bag has too many lines for one order.' }
  const items: CheckoutItem[] = []
  for (const raw of lines) {
    const line = raw as { slug?: unknown; options?: unknown; qty?: unknown }
    const product = visibleProducts.find((p) => p.slug === line.slug)
    if (!product || product.priceCents <= 0 || product.downloadUrl) return { error: 'Something in your bag is no longer for sale.' }
    const qty = Number(line.qty)
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return { error: `Choose between 1 and ${MAX_QTY} of each item.` }
    const given = (line.options && typeof line.options === 'object' ? line.options : {}) as Record<string, unknown>
    const options: Record<string, string> = {}
    for (const v of product.variants ?? []) {
      const value = given[v.name]
      if (typeof value !== 'string' || !v.options.includes(value)) return { error: `Choose a ${v.name.toLowerCase()} for ${product.name}.` }
      options[v.name] = value
    }
    if (Object.keys(given).some((k) => !(k in options))) return { error: `${product.name} has an option we don't recognize.` }
    items.push({ product, options, qty })
  }
  const physical = items.filter((i) => !isDigital(i.product))
  return {
    items,
    physicalSubtotalCents: physical.reduce((s, i) => s + i.product.priceCents * i.qty, 0),
    hasEbook: items.some((i) => i.product.format === 'ebook'),
    hasPhysical: physical.length > 0,
  }
}

/** Stripe product tax codes (from Stripe's tax code list), used when Stripe Tax is on. */
function taxCode(p: Product) {
  if (p.format === 'ebook') return 'txcd_10302000' // Digital books, downloaded, permanent rights
  if (p.format === 'apparel') return 'txcd_30011000' // Clothing & footwear
  return 'txcd_99999999' // General tangible goods: mugs, totes
}

const optionText = (options: Record<string, string>) => Object.entries(options).map(([k, v]) => `${k}: ${v}`).join(' · ')

export function sessionParams(plan: CheckoutPlan, siteOrigin: string, { automaticTax }: { automaticTax: boolean }): Stripe.Checkout.SessionCreateParams {
  // Stripe only shows product photos from public https URLs (not localhost).
  const photo = (i: CheckoutItem) => {
    const src = imageForOptions(i.product.slug, i.options) ?? productImages[i.product.slug]?.[0]
    return src && siteOrigin.startsWith('https://') ? [new URL(src, siteOrigin).toString()] : undefined
  }
  const shippingCents = shippingCentsFor(plan.physicalSubtotalCents)
  return {
    mode: 'payment',
    line_items: plan.items.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: 'usd',
        unit_amount: i.product.priceCents,
        product_data: {
          name: i.product.name,
          description: [optionText(i.options), isDigital(i.product) ? 'PDF download right after checkout.' : madeToOrderNote].filter(Boolean).join(' · '),
          images: photo(i),
          tax_code: taxCode(i.product),
          metadata: { slug: i.product.slug, options: JSON.stringify(i.options) },
        },
      },
    })),
    ...(plan.hasPhysical && {
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          display_name: shippingCents === 0 ? 'Free shipping (made to order)' : 'Standard shipping (made to order)',
          fixed_amount: { amount: shippingCents, currency: 'usd' },
          tax_code: 'txcd_92010001',
          delivery_estimate: { minimum: { unit: 'week', value: shopTerms.shipWeeks.min }, maximum: { unit: 'week', value: shopTerms.shipWeeks.max } },
        },
      }],
    }),
    custom_text: {
      submit: {
        message: [
          plan.hasPhysical && `Clothing, mugs and totes are made to order and ship in about ${shopTerms.shipWeeks.min}–${shopTerms.shipWeeks.max} weeks. If we can't ship in that time, we'll email you and you can cancel for a full refund.`,
          finalSaleNote,
        ].filter(Boolean).join(' '),
      },
    },
    ...(automaticTax && { automatic_tax: { enabled: true } }),
    metadata: { has_ebook: plan.hasEbook ? 'yes' : 'no', has_physical: plan.hasPhysical ? 'yes' : 'no' },
    success_url: `${siteOrigin}/shop/order?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteOrigin}/cart`,
  }
}
