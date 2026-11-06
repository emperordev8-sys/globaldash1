<template>
  <div class="broker-page">

    <!-- ── Page header ── -->
    <div class="broker-header">
      <div>
        <h1 class="broker-title">Broker</h1>
        <p class="broker-sub">
          Spawn a fully-featured broker site in seconds. Each one has its own URL,
          its own end-users, and its own admin panel.
        </p>
      </div>
      <span class="broker-count">{{ sites.filter(s => s.status === 'active').length }}/∞ active</span>
    </div>

    <!-- ── Table (when sites exist) ── -->
    <div v-if="sites.length" class="broker-table-wrap">
      <table class="broker-table">
        <thead>
          <tr>
            <th>SITE</th>
            <th>PUBLIC LINK</th>
            <th>LEVERAGE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="site in sites" :key="site.id">
            <td>
              <div class="ob-site-name">{{ site.name }}</div>
              <div class="ob-site-currency">{{ site.baseCurrency }}</div>
            </td>
            <td>
              <a :href="site.url" target="_blank" class="ob-link">{{ site.domain }}</a>
            </td>
            <td><span class="ob-leverage">{{ site.leverage }}</span></td>
            <td>
              <span class="ob-status" :class="site.status === 'active' ? 'ob-status--active' : 'ob-status--off'">
                {{ site.status }}
              </span>
            </td>
            <td>
              <div class="ob-actions">
                <!-- Deactivate -->
                <button class="ob-action" :title="site.status === 'active' ? 'Deactivate' : 'Activate'"
                  @click="toggleStatus(site)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M18.36 6.64A9 9 0 1 1 5.64 5.64"/>
                    <line x1="12" y1="2" x2="12" y2="12"/>
                  </svg>
                </button>
                <!-- Edit -->
                <button class="ob-action" title="Edit" @click="openEdit(site)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <!-- Admin login -->
                <button class="ob-action" title="Admin login" @click="adminLogin(site)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                </button>
                <!-- Delete -->
                <button class="ob-action ob-action--danger" title="Delete" @click="deleteSite(site)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Empty state ── -->
    <div v-else class="broker-empty">
      <div class="broker-empty__icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round">
          <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9"/>
          <path d="M16 19h6M19 16v6"/>
        </svg>
      </div>
      <p class="broker-empty__title">No broker sites yet</p>
      <p class="broker-empty__desc">
        Create your first one — it takes about two seconds. Default instruments<br>
        and 100x leverage are pre-configured.
      </p>
    </div>

    <!-- ── New broker button ── -->
    <div class="broker-fab">
      <button class="broker-fab__btn" @click="showCreate = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New broker
      </button>
    </div>


    <!-- ══════════════════════════════════════
         CREATE MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showCreate" class="modal-backdrop" @click.self="closeCreate">
        <div class="modal">
          <div class="modal-head">
            <h2 class="modal-head__title">New broker site</h2>
            <button class="modal-close" @click="closeCreate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">

            <!-- ① Broker name -->
            <div class="mf-section">
              <label class="mf-label">Broker name</label>
              <input v-model="cForm.name" type="text" class="mf-input" placeholder="Acme FX" />
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
              <select v-model="cForm.baseCurrency" class="mf-input">
                <option value="USD">USD -- US Dollar</option>
                <option value="NGN">NGN -- Nigerian Naira</option>
                <option value="GBP">GBP -- British Pound</option>
                <option value="EUR">EUR -- Euro</option>
                <option value="CAD">CAD -- Canadian Dollar</option>
                <option value="AUD">AUD -- Australian Dollar</option>
                <option value="GHS">GHS -- Ghanaian Cedi</option>
                <option value="KES">KES -- Kenyan Shilling</option>
              </select>
              <p class="mf-hint mf-hint--green" style="margin-top:6px;">Default for balances and margin.</p>
            </div>

            <!-- ④ Admin sign-in -->
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
              <div style="margin-top:10px;">
                <div v-if="cForm.signIn === 'access-code'">
                  <input v-model="cForm.accessCode" type="text" class="mf-input"
                    placeholder="Leave blank to auto-generate" />
                </div>
                <div v-else style="display:flex; flex-direction:column; gap:8px;">
                  <input v-model="cForm.email" type="email" class="mf-input" placeholder="Admin email" />
                  <input v-model="cForm.password" type="password" class="mf-input" placeholder="Admin password" />
                </div>
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

                <!-- Subdomain card -->
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
                  <p class="reach-desc">Pick a keyword -- we set up the link for you. Nothing to configure at your domain.</p>
                  <div class="subdomain-row" style="margin-top:10px;" @click.stop>
                    <input v-model="cForm.subdomain" type="text" class="subdomain-input" placeholder="acme-fx" />
                    <select v-model="cForm.suffix" class="subdomain-select">
                      <option>.qst1x.com</option>
                      <option>.globalgle.com</option>
                    </select>
                  </div>
                  <p v-if="cForm.reachType === 'subdomain'" class="reach-hint">
                    Lowercase letters, numbers and dashes -- then pick a domain. Locked in once created.
                  </p>
                </div>

                <!-- Own domain card -->
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
                  <div v-if="cForm.reachType === 'own'" style="margin-top:10px;" @click.stop>
                    <input v-model="cForm.ownDomain" type="text" class="mf-input" placeholder="broker.yourdomain.com" />
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
         EDIT MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showEdit" class="modal-backdrop" @click.self="closeEdit">
        <div class="modal">
          <div class="modal-head">
            <h2 class="modal-head__title">Edit broker site</h2>
            <button class="modal-close modal-close--square" @click="closeEdit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">

            <div class="mf-section">
              <label class="mf-label">Site name</label>
              <input v-model="eForm.name" type="text" class="mf-input" />
              <p class="mf-hint" style="margin-top:6px;">Shown to traders in the header, browser tab, and emails.</p>
            </div>

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

            <div class="mf-section">
              <label class="mf-label">Base currency</label>
              <select v-model="eForm.baseCurrency" class="mf-input">
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

            <div class="mf-section">
              <label class="mf-label">Status</label>
              <select v-model="eForm.status" class="mf-input">
                <option value="active">Active -- site is live</option>
                <option value="inactive">Inactive -- site is offline</option>
              </select>
            </div>

            <div class="mf-section">
              <label class="mf-label">Visitor support</label>
              <div class="vs-grid">
                <div v-for="opt in visitorOpts" :key="opt.value"
                  class="vs-card" :class="{ 'vs-card--active': eForm.visitorSupport === opt.value }"
                  @click="eForm.visitorSupport = opt.value">
                  <span class="vs-card__title">{{ opt.label }}</span>
                  <span class="vs-card__desc">{{ opt.desc }}</span>
                </div>
              </div>
            </div>

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

          </div>
          <div class="modal-footer">
            <button class="mf-btn-cancel" @click="closeEdit">Close</button>
            <button class="mf-btn-create" @click="saveEdit">Save changes</button>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
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

            <template v-if="adminTab === 'auth-code'">
              <div class="mf-section">
                <div class="current-code-box">
                  <span class="current-code-box__label">CURRENT CODE</span>
                  <div class="current-code-box__row">
                    <span class="current-code-box__value">{{ adminLoginSite?.accessCode || '12345' }}</span>
                    <button type="button" class="copy-btn" :class="{ 'copy-btn--copied': codeCopied }" @click="copyCode">
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
              <div class="mf-section">
                <label class="mf-label">New code</label>
                <input v-model="newCode" type="text" class="mf-input" placeholder="At least 4 characters" />
                <p class="mf-hint" style="margin-top:6px;">Set a code you'll remember, or generate a random one.</p>
                <div class="al-actions" style="margin-top:12px;">
                  <button type="button" class="al-btn-save" @click="saveNewCode">Save new code</button>
                  <button type="button" class="al-btn-gen" @click="generateRandom">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    Generate random
                  </button>
                </div>
              </div>
              <div class="mf-section">
                <p class="mf-hint">If this site is currently on email &amp; password, switch it back to the auth code:</p>
                <button type="button" class="al-btn-switch" style="margin-top:10px;" @click="switchToAuthCode">
                  Use the auth code for sign-in
                </button>
              </div>
            </template>

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
            </template>
          </div>
          <div class="modal-footer" style="justify-content:flex-end;">
            <button class="mf-btn-cancel" @click="closeAdminLogin">Close</button>
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

