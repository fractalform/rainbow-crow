<script setup lang="ts">
const route = useRoute()

/**
 * Build the collection path explicitly.
 * For catch-all routes:
 * - /about -> params.slug = ["about"]
 * - /docs/getting-started -> ["docs", "getting-started"]
 * - / -> undefined (but this file usually won’t match /)
 */
const contentPath = computed(() => {
  const parts = route.params.slug
  if (!parts) return '/'
  const segs = Array.isArray(parts) ? parts : [parts]
  return `/${segs.join('/')}`
})

const { data: page, pending } = await useAsyncData(
  () => `page:${contentPath.value}`,
  async () => {
    const doc = await queryCollection('pages').path(contentPath.value).first()
    if (!doc) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }
    return doc
  },
  { watch: [() => route.params.slug] }
)

// Head is safe; when page is loaded it updates.
useHead(() => ({
  title: page.value?.title || 'Page',
  meta: [
    {
      name: 'description',
      content:
        page.value?.description ||
        page.value?.summary ||
        page.value?.excerpt ||
        ''
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
        <h1>{{ page!.title }}</h1>
        <ContentRenderer :value="page!" />
      </div>
    </div>
  </section>
</template>
