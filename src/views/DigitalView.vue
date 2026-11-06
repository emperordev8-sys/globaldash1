<!-- src/views/DigitalView.vue -->
<template>
  <div class="digital-page">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-header__title">
        Digital <span class="page-header__badge">TOOLS</span>
      </h1>
      <p class="page-header__sub">Extra tools for your business.</p>
    </div>

    <!-- Service Cards -->
    <div class="service-grid">
      <div
        v-for="s in services"
        :key="s.title"
        class="service-card"
        @click="$router.push(s.route)"
      >
        <div class="service-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="var(--accent)" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"
            v-html="s.icon"
          />
        </div>
        <h2 class="service-card__title">{{ s.title }}</h2>
        <p class="service-card__desc" v-html="s.desc" />
      </div>
    </div>

  </div>
</template>

<script setup>
const services = [
  {
    title: 'Wallet Funding',
    desc:  'Offer <span class="hl">crypto</span> wallet top-ups to your customers.',
    route: '/tools/wallet-funding',
    icon:  '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/>',
  },
  {
    title: 'SMS Sender',
    desc:  'Send <span class="hl">SMS messages</span> directly to your customers.',
    route: '/tools/sms-sender',
    icon:  '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  {
    title: 'Spoof Calling',
    desc:  'Place a call with a <span class="hl">chosen caller ID</span>.',
    route: '/tools/spoof-calling',
    icon:  '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  },
]
</script>

<style scoped>
.digital-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Header */
.page-header        { display: flex; flex-direction: column; gap: 6px; }
.page-header__title {
  display: flex; align-items: center; gap: 10px;
  font-size: 1.5rem; font-weight: 800; color: var(--t1);
  letter-spacing: -0.025em; margin: 0;
}
.page-header__badge {
  font-size: 0.72rem; font-weight: 700; color: var(--t1);
  background: transparent; border: 1.5px solid var(--t1);
  padding: 3px 9px; border-radius: 999px; letter-spacing: 0.05em;
}
.page-header__sub { font-size: 0.82rem; color: var(--t1); font-weight: 600; margin: 0; }

/* Grid */
.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

/* Card */
.service-card {
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.22s ease, transform 0.18s ease;
}
.service-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
}

.service-card__icon {
  width: 46px; height: 46px; border-radius: 13px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.service-card__title {
  font-size: 1rem; font-weight: 700; color: var(--t1); margin: 0;
}

.service-card__desc {
  font-size: 0.82rem; color: var(--t2); line-height: 1.6; margin: 0;
}
.service-card__desc :deep(.hl) { color: var(--accent); font-weight: 500; }

/* Responsive */
@media (max-width: 768px) {
  .service-grid { grid-template-columns: 1fr; gap: 12px; }
  .service-card { padding: 14px 14px; }
}

</style>
