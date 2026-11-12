<!-- src/views/StoreReceiptView.vue -->
<template>
  <div class="sr-page">

    <!-- Header -->
    <div class="sr-head">
      <button class="sr-back" @click="router.push('/tools')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <h1 class="sr-title">Store Receipt</h1>
      <p class="sr-sub">Fill in the details, then download the receipt as an image or PDF. Each one is kept in your history for 7 days.</p>
    </div>

    <div class="sr-layout">
      <!-- ── FORM ── -->
      <div class="sr-form-col">

        <div class="sr-card">
          <div class="sr-card__title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 21V13h6v8"/></svg> Store information</div>
          <div class="sr-row">
            <div class="sr-fg"><label class="sr-label">Store name <span class="sr-req">*</span></label><input v-model="store.name" class="sr-input" placeholder="Best Buy" /></div>
            <div class="sr-fg"><label class="sr-label">Phone</label><input v-model="store.phone" class="sr-input" placeholder="(212) 933-9540" /></div>
          </div>
          <div class="sr-fg"><label class="sr-label">Address</label><input v-model="store.address" class="sr-input" placeholder="1280 Lexington Ave, New York, NY 10028" /></div>
          <div class="sr-fg">
            <label class="sr-label">Logo <span class="sr-opt">(optional)</span></label>
            <input type="file" accept="image/*" class="sr-file" @change="onLogo" />
          </div>
        </div>

        <div class="sr-card">
          <div class="sr-card__title">Receipt details</div>
          <div class="sr-row sr-row--4">
            <div class="sr-fg"><label class="sr-label">Receipt #</label><input v-model="receipt.number" class="sr-input" placeholder="BB-90112" /></div>
            <div class="sr-fg"><label class="sr-label">Date</label><input v-model="receipt.date" class="sr-input" placeholder="01/20/2025" /></div>
            <div class="sr-fg"><label class="sr-label">Time</label><input v-model="receipt.time" class="sr-input" placeholder="16:45" /></div>
            <div class="sr-fg"><label class="sr-label">Currency</label>
              <select v-model="receipt.currency" class="sr-input">
                <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.code }} ({{ c.symbol }})</option>
              </select>
            </div>
          </div>
        </div>

        <div class="sr-card">
          <div class="sr-card__head">
            <div class="sr-card__title">Items</div>
            <button class="sr-additem" @click="addItem"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add item</button>
          </div>
          <div v-for="(it, i) in items" :key="i" class="sr-item">
            <div class="sr-fg sr-fg--desc"><label v-if="i===0" class="sr-label">Description</label><input v-model="it.desc" class="sr-input" placeholder="Item name" /></div>
            <div class="sr-fg sr-fg--qty"><label v-if="i===0" class="sr-label">Qty</label><input v-model.number="it.qty" type="number" min="1" class="sr-input" /></div>
            <div class="sr-fg sr-fg--price"><label v-if="i===0" class="sr-label">Price</label><input v-model.number="it.price" type="number" min="0" step="any" class="sr-input" /></div>
            <button class="sr-del" :style="{ marginTop: i===0 ? '22px' : '0' }" @click="items.splice(i,1)" title="Remove"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
          </div>
        </div>

        <div class="sr-card">
          <div class="sr-card__title">Payment &amp; other</div>
          <div class="sr-row sr-row--4">
            <div class="sr-fg"><label class="sr-label">Tax rate (%)</label><input v-model.number="pay.taxRate" type="number" min="0" step="any" class="sr-input" /></div>
            <div class="sr-fg"><label class="sr-label">Payment method</label><input v-model="pay.method" class="sr-input" placeholder="Credit Card" /></div>
            <div class="sr-fg"><label class="sr-label">Card last 4</label><input v-model="pay.cardLast4" class="sr-input" placeholder="5511" maxlength="4" /></div>
            <div class="sr-fg"><label class="sr-label">Cashier</label><input v-model="pay.cashier" class="sr-input" placeholder="Alex" /></div>
          </div>
          <div class="sr-fg"><label class="sr-label">QR link <span class="sr-opt">(URL the QR opens when scanned)</span></label><input v-model="pay.qrLink" class="sr-input" placeholder="https://" /></div>
          <label class="sr-check"><input type="checkbox" v-model="pay.showBarcode" /> <span>Show barcode on the receipt</span></label>
          <div class="sr-fg"><label class="sr-label">Notes</label><textarea v-model="pay.notes" rows="2" class="sr-input sr-textarea" placeholder="Thank you for shopping with us!"></textarea></div>
        </div>

        <div class="sr-actions">
          <button class="sr-save" @click="saveHistory"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save to history</button>
          <button class="sr-dl" @click="saveImage" :disabled="busy"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> {{ busy==='img' ? '…' : 'Image' }}</button>
          <button class="sr-dl" @click="downloadPDF" :disabled="busy"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> {{ busy==='pdf' ? '…' : 'PDF' }}</button>
        </div>

        <div class="sr-recent">
          <div class="sr-recent__title"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Recent receipts <span class="sr-recent__note">— kept 7 days, then removed automatically</span></div>
          <p v-if="!history.length" class="sr-recent__empty">No saved receipts yet. Fill the form and hit "Save to history".</p>
          <div v-else class="sr-recent__list">
            <div v-for="(h, i) in history" :key="i" class="sr-recent__row">
              <div><div class="sr-recent__store">{{ h.store }}</div><div class="sr-recent__meta">{{ h.number }} · {{ h.date }}</div></div>
              <span class="sr-recent__total">{{ h.total }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── PREVIEW ── -->
      <div class="sr-preview-col">
        <div class="sr-preview-label">LIVE PREVIEW</div>
        <div class="sr-paper-wrap">
          <div ref="paperEl" class="sr-paper">
            <img v-if="store.logo" :src="store.logo" class="sr-paper__logo" alt="logo" />
            <div class="sr-paper__store">{{ store.name || 'Store name' }}</div>
            <div v-if="store.address" class="sr-paper__line">{{ store.address }}</div>
            <div v-if="store.phone" class="sr-paper__line">{{ store.phone }}</div>

            <div class="sr-dash"></div>
            <div class="sr-kv"><span>Receipt #:</span><span>{{ receipt.number || '—' }}</span></div>
            <div class="sr-kv"><span>Date:</span><span>{{ receipt.date || '—' }}</span></div>
            <div class="sr-kv"><span>Time:</span><span>{{ receipt.time || '—' }}</span></div>
            <div v-if="pay.cashier" class="sr-kv"><span>Cashier:</span><span>{{ pay.cashier }}</span></div>

            <div class="sr-dash"></div>
            <div class="sr-items-head"><span class="c-item">ITEM</span><span class="c-qty">QTY</span><span class="c-price">PRICE</span><span class="c-total">TOTAL</span></div>
            <div v-for="(it, i) in items" :key="i" class="sr-items-row">
              <span class="c-item">{{ it.desc || 'Item' }}</span>
              <span class="c-qty">{{ it.qty }}</span>
              <span class="c-price">{{ money(it.price) }}</span>
              <span class="c-total">{{ money(it.qty * it.price) }}</span>
            </div>

            <div class="sr-dash"></div>
            <div class="sr-kv"><span>Subtotal:</span><span>{{ money(subtotal) }}</span></div>
            <div class="sr-kv"><span>Tax ({{ pay.taxRate }}%):</span><span>{{ money(tax) }}</span></div>
            <div class="sr-kv sr-kv--total"><span>TOTAL:</span><span>{{ money(total) }}</span></div>

            <div class="sr-dash"></div>
            <div v-if="pay.method" class="sr-kv"><span>Payment:</span><span>{{ pay.method }}</span></div>
            <div v-if="pay.cardLast4" class="sr-kv"><span>Card:</span><span>****{{ pay.cardLast4 }}</span></div>

            <div class="sr-paper__thanks">{{ pay.notes || 'Thank you for shopping with us!' }}</div>

            <div v-if="pay.showBarcode" class="sr-barcode">
              <div class="sr-barcode__bars" v-html="barcode"></div>
              <div class="sr-barcode__num">{{ receipt.number || '—' }}</div>
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
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { success, error } = useToast()
const paperEl = ref(null)
const busy = ref(null)

const currencies = [
  { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' }, { code: 'GBP', symbol: '£' },
  { code: 'NGN', symbol: '₦' }, { code: 'CAD', symbol: 'C$' }, { code: 'ZAR', symbol: 'R' },
]

const store = reactive({ name: 'Best Buy', phone: '(212) 933-9540', address: '1280 Lexington Ave, New York, NY 10028', logo: '' })
const receipt = reactive({ number: 'BB-90112', date: '01/20/2025', time: '16:45', currency: 'USD' })
const items = ref([
  { desc: 'Sony WH-1000XM5 Headphones', qty: 1, price: 348 },
  { desc: 'USB-C Cable 6ft', qty: 2, price: 12.99 },
])
const pay = reactive({ taxRate: 8.875, method: 'Credit Card', cardLast4: '5511', cashier: 'Alex', qrLink: 'https://', showBarcode: true, notes: 'Thank you for shopping with us!' })
const history = ref([])

const symbol = computed(() => currencies.find(c => c.code === receipt.currency)?.symbol || '$')
const money = (n) => symbol.value + (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const subtotal = computed(() => items.value.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0))
const tax = computed(() => subtotal.value * (Number(pay.taxRate) || 0) / 100)
const total = computed(() => subtotal.value + tax.value)

const barcode = computed(() => {
  const seed = receipt.number || 'RECEIPT'
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const bars = []; let x = 0
  for (let i = 0; i < 48; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    const w = 1 + (h % 4)
    if (i % 2 === 0) bars.push(`<rect x="${x}" y="0" width="${w}" height="46"/>`)
    x += w
  }
  return `<svg viewBox="0 0 ${x} 46" width="200" height="46" preserveAspectRatio="none" fill="#111">${bars.join('')}</svg>`
})

function addItem() { items.value.push({ desc: '', qty: 1, price: 0 }) }
function onLogo(e) {
  const f = e.target.files?.[0]; if (!f) return
  const r = new FileReader(); r.onload = () => { store.logo = r.result }; r.readAsDataURL(f)
}

function saveHistory() {
  if (!store.name.trim()) { error('Store name required', 'Enter the store name.'); return }
  history.value.unshift({ store: store.name, number: receipt.number, date: receipt.date, total: money(total.value) })
  success('Saved to history', `${store.name} receipt saved — kept for 7 days.`)
}

async function capture() {
  return html2canvas(paperEl.value, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false })
}
async function saveImage() {
  busy.value = 'img'
  try {
    const canvas = await capture()
    const a = document.createElement('a'); a.download = `store-receipt-${receipt.number || 'receipt'}.png`; a.href = canvas.toDataURL('image/png'); a.click()
  } finally { busy.value = null }
}
async function downloadPDF() {
  busy.value = 'pdf'
  try {
    const canvas = await capture()
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 2, canvas.height / 2] })
    pdf.addImage(img, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
    pdf.save(`store-receipt-${receipt.number || 'receipt'}.pdf`)
  } finally { busy.value = null }
}
</script>

