<!-- src/views/SupportPagesView.vue -->
<template>
  <div class="site-page">

    <!-- Header -->
    <div class="sp-head">
      <div class="sp-head__text">
        <h1 class="sp-title">Support Pages</h1>
        <p class="sp-sub">Create branded support pages. Pick a brand template, drop in a chat-widget embed code, then share the public link.</p>
      </div>
      <div class="sp-head__right">
        <button class="sp-watch" @click="$router.push('/tutorials')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
          </svg>
          Watch to learn
        </button>
        <span class="sp-count">{{ pages.length }}/∞ pages used</span>
      </div>
    </div>

    <!-- Pick a brand -->
    <span class="sp-section-label">PICK A BRAND</span>
    <div class="brand-grid">
      <div v-for="b in brands" :key="b.key" class="brand-card">
        <span class="brand-badge" :style="{ background: b.color, color: b.text || '#fff' }">{{ b.name }}</span>
        <div class="brand-preview" :style="{ background: b.preview }">
          <span class="brand-preview__word">{{ b.name }}</span>
        </div>
        <div class="look-actions">
          <a :href="b.sample" target="_blank" rel="noopener noreferrer" class="look-btn look-btn--ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View sample
          </a>
          <button class="look-btn look-btn--create" @click="createPage(b)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Expired banner -->
    <div class="sp-banner">
      <div class="sp-banner__msg">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <p>Your plan has expired, so your support pages are <strong>paused</strong> — nothing was deleted. Renew your plan to bring them back online and make changes again.</p>
      </div>
      <button class="sp-renew" @click="$router.push('/billing')">Renew plan</button>
    </div>

    <!-- Search + filters -->
    <div class="sp-tools">
      <div class="sp-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search support pages by name..." />
      </div>
      <select v-model="lookFilter" class="sp-filter">
        <option value="all">All looks</option>
        <option v-for="b in brands" :key="b.key" :value="b.key">{{ b.name }}</option>
      </select>
      <select v-model="statusFilter" class="sp-filter">
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="disabled">Disabled</option>
      </select>
    </div>

    <!-- Table -->
    <div class="sp-table-wrap">
      <table class="sp-table">
        <thead>
          <tr><th>TITLE</th><th>TEMPLATE</th><th>STATUS</th><th>PUBLIC LINK</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="sp-empty-row">No support pages match your search.</td>
          </tr>
          <tr v-for="p in filtered" :key="p.id">
            <td><div class="bk-name">{{ p.title }}</div></td>
            <td><span class="bk-look">{{ p.template }}</span></td>
            <td>
              <span class="bk-status" :class="p.status === 'active' ? 'bk-status--on' : 'bk-status--off'">
                {{ p.status === 'active' ? 'Active' : 'Disabled' }}
              </span>
            </td>
            <td>
              <a :href="p.url" target="_blank" rel="noopener noreferrer" class="bk-link bk-link--green">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Open
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
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

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast.js'
import { useSiteStore } from '../composables/useSiteStore.js'

const { success } = useToast()
const { store } = useSiteStore()
const pages = store.support

