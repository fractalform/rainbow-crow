<script setup lang="ts">
const props = defineProps<{ to?: string }>()
</script>

<template>
  <NuxtLink v-if="props.to" :to="props.to" class="card"><slot /></NuxtLink>
  <div v-else class="card"><slot /></div>
</template>

<style scoped>
.card {
  display: block;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: var(--radius);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

.card:focus-visible {
  outline: 3px solid var(--ring);
  outline-offset: 2px;
}

.card.preview { display: grid; gap: 1rem; grid-template-columns: 84px minmax(0, 1fr); }
.card.preview.no-thumb { grid-template-columns: 1fr; }
</style>
