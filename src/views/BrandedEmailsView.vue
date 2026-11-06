<!-- src/views/BrandedEmailsView.vue -->
<template>
  <div class="cm-page">

    <!-- Header -->
    <div class="cm-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div class="cm-header__text">
        <h1 class="cm-title">Crypto Mails</h1>
        <p class="cm-sub">Pick a provider to send a brand-styled deposit / transaction email.</p>
      </div>
    </div>

    <!-- Provider Grid -->
    <div class="provider-grid">
      <div
        v-for="p in providers"
        :key="p.name"
        class="p-card"
        :style="{ '--accent-top': p.topColor }"
        @click="selectProvider(p)"
      >
        <div class="p-card__top-bar" />
        <div class="p-card__badge" :style="{ background: p.badgeBg, color: p.badgeColor }">
          {{ p.badge }}
        </div>
        <div class="p-card__logo-wrap">
          <img :src="p.logo" :alt="p.name" class="p-card__logo" @error="onImgError($event)" />
        </div>
        <h3 class="p-card__name">{{ p.name }}</h3>
        <p class="p-card__tag">{{ p.tagline }}</p>
        <span class="p-card__cta">Click Anywhere</span>
      </div>
    </div>

    <!-- Recently Sent -->
    <div class="recent-section">
      <h2 class="recent-title">Recently sent Crypto Mails</h2>
      <div v-if="sentMails.length === 0" class="recent-empty">
        <div class="recent-empty__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.5" stroke-linecap="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <p class="recent-empty__title">No Crypto Mails yet</p>
        <p class="recent-empty__sub">Pick a provider above and send your first Crypto Mail â€" it will appear here.</p>
      </div>
      <div v-else class="sent-list">
        <div v-for="m in sentMails" :key="m.id" class="sent-item">
          <img :src="m.logo" :alt="m.provider" class="sent-item__logo" />
          <div class="sent-item__info">
            <span class="sent-item__to">{{ m.recipient }}</span>
            <span class="sent-item__meta">{{ m.provider }} Â· {{ m.type }} Â· {{ m.amount }}</span>
          </div>
          <span class="sent-item__badge">Sent</span>
          <span class="sent-item__time">{{ m.time }}</span>
        </div>
      </div>
    </div>

    <!-- â"€â"€ Drawer Backdrop â"€â"€ -->
    <Transition name="backdrop-fade">
      <div v-if="drawerOpen" class="drawer-backdrop" @click="closeDrawer" />
    </Transition>

    <!-- â"€â"€ Send Drawer â"€â"€ -->
    <Transition name="drawer-slide">
      <div v-if="drawerOpen" class="send-drawer">

        <!-- Drawer Header -->
        <div class="drawer-head" :style="{ borderBottomColor: activeProvider?.topColor + '44' }">
          <div class="drawer-head__left">
            <div class="drawer-logo-wrap">
              <img :src="activeProvider?.logo" :alt="activeProvider?.name" class="drawer-logo" />
            </div>
            <div>
              <p class="drawer-provider-name">{{ activeProvider?.name }}</p>
              <p class="drawer-provider-tag">{{ activeProvider?.tagline }}</p>
            </div>
          </div>
          <button class="drawer-close" @click="closeDrawer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Drawer Body -->
        <div class="drawer-body">
          <p class="drawer-section-label">Transaction Details</p>

          <!-- Transaction Type -->
          <div class="field-group">
            <label class="field-label">Transaction Type</label>
            <div class="type-pills">
              <button
                v-for="t in txTypes" :key="t"
                :class="['type-pill', { 'type-pill--active': form.type === t }]"
                @click="form.type = t"
              >{{ t }}</button>
            </div>
          </div>

          <!-- Recipient Email -->
          <div class="field-group">
            <label class="field-label">Recipient Email</label>
            <div class="field-input-wrap">
              <svg class="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input v-model="form.recipient" type="email" placeholder="recipient@email.com" class="field-input" />
            </div>
          </div>

          <!-- Sender Name -->
          <div class="field-group">
            <label class="field-label">Sender Name</label>
            <div class="field-input-wrap">
              <svg class="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input v-model="form.sender" type="text" placeholder="e.g. Globalgle Finance" class="field-input" />
            </div>
          </div>

          <!-- Amount + Currency -->
          <div class="field-row">
            <div class="field-group field-group--flex">
              <label class="field-label">Amount</label>
              <div class="field-input-wrap">
                <svg class="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <input v-model="form.amount" type="number" placeholder="0.00" class="field-input" min="0" />
              </div>
            </div>
            <div class="field-group field-group--flex">
              <label class="field-label">Currency</label>
              <select v-model="form.currency" class="field-select">
                <option>USD</option><option>BTC</option><option>ETH</option>
                <option>BNB</option><option>USDT</option><option>NGN</option>
                <option>GBP</option><option>EUR</option>
              </select>
            </div>
          </div>

          <!-- Wallet Address -->
          <div class="field-group">
            <label class="field-label">Wallet / Account Reference <span class="field-optional">(optional)</span></label>
            <div class="field-input-wrap">
              <svg class="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/>
              </svg>
              <input v-model="form.wallet" type="text" placeholder="0x... or account ID" class="field-input" />
            </div>
          </div>

          <!-- Note -->
          <div class="field-group">
            <label class="field-label">Note <span class="field-optional">(optional)</span></label>
            <textarea v-model="form.note" class="field-textarea" placeholder="Add a short message to the recipient..." rows="3" />
          </div>

          <!-- Error -->
          <p v-if="formError" class="form-error">{{ formError }}</p>
        </div>

        <!-- Drawer Footer -->
        <div class="drawer-footer">
          <button class="drawer-cancel-btn" @click="closeDrawer">Cancel</button>
          <button class="drawer-send-btn" :class="{ 'drawer-send-btn--loading': sending }" @click="sendMail">
            <template v-if="!sending">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Send Crypto Mail
            </template>
            <template v-else>
              <span class="spinner" /> Sending...
            </template>
          </button>
        </div>

      </div>
    </Transition>

    <!-- â"€â"€ Success Toast â"€â"€ -->
    <Transition name="toast-pop">
      <div v-if="showSuccess" class="success-toast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Crypto Mail sent to {{ lastSentRecipient }}!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