const brands = [
  { key: 'apple', name: 'APPLE', color: '#111827', sample: 'https://support.apple.com' },
  { key: 'binance', name: 'BINANCE', color: '#f3ba2f', text: '#111', sample: 'https://www.binance.com/en/support' },
  { key: 'bitcoin', name: 'BITCOIN', color: '#f7931a', sample: 'https://bitcoin.org' },
  { key: 'bitso', name: 'BITSO', color: '#16a34a', sample: 'https://bitso.com' },
  { key: 'blockchain', name: 'BLOCKCHAIN.COM', color: '#1a6dff', sample: 'https://www.blockchain.com' },
  { key: 'bybit', name: 'BYBIT', color: '#f7a600', text: '#111', sample: 'https://www.bybit.com' },
  { key: 'byd', name: 'BYD', color: '#dc2626', sample: 'https://www.byd.com' },
  { key: 'cashapp', name: 'CASH APP', color: '#00d632', text: '#063', sample: 'https://cash.app/help' },
  { key: 'changelly', name: 'CHANGELLY', color: '#0fae96', sample: 'https://changelly.com' },
  { key: 'chime', name: 'CHIME', color: '#1ec677', text: '#063', sample: 'https://www.chime.com' },
  { key: 'coinbase', name: 'COINBASE', color: '#1652f0', sample: 'https://help.coinbase.com' },
  { key: 'crypto', name: 'CRYPTO.COM', color: '#103f98', sample: 'https://crypto.com' },
  { key: 'facebook', name: 'FACEBOOK', color: '#1877f2', sample: 'https://www.facebook.com/help' },
  { key: 'gcash', name: 'GCASH', color: '#007dfe', sample: 'https://www.gcash.com' },
  { key: 'instagram', name: 'INSTAGRAM', color: '#e1306c', sample: 'https://help.instagram.com' },
  { key: 'kraken', name: 'KRAKEN', color: '#5741d9', sample: 'https://www.kraken.com' },
  { key: 'metamask', name: 'METAMASK', color: '#f6851b', sample: 'https://metamask.io' },
  { key: 'opensea', name: 'OPENSEA', color: '#2081e2', sample: 'https://opensea.io' },
  { key: 'paypal', name: 'PAYPAL', color: '#003087', sample: 'https://www.paypal.com/us/smarthelp/home' },
  { key: 'zelle', name: 'ZELLE', color: '#6d1ed4', sample: 'https://www.zellepay.com' },
].map(b => ({ ...b, preview: `linear-gradient(135deg, ${b.color} 0%, ${b.color}cc 100%)` }))

const search = ref('')
const lookFilter = ref('all')
const statusFilter = ref('all')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return pages.filter(p =>
    (statusFilter.value === 'all' || p.status === statusFilter.value) &&
    (lookFilter.value === 'all' || p.template === lookFilter.value) &&
    (!q || p.title.toLowerCase().includes(q))
  )
})

function createPage(brand) {
  const id = Date.now()
  const slug = 'Site-' + Math.random().toString(16).slice(2, 8)
  pages.push({ id, title: slug, template: brand.key, status: 'active', url: `https://${slug.toLowerCase()}.s1g0.com` })
  success('Support page created', `A ${brand.name} support page is now live.`)
}
</script>

<style scoped src="./site-template.css"></style>
<style scoped>
.sp-head__right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.sp-watch {
  position: relative; overflow: hidden; isolation: isolate;
  display: inline-flex; align-items: center; gap: 8px;
  height: 40px; padding: 0 18px; border-radius: 10px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%);
  color: #fff; border: none; cursor: pointer;
  font-family: inherit; font-size: 0.82rem; font-weight: 700;
  transition: transform 0.15s ease;
}
.sp-watch:hover { transform: translateY(-2px); }
.sp-watch::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -75%; width: 45%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.18) 65%, transparent 100%);
  transform: skewX(-22deg); pointer-events: none; z-index: 2;
  animation: supp-shine 2.4s ease-in-out infinite;
}
@keyframes supp-shine { 0% { left: -75%; } 40% { left: 125%; } 100% { left: 125%; } }
@media (prefers-reduced-motion: reduce) { .sp-watch::after { animation: none; display: none; } }

.brand-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.brand-card {
  position: relative;
  background: var(--bg); border: 1px solid var(--t4); border-radius: 16px;
  padding: 16px; display: flex; flex-direction: column; gap: 12px;
}
.brand-badge {
  align-self: flex-start;
  font-size: 0.62rem; font-weight: 800; letter-spacing: 0.05em;
  padding: 4px 12px; border-radius: 999px;
}
.brand-preview {
  width: 100%; height: 120px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.brand-preview__word {
  font-size: 1rem; font-weight: 800; letter-spacing: 0.04em;
  color: rgba(255,255,255,0.92); text-transform: uppercase;
}
.bk-look { font-size: 0.8rem; font-weight: 600; color: var(--t2); text-transform: capitalize; }
.bk-link--green { color: #16a34a; font-weight: 700; }

@media (max-width: 1100px) { .brand-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 760px) { .brand-grid { grid-template-columns: repeat(2, 1fr); } .sp-head { flex-direction: column; align-items: stretch; } .sp-head__right { justify-content: space-between; } }
@media (max-width: 440px) { .brand-grid { grid-template-columns: 1fr; } }
</style>
