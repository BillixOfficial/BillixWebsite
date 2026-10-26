'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products } from '@/content/products'

/**
 * Shopping bag kept in the visitor's browser (localStorage). Checkout is not live yet,
 * so nothing here charges anyone; the bag is ready for when Stripe checkout ships.
 */
export interface CartLine {
  slug: string
  options: Record<string, string>
  qty: number
}

interface CartApi {
  lines: CartLine[]
  count: number
  subtotalCents: number
  add: (line: CartLine) => void
  setQty: (index: number, qty: number) => void
  remove: (index: number) => void
  clear: () => void
  lastAdded: { slug: string; at: number } | null
  /** True once the bag has been loaded from this browser's storage. */
  ready: boolean
}

const Ctx = createContext<CartApi | null>(null)
const KEY = 'billix-bag-v1'
const MAX_QTY = 20

const sameLine = (a: CartLine, b: CartLine) => a.slug === b.slug && JSON.stringify(a.options) === JSON.stringify(b.options)

function load(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartLine[]
    return raw.filter((l) => products.some((p) => p.slug === l.slug) && Number.isInteger(l.qty) && l.qty > 0).map((l) => ({ ...l, qty: Math.min(l.qty, MAX_QTY) }))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)
  const [lastAdded, setLastAdded] = useState<CartApi['lastAdded']>(null)

  useEffect(() => {
    setLines(load()) // eslint-disable-line react-hooks/set-state-in-effect -- hydrate from storage after mount
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable: bag lasts for this visit only */
    }
  }, [lines, ready])

  const add = useCallback((line: CartLine) => {
    setLines((cur) => {
      const i = cur.findIndex((l) => sameLine(l, line))
      if (i === -1) return [...cur, { ...line, qty: Math.min(line.qty, MAX_QTY) }]
      return cur.map((l, j) => (j === i ? { ...l, qty: Math.min(l.qty + line.qty, MAX_QTY) } : l))
    })
    setLastAdded({ slug: line.slug, at: Date.now() })
  }, [])

  const api = useMemo<CartApi>(() => {
    const subtotalCents = lines.reduce((s, l) => s + (products.find((p) => p.slug === l.slug)?.priceCents ?? 0) * l.qty, 0)
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotalCents,
      add,
      setQty: (index, qty) => setLines((cur) => cur.map((l, j) => (j === index ? { ...l, qty: Math.max(1, Math.min(qty, MAX_QTY)) } : l))),
      remove: (index) => setLines((cur) => cur.filter((_, j) => j !== index)),
      clear: () => setLines([]),
      lastAdded,
      ready,
    }
  }, [lines, add, lastAdded, ready])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}
