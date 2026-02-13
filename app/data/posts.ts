export type Post = {
  title: string
  slug: string
  excerpt: string
  tags: string[]
  category: 'Blog' | 'Tutorial' | 'Notes'
  date: string
  image?: string
}

export const posts: Post[] = [
  {
    title: 'First Post',
    slug: 'first-post',
    excerpt: 'A test post to see how the excerpt looks and functions.',
    tags: ['nuxt', 'blog'],
    category: 'Blog',
    date: '2026-02-06',
    image: '/images/AL-Symbol2a.png'
  }
]