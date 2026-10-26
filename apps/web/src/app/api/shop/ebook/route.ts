import { getOrder } from '@/lib/shop/orders'
import { ebookSlugs, readEbook } from '@/lib/shop/ebooks'

/** Download a purchased ebook: /api/shop/ebook?session_id=cs_…&slug=… (slug optional). */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const order = await getOrder(url.searchParams.get('session_id') ?? '')
  if (!order?.paid) return new Response('We couldn’t find a paid order for this link.', { status: 404 })
  const owned = order.lines.map((l) => l.slug).filter((s): s is string => !!s && ebookSlugs.includes(s))
  const slug = url.searchParams.get('slug') ?? owned[0]
  if (!slug || !owned.includes(slug)) return new Response('This order doesn’t include an ebook.', { status: 404 })
  const ebook = await readEbook(slug)
  if (!ebook) return new Response('This ebook isn’t available right now.', { status: 404 })
  return new Response(new Uint8Array(ebook.data), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${ebook.downloadName}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
