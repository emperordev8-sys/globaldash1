<!-- src/views/WalletsView.vue -->
<template>
  <div class="site-page">

    <!-- Header -->
    <div class="sp-head">
      <div class="sp-head__text">
        <h1 class="sp-title">Wallets</h1>
        <p class="sp-sub">Spawn a white-label Cash App-style or PayPal-style wallet site in seconds. Each one has its own URL, its own customers, and its own admin panel where you credit customer balances.</p>
      </div>
      <span class="sp-count">{{ activeCount }}/{{ sites.length }} active</span>
    </div>

    <!-- Pick a wallet -->
    <span class="sp-section-label">PICK A WALLET</span>
    <div class="look-grid look-grid--2w">
      <div v-for="w in wallets" :key="w.key" class="look-card">
        <span class="look-badge" :style="{ background: w.badge }">{{ w.name }}</span>
        <div class="wmock">
          <div class="wmock__card">
            <span class="wmock__logo" :style="{ color: w.color }">{{ w.logo }}</span>
            <span class="wmock__line"></span>
            <span class="wmock__line wmock__line--short"></span>
            <span class="wmock__btn" :style="{ background: w.color }"></span>
          </div>
        </div>
        <p class="look-desc">{{ w.desc }}</p>
        <div class="look-actions">
          <a :href="w.sample" target="_blank" rel="noopener noreferrer" class="look-btn look-btn--ghost">
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
    <div class="sp-banner">
      <div class="sp-banner__msg">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <p>Your plan has expired, so your wallet sites are <strong>paused</strong> — nothing was deleted. Renew your plan to bring them back online and make changes again.</p>
      </div>
      <button class="sp-renew" @click="$router.push('/billing')">Renew plan</button>
    </div>

    <!-- Search + filters -->
    <div class="sp-tools">
      <div class="sp-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search by link or name..." />
      </div>
      <select v-model="lookFilter" class="sp-filter">
        <option value="all">Both wallets</option>
        <option value="Cash App">Cash App</option>
        <option value="PayPal">PayPal</option>
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
        <thead><tr><th>SITE</th><th>PUBLIC LINK</th><th>STATUS</th><th></th></tr></thead>
        <tbody>
          <tr v-if="filtered.length === 0"><td colspan="4" class="sp-empty-row">No wallet sites match your search.</td></tr>
          <tr v-for="site in filtered" :key="site.id">
            <td>
              <div class="bk-name-row">
                <span class="bk-name">{{ site.name }}</span>
                <span class="bk-name-pill"><span class="bk-name-pill__dot" :style="{ background: site.dot }"></span>{{ site.look }}</span>
              </div>
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
            <td><span class="bk-status bk-status--off">Disabled</span></td>
            <td class="bk-action-cell">
              <button class="bk-renew" @click="$router.push('/billing')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <span class="up-crown"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7l5 5 5-8 5 8 5-5-2 12H4L2 7z"/></svg></span>
          <h2 class="up-title">Upgrade your plan</h2>
          <p class="up-text">Your current plan doesn't include Wallets. Choose a plan that supports this feature to continue.</p>
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
const sites = store.wallets

const wallets = [
  { key: 'cashapp', name: 'CASH APP WALLET', badge: '#0d9488', color: '#16a34a', logo: 'Cash App',
    desc: 'White-label wallet with P2P payments and withdrawals.', sample: 'https://cash.app' },
  { key: 'paypal',  name: 'PAYPAL WALLET',   badge: '#6d28d9', color: '#2563eb', logo: 'PayPal',
    desc: 'White-label wallet with admin-managed balances.', sample: 'https://www.paypal.com' },
]

const activeCount = computed(() => sites.filter(s => s.status === 'active').length)

const search = ref('')
const lookFilter = ref('all')
const statusFilter = ref('all')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return sites.filter(s =>
    (statusFilter.value === 'all' || s.status === statusFilter.value) &&
    (lookFilter.value === 'all' || s.look === lookFilter.value) &&
    (!q || s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q))
  )
})

const showUpgrade = ref(false)
function goPlans() { showUpgrade.value = false; router.push('/billing') }
</script>

<style scoped src="./site-template.css"></style>
<style scoped>
.look-grid--2w { grid-template-columns: repeat(2, minmax(0, 300px)); }
@media (max-width: 760px) { .look-grid--2w { grid-template-columns: 1fr; } }
</style>
