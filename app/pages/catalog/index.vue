<script setup lang="ts">
useHead({
  title: 'Catalog',
  meta: [{ name: 'description', content: 'Books, board games, RPGs, CCGs, zines, tarot, and accessories the Rainbow Crow community loves — with links to go buy or learn more.' }]
})

const route = useRoute()
const router = useRouter()
const query = computed(() => route.query ?? {})

const { getProducts, getCategories, getGroupedTags, getFeatured } = useCatalog()

const selectedCategories = computed<string[]>(() => {
  const c = query.value.category
  const raw = Array.isArray(c) ? c : typeof c === 'string' ? [c] : []
  return raw.filter((x): x is string => typeof x === 'string' && x.length > 0)
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
  () => getProducts({ category: selectedCategories.value, tags: selectedTags.value, q: searchQuery.value }),
  { watch: [selectedCategories, selectedTags, searchQuery] }
)
const { data: categories } = await useAsyncData('shop-categories', () => getCategories())
const { data: featured } = await useAsyncData('shop-featured', () => getFeatured(6))

// Tags are scoped to the selected category so the chip rows only ever
// show genres that make sense for it (no "skirmish" under
// Accessories). With no category selected, every tag is shown.
// Grouped into labeled sections (Genre & Theme, Mechanics & Systems,
// etc.) rather than one long undifferentiated row — see
// app/data/tagGroups.ts for the grouping.
const { data: tagGroups } = await useAsyncData(
  'shop-tag-groups',
  () => getGroupedTags(selectedCategories.value),
  { watch: [selectedCategories] }
)

function pushQuery(next: Record<string, any>) { router.push({ query: next }) }

function setSearch(value: string) {
  const next = { ...query.value }
  const v = value.trim()
  if (v) next.q = v; else delete next.q
  pushQuery(next)
}
function toggleCategory(cat: string) {
  const current = selectedCategories.value
  const nextCats = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat]
  const next = { ...query.value }
  if (nextCats.length) next.category = nextCats; else delete next.category
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

const hasFilters = computed(() => selectedCategories.value.length > 0 || selectedTags.value.length > 0 || !!searchQuery.value)

// Which tag groups are currently expanded (showing their chips). Purely
// a display toggle — has no bearing on which tags are actually
// selected as filters, so collapsing a group never clears a filter
// hiding inside it (see the "active" check below, which keeps that
// visible even while collapsed).
const openGroups = ref<Set<string>>(new Set())
function toggleGroup(label: string) {
  const next = new Set(openGroups.value)
  if (next.has(label)) next.delete(label); else next.add(label)
  openGroups.value = next
}
function groupHasActiveTag(tags: string[]) {
  return tags.some(t => selectedTags.value.includes(t))
}
</script>

<template>
  <section>
    <div class="container">
      <div class="page-head">
        <h1>Catalog</h1>
        <p class="page-subtitle">
          <strong>Books, games, and the stuff that goes with them</strong> — curated by the Rainbow Crow
          community and the team behind it. 
          
          At the top of this page are our main picks this week. Find the full curated catalog below. 
          Scroll down, browse around, find something you like, then come <NuxtLink to="/community">talk about it with us</NuxtLink>!
        </p>
      </div>
      <div v-if="featured?.length" class="featured-strip">
        <h2 class="featured-heading">This week's picks</h2>
        <div class="grid-cards compact-grid">
          <ProductCard v-for="p in featured" :key="p.slug" :product="p" compact />
        </div>
      </div>

      <div class="filters ui-card">
        <input class="search ui-input" type="text" placeholder="Search the catalog…" :value="searchQuery"
          @input="setSearch(($event.target as HTMLInputElement).value)" />

        <div class="chip-row" role="group" aria-label="Categories">
          <button v-for="cat in categories ?? []" :key="cat" class="badge-cat cat-filter" :data-cat="cat" :class="{ active: selectedCategories.includes(cat) }" @click="toggleCategory(cat)">
            {{ cat }}
          </button>
        </div>

        <div class="chip-row group-toggles" role="group" aria-label="Tag categories">
          <button v-for="group in tagGroups ?? []" :key="group.label" class="ui-chip group-toggle"
            :class="{ 'has-active': groupHasActiveTag(group.tags), open: openGroups.has(group.label) }"
            @click="toggleGroup(group.label)">
            {{ group.label }} <span class="count">{{ group.tags.length }}</span>
          </button>
        </div>

        <div v-for="group in (tagGroups ?? []).filter(g => openGroups.has(g.label))" :key="group.label" class="chip-row tag-group-open" role="group" :aria-label="group.label">
          <button v-for="t in group.tags" :key="t" class="ui-chip small" :class="{ active: selectedTags.includes(t) }" @click="toggleTag(t)">
            {{ t }}
          </button>
        </div>
      </div>

      <div class="results-bar">
        <div class="summary">
          <strong>{{ (items ?? []).length }}</strong>
          <span>item<span v-if="(items ?? []).length !== 1">s</span></span>
          <span v-if="selectedCategories.length" class="muted">in <strong>{{ selectedCategories.join(', ') }}</strong></span>
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
.featured-strip { margin-top: 1.5rem; }
.featured-heading { margin: 0 0 0.75rem; font-size: 1.5rem; }
.compact-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.75rem; }
.filters { margin-top: 1rem; padding: 1rem; display: grid; gap: 0.75rem; }
.chip-row { display: flex; flex-wrap: wrap; gap: 0.45rem; }
.ui-chip.active { background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 750; }
.ui-chip.small { font-size: 0.78rem; padding: 0.25rem 0.5rem; }

