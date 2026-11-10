<!-- src/components/ui/TourLauncher.vue -->
<template>
  <Teleport to="body">
    <Transition name="fab-pop">
      <button
        v-if="!active"
        class="tour-fab"
        @click="launch"
        aria-label="Take the tour"
      >
        <span class="tour-fab__pulse" />
        <span class="tour-fab__shine" />
        <span class="tour-fab__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        </span>
        <span class="tour-fab__label">Take the tour</span>
      </button>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useTour } from '../../composables/useTour.js'

const router = useRouter()
const route = useRoute()
const { active, start } = useTour()

function launch() {
  const onDash = route.path === '/'
  if (!onDash) router.push('/')
  // let the dashboard render before the tour measures its targets
  setTimeout(() => start(), onDash ? 50 : 450)
}
</script>

<style scoped>
.tour-fab {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 3000;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 48px;
  padding: 0 20px 0 16px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%);
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease;
}
.tour-fab:hover {
  transform: translateY(-2px);
}
.tour-fab:active { transform: translateY(0); }

.tour-fab__icon { display: flex; align-items: center; position: relative; z-index: 2; }
.tour-fab__label { white-space: nowrap; position: relative; z-index: 2; }

/* Moving glass wave (clipped to the pill) */
.tour-fab__shine {
  position: absolute; inset: 0; border-radius: inherit;
  overflow: hidden; pointer-events: none; z-index: 1;
}
.tour-fab__shine::after {
  content: '';
  position: absolute; top: 0; bottom: 0; left: -80%;
  width: 45%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.22) 60%, transparent 100%);
  transform: skewX(-22deg);
  animation: fab-shine 3s ease-in-out infinite;
  animation-delay: 1.2s;
}
@keyframes fab-shine { 0% { left: -80%; } 35% { left: 130%; } 100% { left: 130%; } }
@media (prefers-reduced-motion: reduce) { .tour-fab__shine { display: none; } }

/* Soft attention pulse behind the button */
.tour-fab__pulse {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #22c55e;
  z-index: -1;
  animation: fab-pulse 2.6s ease-out infinite;
}
@keyframes fab-pulse {
  0% { transform: scale(1); opacity: 0.45; }
  70% { transform: scale(1.18); opacity: 0; }
  100% { transform: scale(1.18); opacity: 0; }
}

.fab-pop-enter-active { transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease; }
.fab-pop-leave-active { transition: transform 0.18s ease, opacity 0.18s ease; }
.fab-pop-enter-from, .fab-pop-leave-to { opacity: 0; transform: scale(0.8) translateY(8px); }

/* On small screens: tuck above the bottom gutter, shrink to an icon-friendly pill */
@media (max-width: 768px) {
  .tour-fab {
    right: 14px;
    bottom: 18px;
    height: 46px;
    padding: 0 18px 0 15px;
    font-size: 0.82rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tour-fab__pulse { animation: none; display: none; }
}
</style>
