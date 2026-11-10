<!-- src/views/CustomCallerView.vue -->
<template>
  <div class="cc">

    <!-- Header -->
    <div class="cc-head">
      <div class="cc-head__text">
        <h1 class="cc-title">Custom Caller</h1>
        <p class="cc-sub">Place calls with voice replacement, prompted AI conversation, scripted voices, or live-operator typing.</p>
      </div>
      <button class="cc-refresh" @click="refresh">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        Refresh
      </button>
    </div>

    <!-- Promo -->
    <div class="cc-promo">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      <p>Your <strong>Premium</strong> plan gives you <strong>10% off</strong> on this service.</p>
    </div>

    <!-- Stats -->
    <div class="cc-stats">
      <div class="cc-stat">
        <span class="cc-stat__label">PLAN FREE TIME REMAINING</span>
        <span class="cc-stat__val">{{ fmtMin(planFreeSecs) }}</span>
        <span class="cc-stat__note">Resets monthly. <span class="cc-link" @click="$router.push('/billing')">Upgrade your plan for more.</span></span>
      </div>
      <div class="cc-stat">
        <div class="cc-stat__row">
          <span class="cc-stat__label">YOUR MINUTES</span>
          <button class="cc-buy" @click="openBuy">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Buy minutes
          </button>
        </div>
        <span class="cc-stat__val">{{ fmtMin(yourMinutesSecs) }}</span>
        <span class="cc-stat__note">Used after plan minutes. Never expire.</span>
      </div>
      <div class="cc-stat">
        <span class="cc-stat__label">PRICE PER MINUTE</span>
        <span class="cc-stat__val">{{ money(pricePerMin) }} <s class="cc-stat__old">{{ money(origPerMin) }}</s></span>
        <span class="cc-stat__note">10% off with your plan · ≈ $0.900/min</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="cc-tabs">
      <button v-for="t in tabs" :key="t" class="cc-tab" :class="{ 'cc-tab--on': tab === t }" @click="tab = t">{{ t }}</button>
    </div>

    <!-- Form -->
    <div class="cc-card">
      <!-- Phone row -->
      <div class="cc-phonegrid">
        <div class="cc-field">
          <label class="cc-label">Recipient number</label>
          <div class="cc-phonerow">
            <select v-model="recipientCountry" class="cc-input cc-country">
              <option v-for="c in countries" :key="c.code" :value="c">{{ c.code.toLowerCase() }} {{ c.dial }} · {{ c.name }}</option>
            </select>
            <input v-model="recipientNum" class="cc-input" placeholder="5551234567" inputmode="tel" />
          </div>
          <p class="cc-hint">Pick the country, then type the local number — we add the code and drop a leading 0.</p>
        </div>
        <div class="cc-field">
          <label class="cc-label">Caller ID (shown to recipient)</label>
          <div class="cc-phonerow">
            <select v-model="callerCountry" class="cc-input cc-country">
              <option v-for="c in countries" :key="c.code" :value="c">{{ c.code.toLowerCase() }} {{ c.dial }} · {{ c.name }}</option>
            </select>
            <input v-model="callerNum" class="cc-input" placeholder="5551234567" inputmode="tel" />
          </div>
          <p class="cc-hint">Shown to the recipient · Pick the country, then type the local number — we add the code and drop a leading 0.</p>
        </div>
      </div>

      <!-- Tab-specific -->
      <template v-if="tab === 'Conversational'">
        <div class="cc-field">
          <label class="cc-label">AI goal / prompt</label>
          <textarea v-model="aiPrompt" rows="4" class="cc-textarea" placeholder="e.g. You are confirming a delivery appointment. Be polite and confirm the address and time."></textarea>
        </div>
        <div class="cc-field">
          <label class="cc-label">Opening line (optional)</label>
          <input v-model="openingLine" class="cc-input" placeholder="e.g. Hello, am I speaking with John? This is Sarah from DHL." />
        </div>
      </template>
      <template v-else-if="tab === 'Script'">
        <div class="cc-field">
          <label class="cc-label">Script</label>
          <textarea v-model="scriptText" rows="6" class="cc-textarea" placeholder="Type the full script. It will be read aloud by the selected voice on the call."></textarea>
        </div>
      </template>
      <template v-else-if="tab === 'Live'">
        <div class="cc-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <p>In <strong>Live</strong> mode, once the call connects you type lines and they're spoken in real time via the selected voice.</p>
        </div>
        <div class="cc-field">
          <label class="cc-label">Live typing preset (optional)</label>
          <input v-model="livePreset" class="cc-input" placeholder="Type a default opener to say when the call connects..." />
        </div>
      </template>
      <template v-else-if="tab === 'OTP'">
        <div class="cc-field">
          <label class="cc-label">Service / company name</label>
          <input v-model="otpService" class="cc-input" placeholder="e.g. Global Bank" />
        </div>
        <div class="cc-field">
          <label class="cc-label">What to say</label>
          <textarea v-model="otpTemplate" rows="3" class="cc-textarea" placeholder="e.g. This is {service} security. Please read the code we just sent to confirm it's you."></textarea>
        </div>
      </template>
      <template v-else-if="tab === 'Request Info'">
        <div class="cc-field">
          <label class="cc-label">Information to request</label>
          <textarea v-model="requestInfo" rows="4" class="cc-textarea" placeholder="Describe what the call should ask the recipient to confirm or provide."></textarea>
        </div>
      </template>

      <!-- Voice -->
      <div class="cc-field">
        <div class="cc-section-label">VOICE</div>
        <div class="cc-voicerow">
          <select v-model="voice" class="cc-input">
            <option v-for="v in voices" :key="v" :value="v">{{ v }}</option>
          </select>
          <button class="cc-play" @click="previewVoice" :title="`Preview ${voice}`">
            <svg v-if="!playing" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
        </div>
      </div>

      <!-- Background tone -->
      <div class="cc-toggle-row">
        <div class="cc-toggle-text">
          <span class="cc-toggle-title">Background tone</span>
          <span class="cc-toggle-sub">Soft tone that fills quiet moments while you are not speaking. Off by default — turn it on for this call if you want it.</span>
        </div>
        <button class="cc-switch" :class="{ 'cc-switch--on': bgTone }" @click="bgTone = !bgTone" role="switch" :aria-checked="bgTone">
          <span class="cc-switch__knob"></span>
        </button>
      </div>

      <!-- Start call -->
      <div>
        <button class="cc-start" @click="startCall">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Start call
        </button>
        <p class="cc-hint cc-hint--mt">You'll speak live once the call connects — we'll ask for microphone access.</p>
      </div>
    </div>

    <!-- Telegram -->
    <div class="cc-tg">
      <div class="cc-tg__head">
        <div class="cc-tg__title">Prefer Telegram? Use our bot</div>
        <p class="cc-tg__sub">Every mode also runs inside our dedicated Telegram bot — set the recipient, caller ID, and voice there, then start the call. Your wag wallet is charged the same way.</p>
      </div>
      <div class="cc-tg__box" :class="{ 'cc-tg__box--linked': tgLinked }">
        <div>
          <div class="cc-tg__box-title">{{ tgLinked ? 'Telegram linked' : 'Link Telegram to use the bot' }}</div>
          <p class="cc-tg__box-sub">{{ tgLinked ? 'You can now place calls from our Telegram bot.' : 'Optional — link once to also place calls from our Telegram bot. Your wag wallet is charged the same way.' }}</p>
        </div>
        <button class="cc-tg__btn" @click="linkTelegram" :disabled="tgLinked">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          {{ tgLinked ? 'Linked' : 'Link Telegram' }}
        </button>
      </div>
    </div>

    <!-- Voice clones -->
    <div class="cc-clones">
      <div class="cc-clones__head">
        <div>
          <div class="cc-clones__title">My Voice Clones</div>
          <p class="cc-clones__sub">Persistent clones — reusable across every call mode until they expire, then kept but locked (reactivate any time). Paid clones cost ₦900.00 per 30 days.</p>
        </div>
        <button class="cc-clones__add" @click="addClone">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add clone
        </button>
      </div>
      <p v-if="!clones.length" class="cc-clones__empty">No voice clones yet — add one to reuse your voice across calls.</p>
      <div v-else class="cc-clones__list">
        <div v-for="(c, i) in clones" :key="i" class="cc-clone">
          <span class="cc-clone__ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
          </span>
          <span class="cc-clone__name">{{ c.name }}</span>
          <span class="cc-clone__badge">ACTIVE</span>
        </div>
      </div>
    </div>

    <!-- Recent calls -->
    <div class="cc-recent">
      <div class="cc-recent__list">
        <div v-for="c in pagedCalls" :key="c.id" class="cc-rec">
          <span class="cc-rec__status" :class="`cc-rec__status--${c.status}`">{{ c.status.toUpperCase() }}</span>
          <div class="cc-rec__info">
            <div class="cc-rec__num">{{ c.number }} <span class="cc-rec__cap">· {{ c.label }}</span></div>
            <div class="cc-rec__meta">{{ c.id }} · {{ c.date }}</div>
          </div>
          <div class="cc-rec__right">
            <span class="cc-rec__secs">{{ c.duration }}</span>
            <span class="cc-rec__min" :class="{ 'cc-rec__min--dim': c.billed === '—' }">{{ c.billed }}</span>
            <span v-if="c.note" class="cc-rec__note">{{ c.note }}</span>
          </div>
          <svg class="cc-rec__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
      <div class="cc-pager">
        <span class="cc-pager__count">{{ rangeStart }}-{{ rangeEnd }} of {{ calls.length }}</span>
        <div class="cc-pager__btns">
          <button class="cc-pager__btn" :disabled="page === 0" @click="page--">Previous</button>
          <button class="cc-pager__btn" :disabled="rangeEnd >= calls.length" @click="page++">Next</button>
        </div>
      </div>
    </div>

    <!-- Buy minutes modal -->
    <div v-if="showBuy" class="cc-overlay" @click.self="showBuy = false">
      <div class="cc-modal">
        <div class="cc-modal__head">
          <div>
            <div class="cc-modal__title">Buy call minutes</div>
            <p class="cc-modal__sub">Minutes are added to your Custom Caller balance and never expire. Your plan's free minutes are always used first.</p>
          </div>
          <button class="cc-x" @click="showBuy = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <label class="cc-modal__label">How many minutes?</label>
        <input v-model.number="buyMin" type="number" min="1" class="cc-input cc-modal__input" />
        <div class="cc-presets">
          <button v-for="p in [15, 30, 60, 120]" :key="p" class="cc-preset" :class="{ 'cc-preset--on': buyMin === p }" @click="buyMin = p">{{ p }} min</button>
        </div>
        <p class="cc-modal__min">Minimum 1 minutes.</p>

        <div class="cc-summary">
          <div class="cc-summary__row">
            <span>Minutes</span>
            <span class="cc-summary__mins"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {{ safeMin }}</span>
          </div>
          <div class="cc-summary__row">
            <span>Price per minute</span>
            <span>{{ money(pricePerMin) }} <s class="cc-stat__old">{{ money(origPerMin) }}</s></span>
          </div>
          <div class="cc-summary__row">
            <span>Plan discount</span>
            <span class="cc-summary__off">10% off</span>
          </div>
          <div class="cc-summary__row cc-summary__row--total">
            <span>Total</span>
            <span>{{ money(buyTotal) }}</span>
          </div>
          <div class="cc-summary__wallet"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><path d="M16 14h.01"/></svg> Wallet balance: {{ money(wallet) }}</div>
        </div>

        <div class="cc-modal__actions">
          <button class="cc-cancel" @click="showBuy = false">Cancel</button>
          <button class="cc-pay" @click="pay">Pay {{ money(buyTotal) }}</button>
        </div>
      </div>
    </div>

    <!-- Call modal -->
    <div v-if="callState" class="cc-overlay">
      <div class="cc-callmodal">
        <div class="cc-ring" v-if="callState === 'ringing'"><span></span><span></span><span></span></div>
        <div class="cc-avatar" :class="{ 'cc-avatar--live': callState === 'connected' }">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <div class="cc-callstatus">{{ callState === 'ringing' ? 'Ringing…' : 'Connected' }}</div>
        <div class="cc-callnum">{{ fullRecipient }}</div>
        <div class="cc-callcid">Showing as <strong>{{ fullCaller || 'Private number' }}</strong></div>
        <div v-if="callState === 'connected'" class="cc-calltimer">{{ fmtTimer(timer) }}</div>
        <div class="cc-callctrls">
          <button class="cc-ctrl" :class="{ 'cc-ctrl--on': muted }" @click="muted = !muted">{{ muted ? 'Unmute' : 'Mute' }}</button>
          <button class="cc-ctrl cc-ctrl--end" @click="endCall">End call</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useToast } from '../composables/useToast.js'

