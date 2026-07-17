<script setup lang="ts">
// /shop/[slug] — product detail. Cover comes from (in order): local
// image, Open Library (books), or a live fetch from the product's
// BGG/itch.io link (see useLiveCover). No dependency on BGG's XML API
// — that requires a registered app token we don't have yet.

const route = useRoute()
const router = useRouter()
const { getProduct, coverUrl } = useCatalog()

// The catalog's category/tag/search filters live in the URL query
// string (see catalog/index.vue), so going back to it needs to be an
// actual history pop — not a fresh push to a bare `/catalog` — or the
// filters the person had set are silently dropped. Falls back to a
// plain push only when there's no prior history to pop (e.g. someone
// landed here directly from an outside link).
function goBackToCatalog() {
  // history.state.back isn't just a flag — Vue Router's HTML5 history
  // stores the actual path of the previous entry there. Use it to check
  // WHERE back() would land, not just whether it exists: if someone
  // arrived here from the homepage's featured section (or anywhere
  // else), popping history would silently take them to the wrong page
  // even though the button says "back to the catalog". Only treat this
  // as a true back-navigation when the previous page really was the
  // catalog (filters and all); otherwise go to a fresh /catalog.
  const backPath = window.history.state?.back as string | undefined
  if (backPath && backPath.startsWith('/catalog')) {
    router.back()
  } else {
    router.push('/catalog')
  }
}

const slug = computed(() => String(route.params.slug ?? ''))

const { data: product } = await useAsyncData(
  () => `product:${slug.value}`,
  async () => {
    const p = await getProduct(slug.value)
    if (!p) {
      throw createError({ statusCode: 404, statusMessage: 'Not found in the catalog' })
    }
    return p
  },
  { watch: [slug] }
)

const staticCover = computed(() =>
  product.value ? coverUrl(product.value, 'L') : undefined
)

const { image: liveCover, status: liveCoverStatus } = useLiveCover(
  product.value?.links
)

const cover = computed(() => staticCover.value ?? liveCover.value ?? undefined)
const imgFailed = ref(false)

const statusLabel = computed(() => {
  switch (product.value?.status) {
    case 'favorite': return 'Crow Favorite'
    case 'wishlist': return 'Wishlist'
    case 'crowdfunded': return 'Crowdfunding now — back it to get it'
    default: return ''
  }
})

useHead(() => ({
  title: product.value?.title ?? 'Catalog',
  meta: [{ name: 'description', content: product.value?.blurb ?? '' }]
}))

// A "buy it" link for books, computed from the ISBN — same pattern as
// the old BGG search link: nothing stored, nothing to keep in sync.
// Bookshop.org routes sales to independent bookstores (10% of every
// sale funds a shared pool for indies; once Rainbow Crow has a
// physical storefront and an ABA membership, it can become a
// Bookstore Affiliate directly, earning 30% on anything sold through
// its own link). ISBN search occasionally fails to resolve to an
// exact page — an acceptable trade-off for zero-maintenance purchase
// links, same as itch.io/BGG covers not always loading.
const bookshopLink = computed(() => {
  if (!product.value?.isbn || product.value.hideBookshopLink) return null
  return `https://bookshop.org/beta-search?keywords=${product.value.isbn}`
})
</script>

<template>
  <section v-if="product">
    <div class="container">
      <button type="button" class="back muted" @click="goBackToCatalog">← Back to the catalog</button>

      <div class="detail">
        <!-- Cover column -->
        <div class="cover-col">
          <div class="cover" :class="{ placeholder: !cover || imgFailed }">
            <img
              v-if="cover && !imgFailed"
              :src="cover"
              :alt="product.title"
              @error="imgFailed = true"
            />
            <span v-else-if="liveCoverStatus === 'pending'" class="muted cover-loading">Fetching cover…</span>
            <img
              v-else
              src="/images/rc-book-not-found.png"
              alt=""
              aria-hidden="true"
              class="cover-glyph-img"
            />
          </div>

          <!-- Exactly what's in product.links, nothing auto-generated.
               Convention: first link = creator/developer/publisher,
               second = a distributor or rating/reference site
               (BGG, itch.io, DriveThruRPG, a bookstore, etc). -->
          <div v-if="product.links?.length || bookshopLink" class="links stack-sm">
            <a v-if="bookshopLink" :href="bookshopLink" target="_blank" rel="noopener" class="btn-out">
              Buy on Bookshop.org ↗
            </a>
            <a
              v-for="l in product.links ?? []"
              :key="l.url"
              :href="l.url"
              target="_blank"
              rel="noopener"
              class="btn-out"
            >
              {{ l.label }} ↗
            </a>
          </div>
        </div>

        <!-- Info column -->
        <div class="info">
          <div class="head">
            <span class="badge-cat" :data-cat="product.category">{{ product.category }}</span>
            <span v-if="statusLabel" class="badge-status" :data-status="product.status">{{ statusLabel }}</span>
            <span v-if="product.contentWarning" class="badge-cw" :title="product.contentWarning">CW: {{ product.contentWarning }}</span>
            <span v-if="product.price != null" class="price">${{ product.price.toFixed(2) }}</span>
          </div>

          <h1 class="title">{{ product.title }}</h1>
          <p class="maker">{{ product.maker }}</p>

          <p class="blurb">{{ product.blurb }}</p>
          <p v-if="product.description" class="description">{{ product.description }}</p>

          <div class="tags">
            <NuxtLink
              v-for="t in product.tags"
              :key="t"
              :to="{ path: '/catalog', query: { tag: t } }"
              class="tag-link"
            >
              <TagBadge>{{ t }}</TagBadge>
            </NuxtLink>
          </div>

          <p v-if="product.isbn" class="muted isbn-note">ISBN {{ product.isbn }}</p>

          <p class="muted contact-note">
            Want it, or want to talk about it? Reach out — or come find us on the
            <NuxtLink to="/community">community page</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 1rem;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-decoration: none;
}
.back:hover {
  text-decoration: underline;
}

.detail {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
}

.cover {
  width: 240px;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--surface-2);
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-md);
  padding: 0.75rem;
  text-align: center;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover.placeholder {
  background: var(--sheen), var(--surface-2);
}

.cover img.cover-glyph-img {
  width: 32%;
  height: 32%;
  object-fit: contain;
  opacity: 0.85;
}

.cover-loading {
  font-size: 0.85rem;
}

.links {
  margin-top: 1rem;
  display: grid;
  gap: 0.5rem;
}

.head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.price {
  font-weight: 800;
  color: var(--accent-3);
  font-size: 1.1rem;
}

.title {
  margin: 0;
}

.maker {
  margin: 0.35rem 0 1rem;
  color: var(--muted);
}

.blurb {
  font-size: 1.05rem;
  max-width: 65ch;
}

.description {
  color: var(--muted);
  max-width: 70ch;
}

.tags {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tag-link {
  text-decoration: none;
}

.tag-link:hover :deep(.tag) {
  border-color: var(--accent);
}

.isbn-note {
  margin-top: 1rem;
  font-size: 0.82rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.contact-note {
  margin-top: 1.5rem;
}

.contact-note a {
  color: var(--link);
  text-decoration: underline;
}

@media (max-width: 720px) {
  .detail {
    grid-template-columns: 1fr;
  }
  .cover {
    width: 200px;
  }
}
</style>