/* â"€â"€ Provider data â"€â"€ */
const gf = d => `https://www.google.com/s2/favicons?domain=${d}&sz=128`

const providers = [
  { name: 'Binance',        tagline: 'Binance Sets the Standard',                    badge: 'GLOBAL',       badgeBg: '#f59e0b',  badgeColor: '#fff', topColor: '#f59e0b',  logo: gf('binance.com') },
  { name: 'Coinbase',       tagline: 'Coinbase, Accessible and Simple',              badge: 'GOLD',         badgeBg: '#3b82f6',  badgeColor: '#fff', topColor: '#3b82f6',  logo: gf('coinbase.com') },
  { name: 'Kraken',         tagline: 'Kraken, Trusted by Pros',                      badge: 'PRO',          badgeBg: '#8b5cf6',  badgeColor: '#fff', topColor: '#8b5cf6',  logo: gf('kraken.com') },
  { name: 'Blockchain.com', tagline: 'Blockchain, the Original',                     badge: 'PREMIUM',      badgeBg: '#60a5fa',  badgeColor: '#fff', topColor: '#60a5fa',  logo: gf('blockchain.com') },
  { name: 'Bitcoin.com',    tagline: 'Bitcoin, Reimagined',                          badge: 'PIONEER',      badgeBg: '#f59e0b',  badgeColor: '#fff', topColor: '#f59e0b',  logo: gf('bitcoin.com') },
  { name: 'ByBit',          tagline: 'Bybit, Speed and Precision',                   badge: 'SPEED',        badgeBg: '#f59e0b',  badgeColor: '#fff', topColor: '#f59e0b',  logo: gf('bybit.com') },
  { name: 'MetaMask',       tagline: 'MetaMask, the Gateway',                        badge: 'PROFESSIONAL', badgeBg: '#f97316',  badgeColor: '#fff', topColor: '#f97316',  logo: gf('metamask.io') },
  { name: 'OKX',            tagline: 'OKX, Powerful. Secure. Global.',               badge: 'POWERHOUSE',   badgeBg: '#0f172a',  badgeColor: '#fff', topColor: '#0f172a',  logo: gf('okx.com') },
  { name: 'LUNO',           tagline: 'Luno, Crypto for Emerging Markets',            badge: 'EMERGENCE',    badgeBg: '#1e293b',  badgeColor: '#fff', topColor: '#1e293b',  logo: gf('luno.com') },
  { name: 'VALR',           tagline: "VALR, South Africa's Crypto Frontier",         badge: 'AFRICA',       badgeBg: '#0f172a',  badgeColor: '#fff', topColor: '#0f172a',  logo: gf('valr.com') },
  { name: 'Yellow Card',    tagline: 'Yellow Card, Crypto for Emerging Markets',     badge: 'EMERGENCE',    badgeBg: '#1e293b',  badgeColor: '#fff', topColor: '#f59e0b',  logo: gf('yellowcard.io') },
  { name: 'Roqqu',          tagline: 'Roqqu, Crypto for Emerging Markets',           badge: 'EMERGENCE',    badgeBg: '#1e293b',  badgeColor: '#fff', topColor: '#1e293b',  logo: gf('roqqu.com') },
  { name: 'Bitso',          tagline: "Bitso, Latin America's Crypto Bridge",         badge: 'PROFESSIONAL', badgeBg: '#f05025',  badgeColor: '#fff', topColor: '#f05025',  logo: gf('bitso.com') },
  { name: 'Bitget',         tagline: 'Bitget, Crypto Made Accessible',               badge: 'EMERGENCE',    badgeBg: '#1e293b',  badgeColor: '#fff', topColor: '#22d3ee',  logo: gf('bitget.com') },
  { name: 'SuperEx',        tagline: 'SuperEx, Crypto for Emerging Markets',         badge: 'EMERGENCE',    badgeBg: '#1e293b',  badgeColor: '#fff', topColor: '#ef4444',  logo: gf('superex.com') },
  { name: 'XT Wallet',      tagline: 'XT Wallet, Crypto for Emerging Markets',       badge: 'EMERGENCE',    badgeBg: '#1e293b',  badgeColor: '#fff', topColor: '#3b82f6',  logo: gf('xt.com') },
  { name: 'AltCoin Trader', tagline: 'AltCoin Trader, Crypto for Emerging Markets', badge: 'EMERGENCE',    badgeBg: '#1e293b',  badgeColor: '#fff', topColor: '#60a5fa',  logo: gf('altcointrader.co.za') },
  { name: 'Crypto.com',     tagline: 'Crypto at the Speed of Life',                 badge: 'GOLD WINNER',  badgeBg: '#3b82f6',  badgeColor: '#fff', topColor: '#3b82f6',  logo: gf('crypto.com') },
  { name: 'Cash App',       tagline: 'Cash App, Everyday Crypto',                   badge: 'GOLD WINNER',  badgeBg: '#f05025',  badgeColor: '#fff', topColor: '#f05025',  logo: gf('cash.app') },
  { name: 'Zelle',          tagline: 'Zelle, Crypto for Emerging Markets',           badge: 'EMERGENCE',    badgeBg: '#8b5cf6',  badgeColor: '#fff', topColor: '#8b5cf6',  logo: gf('zellepay.com') },
  { name: 'Venmo',          tagline: 'Venmo, Crypto for Emerging Markets',           badge: 'EMERGENCE',    badgeBg: '#1e293b',  badgeColor: '#fff', topColor: '#3b82f6',  logo: gf('venmo.com') },
  { name: 'GCash',          tagline: 'GCash, Crypto in Your Wallet',                badge: 'PHP',          badgeBg: '#22d3ee',  badgeColor: '#fff', topColor: '#22d3ee',  logo: gf('gcash.com') },
]

