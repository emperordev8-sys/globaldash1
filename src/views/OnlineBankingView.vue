<!-- src/views/OnlineBankingView.vue -->
<template>
  <div class="ob-page">

    <!-- Header -->
    <div class="ob-header">
      <div class="ob-header__left">
        <h1 class="ob-header__title">Online Banking</h1>
        <p class="ob-header__sub">
          Spawn a fully-featured online banking site in seconds. Each one has its own URL,
          its own end-users, and its own admin panel.
        </p>
      </div>
      <span class="ob-header__count">{{ sites.filter(s => s.status === 'active').length }}/∞ active</span>
    </div>

    <!-- Sites grid -->
    <div v-if="sites.length === 0" class="ob-empty-card">
      <div class="ob-empty__inner">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/><path d="M9 21V9"/>
        </svg>
        <span>No banking sites yet. Create your first one.</span>
      </div>
    </div>

    <div v-else class="ob-grid">
      <div v-for="site in sites" :key="site.id" class="ob-card">
        <div class="ob-card__top">
          <div class="ob-card__site">
            <span class="ob-site-name">{{ site.name }}</span>
            <span class="ob-site-currency">{{ site.currency }}</span>
          </div>
          <ActionsMenu :items="rowActions(site)" />
        </div>

        <div class="ob-card__showcase">
          <img :src="brandLogo" alt="Globalgle" class="ob-card__showcase-img" />
        </div>

        <div class="ob-card__bottom">
          <a :href="site.url" target="_blank" class="ob-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span class="ob-link__text">{{ site.domain }}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>

          <span class="ob-status" :class="`ob-status--${site.status}`">{{ site.status }}</span>
        </div>
      </div>
    </div>

    <!-- New banking site button -->
    <div class="ob-footer-bar">
      <button class="btn-new" @click="showCreate = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.8" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New banking site
      </button>
    </div>

    <!-- ══════════════════════════════════════
         CREATE MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showCreate" class="modal-backdrop" @click.self="closeCreate">
        <div class="modal">
          <div class="modal-head">
            <h2 class="modal-head__title">New banking site</h2>
            <button class="modal-close" @click="closeCreate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">

            <!-- ① Site name -->
            <div class="mf-section">
              <label class="mf-label">Site name</label>
              <input v-model="cForm.name" type="text" class="mf-input" placeholder="Acme Trust" />
              <p class="mf-hint" style="margin-top:6px;">Shown to end-users in the header, browser tab, and emails.</p>
            </div>

            <!-- ② Logo -->
            <div class="mf-section">
              <label class="mf-label">Logo</label>
              <div class="logo-row">
                <div class="logo-preview">
                  <img v-if="cForm.logoUrl" :src="cForm.logoUrl" class="logo-preview__img" alt="logo" />
                  <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <label class="logo-drop" @dragover.prevent @drop.prevent="onLogoDrop">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#9ca3af" stroke-width="2" stroke-linecap="round">
                    <polyline points="16 16 12 12 8 16"/>
                    <line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                  <span>Drag &amp; drop or click</span>
                  <input type="file" accept="image/*" class="logo-file-input" @change="onLogoChange" />
                </label>
              </div>
            </div>

            <!-- ③ Primary currency -->
            <div class="mf-section">
              <label class="mf-label">Primary currency</label>
              <select v-model="cForm.currency" class="mf-input">
                <option value="USD">USD -- US Dollar</option>
                <option value="NGN">NGN -- Nigerian Naira</option>
                <option value="GBP">GBP -- British Pound</option>
                <option value="EUR">EUR -- Euro</option>
                <option value="CAD">CAD -- Canadian Dollar</option>
                <option value="AUD">AUD -- Australian Dollar</option>
                <option value="GHS">GHS -- Ghanaian Cedi</option>
                <option value="KES">KES -- Kenyan Shilling</option>
              </select>
              <p class="mf-hint" style="margin-top:6px;">Default for balances + new transactions.</p>
            </div>

            <!-- ④ Admin sign-in method -->
            <div class="mf-section">
              <label class="mf-label">How will you sign in to this site's admin?</label>
              <div class="signin-toggle">
                <button type="button" class="signin-btn"
                  :class="{ 'signin-btn--active': cForm.signIn === 'access-code' }"
                  @click="cForm.signIn = 'access-code'">Access code</button>
                <button type="button" class="signin-btn"
                  :class="{ 'signin-btn--active': cForm.signIn === 'email' }"
                  @click="cForm.signIn = 'email'">Email &amp; password</button>
              </div>
              <div v-if="cForm.signIn === 'access-code'" style="margin-top:10px;">
                <input v-model="cForm.accessCode" type="text" class="mf-input"
                  placeholder="Leave blank to auto-generate" />
              </div>
              <div v-else style="margin-top:10px; display:flex; flex-direction:column; gap:8px;">
                <input v-model="cForm.email" type="email" class="mf-input" placeholder="admin@yourdomain.com" />
                <input v-model="cForm.password" type="password" class="mf-input" placeholder="Password" />
              </div>
            </div>

            <!-- ⑤ Visitor support -->
            <div class="mf-section">
              <label class="mf-label">Visitor support</label>
              <p class="mf-hint" style="margin-bottom:10px;">Choose what support option visitors see on the public site.</p>
              <div class="vs-grid">
                <div v-for="opt in visitorOpts" :key="opt.value"
                  class="vs-card" :class="{ 'vs-card--active': cForm.visitorSupport === opt.value }"
                  @click="cForm.visitorSupport = opt.value">
                  <span class="vs-card__title">{{ opt.label }}</span>
                  <span class="vs-card__desc">{{ opt.desc }}</span>
                </div>
              </div>
            </div>

            <!-- ⑥ Where should customers reach this? -->
            <div class="mf-section">
              <label class="mf-label">Where should customers reach this?</label>
              <div class="reach-options">

                <!-- Subdomain -->
                <div class="reach-card"
                  :class="{ 'reach-card--active': cForm.reachType === 'subdomain' }"
                  @click="cForm.reachType = 'subdomain'">
                  <div class="reach-top">
                    <span class="reach-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                      </svg>
                    </span>
                    <span class="reach-title">Use our subdomain</span>
                    <span class="reach-free">free</span>
                  </div>
                  <p class="reach-desc">Pick a keyword — we set up the link for you. Nothing to configure at your domain.</p>
                  <div class="subdomain-row" style="margin-top:10px;">
                    <input v-model="cForm.subdomain" type="text" class="subdomain-input" placeholder="acme-bank" />
                    <select v-model="cForm.suffix" class="subdomain-select">
                      <option>.qst1x.com</option>
                      <option>.globalgle.com</option>
                    </select>
                  </div>
                  <p v-if="cForm.reachType === 'subdomain'" class="reach-hint">
                    Lowercase letters, numbers and dashes — then pick a domain. Locked in once created.
                  </p>
                </div>

                <!-- Own domain -->
                <div class="reach-card"
                  :class="{ 'reach-card--active': cForm.reachType === 'own' }"
                  @click="cForm.reachType = 'own'">
                  <div class="reach-top">
                    <span class="reach-icon reach-icon--globe">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </span>
                    <span class="reach-title">Use my own domain</span>
                  </div>
                  <p class="reach-desc">Enter a domain you already own. We'll show the DNS steps right after.</p>
                  <div v-if="cForm.reachType === 'own'" style="margin-top:10px;">
                    <input v-model="cForm.ownDomain" type="text" class="mf-input" placeholder="bank.yourdomain.com" />
                  </div>
                </div>

              </div>
            </div>

          </div><!-- end modal-body -->

          <div class="modal-footer">
            <button class="mf-btn-cancel" @click="closeCreate">Cancel</button>
            <button class="mf-btn-create" @click="createSite">Create</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════
         ADMIN LOGIN MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showAdminLogin" class="modal-backdrop" @click.self="closeAdminLogin">
        <div class="modal">
          <div class="modal-head">
            <h2 class="modal-head__title">Admin login</h2>
            <button class="modal-close modal-close--square" @click="closeAdminLogin">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">

            <!-- Tab toggle -->
            <div class="mf-section" style="padding-bottom:0; border-bottom:none;">
              <div class="al-tabs">
                <button type="button" class="al-tab"
                  :class="{ 'al-tab--active': adminTab === 'auth-code' }"
                  @click="adminTab = 'auth-code'">Auth code</button>
                <button type="button" class="al-tab"
                  :class="{ 'al-tab--active': adminTab === 'email' }"
                  @click="adminTab = 'email'">Email &amp; password</button>
              </div>
            </div>

            <!-- ── Auth code tab ── -->
            <template v-if="adminTab === 'auth-code'">

              <!-- Current code -->
              <div class="mf-section">
                <div class="current-code-box">
                  <span class="current-code-box__label">CURRENT CODE</span>
                  <div class="current-code-box__row">
                    <span class="current-code-box__value">
                      {{ adminLoginSite?.accessCode || '12345' }}
                    </span>
                    <button type="button" class="copy-btn" @click="copyCode" :class="{ 'copy-btn--copied': codeCopied }">
                      <svg v-if="!codeCopied" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- New code -->
              <div class="mf-section">
                <label class="mf-label">New code</label>
                <input v-model="newCode" type="text" class="mf-input" placeholder="At least 4 characters" />
                <p class="mf-hint" style="margin-top:6px;">Set a code you'll remember, or generate a random one.</p>
                <div class="al-actions" style="margin-top:12px;">
                  <button type="button" class="al-btn-save" @click="saveNewCode">Save new code</button>
                  <button type="button" class="al-btn-gen" @click="generateRandom">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <polyline points="23 4 23 10 17 10"/>
                      <polyline points="1 20 1 14 7 14"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    Generate random
                  </button>
                </div>
              </div>

              <!-- Switch method -->
              <div class="mf-section">
                <p class="mf-hint">If this site is currently on email &amp; password, switch it back to the auth code:</p>
                <button type="button" class="al-btn-switch" style="margin-top:10px;" @click="switchToAuthCode">
                  Use the auth code for sign-in
                </button>
              </div>

            </template>

            <!-- ── Email & password tab ── -->
            <template v-else>
              <div class="mf-section">
                <label class="mf-label">Admin email</label>
                <input v-model="adminEmail" type="email" class="mf-input" placeholder="admin@yourdomain.com" />
              </div>
              <div class="mf-section">
                <label class="mf-label">New password</label>
                <input v-model="adminPassword" type="password" class="mf-input" placeholder="At least 8 characters" />
                <p class="mf-hint" style="margin-top:6px;">Leave blank to keep the existing password.</p>
                <div class="al-actions" style="margin-top:12px;">
                  <button type="button" class="al-btn-save" @click="saveNewCode">Save changes</button>
                </div>
              </div>
              <div class="mf-section">
                <p class="mf-hint">If this site is currently on auth code, switch it to email &amp; password:</p>
                <button type="button" class="al-btn-switch" style="margin-top:10px;" @click="adminTab = 'auth-code'">
                  Use email &amp; password for sign-in
                </button>
              </div>
            </template>

          </div><!-- end modal-body -->

          <div class="modal-footer" style="justify-content:flex-end;">
            <button class="mf-btn-cancel" @click="closeAdminLogin">Close</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════
         EDIT MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showEdit" class="modal-backdrop" @click.self="closeEdit">
        <div class="modal">
          <div class="modal-head">
            <h2 class="modal-head__title">Edit banking site</h2>
            <button class="modal-close modal-close--square" @click="closeEdit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">

            <!-- ① Site name -->
            <div class="mf-section">
              <label class="mf-label">Site name</label>
              <input v-model="eForm.name" type="text" class="mf-input" />
              <p class="mf-hint" style="margin-top:6px;">Shown to end-users in the header, browser tab, and emails.</p>
            </div>

            <!-- ② Logo -->
            <div class="mf-section">
              <label class="mf-label">Logo</label>
              <div class="logo-row">
                <div class="logo-preview">
                  <img v-if="eForm.logoUrl" :src="eForm.logoUrl" class="logo-preview__img" alt="logo" />
                  <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <label class="logo-drop" @dragover.prevent @drop.prevent="onEditLogoDrop">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#9ca3af" stroke-width="2" stroke-linecap="round">
                    <polyline points="16 16 12 12 8 16"/>
                    <line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                  <span>Drag &amp; drop or click</span>
                  <input type="file" accept="image/*" class="logo-file-input" @change="onEditLogoChange" />
                </label>
              </div>
            </div>

            <!-- ③ Primary currency -->
            <div class="mf-section">
              <label class="mf-label">Primary currency</label>
              <select v-model="eForm.currency" class="mf-input">
                <option value="USD">USD -- US Dollar</option>
                <option value="NGN">NGN -- Nigerian Naira</option>
                <option value="GBP">GBP -- British Pound</option>
                <option value="EUR">EUR -- Euro</option>
                <option value="CAD">CAD -- Canadian Dollar</option>
                <option value="AUD">AUD -- Australian Dollar</option>
                <option value="GHS">GHS -- Ghanaian Cedi</option>
                <option value="KES">KES -- Kenyan Shilling</option>
              </select>
            </div>

            <!-- ④ Status -->
            <div class="mf-section">
              <label class="mf-label">Status</label>
              <select v-model="eForm.status" class="mf-input">
                <option value="active">Active -- site is live</option>
                <option value="inactive">Inactive -- site is offline</option>
              </select>
            </div>

            <!-- ⑤ Visitor support -->
            <div class="mf-section">
              <label class="mf-label">Visitor support</label>
              <p class="mf-hint" style="margin-bottom:10px;">Choose what support option visitors see on the public site.</p>
              <div class="vs-grid">
                <div v-for="opt in visitorOpts" :key="opt.value"
                  class="vs-card" :class="{ 'vs-card--active': eForm.visitorSupport === opt.value }"
                  @click="eForm.visitorSupport = opt.value">
                  <span class="vs-card__title">{{ opt.label }}</span>
                  <span class="vs-card__desc">{{ opt.desc }}</span>
                </div>
              </div>
            </div>

            <!-- ⑥ Domain -->
            <div class="mf-section">
              <label class="mf-label">Domain</label>
              <div class="domain-box">
                <div class="domain-box__inner-label">Domain</div>
                <p class="domain-box__question">How should people reach this site?</p>
                <select v-model="eForm.reachType" class="mf-input">
                  <option value="subdomain">Use our subdomain -- free</option>
                  <option value="own">Use my own domain</option>
                </select>
                <div class="address-box" style="margin-top:12px;">
                  <span class="address-box__label">YOUR ADDRESS</span>
                  <div class="address-row">
                    <span v-if="!editingDomain" class="address-value">{{ eForm.domain }}</span>
                    <input v-else v-model="eForm.domain" type="text" class="address-edit-input" />
                    <span class="address-live">live</span>
                    <button class="address-edit-btn" type="button" @click="editingDomain = !editingDomain">
                      {{ editingDomain ? 'Save' : 'Edit' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div><!-- end modal-body -->

          <div class="modal-footer">
            <button class="mf-btn-cancel" @click="closeEdit">Close</button>
            <button class="mf-btn-create" @click="saveEdit">Save changes</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import brandLogo from '../assets/online.png'
import { useToast } from '../composables/useToast.js'
import { useSiteStore } from '../composables/useSiteStore.js'
import ActionsMenu from '../components/ui/ActionsMenu.vue'

const { success, error: toastError, info } = useToast()
const { store } = useSiteStore()
const sites = store.banking

/* ── Create ── */
const showCreate = ref(false)
const cForm = reactive({
  name: '', logoUrl: '', currency: 'USD',
  signIn: 'access-code', accessCode: '', email: '', password: '',
  visitorSupport: 'live-chat',
  reachType: 'subdomain', subdomain: '', suffix: '.qst1x.com', ownDomain: '',
})

const visitorOpts = [
  { value: 'off',       label: 'Off',                desc: 'No support widget on the public site.' },
  { value: 'live-chat', label: 'Built-in live chat', desc: 'On-site chat bubble → your admin Live chat inbox.' },
  { value: 'widget',    label: 'Website Widget',     desc: 'Embed any chat widget or chatbot (Smartsupp, Tawk, Crisp, Tidio, Intercom, Chatling, ...).' },
  { value: 'external',  label: 'External link',      desc: 'Send visitors to a support link you set.' },
]

function onLogoChange(e) {
  const file = e.target.files?.[0]
  if (file) cForm.logoUrl = URL.createObjectURL(file)
}
function onLogoDrop(e) {
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) cForm.logoUrl = URL.createObjectURL(file)
}

function createSite() {
  if (!cForm.name.trim()) { toastError('Name required', 'Please enter a site name.'); return }
  if (!cForm.subdomain.trim() && cForm.reachType === 'subdomain') {
    toastError('Address required', 'Please enter a subdomain keyword.'); return
  }
  const domain = cForm.reachType === 'subdomain'
    ? `${cForm.subdomain}${cForm.suffix}`
    : cForm.ownDomain
  sites.push({
    id: Date.now(), name: cForm.name, currency: cForm.currency,
    domain, url: '#', status: 'active',
  })
  success('Banking site created', `"${cForm.name}" is now live and ready.`)
  closeCreate()
}

function closeCreate() {
  showCreate.value    = false
  cForm.name          = ''
  cForm.logoUrl       = ''
  cForm.currency      = 'USD'
  cForm.signIn        = 'access-code'
  cForm.accessCode    = ''
  cForm.email         = ''
  cForm.password      = ''
  cForm.visitorSupport = 'live-chat'
  cForm.reachType     = 'subdomain'
  cForm.subdomain     = ''
  cForm.suffix        = '.qst1x.com'
  cForm.ownDomain     = ''
}

/* ── Edit ── */
const showEdit      = ref(false)
const editingDomain = ref(false)
const editingSiteId = ref(null)
const eForm = reactive({
  name: '', logoUrl: '', currency: 'USD', status: 'active',
  visitorSupport: 'live-chat', reachType: 'subdomain', domain: '',
})

function openEdit(site) {
  editingSiteId.value    = site.id
  editingDomain.value    = false
  eForm.name             = site.name
  eForm.logoUrl          = site.logoUrl    || ''
  eForm.currency         = site.currency
  eForm.status           = site.status
  eForm.visitorSupport   = site.visitorSupport || 'live-chat'
  eForm.reachType        = site.reachType  || 'subdomain'
  eForm.domain           = site.domain
  showEdit.value         = true
}

function onEditLogoChange(e) {
  const file = e.target.files?.[0]
  if (file) eForm.logoUrl = URL.createObjectURL(file)
}
function onEditLogoDrop(e) {
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) eForm.logoUrl = URL.createObjectURL(file)
}

