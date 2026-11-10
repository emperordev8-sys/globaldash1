<!-- src/views/BuyDomainView.vue → My Domains -->
<template>
  <div class="dm">

    <!-- Header -->
    <div class="dm-head">
      <h1 class="dm-title">My Domains</h1>
      <p class="dm-sub">Buy domains, create subdomains, and connect them to any site you've built — no DNS setup, we handle it. You can buy a domain now and assign it whenever you're ready.</p>
    </div>

    <!-- Promo -->
    <div class="dm-promo">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      <p>Your <strong>Premium</strong> plan gives you <strong>10% off</strong> on this service.</p>
    </div>

    <!-- Buy / connect -->
    <button class="dm-cta" @click="showBuyDomain = true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Buy or connect a domain
    </button>

    <!-- Domains -->
    <div v-for="d in domains" :key="d.name" class="dm-card">
      <div class="dm-dhead">
        <div class="dm-dhead__left">
          <svg class="dm-globe" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <div>
            <div class="dm-dname">{{ d.name }}</div>
            <div class="dm-dmeta">{{ d.connected ? 'Your domain · nameservers connected' : ('Bought here' + (d.mailboxes ? ` · ${d.mailboxes} mailbox${d.mailboxes === 1 ? '' : 'es'}` : '')) }}</div>
            <div v-if="!d.connected" class="dm-dexpiry">
              <template v-if="d.autoRenew">Renews automatically on {{ d.renews }} — {{ d.renewAmount }} comes out of your wallet the day before.</template>
              <template v-else>Expires {{ d.expiry }} — auto-renew is off, so it won't be charged or renewed.</template>
            </div>
          </div>
        </div>
        <div class="dm-dactions">
          <button v-if="!d.connected" class="dm-renew" :class="{ 'dm-renew--on': d.autoRenew }" @click="toggleRenew(d)">
            <span class="dm-check" :class="{ 'dm-check--on': d.autoRenew }">
              <svg v-if="d.autoRenew" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            Auto-renew <strong>{{ d.autoRenew ? 'On' : 'Off' }}</strong>
          </button>
          <button class="dm-link" @click="editDns(d)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            Edit DNS Records (MX &amp; TXT)
          </button>
          <button v-if="!d.connected" class="dm-link" @click="transfer(d)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="8 21 3 21 3 16"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
            Transfer
          </button>
        </div>
      </div>

      <!-- rows -->
      <div class="dm-row">
        <div class="dm-row__left">
          <div class="dm-row__host">{{ d.main.host }} <span class="dm-main">MAIN</span></div>
          <div class="dm-row__live">{{ d.main.site ? ('Live on ' + d.main.site) : 'Not assigned' }}</div>
        </div>
        <select v-model="d.main.site" class="dm-select">
          <option :value="null">Not assigned</option>
          <option v-for="s in sites" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div v-for="(sub, i) in d.subs" :key="sub.host" class="dm-row">
        <div class="dm-row__left">
          <div class="dm-row__host">{{ sub.host }}</div>
          <div class="dm-row__live">{{ sub.site ? ('Live on ' + sub.site) : 'Not assigned' }}</div>
        </div>
        <div class="dm-row__right">
          <select v-model="sub.site" class="dm-select">
            <option :value="null">Not assigned</option>
            <option v-for="s in sites" :key="s" :value="s">{{ s }}</option>
          </select>
          <button class="dm-del" @click="deleteSub(d, i)" title="Delete subdomain">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <!-- add subdomain -->
      <div class="dm-addsub">
        <div class="dm-addsub__field">
          <input v-model="d._newSub" class="dm-addsub__input" placeholder="shop" @keydown.enter="addSub(d)" />
          <span class="dm-addsub__suffix">.{{ d.name }}</span>
        </div>
        <button class="dm-addbtn" @click="addSub(d)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add subdomain
        </button>
      </div>
    </div>

    <!-- Email mailboxes -->
    <div class="dm-mailhead" id="mailboxes" ref="mailboxesEl">
      <h2 class="dm-mailtitle">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
        Email mailboxes
      </h2>
      <button class="dm-cta dm-cta--sm" @click="showBuyMailbox = true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Buy a mailbox
      </button>
    </div>

    <div class="dm-promo">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
      <p>Your <strong>Premium</strong> plan gives you <strong>10% off</strong> on this service.</p>
    </div>
    <p class="dm-mailnote">A professional inbox on your own domain — <s>₦5,000.00</s> ₦4,500.00/GB per month (10% off with your plan), pick your storage.</p>

    <div v-for="(m, i) in mailboxes" :key="m.email" class="dm-card dm-mailbox">
      <div class="dm-mb__email">{{ m.email }}</div>
      <div class="dm-mb__status">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Webmail active · {{ m.storage }} · {{ m.price }} · renews {{ m.renews }}
      </div>
      <div class="dm-mb__actions">
        <button class="dm-mbbtn" @click="toast('Manage storage', m.email)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> Manage storage</button>
        <button class="dm-mbbtn" @click="toast('Change password', m.email)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Change password</button>
        <button class="dm-mbbtn" @click="toast('Domain settings', m.email)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> Domain settings</button>
        <button class="dm-mblink" @click="setSender(m)">{{ m.senderName ? 'Sender name' : 'Set sender name' }}</button>
        <button class="dm-mbopen" @click="toast('Opening webmail', m.email)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Open webmail</button>
        <button class="dm-mblink" @click="toggleMailRenew(m)">{{ m.autoRenew === false ? 'Turn on auto-renew' : 'Turn off auto-renew' }}</button>
        <button class="dm-mblink dm-mblink--danger" @click="cancelMailbox(i)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg> Cancel</button>
      </div>
    </div>

    <!-- Buy domain modal -->
    <div v-if="showBuyDomain" class="dm-overlay" @click.self="showBuyDomain = false">
      <div class="dm-modal">
        <div class="dm-modal__head">
          <div class="dm-modal__title">Buy or connect a domain</div>
          <button class="dm-x" @click="showBuyDomain = false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div class="dm-modeswitch">
          <button class="dm-mode" :class="{ 'dm-mode--on': buyMode === 'buy' }" @click="buyMode = 'buy'">Buy new</button>
          <button class="dm-mode" :class="{ 'dm-mode--on': buyMode === 'connect' }" @click="buyMode = 'connect'">Connect existing</button>
        </div>
        <label class="dm-modal__label">Domain name</label>
        <input v-model="newDomain" class="dm-input" placeholder="yourbrand.com" @keydown.enter="buyDomain" />
        <p class="dm-modal__hint">{{ buyMode === 'buy' ? 'We register and configure it for you — ₦23,771.52/yr (10% off).' : 'Point your domain nameservers to us and we handle DNS automatically.' }}</p>
        <div class="dm-modal__actions">
          <button class="dm-cancel" @click="showBuyDomain = false">Cancel</button>
          <button class="dm-pay" @click="buyDomain">{{ buyMode === 'buy' ? 'Buy domain' : 'Connect domain' }}</button>
        </div>
      </div>
    </div>

    <!-- Buy mailbox modal -->
    <div v-if="showBuyMailbox" class="dm-overlay" @click.self="showBuyMailbox = false">
      <div class="dm-modal">
        <div class="dm-modal__head">
          <div class="dm-modal__title">Buy a mailbox</div>
          <button class="dm-x" @click="showBuyMailbox = false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <label class="dm-modal__label">Mailbox address</label>
        <div class="dm-mbrow">
          <input v-model="mbPrefix" class="dm-input" placeholder="support" />
          <span class="dm-mbat">@</span>
          <select v-model="mbDomain" class="dm-input">
            <option v-for="d in domains" :key="d.name" :value="d.name">{{ d.name }}</option>
          </select>
        </div>
        <label class="dm-modal__label">Storage</label>
        <select v-model.number="mbStorage" class="dm-input">
          <option :value="1">1 GB — ₦4,500.00/mo</option>
          <option :value="5">5 GB — ₦22,500.00/mo</option>
          <option :value="10">10 GB — ₦45,000.00/mo</option>
        </select>
        <div class="dm-modal__actions">
          <button class="dm-cancel" @click="showBuyMailbox = false">Cancel</button>
          <button class="dm-pay" @click="buyMailbox">Buy mailbox</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '../composables/useToast.js'

