<script setup lang="ts">
useHead({
  title: 'Blog',
  meta: [{ name: 'description', content: 'Posts and updates.' }]
})

const route = useRoute()
const router = useRouter()
const query = computed(() => route.query ?? {})

// Pull blog posts from the "blog" collection
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog').all()
)

// Full-text search sections (markdown body + headings)
const { data: blogSections } = await useAsyncData('blog-sections', () =>
  queryCollectionSearchSections('blog', {
    ignoredTags: ['code', 'pre'],
  })
)

type Entry = {
  _path?: string
  path?: string
  to?: string
  title?: string
  description?: string
  summary?: string
  excerpt?: string
  tags?: string[]
  category?: string
  date?: string
  image?: string
}

const allPosts = computed(() =>
  (posts.value ?? [])
    .map((p: any) => ({
      ...p,
      to: p?._path ?? p?.path,
      excerpt: normalizeExcerpt(p),
      summary: p.summary,
      description: p.description,
      tags: normalizeTags(p)
    }))
    .filter((p: any) => typeof p.to === 'string' && p.to.length > 0)
)

// URL state
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

// Paths that match the keyword within markdown body/headings
const matchedBlogPaths = computed<Set<string> | null>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return null

  const set = new Set<string>()
  for (const s of blogSections.value ?? []) {
    const content = `${(s as any)?.title ?? ''} ${(s as any)?.content ?? ''}`.toLowerCase()
    if (content.includes(q)) {
      const p = (s as any)?.path
      if (typeof p === 'string' && p.length) set.add(p)
    }
  }
  return set
})

// Filter logic
const filteredPosts = computed(() => {
  let result = allPosts.value

  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  if (selectedTags.value.length) {
    result = result.filter(p =>
      selectedTags.value.every(tag => (p.tags ?? []).includes(tag))
    )
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    const bodyMatches = matchedBlogPaths.value

    result = result.filter(p => {
      // Frontmatter/metadata match (your current behavior)
      const haystack =
        `${p.title ?? ''} ${p.summary ?? ''} ${p.description ?? ''} ${(p.tags ?? []).join(' ')} ${p.category ?? ''}`.toLowerCase()

      // Markdown body/headings match
      const inBody = bodyMatches ? bodyMatches.has(p.to as string) : false

      return haystack.includes(q) || inBody
    })
  }

  // Optional: sort newest first if dates exist
  result = [...result].sort(
    (a, b) =>
      (b.date ?? '').localeCompare(a.date ?? '') ||
      (a.title ?? '').localeCompare(b.title ?? '')
  )

  return result
})

// Chip actions
function clearAll() { router.push({ query: {} }) }
function clearCategory() {
  const next = { ...query.value }
  delete next.category
  router.push({ query: next })
}
function removeTag(tag: string) {
  const nextTags = selectedTags.value.filter(t => t !== tag)
  const next = { ...query.value }
  if (nextTags.length) next.tag = nextTags
  else delete next.tag
  router.push({ query: next })
}
function clearSearch() {
  const next = { ...query.value }
  delete next.q
  router.push({ query: next })
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
</script>

<template>
  <section>
    <div class="container">
      <div class="page-head">
        <h1>Blog</h1>
        <p class="page-subtitle">Posts and updates.</p>
      </div>

      <div class="results-bar">
        <div class="summary">
          <strong>{{ filteredPosts.length }}</strong>
          <span>result<span v-if="filteredPosts.length !== 1">s</span></span>

          <span v-if="selectedCategory" class="muted">
            in <strong>{{ selectedCategory }}</strong>
          </span>

          <span v-if="selectedTags.length" class="muted">
            tagged <strong>{{ selectedTags.join(', ') }}</strong>
          </span>

          <span v-if="searchQuery" class="muted">
            for “<strong>{{ searchQuery }}</strong>”
          </span>
        </div>

        <div v-if="selectedCategory || selectedTags.length || searchQuery" class="chips">
          <button v-if="selectedCategory" class="chip" @click="clearCategory">
            Category: {{ selectedCategory }} ✕
          </button>

          <button v-for="t in selectedTags" :key="t" class="chip" @click="removeTag(t)">
            Tag: {{ t }} ✕
          </button>

          <button v-if="searchQuery" class="chip" @click="clearSearch">
            Search: {{ searchQuery }} ✕
          </button>

          <button class="chip clear" @click="clearAll">Clear all</button>
        </div>
      </div>

      <div class="grid-cards">
        <PreviewCard
          v-for="p in filteredPosts"
          :key="p.to"
          :to="p.to"
          :title="p.title || '(Untitled)'"
          subtitle="Blog"
          :excerpt="(p.excerpt || p.description || '')"
          :image="p.image"
          :tags="p.tags"
        />
      </div>

      <div v-if="filteredPosts.length === 0" class="empty">
        <h2>No results</h2>
        <p>Try removing a filter or using a different search term.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.results-bar { margin-top: 1rem; padding: 0.75rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.summary { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: baseline; }
.muted { opacity: 0.75; }
.chips { margin-top: 0.6rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chip { border: 1px solid var(--border); background: #f6f6f6; border-radius: 999px; padding: 0.35rem 0.6rem; cursor: pointer; font-size: 0.85rem; }
.chip:hover { background: #f0f0f0; }
.chip.clear { background: #fff; }
.empty { margin-top: 2rem; opacity: 0.9; }
</style>
