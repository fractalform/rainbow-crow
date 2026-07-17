// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/content'],
  app: {
    head: {
      titleTemplate: '%s · Rainbow Crow',
      meta: [
        { name: 'description', content: 'Rainbow Crow — a queer-friendly books & games community: RPGs, board games, CCGs, books, zines, tarot, and the people who love them.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/images/rc-logo.png' },
        { rel: 'preload', href: '/fonts/Danska-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/ClementePDam-Bold.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
      ]
    }
  }
})
