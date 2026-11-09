<!-- src/views/DashboardView.vue -->
<template>
  <div class="dash">
    <CommunityModal />

    <!-- ════════════════════════════════════
         TOOLBAR
         ════════════════════════════════════ -->
    <div class="dash-toolbar" :class="{ 'cascade-play': cascadeReady }">
      <div class="dash-head">
        <h1 class="dash-head__title">Dashboard</h1>
        <p class="dash-head__sub">At-a-glance view of your account, subscription, and recent activity.</p>
      </div>
      <div class="dash-toolbar__actions" data-tour="header-actions">
        <button class="dtb-btn dtb-btn--green" @click="router.push('/tutorials')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
          </svg>
          Watch to learn
        </button>
        <button class="dtb-btn dtb-btn--ghost" @click="router.push('/billing')">Choose plan</button>
        <button class="dtb-btn dtb-btn--green" @click="router.push('/wallet')">Top up wallet</button>
      </div>
    </div>

    <!-- ════════════════════════════════════
         STAT CARDS
         ════════════════════════════════════ -->
    <div class="dash-stats" data-tour="stats">
      <div v-for="(s, i) in stats" :key="s.label" class="stat-card" :class="{ 'cascade-play': cascadeReady, 'stat-card--hero': i === 0 }">
        <div class="stat-card__top">
          <span class="stat-card__lbl">{{ s.label }}</span>
          <span class="stat-card__ico">
            <svg v-if="s.icon === 'wallet'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><path d="M16 14h.01"/>
            </svg>
            <svg v-else-if="s.icon === 'card'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M14.5 8.5h-3.25a1.75 1.75 0 0 0 0 3.5h1.5a1.75 1.75 0 0 1 0 3.5H9.5"/><line x1="12" y1="6.5" x2="12" y2="17.5"/>
            </svg>
          </span>
        </div>
        <span class="stat-card__val">{{ s.value }}</span>
      </div>
    </div>

    <!-- ════════════════════════════════════
         QUICK ACTIONS
         ════════════════════════════════════ -->
    <div class="quick-actions" :class="{ 'cascade-play': cascadeReady }" data-tour="quick-actions">
      <h2 class="qa-heading">Quick actions</h2>

      <div v-for="group in quickGroups" :key="group.label" class="qa-group">
        <span class="qa-group__label">{{ group.label }}</span>
        <div class="qa-grid">
          <button
            v-for="tile in group.tiles"
            :key="tile.title"
            class="qa-tile"
            @click="openAction(tile)"
          >
            <span class="qa-tile__medal" :class="{ 'qa-tile__medal--img': tile.img }"
              :style="tile.img ? {} : { background: group.grad, boxShadow: '0 8px 18px ' + group.glow }">
              <img v-if="tile.img" :src="tile.img" :alt="tile.title" class="qa-tile__pic" />
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#fff" stroke-width="1.9"
                stroke-linecap="round" stroke-linejoin="round"
                v-html="tile.icon" />
            </span>
            <span class="qa-tile__title">
              {{ tile.title }}
              <span v-if="tile.isNew" class="qa-tile__badge">NEW</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════
         RECENT ACTIVITY (empty states)
         ════════════════════════════════════ -->
    <div class="dash-recent" :class="{ 'cascade-play': cascadeReady }" data-tour="recent">
      <div class="recent-card">
        <div class="recent-card__hdr">
          <span class="recent-card__title">Recent wallet transactions</span>
          <button class="recent-card__link" @click="router.push('/wallet')">
            See all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
        <div class="recent-empty">
          <div class="recent-empty__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><path d="M16 14h.01"/>
            </svg>
          </div>
          <p class="recent-empty__title">No transactions yet</p>
          <p class="recent-empty__sub">Top up your wallet to see activity here.</p>
        </div>
      </div>

      <div class="recent-card">
        <div class="recent-card__hdr">
          <span class="recent-card__title">Recent payments</span>
          <button class="recent-card__link" @click="router.push('/transactions')">
            See all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
        <div class="recent-empty">
          <div class="recent-empty__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/>
            </svg>
          </div>
          <p class="recent-empty__title">No payments yet</p>
          <p class="recent-empty__sub">Choose a plan or fund your wallet.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'
import { useBootSplash } from '../composables/useBootSplash.js'
import { useTour } from '../composables/useTour.js'
import CommunityModal from '../components/ui/CommunityModal.vue'

