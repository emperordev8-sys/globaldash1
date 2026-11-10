<!-- src/views/WebsiteWidgetsView.vue -->
<template>
  <div class="ww">

    <!-- Header -->
    <div class="ww-head">
      <div class="ww-head__text">
        <h1 class="ww-title">Website Widgets</h1>
        <p class="ww-sub">Paste a widget on any website you own — a live chat you answer yourself, or a contact button that opens your WhatsApp and socials.</p>
      </div>
      <button class="ww-new" @click="openCreate">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New widget
      </button>
    </div>

    <!-- Search + filter -->
    <div class="ww-tools">
      <div class="ww-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search widgets..." />
      </div>
      <select v-model="statusFilter" class="ww-filter">
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="off">Switched off</option>
      </select>
    </div>

    <!-- List -->
    <div class="ww-list">
      <div class="ww-list__head">
        <span>WIDGET</span>
        <span>ACTIVITY</span>
      </div>

      <div v-if="filtered.length === 0" class="ww-empty">No widgets match your search.</div>

      <div v-for="w in filtered" :key="w.id" class="ww-row" :class="{ 'ww-row--off': w.status !== 'active' }">
        <div class="ww-info">
          <div class="ww-info__name">{{ w.name }}</div>
          <div class="ww-info__type">{{ w.type }}</div>
        </div>

        <div class="ww-activity">
          <span class="ww-act">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            </svg>
            {{ w.views }}<template v-if="w.period"> {{ w.period }}</template>
          </span>
          <span v-if="w.msgs > 0" class="ww-act ww-act--msg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {{ w.msgs }}
          </span>
        </div>

        <div class="ww-actions">
          <button class="ww-btn" @click="copySnippet(w)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Snippet
          </button>
          <button class="ww-btn" @click="soon('Console')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            Console
          </button>
          <button class="ww-btn" @click="soon('Name & logo')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Name &amp; logo
          </button>
          <button class="ww-btn" @click="soon('Domain')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Domain
          </button>
          <button class="ww-btn" @click="soon('Sign-in')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Sign-in
          </button>
          <button class="ww-btn" @click="duplicate(w)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Duplicate
          </button>
          <button class="ww-btn" :class="{ 'ww-btn--on': w.status !== 'active' }" @click="toggle(w)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
            {{ w.status === 'active' ? 'Switch off' : 'Switch on' }}
          </button>
          <button class="ww-btn ww-btn--danger" @click="remove(w)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- New widget modal -->
    <Transition name="ww-fade">
      <div v-if="showCreate" class="nw-backdrop" @click.self="showCreate = false">
        <div class="nw-modal">

          <div class="nw-head">
            <div>
              <h2 class="nw-title">New widget</h2>
              <p class="nw-sub">Pick what it does, give it a name and an address. You'll get a one-line snippet to paste on your website.</p>
            </div>
            <button class="nw-close" @click="showCreate = false" aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="nw-body">

            <!-- Type -->
            <div class="nw-typegrid">
              <button class="nw-typecard" :class="{ 'nw-typecard--on': form.type === 'Live Chat' }" @click="form.type = 'Live Chat'">
                <span class="nw-typecard__ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
                <span class="nw-typecard__name">Live Chat</span>
                <span class="nw-typecard__desc">Visitors message you and you answer from your own console — with staff, canned replies and a visitor list.</span>
              </button>
              <button class="nw-typecard" :class="{ 'nw-typecard--on': form.type === 'Contact Button' }" @click="form.type = 'Contact Button'">
                <span class="nw-typecard__ico nw-typecard__ico--blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
                <span class="nw-typecard__name">Contact Button</span>
                <span class="nw-typecard__desc">A floating button that opens your WhatsApp, socials, phone or email. Nothing to answer — they reach you where you already are.</span>
              </button>
            </div>

            <!-- Name -->
            <div class="nw-field">
              <label class="nw-label">Widget name</label>
              <input v-model="form.name" class="nw-input" :placeholder="form.type === 'Live Chat' ? 'Acme Store chat' : 'Acme Store contact'" />
              <p class="nw-hint">{{ form.type === 'Live Chat' ? 'Shown at the top of the chat bubble on your website. You can change it later.' : 'Shown at the top of the channel menu on your website. You can change it later.' }}</p>
            </div>

            <!-- Logo -->
            <div class="nw-field">
              <label class="nw-label">Logo (optional)</label>
              <div class="nw-logo-row">
                <div class="nw-logo-prev">
                  <img v-if="form.logoUrl" :src="form.logoUrl" alt="logo" />
                  <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <label class="nw-drop" @dragover.prevent @drop.prevent="onLogoDrop">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span>Drag &amp; drop or click</span>
                  <input type="file" accept="image/*" class="nw-file" @change="onLogoChange" />
                </label>
              </div>
              <p class="nw-hint">Used everywhere your brand shows: your console, its browser tab and home-screen icon, your sign-in screen, and the chat window on your website.</p>
            </div>

            <!-- Live Chat: reply name -->
            <div v-if="form.type === 'Live Chat'" class="nw-field">
              <label class="nw-label">Name on your replies</label>
              <input v-model="form.replyName" class="nw-input" placeholder="Support" />
              <p class="nw-hint">What visitors see above every message you send. Leave blank for "Support". Changeable any time in your console.</p>
            </div>

            <!-- Contact Button: channels -->
            <div v-else class="nw-field">
              <label class="nw-label">Where should the button send people?</label>
              <div v-for="(ch, i) in form.channels" :key="i" class="nw-channel">
                <select v-if="ch.kind !== 'Link'" v-model="ch.kind" class="nw-input nw-chan-select">
                  <option>WhatsApp</option><option>Telegram</option><option>Instagram</option>
                  <option>Facebook</option><option>Phone</option><option>Email</option>
                </select>
                <span v-else class="nw-chan-tag">Link</span>
                <input v-model="ch.value" class="nw-input" :placeholder="channelPlaceholder(ch.kind)" />
                <button class="nw-chan-remove" @click="form.channels.splice(i, 1)" aria-label="Remove">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div class="nw-addrow">
                <button class="nw-addbtn" @click="addChannel">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add a channel
                </button>
                <button class="nw-addbtn" @click="addLink">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add your own link
                </button>
              </div>
              <p class="nw-hint">Add at least one channel — a button with no links has nothing to open.</p>
            </div>

            <!-- Reach / domain -->
            <div class="nw-field">
              <label class="nw-label">Where should customers reach this?</label>
              <div class="nw-reachgrid">
                <button class="nw-reach" :class="{ 'nw-reach--on': form.reach === 'subdomain' }" @click="form.reach = 'subdomain'">
                  <span class="nw-reach__ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
                  <span class="nw-reach__name">A free subdomain</span>
                  <span class="nw-reach__desc">Live straight away on our domain — nothing to set up</span>
                </button>
                <button class="nw-reach" :class="{ 'nw-reach--on': form.reach === 'buy' }" @click="form.reach = 'buy'">
                  <span class="nw-reach__ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span>
                  <span class="nw-reach__name">A domain from us</span>
                  <span class="nw-reach__desc">Buy a new one, or use one you already bought here — we connect it for you</span>
                </button>
                <button class="nw-reach" :class="{ 'nw-reach--on': form.reach === 'own' }" @click="form.reach = 'own'">
                  <span class="nw-reach__ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
                  <span class="nw-reach__name">A domain I own elsewhere</span>
                  <span class="nw-reach__desc">Connect it with a couple of DNS records, or move its nameservers to us</span>
                </button>
              </div>

              <div v-if="form.reach === 'subdomain'" class="nw-subrow">
                <input v-model="form.subdomain" class="nw-input" placeholder="acme-chat" />
                <select v-model="form.suffix" class="nw-input nw-suffix"><option>.s1g0.com</option><option>.globalgle.com</option></select>
              </div>
              <div v-else class="nw-subrow">
                <input v-model="form.ownDomain" class="nw-input" placeholder="chat.yourdomain.com" />
              </div>
              <p class="nw-hint">Lowercase letters, numbers and dashes -- then pick a domain. Locked in once created.</p>
              <div class="nw-note">Nobody visits this address. It is where your widget loads from, and where you sign in to read messages — visiting it in a browser shows nothing, on purpose.</div>
            </div>

            <!-- Live Chat: ask for -->
            <div v-if="form.type === 'Live Chat'" class="nw-field">
              <label class="nw-label">Before someone chats, ask for...</label>
              <label class="nw-check"><input type="checkbox" v-model="form.askName" /> <span>Their name</span></label>
              <label class="nw-check"><input type="checkbox" v-model="form.askEmail" /> <span>Their email</span></label>
            </div>

            <!-- Sign in -->
            <div class="nw-field">
              <label class="nw-label">How you sign in to your console</label>
              <p class="nw-subq">How will you sign in to this site's admin?</p>
              <div class="nw-signtoggle">
                <button type="button" :class="{ 'nw-sign--on': form.signIn === 'access-code' }" @click="form.signIn = 'access-code'">Access code</button>
                <button type="button" :class="{ 'nw-sign--on': form.signIn === 'email' }" @click="form.signIn = 'email'">Email &amp; password</button>
              </div>
              <input v-if="form.signIn === 'access-code'" v-model="form.accessCode" class="nw-input" placeholder="Leave blank to generate one" />
              <div v-else class="nw-twocol">
                <input v-model="form.email" type="email" class="nw-input" placeholder="Admin email" />
                <input v-model="form.password" type="password" class="nw-input" placeholder="Password" />
              </div>
              <p class="nw-hint">Staff always sign in with an email and password you set for them — this choice is just for you.</p>
            </div>

          </div>

          <div class="nw-foot">
            <button class="nw-cancel" @click="showCreate = false">Cancel</button>
            <button class="nw-create" @click="createWidget">Create widget</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from '../composables/useToast.js'
