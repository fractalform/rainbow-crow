import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Blog stays under /blog/*
    blog: defineCollection({
      type: 'page',
      source: {
        include: 'blog/**'
        // prefix auto-detected as "/blog" from "blog/**"
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        summary: z.string().optional(),
        excerpt: z.string().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string().optional(),
        date: z.string().optional(),
        image: z.string().optional(),
          // nav metadata
        nav: z.boolean().optional(),
        navTitle: z.string().optional(),
        navOrder: z.number().optional(),
        navParent: z.string().optional()
      })
    }),

    // Pages live in content/pages/* but route at /<slug>
    pages: defineCollection({
      type: 'page',
      source: {
        include: 'pages/**',
        // IMPORTANT: strip "/pages" from URLs by forcing prefix to "/"
        prefix: '/'
      },
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
    })
  }
})