const router = useRouter()
const { success } = useToast()

/* ── Cascade entrance: wait for the boot splash to actually start
     revealing the page before playing the card fade-up, so the
     animation is visible instead of finishing hidden behind it ── */
const { booting } = useBootSplash()
const cascadeReady = ref(!booting.value)
watch(booting, (isBooting) => {
  if (!isBooting) cascadeReady.value = true
})

/* ── Auto-run the product tour once, for first-time visitors ── */
const { start: startTour } = useTour()
const TOUR_KEY = 'globalgle_tour_seen'
onMounted(() => {
  let seen = false
  try { seen = localStorage.getItem(TOUR_KEY) === '1' } catch (_) { /* ignore */ }
  if (seen) return
  try { localStorage.setItem(TOUR_KEY, '1') } catch (_) { /* ignore */ }
  // wait for the boot splash + entrance to settle, then greet the user
  const begin = () => setTimeout(() => startTour(), 1100)
  if (booting.value) {
    const unwatch = watch(booting, (b) => { if (!b) { unwatch(); begin() } })
  } else {
    begin()
  }
})

/* ── Stat cards ── */
const stats = [
  { label: 'Wallet balance',  value: '₦0.00', icon: 'wallet'  },
  { label: 'Active plan',     value: 'None',  icon: 'card'    },
  { label: 'Recent payments', value: '0',     icon: 'receipt' },
]

/* ── Quick actions ── */
const ICO = {
  domain:   '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  mail:     '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  broker:   '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  bank:     '<line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5 6 12 3 19 6"/><line x1="4" y1="10" x2="4" y2="21"/><line x1="20" y1="10" x2="20" y2="21"/><line x1="8" y1="14" x2="8" y2="17"/><line x1="12" y1="14" x2="12" y2="17"/><line x1="16" y1="14" x2="16" y2="17"/>',
  gift:     '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  chart:    '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  star:     '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  cart:     '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  widgets:  '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
  file:     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  pin:      '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  wallet:   '<path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><path d="M16 14h.01"/>',
  coins:    '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/>',
  sms:      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  smsCheck: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><polyline points="8 10 11 13 16 8"/>',
  sim:      '<path d="M19 21H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l6 6v10a2 2 0 0 1-2 2z"/><rect x="9" y="13" width="6" height="5" rx="1"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>',
  userChk:  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>',
  phone:    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mic:      '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>',
  receipt:  '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/>',
}

/* 4D icon images (user-supplied in src/assets) */
import tileSupportPages from '../assets/tile-support-pages.png'
import tileTransactionsTrackers from '../assets/tile-transactions-trackers.png'
import tileWebsiteWidgets from '../assets/tile-website-widgets.png'
const PIC = import.meta.glob('../assets/1000880*.png', { eager: true, import: 'default' })
const pic = (n) => PIC[`../assets/1000880${n}.png`]

