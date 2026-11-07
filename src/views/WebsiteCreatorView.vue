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

        <span class="wc-card__icon">
          <img :src="tile.img" :alt="tile.title" loading="lazy" referrerpolicy="no-referrer" />
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

const P = '?auto=format&fit=crop&w=160&h=160&q=70'
const img = (id) => `https://images.unsplash.com/${id}${P}`

const tiles = [
  { title: 'Broker',                badge: 'POPULAR', route: '/broker',                       img: img('photo-1611974789855-9c2a0a7236a3') },
  { title: 'Online Banking',        badge: 'POPULAR', route: '/online-banking',               img: img('photo-1554469384-e58fac16e23a') },
  { title: 'Tesla Giveaway',        badge: 'READY',  route: '/tesla-giveaway',               img: img('photo-1549465220-1a8b9238cd48') },
  { title: 'Tesla Investment',      badge: 'NEW',    route: '/tesla-investment',             img: img('photo-1633158829875-e5316a358c6f') },
  { title: 'Celebrity',             badge: 'NEW',    route: '/celebrity',                     img: img('photo-1614080035039-af24354a6478') },
  { title: 'Ecommerce Site',        badge: 'NEW',    route: '/ecommerce',                     img: img('photo-1664455340023-214c33a9d0bd') },
  { title: 'Website Widgets',       badge: 'NEW', isNew: true, route: '/website-widgets',     img: img('photo-1551288049-bebda4e38f71') },
  { title: 'Support Pages',         badge: 'READY',  route: '/support-pages',                 img: img('photo-1553775282-20af80779df7') },
  { title: 'Tracking Pages',        badge: 'READY',  route: '/tracking-pages',                img: img('photo-1619468129361-605ebea04b44') },
  { title: 'Transactions Trackers', badge: 'READY',  route: '/tools/transactions-tracker',    img: img('photo-1628348068343-c6a848d2b6dd') },
  { title: 'Wallets',               badge: 'NEW',    route: '/wallets',                       img: img('photo-1483478550801-ceba5fe50e8e') },
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
  background: var(--bg); border: 1px solid var(--t4); border-radius: 16px;
  padding: 16px; cursor: pointer; text-align: left; font-family: inherit;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: border-color 0.2s ease, transform 0.16s ease, box-shadow 0.2s ease;
}
.wc-card:hover { border-color: rgba(22,163,74,0.4); transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,0.08); }

.wc-card__badge {
  align-self: flex-start;
  font-size: 0.62rem; font-weight: 800; letter-spacing: 0.05em;
  color: #16a34a; background: rgba(22,163,74,0.1);
  border: 1px solid rgba(22,163,74,0.3);
  padding: 3px 10px; border-radius: 999px;
}

.wc-card__icon {
  width: 46px; height: 46px; border-radius: 12px; overflow: hidden;
  background: var(--glass-hover); flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
}
.wc-card__icon img { width: 100%; height: 100%; object-fit: cover; display: block; }

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