const { success, info, error } = useToast()
const money = (n) => '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtMin = (secs) => {
  const m = Math.floor(secs / 60), s = secs % 60
  if (m && s) return `${m}min ${s}secs`
  if (m) return `${m} min${m === 1 ? '' : 's'}`
  return `${s} secs`
}

const countries = [
  { code: 'US', dial: '+1',   name: 'United States' },
  { code: 'GB', dial: '+44',  name: 'United Kingdom' },
  { code: 'NG', dial: '+234', name: 'Nigeria' },
  { code: 'CA', dial: '+1',   name: 'Canada' },
  { code: 'DE', dial: '+49',  name: 'Germany' },
  { code: 'FR', dial: '+33',  name: 'France' },
  { code: 'IN', dial: '+91',  name: 'India' },
]
const tabs = ['Speak Myself', 'Conversational', 'Script', 'Live', 'OTP', 'Request Info']
const voices = [
  'Use my own voice (no replacement)',
  'James (Male)',
  'Rachel (Female)',
  'Alex (Neutral)',
  'Maria (Female)',
]

const tab = ref('Speak Myself')
const recipientCountry = ref(countries[0])
const recipientNum = ref('')
const callerCountry = ref(countries[0])
const callerNum = ref('')
const voice = ref(voices[0])
const playing = ref(false)
const bgTone = ref(false)
const aiPrompt = ref('')
const openingLine = ref('')
const scriptText = ref('')
const livePreset = ref('')
const otpService = ref('')
const otpTemplate = ref('')
const requestInfo = ref('')

