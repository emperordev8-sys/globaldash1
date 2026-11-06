<!-- src/views/SettingsView.vue -->
<template>
  <div class="set-page">

    <!-- Tab bar -->
    <div class="set-tabbar">
      <button v-for="tab in tabs" :key="tab.id"
        :class="['set-tabbar-item', { 'set-tabbar-item--active': activeTab === tab.id }]"
        @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <div class="set-content">

        <!-- ══════════ PROFILE ══════════ -->
        <template v-if="activeTab === 'profile'">

          <!-- Overview: avatar + full name -->
          <div class="set-card set-ov-card">
            <div class="set-card-title">Overview</div>

            <div class="set-ov-body">

              <!-- Avatar -->
              <div class="set-ov-row">
                <label class="set-label">Avatar</label>
                <div class="set-ov-avatar-row">
                  <div class="set-avatar set-avatar--md">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="set-avatar-img" />
                    <template v-else>{{ initials }}</template>
                  </div>
                  <div class="set-ov-avatar-actions">
                    <label class="set-upload-btn">
                      <input type="file" accept="image/*" style="display:none" @change="onAvatarChange"/>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5" stroke-linecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Update image
                    </label>
                    <span class="set-field-note">Maximum file size is 1MB.</span>
                  </div>
                </div>
              </div>

              <!-- Full name -->
              <div class="set-ov-row">
                <label class="set-label" for="prof-fullname">Full name</label>
                <input id="prof-fullname" v-model="form.fullName" class="set-input" />
              </div>

            </div>

            <div class="set-card-footer">
              <button class="set-primary-btn" @click="saveOverview">Save</button>
            </div>
          </div>

          <!-- Contact Info: username + email + telegram + phone -->
          <div class="set-card set-ov-card">
            <div class="set-card-title">Contact Info</div>

            <div class="set-ov-body">

              <!-- Username -->
              <div class="set-ov-row">
                <label class="set-label" for="prof-username">Username</label>
                <input id="prof-username" :value="form.username" class="set-input" disabled />
                <span class="set-field-note">Usernames are locked once set.</span>
              </div>

              <!-- Email -->
              <div class="set-ov-row">
                <label class="set-label" for="prof-email">Email</label>
                <input id="prof-email" v-model="form.email" type="email" class="set-input" />
              </div>

              <!-- Telegram -->
              <div class="set-ov-row">
                <label class="set-label" for="prof-telegram">Telegram</label>
                <input id="prof-telegram" v-model="form.telegram" class="set-input" placeholder="@username" />
              </div>

              <!-- Phone -->
              <div class="set-ov-row">
                <label class="set-label" for="prof-phone">Phone</label>
                <input id="prof-phone" v-model="form.phone" class="set-input" placeholder="+2348012345678" />
              </div>

            </div>

            <div class="set-card-footer">
              <button class="set-primary-btn" @click="saveContactInfo">Save</button>
            </div>
          </div>
        </template>

        <!-- ══════════ SECURITY ══════════ -->
        <template v-else-if="activeTab === 'security'">

          <div class="set-card">
            <div class="set-card-title">Change Password</div>
            <div class="set-sec-form">
              <div class="set-fgroup">
                <label class="set-label">Current password</label>
                <div class="set-pw-wrap">
                  <input :type="showPw.current ? 'text' : 'password'" v-model="pwForm.current"
                    class="set-input" placeholder="Enter current password" />
                  <button class="set-pw-eye" @click="showPw.current = !showPw.current">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="set-fgroup">
                <label class="set-label">New password</label>
                <div class="set-pw-wrap">
                  <input :type="showPw.new ? 'text' : 'password'" v-model="pwForm.new"
                    class="set-input" placeholder="At least 8 characters" />
                  <button class="set-pw-eye" @click="showPw.new = !showPw.new">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
                <div v-if="pwForm.new" class="set-pw-strength">
                  <div class="set-pw-bars">
                    <div v-for="i in 4" :key="i"
                      :class="['set-pw-bar', { 'active': i <= pwStrength.score }]"
                      :style="i <= pwStrength.score ? { background: pwStrength.color } : {}"/>
                  </div>
                  <span class="set-pw-label" :style="{ color: pwStrength.color }">{{ pwStrength.label }}</span>
                </div>
              </div>
              <div class="set-fgroup">
                <label class="set-label">Confirm new password</label>
                <input type="password" v-model="pwForm.confirm" class="set-input"
                  :class="{ 'set-input--err': pwForm.confirm && pwForm.new !== pwForm.confirm }"
                  placeholder="Repeat new password" />
                <span v-if="pwForm.confirm && pwForm.new !== pwForm.confirm" class="set-err">Passwords do not match</span>
              </div>
              <button class="set-primary-btn" :disabled="!canChangePassword" @click="changePassword">
                Update Password
              </button>
            </div>
          </div>

          <div class="set-card">
            <div class="set-card-hdr">
              <div>
                <div class="set-card-title">Two-Factor Authentication</div>
                <p class="set-card-desc">Add an extra layer of security to your account.</p>
              </div>
              <div :class="['set-toggle', { 'set-toggle--on': twoFA }]" @click="twoFA = !twoFA">
                <div class="set-toggle-knob"/>
              </div>
            </div>
            <Transition name="slide-down">
              <div v-if="twoFA" class="set-2fa-notice">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)"
                  stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <p>2FA is active. A verification code will be required on every new login.</p>
              </div>
            </Transition>
          </div>

          <div class="set-card set-card--red">
            <div class="set-card-title" style="color:#f87171">Danger Zone</div>
            <p class="set-card-desc">These actions are permanent and cannot be undone.</p>
            <div class="set-danger-list">
              <div class="set-danger-item">
                <div>
                  <div class="set-danger-name">Deactivate account</div>
                  <div class="set-danger-sub">Temporarily disable your account. You can reactivate anytime.</div>
                </div>
                <button class="set-danger-btn set-danger-btn--amber"
                  @click="showToast('error','Account deactivation requires email confirmation.')">Deactivate</button>
              </div>
              <div class="set-danger-item">
                <div>
                  <div class="set-danger-name">Delete account</div>
                  <div class="set-danger-sub">Permanently delete your account and all associated data.</div>
                </div>
                <button class="set-danger-btn set-danger-btn--red"
                  @click="showToast('error','Account deletion requires email confirmation.')">Delete account</button>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════════ LOGIN HISTORY ══════════ -->
        <template v-else-if="activeTab === 'login'">
          <div class="set-card">
            <div class="set-card-hdr">
              <div class="set-card-title">Login History</div>
              <span class="set-count-badge">{{ loginHistory.length }} sessions</span>
            </div>
            <div class="set-login-table">
              <div class="set-login-head">
                <span>DATE & TIME</span>
                <span>DEVICE</span>
                <span>LOCATION</span>
                <span>IP ADDRESS</span>
                <span>STATUS</span>
              </div>
              <div v-for="log in loginHistory" :key="log.id" class="set-login-row">
                <span class="set-login-date">{{ log.date }}</span>
                <div class="set-login-device">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" v-html="log.deviceIcon"/>
                  {{ log.device }}
                </div>
                <span class="set-login-loc">{{ log.location }}</span>
                <span class="set-login-ip">{{ log.ip }}</span>
                <span :class="['set-status-tag', `set-status-tag--${log.status}`]">{{ log.status }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════════ MY SMTP ══════════ -->
        <template v-else-if="activeTab === 'smtp'">
          <div class="set-card">
            <div class="set-card-title">My SMTP</div>
            <p class="set-card-desc">
              Configure a custom SMTP server to send emails from your own domain.
              Leave blank to use Globalgle's default sending infrastructure.
            </p>
            <div class="set-smtp-form">
              <div class="set-smtp-row">
                <div class="set-fgroup" style="flex:1">
                  <label class="set-label">SMTP Host</label>
                  <input v-model="smtp.host" class="set-input" placeholder="mail.yourdomain.com" />
                </div>
                <div class="set-fgroup" style="width:120px;flex-shrink:0">
                  <label class="set-label">Port</label>
                  <input v-model="smtp.port" class="set-input" placeholder="587" type="number" />
                </div>
              </div>
              <div class="set-fgroup">
                <label class="set-label">Username / Email</label>
                <input v-model="smtp.username" class="set-input" placeholder="noreply@yourdomain.com" />
              </div>
              <div class="set-fgroup">
                <label class="set-label">Password</label>
                <div class="set-pw-wrap">
                  <input :type="showSmtpPw ? 'text' : 'password'" v-model="smtp.password"
                    class="set-input" placeholder="SMTP password or app password" />
                  <button class="set-pw-eye" @click="showSmtpPw = !showSmtpPw">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="set-smtp-row">
                <div class="set-fgroup" style="flex:1">
                  <label class="set-label">From Name</label>
                  <input v-model="smtp.fromName" class="set-input" placeholder="Your Company" />
                </div>
                <div class="set-fgroup" style="flex:1">
                  <label class="set-label">From Email</label>
                  <input v-model="smtp.fromEmail" class="set-input" placeholder="hello@yourdomain.com" />
                </div>
              </div>
              <div class="set-fgroup">
                <label class="set-label">Encryption</label>
                <div class="set-radio-row">
                  <label v-for="enc in ['TLS', 'SSL', 'None']" :key="enc" class="set-radio-opt">
                    <div :class="['set-radio', { 'set-radio--on': smtp.encryption === enc }]"
                      @click="smtp.encryption = enc">
                      <div v-if="smtp.encryption === enc" class="set-radio-dot"/>
                    </div>
                    {{ enc }}
                  </label>
                </div>
              </div>
              <div class="set-smtp-btns">
                <button class="set-ghost-btn" @click="showToast('success','Test email sent! Check your inbox.')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.5" stroke-linecap="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Send test email
                </button>
                <button class="set-primary-btn" @click="saveSMTP">
                  Save SMTP settings
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════════ REFERRALS ══════════ -->
        <template v-else>

          <!-- Stats row -->
          <div class="set-ref-stats">
            <div class="set-ref-stat" v-for="s in refStats" :key="s.label">
              <div :class="['set-ref-icon', `set-ref-icon--${s.color}`]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" v-html="s.icon"/>
              </div>
              <div>
                <div class="set-ref-val">{{ s.val }}</div>
                <div class="set-ref-lbl">{{ s.label }}</div>
              </div>
            </div>
          </div>

          <div class="set-card">
            <div class="set-card-title">Your Referral Code</div>
            <div class="set-ref-row">
              <div class="set-ref-code">{{ referralCode }}</div>
              <button class="set-copy-btn" @click="copyText(referralCode)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <div class="set-card-title" style="margin-top:16px">Your Referral Link</div>
            <div class="set-ref-row">
              <div class="set-ref-link">{{ referralLink }}</div>
              <button class="set-copy-btn" @click="copyText(referralLink)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <p class="set-card-desc" style="margin-top:10px">
              Earn <strong style="color:var(--accent)">₦500</strong> for each friend who signs up and activates a paid plan using your code.
            </p>
          </div>

          <div class="set-card">
            <div class="set-card-hdr">
              <div class="set-card-title">Referred Users</div>
              <span class="set-count-badge">0 total</span>
            </div>
            <div class="set-empty-state">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: var(--t4);">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p>No referrals yet. Share your code to start earning!</p>
            </div>
          </div>
        </template>

    </div>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-up">
        <div v-if="toast" :class="['set-toast', `set-toast--${toast.type}`]">
          <svg v-if="toast.type === 'success'" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ toast.msg }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast.js'
