// app/composables/useCatalog.ts
//
// The data layer for the shop. Pages call these functions and never
// touch the data source directly.
//
// TODAY:  reads from app/data/catalog.ts (a plain TS file).
// LATER:  swap the function bodies for Supabase queries — the
// signatures are async and shaped like table rows already, so no
// page or component needs to change.

import { products, type Product, type ProductCategory } from '~/data/catalog'

export type CatalogQuery = {
  category?: ProductCategory | string
  tags?: string[]
  q?: string
}

export function useCatalog() {
  async function getProducts(opts: CatalogQuery = {}): Promise<Product[]> {
    let result = [...products]

    if (opts.category) {
      result = result.filter(p => p.category === opts.category)
    }

    if (opts.tags?.length) {
      result = result.filter(p => opts.tags!.every(t => p.tags.includes(t)))
    }

    const q = opts.q?.trim().toLowerCase()
    if (q) {
      result = result.filter(p => {
        const haystack = [
          p.title,
          p.maker,
          p.blurb,
          p.description ?? '',
          p.category,
          p.tags.join(' ')
        ].join(' ').toLowerCase()
        return haystack.includes(q)
      })
    }

    result.sort((a, b) => a.title.localeCompare(b.title))
    return result
  }

  async function getProduct(slug: string): Promise<Product | null> {
    return products.find(p => p.slug === slug) ?? null
  }

  async function getFeatured(limit = 4): Promise<Product[]> {
    return products.filter(p => p.featured).slice(0, limit)
  }

  async function getCategories(): Promise<string[]> {
    const order = ['Books', 'Graphic Novels', 'Board Games', 'RPGs', 'CCGs', 'Accessories']
    const present = new Set(products.map(p => p.category))
    return order.filter(c => present.has(c as ProductCategory))
  }

  /**
   * Tags are category-scoped by default — pass a category to get only
   * the tags that actually appear on products in it (so Accessories
   * never shows "skirmish", etc.). No hardcoded per-category tag
   * lists to maintain; it's derived from whatever's in the catalog.
   * Omit `category` to get every tag across the whole catalog.
   */
  async function getTags(category?: string): Promise<string[]> {
    const pool = category ? products.filter(p => p.category === category) : products
    return Array.from(new Set(pool.flatMap(p => p.tags))).sort()
  }

  /**
   * Best-available STATIC cover for a product: local image → Open
   * Library cover → none. Does NOT include the live BGG/itch.io
   * cover — that's fetched separately via useLiveCover(product.links)
   * since it requires an async call. Components try this first
   * (synchronous, instant) and fall back to useLiveCover for games.
   */
  function coverUrl(p: Product, size: 'S' | 'M' | 'L' = 'M'): string | undefined {
    if (p.image) return p.image
    if (p.isbn && !p.hideCover) return `https://covers.openlibrary.org/b/isbn/${p.isbn}-${size}.jpg`
    return undefined
  }

  return { getProducts, getProduct, getFeatured, getCategories, getTags, coverUrl }
}
