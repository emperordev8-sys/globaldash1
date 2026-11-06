<!-- src/views/WalletFundingView.vue -->
<template>
  <div class="wf-page">

    <!-- Back -->
    <button class="wf-back" @click="router.push('/tools')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      Back to Tools
    </button>

    <!-- Header row -->
    <div class="wf-header">
      <div class="wf-header__left">
        <div class="wf-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)"
            stroke-width="2" stroke-linecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <div>
          <div class="wf-title-row">
            <h1 class="wf-title">Wallet Funding</h1>
            <span class="wf-badge wf-badge--web3">Web3 Only</span>
          </div>
          <p class="wf-sub">
            Pure pay-as-you-go on your plan — every funding request is charged from your wallet balance.
          </p>
        </div>
      </div>

      <button class="wf-history-btn" @click="$router.push('/transactions')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
        </svg>
        History
      </button>
    </div>

    <!-- Plan info card -->
    <div class="wf-plan-card">
      <div class="wf-plan-left">
        <span class="wf-plan-label">THIS MONTH ON STARTER</span>
        <div class="wf-plan-value">$0 <span class="wf-plan-hint">free funding left</span></div>
        <p class="wf-plan-desc">
          Pure pay-as-you-go on this plan — every request comes out of your wallet balance.
        </p>
        <div class="wf-discount-alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)"
            stroke-width="2" stroke-linecap="round" style="flex-shrink:0;margin-top:1px">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>
            You get a <strong>20% discount</strong> on the wallet charge once you fund
            <strong>$500,000</strong> or above in a single request. Smaller requests pay the full
            overage rate.
          </p>
        </div>
      </div>
      <div class="wf-plan-right">
        <span class="wf-balance-label">Wallet balance</span>
        <span class="wf-balance-val">₦0</span>
        <button class="wf-fund-btn" @click="router.push('/wallet')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Fund Wallet
        </button>
      </div>
    </div>

    <!-- Providers section -->
    <div class="wf-section-label">Select a funding provider</div>

    <div class="wf-grid">
      <div
        v-for="p in providers"
        :key="p.name"
        class="wf-card"
        @click="openProvider(p)"
      >
        <!-- Logo -->
        <div class="wf-card-logo" :style="{ background: p.bg }">
          <img :src="gf(p.domain)" :alt="p.name" class="provider-logo" />
        </div>

        <!-- Info -->
        <div class="wf-card-info">
          <span class="wf-card-name">{{ p.name }}</span>
          <span class="wf-card-coins">{{ p.coins }} coin{{ p.coins !== 1 ? 's' : '' }} available</span>
        </div>

        <!-- Coin tags -->
        <div class="wf-card-tags">
          <span v-for="coin in p.coinList" :key="coin" class="wf-coin-tag">{{ coin }}</span>
        </div>

        <!-- Arrow -->
        <div class="wf-card-arrow">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </div>

    <!-- How it works -->
    <div class="wf-howto">
      <div class="wf-howto-title">How it works</div>
      <div class="wf-howto-grid">
        <div v-for="step in steps" :key="step.n" class="wf-step">
          <div class="wf-step-num">{{ step.n }}</div>
          <div>
            <div class="wf-step-title">{{ step.title }}</div>
            <div class="wf-step-desc">{{ step.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Provider modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="activeProvider" class="modal-overlay" @click.self="activeProvider = null">
          <div class="modal-box">
            <button class="modal-close" @click="activeProvider = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="modal-header">
              <div class="modal-logo" :style="{ background: activeProvider.bg }">
                <img :src="gf(activeProvider.domain)" :alt="activeProvider.name" class="provider-logo" />
              </div>
              <div>
                <h2 class="modal-title">{{ activeProvider.name }}</h2>
                <p class="modal-sub">{{ activeProvider.coins }} coin{{ activeProvider.coins !== 1 ? 's' : '' }} available</p>
              </div>
            </div>

            <div class="modal-coins">
              <div v-for="coin in activeProvider.coinList" :key="coin" class="modal-coin-row">
                <div class="modal-coin-icon">{{ coinEmoji(coin) }}</div>
                <div>
                  <div class="modal-coin-name">{{ coin }}</div>
                  <div class="modal-coin-network">{{ coinNetwork(coin) }}</div>
                </div>
                <button class="modal-fund-btn" @click="selectCoin(coin)">
                  Fund with {{ coin }}
                </button>
              </div>
            </div>

            <p class="modal-note">
              Funding is instant once confirmed on-chain. Charges are deducted from your wallet balance per request.
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'

const router = useRouter()

const activeProvider = ref(null)

const gf = d => `https://www.google.com/s2/favicons?domain=${d}&sz=128`

const providers = [
  { name: 'Binance Funding',      domain: 'binance.com',     bg: 'rgba(243,186,47,.12)',  coins: 2, coinList: ['BTC','ETH'] },
  { name: 'Trust Wallet Funding', domain: 'trustwallet.com', bg: 'rgba(51,117,187,.12)',  coins: 3, coinList: ['BTC','ETH','BNB'] },
  { name: 'Gate.io Funding',      domain: 'gate.io',         bg: 'rgba(43,78,255,.12)',   coins: 3, coinList: ['BTC','ETH','USDT'] },
  { name: 'Coinbase',             domain: 'coinbase.com',    bg: 'rgba(0,82,255,.12)',    coins: 1, coinList: ['BTC'] },
  { name: 'Kucoin',               domain: 'kucoin.com',      bg: 'rgba(35,175,145,.12)', coins: 2, coinList: ['BTC','ETH'] },
]

const steps = [
  { n: '1', title: 'Choose a provider',    desc: 'Select the crypto exchange or wallet you want to fund from.' },
  { n: '2', title: 'Pick a coin',          desc: 'Choose the cryptocurrency you\'ll use to complete the funding.' },
  { n: '3', title: 'Send & confirm',       desc: 'Send the crypto to the provided address and your balance updates instantly.' },
]

const coinEmoji = (c) =>
  ({ BTC: '₿', ETH: 'Ξ', BNB: '⬡', USDT: '₮' }[c] ?? c[0])

const coinNetwork = (c) =>
  ({ BTC: 'Bitcoin Network', ETH: 'Ethereum (ERC-20)', BNB: 'BNB Smart Chain', USDT: 'Tether (TRC-20)' }[c] ?? c)

const { info } = useToast()

function openProvider(p) { activeProvider.value = p }
function selectCoin(coin) {
  info(
    `${coin} Funding Coming Soon`,
    `Funding via ${coin} from ${activeProvider.value.name} will be available shortly. Stay tuned!`
  )
  activeProvider.value = null
}
</script>

<style scoped>
.wf-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* back */
.wf-back {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--t3); font-size: 0.82rem; font-family: inherit;
  padding: 0; transition: color 0.2s;
}
.wf-back:hover { color: var(--t1); }

/* header */
.wf-header {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
}
.wf-header__left { display: flex; align-items: flex-start; gap: 16px; }
.wf-header-icon {
  width: 52px; height: 52px; border-radius: 16px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1);
  border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.wf-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
.wf-title { font-size: 1.5rem; font-weight: 800; color: var(--t1); margin: 0; letter-spacing: -0.02em; }
.wf-badge {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; padding: 3px 9px; border-radius: 999px;
}
.wf-badge--web3 { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.15); color: var(--accent); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.25); }
.wf-sub { font-size: 0.83rem; color: var(--t1); font-weight: 600; margin: 0; line-height: 1.5; max-width: 520px; }

