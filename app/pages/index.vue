<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: 'Welcome to my fast, modern Nuxt website.'
    }
  ]
})

const features = [
  {
    title: 'Library',
    subtitle: 'Browse everything',
    excerpt: 'Search and filter across pages and posts.',
    to: '/library',
    image: '/images/AL-Symbol2a.png'
  },
  {
    title: 'Blog',
    subtitle: 'Posts and updates',
    excerpt: 'Read notes, updates, and ongoing work.',
    to: '/blog',
    image: '/images/AL-Symbol2a.png'
  },
  {
    title: 'About',
    subtitle: 'What this is',
    excerpt: 'Learn what we’re building and how it’s structured.',
    to: '/about',
    image: '/images/AL-Symbol2a.png'
  },
  {
    title: 'Start here',
    subtitle: 'Site map',
    excerpt: 'Use this page as the landing map into the rest of the site.',
    to: '/library',
    image: '/images/AL-Symbol2a.png'
  }
]
</script>

<template>
  <section class="hero">
    <div class="container">
      <div class="page-head">
        <h1>Welcome to My Nuxt Site</h1>
        <p class="muted">
          This site is built with Nuxt Content — fast pages, searchable content,
          and a clean navigation structure.
        </p>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="container">
      <FeatureCard
        v-for="f in features"
        :key="f.to"
        :to="f.to"
        :title="f.title"
        :subtitle="f.subtitle"
        :excerpt="f.excerpt"
        :image="f.image"
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-bottom: 1.5rem;
  text-align: center;
}

.features .container {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 900px) {
  .features .container {
    grid-template-columns: 1fr;
  }
}
</style>