const { success, error: toastError, info } = useToast()
const { store } = useSiteStore()
const sites = store.broker

/* ── Shared ── */
const visitorOpts = [
  { value: 'off',       label: 'Off',                desc: 'No support widget on the public site.' },
  { value: 'live-chat', label: 'Built-in live chat', desc: 'On-site chat bubble → your admin Live chat inbox.' },
  { value: 'widget',    label: 'Website Widget',     desc: 'Embed any chat widget or chatbot (Smartsupp, Tawk, Crisp, Tidio, Intercom, Chatling, ...).' },
  { value: 'external',  label: 'External link',      desc: 'Send visitors to a support link you set.' },
]

/* ── Create ── */
const showCreate = ref(false)
const cForm = reactive({
  name: '', logoUrl: '', baseCurrency: 'USD', leverage: '1:100',
  signIn: 'access-code', accessCode: '', email: '', password: '',
  visitorSupport: 'live-chat',
  reachType: 'subdomain', subdomain: '', suffix: '.qst1x.com', ownDomain: '',
})

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
  if (cForm.reachType === 'subdomain' && !cForm.subdomain.trim()) {
    toastError('Subdomain required', 'Please enter a subdomain keyword.'); return
  }
  const domain = cForm.reachType === 'subdomain'
    ? `${cForm.subdomain}${cForm.suffix}` : cForm.ownDomain
  sites.push({
    id: Date.now(), name: cForm.name, logoUrl: cForm.logoUrl,
    baseCurrency: cForm.baseCurrency, leverage: cForm.leverage,
    domain, url: '#', status: 'active',
    visitorSupport: cForm.visitorSupport, reachType: cForm.reachType,
    signIn: cForm.signIn, accessCode: cForm.accessCode || '12345',
  })
  success('Broker site created', `"${cForm.name}" is now live.`)
  closeCreate()
}