const { success: toastSuccess, error: toastError } = useToast()

/* ── Tabs ── */
const tabs = [
  { id: 'profile',  label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'login',    label: 'Login history' },
  { id: 'smtp',     label: 'My SMTP' },
  { id: 'referrals',label: 'Referrals' },
]
const activeTab = ref('profile')

/* ── Profile ── */
const profile = ref({
  fullName: 'Globalgle',
  username: '@refrer',
  email:    'globalgle@gmail.com',
  telegram: '@global',
  phone:    '08000000000',
})

const initials = computed(() =>
  profile.value.fullName.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
)

const avatarUrl = ref(null)
const MAX_AVATAR_BYTES = 1024 * 1024

function onAvatarChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > MAX_AVATAR_BYTES) {
    toastError('File too large', 'Please choose an image under 1MB.')
    e.target.value = ''
    return
  }
  if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value)
  avatarUrl.value = URL.createObjectURL(file)
  toastSuccess('Avatar updated', 'Your new photo has been saved.')
  e.target.value = ''
}

const form = ref({ ...profile.value })

function saveOverview() {
  const fullName = form.value.fullName?.toString().trim()
  if (!fullName) {
    toastError('Full name required', 'This field cannot be empty.')
    return
  }
  profile.value = { ...profile.value, fullName }
  toastSuccess('Profile updated', 'Your changes have been saved.')
}