function saveEdit() {
  if (!eForm.name.trim()) { toastError('Name required', 'Please enter a site name.'); return }
  const idx = sites.findIndex(s => s.id === editingSiteId.value)
  if (idx !== -1) {
    sites.splice(idx, 1, {
      ...sites[idx],
      name:           eForm.name,
      logoUrl:        eForm.logoUrl,
      currency:       eForm.currency,
      status:         eForm.status,
      visitorSupport: eForm.visitorSupport,
      reachType:      eForm.reachType,
      domain:         eForm.domain,
    })
  }
  success('Changes saved', 'Your banking site has been updated.')
  closeEdit()
}

function closeEdit() {
  showEdit.value      = false
  editingSiteId.value = null
  editingDomain.value = false
}

/* ── Actions ── */
function toggleStatus(site) {
  site.status = site.status === 'active' ? 'inactive' : 'active'
  success(
    site.status === 'active' ? 'Site activated' : 'Site deactivated',
    `"${site.name}" is now ${site.status}.`
  )
}

function copyAdminLink(site) {
  const link = `https://${site.domain}/admin`
  navigator.clipboard?.writeText(link).catch(() => {})
  info('Admin link copied', link)
}

/* ── Admin Login ── */
const showAdminLogin  = ref(false)
const adminLoginSite  = ref(null)
const adminTab        = ref('auth-code')
const newCode         = ref('')
const adminEmail      = ref('')
const adminPassword   = ref('')
const codeCopied      = ref(false)

