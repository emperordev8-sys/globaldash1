<!-- src/views/AccountVerificationView.vue -->
<template>
  <div class="av">

    <!-- Header -->
    <div class="av-head">
      <h1 class="av-title">Account Verification</h1>
      <p class="av-sub">Get your social / online accounts verified. Pick a package, tell us what to verify, and we handle the rest.</p>
    </div>

    <!-- Promo -->
    <div class="av-promo">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      <p>Your <strong>Premium</strong> plan gives you <strong>10% off</strong> on this service.</p>
    </div>

    <!-- Packages -->
    <div class="av-grid">
      <button v-for="p in packages" :key="p.id" class="av-card" @click="openPkg(p)">
        <span class="av-card__ico"><img :src="p.logo" :alt="p.name" /></span>
        <span class="av-card__text">
          <span class="av-card__name">{{ p.name }}</span>
          <span class="av-card__meta">{{ p.durations.length }} durations available</span>
        </span>
        <svg class="av-card__go" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- My verifications -->
    <div class="av-mine">
      <h2 class="av-mine__title">My verifications</h2>
      <p v-if="!mine.length" class="av-mine__empty">You haven't applied for any verification yet.</p>
      <div v-else class="av-mine__list">
        <div v-for="(m, i) in mine" :key="i" class="av-row">
          <span class="av-card__ico av-card__ico--sm"><img :src="m.logo" :alt="m.name" /></span>
          <div class="av-row__text">
            <div class="av-row__name">{{ m.name }} <span class="av-row__handle">{{ m.handle }}</span></div>
            <div class="av-row__sub">{{ m.duration }} · {{ money(m.price) }}</div>
          </div>
          <span class="av-row__badge">IN REVIEW</span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="active" class="av-overlay" @click.self="active = null">
      <div class="av-modal">
        <div class="av-modal__head">
          <span class="av-card__ico"><img :src="active.logo" :alt="active.name" /></span>
          <div>
            <div class="av-modal__title">{{ active.name }} verification</div>
            <div class="av-modal__sub">Pick a duration and tell us the account.</div>
          </div>
          <button class="av-x" @click="active = null">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <p class="av-modal__label">Duration</p>
        <div class="av-durations">
          <button v-for="d in active.durations" :key="d.label" class="av-dur" :class="{ 'av-dur--on': pick && pick.label === d.label }" @click="pick = d">
            <span class="av-dur__label">{{ d.label }}</span>
            <span class="av-dur__price">{{ money(d.price) }}</span>
          </button>
        </div>

        <p class="av-modal__label">Account to verify</p>
        <input v-model="handle" class="av-input" :placeholder="active.placeholder" />

        <button class="av-apply" :disabled="!canApply" @click="apply">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          {{ pick ? `Apply · ${money(pick.price)}` : 'Apply for verification' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast.js'
import logoTelegram from '../assets/logo-telegram.svg'

const { success, info } = useToast()
const money = (n) => '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const packages = [
  { id: 'telegram', name: 'Telegram', logo: logoTelegram, placeholder: '@yourusername',
    durations: [
      { label: '1 month', price: 42000.00 },
      { label: '6 months', price: 198000.00 },
      { label: '1 year', price: 349000.00 },
    ] },
]

const active = ref(null)
const pick = ref(null)
const handle = ref('')
const mine = ref([])

const canApply = computed(() => pick.value && handle.value.trim())

function openPkg(p) { active.value = p; pick.value = null; handle.value = '' }

function apply() {
  if (!canApply.value) { info('Almost there', 'Pick a duration and enter the account to verify.'); return }
  mine.value.unshift({ name: active.value.name, logo: active.value.logo, handle: handle.value.trim(), duration: pick.value.label, price: pick.value.price })
  success('Verification submitted', `${active.value.name} ${handle.value.trim()} — we'll review and update you shortly.`)
  active.value = null
}
</script>

<style scoped>
.av { display: flex; flex-direction: column; gap: 16px; }

.av-head { display: flex; flex-direction: column; gap: 6px; }
.av-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.av-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

.av-promo { display: flex; align-items: center; gap: 10px; background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.22); border-radius: 12px; padding: 13px 16px; }
.av-promo svg { color: #16a34a; flex-shrink: 0; }
.av-promo p { margin: 0; font-size: 0.84rem; color: var(--t2); }
.av-promo strong { color: #16a34a; font-weight: 800; }

.av-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 360px)); gap: 16px; }
.av-card {
  display: flex; align-items: center; gap: 14px; cursor: pointer; text-align: left; font-family: inherit;
  padding: 16px; border-radius: 16px; background: var(--bg); border: 1px solid var(--t4); 
  transition: border-color 0.2s ease, transform 0.16s ease;
}
.av-card:hover { border-color: var(--accent-border); transform: translateY(-3px); }
.av-card__ico { width: 46px; height: 46px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #fff; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-soft); }
.av-card__ico img { width: 28px; height: 28px; object-fit: contain; }
.av-card__ico--sm { width: 38px; height: 38px; }
.av-card__ico--sm img { width: 22px; height: 22px; }
.av-card__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.av-card__name { font-size: 0.95rem; font-weight: 700; color: var(--t1); }
.av-card__meta { font-size: 0.78rem; color: var(--t3); }
.av-card__go { color: var(--t3); flex-shrink: 0; transition: color 0.18s ease, transform 0.18s ease; }
.av-card:hover .av-card__go { color: var(--accent); transform: translateX(3px); }

.av-mine { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.av-mine__title { margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--t1); }
.av-mine__empty { margin: 0; font-size: 0.86rem; color: var(--t3); }
.av-mine__list { display: flex; flex-direction: column; gap: 12px; }
.av-row { display: flex; align-items: center; gap: 14px; background: var(--bg); border: 1px solid var(--t4); border-radius: 14px; padding: 14px 16px; }
.av-row__text { flex: 1; min-width: 0; }
.av-row__name { font-size: 0.9rem; font-weight: 700; color: var(--t1); }
.av-row__handle { font-size: 0.78rem; font-weight: 600; color: var(--t3); margin-left: 4px; }
.av-row__sub { font-size: 0.78rem; color: var(--t3); margin-top: 2px; }
.av-row__badge { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; color: #d97706; background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.25); padding: 4px 9px; border-radius: 999px; }

/* Modal */
.av-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(8,12,10,0.55); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.av-modal { width: 100%; max-width: 440px; background: var(--bg); border: 1px solid var(--border); border-radius: 20px; padding: 22px; }
.av-modal__head { display: flex; align-items: center; gap: 12px; }
.av-modal__title { font-size: 1.05rem; font-weight: 800; color: var(--t1); }
.av-modal__sub { font-size: 0.8rem; color: var(--t3); margin-top: 2px; }
.av-x { margin-left: auto; width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border); background: var(--bg); color: var(--t3); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.av-x:hover { color: var(--t1); border-color: var(--accent-border); }
.av-modal__label { margin: 18px 0 10px; font-size: 0.78rem; font-weight: 700; color: var(--t2); }
.av-durations { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.av-dur { display: flex; flex-direction: column; gap: 4px; padding: 12px; border-radius: 12px; cursor: pointer; text-align: left; background: var(--bg); border: 1px solid var(--border); font-family: inherit; transition: border-color 0.16s ease, background 0.16s ease; }
.av-dur:hover { border-color: var(--accent-border); }
.av-dur--on { border-color: var(--accent); background: var(--accent-dim); }
.av-dur__label { font-size: 0.82rem; font-weight: 700; color: var(--t1); }
.av-dur__price { font-size: 0.74rem; font-weight: 600; color: var(--t2); }
.av-input { width: 100%; height: 46px; padding: 0 14px; border-radius: 11px; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.9rem; outline: none; transition: border-color 0.16s ease; }
.av-input:focus { border-color: var(--accent); }
.av-apply {
  width: 100%; margin-top: 18px; height: 46px; border-radius: 12px; cursor: pointer; border: none;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.88rem; font-weight: 700; 
  position: relative; overflow: hidden; isolation: isolate; transition: transform 0.15s ease;
}
.av-apply:disabled { opacity: 0.5; cursor: not-allowed; }
.av-apply:not(:disabled):hover { transform: translateY(-2px); }
.av-apply:not(:disabled)::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 45%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.22) 60%, transparent 100%);
  transform: skewX(-22deg); pointer-events: none; z-index: 2; animation: av-shine 3s ease-in-out infinite; animation-delay: 1s;
}
@keyframes av-shine { 0% { left: -80%; } 35% { left: 130%; } 100% { left: 130%; } }

@media (max-width: 760px) { .av-grid { grid-template-columns: 1fr; } }
</style>
