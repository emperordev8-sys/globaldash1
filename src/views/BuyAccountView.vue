<!-- src/views/BuyAccountView.vue -->
<template>
  <div class="ba">

    <!-- Header -->
    <div class="ba-head">
      <div class="ba-head__text">
        <h1 class="ba-title">Buy Account</h1>
        <p class="ba-sub">Ready-made, verified accounts — delivered to you instantly after payment.</p>
      </div>
      <button class="ba-notify-btn" @click="showNotify = true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Notify me
      </button>
    </div>

    <!-- Category chips -->
    <div class="ba-cats">
      <button v-for="c in categories" :key="c" class="ba-cat" :class="{ 'ba-cat--on': category === c }" @click="category = c">{{ c }}</button>
    </div>

    <!-- Empty state -->
    <div class="ba-empty">
      <span class="ba-empty__icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14h3"/>
        </svg>
      </span>
      <p class="ba-empty__title">No accounts in stock right now</p>
      <p class="ba-empty__desc">New stock is posted regularly. Get notified the moment fresh accounts drop so you never miss one.</p>
      <button class="ba-empty__btn" @click="showNotify = true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Notify me when available
      </button>
    </div>

    <!-- Notify modal -->
    <Transition name="ba-fade">
      <div v-if="showNotify" class="ba-backdrop" @click.self="showNotify = false">
        <div class="ba-modal">
          <div class="ba-modal__head">
            <div>
              <h2 class="ba-modal__title">Notify me when available</h2>
              <p class="ba-modal__sub">We'll let you know the moment new accounts are posted.</p>
            </div>
            <button class="ba-modal__close" @click="showNotify = false" aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="ba-modal__body">
            <p class="ba-modal__q">How should we reach you?</p>
            <button v-for="opt in channels" :key="opt.value" class="ba-opt" :class="{ 'ba-opt--on': channel === opt.value }" @click="channel = opt.value">
              <span class="ba-radio" :class="{ 'ba-radio--on': channel === opt.value }"></span>
              <span class="ba-opt__text">
                <span class="ba-opt__name">{{ opt.name }}</span>
                <span class="ba-opt__desc">{{ opt.desc }}</span>
              </span>
            </button>
          </div>

          <div class="ba-modal__foot">
            <button class="ba-cancel" @click="showNotify = false">Cancel</button>
            <button class="ba-confirm" @click="confirmNotify">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Notify me
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast.js'

const { success } = useToast()

const categories = ['All', 'Social', 'Email', 'Crypto', 'Gaming', 'Streaming']
const category = ref('All')

const channels = [
  { value: 'email', name: 'Email', desc: 'Sent to your account email address' },
  { value: 'telegram', name: 'Telegram bot', desc: 'Requires a linked Telegram' },
  { value: 'both', name: 'Both', desc: 'Email and Telegram bot' },
]
const showNotify = ref(false)
const channel = ref('email')

function confirmNotify() {
  const label = channels.find(c => c.value === channel.value)?.name || 'Email'
  success('You\'re on the list', `We'll reach you by ${label} the moment new accounts drop.`)
  showNotify.value = false
}
</script>

<style scoped>
.ba { display: flex; flex-direction: column; gap: 16px; }

/* Header */
.ba-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.ba-head__text { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.ba-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.ba-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }
.ba-notify-btn {
  display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;
  height: 40px; padding: 0 16px; border-radius: 11px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.82rem; font-weight: 700;
  transition: color 0.16s ease, border-color 0.16s ease;
}
.ba-notify-btn:hover { color: var(--t1); border-color: var(--accent-border); }