<style scoped>
.sr-page { padding: 0 0 50px; max-width: 1100px; margin: 0 auto; }

.sr-head { margin-top: 14px; }
.sr-back { display: inline-flex; align-items: center; gap: 6px; background: var(--bg); border: 1px solid var(--border); color: var(--t2); padding: 7px 14px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer; margin-bottom: 16px; font-family: inherit; }
.sr-back:hover { color: var(--t1); border-color: var(--accent-border); }
.sr-title { font-size: 1.55rem; font-weight: 800; color: var(--t1); margin: 0 0 6px; letter-spacing: -0.02em; }
.sr-sub { font-size: 0.84rem; color: var(--t2); font-weight: 500; margin: 0 0 22px; }

.sr-layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; align-items: start; }
.sr-form-col { display: flex; flex-direction: column; gap: 16px; }

.sr-card { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.sr-card__head { display: flex; align-items: center; justify-content: space-between; }
.sr-card__title { display: flex; align-items: center; gap: 8px; font-size: 0.92rem; font-weight: 800; color: #16a34a; }
.sr-additem { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: 9px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.78rem; font-weight: 700; }
.sr-additem:hover { color: var(--accent); border-color: var(--accent-border); }

.sr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.sr-row--4 { grid-template-columns: repeat(4, 1fr); }
.sr-fg { display: flex; flex-direction: column; gap: 6px; }
.sr-label { font-size: 0.74rem; font-weight: 700; color: var(--t3); }
.sr-req { color: #ef4444; }
.sr-opt { font-weight: 400; color: var(--t4); }
.sr-input { width: 100%; height: 42px; padding: 0 12px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.85rem; outline: none; transition: border-color 0.16s ease; box-sizing: border-box; }
.sr-input:focus { border-color: var(--accent); }
select.sr-input { cursor: pointer; }
.sr-textarea { height: auto; padding: 10px 12px; resize: vertical; line-height: 1.5; }
.sr-file { font-size: 0.8rem; color: var(--t2); }
.sr-file::file-selector-button { margin-right: 10px; padding: 7px 12px; border-radius: 8px; border: none; background: var(--accent-dim); color: var(--accent); font-family: inherit; font-weight: 700; font-size: 0.78rem; cursor: pointer; }

.sr-item { display: grid; grid-template-columns: 1fr 70px 90px 34px; gap: 10px; align-items: start; }
.sr-fg--qty, .sr-fg--price { min-width: 0; }
.sr-del { width: 34px; height: 42px; border-radius: 9px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t3); display: flex; align-items: center; justify-content: center; }
.sr-del:hover { color: #ef4444; border-color: rgba(239,68,68,0.4); }

.sr-check { display: flex; align-items: center; gap: 9px; font-size: 0.84rem; font-weight: 600; color: var(--t1); cursor: pointer; }
.sr-check input { width: 17px; height: 17px; accent-color: #16a34a; cursor: pointer; }

.sr-actions { display: flex; gap: 10px; }
.sr-save { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 46px; border-radius: 12px; cursor: pointer; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 55%, #0f7a37 100%); color: #fff; font-family: inherit; font-size: 0.86rem; font-weight: 700; transition: transform 0.15s ease; }
.sr-save:hover { transform: translateY(-2px); }
.sr-dl { display: inline-flex; align-items: center; gap: 7px; height: 46px; padding: 0 18px; border-radius: 12px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.84rem; font-weight: 700; }
.sr-dl:hover:not(:disabled) { border-color: var(--accent-border); color: var(--accent); }
.sr-dl:disabled { opacity: 0.6; cursor: wait; }

.sr-recent { background: var(--bg); border: 1px solid var(--t4); border-radius: 16px; padding: 16px 18px; }
.sr-recent__title { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 800; color: var(--t1); }
.sr-recent__note { font-weight: 500; color: var(--t3); font-size: 0.74rem; }
.sr-recent__empty { margin: 12px 0 0; font-size: 0.82rem; color: var(--t3); }
.sr-recent__list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.sr-recent__row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border: 1px solid var(--border-soft); border-radius: 10px; }
.sr-recent__store { font-size: 0.84rem; font-weight: 700; color: var(--t1); }
.sr-recent__meta { font-size: 0.72rem; color: var(--t3); margin-top: 2px; }
.sr-recent__total { font-size: 0.9rem; font-weight: 800; color: #16a34a; }

/* Preview */
.sr-preview-col { position: sticky; top: 16px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.sr-preview-label { font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em; color: var(--t3); }
.sr-paper-wrap { width: 100%; max-width: 360px; }
.sr-paper { background: #fff; color: #111; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px 22px; font-family: 'Courier New', ui-monospace, monospace; font-size: 0.78rem; line-height: 1.55; }
.sr-paper__logo { display: block; max-width: 70px; max-height: 50px; object-fit: contain; margin: 0 auto 10px; }
.sr-paper__store { text-align: center; font-size: 1.1rem; font-weight: 800; }
.sr-paper__line { text-align: center; color: #555; font-size: 0.72rem; }
.sr-dash { border-top: 1px dashed #bbb; margin: 12px 0; }
.sr-kv { display: flex; justify-content: space-between; gap: 10px; }
.sr-kv span:last-child { font-weight: 700; text-align: right; }
.sr-kv--total { font-size: 0.95rem; font-weight: 800; }
.sr-kv--total span:last-child { font-weight: 800; }
.sr-items-head { display: grid; grid-template-columns: 1fr 34px 60px 64px; gap: 4px; color: #888; font-size: 0.66rem; letter-spacing: 0.04em; margin-bottom: 6px; }
.sr-items-row { display: grid; grid-template-columns: 1fr 34px 60px 64px; gap: 4px; }
.sr-items-head .c-qty, .sr-items-head .c-price, .sr-items-head .c-total,
.sr-items-row .c-qty, .sr-items-row .c-price, .sr-items-row .c-total { text-align: right; }
.sr-items-row .c-item { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sr-items-row .c-total { font-weight: 700; }
.sr-paper__thanks { text-align: center; margin-top: 14px; color: #555; font-size: 0.72rem; }
.sr-barcode { margin-top: 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.sr-barcode__num { font-size: 0.68rem; letter-spacing: 0.1em; color: #111; }

@media (max-width: 900px) {
  .sr-layout { grid-template-columns: 1fr; }
  .sr-preview-col { position: static; order: -1; }
  .sr-paper-wrap { margin: 0 auto; }
}
@media (max-width: 560px) {
  .sr-row, .sr-row--4 { grid-template-columns: 1fr 1fr; }
  .sr-actions { flex-wrap: wrap; }
}
</style>