/* â"€â"€ Drawer state â"€â"€ */
const drawerOpen      = ref(false)
const activeProvider  = ref(null)
const sending         = ref(false)
const showSuccess     = ref(false)
const lastSentRecipient = ref('')
const formError       = ref('')
const sentMails       = ref([])

const txTypes = ['Deposit', 'Withdrawal', 'Transfer', 'Payment']

const form = reactive({
  recipient: '',
  sender:    '',
  amount:    '',
  currency:  'USD',
  wallet:    '',
  note:      '',
  type:      'Deposit',
})

function selectProvider(p) {
  activeProvider.value = p
  formError.value = ''
  Object.assign(form, { recipient: '', sender: '', amount: '', currency: 'USD', wallet: '', note: '', type: 'Deposit' })
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
  setTimeout(() => { activeProvider.value = null }, 300)
}

function sendMail() {
  formError.value = ''
  if (!form.recipient.trim()) { formError.value = 'Recipient email is required.'; return }
  if (!form.recipient.includes('@')) { formError.value = 'Please enter a valid email address.'; return }
  if (!form.sender.trim())    { formError.value = 'Sender name is required.'; return }
  if (!form.amount || Number(form.amount) <= 0) { formError.value = 'Please enter a valid amount.'; return }

  sending.value = true
  setTimeout(() => {
    sentMails.value.unshift({
      id:        Date.now(),
      provider:  activeProvider.value.name,
      logo:      activeProvider.value.logo,
      recipient: form.recipient,
      type:      form.type,
      amount:    `${form.amount} ${form.currency}`,
      time:      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })
    lastSentRecipient.value = form.recipient
    sending.value  = false
    showSuccess.value = true
    closeDrawer()
    setTimeout(() => { showSuccess.value = false }, 3500)
  }, 1600)
}