import { useSiteStore } from '../composables/useSiteStore.js'

const { success, info } = useToast()
const { store } = useSiteStore()
const widgets = store.widgets

const search = ref('')
const statusFilter = ref('all')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return widgets.filter(w =>
    (statusFilter.value === 'all' || w.status === statusFilter.value) &&
    (!q || w.name.toLowerCase().includes(q) || w.type.toLowerCase().includes(q))
  )
})

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'widget'
}
function copySnippet(w) {
  const code = `<script src="https://widgets.globalgle.com/${slug(w.name)}.js" async><\/script>`
  navigator.clipboard?.writeText(code).catch(() => {})
  success('Snippet copied', 'Paste it before </body> on your website.')
}
function soon(label) {
  info(`${label} coming soon`, 'This option is not available yet — check back shortly.')
}
function duplicate(w) {
  widgets.unshift({ ...w, id: Date.now(), name: `${w.name} copy`, views: 0, msgs: 0 })
  success('Widget duplicated', `A copy of "${w.name}" was created.`)
}
function toggle(w) {
  w.status = w.status === 'active' ? 'off' : 'active'
  info(w.status === 'active' ? 'Widget switched on' : 'Widget switched off', `"${w.name}" is now ${w.status === 'active' ? 'live' : 'off'}.`)
}
function remove(w) {
  const i = widgets.findIndex(x => x.id === w.id)
  if (i !== -1) widgets.splice(i, 1)
  success('Widget deleted', `"${w.name}" has been removed.`)
}

