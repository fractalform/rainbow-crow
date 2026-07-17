<script setup lang="ts">
const route = useRoute()
const contentPath = computed(() => `/events/${route.params.slug}`)

const { data: event, pending } = await useAsyncData(
  () => `event:${String(route.params.slug)}`,
  async () => {
    const doc = await queryCollection('events').path(contentPath.value).first()
    if (!doc) throw createError({ statusCode: 404, statusMessage: 'Event not found' })
    return doc
  },
  { watch: [() => route.params.slug] }
)

const formattedDate = computed(() => {
  const d = event.value?.date
  if (!d || typeof d !== 'string') return ''
  const dt = new Date(d + 'T00:00:00')
  if (Number.isNaN(dt.getTime())) return d
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(dt)
})

useHead(() => ({
  title: event.value?.title || 'Event',
  meta: [{ name: 'description', content: event.value?.blurb || '' }]
}))
</script>

<template>
  <section>
    <div class="container">
      <div v-if="pending" class="prose"><p class="muted">Loading…</p></div>
      <div v-else class="prose">
        <img v-if="event!.image" :src="event!.image as string" :alt="event!.title" class="hero-image" />
        <h1>{{ event!.title }}</h1>
        <p class="meta">
          {{ formattedDate }}<template v-if="event!.time"> · {{ event!.time }}</template>
          <template v-if="event!.location"> · {{ event!.location }}</template>
        </p>
        <ContentRenderer :value="event!" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-image { width: 100%; max-height: 420px; object-fit: cover; border-radius: var(--radius); border: 1px solid var(--border); margin-bottom: 1.5rem; }
</style>
