<!-- src/views/BrandedBillsView.vue -->
<template>
  <div class="cbm-page">

    <!-- ══════════ COMPOSE (full page) ══════════ -->
    <template v-if="activeProvider">
      <button class="ce-back" @click="activeProvider = null">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Crypto Bills Mails
      </button>

      <div class="ce-grid">
        <!-- Form -->
        <div class="ce-form-card">
          <div class="ce-hero" :style="{ background: `linear-gradient(160deg, ${activeProvider.topColor} 0%, rgba(0,0,0,0.28) 150%)` }">
            <div class="ce-hero__logo"><img :src="activeProvider.logo" :alt="activeProvider.name" @error="onImgError" /></div>
            <div class="ce-hero__title">Send via {{ activeProvider.name }}</div>
            <div class="ce-hero__sub">Generates a branded billing email styled like {{ activeProvider.name }}.</div>
          </div>

          <div class="ce-body">
            <div class="ce-field">
              <label class="ce-label">Recipient's email <span class="ce-req">*</span></label>
              <input v-model="form.recipient" type="email" class="ce-input" placeholder="name@example.com" />
            </div>
            <div class="ce-field">
              <label class="ce-label">Recipient name</label>
              <input v-model="form.recipientName" class="ce-input" placeholder="e.g. John Doe" />
            </div>
            <div class="ce-row">
              <div class="ce-field">
                <label class="ce-label">Invoice No. <span class="ce-req">*</span></label>
                <input v-model="form.invoice" class="ce-input" placeholder="INV-0001" />
              </div>
              <div class="ce-field">
                <label class="ce-label">Due date</label>
                <input v-model="form.dueDate" type="date" class="ce-input" />
              </div>
            </div>
            <div class="ce-row">
              <div class="ce-field">
                <label class="ce-label">Amount <span class="ce-req">*</span></label>
                <input v-model="form.amount" type="number" min="0" step="any" class="ce-input" placeholder="0.00" />
              </div>
              <div class="ce-field">
                <label class="ce-label">Currency</label>
                <select v-model="form.currency" class="ce-input">
                  <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
            <div class="ce-field">
              <label class="ce-label">Bill type</label>
              <div class="ce-pills">
                <button v-for="t in billTypes" :key="t" class="ce-pill" :class="{ 'ce-pill--on': form.billType === t }" @click="form.billType = t">{{ t }}</button>
              </div>
            </div>
            <div class="ce-field">
              <label class="ce-label">Description <span class="ce-opt">(optional)</span></label>
              <textarea v-model="form.description" rows="3" class="ce-input ce-textarea" placeholder="Describe the service or product being billed…"></textarea>
            </div>

            <button class="ce-send" :style="{ background: activeProvider.topColor, color: btnText }" @click="sendBill">
              {{ sending ? 'Sending…' : `Send ${activeProvider.name} ${form.billType.toLowerCase()}` }}
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="ce-preview-wrap">
          <div class="ce-preview-bar">
            <span>{{ activeProvider.name.toUpperCase() }} {{ form.billType.toUpperCase() }}</span>
            <span class="ce-subject">Subject: <strong>{{ subject }}</strong></span>
          </div>

          <div class="bl-email">
            <div class="bl-email__header" :style="{ background: activeProvider.topColor, color: headText }">
              <div class="bl-email__brand"><img :src="activeProvider.logo" :alt="activeProvider.name" @error="onImgError" /> <span>{{ activeProvider.name }}</span></div>
              <span class="bl-email__type">{{ form.billType }}</span>
            </div>
            <div class="bl-email__body">
              <h2 class="bl-email__h">{{ form.billType }} {{ form.invoice || 'INV-0001' }}</h2>
              <div class="bl-meta">
                <div><span>Issued to</span><strong>{{ form.recipientName || 'Customer' }}</strong><small>{{ form.recipient || 'name@example.com' }}</small></div>
                <div class="bl-meta--right"><span>Due date</span><strong>{{ dueDisplay }}</strong></div>
              </div>
              <div class="bl-line">
                <span class="bl-line__desc">{{ form.description || `${activeProvider.name} ${form.billType.toLowerCase()}` }}</span>
                <span class="bl-line__amt">{{ money }}</span>
              </div>
              <div class="bl-total">
                <span>Total {{ form.billType === 'Receipt' ? 'paid' : 'due' }}</span>
                <span class="bl-total__amt">{{ money }}</span>
              </div>
              <a class="bl-pay" :style="{ background: activeProvider.topColor, color: btnText }">{{ form.billType === 'Receipt' ? 'View receipt' : form.billType === 'Subscription' ? 'Manage subscription' : 'Pay now' }}</a>
              <p class="bl-note">{{ form.billType === 'Receipt' ? `This confirms your payment to ${activeProvider.name}.` : `Please settle this ${form.billType.toLowerCase()} by ${dueDisplay}.` }} Questions? Just reply to this email.</p>
              <p class="bl-foot">© {{ year }} {{ activeProvider.name }}. This {{ form.billType.toLowerCase() }} was generated via Globalgle.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ══════════ GRID ══════════ -->
    <template v-else>
      <div class="cbm-header">
        <button class="ce-back" @click="$router.push('/customers')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div class="cbm-header__text">
          <h1 class="cbm-title">Crypto Bills Mails</h1>
          <p class="cbm-sub">Pick a provider to send a brand-styled billing email.</p>
        </div>
      </div>

      <div class="provider-grid">
        <div v-for="p in providers" :key="p.name" class="p-card" :style="{ '--accent-top': p.topColor }" @click="selectProvider(p)">
          <div class="p-card__top-bar" />
          <div class="p-card__badge" :style="{ background: p.badgeBg, color: p.badgeColor }">{{ p.badge }}</div>
          <div class="p-card__logo-wrap"><img :src="p.logo" :alt="p.name" class="p-card__logo" @error="onImgError" /></div>
          <h3 class="p-card__name">{{ p.name }}</h3>
          <p class="p-card__tag">{{ p.tagline }}</p>
          <span class="p-card__cta">Click Anywhere</span>
        </div>
      </div>

      <div class="recent-section">
        <h2 class="recent-title">Recently sent Crypto Bills Mails</h2>
        <div v-if="sentBills.length === 0" class="recent-empty">
          <div class="recent-empty__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <p class="recent-empty__title">No Crypto Bills Mails yet</p>
          <p class="recent-empty__sub">Pick a provider above and send your first bill — it will appear here.</p>
        </div>
        <div v-else class="sent-list">
          <div v-for="b in sentBills" :key="b.id" class="sent-item">
            <img :src="b.logo" :alt="b.provider" class="sent-item__logo" />
            <div class="sent-item__info">
              <span class="sent-item__to">{{ b.recipient }}</span>
              <span class="sent-item__meta">{{ b.provider }} · {{ b.billType }} #{{ b.invoice }} · {{ b.amount }}</span>
            </div>
            <span class="sent-item__badge">Sent</span>
            <span class="sent-item__time">{{ b.time }}</span>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from '../composables/useToast.js'

