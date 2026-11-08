<!-- src/components/layout/AppNavbar.vue -->
<template>

  <!-- ═══════════════════════════════════
       DESKTOP NAVBAR  (hidden on mobile)
       ═══════════════════════════════════ -->
  <header class="navbar desktop-nav" :class="{ 'navbar--collapsed': !desktopOpen }">

    <!-- Left: Breadcrumb -->
    <div class="navbar__left">
      <button v-if="!desktopOpen" class="navbar__sidebar-toggle" @click="toggleDesktopSidebar" aria-label="Open sidebar">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="13 17 18 12 13 7"/>
          <polyline points="6 17 11 12 6 7"/>
        </svg>
      </button>
      <!-- Join Channel (Telegram) -->
      <a href="https://t.me/globalgle" target="_blank" rel="noopener noreferrer" class="navbar__join" data-tour="join">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#fff"/>
          <path d="M17.6 7.2 5.9 11.7c-.8.3-.8.8-.1 1l3 .9 1.1 3.5c.1.4.3.5.6.5.3 0 .4-.1.6-.3l1.5-1.4 3 2.2c.6.3 1 .2 1.1-.5l2-9.4c.2-.8-.3-1.2-1.1-.9Zm-2.1 2.4-5.4 4.9-.2 2.3-.9-3 6.2-3.9c.3-.2.5 0 .3-.3Z" fill="#0b86c9"/>
        </svg>
        Join Channel
      </a>
    </div>

    <!-- Right: search, support, theme, currency, balance, profile -->
    <div class="navbar__right">

      <!-- Search -->
      <div class="navbar__search" ref="searchRef" data-tour="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="navbar__search-input"
          aria-label="Search pages"
          @focus="searchOpen = true"
          @keydown.enter.prevent="searchResults[0] && goTo(searchResults[0].path)"
          @keydown.esc="searchOpen = false"
        />
        <Transition name="profile-chip-drop">
          <div v-if="searchOpen && searchQuery.trim()" class="navbar__search-dropdown" @click.stop>
            <button
              v-for="r in searchResults" :key="r.path"
              class="npd-item" @click="goTo(r.path)">
              <span class="npd-label">{{ r.title }}</span>
            </button>
            <p v-if="searchResults.length === 0" class="navbar__search-empty">No results</p>
          </div>
        </Transition>
      </div>

      <!-- Support -->
      <button class="navbar__text-btn" @click="goTo('/help')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
        Support
      </button>

      <!-- Theme toggle (dropdown: Light / Dark / Auto) -->
      <div class="navbar__icon-btn navbar__theme" ref="themeRef" @click.stop="themeOpen = !themeOpen"
        :aria-label="'Appearance: ' + themePref" role="button">
        <svg v-if="theme !== 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>

        <Transition name="profile-chip-drop">
          <div v-if="themeOpen" class="navbar__theme-dropdown" @click.stop>
            <span class="navbar__theme-label">Appearance</span>
            <button
              v-for="opt in themeOptions" :key="opt.value"
              class="theme-opt" :class="{ 'theme-opt--active': themePref === opt.value }"
              @click="setThemePref(opt.value); themeOpen = false">
              <span class="theme-opt__ico" v-html="opt.icon" />
              <span class="theme-opt__label">{{ opt.label }}</span>
              <svg v-if="themePref === opt.value" class="theme-opt__check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Currency selector -->
      <div class="navbar__pill navbar__pill--currency" ref="currencyRef" @click.stop="currencyOpen = !currencyOpen">
        <span>{{ currency }}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round" :class="{ 'navbar__chev--open': currencyOpen }" class="navbar__chev">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        <Transition name="profile-chip-drop">
          <div v-if="currencyOpen" class="navbar__currency-dropdown" @click.stop>
            <button
              v-for="c in currencies" :key="c.code"
              class="npd-item" :class="{ 'npd-item--active': c.code === currency }"
              @click="currency = c.code; currencyOpen = false">
              <span class="npd-label">{{ c.code }}</span>
              <span class="navbar__currency-sym">{{ c.symbol }}</span>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Wallet balance -->
      <button class="navbar__pill navbar__pill--balance" @click="goTo('/wallet')" aria-label="Open wallet" data-tour="wallet">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 7H5a2 2 0 0 1 0-4h13v4"/>
          <path d="M3 5v14a2 2 0 0 0 2 2h15V7"/>
          <path d="M16 14h.01"/>
        </svg>
        <span>{{ formattedBalance }}</span>
      </button>

      <!-- Profile -->
      <div class="navbar__icon-btn navbar__icon-btn--profile" ref="profileChipRef" @click.stop="toggleProfileDrop" aria-label="Profile menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>

        <Transition name="profile-chip-drop">
          <div v-if="profileDropOpen" class="navbar__profile-dropdown" @click.stop>
            <div class="npd-header">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Daniel"
                alt="Daniel"
                class="npd-avatar"
              />
              <div class="npd-info">
                <span class="npd-name">Daniel</span>
                <span class="npd-email">globalgle@gmail.com</span>
              </div>
            </div>

            <div class="npd-divider" />

            <button class="npd-item" @click="goTo('/settings')">
              <span class="npd-icon npd-icon--green">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </span>
              <span class="npd-label">Account Settings</span>
              <svg class="npd-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <button class="npd-item" @click="goTo('/billing')">
              <span class="npd-icon npd-icon--green">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </span>
              <span class="npd-label">Billing &amp; Plans</span>
              <svg class="npd-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <button class="npd-item" @click="goTo('/help')">
              <span class="npd-icon npd-icon--green">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/>
                </svg>
              </span>
              <span class="npd-label">Help &amp; Support</span>
              <svg class="npd-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

          </div>
        </Transition>
      </div>

    </div>
  </header>

  <!-- ═══════════════════════════════════
       MOBILE NAVBAR  (hidden on desktop)
       ═══════════════════════════════════ -->
  <header class="mobile-nav">

    <!-- Hamburger -->
    <button class="mn-hamburger" @click="toggleSidebar" aria-label="Open menu">
      <span :class="['mn-bar', { 'mn-bar--open-1': sidebarOpen }]"/>
      <span :class="['mn-bar', 'mn-bar--mid', { 'mn-bar--open-2': sidebarOpen }]"/>
      <span :class="['mn-bar', { 'mn-bar--open-3': sidebarOpen }]"/>
    </button>

    <!-- Current page title -->
    <span class="mn-page-title">{{ pageTitle }}</span>

    <!-- Right actions -->
    <div class="mn-actions">

      <!-- Theme toggle -->
      <button class="mn-icon-btn" @click.stop="toggleTheme" :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
        <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <!-- Notifications -->
      <button class="mn-icon-btn" @click.stop="toggleNotifications" ref="mobileNotifBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span v-if="unreadCount > 0" class="mn-badge">{{ unreadCount }}</span>

        <!-- Mobile notif dropdown -->
        <Transition name="notif-drop">
          <div v-if="showNotifications" class="notif-dropdown notif-dropdown--mobile" @click.stop>
            <div class="notif-dropdown__header">
              <div class="notif-header-left">
                <span class="notif-dropdown__title">Notifications</span>
                <span v-if="unreadCount > 0" class="notif-count-pill">{{ unreadCount }} new</span>
              </div>
              <span class="notif-dropdown__clear" @click.stop="clearAll">Mark all read</span>
            </div>
            <div class="notif-list">
              <div v-if="notifications.length === 0" class="notif-empty">
                <p>You're all caught up!</p>
              </div>
              <div v-for="notif in notifications" :key="notif.id"
                :class="['notif-item', `notif-item--${notif.type}`, { 'notif-item--unread': !notif.read }]"
                @click.stop="markRead(notif.id)">
                <div :class="['notif-icon', `ni--${notif.type}`]">
                  <svg v-if="notif.type === 'success'" width="11" height="11" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div class="notif-item__content">
                  <p class="notif-item__title">{{ notif.title }}</p>
                  <p class="notif-item__message">{{ notif.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </button>

    </div>
  </header>


</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notifications as notifData } from '../../data/mockData.js'
import { useSidebar } from '../../composables/useSidebar.js'
import { useTheme } from '../../composables/useTheme.js'

const route  = useRoute()
const router = useRouter()
const { sidebarOpen, desktopOpen, toggleSidebar, toggleDesktopSidebar } = useSidebar()
const { theme, themePref, setThemePref, toggleTheme } = useTheme()

/* ── Appearance dropdown ── */
const themeOpen = ref(false)
const themeRef  = ref(null)
const themeOptions = [
  { value: 'light', label: 'Light', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>' },
  { value: 'dark',  label: 'Dark',  icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' },
  { value: 'auto',  label: 'Auto (match device)', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
]


/* ── Page meta ── */
const pages = {
  '/':                                    { title: 'Dashboard',            subtitle: 'Welcome back, Daniel' },
  '/customers':                           { title: 'Mailing Tools',        subtitle: 'Manage your email campaigns' },
  '/transactions':                        { title: 'Transactions',         subtitle: 'Your transaction history' },
  '/email-services/branded-bills':        { title: 'Crypto Bills Mails',   subtitle: 'Pick a provider to send a brand-styled billing email' },
  '/email-services/branded-emails':       { title: 'Crypto Mails',         subtitle: 'Pick a provider to send a brand-styled email' },
  '/email-services/composer':             { title: 'Email Composer',       subtitle: 'Write and send emails' },
  '/email-services/bank-mailer':          { title: 'Bank Mailer',          subtitle: 'Send debit & credit bank transfer notices' },
  '/analytics':                           { title: 'Websites',             subtitle: 'Monitor your web properties' },
  '/settings':                            { title: 'Settings',             subtitle: 'Manage your preferences' },
  '/tutorials':                           { title: 'Tutorials',            subtitle: 'Learn how to use every feature' },
  '/help':                                { title: 'Support',              subtitle: 'Get help and find answers' },
  '/complaint':                           { title: 'Make a Complaint',     subtitle: 'Submit and track your reports' },
  '/reselling':                           { title: 'Start Reselling',      subtitle: 'Sell our services under your own brand' },
  '/website-creator':                     { title: 'Website Creator',      subtitle: 'Launch and manage the sites you offer your customers' },
  '/tesla-giveaway':                      { title: 'Tesla Giveaway',       subtitle: 'Spawn a Tesla giveaway / participate site' },
  '/tesla-investment':                    { title: 'Tesla Investment',     subtitle: 'Launch a Tesla Investment site' },
  '/celebrity':                           { title: 'Celebrity',            subtitle: 'Spawn a celebrity talent-booking site' },
  '/ecommerce':                           { title: 'Ecommerce Sites',      subtitle: 'Spawn your own online store' },
  '/website-widgets':                     { title: 'Website Widgets',      subtitle: 'Paste a chat or contact widget on your site' },
  '/wallets':                             { title: 'Wallets',              subtitle: 'Spawn a white-label wallet site' },
  '/wallet':                              { title: 'My Wallet',            subtitle: 'Your balance and transactions' },
  '/billing':                             { title: 'Billing & Plans',      subtitle: 'Subscriptions and invoices' },
  '/tools/transactions-tracker':          { title: 'Transactions Trackers',subtitle: 'Choose a style and share a receipt link' },
  '/tools/transactions-tracker/payment':  { title: 'Payment Tracking',     subtitle: 'Create a live tracking receipt and share it instantly with a link' },
  '/tools/transactions-tracker/receipts': { title: 'Receipts Tracking',    subtitle: 'Create a live transaction receipt and share it on your own link' },
  '/tools/crypto-receipts':               { title: 'Crypto Receipts',      subtitle: 'Pick a brand and generate a branded receipt' },
  '/digital':                             { title: 'Digital',              subtitle: 'Extra tools for your business' },
  '/tools':                               { title: 'Generator',            subtitle: 'Generate branded receipts, trackers and documents' },
  '/tools/currency':                      { title: 'Currency Converter',   subtitle: 'Live exchange rates' },
  '/tools/wallet-funding':                { title: 'Wallet Funding',       subtitle: 'Crypto wallet top-ups' },
  '/tools/sms-sender':                    { title: 'SMS Sender',           subtitle: 'Send SMS messages' },
  '/tools/spoof-calling':                 { title: 'Spoof Calling',        subtitle: 'Place calls with a chosen caller ID' },
}

const currentPage    = computed(() => pages[route.path] ?? { title: 'Globalgle', subtitle: 'Banking Dashboard' })
const pageTitle      = computed(() => currentPage.value.title)

/* ── Shared state ── */
const showNotifications = ref(false)
const notifBtn          = ref(null)
const mobileNotifBtn    = ref(null)
const notifications     = ref(notifData)

/* ── Profile chip dropdown ── */
const profileDropOpen = ref(false)
const profileChipRef  = ref(null)
const toggleProfileDrop = () => { profileDropOpen.value = !profileDropOpen.value }
function goTo(path) {
  profileDropOpen.value = false
  searchOpen.value      = false
  searchQuery.value     = ''
  router.push(path)
}

/* ── Search (pages) ── */
const searchQuery   = ref('')
const searchOpen    = ref(false)
const searchRef     = ref(null)
const searchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return Object.entries(pages)
    .filter(([, p]) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q))
    .map(([path, p]) => ({ path, title: p.title }))
    .slice(0, 6)
})

/* ── Currency + balance ── */
const currencies   = [
  { code: 'NGN', symbol: '₦', rate: 1 },
  { code: 'USD', symbol: '$', rate: 1 / 1580 },
]
const currency     = ref('NGN')
const currencyOpen = ref(false)
const currencyRef  = ref(null)
const balanceNGN   = ref(0)
const formattedBalance = computed(() => {
  const c = currencies.find(x => x.code === currency.value) ?? currencies[0]
  const amount = balanceNGN.value * c.rate
  return c.symbol + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

/* ── Notifications ── */
const toggleNotifications = () => { showNotifications.value = !showNotifications.value }
const markRead  = (id) => { const n = notifications.value.find(n => n.id === id); if (n) n.read = true }
const dismiss   = (id) => { notifications.value = notifications.value.filter(n => n.id !== id) }
const clearAll  = () => { notifications.value = notifications.value.map(n => ({ ...n, read: true })) }

/* ── Click outside ── */
const handleOutsideClick = (e) => {
  const clickedNotifBtn   = notifBtn.value?.contains(e.target)
  const clickedMobileBtn  = mobileNotifBtn.value?.contains(e.target)
  if (!clickedNotifBtn && !clickedMobileBtn) showNotifications.value = false
  if (!profileChipRef.value?.contains(e.target)) profileDropOpen.value = false
  if (!currencyRef.value?.contains(e.target))    currencyOpen.value    = false
  if (!searchRef.value?.contains(e.target))      searchOpen.value      = false
  if (!themeRef.value?.contains(e.target))       themeOpen.value       = false
}
onMounted(()       => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
/* ══════════════════════════════
   DESKTOP NAVBAR
   ══════════════════════════════ */
.navbar {
  position: fixed;
  top: 0; left: 260px; right: 0;
  transition: left 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  background: linear-gradient(90deg, var(--surface-sunken) 0%, var(--surface-raised) 50%, var(--surface-sunken) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-bottom: 1px solid var(--border-soft);
  z-index: 90;
  gap: 16px;
}

.navbar__left   { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.navbar__right  { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }

.navbar__page-title { font-size: 0.86rem; font-weight: 600; color: var(--t1); }

.navbar__sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--glass-hover);
  border: 1px solid var(--border-soft);
  color: var(--icon-stroke);
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.2s ease, background 0.2s ease;
}
.navbar__sidebar-toggle:hover { color: var(--t1); background: var(--glass); }

.navbar__icon-btn {
  position: relative; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none;
  cursor: pointer; transition: color 0.2s ease; flex-shrink: 0;
}
.navbar__icon-btn svg { width: 24px; height: 24px; color: var(--icon-stroke); }
.navbar__icon-btn:hover svg { color: var(--t1); }

/* Join Channel */
.navbar__join {
  display: inline-flex; align-items: center; gap: 7px;
  height: 34px; padding: 0 16px;
  background: #0b86c9; color: #fff;
  border-radius: 999px;
  font-size: 0.78rem; font-weight: 700;
  text-decoration: none; white-space: nowrap;
  transition: background 0.2s ease;
  animation: join-bounce 5s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
  animation-delay: 1.5s;
  will-change: transform;
}
.navbar__join:hover { background: #0a76b1; animation-play-state: paused; }
.navbar__join:active { transform: scale(0.97); }

/* Bounce once (~1s), then rest — repeats every 5s */
@keyframes join-bounce {
  0%, 20%, 100% { transform: translateY(0)    scale(1, 1); }
  3%            { transform: translateY(0)    scale(1.04, 0.94); }
  7%            { transform: translateY(-7px) scale(0.97, 1.04); }
  11%           { transform: translateY(0)    scale(1.03, 0.96); }
  14%           { transform: translateY(-3px) scale(1, 1); }
  17%           { transform: translateY(0)    scale(1, 1); }
}

@media (prefers-reduced-motion: reduce) {
  .navbar__join { animation: none; }
}

/* Search */
.navbar__search {
  position: relative;
  display: flex; align-items: center; gap: 7px;
  height: 38px; padding: 0 6px;
  color: var(--t3);
}
.navbar__search > svg { width: 18px; height: 18px; flex-shrink: 0; color: var(--icon-stroke); }
.navbar__search-input {
  width: 70px;
  background: transparent; border: none; outline: none;
  font-family: inherit; font-size: 0.86rem; font-weight: 500;
  color: var(--t1);
  transition: width 0.25s ease;
}
.navbar__search-input::placeholder { color: var(--t3); }
.navbar__search-input:focus { width: 160px; }
.navbar__search-dropdown,
.navbar__currency-dropdown {
  position: absolute;
  top: calc(100% + 10px); right: 0;
  min-width: 200px;
  background: linear-gradient(160deg, var(--surface-raised) 0%, var(--surface-sunken) 100%);
  border: 1px solid var(--border);
  border-radius: 14px; padding: 6px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.18); z-index: 200;
  transform-origin: top right;
}
.navbar__search-dropdown { left: 0; right: auto; }
.navbar__currency-dropdown { min-width: 130px; }
.navbar__search-empty { margin: 0; padding: 9px 10px; font-size: 0.78rem; color: var(--t3); }

/* Support (icon + text) */
.navbar__text-btn {
  display: flex; align-items: center; gap: 7px;
  height: 38px; padding: 0 8px;
  background: transparent; border: none; cursor: pointer;
  font-family: inherit; font-size: 0.86rem; font-weight: 500;
  color: var(--t2);
  transition: color 0.2s ease;
}
.navbar__text-btn svg { width: 18px; height: 18px; color: var(--icon-stroke); }
.navbar__text-btn:hover,
.navbar__text-btn:hover svg { color: var(--t1); }

/* Pills (currency + balance) */
.navbar__pill {
  position: relative;
  display: flex; align-items: center; gap: 7px;
  height: 36px; padding: 0 14px;
  background: var(--glass-hover);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  font-family: inherit; font-size: 0.8rem; font-weight: 700;
  color: var(--t1);
  cursor: pointer; white-space: nowrap;
  transition: background 0.2s ease;
}
.navbar__pill:hover { background: var(--glass); }
.navbar__pill svg { color: var(--icon-stroke); }
.navbar__chev { transition: transform 0.2s ease; }
.navbar__chev--open { transform: rotate(180deg); }
.navbar__currency-sym { color: var(--t3); font-weight: 600; }
.npd-item--active { background: var(--glass-hover); }

/* Appearance (theme) dropdown */
.navbar__theme { position: relative; }
.navbar__theme-dropdown {
  position: absolute;
  top: calc(100% + 10px); right: 0;
  min-width: 210px;
  background: linear-gradient(160deg, var(--surface-raised) 0%, var(--surface-sunken) 100%);
  border: 1px solid var(--border);
  border-radius: 14px; padding: 6px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.18); z-index: 200;
  transform-origin: top right;
  cursor: default;
}
.navbar__theme-label {
  display: block;
  font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--t3); padding: 8px 10px 6px;
}
.theme-opt {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 10px;
  border-radius: 10px; border: none;
  background: transparent; color: var(--t1);
  font-family: inherit; font-size: 0.82rem; font-weight: 600;
  cursor: pointer; text-align: left;
  transition: background 0.16s ease;
}
.theme-opt:hover { background: var(--glass-hover); }
.theme-opt--active { background: var(--glass); }
.theme-opt__ico { display: flex; align-items: center; color: var(--t2); flex-shrink: 0; }
.theme-opt__label { flex: 1; }
.theme-opt__check { color: #16a34a; flex-shrink: 0; }

/* Profile circle */
.navbar__icon-btn--profile {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-soft);
  background: var(--surface-raised);
}
.navbar__icon-btn--profile > svg { width: 17px; height: 17px; }

.navbar__badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 18px; height: 18px; background: var(--red);
  border-radius: 9px; font-size: 0.6rem; font-weight: 700; color: #fff;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--bg); padding: 0 3px;
}

.navbar__profile-dropdown {
  position: absolute;
  top: calc(100% + 10px); right: 0;
  min-width: 210px;
  background: linear-gradient(160deg, var(--surface-raised) 0%, var(--surface-sunken) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--border);
  border-radius: 16px; padding: 6px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.28); z-index: 200;
  transform-origin: top right;
}
.npd-header { display: flex; align-items: center; gap: 10px; padding: 10px 10px 8px; }
.npd-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0; }
.npd-info { display: flex; flex-direction: column; gap: 2px; }
.npd-name  { font-size: 0.82rem; font-weight: 800; color: var(--t1); }
.npd-email { font-size: 0.67rem; color: var(--t1); font-weight: 700; }
.npd-divider { height: 1px; background: var(--border-soft); margin: 4px 0; }
.npd-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 10px;
  border-radius: 10px; border: none;
  background: transparent; color: var(--t1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem; font-weight: 700;
  cursor: pointer; text-align: left;
}
.npd-item:hover { color: var(--t2); }
.npd-item:focus,
.npd-item:active { outline: none; }
.npd-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.npd-icon--green { background: var(--glass-hover); color: var(--t1); }
.npd-label { flex: 1; }
.npd-arrow { color: var(--t3); flex-shrink: 0; }

