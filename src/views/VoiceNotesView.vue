<!-- src/views/VoiceNotesView.vue -->
<template>
  <div class="vn">

    <!-- Header -->
    <div class="vn-head">
      <div class="vn-head__text">
        <h1 class="vn-title">Voice Notes</h1>
        <p class="vn-sub">Type it, pick a voice, send it as a voice note.</p>
      </div>
      <div class="vn-head__right">
        <span class="vn-balance">Balance <strong>{{ balance }}</strong></span>
        <button class="vn-buy" @click="showBuy = true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Buy minutes
        </button>
      </div>
    </div>

    <!-- Promo banner -->
    <div class="vn-promo">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
      <p>Your <strong>Premium</strong> plan gives you <strong>10% off</strong> on this service.</p>
    </div>

    <div class="vn-grid">

      <!-- Composer -->
      <div class="vn-card vn-composer">
        <label class="vn-upload" @dragover.prevent @drop.prevent="onDrop">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload audio or video
          <input type="file" accept="audio/*,video/*" class="vn-file" @change="onUpload" />
        </label>
        <p class="vn-hint">Free — we write down what it says, you edit it, then say it in any voice. Video is fine; only the speech is uploaded.</p>

        <textarea v-model="text" class="vn-textarea" placeholder="Type what the voice should say..." rows="6"></textarea>

        <div class="vn-meta">
          <span>{{ text.length }} characters</span>
          <span class="vn-meta__right">≈{{ estSecs }}s · {{ balance }} left</span>
        </div>

        <label class="vn-label">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>
          Speak it in
        </label>
        <select v-model="lang" class="vn-select">
          <option v-for="l in languages" :key="l">{{ l }}</option>
        </select>

        <label class="vn-label">Voice</label>
        <select v-model="voice" class="vn-select">
          <option v-for="v in voices" :key="v">{{ v }}</option>
        </select>

        <button class="vn-generate" :disabled="!text.trim()" @click="generate">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.9L19 9.8l-4.9 1.9L12 17l-1.9-5.3L5 9.8l5.1-1.9z"/></svg>
          Generate voice note
        </button>
      </div>

      <!-- My voices -->
      <div class="vn-card vn-voices">
        <div class="vn-voices__head">
          <h2 class="vn-voices__title">My voices</h2>
          <button class="vn-clone" @click="soon('Clone a voice')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
            Clone a voice
          </button>
        </div>
        <p class="vn-voices__note">₦900.00 per voice for 30 days. Each voice is paid for separately and renews on its own date. No plan needed.</p>
        <div class="vn-clonebox" @click="soon('Clone a voice')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
          <span>Clone your voice and your notes sound like you.</span>
        </div>
      </div>
    </div>

    <!-- Your notes -->
    <h2 class="vn-notes-title">Your notes</h2>
    <div v-if="notes.length === 0" class="vn-empty">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="10" x2="4" y2="14"/><line x1="8" y1="6" x2="8" y2="18"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="16" y1="7" x2="16" y2="17"/><line x1="20" y1="10" x2="20" y2="14"/></svg>
      <span>Nothing yet. Your notes appear here and are kept for 7 days.</span>
    </div>
    <div v-else class="vn-notelist">
      <div v-for="n in notes" :key="n.id" class="vn-note">
        <button class="vn-note__play" aria-label="Play">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
        </button>
        <div class="vn-note__body">
          <p class="vn-note__text">{{ n.text }}</p>
          <span class="vn-note__meta">{{ n.voice }} · {{ n.lang }} · ≈{{ n.secs }}s · {{ n.when }}</span>
        </div>
        <button class="vn-note__del" @click="removeNote(n.id)" aria-label="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Buy minutes modal -->
    <Transition name="vn-fade">
      <div v-if="showBuy" class="vnb-backdrop" @click.self="showBuy = false">
        <div class="vnb-modal">
          <div class="vnb-head">
            <div>
              <h2 class="vnb-title">Buy voice note minutes</h2>
              <p class="vnb-sub">Minutes are added to your Voice Notes balance and never expire. Any free minutes included in your plan are always spent first.</p>
            </div>
            <button class="vnb-close" @click="showBuy = false" aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="vnb-body">
            <label class="vnb-label">How many minutes?</label>
            <input v-model.number="minutes" type="number" min="5" class="vnb-input" />
            <div class="vnb-picks">
              <button v-for="m in [15, 30, 60, 120]" :key="m" class="vnb-pick" :class="{ 'vnb-pick--on': minutes === m }" @click="minutes = m">{{ m }} min</button>
            </div>
            <p class="vnb-hint">Minimum 5 minutes.</p>

            <div class="vnb-summary">
              <div class="vnb-row">
                <span>Minutes</span>
                <span class="vnb-row__val">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>
                  {{ safeMinutes }}
                </span>
              </div>
              <div class="vnb-row">
                <span>Price per minute</span>
                <span class="vnb-row__val"><strong>₦900.00</strong> <s>₦1,000.00</s></span>
              </div>
              <div class="vnb-row">
                <span>Plan discount</span>
                <span class="vnb-discount">10% off</span>
              </div>
              <div class="vnb-divider"></div>
              <div class="vnb-row vnb-row--total">
                <span>Total</span>
                <span>{{ money(total) }}</span>
              </div>
              <p class="vnb-charged">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                Charged to your wallet balance.
              </p>
            </div>
          </div>

          <div class="vnb-foot">
            <button class="vnb-cancel" @click="showBuy = false">Cancel</button>
            <button class="vnb-pay" @click="pay">Pay {{ money(total) }}</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast.js'