function saveContactInfo() {
  const email = form.value.email?.toString().trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toastError('Invalid email', 'Please enter a valid email address.')
    return
  }
  profile.value = { ...profile.value, email, telegram: form.value.telegram, phone: form.value.phone }
  toastSuccess('Contact info updated', 'Your changes have been saved.')
}

/* ── Security ── */
const pwForm = ref({ current: '', new: '', confirm: '' })
const showPw = ref({ current: false, new: false })
const twoFA  = ref(false)

const pwStrength = computed(() => {
  const pw = pwForm.value.new
  let score = 0
  if (pw.length >= 8)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#f87171', '#f59e0b', '#60a5fa', 'var(--accent)']
  return { score, label: labels[score] || '', color: colors[score] || '' }
})

const canChangePassword = computed(() =>
  pwForm.value.current &&
  pwForm.value.new.length >= 8 &&
  pwForm.value.new === pwForm.value.confirm
)

function changePassword() {
  pwForm.value = { current: '', new: '', confirm: '' }
  showToast('success', 'Password updated successfully.')
}

/* ── Login history ── */
const loginHistory = ref([
  { id: 1, date: 'Jun 9, 2026 · 10:24 AM', device: 'Chrome · Windows', location: 'Lagos, NG',  ip: '102.89.23.14',  status: 'current', deviceIcon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { id: 2, date: 'Jun 8, 2026 · 08:11 PM', device: 'Safari · iPhone',  location: 'Abuja, NG',  ip: '102.91.44.20',  status: 'success', deviceIcon: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>' },
  { id: 3, date: 'Jun 7, 2026 · 03:55 PM', device: 'Firefox · Linux',  location: 'London, UK', ip: '185.220.101.8', status: 'blocked', deviceIcon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { id: 4, date: 'Jun 5, 2026 · 11:00 AM', device: 'Chrome · Android', location: 'Lagos, NG',  ip: '102.89.50.66',  status: 'success', deviceIcon: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>' },
])

/* ── SMTP ── */
const smtp = ref({ host: '', port: '587', username: '', password: '', fromName: '', fromEmail: '', encryption: 'TLS' })
const showSmtpPw = ref(false)

/* ── Referrals ── */
const referralCode = 'GLOBAL-REFRER'
const referralLink = 'https://globalgle.app/ref/GLOBAL-REFRER'

const refStats = [
  { label: 'Total Referrals', val: '0',  color: 'green', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { label: 'Active Plans',    val: '0',  color: 'blue',  icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { label: 'Total Earned',    val: '₦0', color: 'amber', icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
]

/* ── SMTP save ── */
function saveSMTP() {
  if (!smtp.value.host.trim())      { toastError('SMTP Host required', 'Please enter your SMTP host.');        return }
  if (!smtp.value.port)             { toastError('Port required',      'Please enter the SMTP port number.');  return }
  if (!smtp.value.username.trim())  { toastError('Username required',  'Please enter your SMTP username.');    return }
  if (!smtp.value.password)         { toastError('Password required',  'Please enter your SMTP password.');    return }
  if (!smtp.value.fromName.trim())  { toastError('From Name required', 'Please enter the sender name.');       return }
  if (!smtp.value.fromEmail.trim()) { toastError('From Email required','Please enter the sender email.');      return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtp.value.fromEmail)) {
    toastError('Invalid email', 'From Email must be a valid email address.')
    return
  }
  toastSuccess('SMTP saved', 'Your SMTP settings have been saved successfully.')
}

/* ── Utilities ── */
const toast = ref(null)
function showToast(type, msg) {
  if (type === 'success') toastSuccess(msg)
  else toastError(msg)
}
function copyText(text) {
  navigator.clipboard?.writeText(text)
  toastSuccess('Copied!', 'Text copied to clipboard.')
}
</script>

<style scoped>
.set-page {
  padding: 0;
}

/* ── Tab bar ── */
.set-tabbar {
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
  padding-bottom: 14px; margin-bottom: 6px;
  border-bottom: 1px solid var(--border-soft);
}
.set-tabbar-item {
  background: none; border: none; border-radius: 8px;
  padding: 7px 14px; font-family: inherit; font-size: 0.83rem; font-weight: 600;
  color: var(--t3); cursor: pointer; transition: all 0.18s;
}
.set-tabbar-item:hover { color: var(--t1); }
.set-tabbar-item--active {
  background: var(--glass-hover); color: var(--t1);
}

/* ── Avatar ── */
.set-avatar {
  width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1); border: 2px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.3);
  font-size: 1.15rem; font-weight: 800; color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.set-avatar-img { width: 100%; height: 100%; object-fit: cover; }

/* ── Overview card (profile) ── */
.set-content { display: flex; flex-direction: column; gap: 16px; }

.set-ov-card    { padding: 18px 20px 16px; gap: 14px; }
.set-ov-body    { display: flex; flex-direction: column; gap: 20px; }
.set-ov-row     { display: flex; flex-direction: column; gap: 7px; }

.set-ov-avatar-row     { display: flex; align-items: center; gap: 14px; }
.set-ov-avatar-actions { display: flex; flex-direction: column; gap: 5px; align-items: flex-start; }
.set-avatar--md { width: 48px; height: 48px; font-size: 0.95rem; }

.set-upload-btn {
  display: flex; align-items: center; gap: 7px; cursor: pointer;
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  border-radius: 9px; padding: 7px 13px; font-size: 0.78rem;
  font-weight: 600; color: var(--t2); transition: all 0.2s;
}
.set-upload-btn:hover { border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.3); color: var(--accent); }

.set-field-note { font-size: 0.7rem; color: var(--t2); font-weight: 600; }

.set-card-footer {
  display: flex; padding-top: 14px; margin-top: 2px;
  border-top: 1px solid var(--border-soft);
}

/* ── Cards ── */
.set-card {
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 14px; padding: 14px 16px;
  display: flex; flex-direction: column; gap: 10px;
}
.set-card--red { border-color: rgba(248,113,113,.2); background: rgba(248,113,113,.03); }

.set-card-hdr   { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.set-card-title { font-size: 0.9rem; font-weight: 700; color: var(--t1); }
.set-card-desc  { font-size: 0.77rem; color: var(--t3); margin: 0; line-height: 1.5; }
.set-count-badge {
  font-size: 0.66rem; font-weight: 700; padding: 3px 9px; border-radius: 999px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1); color: var(--accent); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2);
}

/* ── Security form ── */
.set-sec-form  { display: flex; flex-direction: column; gap: 14px; }
.set-fgroup    { display: flex; flex-direction: column; gap: 6px; }
.set-label     { font-size: 0.73rem; font-weight: 700; color: var(--t2); }

.set-input {
  width: 100%; background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 11px; padding: 10px 14px; font-size: 0.87rem;
  color: var(--t1); font-family: inherit; outline: none; box-sizing: border-box;
  transition: border-color 0.2s;
}
.set-input:focus { border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.4); }
.set-input--err  { border-color: rgba(248,113,113,.4); }
.set-input:disabled { opacity: 0.55; cursor: not-allowed; }

.set-err { font-size: 0.7rem; color: #f87171; }

.set-pw-wrap { position: relative; }
.set-pw-wrap .set-input { padding-right: 40px; }
.set-pw-eye {
  position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: var(--t3); padding: 3px;
  transition: color 0.2s;
}
.set-pw-eye:hover { color: var(--t1); }

.set-pw-strength { display: flex; align-items: center; gap: 8px; margin-top: 3px; }
.set-pw-bars { display: flex; gap: 4px; }
.set-pw-bar {
  width: 34px; height: 4px; border-radius: 2px;
  background: var(--glass-hover); transition: background 0.3s;
}
.set-pw-label { font-size: 0.7rem; font-weight: 700; }

.set-primary-btn {
  padding: 11px 22px; border-radius: 11px;
  background: var(--accent); border: none;
  font-size: 0.84rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s, opacity 0.2s;
}
.set-primary-btn:hover:not(:disabled) { background: var(--accent-press); }
.set-primary-btn:disabled { opacity: 0.38; cursor: not-allowed; }

/* Toggle */
.set-toggle {
  width: 42px; height: 24px; border-radius: 12px; flex-shrink: 0;
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  position: relative; cursor: pointer; transition: all 0.25s;
}
.set-toggle--on { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.22); border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.38); }
.set-toggle-knob {
  width: 18px; height: 18px; border-radius: 50%; background: var(--t3);
  position: absolute; top: 2px; left: 2px; transition: transform 0.25s, background 0.25s;
}
.set-toggle--on .set-toggle-knob { transform: translateX(18px); background: var(--accent); }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.22s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

.set-2fa-notice {
  display: flex; gap: 9px; align-items: flex-start;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.06); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.18);
  border-radius: 10px; padding: 12px 14px;
}
.set-2fa-notice p { font-size: 0.77rem; color: var(--t2); margin: 0; line-height: 1.5; }

