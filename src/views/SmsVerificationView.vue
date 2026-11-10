<!-- src/views/SmsVerificationView.vue -->
<template>
  <div class="sv">

    <!-- Header -->
    <div class="sv-head">
      <h1 class="sv-title">SMS Verification</h1>
      <p class="sv-sub">Purchase a number, receive your one-time code. Cancel any time before the code arrives for a refund.</p>
    </div>

    <!-- Promo -->
    <div class="sv-promo">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      <p>Your <strong>Premium</strong> plan gives you <strong>10% off</strong> on this service.</p>
    </div>

    <!-- Picker -->
    <div class="sv-layout">
      <div class="sv-card">
        <!-- Country -->
        <div class="sv-field">
          <label class="sv-label">Country</label>
          <div class="sv-select" :class="{ 'sv-select--open': countryOpen }" v-click-outside="() => countryOpen = false">
            <button class="sv-select__btn" @click="toggleCountry">
              <span v-if="country" class="sv-select__val"><img :src="flag(country.code)" class="sv-flag" :alt="country.name" /> {{ country.name }} <span class="sv-dial">{{ country.dial }}</span></span>
              <span v-else class="sv-select__ph">Select a country…</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div v-if="countryOpen" class="sv-menu">
              <div class="sv-menu__search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input ref="countrySearchEl" v-model="countryQuery" class="sv-menu__searchinput" placeholder="Search countries…" />
              </div>
              <div class="sv-menu__scroll">
                <button v-for="c in filteredCountries" :key="c.code" class="sv-menu__item" @click="pickCountry(c)">
                  <img :src="flag(c.code)" class="sv-flag" :alt="c.name" /> {{ c.name }} <span class="sv-dial">{{ c.dial }}</span>
                </button>
                <p v-if="!filteredCountries.length" class="sv-menu__empty">No countries match “{{ countryQuery }}”.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Service -->
        <div class="sv-field">
          <label class="sv-label">Service</label>
          <p v-if="!country" class="sv-hint">Pick a country to see available services.</p>
          <div v-else class="sv-select" :class="{ 'sv-select--open': serviceOpen }" v-click-outside="() => serviceOpen = false">
            <div class="sv-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input v-model="serviceQuery" class="sv-search__input" placeholder="Search services…" @focus="serviceOpen = true" />
            </div>
            <div v-if="serviceOpen" class="sv-menu sv-menu--svc">
              <div class="sv-menu__scroll">
                <button v-for="s in filteredServices" :key="s.name" class="sv-svc" :class="{ 'sv-svc--on': service && service.name === s.name }" @click="pickService(s)">
                  <span class="sv-svc__name">{{ s.name }}</span>
                  <span class="sv-svc__price">— {{ money(s.price) }} <s>(was {{ money(s.was) }})</s></span>
                </button>
                <p v-if="!filteredServices.length" class="sv-menu__empty">No services match “{{ serviceQuery }}”.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Your number -->
      <div class="sv-side">
        <span class="sv-side__label">YOUR NUMBER</span>
        <template v-if="service && country">
          <div class="sv-side__svc">
            <div>
              <div class="sv-side__name">{{ service.name }} <span class="sv-cc">{{ country.code }}</span></div>
              <div class="sv-side__price">{{ money(service.price) }} <s class="sv-side__old">was {{ money(service.was) }}</s></div>
            </div>
          </div>
          <button class="sv-buy" @click="buy">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
            Buy number
          </button>
        </template>
        <p v-else class="sv-side__empty">Pick a service to continue.</p>
      </div>
    </div>

    <!-- Your numbers -->
    <div class="sv-list">
      <h2 class="sv-list__title">Your numbers</h2>
      <div v-for="(n, i) in myNumbers" :key="i" class="sv-num">
        <div class="sv-num__left">
          <div class="sv-num__name">{{ n.service }} <span class="sv-cc">{{ n.code }}</span></div>
          <div class="sv-num__number">{{ n.number || '—' }}</div>
        </div>
        <div class="sv-num__right">
          <span v-if="n.status === 'waiting'" class="sv-badge sv-badge--wait">WAITING</span>
          <span v-else-if="n.status === 'done'" class="sv-badge sv-badge--done">CODE {{ n.otp }}</span>
          <span v-else class="sv-badge">REFUNDED</span>
          <span class="sv-num__amt">{{ money(n.amount) }}</span>
          <button v-if="n.status === 'waiting'" class="sv-cancel" @click="cancel(n)">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useToast } from '../composables/useToast.js'