const { success, error } = useToast()
const year = new Date().getFullYear()
const gf = d => `https://www.google.com/s2/favicons?domain=${d}&sz=128`

const providers = [
  { name: 'Binance', tagline: 'Binance Sets the Standard', badge: 'GLOBAL', badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f3ba2f', logo: gf('binance.com') },
  { name: 'Coinbase', tagline: 'Coinbase, Accessible and Simple', badge: 'GOLD', badgeBg: '#3b82f6', badgeColor: '#fff', topColor: '#1652f0', logo: gf('coinbase.com') },
  { name: 'Blockchain.com', tagline: 'Blockchain, the Original', badge: 'PREMIUM', badgeBg: '#60a5fa', badgeColor: '#fff', topColor: '#1267f2', logo: gf('blockchain.com') },
  { name: 'Bitcoin.com', tagline: 'Bitcoin, Reimagined', badge: 'PIONEER', badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f7931a', logo: gf('bitcoin.com') },
  { name: 'ByBit', tagline: 'Bybit, Speed and Precision', badge: 'SPEED', badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f7a600', logo: gf('bybit.com') },
  { name: 'MetaMask', tagline: 'MetaMask, the Gateway', badge: 'PROFESSIONAL', badgeBg: '#f97316', badgeColor: '#fff', topColor: '#f6851b', logo: gf('metamask.io') },
  { name: 'OKX', tagline: 'OKX, Powerful. Secure. Global.', badge: 'POWERHOUSE', badgeBg: '#0f172a', badgeColor: '#fff', topColor: '#0f172a', logo: gf('okx.com') },
  { name: 'LUNO', tagline: 'Luno, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#0052ff', logo: gf('luno.com') },
  { name: 'VALR', tagline: "VALR, South Africa's Crypto Frontier", badge: 'AFRICA', badgeBg: '#0f172a', badgeColor: '#fff', topColor: '#1e293b', logo: gf('valr.com') },
  { name: 'Yellow Card', tagline: 'Yellow Card, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f5b400', logo: gf('yellowcard.io') },
  { name: 'Roqqu', tagline: 'Roqqu, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#1e293b', logo: gf('roqqu.com') },
  { name: 'Bitso', tagline: "Bitso, Latin America's Crypto Bridge", badge: 'PROFESSIONAL', badgeBg: '#f05025', badgeColor: '#fff', topColor: '#09b1a4', logo: gf('bitso.com') },
  { name: 'AltCoin Trader', tagline: 'AltCoin Trader, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#1e63c7', logo: gf('altcointrader.co.za') },
  { name: 'Crypto.com', tagline: 'Crypto at the Speed of Life', badge: 'GOLD WINNER', badgeBg: '#3b82f6', badgeColor: '#fff', topColor: '#103f68', logo: gf('crypto.com') },
  { name: 'Zelle', tagline: 'Zelle, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#8b5cf6', badgeColor: '#fff', topColor: '#6d1ed4', logo: gf('zellepay.com') },
  { name: 'Venmo', tagline: 'Venmo, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#008cff', logo: gf('venmo.com') },
  { name: 'GCash', tagline: 'GCash, Crypto in Your Wallet', badge: 'PHP', badgeBg: '#22d3ee', badgeColor: '#fff', topColor: '#007dfe', logo: gf('gcash.com') },
]

const billTypes = ['Invoice', 'Receipt', 'Subscription', 'Payment Request']
const currencies = ['USD', 'BTC', 'ETH', 'BNB', 'USDT', 'NGN', 'GBP', 'EUR']

const activeProvider = ref(null)
const sending = ref(false)
const sentBills = ref([])

const form = reactive({
  recipient: '', recipientName: '', invoice: 'INV-0001', dueDate: '',
  amount: '0.00', currency: 'USD', billType: 'Invoice', description: '',
})

function luminance(hex) {
  const c = hex.replace('#', ''); const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b
}
const btnText = computed(() => activeProvider.value && luminance(activeProvider.value.topColor) > 150 ? '#181a20' : '#ffffff')
const headText = computed(() => btnText.value)

const money = computed(() => {
  const n = parseFloat(form.amount) || 0
  const s = n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return form.currency === 'USD' ? '$' + s : `${s} ${form.currency}`
})
const dueDisplay = computed(() => {
  if (!form.dueDate) return 'On receipt'
  return new Date(form.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})
const subject = computed(() => activeProvider.value ? `[${activeProvider.value.name}] ${form.billType} ${form.invoice || 'INV-0001'}` : '')

function selectProvider(p) {
  activeProvider.value = p
  Object.assign(form, { recipient: '', recipientName: '', invoice: 'INV-0001', dueDate: '', amount: '0.00', currency: 'USD', billType: 'Invoice', description: '' })
}

function sendBill() {
  if (!form.recipient.trim() || !form.recipient.includes('@')) { error('Recipient required', 'Enter a valid email address.'); return }
  if (!form.invoice.trim()) { error('Invoice number required', 'Enter an invoice number.'); return }
  if (!form.amount || Number(form.amount) <= 0) { error('Amount required', 'Enter a valid amount.'); return }
  sending.value = true
  setTimeout(() => {
    sentBills.value.unshift({
      id: Date.now(), provider: activeProvider.value.name, logo: activeProvider.value.logo,
      recipient: form.recipient, invoice: form.invoice, billType: form.billType, amount: money.value,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })
    sending.value = false
    success('Bill sent', `${activeProvider.value.name} ${form.billType.toLowerCase()} sent to ${form.recipient}.`)
    activeProvider.value = null
  }, 1200)
}

function onImgError(e) { e.target.style.visibility = 'hidden' }
</script>

<style scoped>
.cbm-page { display: flex; flex-direction: column; gap: 22px; }

/* Header */
.cbm-header { display: flex; align-items: flex-start; gap: 16px; }
.cbm-header__text { display: flex; flex-direction: column; gap: 4px; }
.cbm-title { font-size: 1.45rem; font-weight: 800; color: var(--t1); letter-spacing: -0.025em; margin: 0; }
.cbm-sub { font-size: 0.82rem; color: var(--t2); font-weight: 500; margin: 0; }

.ce-back {
  display: inline-flex; align-items: center; gap: 6px; align-self: flex-start;
  padding: 8px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg);
  color: var(--t2); font-family: inherit; font-size: 0.82rem; font-weight: 700; cursor: pointer;
  transition: color 0.16s ease, border-color 0.16s ease;
}
.ce-back:hover { color: var(--t1); border-color: var(--accent-border); }

/* Provider grid */
.provider-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.p-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 0 18px 18px; border-radius: 16px; background: var(--bg); border: 1px solid var(--border-soft); cursor: pointer; overflow: hidden; transition: transform 0.2s ease, border-color 0.2s ease; text-align: center; }
.p-card:hover { transform: translateY(-4px); border-color: var(--accent-border); }
.p-card__top-bar { height: 5px; background: var(--accent-top); flex-shrink: 0; align-self: stretch; margin-left: -18px; width: calc(100% + 36px); margin-bottom: 6px; }
.p-card__badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 12px; border-radius: 999px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.06em; flex-shrink: 0; }
.p-card__logo-wrap { width: 68px; height: 68px; border-radius: 18px; background: #fff; border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.p-card__logo { width: 44px; height: 44px; object-fit: contain; border-radius: 10px; }
.p-card__name { font-size: 0.92rem; font-weight: 700; color: var(--t1); margin: 0; }
.p-card__tag { font-size: 0.75rem; color: var(--t3); margin: 0; line-height: 1.5; }
.p-card__cta { margin-top: auto; font-size: 0.72rem; color: var(--t4); padding-top: 8px; border-top: 1px solid var(--border-soft); width: 100%; text-align: center; }

/* Recently sent */
.recent-section { display: flex; flex-direction: column; gap: 14px; }
.recent-title { font-size: 1rem; font-weight: 700; color: var(--t1); margin: 0; }
.recent-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 48px 24px; border: 1.5px dashed var(--border); border-radius: 16px; text-align: center; }
.recent-empty__icon { width: 48px; height: 48px; border-radius: 50%; background: var(--bg); border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; color: var(--t4); }
.recent-empty__title { font-size: 0.9rem; font-weight: 700; color: var(--t1); margin: 0; }
.recent-empty__sub { font-size: 0.78rem; color: var(--t3); margin: 0; max-width: 320px; line-height: 1.55; }
.sent-list { display: flex; flex-direction: column; gap: 8px; }
.sent-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; background: var(--bg); border: 1px solid var(--border-soft); }
.sent-item__logo { width: 28px; height: 28px; border-radius: 6px; object-fit: contain; background: #fff; }
.sent-item__info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.sent-item__to { font-size: 0.82rem; font-weight: 600; color: var(--t1); }
.sent-item__meta { font-size: 0.7rem; color: var(--t3); }
.sent-item__badge { font-size: 0.65rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: var(--accent-dim); border: 1px solid var(--accent-border); color: var(--accent); }
.sent-item__time { font-size: 0.7rem; color: var(--t4); white-space: nowrap; }

/* ══════════ Compose ══════════ */
.ce-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
.ce-form-card { background: var(--bg); border: 1px solid var(--t4); border-radius: 18px; overflow: hidden; }
.ce-hero { padding: 24px; text-align: center; color: #fff; }
.ce-hero__logo { width: 56px; height: 56px; border-radius: 14px; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; overflow: hidden; }
.ce-hero__logo img { width: 34px; height: 34px; object-fit: contain; }
.ce-hero__title { font-size: 1.3rem; font-weight: 800; }
.ce-hero__sub { font-size: 0.82rem; opacity: 0.9; margin-top: 4px; }
.ce-body { padding: 22px; display: flex; flex-direction: column; gap: 16px; }
.ce-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ce-field { display: flex; flex-direction: column; gap: 8px; }
.ce-label { font-size: 0.82rem; font-weight: 700; color: var(--t1); }
.ce-req { color: #ef4444; }
.ce-opt { font-weight: 500; color: var(--t4); }
.ce-input { width: 100%; height: 44px; padding: 0 14px; border-radius: 11px; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.88rem; outline: none; transition: border-color 0.16s ease; box-sizing: border-box; }
.ce-input:focus { border-color: var(--accent); }
select.ce-input { cursor: pointer; }
.ce-textarea { height: auto; padding: 12px 14px; resize: vertical; line-height: 1.5; }
.ce-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.ce-pill { height: 36px; padding: 0 15px; border-radius: 999px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.8rem; font-weight: 700; }
.ce-pill:hover { border-color: var(--accent-border); }
.ce-pill--on { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
.ce-send { height: 50px; border-radius: 12px; border: none; cursor: pointer; font-family: inherit; font-size: 0.92rem; font-weight: 800; transition: filter 0.15s ease, transform 0.15s ease; }
.ce-send:hover { filter: brightness(1.05); transform: translateY(-1px); }

/* Preview */
.ce-preview-wrap { position: sticky; top: 16px; }
.ce-preview-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 4px 12px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em; color: var(--t3); flex-wrap: wrap; }
.ce-subject { font-weight: 500; }
.ce-subject strong { color: var(--t2); font-weight: 700; }

/* Invoice email */
.bl-email { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; max-height: 580px; overflow-y: auto; }
.bl-email__header { padding: 20px 26px; display: flex; align-items: center; justify-content: space-between; }
.bl-email__brand { display: flex; align-items: center; gap: 10px; font-size: 1.15rem; font-weight: 800; }
.bl-email__brand img { width: 24px; height: 24px; object-fit: contain; }
.bl-email__type { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.85; }
.bl-email__body { padding: 24px 26px; }
.bl-email__h { margin: 0 0 18px; font-size: 1.2rem; font-weight: 800; color: #111827; }
.bl-meta { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 18px; border-bottom: 1px solid #eef0f2; margin-bottom: 16px; }
.bl-meta span { display: block; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; }
.bl-meta strong { display: block; font-size: 0.86rem; color: #111827; }
.bl-meta small { font-size: 0.74rem; color: #6b7280; }
.bl-meta--right { text-align: right; }
.bl-line { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid #eef0f2; font-size: 0.84rem; color: #374151; }
.bl-line__desc { line-height: 1.4; }
.bl-line__amt { font-weight: 700; color: #111827; white-space: nowrap; }
.bl-total { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 18px; font-size: 0.9rem; font-weight: 700; color: #111827; }
.bl-total__amt { font-size: 1.3rem; font-weight: 800; }
.bl-pay { display: block; text-align: center; padding: 12px; border-radius: 8px; font-size: 0.88rem; font-weight: 700; text-decoration: none; margin-bottom: 16px; }
.bl-note { margin: 0 0 14px; font-size: 0.76rem; color: #6b7280; line-height: 1.6; }
.bl-foot { margin: 0; padding-top: 14px; border-top: 1px solid #eef0f2; font-size: 0.68rem; color: #9ca3af; text-align: center; }

@media (max-width: 1024px) {
  .provider-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .ce-grid { grid-template-columns: 1fr; }
  .ce-preview-wrap { position: static; }
}
@media (max-width: 768px) { .provider-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
@media (max-width: 430px) { .provider-grid { grid-template-columns: 1fr 1fr; gap: 8px; } .ce-row { grid-template-columns: 1fr; } }
</style>
