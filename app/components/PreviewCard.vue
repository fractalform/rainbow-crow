<template>
  <AppCard :to="props.to" class="preview" :class="{ 'no-thumb': !props.image }">

    <div v-if="image" class="thumb">
      <img :src="image" :alt="title" />
    </div>

    <div class="card-content">
      <div class="top">
        <h3 class="title">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>

      <p class="excerpt">{{ excerpt }}</p>

      <div v-if="tags?.length" class="tags">
        <TagBadge v-for="t in tags" :key="t">{{ t }}</TagBadge>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  to?: string
  title: string
  excerpt: string
  subtitle?: string
  image?: string
  tags?: string[]
}>()
</script>

<style scoped>
.preview {
  display: grid;
  gap: 1rem;
  grid-template-columns: 84px minmax(0, 1fr);
}

/* If AppCard renders an <a>, hover still feels good via this wrapper */
.preview :deep(*) {
  transition: transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out);
}

.preview:hover {
  transform: translateY(-2px);
}

.preview.no-thumb {
  grid-template-columns: 1fr;
}

.thumb {
  width: 84px;
  height: 84px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: linear-gradient(180deg, #f2f2f2, #eaeaea);
  box-shadow: var(--shadow-sm);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-content {
  min-width: 0;
}

.title {
  font-size: 1.05rem;
  margin: 0;
}

.subtitle {
  margin: 0.2rem 0 0 0;
  opacity: 0.7;
  font-size: 0.9rem;
}

.excerpt {
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
  line-clamp: 3; /* standard property */

  overflow: hidden;
}

.tags {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

</style>