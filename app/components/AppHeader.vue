<script setup lang="ts">
type Variant = 'default' | 'landing'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    title?: string
  }>(),
  {
    variant: 'default',
    title: 'My Nuxt Website'
  }
)

const route = useRoute()
const { nav } = useSiteNav()

const rootEl = ref<HTMLElement | null>(null)

// Mobile (hamburger) open/close
const openMobile = ref(false)

// Mobile dropdown sections (tap to open)
const openKey = ref<string | null>(null)

function closeAll() {
  openMobile.value = false
  openKey.value = null
}

function toggleMobile() {
  openMobile.value = !openMobile.value
  openKey.value = null
}

function toggleSection(key: string) {
  openKey.value = openKey.value === key ? null : key
}

// Close on navigation
watch(() => route.fullPath, () => closeAll())

// Close on outside click
onMounted(() => {
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
        <NuxtLink to="/" class="brand-link" @click="closeAll">
          {{ props.title }}
        </NuxtLink>
      </div>

      <!-- Hamburger (mobile only) -->
      <button
        type="button"
        class="hamburger"
        :aria-expanded="openMobile"
        aria-controls="mobile-menu"
        @click.stop="toggleMobile"
      >
        <span class="sr-only">Open menu</span>
        ☰
      </button>

      <!-- Desktop nav -->
      <nav class="top-nav" aria-label="Primary">
        <div v-for="item in nav" :key="item.to" class="nav-item">
          <!-- Parent with children -->
          <template v-if="item.children?.length">
            <!-- Desktop: hover opens. Mobile: hidden anyway -->
            <button
              type="button"
              class="link menu-trigger"
              @click.stop
              aria-haspopup="menu"
              :aria-expanded="false"
            >
              {{ item.label }}
              <span class="chev" aria-hidden="true">▾</span>
            </button>

            <div class="submenu" role="menu">
              <!-- Parent overview link -->
              <NuxtLink :to="item.to" class="link submenu-link" role="menuitem" @click="closeAll">
                {{ item.label }}
              </NuxtLink>

              <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="link submenu-link"
                role="menuitem"
                @click="closeAll"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </template>

          <!-- Simple link -->
          <template v-else>
            <NuxtLink :to="item.to" class="link" @click="closeAll">
              {{ item.label }}
            </NuxtLink>
          </template>
        </div>
      </nav>

      <!-- Mobile menu panel -->
      <div id="mobile-menu" class="mobile-menu" :class="{ open: openMobile }">
        <div class="mobile-menu-inner">
          <template v-for="item in nav" :key="item.to">
            <div v-if="item.children?.length" class="mobile-group">
              <button
                type="button"
                class="mobile-trigger"
                :aria-expanded="openKey === item.to"
                @click="toggleSection(item.to)"
              >
                <span>{{ item.label }}</span>
                <span class="chev" aria-hidden="true">▾</span>
              </button>

              <div v-show="openKey === item.to" class="mobile-children">
                <NuxtLink :to="item.to" class="mobile-link child" @click="closeAll">
                  {{ item.label }}
                </NuxtLink>

                <NuxtLink
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to"
                  class="mobile-link child"
                  @click="closeAll"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>

            <NuxtLink v-else :to="item.to" class="mobile-link" @click="closeAll">
              {{ item.label }}
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Header base */
.header-area {
  position: sticky;
  top: 0;
  z-index: 10;

  background: #222;
  color: rgba(255,255,255,0.92);

  backdrop-filter: none;
  -webkit-backdrop-filter: none;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Variant layouts:
   - default: aligns header columns with sidebar/content
   - landing: centered container */
.header-inner {
  height: var(--header-h);
  display: grid;
  align-items: center;
}

/* Default layout: sidebar width + content column */
.header-area[data-variant="default"] .header-inner {
  grid-template-columns: 280px 1fr;
}

/* Landing layout: simple centered container */
.header-area[data-variant="landing"] .header-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
  grid-template-columns: 1fr auto;
}

.brand {
  padding-left: var(--gutter);
}

.header-area[data-variant="landing"] .brand {
  padding-left: 0;
}

.brand-link {
  color: rgba(255,255,255,0.92);
  text-decoration: none;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Desktop nav */
.top-nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: var(--gutter);
  gap: 0.35rem;
}

.header-area[data-variant="landing"] .top-nav {
  padding-right: 0;
}

/* Top-level wrapper for dropdown positioning */
.nav-item {
  position: relative;
}

/* Make links + buttons identical pills */
.link,
.menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;

  color: rgba(255,255,255,0.92);
  text-decoration: none;
  opacity: 0.88;

  padding: 0.45rem 0.65rem;
  border-radius: 10px;

  transition: background var(--dur-1) var(--ease-out), opacity var(--dur-1) var(--ease-out);
}

.link:hover,
.menu-trigger:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.10);
}

.link.router-link-active {
  opacity: 1;
  background: rgba(99, 102, 241, 0.28);
}

.menu-trigger {
  margin: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
  gap: 0.35rem;
}

.chev {
  font-size: 0.85em;
  opacity: 0.75;
}

/* Dropdown */
.submenu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.15rem);
  min-width: 220px;

  padding: 0.35rem;
  border-radius: 12px;

  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);

  display: none;
  z-index: 60;
}

.submenu {
  background: #262626;
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: var(--shadow-md);
}

/* Desktop: hover opens + hover bridge prevents flicker */
@media (min-width: 901px) {
  .nav-item:hover .submenu,
  .nav-item:focus-within .submenu {
    display: block;
  }

  .nav-item::after {
    content: "";
    position: absolute;
    left: -8px;
    right: -8px;
    top: 100%;
    height: 14px;
  }
}

/* Hamburger */
.hamburger {
  display: none;
  justify-self: end;

  margin-right: var(--gutter);
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.92);
  border-radius: 10px;
  padding: 0.45rem 0.65rem;
  cursor: pointer;
}

/* Mobile menu */
.mobile-menu {
  display: none;
}

/* Mobile breakpoint */
@media (max-width: 900px) {
  .top-nav {
    display: none;
  }

  .hamburger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Default variant needs padding even though header-inner is grid */
  .header-area[data-variant="default"] .header-inner {
    grid-template-columns: 1fr auto;
  }

  .brand {
    padding-left: var(--gutter);
  }

  .mobile-menu {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: var(--header-h);

    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    border-bottom: 1px solid var(--border);

    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;

    transition: transform var(--dur-2) var(--ease-out), opacity var(--dur-2) var(--ease-out);
    z-index: 80;
  }

  .mobile-menu.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-menu-inner {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0.75rem var(--gutter) 1rem;
    display: grid;
    gap: 0.5rem;
  }

  .mobile-link,
  .mobile-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    padding: 0.65rem 0.75rem;
    border-radius: 12px;

    background: var(--surface);
    border: 1px solid var(--border);

    color: var(--text);
    text-decoration: none;
    cursor: pointer;
  }

  .mobile-trigger {
    font: inherit;
  }

  .mobile-children {
    margin-top: 0.35rem;
    display: grid;
    gap: 0.35rem;
    padding-left: 0.5rem;
  }

  .mobile-link.child {
    opacity: 0.95;
  }
}
</style>
