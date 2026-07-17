// app/composables/useLiveCover.ts
//
// Given a product's `links` array, finds the first link pointing to a
// domain we know how to unfurl a cover image from (BGG, itch.io) and
// fetches it live through /api/link-preview. Returns null if there's
// no eligible link — callers should fall back to the placeholder.

// BGG dropped from live-cover fetching: its pages sit behind
// intermittent Cloudflare bot-detection, so covers loaded for some
// games and silently failed for others with no way to tell why.
// Board game covers now come from Board Game Atlas at add-time
// instead (see /admin/add-game) and are stored as a stable `image`.
// itch.io has no such protection and keeps working reliably.
const LIVE_COVER_HOSTS = ['itch.io']

function findCoverSourceUrl(links?: { url: string }[]): string | null {
  if (!links?.length) return null
  for (const l of links) {
    try {
      const host = new URL(l.url).hostname
      if (LIVE_COVER_HOSTS.some(h => host === h || host.endsWith(`.${h}`))) {
        return l.url
      }
    } catch {
      // ignore malformed URLs
    }
  }
  return null
}

export function useLiveCover(links?: { url: string }[]) {
  const sourceUrl = findCoverSourceUrl(links)

  const { data, status, error } = useFetch<{ image: string | null }>(
    '/api/link-preview',
    {
      query: { url: sourceUrl },
      immediate: !!sourceUrl,
      lazy: true,
      server: false,
      watch: false
    }
  )

  const image = computed(() => (sourceUrl ? data.value?.image ?? null : null))

  return { image, status, error, sourceUrl }
}
