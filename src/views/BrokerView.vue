<!-- src/views/BrokerView.vue -->
<template>
  <div class="broker">

    <!-- Header -->
    <div class="broker-head">
      <div class="broker-head__text">
        <h1 class="broker-title">Broker</h1>
        <p class="broker-sub">Spawn a fully-featured broker site in seconds. Each one has its own URL, its own end-users, and its own admin panel.</p>
      </div>
      <div class="broker-head__right">
        <button class="broker-watch" @click="$router.push('/tutorials')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
          </svg>
          Watch to learn
        </button>
        <span class="broker-count">{{ activeCount }}/{{ sites.length }} active</span>
      </div>
    </div>

    <!-- Pick a look -->
    <span class="broker-section-label">PICK A LOOK</span>
    <div class="look-grid">
      <div v-for="look in looks" :key="look.key" class="look-card">
        <span class="look-badge" :class="`look-badge--${look.key}`">{{ look.name }}</span>
        <div class="look-preview">
          <img :src="look.img" :alt="look.name" loading="lazy" referrerpolicy="no-referrer" />
        </div>
        <p class="look-desc">{{ look.desc }}</p>
        <div class="look-actions">
          <a :href="look.sample" target="_blank" rel="noopener noreferrer" class="look-btn look-btn--ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View sample
          </a>
          <button class="look-btn look-btn--create" @click="showUpgrade = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Expired banner -->
    <div class="broker-banner">
      <div class="broker-banner__msg">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <p>Your plan has expired, so your broker sites are <strong>paused</strong> — nothing was deleted. Renew your plan to bring them back online and make changes again.</p>
      </div>
      <button class="broker-renew" @click="$router.push('/billing')">Renew plan</button>
    </div>

    <!-- Search + filter -->
    <div class="broker-tools">
      <div class="broker-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search brokers by name..." />
      </div>
      <select v-model="statusFilter" class="broker-filter">
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="disabled">Disabled</option>
      </select>
    </div>

    <!-- Table -->
    <div class="broker-table-wrap">
      <table class="broker-table">
        <thead>
          <tr><th>SITE</th><th>PUBLIC LINK</th><th>STATUS</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="broker-empty-row">No broker sites match your search.</td>
          </tr>
          <tr v-for="site in filtered" :key="site.id">
            <td>
              <div class="bk-name">{{ site.name }}</div>
              <div class="bk-cur">{{ site.currency }}</div>
            </td>
            <td>
              <a :href="site.url" target="_blank" rel="noopener noreferrer" class="bk-link">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                {{ site.domain }}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </td>
            <td>
              <span class="bk-status" :class="site.status === 'active' ? 'bk-status--on' : 'bk-status--off'">
                {{ site.status === 'active' ? 'Active' : 'Disabled' }}
              </span>
            </td>
            <td class="bk-action-cell">
              <button class="bk-renew" @click="$router.push('/billing')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Renew to manage
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Upgrade modal -->
    <Transition name="up-fade">
      <div v-if="showUpgrade" class="up-backdrop" @click.self="showUpgrade = false">
        <div class="up-modal">
          <button class="up-close" @click="showUpgrade = false" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <span class="up-crown">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 7l5 5 5-8 5 8 5-5-2 12H4L2 7z"/>
            </svg>
          </span>
          <h2 class="up-title">Upgrade your plan</h2>
          <p class="up-text">Your current plan doesn't include Broker. Choose a plan that supports this feature to continue.</p>
          <button class="up-btn up-btn--primary" @click="goPlans">See plans</button>
          <button class="up-btn up-btn--ghost" @click="showUpgrade = false">Close</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSiteStore } from '../composables/useSiteStore.js'

const router = useRouter()
const { store } = useSiteStore()
const sites = store.broker

