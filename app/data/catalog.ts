// app/data/catalog.ts
//
// The pre-database catalog. This file IS the database for now.
// It's meant to stay hand-maintained — a title, a real link or two,
// and (where available) a cover. Nothing here is auto-generated.
//
// WHAT THIS CATALOG IS: Rainbow Crow doesn't run in-house retail yet.
// This is a curated list — my picks plus community
// recommendations — so people land on the site, see titles they
// already love (or discover new ones), buy them somewhere else for
// now, and come back to talk about them. Every entry should read like
// "our team/community stands behind this," not "we have this in
// stock." There's no physical inventory to track — every entry is a
// curated pick, tagged with one of three statuses: `favorite` (we've
// played/read it and love it), `wishlist` (new/hot, we want it but
// haven't played/read it yet), or `crowdfunded` (live or funded on
// Kickstarter/Gamefound/etc.). Entries not yet sorted into one of
// those carry `status: ''` — see the `ProductStatus` type.
//
// COVER IMAGES — two ways a product gets a cover, checked in order:
//   1. `image` — a direct image URL (from BGG's page, Open Library,
//      a publisher's site, wherever). Always wins if set. This is the
//      normal path — set it by hand when the entry is created.
//   2. `isbn` — Open Library fetches the cover by ISBN automatically
//      (books, and print RPGs that have one — no `image` needed).
//   A product with neither shows a placeholder until one is added.
//
// PURCHASE LINKS FOR BOOKS: any product with an `isbn` automatically
// gets a "Buy on Bookshop.org" link on its detail page — computed
// from the ISBN, nothing to store or maintain (see catalog/[slug].vue).
// Bookshop.org routes money to independent bookstores, which fits
// where this is headed — once Rainbow Crow has a physical storefront,
// it can become a Bookstore Affiliate there directly.
//
// LINKS — exactly two, by convention (for games/RPGs/CCGs — books get
// the automatic Bookshop.org link above instead, so `links` on a book
// is optional, just for a publisher/author site if worth including):
//   1. Creator/developer/publisher (Free League, Green Ronin, Tiny
//      Epic Games, Stonemaier, an author's own site, etc.)
//   2. A distributor or reference site (BoardGameGeek, itch.io,
//      DriveThruRPG, wherever someone would go to learn more or buy
//      it). Nothing here is computed or auto-linked for games — 
//      whatever's in this array is exactly what shows on the page.

export type ProductCategory =
  | 'Books'
  | 'Graphic Novels'
  | 'Board Games'
  | 'RPGs'
  | 'CCGs'
  | 'Accessories'

// `crowdfunded` — live or funded on Kickstarter/Gamefound/etc.
// Campaigns end (funded or not), so entries with this status need a
// manual revisit once that happens: swap to `favorite`/`wishlist` once
// it's actually in hand or played, or pull the entry if it didn't
// fund. Nothing automated here on purpose — campaign status isn't
// something worth building a live-fetch system around for a handful
// of entries.
export type ProductStatus =
  | 'favorite'   // Crow Favorite — we've played/read it and love it, ready to talk about
  | 'wishlist'    // new or hot, we want it but haven't played/read it yet
  | 'crowdfunded'  // live or funded on Kickstarter/Gamefound/etc.
  | ''             // untriaged — imported but not yet sorted into one of the above

export type Product = {
  slug: string
  title: string
  maker: string
  category: ProductCategory
  tags: string[]
  blurb: string
  description?: string
  /** Short label for a quick-glance red "CW" badge (e.g. "sexual violence, war")
   * — shown on both the catalog card and detail page, so people see the flag
   * BEFORE clicking in. Keep it to a few words; the actual context/explanation
   * belongs in `blurb` itself, written naturally (e.g. "A survivor's account
   * of Japanese wartime sexual slavery — heavy, important, unflinching.").
   * Optional; only set it when a book genuinely warrants one. */
  contentWarning?: string
  status: ProductStatus
  price?: number
  featured?: boolean
  /** Direct image URL, or a local file in /public/images. */
  image?: string
  /** ISBN-13 — enables an automatic Open Library cover if `image` isn't set.
   * Also powers the automatic Bookshop.org buy link — keep this set even
   * if Open Library has no cover for it (see `hideCover` below). */
  isbn?: string
  /** Set true when `isbn` is correct but Open Library has no real cover
   * scanned for it (it returns a blank placeholder image instead of a
   * 404, so the app can't detect this automatically). Skips the
   * ISBN-based cover lookup and falls straight to the themed sheen/glyph
   * placeholder, without touching the ISBN itself (still used for the
   * Bookshop.org link). Leave unset/false for every normal entry. */
  hideCover?: boolean
  /** Exactly two, by convention: [creator/publisher, distributor/reference]. */
  /** Set true when `isbn` is correct but the title doesn't actually turn
   * up a useful result on Bookshop.org (common for RPGs — Bookshop skews
   * trade-book inventory). Suppresses the auto-generated Bookshop.org
   * link without touching `isbn` itself, so the Open Library cover still
   * works. Add a DriveThruRPG (or other) link to `links` instead. Leave
   * unset/false for every normal entry. */
  hideBookshopLink?: boolean
  links?: { label: string; url: string }[]
}