/* history btn */
.wf-history-btn {
  display: flex; align-items: center; gap: 7px; flex-shrink: 0;
  background: var(--bg); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 9px 16px; font-size: 0.82rem;
  font-weight: 600; color: var(--t2); cursor: pointer;
  font-family: inherit; transition: border-color 0.2s, color 0.2s;
}
.wf-history-btn:hover { border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.35); color: var(--t1); }

/* plan card */
.wf-plan-card {
  background: var(--bg);
 
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.wf-plan-left { display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 240px; }
.wf-plan-label {
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--t3);
}
.wf-plan-value { font-size: 1.7rem; font-weight: 800; color: var(--t1); line-height: 1; }
.wf-plan-hint  { font-size: 1rem; font-weight: 500; color: var(--t3); }
.wf-plan-desc  { font-size: 0.8rem; color: var(--t3); margin: 0; line-height: 1.5; }

.wf-discount-alert {
  display: flex; gap: 10px; align-items: flex-start;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.08);
  border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2);
  border-radius: 12px; padding: 12px 14px;
}
.wf-discount-alert p {
  font-size: 0.78rem; color: var(--t2); margin: 0; line-height: 1.5;
}
.wf-discount-alert strong { color: var(--accent); }

.wf-plan-right {
  display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
  flex-shrink: 0;
}
.wf-balance-label { font-size: 0.72rem; color: var(--t3); font-weight: 600; }
.wf-balance-val   { font-size: 1.5rem; font-weight: 800; color: var(--t1); }
.wf-fund-btn {
  display: flex; align-items: center; gap: 6px;
  background: var(--accent); border: 1px solid var(--accent);
  border-radius: 10px; padding: 9px 18px; font-size: 0.82rem;
  font-weight: 700; color: #fff; cursor: pointer;
  font-family: inherit; transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.wf-fund-btn:hover { background: var(--accent-press); border-color: var(--accent-press); transform: translateY(-1px); }

/* section label */
.wf-section-label {
  font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.09em; color: var(--t3);
}

/* provider grid */
.wf-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.wf-card {
  background: var(--bg);
 
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: border-color 0.22s, transform 0.22s;
}
.wf-card:hover {
  border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.35);
  transform: translateY(-2px);
}

