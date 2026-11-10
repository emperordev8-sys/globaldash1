<!-- src/views/WalletFundingView.vue -->
<template>
  <div class="wf">

    <!-- Header -->
    <div class="wf-head">
      <div class="wf-head__text">
        <h1 class="wf-title">Wallet Funding <span class="wf-badge">WEB3 ONLY</span></h1>
        <p class="wf-sub">Your plan gives you a monthly free-funding limit of $20,000.00; anything beyond that is charged from your wallet balance.</p>
      </div>
      <button class="wf-history" @click="$router.push('/transactions')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
        History
      </button>
    </div>

    <!-- Promo -->
    <div class="wf-promo">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      <p>Your <strong>Premium</strong> plan gives you <strong>45% – 85% off</strong> on this service — bigger top-ups save more.</p>
    </div>

    <!-- Limit / balance card -->
    <div class="wf-limit">
      <div class="wf-limit__top">
        <div>
          <span class="wf-limit__label">THIS MONTH ON PREMIUM</span>
          <div class="wf-limit__val">$20,000.00 <span>free funding left</span></div>
        </div>
        <div class="wf-limit__bal">
          <span class="wf-limit__label">Wallet balance</span>
          <div class="wf-limit__balval">₦68,801.36</div>
        </div>
      </div>
      <div class="wf-bar"><div class="wf-bar__fill" :style="{ width: usedPct + '%' }"></div></div>
      <div class="wf-limit__foot">
        <span>$0.00 used</span>
        <span>$20,000.00 included</span>
      </div>
    </div>

    <!-- Providers -->
    <div class="wf-grid">
      <button v-for="p in providers" :key="p.name" class="wf-card" @click="open(p)">
        <span class="wf-card__ico"><img :src="p.logo" :alt="p.name" /></span>
        <span class="wf-card__text">
          <span class="wf-card__name">{{ p.name }}</span>
          <span class="wf-card__coins">{{ p.coins }} coin{{ p.coins === 1 ? '' : 's' }} available</span>
        </span>
        <svg class="wf-card__go" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'
import logoBinance from '../assets/logo-binance.svg'
import logoTrust from '../assets/logo-trustwallet.svg'
import logoBlockchain from '../assets/logo-blockchain.svg'

const { info } = useToast()
const usedPct = 0

const providers = [
  { name: 'Binance Funding', coins: 6, logo: logoBinance },
  { name: 'Trust Wallet Funding', coins: 4, logo: logoTrust },
  { name: 'Blockchain Funding', coins: 1, logo: logoBlockchain },
]

function open(p) {
  info(`${p.name} coming soon`, 'Crypto funding for this provider is not available yet — check back shortly.')
}
</script>

<style scoped>
.wf { display: flex; flex-direction: column; gap: 16px; }

/* Header */
.wf-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.wf-head__text { display: flex; flex-direction: column; gap: 6px; min-width: 0; max-width: 760px; }
.wf-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.wf-badge {
  font-size: 0.66rem; font-weight: 800; letter-spacing: 0.05em;
  color: #16a34a; background: rgba(22,163,74,0.1); border: 1px solid rgba(22,163,74,0.35);
  padding: 3px 10px; border-radius: 999px;
}
.wf-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; line-height: 1.5; }
.wf-history {
  display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;
  height: 40px; padding: 0 16px; border-radius: 11px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.82rem; font-weight: 700; transition: color 0.16s ease, border-color 0.16s ease;
}
.wf-history:hover { color: var(--t1); border-color: var(--accent-border); }

/* Promo */
.wf-promo { display: flex; align-items: center; gap: 10px; background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.22); border-radius: 12px; padding: 13px 16px; }
.wf-promo svg { color: #16a34a; flex-shrink: 0; }
.wf-promo p { margin: 0; font-size: 0.84rem; color: var(--t2); }
.wf-promo strong { color: #16a34a; font-weight: 800; }

/* Limit card */
.wf-limit { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 18px 20px; }
.wf-limit__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.wf-limit__label { display: block; font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; color: var(--t3); text-transform: uppercase; }
.wf-limit__val { font-size: 1.7rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; margin-top: 4px; }
.wf-limit__val span { font-size: 0.82rem; font-weight: 500; color: var(--t3); letter-spacing: 0; }
.wf-limit__bal { text-align: right; }
.wf-limit__balval { font-size: 1.3rem; font-weight: 800; color: var(--t1); margin-top: 4px; }
.wf-bar { height: 6px; border-radius: 999px; background: var(--glass-hover); overflow: hidden; margin: 16px 0 8px; }
.wf-bar__fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #16a34a, #22c55e); }
.wf-limit__foot { display: flex; align-items: center; justify-content: space-between; font-size: 0.74rem; color: var(--t3); }

/* Providers */
.wf-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.wf-card {
  display: flex; align-items: center; gap: 14px; cursor: pointer; text-align: left; font-family: inherit;
  padding: 18px; border-radius: 16px; background: var(--bg); border: 1px solid var(--t4); 
  transition: border-color 0.2s ease, transform 0.16s ease;
}
.wf-card:hover { border-color: var(--accent-border); transform: translateY(-3px); }
.wf-card__ico {
  width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: #fff; border: 1px solid var(--border-soft);
}
.wf-card__ico img { width: 26px; height: 26px; object-fit: contain; display: block; }
.wf-card__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.wf-card__name { font-size: 0.9rem; font-weight: 700; color: var(--t1); }
.wf-card__coins { font-size: 0.76rem; color: var(--t3); }
.wf-card__go { color: var(--t3); flex-shrink: 0; transition: color 0.18s ease, transform 0.18s ease; }
.wf-card:hover .wf-card__go { color: var(--accent); transform: translateX(3px); }

@media (max-width: 860px) {
  .wf-grid { grid-template-columns: 1fr; }
  .wf-head { flex-direction: column; align-items: stretch; }
  .wf-limit__bal { text-align: left; }
}
</style>
