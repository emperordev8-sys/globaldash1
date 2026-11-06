<!-- src/components/ui/TourOverlay.vue -->
<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <div v-if="active" class="tour-root">

        <!-- Centered step: full dimmer, no spotlight -->
        <div v-if="mode === 'center'" class="tour-dim" />

        <!-- Spotlight step: transparent hole over the target -->
        <div
          v-else-if="box"
          class="tour-spot"
          :style="{
            top:    box.top + 'px',
            left:   box.left + 'px',
            width:  box.width + 'px',
            height: box.height + 'px',
          }"
        />

        <!-- Tooltip / card -->
        <div
          class="tour-card"
          :class="{ 'tour-card--center': mode === 'center' }"
          :style="mode === 'center' ? null : cardStyle"
          ref="cardEl"
          role="dialog"
          aria-live="polite"
        >
          <button class="tour-card__close" @click="stop" aria-label="Skip tour">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <h3 class="tour-card__title">{{ current.title }}</h3>
          <p class="tour-card__body">{{ current.body }}</p>

          <div class="tour-card__foot">
            <span class="tour-card__step">{{ stepIndex + 1 }} / {{ steps.length }}</span>
            <div class="tour-card__nav">
              <button v-if="stepIndex > 0" class="tour-btn tour-btn--ghost" @click="prev">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                Back
              </button>
              <button class="tour-btn tour-btn--primary" @click="next">
                {{ stepIndex === steps.length - 1 ? 'Done' : 'Next' }}
                <svg v-if="stepIndex !== steps.length - 1" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useTour } from '../../composables/useTour.js'

const { active, stepIndex, steps, stop, next, prev } = useTour()

const box     = ref(null)        // spotlight rect {top,left,width,height}
const mode    = ref('center')    // 'center' | 'spot'
const cardEl  = ref(null)
const cardPos = ref({ top: 0, left: 0 })

const current = computed(() => steps.value[stepIndex.value] ?? { title: '', body: '' })

const PAD = 8  // spotlight padding around target

function findEl() {
  const step = steps.value[stepIndex.value]
  if (!step || step.center || !step.target) return null
  return document.querySelector(step.target)
}

/* Resolve current step: centered, spotlight, or auto-skip when target missing. */
function resolve() {
  if (!active.value) return
  const step = steps.value[stepIndex.value]
  if (!step) { stop(); return }

  if (step.center || !step.target) {
    mode.value = 'center'
    box.value = null
    return
  }

  const el = document.querySelector(step.target)
  if (!el) {
    if (stepIndex.value < steps.value.length - 1) { next(); return }
    stop(); return
  }
  mode.value = 'spot'
  el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
  requestAnimationFrame(() => setTimeout(measure, 170))
}

function measure() {
  if (!active.value || mode.value !== 'spot') return
  const el = findEl()
  if (!el) { resolve(); return }
  const r = el.getBoundingClientRect()
  box.value = {
    top:    Math.max(r.top - PAD, 6),
    left:   Math.max(r.left - PAD, 6),
    width:  Math.min(r.width + PAD * 2, window.innerWidth - 12),
    height: r.height + PAD * 2,
  }
  nextTick(placeCard)
}

function placeCard() {
  const b = box.value
  if (!b) return
  const vw = window.innerWidth
  const vh = window.innerHeight
  const card = cardEl.value
  const cw = card?.offsetWidth  || 320
  const ch = card?.offsetHeight || 180
  const gap = 14

  let top = b.top + b.height + gap
  if (top + ch > vh - 10) top = b.top - ch - gap   // flip above
  if (top < 10) top = 10
  if (top + ch > vh - 10) top = Math.max(10, vh - ch - 10)

  let left = b.left + b.width / 2 - cw / 2
  left = Math.min(Math.max(left, 10), vw - cw - 10)

  cardPos.value = { top, left }
}

const cardStyle = computed(() => ({
  top:  cardPos.value.top + 'px',
  left: cardPos.value.left + 'px',
}))