function onImgError(e) {
  e.target.style.display = 'none'
  e.target.parentElement.innerHTML = `<span class="p-card__logo-fallback">${e.target.alt.slice(0,2).toUpperCase()}</span>`
}
</script>

<style scoped>
.cm-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* â"€â"€ Header â"€â"€ */
.cm-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.back-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  background: var(--bg);
  color: var(--t2);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem; font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  flex-shrink: 0;
  margin-top: 4px;
}
.back-btn:hover { background: var(--bg); color: var(--t1); }
.cm-header__text { display: flex; flex-direction: column; gap: 4px; }
.cm-title { font-size: 1.45rem; font-weight: 800; color: var(--t1); letter-spacing: -0.025em; margin: 0; }
.cm-sub   { font-size: 0.82rem; color: var(--t1); font-weight: 600; margin: 0; }

/* â"€â"€ Provider Grid â"€â"€ */
.provider-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* â"€â"€ Provider Card â"€â"€ */
.p-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 18px 18px;
  border-radius: 16px;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
}
.p-card:hover {
  transform: translateY(-4px);
  border-color: var(--border);
  box-shadow: 0 10px 32px rgba(0,0,0,0.25);
}
.p-card__top-bar {
  height: 5px; background: var(--accent-top);
  flex-shrink: 0; align-self: stretch;
  margin-left: -18px; width: calc(100% + 36px);
  margin-bottom: 6px;
}
.p-card__badge {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 4px 12px; border-radius: 999px;
  font-size: 0.62rem; font-weight: 800; letter-spacing: 0.06em; flex-shrink: 0;
}
.p-card__logo-wrap {
  width: 68px; height: 68px; border-radius: 18px;
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}
.p-card__logo { width: 52px; height: 52px; object-fit: contain; border-radius: 10px; image-rendering: -webkit-optimize-contrast; }
.p-card__logo-fallback { font-size: 1rem; font-weight: 800; color: var(--t2); }
.p-card__name  { font-size: 0.92rem; font-weight: 700; color: var(--t1); margin: 0; }
.p-card__tag   { font-size: 0.75rem; color: var(--t3); margin: 0; line-height: 1.5; }
.p-card__cta   { margin-top: auto; font-size: 0.72rem; color: var(--t4); padding-top: 8px; border-top: 1px solid var(--border-soft); width: 100%; text-align: center; }

/* â"€â"€ Recently Sent â"€â"€ */
.recent-section { display: flex; flex-direction: column; gap: 14px; }
.recent-title   { font-size: 1rem; font-weight: 700; color: var(--t1); margin: 0; }
.recent-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 48px 24px;
  border: 1.5px dashed var(--border); border-radius: 16px; text-align: center;
}
.recent-empty__icon {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--bg); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center; color: var(--t4);
}
.recent-empty__title { font-size: 0.9rem; font-weight: 700; color: var(--t1); margin: 0; }
.recent-empty__sub   { font-size: 0.78rem; color: var(--t3); margin: 0; max-width: 320px; line-height: 1.55; }