const planFreeSecs = ref(60)
const yourMinutesSecs = ref(650)
const wallet = ref(64301.36)
const pricePerMin = 1207.00
const origPerMin = 1340.83

const tgLinked = ref(false)
const clones = ref([])

const normalize = (c, num) => num.trim() ? c.dial + ' ' + num.trim().replace(/^0+/, '') : ''
const fullRecipient = computed(() => normalize(recipientCountry.value, recipientNum.value))
const fullCaller = computed(() => normalize(callerCountry.value, callerNum.value))

function refresh() { success('Refreshed', 'Call history and balances are up to date.') }
function previewVoice() {
  if (voice.value.startsWith('Use my own')) { info('No preview', 'Your own voice has no preview.'); return }
  playing.value = true
  setTimeout(() => { playing.value = false }, 2500)
}
function linkTelegram() {
  tgLinked.value = true
  success('Telegram linked', 'You can now place calls from our Telegram bot.')
}
function addClone() {
  clones.value.unshift({ name: `Voice clone ${clones.value.length + 1}`, active: true })
  success('Voice clone added', 'Your clone is active and reusable across call modes.')
}

/* ── Buy minutes ── */
const showBuy = ref(false)
const buyMin = ref(1)
const safeMin = computed(() => Math.max(1, Math.floor(Number(buyMin.value) || 0)))
const buyTotal = computed(() => safeMin.value * pricePerMin)
function openBuy() { buyMin.value = 1; showBuy.value = true }
function pay() {
  if (buyTotal.value > wallet.value) { error('Insufficient balance', 'Top up your wallet to buy these minutes.'); return }
  wallet.value -= buyTotal.value
  yourMinutesSecs.value += safeMin.value * 60
  success('Minutes added', `${safeMin.value} minute${safeMin.value === 1 ? '' : 's'} added to your Custom Caller balance.`)
  showBuy.value = false
}

