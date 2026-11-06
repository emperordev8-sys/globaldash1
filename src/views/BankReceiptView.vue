<!-- src/views/BankReceiptView.vue -->
<template>
  <div class="br-page">

    <!-- Page Header -->
    <div class="br-header">
      <button class="br-back" @click="router.back()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <h1 class="br-title">Bank Receipt</h1>
      <p class="br-sub">Fill in the details and generate a bank-app-styled receipt â€" download it as a <span class="br-hl">PDF</span> or an <span class="br-hl">image</span>.</p>
    </div>

    <!-- Two-column layout -->
    <div class="br-layout">

      <!-- â"€â"€ LEFT: Form â"€â"€ -->
      <div class="br-form-col">
        <div class="br-card">

          <!-- Bank + Transaction -->
          <div class="br-row">
            <div class="br-fg">
              <label class="br-label">Bank</label>
              <div class="br-select-wrap">
                <select v-model="form.bank" class="br-select">
                  <option v-for="b in banks" :key="b.name" :value="b.name">{{ b.name }}</option>
                </select>
                <svg class="br-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div class="br-fg">
              <label class="br-label">Transaction</label>
              <div class="br-select-wrap">
                <select v-model="form.txType" class="br-select">
                  <option v-for="t in txTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
                <svg class="br-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <!-- Amount -->
          <div class="br-fg">
            <label class="br-label">Amount (USD)</label>
            <input v-model="form.amount" type="number" min="0" step="0.01" placeholder="0.00" class="br-input" />
          </div>

          <!-- Date + Time -->
          <div class="br-row">
            <div class="br-fg">
              <label class="br-label">Date</label>
              <input v-model="form.date" type="date" class="br-input" />
            </div>
            <div class="br-fg">
              <label class="br-label">Time</label>
              <input v-model="form.time" type="time" class="br-input" />
            </div>
          </div>

          <!-- From name + From account -->
          <div class="br-row">
            <div class="br-fg">
              <label class="br-label">From name</label>
              <input v-model="form.fromName" type="text" placeholder="John A. Smith" class="br-input" />
            </div>
            <div class="br-fg">
              <label class="br-label">From account</label>
              <input v-model="form.fromAccount" type="text" placeholder="****4821" class="br-input" />
            </div>
          </div>

          <!-- To name + To account -->
          <div class="br-row">
            <div class="br-fg">
              <label class="br-label">To name</label>
              <input v-model="form.toName" type="text" placeholder="Sarah Johnson" class="br-input" />
            </div>
            <div class="br-fg">
              <label class="br-label">To account</label>
              <input v-model="form.toAccount" type="text" placeholder="****9032" class="br-input" />
            </div>
          </div>

          <!-- Memo -->
          <div class="br-fg">
            <label class="br-label">Memo / Description</label>
            <input v-model="form.memo" type="text" placeholder="Rent payment" class="br-input" />
          </div>

          <!-- Method + Status -->
          <div class="br-row">
            <div class="br-fg">
              <label class="br-label">Method</label>
              <input v-model="form.method" type="text" placeholder="Zelle" class="br-input" />
            </div>
            <div class="br-fg">
              <label class="br-label">Status</label>
              <div class="br-select-wrap">
                <select v-model="form.status" class="br-select">
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Processing">Processing</option>
                </select>
                <svg class="br-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <!-- Reference # -->
          <div class="br-fg br-ref-row">
            <label class="br-label">Reference #</label>
            <div class="br-ref-wrap">
              <input v-model="form.reference" type="text" placeholder="FGIOEDORF3" class="br-input" />
              <button class="br-gen-ref" @click="genRef" title="Generate random">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
              </button>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="br-actions">
            <button class="br-btn-pdf" @click="downloadPDF" :disabled="downloading">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {{ downloading === 'pdf' ? 'Generatingâ€¦' : 'Download PDF' }}
            </button>
            <button class="br-btn-img" @click="saveImage" :disabled="downloading">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              {{ downloading === 'img' ? 'Savingâ€¦' : 'Save image' }}
            </button>
          </div>

        </div>
      </div>

      <!-- â"€â"€ RIGHT: Receipt Preview â"€â"€ -->
      <div class="br-preview-col">
        <div class="br-preview-label">Live Preview</div>
        <div class="br-phone-wrap">
          <div ref="receiptEl" class="br-receipt">

            <!-- Status bar -->
            <div class="br-status-bar">
              <span class="br-sb-time">{{ clockTime }}</span>
              <div class="br-sb-icons">
                <svg width="16" height="10" viewBox="0 0 24 14" fill="currentColor">
                  <rect x="0" y="8" width="3" height="6" rx="0.5"/>
                  <rect x="5" y="5" width="3" height="9" rx="0.5"/>
                  <rect x="10" y="2" width="3" height="12" rx="0.5"/>
                  <rect x="15" y="0" width="3" height="14" rx="0.5"/>
                  <circle cx="21" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span class="br-sb-network">5G</span>
                <svg width="22" height="11" viewBox="0 0 26 13">
                  <rect x="0" y="1" width="22" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="23" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.5"/>
                  <rect x="1.5" y="2.5" width="17" height="8" rx="1" fill="currentColor"/>
                </svg>
              </div>
            </div>

            <!-- Bank header -->
            <div class="br-bank-head" :style="{ background: activeBank.color }">
              <div class="br-bank-left">
                <span class="br-bank-sym">{{ activeBank.symbol }}</span>
                <span class="br-bank-name">{{ form.bank.toUpperCase() }}</span>
              </div>
              <div class="br-bank-x">âœ•</div>
            </div>

            <!-- Body -->
            <div class="br-receipt-body">

              <!-- Success/icon -->
              <div class="br-check-wrap" :class="statusClass">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round">
                  <polyline v-if="form.status !== 'Failed'" points="20 6 9 17 4 12"/>
                  <line v-else x1="18" y1="6" x2="6" y2="18"/>
                  <line v-if="form.status === 'Failed'" x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>

              <div class="br-rx-title">{{ txTitle }}</div>
              <div class="br-rx-date">{{ formattedDateTime }}</div>

              <div class="br-tx-badge">{{ form.txType.replace(/-/g,' ').toUpperCase() }}</div>

              <div class="br-rx-amount" :class="amountClass">{{ formattedAmount }}</div>

              <!-- Detail rows -->
              <div class="br-details">
                <div class="br-dr">
                  <span class="br-dl">To</span>
                  <div class="br-dv">
                    <strong>{{ form.toName || 'â€"' }}</strong>
                    <small>{{ form.toAccount || '' }}</small>
                  </div>
                </div>
                <div class="br-dr">
                  <span class="br-dl">From</span>
                  <div class="br-dv">
                    <strong>{{ form.fromName || 'â€"' }}</strong>
                    <small>{{ form.fromAccount || '' }}</small>
                  </div>
                </div>
                <div class="br-dr">
                  <span class="br-dl">Date</span>
                  <div class="br-dv">
                    <strong>{{ formattedDateOnly }}</strong>
                    <small>{{ displayTime }}</small>
                  </div>
                </div>
                <div v-if="form.method" class="br-dr">
                  <span class="br-dl">Delivery method</span>
                  <strong class="br-dv-single">{{ form.method }}</strong>
                </div>
                <div v-if="form.memo" class="br-dr">
                  <span class="br-dl">Memo</span>
                  <strong class="br-dv-single">{{ form.memo }}</strong>
                </div>
                <div v-if="form.reference" class="br-dr">
                  <span class="br-dl">Confirmation #</span>
                  <strong class="br-dv-single">{{ form.reference }}</strong>
                </div>
              </div>

              <!-- Bank footer -->
              <div class="br-rx-footer">
                <div>{{ activeBank.legal }}</div>
                <div>{{ activeBank.sub }}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const router = useRouter()