const { success, info } = useToast()

const balance = '10m 0s'
const text = ref('')
const lang = ref('English')
const voice = ref('E-Girl')
const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Arabic', 'Hindi']
const voices = ['E-Girl', 'James (Male)', 'Sophia (Female)', 'Narrator', 'Deep Male', 'Soft Female']

const estSecs = computed(() => Math.max(1, Math.round(text.value.length / 14)))

const notes = ref([])
function generate() {
  if (!text.value.trim()) return
  notes.value.unshift({
    id: Date.now(),
    text: text.value.trim(),
    voice: voice.value,
    lang: lang.value,
    secs: estSecs.value,
    when: 'just now',
  })
  success('Voice note generated', `Said in "${voice.value}". It's in Your notes below.`)
  text.value = ''
}
function removeNote(id) {
  notes.value = notes.value.filter(n => n.id !== id)
}
function onUpload(e) {
  if (e.target.files?.[0]) info('Transcribing…', 'We will write down the speech so you can edit it.')
}
function onDrop(e) {
  if (e.dataTransfer.files?.[0]) info('Transcribing…', 'We will write down the speech so you can edit it.')
}
function soon(label) {
  info(`${label} coming soon`, 'This option is not available yet — check back shortly.')
}

/* Buy minutes */
const showBuy = ref(false)
const minutes = ref(5)
const PRICE_PER_MIN = 900
const safeMinutes = computed(() => Math.max(5, Math.floor(Number(minutes.value) || 0)))
const total = computed(() => safeMinutes.value * PRICE_PER_MIN)
function money(n) {
  return '₦' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function pay() {
  success('Minutes added', `${safeMinutes.value} minutes added to your Voice Notes balance.`)
  showBuy.value = false
}
</script>

<style scoped>
.vn { display: flex; flex-direction: column; gap: 16px; }

/* Header */
.vn-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.vn-head__text { display: flex; flex-direction: column; gap: 6px; }
.vn-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.vn-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }
.vn-head__right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.vn-balance {
  font-size: 0.8rem; font-weight: 600; color: var(--t2);
  padding: 9px 14px; border-radius: 999px; background: var(--glass-hover); border: 1px solid var(--border-soft);
}
.vn-balance strong { color: var(--t1); font-weight: 800; }
.vn-buy {
  display: inline-flex; align-items: center; gap: 7px; height: 40px; padding: 0 18px; border-radius: 11px; cursor: pointer;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; border: none;
  font-family: inherit; font-size: 0.84rem; font-weight: 700; 
  transition: transform 0.15s ease;
}
.vn-buy:hover { transform: translateY(-2px); }