/* ── Recent calls ── */
const calls = ref([
  { id: 'CALL-1192', status: 'failed',    number: '+2347051052736', label: 'capture', date: '9/1/2026, 4:04:24 PM', duration: '0 secs',      billed: '—' },
  { id: 'CALL-1191', status: 'ended',     number: '+2347051052736', label: 'capture', date: '9/1/2026, 3:59:41 PM', duration: '38 secs',     billed: '1.0 min' },
  { id: 'CALL-1190', status: 'failed',    number: '+14058257784',   label: 'capture', date: '9/1/2026, 3:57:29 PM', duration: '0 secs',      billed: '—' },
  { id: 'CALL-1189', status: 'ended',     number: '+2347051052736', label: 'capture', date: '9/1/2026, 3:53:15 PM', duration: '33 secs',     billed: '1.0 min' },
  { id: 'CALL-1188', status: 'ended',     number: '+2347051052736', label: 'capture', date: '9/1/2026, 3:39:29 PM', duration: '1min 41secs', billed: '2.0 min', note: '1.0 plan + 1.0 bought' },
  { id: 'CALL-511',  status: 'ended',     number: '+2347051052736', label: 'capture', date: '8/22/2026, 5:06:11 AM', duration: '4min 4secs',  billed: '4.0 min' },
  { id: 'CALL-510',  status: 'ended',     number: '+2347051052736', label: 'capture', date: '8/22/2026, 4:55:50 AM', duration: '1min 44secs', billed: '2.0 min' },
  { id: 'CALL-509',  status: 'ended',     number: '+2347051052736', label: 'capture', date: '8/22/2026, 4:47:10 AM', duration: '2min 13secs', billed: '2.0 min' },
  { id: 'CALL-508',  status: 'ended',     number: '+2347051052736', label: 'capture', date: '8/22/2026, 4:35:02 AM', duration: '1min 32secs', billed: '2.0 min' },
  { id: 'CALL-507',  status: 'cancelled', number: '+2347051052736', label: 'capture', date: '8/22/2026, 4:30:33 AM', duration: '0 secs',      billed: '—' },
  { id: 'CALL-506',  status: 'ended',     number: '+2347051052736', label: 'capture', date: '8/22/2026, 4:21:51 AM', duration: '1min 41secs', billed: '2.0 min' },
  { id: 'CALL-505',  status: 'ended',     number: '+2347051052736', label: 'capture', date: '8/22/2026, 4:02:40 AM', duration: '1min 4secs',  billed: '1.0 min' },
  { id: 'CALL-504',  status: 'ended',     number: '+2347051052736', label: 'capture', date: '8/22/2026, 3:48:12 AM', duration: '2min 2secs',  billed: '2.0 min' },
  { id: 'CALL-503',  status: 'failed',    number: '+14058257784',   label: 'capture', date: '8/22/2026, 3:40:05 AM', duration: '0 secs',      billed: '—' },
])
const pageSize = 8
const page = ref(0)
const rangeStart = computed(() => calls.value.length ? page.value * pageSize + 1 : 0)
const rangeEnd = computed(() => Math.min((page.value + 1) * pageSize, calls.value.length))
const pagedCalls = computed(() => calls.value.slice(page.value * pageSize, (page.value + 1) * pageSize))

