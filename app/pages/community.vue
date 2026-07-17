<script setup lang="ts">
import { discordInvite, googleCalendarEmbedUrl } from '~/data/community'

useHead({
  title: 'Community',
  meta: [{ name: 'description', content: 'The Rainbow Crow flock: game nights, the Discord, and local events.' }]
})

const { data: rawEvents } = await useAsyncData('community-events', () => queryCollection('events').all())

const events = computed(() =>
  (rawEvents.value ?? [])
    .map((e: any) => ({ ...e, to: e?._path ?? e?.path }))
    .filter((e: any) => typeof e.to === 'string' && e.to.length > 0)
)

const upcoming = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return events.value
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
})

const past = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return events.value
    .filter(e => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))
})

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'long', day: 'numeric' }).format(d)
}
</script>

<template>
  <section>
    <div class="container">
      <div class="page-head">
        <h1>Community</h1>
        <p class="page-subtitle">
          Rainbow Crow is a shop second and a gathering place first. Queer-friendly,
          beginner-friendly, weirdo-friendly. Come play.
        </p>
      </div>

      <hr class="rainbow-rule" />

      <div class="block ui-card sheen-hover">
        <h2>The Discord</h2>
        <template v-if="discordInvite">
          <p>The flock roosts on Discord — looking-for-group threads, event announcements, trade posts, and the off-topic channel that's mostly crow photos.</p>
          <a :href="discordInvite" target="_blank" rel="noopener" class="btn-out big">Join the Rainbow Crow Discord ↗</a>
        </template>
        <template v-else>
          <p class="muted">The Discord is hatching. The invite link will live right here the moment it's ready — check back soon, or come to a game night and we'll let you know in person.</p>
        </template>
      </div>

      <div class="block">
        <h2>Upcoming events</h2>
        <div v-if="upcoming.length" class="grid-cards">
          <AppCard v-for="e in upcoming" :key="e.to" :to="e.to" class="event sheen-hover">
            <div v-if="e.image" class="event-thumb"><img :src="e.image" :alt="e.title" /></div>
            <div class="event-body">
              <div class="event-date">{{ formatDate(e.date) }}<template v-if="e.time"> · {{ e.time }}</template></div>
              <h3 class="event-title">{{ e.title }}</h3>
              <p v-if="e.location" class="muted event-loc">{{ e.location }}</p>
              <p v-if="e.blurb" class="event-blurb">{{ e.blurb }}</p>
            </div>
          </AppCard>
        </div>
        <p v-else class="muted">Nothing on the calendar right now — the Discord hears about events first.</p>
      </div>

      <div v-if="past.length" class="block">
        <h2>Past events</h2>
        <div class="grid-cards">
          <AppCard v-for="e in past" :key="e.to" :to="e.to" class="event is-past sheen-hover">
            <div v-if="e.image" class="event-thumb"><img :src="e.image" :alt="e.title" /></div>
            <div class="event-body">
              <div class="event-date">{{ formatDate(e.date) }}<template v-if="e.time"> · {{ e.time }}</template></div>
              <h3 class="event-title">{{ e.title }}</h3>
              <p v-if="e.location" class="muted event-loc">{{ e.location }}</p>
              <p v-if="e.blurb" class="event-blurb">{{ e.blurb }}</p>
            </div>
          </AppCard>
        </div>
      </div>

      <div v-if="googleCalendarEmbedUrl" class="block">
        <h2>Calendar</h2>
        <div class="calendar-frame ui-card">
          <iframe
            :src="googleCalendarEmbedUrl"
            style="border: 0"
            width="100%"
            height="600"
            frameborder="0"
            scrolling="no"
            title="Rainbow Crow event calendar"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rainbow-rule { margin: 1.5rem 0; }
.block { margin-top: 2rem; }
.block.ui-card { padding: 1.5rem; }
.block h2 { margin-bottom: 0.5rem; }
.btn-out.big { margin-top: 0.5rem; font-size: 1rem; padding: 0.7rem 1.1rem; }
.event { display: grid; gap: 0.25rem; }
.event:has(.event-thumb) { grid-template-columns: 84px minmax(0, 1fr); gap: 1rem; align-items: start; }
.event-thumb { width: 84px; height: 84px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: var(--surface-2); }
.event-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.event-body { display: grid; gap: 0.25rem; min-width: 0; }
.event-date { font-size: 0.82rem; font-weight: 750; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent-2); }
.event-title { margin: 0; }
.event-loc, .event-blurb { margin: 0; }
.event.is-past { opacity: 0.55; filter: grayscale(0.6); }
.event.is-past .event-date { color: var(--muted); }
.event.is-past:hover { opacity: 0.8; }
.calendar-frame { overflow: hidden; padding: 0.5rem; }
.calendar-frame iframe { display: block; border-radius: calc(var(--radius) - 6px); }
</style>
