<script setup lang="ts">
useHead({
  title: 'Library',
  meta: [{ name: 'description', content: 'Browse all content on the site.' }]
})

const route = useRoute()
const router = useRouter()
const query = computed(() => route.query ?? {})

const selectedCategory = computed(() => {
  const c = query.value.category
  return typeof c === 'string' ? c : undefined
})

const selectedTags = computed<string[]>(() => {
  const t = query.value.tag
  const raw =
    Array.isArray(t) ? t :
    typeof t === 'string' ? [t] :
    []
  return raw.filter((x): x is string => typeof x === 'string' && x.length > 0)
})

const searchQuery = computed(() => {
  const q = query.value.q
  return typeof q === 'string' ? q : ''
})

// Pull both collections
const { data: blog } = await useAsyncData('lib-blog', () => queryCollection('blog').all())
const { data: pages } = await useAsyncData('lib-pages', () => queryCollection('pages').all())

// Full-text search sections (markdown body + headings)
const { data: blogSections } = await useAsyncData('lib-blog-sections', () =>
  queryCollectionSearchSections('blog', {
    ignoredTags: ['code', 'pre'],
  })
)

const { data: pageSections } = await useAsyncData('lib-page-sections', () =>
  queryCollectionSearchSections('pages', {
    ignoredTags: ['code', 'pre'],
  })
)

type Entry = {
  to: string
  kind: 'Blog' | 'Page'
  title?: string
  description?: string
  summary?: string
  excerpt?: any
  tags?: any
  category?: any
  date?: any
  image?: string
}

function normalizeExcerpt(x: any): string {
  const v = x?.summary ?? x?.excerpt ?? x?.description ?? ''
  return typeof v === 'string' ? v : ''
}

function normalizeTags(x: any): string[] {
  const t = x?.tags
  if (!t) return []
  const arr = Array.isArray(t) ? t : [t]
  return arr.filter((s): s is string => typeof s === 'string' && s.length > 0)
}

function normalizeCategory(x: any): string | undefined {
  const c = x?.category
  return typeof c === 'string' && c.length > 0 ? c : undefined
}

const items = computed<Entry[]>(() => {
  const b = (blog.value ?? []).map((x: any) => ({
    to: x?._path ?? x?.path,
    kind: 'Blog' as const,
    title: x?.title,
    summary: x?.summary,
    description: x?.description,
    excerpt: normalizeExcerpt(x),
    tags: normalizeTags(x),
    category: normalizeCategory(x),
    date: typeof x?.date === 'string' ? x.date : '',
    image: x?.image
  }))

  const p = (pages.value ?? []).map((x: any) => ({
    to: x?._path ?? x?.path,
    kind: 'Page' as const,
    title: x?.title,
    summary: x?.summary,
    description: x?.description,
    excerpt: normalizeExcerpt(x),
    tags: normalizeTags(x),
    category: normalizeCategory(x),
    date: typeof x?.date === 'string' ? x.date : '',
    image: x?.image
  }))

  return [...b, ...p].filter(i => typeof i.to === 'string' && i.to.length > 0)
})

const allItems = computed(() => items.value)

// Paths that match the keyword within markdown body/headings
const matchedLibraryPaths = computed<Set<string> | null>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return null

  const set = new Set<string>()
  const sections = [...(blogSections.value ?? []), ...(pageSections.value ?? [])]

  for (const s of sections) {
    const content = `${(s as any)?.title ?? ''} ${(s as any)?.content ?? ''}`.toLowerCase()
    if (content.includes(q)) {
      const p = (s as any)?.path
      if (typeof p === 'string' && p.length) set.add(p)
    }
  }

  return set
})

const filteredItems = computed(() => {
  let result = allItems.value

  if (selectedCategory.value) {
    result = result.filter(i => i.category === selectedCategory.value)
  }

  if (selectedTags.value.length) {
    result = result.filter(i =>
      selectedTags.value.every(tag => (i.tags ?? []).includes(tag))
    )
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    const bodyMatches = matchedLibraryPaths.value

    result = result.filter(i => {
      const haystack =
        `${i?.title ?? ''} ${getExcerpt(i)} ${(i?.tags ?? []).join(' ')} ${i?.category ?? ''}`.toLowerCase()

      const inBody = bodyMatches ? bodyMatches.has(i.to) : false
      return haystack.includes(q) || inBody
    })
  }

  // nice default sort: newest first if date exists, otherwise title
  result = [...result].sort(
    (a, b) =>
      (b.date ?? '').localeCompare(a.date ?? '') ||
      (a.title ?? '').localeCompare(b.title ?? '')
  )

  return result
})

function clearAll() { router.push({ query: {} }) }
function getExcerpt(item: any): string {
  if (!item || typeof item !== 'object') return ''
  const ex = item.excerpt ?? item.description ?? ''
  return typeof ex === 'string' ? ex : ''
}
</script>

<template>
  <section>
    <div class="container">
      <div class="page-head">
        <h1>Library</h1>
        <p class="page-subtitle">Everything on the site, Pages and Posts</p>
      </div>

      <p class="muted">
        {{ filteredItems.length }} result<span v-if="filteredItems.length !== 1">s</span>
      </p>

      <div class="grid-cards">
        <PreviewCard
          v-for="i in filteredItems"
          :key="i.to"
          :to="i.to"
          :title="i.title || '(Untitled)'"
          :subtitle="i.kind"
          :excerpt="i.excerpt"
          :image="i.image"
          :tags="i.tags"
        />
      </div>

      <div v-if="filteredItems.length === 0" class="empty">
        <h2>No results</h2>
        <p>Try removing a filter or using a different search term.</p>
        <button class="chip clear" @click="clearAll">Clear all</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.empty { margin-top: 2rem; opacity: 0.9; }
.chip { border: 1px solid var(--border); background: #f6f6f6; border-radius: 999px; padding: 0.35rem 0.6rem; cursor: pointer; font-size: 0.85rem; }
.chip.clear { background: #fff; }
.muted { opacity: 0.75; }
</style>
