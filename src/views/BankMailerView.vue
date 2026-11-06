<!-- src/views/BankMailerView.vue -->
<template>
  <div class="bm-page">

    <!-- Page Header -->
    <div class="bm-page-head">
      <button class="back-btn" @click="$router.back()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div class="bm-head-text">
        <h1 class="bm-title">Bank Mailer</h1>
        <p class="bm-sub">Compose one bank transfer â€" we send the debit notice to the sender and the credit notice to the receiver.</p>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="bm-layout">

      <!-- â"€â"€ LEFT: Form card â"€â"€ -->
      <div class="bm-form-card">

        <!-- Preview toggle -->
        <div class="preview-toggle-wrap">
          <p class="toggle-label">Previewing</p>
          <div class="toggle-btns">
            <button :class="['toggle-btn', preview === 'debit' ? 'toggle-btn--dark' : 'toggle-btn--light']" @click="preview = 'debit'">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              Debit â†' sender
            </button>
            <button :class="['toggle-btn', preview === 'credit' ? 'toggle-btn--dark' : 'toggle-btn--light']" @click="preview = 'credit'">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>
              Credit â†' receiver
            </button>
          </div>
        </div>

        <!-- TRANSACTION -->
        <div class="form-section">
          <p class="section-label">TRANSACTION</p>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Amount <span class="req">*</span></label>
              <input v-model="form.amount" type="number" min="0" step="0.01" placeholder="0.00" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Currency</label>
              <select v-model="form.currency" class="fs">
                <option value="USD">$</option>
                <option value="GBP">Â£</option>
                <option value="EUR">â‚¬</option>
                <option value="NGN">â‚¦</option>
                <option value="BTC">â‚¿ BTC</option>
                <option value="ETH">Îž ETH</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">SWIFT code <span class="req">*</span></label>
              <input v-model="form.swift" type="text" placeholder="e.g. BOFAUS3N" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Status (credit email)</label>
              <select v-model="form.status" class="fs">
                <option>Completed</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SENDER -->
        <div class="form-section">
          <p class="section-label">SENDER â€" DEBITED</p>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Sender name <span class="req">*</span></label>
              <input v-model="form.senderName" type="text" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Sender email <span class="req">*</span></label>
              <input v-model="form.senderEmail" type="email" class="fi" />
              <span class="field-hint">Receives the debit notice.</span>
            </div>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Sender account number <span class="req">*</span></label>
              <input v-model="form.senderAccount" type="text" class="fi" />
              <span class="field-hint">Masked to â€¢â€¢â€¢â€¢ {{ maskedLast4(form.senderAccount) }} in the debit email.</span>
            </div>
            <div class="fg">
              <label class="fl">Sender's bank <span class="req">*</span></label>
              <input v-model="form.senderBank" type="text" class="fi" />
            </div>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Sender's country <span class="req">*</span></label>
              <input v-model="form.senderCountry" type="text" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Sender's bank address <span class="req">*</span></label>
              <input v-model="form.senderAddress" type="text" class="fi" />
            </div>
          </div>
          <div class="fg">
            <label class="fl">Sender's bank phone</label>
            <input v-model="form.senderPhone" type="tel" class="fi fi--half" />
          </div>
          <div class="fg">
            <label class="fl">Sender's bank logo <span class="field-opt">(optional)</span></label>
            <div class="logo-row">
              <div class="logo-preview-box">
                <img v-if="senderLogoUrl" :src="senderLogoUrl" class="logo-preview-img" alt="logo" />
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <label class="logo-drop-zone" :class="{ 'logo-drop-zone--drag': senderDragOver }"
                @dragover.prevent="senderDragOver = true"
                @dragleave="senderDragOver = false"
                @drop.prevent="e => { senderDragOver = false; handleDrop(e, 'sender') }">
                <input type="file" accept="image/*" hidden ref="senderFileRef" @change="handleLogoFile($event, 'sender')" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                <span>Drag & drop or <button type="button" class="logo-click-btn" @click.prevent="senderFileRef.click()">click</button></span>
              </label>
            </div>
          </div>
        </div>

        <!-- RECEIVER -->
        <div class="form-section">
          <p class="section-label">RECEIVER â€" CREDITED</p>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Receiver name <span class="req">*</span></label>
              <input v-model="form.receiverName" type="text" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Receiver email <span class="req">*</span></label>
              <input v-model="form.receiverEmail" type="email" class="fi" />
              <span class="field-hint">Receives the credit notice.</span>
            </div>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Receiver account number <span class="req">*</span></label>
              <input v-model="form.receiverAccount" type="text" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Receiver's bank <span class="req">*</span></label>
              <input v-model="form.receiverBank" type="text" class="fi" />
            </div>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Receiver's country <span class="req">*</span></label>
              <input v-model="form.receiverCountry" type="text" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Receiver's bank address <span class="req">*</span></label>
              <input v-model="form.receiverAddress" type="text" class="fi" />
            </div>
          </div>
          <div class="fg">
            <label class="fl">Receiver's bank phone</label>
            <input v-model="form.receiverPhone" type="tel" class="fi fi--half" />
          </div>
          <div class="fg">
            <label class="fl">Receiver's bank logo <span class="field-opt">(optional)</span></label>
            <div class="logo-row">
              <div class="logo-preview-box">
                <img v-if="receiverLogoUrl" :src="receiverLogoUrl" class="logo-preview-img" alt="logo" />
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <label class="logo-drop-zone" :class="{ 'logo-drop-zone--drag': receiverDragOver }"
                @dragover.prevent="receiverDragOver = true"
                @dragleave="receiverDragOver = false"
                @drop.prevent="e => { receiverDragOver = false; handleDrop(e, 'receiver') }">
                <input type="file" accept="image/*" hidden ref="receiverFileRef" @change="handleLogoFile($event, 'receiver')" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                <span>Drag & drop or <button type="button" class="logo-click-btn" @click.prevent="receiverFileRef.click()">click</button></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Optional details -->
        <details class="optional-details">
          <summary class="optional-summary">
            <svg class="optional-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            Optional details
          </summary>
          <div class="optional-body">
            <div class="two-col">
              <div class="fg">
                <label class="fl">Account type</label>
                <select v-model="form.accountType" class="fs">
                  <option>Checking Account</option>
                  <option>Savings Account</option>
                  <option>Business Account</option>
                </select>
              </div>
              <div class="fg">
                <label class="fl">Memo / Note</label>
                <input v-model="form.memo" type="text" placeholder="e.g. Salary payment" class="fi" />
              </div>
            </div>
          </div>
        </details>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <button :class="['send-btn', { 'send-btn--loading': sending }]" @click="sendEmails">
          <template v-if="!sending">Send both emails</template>
          <template v-else><span class="spinner" /> Sending...</template>
        </button>
        <p class="send-caption">Sends the debit notice to the sender and the credit notice to the receiver.</p>

      </div>

      <!-- â"€â"€ RIGHT: Live Email Preview â"€â"€ -->
      <div class="bm-preview-col">
        <div class="preview-bar">
          <span class="preview-type-tag">{{ preview === 'debit' ? 'DEBIT EMAIL â€" SENDER' : 'CREDIT EMAIL â€" RECEIVER' }}</span>
          <span class="preview-subject-txt">Subject: <strong>{{ emailSubject }}</strong></span>
        </div>
        <div class="email-shell">
          <div class="email-body-wrap">

            <div class="e-logo-row">
              <div class="e-logo-box">
                <img v-if="activeLogoUrl" :src="activeLogoUrl" class="e-logo-img" alt="bank" />
                <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="22" x2="21" y2="22"/><rect x="2" y="11" width="20" height="11"/>
                  <polygon points="12 2 2 7 22 7"/>
                  <line x1="6" y1="11" x2="6" y2="22"/><line x1="10" y1="11" x2="10" y2="22"/>
                  <line x1="14" y1="11" x2="14" y2="22"/><line x1="18" y1="11" x2="18" y2="22"/>
                </svg>
              </div>
              <span class="e-alerts-tag">Alerts â€¢</span>
            </div>
            <p class="e-bank-name-tag">{{ activeBankDisplay || 'Your Bank' }}</p>
            <div class="e-separator"></div>

            <h2 class="e-email-title">{{ emailTitle }}</h2>
            <p class="e-greeting">Hello {{ activeName }},</p>
            <p class="e-body-text" v-html="emailBodyHtml"></p>

            <div class="e-block">
              <div class="e-block-head">{{ isDebit ? 'Withdrawal Details' : 'Deposit Details' }}</div>
              <div class="e-block-body">
                <div class="e-row"><span class="e-row-lbl">{{ isDebit ? 'Withdrawal Amount' : 'Deposit Amount' }}</span><span class="e-row-val">{{ formattedAmount }}</span></div>
                <div class="e-row"><span class="e-row-lbl">{{ isDebit ? 'Withdrawal Date' : 'Deposit Date' }}</span><span class="e-row-val">{{ currentDate }}</span></div>
                <div class="e-row"><span class="e-row-lbl">{{ isDebit ? 'Withdrawal Time' : 'Deposit Time' }}</span><span class="e-row-val">{{ currentTime }}</span></div>
                <div class="e-row"><span class="e-row-lbl">{{ isDebit ? 'Withdrawal Status' : 'Deposit Status' }}</span><span class="e-row-val e-row-val--success">Successful</span></div>
              </div>
            </div>

            <div class="e-block">
              <div class="e-block-head">Account Information</div>
              <div class="e-block-body">
                <div class="e-row"><span class="e-row-lbl">Account Type</span><span class="e-row-val">{{ form.accountType }}</span></div>
                <div class="e-row"><span class="e-row-lbl">Account Number</span><span class="e-row-val">{{ isDebit ? maskedSenderAccount : maskedReceiverAccount }}</span></div>
              </div>
            </div>

            <div class="e-block">
              <div class="e-block-head">{{ isDebit ? 'Withdrawal Beneficiary' : 'Deposit Sender' }}</div>
              <div class="e-block-body">
                <div class="e-row"><span class="e-row-lbl">Recipient</span><span class="e-row-val">{{ isDebit ? (form.receiverName || 'â€"') : (form.senderName || 'â€"') }}</span></div>
                <div class="e-row"><span class="e-row-lbl">Account Number</span><span class="e-row-val">{{ isDebit ? (form.receiverAccount || 'â€"') : (form.senderAccount || 'â€"') }}</span></div>
                <div class="e-row"><span class="e-row-lbl">SWIFT Code</span><span class="e-row-val">{{ form.swift || 'â€"' }}</span></div>
              </div>
            </div>

            <div class="e-block">
              <div class="e-block-head">Transaction Information</div>
              <div class="e-block-body">
                <div class="e-row"><span class="e-row-lbl">Transaction ID</span><span class="e-row-val e-row-val--link">{{ txId }}</span></div>
              </div>
            </div>

            <p class="e-security"><strong>For your security,</strong> {{ activeBankDisplay || 'your bank' }} will never ask for your password, PIN, or one-time verification code by email, phone, or text.</p>
            <p class="e-contact"><strong>Contact Support:</strong><br /><span class="e-auto-msg">This is an automated message. Please do not reply to this email.</span></p>
            <p class="e-footer">{{ activeBankDisplay }}</p>

          </div>
        </div>
      </div>

    </div>

    <Transition name="toast-pop">
      <div v-if="showSuccess" class="success-toast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        Both emails sent successfully!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const preview         = ref('debit')
