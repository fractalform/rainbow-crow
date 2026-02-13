<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
  excerpt: string
  to?: string
  image?: string
  imageAlt?: string
}>()
</script>

<template>
  <AppCard :to="props.to" class="feature" :class="{ 'no-thumb': !props.image }">
    <div class="inner">
      <div v-if="props.image" class="thumb">
        <img :src="props.image" :alt="props.imageAlt || props.title" />
      </div>

      <div class="content">
        <div class="top">
          <h3 class="title">{{ props.title }}</h3>
          <p v-if="props.subtitle" class="subtitle">{{ props.subtitle }}</p>
        </div>

        <p class="excerpt">{{ props.excerpt }}</p>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
/* Layout: thumbnail + content */
.inner {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.no-thumb .inner {
  grid-template-columns: 1fr;
}

.thumb {
  width: 84px;
  height: 84px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #f2f2f2;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.content {
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.2;
}

.subtitle {
  margin: 0.35rem 0 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.excerpt {
  margin: 0.85rem 0 0 0;
  color: var(--muted);
  line-height: 1.45;
}
</style>
