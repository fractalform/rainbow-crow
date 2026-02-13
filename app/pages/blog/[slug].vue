<script setup lang="ts">
const route = useRoute()

// Build the content path explicitly (more reliable than route.path during edge cases)
const contentPath = computed(() => `/blog/${route.params.slug}`)

const { data: post, pending } = await useAsyncData(
  () => `blog:${String(route.params.slug)}`,
  async () => {
    const doc = await queryCollection('blog').path(contentPath.value).first()
    if (!doc) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }
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
  meta: [
    {
      name: 'description',
      content: post.value?.description || post.value?.summary || post.value?.excerpt || ''
    }
  ]
}))
</script>

<template>
  <section>
    <div class="container">
      <div v-if="pending" class="prose">
        <p class="muted">Loading…</p>
      </div>

      <div v-else class="prose">
        <h1>{{ post!.title }}</h1>
        <p v-if="formattedDate" class="meta">{{ formattedDate }}</p>
        <ContentRenderer :value="post!" />
      </div>
    </div>
  </section>
</template>