const { success, info } = useToast()
const toast = (title, msg) => info(title, msg)

const route = useRoute()
const mailboxesEl = ref(null)
onMounted(() => {
  if (route.hash === '#mailboxes') {
    nextTick(() => mailboxesEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
})

const sites = ['TD BnK City', 'Fedx', 'Fmtmarkets', 'Trade Global Capital', 'Walasunity']

const domains = ref([
  { name: 'finexatrd.com', mailboxes: 2, autoRenew: false, expiry: '28 Jun 2027', main: { host: 'finexatrd.com', site: 'TD BnK City' }, subs: [{ host: 'trade.finexatrd.com', site: 'Fedx' }], _newSub: '' },
  { name: 'fmtmarkets.com', mailboxes: 0, autoRenew: false, expiry: '4 Aug 2027', main: { host: 'fmtmarkets.com', site: 'Fmtmarkets' }, subs: [], _newSub: '' },
  { name: 'tradeglobalcapitals.com', mailboxes: 1, autoRenew: true, renews: '8 Nov 2027', renewAmount: '₦23,771.52', main: { host: 'tradeglobalcapitals.com', site: 'Trade Global Capital' }, subs: [], _newSub: '' },
  { name: 'walasunity.info', mailboxes: 0, autoRenew: false, expiry: '27 Jul 2027', main: { host: 'walasunity.info', site: 'Walasunity' }, subs: [], _newSub: '' },
  { name: 'tradeglobalcapital.com', connected: true, main: { host: 'www.tradeglobalcapital.com', site: null }, subs: [], _newSub: '' },
])

const mailboxes = ref([
  { email: 'support@tradeglobalcapitals.com', storage: '1GB', price: '₦4,500.00/mo', renews: '08 Dec 2026', autoRenew: true, senderName: false },
  { email: 'support@finexatrd.com', storage: '1GB', price: '₦4,500.00/mo', renews: '10 Dec 2026', autoRenew: true, senderName: true },
])

function toggleRenew(d) {
  d.autoRenew = !d.autoRenew
  if (d.autoRenew) { d.renews = d.renews || d.expiry; d.renewAmount = d.renewAmount || '₦23,771.52' }
  success(`Auto-renew ${d.autoRenew ? 'on' : 'off'}`, `${d.name} will ${d.autoRenew ? 'renew automatically' : 'not be renewed'}.`)
}
function editDns(d) { info('DNS records', `Opening MX & TXT records for ${d.name}.`) }
function transfer(d) { info('Transfer domain', `Start a transfer for ${d.name}.`) }
function addSub(d) {
  const sub = (d._newSub || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (!sub) { info('Subdomain required', 'Enter a subdomain name.'); return }
  const host = `${sub}.${d.name}`
  if (d.subs.some(s => s.host === host)) { info('Already exists', `${host} is already added.`); return }
  d.subs.push({ host, site: null })
  d._newSub = ''
  success('Subdomain added', `${host} is ready to assign.`)
}
function deleteSub(d, i) {
  const host = d.subs[i].host
  d.subs.splice(i, 1)
  info('Subdomain removed', `${host} was deleted.`)
}

/* Mailbox actions */
function setSender(m) { m.senderName = true; success('Sender name', `Sender name set for ${m.email}.`) }
function toggleMailRenew(m) { m.autoRenew = m.autoRenew === false; info(`Auto-renew ${m.autoRenew ? 'on' : 'off'}`, m.email) }
function cancelMailbox(i) { const e = mailboxes.value[i].email; mailboxes.value.splice(i, 1); info('Mailbox cancelled', e) }

/* Buy domain modal */
const showBuyDomain = ref(false)
const buyMode = ref('buy')
const newDomain = ref('')
function buyDomain() {
  const name = newDomain.value.trim().toLowerCase()
  if (!/^[a-z0-9-]+\.[a-z.]{2,}$/.test(name)) { info('Enter a valid domain', 'e.g. yourbrand.com'); return }
  if (domains.value.some(d => d.name === name)) { info('Already added', `${name} is already in your list.`); return }
  domains.value.unshift(buyMode.value === 'buy'
    ? { name, mailboxes: 0, autoRenew: false, expiry: '28 Nov 2027', main: { host: name, site: null }, subs: [], _newSub: '' }
    : { name, connected: true, main: { host: 'www.' + name, site: null }, subs: [], _newSub: '' })
  success(buyMode.value === 'buy' ? 'Domain purchased' : 'Domain connected', name)
  newDomain.value = ''
  showBuyDomain.value = false
}

/* Buy mailbox modal */
const showBuyMailbox = ref(false)
const mbPrefix = ref('support')
const mbDomain = ref(domains.value[0].name)
const mbStorage = ref(1)
function buyMailbox() {
  const prefix = mbPrefix.value.trim().toLowerCase().replace(/[^a-z0-9.]/g, '')
  if (!prefix) { info('Mailbox name required', 'Enter the address prefix.'); return }
  const email = `${prefix}@${mbDomain.value}`
  if (mailboxes.value.some(m => m.email === email)) { info('Already exists', `${email} already exists.`); return }
  const price = (mbStorage.value * 4500).toLocaleString('en-NG', { minimumFractionDigits: 2 })
  mailboxes.value.unshift({ email, storage: mbStorage.value + 'GB', price: `₦${price}/mo`, renews: '28 Nov 2026', autoRenew: true, senderName: false })
  success('Mailbox created', `${email} is ready — ₦${price}/mo.`)
  showBuyMailbox.value = false
}
</script>

<style scoped>
.dm { display: flex; flex-direction: column; gap: 14px; }

.dm-head { display: flex; flex-direction: column; gap: 6px; }
.dm-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.dm-sub { margin: 0; font-size: 0.82rem; color: var(--t2); font-weight: 500; line-height: 1.5; max-width: 900px; }

.dm-promo { display: flex; align-items: center; gap: 10px; background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.22); border-radius: 12px; padding: 12px 16px; }
.dm-promo svg { color: #16a34a; flex-shrink: 0; }
.dm-promo p { margin: 0; font-size: 0.84rem; color: var(--t2); }
.dm-promo strong { color: #16a34a; font-weight: 800; }

.dm-cta {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 20px; border-radius: 11px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.86rem; font-weight: 700; transition: transform 0.15s ease;
}
.dm-cta:hover { transform: translateY(-2px); }
.dm-cta--sm { height: 40px; padding: 0 16px; font-size: 0.82rem; }

/* Domain card */
.dm-card { border: 1px solid var(--t4); border-radius: 14px; overflow: hidden; background: var(--bg); }
.dm-dhead { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 16px 18px; background: rgba(22,163,74,0.03); border-bottom: 1px solid var(--border-soft); }
.dm-dhead__left { display: flex; gap: 12px; min-width: 0; }
.dm-globe { color: var(--t3); flex-shrink: 0; margin-top: 2px; }
.dm-dname { font-size: 0.98rem; font-weight: 800; color: var(--t1); }
.dm-dmeta { font-size: 0.76rem; color: var(--t3); margin-top: 2px; }
.dm-dexpiry { font-size: 0.74rem; color: var(--t3); margin-top: 3px; }
.dm-dactions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.dm-renew { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; border-radius: 9px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.78rem; font-weight: 600; }
.dm-renew strong { color: var(--t2); font-weight: 800; }
.dm-renew--on { border-color: rgba(22,163,74,0.4); background: rgba(22,163,74,0.06); }
.dm-renew--on strong { color: #16a34a; }
.dm-check { width: 17px; height: 17px; border-radius: 5px; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dm-check--on { background: #16a34a; border-color: #16a34a; }
.dm-link { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; color: var(--t2); font-family: inherit; font-size: 0.78rem; font-weight: 600; padding: 0; }
.dm-link:hover { color: var(--accent); }
.dm-link svg { color: var(--t3); }
.dm-link:hover svg { color: var(--accent); }

/* rows */
.dm-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 13px 18px; border-bottom: 1px solid var(--border-soft); }
.dm-row__left { min-width: 0; }
.dm-row__host { font-size: 0.86rem; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 8px; }
.dm-main { font-size: 0.56rem; font-weight: 800; letter-spacing: 0.05em; color: var(--t3); background: var(--glass-hover); border: 1px solid var(--border-soft); padding: 2px 7px; border-radius: 999px; }
.dm-row__live { font-size: 0.74rem; color: var(--t3); margin-top: 2px; }
.dm-row__right { display: flex; align-items: center; gap: 8px; }
.dm-select { height: 38px; padding: 0 12px; border-radius: 9px; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.82rem; cursor: pointer; min-width: 150px; }
.dm-select:focus { outline: none; border-color: var(--accent); }
.dm-del { width: 38px; height: 38px; border-radius: 9px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dm-del:hover { color: #ef4444; border-color: rgba(239,68,68,0.4); }

/* add subdomain */
.dm-addsub { display: flex; align-items: center; gap: 10px; padding: 13px 18px; }
.dm-addsub__field { flex: 1; display: flex; align-items: center; background: var(--glass-hover); border: 1px solid var(--border); border-radius: 9px; overflow: hidden; }
.dm-addsub__input { flex: 1; height: 40px; padding: 0 14px; border: none; background: transparent; color: var(--t1); font-family: inherit; font-size: 0.84rem; outline: none; }
.dm-addsub__suffix { padding: 0 14px; font-size: 0.82rem; color: var(--t3); border-left: 1px solid var(--border); height: 40px; display: flex; align-items: center; }
.dm-addbtn { display: inline-flex; align-items: center; gap: 7px; height: 40px; padding: 0 16px; border-radius: 9px; cursor: pointer; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.82rem; font-weight: 700; flex-shrink: 0; transition: transform 0.15s ease; }
.dm-addbtn:hover { transform: translateY(-1px); }

/* Email mailboxes */
.dm-mailhead { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 14px; }
.dm-mailtitle { display: flex; align-items: center; gap: 9px; margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--t1); }
.dm-mailnote { margin: 0; font-size: 0.78rem; color: var(--t3); }
.dm-mailnote s { color: var(--t4); }
.dm-mailbox { padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
.dm-mb__email { font-size: 0.92rem; font-weight: 700; color: var(--t1); }
.dm-mb__status { display: flex; align-items: center; gap: 7px; font-size: 0.78rem; color: var(--t2); }
.dm-mb__actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dm-mbbtn { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border-radius: 9px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.78rem; font-weight: 600; }
.dm-mbbtn:hover { color: var(--t1); border-color: var(--accent-border); }
.dm-mblink { background: none; border: none; cursor: pointer; color: var(--t3); font-family: inherit; font-size: 0.78rem; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; padding: 0 4px; }
.dm-mblink:hover { color: var(--t1); }
.dm-mblink--danger:hover { color: #ef4444; }
.dm-mbopen { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 9px; cursor: pointer; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.78rem; font-weight: 700; transition: transform 0.15s ease; }
.dm-mbopen:hover { transform: translateY(-1px); }

/* Modals */
.dm-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(8,12,10,0.55); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.dm-modal { width: 100%; max-width: 440px; background: var(--bg); border: 1px solid var(--border); border-radius: 20px; padding: 22px; }
.dm-modal__head { display: flex; align-items: center; justify-content: space-between; }
.dm-modal__title { font-size: 1.05rem; font-weight: 800; color: var(--t1); }
.dm-x { width: 32px; height: 32px; border-radius: 9px; border: 1px solid var(--border); background: var(--bg); color: var(--t3); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.dm-x:hover { color: var(--t1); border-color: var(--accent-border); }
.dm-modeswitch { display: flex; gap: 6px; margin: 16px 0 4px; background: var(--glass-hover); border: 1px solid var(--border-soft); border-radius: 10px; padding: 4px; }
.dm-mode { flex: 1; height: 34px; border-radius: 7px; border: none; cursor: pointer; background: transparent; color: var(--t3); font-family: inherit; font-size: 0.8rem; font-weight: 700; }
.dm-mode--on { background: var(--accent-dim); color: var(--accent); }
.dm-modal__label { display: block; margin: 16px 0 8px; font-size: 0.82rem; font-weight: 700; color: var(--t1); }
.dm-modal__hint { margin: 8px 0 0; font-size: 0.74rem; color: var(--t3); line-height: 1.5; }
.dm-input { width: 100%; height: 46px; padding: 0 14px; border-radius: 11px; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.88rem; outline: none; transition: border-color 0.16s ease; }
.dm-input:focus { border-color: var(--accent); }
select.dm-input { cursor: pointer; }
.dm-mbrow { display: flex; align-items: center; gap: 8px; }
.dm-mbat { color: var(--t3); font-weight: 700; }
.dm-modal__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.dm-cancel { height: 44px; padding: 0 20px; border-radius: 11px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.86rem; font-weight: 700; }
.dm-cancel:hover { color: var(--t1); border-color: var(--accent-border); }
.dm-pay { height: 44px; padding: 0 22px; border-radius: 11px; cursor: pointer; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.86rem; font-weight: 700; transition: transform 0.15s ease; }
.dm-pay:hover { transform: translateY(-2px); }

@media (max-width: 760px) {
  .dm-dhead { flex-direction: column; }
  .dm-row { flex-direction: column; align-items: stretch; gap: 10px; }
  .dm-select { min-width: 0; width: 100%; }
  .dm-addsub { flex-direction: column; align-items: stretch; }
}
</style>