const senderLogoUrl   = ref(null)
const receiverLogoUrl = ref(null)
const senderDragOver   = ref(false)
const receiverDragOver = ref(false)
const senderFileRef   = ref(null)
const receiverFileRef = ref(null)
const sending         = ref(false)
const showSuccess     = ref(false)
const formError       = ref('')
const txId = ref('TN' + String(Math.floor(Math.random() * 1e9)).padStart(9, '0'))

const now = ref(new Date())
let clockTimer
onMounted  (() => { clockTimer = setInterval(() => { now.value = new Date() }, 30000) })
onUnmounted(() => clearInterval(clockTimer))

const currentDate = computed(() => now.value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
const currentTime = computed(() => now.value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))

const form = reactive({
  amount: '', currency: 'USD', swift: '', status: 'Completed',
  senderName: '', senderEmail: '', senderAccount: '', senderBank: '',
  senderCountry: 'USA', senderAddress: '', senderPhone: '',
  receiverName: '', receiverEmail: '', receiverAccount: '', receiverBank: '',
  receiverCountry: 'USA', receiverAddress: '', receiverPhone: '',
  accountType: 'Checking Account', memo: '',
})

const currencySymbols = { USD: '$', GBP: 'Â£', EUR: 'â‚¬', NGN: 'â‚¦', BTC: 'â‚¿', ETH: 'Îž', USDT: '' }