/* Danger */
.set-danger-list { display: flex; flex-direction: column; gap: 10px; }
.set-danger-item {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 14px 16px; border-radius: 12px;
  background: var(--glass-2); border: 1px solid rgba(248,113,113,.1);
}
.set-danger-name { font-size: 0.83rem; font-weight: 700; color: var(--t1); margin-bottom: 3px; }
.set-danger-sub  { font-size: 0.72rem; color: var(--t1); font-weight: 600; }
.set-danger-btn {
  flex-shrink: 0; padding: 7px 15px; border-radius: 9px;
  font-size: 0.77rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.set-danger-btn--amber { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.22); color: #f59e0b; }
.set-danger-btn--amber:hover { background: rgba(245,158,11,.2); }
.set-danger-btn--red  { background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.22); color: #f87171; }
.set-danger-btn--red:hover  { background: rgba(248,113,113,.2); }

/* ── Login history ── */
.set-login-table { display: flex; flex-direction: column; }
.set-login-head {
  display: grid; grid-template-columns: 175px 1fr 110px 125px 85px;
  gap: 12px; padding: 8px 0 10px;
  font-size: 0.61rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.09em; color: var(--t2);
  border-bottom: 1px solid var(--border-soft);
}
.set-login-row {
  display: grid; grid-template-columns: 175px 1fr 110px 125px 85px;
  gap: 12px; padding: 12px 0; align-items: center;
  border-bottom: 1px solid var(--border-soft);
}
.set-login-row:last-child { border-bottom: none; }
.set-login-date  { font-size: 0.75rem; color: var(--t1); font-weight: 700; }
.set-login-device{ font-size: 0.8rem; font-weight: 700; color: var(--t1); display: flex; align-items: center; gap: 6px; }
.set-login-loc   { font-size: 0.77rem; color: var(--t1); font-weight: 700; }
.set-login-ip    { font-size: 0.72rem; color: var(--t2); font-weight: 700; font-family: monospace; }

.set-status-tag {
  font-size: 0.63rem; font-weight: 700; text-transform: uppercase;
  padding: 3px 9px; border-radius: 999px; width: fit-content;
}
.set-status-tag--current { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1);   color: var(--accent);  border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2);  }
.set-status-tag--success { background: rgba(96,165,250,.1);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.2); }
.set-status-tag--blocked { background: rgba(248,113,113,.1); color: #f87171;  border: 1px solid rgba(248,113,113,.2);}

/* ── SMTP ── */
.set-smtp-form  { display: flex; flex-direction: column; gap: 14px; }
.set-smtp-row   { display: flex; gap: 14px; }
.set-radio-row  { display: flex; gap: 18px; }
.set-radio-opt  { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 600; color: var(--t2); cursor: pointer; }
.set-radio {
  width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
  border: 2px solid var(--border-soft); display: flex; align-items: center;
  justify-content: center; transition: border-color 0.2s;
}
.set-radio--on  { border-color: var(--accent); }
.set-radio-dot  { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
.set-smtp-btns  { display: flex; gap: 10px; }
.set-ghost-btn {
  display: flex; align-items: center; gap: 7px;
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  border-radius: 11px; padding: 10px 16px; font-size: 0.83rem;
  font-weight: 600; color: var(--t2); cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.set-ghost-btn:hover { border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.3); color: var(--accent); }
.set-smtp-btns .set-primary-btn { flex: 1; }

/* ── Referrals ── */
.set-ref-stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}
.set-ref-stat {
  background: var(--bg);
  border: 1px solid var(--border-soft); border-radius: 16px;
  padding: 17px; display: flex; align-items: center; gap: 14px;
}
.set-ref-icon {
  width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.set-ref-icon--green { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1);   border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2);   color: var(--accent);  }
