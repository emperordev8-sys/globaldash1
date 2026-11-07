<!-- src/views/WebsiteCreatorView.vue -->
<template>
  <div class="wc">

    <!-- Header -->
    <div class="wc-head">
      <div class="wc-head__text">
        <h1 class="wc-head__title">Website Creator</h1>
        <p class="wc-head__sub">Launch and manage the sites you offer your own customers.</p>
      </div>
      <div class="wc-head__actions">
        <button class="wc-btn" @click="soon('Buy Domain')">
          <span class="wc-btn__ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          Buy Domain
        </button>
        <button class="wc-btn" @click="soon('Buy Webmail')">
          <span class="wc-btn__ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>
            </svg>
          </span>
          Buy Webmail
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="wc-stats">
      <div class="wc-stat">
        <span class="wc-stat__val">12</span>
        <span class="wc-stat__lbl">Total sites</span>
      </div>
      <div class="wc-stat">
        <span class="wc-stat__val wc-stat__val--green">1</span>
        <span class="wc-stat__lbl">Live sites</span>
      </div>
      <div class="wc-stat">
        <span class="wc-stat__val wc-stat__val--amber">11</span>
        <span class="wc-stat__lbl">Pending setup</span>
      </div>
    </div>

    <!-- Cards grid -->
    <div class="wc-grid">
      <button v-for="tile in tiles" :key="tile.title" class="wc-card" @click="open(tile)">
        <span class="wc-card__badge">{{ tile.badge }}</span>

        <span class="wc-card__medal" :style="{ background: tile.grad, boxShadow: '0 8px 18px ' + tile.glow }">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9"
            stroke-linecap="round" stroke-linejoin="round" v-html="tile.icon" />
        </span>

        <span class="wc-card__name">
          {{ tile.title }}
          <span v-if="tile.isNew" class="wc-card__new">NEW</span>
          <svg class="wc-card__lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </span>

        <span class="wc-card__upgrade">UPGRADE</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { info } = useToast()

const G = {
  broker:   '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  bank:     '<line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5 6 12 3 19 6"/><line x1="4" y1="10" x2="4" y2="21"/><line x1="20" y1="10" x2="20" y2="21"/>',
  gift:     '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  chart:    '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  star:     '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  cart:     '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  widgets:  '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
  file:     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  pin:      '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  wallet:   '<path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><path d="M16 14h.01"/>',
}
const COL = {
  green:  { grad: 'linear-gradient(145deg,#22c55e,#0f7a39)', glow: 'rgba(22,163,74,0.4)' },
  blue:   { grad: 'linear-gradient(145deg,#3b82f6,#1e40af)', glow: 'rgba(37,99,235,0.4)' },
  purple: { grad: 'linear-gradient(145deg,#a855f7,#6d28d9)', glow: 'rgba(124,58,237,0.4)' },
  orange: { grad: 'linear-gradient(145deg,#fb923c,#ea580c)', glow: 'rgba(234,88,12,0.4)' },
  pink:   { grad: 'linear-gradient(145deg,#ec4899,#be185d)', glow: 'rgba(219,39,119,0.4)' },
  teal:   { grad: 'linear-gradient(145deg,#2dd4bf,#0d9488)', glow: 'rgba(13,148,136,0.4)' },
}

const tiles = [
  { title: 'Broker',                badge: 'POPULAR', route: '/broker',                     icon: G.broker,   ...COL.green  },
  { title: 'Online Banking',        badge: 'POPULAR', route: '/online-banking',             icon: G.bank,     ...COL.blue   },
  { title: 'Tesla Giveaway',        badge: 'READY',   route: '/tesla-giveaway',             icon: G.gift,     ...COL.pink   },
  { title: 'Tesla Investment',      badge: 'NEW',     route: '/tesla-investment',           icon: G.chart,    ...COL.purple },
  { title: 'Celebrity',             badge: 'NEW',     route: '/celebrity',                   icon: G.star,     ...COL.orange },
  { title: 'Ecommerce Site',        badge: 'NEW',     route: '/ecommerce',                   icon: G.cart,     ...COL.teal   },
  { title: 'Website Widgets',       badge: 'NEW', isNew: true, route: '/website-widgets',    icon: G.widgets,  ...COL.blue   },
  { title: 'Support Pages',         badge: 'READY',   route: '/support-pages',               icon: G.file,     ...COL.green  },
  { title: 'Tracking Pages',        badge: 'READY',   route: '/tracking-pages',             icon: G.pin,      ...COL.orange },
  { title: 'Transactions Trackers', badge: 'READY',   route: '/tools/transactions-tracker',  icon: G.activity, ...COL.purple },
  { title: 'Wallets',               badge: 'NEW',     route: '/wallets',                     icon: G.wallet,   ...COL.green  },
]

