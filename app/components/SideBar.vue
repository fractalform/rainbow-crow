<script setup lang="ts">
const { nav } = useSiteNav()
const route = useRoute()
const router = useRouter()

const query = computed(() => route.query ?? {})
const showFilters = computed(() => route.path.startsWith('/blog'))

const { data: blog } = await useAsyncData('sb-blog', () => queryCollection('blog').all())
const { data: pages } = await useAsyncData('sb-pages', () => queryCollection('pages').all())

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

const allEntries = computed<any[]>(() => [...(blog.value ?? []), ...(pages.value ?? [])])

const categories = computed(() =>
  Array.from(new Set(allEntries.value.map(normalizeCategory).filter(Boolean) as string[])).sort()
)
const tags = computed(() =>
  Array.from(new Set(allEntries.value.flatMap(normalizeTags))).sort()
)

const selectedCategory = computed(() => {
  const c = query.value.category
  return typeof c === 'string' ? c : undefined
})
const selectedTags = computed<string[]>(() => {
  const t = query.value.tag
  const raw = Array.isArray(t) ? t : typeof t === 'string' ? [t] : []
  return raw.filter((x): x is string => typeof x === 'string' && x.length > 0)
})
const searchValue = computed(() => {
  const q = query.value.q
  return typeof q === 'string' ? q : ''
})

function pushQuery(next: Record<string, any>) { router.push({ query: next }) }

function setSearch(value: string) {
  const next = { ...query.value }
  const v = value.trim()
  if (v) next.q = v; else delete next.q
  pushQuery(next)
}
function toggleTag(tag: string) {
  const current = selectedTags.value
  const nextTags = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
  const next = { ...query.value }
  if (nextTags.length) next.tag = nextTags; else delete next.tag
  pushQuery(next)
}
function toggleCategory(cat: string) {
  const next = { ...query.value }
  if (selectedCategory.value === cat) delete next.category; else next.category = cat
  pushQuery(next)
}
function clearFilters() { pushQuery({}) }
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <div class="group">
        <div class="group-title">Navigation</div>
        <nav class="nav">
          <template v-for="item in nav" :key="item.to">
            <details v-if="item.children?.length" class="nav-group">
              <summary class="nav-link">{{ item.label }}</summary>
              <div class="nav-children">
                <NuxtLink v-for="child in item.children" :key="child.to" :to="child.to" class="nav-link nav-child">
                  {{ child.label }}
                </NuxtLink>
              </div>
            </details>
            <NuxtLink v-else :to="item.to" class="nav-link">{{ item.label }}</NuxtLink>
          </template>
        </nav>
      </div>

      <div v-if="showFilters" class="filter-section">
        <details open>
          <summary>Search</summary>
          <input class="search ui-input" type="text" placeholder="Search content..." :value="searchValue"
            @input="setSearch(($event.target as HTMLInputElement).value)" />
        </details>
        <details open>
          <summary>Categories</summary>
          <button v-for="cat in categories" :key="cat" class="filter-btn" :class="{ active: selectedCategory === cat }" @click="toggleCategory(cat)">
            {{ cat }}
          </button>
        </details>
        <details open>
          <summary>Tags</summary>
          <button v-for="tag in tags" :key="tag" class="filter-btn" :class="{ active: selectedTags.includes(tag) }" @click="toggleTag(tag)">
            {{ tag }}
          </button>
        </details>
        <button class="clear" @click="clearFilters">Clear filters</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-inner { padding: 1.25rem 1rem 1.25rem calc(1rem + 30px); }
.group + .group { margin-top: 1.25rem; }
.group-title { font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; opacity: 0.6; margin-bottom: 0.75rem; }
.nav { display: grid; gap: 0.35rem; }
.nav-link { padding: 0.6rem 0.7rem; border-radius: 10px; text-decoration: none; color: inherit; transition: background 120ms ease; }
.nav-link:hover { background: rgba(255,255,255,0.06); }
.nav-link.router-link-active { background: var(--ring-soft); font-weight: 600; }
.filter-section details { margin-bottom: 1rem; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); padding: 0.6rem 0.6rem; box-shadow: var(--shadow-sm); transition: box-shadow var(--dur-2) var(--ease-out); }
.filter-section details:hover { box-shadow: var(--shadow-md); }
.filter-section summary { cursor: pointer; user-select: none; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.7; font-weight: 750; padding: 0.25rem 0.25rem 0.5rem 0.25rem; }
.filter-btn { width: 100%; padding: 0.5rem 0.65rem; border-radius: 10px; border: 1px solid transparent; background: transparent; cursor: pointer; text-align: left; transition: background var(--dur-1) var(--ease-out), border-color var(--dur-1) var(--ease-out), transform var(--dur-1) var(--ease-out); color: inherit; }
.filter-btn:hover { background: rgba(255,255,255,0.06); transform: translateY(-1px); }
.filter-btn.active { background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 750; }
.clear { margin-top: 0.75rem; width: 100%; padding: 0.6rem 0.65rem; border-radius: 12px; border: 1px solid var(--border); background: var(--surface-2); cursor: pointer; color: inherit; transition: transform var(--dur-1) var(--ease-out), background var(--dur-1) var(--ease-out); }
.clear:hover { background: var(--surface-3); transform: translateY(-1px); }
.group + .filter-section { margin-top: 0.35rem; }
.nav-group summary { list-style: none; }
.nav-group summary::-webkit-details-marker { display: none; }
.nav-children { margin-top: 0.35rem; padding-left: 0.5rem; display: grid; gap: 0.35rem; }
.nav-child { opacity: 0.9; }
</style>
