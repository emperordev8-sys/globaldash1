<!-- src/views/CryptoReceiptsView.vue -->
<template>
  <div class="cr-page">

    <!-- Header -->
    <div class="cr-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div class="cr-head-text">
        <h1 class="cr-title">Crypto Receipts</h1>
        <p class="cr-sub">Pick a brand, fill in the transaction details, and generate a branded receipt.</p>
      </div>
    </div>

    <!-- Provider Grid -->
    <div class="provider-grid">
      <div
        v-for="p in providers"
        :key="p.name"
        class="p-card"
        :style="{ '--accent-top': p.topColor }"
        @click="openModal(p)"
      >
        <div class="p-card__top-bar" />
        <div class="p-card__badge" :style="{ background: p.badgeBg, color: p.badgeColor }">{{ p.badge }}</div>
        <div class="p-card__logo-wrap">
          <img :src="p.logo" :alt="p.name" class="p-card__logo" @error="onImgError($event)" />
        </div>
        <h3 class="p-card__name">{{ p.name }}</h3>
        <p class="p-card__tag">{{ p.tagline }}</p>
        <span class="p-card__cta">Click Anywhere</span>
      </div>
    </div>

    <!-- â"€â"€ Backdrop â"€â"€ -->
    <Transition name="backdrop-fade">
      <div v-if="modalOpen" class="modal-backdrop" @click="closeModal" />
    </Transition>

    <!-- â"€â"€ Receipt Modal â"€â"€ -->
    <Transition name="modal-pop">
      <div v-if="modalOpen" class="receipt-modal" role="dialog">

        <!-- Close -->
        <button class="modal-close" @click="closeModal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Colored header -->
        <div class="modal-head" :style="{ background: activeProvider?.topColor }">
          <div class="modal-logo-box">
            <img :src="activeProvider?.logo" :alt="activeProvider?.name" class="modal-logo" />
          </div>
          <h2 class="modal-head-title">{{ activeProvider?.name }} receipt</h2>
          <p class="modal-head-sub">Fills a {{ activeProvider?.name }}-styled transaction receipt.</p>
        </div>

        <!-- Form body -->
        <div class="modal-body">

          <!-- Coin -->
          <div class="fg">
            <label class="fl">Coin <span class="req">*</span></label>
            <select v-model="form.coin" class="fs">
              <option value="">Select...</option>
              <option>BTC</option><option>ETH</option><option>BNB</option>
              <option>USDT</option><option>USDC</option><option>SOL</option>
              <option>XRP</option><option>ADA</option><option>DOGE</option>
              <option>MATIC</option><option>LTC</option><option>DOT</option>
              <option>LINK</option><option>AVAX</option><option>ATOM</option>
              <option>UNI</option><option>NEAR</option><option>XLM</option>
            </select>
          </div>

          <!-- Quantity -->
          <div class="fg">
            <label class="fl">Quantity <span class="req">*</span></label>
            <input v-model="form.quantity" type="number" min="0" step="any" placeholder="0.00" class="fi" />
          </div>

          <!-- Network -->
          <div class="fg">
            <label class="fl">Network <span class="req">*</span></label>
            <select v-model="form.network" class="fs">
              <option value="">Select...</option>
              <option>Bitcoin</option>
              <option>Ethereum (ERC20)</option>
              <option>BSC (BEP20)</option>
              <option>Tron (TRC20)</option>
              <option>Polygon (MATIC)</option>
              <option>Solana (SOL)</option>
              <option>Arbitrum</option>
              <option>Optimism</option>
              <option>Avalanche (C-Chain)</option>
              <option>Litecoin</option>
              <option>Dogecoin</option>
              <option>Ripple (XRP)</option>
            </select>
          </div>

          <!-- Network fee -->
          <div class="fg">
            <label class="fl">Network fee</label>
            <input v-model="form.fee" type="number" min="0" step="any" placeholder="0.0001" class="fi" />
          </div>

          <!-- Receiver wallet -->
          <div class="fg">
            <label class="fl">Receiver's wallet address <span class="req">*</span></label>
            <input v-model="form.receiver" type="text" placeholder="0x... or bc1..." class="fi" />
          </div>

          <!-- Sender wallet -->
          <div class="fg">
            <label class="fl">Sender's wallet address</label>
            <input v-model="form.sender" type="text" placeholder='0x... or bc1... â€" shows as the "From" address on the receipt' class="fi" />
          </div>

          <!-- Error -->
          <p v-if="formError" class="form-error">{{ formError }}</p>

          <!-- Generate button -->
          <button
            class="generate-btn"
            :style="{ background: activeProvider?.topColor }"
            :class="{ 'generate-btn--loading': generating }"
            @click="generate"
          >
            <template v-if="!generating">
              Generate {{ activeProvider?.name }} receipt
            </template>
            <template v-else>
              <span class="spinner" /> Generating...
            </template>
          </button>

        </div>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition name="toast-pop">
      <div v-if="showSuccess" class="success-toast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        {{ activeProvider?.name }} receipt generated!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const gf = d => `https://www.google.com/s2/favicons?domain=${d}&sz=128`

