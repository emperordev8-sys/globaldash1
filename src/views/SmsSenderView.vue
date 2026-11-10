<!-- src/views/SmsSenderView.vue -->
<template>
  <div class="sms">

    <!-- Header -->
    <div class="sms-head">
      <h1 class="sms-title">SMS Sender</h1>
      <p class="sms-sub">On Premium · {{ left }}/{{ total }} SMS left this month · then pay-as-you-go (price depends on the destination)</p>
    </div>

    <!-- Promo -->
    <div class="sms-promo">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      <p>Your <strong>Premium</strong> plan gives you <strong>5% off</strong> on this service.</p>
    </div>

    <!-- Stats -->
    <div class="sms-stats">
      <div class="sms-stat">
        <span class="sms-stat__label">PLAN SMS LEFT THIS MONTH</span>
        <span class="sms-stat__val">{{ left }}/{{ total }}</span>
      </div>
      <div class="sms-stat">
        <span class="sms-stat__label">ONE SMS</span>
        <span class="sms-stat__val sms-stat__val--sm">Up to 160 characters</span>
      </div>
      <div class="sms-stat">
        <span class="sms-stat__label">WALLET BALANCE</span>
        <span class="sms-stat__val">₦68,801.36</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="sms-tabs">
      <button v-for="t in tabs" :key="t" class="sms-tab" :class="{ 'sms-tab--on': tab === t }" @click="tab = t">{{ t }}</button>
    </div>

    <!-- Single SMS -->
    <div v-if="tab === 'Single SMS'" class="sms-layout">
      <div class="sms-card">
        <div class="sms-field">
          <label class="sms-label">Sender ID</label>
          <input v-model="senderId" maxlength="11" class="sms-input" placeholder="e.g. YourBrand, MyCompany" />
          <p class="sms-hint">{{ senderId.length }}/11 characters · shown as the sender on the recipient's phone.</p>
        </div>

        <div class="sms-field">
          <label class="sms-label">Recipient phone number</label>
          <div class="sms-phonerow">
            <select v-model="country" class="sms-input sms-country">
              <option v-for="c in countries" :key="c.code" :value="c">{{ c.code }} {{ c.dial }} · {{ c.name }}</option>
            </select>
            <input v-model="phone" class="sms-input" placeholder="8012345678" />
          </div>
          <p class="sms-hint">Pick the destination country, then type the local number. We auto-add the country code and remove a leading 0.</p>
        </div>

        <div class="sms-field">
          <div class="sms-msglabel">
            <label class="sms-label">Message</label>
            <span class="sms-parts">{{ parts }} SMS part{{ parts === 1 ? '' : 's' }}</span>
          </div>
          <textarea v-model="message" class="sms-textarea" rows="5" placeholder="Type your message..."></textarea>
          <p class="sms-hint">1 SMS = up to 160 characters (70 for Arabic, Chinese and other non-Latin scripts). Longer messages are sent as several SMS, up to 510 characters in total.</p>
        </div>

        <label class="sms-check"><input type="checkbox" v-model="schedule" /> <span>Schedule for later</span></label>
        <input v-if="schedule" v-model="scheduleAt" type="datetime-local" class="sms-input" />

        <button class="sms-analyse" @click="analyse">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Analyse Recipient
        </button>
      </div>

      <!-- Live preview -->
      <div class="sms-preview">
        <span class="sms-preview__label">LIVE PREVIEW</span>
        <div class="sms-phone">
          <div class="sms-phone__notch"></div>
          <div class="sms-phone__hdr">
            <span class="sms-phone__avatar">{{ (senderId || 'S').charAt(0).toUpperCase() }}</span>
            <div>
              <div class="sms-phone__name">{{ senderId || 'Sender ID' }}</div>
              <div class="sms-phone__sub">Text message</div>
            </div>
          </div>
          <div class="sms-phone__body">
            <div v-if="message" class="sms-bubble">{{ message }}</div>
            <div v-else class="sms-phone__empty">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Your message will appear here.</span>
            </div>
          </div>
        </div>
        <p class="sms-preview__note">This is how it will look on the receiver's phone.</p>
      </div>
    </div>

    <!-- Bulk SMS -->
    <div v-else-if="tab === 'Bulk SMS'" class="sms-card">
      <div class="sms-field">
        <label class="sms-label">Recipient numbers</label>
        <textarea v-model="bulk" class="sms-textarea" rows="5" placeholder="One number per line, with country code — e.g. +2348012345678"></textarea>
        <p class="sms-hint">{{ bulkCount }} recipient{{ bulkCount === 1 ? '' : 's' }} detected.</p>
      </div>
      <div class="sms-field">
        <label class="sms-label">Message</label>
        <textarea v-model="message" class="sms-textarea" rows="4" placeholder="Type your message..."></textarea>
      </div>
      <button class="sms-analyse" @click="analyse">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Analyse Recipients
      </button>
    </div>

    <!-- Pricing -->
    <div v-else-if="tab === 'Pricing'" class="sms-card">
      <table class="sms-price-table">
        <thead><tr><th>Destination</th><th>Per SMS</th></tr></thead>
        <tbody>
          <tr v-for="r in pricing" :key="r.country"><td>{{ r.country }}</td><td>{{ r.price }}</td></tr>
        </tbody>
      </table>
    </div>

    <!-- History -->
    <div v-else class="sms-empty">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>No messages sent yet. Your sent SMS will appear here.</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast.js'