/* Create */
const showCreate = ref(false)
const form = reactive({
  type: 'Live Chat',
  name: '',
  logoUrl: '',
  replyName: '',
  channels: [],
  reach: 'subdomain',
  subdomain: '',
  suffix: '.s1g0.com',
  ownDomain: '',
  askName: true,
  askEmail: true,
  signIn: 'access-code',
  accessCode: '',
  email: '',
  password: '',
})
function resetForm() {
  Object.assign(form, {
    type: 'Live Chat', name: '', logoUrl: '', replyName: '', channels: [],
    reach: 'subdomain', subdomain: '', suffix: '.s1g0.com', ownDomain: '',
    askName: true, askEmail: true, signIn: 'access-code', accessCode: '', email: '', password: '',
  })
}
function openCreate() { resetForm(); showCreate.value = true }

function onLogoChange(e) {
  const file = e.target.files?.[0]
  if (file) form.logoUrl = URL.createObjectURL(file)
}
function onLogoDrop(e) {
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) form.logoUrl = URL.createObjectURL(file)
}
function addChannel() { form.channels.push({ kind: 'WhatsApp', value: '' }) }
function addLink() { form.channels.push({ kind: 'Link', value: '' }) }
function channelPlaceholder(kind) {
  if (kind === 'Link') return 'https://...'
  if (kind === 'WhatsApp') return '+1 555 000 0000'
  if (kind === 'Phone') return '+1 555 000 0000'
  if (kind === 'Email') return 'you@example.com'
  return '@yourhandle'
}

