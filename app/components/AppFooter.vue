<script setup lang="ts">
type Variant = 'default' | 'landing'
const props = withDefaults(defineProps<{ variant?: Variant }>(), { variant: 'default' })
</script>

<template>
  <footer class="footer-area" :data-variant="props.variant">
    <div class="footer-inner">
      <div class="left">
        <NuxtLink to="/" class="thumb" aria-label="Home">
          <img class="thumb-img" src="/images/RC_Logo.png" alt="Site symbol" />
        </NuxtLink>
      </div>
      <div class="right">
        <p class="meta">© {{ new Date().getFullYear() }} Rainbow Crow · books &amp; games</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
:global(:root) { --footer-h: 88px; }
.footer-area { position: fixed; left: 0; right: 0; bottom: 0; z-index: 12; height: var(--footer-h); background: var(--dark-bar); color: rgba(255, 255, 255, 0.92); border-top: 1px solid rgba(255, 255, 255, 0.08); }
.footer-inner { height: 100%; display: grid; align-items: center; }
.footer-area[data-variant="default"] .footer-inner { grid-template-columns: 280px 1fr; }
.footer-area[data-variant="landing"] .footer-inner { max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); grid-template-columns: 1fr auto; }
.footer-area[data-variant="landing"] .left, .footer-area[data-variant="landing"] .right { padding: 0; }
.footer-area[data-variant="landing"] .left { justify-content: flex-start; }
.footer-area[data-variant="landing"] .right { justify-content: flex-end; }
.footer-area[data-variant="default"] .left { padding-left: calc(var(--gutter) + 30px); width: 100%; justify-content: flex-start; }
.footer-area[data-variant="default"] .right { padding-right: calc(var(--gutter) + 30px); }
.left { display: flex; align-items: center; gap: 18px; min-width: 0; }
.thumb { display: inline-flex; width: 76px; height: 76px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.10); background: rgba(255, 255, 255, 0.04); overflow: hidden; transition: transform var(--dur-1) var(--ease-out), border-color var(--dur-1) var(--ease-out);  }
.thumb:hover { transform: translateY(-1px); border-color: rgba(255, 255, 255, 0.18); }
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.right { display: flex; justify-content: flex-end; align-items: center; min-width: 0; }
.meta { margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.65); white-space: nowrap; }
@media (max-width: 720px) {
  .footer-area[data-variant="default"] .footer-inner,
  .footer-area[data-variant="landing"] .footer-inner { grid-template-columns: 1fr; height: auto; padding: 0.75rem var(--gutter); gap: 0.5rem; }
  .footer-area { position: static; height: auto; }
  .right { justify-content: flex-start; }
}
</style>