const receiptEl = ref(null)
const downloading = ref(null)

/* â"€â"€ Clock â"€â"€ */
const clockTime = ref(formatClock())
function formatClock() {
  const d = new Date()
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0')
}
setInterval(() => { clockTime.value = formatClock() }, 10000)

/* â"€â"€ Banks â"€â"€ */
const banks = [
  { name: 'Chase',          color: '#1565C0', symbol: '+',  legal: 'JPMorgan Chase Bank, N.A. Member FDIC',         sub: 'Equal Housing Lender Â· Â© 2026 JPMorgan Chase & Co.' },
  { name: 'Bank of America',color: '#E31837', symbol: 'â¬¡',  legal: 'Bank of America, N.A. Member FDIC',              sub: 'Equal Housing Lender Â· Â© 2026 Bank of America Corp.' },
  { name: 'Wells Fargo',    color: '#CC0000', symbol: 'âœ¦',  legal: 'Wells Fargo Bank, N.A. Member FDIC',             sub: 'Equal Housing Lender Â· Â© 2026 Wells Fargo & Company' },
  { name: 'Citibank',       color: '#003B8E', symbol: 'â—Ž',  legal: 'Citibank, N.A. Member FDIC',                     sub: 'Equal Housing Lender Â· Â© 2026 Citigroup Inc.' },
  { name: 'Capital One',    color: '#C8102E', symbol: 'â—†',  legal: 'Capital One, N.A. Member FDIC',                  sub: 'Equal Housing Lender Â· Â© 2026 Capital One Financial Corp.' },
  { name: 'TD Bank',        color: '#34A853', symbol: 'â—‰',  legal: 'TD Bank, N.A. Member FDIC',                      sub: 'Equal Housing Lender Â· Â© 2026 TD Bank Group.' },
  { name: 'US Bank',        color: '#002B5C', symbol: 'â˜…',  legal: 'U.S. Bank National Association, Member FDIC',    sub: 'Equal Housing Lender Â· Â© 2026 U.S. Bancorp' },
  { name: 'PNC Bank',       color: '#EF3E42', symbol: 'â– ',  legal: 'PNC Bank, National Association, Member FDIC',    sub: 'Equal Housing Lender Â· Â© 2026 The PNC Financial Services Group' },
  { name: 'Ally Bank',      color: '#7C4DFF', symbol: 'A',  legal: 'Ally Bank, Member FDIC',                         sub: 'Equal Housing Lender Â· Â© 2026 Ally Financial Inc.' },
  { name: 'Chime',          color: '#00B894', symbol: 'âœ¦',  legal: 'Banking services provided by The Bancorp Bank',  sub: 'Member FDIC Â· Â© 2026 Chime Financial Inc.' },
  { name: 'Cash App',       color: '#00D64F', symbol: '$',  legal: 'Cash App is a product of Block, Inc.',           sub: 'Investing in stocks via Cash App Investing LLC. Â© 2026 Block Inc.' },
  { name: 'Zelle',          color: '#6C1CD3', symbol: 'Z',  legal: 'ZelleÂ® and the ZelleÂ® related marks are wholly owned by Early Warning Services, LLC', sub: 'Â© 2026 Early Warning Services, LLC' },
]

