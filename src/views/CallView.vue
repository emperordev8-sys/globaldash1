<!-- src/views/CallView.vue -->
<template>
  <div class="call">

    <!-- Header -->
    <div class="call-head">
      <h1 class="call-title">Call <span class="call-badge">TOOLS</span></h1>
      <p class="call-sub">Place calls with your own caller ID, voice and language.</p>
    </div>

    <!-- Grid -->
    <div class="call-grid">
      <button v-for="t in tiles" :key="t.title" class="call-card" @click="open(t)">
        <span class="call-medal"><img :src="t.img" :alt="t.title" loading="lazy" /></span>
        <span class="call-name">
          {{ t.title }}
          <span v-if="t.isNew" class="call-new">NEW</span>
          <svg v-if="t.locked" class="call-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <svg v-else class="call-go" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
        <span v-if="t.locked" class="call-upgrade">UPGRADE</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const PIC = import.meta.glob('../assets/1000880*.png', { eager: true, import: 'default' })
const pic = (n) => PIC[`../assets/1000880${n}.png`]

const tiles = [
  { title: 'Custom Caller', img: pic('307'), route: '/tools/custom-caller' },
  { title: 'Voice Notes',   img: pic('308'), isNew: true, route: '/tools/voice-notes' },
]

function open(t) { router.push(t.route) }
</script>

<style scoped>
.call { display: flex; flex-direction: column; gap: 18px; }

/* Header */
.call-head { display: flex; flex-direction: column; gap: 6px; }
.call-title {
  display: flex; align-items: center; gap: 10px; margin: 0;
  font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em;
}
.call-badge {
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.05em;
  color: #16a34a; background: rgba(22,163,74,0.1);
  border: 1px solid rgba(22,163,74,0.35); padding: 3px 10px; border-radius: 999px;
}
.call-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

/* Grid */
.call-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 256px)); gap: 16px; }

.call-card {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  padding: 18px; border-radius: 18px; cursor: pointer; text-align: left; font-family: inherit;
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.03) 40%, transparent 64%),
    var(--surface-1);
  border: 1px solid var(--border);
  transition: border-color 0.2s ease, transform 0.16s ease;
}
:root:not([data-theme="light"]) .call-card {
  background:
    radial-gradient(95% 150% at 0% 50%, rgba(34,197,94,0.26) 0%, rgba(34,197,94,0.08) 42%, transparent 66%),
    var(--surface-1);
}
.call-card:hover { border-color: var(--accent-border); transform: translateY(-3px); }

.call-medal {
  width: 52px; height: 52px; border-radius: 15px; flex-shrink: 0; overflow: hidden;
  background: #0b0f0e; display: flex; align-items: center; justify-content: center;
}
.call-medal img { width: 100%; height: 100%; object-fit: cover; display: block; }

.call-name {
  display: flex; align-items: center; gap: 7px; width: 100%;
  font-size: 0.95rem; font-weight: 700; color: var(--t1); line-height: 1.3;
}
.call-new {
  font-size: 0.56rem; font-weight: 800; letter-spacing: 0.03em; color: #fff;
  background: #ef4444; padding: 2px 6px; border-radius: 999px;
}
.call-lock { color: var(--t3); opacity: 0.8; }
.call-go { color: var(--accent); margin-left: auto; transition: transform 0.18s ease; }
.call-card:hover .call-go { transform: translateX(3px); }

.call-upgrade {
  margin-top: 2px;
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.08em;
  color: var(--t3);
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  padding: 6px 12px; border-radius: 8px;
  transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}
.call-card:hover .call-upgrade {
  color: #16a34a; background: rgba(22,163,74,0.08); border-color: rgba(22,163,74,0.35);
}

@media (max-width: 560px) { .call-grid { grid-template-columns: 1fr; } }
</style>
