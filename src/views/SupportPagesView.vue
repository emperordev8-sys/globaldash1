<!-- src/views/SupportPagesView.vue -->
<template>
  <div class="sp-page">

    <!-- Header row -->
    <div class="sp-header">
      <div class="sp-header__left">
        <h1 class="sp-header__title">Support Pages</h1>
        <p class="sp-header__sub">
          Create branded support pages. Pick a brand template, drop in a
          chat-widget embed code, then share the public link.
        </p>
      </div>
      <button class="btn-new" @click="showForm = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.8" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New support page
      </button>
    </div>

    <!-- Support pages grid -->
    <div v-if="pages.length === 0" class="sp-empty-card">
      <div class="sp-empty__inner">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
        </svg>
        <span>No support pages yet. Create your first one.</span>
      </div>
    </div>

    <div v-else class="sp-grid">
      <div v-for="page in pages" :key="page.id" class="sp-card">
        <div class="sp-card__top">
          <div class="sp-card__title-group">
            <span class="sp-card__name">{{ page.title }}</span>
            <span class="sp-card__template">{{ brandLabel(page.template) }}</span>
          </div>
          <ActionsMenu :items="pageActions(page)" />
        </div>

        <div class="sp-card__showcase">
          <img :src="supportImg" alt="Support" class="sp-card__showcase-img" />
        </div>

        <div class="sp-card__bottom">
          <a :href="page.url" target="_blank" class="sp-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Open
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>

          <span class="sp-status" :class="`sp-status--${page.status}`">{{ page.status }}</span>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         NEW SUPPORT PAGE MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
        <div class="modal">

          <!-- Fixed header -->
          <div class="modal-head">
            <h2 class="modal-head__title">
              <template v-if="editing">Edit "{{ form.title }}"</template>
              <template v-else>New support page</template>
            </h2>
            <button class="modal-close" @click="closeForm" aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="modal-body">

            <!-- ══════════════════════
                 CREATE MODE
            ══════════════════════ -->
            <template v-if="!editing">

              <!-- ① Title -->
              <div class="mf-section">
                <label class="mf-label">Title</label>
                <input v-model="form.title" type="text" class="mf-input"
                  placeholder="e.g. Binance Withdrawal Help" />
              </div>

              <!-- ② Brand template -->
              <div class="mf-section">
                <div class="mf-label-row">
                  <span class="mf-label">Brand template</span>
                  <span class="mf-required">*</span>
                </div>
                <p class="mf-hint">Choose the brand the page should look like. Can't be changed after creation.</p>
                <div class="brand-grid">
                  <button v-for="b in brands" :key="b.value" type="button"
                    class="brand-card" :class="{ 'brand-card--active': form.template === b.value }"
                    @click="form.template = b.value">
                    <span class="brand-icon" :style="{ background: b.bg }">
                      <img v-if="!iconErrors[b.value]"
                        :src="`https://cdn.simpleicons.org/${b.slug}/${b.iconColor}`"
                        :alt="b.label" class="brand-logo-img"
                        @error="iconErrors[b.value] = true" />
                      <span v-else class="brand-abbr" :style="{ color: `#${b.iconColor}` }">{{ b.abbr }}</span>
                    </span>
                    <span class="brand-name">{{ b.label }}</span>
                  </button>
                </div>
              </div>

              <!-- ③ Where should customers reach this? -->
              <div class="mf-section">
                <label class="mf-label">Where should customers reach this?</label>
                <div class="reach-options">
                  <div class="reach-card" :class="{ 'reach-card--active': form.reachType === 'subdomain' }"
                    @click="form.reachType = 'subdomain'">
                    <div class="reach-card__top">
                      <span class="reach-icon reach-icon--star">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round">
                          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                        </svg>
                      </span>
                      <div>
                        <span class="reach-card__title">Use our subdomain</span>
                        <span class="reach-free-badge">free</span>
                      </div>
                    </div>
                    <p class="reach-card__desc">Pick a keyword — we set up the link for you. Nothing to configure at your domain.</p>
                    <div v-if="form.reachType === 'subdomain'" class="subdomain-row">
                      <input v-model="form.subdomain" type="text" class="subdomain-input" placeholder="support" />
                      <select v-model="form.subdomainSuffix" class="subdomain-select">
                        <option>.qst1x.com</option>
                        <option>.globalgle.com</option>
                      </select>
                    </div>
                    <p v-if="form.reachType === 'subdomain'" class="subdomain-hint">
                      Lowercase letters, numbers and dashes — then pick a domain. Locked in once created.
                    </p>
                  </div>
                  <div class="reach-card" :class="{ 'reach-card--active': form.reachType === 'own' }"
                    @click="form.reachType = 'own'">
                    <div class="reach-card__top">
                      <span class="reach-icon reach-icon--globe">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      </span>
                      <span class="reach-card__title">Use my own domain</span>
                    </div>
                    <p class="reach-card__desc">Enter a domain you already own. We'll show the DNS steps right after.</p>
                    <div v-if="form.reachType === 'own'" class="mt-8">
                      <input v-model="form.ownDomain" type="text" class="mf-input" placeholder="support.yourdomain.com" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- ④ Visitor support -->
              <div class="mf-section">
                <label class="mf-label">Visitor support</label>
                <p class="mf-hint">Choose what support option visitors see on this page.</p>
                <div class="support-options">
                  <div v-for="opt in supportOptions" :key="opt.value"
                    class="support-card" :class="{ 'support-card--active': form.visitorSupport === opt.value }"
                    @click="form.visitorSupport = opt.value">
                    <span class="support-card__title">{{ opt.label }}</span>
                    <span class="support-card__desc">{{ opt.desc }}</span>
                  </div>
                </div>
                <div v-if="form.visitorSupport === 'widget'" class="mf-section" style="margin-top:16px;">
                  <label class="mf-label">Website widget code (any chat widget or chatbot)</label>
                  <textarea v-model="form.embedCode" class="mf-input mf-textarea" rows="5"
                    placeholder="<!-- Paste any chat widget or chatbot embed code (Smartsupp, Tawk.to, Tidio, Crisp, Intercom, Chatling...) -->" />
                  <p class="mf-hint" style="margin-top:6px;">
                    Works with any chat widget or chatbot embed code (smartsupp, tidio, tawk.to, intercom, crisp, zendesk, chatling, …).
                  </p>
                </div>
                <div v-if="form.visitorSupport === 'external'" class="mf-section" style="margin-top:16px;">
                  <label class="mf-label">Support link</label>
                  <input v-model="form.externalUrl" type="url" class="mf-input" placeholder="https://your-support-link.com" />
                  <p class="mf-hint" style="margin-top:6px;">Visitors tap a support bubble on the page and open this link in a new tab.</p>
                </div>
              </div>

            </template>

            <!-- ══════════════════════
                 EDIT MODE
            ══════════════════════ -->
            <template v-else>

              <!-- Title -->
              <div class="mf-section">
                <label class="mf-label">Title</label>
                <input v-model="form.title" type="text" class="mf-input" />
              </div>

              <!-- Brand template notice (read-only) -->
              <div class="mf-section">
                <div class="brand-notice">
                  Brand template: <strong>{{ form.template }}</strong>
                  <span>(cannot be changed after creation; delete and recreate to swap)</span>
                </div>
              </div>

              <!-- Domain -->
              <div class="mf-section">
                <label class="mf-label">Domain</label>
                <p class="mf-hint" style="margin-bottom:10px;">How should people reach this page?</p>
                <select v-model="form.reachType" class="mf-input">
                  <option value="subdomain">Use our subdomain -- free</option>
                  <option value="own">Use my own domain</option>
                </select>
                <div class="address-box">
                  <span class="address-box__label">YOUR ADDRESS</span>
                  <div class="address-row">
                    <span v-if="!editingAddress" class="address-value">{{ form.address }}</span>
                    <input v-else v-model="form.address" type="text" class="address-edit-input" />
                    <span class="address-live">live</span>
                    <button class="address-edit-btn" type="button" @click="editingAddress = !editingAddress">
                      {{ editingAddress ? 'Save' : 'Edit' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Visitor support -->
              <div class="mf-section">
                <label class="mf-label">Visitor support</label>
                <p class="mf-hint">Choose what support option visitors see on this page.</p>
                <div class="support-options">
                  <div v-for="opt in supportOptions" :key="opt.value"
                    class="support-card" :class="{ 'support-card--active': form.visitorSupport === opt.value }"
                    @click="form.visitorSupport = opt.value">
                    <span class="support-card__title">{{ opt.label }}</span>
                    <span class="support-card__desc">{{ opt.desc }}</span>
                  </div>
                </div>
                <div v-if="form.visitorSupport === 'widget'" class="mf-section" style="margin-top:16px;">
                  <label class="mf-label">Website widget code (any chat widget or chatbot)</label>
                  <textarea v-model="form.embedCode" class="mf-input mf-textarea" rows="5"
                    placeholder="<!-- Paste any chat widget or chatbot embed code (Smartsupp, Tawk.to, Tidio, Crisp, Intercom, Chatling...) -->" />
                  <p class="mf-hint" style="margin-top:6px;">
                    Works with any chat widget or chatbot embed code (smartsupp, tidio, tawk.to, intercom, crisp, zendesk, chatling, …).
                  </p>
                </div>
                <div v-if="form.visitorSupport === 'external'" class="mf-section" style="margin-top:16px;">
                  <label class="mf-label">Support link</label>
                  <input v-model="form.externalUrl" type="url" class="mf-input" placeholder="https://wa.link/yourlink" />
                  <p class="mf-hint" style="margin-top:6px;">Visitors tap a support bubble on the page and open this link in a new tab.</p>
                </div>
              </div>

              <!-- Active toggle -->
              <div class="mf-section">
                <div class="active-row">
                  <div class="active-row__body">
                    <span class="active-row__title">Active</span>
                    <p class="active-row__desc">
                      Turn off to take the public link offline. Visitors will see a blank page — the page itself is not deleted, so you can flip it back on anytime.
                    </p>
                  </div>
                  <button
                    type="button"
                    class="toggle-switch"
                    :class="{ 'toggle-switch--on': form.active }"
                    @click="form.active = !form.active"
                    :aria-label="form.active ? 'Deactivate' : 'Activate'"
                  >
                    <span class="toggle-thumb" />
                  </button>
                </div>
              </div>

            </template>

          </div><!-- end modal-body -->

          <!-- Fixed footer -->
          <div class="modal-footer">
            <button class="mf-btn-cancel" @click="closeForm">Cancel</button>
            <button class="mf-btn-create" @click="savePage">
              {{ editing ? 'Save' : 'Create' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useToast } from '../composables/useToast.js'
import { useSiteStore } from '../composables/useSiteStore.js'
import ActionsMenu from '../components/ui/ActionsMenu.vue'
import supportImg from '../assets/support.png'

const { success, error: toastError } = useToast()
const { store } = useSiteStore()
const pages = store.support

const iconErrors = reactive({})

const showForm      = ref(false)
const editing       = ref(null)
const editingAddress = ref(false)

const form = reactive({
  title:           '',
  template:        '',
  reachType:       'subdomain',
  subdomain:       '',
  subdomainSuffix: '.qst1x.com',
  ownDomain:       '',
  address:         '',
  active:          true,
  visitorSupport:  'widget',
  embedCode:       '',
  externalUrl:     '',
})

/* ── Brands ── */
const brands = [
  { value: 'apple',       label: 'Apple',        slug: 'apple',          abbr: 'AP', bg: '#1d1d1f', iconColor: 'ffffff' },
  { value: 'binance',     label: 'Binance',       slug: 'binance',        abbr: 'B',  bg: '#1e2026', iconColor: 'f0b90b' },
  { value: 'bitcoin',     label: 'Bitcoin',       slug: 'bitcoin',        abbr: '₿',  bg: '#f7931a', iconColor: 'ffffff' },
  { value: 'bitso',       label: 'Bitso',         slug: 'bitso',          abbr: 'B',  bg: '#0f1923', iconColor: 'ffffff' },
  { value: 'blockchain',  label: 'Blockchain.c…', slug: 'blockchaincom',  abbr: 'BC', bg: '#1a3a4a', iconColor: '00b4d8' },
  { value: 'bybit',       label: 'Bybit',         slug: 'bybit',          abbr: 'BY', bg: '#1b1d21', iconColor: 'f7a600' },
  { value: 'byd',         label: 'BYD',           slug: 'byd',            abbr: 'BY', bg: '#cc0000', iconColor: 'ffffff' },
  { value: 'cashapp',     label: 'Cash App',      slug: 'cashapp',        abbr: '$',  bg: '#00d632', iconColor: 'ffffff' },
  { value: 'changelly',   label: 'Changelly',     slug: 'changelly',      abbr: 'CH', bg: '#00bfa5', iconColor: 'ffffff' },
  { value: 'chime',       label: 'Chime',         slug: 'chime',          abbr: 'CH', bg: '#1ec677', iconColor: 'ffffff' },
  { value: 'coinbase',    label: 'Coinbase',      slug: 'coinbase',       abbr: 'C',  bg: '#0052ff', iconColor: 'ffffff' },
  { value: 'crypto',      label: 'Crypto.com',    slug: 'cryptocom',      abbr: '◈',  bg: '#002d74', iconColor: 'ffffff' },
  { value: 'exodus',      label: 'Exodus',        slug: 'exodus',         abbr: 'EX', bg: '#1a0533', iconColor: '8b5cf6' },
  { value: 'facebook',    label: 'Facebook',      slug: 'facebook',       abbr: 'f',  bg: '#1877f2', iconColor: 'ffffff' },
  { value: 'gcash',       label: 'GCash',         slug: 'gcash',          abbr: 'G',  bg: '#007aff', iconColor: 'ffffff' },
  { value: 'instagram',   label: 'Instagram',     slug: 'instagram',      abbr: 'IN', bg: '#e1306c', iconColor: 'ffffff' },
  { value: 'luno',        label: 'Luno',          slug: 'luno',           abbr: 'L',  bg: '#0d47a1', iconColor: 'ffffff' },
  { value: 'metamask',    label: 'MetaMask',      slug: 'metamask',       abbr: 'M',  bg: '#f6851b', iconColor: 'ffffff' },
  { value: 'okx',         label: 'OKX',           slug: 'okx',            abbr: 'OK', bg: '#000000', iconColor: 'ffffff' },
  { value: 'opensea',     label: 'OpenSea',       slug: 'opensea',        abbr: 'OS', bg: '#2081e2', iconColor: 'ffffff' },
  { value: 'paypal',      label: 'PayPal',        slug: 'paypal',         abbr: 'P',  bg: '#003087', iconColor: 'ffffff' },
  { value: 'tesla',       label: 'Tesla',         slug: 'tesla',          abbr: 'TE', bg: '#cc0000', iconColor: 'ffffff' },
  { value: 'trustwallet', label: 'Trust Wallet',  slug: 'trustwallet',    abbr: 'TW', bg: '#3375bb', iconColor: 'ffffff' },
  { value: 'wellsfargo',  label: 'Wells Fargo',   slug: 'wellsfargo',     abbr: 'WF', bg: '#cc0000', iconColor: 'ffffff' },
  { value: 'zelle',       label: 'Zelle',         slug: 'zelle',          abbr: 'Z',  bg: '#6d1ed4', iconColor: 'ffffff' },
]

const supportOptions = [
  { value: 'off',      label: 'Off',            desc: 'No chat widget — just the branded page.' },
  { value: 'widget',   label: 'Website Widget', desc: 'Embed any chat widget or chatbot (Smartsupp, Tawk, Crisp, Chatling, …).' },
  { value: 'external', label: 'External link',  desc: 'Open a support link in a new tab.' },
]

function brandLabel(val) {
  return brands.find(b => b.value === val)?.label ?? val
}

function pageActions(page) {
  return [
    {
      label: 'Edit',
      icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      onClick: () => editPage(page),
    },
    {
      label: 'Delete',
      icon: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
      onClick: () => deletePage(page.id),
      variant: 'danger',
    },
  ]
}

function editPage(page) {
  editing.value          = page.id
  editingAddress.value   = false
  form.title             = page.title
  form.template          = page.template
  form.embedCode         = page.embedCode     || ''
  form.externalUrl       = page.externalUrl   || ''
  form.reachType         = page.reachType     || 'subdomain'
  form.subdomain         = page.subdomain     || ''
  form.visitorSupport    = page.visitorSupport || 'widget'
  form.address           = page.address       || `${page.template}.customers-help-center.com`
  form.active            = page.active !== undefined ? page.active : true
  showForm.value         = true
}

function deletePage(id) {
  const i = pages.findIndex(p => p.id === id)
  if (i !== -1) pages.splice(i, 1)
  success('Page deleted', 'The support page has been removed.')
}

function savePage() {
  if (!form.title.trim()) {
    toastError('Title required', 'Please enter a title for your support page.')
    return
  }
  if (!form.template) {
    toastError('Brand template required', 'Please choose a brand template.')
    return
  }
  const entry = {
    title:          form.title,
    template:       form.template,
    status:         'active',
    url:            '#',
    reachType:      form.reachType,
    subdomain:      form.subdomain,
    visitorSupport: form.visitorSupport,
    embedCode:      form.embedCode,
    externalUrl:    form.externalUrl,
  }
  if (editing.value) {
    const idx = pages.findIndex(p => p.id === editing.value)
    if (idx !== -1) pages.splice(idx, 1, {
      ...pages[idx], ...entry,
      address: form.address,
      active:  form.active,
      status:  form.active ? 'active' : 'draft',
    })
    success('Changes saved', 'Your support page has been updated.')
  } else {
    pages.push({ id: Date.now(), ...entry })
    success('Support page created', `"${entry.title}" is now active and ready to share.`)
  }
  closeForm()
}

function closeForm() {
  showForm.value        = false
  editing.value         = null
  editingAddress.value  = false
  form.title            = ''
  form.template         = ''
  form.reachType        = 'subdomain'
  form.subdomain        = ''
  form.subdomainSuffix  = '.qst1x.com'
  form.ownDomain        = ''
  form.address          = ''
  form.visitorSupport   = 'widget'
  form.embedCode        = ''
  form.externalUrl      = ''
  form.active           = true
}
</script>

<style scoped>
/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
.sp-page { display: flex; flex-direction: column; gap: 24px; }

/* ── Header ── */
.sp-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.sp-header__left { display: flex; flex-direction: column; gap: 6px; }
.sp-header__title {
  font-size: 1.6rem; font-weight: 800; color: var(--t1);
  letter-spacing: -0.03em; margin: 0;
}
.sp-header__sub {
  font-size: 0.82rem; color: var(--t3); margin: 0;
  max-width: 520px; line-height: 1.55;
}
.btn-new {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 20px; background: var(--accent); border: none;
  border-radius: 10px; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; font-weight: 700;
  cursor: pointer; flex-shrink: 0;
  transition: background 0.2s, transform 0.15s;
}
.btn-new:hover  { background: var(--accent-press); transform: translateY(-1px); }
.btn-new:active { transform: translateY(0); }

/* ── Support pages grid ── */
.sp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 16px;
}
.sp-card {
  aspect-ratio: 1 / 1;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 18px;
  display: flex; flex-direction: column; justify-content: space-between; gap: 10px;
}

.sp-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.sp-card__title-group { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.sp-card__name { font-weight: 700; color: var(--t1); font-size: 0.92rem; }
.sp-card__template { font-size: 0.72rem; color: var(--t2); font-weight: 600; }

/* ── Showcase (brand preview) ── */
.sp-card__showcase {
  flex: 1; min-height: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border-soft);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}
.sp-card__showcase-img {
  width: 100%; height: 100%;
  object-fit: cover;
  -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
}

/* ── Bottom row: link + status ── */
.sp-card__bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; }

.sp-status {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 999px;
}
.sp-status--active { color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.12); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.25); }
.sp-status--draft  { color: #fbbf24; background: rgba(251,191,36,.12); border: 1px solid rgba(251,191,36,.28); }

.sp-link {
  display: inline-flex; align-items: center; gap: 5px;
  color: var(--accent); font-size: 0.82rem; font-weight: 600;
  text-decoration: none; transition: opacity 0.18s;
}
.sp-link:hover { opacity: 0.75; }

.sp-empty-card {
  background: var(--bg);
  border: 1px solid var(--border-soft); border-radius: 16px;
  display: flex; justify-content: center; padding: 48px 20px;
}
.sp-empty__inner {
  display: inline-flex; flex-direction: column; align-items: center;
  gap: 12px; color: var(--t3); font-size: 0.84rem;
}

/* ═══════════════════════════════════════════
   MODAL
═══════════════════════════════════════════ */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 100%; max-width: 660px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.22);
}

