// app/data/tagGroups.ts
//
// Groups catalog tags under labeled sections for the filter UI on
// /catalog (inspired by how Modrinth groups its mod filters under
// headers like "Categories" / "Performance Impact" / "Features" —
// same idea, just always-visible labeled sections rather than an
// accordion). Purely a display concern: it doesn't change what tags
// exist or how filtering works, just how the tag chip list is
// organized visually.
//
// GROUP_ORDER controls the order sections appear in. TAG_GROUPS maps
// every tag to exactly one group. Any tag not listed here falls into
// the "Other" catch-all (see getGroupedTags in useCatalog.ts) instead
// of silently disappearing — so adding a new tag to a catalog entry
// without also updating this file is safe, just less tidy until you
// do.

export const GROUP_ORDER = [
  'Genre & Theme',
  'Format & Structure',
  'Identity & Politics',
  'Nonfiction Subject',
  'Mechanics & Systems',
  'Play Context',
  'DIY & Community',
  'Other'
] as const

export const TAG_GROUPS: Record<string, string> = {
  // Genre & Theme
  action: 'Genre & Theme', adventure: 'Genre & Theme', 'alt-history': 'Genre & Theme',
  anime: 'Genre & Theme', 'anime-inspired': 'Genre & Theme', 'coming-of-age': 'Genre & Theme',
  conservation: 'Genre & Theme', contemporary: 'Genre & Theme', cozy: 'Genre & Theme',
  cyberpunk: 'Genre & Theme', dragons: 'Genre & Theme', dystopian: 'Genre & Theme',
  exploration: 'Genre & Theme', fantasy: 'Genre & Theme', folklore: 'Genre & Theme',
  'found-family': 'Genre & Theme', gothic: 'Genre & Theme', 'gothic-punk': 'Genre & Theme',
  grimdark: 'Genre & Theme', heist: 'Genre & Theme', hiking: 'Genre & Theme',
  'historical-fantasy': 'Genre & Theme', 'historical-fiction': 'Genre & Theme', horror: 'Genre & Theme',
  humor: 'Genre & Theme', 'indigenous-futurism': 'Genre & Theme', 'industrial-revolution': 'Genre & Theme',
  'jrpg-inspired': 'Genre & Theme', 'landscape-art': 'Genre & Theme', literary: 'Genre & Theme',
  'magical-realism': 'Genre & Theme', 'martial-arts': 'Genre & Theme', mystery: 'Genre & Theme',
  mythology: 'Genre & Theme', nature: 'Genre & Theme', occult: 'Genre & Theme',
  paranormal: 'Genre & Theme', pastoral: 'Genre & Theme', 'post-apoc': 'Genre & Theme',
  psychological: 'Genre & Theme', romance: 'Genre & Theme', satire: 'Genre & Theme',
  'sci-fantasy': 'Genre & Theme', 'sci-fi': 'Genre & Theme', 'sci-fi-horror': 'Genre & Theme',
  solarpunk: 'Genre & Theme', 'space-opera': 'Genre & Theme', superhero: 'Genre & Theme',
  survival: 'Genre & Theme', swashbuckling: 'Genre & Theme', 'sword-and-sorcery': 'Genre & Theme',
  'teen-drama': 'Genre & Theme', 'time-travel': 'Genre & Theme', transhumanist: 'Genre & Theme',
  'urban-fantasy': 'Genre & Theme', war: 'Genre & Theme', 'weird-fiction': 'Genre & Theme',
  woodland: 'Genre & Theme',

  // Format & Structure
  adaptation: 'Format & Structure', autofiction: 'Format & Structure', childrens: 'Format & Structure',
  classics: 'Format & Structure', deconstruction: 'Format & Structure', essay: 'Format & Structure',
  fiction: 'Format & Structure', memoir: 'Format & Structure', 'non-fiction': 'Format & Structure',
  'picture-book': 'Format & Structure', poetry: 'Format & Structure', reference: 'Format & Structure',
  vintage: 'Format & Structure', ya: 'Format & Structure',

  // Identity & Politics
  anarchism: 'Identity & Politics', 'anti-colonial': 'Identity & Politics', disability: 'Identity & Politics',
  indigenous: 'Identity & Politics', organizing: 'Identity & Politics', 'own-voices': 'Identity & Politics',
  politics: 'Identity & Politics', queer: 'Identity & Politics', 'queer-creators': 'Identity & Politics',

  // Nonfiction Subject
  history: 'Nonfiction Subject', language: 'Nonfiction Subject', psychology: 'Nonfiction Subject',
  science: 'Nonfiction Subject', sociology: 'Nonfiction Subject', spirituality: 'Nonfiction Subject',
  tarot: 'Nonfiction Subject', theory: 'Nonfiction Subject',

  // Mechanics & Systems
  'area-control': 'Mechanics & Systems', asymmetric: 'Mechanics & Systems', bestiary: 'Mechanics & Systems',
  campaign: 'Mechanics & Systems', 'card-drafting': 'Mechanics & Systems', 'card-game': 'Mechanics & Systems',
  commander: 'Mechanics & Systems', d20: 'Mechanics & Systems', d6: 'Mechanics & Systems',
  deckbuilder: 'Mechanics & Systems', dice: 'Mechanics & Systems', 'dice-drafting': 'Mechanics & Systems',
  'dungeon-crawl': 'Mechanics & Systems', 'dungeons-and-dragons': 'Mechanics & Systems', economic: 'Mechanics & Systems',
  'engine-builder': 'Mechanics & Systems', 'forged-in-the-dark': 'Mechanics & Systems', generic: 'Mechanics & Systems',
  'gm-less': 'Mechanics & Systems', investigation: 'Mechanics & Systems', lcg: 'Mechanics & Systems',
  legacy: 'Mechanics & Systems', module: 'Mechanics & Systems', 'one-shot': 'Mechanics & Systems',
  'original-setting': 'Mechanics & Systems', osr: 'Mechanics & Systems', pbta: 'Mechanics & Systems',
  percentile: 'Mechanics & Systems', 'rpg-table': 'Mechanics & Systems', skirmish: 'Mechanics & Systems',
  tcg: 'Mechanics & Systems', 'tile-drafting': 'Mechanics & Systems', 'tile-laying': 'Mechanics & Systems',
  'trick-taking': 'Mechanics & Systems', 'worker-placement': 'Mechanics & Systems',

  // Play Context
  '1-5 players': 'Play Context', abstract: 'Play Context', 'all-ages': 'Play Context',
  'casual-night': 'Play Context', 'co-op': 'Play Context', family: 'Play Context',
  gateway: 'Play Context', 'gorgeous-components': 'Play Context', heavy: 'Play Context',
  indie: 'Play Context', licensed: 'Play Context', mainstream: 'Play Context',
  'quick-play': 'Play Context', 'rules-light': 'Play Context', 'small-box': 'Play Context',
  'solo-friendly': 'Play Context', tactical: 'Play Context', 'war-game-but-cute': 'Play Context',

  // DIY & Community
  'community-run': 'DIY & Community', diy: 'DIY & Community', local: 'DIY & Community', zines: 'DIY & Community'
}
