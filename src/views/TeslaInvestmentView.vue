<!-- src/views/TeslaInvestmentView.vue -->
<template>
  <div class="site-page">

    <!-- Header -->
    <div class="sp-head">
      <div class="sp-head__text">
        <h1 class="sp-title">Tesla Investment</h1>
        <p class="sp-sub">Launch a Tesla Investment site in seconds. Each one has its own URL, its own investors, its own funds and stock market, and its own admin panel.</p>
      </div>
      <span class="sp-count">{{ activeCount }}/{{ sites.length }} active</span>
    </div>

    <!-- Pick a look -->
    <span class="sp-section-label">PICK A LOOK</span>
    <div class="look-grid">
      <div v-for="look in looks" :key="look.key" class="look-card">
        <span class="look-badge" :class="look.badgeClass">{{ look.name }}</span>
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
    <div class="sp-banner">
      <div class="sp-banner__msg">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <p>Your plan has expired, so your investment sites are <strong>paused</strong> — nothing was deleted. Renew your plan to bring them back online and make changes again.</p>
      </div>
      <button class="sp-renew" @click="$router.push('/billing')">Renew plan</button>
    </div>

    <!-- Search + filter -->
    <div class="sp-tools">
      <div class="sp-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search Tesla Investment sites by name..." />
      </div>
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
          <tr><th>SITE</th><th>PUBLIC LINK</th><th>STATUS</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="sp-empty-row">No investment sites match your search.</td>
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
          <p class="up-text">Your current plan doesn't include Tesla Investment. Choose a plan that supports this feature to continue.</p>
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
const sites = store.investment

const IMG = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=320&q=70`
const looks = [
  {
    key: 'investment', name: 'INVESTMENT', badgeClass: 'look-badge--purple',
    img: IMG('photo-1628348068343-c6a848d2b6dd'),
    desc: 'Managed funds priced by NAV, an owner-run stock market, investor wallets and more.',
    sample: 'https://ir.tesla.com',
  },
  {
    key: 'elon', name: 'ELON MUSK INVESTMENT SITE', badgeClass: 'look-badge--red',
    img: IMG('photo-1580446623001-3abf670c5c55'),
    desc: 'ROI investment plans, live trading with bots and signals, copy trading, crypto and more.',
    sample: 'https://www.tesla.com',
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

<style scoped src="./site-template.css"></style>
