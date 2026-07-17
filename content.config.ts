import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: { include: 'blog/**' },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        summary: z.string().optional(),
        excerpt: z.string().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string().optional(),
        date: z.string().optional(),
        image: z.string().optional(),
        nav: z.boolean().optional(),
        navTitle: z.string().optional(),
        navOrder: z.number().optional(),
        navParent: z.string().optional()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: { include: 'pages/**', prefix: '/' },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        summary: z.string().optional(),
        excerpt: z.string().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string().optional(),
        date: z.string().optional(),
        image: z.string().optional(),
        nav: z.boolean().optional(),
        navTitle: z.string().optional(),
        navOrder: z.number().optional(),
        navParent: z.string().optional()
      })
    }),
    events: defineCollection({
      type: 'page',
      source: { include: 'events/**', prefix: '/events' },
      schema: z.object({
        title: z.string(),
        date: z.string(),
        time: z.string().optional(),
        location: z.string().optional(),
        blurb: z.string().optional(),
        image: z.string().optional()
      })
    })
  }
})
