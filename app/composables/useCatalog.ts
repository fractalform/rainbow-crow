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
import { GROUP_ORDER, TAG_GROUPS } from '~/data/tagGroups'

export type CatalogQuery = {
  category?: ProductCategory | string | (ProductCategory | string)[]
  tags?: string[]
  q?: string
}

export function useCatalog() {
  async function getProducts(opts: CatalogQuery = {}): Promise<Product[]> {
    let result = [...products]

    if (opts.category) {
      const cats = Array.isArray(opts.category) ? opts.category : [opts.category]
      if (cats.length) result = result.filter(p => cats.includes(p.category))
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
    const order = ['Books', 'Graphic Novels', 'Board Games', 'RPGs', 'CCGs', 'Accessories', 'Merch']
    const present = new Set(products.map(p => p.category))
    return order.filter(c => present.has(c as ProductCategory))
  }

  /**
   * Tags are category-scoped by default — pass one or more categories
   * to get only the tags that actually appear on products in them (so
   * Accessories never shows "skirmish", etc.). With multiple
   * categories, this is a union — a tag shows up if it's present on
   * ANY of the selected categories. No hardcoded per-category tag
   * lists to maintain; it's derived from whatever's in the catalog.
   * Omit `category` to get every tag across the whole catalog.
   */
  async function getTags(category?: string | string[]): Promise<string[]> {
    const cats = category ? (Array.isArray(category) ? category : [category]) : []
    const pool = cats.length ? products.filter(p => cats.includes(p.category)) : products
    return Array.from(new Set(pool.flatMap(p => p.tags))).sort()
  }

  /**
   * Same tags as getTags, but bucketed into labeled sections (see
   * app/data/tagGroups.ts) for the grouped filter UI. Groups are only
   * included if they actually have at least one tag present for the
   * current category — no empty "Nonfiction Subject" heading showing
   * up under Board Games. Any tag not in the mapping falls into
   * "Other" rather than vanishing silently.
   */
  async function getGroupedTags(category?: string | string[]): Promise<{ label: string; tags: string[] }[]> {
    const flat = await getTags(category)
    const buckets = new Map<string, string[]>()
    for (const tag of flat) {
      const label = TAG_GROUPS[tag] ?? 'Other'
      if (!buckets.has(label)) buckets.set(label, [])
      buckets.get(label)!.push(tag)
    }
    return GROUP_ORDER
      .filter(label => buckets.has(label))
      .map(label => ({ label, tags: buckets.get(label)! }))
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

  return { getProducts, getProduct, getFeatured, getCategories, getTags, getGroupedTags, coverUrl }
}
