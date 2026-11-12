<!-- src/views/ToolsView.vue → Generator -->
<template>
  <div class="gen">

    <!-- Mock-up warning -->
    <div class="gen-warn">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p>Everything these tools produces is a mock-up — a template generated from the values you type. It is not a real record, and it is not issued or verified by any bank, carrier, retailer or other organisation it may resemble. Use it for design, demos, testing and your own genuine records. Presenting it to anyone as real breaks our terms and, in most places, the law.</p>
    </div>

    <!-- Header -->
    <div class="gen-head">
      <h1 class="gen-title">Generator <span class="gen-badge">TOOLS</span></h1>
      <p class="gen-sub">Fill in the details and generate branded documents.</p>
    </div>

    <!-- Grid -->
    <div class="gen-grid">
      <button v-for="s in services" :key="s.title" class="gen-card" @click="open(s)">
        <span class="gen-medal"><img :src="s.img" :alt="s.title" loading="lazy" /></span>
        <span class="gen-name">
          {{ s.title }}
          <svg class="gen-go" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { info } = useToast()

const PIC = import.meta.glob('../assets/1000880*.png', { eager: true, import: 'default' })
const pic = (n) => PIC[`../assets/1000880${n}.png`]

const services = [
  { title: 'Crypto Receipts', route: '/tools/crypto-receipts', img: pic('314') },
  { title: 'Bank Receipt',    route: '/tools/bank-receipt',    img: pic('313') },
  { title: 'Store Receipt',       route: '/tools/store-receipt',  img: pic('315') },
]

function open(s) {
  if (s.route) router.push(s.route)
  else info(`${s.title} coming soon`, 'This generator is not available yet — check back shortly.')
}
</script>

<style scoped>
.gen { display: flex; flex-direction: column; gap: 18px; }

/* Warning */
.gen-warn {
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(234,179,8,0.07); border: 1px solid rgba(234,179,8,0.32);
  border-radius: 12px; padding: 13px 16px;
}
.gen-warn svg { color: #a16207; flex-shrink: 0; margin-top: 1px; }
.gen-warn p { margin: 0; font-size: 0.78rem; color: var(--t2); line-height: 1.55; }

/* Header */
.gen-head { display: flex; flex-direction: column; gap: 6px; }
.gen-title {
  display: flex; align-items: center; gap: 10px; margin: 0;
  font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em;
}
.gen-badge {
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.05em;
  color: #16a34a; background: rgba(22,163,74,0.1);
  border: 1px solid rgba(22,163,74,0.35); padding: 3px 10px; border-radius: 999px;
}
.gen-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

/* Grid */
.gen-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

.gen-card {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  padding: 18px; border-radius: 18px; cursor: pointer; text-align: left; font-family: inherit;
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.03) 40%, transparent 64%),
    var(--surface-1);
  border: 1px solid var(--border);
  transition: border-color 0.2s ease, transform 0.16s ease;
}
:root:not([data-theme="light"]) .gen-card {
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.26) 0%, rgba(34,197,94,0.08) 42%, transparent 66%),
    var(--surface-1);
}

.gen-medal {
  width: 52px; height: 52px; border-radius: 15px; flex-shrink: 0; overflow: hidden;
  background: #0b0f0e; display: flex; align-items: center; justify-content: center;
}
.gen-medal img { width: 100%; height: 100%; object-fit: cover; display: block; }

.gen-name {
  display: flex; align-items: center; gap: 7px; width: 100%;
  font-size: 0.95rem; font-weight: 700; color: var(--t1); line-height: 1.3;
}
.gen-go { color: var(--t4); opacity: 0; margin-left: auto; transform: translateX(-4px); transition: opacity 0.18s ease, transform 0.18s ease, color 0.18s ease; }
.gen-card:hover .gen-go { opacity: 1; transform: translateX(0); color: var(--accent); }

@media (max-width: 1024px) { .gen-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 760px)  { .gen-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 440px)  { .gen-grid { grid-template-columns: 1fr; } }
</style>