function createWidget() {
  if (!form.name.trim()) { info('Name required', 'Please enter a widget name.'); return }
  if (form.type === 'Contact Button' && form.channels.length === 0) {
    info('Add a channel', 'A contact button needs at least one link to open.'); return
  }
  widgets.unshift({
    id: Date.now(),
    name: form.name.trim(),
    type: form.type,
    views: 0, msgs: 0, status: 'active',
    logoUrl: form.logoUrl,
    replyName: form.replyName,
    channels: [...form.channels],
    domain: form.reach === 'subdomain' ? (form.subdomain || 'widget') + form.suffix : form.ownDomain,
    signIn: form.signIn,
  })
  success('Widget created', `"${form.name.trim()}" is ready to embed.`)
  showCreate.value = false
}
</script>

<style scoped>
.ww { display: flex; flex-direction: column; gap: 16px; }

/* Header */
.ww-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.ww-head__text { display: flex; flex-direction: column; gap: 6px; min-width: 0; max-width: 680px; }
.ww-title { margin: 0; font-size: 1.55rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
.ww-sub { margin: 0; font-size: 0.84rem; color: var(--t2); font-weight: 500; line-height: 1.5; }
.ww-new {
  flex-shrink: 0; display: inline-flex; align-items: center; gap: 7px;
  height: 42px; padding: 0 20px; border-radius: 11px; cursor: pointer;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%);
  color: #fff; border: none; font-family: inherit; font-size: 0.84rem; font-weight: 700;
  transition: transform 0.15s ease;
}
.ww-new:hover { transform: translateY(-2px); }

/* Tools */
.ww-tools { display: flex; gap: 12px; flex-wrap: wrap; }
.ww-search {
  flex: 1; min-width: 200px; display: flex; align-items: center; gap: 9px;
  height: 46px; padding: 0 14px; border-radius: 12px;
  background: var(--bg); border: 1px solid var(--t4); color: var(--t3);
}
.ww-search input { flex: 1; background: none; border: none; outline: none; font-family: inherit; font-size: 0.88rem; color: var(--t1); }
.ww-search input::placeholder { color: var(--t3); }
.ww-filter {
  height: 46px; padding: 0 14px; border-radius: 12px;
  background: var(--bg); border: 1px solid var(--t4); color: var(--t1);
  font-family: inherit; font-size: 0.84rem; font-weight: 600; cursor: pointer; outline: none;
}

/* List */
.ww-list { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; overflow: hidden; }
.ww-list__head {
  display: grid; grid-template-columns: 1fr auto;
  padding: 12px 20px; border-bottom: 1px solid var(--border-soft);
  font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; color: var(--t3);
}
.ww-empty { padding: 32px; text-align: center; color: var(--t3); font-size: 0.85rem; }

.ww-row {
  display: grid; grid-template-columns: minmax(150px, 1fr) auto;
  grid-template-areas: "info activity" "actions actions";
  gap: 10px 16px; align-items: center;
  padding: 16px 20px; border-bottom: 1px solid var(--border-soft);
  transition: background 0.15s ease;
}
.ww-row:last-child { border-bottom: none; }
.ww-row:hover { background: var(--glass); }
.ww-row--off { opacity: 0.6; }

.ww-info { grid-area: info; }
.ww-info__name { font-size: 0.92rem; font-weight: 700; color: var(--t1); }
.ww-info__type { font-size: 0.74rem; color: var(--t3); margin-top: 2px; }