const formattedAmount = computed(() => {
  const sym = currencySymbols[form.currency] ?? ''
  if (!form.amount) return `${sym}0.00`
  return `${sym}${Number(form.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
})

const isDebit = computed(() => preview.value === 'debit')
const activeLogoUrl     = computed(() => isDebit.value ? senderLogoUrl.value   : receiverLogoUrl.value)
const activeBankDisplay = computed(() => isDebit.value ? (form.senderBank || form.senderCountry || '') : (form.receiverBank || form.receiverCountry || ''))
const activeName        = computed(() => isDebit.value ? form.senderName : form.receiverName)

const emailTitle = computed(() =>
  isDebit.value
    ? 'Withdrawal Successful â€" Funds Debited From Your Account'
    : 'Deposit Successful â€" Funds Credited To Your Account'
)
const emailSubject = computed(() => {
  const action = isDebit.value ? 'Withdrawal Successful' : 'Deposit Successful'
  return form.amount ? `${action} â€" ${formattedAmount.value}` : action
})
const emailBodyHtml = computed(() => {
  const amt = `<strong style="color:#1a56db">${formattedAmount.value}</strong>`
  return isDebit.value
    ? `We're writing to inform you that a withdrawal of ${amt} has been <span style="color:#1a56db">successfully debited</span> from your account.`
    : `We're writing to inform you that a deposit of ${amt} has been <span style="color:#1a56db">successfully credited</span> to your account.`
})