/* ── Call flow ── */
const callState = ref(null)
const timer = ref(0)
const muted = ref(false)
let ringTO = null, tickIV = null
const fmtTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

function startCall() {
  if (!recipientNum.value.trim()) { error('Recipient required', 'Enter the number you want to call.'); return }
  if (tab.value === 'Conversational' && !aiPrompt.value.trim()) { error('Prompt required', 'Enter the AI goal for this call.'); return }
  if (tab.value === 'Script' && !scriptText.value.trim()) { error('Script required', 'Write the script before starting.'); return }
  callState.value = 'ringing'
  muted.value = false
  timer.value = 0
  ringTO = setTimeout(() => {
    callState.value = 'connected'
    tickIV = setInterval(() => timer.value++, 1000)
  }, 2600)
}
function endCall() {
  clearTimeout(ringTO); clearInterval(tickIV)
  if (callState.value === 'connected') {
    const secs = timer.value
    const mins = Math.max(1, Math.ceil(secs / 60))
    calls.value.unshift({
      id: 'CALL-' + (1193 + calls.value.length),
      status: 'ended', number: fullRecipient.value, label: 'capture',
      date: new Date().toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      duration: fmtMin(secs), billed: mins.toFixed(1) + ' min',
    })
    page.value = 0
  }
  callState.value = null
  timer.value = 0
}
onBeforeUnmount(() => { clearTimeout(ringTO); clearInterval(tickIV) })
</script>

<style scoped>
.cc { display: flex; flex-direction: column; gap: 16px; }

/* Header */
.cc-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.cc-head__text { display: flex; flex-direction: column; gap: 6px; max-width: 720px; }
.cc-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.cc-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; line-height: 1.5; }
.cc-refresh { display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0; height: 40px; padding: 0 16px; border-radius: 11px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.82rem; font-weight: 700; transition: color 0.16s ease, border-color 0.16s ease; }
.cc-refresh:hover { color: var(--t1); border-color: var(--accent-border); }