function adminLogin(site) {
  adminLoginSite.value = site
  adminTab.value       = 'auth-code'
  newCode.value        = ''
  adminEmail.value     = ''
  adminPassword.value  = ''
  codeCopied.value     = false
  showAdminLogin.value = true
}

function copyCode() {
  const code = adminLoginSite.value?.accessCode || '12345'
  navigator.clipboard?.writeText(code).catch(() => {})
  codeCopied.value = true
  setTimeout(() => { codeCopied.value = false }, 2000)
}

function generateRandom() {
  newCode.value = Math.random().toString(36).slice(2, 10).toUpperCase()
}

function saveNewCode() {
  if (!newCode.value || newCode.value.length < 4) {
    toastError('Code too short', 'Please enter at least 4 characters.')
    return
  }
  if (adminLoginSite.value) {
    const idx = sites.findIndex(s => s.id === adminLoginSite.value.id)
    if (idx !== -1) sites[idx].accessCode = newCode.value
  }
  success('Code updated', 'New access code has been saved.')
  newCode.value = ''
}

function switchToAuthCode() {
  if (adminLoginSite.value) {
    const idx = sites.findIndex(s => s.id === adminLoginSite.value.id)
    if (idx !== -1) sites[idx].signIn = 'access-code'
  }
  success('Sign-in method updated', 'This site now uses auth code sign-in.')
}