function open(tile) {
  if (tile.route) router.push(tile.route)
  else router.push('/billing')
}
function soon(name) {
  info(`${name} coming soon`, 'This option is not available yet — check back shortly.')
}
</script>

<style scoped>
.wc { display: flex; flex-direction: column; gap: 18px; }

/* Header */
.wc-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.wc-head__text { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.wc-head__title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.wc-head__sub   { margin: 0; font-size: 0.86rem; color: var(--t2); font-weight: 500; }
.wc-head__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* Green shine buttons */
.wc-btn {
  position: relative; overflow: hidden; isolation: isolate;
  display: inline-flex; align-items: center; gap: 8px;
  height: 42px; padding: 0 18px; border-radius: 11px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%);
  color: #fff; border: none; cursor: pointer;
  font-family: inherit; font-size: 0.84rem; font-weight: 700;
  box-shadow: 0 7px 18px rgba(22,163,74,0.34), inset 0 1px 0 rgba(255,255,255,0.28);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.wc-btn:hover  { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(22,163,74,0.44); }
.wc-btn:active { transform: translateY(0); }
.wc-btn__ico {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 8px;
  background: rgba(0,0,0,0.18);
}
.wc-btn::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -75%;
  width: 45%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.18) 65%, transparent 100%);
  transform: skewX(-22deg); pointer-events: none; z-index: 2;
  animation: wc-shine 2.4s ease-in-out infinite;
}
.wc-head__actions .wc-btn:nth-child(2)::after { animation-delay: 0.3s; }
@keyframes wc-shine { 0% { left: -75%; } 40% { left: 125%; } 100% { left: 125%; } }
@media (prefers-reduced-motion: reduce) { .wc-btn::after { animation: none; display: none; } }

/* Stats */
.wc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.wc-stat {
  background: var(--bg); border: 1px solid var(--t4); border-radius: 14px;
  padding: 16px 20px; display: flex; flex-direction: column; gap: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.wc-stat__val { font-size: 1.7rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; line-height: 1.1; }
.wc-stat__val--green { color: #16a34a; }
.wc-stat__val--amber { color: #f59e0b; }
.wc-stat__lbl { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--t3); }

/* Cards grid */
.wc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

.wc-card {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  background: var(--surface-1); border: 1px solid var(--border); border-radius: 18px;
  padding: 18px; cursor: pointer; text-align: left; font-family: inherit;
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s ease, transform 0.16s ease, box-shadow 0.2s ease;
}
.wc-card:hover { border-color: var(--accent-border); transform: translateY(-3px); box-shadow: 0 14px 30px rgba(0,0,0,0.10); }

.wc-card__badge {
  align-self: flex-start;
  font-size: 0.62rem; font-weight: 800; letter-spacing: 0.05em;
  color: #16a34a; background: rgba(22,163,74,0.1);
  border: 1px solid rgba(22,163,74,0.3);
  padding: 3px 10px; border-radius: 999px;
}

.wc-card__medal {
  width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
}

.wc-card__name {
  display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
  font-size: 0.92rem; font-weight: 700; color: var(--t1);
}
.wc-card__new {
  font-size: 0.56rem; font-weight: 800; color: #fff;
  background: #ef4444; padding: 2px 6px; border-radius: 999px; letter-spacing: 0.03em;
}
.wc-card__lock { color: var(--t3); opacity: 0.75; flex-shrink: 0; }

.wc-card__upgrade {
  margin-top: 2px;
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.08em;
  color: var(--t3);
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  padding: 6px 12px; border-radius: 8px;
  transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}
.wc-card:hover .wc-card__upgrade {
  color: #16a34a; background: rgba(22,163,74,0.08); border-color: rgba(22,163,74,0.35);
}

/* Responsive */
@media (max-width: 1100px) { .wc-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 760px)  { .wc-grid { grid-template-columns: repeat(2, 1fr); } .wc-stats { grid-template-columns: 1fr; } }
@media (max-width: 560px)  {
  .wc-head { flex-direction: column; align-items: stretch; }
  .wc-head__actions { display: grid; grid-template-columns: 1fr 1fr; }
}
@media (max-width: 400px)  { .wc-grid { grid-template-columns: 1fr; } }
</style>