function closeCreate() {
  showCreate.value = false
  Object.assign(cForm, {
    name: '', logoUrl: '', baseCurrency: 'USD', leverage: '1:100',
    signIn: 'access-code', accessCode: '', email: '', password: '',
    visitorSupport: 'live-chat',
    reachType: 'subdomain', subdomain: '', suffix: '.qst1x.com', ownDomain: '',
  })
}

/* ── Edit ── */
const showEdit      = ref(false)
const editingDomain = ref(false)
const editingSiteId = ref(null)
const eForm = reactive({
  name: '', logoUrl: '', baseCurrency: 'USD', status: 'active',
  visitorSupport: 'live-chat', reachType: 'subdomain', domain: '',
})

function openEdit(site) {
  editingSiteId.value  = site.id
  editingDomain.value  = false
  eForm.name           = site.name
  eForm.logoUrl        = site.logoUrl    || ''
  eForm.baseCurrency   = site.baseCurrency
  eForm.status         = site.status
  eForm.visitorSupport = site.visitorSupport || 'live-chat'
  eForm.reachType      = site.reachType  || 'subdomain'
  eForm.domain         = site.domain
  showEdit.value       = true
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
      name: eForm.name, logoUrl: eForm.logoUrl,
      baseCurrency: eForm.baseCurrency, status: eForm.status,
      visitorSupport: eForm.visitorSupport, reachType: eForm.reachType,
      domain: eForm.domain,
    })
  }
  success('Changes saved', 'Your broker site has been updated.')
  closeEdit()
}

function closeEdit() {
  showEdit.value      = false
  editingSiteId.value = null
  editingDomain.value = false
}