function closeAdminLogin() {
  showAdminLogin.value = false
  adminLoginSite.value = null
}

function deleteSite(id) {
  const site = sites.find(s => s.id === id)
  const i = sites.findIndex(s => s.id === id)
  if (i !== -1) sites.splice(i, 1)
  success('Site deleted', `"${site?.name}" has been permanently removed.`)
}

/* ── Row actions dropdown ── */
function rowActions(site) {
  return [
    {
      label: site.status === 'active' ? 'Deactivate' : 'Activate',
      icon: '<path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/>',
      onClick: () => toggleStatus(site),
    },
    {
      label: 'Edit',
      icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      onClick: () => openEdit(site),
    },
    {
      label: 'Admin link',
      icon: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
      onClick: () => copyAdminLink(site),
    },
    {
      label: 'Admin login',
      icon: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
      onClick: () => adminLogin(site),
    },
    {
      label: 'Delete',
      icon: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
      onClick: () => deleteSite(site.id),
      variant: 'danger',
    },
  ]
}
</script>

<style scoped>
/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
.ob-page { display: flex; flex-direction: column; gap: 20px; }

/* ── Header ── */
.ob-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.ob-header__left { display: flex; flex-direction: column; gap: 6px; }
.ob-header__title {
  font-size: 1.6rem; font-weight: 800; color: var(--t1);
  letter-spacing: -0.03em; margin: 0;
}
.ob-header__sub {
  font-size: 0.82rem; color: var(--t1); font-weight: 700; margin: 0;
  max-width: 600px; line-height: 1.55;
}
.ob-header__count {
  font-size: 0.82rem; font-weight: 800; color: var(--t1);
  white-space: nowrap; padding-top: 6px;
}

