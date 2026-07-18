<script setup lang="ts">
import type { Product } from '~/data/catalog'

const props = withDefaults(defineProps<{ product: Product; compact?: boolean }>(), { compact: false })

const { coverUrl } = useCatalog()
const staticCover = computed(() => coverUrl(props.product, 'M'))

// Only reach for a live cover if there's no static one already.
const { image: liveCover } = staticCover.value
  ? { image: ref<string | null>(null) }
  : useLiveCover(props.product.links)

const cover = computed(() => staticCover.value ?? liveCover.value ?? undefined)
const imgFailed = ref(false)
</script>

<template>
  <AppCard :to="`/catalog/${product.slug}`" class="product-card sheen-hover" :class="{ compact }">
    <div class="row">
      <div class="cover" :class="{ placeholder: !cover || imgFailed }">
        <img
          v-if="cover && !imgFailed"
          :src="cover"
          :alt="product.title"
          loading="lazy"
          @error="imgFailed = true"
        />
        <img
          v-else
          src="/images/rc-book-not-found.png"
          alt=""
          aria-hidden="true"
          class="cover-glyph-img"
        />
      </div>

      <div class="body">
        <div class="head">
          <h3 class="title">{{ product.title }}</h3>
          <span class="badge-cat" :data-cat="product.category">{{ product.category }}</span>
        </div>

        <p class="maker">{{ product.maker }}</p>
        <p v-if="!compact" class="blurb">{{ product.blurb }}</p>

        <div class="meta">
          <span v-if="product.status" class="badge-status" :data-status="product.status">
            {{ product.status === 'favorite' ? 'Crow Favorite'
              : product.status === 'wishlist' ? 'Wishlist'
              : product.status === 'crowdfunded' ? 'Crowdfunding now'
              : '' }}
          </span>
          <span v-if="product.contentWarning" class="badge-cw">CW</span>
          <span v-if="product.price != null" class="price">${{ product.price.toFixed(2) }}</span>
          <template v-if="!compact">
            <TagBadge v-for="t in product.tags.slice(0, 3)" :key="t">{{ t }}</TagBadge>
          </template>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.cover {
  width: 96px;
  height: 128px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--surface-2);
  display: grid;
  place-items: center;
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
  width:85%;
  height: 85%;
  object-fit: contain;
  opacity: 0.85;
}

.body {
  min-width: 0;
}

.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-size: 1.05rem;
}

.maker {
  margin: 0.2rem 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.blurb {
  margin: 0.6rem 0 0;
  color: var(--muted);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.meta {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.price {
  font-weight: 700;
  color: var(--accent-3);
}

@media (max-width: 480px) {
  .row {
    grid-template-columns: 72px minmax(0, 1fr);
  }
  .cover {
    width: 72px;
    height: 96px;
  }
}

/* Compact mode: for dense featured strips (e.g. the catalog page's
   "Featured" row) where a full blurb + tag list would make each card
   too tall for a tight grid. Smaller cover, no blurb, no tags — just
   enough to identify the item and invite a click. */
.product-card.compact .row { grid-template-columns: 64px minmax(0, 1fr); gap: 0.75rem; }
.product-card.compact .cover { width: 64px; height: 86px; }
.product-card.compact .title { font-size: 0.95rem; }
.product-card.compact .maker { font-size: 0.82rem; }
.product-card.compact .meta { margin-top: 0.4rem; }

</style>
