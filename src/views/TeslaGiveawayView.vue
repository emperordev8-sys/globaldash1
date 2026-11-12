

<!-- src/views/TeslaGiveawayView.vue -->
<template>
  <div class="site-page">

    <!-- Header -->
    <div class="sp-head">
      <div class="sp-head__text">
        <h1 class="sp-title">Tesla Giveaway</h1>
        <p class="sp-sub">Spawn a Tesla giveaway / participate site in seconds. Each one has its own URL, its own submissions inbox, and its own admin panel.</p>
      </div>
      <span class="sp-count">{{ activeCount }}/{{ sites.length }} active</span>
    </div>

    <!-- Pick a look -->
    <span class="sp-section-label">PICK A LOOK</span>
    <div class="look-grid">
      <div class="look-card">
        <span class="look-badge look-badge--blue">TESLA GIVEAWAY</span>
        <div class="look-preview">
          <img :src="lookImg" alt="Tesla giveaway" loading="lazy" referrerpolicy="no-referrer" />
        </div>
        <p class="look-desc">Giveaway entry site with a delivery-fee checkout.</p>
        <div class="look-actions">
          <a href="https://www.tesla.com" target="_blank" rel="noopener noreferrer" class="look-btn look-btn--ghost">
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

    <!-- Search + filter -->
    <div class="sp-tools">
      <div class="sp-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search Tesla sites by name..." />
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
            <td colspan="4" class="sp-empty-row">No giveaway sites match your search.</td>
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
              <div class="sp-actions">
                <button class="sp-act" :class="{ 'sp-act--on': site.status === 'active' }" @click="toggleStatus(site)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                  {{ site.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
                <button class="sp-act" @click="toast('Edit site', site.name)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                  Edit
                </button>
                <button class="sp-act" @click="adminLink(site)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Admin link
                </button>
                <button class="sp-act" @click="authCode(site)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/></svg>
                  Auth code
                </button>
                <button class="sp-act" @click="$router.push('/tools/buy-domain')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  Buy domain
                </button>
                <button class="sp-act" @click="toast('Transfer site', site.name)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                  Transfer
                </button>
                <button class="sp-act sp-act--danger" @click="deleteSite(site)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Delete
                </button>
              </div>
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
          <p class="up-text">Your current plan doesn't include Tesla Giveaway. Choose a plan that supports this feature to continue.</p>
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
import { useToast } from '../composables/useToast.js'
bo
const router = useRouter()
const { success, info } = useToast()
const { store } = useSiteStore()
const sites = store.giveaway

const toast = (title, msg) => info(title, msg)
function toggleStatus(site) {
  site.status = site.status === 'active' ? 'disabled' : 'active'
  success(site.status === 'active' ? 'Site activated' : 'Site deactivated', `${site.name} is now ${site.status === 'active' ? 'live' : 'offline'}.`)
}
function adminLink(site) { info('Admin link', `${site.domain}/admin`) }
function authCode(site) {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase()
  info('Auth code generated', `${site.name}: ${code}`)
}
function deleteSite(site) {
  const i = sites.indexOf(site)
  if (i > -1) sites.splice(i, 1)
  info('Site deleted', `${site.name} was removed.`)
}

const lookImg = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&h=320&q=70'

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