import { countries } from '../data/countries.js'
import { services } from '../data/services.js'

const { success, info } = useToast()

const FLAGS = import.meta.glob('../assets/flags/*.svg', { eager: true, import: 'default' })
const flag = (code) => FLAGS[`../assets/flags/${code.toLowerCase()}.svg`]
const money = (n) => '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* Country */
const country = ref(null)
const countryOpen = ref(false)
const countryQuery = ref('')
const countrySearchEl = ref(null)
const filteredCountries = computed(() => {
  const q = countryQuery.value.trim().toLowerCase()
  if (!q) return countries
  return countries.filter(c => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase() === q)
})
function toggleCountry() {
  countryOpen.value = !countryOpen.value
  if (countryOpen.value) nextTick(() => countrySearchEl.value?.focus())
}
function pickCountry(c) { country.value = c; countryOpen.value = false; countryQuery.value = '' }

/* Service */
const service = ref(null)
const serviceOpen = ref(false)
const serviceQuery = ref('')
const filteredServices = computed(() => {
  const q = serviceQuery.value.trim().toLowerCase()
  if (!q) return services
  return services.filter(s => s.name.toLowerCase().includes(q))
})
function pickService(s) { service.value = s; serviceQuery.value = s.name; serviceOpen.value = false }

/* Your numbers */
const myNumbers = ref([
  { service: 'WhatsApp', code: 'US', number: '+12297529669', status: 'refunded', amount: 701.12 },
  { service: 'WhatsApp', code: 'US', number: '', status: 'refunded', amount: 701.12 },
  { service: 'WhatsApp', code: 'US', number: '+18382967690', status: 'refunded', amount: 701.12 },
  { service: '1688',     code: 'US', number: '', status: 'refunded', amount: 560.90 },
])

function buy() {
  if (!service.value || !country.value) return
  const num = country.value.dial + ' ' + Math.floor(1000000000 + Math.random() * 8999999999)
  myNumbers.value.unshift({ service: service.value.name, code: country.value.code, number: num, status: 'waiting', amount: service.value.price })
  success('Number purchased', `${service.value.name} ${country.value.code} · ${num} — waiting for your code.`)
  service.value = null
  serviceQuery.value = ''
}

function cancel(n) {
  n.status = 'refunded'
  info('Number cancelled', `${money(n.amount)} has been refunded to your wallet.`)
}

/* click-outside directive */
const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e) }
    setTimeout(() => document.addEventListener('click', el._handler), 0)
  },
  unmounted(el) { document.removeEventListener('click', el._handler) },
}
</script>

<style scoped>
.sv { display: flex; flex-direction: column; gap: 16px; }