.set-ref-icon--blue  { background: rgba(96,165,250,.1);  border: 1px solid rgba(96,165,250,.2);  color: #60a5fa;  }
.set-ref-icon--amber { background: rgba(245,158,11,.1);  border: 1px solid rgba(245,158,11,.2);  color: #f59e0b;  }
.set-ref-val { font-size: 1.35rem; font-weight: 800; color: var(--t1); line-height: 1; }
.set-ref-lbl { font-size: 0.69rem; color: var(--t3); margin-top: 3px; }

.set-ref-row {
  display: flex; align-items: center; gap: 12px;
  background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 12px 16px;
}
.set-ref-code { flex: 1; font-size: 1.1rem; font-weight: 800; color: var(--accent); letter-spacing: 0.05em; font-family: monospace; }
.set-ref-link { flex: 1; font-size: 0.77rem; color: var(--t3); font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.set-copy-btn {
  flex-shrink: 0; display: flex; align-items: center; gap: 6px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2);
  border-radius: 8px; padding: 7px 13px; font-size: 0.75rem; font-weight: 700;
  color: var(--accent); cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.set-copy-btn:hover { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.2); }

.set-empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 26px; color: var(--t3); font-size: 0.81rem; text-align: center;
}

/* ── Toast ── */
.toast-up-enter-active, .toast-up-leave-active { transition: all 0.3s ease; }
.toast-up-enter-from, .toast-up-leave-to       { opacity: 0; transform: translateY(18px); }
.set-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 9px;
  padding: 12px 20px; border-radius: 13px; font-size: 0.83rem; font-weight: 600;
}
.set-toast--success { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.18);   border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),.3);   color: var(--accent);  }
.set-toast--error   { background: rgba(248,113,113,.18); border: 1px solid rgba(248,113,113,.3); color: #f87171; }

@media (max-width: 1024px) and (min-width: 769px) {
  .set-ref-stats   { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  /* Overview card */
  .set-ov-card     { padding: 16px 18px; }
  .set-avatar--md  { width: 44px; height: 44px; font-size: 0.9rem; }

  /* Cards */
  .set-card        { padding: 18px; gap: 12px; }

  /* Danger zone — stack on mobile */
  .set-danger-item { flex-direction: column; align-items: flex-start; gap: 12px; }
  .set-danger-btn  { width: 100%; text-align: center; justify-content: center; display: flex; }

  /* Ref stats */
  .set-ref-stats   { grid-template-columns: 1fr 1fr; }

  /* SMTP */
  .set-smtp-row    { flex-direction: column; }
  .set-smtp-btns   { flex-direction: column; }
  .set-smtp-btns .set-primary-btn { flex: unset; }

  /* Login history — card layout instead of table */
  .set-login-head  { display: none; }
  .set-login-row   {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 4px 10px;
    padding: 12px 0;
  }
  .set-login-date   { grid-column: 1; grid-row: 1; font-size: 0.72rem; }
  .set-login-device { grid-column: 1; grid-row: 2; font-size: 0.77rem; }
  .set-login-loc    { display: none; }
  .set-login-ip     { display: none; }
  .set-status-tag   { grid-column: 2; grid-row: 1 / 3; align-self: center; }
}

@media (max-width: 480px) {
  .set-ov-avatar-row { flex-direction: column; align-items: flex-start; gap: 10px; }

  .set-ref-stats    { grid-template-columns: 1fr; }
  .set-ref-stat     { padding: 14px; }
  .set-ref-val      { font-size: 1.1rem; }

  .set-ref-row      { flex-direction: column; align-items: stretch; gap: 8px; }
  .set-copy-btn     { width: 100%; justify-content: center; }

  .set-card         { padding: 16px; }
  .set-primary-btn  { width: 100%; }
}

</style>