.ww-activity { grid-area: activity; display: flex; align-items: center; gap: 12px; }
.ww-act { display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 600; color: var(--t3); }
.ww-act--msg { color: #16a34a; }

.ww-actions { grid-area: actions; display: flex; flex-wrap: wrap; gap: 8px; }
.ww-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 13px; border-radius: 9px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.76rem; font-weight: 600;
  transition: color 0.16s ease, border-color 0.16s ease, background 0.16s ease;
}
.ww-btn:hover { color: var(--t1); border-color: var(--t3); }
.ww-btn--on { color: #16a34a; border-color: rgba(22,163,74,0.4); }
.ww-btn--on:hover { color: #16a34a; }
.ww-btn--danger { color: #ef4444; border-color: rgba(239,68,68,0.3); }
.ww-btn--danger:hover { color: #ef4444; border-color: rgba(239,68,68,0.55); background: rgba(239,68,68,0.06); }

/* Larger screens: actions share the right column, two-ish rows */
@media (min-width: 720px) {
  .ww-row {
    grid-template-columns: minmax(160px, 260px) auto 1fr;
    grid-template-areas: "info activity actions";
  }
  .ww-actions { justify-content: flex-end; }
}

/* ══════════════════════════════════
   NEW WIDGET MODAL
   ══════════════════════════════════ */
.nw-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(8,15,12,0.55); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.nw-modal {
  width: 100%; max-width: 560px; max-height: 92vh;
  background: var(--bg); border: 1px solid var(--border); border-radius: 20px;
  display: flex; flex-direction: column; overflow: hidden;
  animation: nw-pop 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes nw-pop { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: none; } }

.nw-head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;
  padding: 22px 24px 16px; border-bottom: 1px solid var(--border-soft); flex-shrink: 0;
}
.nw-title { margin: 0 0 5px; font-size: 1.2rem; font-weight: 800; color: var(--t1); }
.nw-sub { margin: 0; font-size: 0.82rem; color: var(--t2); line-height: 1.5; max-width: 420px; }
.nw-close {
  width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0; cursor: pointer;
  background: var(--glass-hover); border: 1px solid transparent; color: var(--t3);
  display: flex; align-items: center; justify-content: center; transition: color 0.16s, border-color 0.16s;
}
.nw-close:hover { color: var(--t1); border-color: var(--accent-border); }

.nw-body { padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 22px; }

/* Type cards */
.nw-typegrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.nw-typecard {
  text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 8px;
  padding: 14px; border-radius: 14px; background: var(--bg);
  border: 1.5px solid var(--border); font-family: inherit;
  transition: border-color 0.16s ease, background 0.16s ease;
}
.nw-typecard:hover { border-color: var(--t3); }
.nw-typecard--on { border-color: var(--accent); background: rgba(22,163,74,0.06); }
.nw-typecard__ico {
  width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  background: rgba(22,163,74,0.12); color: #16a34a;
}
.nw-typecard__ico--blue { background: rgba(79,70,229,0.12); color: #4f46e5; }
.nw-typecard__name { font-size: 0.88rem; font-weight: 800; color: var(--t1); }
.nw-typecard__desc { font-size: 0.75rem; color: var(--t2); line-height: 1.5; }

/* Fields */
.nw-field { display: flex; flex-direction: column; gap: 8px; }
.nw-label { font-size: 0.86rem; font-weight: 800; color: var(--t1); }
.nw-subq { margin: -2px 0 2px; font-size: 0.78rem; font-weight: 700; color: var(--t2); }
.nw-hint { margin: 2px 0 0; font-size: 0.74rem; color: var(--t3); line-height: 1.5; }
.nw-input {
  width: 100%; height: 44px; padding: 0 14px; border-radius: 11px;
  background: var(--bg); border: 1px solid var(--border); color: var(--t1);
  font-family: inherit; font-size: 0.88rem; outline: none; transition: border-color 0.16s ease;
}
.nw-input:focus { border-color: var(--accent); }
select.nw-input { cursor: pointer; }

/* Logo */
.nw-logo-row { display: flex; gap: 12px; align-items: stretch; }
.nw-logo-prev {
  width: 72px; height: 72px; border-radius: 12px; flex-shrink: 0;
  background: var(--glass-hover); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center; color: var(--t3); overflow: hidden;
}
.nw-logo-prev img { width: 100%; height: 100%; object-fit: cover; }
.nw-drop {
  flex: 1; border: 1.5px dashed var(--border); border-radius: 12px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  color: var(--t3); font-size: 0.82rem; font-weight: 600; cursor: pointer; position: relative;
  transition: border-color 0.16s ease, color 0.16s ease;
}
.nw-drop:hover { border-color: var(--accent-border); color: var(--t2); }
.nw-file { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

/* Channels (contact button) */
.nw-channel { display: flex; align-items: center; gap: 8px; }
.nw-chan-select { max-width: 140px; }
.nw-chan-tag {
  display: inline-flex; align-items: center; height: 44px; padding: 0 14px; border-radius: 11px;
  background: var(--glass-hover); border: 1px solid var(--border); color: var(--t2);
  font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
}
.nw-chan-remove {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t3);
  display: flex; align-items: center; justify-content: center;
}
.nw-chan-remove:hover { color: #ef4444; border-color: rgba(239,68,68,0.4); }
.nw-addrow { display: flex; gap: 8px; flex-wrap: wrap; }
.nw-addbtn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 38px; padding: 0 14px; border-radius: 10px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.8rem; font-weight: 600;
}
.nw-addbtn:hover { color: var(--t1); border-color: var(--accent-border); }

/* Reach cards */
.nw-reachgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.nw-reach {
  text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 7px;
  padding: 13px; border-radius: 12px; background: var(--bg);
  border: 1.5px solid var(--border); font-family: inherit;
  transition: border-color 0.16s ease, background 0.16s ease;
}
.nw-reach:hover { border-color: var(--t3); }
.nw-reach--on { border-color: var(--accent); background: rgba(22,163,74,0.06); }
.nw-reach__ico { color: #16a34a; }
.nw-reach__name { font-size: 0.8rem; font-weight: 800; color: var(--t1); line-height: 1.25; }
.nw-reach__desc { font-size: 0.72rem; color: var(--t2); line-height: 1.45; }
.nw-subrow { display: flex; gap: 8px; }
.nw-suffix { max-width: 150px; }
.nw-note {
  font-size: 0.76rem; color: var(--t2); line-height: 1.5;
  background: var(--glass); border: 1px solid var(--border-soft); border-radius: 11px; padding: 12px 14px;
}

/* Checkboxes */
.nw-check { display: flex; align-items: center; gap: 9px; font-size: 0.84rem; font-weight: 600; color: var(--t1); cursor: pointer; }
.nw-check input { width: 17px; height: 17px; accent-color: #16a34a; cursor: pointer; }

/* Sign in toggle */
.nw-signtoggle { display: flex; gap: 8px; }
.nw-signtoggle button {
  flex: 1; height: 44px; border-radius: 11px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.84rem; font-weight: 700;
}
.nw-sign--on { background: #16a34a !important; border-color: #16a34a !important; color: #fff !important; }
.nw-twocol { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

/* Footer */
.nw-foot {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 14px 24px; border-top: 1px solid var(--border-soft); flex-shrink: 0;
}
.nw-cancel {
  height: 42px; padding: 0 18px; border-radius: 11px; cursor: pointer;
  background: var(--bg); border: 1px solid var(--border); color: var(--t2);
  font-family: inherit; font-size: 0.84rem; font-weight: 700;
}
.nw-cancel:hover { color: var(--t1); border-color: var(--t3); }
.nw-create {
  height: 42px; padding: 0 22px; border-radius: 11px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff;
  font-family: inherit; font-size: 0.86rem; font-weight: 700;
   transition: transform 0.12s ease;
}
.nw-create:hover { transform: translateY(-1px); }

@media (max-width: 560px) {
  .nw-typegrid { grid-template-columns: 1fr; }
  .nw-reachgrid { grid-template-columns: 1fr; }
}

.ww-fade-enter-active, .ww-fade-leave-active { transition: opacity 0.2s ease; }
.ww-fade-enter-from, .ww-fade-leave-to { opacity: 0; }
</style>