/* Sent list */
.sent-list { display: flex; flex-direction: column; gap: 8px; }
.sent-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 12px;
  background: var(--bg); border: 1px solid var(--border-soft);
}
.sent-item__logo { width: 28px; height: 28px; border-radius: 6px; object-fit: contain; }
.sent-item__info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.sent-item__to   { font-size: 0.82rem; font-weight: 600; color: var(--t1); }
.sent-item__meta { font-size: 0.7rem; color: var(--t3); }
.sent-item__badge {
  font-size: 0.65rem; font-weight: 700; padding: 3px 9px; border-radius: 999px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.28); color: var(--accent);
}
.sent-item__time { font-size: 0.7rem; color: var(--t4); white-space: nowrap; }

/* â"€â"€ Drawer Backdrop â"€â"€ */
.drawer-backdrop {
  position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  background: rgba(0,0,0,0.5);
}

/* â"€â"€ Send Drawer â"€â"€ */
.send-drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 420px;
  z-index: 301;
  display: flex; flex-direction: column;
  background: var(--bg);
  border-left: 1px solid var(--border-soft);
  box-shadow: -16px 0 48px rgba(0,0,0,0.45);
  overflow: hidden;
}

/* Drawer Head */
.drawer-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
}
.drawer-head__left    { display: flex; align-items: center; gap: 12px; }
.drawer-logo-wrap     { width: 44px; height: 44px; border-radius: 12px; background: var(--glass-hover); border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.drawer-logo          { width: 32px; height: 32px; object-fit: contain; border-radius: 6px; }
.drawer-provider-name { font-size: 0.95rem; font-weight: 700; color: var(--t1); margin: 0; }
.drawer-provider-tag  { font-size: 0.7rem; color: var(--t3); margin: 2px 0 0; }
.drawer-close {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid var(--border-soft); background: var(--bg);
  color: var(--t3); cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.18s, color 0.18s;
}
.drawer-close:hover { background: var(--bg); color: var(--t1); }

/* Drawer Body */
.drawer-body {
  flex: 1; overflow-y: auto; padding: 22px;
  display: flex; flex-direction: column; gap: 18px;
}
.drawer-section-label {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: var(--t3); margin: 0;
}

/* Fields */
.field-group       { display: flex; flex-direction: column; gap: 7px; }
.field-group--flex { flex: 1; }
.field-row         { display: flex; gap: 12px; }
.field-label       { font-size: 0.78rem; font-weight: 600; color: var(--t2); }
.field-optional    { font-weight: 400; color: var(--t4); }

.field-input-wrap {
  position: relative; display: flex; align-items: center;
}
.field-icon {
  position: absolute; left: 12px; color: var(--t4); pointer-events: none; flex-shrink: 0;
}
.field-input {
  width: 100%; padding: 10px 12px 10px 36px;
  border-radius: 10px; border: 1px solid var(--border-soft);
  background: var(--bg); color: var(--t1);
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem;
  transition: border-color 0.18s;
  box-sizing: border-box;
}
.field-input:focus { outline: none; border-color: var(--accent); }
.field-input::placeholder { color: var(--t4); }

.field-select {
  width: 100%; padding: 10px 12px;
  border-radius: 10px; border: 1px solid var(--border-soft);
  background: var(--bg); color: var(--t1);
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem;
  cursor: pointer;
  transition: border-color 0.18s;
}
.field-select:focus { outline: none; border-color: var(--accent); }

.field-textarea {
  width: 100%; padding: 10px 12px;
  border-radius: 10px; border: 1px solid var(--border-soft);
  background: var(--bg); color: var(--t1);
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem;
  resize: none; min-height: 80px;
  transition: border-color 0.18s;
  box-sizing: border-box;
}
.field-textarea:focus { outline: none; border-color: var(--accent); }
.field-textarea::placeholder { color: var(--t4); }

/* Type pills */
.type-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.type-pill {
  padding: 6px 16px; border-radius: 999px;
  border: 1px solid var(--border-soft); background: var(--bg);
  color: var(--t3); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.78rem; font-weight: 600; cursor: pointer;
  transition: all 0.18s;
}
.type-pill:hover { border-color: var(--accent); color: var(--accent); }
.type-pill--active {
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12); border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.4);
  color: var(--accent);
}