/* ── Deactivate / Delete ── */
function toggleStatus(site) {
  const idx = sites.findIndex(s => s.id === site.id)
  if (idx !== -1) {
    const next = sites[idx].status === 'active' ? 'inactive' : 'active'
    sites[idx].status = next
    info(next === 'active' ? 'Site activated' : 'Site deactivated', `"${site.name}" is now ${next}.`)
  }
}

function deleteSite(site) {
  const i = sites.findIndex(s => s.id === site.id)
  if (i !== -1) sites.splice(i, 1)
  success('Site deleted', `"${site.name}" has been removed.`)
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
    toastError('Code too short', 'Please enter at least 4 characters.'); return
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
</script>

<style scoped>
/* ── Page layout ── */
.broker-page {
  min-height: 100vh; padding: 32px 28px 100px;
  background: transparent; font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
}

.broker-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 24px;
}
.broker-title  { font-size: 1.7rem; font-weight: 800; color: var(--t1); margin-bottom: 4px; }
.broker-sub    { font-size: 0.82rem; color: var(--accent); max-width: 520px; line-height: 1.5; }
.broker-count  { font-size: 0.78rem; color: var(--t2); white-space: nowrap; padding-top: 6px; }

/* ── Empty state ── */
.broker-empty {
  border: 2px dashed #d1d5db; border-radius: 14px; padding: 52px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  background: #fff; text-align: center;
}
.broker-empty__icon {
  width: 52px; height: 52px; border-radius: 50%; background: #f3f4f6;
  display: flex; align-items: center; justify-content: center;
}
.broker-empty__title { font-size: 0.95rem; font-weight: 700; color: #374151; }
.broker-empty__desc  { font-size: 0.78rem; color: #6b7280; line-height: 1.6; }

/* ── Table ── */
.broker-table-wrap { overflow-x: auto; background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; }
.broker-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.broker-table th {
  padding: 12px 16px; text-align: left; font-size: 0.68rem; font-weight: 700;
  color: #9ca3af; letter-spacing: 0.08em; border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}
.broker-table td { padding: 14px 16px; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
.broker-table tbody tr:last-child td { border-bottom: none; }
.broker-table tbody tr:hover td { background: #fafafa; }

.ob-site-name     { font-weight: 700; color: #111827; font-size: 0.84rem; }
.ob-site-currency { font-size: 0.72rem; color: #9ca3af; margin-top: 2px; }
.ob-link          { color: #6b7280; font-size: 0.78rem; text-decoration: none; }
.ob-link:hover    { color: var(--accent); }
.ob-leverage      { font-size: 0.78rem; color: #374151; font-weight: 600; }

.ob-status {
  display: inline-block; padding: 3px 10px; border-radius: 999px;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em;
}
.ob-status--active { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1); color: #16a34a; }
.ob-status--off    { background: #f3f4f6; color: #9ca3af; }

.ob-actions { display: flex; gap: 6px; align-items: center; }
.ob-action {
  width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e5e7eb;
  background: #fff; color: #6b7280; display: flex; align-items: center;
  justify-content: center; cursor: pointer; transition: all 0.18s;
}
.ob-action:hover { border-color: #d1d5db; color: #374151; background: #f9fafb; }
.ob-action--danger:hover { border-color: #fca5a5; color: #ef4444; background: rgba(239,68,68,0.06); }

/* ── FAB ── */
.broker-fab {
  display: flex; justify-content: flex-end; margin-top: 16px;
}
.broker-fab__btn {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 22px; background: var(--accent); border: none; border-radius: 10px;
  color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem; font-weight: 700; cursor: pointer;
  transition: background 0.2s; box-shadow: 0 4px 16px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.35);
}
.broker-fab__btn:hover { background: var(--accent-press); }

/* ── Modal shared ── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 16px;
}
.modal {
  background: #fff; border-radius: 16px; width: 100%; max-width: 520px;
  max-height: 90vh; display: flex; flex-direction: column;
  overflow: hidden; font-family: 'Plus Jakarta Sans', sans-serif;
}
.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px 16px; border-bottom: 1px solid #f3f4f6; flex-shrink: 0;
}
.modal-head__title { font-size: 1rem; font-weight: 700; color: #111827; }
.modal-close {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: #f3f4f6; color: #6b7280; display: flex; align-items: center;
  justify-content: center; cursor: pointer; transition: all 0.18s;
}
.modal-close:hover { background: #e5e7eb; color: #111827; }
.modal-close--square {
  border-radius: 6px !important; border: 1.5px solid #d1d5db !important; background: #fff !important;
}
.modal-close--square:hover { border-color: #9ca3af !important; background: #f9fafb !important; }

.modal-body {
  overflow-y: auto; padding: 0; flex: 1;
}
.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 14px 24px; border-top: 1px solid #f3f4f6; flex-shrink: 0;
}

/* ── Form elements ── */
.mf-section {
  padding: 16px 24px; border-bottom: 1px solid #f9fafb;
}
.mf-section:last-child { border-bottom: none; }
.mf-label {
  display: block; font-size: 0.8rem; font-weight: 700;
  color: #374151; margin-bottom: 8px;
}
.mf-input {
  width: 100%; padding: 9px 12px; border: 1px solid #e5e7eb;
  border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem; color: #111827; background: #fff;
  outline: none; transition: border-color 0.18s;
}
.mf-input:focus { border-color: var(--accent); }
.mf-hint       { font-size: 0.74rem; color: #9ca3af; }
.mf-hint--green { color: var(--accent); }
.mf-btn-cancel {
  padding: 9px 20px; background: #fff; border: 1.5px solid #e5e7eb;
  border-radius: 9px; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.83rem; font-weight: 600; cursor: pointer;
}
.mf-btn-create {
  padding: 9px 22px; background: var(--accent); border: none; border-radius: 9px;
  color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.83rem; font-weight: 700; cursor: pointer; transition: background 0.2s;
}
.mf-btn-create:hover { background: var(--accent-press); }

/* ── Logo upload ── */
.logo-row { display: flex; gap: 12px; align-items: stretch; }
.logo-preview {
  width: 72px; height: 72px; border-radius: 10px; border: 1px solid #e5e7eb;
  background: #f9fafb; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
}
.logo-preview__img { width: 100%; height: 100%; object-fit: cover; }
.logo-drop {
  flex: 1; border: 2px dashed #d1d5db; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  gap: 8px; cursor: pointer; color: #9ca3af; font-size: 0.8rem;
  transition: border-color 0.18s; padding: 0 12px; position: relative;
}
.logo-drop:hover { border-color: #9ca3af; }
.logo-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

/* ── Sign-in toggle ── */
.signin-toggle { display: flex; gap: 8px; }
.signin-btn {
  flex: 1; padding: 9px; border: 1.5px solid #e5e7eb; border-radius: 9px;
  background: #fff; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
}
.signin-btn--active { border-color: var(--accent); color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.06); }

/* ── Visitor support grid ── */
.vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.vs-card {
  border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 11px 13px;
  cursor: pointer; transition: all 0.18s; display: flex; flex-direction: column; gap: 4px;
}
.vs-card:hover { border-color: #d1d5db; background: #fafafa; }
.vs-card--active { border-color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.05); }
.vs-card__title { font-size: 0.8rem; font-weight: 700; color: #111827; }
.vs-card__desc  { font-size: 0.7rem; color: #9ca3af; line-height: 1.4; }

/* ── Reach options ── */
.reach-options { display: flex; flex-direction: column; gap: 10px; }
.reach-card {
  border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 13px 15px; cursor: pointer; transition: all 0.18s;
}
.reach-card:hover { border-color: #d1d5db; }
.reach-card--active { border-color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.04); }
.reach-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.reach-icon {
  width: 26px; height: 26px; border-radius: 7px; background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1);
  color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.reach-icon--globe { background: rgba(99,102,241,0.1); color: #6366f1; }
.reach-title { font-size: 0.82rem; font-weight: 700; color: #111827; }
.reach-free  { font-size: 0.65rem; font-weight: 700; color: #16a34a; background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1); padding: 2px 7px; border-radius: 999px; }
.reach-desc  { font-size: 0.74rem; color: #6b7280; line-height: 1.5; }
.reach-hint  { font-size: 0.7rem; color: #9ca3af; margin-top: 6px; }

.subdomain-row    { display: flex; gap: 6px; }
.subdomain-input  { flex: 1; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; color: #111827; outline: none; }
.subdomain-input:focus { border-color: var(--accent); }
.subdomain-select { padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; color: #374151; background: #fff; outline: none; }

/* ── Domain box (edit) ── */
.domain-box { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }
.domain-box__inner-label { font-size: 0.88rem; font-weight: 700; color: #111827; }
.domain-box__question    { font-size: 0.78rem; color: var(--accent); font-weight: 600; margin: 0; }

/* ── Address box ── */
.address-box { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.address-box__label {
  display: block; padding: 5px 12px; font-size: 0.62rem; font-weight: 700;
  color: var(--accent); letter-spacing: 0.08em; background: #f9fafb; border-bottom: 1px solid #e5e7eb;
}
.address-row  { display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
.address-value { font-size: 0.84rem; color: #111827; flex: 1; }
.address-live  { font-size: 0.68rem; font-weight: 700; color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.08); padding: 2px 8px; border-radius: 999px; }
.address-edit-btn {
  padding: 4px 12px; border: 1px solid #e5e7eb; border-radius: 7px;
  background: #fff; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.75rem; font-weight: 600; cursor: pointer;
}
.address-edit-input { flex: 1; border: 1px solid var(--accent); border-radius: 7px; padding: 5px 9px; font-size: 0.84rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }

/* ── Admin login ── */
.al-tabs { display: flex; gap: 0; padding: 18px 24px 0; margin: 0; }
.al-tab  { padding: 8px 18px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; font-weight: 600; cursor: pointer; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; color: #374151; transition: all 0.18s; }
.al-tab:first-child { margin-right: 8px; }
.al-tab--active:first-child { background: var(--accent); color: #fff; border-color: var(--accent); }
.al-tab--active:not(:first-child) { border-color: var(--accent); color: var(--accent); }

.current-code-box { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.current-code-box__label { display: block; padding: 6px 14px; font-size: 0.62rem; font-weight: 700; color: #6b7280; letter-spacing: 0.08em; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.current-code-box__row  { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #fff; }
.current-code-box__value { font-size: 0.95rem; font-weight: 600; color: #111827; }
.copy-btn { width: 30px; height: 30px; border-radius: 7px; border: none; background: #f3f4f6; color: #6b7280; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; }
.copy-btn:hover { background: #e5e7eb; color: #111827; }
.copy-btn--copied { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1) !important; color: var(--accent) !important; }

.al-actions  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.al-btn-save { padding: 9px 20px; background: var(--accent); border: none; border-radius: 9px; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; font-weight: 700; cursor: pointer; }
.al-btn-save:hover { background: var(--accent-press); }
.al-btn-gen  { display: flex; align-items: center; gap: 7px; padding: 9px 16px; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 9px; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; font-weight: 600; cursor: pointer; }
.al-btn-gen:hover { border-color: #d1d5db; background: #f9fafb; }
.al-btn-switch { padding: 9px 18px; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 9px; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; font-weight: 600; cursor: pointer; }
.al-btn-switch:hover { border-color: #d1d5db; background: #f9fafb; }

/* ── Modal transition ── */
.modal-fade-enter-active { transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.modal-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.modal-fade-enter-from   { opacity: 0; transform: scale(0.93) translateY(12px); }
.modal-fade-leave-to     { opacity: 0; transform: scale(0.97); }

@media (max-width: 768px) {
  .broker-page    { padding: 20px 14px 100px; }
  .broker-title   { font-size: 1.35rem; }
  .vs-grid        { grid-template-columns: 1fr; }
  .modal          { max-width: 100%; border-radius: 14px; }
}
</style>
