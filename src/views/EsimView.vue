<!-- src/views/EsimView.vue -->
<template>
  <div class="es">

    <!-- Header -->
    <div class="es-head">
      <h1 class="es-title">eSIM</h1>
      <p class="es-sub">A phone line your phone downloads — no physical SIM. Pick a network, choose a plan, and scan a QR code to start calling and texting.</p>
    </div>

    <!-- Networks -->
    <div class="es-grid">
      <button v-for="n in networks" :key="n.id" class="es-card" @click="openPlan(n)">
        <span class="es-card__flag"><img :src="flag(n.code)" :alt="n.title" /></span>
        <span class="es-card__text">
          <span class="es-card__title">{{ n.title }}</span>
          <span class="es-card__desc">{{ n.region }} · {{ n.plan }}</span>
          <span class="es-card__meta">{{ n.durations.length }} durations · from {{ money(minPrice(n)) }}</span>
        </span>
        <svg class="es-card__go" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- My eSIMs -->
    <div class="es-mine">
      <h2 class="es-mine__title">My eSIMs</h2>
      <p v-if="!mine.length" class="es-mine__empty">You haven't bought an eSIM yet.</p>
      <div v-else class="es-mine__list">
        <div v-for="(m, i) in mine" :key="i" class="es-sim">
          <div class="es-sim__qr" v-html="qr(m.id)"></div>
          <div class="es-sim__info">
            <div class="es-sim__title">{{ m.title }}</div>
            <div class="es-sim__sub">{{ m.duration }} · {{ money(m.price) }}</div>
            <span class="es-sim__badge">ACTIVE · scan QR to install</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan modal -->
    <div v-if="active" class="es-overlay" @click.self="active = null">
      <div class="es-modal">
        <div class="es-modal__head">
          <span class="es-card__flag es-card__flag--lg"><img :src="flag(active.code)" :alt="active.title" /></span>
          <div>
            <div class="es-modal__title">{{ active.title }}</div>
            <div class="es-modal__sub">{{ active.region }} · {{ active.plan }}</div>
          </div>
          <button class="es-x" @click="active = null">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p class="es-modal__label">Choose a duration</p>
        <div class="es-durations">
          <button v-for="d in active.durations" :key="d.label" class="es-dur" :class="{ 'es-dur--on': pick && pick.label === d.label }" @click="pick = d">
            <span class="es-dur__label">{{ d.label }}</span>
            <span class="es-dur__price">{{ money(d.price) }}</span>
          </button>
        </div>
        <button class="es-buy" :disabled="!pick" @click="buy">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          {{ pick ? `Buy eSIM · ${money(pick.price)}` : 'Select a duration' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast.js'

const { success } = useToast()

const FLAGS = import.meta.glob('../assets/flags/*.svg', { eager: true, import: 'default' })
const flag = (code) => FLAGS[`../assets/flags/${code.toLowerCase()}.svg`]
const money = (n) => '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const networks = [
  { id: 'usa', code: 'US', title: 'USA eSIM', region: 'United States', plan: 'Unlimited Calls & Text',
    durations: [
      { label: '7 days', price: 82506.00 },
      { label: '15 days', price: 134900.00 },
      { label: '30 days', price: 219000.00 },
      { label: '90 days', price: 498000.00 },
    ] },
]
const minPrice = (n) => Math.min(...n.durations.map(d => d.price))

const active = ref(null)
const pick = ref(null)
const mine = ref([])

function openPlan(n) { active.value = n; pick.value = null }

function buy() {
  if (!pick.value) return
  mine.value.unshift({ id: 'GG' + Date.now(), title: active.value.title, duration: pick.value.label, price: pick.value.price })
  success('eSIM purchased', `${active.value.title} · ${pick.value.label} — scan the QR to install.`)
  active.value = null
}

/* Deterministic decorative QR-style block */
function qr(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const n = 9, cells = []
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    const on = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5) || (h % 2 === 0)
    if (on) cells.push(`<rect x="${x*5}" y="${y*5}" width="5" height="5"/>`)
  }
  return `<svg viewBox="0 0 45 45" width="56" height="56" fill="#0b0f0e">${cells.join('')}</svg>`
}
</script>

<style scoped>
.es { display: flex; flex-direction: column; gap: 16px; }