function maskedLast4(acct) {
  if (!acct || acct.length < 4) return '1234'
  return acct.slice(-4)
}
const maskedSenderAccount   = computed(() => form.senderAccount   ? 'â€¢â€¢â€¢â€¢ ' + form.senderAccount.slice(-4)   : 'â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢')
const maskedReceiverAccount = computed(() => form.receiverAccount ? 'â€¢â€¢â€¢â€¢ ' + form.receiverAccount.slice(-4) : 'â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢')

function handleLogoFile(e, type) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => { type === 'sender' ? senderLogoUrl.value = ev.target.result : receiverLogoUrl.value = ev.target.result }
  reader.readAsDataURL(file)
}
function handleDrop(e, type) {
  const file = e.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = ev => { type === 'sender' ? senderLogoUrl.value = ev.target.result : receiverLogoUrl.value = ev.target.result }
  reader.readAsDataURL(file)
}

function sendEmails() {
  formError.value = ''
  if (!form.amount || Number(form.amount) <= 0)       { formError.value = 'Please enter a valid amount.'; return }
  if (!form.swift.trim())                             { formError.value = 'SWIFT code is required.'; return }
  if (!form.senderName.trim())                        { formError.value = 'Sender name is required.'; return }
  if (!form.senderEmail.includes('@'))                { formError.value = 'Valid sender email is required.'; return }
  if (!form.senderAccount.trim())                     { formError.value = 'Sender account number is required.'; return }
  if (!form.senderBank.trim())                        { formError.value = "Sender's bank is required."; return }
  if (!form.senderAddress.trim())                     { formError.value = "Sender's bank address is required."; return }
  if (!form.receiverName.trim())                      { formError.value = 'Receiver name is required.'; return }
  if (!form.receiverEmail.includes('@'))              { formError.value = 'Valid receiver email is required.'; return }
  if (!form.receiverAccount.trim())                   { formError.value = 'Receiver account number is required.'; return }
  if (!form.receiverBank.trim())                      { formError.value = "Receiver's bank is required."; return }
  if (!form.receiverAddress.trim())                   { formError.value = "Receiver's bank address is required."; return }

  sending.value = true
  setTimeout(() => {
    sending.value = false
    showSuccess.value = true
    txId.value = 'TN' + String(Math.floor(Math.random() * 1e9)).padStart(9, '0')
    setTimeout(() => { showSuccess.value = false }, 3500)
  }, 1800)
}
</script>