.wf-card-logo {
  width: 50px; height: 50px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.provider-logo { width: 30px; height: 30px; object-fit: contain; border-radius: 6px; }

.wf-card-info { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.wf-card-name  { font-size: 0.9rem; font-weight: 700; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wf-card-coins { font-size: 0.75rem; color: var(--t3); }

.wf-card-tags  { display: flex; gap: 4px; flex-wrap: wrap; flex-shrink: 0; }
.wf-coin-tag {
  font-size: 0.62rem; font-weight: 700; padding: 2px 6px;
  background: var(--modal-input); border: 1px solid var(--border-soft);
  border-radius: 6px; color: var(--t2);
}

.wf-card-arrow {
  color: var(--t3); flex-shrink: 0;
  transition: color 0.2s, transform 0.2s;
}
.wf-card:hover .wf-card-arrow { color: var(--accent); transform: translateX(3px); }

/* how it works */
.wf-howto {
  background: var(--bg);
 
  border: 1px solid var(--border-soft);
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.wf-howto-title { font-size: 0.85rem; font-weight: 700; color: var(--t1); }
.wf-howto-grid  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.wf-step        { display: flex; gap: 12px; align-items: flex-start; }
.wf-step-num {
  width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.12); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2);
  font-size: 0.75rem; font-weight: 800; color: var(--accent);
  display: flex; align-items: center; justify-content: center;
}
.wf-step-title { font-size: 0.82rem; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
.wf-step-desc  { font-size: 0.76rem; color: var(--t3); line-height: 1.5; }

/* ── Modal ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,  .modal-fade-leave-to     { opacity: 0; }

.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.modal-box {
  background: var(--surface-raised);
  border: 1px solid var(--modal-border);
  border-radius: 24px;
  padding: 28px;
  width: 100%; max-width: 420px;
  position: relative;
  display: flex; flex-direction: column; gap: 22px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}
.modal-close {
  position: absolute; top: 18px; right: 18px;
  width: 30px; height: 30px; border-radius: 8px;
  background: var(--modal-input); border: 1px solid var(--border-soft);
  color: var(--t2); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.modal-close:hover { background: rgba(248,113,113,.12); color: #f87171; }

.modal-header { display: flex; align-items: center; gap: 14px; }
.modal-logo {
  width: 52px; height: 52px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.modal-title { font-size: 1.1rem; font-weight: 800; color: var(--t1); margin: 0 0 3px; }
.modal-sub   { font-size: 0.78rem; color: var(--t1); font-weight: 600; margin: 0; }

.modal-coins { display: flex; flex-direction: column; gap: 10px; }
.modal-coin-row {
  display: flex; align-items: center; gap: 12px;
  background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 14px; padding: 14px 16px;
}
.modal-coin-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--modal-input);
  font-size: 1rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  color: var(--t1); flex-shrink: 0;
}
.modal-coin-name    { font-size: 0.85rem; font-weight: 700; color: var(--t1); }
.modal-coin-network { font-size: 0.72rem; color: var(--t3); }
.modal-fund-btn {
  margin-left: auto; background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1);
  border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2); border-radius: 9px;
  padding: 8px 14px; font-size: 0.76rem; font-weight: 700; color: var(--accent);
  cursor: pointer; font-family: inherit; white-space: nowrap;
  transition: background 0.2s;
}
.modal-fund-btn:hover { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2); }

.modal-note {
  font-size: 0.74rem; color: var(--t3); margin: 0;
  padding-top: 8px; border-top: 1px solid var(--border-soft);
  line-height: 1.5;
}

/* ── Tablet ── */
@media (max-width: 1024px) and (min-width: 769px) {
  .wf-page        { gap: 20px; }
  .wf-grid        { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .wf-howto-grid  { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .wf-plan-card   { padding: 14px 16px; }
  .wf-howto       { padding: 14px 16px; }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .wf-page        { gap: 16px; }
  .wf-title       { font-size: 1.3rem; }
  .wf-sub         { max-width: 100%; }

  /* header stacks vertically; history button goes full-width */
  .wf-header      { flex-direction: column; align-items: flex-start; gap: 12px; }
  .wf-history-btn { width: 100%; justify-content: center; }

  /* plan card stacks; right side left-aligns and stretches full width */
  .wf-plan-card   { flex-direction: column; padding: 14px 14px; gap: 12px; }
  .wf-plan-right  { width: 100%; flex-direction: row; flex-wrap: wrap; gap: 12px; align-items: center; }
  .wf-balance-label { display: none; }
  .wf-balance-val { font-size: 1.3rem; }
  .wf-fund-btn    { margin-left: auto; }

  /* provider cards: full-width 1-col (2-col is too cramped for logo+tags+arrow) */
  .wf-grid        { grid-template-columns: 1fr; gap: 10px; }

  /* how it works: 1 col */
  .wf-howto-grid  { grid-template-columns: 1fr; gap: 14px; }
  .wf-howto       { padding: 13px 13px; }

  /* modal: bottom sheet */
  .modal-overlay  { padding: 0; align-items: flex-end; }
  .modal-box      { max-width: 100%; border-radius: 22px 22px 0 0; max-height: 90vh; overflow-y: auto; }
}

/* ── Small Mobile ── */
@media (max-width: 480px) {
  .wf-page        { gap: 14px; }
  .wf-title       { font-size: 1.15rem; }
  .wf-plan-value  { font-size: 1.4rem; }
  .wf-plan-card   { padding: 10px; }
  .wf-card        { padding: 16px; gap: 10px; }
  .wf-card-logo   { width: 42px; height: 42px; border-radius: 12px; }
  .wf-card-name   { font-size: 0.84rem; }
  .wf-header-icon { width: 42px; height: 42px; border-radius: 12px; }
  .modal-coin-row { padding: 12px; gap: 10px; }
  .modal-fund-btn { padding: 7px 10px; font-size: 0.7rem; }
}

</style>
