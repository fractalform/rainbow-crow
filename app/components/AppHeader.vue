<script setup lang="ts">
import { taglines } from '~/data/taglines'

type Variant = 'default' | 'landing'

const props = withDefaults(
  defineProps<{ variant?: Variant; title?: string }>(),
  { variant: 'default', title: 'Rainbow Crow' }
)

const route = useRoute()
const { nav } = useSiteNav()

// Start on a fixed tagline (taglines[0]) so server-rendered and
// client-hydrated markup match exactly — Vue warns/mismatches if SSR
// and the first client render disagree. Re-roll right after mount
// (client-only, so no mismatch), then again on every route change.
const currentTagline = ref(taglines[0])
function rollTagline() {
  currentTagline.value = taglines[Math.floor(Math.random() * taglines.length)]
}

const rootEl = ref<HTMLElement | null>(null)
const openMobile = ref(false)
const openKey = ref<string | null>(null)

function closeAll() { openMobile.value = false; openKey.value = null }
function toggleMobile() { openMobile.value = !openMobile.value; openKey.value = null }
function toggleSection(key: string) { openKey.value = openKey.value === key ? null : key }

watch(() => route.fullPath, () => { closeAll(); rollTagline() })

onMounted(() => {
  rollTagline()
  const onDocClick = (e: MouseEvent) => {
    const target = e.target as Node | null
    if (!target) return
    if (rootEl.value?.contains(target)) return
    closeAll()
  }
  document.addEventListener('click', onDocClick)
  onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
})
</script>

<template>
  <header ref="rootEl" class="header-area" :data-variant="props.variant">
    <div class="header-inner">
      <div class="brand">
        <NuxtLink to="/" class="brand-link" @click="closeAll">{{ props.title }}</NuxtLink>
      </div>

      <button type="button" class="hamburger" :aria-expanded="openMobile" aria-controls="mobile-menu" @click.stop="toggleMobile">
        <span class="sr-only">Open menu</span>☰
      </button>

<p v-if="props.variant === 'default'" class="tagline-bar">{{ currentTagline }}</p>

      <div id="mobile-menu" class="mobile-menu" :class="{ open: openMobile }">
        <div class="mobile-menu-inner">
          <template v-for="item in nav" :key="item.to">
            <div v-if="item.children?.length" class="mobile-group">
              <button type="button" class="mobile-trigger" :aria-expanded="openKey === item.to" @click="toggleSection(item.to)">
                <span>{{ item.label }}</span><span class="chev" aria-hidden="true">▾</span>
              </button>
              <div v-show="openKey === item.to" class="mobile-children">
                <NuxtLink :to="item.to" class="mobile-link child" @click="closeAll">{{ item.label }}</NuxtLink>
                <NuxtLink v-for="child in item.children" :key="child.to" :to="child.to" class="mobile-link child" @click="closeAll">
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>
            <NuxtLink v-else :to="item.to" class="mobile-link" @click="closeAll">{{ item.label }}</NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.tagline-bar { margin: 0; padding-right: calc(var(--gutter) + 30px); justify-self: end; color: rgba(255,255,255,0.6); font-size: 0.85rem; letter-spacing: 0.02em; text-align: right; }
.header-area { position: sticky; top: 0; z-index: 10; background: var(--dark-bar); color: rgba(255,255,255,0.92); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.header-inner { height: var(--header-h); display: grid; align-items: center; }
.header-area[data-variant="default"] .header-inner { grid-template-columns: 280px 1fr; }
.brand { padding-left: calc(var(--gutter) + 30px); }
.brand-link { text-decoration: none; font-family: var(--font-title); font-weight: 400; font-size: 2.6em; letter-spacing: 0.02em; text-transform: uppercase; background: var(--rainbow); -webkit-background-clip: text; background-clip: text; color: transparent; }
.chev { font-size: 0.85em; opacity: 0.75; }
.hamburger { display: none; justify-self: end; margin-right: var(--gutter); border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.92); border-radius: 10px; padding: 0.45rem 0.65rem; cursor: pointer; }
.mobile-menu { display: none; }
@media (max-width: 900px) {
  .hamburger { display: inline-flex; align-items: center; justify-content: center; }
  .header-area[data-variant="default"] .header-inner { grid-template-columns: 1fr auto; }
  .brand { padding-left: var(--gutter); }
  .tagline-bar { display: none; }
  .mobile-menu { display: block; position: absolute; left: 0; right: 0; top: var(--header-h); background: rgba(20, 18, 26, 0.94); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); transform: translateY(-8px); opacity: 0; pointer-events: none; transition: transform var(--dur-2) var(--ease-out), opacity var(--dur-2) var(--ease-out); z-index: 80; }
  .mobile-menu.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
  .mobile-menu-inner { max-width: var(--container); margin: 0 auto; padding: 0.75rem var(--gutter) 1rem; display: grid; gap: 0.5rem; }
  .mobile-link, .mobile-trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.65rem 0.75rem; border-radius: 12px; background: var(--surface); border: 1px solid var(--border); color: var(--text); text-decoration: none; cursor: pointer; }
  .mobile-trigger { font: inherit; }
  .mobile-children { margin-top: 0.35rem; display: grid; gap: 0.35rem; padding-left: 0.5rem; }
  .mobile-link.child { opacity: 0.95; }
}
</style>
