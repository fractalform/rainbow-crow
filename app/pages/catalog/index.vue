<script setup lang="ts">
useHead({
  title: 'Catalog',
  meta: [{ name: 'description', content: 'Books, board games, RPGs, CCGs, zines, tarot, and accessories the Rainbow Crow community loves — with links to go buy or learn more.' }]
})

const route = useRoute()
const router = useRouter()
const query = computed(() => route.query ?? {})

const { getProducts, getCategories, getTags } = useCatalog()

const selectedCategory = computed(() => {
  const c = query.value.category
  return typeof c === 'string' ? c : undefined
})
const selectedTags = computed<string[]>(() => {
  const t = query.value.tag
  const raw = Array.isArray(t) ? t : typeof t === 'string' ? [t] : []
  return raw.filter((x): x is string => typeof x === 'string' && x.length > 0)
})
const searchQuery = computed(() => {
  const q = query.value.q
  return typeof q === 'string' ? q : ''
})

const { data: items } = await useAsyncData(
  'shop-products',
  () => getProducts({ category: selectedCategory.value, tags: selectedTags.value, q: searchQuery.value }),
  { watch: [selectedCategory, selectedTags, searchQuery] }
)
const { data: categories } = await useAsyncData('shop-categories', () => getCategories())

// Tags are scoped to the selected category so the chip row only ever
// shows genres that make sense for it (no "skirmish" under
// Accessories). With no category selected, every tag is shown.
const { data: tags } = await useAsyncData(
  'shop-tags',
  () => getTags(selectedCategory.value),
  { watch: [selectedCategory] }
)

function pushQuery(next: Record<string, any>) { router.push({ query: next }) }

function setSearch(value: string) {
  const next = { ...query.value }
  const v = value.trim()
  if (v) next.q = v; else delete next.q
  pushQuery(next)
}
function toggleCategory(cat: string) {
  const next = { ...query.value }
  if (selectedCategory.value === cat) delete next.category
  else next.category = cat
  delete next.tag // tags are category-scoped, so clear stale selections
  pushQuery(next)
}
function toggleTag(tag: string) {
  const current = selectedTags.value
  const nextTags = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
  const next = { ...query.value }
  if (nextTags.length) next.tag = nextTags; else delete next.tag
  pushQuery(next)
}
function clearAll() { pushQuery({}) }

const hasFilters = computed(() => !!selectedCategory.value || selectedTags.value.length > 0 || !!searchQuery.value)
</script>

<template>
  <section>
    <div class="container">
      <div class="page-head">
        <h1>Catalog</h1>
        <p class="page-subtitle">
          Books, games, and the stuff that goes with them, curated by the Rainbow Crow
          community and the team behind it. Find something here or show us what we're missing, then come talk about
          it with us <NuxtLink to="/community">in the community</NuxtLink>.
        </p>
      </div>

      <div class="filters ui-card">
        <input class="search ui-input" type="text" placeholder="Search the catalog…" :value="searchQuery"
          @input="setSearch(($event.target as HTMLInputElement).value)" />

        <div class="chip-row" role="group" aria-label="Categories">
          <button v-for="cat in categories ?? []" :key="cat" class="ui-chip" :class="{ active: selectedCategory === cat }" @click="toggleCategory(cat)">
            {{ cat }}
          </button>
        </div>

        <div class="chip-row" role="group" aria-label="Tags">
          <button v-for="t in tags ?? []" :key="t" class="ui-chip small" :class="{ active: selectedTags.includes(t) }" @click="toggleTag(t)">
            {{ t }}
          </button>
        </div>
      </div>

      <div class="results-bar">
        <div class="summary">
          <strong>{{ (items ?? []).length }}</strong>
          <span>item<span v-if="(items ?? []).length !== 1">s</span></span>
          <span v-if="selectedCategory" class="muted">in <strong>{{ selectedCategory }}</strong></span>
          <span v-if="selectedTags.length" class="muted">tagged <strong>{{ selectedTags.join(', ') }}</strong></span>
          <span v-if="searchQuery" class="muted">for "<strong>{{ searchQuery }}</strong>"</span>
        </div>
        <button v-if="hasFilters" class="ui-chip" @click="clearAll">Clear all ✕</button>
      </div>

      <div class="grid-cards">
        <ProductCard v-for="p in items ?? []" :key="p.slug" :product="p" />
      </div>

      <div v-if="(items ?? []).length === 0" class="empty">
        <h2>Nothing in the nest</h2>
        <p class="muted">Try removing a filter — or tell us what you're hunting for and we'll track it down.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filters { margin-top: 1rem; padding: 1rem; display: grid; gap: 0.75rem; }
.chip-row { display: flex; flex-wrap: wrap; gap: 0.45rem; }
.ui-chip.active { background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 750; }
.ui-chip.small { font-size: 0.78rem; padding: 0.25rem 0.5rem; }
.results-bar { margin-top: 1rem; padding: 0.75rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; }
.summary { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: baseline; }
.empty { margin-top: 2rem; }
</style>
