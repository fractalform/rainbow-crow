// server/routes/feed.xml.ts
//
// A single combined RSS feed covering both blog posts and events —
// one feed URL for an RSS-to-email service (e.g. Buttondown) to
// watch, so writing a blog post or adding an event notifies
// subscribers automatically with no separate "send a newsletter"
// step. Event items are prefixed "Event:" in the title so they're
// distinguishable from blog posts at a glance in an inbox or reader.
//
// Reachable at https://rainbowcrow.net/feed.xml
//
// Note on server-side content queries: queryCollection() needs the H3
// `event` passed as its first argument here — that's specific to
// server routes. The Vue pages elsewhere in this app call
// queryCollection('name') without it; only server-side code needs it.

const SITE_URL = 'https://rainbowcrow.net'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function toRfc822(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z') // noon UTC avoids timezone date-shift for date-only strings
  if (Number.isNaN(d.getTime())) return new Date().toUTCString()
  return d.toUTCString()
}

type FeedItem = {
  title: string
  link: string
  description: string
  pubDate: string
}

export default defineEventHandler(async (event) => {
  const blogDocs = await queryCollection(event, 'blog').order('date', 'DESC').all()
  const eventDocs = await queryCollection(event, 'events').order('date', 'DESC').all()

  const items: FeedItem[] = []

  for (const doc of blogDocs as any[]) {
    const path = doc?._path ?? doc?.path
    if (typeof path !== 'string' || !path) continue
    items.push({
      title: doc.title ?? '(Untitled)',
      link: `${SITE_URL}${path}`,
      description: doc.summary ?? doc.excerpt ?? doc.description ?? '',
      pubDate: toRfc822(doc.date ?? '')
    })
  }

  for (const doc of eventDocs as any[]) {
    const path = doc?._path ?? doc?.path
    if (typeof path !== 'string' || !path) continue
    const when = [doc.time, doc.location].filter(Boolean).join(' · ')
    items.push({
      title: `Event: ${doc.title ?? '(Untitled)'}`,
      link: `${SITE_URL}${path}`,
      description: [doc.blurb, when].filter(Boolean).join(' — '),
      pubDate: toRfc822(doc.date ?? '')
    })
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const itemsXml = items
    .map(
      item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
    </item>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rainbow Crow</title>
    <link>${SITE_URL}</link>
    <description>Books, games, and events from the Rainbow Crow community — blog posts and upcoming events in one feed.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${itemsXml}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return xml
})
