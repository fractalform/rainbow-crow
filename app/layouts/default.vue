<script setup lang="ts">
// no header logic needed anymore
</script>

<template>
  <div class="app-shell">
    <!-- Shared header component -->
    <AppHeader class="app-header" variant="default" title="My Nuxt Website" />

    <aside class="sidebar-area">
      <SideBar />
    </aside>

    <main class="content-area">
      <slot />
    </main>
   <AppFooter variant="default" />

  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: var(--header-h) 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
}

.app-header {
  grid-area: header;
}

/* Sidebar */
.sidebar-area {
  grid-area: sidebar;
  position: sticky;
  top: var(--header-h);
  height: calc(100vh - var(--header-h));
  overflow: auto;

  background: var(--surface);
  border-right: 1px solid var(--border);
}

/* Main content */
.content-area {
  grid-area: content;
  min-width: 0;
  padding-bottom: var(--footer-h);
}

/* Mobile */
@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "content";
  }

  .sidebar-area {
    display: none;
  }
}
</style>