const providers = [
  { name: 'Binance',     tagline: 'Binance Sets the Standard',              badge: 'GLOBAL',       badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f59e0b', logo: gf('binance.com')           },
  { name: 'Coinbase',    tagline: 'Coinbase, Accessible and Simple',         badge: 'GOLD',         badgeBg: '#3b82f6', badgeColor: '#fff', topColor: '#3b82f6', logo: gf('coinbase.com')          },
  { name: 'Bitcoin.com', tagline: 'Bitcoin, Reimagined',                     badge: 'PIONEER',      badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f59e0b', logo: gf('bitcoin.com')           },
  { name: 'ByBit',       tagline: 'Bybit, Speed and Precision',              badge: 'SPEED',        badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f59e0b', logo: gf('bybit.com')             },
  { name: 'MetaMask',    tagline: 'MetaMask, the Gateway',                   badge: 'PROFESSIONAL', badgeBg: '#f97316', badgeColor: '#fff', topColor: '#f97316', logo: gf('metamask.io')           },
  { name: 'OKX',         tagline: 'OKX, Powerful. Secure. Global.',          badge: 'POWERHOUSE',   badgeBg: '#0f172a', badgeColor: '#fff', topColor: '#0f172a', logo: gf('okx.com')               },
  { name: 'VALR',        tagline: "VALR, South Africa's Crypto Frontier",    badge: 'AFRICA',       badgeBg: '#0f172a', badgeColor: '#fff', topColor: '#0f172a', logo: gf('valr.com')              },
  { name: 'Bitget',      tagline: 'Bitget, Crypto Made Accessible',          badge: 'EMERGENCE',    badgeBg: '#22d3ee', badgeColor: '#fff', topColor: '#22d3ee', logo: gf('bitget.com')            },
  { name: 'Crypto.com',  tagline: 'Crypto at the Speed of Life',             badge: 'GOLD WINNER',  badgeBg: '#3b82f6', badgeColor: '#fff', topColor: '#3b82f6', logo: gf('crypto.com')            },
  { name: 'Cash App',    tagline: 'Cash App, Everyday Crypto',               badge: 'GOLD WINNER',  badgeBg: '#f05025', badgeColor: '#fff', topColor: '#f05025', logo: gf('cash.app')              },
  { name: 'Zelle',       tagline: 'Zelle, Crypto for Emerging Markets',      badge: 'EMERGENCE',    badgeBg: '#8b5cf6', badgeColor: '#fff', topColor: '#8b5cf6', logo: gf('zellepay.com')          },
  { name: 'Venmo',       tagline: 'Venmo, Crypto for Emerging Markets',      badge: 'EMERGENCE',    badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#3b82f6', logo: gf('venmo.com')             },
  { name: 'GCash',       tagline: 'GCash, Crypto in Your Wallet',            badge: 'PHP',          badgeBg: '#22d3ee', badgeColor: '#fff', topColor: '#22d3ee', logo: gf('gcash.com')             },
]

const modalOpen      = ref(false)
const activeProvider = ref(null)
const generating     = ref(false)
const showSuccess    = ref(false)
const formError      = ref('')

const form = reactive({ coin: '', quantity: '', network: '', fee: '', receiver: '', sender: '' })

function openModal(p) {
  activeProvider.value = p
  formError.value = ''
  Object.assign(form, { coin: '', quantity: '', network: '', fee: '', receiver: '', sender: '' })
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closeModal() {
  modalOpen.value = false
  document.body.style.overflow = ''
  setTimeout(() => { activeProvider.value = null }, 300)
}

function generate() {
  formError.value = ''
  if (!form.coin)                { formError.value = 'Please select a coin.'; return }
  if (!form.quantity || Number(form.quantity) <= 0) { formError.value = 'Please enter a valid quantity.'; return }
  if (!form.network)             { formError.value = 'Please select a network.'; return }
  if (!form.receiver.trim())     { formError.value = "Receiver's wallet address is required."; return }

  generating.value = true
  setTimeout(() => {
    generating.value = false
    showSuccess.value = true
    closeModal()
    setTimeout(() => { showSuccess.value = false }, 3500)
  }, 1600)
}

function onImgError(e) {
  e.target.style.display = 'none'
  e.target.parentElement.innerHTML = `<span class="p-card__logo-fallback">${e.target.alt.slice(0,2).toUpperCase()}</span>`
}
</script>

<style scoped>
.cr-page { display: flex; flex-direction: column; gap: 28px; }

/* Header */
.cr-header   { display: flex; align-items: flex-start; gap: 16px; }
.back-btn {
  display: flex; align-items: center; gap: 6px; padding: 7px 14px;
  border-radius: 8px; border: 1px solid var(--border-soft); background: var(--bg);
  color: var(--t2); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: background 0.18s, color 0.18s; flex-shrink: 0; margin-top: 4px;
}
.back-btn:hover { background: var(--bg); color: var(--t1); }
.cr-head-text { display: flex; flex-direction: column; gap: 4px; }
.cr-title { font-size: 1.45rem; font-weight: 800; color: var(--t1); letter-spacing: -0.025em; margin: 0; }
.cr-sub   { font-size: 0.82rem; color: var(--t1); font-weight: 600; margin: 0; }

/* Provider Grid */
.provider-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

/* Provider Card */
.p-card {
  position: relative; display: flex; flex-direction: column; align-items: center;
  gap: 10px; padding: 0 18px 18px; border-radius: 16px;
  border: 1px solid var(--border-soft); cursor: pointer; overflow: hidden; text-align: center;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.p-card:hover { transform: translateY(-4px); border-color: var(--border); box-shadow: 0 10px 32px rgba(0,0,0,0.25); }
.p-card__top-bar { height: 5px; background: var(--accent-top); flex-shrink: 0; align-self: stretch; margin-left: -18px; width: calc(100% + 36px); margin-bottom: 6px; }
.p-card__badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 12px; border-radius: 999px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.06em; flex-shrink: 0; }
.p-card__logo-wrap { width: 68px; height: 68px; border-radius: 18px; background: var(--glass-hover); border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.p-card__logo { width: 52px; height: 52px; object-fit: contain; border-radius: 10px; image-rendering: -webkit-optimize-contrast; }
.p-card__logo-fallback { font-size: 1rem; font-weight: 800; color: var(--t2); }
.p-card__name { font-size: 0.92rem; font-weight: 700; color: var(--t1); margin: 0; }
.p-card__tag  { font-size: 0.75rem; color: var(--t3); margin: 0; line-height: 1.5; }
.p-card__cta  { margin-top: auto; font-size: 0.72rem; color: var(--t4); padding-top: 8px; border-top: 1px solid var(--border-soft); width: 100%; text-align: center; }

/* Backdrop */

/* Modal */
.receipt-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 301;
  width: 90%;
  max-width: 520px;
  max-height: calc(100vh - 80px);
  border-radius: 20px;
  overflow-y: auto;
  background: #ffffff;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
}

/* Close button */
.modal-close {
  position: absolute; top: 14px; right: 14px; z-index: 10;
  width: 30px; height: 30px; border-radius: 8px;
  background: rgba(0,0,0,0.25); border: none; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.18s;
}
.modal-close:hover { background: rgba(0,0,0,0.45); }

/* Modal colored header */
.modal-head {
  padding: 26px 24px 20px;
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; text-align: center; position: relative;
}
.modal-logo-box {
  width: 64px; height: 64px; border-radius: 16px;
  background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.modal-logo       { width: 48px; height: 48px; object-fit: contain; border-radius: 10px; }
.modal-head-title { font-size: 1.2rem; font-weight: 800; color: #fff; margin: 0; }
.modal-head-sub   { font-size: 0.82rem; color: rgba(255,255,255,0.82); margin: 0; }

/* Modal form body â€" always light, like a real document */
.modal-body {
  background: #ffffff;
  padding: 20px 22px 18px;
  display: flex; flex-direction: column; gap: 14px;
}

/* Fields */
.fg { display: flex; flex-direction: column; gap: 7px; }
.fl { font-size: 0.78rem; font-weight: 600; color: #334155; }
.req { color: #ef4444; }

.fi {
  width: 100%; padding: 10px 14px; border-radius: 10px;
  border: 1px solid #e2e8f0; background: #fff;
  color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem;
  transition: border-color 0.18s; box-sizing: border-box;
}
.fi:focus { outline: none; border-color: #94a3b8; }
.fi::placeholder { color: #94a3b8; font-size: 0.78rem; }

.fs {
  width: 100%; padding: 10px 14px; border-radius: 10px;
  border: 1px solid #e2e8f0; background: #fff;
  color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem;
  cursor: pointer; transition: border-color 0.18s;
}
.fs:focus { outline: none; border-color: #94a3b8; }

/* Error */
.form-error {
  font-size: 0.78rem; color: #ef4444;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  border-radius: 8px; padding: 10px 12px; margin: 0;
}

/* Generate button */
.generate-btn {
  width: 100%; padding: 14px; border-radius: 12px; border: none;
  color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem; font-weight: 700;
  cursor: pointer; transition: opacity 0.2s, transform 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  filter: brightness(1);
}
.generate-btn:hover:not(.generate-btn--loading) { filter: brightness(1.1); transform: translateY(-1px); }
.generate-btn--loading { opacity: 0.75; cursor: not-allowed; }

/* Spinner */
.spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin 0.7s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Success Toast */
.success-toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 400;
  display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-radius: 14px;
  background: var(--accent); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.85rem; font-weight: 600; box-shadow: 0 8px 28px rgba(22,163,74,0.45);
}

/* Animations */
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.25s ease; }
.backdrop-fade-enter-from,   .backdrop-fade-leave-to     { opacity: 0; }

.modal-pop-enter-active { transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1); }
.modal-pop-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.modal-pop-enter-from   { opacity: 0; transform: translate(-50%, -50%) scale(0.94); }
.modal-pop-leave-to     { opacity: 0; transform: translate(-50%, -50%) scale(0.94); }

.toast-pop-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-pop-enter-from,
.toast-pop-leave-to     { opacity: 0; transform: translateY(12px) scale(0.95); }

/* Responsive */
@media (max-width: 1024px) { .provider-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
@media (max-width: 768px) {
  .cr-header     { flex-direction: column; gap: 10px; margin-top: 10px; }
  .provider-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
}
@media (max-width: 600px) {
  .cr-header     { margin-top: 12px; }
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
  .cr-header     { margin-top: 14px; }
  .provider-grid { gap: 8px; }
  .p-card        { padding: 0 11px 14px; gap: 7px; border-radius: 12px; }
  .p-card__top-bar { margin-left: -11px; width: calc(100% + 22px); }
  .p-card__logo-wrap { width: 46px; height: 46px; border-radius: 12px; }
  .p-card__logo-wrap img { width: 28px; height: 28px; }
  .p-card__name  { font-size: 0.76rem; }
  .p-card__tag   { font-size: 0.62rem; }
  .p-card__cta   { font-size: 0.6rem; }
  .back-btn      { font-size: 0.75rem; padding: 6px 12px; }
}
@media (max-width: 480px) { .receipt-modal { max-width: 95vw; } .modal-body { padding: 14px 14px; } }

</style>
