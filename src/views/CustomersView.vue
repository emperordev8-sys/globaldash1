<!-- src/views/CustomersView.vue → Mailing Tools -->
<template>
  <div class="mail">

    <!-- Header -->
    <div class="mail-head">
      <h1 class="mail-title">Mailing <span class="mail-badge">TOOLS</span></h1>
      <p class="mail-sub">Send branded emails, bills and bulk campaigns.</p>
    </div>

    <!-- Grid -->
    <div class="mail-grid">
      <button v-for="s in services" :key="s.title" class="mail-card" @click="$router.push(s.route)">
        <span class="mail-medal"><img :src="s.img" :alt="s.title" loading="lazy" /></span>
        <span class="mail-name">
          {{ s.title }}
          <svg class="mail-go" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </button>
    </div>

  </div>
</template>

<script setup>
const PIC = import.meta.glob('../assets/1000880*.png', { eager: true, import: 'default' })
const pic = (n) => PIC[`../assets/1000880${n}.png`]

const services = [
  { title: 'Crypto Mails',       route: '/email-services/branded-emails', img: pic('310') },
  { title: 'Crypto Bills Mails', route: '/email-services/branded-bills',  img: pic('309') },
  { title: 'Email Composer',     route: '/email-services/composer',       img: pic('311') },
  { title: 'Bank Mailer',        route: '/email-services/bank-mailer',     img: pic('312') },
]
</script>

<style scoped>
.mail { display: flex; flex-direction: column; gap: 18px; }

/* Header */
.mail-head { display: flex; flex-direction: column; gap: 6px; }
.mail-title {
  display: flex; align-items: center; gap: 10px; margin: 0;
  font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em;
}
.mail-badge {
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.05em;
  color: #16a34a; background: rgba(22,163,74,0.1);
  border: 1px solid rgba(22,163,74,0.35); padding: 3px 10px; border-radius: 999px;
}
.mail-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

/* Grid */
.mail-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

.mail-card {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  padding: 18px; border-radius: 18px; cursor: pointer; text-align: left; font-family: inherit;
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.03) 40%, transparent 64%),
    var(--surface-1);
  border: 1px solid var(--border);
  transition: border-color 0.2s ease, transform 0.16s ease;
}
:root:not([data-theme="light"]) .mail-card {
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.26) 0%, rgba(34,197,94,0.08) 42%, transparent 66%),
    var(--surface-1);
}
.mail-card:hover { border-color: var(--accent-border); transform: translateY(-3px); }

.mail-medal {
  width: 52px; height: 52px; border-radius: 15px; flex-shrink: 0; overflow: hidden;
  background: #0b0f0e; display: flex; align-items: center; justify-content: center;
}
.mail-medal img { width: 100%; height: 100%; object-fit: cover; display: block; }

.mail-name {
  display: flex; align-items: center; gap: 7px; width: 100%;
  font-size: 0.95rem; font-weight: 700; color: var(--t1); line-height: 1.3;
}
.mail-go { color: var(--t4); opacity: 0; margin-left: auto; transform: translateX(-4px); transition: opacity 0.18s ease, transform 0.18s ease, color 0.18s ease; }
.mail-card:hover .mail-go { opacity: 1; transform: translateX(0); color: var(--accent); }

@media (max-width: 1100px) { .mail-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 760px)  { .mail-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 420px)  { .mail-grid { grid-template-columns: 1fr; } }
</style>
