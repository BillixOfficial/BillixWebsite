import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { collections, visibleProducts } from '@/content/products'
import { ProductCard } from '@/components/shop/product-ui'
import { CollectionNav, ShopNotice } from '@/components/shop/shop-chrome'

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }))
}

export async function generateMetadata({ params }: PageProps<'/shop/collections/[collection]'>): Promise<Metadata> {
  const { collection } = await params
  const c = collections.find((x) => x.slug === collection)
  return c ? { title: `${c.name} | Shop`, description: c.description, alternates: { canonical: `/shop/collections/${c.slug}` } } : {}
}

export default async function CollectionPage({ params }: PageProps<'/shop/collections/[collection]'>) {
  const { collection } = await params
  const c = collections.find((x) => x.slug === collection)
  if (!c) notFound()
  const items = visibleProducts.filter((p) => p.collection === c.slug)
  return (
    <>
      <ShopNotice />
      <div className="container-x py-12">
        <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold text-teal-deep">{c.name}</h1>
        <p className="mt-2 text-lg text-muted">{c.description} <span className="text-teal-deep">{items.length} {items.length === 1 ? 'item' : 'items'}</span></p>
        <div className="mt-7"><CollectionNav active={c.slug} /></div>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {items.map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 4} />)}
        </div>
      </div>
    </>
  )
}
