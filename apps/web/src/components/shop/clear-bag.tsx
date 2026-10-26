'use client'

import { useEffect, useRef } from 'react'
import { useCart } from './cart'

/** Empties the bag once, after Stripe confirms the order was paid (and after the bag has loaded from storage). */
export function ClearBag() {
  const { clear, ready } = useCart()
  const done = useRef(false)
  useEffect(() => {
    if (!ready || done.current) return
    done.current = true
    clear()
  }, [ready, clear])
  return null
}
