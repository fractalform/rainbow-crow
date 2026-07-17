<script setup lang="ts">
const route = useRoute()
const contentPath = computed(() => `/blog/${route.params.slug}`)

const { data: post, pending } = await useAsyncData(
  () => `blog:${String(route.params.slug)}`,
  async () => {
    const doc = await queryCollection('blog').path(contentPath.value).first()
    if (!doc) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    return doc
  },
  { watch: [() => route.params.slug] }
)

const formattedDate = computed(() => {
  const d = post.value?.date
  if (!d || typeof d !== 'string') return ''
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return d
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(dt)
})

useHead(() => ({
  title: post.value?.title || 'Post',
  meta: [{ name: 'description', content: post.value?.description || post.value?.summary || post.value?.excerpt || '' }]
}))
</script>

<template>
  <section>
    <div class="container">
      <div v-if="pending" class="prose"><p class="muted">Loading…</p></div>
      <div v-else class="prose">
        <img v-if="post!.image" :src="post!.image as string" :alt="post!.title" class="hero-image" />
        <h1>{{ post!.title }}</h1>
        <p v-if="formattedDate" class="meta">{{ formattedDate }}</p>
        <ContentRenderer :value="post!" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-image { width: 100%; max-height: 420px; object-fit: cover; border-radius: var(--radius); border: 1px solid var(--border); margin-bottom: 1.5rem; }
</style>
