// server/api/link-preview.get.ts
//
// Live cover art, sourced from wherever you already link to (BGG or
// itch.io), the same way Slack/Discord "unfurl" a link preview.
//
// Usage from the client: /api/link-preview?url=<the game's page URL>
// Returns: { image: string | null }
//
// IMPORTANT — why this only allowlists two domains:
//   - boardgamegeek.com game pages are server-rendered HTML with a
//     normal <meta property="og:image"> tag. This works reliably.
//   - itch.io game pages are also server-rendered and put the cover
//     image directly in the page. This works reliably.
//   - drivethrurpg.com does NOT work — its product pages render the
//     cover client-side via JavaScript, so a server-side fetch never
//     sees the image. There's no clean fix short of running a full
//     headless browser, which isn't worth it for cover art. For
//     DriveThru-only RPGs, set a manual `image:` in catalog.ts
//     instead (same pattern as books).
//
// The domain allowlist below also exists so this route can't be used
// as an open proxy to fetch arbitrary URLs — only doubles as an
// unfurl service for sites we've verified.

// BGG dropped: its pages sit behind intermittent Cloudflare
// bot-detection (confirmed by inconsistent real-world results —
// some covers loaded, some didn't, no pattern). Board game covers
// now come from Board Game Atlas at add-time instead (see
// /admin/add-game), stored as a stable `image` field. itch.io has
// no such protection and has been reliable.
const ALLOWED_HOSTS = ['itch.io']

function isAllowedHost(hostname: string): boolean {
  return ALLOWED_HOSTS.some(h => hostname === h || hostname.endsWith(`.${h}`))
}

function extractImage(html: string): string | null {
  // og:image (BGG) — attribute order can vary, so match both ways
  let m =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  if (m) return m[1]

  // twitter:image fallback
  m =
    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)
  if (m) return m[1]

  // itch.io fallback: first <img> on the page, which is reliably the cover
  m = html.match(/<img[^>]+src=["']([^"']+img\.itch\.zone[^"']+)["']/i)
  if (m) return m[1]

  return null
}

export default defineCachedEventHandler(
  async (event): Promise<{ image: string | null }> => {
    const target = getQuery(event).url
    if (typeof target !== 'string' || !target) {
      throw createError({ statusCode: 400, statusMessage: 'Missing url' })
    }

    let parsed: URL
    try {
      parsed = new URL(target)
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'Invalid url' })
    }

    if (!isAllowedHost(parsed.hostname)) {
      throw createError({ statusCode: 400, statusMessage: 'Domain not allowed' })
    }

    const res = await fetch(parsed.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; RainbowCrow/1.0; +https://rainbowcrow.net) LinkPreviewBot'
      }
    })

    if (!res.ok) {
      throw createError({ statusCode: 502, statusMessage: `Upstream responded with ${res.status}` })
    }

    const html = await res.text()
    return { image: extractImage(html) }
  },
  {
    maxAge: 60 * 60 * 24 * 14, // covers essentially never change — cache 2 weeks
    swr: true,
    name: 'link-preview',
    getKey: e => String(getQuery(e).url ?? 'none')
  }
)
