<!-- src/views/ResellingView.vue -->
<template>
  <div class="resell">

    <!-- Header -->
    <div class="resell-head">
      <h1 class="resell-head__title">Start Reselling</h1>
      <p class="resell-head__sub">Sell our services under your own brand: run your own panel, or plug into our API.</p>
    </div>

    <!-- Two option cards -->
    <div class="resell-grid">

      <!-- Branded panel -->
      <div class="resell-card">
        <div class="resell-card__top">
          <span class="resell-card__ico">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </span>
          <span class="resell-tag">No coding</span>
        </div>

        <h2 class="resell-card__title">Your own branded panel</h2>
        <p class="resell-card__desc">A ready-made storefront for our services, wearing your brand. Nothing to build and nothing to host.</p>

        <ul class="resell-list">
          <li v-for="item in panelPerks" :key="item">
            <svg class="resell-check" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/>
            </svg>
            {{ item }}
          </li>
        </ul>

        <div class="resell-divider" />

        <div class="resell-price">
          <span class="resell-price__amount">$100.00</span>
          <span class="resell-price__cycle">/ 30 days</span>
        </div>
        <p class="resell-price__note">On top of a developer plan. Prices are in US dollars.</p>
      </div>

      <!-- API -->
      <div class="resell-card">
        <div class="resell-card__top">
          <span class="resell-card__ico">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </span>
          <span class="resell-tag">For coders</span>
        </div>

        <h2 class="resell-card__title">Connect with our API</h2>
        <p class="resell-card__desc">Connect your own app or website to our services, and sell them your way.</p>

        <ul class="resell-list">
          <li v-for="item in apiPerks" :key="item">
            <svg class="resell-check" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/>
            </svg>
            {{ item }}
          </li>
        </ul>

        <div class="resell-divider" />

        <p class="resell-card__footnote">Pick a developer plan, then create your API key.</p>
      </div>
    </div>

    <!-- Bottom banner -->
    <div class="resell-banner">
      <div class="resell-banner__row">
        <div class="resell-banner__lead">
          <span class="resell-banner__ico">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          <div>
            <h3 class="resell-banner__title">Both start on Globalgle Developers</h3>
            <p class="resell-banner__text">You'll find it at <code class="resell-banner__url">tudowebs.com</code>.</p>
          </div>
        </div>

        <div class="resell-banner__cta">
          <a href="https://tudowebs.com" target="_blank" rel="noopener noreferrer" class="resell-btn">
            Open Globalgle Developers
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
          <span class="resell-btn__hint">Opens in a new tab</span>
        </div>
      </div>

      <div class="resell-note">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <p>
          <strong>It's a separate account.</strong> Your login and wallet here don't carry over, so you'll create a developer account, choose a plan, then add your panel or make an API key.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
const panelPerks = [
  'Your name, logo and domain',
  'Your own members, who sign up with you',
  'You set every price',
]
const apiPerks = [
  'One API key for every service',
  'One wallet that pays for every order',
  'Clear docs to build with',
]
</script>

<style scoped>
.resell { display: flex; flex-direction: column; gap: 18px; }

/* Header */
.resell-head { display: flex; flex-direction: column; gap: 6px; }
.resell-head__title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.resell-head__sub { margin: 0; font-size: 0.86rem; color: var(--t2); font-weight: 500; }

/* Cards grid */
.resell-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch; }

.resell-card {
  background: var(--bg);
  border: 1px solid var(--t4);
  border-radius: 18px;
  padding: 22px;
  display: flex; flex-direction: column;
}

.resell-card__top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
.resell-card__ico {
  width: 46px; height: 46px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 13px;
  background: rgba(22,163,74,0.12);
  border: 1px solid rgba(22,163,74,0.22);
  color: #16a34a;
}
.resell-tag {
  font-size: 0.72rem; font-weight: 700;
  color: #16a34a; background: rgba(22,163,74,0.12);
  border: 1px solid rgba(22,163,74,0.25);
  padding: 4px 12px; border-radius: 999px;
}