/* Promo */
.vn-promo {
  display: flex; align-items: center; gap: 10px;
  background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.22); border-radius: 12px; padding: 13px 16px;
}
.vn-promo svg { color: #16a34a; flex-shrink: 0; }
.vn-promo p { margin: 0; font-size: 0.84rem; color: var(--t2); }
.vn-promo strong { color: #16a34a; font-weight: 800; }

/* Grid */
.vn-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; align-items: start; }
.vn-card { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 20px; }

/* Composer */
.vn-composer { display: flex; flex-direction: column; gap: 12px; }
.vn-upload {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; position: relative;
  height: 40px; padding: 0 16px; border-radius: 10px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.82rem; font-weight: 700;
}
.vn-upload:hover { border-color: var(--accent-border); }
.vn-file { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.vn-hint { margin: 0; font-size: 0.76rem; color: var(--t3); line-height: 1.5; }
.vn-textarea {
  width: 100%; border-radius: 12px; padding: 14px; resize: vertical; min-height: 130px;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.9rem; line-height: 1.6; outline: none;
}
.vn-textarea:focus { border-color: var(--accent); }
.vn-meta { display: flex; align-items: center; justify-content: space-between; font-size: 0.76rem; color: var(--t3); }
.vn-meta__right { color: #16a34a; font-weight: 600; }
.vn-label { display: inline-flex; align-items: center; gap: 7px; font-size: 0.82rem; font-weight: 800; color: var(--t1); margin-top: 4px; }
.vn-label svg { color: var(--t3); }
.vn-select {
  width: 100%; height: 44px; padding: 0 14px; border-radius: 11px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.88rem; outline: none;
}
.vn-select:focus { border-color: var(--accent); }
.vn-generate {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; margin-top: 6px;
  height: 44px; padding: 0 20px; border-radius: 11px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.86rem; font-weight: 700; 
  transition: transform 0.15s ease, opacity 0.2s ease;
}
.vn-generate:hover:not(:disabled) { transform: translateY(-2px); }
.vn-generate:disabled { opacity: 0.55; cursor: not-allowed; }

/* My voices */
.vn-voices { display: flex; flex-direction: column; gap: 12px; }
.vn-voices__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.vn-voices__title { margin: 0; font-size: 1rem; font-weight: 800; color: var(--t1); }
.vn-clone {
  display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 10px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.78rem; font-weight: 700;
}
.vn-clone:hover { color: var(--t1); border-color: var(--accent-border); }
.vn-voices__note { margin: 0; font-size: 0.78rem; color: var(--t2); line-height: 1.55; }
.vn-clonebox {
  display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; cursor: pointer;
  padding: 28px 18px; border-radius: 14px; border: 1.5px dashed var(--border); color: var(--t3);
  font-size: 0.8rem; transition: border-color 0.18s ease, color 0.18s ease;
}
.vn-clonebox:hover { border-color: var(--accent-border); color: var(--t2); }

/* Your notes */
.vn-notes-title { margin: 6px 0 0; font-size: 1.1rem; font-weight: 800; color: var(--t1); }
.vn-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;
  padding: 40px 20px; border-radius: 16px; border: 1.5px dashed var(--border); color: var(--t3); font-size: 0.84rem;
}
.vn-notelist { display: flex; flex-direction: column; gap: 10px; }
.vn-note {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  background: var(--bg); border: 1px solid var(--t4); border-radius: 14px; 
}
.vn-note__play {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; cursor: pointer; border: none;
  background: rgba(22,163,74,0.12); color: #16a34a; display: flex; align-items: center; justify-content: center;
}
.vn-note__play:hover { background: rgba(22,163,74,0.2); }
.vn-note__body { flex: 1; min-width: 0; }
.vn-note__text { margin: 0; font-size: 0.86rem; color: var(--t1); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vn-note__meta { font-size: 0.72rem; color: var(--t3); }
.vn-note__del {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0; cursor: pointer;
  background: transparent; border: 1px solid var(--border); color: var(--t3);
  display: flex; align-items: center; justify-content: center;
}
.vn-note__del:hover { color: #ef4444; border-color: rgba(239,68,68,0.4); }

@media (max-width: 860px) {
  .vn-grid { grid-template-columns: 1fr; }
  .vn-head { flex-direction: column; align-items: stretch; }
  .vn-head__right { justify-content: space-between; }
}

/* ══════════════════════════════════
   BUY MINUTES MODAL
   ══════════════════════════════════ */
.vnb-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(8,15,12,0.55); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.vnb-modal {
  width: 100%; max-width: 480px; max-height: 92vh;
  background: var(--bg); border: 1px solid var(--border); border-radius: 20px;
   display: flex; flex-direction: column; overflow: hidden;
  animation: vnb-pop 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes vnb-pop { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: none; } }

.vnb-head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;
  padding: 22px 24px 16px; border-bottom: 1px solid var(--border-soft); flex-shrink: 0;
}
.vnb-title { margin: 0 0 6px; font-size: 1.15rem; font-weight: 800; color: var(--t1); }
.vnb-sub { margin: 0; font-size: 0.8rem; color: var(--t2); line-height: 1.5; }
.vnb-close {
  width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0; cursor: pointer;
  background: var(--glass-hover); border: 1px solid transparent; color: var(--t3);
  display: flex; align-items: center; justify-content: center; transition: color 0.16s, border-color 0.16s;
}
.vnb-close:hover { color: var(--t1); border-color: var(--accent-border); }

.vnb-body { padding: 20px 24px; overflow-y: auto; }
.vnb-label { display: block; font-size: 0.86rem; font-weight: 800; color: var(--t1); margin-bottom: 8px; }
.vnb-input {
  width: 100%; height: 46px; padding: 0 14px; border-radius: 11px;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.95rem; font-weight: 600; outline: none;
}
.vnb-input:focus { border-color: var(--accent); }
.vnb-picks { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.vnb-pick {
  height: 36px; padding: 0 14px; border-radius: 9px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.8rem; font-weight: 600;
}
.vnb-pick:hover { color: var(--t1); border-color: var(--t3); }
.vnb-pick--on { color: #16a34a; border-color: var(--accent); background: rgba(22,163,74,0.08); }
.vnb-hint { margin: 10px 0 0; font-size: 0.75rem; color: var(--t3); }

.vnb-summary {
  margin-top: 18px; padding: 16px 18px; border-radius: 14px;
  background: var(--glass); border: 1px solid var(--border-soft);
}
.vnb-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: var(--t2); padding: 5px 0; }
.vnb-row__val { display: inline-flex; align-items: center; gap: 6px; color: var(--t1); font-weight: 600; }
.vnb-row__val s { color: var(--t3); font-weight: 400; margin-left: 4px; }
.vnb-row__val strong { color: var(--t1); }
.vnb-discount { color: #16a34a; font-weight: 700; }
.vnb-divider { height: 1px; background: var(--border-soft); margin: 10px 0; }
.vnb-row--total { font-size: 1rem; }
.vnb-row--total span:first-child { color: var(--t1); font-weight: 700; }
.vnb-row--total span:last-child { color: var(--t1); font-weight: 800; }
.vnb-charged { display: flex; align-items: center; gap: 7px; margin: 12px 0 0; font-size: 0.76rem; color: var(--t3); }

.vnb-foot {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 14px 24px; border-top: 1px solid var(--border-soft); flex-shrink: 0;
}
.vnb-cancel {
  height: 42px; padding: 0 18px; border-radius: 11px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.84rem; font-weight: 700;
}
.vnb-cancel:hover { color: var(--t1); border-color: var(--t3); }
.vnb-pay {
  height: 42px; padding: 0 22px; border-radius: 11px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.86rem; font-weight: 700;
   transition: transform 0.12s ease;
}
.vnb-pay:hover { transform: translateY(-1px); }

.vn-fade-enter-active, .vn-fade-leave-active { transition: opacity 0.2s ease; }
.vn-fade-enter-from, .vn-fade-leave-to { opacity: 0; }
</style>
