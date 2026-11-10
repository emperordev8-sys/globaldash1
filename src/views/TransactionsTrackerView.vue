<!-- src/views/TransactionsTrackerView.vue -->
<template>
  <div class="site-page">

    <!-- Mock-up disclaimer -->
    <div class="sp-disclaimer">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <p>Everything this tool produces is a mock-up — a template generated from the values you type. It is not a real record, and it is not issued or verified by any bank, carrier, retailer or other organisation it may resemble. Use it for design, demos, testing and your own genuine records. Presenting it to anyone as real breaks our terms and, in most places, the law.</p>
    </div>

    <!-- Header -->
    <div class="sp-head">
      <div class="sp-head__text">
        <h1 class="sp-title">Transactions Trackers</h1>
        <p class="sp-sub">Choose a receipt style, fill in the details, and share it with a link. Each receipt gets its own link and admin panel.</p>
      </div>
    </div>

    <!-- Pick a style -->
    <span class="sp-section-label">PICK A STYLE</span>
    <div class="look-grid look-grid--2">
      <div v-for="s in styles" :key="s.key" class="look-card">
        <span class="look-badge" :class="s.badgeClass">{{ s.name }}</span>
        <div class="look-preview" :style="{ background: s.preview }">
          <span class="rc-word">TRACKING</span>
        </div>
        <p class="look-desc">{{ s.desc }}</p>
        <div class="look-actions">
          <button class="look-btn look-btn--ghost" @click="$router.push(s.route)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View sample
          </button>
          <button class="look-btn look-btn--create" @click="$router.push(s.route)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- My receipts -->
    <h2 class="rc-heading">My receipts</h2>
    <div v-if="receipts.length === 0" class="sp-empty">
      <span class="sp-empty__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
        </svg>
      </span>
      <p class="sp-empty__title">No receipts yet</p>
      <p class="sp-empty__desc">Pick a style above to create your first receipt — it takes seconds and you get a shareable link.</p>
    </div>

    <div v-else class="sp-table-wrap">
      <table class="sp-table">
        <thead><tr><th>RECEIPT</th><th>STYLE</th><th>STATUS</th><th></th></tr></thead>
        <tbody>
          <tr v-for="r in receipts" :key="r.id">
            <td><div class="bk-name">{{ r.title }}</div></td>
            <td><span class="bk-look">{{ r.style }}</span></td>
            <td><span class="bk-status bk-status--on">Active</span></td>
            <td class="bk-action-cell">
              <a :href="r.url" target="_blank" rel="noopener noreferrer" class="bk-link bk-link--green">Open</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSiteStore } from '../composables/useSiteStore.js'

const router = useRouter()
const { store } = useSiteStore()
const receipts = store.receipts

const styles = [
  {
    key: 'receipts', name: 'RECEIPTS TRACKING', badgeClass: 'look-badge--green',
    preview: 'linear-gradient(135deg, #14532d 0%, #16a34a 55%, #22c55e 100%)',
    desc: 'A step-by-step receipt with a status icon, a progress timeline and an action button — share it with a link.',
    route: '/tools/transactions-tracker/receipts',
  },
  {
    key: 'payment', name: 'PAYMENT TRACKING', badgeClass: 'look-badge--red',
    preview: 'linear-gradient(135deg, #0f5132 0%, #15803d 55%, #16a34a 100%)',
    desc: 'A live receipt with a spinning status, amounts and copyable details — share it with a link.',
    route: '/tools/transactions-tracker/payment',
  },
]
</script>

<style scoped src="./site-template.css"></style>
<style scoped>
.look-grid--2 { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 760px) { .look-grid--2 { grid-template-columns: 1fr; } }
.look-preview { height: 120px; display: flex; align-items: center; justify-content: center; }
.rc-word { font-size: 1.6rem; font-weight: 900; letter-spacing: 0.06em; color: rgba(255,255,255,0.95); }
.rc-heading { margin: 6px 0 0; font-size: 1.1rem; font-weight: 800; color: var(--t1); }
</style>
