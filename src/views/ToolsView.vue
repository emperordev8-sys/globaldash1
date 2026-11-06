<!-- src/views/ToolsView.vue -->
<template>
  <div class="tools-page">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-header__title">
        Generator <span class="page-header__badge">TOOLS</span>
      </h1>
      <p class="page-header__sub">Generate branded receipts, trackers and documents.</p>
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
    title: 'Crypto Receipts',
    desc:  'Fill in the details and generate a <span class="hl">branded</span> transaction receipt.',
    route: '/tools/crypto-receipts',
    icon:  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  },
  {
    title: 'Transactions Trackers',
    desc:  'Generate a <span class="hl">transaction</span> or <span class="hl">tracking receipt</span> with a <span class="hl">shareable link</span>.',
    route: '/tools/transactions-tracker',
    icon:  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  },
  {
    title: 'Bank Receipt',
    desc:  '<span class="hl">Bank-app-styled</span> receipts as <span class="hl">PDF</span> or <span class="hl">image</span>.',
    route: '/tools/bank-receipt',
    icon:  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  },
]
</script>

<style scoped>
.tools-page {
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
  color: var(--t2);
  line-height: 1.6;
  margin: 0;
}

.service-card__desc :deep(.hl) {
  color: var(--accent);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
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