.profile-chip-drop-enter-active { transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.profile-chip-drop-leave-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.profile-chip-drop-enter-from  { opacity: 0; transform: scale(0.88) translateY(-8px); }
.profile-chip-drop-leave-to    { opacity: 0; transform: scale(0.94) translateY(-4px); }

/* ══════════════════════════════
   MOBILE NAVBAR
   ══════════════════════════════ */
.mobile-nav {
  display: none;
  position: fixed; top: 0; left: 0; right: 0; height: 64px; z-index: 90;
  background: linear-gradient(90deg, var(--surface-sunken) 0%, var(--surface-raised) 50%, var(--surface-sunken) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-bottom: 1px solid var(--border-soft);
  align-items: center; justify-content: space-between;
  padding: 0 16px; gap: 12px;
  transition: background 0.35s ease;
}

.mn-hamburger {
  width: 40px; height: 40px; background: transparent; border: none;
  border-radius: 11px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 5px;
  cursor: pointer; flex-shrink: 0; padding: 0;
}
.mn-bar {
  width: 18px; height: 2px; background: var(--t1); border-radius: 2px;
  transition: all 0.28s ease; transform-origin: center;
}
.mn-bar--mid    { width: 13px; align-self: flex-start; margin-left: 11px; }
.mn-bar--open-1 { transform: rotate(45deg) translate(5px, 5px); width: 18px; }
.mn-bar--open-2 { opacity: 0; transform: scaleX(0); }
.mn-bar--open-3 { transform: rotate(-45deg) translate(5px, -5px); width: 18px; }

.mn-page-title {
  flex: 1; min-width: 0;
  font-size: 0.92rem; font-weight: 700; color: var(--t1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.mn-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.mn-icon-btn {
  position: relative; width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: var(--surface-raised); border: 1px solid var(--border-soft);
  border-radius: 12px; cursor: pointer; color: var(--icon-stroke);
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.14);
}
.mn-icon-btn:hover { color: var(--t1); background: var(--glass-hover); }
.mn-badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 17px; height: 17px; background: var(--red);
  border-radius: 8px; font-size: 0.58rem; font-weight: 700; color: #fff;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--bg); padding: 0 3px;
}

/* ══════════════════════════════
   NOTIFICATION DROPDOWN (shared)
   ══════════════════════════════ */
.notif-drop-enter-active, .notif-drop-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.notif-drop-enter-from,   .notif-drop-leave-to     { opacity: 0; transform: translateY(-6px) scale(0.97); }

.notif-dropdown {
  position: absolute; top: calc(100% + 12px); right: 0;
  width: 340px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  z-index: 200;
}
.notif-dropdown--mobile {
  position: fixed;
  top: 70px; left: 12px; right: 12px;
  width: auto;
  max-height: calc(100vh - 90px);
  overflow-y: auto;
  border-radius: 16px;
}
.notif-dropdown__header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px 12px; border-bottom: 1px solid var(--border-soft);
}
.notif-header-left    { display: flex; align-items: center; gap: 8px; }
.notif-dropdown__title { font-size: 0.88rem; font-weight: 700; color: var(--t1); }
.notif-count-pill {
  font-size: 0.65rem; font-weight: 700;
  background: var(--glass-hover); color: var(--t2);
  border: 1px solid var(--border); border-radius: 999px; padding: 2px 8px;
}
.notif-dropdown__clear { font-size: 0.72rem; font-weight: 600; color: var(--t3); cursor: pointer; transition: color 0.2s; }
.notif-dropdown__clear:hover { color: var(--t1); }

.notif-list { max-height: 300px; overflow-y: auto; }
.notif-list::-webkit-scrollbar { width: 3px; }
.notif-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

.notif-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 28px 16px; color: var(--t3); font-size: 0.8rem; }
.notif-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 11px 16px; border-bottom: 1px solid var(--border-soft);
  cursor: pointer; transition: background 0.15s; position: relative;
}
.notif-item:last-child  { border-bottom: none; }
.notif-item:hover       { background: var(--glass-2); }
.notif-item--unread     { background: var(--glass); }
.notif-item--unread:hover { background: var(--glass-hover); }
.notif-item--success { border-left: 2px solid var(--t3); }
.notif-item--error   { border-left: 2px solid var(--t3); }
.notif-item--warning { border-left: 2px solid var(--t3); }
.notif-item--info    { border-left: 2px solid var(--t3); }

