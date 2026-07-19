<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useHead({
  title: 'Home',
  meta: [{ name: 'description', content: 'Rainbow Crow — a queer-friendly books & games shop and community. RPGs, board games, CCGs, books, zines, tarot, and the people who love them.' }]
})

const features = [
  { title: 'About', subtitle: 'What is "Rainbow Crow"?', excerpt: 'The story of Rainbow Crow Books & Games, our dreams and goals.', to: '/about', image: '/images/RC_About.png' },
  { title: 'Community', subtitle: 'The flock', excerpt: 'Game nights, the Discord, local events, and what the hobby is playing right now.', to: '/community', image: '/images/RC_Community.png' },
  { title: 'Blog', subtitle: 'From the nest', excerpt: 'Latest interests, recommendations, Crow news, and notes on games worth your table time.', to: '/blog', image: '/images/RC_Blog.png' },
  { title: 'Catalog', subtitle: 'Books, Games, and More', excerpt: 'RPGs, board games, CCGs, books, zines, tarot, dice — curated, not algorithmic.', to: '/catalog', image: '/images/RC_Catalog.png' }
]

const { getFeatured } = useCatalog()
const { data: featured } = await useAsyncData('home-featured', () => getFeatured(9))
</script>

<template>
  <section class="hero">
    <div class="container">
      <div class="page-head">
        <h1><span class="rainbow-text">Rainbow Crow</span></h1>
        <p class="tagline">Books & Games</p>
        <p class="muted intro">
          Central Vermont's epic gathering site for books, zines, board games, tabletop RPGs,
          CCGs, tarot, gaming accessories — and the people who love them. We are a pop-up hub with a lot of ideas but without a brick-and-mortar (for now).
        </p>
      </div>
      <hr class="rainbow-rule hero-rule" />
    </div>
  </section>

  <section class="features">
    <div class="container">
      <FeatureCard v-for="f in features" :key="f.to" :to="f.to" :title="f.title" :subtitle="f.subtitle" :excerpt="f.excerpt" :image="f.image" />
    </div>
  </section>

  <section v-if="featured?.length" class="featured">
    <div class="container">
      <div class="page-head">
        <h2>From the catalog</h2>
        <p class="page-subtitle">A few things we're excited about right now.</p>
      </div>
      <div class="grid-cards">
        <ProductCard v-for="p in featured" :key="p.slug" :product="p" />
      </div>
      <p class="see-all"><NuxtLink to="/catalog" class="btn-out">Browse the whole catalog →</NuxtLink></p>
    </div>
  </section>
</template>

<style scoped>
.hero { padding-bottom: 0.5rem; text-align: center; }
.hero h1 { font-size: clamp(5.6rem, 10vw, 9.6rem); margin-bottom: -1rem; }
.tagline { margin: 0 0 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; font-family: var(--font-title-2); font-size: 2.35rem; color: var(--muted); }
.intro { max-width: 56ch; margin: 0 auto; }
.hero-rule { max-width: 320px; margin: 1.5rem auto 0; }
.features .container { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
@media (max-width: 900px) { .features .container { grid-template-columns: 1fr; } }
.featured { padding-top: 0; }
.see-all { margin-top: 1.5rem; text-align: center; }
@media (max-width: 480px) {
  .hero h1 { font-size: 2.4rem; letter-spacing: 0; }
  .tagline { font-size: 1.3rem; }
}
</style>