.es-head { display: flex; flex-direction: column; gap: 6px; }
.es-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.es-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

.es-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 360px)); gap: 16px; }
.es-card {
  display: flex; align-items: center; gap: 14px; cursor: pointer; text-align: left; font-family: inherit;
  padding: 16px; border-radius: 16px; background: var(--bg); border: 1px solid var(--t4); 
  transition: border-color 0.2s ease, transform 0.16s ease;
}
.es-card:hover { border-color: var(--accent-border); transform: translateY(-3px); }
.es-card__flag { width: 46px; height: 46px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 1px solid var(--border-soft); }
.es-card__flag img { width: 100%; height: 100%; object-fit: cover; }
.es-card__flag--lg { width: 52px; height: 52px; }
.es-card__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.es-card__title { font-size: 0.95rem; font-weight: 700; color: var(--t1); }
.es-card__desc { font-size: 0.82rem; color: var(--t2); }
.es-card__meta { font-size: 0.76rem; color: var(--t3); }
.es-card__go { color: var(--t3); flex-shrink: 0; transition: color 0.18s ease, transform 0.18s ease; }
.es-card:hover .es-card__go { color: var(--accent); transform: translateX(3px); }

.es-mine { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.es-mine__title { margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--t1); }
.es-mine__empty { margin: 0; font-size: 0.86rem; color: var(--t3); }
.es-mine__list { display: flex; flex-direction: column; gap: 12px; }
.es-sim { display: flex; align-items: center; gap: 16px; background: var(--bg); border: 1px solid var(--t4); border-radius: 14px; padding: 16px; }
.es-sim__qr { width: 64px; height: 64px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--border-soft); }
.es-sim__title { font-size: 0.9rem; font-weight: 700; color: var(--t1); }
.es-sim__sub { font-size: 0.8rem; color: var(--t3); margin: 2px 0 6px; }
.es-sim__badge { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; color: #16a34a; background: rgba(22,163,74,0.1); border: 1px solid rgba(22,163,74,0.25); padding: 3px 8px; border-radius: 999px; }

/* Modal */
.es-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(8,12,10,0.55); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.es-modal { width: 100%; max-width: 420px; background: var(--bg); border: 1px solid var(--border); border-radius: 20px; padding: 22px; }
.es-modal__head { display: flex; align-items: center; gap: 12px; }
.es-modal__title { font-size: 1.05rem; font-weight: 800; color: var(--t1); }
.es-modal__sub { font-size: 0.8rem; color: var(--t3); margin-top: 2px; }
.es-x { margin-left: auto; width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border); background: var(--bg); color: var(--t3); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.es-x:hover { color: var(--t1); border-color: var(--accent-border); }
.es-modal__label { margin: 18px 0 10px; font-size: 0.78rem; font-weight: 700; color: var(--t2); }
.es-durations { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.es-dur { display: flex; flex-direction: column; gap: 4px; padding: 14px; border-radius: 12px; cursor: pointer; text-align: left; background: var(--bg); border: 1px solid var(--border); font-family: inherit; transition: border-color 0.16s ease, background 0.16s ease; }
.es-dur:hover { border-color: var(--accent-border); }
.es-dur--on { border-color: var(--accent); background: var(--accent-dim); }
.es-dur__label { font-size: 0.86rem; font-weight: 700; color: var(--t1); }
.es-dur__price { font-size: 0.8rem; font-weight: 600; color: var(--t2); }
.es-buy {
  width: 100%; margin-top: 18px; height: 46px; border-radius: 12px; cursor: pointer; border: none;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.88rem; font-weight: 700; 
  position: relative; overflow: hidden; isolation: isolate; transition: transform 0.15s ease;
}
.es-buy:disabled { opacity: 0.5; cursor: not-allowed; }
.es-buy:not(:disabled):hover { transform: translateY(-2px); }
.es-buy:not(:disabled)::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 45%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.22) 60%, transparent 100%);
  transform: skewX(-22deg); pointer-events: none; z-index: 2; animation: es-shine 3s ease-in-out infinite; animation-delay: 1s;
}
@keyframes es-shine { 0% { left: -80%; } 35% { left: 130%; } 100% { left: 130%; } }

@media (max-width: 760px) { .es-grid { grid-template-columns: 1fr; } }
</style>