/* â"€â"€ Transaction types â"€â"€ */
const txTypes = [
  { value: 'transfer-sent',     label: 'Transfer sent' },
  { value: 'transfer-received', label: 'Transfer received' },
  { value: 'payment',           label: 'Payment' },
  { value: 'withdrawal',        label: 'Withdrawal' },
  { value: 'deposit',           label: 'Deposit' },
  { value: 'refund',            label: 'Refund' },
  { value: 'purchase',          label: 'Purchase' },
]

/* â"€â"€ Form state â"€â"€ */
const today = new Date()
const padded = v => String(v).padStart(2,'0')
const defaultDate = `${today.getFullYear()}-${padded(today.getMonth()+1)}-${padded(today.getDate())}`
const defaultTime = `${padded(today.getHours())}:${padded(today.getMinutes())}`

const form = reactive({
  bank:        'Chase',
  txType:      'transfer-sent',
  amount:      '1250.00',
  date:        defaultDate,
  time:        defaultTime,
  fromName:    'John A. Smith',
  fromAccount: '****4821',
  toName:      'Sarah Johnson',
  toAccount:   '****9032',
  memo:        'Rent payment',
  method:      'Zelle',
  status:      'Completed',
  reference:   'FGIOEDORF3',
})

/* â"€â"€ Computed â"€â"€ */
const activeBank = computed(() => banks.find(b => b.name === form.bank) || banks[0])

const txTitle = computed(() => {
  const map = {
    'transfer-sent':     'Payment sent',
    'transfer-received': 'Payment received',
    'payment':           'Payment sent',
    'withdrawal':        'Withdrawal',
    'deposit':           'Deposit received',
    'refund':            'Refund received',
    'purchase':          'Purchase made',
  }
  return map[form.txType] || 'Transaction'
})

const formattedDateTime = computed(() => {
  if (!form.date) return ''
  const d = new Date(form.date + 'T' + (form.time || '00:00'))
  return d.toLocaleString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' }) + ' at ' + (form.time || '')
})

