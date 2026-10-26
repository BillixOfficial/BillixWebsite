import { site, siteUrl } from '@/config/site'
import { formatPrice } from '@/content/products'
import type { Order } from './orders'
import { shopTerms } from './terms'

/**
 * Order emails, sent through Resend's HTTP API when RESEND_API_KEY and SHOP_EMAIL_FROM
 * are set (the sender's domain must be verified in Resend). Without them nothing is
 * sent and the order page remains the way to download. SHOP_ORDERS_EMAIL (default:
 * the site email) gets a note for every order so made-to-order items can be tracked.
 */
async function send(to: string, subject: string, text: string, idempotencyKey: string) {
  const key = process.env.RESEND_API_KEY?.trim()
  const from = process.env.SHOP_EMAIL_FROM?.trim()
  if (!key || !from) {
    console.info('order_email_skipped', { subject })
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ from, to: [to], subject, text, reply_to: site.email }),
  })
  if (!res.ok) console.error('order_email_failed', res.status, (await res.text()).slice(0, 300))
}

const itemList = (o: Order) => o.lines.map((l) => `- ${l.name}${Object.keys(l.options).length ? ` (${Object.values(l.options).join(', ')})` : ''} × ${l.qty}: ${formatPrice(l.amountCents)}`).join('\n')

export async function sendOrderEmails(o: Order, eventId: string) {
  const orderPage = siteUrl(`/shop/order?session_id=${o.id}`)
  if (o.email) {
    const parts = [
      'Thank you for your order from Billix.',
      itemList(o) + `\nTotal: ${formatPrice(o.totalCents)}`,
      o.hasEbook ? `Download your handbook here (keep this email; the link keeps working):\n${siteUrl(`/api/shop/ebook?session_id=${o.id}`)}` : '',
      o.hasPhysical ? `Your clothing, mugs and totes are made to order and ship in about ${shopTerms.shipWeeks.min}–${shopTerms.shipWeeks.max} weeks. We'll email you when they ship. If we can't ship in that time, we'll let you know and you can cancel for a full refund.` : '',
      `Your order page: ${orderPage}`,
      `Questions? Just reply to this email.`,
    ]
    await send(o.email, o.hasEbook ? 'Your Billix handbook is ready' : 'Your Billix order', parts.filter(Boolean).join('\n\n'), `${eventId}-customer`)
  }
  const notify = process.env.SHOP_ORDERS_EMAIL?.trim() || site.email
  await send(notify, `New order: ${formatPrice(o.totalCents)}${o.hasPhysical ? ' (made to order)' : ''}`, [itemList(o), `Customer: ${o.email ?? 'unknown'}`, o.shipTo ? `Ship to: ${o.shipTo}` : '', `Stripe session: ${o.id}`].filter(Boolean).join('\n\n'), `${eventId}-owner`)
}