.resell-card__title { margin: 0 0 8px; font-size: 1.15rem; font-weight: 800; color: var(--t1); letter-spacing: -0.01em; }
.resell-card__desc { margin: 0 0 18px; font-size: 0.88rem; line-height: 1.6; color: var(--t2); }

.resell-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.resell-list li {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.88rem; font-weight: 600; color: var(--t1);
}
.resell-check { color: #16a34a; flex-shrink: 0; }

.resell-divider { height: 1px; background: var(--border-soft); margin: 20px 0 16px; }

.resell-price { display: flex; align-items: baseline; gap: 8px; }
.resell-price__amount { font-size: 1.7rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.resell-price__cycle { font-size: 0.86rem; font-weight: 600; color: var(--t3); }
.resell-price__note { margin: 6px 0 0; font-size: 0.76rem; color: var(--t3); }

.resell-card__footnote { margin: auto 0 0; font-size: 0.86rem; color: var(--t2); }

/* Bottom banner */
.resell-banner {
  background: var(--bg);
  border: 1px solid var(--t4);
  border-radius: 18px;
  padding: 20px 22px;
  display: flex; flex-direction: column; gap: 16px;
}
.resell-banner__row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 18px; flex-wrap: wrap;
}
.resell-banner__lead { display: flex; align-items: center; gap: 14px; min-width: 0; }
.resell-banner__ico {
  width: 46px; height: 46px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 13px;
  background: rgba(22,163,74,0.12);
  border: 1px solid rgba(22,163,74,0.22);
  color: #16a34a;
}
.resell-banner__title { margin: 0 0 3px; font-size: 1.02rem; font-weight: 800; color: var(--t1); }
.resell-banner__text { margin: 0; font-size: 0.85rem; color: var(--t2); }
.resell-banner__url {
  font-family: 'Courier New', monospace; font-size: 0.82rem;
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  padding: 2px 8px; border-radius: 6px; color: var(--t1);
}

.resell-banner__cta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.resell-btn__hint { font-size: 0.72rem; color: var(--t3); }

/* Green CTA with moving glass shine */
.resell-btn {
  position: relative; overflow: hidden; isolation: isolate;
  display: inline-flex; align-items: center; gap: 8px;
  height: 46px; padding: 0 22px; border-radius: 12px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%);
  color: #fff; text-decoration: none;
  font-family: inherit; font-size: 0.9rem; font-weight: 700;
  transition: transform 0.16s ease;
}
.resell-btn:hover { transform: translateY(-2px); }
.resell-btn:active { transform: translateY(0); }
.resell-btn::after {
  content: '';
  position: absolute; top: 0; bottom: 0; left: -75%;
  width: 45%;
  background: linear-gradient(100deg,
    transparent 0%,
    rgba(255,255,255,0.18) 35%,
    rgba(255,255,255,0.7) 50%,
    rgba(255,255,255,0.18) 65%,
    transparent 100%);
  transform: skewX(-22deg);
  pointer-events: none; z-index: 2;
  animation: resell-shine 2.4s ease-in-out infinite;
}
@keyframes resell-shine {
  0% { left: -75%; }
  40% { left: 125%; }
  100% { left: 125%; }
}
@media (prefers-reduced-motion: reduce) {
  .resell-btn::after { animation: none; display: none; }
}

/* Info note */
.resell-note {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 14px 16px; border-radius: 12px;
  background: rgba(22,163,74,0.07);
  border: 1px solid rgba(22,163,74,0.25);
}
.resell-note svg { color: #16a34a; flex-shrink: 0; margin-top: 1px; }
.resell-note p { margin: 0; font-size: 0.84rem; line-height: 1.55; color: var(--t2); }
.resell-note strong { color: var(--t1); font-weight: 700; }

/* Responsive */
@media (max-width: 860px) {
  .resell-grid { grid-template-columns: 1fr; }
  .resell-banner__row { flex-direction: column; align-items: stretch; }
  .resell-banner__cta { align-items: stretch; }
  .resell-btn { justify-content: center; }
  .resell-btn__hint { text-align: center; }
}
</style>