export const products: Product[] = [
  // =================================================================
  // BOARD GAMES (20)
  // =================================================================
  {
    slug: 'wingspan',
    title: 'Wingspan',
    maker: 'Elizabeth Hargrave · Stonemaier Games',
    category: 'Board Games',
    tags: ['engine-builder', 'nature', '1-5 players'],
    blurb: 'The bird game. A gorgeous engine-builder about attracting birds to your wildlife preserve.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__imagepage/img/uIjeoKgHMcRtzRSR4MoUYl3nXxs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4458123.jpg',
    links: [
      { label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/266192/wingspan' },
      { label: 'Stonemaier Games', url: 'https://stonemaiergames.com/games/wingspan/' }
    ]
  },
  {
    slug: 'wyrmspan',
    title: 'Wyrmspan',
    maker: 'Connie Vogelmann · Stonemaier Games',
    category: 'Board Games',
    tags: ['engine-builder', 'dragons', '1-5 players'],
    blurb: 'Wingspan\u2019s dragon cousin. Same satisfying engine, now with a cavernous sanctuary to fill.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/cNc-FMsYo-mcRTGaXV2qcQ__imagepage/img/5kwb57Lsl5FndLl_jwTZffV83qM=/fit-in/900x600/filters:no_upscale():strip_icc()/pic8894992.jpg',
    links: [
      { label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/410201/wyrmspan' },
      { label: 'Stonemaier Games', url: 'https://stonemaiergames.com/games/wyrmspan/' }
    ]
  },
  {
    slug: 'everdell',
    title: 'Everdell',
    maker: 'James A. Wilson · Starling Games',
    category: 'Board Games',
    tags: ['worker-placement', 'nature', 'gorgeous-components'],
    blurb: 'Build a harmonious woodland city of critters, one gorgeous card at a time.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/fjE7V5LNq31yVEW_yuqI-Q__imagepage/img/ijYTk6KGtxLRdIvLsGar13ZHs4c=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3918905.png',
    links: [
      { label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/410201/wyrmspan' },
      { label: 'Starling Games', url: 'https://thestarlinggames.com/everdell' }
    ]
  },
  {
    slug: 'ark-nova',
    title: 'Ark Nova',
    maker: 'Mathias Wigge · Feuerland / Capstone Games',
    category: 'Board Games',
    tags: ['heavy', 'conservation'],
    blurb: 'Plan and build a modern, scientifically managed zoo. Deep, dense, and beloved by heavy-game fans.',
    status: 'wishlist',
    image: 'https://cf.geekdo-images.com/SoU8p28Sk1s8MSvoM4N8pQ__imagepage/img/qR1EvTSNPjDa-pNPGxU9HY2oKfs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6293412.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/342942/ark-nova' }]
  },
  {
    slug: 'root',
    title: 'Root',
    maker: 'Cole Wehrle · Leder Games',
    category: 'Board Games',
    tags: ['asymmetric', 'woodland', 'war-game-but-cute'],
    blurb: 'A game of woodland might and right. Adorable animals, ruthless asymmetric politics.',
    status: 'favorite',
    featured: true,
    image: 'https://cf.geekdo-images.com/JUAUWaVUzeBgzirhZNmHHw__imagepage/img/ZF-dta5ffawuKAkAt2LB-QTIv5M=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4254509.jpg',
    links: [
      { label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/237182/root' },
      { label: 'Leder Games', url: 'https://ledergames.com/products/root-a-game-of-woodland-might-and-right' }]
  },
  {
    slug: 'spirit-island',
    title: 'Spirit Island',
    maker: 'R. Eric Reuss · Greater Than Games',
    category: 'Board Games',
    tags: ['co-op', 'anti-colonial', 'heavy'],
    blurb: 'Cooperative settler-destruction. You are the island\u2019s spirits, and the colonizers are not welcome.',
    status: 'wishlist',
    image: 'https://cf.geekdo-images.com/kjCm4ZvPjIZxS-mYgSPy1g__imagepage/img/py7KzNjXVOuVesFZB7LwqCbvALY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic7013651.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/162886/spirit-island' }]
  },
  {
    slug: 'cascadia',
    title: 'Cascadia',
    maker: 'Randy Flynn · Flatout Games / AEG',
    category: 'Board Games',
    tags: ['tile-laying', 'nature', 'gateway'],
    blurb: 'Puzzle the Pacific Northwest together: habitats, wildlife, and very satisfying hexagons.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/kjCm4ZvPjIZxS-mYgSPy1g__imagepage/img/py7KzNjXVOuVesFZB7LwqCbvALY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic7013651.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/295947/cascadia' }]
  },
  {
    slug: 'terraforming-mars',
    title: 'Terraforming Mars',
    maker: 'Jacob Fryxelius · FryxGames',
    category: 'Board Games',
    tags: ['engine-builder', 'sci-fi', 'heavy'],
    blurb: 'Corporations race to make Mars habitable. A modern heavy-game classic.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__opengraph/img/_V1SiXfiWKPumwUOhTsU24zjaKw=/0x708:1500x1495/fit-in/1200x630/filters:strip_icc()/pic3536616.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/167791/terraforming-mars' }]
  },
  {
    slug: 'scythe',
    title: 'Scythe',
    maker: 'Jamey Stegmaier · Stonemaier Games',
    category: 'Board Games',
    tags: ['area-control', 'alt-history', 'gorgeous-components'],
    blurb: 'Alt-1920s Europa, mechs and farmland alike. Gorgeous, sprawling, and surprisingly not that mean.',
    status: 'wishlist',
    featured: true,
    image: 'https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BUZdA__opengraph/img/10P2KjknnofwYAqlJkBUXpz0I40=/0x0:4259x2236/fit-in/1200x630/filters:strip_icc()/pic3163924.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/169786/scythe' }]
  },
  {
    slug: 'brass-birmingham',
    title: 'Brass: Birmingham',
    maker: 'Martin Wallace, Gavan Brown, Matt Tolman · Roxley',
    category: 'Board Games',
    tags: ['economic', 'heavy', 'industrial-revolution'],
    blurb: 'Build canals, then railways, then an industrial empire. Widely rated among the best heavy games ever made.',
    status: 'wishlist',
    image: 'https://cf.geekdo-images.com/x3zxjr-Vw5iU4yDPg70Jgw__imagepage/img/-17KkOmxbTu2slJTabGrkO8ZW8s=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3490053.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/224517/brass-birmingham' }]
  },
  {
    slug: 'azul',
    title: 'Azul',
    maker: 'Michael Kiesling · Plan B Games',
    category: 'Board Games',
    tags: ['abstract', 'tile-drafting', 'gateway'],
    blurb: 'Tile-drafting as tranquil as it is tactical. Beautiful on the table, easy to teach.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/aPSHJO0d0XOpQR5X-wJonw__imagepage/img/q4uWd2nXGeEkKDR8Cc3NhXG9PEU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6973671.png',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/230802/azul' }]
  },
  {
    slug: 'gloomhaven',
    title: 'Gloomhaven',
    maker: 'Isaac Childres · Cephalofair Games',
    category: 'Board Games',
    tags: ['campaign', 'dungeon-crawl', 'legacy'],
    blurb: 'A sprawling campaign box of tactical combat and branching story. The one that started the modern legacy-box wave.',
    status: 'wishlist',
    image: 'https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__imagepage/img/pBaOL7vV402nn1I5dHsdSKsFHqA=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2437871.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/174430/gloomhaven' }]
  },
  {
    slug: 'pandemic-legacy-season-1',
    title: 'Pandemic Legacy: Season 1',
    maker: 'Rob Daviau & Matt Leacock · Z-Man Games',
    category: 'Board Games',
    tags: ['co-op', 'legacy', 'campaign'],
    blurb: 'A year of outbreaks told across twelve sessions that permanently change the board. Consistently rated among the best co-ops ever.',
    status: 'wishlist',
    image: 'https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__imagepage/img/pBaOL7vV402nn1I5dHsdSKsFHqA=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2437871.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/161936/pandemic-legacy-season-1' }]
  },
  {
    slug: 'kingdomino',
    title: 'Kingdomino',
    maker: 'Bruno Cathala · Blue Orange',
    category: 'Board Games',
    tags: ['tile-laying', 'family', 'quick-play'],
    blurb: 'Build a tiny kingdom in twenty minutes. A perfect first "real" board game for a family table.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/c0m3gwZTcfKoLI63ASio8g__imagepage/img/k40CbVK1UuWeu3GZQGNwFNbGJVc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic8443569.png',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/204583/kingdomino' }] 
  },
  {
    slug: 'dune-imperium',
    title: 'Dune: Imperium',
    maker: 'Paul Dennen · Dire Wolf',
    category: 'Board Games',
    tags: ['deckbuilder', 'worker-placement', 'sci-fi'],
    blurb: 'Deckbuilding meets worker-placement in the world of Dune. Sharp, tense, and endlessly replayable.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/PhjygpWSo-0labGrPBMyyg__imagepage/img/BjM3LyahJ4IQ2ov5MkzkHatbmUc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5666597.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/316554/dune-imperium' }] 
  },
  {
    slug: 'sagrada',
    title: 'Sagrada',
    maker: 'Adrian Adamescu & Daryl Andrews · Floodgate Games',
    category: 'Board Games',
    tags: ['abstract', 'dice-drafting', 'gateway'],
    blurb: 'Draft dice to build a stained-glass window. A quiet, gorgeous puzzle of a game.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/77OxPP4ckbOgK9sPg-6KDw__imagepage/img/1KTyNTuWLBLZdWj7lNTCTJTQeFk=/fit-in/900x600/filters:no_upscale():strip_icc()/pic9374520.png',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/199561/sagrada' }] 
  },
  {
    slug: 'the-crew-quest-for-planet-nine',
    title: 'The Crew: The Quest for Planet Nine',
    maker: 'Thomas Sing · Kosmos',
    category: 'Board Games',
    tags: ['trick-taking', 'co-op', 'small-box'],
    blurb: 'A cooperative trick-taking game with zero table talk allowed. Deceptively brilliant.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/77OxPP4ckbOgK9sPg-6KDw__imagepage/img/1KTyNTuWLBLZdWj7lNTCTJTQeFk=/fit-in/900x600/filters:no_upscale():strip_icc()/pic9374520.png',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/284083/the-crew-the-quest-for-planet-nine' }]
  },
  {
    slug: 'parks',
    title: 'PARKS',
    maker: 'Henry Audubon · Keymaster Games',
    category: 'Board Games',
    tags: ['nature', 'hiking', 'gorgeous-components'],
    blurb: 'A love letter to the National Parks, illustrated in a rotating series of gorgeous art styles.',
    status: 'wishlist',
    image: 'https://cf.geekdo-images.com/mF2cSNRk2O6HtE45Sl9TcA__imagepage/img/fHti47Z7pAXUE1_pxGYz-gUOfyo=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4852372.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/266524/parks' }] 
  },
  {
    slug: 'sleeping-gods',
    title: 'Sleeping Gods',
    maker: 'Ryan Laukat · Red Raven Games',
    category: 'Board Games',
    tags: ['adventure', 'exploration', 'campaign'],
    blurb: 'A sprawling nautical adventure atlas, hand-illustrated cover to cover. Read it like a storybook, play it like a campaign.',
    status: 'wishlist',
    image: 'https://cf.geekdo-images.com/Zdt8l4oTBpFICsMyNof7Jg__imagepage/img/ToI3nXdkLu4Dy3J8o-yAWrdN4i8=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5975244.png',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/255984/sleeping-gods' }] 
  },
  {
    slug: 'unmatched-battle-of-legends-vol-1',
    title: 'Unmatched: Battle of Legends, Volume One',
    maker: 'Rob Daviau, JR Honeycutt, Justin D. Jacobson · Restoration Games',
    category: 'Board Games',
    tags: ['skirmish', 'asymmetric', 'gateway'],
    blurb: 'King Arthur vs. Medusa vs. Sinbad vs. Alice in Wonderland. Fast, tactical, endlessly mixable.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/4AlLbprNustr9G7pbkGRuw__imagepage/img/dU9nyqzF1TBO7j2eBeJOB_Jkr5k=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4621579.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/274637/unmatched-battle-of-legends-volume-one' }]
  },
  {
    slug: 'splendor',
    title: 'Splendor',
    maker: 'Marc André · Space Cowboys',
    category: 'Board Games',
    tags: ['engine-builder', 'card-drafting', 'gateway'],
    blurb: 'Renaissance merchants race to grab gems and please nobility. Simple rules, real depth, plays fast.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/vNFe4JkhKAERzi4T0Ntwpw__imagepage/img/JXnPzdgTeDkRrxESA86gnCw4Zws=/fit-in/900x600/filters:no_upscale():strip_icc()/pic8234167.png',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/148228/splendor' }]
  },
  {
    slug: 'lords-of-waterdeep',
    title: 'Lords of Waterdeep',
    maker: 'Peter Lee & Rodney Thompson · Wizards of the Coast',
    category: 'Board Games',
    tags: ['worker-placement', 'gateway', 'dungeons-and-dragons'],
    blurb: 'Deploy agents and hire adventurers to expand your control over the city of Waterdeep. One of the cleanest worker-placement gateways around.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/DFZlakC9Lv8cB5Co5z3meA__imagepage/img/3i1YzlyJi91bVfQnLzF9wc9-WEY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic9230112.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/110327/lords-of-waterdeep' }]
  },
  {
    slug: 'tiny-epic-galaxies',
    title: 'Tiny Epic Galaxies',
    maker: 'Scott Almes · Gamelyn Games',
    category: 'Board Games',
    tags: ['dice-drafting', 'sci-fi', 'small-box'],
    blurb: 'Roll dice and colonize planets in a galaxy-spanning 4X game that fits in a small box and a short session.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/c_87h8o0AOrfCO3hxMjjrA__imagepage/img/Cm_v3dxblZyurF0b9cGQF3dZFHA=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2349732.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/163967/tiny-epic-galaxies' },{ label: 'Tycoon Games', url: 'https://tycoongames.com/' }]
  },
  {
    slug: 'heroquest',
    title: 'HeroQuest',
    maker: 'Stephen Baker · Avalon Hill / Hasbro',
    category: 'Board Games',
    tags: ['dungeon-crawl', 'family', 'classics'],
    blurb: 'The dungeon crawl that introduced a generation to tabletop fantasy. One GM, a party of heroes, a board full of monsters.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/v695lqCTLA_PU6fBHmfXCA__imagepage/img/8WPAh3yP667hpaQCtGH39TRV3bM=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5676212.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/699/heroquest' }]
  },
  {
    slug: 'descent-journeys-in-the-dark-second-edition',
    title: 'Descent: Journeys in the Dark (Second Edition)',
    maker: 'Kevin Wilson · Fantasy Flight Games',
    category: 'Board Games',
    tags: ['dungeon-crawl', 'campaign', 'heavy'],
    blurb: 'Fight the Overlord and level up your heroes across a full fantasy dungeon campaign. Deeper and heavier than HeroQuest.',
    status: 'wishlist',
    image: 'https://cf.geekdo-images.com/ZN2rpiJ19lg5DZk_iYMMkQ__opengraph/img/J4pTKWWChvXsIBvUcmJNoDDWq1U=/0x0:600x315/fit-in/1200x630/filters:strip_icc()/pic1180640.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/104162/descent-journeys-in-the-dark-second-edition' }]
  },
  {
    slug: 'dominion',
    title: 'Dominion (Second Edition)',
    maker: 'Donald X. Vaccarino · Rio Grande Games',
    category: 'Board Games',
    tags: ['deckbuilder', 'classics', 'gateway'],
    blurb: 'The game that invented deckbuilding. A 2009 Spiel des Jahres winner and still the genre\u2019s cleanest entry point.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/4dmyKfqQm_uxA1-chh4JeQ__imagepage/img/MKa0sNr588gqS9XKWsXcCtfiAQQ=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3187001.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/209418/dominion-second-edition' }]
  },
  {
    slug: 'one-deck-dungeon',
    title: 'One Deck Dungeon',
    maker: 'Chris Cieslik · Asmadi Games',
    category: 'Board Games',
    tags: ['dice-drafting', 'dungeon-crawl', 'small-box', 'solo-friendly'],
    blurb: 'Level up your hero and descend deeper into a dungeon packed entirely into one deck of cards.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/quvyGpE7kwbd2Mt1H5iLwQ__imagepage/img/fi9Dgl4uplKNN75gbAYFWXwilbI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3019101.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/179275/one-deck-dungeon' }]
  },
  {
    slug: 'munchkin',
    title: 'Munchkin',
    maker: 'Steve Jackson · Steve Jackson Games',
    category: 'Board Games',
    tags: ['card-game', 'family', 'casual-night'],
    blurb: 'Kill monsters, grab loot, backstab your friends. No roleplaying required — just pure chaotic dungeon-crawl parody.',
    status: 'favorite',
    image: 'https://cf.geekdo-images.com/J-ts3MW0UhDzs621TR6cog__imagepage/img/HJAhCcz8QJbVAYYQI71uYLsKkRM=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1871016.jpg',
    links: [{ label: 'BoardGameGeek', url: 'https://boardgamegeek.com/boardgame/1927/munchkin' }]
  },

  // =================================================================
  // RPGs (20)
  // =================================================================
  {
    slug: 'wanderhome',
    title: 'Wanderhome',
    maker: 'Jay Dragon · Possum Creek Games · Steve Jackson Games',
    category: 'RPGs',
    tags: ['gm-less', 'cozy', 'pastoral', 'queer-creators'],
    blurb: 'A pastoral fantasy RPG about traveling animal-folk, the seasons, and finding home. No GM, no dice.',
    description:
      'Wanderhome is a game of quiet journeys. You play traveling animal-folk wandering through a world recovering from war, marking the turning of seasons and the small kindnesses between strangers. GM-less, diceless, and one of the most awarded indie games of its decade.',
    status: '',
    featured: true,
    links: [{ label: 'itch.io', url: 'https://possumcreekgames.itch.io/wanderhome' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/353966/' }],
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/12917/353966.webp',
    hideBookshopLink: true,
    isbn: '9781954097025'
  },
  {
    slug: 'mausritter',
    title: 'Mausritter',
    maker: 'Isaac Williams · Losing Games',
    category: 'RPGs',
    tags: ['osr', 'rules-light', 'all-ages'],
    blurb: 'Sword-and-whiskers adventure. You are a mouse, the world is enormous, and an owl is a dragon.',
    status: 'wishlist',
    links: [
      { label: 'itch.io', url: 'https://losing-games.itch.io/mausritter' },
      { label: 'Mausritter site', url: 'https://mausritter.com/' },
      { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/383482/' }
    ],
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/16990/383482.webp',
    hideBookshopLink: true,
    isbn: '9789895464173'
  },
  {
    slug: 'thirsty-sword-lesbians',
    title: 'Thirsty Sword Lesbians',
    maker: 'April Kit Walsh · Evil Hat Productions',
    category: 'RPGs',
    tags: ['pbta', 'romance', 'swashbuckling', 'queer-creators'],
    blurb: 'Duel your rival, fall for them mid-fight. A Powered-by-the-Apocalypse game of swords, feelings, and defiance.',
    status: '',
    featured: true,
    image: 'https://img.itch.zone/aW1nLzYxMjUyODYuanBn/347x500/Bnmn5s.jpg',
    links: [{ label: 'Evil Hat', url: 'https://evilhat.com/product/thirsty-sword-lesbians/' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/348096/' }],
    hideBookshopLink: true,
    isbn: '9781613171974'
  },
  {
    slug: 'blades-in-the-dark',
    title: 'Blades in the Dark',
    maker: 'John Harper · Evil Hat Productions',
    category: 'RPGs',
    tags: ['forged-in-the-dark', 'heist', 'gothic'],
    blurb: 'Run a criminal crew in a haunted industrial city. The game that launched an entire design lineage (Forged in the Dark).',
    status: '',
    links: [{ label: 'Evil Hat', url: 'https://evilhat.com/product/blades-in-the-dark/' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/514639/' }],
    hideBookshopLink: true,
    isbn: '9781613171325'
  },
  {
    slug: 'monsterhearts-2',
    title: 'Monsterhearts 2',
    maker: 'Avery Alder · Buried Without Ceremony',
    category: 'RPGs',
    tags: ['pbta', 'teen-drama', 'horror', 'queer-creators'],
    blurb: 'Teen monsters, messy desire, and the horror of growing up. A foundational queer indie RPG.',
    status: 'wishlist',
    links: [{ label: 'Buried Without Ceremony', url: 'https://buriedwithoutceremony.com/monsterhearts' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/212511/' }],
    hideBookshopLink: true
  },
  {
    slug: 'heart-the-city-beneath',
    title: 'Heart: The City Beneath',
    maker: 'Grant Howitt & Christopher Taylor · Rowan, Rook and Decard',
    category: 'RPGs',
    tags: ['forged-in-the-dark', 'horror', 'dungeon-crawl'],
    blurb: 'Descend into a living, hungry city that wants to change you. Gorgeous, strange, and merciless.',
    status: 'wishlist',
    links: [{ label: 'Rowan, Rook and Decard', url: 'https://rowanrookanddecard.com/product/heart-the-city-beneath/' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/308784/' }],
    hideBookshopLink: true,
    isbn: '9781913032111'
  },
  {
    slug: 'mothership',
    title: 'Mothership',
    maker: 'Sean McCoy · Tuesday Knight Games',
    category: 'RPGs',
    tags: ['sci-fi-horror', 'rules-light', 'one-shot'],
    blurb: 'Sci-fi horror on a derelict spacecraft. Rules-light, brutal, and built for short, tense sessions.',
    status: '',
    links: [{ label: 'Tuesday Knight Games', url: 'https://www.tuesdayknightgames.com/pages/mothership' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/484476/' }],
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/13232/484476.webp',
    hideBookshopLink: true
  },
  {
    slug: 'root-the-roleplaying-game',
    title: 'Root: The Roleplaying Game',
    maker: 'Magpie Games',
    category: 'RPGs',
    tags: ['pbta', 'woodland', 'politics'],
    blurb: 'The world of the Root board game, expanded into a full campaign of woodland factions and found family.',
    status: 'wishlist',
    links: [{ label: 'Magpie Games', url: 'https://magpiegames.com/pages/root-the-roleplaying-game' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/373406/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/4353/373406.webp',
    isbn: '9781952885086'
  },
  {
    slug: 'avatar-legends',
    title: 'Avatar Legends: The Roleplaying Game',
    maker: 'Magpie Games',
    category: 'RPGs',
    tags: ['pbta', 'anime-inspired', 'found-family'],
    blurb: 'Bending, balance, and coming-of-age drama in the world of Avatar. Built for found-family ensemble stories.',
    status: 'favorite',
    links: [{ label: 'Magpie Games', url: 'https://magpiegames.com/pages/avatar-legends-the-roleplaying-game' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/384956/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/4353/384956.webp',
    isbn: '9781952885693'
  },
  {
    slug: 'kids-on-bikes',
    title: 'Kids on Bikes',
    maker: 'Jonathan Gilmour & Doug Levandowski · Renegade Game Studios',
    category: 'RPGs',
    tags: ['rules-light', 'mystery', 'all-ages'],
    blurb: 'Stranger Things energy: small-town kids, big mysteries, rules light enough for a first-ever RPG session.',
    status: 'favorite',
    links: [{ label: 'Renegade Game Studios', url: 'https://renegadegamestudios.com/kids-on-bikes/' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/231938/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/3439/231938.webp',
    isbn: '9780999854808'
  },
  {
    slug: 'coyote-and-crow',
    title: 'Coyote & Crow',
    maker: 'Connor Alexander',
    category: 'RPGs',
    tags: ['indigenous-futurism', 'original-setting', 'own-voices'],
    blurb: 'An Indigenous-futurist world where colonization never happened. Original IP, built and owned by Native creators.',
    status: '',
    featured: true,
    links: [{ label: 'Coyote & Crow', url: 'https://coyoteandcrow.net/' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/390427/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/21461/390427.webp',
    isbn: '9781736442906'
  },
  {
    slug: 'sleepaway',
    title: 'Sleepaway',
    maker: 'Jay Dragon · Possum Creek Games',
    category: 'RPGs',
    tags: ['horror', 'one-shot', 'queer-creators'],
    blurb: 'A one-shot horror RPG set at a summer camp where something is very wrong. Sharp, quick, unforgettable.',
    status: 'wishlist',
    links: [{ label: 'itch.io', url: 'https://possumcreekgames.itch.io/sleepaway' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/353967/' }], 
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/12917/353967.webp',
    isbn: '9781954097001'
  },
  {
    slug: 'dungeon-world',
    title: 'Dungeon World',
    maker: 'Sage LaTorra & Adam Koebel',
    category: 'RPGs',
    tags: ['pbta', 'fantasy', 'gateway'],
    blurb: 'Classic dungeon fantasy, told through Powered-by-the-Apocalypse rules. The gateway drug into PbtA design.',
    status: 'favorite',
    links: [{ label: 'Burning Wheel', url: 'https://www.burningwheel.com/' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/108028/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/2183/108028.webp',
    isbn: '9780988639409'
  },
  {
    slug: 'dnd-5e',
    title: 'Dungeons & Dragons (5th Edition)',
    maker: 'Wizards of the Coast',
    category: 'RPGs',
    tags: ['fantasy', 'mainstream', 'gateway'],
    blurb: 'The one everyone knows. Still a great first table, and worth playing given the enormous popularity and support materials.',
    status: 'favorite',
    links: [{ label: 'D&D Beyond', url: 'https://www.dndbeyond.com/' }, { label: 'Dungeons & Dragons Official', url: 'https://www.dungeonsanddragons.com/' }],
    hideBookshopLink: true,
    isbn: '9780786965601'
  },
  {
    slug: 'pathfinder-2e',
    title: 'Pathfinder (Second Edition)',
    maker: 'Paizo',
    category: 'RPGs',
    tags: ['fantasy', 'heavy', 'tactical'],
    blurb: 'D&D\u2019s sharper-edged cousin: tighter math, deeper character building, tactical combat that rewards system mastery.',
    status: 'wishlist',
    links: [{ label: 'Paizo', url: 'https://paizo.com/pathfinder' }],
    hideBookshopLink: true,
    isbn: '9781640781689'
  },
  {
    slug: 'call-of-cthulhu-7e',
    title: 'Call of Cthulhu (7th Edition)',
    maker: 'Chaosium',
    category: 'RPGs',
    tags: ['horror', 'investigation', 'classics'],
    blurb: 'Investigate cosmic horrors you were never meant to understand. The granddaddy of horror RPGs, still sharp.',
    status: 'wishlist',
    links: [{ label: 'Chaosium', url: 'https://www.chaosium.com/call-of-cthulhu/' }],
    hideBookshopLink: true,
    isbn: '9781568824307'
  },
  {
    slug: 'alien-rpg',
    title: 'Alien RPG',
    maker: 'Free League Publishing',
    category: 'RPGs',
    tags: ['sci-fi-horror', 'licensed', 'survival'],
    blurb: 'You already know the vibe. Free League\u2019s take on the Alien universe is tense, deadly, and beautifully produced.',
    status: 'wishlist',
    featured: true,
    links: [{ label: 'Free League', url: 'https://freeleaguepublishing.com/games/alien/' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/520969/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/11437/520969.webp',
    isbn: '9789188805553'
  },
  {
    slug: 'vampire-the-masquerade-5e',
    title: 'Vampire: The Masquerade (5th Edition)',
    maker: 'Renegade Game Studios / Paradox',
    category: 'RPGs',
    tags: ['gothic-punk', 'politics', 'classics'],
    blurb: 'Personal horror and vampire politics in the modern nights. A World of Darkness cornerstone.',
    status: 'wishlist',
    links: [{ label: 'World of Darkness', url: 'https://worldofdarkness.com/vampire-the-masquerade' }, { label: 'Renegade Game Studios', url: 'https://renegadegamestudios.com/vampire-the-masquerade-5th-edition-roleplaying-game-core-rulebook/?srsltid=AfmBOor1CCcuc6D6ppzrM3kPQmmxSSSJj8JCap6uniIeCE_gPnhyVdUj' }],
    hideBookshopLink: true,
    image: 'https://cdn11.bigcommerce.com/s-kftzvkkgjv/images/stencil/1280x1280/products/292/1534/V5_CoreRulebook_FrontCover__22095.1657225192.jpg?c=1',
    isbn: '9781735993829'
  },
  {
    slug: 'fabula-ultima',
    title: 'Fabula Ultima',
    maker: 'Emanuele Galletto · Need Games',
    category: 'RPGs',
    tags: ['jrpg-inspired', 'anime', 'indie'],
    blurb: 'Classic JRPG energy \u2014 think Final Fantasy \u2014 built into a full tabletop system. A modern indie darling.',
    status: 'wishlist',
    links: [{ label: 'Need Games', url: 'https://needgames.it/en/fabula-ultima/' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/410108/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/17072/410108.webp',
    isbn: '9791280692450'
  },
  {
    slug: 'trophy-dark',
    title: 'Trophy Dark',
    maker: 'Jesse Ross · The Gauntlet',
    category: 'RPGs',
    tags: ['horror', 'one-shot', 'rules-light'],
    blurb: 'Descend into a cursed, treasure-filled forest. Every roll pulls you deeper into ruin. Short, sharp, and beloved.',
    status: 'wishlist',
    links: [{ label: 'The Gauntlet', url: 'https://gauntlet-shop.myshopify.com/collections/trophy' }, { label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/402818/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/12676/402818.webp',
    isbn: '9781952774003'
  },
  {
    slug: 'mork-borg',
    title: 'Mörk Borg',
    maker: 'Pelle Nilsson & Johan Nohr · Free League',
    category: 'RPGs',
    tags: ['fiction', 'osr', 'horror', 'post-apoc'],
    blurb: 'A doom-metal picture book of an RPG. The world is ending, your character probably won\u2019t survive, and it will look gorgeous the whole way down.',
    status: '',
    links: [{ label: 'Free League', url: 'https://freeleaguepublishing.com/games/mork-borg/' }, {label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/295910/' }],
    hideBookshopLink: true,
    isbn: '9789188805645'
  },
  {
    slug: 'eclipse-phase-2e',
    title: 'Eclipse Phase (Second Edition)',
    maker: 'Rob Boyle · Posthuman Studios',
    category: 'RPGs',
    tags: ['fiction', 'sci-fi-horror', 'transhumanist'],
    blurb: 'Post-singularity horror-sf: swap bodies, question what\u2019s left of you, and investigate the conspiracy that ended the old solar system.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/284022/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/3228/284022.webp',
    isbn: '9781631270062'
  },
  {
    slug: 'adventurer-conqueror-king-system',
    title: 'Adventurer Conqueror King System',
    maker: 'Alexander Macris · Autarch',
    category: 'RPGs',
    tags: ['fiction', 'osr', 'fantasy'],
    blurb: 'Old-school fantasy that keeps going after the dungeon \u2014 build a keep, rule a domain, become the thing later adventurers raid.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/99123/' }],
    hideBookshopLink: true,
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/4277/99123.webp',
    isbn: '9780984983209'
  },
  {
    slug: 'shadowrun',
    title: 'Shadowrun',
    maker: 'Catalyst Game Labs',
    category: 'RPGs',
    tags: ['fiction', 'cyberpunk', 'fantasy'],
    blurb: 'Cyberpunk and high fantasy collide: megacorps, street samurai, and elves running the shadows of a neon-soaked future.',
    status: 'wishlist',
    links: [{ label: 'Catalyst Game Labs', url: 'https://store.catalystgamelabs.com/products/shadowrun-sixth-world-core-rulebook-city-edition-berlin-1' }],
    hideBookshopLink: true,
    image: 'https://store.catalystgamelabs.com/cdn/shop/files/CAT28000B_SR6BerlinEdition-1.png?v=1700015341',
    isbn: '9781638610335'
  },
  {
    slug: 'star-wars-roleplaying-game-weg',
    title: 'Star Wars: The Roleplaying Game',
    maker: 'Greg Costikyan · West End Games',
    category: 'RPGs',
    tags: ['fiction', 'sci-fi', 'licensed', 'd6', 'vintage'],
    blurb: 'The original Star Wars RPG, back when the galaxy far away only had three movies to draw from. A formative piece of tabletop history.',
    status: 'wishlist',
    links: [{ label: 'West End Games', url: 'https://www.starwarstimeline.net/Westendgames.htm' }],
    hideBookshopLink: true,
    image: 'https://www.starwarstimeline.net/images/Roleplaying%20Game.jpg',
    isbn: '9780874310658'
  },
  {
    slug: 'wheel-of-time-roleplaying-game',
    title: 'The Wheel of Time Roleplaying Game',
    maker: 'Charles M. Ryan · Wizards of the Coast',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'licensed', 'd20', 'vintage'],
    blurb: 'd20-era adaptation of Robert Jordan\u2019s epic \u2014 channel the One Power, dodge the Dark One\u2019s reach. Highly sought after collector\u2019s item at this point.',
    status: 'wishlist',
    links: [{ label: 'Fandom Info about WoTRPG', url: 'https://wot.fandom.com/wiki/The_Wheel_of_Time_Roleplaying_Game' }],
    hideBookshopLink: true,
    isbn: '9780786919963'
  },
  {
    slug: 'dnd-4e-players-handbook',
    title: 'Player\u2019s Handbook (D&D 4th Edition)',
    maker: 'Wizards of the Coast',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'd20', 'tactical', 'vintage'],
    blurb: 'The tactical-combat era of D&D \u2014 powers, grids, and set-piece battles built like a board game.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9780786948673'
  },
  {
    slug: 'cyberpunk-2020',
    title: 'Cyberpunk 2020',
    maker: 'Mike Pondsmith · R. Talsorian Games',
    category: 'RPGs',
    tags: ['fiction', 'cyberpunk', 'vintage'],
    blurb: 'The dystopian megacorp noir that the whole genre keeps circling back to. Style over survival, always.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9780937279137'
  },
  {
    slug: 'pathfinder-1e-advanced-race-guide',
    title: 'Advanced Race Guide (Pathfinder, 1st Edition)',
    maker: 'Jason Bulmahn · Paizo',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'd20', 'vintage'],
    blurb: 'Deep-dive sourcebook for building and playing dozens of fantasy ancestries in 1E Pathfinder.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9781601253903'
  },
  {
    slug: 'castles-and-crusades-monsters-and-treasures',
    title: 'Castles & Crusades: Monsters & Treasures',
    maker: 'Davis Chenault · Troll Lord Games',
    category: 'RPGs',
    tags: ['fiction', 'osr', 'fantasy', 'bestiary'],
    blurb: 'A monster-and-loot companion built for Castles & Crusades\u2019 easy, old-school-flavored ruleset.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9781931275613'
  },
  {
    slug: 'ninjas-and-superspies',
    title: 'Ninjas and Superspies',
    maker: 'Erick Wujcik · Palladium Books',
    category: 'RPGs',
    tags: ['fiction', 'action', 'martial-arts', 'vintage'],
    blurb: 'Palladium\u2019s martial-arts-and-espionage toolkit \u2014 build a whole dojo\u2019s worth of fighting styles.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9780916211318'
  },
  {
    slug: 'rifts',
    title: 'Rifts',
    maker: 'Kevin Siembieda · Palladium Books',
    category: 'RPGs',
    tags: ['fiction', 'post-apoc', 'sci-fantasy'],
    blurb: 'Dimensional rifts tore the world open and everything came through \u2014 dragons next to power armor next to demons. Utter, glorious chaos.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9780916211509'
  },
  {
    slug: 'rifts-ultimate-edition',
    title: 'Rifts: Ultimate Edition',
    maker: 'Kevin Siembieda · Palladium Books',
    category: 'RPGs',
    tags: ['fiction', 'post-apoc', 'sci-fantasy'],
    blurb: 'The updated core rulebook for Rifts\u2019 dimension-spanning, anything-goes post-apocalypse.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9781574571509'
  },
  {
    slug: 'basic-role-playing-system',
    title: 'Basic Role-Playing System',
    maker: 'Chaosium',
    category: 'RPGs',
    tags: ['fiction', 'generic', 'percentile', 'vintage'],
    blurb: 'The percentile-based engine underneath Call of Cthulhu, RuneQuest, and a dozen other classics \u2014 the toolkit itself.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9781568823478'
  },
  {
    slug: 'star-trek-roleplaying-game-players-guide',
    title: 'Star Trek Roleplaying Game: Player\u2019s Guide',
    maker: 'Christian Moore · Last Unicorn Games',
    category: 'RPGs',
    tags: ['fiction', 'sci-fi', 'licensed', 'd6', 'vintage'],
    blurb: 'Explore strange new worlds under a d6 system built specifically for Trek-flavored diplomacy and away missions.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9781582369006'
  },
  {
    slug: 'desert-of-desolation',
    title: 'Desert of Desolation',
    maker: 'Tracy Hickman · TSR',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'd20', 'module', 'vintage'],
    blurb: 'Classic AD&D adventure compilation \u2014 pyramids, curses, and desert peril from one of the genre\u2019s formative designers.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9780880383974'
  },
  {
    slug: 'pharaoh',
    title: 'Pharaoh',
    maker: 'Tracy Hickman · TSR',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'd20', 'module', 'vintage'],
    blurb: 'An Egyptian-flavored AD&D module \u2014 tombs, traps, and ancient royal secrets.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9780880380072'
  },
  {
    slug: 'forgotten-realms-adventures',
    title: 'Forgotten Realms: Adventures',
    maker: 'Jeff Grubb · TSR',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'd20', 'vintage'],
    blurb: 'AD&D 2E-era sourcebook for the Forgotten Realms \u2014 a snapshot of the setting before decades of further lore piled on.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9780880388283'
  },
  {
    slug: 'dnd-rules-cyclopedia',
    title: 'Dungeons & Dragons Rules Cyclopedia',
    maker: 'Aaron Allston · TSR',
    category: 'RPGs',
    tags: ['fiction', 'osr', 'fantasy', 'd20', 'vintage'],
    blurb: 'The classic-era D&D ruleset compiled into one dense, beloved volume \u2014 a cornerstone of OSR nostalgia.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9781560760856'
  },
  {
    slug: 'fiend-folio-1e',
    title: 'Fiend Folio (AD&D, 1st Edition)',
    maker: 'Don Turnbull · TSR',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'd20', 'bestiary', 'vintage'],
    blurb: 'The monster book that gave 1st-edition AD&D some of its weirdest, most memorable creatures.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true,
    isbn: '9780935696219'
  },
  {
    slug: 'dnd-basic-rules-moldvay',
    title: 'Dungeons & Dragons Basic Rules',
    maker: 'Tom Moldvay · TSR',
    category: 'RPGs',
    tags: ['fiction', 'osr', 'fantasy', 'd20', 'vintage'],
    blurb: 'The red-box-era Basic Set that introduced a generation to the hobby. Simple, clean, foundational.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true
  },
  {
    slug: 'warhammer-fantasy-roleplay-rulebook',
    title: 'Warhammer Fantasy Roleplay Rulebook',
    maker: 'Green Ronin',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'percentile', 'grimdark'],
    blurb: 'Grim, low-fantasy survival in the Warhammer world \u2014 your character is disposable and the setting wants you to know it.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true
  },
  {
    slug: 'a-song-of-ice-and-fire-chronicle-starter',
    title: 'A Song of Ice and Fire Chronicle Starter',
    maker: 'Mark Simmons · Green Ronin',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'licensed', 'politics'],
    blurb: 'A starter sourcebook for running political, low-magic intrigue in Westeros.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true
  },
  {
    slug: 'a-song-of-ice-and-fire-campaign-guide',
    title: 'A Song of Ice and Fire Campaign Guide',
    maker: 'David Chart · Green Ronin',
    category: 'RPGs',
    tags: ['fiction', 'fantasy', 'licensed', 'politics'],
    blurb: 'Deeper setting material for running full campaigns in the Song of Ice and Fire world.',
    status: 'wishlist',
    links: [{ label: 'DriveThruRPG', url: 'https://www.drivethrurpg.com/en/product/000000/' }],
    hideBookshopLink: true
  },

  // =================================================================
  // CCGs
  // =================================================================
  {
    slug: 'netrunner-null-signal',
    title: 'Netrunner (Null Signal Games)',
    maker: 'Null Signal Games',
    category: 'CCGs',
    tags: ['lcg', 'cyberpunk', 'community-run'],
    blurb: 'The community-run continuation of the greatest asymmetric card game ever made. Corps vs. runners.',
    description:
      'When the official game ended, the community refused to let it die. Null Signal Games (formerly Project NISEI) now designs, balances, and prints new Netrunner content as a volunteer nonprofit \u2014 maybe the most punk thing in card gaming.',
    status: '',
    links: [{ label: 'Null Signal Games', url: 'https://nullsignal.games/' }]
  },
  {
    slug: 'magic-the-gathering-singles',
    title: 'Magic: The Gathering',
    maker: 'Wizards of the Coast',
    category: 'CCGs',
    tags: ['tcg', 'commander', 'casual-night'],
    blurb: 'Commander nights, draft chaos, and a singles binder. Casual-first \u2014 bring your jank.',
    status: 'favorite'
  },

  // =================================================================
  // BOOKS
  // =================================================================
  {
    slug: 'the-dispossessed',
    title: 'The Dispossessed',
    maker: 'Ursula K. Le Guin',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'anarchism', 'classics'],
    blurb: 'An ambiguous utopia. The anarchist moon Anarres, the capitalist world Urras, and the physicist caught between.',
    status: '',
    isbn: '9780060512750'
  },
  {
    slug: 'a-psalm-for-the-wild-built',
    title: 'A Psalm for the Wild-Built',
    maker: 'Becky Chambers',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'solarpunk', 'cozy', 'queer-creators'],
    blurb: 'A tea monk and a robot walk into the wilderness. Hopepunk that actually earns the hope.',
    status: '',
    isbn: '9781250236210'
  },
  {
    slug: 'emergent-strategy',
    title: 'Emergent Strategy',
    maker: 'adrienne maree brown · AK Press',
    category: 'Books',
    tags: ['non-fiction', 'organizing', 'politics'],
    blurb: 'Shaping change, changing worlds. Movement strategy learned from octopi, mycelium, and Octavia Butler.',
    status: '',
    isbn: '9781849352604',
    links: [{ label: 'AK Press', url: 'https://www.akpress.org/emergentstrategy.html' }]
  },
  {
    slug: 'waterlily',
    title: 'Waterlily',
    maker: 'Ella Cara Deloria',
    category: 'Books',
    tags: ['fiction', 'historical-fiction', 'indigenous'],
    blurb: 'A Dakota Sioux ethnologist\u2019s novel following one woman through the everyday and the extraordinary of Sioux life.',
    status: '',
    isbn: '9780803219045'
  },
  {
    slug: 'she-who-became-the-sun',
    title: 'She Who Became the Sun',
    maker: 'Shelley Parker-Chan',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'historical-fantasy', 'queer'],
    blurb: 'A peasant girl steals her dead brother\u2019s identity and his fate: greatness. A queer reimagining of the rise of the Ming Dynasty.',
    status: '',
    isbn: '9781250621801'
  },
  {
    slug: 'the-city-we-became',
    title: 'The City We Became',
    maker: 'N.K. Jemisin',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'urban-fantasy'],
    blurb: 'New York City comes alive as six human avatars to fight an eldritch enemy that wants the city dead before it\u2019s born.',
    status: '',
    isbn: '9780316509848'
  },
  {
    slug: 'the-fifth-season',
    title: 'The Fifth Season',
    maker: 'N.K. Jemisin',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'sci-fi'],
    blurb: 'A world of catastrophic, apocalypse-cycle geology, and the people with the power to cause or calm it. Opens the Broken Earth trilogy.',
    status: '',
    featured: true,
    isbn: '9780316229296'
  },
  {
    slug: 'gideon-the-ninth',
    title: 'Gideon the Ninth',
    maker: 'Tamsyn Muir',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'fantasy', 'queer'],
    blurb: 'Lesbian necromancers in space, sword-fighting their way through a haunted gothic palace. Exactly as fun as that sounds.',
    status: '',
    isbn: '9781250313188'
  },
  {
    slug: 'the-prophets',
    title: 'The Prophets',
    maker: 'Robert Jones Jr.',
    category: 'Books',
    tags: ['fiction', 'historical-fiction', 'queer'],
    blurb: 'A tender, devastating love story between two enslaved men on a Deep South plantation.',
    status: '',
    isbn: '9780593085684'
  },
  {
    slug: 'black-sun',
    title: 'Black Sun',
    maker: 'Rebecca Roanhorse',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'indigenous-futurism'],
    blurb: 'A pre-Columbian-inspired fantasy of prophecy, politics, and a god who might be returning to a world that isn\u2019t ready.',
    status: '',
    isbn: '9781534437678'
  },
  {
    slug: 'the-priory-of-the-orange-tree',
    title: 'The Priory of the Orange Tree',
    maker: 'Samantha Shannon',
    category: 'Books',
    tags: ['fiction', 'fantasy'],
    blurb: 'A doorstop of a standalone fantasy: dragons, queens, and a world that mistook its protector for its enemy.',
    status: '',
    isbn: '9781635570298'
  },
  {
    slug: 'dread-nation',
    title: 'Dread Nation',
    maker: 'Justina Ireland',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'horror', 'alt-history', 'ya'],
    blurb: 'The dead rose at Gettysburg. A Black girl trained to fight zombies navigates a Reconstruction-era America that still won\u2019t see her as free.',
    status: '',
    isbn: '9780062570604'
  },
  {
    slug: 'raybearer',
    title: 'Raybearer',
    maker: 'Jordan Ifueko',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'ya'],
    blurb: 'Bound by magic to kill the prince she\u2019s sworn to protect \u2014 a West African-inspired YA fantasy of found family and impossible loyalty.',
    status: '',
    isbn: '9781419739828'
  },
  {
    slug: 'a-song-below-water',
    title: 'A Song Below Water',
    maker: 'Bethany C. Morrow',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'urban-fantasy', 'ya'],
    blurb: 'Sirens hiding in plain sight in modern Portland, and the Black girl learning to stop hiding hers.',
    status: '',
    isbn: '9781250315328'
  },
  {
    slug: 'a-chorus-rises',
    title: 'A Chorus Rises',
    maker: 'Bethany C. Morrow',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'urban-fantasy', 'ya'],
    blurb: 'The companion to A Song Below Water, told from the siren cast as the villain of the last book\u2019s story.',
    status: '',
    isbn: '9781250316035'
  },
  {
    slug: 'daughters-of-nri',
    title: 'Daughters of Nri',
    maker: 'Reni K. Amayo',
    category: 'Books',
    tags: ['fiction', 'fantasy'],
    blurb: 'West African-inspired fantasy of two sisters, torn apart at birth, whose reunion could save or shatter their kingdom.',
    status: '',
    isbn: '9781916042919'
  },
  {
    slug: 'a-song-of-wraiths-and-ruin',
    title: 'A Song of Wraiths and Ruin',
    maker: 'Roseanne A. Brown',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'ya'],
    blurb: 'A crown prince and a girl seeking vengeance, both hunting the same magical prize, in a West African-inspired fantasy capital.',
    status: '',
    isbn: '9780062891495'
  },
  {
    slug: 'a-psalm-of-storms-and-silence',
    title: 'A Psalm of Storms and Silence',
    maker: 'Roseanne A. Brown',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'ya'],
    blurb: 'The conclusion to A Song of Wraiths and Ruin \u2014 gods, rebellion, and a kingdom on the edge.',
    status: '',
    isbn: '9780062891525'
  },
  {
    slug: 'legendborn',
    title: 'Legendborn',
    maker: 'Tracy Deonn',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'ya'],
    blurb: 'A grieving Black teen discovers a secret society re-fighting the Arthurian legends underneath her college campus.',
    status: '',
    isbn: '9781534441606'
  },
  {
    slug: 'gutter-child',
    title: 'Gutter Child',
    maker: 'Jael Richardson',
    category: 'Books',
    tags: ['fiction', 'dystopian', 'ya'],
    blurb: 'A dystopia built on generational debt \u2014 a girl born owing a system that was never built to let her pay it off.',
    status: '',
    isbn: '9781443457828'
  },
  {
    slug: 'the-strange-bird',
    title: 'The Strange Bird: A Borne Story',
    maker: 'Jeff VanderMeer',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'weird-fiction'],
    blurb: 'A bioengineered bird flees a ruined city in this Borne-universe novella of strange, ecological horror.',
    status: '',
    isbn: '9780374537920'
  },
  {
    slug: 'city-of-saints-and-madmen',
    title: 'City of Saints and Madmen',
    maker: 'Jeff VanderMeer',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'weird-fiction'],
    blurb: 'A city built from interlocking stories, footnotes, and mysteries \u2014 the foundational text of the Ambergris cycle.',
    status: '',
    isbn: '9780374538606'
  },
  {
    slug: 'annihilation',
    title: 'Annihilation',
    maker: 'Jeff VanderMeer',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'horror', 'weird-fiction'],
    blurb: 'Four women enter Area X. Something about the border, and about them, is not what it seems. Book one of the Southern Reach trilogy.',
    status: '',
    isbn: '9780374104092'
  },
  {
    slug: 'authority',
    title: 'Authority',
    maker: 'Jeff VanderMeer',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'horror', 'weird-fiction'],
    blurb: 'The bureaucracy trying to understand Area X turns out to be just as strange as the zone itself. Southern Reach, book two.',
    status: '',
    isbn: '9780374104108'
  },
  {
    slug: 'acceptance',
    title: 'Acceptance',
    maker: 'Jeff VanderMeer',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'horror', 'weird-fiction'],
    blurb: 'The Southern Reach trilogy closes, and Area X\u2019s origins finally start to surface \u2014 sideways, as ever.',
    status: '',
    isbn: '9780374104115'
  },
  {
    slug: 'the-nickel-boys',
    title: 'The Nickel Boys',
    maker: 'Colson Whitehead',
    category: 'Books',
    tags: ['fiction', 'historical-fiction', 'literary'],
    blurb: 'Two Black boys survive a brutal Jim-Crow-era reform school in this Pulitzer-winning novel.',
    status: '',
    isbn: '9780385537070'
  },
  {
    slug: 'skull-and-sidecar',
    title: 'Skull and Sidecar',
    maker: 'Kristen Hall-Geisler',
    category: 'Books',
    tags: ['fiction', 'contemporary'],
    blurb: 'A contemporary novel of family secrets, motorcycles, and figuring out who you are when the map you were given turns out to be wrong.',
    status: '',
    isbn: '9780989365888'
  },
  {
    slug: 'american-gods',
    title: 'American Gods',
    maker: 'Neil Gaiman',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'mythology'],
    blurb: 'Old gods, forgotten and starving, gather for a storm against the new gods of media and technology. A road trip through the myths America actually believes in.',
    status: '',
    isbn: '9780380973651'
  },
  {
    slug: 'leviathan-wakes',
    title: 'Leviathan Wakes',
    maker: 'James S.A. Corey',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'space-opera'],
    blurb: 'A detective, a doomed ice hauler, and a protomolecule that changes everything. Book one of The Expanse.',
    status: '',
    isbn: '9780316129084'
  },
  {
    slug: 'calibans-war',
    title: 'Caliban\u2019s War',
    maker: 'James S.A. Corey',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'space-opera'],
    blurb: 'The protomolecule crisis spreads to Venus, and the crew of the Rocinante gets pulled deeper in. The Expanse, book two.',
    status: '',
    isbn: '9780316129060'
  },
  {
    slug: 'abaddons-gate',
    title: 'Abaddon\u2019s Gate',
    maker: 'James S.A. Corey',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'space-opera'],
    blurb: 'A massive alien ring opens beyond Uranus. The Expanse, book three.',
    status: '',
    isbn: '9780316129077'
  },
  {
    slug: 'cibola-burn',
    title: 'Cibola Burn',
    maker: 'James S.A. Corey',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'space-opera'],
    blurb: 'Humanity\u2019s first colony on a world beyond the ring gate, and the fight over who gets to claim it. The Expanse, book four.',
    status: '',
    isbn: '9780316217620'
  },
  {
    slug: 'nemesis-games',
    title: 'Nemesis Games',
    maker: 'James S.A. Corey',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'space-opera'],
    blurb: 'The Rocinante\u2019s crew splits up right as the solar system\u2019s fragile peace shatters. The Expanse, book five.',
    status: '',
    isbn: '9780316334716'
  },
  {
    slug: 'babylons-ashes',
    title: 'Babylon\u2019s Ashes',
    maker: 'James S.A. Corey',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'space-opera'],
    blurb: 'The Belt rises in open rebellion. The Expanse, book six.',
    status: '',
    isbn: '9780316334747'
  },
  {
    slug: '112263',
    title: '11/22/63',
    maker: 'Stephen King',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'time-travel'],
    blurb: 'A time-traveling teacher tries to stop the Kennedy assassination \u2014 and learns the past does not want to be changed.',
    status: '',
    isbn: '9781451627299'
  },
  {
    slug: 'the-stand',
    title: 'The Stand',
    maker: 'Stephen King',
    category: 'Books',
    tags: ['fiction', 'horror', 'post-apoc'],
    blurb: 'A weaponized flu wipes out 99% of humanity, and the survivors sort themselves into the armies of good and evil.',
    status: '',
    isbn: '9780451169532'
  },
  {
    slug: 'the-foundation-trilogy',
    title: 'The Foundation Trilogy',
    maker: 'Isaac Asimov',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'classics'],
    blurb: 'The collapse of a galactic empire, predicted centuries in advance by mathematics \u2014 and the secret plan to shorten the coming dark age.',
    status: '',
    isbn: '9780380001019'
  },
  {
    slug: 'blindness',
    title: 'Blindness',
    maker: 'José Saramago',
    category: 'Books',
    tags: ['fiction', 'literary', 'dystopian'],
    blurb: 'A sudden epidemic of blindness strips a city down to its rawest instincts, for better and much worse.',
    status: '',
    isbn: '9780156007757'
  },
  {
    slug: 'dune',
    title: 'Dune',
    maker: 'Frank Herbert',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'classics'],
    blurb: 'Desert planet, spice, prophecy, empire. The science fiction novel most other science fiction novels are still arguing with.',
    status: '',
    isbn: '9780441172719'
  },
  {
    slug: 'a-clockwork-orange',
    title: 'A Clockwork Orange',
    maker: 'Anthony Burgess',
    category: 'Books',
    tags: ['fiction', 'dystopian', 'classics'],
    blurb: 'Ultraviolence, invented slang, and a state that would rather erase your free will than let you keep choosing evil.',
    status: '',
    isbn: '9780393312836'
  },
  {
    slug: 'animal-farm',
    title: 'Animal Farm',
    maker: 'George Orwell',
    category: 'Books',
    tags: ['fiction', 'dystopian', 'classics', 'satire'],
    blurb: 'A barnyard revolution curdles into the exact tyranny it replaced. Fable-length, still sharp.',
    status: '',
    isbn: '9780451526342'
  },
  {
    slug: '1984',
    title: '1984',
    maker: 'George Orwell',
    category: 'Books',
    tags: ['fiction', 'dystopian', 'classics'],
    blurb: 'Surveillance, doublethink, and a state that controls the past by controlling the present. The dystopia everyone quotes and few outrun.',
    status: '',
    isbn: '9780451524935'
  },
  {
    slug: 'zorba-the-greek',
    title: 'Zorba the Greek',
    maker: 'Nikos Kazantzakis',
    category: 'Books',
    tags: ['fiction', 'literary', 'classics'],
    blurb: 'A buttoned-up intellectual and a force-of-nature laborer test each other\u2019s philosophies on a Cretan hillside.',
    status: '',
    isbn: '9780671851002'
  },
  {
    slug: 'ceremony',
    title: 'Ceremony',
    maker: 'Leslie Marmon Silko',
    category: 'Books',
    tags: ['fiction', 'literary', 'indigenous', 'classics'],
    blurb: 'A mixed-ancestry WWII veteran returns to the Laguna Pueblo reservation and finds healing only through his people\u2019s oldest stories. A cornerstone of Native American literature.',
    status: '',
    isbn: '9780143104919'
  },
  {
    slug: 'the-shipping-news',
    title: 'The Shipping News',
    maker: 'Annie Proulx',
    category: 'Books',
    tags: ['fiction', 'literary', 'classics'],
    blurb: 'A hapless man rebuilds his life in a windswept Newfoundland fishing town. Pulitzer and National Book Award winner.',
    status: '',
    isbn: '9780684193373'
  },
  {
    slug: 'mama-day',
    title: 'Mama Day',
    maker: 'Gloria Naylor',
    category: 'Books',
    tags: ['fiction', 'literary', 'magical-realism'],
    blurb: 'A conjure woman on a Georgia sea island, and the niece pulled back home by a magic she doesn\u2019t believe in yet.',
    status: '',
    isbn: '9780679721819'
  },
  {
    slug: 'the-left-hand-of-darkness',
    title: 'The Left Hand of Darkness',
    maker: 'Ursula K. Le Guin',
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'classics', 'queer'],
    blurb: 'An envoy is sent to a world where people have no fixed gender. A foundational work of feminist and queer science fiction.',
    status: '',
    isbn: '9780441478125'
  },
  {
    slug: 'there-there',
    title: 'There There',
    maker: 'Tommy Orange',
    category: 'Books',
    tags: ['fiction', 'literary', 'indigenous'],
    blurb: 'Twelve Native characters converge on the Big Oakland Powwow in this kaleidoscopic, National Book Critics Circle-winning debut.',
    status: '',
    isbn: '9780525436140'
  },
  {
    slug: 'house-made-of-dawn',
    title: 'House Made of Dawn',
    maker: 'N. Scott Momaday',
    category: 'Books',
    tags: ['fiction', 'literary', 'indigenous', 'classics'],
    blurb: 'A young Pueblo man returns from WWII fractured between worlds. Won the Pulitzer and helped launch the Native American Renaissance.',
    status: '',
    isbn: '9780060931940'
  },
  {
    slug: 'ring-shout',
    title: 'Ring Shout',
    maker: 'P. Djèlí Clark',
    category: 'Books',
    tags: ['fiction', 'fantasy', 'horror', 'historical-fantasy'],
    blurb: 'Three Black women hunt literal demons wearing the Ku Klux Klan\u2019s hoods in 1920s Georgia. Dark fantasy with real teeth.',
    status: '',
    isbn: '9781250767028'
  },
  {
    slug: 'exile-and-pride',
    title: 'Exile and Pride',
    maker: 'Eli Clare',
    category: 'Books',
    tags: ['non-fiction', 'memoir', 'queer', 'disability'],
    blurb: 'A landmark memoir-essay collection on disability, queerness, class, and the body \u2014 foundational disability justice writing.',
    status: '',
    isbn: '9780822360315'
  },
  {
    slug: 'spill-black-feminist-fugitivity',
    title: 'Spill: Scenes of Black Feminist Fugitivity',
    maker: 'Alexis Pauline Gumbs',
    category: 'Books',
    tags: ['non-fiction', 'theory', 'queer', 'poetry'],
    blurb: 'A poetic, genre-defying meditation built from the archive of Black feminist thinker Hortense Spillers.',
    status: '',
    isbn: '9780822362722',
    hideCover: true
  },
  {
    slug: 'undrowned',
    title: 'Undrowned: Black Feminist Lessons from Marine Mammals',
    maker: 'Alexis Pauline Gumbs',
    category: 'Books',
    tags: ['non-fiction', 'theory', 'queer', 'science'],
    blurb: 'What whales, dolphins, and manatees can teach us about survival, care, and collective liberation.',
    status: '',
    isbn: '9781849353977'
  },
  {
    slug: 'crazy-brave',
    title: 'Crazy Brave: A Memoir',
    maker: 'Joy Harjo',
    category: 'Books',
    tags: ['non-fiction', 'memoir', 'indigenous', 'poetry'],
    blurb: 'The U.S. Poet Laureate\u2019s memoir of coming into her own voice, her Muscogee heritage, and her survival.',
    status: '',
    isbn: '9780393345438'
  },
  {
    slug: 'we-dont-know-ourselves',
    title: 'We Don\u2019t Know Ourselves',
    maker: 'Fintan O\u2019Toole',
    category: 'Books',
    tags: ['non-fiction', 'history', 'memoir'],
    blurb: 'A personal-and-national history of modern Ireland, told alongside the author\u2019s own life.',
    status: '',
    isbn: '9781324092872'
  },
  {
    slug: 'hijab-butch-blues',
    title: 'Hijab Butch Blues',
    maker: 'Lamya H.',
    category: 'Books',
    tags: ['non-fiction', 'memoir', 'queer'],
    blurb: 'A queer, Muslim memoir that reads the Quran\u2019s stories alongside a life spent between identities that weren\u2019t supposed to fit together.',
    status: '',
    isbn: '9780593448786'
  },
  {
    slug: 'the-trinity-of-fundamentals',
    title: 'The Trinity of Fundamentals',
    maker: 'Wisam Rafeedie',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'memoir'],
    blurb: 'A political memoir written from inside a Palestinian resistance movement.',
    status: '',
    isbn: '9798988260219'
  },
  {
    slug: 'transgender-history',
    title: 'Transgender History',
    maker: 'Susan Stryker',
    category: 'Books',
    tags: ['non-fiction', 'history', 'queer'],
    blurb: 'A foundational overview of transgender history and politics in the United States.',
    status: '',
    isbn: '9781580052245'
  },
  {
    slug: 'how-the-irish-became-white',
    title: 'How the Irish Became White',
    maker: 'Noel Ignatiev',
    category: 'Books',
    tags: ['non-fiction', 'history', 'politics'],
    blurb: 'A history of how Irish immigrants were assimilated into American whiteness \u2014 and what they gave up and gained doing it.',
    status: '',
    isbn: '9780415963091'
  },
  {
    slug: 'the-jakarta-method',
    title: 'The Jakarta Method',
    maker: 'Vincent Bevins',
    category: 'Books',
    tags: ['non-fiction', 'history', 'politics'],
    blurb: 'How a U.S.-backed anticommunist purge in Indonesia became a template exported across the Cold War world.',
    status: '',
    isbn: '9781541724006'
  },
  {
    slug: 'braiding-sweetgrass',
    title: 'Braiding Sweetgrass',
    maker: 'Robin Wall Kimmerer',
    category: 'Books',
    tags: ['non-fiction', 'science', 'nature', 'indigenous'],
    blurb: 'A botanist and Potawatomi woman braids Indigenous knowledge and scientific inquiry into an argument for reciprocity with the living world.',
    status: '',
    isbn: '9780141991955'
  },
  {
    slug: 'evicted',
    title: 'Evicted: Poverty and Profit in the American City',
    maker: 'Matthew Desmond',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'sociology'],
    blurb: 'A Pulitzer-winning ethnography following eight Milwaukee families through eviction \u2014 how housing precarity drives poverty, not the other way around.',
    status: '',
    isbn: '9780553447439'
  },
  {
    slug: 'poverty-by-america',
    title: 'Poverty, by America',
    maker: 'Matthew Desmond',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'sociology'],
    blurb: 'An argument that American poverty persists because others of us benefit from it \u2014 and what would change if we stopped.',
    status: '',
    isbn: '9780593239919'
  },
  {
    slug: 'the-disordered-cosmos',
    title: 'The Disordered Cosmos',
    maker: 'Chanda Prescod-Weinstein',
    category: 'Books',
    tags: ['non-fiction', 'science', 'memoir'],
    blurb: 'A particle physicist weaves dark matter, the history of Black astronomy, and her own life into a case for a more just science.',
    status: '',
    isbn: '9781541724686'
  },
  {
    slug: 'nonbinary-memoirs',
    title: 'Nonbinary: Memoirs of Gender and Identity',
    maker: 'Micah Rajunov (ed.)',
    category: 'Books',
    tags: ['non-fiction', 'memoir', 'queer'],
    blurb: 'An anthology of nonbinary writers on gender outside the binary, in their own words.',
    status: '',
    isbn: '9780231185332'
  },
  {
    slug: 'poverty-scholarship',
    title: 'Poverty Scholarship',
    maker: 'Lisa "Tiny" Gray-Garcia',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'memoir'],
    blurb: 'Poor-people-led theory, art, and testimony on homelessness and survival, written from lived experience rather than about it.',
    status: '',
    isbn: '9781732925007'
  },
  {
    slug: 'we-do-this-til-we-free-us',
    title: 'We Do This \u2019til We Free Us',
    maker: 'Mariame Kaba',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'organizing'],
    blurb: 'Essays and interviews on abolition, transformative justice, and organizing for a world without prisons and police.',
    status: '',
    isbn: '9781642595253'
  },
  {
    slug: 'orientalism',
    title: 'Orientalism',
    maker: 'Edward W. Said',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'theory'],
    blurb: 'The foundational critique of how the West constructed \u2019the East\u2019 as an object of study and domination.',
    status: '',
    isbn: '9780394740676'
  },
  {
    slug: 'fat-and-queer',
    title: 'Fat and Queer',
    maker: 'Miguel M. Morales (ed.)',
    category: 'Books',
    tags: ['non-fiction', 'memoir', 'queer'],
    blurb: 'An anthology centering fat queer and trans bodies and lives, in essay, poetry, and memoir.',
    status: '',
    isbn: '9781787755062'
  },
  {
    slug: 'becoming-abolitionists',
    title: 'Becoming Abolitionists',
    maker: 'Derecka Purnell',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'memoir'],
    blurb: 'A civil rights lawyer\u2019s personal and political journey from believing in police reform to organizing for abolition.',
    status: '',
    isbn: '9781662601668'
  },
  {
    slug: 'my-grandmothers-hands',
    title: 'My Grandmother\u2019s Hands',
    maker: 'Resmaa Menakem',
    category: 'Books',
    tags: ['non-fiction', 'psychology', 'memoir'],
    blurb: 'A therapist\u2019s argument that racialized trauma lives in the body, and that healing has to start there too.',
    status: '',
    isbn: '9781942094470'
  },
  {
    slug: 'the-warmth-of-other-suns',
    title: 'The Warmth of Other Suns',
    maker: 'Isabel Wilkerson',
    category: 'Books',
    tags: ['non-fiction', 'history'],
    blurb: 'The sweeping, intimate history of the Great Migration, told through three families who left the Jim Crow South.',
    status: '',
    isbn: '9780679763888'
  },
  {
    slug: 'beyond-the-gender-binary',
    title: 'Beyond the Gender Binary',
    maker: 'ALOK',
    category: 'Books',
    tags: ['non-fiction', 'queer', 'essay'],
    blurb: 'A short, sharp essay dismantling the gender binary and imagining past it.',
    status: '',
    isbn: '9780593094655'
  },
  {
    slug: 'against-the-double-blackmail',
    title: 'Against the Double Blackmail',
    maker: 'Slavoj Žižek',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'theory'],
    blurb: 'Refugees, terror, and the false choices Europe was offered in responding to both.',
    status: '',
    isbn: '9780241278840'
  },
  {
    slug: 'like-a-thief-in-broad-daylight',
    title: 'Like A Thief In Broad Daylight',
    maker: 'Slavoj Žižek',
    category: 'Books',
    tags: ['non-fiction', 'politics', 'theory'],
    blurb: 'On power, automation, and freedom in an era when both capital and revolution have gotten stranger.',
    status: '',
    isbn: '9780141989198'
  },
  {
    slug: 'undoing-monogamy',
    title: 'Undoing Monogamy',
    maker: 'Angela Willey',
    category: 'Books',
    tags: ['non-fiction', 'science', 'queer', 'theory'],
    blurb: 'A critique of how monogamy gets naturalized through biology and science \u2014 and what gets left out of that story.',
    status: '',
    isbn: '9780822361596'
  },
  {
    slug: 'mating-in-captivity',
    title: 'Mating in Captivity',
    maker: 'Esther Perel',
    category: 'Books',
    tags: ['non-fiction', 'psychology'],
    blurb: 'A therapist\u2019s argument that domesticity and desire pull against each other \u2014 and what long-term couples can do about it.',
    status: '',
    isbn: '9780060753641'
  },
  {
    slug: 'designer-evolution',
    title: 'Designer Evolution',
    maker: 'Simon Young',
    category: 'Books',
    tags: ['non-fiction', 'science', 'theory'],
    blurb: 'A transhumanist manifesto arguing humanity should take its own evolution into its own hands.',
    status: '',
    isbn: '9781591022909'
  },
  {
    slug: 'irish-fairy-and-folk-tales',
    title: 'Irish Fairy and Folk Tales',
    maker: 'W.B. Yeats',
    category: 'Books',
    tags: ['non-fiction', 'folklore'],
    blurb: 'Yeats\u2019 own collection of Irish fairy lore, banshees, and folk belief, gathered at the turn of the 20th century.',
    status: '',
    isbn: '9780486223155'
  },
  {
    slug: 'writings-on-irish-folklore-legend-and-myth',
    title: 'Writings on Irish Folklore, Legend and Myth',
    maker: 'W.B. Yeats',
    category: 'Books',
    tags: ['non-fiction', 'folklore'],
    blurb: 'A wider collection of Yeats\u2019 folklore writing and mythic scholarship.',
    status: '',
    isbn: '9780140180015'
  },
  {
    slug: 'the-encyclopaedia-of-celtic-wisdom',
    title: 'The Encyclopaedia of Celtic Wisdom',
    maker: 'Caitlín Matthews',
    category: 'Books',
    tags: ['non-fiction', 'folklore', 'spirituality'],
    blurb: 'A reference guide through Celtic mythology, symbolism, and spiritual tradition.',
    status: '',
    isbn: '9781852305611'
  },
  {
    slug: 'exploring-the-world-of-the-druids',
    title: 'Exploring the World of the Druids',
    maker: 'Miranda J. Green',
    category: 'Books',
    tags: ['non-fiction', 'folklore', 'history'],
    blurb: 'A scholarly look at what\u2019s actually known \u2014 and what\u2019s myth \u2014 about the historical Druids.',
    status: '',
    isbn: '9780500285718'
  },
  {
    slug: 'dictionary-of-celtic-mythology',
    title: 'Dictionary of Celtic Mythology',
    maker: 'James MacKillop',
    category: 'Books',
    tags: ['non-fiction', 'folklore', 'reference'],
    blurb: 'A reference dictionary of Celtic mythological figures, places, and stories across Ireland, Scotland, and Wales.',
    status: '',
    isbn: '9780192801203'
  },
  {
    slug: 'over-nine-waves',
    title: 'Over Nine Waves: A Book of Irish Legends',
    maker: 'Marie Heaney',
    category: 'Books',
    tags: ['non-fiction', 'folklore'],
    blurb: 'A retelling of Ireland\u2019s central mythic cycles \u2014 the Fianna, the Ulster Cycle, the old gods \u2014 gathered into one accessible volume.',
    status: '',
    isbn: '9780571175185'
  },
  {
    slug: 'selected-poems-rogha-danta',
    title: 'Selected Poems: Rogha Dánta',
    maker: 'Nuala Ní Dhomhnaill',
    category: 'Books',
    tags: ['non-fiction', 'poetry', 'folklore'],
    blurb: 'Bilingual Irish/English poetry drawing deeply on myth, the otherworld, and the Irish language itself.',
    status: '',
    isbn: '9781930630901'
  },
  {
    slug: 'decoding-andean-mythology',
    title: 'Decoding Andean Mythology',
    maker: 'Margarita Marín-Dale',
    category: 'Books',
    tags: ['non-fiction', 'folklore'],
    blurb: 'An exploration of Andean myth and cosmology and what it reveals about pre-Columbian worldviews.',
    status: '',
    isbn: '9781607815082'
  },
  {
    slug: 'some-girls-do',
    title: 'Some Girls Do',
    maker: 'Jennifer Dugan',
    category: 'Books',
    tags: ['fiction', 'ya', 'romance', 'queer', 'contemporary'],
    blurb: 'A closeted beauty queen and an out-and-proud track star fall for each other despite everything working against it.',
    status: '',
    isbn: '9780593112533'
  },
  {
    slug: 'cemetery-boys',
    title: 'Cemetery Boys',
    maker: 'Aiden Thomas',
    category: 'Books',
    tags: ['fiction', 'ya', 'fantasy', 'paranormal', 'queer', 'own-voices'],
    blurb: 'A trans boy determined to prove himself as a brujo accidentally summons the wrong ghost \u2014 and falls for him instead.',
    status: '',
    isbn: '9781250250469'
  },
  {
    slug: 'the-black-flamingo',
    title: 'The Black Flamingo',
    maker: 'Dean Atta',
    category: 'Books',
    tags: ['fiction', 'ya', 'queer', 'own-voices', 'poetry'],
    blurb: 'A mixed-race, queer teen finds himself through drag in this verse novel about claiming space to be fully seen.',
    status: '',
    isbn: '9780062990297'
  },
  {
    slug: 'felix-ever-after',
    title: 'Felix Ever After',
    maker: 'Kacen Callender',
    category: 'Books',
    tags: ['fiction', 'ya', 'romance', 'queer', 'own-voices'],
    blurb: 'A Black trans teen navigates first love, identity, and a cruel act of transphobia aimed straight at him.',
    status: '',
    isbn: '9780062820266'
  },
  {
    slug: 'darius-the-great-is-not-okay',
    title: 'Darius the Great Is Not Okay',
    maker: 'Adib Khorram',
    category: 'Books',
    tags: ['fiction', 'ya', 'contemporary', 'own-voices'],
    blurb: 'A Persian-American teen visits Iran for the first time, wrestling with depression, identity, and an unlikely new friendship.',
    status: '',
    isbn: '9780525552963'
  },
  {
    slug: 'caps-for-sale',
    title: 'Caps for Sale',
    maker: 'Esphyr Slobodkina',
    category: 'Books',
    tags: ['fiction', 'childrens', 'picture-book', 'classics'],
    blurb: 'A peddler naps under a tree and wakes to find monkeys have stolen every cap he owns. A classic of the picture-book shelf.',
    status: '',
    isbn: '9780064431439'
  },
  {
    slug: 'the-very-hungry-caterpillar',
    title: 'The Very Hungry Caterpillar',
    maker: 'Eric Carle',
    category: 'Books',
    tags: ['fiction', 'childrens', 'picture-book', 'classics'],
    blurb: 'A tiny caterpillar eats his way through the week and turns into something beautiful. Essential first-library material.',
    status: '',
    isbn: '9780399226908'
  },
  {
    slug: 'brown-bear-brown-bear-what-do-you-see',
    title: 'Brown Bear, Brown Bear, What Do You See?',
    maker: 'Bill Martin Jr. & Eric Carle',
    category: 'Books',
    tags: ['fiction', 'childrens', 'picture-book', 'classics'],
    blurb: 'A rhythmic, repeating parade of colorful animals \u2014 one of the best first read-alouds there is.',
    status: '',
    isbn: '9780805047905'
  },
  {
    slug: 'the-grouchy-ladybug',
    title: 'The Grouchy Ladybug',
    maker: 'Eric Carle',
    category: 'Books',
    tags: ['fiction', 'childrens', 'picture-book'],
    blurb: 'A ladybug picks fights all day long with animals much bigger than she is. A gentle lesson about manners, Carle-style.',
    status: '',
    isbn: '9780060270872'
  },
  {
    slug: 'irish-words-for-nature',
    title: 'Irish Words for Nature',
    maker: 'Manchán Magan, illus. Steve Doogan',
    category: 'Books',
    tags: ['non-fiction', 'childrens', 'language', 'folklore'],
    blurb: 'A board book introducing young readers to Irish words for animals, birds, fish, and insects \u2014 language and nature together from the very start.',
    status: '',
    isbn: '9781804581957',
    hideCover: true
  },
  {
    slug: 'jump-matsuoka',
    title: 'Jump!',
    maker: 'Tatsuhide Matsuoka',
    category: 'Books',
    tags: ['fiction', 'childrens', 'picture-book'],
    blurb: 'Read sideways so the animals leap up the page \u2014 a frog, a kitten, a fish, and finally a little girl all jump along. A beloved interactive board book for babies and toddlers.',
    status: '',
    isbn: '9781776572311',
    hideCover: true
  },

  // =================================================================
  // GRAPHIC NOVELS
  // =================================================================
  {
    slug: 'promethea-book-1',
    title: 'Promethea, Book 1',
    maker: 'Alan Moore',
    category: 'Graphic Novels',
    tags: ['fiction', 'fantasy', 'superhero', 'occult'],
    blurb: 'A college student becomes host to an ancient imagination-goddess in this occult-drenched superhero epic.',
    isbn: '9781563896675',
    status: ''
  },
  {
    slug: 'promethea-book-2',
    title: 'Promethea, Book 2',
    maker: 'Alan Moore',
    category: 'Graphic Novels',
    tags: ['fiction', 'fantasy', 'superhero', 'occult'],
    blurb: 'The Promethea saga deepens \u2014 magic, myth, and metafiction collide.',
    isbn: '9781401295455',
    status: ''
  },
  {
    slug: 'v-for-vendetta',
    title: 'V for Vendetta',
    maker: 'Alan Moore',
    category: 'Graphic Novels',
    tags: ['fiction', 'dystopian', 'politics', 'classics'],
    blurb: 'A masked anarchist wages a one-man war against a fascist future Britain. A cornerstone of political comics.',
    isbn: '9781779511195',
    status: ''
  },
  {
    slug: 'watchmen',
    title: 'Watchmen',
    maker: 'Alan Moore',
    category: 'Graphic Novels',
    tags: ['fiction', 'superhero', 'deconstruction', 'classics'],
    blurb: 'Superheroes, aged and compromised, in a Cold War world that never needed saving as much as it thinks it does. The book that broke the genre open.',
    isbn: '9781401238964',
    status: ''
  },
  {
    slug: 'the-walking-dead-vol-10',
    title: 'The Walking Dead, Vol. 10: What We Become',
    maker: 'Robert Kirkman',
    category: 'Graphic Novels',
    tags: ['fiction', 'horror', 'post-apoc'],
    blurb: 'Rick\u2019s group keeps surviving the dead \u2014 and each other \u2014 in this long-running zombie-apocalypse series.',
    isbn: '9781607060758',
    status: ''
  },
  {
    slug: 'the-walking-dead-vol-11',
    title: 'The Walking Dead, Vol. 11: Fear the Hunters',
    maker: 'Robert Kirkman',
    category: 'Graphic Novels',
    tags: ['fiction', 'horror', 'post-apoc'],
    blurb: 'The group encounters the most horrifying survivors they\u2019ve faced yet \u2014 other people.',
    isbn: '9781607061816',
    status: ''
  },
  {
    slug: 'the-walking-dead-vol-14',
    title: 'The Walking Dead, Vol. 14: No Way Out',
    maker: 'Robert Kirkman',
    category: 'Graphic Novels',
    tags: ['fiction', 'horror', 'post-apoc'],
    blurb: 'The walled community faces a herd it might not survive.',
    isbn: '9781607063926',
    status: ''
  },
  {
    slug: 'cities-in-dust-wasteland-1',
    title: 'Cities in Dust (Wasteland #1)',
    maker: 'Antony Johnston',
    category: 'Graphic Novels',
    tags: ['fiction', 'post-apoc', 'sci-fi'],
    blurb: 'A post-apocalyptic desert world, generations after \u2019The Big Wet,\u2019 where survival means never trusting the ground beneath you.',
    isbn: '9781932664591',
    status: ''
  },
  {
    slug: 'poe-stories-and-poems',
    title: 'Poe: Stories and Poems: A Graphic Novel Adaptation',
    maker: 'Gareth Hinds (Candlewick Press)',
    category: 'Graphic Novels',
    tags: ['fiction', 'horror', 'classics', 'adaptation', 'poetry'],
    blurb: 'A gorgeously illustrated adaptation of Poe\u2019s best-known stories and poems \u2014 The Tell-Tale Heart, The Raven, and more.',
    isbn: '9780763695095',
    status: ''
  },
  {
    slug: 'the-odyssey-hinds',
    title: 'The Odyssey',
    maker: 'Gareth Hinds (Candlewick Press)',
    category: 'Graphic Novels',
    tags: ['fiction', 'mythology', 'classics', 'adaptation', 'adventure'],
    blurb: 'Homer\u2019s epic homeward voyage, adapted into sweeping, cinematic comics pages.',
    isbn: '9780763642686',
    status: ''
  },
  {
    slug: 'tmnt-the-last-ronin',
    title: 'Teenage Mutant Ninja Turtles: The Last Ronin',
    maker: 'Kevin Eastman, Peter Laird, Tom Waltz, Esau & Isaac Escorza',
    category: 'Graphic Novels',
    tags: ['fiction', 'action', 'sci-fi', 'licensed'],
    blurb: 'The last surviving Turtle, decades after losing his brothers, wages one final war on the empire that took them.',
    isbn: '9798887241296',
    status: ''
  },
  {
    slug: '1984-graphic-novel',
    title: '1984: The Graphic Novel',
    maker: 'adapted from George Orwell, art by Fido Nesti',
    category: 'Graphic Novels',
    tags: ['fiction', 'dystopian', 'classics', 'adaptation'],
    blurb: 'Orwell\u2019s surveillance-state classic, rendered in stark, oppressive graphic form.',
    isbn: '9780358359920',
    status: ''
  },
  {
    slug: 'harleen',
    title: 'Harleen',
    maker: 'Stjepan Šejić (DC Comics)',
    category: 'Graphic Novels',
    tags: ['fiction', 'superhero', 'psychological'],
    blurb: 'A psychiatrist named Harleen Quinzel falls for her most dangerous patient. A painterly, character-driven origin for Harley Quinn.',
    isbn: '9781779501110',
    status: ''
  },
  {
    slug: 'the-giver-graphic-novel',
    title: 'The Giver (Graphic Novel)',
    maker: 'adapted from Lois Lowry, art by P. Craig Russell',
    category: 'Graphic Novels',
    tags: ['fiction', 'dystopian', 'ya', 'adaptation'],
    blurb: 'A boy is chosen to inherit a community\u2019s suppressed memories \u2014 and discovers exactly what "perfect" cost everyone else.',
    isbn: '9781328575487',
    status: ''
  },
  {
    slug: 'the-many-deaths-of-laila-starr',
    title: 'The Many Deaths of Laila Starr',
    maker: 'Ram V / Filipe Andrade',
    category: 'Graphic Novels',
    tags: ['fiction', 'fantasy', 'literary', 'mythology'],
    blurb: 'Death herself is fired and reincarnated as a mortal girl, tasked with watching over the man destined to make humanity immortal.',
    isbn: '9781684158058',
    status: ''
  },
  {
    slug: 'conan-the-barbarian',
    title: 'Conan the Barbarian',
    maker: 'various, orig. Robert E. Howard',
    category: 'Graphic Novels',
    tags: ['fiction', 'fantasy', 'sword-and-sorcery', 'licensed'],
    blurb: 'The sword-and-sorcery original \u2014 Conan\u2019s brutal, wandering adventures across the Hyborian Age.',
    isbn: '9781787748378',
    status: '',
    hideCover: true
  },
  {
    slug: 'highlander-comic',
    title: 'Highlander',
    maker: 'various',
    category: 'Graphic Novels',
    tags: ['fiction', 'fantasy', 'action', 'licensed'],
    blurb: 'Travel through time in this sword-clashing adventure spanning over a hundred years from the 1860s to the beginning of the first movie. In the thirty years since its release, Highlander has inspired a cult following and numerous spinoffs with its epic clashes between powerful immortals. Now, The American Dream follows Scottish swordsman Connor MacLeod as he navigates through the American Civil War and 1950s Manhattan toward The Gathering in 1986.',
    isbn: '9781684050116',
    status: '',
    hideCover: true
  },
  {
    slug: 'fun-home',
    title: 'Fun Home: A Family Tragicomic',
    maker: 'Alison Bechdel',
    category: 'Graphic Novels',
    tags: ['non-fiction', 'memoir', 'queer'],
    blurb: 'A cartoonist\u2019s memoir of her closeted father, her own coming out, and the funeral home they called \u2019the fun home.\u2019',
    isbn: '9780618871711',
    status: ''
  },
  {
    slug: 'the-complete-persepolis',
    title: 'The Complete Persepolis',
    maker: 'Marjane Satrapi',
    category: 'Graphic Novels',
    tags: ['non-fiction', 'memoir', 'politics', 'history'],
    blurb: 'A girl\u2019s coming-of-age during and after the Iranian Revolution, told in stark, unforgettable black and white.',
    isbn: '9780375714832',
    status: ''
  },
  {
    slug: 'ghost-world',
    title: 'Ghost World',
    maker: 'Daniel Clowes',
    category: 'Graphic Novels',
    tags: ['fiction', 'literary', 'coming-of-age'],
    blurb: 'Two acerbic teenage girls drift apart in the last summer before adulthood catches up with them.',
    isbn: '9781560974277',
    status: ''
  },
  {
    slug: 'seek-you',
    title: 'Seek You: A Journey Through American Loneliness',
    maker: 'Kristen Radtke',
    category: 'Graphic Novels',
    tags: ['non-fiction', 'essay', 'memoir', 'psychology'],
    blurb: 'A graphic essay on the history and shape of American loneliness, woven through with the author\u2019s own life.',
    isbn: '9781524748067',
    status: ''
  },
  {
    slug: 'bttm-fdrs',
    title: 'BTTM FDRS',
    maker: 'Ezra Claytan Daniels / Ben Passmore',
    category: 'Graphic Novels',
    tags: ['fiction', 'horror', 'satire'],
    blurb: 'A fashion designer moves into a gentrifying neighborhood\u2019s cheapest apartment \u2014 and finds the building itself has a horrifying appetite.',
    isbn: '9781683962069',
    status: ''
  },
  {
    slug: 'cant-we-talk-about-something-more-pleasant',
    title: 'Can\u2019t We Talk About Something More Pleasant?',
    maker: 'Roz Chast',
    category: 'Graphic Novels',
    tags: ['non-fiction', 'memoir', 'humor'],
    blurb: 'A cartoonist\u2019s wry, aching memoir of caring for her aging parents through their final years.',
    isbn: '9781632861016',
    status: ''
  },
  {
    slug: 'grass',
    title: 'Grass',
    maker: 'Keum Suk Gendry-Kim (trans. Janet Hong)',
    category: 'Graphic Novels',
    tags: ['non-fiction', 'history', 'memoir', 'war'],
    blurb: 'A survivor\u2019s account of Japanese wartime sexual slavery during WWII \u2014 heavy, unflinching, and important.',
    contentWarning: 'sexual violence, war',
    isbn: '9781770463622',
    status: ''
  },
  {
    slug: 'are-you-my-mother',
    title: 'Are You My Mother?: A Comic Drama',
    maker: 'Alison Bechdel',
    category: 'Graphic Novels',
    tags: ['non-fiction', 'memoir', 'queer', 'psychology'],
    blurb: 'A cartoonist examines her complicated bond with her mother through psychoanalytic theory and Virginia Woolf.',
    isbn: '9780544002234',
    status: ''
  },
  {
    slug: 'the-secret-to-superhuman-strength',
    title: 'The Secret to Superhuman Strength',
    maker: 'Alison Bechdel',
    category: 'Graphic Novels',
    tags: ['non-fiction', 'memoir', 'queer'],
    blurb: 'A memoir of the author\u2019s lifelong string of fitness obsessions \u2014 and what she was really chasing the whole time.',
    isbn: '9780544387652',
    featured: true,
    status: ''
  },
  {
    slug: 'spent-a-comic-novel',
    title: 'Spent: A Comic Novel',
    maker: 'Alison Bechdel',
    category: 'Graphic Novels',
    tags: ['fiction', 'satire', 'queer', 'autofiction'],
    blurb: 'Bechdel writes herself into fiction alongside characters from Dykes to Watch Out For, decades later, in small-town Vermont.',
    isbn: '9780063278929',
    status: ''
  },
  {
    slug: 'the-essential-dykes-to-watch-out-for',
    title: 'The Essential Dykes to Watch Out For',
    maker: 'Alison Bechdel',
    category: 'Graphic Novels',
    tags: ['fiction', 'satire', 'queer', 'classics'],
    blurb: 'Decades of Bechdel\u2019s beloved, cult-favorite comic strip chronicling a circle of lesbian friends, collected in one volume.',
    isbn: '9780358424178',
    status: ''
  },
  {
    slug: 'wendy-master-of-art',
    title: 'Wendy, Master of Art',
    maker: 'Walter Scott',
    category: 'Graphic Novels',
    tags: ['fiction', 'satire', 'coming-of-age'],
    blurb: 'A struggling art-school painter navigates ego, ambition, and bad decisions in this sharp, funny series.',
    isbn: '9781770463998',
    status: ''
  },
  {
    slug: 'my-favorite-thing-is-monsters',
    title: 'My Favorite Thing is Monsters',
    maker: 'Emil Ferris',
    category: 'Graphic Novels',
    tags: ['fiction', 'horror', 'literary', 'coming-of-age'],
    blurb: 'A ten-year-old horror-obsessed girl in 1960s Chicago investigates her neighbor\u2019s murder, sketchbook in hand. A dazzling, singular graphic novel.',
    isbn: '9781606999592',
    featured: true,
    status: ''
  },


  // =================================================================
  // ACCESSORIES
  // =================================================================
  {
    slug: 'the-spacious-tarot',
    title: 'The Spacious Tarot',
    maker: 'Carrie Mallon & Annie Ruygt',
    category: 'Accessories',
    tags: ['tarot', 'indie', 'landscape-art'],
    blurb: 'A human-free tarot of open landscapes \u2014 room to bring your own meaning to every card.',
    status: 'wishlist',
    featured: true,
    links: [{ label: 'Spacious Tarot', url: 'https://thespacioustarot.com/' }]
  },
  {
    slug: 'local-zine-rack',
    title: 'The Zine Rack',
    maker: 'Local makers · rotating',
    category: 'Accessories',
    tags: ['zines', 'diy', 'local'],
    blurb: 'Rotating rack of local and small-press zines: comics, poetry, punk history, mutual aid how-tos. Make one and we\u2019ll stock it.',
    status: 'favorite',
  },
  {
    slug: 'dice-goblin-corner',
    title: 'Dice Goblin Corner',
    maker: 'Assorted',
    category: 'Accessories',
    tags: ['dice', 'rpg-table'],
    blurb: 'Sets, singles, and the big jar of mystery d20s. Click-clack responsibly.',
    status: 'favorite'
  }
]