/* ── Modal header ── */
.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.modal-head__title {
  font-size: 1rem; font-weight: 700; color: #111827; margin: 0;
}
.modal-close {
  width: 28px; height: 28px; border-radius: 7px;
  background: #f3f4f6; border: none; color: #9ca3af;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: color 0.18s, background 0.18s;
}
.modal-close:hover { color: #111827; background: #e5e7eb; }

/* ── Scrollable body ── */
.modal-body {
  flex: 1; overflow-y: auto; padding: 0;
  -webkit-overflow-scrolling: touch;
}
.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

/* ── Modal footer ── */
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  background: #fff;
}
.mf-btn-cancel {
  padding: 9px 22px; background: #f3f4f6; border: 1px solid #e5e7eb;
  border-radius: 9px; color: #374151;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; font-weight: 600;
  cursor: pointer; transition: background 0.18s;
}
.mf-btn-cancel:hover { background: #e5e7eb; }
.mf-btn-create {
  padding: 9px 26px; background: var(--accent); border: none;
  border-radius: 9px; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; font-weight: 700;
  cursor: pointer; transition: background 0.2s;
}
.mf-btn-create:hover { background: var(--accent-press); }

/* ── Form sections ── */
.mf-section { padding: 20px 24px; border-bottom: 1px solid #f3f4f6; }
.mf-section:last-child { border-bottom: none; }

.mf-label-row { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.mf-label {
  display: block; font-size: 0.88rem; font-weight: 600;
  color: #111827; margin-bottom: 8px;
}
.mf-label-row .mf-label { margin-bottom: 0; }
.mf-required { color: #ef4444; font-size: 0.88rem; font-weight: 700; }
.mf-hint { font-size: 0.78rem; color: #6b7280; line-height: 1.5; margin: 0 0 12px; }

.mf-input {
  width: 100%; padding: 10px 13px;
  background: #fff; border: 1px solid #d1d5db; border-radius: 8px;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; color: #111827;
  outline: none; transition: border-color 0.18s;
}
.mf-input:focus { border-color: var(--accent); box-shadow: none !important; }
.mf-input::placeholder { color: #9ca3af; }
.mf-textarea { resize: vertical; min-height: 100px; line-height: 1.55; }

/* ── Brand grid ── */
.brand-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.brand-card {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: 8px;
  border: 1.5px solid #e5e7eb; background: #fff;
  cursor: pointer; transition: border-color 0.18s, background 0.18s;
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-align: left;
}
.brand-card:hover { border-color: #d1d5db; background: #f9fafb; }
.brand-card--active { border-color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.05); }

.brand-icon {
  width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.brand-logo-img {
  width: 18px; height: 18px;
  object-fit: contain; display: block;
  flex-shrink: 0;
}
.brand-abbr {
  font-size: 0.65rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1;
}
.brand-name {
  font-size: 0.78rem; font-weight: 500; color: #374151;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ── Reach options ── */
.reach-options { display: flex; flex-direction: column; gap: 10px; }
.reach-card {
  border: 1.5px solid #e5e7eb; border-radius: 10px;
  padding: 14px 16px; cursor: pointer; transition: border-color 0.18s, background 0.18s;
}
.reach-card:hover { border-color: #d1d5db; }
.reach-card--active { border-color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.04); }

.reach-card__top {
  display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
}
.reach-card__title { font-size: 0.88rem; font-weight: 600; color: #111827; }
.reach-card__desc  { font-size: 0.78rem; color: #6b7280; line-height: 1.5; margin: 0; }

.reach-icon {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.reach-icon--star  { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12); color: var(--accent); }
.reach-icon--globe { background: #f3f4f6; color: #6b7280; }

.reach-free-badge {
  font-size: 0.65rem; font-weight: 700; color: var(--accent);
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25);
  padding: 1px 7px; border-radius: 999px; margin-left: 6px;
}

.subdomain-row {
  display: flex; gap: 0; margin-top: 10px;
}
.subdomain-input {
  flex: 1; padding: 9px 12px;
  background: #fff; border: 1px solid #d1d5db;
  border-radius: 8px 0 0 8px;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; color: #111827;
  outline: none; transition: border-color 0.18s;
}
.subdomain-input:focus { border-color: var(--accent); }
.subdomain-input::placeholder { color: #9ca3af; }
.subdomain-select {
  padding: 9px 12px; border: 1px solid #d1d5db; border-left: none;
  border-radius: 0 8px 8px 0; background: #f9fafb;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; color: #374151;
  outline: none; cursor: pointer;
}
.subdomain-hint {
  font-size: 0.73rem; color: #9ca3af; margin: 7px 0 0; line-height: 1.45;
}
.mt-8 { margin-top: 10px; }

/* ── Visitor support options ── */
.support-options {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
}
.support-card {
  display: flex; flex-direction: column; gap: 5px;
  padding: 12px 14px; border-radius: 10px;
  border: 1.5px solid #e5e7eb; cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
}
.support-card:hover { border-color: #d1d5db; background: #f9fafb; }
.support-card--active { border-color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.05); }
.support-card__title { font-size: 0.85rem; font-weight: 700; color: #111827; }
.support-card__desc  { font-size: 0.73rem; color: #6b7280; line-height: 1.4; }

/* ── Brand notice (edit mode) ── */
.brand-notice {
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 11px 14px; font-size: 0.8rem; color: #6b7280; line-height: 1.5;
}
.brand-notice strong { color: #111827; font-weight: 600; }
.brand-notice span   { color: #9ca3af; }

/* ── Address box (edit mode) ── */
.address-box {
  margin-top: 12px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
}
.address-box__label {
  display: block; padding: 7px 14px; font-size: 0.62rem; font-weight: 700;
  color: var(--accent); letter-spacing: 0.08em; background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}
.address-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; background: #fff;
}
.address-value {
  flex: 1; font-size: 0.84rem; color: #111827; font-weight: 500;
}
.address-edit-input {
  flex: 1; font-size: 0.84rem; color: #111827; border: none; outline: none;
  font-family: 'Plus Jakarta Sans', sans-serif; padding: 0;
}
.address-live {
  font-size: 0.7rem; font-weight: 700; color: var(--accent);
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25);
  padding: 2px 8px; border-radius: 999px; flex-shrink: 0;
}
.address-edit-btn {
  font-size: 0.78rem; font-weight: 600; color: #374151;
  background: none; border: none; cursor: pointer; flex-shrink: 0;
  padding: 0; transition: color 0.15s;
}
.address-edit-btn:hover { color: var(--accent); }

/* ── Active toggle (edit mode) ── */
.active-row {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px;
  background: #f9fafb; border: 1px solid #e5e7eb;
  border-radius: 10px; padding: 14px 16px;
}
.active-row__body { flex: 1; }
.active-row__title {
  font-size: 0.88rem; font-weight: 700; color: #111827;
  display: block; margin-bottom: 4px;
}
.active-row__desc { font-size: 0.76rem; color: #6b7280; line-height: 1.5; margin: 0; }

.toggle-switch {
  width: 44px; height: 24px; border-radius: 999px; border: none; cursor: pointer;
  background: #d1d5db; position: relative; flex-shrink: 0;
  transition: background 0.22s ease; margin-top: 2px;
}
.toggle-switch--on { background: var(--accent); }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%; background: #fff;
  transition: transform 0.22s ease;
  display: block;
}
.toggle-switch--on .toggle-thumb { transform: translateX(20px); }

/* ── Modal transition ── */
.modal-fade-enter-active { transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.modal-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.modal-fade-enter-from   { opacity: 0; transform: scale(0.93) translateY(12px); }
.modal-fade-leave-to     { opacity: 0; transform: scale(0.97); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .sp-header { flex-direction: column; align-items: flex-start; }
  .btn-new { width: 100%; justify-content: center; }
  .sp-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .brand-grid { grid-template-columns: repeat(3, 1fr); }
  .support-options { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .sp-header__title { font-size: 1.3rem; }
  .brand-grid { grid-template-columns: repeat(2, 1fr); }
  .modal { max-height: 95vh; border-radius: 14px; }
  .modal-backdrop { padding: 10px; align-items: flex-end; }
}
[data-theme="light"] .sp-empty__inner { color: #9ca3af; }
</style>
