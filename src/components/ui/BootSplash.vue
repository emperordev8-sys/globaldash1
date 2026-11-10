<!-- src/components/ui/BootSplash.vue -->
<template>
  <Transition name="boot-fade">
    <div v-if="visible" class="boot">
      <div class="boot__center">
        <div class="boot__logo-wrap">
          <img :src="logoSrc" alt="Globalgle" class="boot__logo" />
        </div>
        <span class="boot__name">Globalgle</span>

        <div class="boot__bar">
          <div class="boot__fill" :style="{ width: pct + '%' }"></div>
        </div>
        <span class="boot__pct">{{ pct }}%</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBootSplash } from '../../composables/useBootSplash.js'
import logo1 from '../../assets/logo1.jpg'

const { finishBooting } = useBootSplash()
const logoSrc = logo1

const visible = ref(true)
const pct = ref(0)

onMounted(() => {
  const duration = 4200
  const start = performance.now()

  function tick(now) {
    const linear = Math.min((now - start) / duration, 1)
    // ease-out so it feels fast then settles — more premium than linear
    const eased = 1 - Math.pow(1 - linear, 2)
    pct.value = Math.round(eased * 100)
    if (linear < 1) {
      requestAnimationFrame(tick)
    } else {
      setTimeout(() => {
        visible.value = false
        finishBooting()
      }, 320)
    }
  }
  requestAnimationFrame(tick)
})
</script>

<style scoped>
.boot {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(60% 50% at 50% 42%, rgba(34,197,94,0.14) 0%, transparent 70%),
    var(--bg);
}

.boot__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

/* ── Logo ── */
.boot__logo-wrap {
  position: relative;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: boot-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.boot__logo {
  position: relative;
  z-index: 1;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  object-fit: cover;
}

/* ── Brand name with sheen ── */
.boot__name {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: var(--t1);
  animation: boot-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

/* ── Slim progress bar ── */
.boot__bar {
  position: relative;
  width: 180px;
  height: 4px;
  border-radius: 999px;
  background: var(--glass-hover);
  overflow: hidden;
  animation: boot-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
}
.boot__fill {
  position: relative;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #34d17a 100%);
  transition: width 0.18s ease-out;
}
.boot__fill::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
  transform: translateX(-100%);
  animation: boot-sheen 1.1s ease-in-out infinite;
}
.boot__pct {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--t3);
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  animation: boot-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both;
}

@keyframes boot-rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes boot-sheen {
  0% { transform: translateX(-100%); }
  60%, 100% { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .boot__fill::after { animation: none; }
}

.boot-fade-enter-active { transition: opacity 0.2s ease; }
.boot-fade-leave-active { transition: opacity 0.45s ease; }
.boot-fade-enter-from,
.boot-fade-leave-to { opacity: 0; }
</style>
