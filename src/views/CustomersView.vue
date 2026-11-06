<!-- src/views/CustomersView.vue  â†'  Mailing Tools -->
<template>
  <div class="email-page">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-header__title">Mailing <span class="page-header__badge">TOOLS</span></h1>
      <p class="page-header__sub">Send branded emails, bills and bulk campaigns.</p>
    </div>

    <!-- Service Cards -->
    <div class="service-grid">
      <div v-for="s in services" :key="s.title" class="service-card" @click="$router.push(s.route)">
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
    title: 'Crypto Mails',
    desc:  'Send branded wallet &amp; transaction <span class="hl">emails</span>.',
    route: '/email-services/branded-emails',
    icon:  '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  },
  {
    title: 'Crypto Bills Mails',
    desc:  'Generate branded <span class="hl">bills</span> and <span class="hl">invoices</span>.',
    route: '/email-services/branded-bills',
    icon:  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  },
  {
    title: 'Email Composer',
    desc:  'Write and send <span class="hl">single</span> or <span class="hl">bulk</span> email.',
    route: '/email-services/composer',
    icon:  '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  },
  {
    title: 'Bank Mailer',
    desc:  'Send a bank transfer alert to both the <span class="hl">sender</span> and the <span class="hl">receiver</span>.',
    route: '/email-services/bank-mailer',
    icon:  '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/><line x1="12" y1="13" x2="12" y2="19"/><line x1="9" y1="16" x2="15" y2="16"/>',
  },
]
</script>

<style scoped>
.email-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Header */
.page-header { display: flex; flex-direction: column; gap: 6px; }
.page-header__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.025em;
  margin: 0;
}
.page-header__badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  padding: 3px 9px;
  border-radius: 999px;
  letter-spacing: 0.05em;
}
.page-header__sub {
  font-size: 0.82rem;
  color: var(--t1); font-weight: 600;
  margin: 0;
}

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
  transition: border-color 0.22s ease, transform 0.18s ease, box-shadow 0.22s ease;
}
.service-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(var(--accent-r),var(--accent-g),var(--accent-b), 0.08);
}

.service-card__icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b), 0.12);
  border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b), 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--t1);
  margin: 0;
}

.service-card__desc {
  font-size: 0.82rem;
  color: var(--t1);
  line-height: 1.6;
  margin: 0;
}

/* Highlighted words inside descriptions */
.service-card__desc :deep(.hl) {
  color: var(--accent);
  font-weight: 500;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .service-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
}
@media (max-width: 768px) {
  .service-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .service-card { padding: 14px 14px; }
}
@media (max-width: 480px) {
  .service-grid { grid-template-columns: 1fr; }
}

</style>