const quickGroups = [
  {
    label: 'Website Creator',
    grad: 'linear-gradient(145deg,#22c55e,#0f7a39)', glow: 'rgba(22,163,74,0.4)',
    tiles: [
      { title: 'Buy Domain',            icon: ICO.domain,  img: pic('289')          },
      { title: 'Buy Webmail',           icon: ICO.mail,    img: pic('311')          },
      { title: 'Broker',                icon: ICO.broker,  route: '/broker',        img: pic('290') },
      { title: 'Online Banking',        icon: ICO.bank,    route: '/online-banking', img: pic('291') },
      { title: 'Tesla Giveaway',        icon: ICO.gift,    img: pic('294')          },
      { title: 'Tesla Investment',      icon: ICO.chart,   img: pic('293')          },
      { title: 'Celebrity',             icon: ICO.star,    img: pic('292')          },
      { title: 'Ecommerce Site',        icon: ICO.cart,    img: pic('295')          },
      { title: 'Website Widgets',       icon: ICO.widgets, isNew: true, img: tileWebsiteWidgets },
      { title: 'Support Pages',         icon: ICO.file,    route: '/support-pages',  img: tileSupportPages },
      { title: 'Tracking Pages',        icon: ICO.pin,     route: '/tracking-pages', img: pic('299') },
      { title: 'Transactions Trackers', icon: ICO.activity, route: '/tools/transactions-tracker', img: tileTransactionsTrackers },
      { title: 'Wallets',               icon: ICO.wallet,  route: '/wallet',        img: pic('300') },
    ],
  },
  {
    label: 'Digital Tools',
    grad: 'linear-gradient(145deg,#3b82f6,#1e40af)', glow: 'rgba(37,99,235,0.4)',
    tiles: [
      { title: 'Wallet Funding',        icon: ICO.coins,    route: '/tools/wallet-funding', img: pic('301') },
      { title: 'SMS Sender',            icon: ICO.sms,      route: '/tools/sms-sender',     img: pic('302') },
      { title: 'SMS Verification',      icon: ICO.smsCheck, img: pic('303')         },
      { title: 'eSIM',                  icon: ICO.sim,      img: pic('304')         },
      { title: 'Buy Account',           icon: ICO.userPlus, isNew: true, img: pic('305') },
      { title: 'Account Verification',  icon: ICO.userChk,  img: pic('306')         },
    ],
  },
  {
    label: 'Call Tools',
    grad: 'linear-gradient(145deg,#a855f7,#6d28d9)', glow: 'rgba(124,58,237,0.4)',
    tiles: [
      { title: 'Custom Caller',         icon: ICO.phone,    route: '/tools/spoof-calling', img: pic('307') },
      { title: 'Voice Notes',           icon: ICO.mic,      isNew: true, img: pic('308') },
    ],
  },
  {
    label: 'Mailing Tools',
    grad: 'linear-gradient(145deg,#fb923c,#ea580c)', glow: 'rgba(234,88,12,0.4)',
    tiles: [
      { title: 'Crypto Mails',          icon: ICO.mail,     route: '/email-services/branded-emails', img: pic('310') },
      { title: 'Crypto Bills Mails',    icon: ICO.mail,     route: '/email-services/branded-bills',  img: pic('309') },
      { title: 'Bank Mailer',           icon: ICO.mail,     route: '/email-services/bank-mailer',    img: pic('312') },
    ],
  },
  {
    label: 'Generator Tools',
    grad: 'linear-gradient(145deg,#ec4899,#be185d)', glow: 'rgba(219,39,119,0.4)',
    tiles: [
      { title: 'Crypto Receipts',       icon: ICO.receipt,  route: '/tools/crypto-receipts', img: pic('314') },
      { title: 'Bank Receipt',          icon: ICO.receipt,  route: '/tools/bank-receipt',    img: pic('313') },
      { title: 'Store Receipt',         icon: ICO.receipt,  img: pic('315')         },
    ],
  },
]

function openAction(tile) {
  if (tile.route) router.push(tile.route)
  else success(`${tile.title} coming soon`, 'This tool is not available yet — check back shortly.')
}
</script>

<style scoped>
.dash { display: flex; flex-direction: column; gap: 18px; }

/* ══════════════════════════════════
   ENTRANCE — cascading fade-up
   ══════════════════════════════════ */
