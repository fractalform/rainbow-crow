<script setup lang="ts"></script>
<template>
  <div class="landing-shell">
    <main class="content-area"><slot /></main>
    <AppFooter variant="landing" />
  </div>
</template>
<style scoped>
.landing-shell { min-height: 100vh; }
.content-area { min-width: 0; padding-bottom: var(--footer-h); }
@media (max-width: 820px) {
  :deep(.features .container) { grid-template-columns: 1fr; }
}
</style>
