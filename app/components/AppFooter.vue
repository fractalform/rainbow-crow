<script setup lang="ts">
type Variant = 'default' | 'landing'

const props = withDefaults(
  defineProps<{
    variant?: Variant
  }>(),
  {
    variant: 'default'
  }
)
</script>

<template>
  <footer class="footer-area" :data-variant="props.variant">
    <div class="footer-inner">
      <!-- Left block: image + links -->
      <div class="left">
        <NuxtLink to="/" class="thumb" aria-label="Home">
          <img class="thumb-img" src="/images/AL-Symbol2a.png" alt="Site symbol" />
        </NuxtLink>

        <nav class="links" aria-label="Footer links">
          <NuxtLink to="/about" class="f-link">About</NuxtLink>
          <NuxtLink to="/work" class="f-link">Work</NuxtLink>
          <NuxtLink to="/contact" class="f-link">Contact</NuxtLink>
        </nav>
      </div>

      <!-- Right block: meta -->
      <div class="right">
        <p class="meta">
          © {{ new Date().getFullYear() }} My Nuxt Website
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Make footer taller + keep a single source of truth */
:global(:root) {
  --footer-h: 88px;          /* was 72px */
  --dark-bar: #222;
}

/* Fixed footer bar */
.footer-area {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;

  height: var(--footer-h);
  background: var(--dark-bar);
  color: rgba(255, 255, 255, 0.92);

  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Two-column alignment shell */
.footer-inner {
  height: 100%;
  display: grid;
  align-items: center;          /* vertical center for both columns */
}

.footer-area[data-variant="default"] .footer-inner {
  grid-template-columns: 280px 1fr;
}

/* Landing stays centered container */
.footer-area[data-variant="landing"] .footer-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
  grid-template-columns: 1fr auto;
}

/* Landing: left+right should use container padding, not extra inner padding */
.footer-area[data-variant="landing"] .left,
.footer-area[data-variant="landing"] .right {
  padding: 0;
}

/* Also make sure landing aligns vertically + horizontally as intended */
.footer-area[data-variant="landing"] .left {
  justify-content: flex-start;
}

.footer-area[data-variant="landing"] .right {
  justify-content: flex-end;
}

/* Ensure the left column has enough usable width in default layout.
   The previous gap + padding could squeeze links and cause early wrapping. */
.footer-area[data-variant="default"] .left {
  padding-left: var(--gutter);
  width: 100%;                  /* consume full 280px column */
  justify-content: flex-start;
}

.footer-area[data-variant="default"] .right {
  padding-right: var(--gutter);
}

/* Left block: image + links, vertically centered */
.left {
  display: flex;
  align-items: center;          /* vertical center for image + link pills */
  gap: 18px;                    /* more separation between image and links */
  min-width: 0;
}

.thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 2px;               
  border-radius: 10px;

  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.04);

  transition: transform var(--dur-1) var(--ease-out),
              border-color var(--dur-1) var(--ease-out);
}

.thumb:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.18);
}

.thumb-img {
  width: 100%;
  height: 100%;
  max-width: 60px;   /* controls overall visual size */
  max-height: 60px;
  object-fit: contain;
}

/* Links: prevent “early wrap” as much as possible
   - allow flex row
   - don't wrap by default on desktop
   - let the container be scroll/clip-safe if needed
*/
.links {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;            /* key change: stay on one line */
  min-width: 0;
}

/* Match header pill radius + spacing */
.f-link {
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;

  padding: 0.45rem 0.65rem;
  border-radius: 10px;          /* match header pills (10px) */

  transition: background var(--dur-1) var(--ease-out),
              transform var(--dur-1) var(--ease-out);
  white-space: nowrap;          /* keep each link from breaking */
}

.f-link:hover {
  background: rgba(255, 255, 255, 0.10);
  transform: translateY(-1px);
}

/* Right block: meta aligned like header nav (right + vertically centered) */
.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
}

.meta {
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  white-space: nowrap;
}

/* Mobile: stacked + centered, footer grows in height as needed
   NOTE: To make the footer taller/shorter in general, change --footer-h (defined at :global(:root) above). */
@media (max-width: 900px) {
  /* Let the bar grow instead of clipping content */
  .footer-area {
    height: auto;
    min-height: var(--footer-h); /* baseline height controlled by --footer-h */
    padding: 10px 0;             /* vertical breathing room when stacked */
  }

  /* Stack rows and center everything */
  .footer-area[data-variant="default"] .footer-inner,
  .footer-area[data-variant="landing"] .footer-inner {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 10px;

    height: auto;                /* allow growth */
    min-height: var(--footer-h);

    padding: 0 var(--gutter);
    justify-items: center;       /* centers left/right blocks horizontally */
    align-content: center;
  }

  /* Top row: image + links centered */
  .left {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;             /* links can wrap nicely */
    gap: 12px 12px;              /* row/column gap when wrapping */
  }

  .links {
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Bottom row: meta centered and visible */
  .right {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .meta {
    white-space: normal;         /* allow wrap instead of clipping */
    text-align: center;
  }
}

</style>