const IMG = (id, w = 600, h = 320) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`
const looks = [
  {
    key: 'classic', name: 'CLASSIC',
    img: IMG('photo-1611974789855-9c2a0a7236a3'),
    desc: 'Trading broker site with live charts and managed accounts.',
    sample: 'https://www.tradingview.com',
  },
  {
    key: 'promax', name: 'PRO MAX',
    img: IMG('photo-1628348068343-c6a848d2b6dd'),
    desc: 'Trading broker site with a locked dark dashboard and a live ticker tape.',
    sample: 'https://www.metatrader5.com',
  },
]

const activeCount = computed(() => sites.filter(s => s.status === 'active').length)

const search = ref('')
const statusFilter = ref('all')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return sites.filter(s =>
    (statusFilter.value === 'all' || s.status === statusFilter.value) &&
    (!q || s.name.toLowerCase().includes(q))
  )
})

const showUpgrade = ref(false)
function goPlans() { showUpgrade.value = false; router.push('/billing') }
</script>

<style scoped>
.broker { display: flex; flex-direction: column; gap: 16px; }

/* Header */
.broker-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.broker-head__text { display: flex; flex-direction: column; gap: 6px; min-width: 0; max-width: 620px; }
.broker-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.broker-sub   { margin: 0; font-size: 0.84rem; color: #16a34a; font-weight: 500; line-height: 1.5; }
.broker-head__right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.broker-count { font-size: 0.78rem; font-weight: 600; color: var(--t3); white-space: nowrap; }

/* Watch to learn (shine) */
.broker-watch {
  position: relative; overflow: hidden; isolation: isolate;
  display: inline-flex; align-items: center; gap: 8px;
  height: 40px; padding: 0 18px; border-radius: 10px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%);
  color: #fff; border: none; cursor: pointer;
  font-family: inherit; font-size: 0.82rem; font-weight: 700;
  box-shadow: 0 7px 18px rgba(22,163,74,0.32), inset 0 1px 0 rgba(255,255,255,0.28);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.broker-watch:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(22,163,74,0.42); }
.broker-watch::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -75%; width: 45%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.18) 65%, transparent 100%);
  transform: skewX(-22deg); pointer-events: none; z-index: 2;
  animation: bk-shine 2.4s ease-in-out infinite;
}
@keyframes bk-shine { 0% { left: -75%; } 40% { left: 125%; } 100% { left: 125%; } }
@media (prefers-reduced-motion: reduce) { .broker-watch::after { animation: none; display: none; } }

/* Section label */
.broker-section-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; color: var(--t3); }

/* Look cards */
.look-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.look-card {
  position: relative;
  background: var(--bg); border: 1px solid var(--t4); border-radius: 16px;
  padding: 16px; display: flex; flex-direction: column; gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.look-badge {
  position: absolute; top: 24px; left: 24px; z-index: 2;
  font-size: 0.62rem; font-weight: 800; letter-spacing: 0.06em;
  color: #fff; padding: 4px 12px; border-radius: 999px;
}
.look-badge--classic { background: #dc2626; }
.look-badge--promax  { background: #2563eb; }

.look-preview {
  width: 100%; height: 150px; border-radius: 12px; overflow: hidden;
  background: #0b1220;
}
.look-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }

.look-desc { margin: 0; font-size: 0.84rem; color: var(--t2); line-height: 1.5; min-height: 38px; }

.look-actions { display: flex; gap: 10px; }
.look-btn {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  height: 44px; border-radius: 10px; cursor: pointer;
  font-family: inherit; font-size: 0.82rem; font-weight: 700; text-decoration: none;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease;
}
.look-btn:active { transform: scale(0.98); }
.look-btn--ghost {
  background: var(--bg); border: 1px solid var(--border);
  color: var(--t2);
}
.look-btn--ghost:hover { color: var(--t1); border-color: var(--t3); }
.look-btn--create {
  background: #16a34a; border: none; color: #fff;
  box-shadow: 0 6px 16px rgba(22,163,74,0.3);
}
.look-btn--create:hover { background: #15803d; }

/* Expired banner */
.broker-banner {
  display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
  background: #fef9ee; border: 1px solid #f5d9a8; border-radius: 12px; padding: 14px 16px;
}
:root[data-theme="dark"] .broker-banner,
:root:not([data-theme="light"]) .broker-banner { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.3); }
.broker-banner__msg { display: flex; align-items: center; gap: 10px; min-width: 0; }
.broker-banner__msg svg { color: #d97706; flex-shrink: 0; }
.broker-banner__msg p  { margin: 0; font-size: 0.82rem; color: var(--t2); line-height: 1.5; }
.broker-banner__msg strong { color: var(--t1); font-weight: 700; }
.broker-renew {
  flex-shrink: 0;
  height: 36px; padding: 0 16px; border-radius: 9px; cursor: pointer;
  background: transparent; border: 1.5px solid #e0a63a; color: #b45309;
  font-family: inherit; font-size: 0.8rem; font-weight: 700;
  transition: background 0.18s ease;
}
.broker-renew:hover { background: rgba(245,158,11,0.12); }

/* Search + filter */
.broker-tools { display: flex; gap: 12px; flex-wrap: wrap; }
.broker-search {
  flex: 1; min-width: 200px;
  display: flex; align-items: center; gap: 9px;
  height: 44px; padding: 0 14px; border-radius: 11px;
  background: var(--bg); border: 1px solid var(--t4); color: var(--t3);
}
.broker-search input {
  flex: 1; background: none; border: none; outline: none;
  font-family: inherit; font-size: 0.86rem; color: var(--t1);
}
.broker-search input::placeholder { color: var(--t3); }
.broker-filter {
  height: 44px; padding: 0 14px; border-radius: 11px;
  background: var(--bg); border: 1px solid var(--t4); color: var(--t1);
  font-family: inherit; font-size: 0.84rem; font-weight: 600; cursor: pointer; outline: none;
}

/* Table */
.broker-table-wrap { background: var(--bg); border: 1px solid var(--t4); border-radius: 14px; overflow-x: auto; }
.broker-table { width: 100%; border-collapse: collapse; min-width: 620px; }
.broker-table th {
  padding: 12px 18px; text-align: left; font-size: 0.64rem; font-weight: 700;
  color: var(--t3); letter-spacing: 0.07em; border-bottom: 1px solid var(--border-soft);
}
.broker-table td { padding: 14px 18px; border-bottom: 1px solid var(--border-soft); vertical-align: middle; }
.broker-table tbody tr:last-child td { border-bottom: none; }

.bk-name { font-size: 0.86rem; font-weight: 700; color: var(--t1); }
.bk-cur  { font-size: 0.72rem; color: var(--t3); margin-top: 2px; }
.bk-link { display: inline-flex; align-items: center; gap: 6px; color: var(--t2); font-size: 0.82rem; text-decoration: none; }
.bk-link:hover { color: #16a34a; }

.bk-status { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; }
.bk-status--on  { background: rgba(22,163,74,0.12); color: #16a34a; }
.bk-status--off { background: var(--glass-hover); color: var(--t3); border: 1px solid var(--border-soft); }

.bk-action-cell { text-align: right; }
.bk-renew {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 14px; border-radius: 9px; cursor: pointer;
  background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.35); color: #16a34a;
  font-family: inherit; font-size: 0.78rem; font-weight: 700;
  transition: background 0.18s ease;
}
.bk-renew:hover { background: rgba(22,163,74,0.16); }

.broker-empty-row { text-align: center; padding: 28px !important; color: var(--t3); font-size: 0.84rem; }

/* Upgrade modal */
.up-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(8,15,12,0.5); backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.up-modal {
  position: relative;
  width: 100%; max-width: 420px;
  background: linear-gradient(160deg, #2f6fe4 0%, #2152c9 100%);
  border-radius: 20px; padding: 30px 26px 22px;
  text-align: center; color: #fff;
  box-shadow: 0 30px 70px rgba(0,0,0,0.4);
}
.up-close {
  position: absolute; top: 14px; right: 14px;
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.18); border: none; color: #fff; cursor: pointer;
  transition: background 0.18s ease;
}
.up-close:hover { background: rgba(255,255,255,0.3); }
.up-crown {
  display: inline-flex; align-items: center; justify-content: center;
  width: 54px; height: 54px; border-radius: 50%;
  background: rgba(255,255,255,0.18); color: #fff; margin-bottom: 14px;
}
.up-title { margin: 0 0 8px; font-size: 1.3rem; font-weight: 800; }
.up-text  { margin: 0 0 22px; font-size: 0.86rem; line-height: 1.55; color: rgba(255,255,255,0.9); }
.up-btn {
  width: 100%; height: 46px; border-radius: 11px; cursor: pointer;
  font-family: inherit; font-size: 0.9rem; font-weight: 700;
  transition: transform 0.12s ease, background 0.18s ease;
}
.up-btn:active { transform: scale(0.98); }
.up-btn--primary { background: #fff; color: #2152c9; border: none; margin-bottom: 10px; }
.up-btn--primary:hover { background: #f0f4ff; }
.up-btn--ghost { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.35); }
.up-btn--ghost:hover { background: rgba(255,255,255,0.2); }

.up-fade-enter-active { transition: opacity 0.2s ease; }
.up-fade-leave-active { transition: opacity 0.16s ease; }
.up-fade-enter-from, .up-fade-leave-to { opacity: 0; }
.up-fade-enter-active .up-modal { transition: transform 0.26s cubic-bezier(0.34,1.56,0.64,1); }
.up-fade-enter-from .up-modal { transform: scale(0.9); }

/* Responsive */
@media (max-width: 760px) {
  .look-grid { grid-template-columns: 1fr; }
  .broker-head { flex-direction: column; align-items: stretch; }
  .broker-head__right { justify-content: space-between; }
}
</style>