/* ── Sites grid ── */
.ob-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 16px;
}
.ob-card {
  aspect-ratio: 1 / 1;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 18px;
  display: flex; flex-direction: column; justify-content: space-between; gap: 10px;
}

.ob-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.ob-card__site { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.ob-site-name { font-weight: 700; color: var(--t1); font-size: 0.92rem; }
.ob-site-currency { font-size: 0.72rem; color: var(--t2); font-weight: 600; }

/* ── Showcase (branding preview) ── */
.ob-card__showcase {
  flex: 1; min-height: 0;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(to bottom, var(--glass) 0%, var(--glass) 65%, rgba(255,255,255,0) 100%);
  border: 1px solid var(--border-soft);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}
.ob-card__showcase-img {
  width: 100%; height: 100%;
  object-fit: cover;
  -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
}

/* ── Bottom row: link + status ── */
.ob-card__bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; }

/* ── Link ── */
.ob-link {
  display: inline-flex; align-items: center; gap: 5px; min-width: 0;
  color: var(--accent); font-size: 0.82rem; font-weight: 600;
  text-decoration: none; transition: opacity 0.18s;
}
.ob-link:hover { opacity: 0.75; }
.ob-link__text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── Status ── */
.ob-status {
  font-size: 0.78rem; font-weight: 600; flex-shrink: 0;
  padding: 3px 10px; border-radius: 999px; border: 1px solid transparent;
}
.ob-status--active   { color: var(--accent);  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.12);  border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.22); }
.ob-status--inactive { color: #f87171; background: rgba(248,113,113,.12); border-color: rgba(248,113,113,.22); }

/* ── Empty ── */
.ob-empty-card {
  background: var(--bg);
  border: 1px solid var(--border-soft); border-radius: 16px;
  display: flex; justify-content: center; padding: 48px 20px;
}
.ob-empty__inner {
  display: inline-flex; flex-direction: column; align-items: center;
  gap: 12px; color: var(--t3); font-size: 0.84rem;
}

/* ── Footer bar ── */
.ob-footer-bar { display: flex; justify-content: flex-end; }
.btn-new {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 20px; background: var(--accent); border: none;
  border-radius: 10px; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; font-weight: 700;
  cursor: pointer; transition: background 0.2s, transform 0.15s;
}
.btn-new:hover  { background: var(--accent-press); transform: translateY(-1px); }
.btn-new:active { transform: translateY(0); }

/* ═══════════════════════════════════════════
   MODAL (shared create + edit)
═══════════════════════════════════════════ */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal {
  background: #fff; border-radius: 16px;
  width: 100%; max-width: 520px; max-height: 90vh;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.22);
}
.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0;
}
.modal-head__title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0; }
.modal-close {
  width: 28px; height: 28px; border-radius: 7px;
  background: #f3f4f6; border: none; color: #9ca3af;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: color 0.18s, background 0.18s;
}
.modal-close:hover { color: #111827; background: #e5e7eb; }

.modal-body { flex: 1; overflow-y: auto; }
.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 24px; border-top: 1px solid #f0f0f0; flex-shrink: 0; background: #fff;
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

/* ── Form fields ── */
.mf-section { padding: 18px 24px; border-bottom: 1px solid #f3f4f6; }
.mf-section:last-child { border-bottom: none; }
.mf-label { display: block; font-size: 0.88rem; font-weight: 600; color: #111827; margin-bottom: 8px; }
.mf-hint  { font-size: 0.78rem; color: #6b7280; line-height: 1.5; margin: 0; }
.mf-input {
  width: 100%; padding: 10px 13px;
  background: #fff; border: 1px solid #d1d5db; border-radius: 8px;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; color: #111827;
  outline: none; transition: border-color 0.18s;
}
.mf-input:focus { border-color: var(--accent); }
.mf-input::placeholder { color: #9ca3af; }

.subdomain-row { display: flex; }
.subdomain-input {
  flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px 0 0 8px;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; color: #111827;
  outline: none; transition: border-color 0.18s; background: #fff;
}
.subdomain-input:focus { border-color: var(--accent); }
.subdomain-input::placeholder { color: #9ca3af; }
.subdomain-select {
  padding: 10px 12px; border: 1px solid #d1d5db; border-left: none;
  border-radius: 0 8px 8px 0; background: #f9fafb;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; color: #374151;
  outline: none; cursor: pointer;
}

/* ── Logo upload ── */
.logo-row { display: flex; gap: 10px; align-items: stretch; }
.logo-preview {
  width: 72px; height: 72px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid #e5e7eb; background: #f9fafb;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.logo-preview__img { width: 100%; height: 100%; object-fit: cover; }
.logo-drop {
  flex: 1; border: 1.5px dashed #d1d5db; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 0.82rem; color: #9ca3af; cursor: pointer;
  padding: 14px; transition: border-color 0.18s, background 0.18s; position: relative;
}
.logo-drop:hover { border-color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.03); color: #374151; }
.logo-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

/* ── Admin sign-in toggle ── */
.signin-toggle {
  display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
}
.signin-btn {
  padding: 10px 14px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.83rem; font-weight: 600; color: #374151;
  background: #fff; border: none; cursor: pointer; transition: all 0.18s;
}
.signin-btn:first-child { border-right: 1px solid #e5e7eb; }
.signin-btn--active {
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.08); color: var(--accent);
  border: 1.5px solid var(--accent) !important; border-radius: 7px; margin: 3px;
}

/* ── Visitor support 2x2 grid ── */
.vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.vs-card {
  border: 1.5px solid #e5e7eb; border-radius: 10px;
  padding: 12px 14px; cursor: pointer; transition: border-color 0.18s, background 0.18s;
  display: flex; flex-direction: column; gap: 4px;
}
.vs-card:hover { border-color: #d1d5db; background: #f9fafb; }
.vs-card--active { border-color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.05); }
.vs-card__title { font-size: 0.85rem; font-weight: 700; color: #111827; }
.vs-card__desc  { font-size: 0.74rem; color: #6b7280; line-height: 1.4; }

/* ── Reach options (subdomain / own domain) ── */
.reach-options { display: flex; flex-direction: column; gap: 10px; }
.reach-card {
  border: 1.5px solid #e5e7eb; border-radius: 10px;
  padding: 14px 16px; cursor: pointer; transition: border-color 0.18s, background 0.18s;
}
.reach-card:hover { border-color: #d1d5db; }
.reach-card--active { border-color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.04); }
.reach-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.reach-icon {
  width: 26px; height: 26px; border-radius: 6px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12); color: var(--accent);
}
.reach-icon--globe { background: #f3f4f6; color: #6b7280; }
.reach-title { font-size: 0.88rem; font-weight: 600; color: #111827; }
.reach-free {
  font-size: 0.65rem; font-weight: 700; color: var(--accent);
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25);
  padding: 1px 7px; border-radius: 999px; margin-left: 4px;
}
.reach-desc { font-size: 0.78rem; color: #6b7280; line-height: 1.5; margin: 0; }
.reach-hint { font-size: 0.73rem; color: #9ca3af; margin: 6px 0 0; line-height: 1.45; }

/* ── Admin Login tabs ── */
.al-tabs {
  display: flex; gap: 0;
  border-bottom: 1px solid #f0f0f0;
  margin: 0 -24px; padding: 0 24px;
}
.al-tab {
  padding: 10px 16px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem; font-weight: 600; color: #6b7280;
  background: none; border: none; border-bottom: 2px solid transparent;
  cursor: pointer; transition: color 0.18s, border-color 0.18s; margin-bottom: -1px;
}
.al-tab--active { color: var(--accent); border-bottom-color: var(--accent); }

/* ── Auth code specific ── */
.al-tab--active:first-child {
  background: var(--accent); color: #fff; border-radius: 8px;
  border-bottom: none; margin-bottom: 0; padding: 8px 18px;
}
.al-tab:not(.al-tab--active) {
  border: 1px solid #e5e7eb; border-radius: 8px; margin: 0 0 0 8px;
  padding: 8px 18px; color: #374151;
}
.al-tabs { border-bottom: none; gap: 0; padding: 18px 24px 0; margin: 0; }

/* ── Current code box ── */
.current-code-box {
  border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
}
.current-code-box__label {
  display: block; padding: 6px 14px; font-size: 0.62rem; font-weight: 700;
  color: #6b7280; letter-spacing: 0.08em; background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}
.current-code-box__row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; background: #fff;
}
.current-code-box__value { font-size: 0.95rem; font-weight: 600; color: #111827; }
.copy-btn {
  width: 30px; height: 30px; border-radius: 7px; border: none;
  background: #f3f4f6; color: #6b7280; display: flex; align-items: center;
  justify-content: center; cursor: pointer; transition: all 0.18s; flex-shrink: 0;
}
.copy-btn:hover { background: #e5e7eb; color: #111827; }
.copy-btn--copied { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1) !important; color: var(--accent) !important; }

/* ── Admin action buttons ── */
.al-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.al-btn-save {
  padding: 9px 20px; background: var(--accent); border: none; border-radius: 9px;
  color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.83rem; font-weight: 700; cursor: pointer; transition: background 0.2s;
}
.al-btn-save:hover { background: var(--accent-press); }
.al-btn-gen {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 16px; background: #fff; border: 1.5px solid #e5e7eb;
  border-radius: 9px; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: border-color 0.18s, background 0.18s;
}
.al-btn-gen:hover { border-color: #d1d5db; background: #f9fafb; }
.al-btn-switch {
  padding: 9px 18px; background: #fff; border: 1.5px solid #e5e7eb;
  border-radius: 9px; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: border-color 0.18s;
}
.al-btn-switch:hover { border-color: #d1d5db; background: #f9fafb; }

/* ── Square close button (edit modal) ── */
.modal-close--square {
  border-radius: 6px !important;
  border: 1.5px solid #d1d5db !important;
  background: #fff !important;
}
.modal-close--square:hover { border-color: #9ca3af !important; background: #f9fafb !important; }

/* ── Domain box (edit modal) ── */
.domain-box {
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px;
  display: flex; flex-direction: column; gap: 6px;
}
.domain-box__inner-label { font-size: 0.88rem; font-weight: 700; color: #111827; }
.domain-box__question    { font-size: 0.78rem; color: var(--accent); font-weight: 600; margin: 0; }

/* ── Edit-specific ── */
.brand-notice {
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 11px 14px; font-size: 0.82rem; color: #6b7280;
}
.address-box {
  margin-top: 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
}
.address-box__label {
  display: block; padding: 6px 14px; font-size: 0.62rem; font-weight: 700;
  color: var(--accent); letter-spacing: 0.08em; background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}
.address-row {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #fff;
}
.address-value { flex: 1; font-size: 0.84rem; color: #111827; font-weight: 500; }
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
  background: none; border: none; cursor: pointer; padding: 0; transition: color 0.15s;
}
.address-edit-btn:hover { color: var(--accent); }

.active-row {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px;
}
.active-row__body { flex: 1; }
.active-row__title { font-size: 0.88rem; font-weight: 700; color: #111827; display: block; margin-bottom: 4px; }
.active-row__desc  { font-size: 0.76rem; color: #6b7280; line-height: 1.5; margin: 0; }
.toggle-switch {
  width: 44px; height: 24px; border-radius: 999px; border: none; cursor: pointer;
  background: #d1d5db; position: relative; flex-shrink: 0;
  transition: background 0.22s; margin-top: 2px;
}
.toggle-switch--on { background: var(--accent); }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%; background: #fff;
  transition: transform 0.22s; display: block;
}
.toggle-switch--on .toggle-thumb { transform: translateX(20px); }

/* ── Modal transition ── */
.modal-fade-enter-active { transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.modal-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.modal-fade-enter-from   { opacity: 0; transform: scale(0.93) translateY(12px); }
.modal-fade-leave-to     { opacity: 0; transform: scale(0.97); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .ob-header { flex-direction: column; }
  .ob-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
}

/* ── Light mode ── */
[data-theme="light"] .ob-card { background: #fff; border-color: #e5e7eb; }
[data-theme="light"] .ob-card__showcase { background: linear-gradient(to bottom, #f9fafb 0%, #f9fafb 65%, rgba(249,250,251,0) 100%); border-color: #e5e7eb; }
[data-theme="light"] .ob-empty-card { background: #fff; border-color: #e5e7eb; }
[data-theme="light"] .ob-site-name { color: #111827; }
[data-theme="light"] .ob-header__title { color: #111827; }
[data-theme="light"] .ob-header__sub { color: #6b7280; }
[data-theme="light"] .ob-empty__inner { color: #9ca3af; }
</style>