.sv-head { display: flex; flex-direction: column; gap: 6px; }
.sv-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.sv-sub   { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

.sv-promo { display: flex; align-items: center; gap: 10px; background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.22); border-radius: 12px; padding: 13px 16px; }
.sv-promo svg { color: #16a34a; flex-shrink: 0; }
.sv-promo p { margin: 0; font-size: 0.84rem; color: var(--t2); }
.sv-promo strong { color: #16a34a; font-weight: 800; }

.sv-layout { display: grid; grid-template-columns: 1.7fr 1fr; gap: 16px; align-items: start; }
.sv-card { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 18px; }

.sv-field { display: flex; flex-direction: column; gap: 8px; }
.sv-label { font-size: 0.86rem; font-weight: 800; color: var(--t1); }
.sv-hint  { margin: 0; font-size: 0.8rem; color: var(--t3); }
.sv-dial { color: var(--t3); font-weight: 600; margin-left: 4px; }

/* Select / combobox */
.sv-select { position: relative; }
.sv-select__btn {
  width: 100%; height: 48px; padding: 0 14px; border-radius: 11px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.sv-select--open .sv-select__btn, .sv-select__btn:hover { border-color: var(--accent-border); }
.sv-select__btn svg { color: var(--t3); flex-shrink: 0; }
.sv-select__val { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; min-width: 0; }
.sv-select__val { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sv-select__ph { color: var(--t3); }

/* Search input (service) */
.sv-search { position: relative; display: flex; align-items: center; }
.sv-search svg { position: absolute; left: 14px; color: var(--t3); pointer-events: none; }
.sv-search__input {
  width: 100%; height: 48px; padding: 0 14px 0 40px; border-radius: 11px;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.9rem; outline: none; transition: border-color 0.16s ease;
}
.sv-search__input:focus { border-color: var(--accent); }

/* Menu */
.sv-menu {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 30;
  background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 6px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.14);
}
.sv-menu__search { display: flex; align-items: center; gap: 8px; padding: 6px 10px; margin-bottom: 4px; border-bottom: 1px solid var(--border-soft); }
.sv-menu__search svg { color: var(--t3); flex-shrink: 0; }
.sv-menu__searchinput { flex: 1; border: none; background: transparent; outline: none; color: var(--t1); font-family: inherit; font-size: 0.86rem; }
.sv-menu__scroll { max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; }
.sv-menu__item {
  width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px;
  border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: 0.88rem; color: var(--t1); font-weight: 600; text-align: left;
}
.sv-menu__item:hover { background: var(--glass-hover); }
.sv-menu__empty { margin: 0; padding: 14px 12px; font-size: 0.82rem; color: var(--t3); }
.sv-flag { width: 22px; height: 16px; border-radius: 3px; object-fit: cover; flex-shrink: 0; box-shadow: 0 0 0 1px rgba(0,0,0,0.06); }

/* Service rows */
.sv-svc { width: 100%; display: flex; align-items: baseline; gap: 6px; padding: 10px 12px; border-radius: 8px; border: none; background: transparent; cursor: pointer; font-family: inherit; text-align: left; }
.sv-svc:hover { background: var(--glass-hover); }
.sv-svc--on { background: var(--accent-dim); }
.sv-svc__name { font-size: 0.88rem; font-weight: 700; color: var(--t1); flex-shrink: 0; }
.sv-svc__price { font-size: 0.82rem; color: var(--t2); }
.sv-svc__price s { color: var(--t3); }

/* Your number side */
.sv-side { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 20px; min-height: 150px; display: flex; flex-direction: column; gap: 14px; }
.sv-side__label { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.1em; color: var(--t3); }
.sv-side__empty { margin: 0; font-size: 0.86rem; color: var(--t3); }
.sv-side__name { font-size: 0.95rem; font-weight: 700; color: var(--t1); }
.sv-side__price { font-size: 0.82rem; color: var(--t2); margin-top: 2px; }
.sv-side__old { color: var(--t3); margin-left: 4px; }
.sv-cc { font-size: 0.7rem; font-weight: 700; color: var(--t3); background: var(--glass-hover); padding: 2px 7px; border-radius: 6px; margin-left: 4px; }
.sv-buy {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 44px; border-radius: 11px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.86rem; font-weight: 700;
  position: relative; overflow: hidden; isolation: isolate; transition: transform 0.15s ease;
}
.sv-buy:hover { transform: translateY(-2px); }
.sv-buy::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 45%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.22) 60%, transparent 100%);
  transform: skewX(-22deg); pointer-events: none; z-index: 2; animation: sv-shine 3s ease-in-out infinite; animation-delay: 1s;
}
@keyframes sv-shine { 0% { left: -80%; } 35% { left: 130%; } 100% { left: 130%; } }

/* List */
.sv-list { display: flex; flex-direction: column; gap: 10px; }
.sv-list__title { margin: 4px 0; font-size: 1.05rem; font-weight: 800; color: var(--t1); }
.sv-num {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  background: var(--bg); border: 1px solid var(--t4); border-radius: 14px; padding: 16px 18px;
}
.sv-num__name { font-size: 0.9rem; font-weight: 700; color: var(--t1); }
.sv-num__number { font-size: 0.8rem; color: var(--t3); margin-top: 3px; }
.sv-num__right { display: flex; align-items: center; gap: 14px; }
.sv-badge { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.06em; color: var(--t3); background: var(--glass-hover); border: 1px solid var(--border-soft); padding: 4px 9px; border-radius: 999px; }
.sv-badge--wait { color: #d97706; background: rgba(217,119,6,0.1); border-color: rgba(217,119,6,0.25); }
.sv-badge--done { color: #16a34a; background: rgba(22,163,74,0.1); border-color: rgba(22,163,74,0.25); }
.sv-num__amt { font-size: 0.88rem; font-weight: 700; color: var(--t2); min-width: 92px; text-align: right; }
.sv-cancel { height: 32px; padding: 0 12px; border-radius: 8px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.76rem; font-weight: 700; }
.sv-cancel:hover { color: #ef4444; border-color: rgba(239,68,68,0.4); }

@media (max-width: 860px) {
  .sv-layout { grid-template-columns: 1fr; }
  .sv-num { flex-direction: column; align-items: stretch; }
  .sv-num__right { justify-content: space-between; }
}
</style>