.notif-icon { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.ni--success { background: var(--glass-hover); color: var(--t2); }
.ni--error   { background: var(--glass-hover); color: var(--t2); }
.ni--warning { background: var(--glass-hover); color: var(--t2); }
.ni--info    { background: var(--glass-hover); color: var(--t2); }

.notif-item__content { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.notif-item__title   { font-size: 0.78rem; font-weight: 700; color: var(--t1); margin: 0; }
.notif-item__message { font-size: 0.73rem; color: var(--t2); margin: 0; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notif-item__time    { font-size: 0.67rem; color: var(--t3); margin-top: 2px; }
.notif-item__dot     { width: 6px; height: 6px; border-radius: 50%; background: var(--t3); flex-shrink: 0; margin-top: 6px; }
.notif-dismiss {
  width: 20px; height: 20px; border-radius: 50%; border: none; background: transparent;
  color: var(--t3); cursor: pointer; display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.15s, background 0.15s; flex-shrink: 0; margin-top: 2px;
}
.notif-item:hover .notif-dismiss { opacity: 1; }
.notif-dismiss:hover { background: rgba(248,113,113,.15); color: #f87171; }

.notif-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 16px; border-top: 1px solid var(--border-soft);
  font-size: 0.7rem; color: var(--t3);
}
.notif-footer__clear { color: var(--t2); cursor: pointer; font-weight: 600; transition: color 0.2s; }
.notif-footer__clear:hover { color: #f87171; }


/* ══════════════════════════════
   RESPONSIVE: show/hide
   ══════════════════════════════ */
@media (max-width: 1366px) and (min-width: 769px) {
  .navbar { padding: 0 18px; left: 245px; }
  .navbar--collapsed { left: 74px; }
}

@media (min-width: 769px) {
  .navbar--collapsed { left: 74px; }
}

@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .mobile-nav  { display: flex; }
}
</style>