import type { Metadata } from 'next'
import { CartView } from '@/components/shop/cart-view'
import { ShopNotice } from '@/components/shop/shop-chrome'
import { checkoutLive } from '@/lib/shop/stripe'

export const metadata: Metadata = { title: 'Your bag', robots: { index: false } }

export default function CartPage() {
  return (
    <>
      <ShopNotice />
      <div className="container-x py-12 sm:py-16">
        <CartView live={checkoutLive()} />
      </div>
    </>
  )
}