.form-error {
  font-size: 0.78rem; color: #ef4444;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  border-radius: 8px; padding: 10px 12px; margin: 0;
}

/* Drawer Footer */
.drawer-footer {
  display: flex; gap: 10px; padding: 16px 22px;
  border-top: 1px solid var(--border-soft); flex-shrink: 0;
}
.drawer-cancel-btn {
  flex: 1; padding: 11px 0; border-radius: 12px;
  border: 1px solid var(--border-soft); background: var(--bg);
  color: var(--t2); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.82rem; font-weight: 600; cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.drawer-cancel-btn:hover { background: var(--bg); color: var(--t1); }

.drawer-send-btn {
  flex: 2; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 0; border-radius: 12px; border: none;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-press) 100%);
  color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.85rem; font-weight: 700; cursor: pointer;
  transition: opacity 0.2s, transform 0.18s;
}
.drawer-send-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.drawer-send-btn--loading { opacity: 0.75; cursor: not-allowed; transform: none; }

/* Spinner */
.spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* â"€â"€ Success Toast â"€â"€ */
.success-toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 400;
  display: flex; align-items: center; gap: 10px;
  padding: 14px 20px; border-radius: 14px;
  background: var(--accent); color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
  box-shadow: 0 8px 28px rgba(22,163,74,0.45);
}

/* â"€â"€ Animations â"€â"€ */
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.25s ease; }
.backdrop-fade-enter-from,   .backdrop-fade-leave-to     { opacity: 0; }

.drawer-slide-enter-active { transition: transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1); }
.drawer-slide-leave-active { transition: transform 0.22s ease; }
.drawer-slide-enter-from,
.drawer-slide-leave-to     { transform: translateX(100%); }

.toast-pop-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-pop-enter-from,
.toast-pop-leave-to     { opacity: 0; transform: translateY(12px) scale(0.95); }

/* â"€â"€ Responsive â"€â"€ */
@media (max-width: 1024px) {
  .provider-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
}
@media (max-width: 768px) {
  .cm-page       { gap: 22px; }
  .cm-header     { flex-direction: column; gap: 10px; margin-top: 10px; }
  .provider-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .cm-title      { font-size: 1.25rem; }
  .cm-sub        { font-size: 0.78rem; }
  .send-drawer   { width: 100%; }
}
@media (max-width: 600px) {
  .cm-header     { margin-top: 12px; }
  .provider-grid { gap: 10px; }
  .p-card        { padding: 0 14px 16px; gap: 8px; border-radius: 14px; }
  .p-card__top-bar { margin-left: -14px; width: calc(100% + 28px); }
  .p-card__logo-wrap { width: 54px; height: 54px; border-radius: 14px; }
  .p-card__logo-wrap img { width: 32px; height: 32px; }
  .p-card__badge { font-size: 0.58rem; padding: 3px 9px; }
  .p-card__name  { font-size: 0.82rem; }
  .p-card__tag   { font-size: 0.68rem; }
  .p-card__cta   { font-size: 0.65rem; padding-top: 7px; }
}
@media (max-width: 430px) {
  .cm-header     { margin-top: 14px; }
  .provider-grid { gap: 8px; }
  .p-card        { padding: 0 11px 14px; gap: 7px; border-radius: 12px; }
  .p-card__top-bar { margin-left: -11px; width: calc(100% + 22px); }
  .p-card__logo-wrap { width: 46px; height: 46px; border-radius: 12px; }
  .p-card__logo-wrap img { width: 28px; height: 28px; }
  .p-card__name  { font-size: 0.76rem; }
  .p-card__tag   { font-size: 0.62rem; }
  .p-card__cta   { font-size: 0.6rem; }
  .back-btn      { font-size: 0.75rem; padding: 6px 12px; }
  .cm-title      { font-size: 1.1rem; }
}

/* â"€â"€ Light mode â"€â"€ */
</style>
