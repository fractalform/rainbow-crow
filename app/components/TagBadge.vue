<template>
  <span class="tag">
    <slot />
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  background: #f6f6f6;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.8rem;
  line-height: 1.2;
  white-space: nowrap;
}
</style>