/* Promo */
.cc-promo { display: flex; align-items: center; gap: 10px; background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.22); border-radius: 12px; padding: 13px 16px; }
.cc-promo svg { color: #16a34a; flex-shrink: 0; }
.cc-promo p { margin: 0; font-size: 0.84rem; color: var(--t2); }
.cc-promo strong { color: #16a34a; font-weight: 800; }

/* Stats */
.cc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.cc-stat { background: var(--bg); border: 1px solid var(--t4); border-radius: 14px; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; }
.cc-stat__row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.cc-stat__label { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; color: var(--t3); text-transform: uppercase; }
.cc-stat__val { font-size: 1.5rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.cc-stat__old { font-size: 0.82rem; font-weight: 600; color: var(--t3); margin-left: 4px; }
.cc-stat__note { font-size: 0.73rem; color: var(--t3); }
.cc-link { color: var(--accent); cursor: pointer; }
.cc-link:hover { text-decoration: underline; }
.cc-buy { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 9px; cursor: pointer; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.78rem; font-weight: 700; flex-shrink: 0; transition: transform 0.15s ease; }
.cc-buy:hover { transform: translateY(-1px); }

/* Tabs */
.cc-tabs { display: flex; gap: 4px; background: var(--glass-hover); border: 1px solid var(--border-soft); border-radius: 12px; padding: 4px; width: fit-content; flex-wrap: wrap; }
.cc-tab { height: 34px; padding: 0 16px; border-radius: 8px; border: none; cursor: pointer; background: transparent; color: var(--t3); font-family: inherit; font-size: 0.82rem; font-weight: 700; }
.cc-tab:hover { color: var(--t1); }
.cc-tab--on { background: var(--accent-dim); color: var(--accent); }

/* Card */
.cc-card { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 18px; }
.cc-phonegrid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cc-field { display: flex; flex-direction: column; gap: 8px; }
.cc-label { font-size: 0.86rem; font-weight: 800; color: var(--t1); }
.cc-hint { margin: 0; font-size: 0.74rem; color: var(--t3); line-height: 1.5; }
.cc-hint--mt { margin-top: 8px; }
.cc-section-label { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; color: var(--t3); text-transform: uppercase; }
.cc-input { width: 100%; height: 48px; padding: 0 14px; border-radius: 12px; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.88rem; outline: none; transition: border-color 0.16s ease; }
.cc-input:focus { border-color: var(--accent); }
select.cc-input { cursor: pointer; }
.cc-country { max-width: 200px; }
.cc-phonerow { display: flex; gap: 8px; }
.cc-textarea { width: 100%; border-radius: 12px; padding: 14px; resize: vertical; min-height: 90px; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.9rem; line-height: 1.6; outline: none; }
.cc-textarea:focus { border-color: var(--accent); }
.cc-voicerow { display: flex; gap: 8px; }
.cc-play { width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0; cursor: pointer; background: var(--glass-hover); border: 1px solid var(--border); color: var(--t2); display: flex; align-items: center; justify-content: center; }
.cc-play:hover { color: var(--accent); border-color: var(--accent-border); }
.cc-info { display: flex; gap: 10px; align-items: flex-start; background: rgba(59,130,246,0.07); border: 1px solid rgba(59,130,246,0.2); border-radius: 12px; padding: 13px 16px; }
.cc-info p { margin: 0; font-size: 0.82rem; color: var(--t2); line-height: 1.5; }
.cc-info strong { color: var(--t1); }

/* Toggle */
.cc-toggle-row { display: flex; align-items: center; gap: 16px; justify-content: space-between; border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; }
.cc-toggle-text { display: flex; flex-direction: column; gap: 3px; }
.cc-toggle-title { font-size: 0.88rem; font-weight: 700; color: var(--t1); }
.cc-toggle-sub { font-size: 0.74rem; color: var(--t3); line-height: 1.5; }
.cc-switch { width: 46px; height: 26px; border-radius: 999px; border: none; cursor: pointer; background: var(--glass-hover); border: 1px solid var(--border); position: relative; flex-shrink: 0; transition: background 0.18s ease; }
.cc-switch--on { background: #16a34a; border-color: #16a34a; }
.cc-switch__knob { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.18s ease; }
.cc-switch--on .cc-switch__knob { transform: translateX(20px); }

/* Start */
.cc-start { display: inline-flex; align-items: center; gap: 9px; height: 46px; padding: 0 22px; border-radius: 12px; cursor: pointer; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.9rem; font-weight: 700; transition: transform 0.15s ease; }
.cc-start:hover { transform: translateY(-2px); }

/* Telegram */
.cc-tg { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }
.cc-tg__title { font-size: 0.95rem; font-weight: 800; color: var(--t1); }
.cc-tg__sub { margin: 4px 0 0; font-size: 0.8rem; color: var(--t3); line-height: 1.5; }
.cc-tg__box { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; background: rgba(234,179,8,0.06); border: 1px solid rgba(234,179,8,0.3); border-radius: 12px; padding: 14px 16px; }
.cc-tg__box--linked { background: rgba(22,163,74,0.06); border-color: rgba(22,163,74,0.3); }
.cc-tg__box-title { font-size: 0.86rem; font-weight: 700; color: #a16207; }
.cc-tg__box--linked .cc-tg__box-title { color: #16a34a; }
.cc-tg__box-sub { margin: 3px 0 0; font-size: 0.76rem; color: var(--t3); line-height: 1.5; max-width: 620px; }
.cc-tg__btn { display: inline-flex; align-items: center; gap: 7px; height: 40px; padding: 0 16px; border-radius: 10px; cursor: pointer; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.82rem; font-weight: 700; flex-shrink: 0; transition: transform 0.15s ease; }
.cc-tg__btn:hover:not(:disabled) { transform: translateY(-2px); }
.cc-tg__btn:disabled { opacity: 0.55; cursor: default; }

/* Voice clones */
.cc-clones { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
.cc-clones__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.cc-clones__title { font-size: 0.95rem; font-weight: 800; color: var(--t1); }
.cc-clones__sub { margin: 4px 0 0; font-size: 0.78rem; color: var(--t3); line-height: 1.5; max-width: 640px; }
.cc-clones__add { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 10px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; transition: color 0.16s ease, border-color 0.16s ease; }
.cc-clones__add:hover { color: var(--accent); border-color: var(--accent-border); }
.cc-clones__empty { margin: 0; font-size: 0.82rem; color: var(--t3); }
.cc-clones__list { display: flex; flex-direction: column; gap: 10px; }
.cc-clone { display: flex; align-items: center; gap: 12px; border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; }
.cc-clone__ico { width: 34px; height: 34px; border-radius: 9px; background: var(--accent-dim); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cc-clone__name { flex: 1; font-size: 0.86rem; font-weight: 700; color: var(--t1); }
.cc-clone__badge { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; color: #16a34a; background: rgba(22,163,74,0.1); border: 1px solid rgba(22,163,74,0.25); padding: 3px 9px; border-radius: 999px; }

/* Recent */
.cc-recent { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; overflow: hidden; }
.cc-recent__list { display: flex; flex-direction: column; }
.cc-rec { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-bottom: 1px solid var(--border-soft); cursor: pointer; transition: background 0.15s ease; }
.cc-rec:hover { background: var(--glass-hover); }
.cc-rec__status { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; padding: 4px 9px; border-radius: 999px; flex-shrink: 0; min-width: 74px; text-align: center; }
.cc-rec__status--ended { color: var(--t2); background: var(--glass-hover); border: 1px solid var(--border-soft); }
.cc-rec__status--failed { color: #ef4444; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); }
.cc-rec__status--cancelled { color: #d97706; background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.25); }
.cc-rec__info { flex: 1; min-width: 0; }
.cc-rec__num { font-size: 0.86rem; font-weight: 700; color: var(--t1); }
.cc-rec__cap { font-weight: 500; color: var(--t3); }
.cc-rec__meta { font-size: 0.73rem; color: var(--t3); margin-top: 3px; }
.cc-rec__right { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; flex-shrink: 0; }
.cc-rec__secs { font-size: 0.78rem; color: var(--t2); }
.cc-rec__min { font-size: 0.82rem; font-weight: 700; color: #16a34a; }
.cc-rec__min--dim { color: var(--t4); }
.cc-rec__note { font-size: 0.66rem; color: var(--t3); }
.cc-rec__chev { color: var(--t4); flex-shrink: 0; }

.cc-pager { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; }
.cc-pager__count { font-size: 0.78rem; color: var(--t3); }
.cc-pager__btns { display: flex; gap: 8px; }
.cc-pager__btn { height: 34px; padding: 0 14px; border-radius: 9px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.78rem; font-weight: 700; transition: color 0.16s ease, border-color 0.16s ease; }
.cc-pager__btn:hover:not(:disabled) { color: var(--t1); border-color: var(--accent-border); }
.cc-pager__btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Overlay + modals */
.cc-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(8,12,10,0.55); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.cc-modal { width: 100%; max-width: 480px; background: var(--bg); border: 1px solid var(--border); border-radius: 20px; padding: 22px; }
.cc-modal__head { display: flex; align-items: flex-start; gap: 12px; }
.cc-modal__title { font-size: 1.05rem; font-weight: 800; color: var(--t1); }
.cc-modal__sub { margin: 4px 0 0; font-size: 0.78rem; color: var(--t3); line-height: 1.5; }
.cc-x { margin-left: auto; width: 32px; height: 32px; border-radius: 9px; border: 1px solid var(--border); background: var(--bg); color: var(--t3); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cc-x:hover { color: var(--t1); border-color: var(--accent-border); }
.cc-modal__label { display: block; margin: 18px 0 8px; font-size: 0.82rem; font-weight: 700; color: var(--t1); }
.cc-modal__input { height: 46px; }
.cc-presets { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.cc-preset { height: 36px; padding: 0 16px; border-radius: 9px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.8rem; font-weight: 700; }
.cc-preset:hover { border-color: var(--accent-border); color: var(--t1); }
.cc-preset--on { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
.cc-modal__min { margin: 8px 0 0; font-size: 0.74rem; color: var(--t3); }
.cc-summary { margin-top: 16px; border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.cc-summary__row { display: flex; align-items: center; justify-content: space-between; font-size: 0.84rem; color: var(--t2); }
.cc-summary__mins { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: var(--t1); }
.cc-summary__off { color: #16a34a; font-weight: 700; }
.cc-summary__row--total { font-size: 1rem; font-weight: 800; color: var(--t1); padding-top: 10px; border-top: 1px solid var(--border-soft); }
.cc-summary__wallet { display: flex; align-items: center; gap: 7px; font-size: 0.74rem; color: var(--t3); margin-top: 2px; }
.cc-modal__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
.cc-cancel { height: 44px; padding: 0 20px; border-radius: 11px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.86rem; font-weight: 700; }
.cc-cancel:hover { color: var(--t1); border-color: var(--accent-border); }
.cc-pay { height: 44px; padding: 0 22px; border-radius: 11px; cursor: pointer; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.86rem; font-weight: 700; transition: transform 0.15s ease; }
.cc-pay:hover { transform: translateY(-2px); }

/* Call modal */
.cc-callmodal { position: relative; width: 100%; max-width: 360px; background: var(--bg); border: 1px solid var(--border); border-radius: 24px; padding: 40px 32px 28px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; overflow: hidden; }
.cc-ring { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.cc-ring span { position: absolute; border-radius: 50%; background: rgba(34,197,94,0.1); animation: cc-ripple 2.2s ease-out infinite; }
.cc-ring span:nth-child(1) { width: 90px; height: 90px; }
.cc-ring span:nth-child(2) { width: 150px; height: 150px; animation-delay: 0.5s; }
.cc-ring span:nth-child(3) { width: 210px; height: 210px; animation-delay: 1s; }
@keyframes cc-ripple { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
.cc-avatar { width: 70px; height: 70px; border-radius: 50%; z-index: 1; background: var(--accent-dim); border: 2px solid var(--accent-border); color: var(--accent); display: flex; align-items: center; justify-content: center; }
.cc-avatar--live { animation: cc-pulse 1.6s ease-in-out infinite; }
@keyframes cc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
.cc-callstatus { font-size: 0.74rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--t3); }
.cc-callnum { font-size: 1.25rem; font-weight: 800; color: var(--t1); }
.cc-callcid { font-size: 0.78rem; color: var(--t3); }
.cc-callcid strong { color: var(--t2); }
.cc-calltimer { font-size: 1.8rem; font-weight: 800; color: var(--accent); font-variant-numeric: tabular-nums; }
.cc-callctrls { display: flex; gap: 12px; margin-top: 8px; }
.cc-ctrl { height: 44px; padding: 0 22px; border-radius: 12px; cursor: pointer; background: var(--glass-hover); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.82rem; font-weight: 700; }
.cc-ctrl:hover { color: var(--t1); }
.cc-ctrl--on { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
.cc-ctrl--end { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); color: #ef4444; }
.cc-ctrl--end:hover { background: rgba(239,68,68,0.2); color: #ef4444; }

@media (max-width: 860px) {
  .cc-stats { grid-template-columns: 1fr; }
  .cc-phonegrid { grid-template-columns: 1fr; }
  .cc-country { max-width: 150px; }
}
</style>