const formattedDateOnly = computed(() => {
  if (!form.date) return 'â€"'
  const d = new Date(form.date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })
})

const displayTime = computed(() => form.time || '')

const isDebit = computed(() => ['transfer-sent','payment','withdrawal','purchase'].includes(form.txType))

const formattedAmount = computed(() => {
  const n = parseFloat(form.amount) || 0
  const str = n.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })
  return (isDebit.value ? '-' : '+') + '$' + str
})

const amountClass = computed(() => isDebit.value ? 'br-rx-amount--debit' : 'br-rx-amount--credit')

const statusClass = computed(() => {
  if (form.status === 'Failed')     return 'br-check--fail'
  if (form.status === 'Pending')    return 'br-check--pending'
  if (form.status === 'Processing') return 'br-check--processing'
  return 'br-check--success'
})

/* â"€â"€ Generate reference â"€â"€ */
function genRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  form.reference = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/* â"€â"€ Download helpers â"€â"€ */
async function captureReceipt() {
  return html2canvas(receiptEl.value, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  })
}

async function saveImage() {
  downloading.value = 'img'
  try {
    const canvas = await captureReceipt()
    const link = document.createElement('a')
    link.download = `bank-receipt-${form.reference || 'receipt'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally { downloading.value = null }
}

async function downloadPDF() {
  downloading.value = 'pdf'
  try {
    const canvas = await captureReceipt()
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation:'portrait', unit:'px', format:[canvas.width/2, canvas.height/2] })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width/2, canvas.height/2)
    pdf.save(`bank-receipt-${form.reference || 'receipt'}.pdf`)
  } finally { downloading.value = null }
}
</script>

<style scoped>
.br-page {
  padding: 0 0 60px;
  max-width: 1100px;
  margin: 0 auto;
}

/* â"€â"€ Header â"€â"€ */
.br-header { margin-top: 14px; }

.br-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  color: var(--t2);
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 18px;
  transition: background 0.18s, color 0.18s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.br-back:hover { background: var(--bg); color: var(--t1); }

.br-title {
  font-size: 1.55rem;
  font-weight: 800;
  color: var(--t1);
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}
.br-sub  { font-size: 0.85rem; color: var(--t1); font-weight: 600; margin: 0 0 24px; }
.br-hl   { color: var(--accent); font-weight: 600; }

/* â"€â"€ Layout â"€â"€ */
.br-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
}

/* â"€â"€ Form Card â"€â"€ */
.br-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.br-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.br-fg { display: flex; flex-direction: column; gap: 6px; }

.br-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--t3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.br-input {
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  padding: 10px 13px;
  color: var(--t1);
  font-size: 0.86rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.br-input:focus { border-color: var(--accent); background: var(--bg); }
.br-input::placeholder { color: var(--t4); }
.br-input[type="date"]::-webkit-calendar-picker-indicator,
.br-input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }

/* Select */
.br-select-wrap { position: relative; }
.br-select {
  appearance: none;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  padding: 10px 34px 10px 13px;
  color: var(--t1);
  font-size: 0.86rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  outline: none;
  cursor: pointer;
  width: 100%;
  transition: border-color 0.2s;
}
.br-select:focus { border-color: var(--accent); }
.br-select-chevron {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--t3);
}

/* Reference row */
.br-ref-wrap { display: flex; gap: 8px; }
.br-ref-wrap .br-input { flex: 1; }
.br-gen-ref {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  color: var(--t2);
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  align-self: flex-end;
  margin-bottom: 1px;
}
.br-gen-ref:hover { background: var(--bg); color: var(--accent); }

/* Action buttons */
.br-actions { display: flex; gap: 12px; margin-top: 4px; }
.br-btn-pdf, .br-btn-img {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  justify-content: center;
  padding: 11px 0;
  border-radius: 12px;
  font-size: 0.84rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  border: none;
}
.br-btn-pdf:hover:not(:disabled), .br-btn-img:hover:not(:disabled) { transform: translateY(-1px); }
.br-btn-pdf:disabled, .br-btn-img:disabled { opacity: 0.55; cursor: wait; }
.br-btn-pdf {
  background: linear-gradient(135deg, var(--accent-press) 0%, var(--accent) 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.30);
}
.br-btn-img {
  background: var(--bg);
  border: 1px solid var(--border) !important;
  color: var(--t1);
}

/* â"€â"€ Preview â"€â"€ */
.br-preview-col {
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.br-preview-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--t4);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.br-phone-wrap {
  width: 100%;
  max-width: 360px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06);
}

/* â"€â"€ Receipt â"€â"€ */
.br-receipt {
  background: #fff;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1a1a1a;
}

/* Status bar */
.br-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 6px;
  background: #111;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
}
.br-sb-icons { display: flex; align-items: center; gap: 5px; }
.br-sb-network { font-size: 0.65rem; font-weight: 800; }

/* Bank header */
.br-bank-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  color: #fff;
}
.br-bank-left  { display: flex; align-items: center; gap: 10px; }
.br-bank-sym   { font-size: 1.1rem; font-weight: 900; }
.br-bank-name  { font-size: 0.9rem; font-weight: 800; letter-spacing: 0.06em; }
.br-bank-x     { font-size: 1rem; opacity: 0.75; cursor: default; }

/* Receipt body */
.br-receipt-body {
  padding: 22px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Check circle */
.br-check-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  transition: background 0.3s;
}
.br-check--success    { background: var(--accent); }
.br-check--fail       { background: #ef4444; }
.br-check--pending    { background: #f59e0b; }
.br-check--processing { background: #3b82f6; }

.br-rx-title { font-size: 1.05rem; font-weight: 800; color: #111; margin-bottom: 4px; }
.br-rx-date  { font-size: 0.72rem; color: #777; margin-bottom: 12px; text-align: center; }

.br-tx-badge {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #1565C0;
  margin-bottom: 6px;
}

.br-rx-amount {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  margin-bottom: 18px;
}
.br-rx-amount--debit  { color: #111; }
.br-rx-amount--credit { color: #16a34a; }

/* Detail rows */
.br-details {
  width: 100%;
  border-top: 1px solid #eee;
}
.br-dr {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f3f3f3;
  gap: 12px;
}
.br-dl {
  font-size: 0.73rem;
  color: #1565C0;
  font-weight: 500;
  white-space: nowrap;
  min-width: 90px;
  flex-shrink: 0;
}
.br-dv {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}
.br-dv strong   { font-size: 0.8rem; font-weight: 700; color: #111; }
.br-dv small    { font-size: 0.68rem; color: #888; }
.br-dv-single   { font-size: 0.8rem; font-weight: 700; color: #111; text-align: right; }

/* Footer */
.br-rx-footer {
  margin-top: 16px;
  text-align: center;
  font-size: 0.58rem;
  color: #aaa;
  line-height: 1.6;
}


/* â"€â"€ Responsive â"€â"€ */
@media (max-width: 900px) {
  .br-layout      { grid-template-columns: 1fr; }
  .br-preview-col { position: static; order: -1; }
  .br-phone-wrap  { max-width: 360px; margin: 0 auto; }
}
@media (max-width: 600px) {
  .br-header      { margin-top: 10px; }
  .br-title       { font-size: 1.3rem; }
  .br-sub         { font-size: 0.8rem; margin-bottom: 18px; }
  .br-card        { padding: 18px 14px; gap: 14px; border-radius: 14px; }
  .br-row         { grid-template-columns: 1fr; gap: 14px; }
  .br-actions     { flex-direction: column; }
  .br-phone-wrap  { max-width: 100%; border-radius: 16px; }
  .br-rx-amount   { font-size: 1.7rem; }
}
@media (max-width: 430px) {
  .br-header      { margin-top: 8px; }
  .br-title       { font-size: 1.15rem; }
  .br-card        { padding: 14px 12px; gap: 12px; }
  .br-input, .br-select { padding: 9px 11px; font-size: 0.82rem; }
  .br-rx-amount   { font-size: 1.5rem; }
  .br-rx-title    { font-size: 0.95rem; }
}
@media (max-width: 360px) {
  .br-title       { font-size: 1.05rem; }
  .br-card        { padding: 12px 10px; gap: 10px; border-radius: 12px; }
  .br-input, .br-select { padding: 8px 10px; font-size: 0.8rem; }
  .br-actions     { gap: 8px; }
  .br-btn-pdf, .br-btn-img { padding: 10px 0; font-size: 0.8rem; }
}
</style>