<style scoped>
.bm-page { display: flex; flex-direction: column; gap: 24px; }

/* Page header */
.bm-page-head { display: flex; align-items: flex-start; gap: 16px; }
.back-btn {
  display: flex; align-items: center; gap: 6px; padding: 7px 14px;
  border-radius: 8px; border: 1px solid var(--border-soft); background: var(--bg);
  color: var(--t2); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: background 0.18s, color 0.18s; flex-shrink: 0; margin-top: 4px;
}
.back-btn:hover { background: var(--bg); color: var(--t1); }
.bm-head-text { display: flex; flex-direction: column; gap: 4px; }
.bm-title { font-size: 1.45rem; font-weight: 800; color: var(--t1); letter-spacing: -0.025em; margin: 0; }
.bm-sub   { font-size: 0.82rem; color: var(--t1); font-weight: 600; margin: 0; }

/* Two-column layout */
.bm-layout {
  display: grid;
  grid-template-columns: 540px 1fr;
  gap: 20px;
  align-items: start;
}

/* Form card */
.bm-form-card {
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Preview toggle */
.preview-toggle-wrap { display: flex; flex-direction: column; gap: 10px; padding-bottom: 20px; border-bottom: 1px solid var(--border-soft); margin-bottom: 20px; }
.toggle-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--t3); margin: 0; }
.toggle-btns  { display: flex; gap: 8px; }
.toggle-btn {
  display: flex; align-items: center; gap: 7px; padding: 10px 18px;
  border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; font-weight: 600;
  cursor: pointer; transition: all 0.18s; border: 1px solid transparent;
}
.toggle-btn--dark  { background: #0f172a; color: #fff; border-color: #0f172a; }
.toggle-btn--light { background: var(--bg); color: var(--t2); border-color: var(--border-soft); }
.toggle-btn--light:hover { border-color: var(--border); color: var(--t1); }

/* Form sections */
.form-section {
  display: flex; flex-direction: column; gap: 14px;
  padding: 20px 0; border-bottom: 1px solid var(--border-soft);
}
.form-section:last-of-type { border-bottom: none; padding-bottom: 0; }

.section-label {
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--t3); margin: 0;
}

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.fg { display: flex; flex-direction: column; gap: 6px; }
.fl { font-size: 0.78rem; font-weight: 600; color: var(--t2); }
.req { color: #ef4444; }
.field-opt  { font-weight: 400; color: var(--t4); }
.field-hint { font-size: 0.7rem; color: var(--t4); }

.fi {
  padding: 9px 12px; border-radius: 9px; border: 1px solid var(--border-soft);
  background: var(--bg); color: var(--t1); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.82rem; transition: border-color 0.18s; box-sizing: border-box; width: 100%;
}
.fi:focus { outline: none; border-color: var(--accent); }
.fi::placeholder { color: var(--t4); }
.fi--half { max-width: 50%; }

.fs {
  padding: 9px 12px; border-radius: 9px; border: 1px solid var(--border-soft);
  background: var(--bg); color: var(--t1); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.82rem; cursor: pointer; transition: border-color 0.18s; width: 100%;
}
.fs:focus { outline: none; border-color: var(--accent); }

/* Logo upload */
.logo-row { display: flex; gap: 10px; align-items: stretch; }
.logo-preview-box {
  width: 68px; height: 68px; flex-shrink: 0; border-radius: 12px;
  border: 1px solid var(--border-soft); background: var(--bg);
  display: flex; align-items: center; justify-content: center; overflow: hidden; color: var(--t4);
}
.logo-preview-img { width: 100%; height: 100%; object-fit: contain; }
.logo-drop-zone {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
  border: 1.5px dashed var(--border); border-radius: 12px; padding: 12px 16px;
  font-size: 0.78rem; color: var(--t3); cursor: pointer; transition: border-color 0.18s, background 0.18s;
}
.logo-drop-zone:hover, .logo-drop-zone--drag { border-color: var(--accent); background: var(--accent-dim); }
.logo-click-btn {
  background: none; border: none; padding: 0; color: var(--accent);
  font-family: inherit; font-size: inherit; cursor: pointer; font-weight: 600;
}

/* Optional details */
.optional-details { border: 1px solid var(--border-soft); border-radius: 12px; overflow: hidden; margin: 8px 0 4px; }
.optional-summary {
  display: flex; align-items: center; gap: 8px; padding: 13px 16px;
  font-size: 0.82rem; font-weight: 600; color: var(--t2); cursor: pointer; list-style: none;
}
.optional-summary::-webkit-details-marker { display: none; }
.optional-arrow { color: var(--t3); transition: transform 0.2s; }
details[open] .optional-arrow { transform: rotate(90deg); }
.optional-body { padding: 4px 16px 16px; }

/* Error */
.form-error {
  font-size: 0.78rem; color: #ef4444; background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25); border-radius: 8px; padding: 10px 12px; margin: 8px 0 0;
}

/* Send button */
.send-btn {
  width: 100%; padding: 14px; border-radius: 12px; border: none; background: #0f172a; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer;
  transition: opacity 0.2s, transform 0.18s; display: flex; align-items: center;
  justify-content: center; gap: 8px; margin-top: 16px;
}
.send-btn:hover:not(.send-btn--loading) { opacity: 0.88; transform: translateY(-1px); }
.send-btn--loading { opacity: 0.7; cursor: not-allowed; }

.send-caption { font-size: 0.72rem; color: var(--t4); text-align: center; margin: 8px 0 0; }

.spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* â"€â"€ RIGHT: Preview column â"€â"€ */
.bm-preview-col {
  position: sticky; top: 24px; display: flex; flex-direction: column;
  border: 1px solid var(--border-soft); border-radius: 20px; overflow: hidden;
  max-height: calc(100vh - 120px);
}
.preview-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 18px; background: var(--bg); border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0; gap: 12px;
}
.preview-type-tag {
  font-size: 0.67rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: var(--t3); white-space: nowrap;
}
.preview-subject-txt { font-size: 0.72rem; color: var(--t3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Email shell (gray outer bg) */
.email-shell { background: #f1f5f9; flex: 1; overflow-y: auto; padding: 20px; }

/* White email card */
.email-body-wrap {
  background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 28px 28px 20px; max-width: 520px; margin: 0 auto;
}

/* Email internals â€" always light */
.e-logo-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 4px; }
.e-logo-box {
  width: 46px; height: 46px; border-radius: 8px; background: #f8fafc;
  border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.e-logo-img    { width: 100%; height: 100%; object-fit: contain; }
.e-alerts-tag  { font-size: 0.72rem; color: #94a3b8; }
.e-bank-name-tag { font-size: 0.78rem; font-weight: 600; color: #475569; margin: 4px 0 12px; }
.e-separator   { height: 1px; background: #e2e8f0; margin: 0 0 18px; }
.e-email-title { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 10px; line-height: 1.4; }
.e-greeting    { font-size: 0.85rem; color: #334155; margin: 0 0 6px; }
.e-body-text   { font-size: 0.85rem; color: #334155; margin: 0 0 18px; line-height: 1.6; }

.e-block { border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; margin-bottom: 14px; }
.e-block-head { background: #ebf5fb; padding: 8px 14px; font-size: 0.78rem; font-weight: 700; color: #1e3a5f; }
.e-block-body { }
.e-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; }
.e-row:first-child { border-top: none; }
.e-row-lbl { color: #475569; }
.e-row-val { color: #1a56db; font-weight: 500; text-align: right; }
.e-row-val--success { color: #1a56db; }
.e-row-val--link    { color: #1a56db; }

.e-security  { font-size: 0.75rem; color: #475569; line-height: 1.6; margin: 14px 0 10px; }
.e-security strong { color: #0f172a; }
.e-contact   { font-size: 0.75rem; color: #475569; line-height: 1.6; margin: 0 0 10px; }
.e-contact strong { color: #0f172a; }
.e-auto-msg  { color: #ef4444; }
.e-footer    { font-size: 0.75rem; color: #1a56db; font-weight: 600; margin: 0; padding-top: 10px; border-top: 1px solid #e2e8f0; }

/* Success toast */
.success-toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 400;
  display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-radius: 14px;
  background: var(--accent); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.85rem; font-weight: 600; box-shadow: 0 8px 28px rgba(22,163,74,0.45);
}

.toast-pop-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-pop-enter-from,
.toast-pop-leave-to     { opacity: 0; transform: translateY(12px) scale(0.95); }

/* â"€â"€ Responsive â"€â"€ */

/* Tablet landscape (901px â€" 1200px) */
@media (max-width: 1200px) {
  .bm-layout { grid-template-columns: 1fr 1fr; gap: 18px; }
}

/* Tablet portrait (601px â€" 900px): stack preview below form */
@media (max-width: 900px) {
  .bm-page        { gap: 20px; }
  .bm-layout      { grid-template-columns: 1fr; gap: 18px; }
  .bm-preview-col { position: static; max-height: none; order: 1; }
  .two-col        { grid-template-columns: 1fr 1fr; }
}

/* Mobile (â‰¤ 600px) */
@media (max-width: 600px) {
  .bm-page        { gap: 16px; }
  .bm-layout      { gap: 14px; }
  .bm-header      { gap: 10px; margin-top: 10px; flex-direction: column; align-items: flex-start; }
  .bm-title       { font-size: 1.2rem; }
  .bm-sub         { font-size: 0.76rem; }

  .bm-form-card   { padding: 18px 16px; border-radius: 16px; }
  .form-section   { gap: 12px; padding: 16px 0; }
  .section-title  { font-size: 0.78rem; }
  .two-col        { grid-template-columns: 1fr; }
  .fi--half       { max-width: 100%; }
  .toggle-btn     { padding: 9px 14px; font-size: 0.78rem; }
  .logo-preview-box { width: 50px; height: 50px; }

  .send-btn       { padding: 13px; font-size: 0.86rem; border-radius: 11px; }
  .success-toast  { bottom: 90px; right: 14px; left: 14px; font-size: 0.8rem; padding: 12px 16px; }

  .preview-bar    { padding: 10px 14px; gap: 4px; flex-direction: column; align-items: flex-start; }
  .preview-subject-txt { font-size: 0.72rem; }
}

/* Small phones (â‰¤ 430px) */
@media (max-width: 430px) {
  .bm-title       { font-size: 1.1rem; }
  .bm-form-card   { padding: 16px 13px; border-radius: 14px; }
  .form-section   { gap: 10px; padding: 14px 0; }
  .fi, .fs        { font-size: 0.78rem; padding: 8px 10px; }
  .fl             { font-size: 0.72rem; }
  .toggle-btn     { padding: 8px 12px; font-size: 0.74rem; gap: 5px; }
  .send-btn       { padding: 12px; font-size: 0.82rem; }
}

/* Tiny phones (â‰¤ 360px) */
@media (max-width: 360px) {
  .bm-title       { font-size: 1rem; }
  .bm-form-card   { padding: 14px 11px; }
  .fi, .fs        { font-size: 0.74rem; padding: 7px 9px; }
  .send-btn       { padding: 11px; font-size: 0.78rem; }
  .toggle-btn     { padding: 7px 10px; font-size: 0.7rem; }
}

</style>
