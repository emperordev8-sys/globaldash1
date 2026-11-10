<!-- src/views/DigitalView.vue -->
<template>
  <div class="dg">

    <!-- Header -->
    <div class="dg-head">
      <h1 class="dg-title">Digital <span class="dg-badge">TOOLS</span></h1>
      <p class="dg-sub">Extra tools for your business.</p>
    </div>

    <!-- Grid -->
    <div class="dg-grid">
      <button v-for="t in tiles" :key="t.title" class="dg-card" @click="open(t)">
        <span class="dg-medal"><img :src="t.img" :alt="t.title" loading="lazy" referrerpolicy="no-referrer" /></span>
        <span class="dg-name">
          {{ t.title }}
          <span v-if="t.isNew" class="dg-new">NEW</span>
          <svg class="dg-go" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { info } = useToast()

const PIC = import.meta.glob('../assets/1000880*.png', { eager: true, import: 'default' })
const pic = (n) => PIC[`../assets/1000880${n}.png`]

const tiles = [
  { title: 'Wallet Funding', route: '/tools/wallet-funding', img: pic('301') },
  { title: 'SMS Sender', route: '/tools/sms-sender', img: pic('302') },
  { title: 'SMS Verification', route: '/tools/sms-verification', img: pic('303') },
  { title: 'eSIM', route: '/tools/esim', img: pic('304') },
  { title: 'Buy Account', route: '/tools/buy-account', isNew: true, img: pic('305') },
  { title: 'Account Verification', route: '/tools/account-verification', img: pic('306') },
]

function open(t) {
  if (t.route) router.push(t.route)
  else info(`${t.title} coming soon`, 'This tool is not available yet — check back shortly.')
}
</script>

<style scoped>
.dg { display: flex; flex-direction: column; gap: 18px; }

/* Header */
.dg-head { display: flex; flex-direction: column; gap: 6px; }
.dg-title {
  display: flex; align-items: center; gap: 10px; margin: 0;
  font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em;
}
.dg-badge {
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.05em;
  color: #16a34a; background: rgba(22,163,74,0.1);
  border: 1px solid rgba(22,163,74,0.35); padding: 3px 10px; border-radius: 999px;
}
.dg-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

/* Grid */
.dg-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

.dg-card {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  padding: 18px; border-radius: 18px; cursor: pointer; text-align: left; font-family: inherit;
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.03) 40%, transparent 64%),
    var(--surface-1);
  border: 1px solid var(--border); 
  transition: border-color 0.2s ease, transform 0.16s ease;
}
.dg-card:hover { border-color: var(--accent-border); transform: translateY(-3px); }

:root:not([data-theme="light"]) .dg-card {
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.26) 0%, rgba(34,197,94,0.08) 42%, transparent 66%),
    var(--surface-1);
}

.dg-medal {
  width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0; overflow: hidden;
  background: #0b0f0e; 
  display: flex; align-items: center; justify-content: center;
}
.dg-medal img { width: 100%; height: 100%; object-fit: cover; display: block; }

.dg-name {
  display: inline-flex; align-items: center; gap: 7px; flex-wrap: wrap;
  font-size: 0.9rem; font-weight: 700; color: var(--t1); line-height: 1.3;
}
.dg-new {
  font-size: 0.56rem; font-weight: 800; letter-spacing: 0.03em; color: #fff;
  background: #ef4444; padding: 2px 6px; border-radius: 999px;
}
.dg-go { color: var(--t4); opacity: 0; transform: translateX(-4px); transition: opacity 0.18s ease, transform 0.18s ease, color 0.18s ease; }
.dg-card:hover .dg-go { opacity: 1; transform: translateX(0); color: var(--accent); }

@media (max-width: 1100px) { .dg-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 760px) { .dg-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 420px) { .dg-grid { grid-template-columns: 1fr; } }
</style>