const { success, info } = useToast()

const left = 1, total = 1
const tabs = ['Single SMS', 'Bulk SMS', 'Pricing', 'History']
const tab = ref('Single SMS')

const countries = [
  { code: 'NG', dial: '+234', name: 'Nigeria' },
  { code: 'US', dial: '+1', name: 'United States' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'GH', dial: '+233', name: 'Ghana' },
  { code: 'KE', dial: '+254', name: 'Kenya' },
  { code: 'ZA', dial: '+27', name: 'South Africa' },
  { code: 'CA', dial: '+1', name: 'Canada' },
]
const senderId = ref('')
const country = ref(countries[0])
const phone = ref('')
const message = ref('')
const schedule = ref(false)
const scheduleAt = ref('')
const bulk = ref('')

const parts = computed(() => Math.max(1, Math.ceil((message.value.length || 1) / 160)))
const bulkCount = computed(() => bulk.value.split('\n').map(l => l.trim()).filter(Boolean).length)

const pricing = [
  { country: 'Nigeria (+234)', price: '₦4.20' },
  { country: 'United States (+1)', price: '₦9.80' },
  { country: 'United Kingdom (+44)', price: '₦11.50' },
  { country: 'Ghana (+233)', price: '₦6.40' },
  { country: 'Kenya (+254)', price: '₦7.10' },
]

function analyse() {
  if (tab.value === 'Bulk SMS') {
    if (bulkCount.value === 0) { info('Add recipients', 'Enter at least one phone number.'); return }
    if (!message.value.trim()) { info('Message required', 'Type the message to send.'); return }
    success('Recipients analysed', `${bulkCount.value} numbers ready — ${parts.value} SMS part${parts.value === 1 ? '' : 's'} each.`)
    return
  }
  if (!phone.value.trim()) { info('Phone required', 'Enter the recipient phone number.'); return }
  if (!message.value.trim()) { info('Message required', 'Type the message to send.'); return }
  const normalized = country.value.dial + ' ' + phone.value.replace(/^0+/, '')
  success('Recipient analysed', `Ready to send to ${normalized} — ${parts.value} SMS part${parts.value === 1 ? '' : 's'}.`)
}
</script>

<style scoped>
.sms { display: flex; flex-direction: column; gap: 16px; }

/* Header */
.sms-head { display: flex; flex-direction: column; gap: 6px; }
.sms-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.sms-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; }