/* Category filter pills reuse .badge-cat's exact look (rounded
   rectangle, all-caps, per-category color) from main.css for their
   RESTING state, so they match the little category markers on
   catalog cards precisely. "Selected" fills solid in that SAME
   category's own color rather than a single generic highlight — with
   every category visible/selected at once, the row reads as a
   rainbow across the pills, which fits the whole site's identity. */
.cat-filter { cursor: pointer; transition: transform var(--dur-1) var(--ease-out), background var(--dur-1) var(--ease-out); }
.cat-filter:hover { transform: translateY(-1px) rotate(-1deg); }
.cat-filter.active[data-cat="Books"]          { background: var(--accent-warm); color: var(--bg); border-color: var(--accent-warm); }
.cat-filter.active[data-cat="Graphic Novels"] { background: var(--accent-blue); color: var(--bg); border-color: var(--accent-blue); }
.cat-filter.active[data-cat="Board Games"]    { background: var(--accent-3);    color: var(--bg); border-color: var(--accent-3); }
.cat-filter.active[data-cat="RPGs"]           { background: var(--accent);      color: var(--bg); border-color: var(--accent); }
.cat-filter.active[data-cat="CCGs"]           { background: var(--accent-2);    color: var(--bg); border-color: var(--accent-2); }
.cat-filter.active[data-cat="Accessories"]    { background: var(--accent-pink); color: var(--bg); border-color: var(--accent-pink); }
.cat-filter.active[data-cat="Merch"]          { background: var(--accent-red);  color: var(--bg); border-color: var(--accent-red); }

.group-toggle { font-size: 0.85rem; }
.group-toggle .count { display: inline-block; background: rgba(45,212,191,0.18); color: var(--accent-2); font-size: 0.8em; font-weight: 750; padding: 0.05em 0.45em; border-radius: 999px; margin-left: 0.3em; }
/* A group with a selection hiding inside it, while itself collapsed —
   needs to actually stand out, not just a subtle border tint. */
.group-toggle.has-active { background: rgba(157,140,255,0.18); border-color: var(--accent); color: var(--accent); font-weight: 750; }
.group-toggle.open { background: var(--accent); color: var(--bg); border-color: var(--accent); }
.group-toggle.open .count { background: rgba(15,13,20,0.35); color: var(--bg); }

.tag-group-open { padding: 0.6rem 0.6rem 0.1rem; margin-top: -0.2rem; border-left: 2px solid var(--border); padding-left: 0.75rem; }

.results-bar { margin-top: 1rem; padding: 0.75rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; }
.summary { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: baseline; }
.empty { margin-top: 2rem; }
</style>
