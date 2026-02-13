// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/content'],
  app: {
    head: {
      titleTemplate: '%s · My Nuxt Website',
      meta: [
        { name: 'description', content: 'A fast site built with Nuxt.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