/* Promo */
.sms-promo { display: flex; align-items: center; gap: 10px; background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.22); border-radius: 12px; padding: 13px 16px; }
.sms-promo svg { color: #16a34a; flex-shrink: 0; }
.sms-promo p { margin: 0; font-size: 0.84rem; color: var(--t2); }
.sms-promo strong { color: #16a34a; font-weight: 800; }

/* Stats */
.sms-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.sms-stat { background: var(--bg); border: 1px solid var(--t4); border-radius: 14px; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; }
.sms-stat__label { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; color: var(--t3); text-transform: uppercase; }
.sms-stat__val { font-size: 1.5rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.sms-stat__val--sm { font-size: 1.05rem; }

/* Tabs */
.sms-tabs { display: flex; gap: 4px; background: var(--glass-hover); border: 1px solid var(--border-soft); border-radius: 12px; padding: 4px; width: fit-content; flex-wrap: wrap; }
.sms-tab { height: 34px; padding: 0 16px; border-radius: 8px; border: none; cursor: pointer; background: transparent; color: var(--t3); font-family: inherit; font-size: 0.82rem; font-weight: 700; }
.sms-tab:hover { color: var(--t1); }
.sms-tab--on { background: var(--accent-dim); color: var(--accent); }

/* Layout */
.sms-layout { display: grid; grid-template-columns: 1.7fr 1fr; gap: 16px; align-items: start; }
.sms-card { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }

.sms-field { display: flex; flex-direction: column; gap: 8px; }
.sms-label { font-size: 0.86rem; font-weight: 800; color: var(--t1); }
.sms-hint { margin: 0; font-size: 0.74rem; color: var(--t3); line-height: 1.5; }
.sms-input {
  width: 100%; height: 46px; padding: 0 14px; border-radius: 11px;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.88rem; outline: none; transition: border-color 0.16s ease;
}
.sms-input:focus { border-color: var(--accent); }
select.sms-input { cursor: pointer; }
.sms-phonerow { display: flex; gap: 8px; }
.sms-country { max-width: 190px; }
.sms-textarea {
  width: 100%; border-radius: 12px; padding: 14px; resize: vertical; min-height: 110px;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.9rem; line-height: 1.6; outline: none;
}
.sms-textarea:focus { border-color: var(--accent); }
.sms-msglabel { display: flex; align-items: center; justify-content: space-between; }
.sms-parts { font-size: 0.7rem; font-weight: 700; color: var(--t2); background: var(--glass-hover); border: 1px solid var(--border-soft); padding: 4px 10px; border-radius: 999px; }
.sms-check { display: flex; align-items: center; gap: 9px; font-size: 0.84rem; font-weight: 600; color: var(--t1); cursor: pointer; }
.sms-check input { width: 17px; height: 17px; accent-color: #16a34a; cursor: pointer; }
.sms-analyse {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px;
  height: 44px; padding: 0 20px; border-radius: 11px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.86rem; font-weight: 700; 
  position: relative; overflow: hidden; isolation: isolate;
  transition: transform 0.15s ease;
}
.sms-analyse:hover { transform: translateY(-2px); }
.sms-analyse::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 45%;
  background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.22) 60%, transparent 100%);
  transform: skewX(-22deg); pointer-events: none; z-index: 2; animation: sms-shine 3s ease-in-out infinite; animation-delay: 1s;
}
@keyframes sms-shine { 0% { left: -80%; } 35% { left: 130%; } 100% { left: 130%; } }

/* Live preview */
.sms-preview { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.sms-preview__label { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.1em; color: var(--t3); }
.sms-phone {
  width: 100%; max-width: 260px; border-radius: 26px; overflow: hidden;
  background: var(--bg); border: 1px solid var(--border); 
  position: relative; min-height: 340px; display: flex; flex-direction: column;
}
.sms-phone__notch { height: 22px; }
.sms-phone__hdr { display: flex; align-items: center; gap: 10px; padding: 10px 16px 14px; border-bottom: 1px solid var(--border-soft); }
.sms-phone__avatar { width: 34px; height: 34px; border-radius: 50%; background: #16a34a; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; }
.sms-phone__name { font-size: 0.86rem; font-weight: 700; color: var(--t1); }
.sms-phone__sub { font-size: 0.72rem; color: var(--t3); }
.sms-phone__body { flex: 1; padding: 16px; display: flex; flex-direction: column; }
.sms-phone__empty { margin: auto; display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--t3); font-size: 0.78rem; text-align: center; }
.sms-bubble {
  align-self: flex-start; max-width: 85%;
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  border-radius: 14px 14px 14px 4px; padding: 10px 13px;
  font-size: 0.82rem; color: var(--t1); line-height: 1.5; word-break: break-word; white-space: pre-wrap;
}
.sms-preview__note { margin: 0; font-size: 0.74rem; color: var(--t3); text-align: center; }

/* Pricing table */
.sms-price-table { width: 100%; border-collapse: collapse; }
.sms-price-table th { text-align: left; padding: 10px 14px; font-size: 0.64rem; font-weight: 700; letter-spacing: 0.07em; color: var(--t3); text-transform: uppercase; border-bottom: 1px solid var(--border-soft); }
.sms-price-table td { padding: 12px 14px; font-size: 0.85rem; color: var(--t1); border-bottom: 1px solid var(--border-soft); }
.sms-price-table tr:last-child td { border-bottom: none; }

/* Empty */
.sms-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 48px 20px; border-radius: 16px; border: 1.5px dashed var(--border); color: var(--t3); font-size: 0.84rem; }

@media (max-width: 860px) {
  .sms-layout { grid-template-columns: 1fr; }
  .sms-stats { grid-template-columns: 1fr; }
  .sms-phonerow { flex-direction: column; }
  .sms-country { max-width: none; }
}
</style>