/* Categories */
.ba-cats { display: flex; gap: 8px; flex-wrap: wrap; }
.ba-cat {
  height: 34px; padding: 0 15px; border-radius: 999px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.8rem; font-weight: 600;
}
.ba-cat:hover { color: var(--t1); border-color: var(--t3); }
.ba-cat--on { color: #fff; background: #16a34a; border-color: #16a34a; }

/* Empty state */
.ba-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;
  padding: 56px 24px; border-radius: 18px;
  background: var(--bg); border: 1.5px dashed var(--border); 
}
.ba-empty__icon {
  width: 60px; height: 60px; border-radius: 16px; margin-bottom: 4px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(22,163,74,0.1); color: #16a34a;
}
.ba-empty__title { margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--t1); }
.ba-empty__desc { margin: 0; font-size: 0.84rem; color: var(--t3); line-height: 1.55; max-width: 380px; }
.ba-empty__btn {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 8px;
  height: 44px; padding: 0 20px; border-radius: 12px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.86rem; font-weight: 700; 
  transition: transform 0.15s ease;
}
.ba-empty__btn:hover { transform: translateY(-2px); }

/* Modal */
.ba-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(8,15,12,0.55); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.ba-modal {
  width: 100%; max-width: 460px; max-height: 92vh;
  background: var(--bg); border: 1px solid var(--border); border-radius: 20px;
   display: flex; flex-direction: column; overflow: hidden;
  animation: ba-pop 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes ba-pop { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: none; } }
.ba-modal__head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;
  padding: 22px 24px 16px; border-bottom: 1px solid var(--border-soft); flex-shrink: 0;
}
.ba-modal__title { margin: 0 0 6px; font-size: 1.12rem; font-weight: 800; color: var(--t1); }
.ba-modal__sub { margin: 0; font-size: 0.8rem; color: var(--t2); line-height: 1.5; }
.ba-modal__close {
  width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0; cursor: pointer;
  background: var(--glass-hover); border: 1px solid transparent; color: var(--t3);
  display: flex; align-items: center; justify-content: center; transition: color 0.16s, border-color 0.16s;
}
.ba-modal__close:hover { color: var(--t1); border-color: var(--accent-border); }

.ba-modal__body { padding: 18px 24px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
.ba-modal__q { margin: 0 0 2px; font-size: 0.84rem; font-weight: 800; color: var(--t1); }
.ba-opt {
  display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer;
  padding: 14px 16px; border-radius: 13px; background: var(--bg);
  border: 1.5px solid var(--border); font-family: inherit;
  transition: border-color 0.16s ease, background 0.16s ease;
}
.ba-opt:hover { border-color: var(--t3); }
.ba-opt--on { border-color: var(--accent); background: rgba(22,163,74,0.06); }
.ba-radio {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
  border: 2px solid var(--border); position: relative; transition: border-color 0.16s ease;
}
.ba-radio--on { border-color: #16a34a; }
.ba-radio--on::after {
  content: ''; position: absolute; inset: 3px; border-radius: 50%; background: #16a34a;
}
.ba-opt__text { display: flex; flex-direction: column; gap: 2px; }
.ba-opt__name { font-size: 0.88rem; font-weight: 700; color: var(--t1); }
.ba-opt__desc { font-size: 0.76rem; color: var(--t3); }

.ba-modal__foot {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 14px 24px; border-top: 1px solid var(--border-soft); flex-shrink: 0;
}
.ba-cancel {
  height: 42px; padding: 0 18px; border-radius: 11px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.84rem; font-weight: 700;
}
.ba-cancel:hover { color: var(--t1); border-color: var(--t3); }
.ba-confirm {
  display: inline-flex; align-items: center; gap: 7px;
  height: 42px; padding: 0 20px; border-radius: 11px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.86rem; font-weight: 700;
   transition: transform 0.12s ease;
}
.ba-confirm:hover { transform: translateY(-1px); }

.ba-fade-enter-active, .ba-fade-leave-active { transition: opacity 0.2s ease; }
.ba-fade-enter-from, .ba-fade-leave-to { opacity: 0; }

@media (max-width: 560px) {
  .ba-head { flex-direction: column; align-items: stretch; }
}
</style>