@keyframes dashFadeUp {
  from { opacity: 0; transform: translateY(26px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.dash-toolbar,
.dash-stats .stat-card,
.quick-actions,
.dash-recent {
  opacity: 0;
}

.dash-toolbar.cascade-play,
.dash-stats .stat-card.cascade-play,
.quick-actions.cascade-play,
.dash-recent.cascade-play {
  animation: dashFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.dash-toolbar.cascade-play                       { animation-delay: 0.05s; }
.dash-stats .stat-card.cascade-play:nth-child(1) { animation-delay: 0.12s; }
.dash-stats .stat-card.cascade-play:nth-child(2) { animation-delay: 0.20s; }
.dash-stats .stat-card.cascade-play:nth-child(3) { animation-delay: 0.28s; }
.quick-actions.cascade-play                      { animation-delay: 0.36s; }
.dash-recent.cascade-play                        { animation-delay: 0.46s; }

@media (prefers-reduced-motion: reduce) {
  .dash-toolbar,
  .dash-stats .stat-card,
  .quick-actions,
  .dash-recent {
    opacity: 1;
    animation: none;
  }
}

/* ══════════════════════════════════
   TOOLBAR
   ══════════════════════════════════ */
.dash-toolbar {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
}

.dash-head { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.dash-head__title {
  margin: 0;
  font-size: 1.55rem; font-weight: 700; color: var(--t1);
  letter-spacing: -0.02em; line-height: 1.2;
}
.dash-head__sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

.dash-toolbar__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.dtb-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  height: 40px; padding: 0 18px; border-radius: 10px;
  font-family: inherit; font-size: 0.8rem; font-weight: 700;
  cursor: pointer; white-space: nowrap;
  transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  position: relative; overflow: hidden; isolation: isolate;
}
.dtb-btn:active { transform: scale(0.97); }

/* Glass shine — a white light sweeps across every ~2.4s */
.dtb-btn::after {
  content: '';
  position: absolute; top: 0; bottom: 0; left: -75%;
  width: 45%;
  background: linear-gradient(100deg,
    transparent 0%,
    rgba(255,255,255,0.15) 35%,
    rgba(255,255,255,0.65) 50%,
    rgba(255,255,255,0.15) 65%,
    transparent 100%);
  transform: skewX(-22deg);
  pointer-events: none;
  z-index: 3;
  animation: dtb-shine 2.4s ease-in-out infinite;
}
.dtb-btn--ghost::after {
  /* darker glint so it reads on the light button */
  background: linear-gradient(100deg,
    transparent 0%,
    rgba(120,120,120,0.10) 45%,
    rgba(120,120,120,0.22) 50%,
    rgba(120,120,120,0.10) 55%,
    transparent 100%);
}
.dash-toolbar__actions .dtb-btn:nth-child(2)::after { animation-delay: 0.25s; }
.dash-toolbar__actions .dtb-btn:nth-child(3)::after { animation-delay: 0.5s; }

@keyframes dtb-shine {
  0%   { left: -75%; }
  40%  { left: 125%; }
  100% { left: 125%; }   /* rest between sweeps */
}

@media (prefers-reduced-motion: reduce) {
  .dtb-btn::after { animation: none; display: none; }
}

.dtb-btn--green {
  background: #16a34a; color: #fff;
  border: 1px solid #15803d;
  box-shadow: 0 6px 16px rgba(22,163,74,0.28);
}
.dtb-btn--green:hover { background: #15803d; box-shadow: 0 8px 20px rgba(22,163,74,0.34); }

.dtb-btn--ghost {
  background: var(--glass-hover); color: var(--t2);
  border: 1px solid var(--border);
  font-weight: 600;
}
.dtb-btn--ghost:hover { color: var(--t1); background: var(--glass); }

/* ══════════════════════════════════
   STAT CARDS
   ══════════════════════════════════ */
/* Bento stat row: wallet-balance hero + two side cards */
.dash-stats { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 16px; align-items: stretch; }

.stat-card {
  background:
    radial-gradient(80% 120% at 0% 100%, rgba(34,197,94,0.1) 0%, transparent 58%),
    var(--surface-1);
  border: 1px solid var(--border); border-radius: 20px;
  padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 16px;
  box-shadow: var(--shadow-card);
  min-height: 132px; justify-content: space-between;
}

/* Hero (Wallet balance) — premium green feature card */
.stat-card--hero {
  background: linear-gradient(145deg, #22c55e 0%, #16a34a 55%, #0f7a39 100%);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 14px 34px rgba(22,163,74,0.32);
  position: relative; overflow: hidden;
}
.stat-card--hero::after {
  content: ''; position: absolute; top: -45%; right: -12%;
  width: 240px; height: 240px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  pointer-events: none;
}
.stat-card--hero .stat-card__lbl { color: rgba(255,255,255,0.88); }
.stat-card--hero .stat-card__val { color: #fff; font-size: 2.3rem; }
.stat-card--hero .stat-card__ico {
  background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: #fff;
}

.stat-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.stat-card__lbl { font-size: 0.82rem; font-weight: 600; color: var(--t3); }
.stat-card__ico {
  width: 30px; height: 30px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 9px;
  background: rgba(22,163,74,0.12);
  border: 1px solid rgba(22,163,74,0.25);
  color: #16a34a;
}
.stat-card__val { font-size: 1.5rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; line-height: 1.1; }

/* ══════════════════════════════════
   QUICK ACTIONS
   ══════════════════════════════════ */
.quick-actions { display: flex; flex-direction: column; gap: 22px; margin-top: 4px; }
.qa-heading { margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--t1); }

.qa-group { display: flex; flex-direction: column; gap: 12px; }
.qa-group__label {
  font-size: 0.68rem; font-weight: 700; color: var(--t3);
  text-transform: uppercase; letter-spacing: 0.08em;
}

.qa-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

.qa-tile {
  position: relative;
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px; border-radius: 18px;
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.03) 38%, transparent 62%),
    var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  cursor: pointer; text-align: left;
  font-family: inherit;
  transition: border-color 0.2s ease, transform 0.16s ease, box-shadow 0.2s ease;
}
.qa-tile:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(0,0,0,0.10);
}
.qa-tile:active { transform: translateY(-1px); }

/* Stronger green glow on dark mode (low-opacity green is invisible on a dark card) */
:root:not([data-theme="light"]) .qa-tile {
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.26) 0%, rgba(34,197,94,0.08) 40%, transparent 64%),
    var(--surface-1);
}
:root:not([data-theme="light"]) .stat-card {
  background:
    radial-gradient(80% 120% at 0% 100%, rgba(34,197,94,0.24) 0%, transparent 60%),
    var(--surface-1);
}
:root:not([data-theme="light"]) .recent-card {
  background:
    radial-gradient(55% 90% at 0% 100%, rgba(34,197,94,0.18) 0%, transparent 58%),
    var(--surface-1);
}

.qa-tile__medal {
  width: 46px; height: 46px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 14px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
}
/* 4D image icon — dark app-tile look, image fills the medallion */
.qa-tile__medal--img {
  background: #0b0f0e;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.qa-tile__pic { width: 100%; height: 100%; object-fit: cover; display: block; }

.qa-tile__title {
  flex: 1; min-width: 0;
  display: inline-flex; align-items: center; gap: 7px; flex-wrap: wrap;
  font-size: 0.88rem; font-weight: 700; color: var(--t1); line-height: 1.3;
}
.qa-tile__badge {
  font-size: 0.56rem; font-weight: 800; letter-spacing: 0.04em;
  color: #fff; background: #ef4444;
  padding: 2px 6px; border-radius: 999px; line-height: 1;
}

/* ══════════════════════════════════
   RECENT ACTIVITY (empty states)
   ══════════════════════════════════ */
.dash-recent { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 4px; }

.recent-card {
  background:
    radial-gradient(55% 90% at 0% 100%, rgba(34,197,94,0.08) 0%, transparent 55%),
    var(--surface-1);
  border: 1px solid var(--border); border-radius: 20px;
  box-shadow: var(--shadow-card);
  display: flex; flex-direction: column;
}
.recent-card__hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px; border-bottom: 1px solid var(--border-soft);
}
.recent-card__title { font-size: 0.86rem; font-weight: 700; color: var(--t1); }
.recent-card__link {
  display: inline-flex; align-items: center; gap: 5px;
  background: none; border: none; cursor: pointer;
  font-family: inherit; font-size: 0.78rem; font-weight: 600; color: var(--t2);
  transition: color 0.18s ease;
}
.recent-card__link:hover { color: #16a34a; }

.recent-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; text-align: center;
  padding: 40px 20px; min-height: 180px;
}
.recent-empty__icon {
  width: 48px; height: 48px; margin-bottom: 4px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 14px;
  background: var(--glass-hover); color: var(--t3);
}
.recent-empty__title { margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--t1); }
.recent-empty__sub { margin: 0; font-size: 0.8rem; color: var(--t3); font-weight: 500; }

/* ══════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════ */
@media (max-width: 1100px) {
  .qa-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 1024px) {
  .dash-stats { grid-template-columns: 1fr 1fr; }
  .stat-card--hero { grid-column: 1 / -1; }
}
@media (max-width: 760px) {
  .qa-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-recent { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .dash-toolbar { flex-direction: column; align-items: stretch; }
  .dash-toolbar__actions { display: grid; grid-template-columns: 1fr 1fr; }
  .dash-toolbar__actions .dtb-btn:first-child { grid-column: 1 / -1; }

  /* Stat cards become a swipeable slider on mobile */
  .dash-stats {
    display: flex;
    grid-template-columns: unset;
    gap: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
    scrollbar-width: none;
  }
  .dash-stats::-webkit-scrollbar { display: none; }

  .dash-stats .stat-card {
    flex: 0 0 82%;
    scroll-snap-align: start;
  }
}
@media (max-width: 420px) {
  .qa-grid { grid-template-columns: 1fr; }
}
</style>