function onViewportChange() {
  if (active.value && mode.value === 'spot') measure()
}

watch([active, stepIndex], async () => {
  if (active.value) { await nextTick(); resolve() }
  else box.value = null
})

watch(active, (on) => {
  if (on) {
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
  } else {
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
    document.removeEventListener('keydown', onKey)
    document.body.style.overflow = ''
  }
})

function onKey(e) {
  if (!active.value) return
  if (e.key === 'Escape') stop()
  else if (e.key === 'ArrowRight' || e.key === 'Enter') next()
  else if (e.key === 'ArrowLeft') prev()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.tour-root { position: fixed; inset: 0; z-index: 4000; }

/* Full dimmer for the centered welcome step */
.tour-dim {
  position: fixed; inset: 0;
  background: rgba(8, 15, 12, 0.6);
  backdrop-filter: blur(1.5px);
  -webkit-backdrop-filter: blur(1.5px);
}

/* Spotlight: transparent box with a giant shadow that dims everything else */
.tour-spot {
  position: fixed;
  border-radius: 14px;
  box-shadow: 0 0 0 9999px rgba(8, 15, 12, 0.62);
  outline: 2.5px solid #22c55e;
  outline-offset: 3px;
  transition: top 0.28s cubic-bezier(0.4,0,0.2,1), left 0.28s cubic-bezier(0.4,0,0.2,1),
              width 0.28s cubic-bezier(0.4,0,0.2,1), height 0.28s cubic-bezier(0.4,0,0.2,1);
  pointer-events: none;
}

.tour-card {
  position: fixed;
  width: min(340px, calc(100vw - 20px));
  background: var(--bg, #fff);
  border: 1px solid var(--border, rgba(0,0,0,0.08));
  border-radius: 18px;
  padding: 20px 20px 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
  animation: tour-pop 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tour-card--center {
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
@keyframes tour-pop {
  from { opacity: 0; transform: scale(0.94) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.tour-card--center { animation: tour-pop-center 0.26s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes tour-pop-center {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.94); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.tour-card__close {
  position: absolute; top: 14px; right: 14px;
  width: 26px; height: 26px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none;
  color: var(--t3, #9aa0a6); cursor: pointer;
  transition: color 0.18s, background 0.18s;
}
.tour-card__close:hover { color: var(--t1, #111); background: var(--glass-hover, rgba(0,0,0,0.05)); }

.tour-card__title {
  margin: 0 28px 8px 0;
  font-size: 1.08rem; font-weight: 800; color: var(--t1, #111);
  letter-spacing: -0.01em; line-height: 1.3;
}
.tour-card__body {
  margin: 0; font-size: 0.86rem; line-height: 1.6; color: var(--t2, #555);
}

.tour-card__foot {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: 18px;
}
.tour-card__step { font-size: 0.78rem; font-weight: 600; color: var(--t3, #9aa0a6); }
.tour-card__nav  { display: flex; align-items: center; gap: 8px; }

.tour-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 16px; border-radius: 10px;
  font-family: inherit; font-size: 0.82rem; font-weight: 700; cursor: pointer;
  transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease, color 0.18s ease;
}
.tour-btn:active { transform: scale(0.96); }
.tour-btn--ghost {
  background: transparent; border: none; color: var(--t2, #555);
}
.tour-btn--ghost:hover { color: var(--t1, #111); }
.tour-btn--primary {
  background: #16a34a; border: none; color: #fff;
  box-shadow: 0 8px 18px rgba(22, 163, 74, 0.32);
}
.tour-btn--primary:hover { background: #15803d; box-shadow: 0 10px 22px rgba(22, 163, 74, 0.4); }

.tour-fade-enter-active, .tour-fade-leave-active { transition: opacity 0.24s ease; }
.tour-fade-enter-from, .tour-fade-leave-to { opacity: 0; }
</style>
