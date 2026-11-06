<!-- src/views/TransactionsTrackerView.vue -->
<template>
  <div class="tt-page">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-header__title">Transactions Trackers</h1>
      <p class="page-header__sub">Choose a receipt style, fill in the details, and share it with a link.</p>
    </div>

    <!-- Cards -->
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
    title: 'Receipts Tracking',
    desc:  'A step-by-step receipt with <span class="hl">a status icon</span>, <span class="hl">a progress timeline</span> and <span class="hl">an action button</span> â€" share it with a link.',
    route: '/tools/transactions-tracker/receipts',
    icon:  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  },
  {
    title: 'Payment Tracking',
    desc:  'A live receipt with <span class="hl">a spinning status</span>, <span class="hl">amounts</span> and <span class="hl">copyable details</span> â€" share it with a link.',
    route: '/tools/transactions-tracker/payment',
    icon:  '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  },
]
</script>

<style scoped>
.tt-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Header */
.page-header        { display: flex; flex-direction: column; gap: 6px; }
.page-header__title {
  font-size: 1.5rem; font-weight: 800; color: var(--t1);
  letter-spacing: -0.025em; margin: 0;
}
.page-header__sub { font-size: 0.82rem; color: var(--t1); font-weight: 600; margin: 0; }

/* Grid */
.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  width: 46px; height: 46px; border-radius: 13px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b), 0.12);
  border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b), 0.18);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.service-card__title {
  font-size: 1rem; font-weight: 700; color: var(--t1); margin: 0;
}

.service-card__desc {
  font-size: 0.82rem; color: var(--t2); line-height: 1.6; margin: 0;
}
.service-card__desc :deep(.hl) { color: var(--accent); font-weight: 500; }

/* â"€â"€ Responsive â"€â"€ */

/* Tablet (601px â€" 768px): side-by-side still works */
@media (max-width: 768px) and (min-width: 601px) {
  .tt-page       { gap: 22px; }
  .service-grid  { gap: 14px; }
  .service-card  { padding: 14px 14px; gap: 8px; }
  .page-header__title { font-size: 1.3rem; }
}

/* Mobile (â‰¤ 600px): single column */
@media (max-width: 600px) {
  .tt-page       { gap: 18px; }
  .service-grid  { grid-template-columns: 1fr; gap: 12px; }
  .service-card  { padding: 13px 13px; gap: 8px; border-radius: 14px; }
  .page-header__title { font-size: 1.2rem; }
  .page-header__sub   { font-size: 0.78rem; }
  .service-card__title { font-size: 0.95rem; }
  .service-card__desc  { font-size: 0.8rem; }
  .service-card__icon  { width: 42px; height: 42px; border-radius: 11px; }
}

/* Small phones (â‰¤ 430px) */
@media (max-width: 430px) {
  .service-card  { padding: 12px 12px; gap: 7px; border-radius: 13px; }
  .page-header__title { font-size: 1.1rem; }
  .service-card__icon  { width: 38px; height: 38px; border-radius: 10px; }
  .service-card__title { font-size: 0.9rem; }
  .service-card__desc  { font-size: 0.76rem; line-height: 1.55; }
}

/* Tiny phones (â‰¤ 360px) */
@media (max-width: 360px) {
  .service-card  { padding: 16px 14px; }
  .page-header__title { font-size: 1rem; }
  .service-card__desc  { font-size: 0.72rem; }
}

</style>
