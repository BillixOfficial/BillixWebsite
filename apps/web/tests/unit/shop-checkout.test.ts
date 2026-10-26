import { describe, expect, it } from 'vitest'
import { planCheckout, sessionParams } from '@/lib/shop/checkout'
import { shippingCentsFor, shopTerms } from '@/lib/shop/terms'

const ebook = { slug: 'household-utility-savings-handbook', options: {}, qty: 1 }
const tee = { slug: 'little-piggy-tee', options: { Color: 'Oatmeal', Size: 'M' }, qty: 1 }

describe('shop checkout', () => {
  it('prices come from the catalog, not the request', () => {
    const plan = planCheckout([{ ...ebook, priceCents: 1 }])
    if ('error' in plan) throw new Error(plan.error)
    const params = sessionParams(plan, 'https://billixapp.com', { automaticTax: false })
    expect(params.line_items?.[0].price_data?.unit_amount).toBe(2499)
  })

  it('rejects unknown, free, hidden or badly optioned items', () => {
    expect(planCheckout([])).toHaveProperty('error')
    expect(planCheckout([{ slug: 'not-a-product', qty: 1 }])).toHaveProperty('error')
    expect(planCheckout([{ slug: 'monthly-bill-tracker', qty: 1 }])).toHaveProperty('error') // free download
    expect(planCheckout([{ slug: 'starter-bundle', qty: 1 }])).toHaveProperty('error') // draft
    expect(planCheckout([{ ...tee, options: { Color: 'Purple', Size: 'M' } }])).toHaveProperty('error')
    expect(planCheckout([{ ...tee, options: { Color: 'Oatmeal' } }])).toHaveProperty('error')
    expect(planCheckout([{ ...tee, qty: 0 }])).toHaveProperty('error')
    expect(planCheckout([{ ...tee, qty: 21 }])).toHaveProperty('error')
  })

  it('charges shipping only for physical items, free from the threshold', () => {
    expect(shippingCentsFor(0)).toBe(0)
    expect(shippingCentsFor(2999)).toBe(shopTerms.shippingCents)
    expect(shippingCentsFor(shopTerms.freeShippingFromCents)).toBe(0)

    const digital = planCheckout([ebook])
    if ('error' in digital) throw new Error(digital.error)
    const d = sessionParams(digital, 'https://billixapp.com', { automaticTax: false })
    expect(d.shipping_options).toBeUndefined()
    expect(d.shipping_address_collection).toBeUndefined()

    const mixed = planCheckout([ebook, tee])
    if ('error' in mixed) throw new Error(mixed.error)
    expect(mixed.hasEbook && mixed.hasPhysical).toBe(true)
    const m = sessionParams(mixed, 'https://billixapp.com', { automaticTax: true })
    expect(m.shipping_options?.[0].shipping_rate_data?.fixed_amount?.amount).toBe(shopTerms.shippingCents)
    expect(m.shipping_address_collection?.allowed_countries).toEqual(['US'])
    expect(m.automatic_tax?.enabled).toBe(true)
    expect(m.success_url).toContain('{CHECKOUT_SESSION_ID}')
  })
})
