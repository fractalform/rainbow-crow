<script setup lang="ts"></script>
<template>
  <div class="app-shell">
    <AppHeader class="app-header" variant="default" title="Rainbow Crow" />
    <aside class="sidebar-area"><SideBar /></aside>
    <main class="content-area"><slot /></main>
    <AppFooter variant="default" />
  </div>
</template>
<style scoped>
.app-shell { min-height: 100vh; display: grid; grid-template-columns: 280px 1fr; grid-template-rows: var(--header-h) 1fr; grid-template-areas: "header header" "sidebar content"; }
.app-header { grid-area: header; }
.sidebar-area { grid-area: sidebar; position: sticky; top: var(--header-h); height: calc(100vh - var(--header-h)); overflow: auto; background: var(--surface); border-right: 1px solid var(--border); }
.content-area { grid-area: content; min-width: 0; padding-bottom: var(--footer-h); }
@media (max-width: 900px) {
  .app-shell { grid-template-columns: 1fr; grid-template-areas: "header" "content"; }
  .sidebar-area { display: none; }
}
</style>
