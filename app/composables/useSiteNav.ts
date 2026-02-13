// composables/useSiteNav.ts

export type SiteNavItem = {
  label: string
  to: string
  order?: number
  children?: SiteNavItem[]
}

type ParentNavItem = SiteNavItem & { children: SiteNavItem[] }

type PageNavMeta = {
  path?: string
  _path?: string
  title?: string
  nav?: boolean
  navTitle?: string
  navOrder?: number
  navParent?: string
}

function getPath(p: PageNavMeta) {
  const to = (p.path ?? p._path)
  return typeof to === 'string' && to.length ? to : undefined
}

function normParentKey(x: string) {
  return x.replace(/^\//, '').trim().toLowerCase()
}

export function useSiteNav() {
  const { data: pageLinks } = useAsyncData('site-nav-pages', async () => {
    const pages = await queryCollection('pages').all()

    return (pages as PageNavMeta[])
      .filter(p => p.nav)
      .map(p => ({
        to: getPath(p) || '/',
        label: p.navTitle || p.title || '(Untitled)',
        order: typeof p.navOrder === 'number' ? p.navOrder : 999,
        parent: typeof p.navParent === 'string' ? p.navParent : ''
      }))
  })

  const nav = computed<SiteNavItem[]>(() => {
    // “Structural” routes that aren’t markdown pages
    const base: SiteNavItem[] = [
      { label: 'Library', to: '/library', order: 10 },
      { label: 'Blog', to: '/blog', order: 20 }
    ]

    const pages = (pageLinks.value ?? [])

    // Parents = items with no parent
    const parents: ParentNavItem[] = pages
      .filter(p => !p.parent)
      .map(p => ({
        label: p.label,
        to: p.to,
        order: p.order,
        children: []
      }))

    // Index parents so children can attach
    const parentIndex = new Map<string, ParentNavItem>()
    for (const p of parents) {
      parentIndex.set(normParentKey(p.to), p)     // "/about" => "about"
      parentIndex.set(normParentKey(p.label), p)  // "About" => "about"
    }

    // Attach children
    for (const c of pages.filter(p => p.parent)) {
      const key = normParentKey(c.parent)
      const parent = parentIndex.get(key)

      const child: SiteNavItem = { label: c.label, to: c.to, order: c.order }

      if (parent) {
        parent.children.push(child)
      } else {
        // If parent not found, fail gracefully: make it top-level
        parents.push({ ...child, children: [] })
      }
    }

    // Sort children and parents
    for (const p of parents) {
      p.children.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.label.localeCompare(b.label))
    }
    parents.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.label.localeCompare(b.label))

    const combined = [...base, ...parents]
    combined.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.label.localeCompare(b.label))
    return combined
  })

  return { nav }
}
