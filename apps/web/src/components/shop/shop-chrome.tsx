import Link from 'next/link'
import { clsx } from 'clsx'
import { collections } from '@/content/products'
import { checkoutLive } from '@/lib/shop/stripe'
import { shopTerms } from '@/lib/shop/terms'

/** Slim notice shown across shop pages: honest about checkout and made-to-order shipping. */
export function ShopNotice() {
  return (
    <div className="bg-teal-deep text-cream">
      <p className="container-x py-2.5 text-center text-sm">
        {checkoutLive() ? (
          <>The handbook downloads right after checkout. Clothing, mugs and totes are made to order and ship in about {shopTerms.shipWeeks.min}–{shopTerms.shipWeeks.max} weeks.</>
        ) : (
          <>The Billix Shop is opening soon. Fill your bag now; <Link href="/cart" className="font-semibold text-highlight underline underline-offset-2">checkout opens at launch</Link>.</>
        )}
      </p>
    </div>
  )
}

export function CollectionNav({ active }: { active?: string }) {
  return (
    <nav aria-label="Shop collections" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2">
        <li><Link href="/shop" aria-current={!active ? 'page' : undefined} className={clsx('block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ring-1 transition', !active ? 'bg-teal-deep text-cream ring-teal-deep' : 'bg-paper text-teal-deep ring-line hover:ring-teal')}>All</Link></li>
        {collections.map((c) => (
          <li key={c.slug}>
            <Link href={`/shop/collections/${c.slug}`} aria-current={active === c.slug ? 'page' : undefined} className={clsx('block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ring-1 transition', active === c.slug ? 'bg-teal-deep text-cream ring-teal-deep' : 'bg-paper text-teal-deep ring-line hover:ring-teal')}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
