<!-- src/views/ReceiptsTrackingView.vue -->
<template>
  <div class="rt-page">

    <!-- Page Header -->
    <div class="rt-header">
      <div class="rt-icon-box">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <div>
        <h1 class="rt-title">Receipts Tracking</h1>
        <p class="rt-sub">Create a live transaction receipt and share it on <span class="rt-sub-hl">your own link</span>.</p>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="rt-layout">

      <!-- â"€â"€ LEFT: Form â"€â"€ -->
      <div class="rt-form-col">

        <!-- 1. Branding -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <h3 class="sec-title">Branding</h3>
          </div>
          <div class="fg">
            <label class="fl">Company Name</label>
            <input v-model="form.companyName" type="text" placeholder="e.g. Your Company" class="fi" />
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Logo</label>
              <div class="logo-row">
                <div class="logo-preview-box">
                  <img v-if="logoUrl" :src="logoUrl" class="logo-img" alt="logo" />
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <label class="logo-drop" @dragover.prevent @drop.prevent="e => handleDrop(e,'logo')">
                  <input type="file" accept="image/*" hidden ref="logoRef" @change="e => handleFile(e,'logo')" />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                  <span>Drag & drop or <button type="button" class="click-link" @click.prevent="logoRef.click()">click</button></span>
                </label>
              </div>
            </div>
            <div class="fg">
              <label class="fl">Status Icon / Logo</label>
              <div class="logo-row">
                <div class="logo-preview-box">
                  <img v-if="statusIconUrl" :src="statusIconUrl" class="logo-img" alt="icon" />
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <label class="logo-drop" @dragover.prevent @drop.prevent="e => handleDrop(e,'status')">
                  <input type="file" accept="image/*" hidden ref="statusIconRef" @change="e => handleFile(e,'status')" />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                  <span>Drag & drop or <button type="button" class="click-link" @click.prevent="statusIconRef.click()">click</button></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Receipt Link -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <h3 class="sec-title">Receipt Link</h3>
          </div>
          <p class="sec-desc">Pick a name â€" your receipt gets its own clean link on one of our domains. <span class="hl">Leave blank to add one later from Manage.</span></p>
          <p class="fl" style="margin:0">Your receipt link</p>
          <div class="subdomain-box">
            <div class="subdomain-head">
              <div class="subdomain-title-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span class="subdomain-name">Use our subdomain</span>
                <span class="subdomain-free">free</span>
              </div>
              <p class="subdomain-hint">Pick a keyword â€" we set up the link for you. <span class="hl">Nothing</span> to configure at your domain.</p>
            </div>
            <div class="slug-row">
              <input v-model="form.receiptSlug" type="text" placeholder="payment-pending" class="fi slug-input" />
              <select v-model="form.domain" class="fs slug-domain">
                <option>.qst1x.com</option>
                <option>.cryptotrack.app</option>
                <option>.receiptlive.io</option>
              </select>
            </div>
            <p class="slug-note">Lowercase letters, numbers and dashes â€" then <span class="hl">pick a domain</span>. <span class="hl">Locked in once created.</span></p>
          </div>
        </div>

        <!-- 3. Colors -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <h3 class="sec-title">Colors</h3>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Primary / Accent Color</label>
              <div class="color-field">
                <label class="color-swatch-wrap" :style="{ background: form.accentColor }">
                  <input type="color" v-model="form.accentColor" class="color-native" />
                </label>
                <input v-model="form.accentColor" type="text" class="fi color-hex" @blur="validateHex('accentColor')" placeholder="#f05025" />
              </div>
            </div>
            <div class="fg">
              <label class="fl">Background Color</label>
              <div class="color-field">
                <label class="color-swatch-wrap" :style="{ background: form.bgColor }">
                  <input type="color" v-model="form.bgColor" class="color-native" />
                </label>
                <input v-model="form.bgColor" type="text" class="fi color-hex" @blur="validateHex('bgColor')" placeholder="#0c0c0a" />
              </div>
            </div>
          </div>
          <div class="mode-row">
            <span class="fl">Receipt mode</span>
            <div class="mode-pills">
              <button :class="['mode-pill', { 'mode-pill--active': form.receiptMode === 'light' }]" @click="form.receiptMode = 'light'">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                Light
              </button>
              <button :class="['mode-pill', { 'mode-pill--active': form.receiptMode === 'dark' }]" @click="form.receiptMode = 'dark'">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                Dark
              </button>
            </div>
          </div>
        </div>

        <!-- 4. Payment Information -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <h3 class="sec-title">Payment Information</h3>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Recipient Name <span class="req">*</span></label>
              <input v-model="form.recipientName" type="text" placeholder="e.g. Ben" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Issuer</label>
              <input v-model="form.issuer" type="text" placeholder="e.g. your company name" class="fi" />
            </div>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Currency Symbol</label>
              <input v-model="form.currencySymbol" type="text" placeholder="R" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Profit Amount <span class="req">*</span></label>
              <input v-model="form.profitAmount" type="text" placeholder="12,432.00" class="fi" />
            </div>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Processing Fee</label>
              <input v-model="form.processingFee" type="text" placeholder="453.00" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Status Title</label>
              <input v-model="form.statusTitle" type="text" placeholder="Payment Pending" class="fi" />
            </div>
          </div>
          <div class="fg">
            <label class="fl">Headline</label>
            <input v-model="form.headline" type="text" :placeholder="`Your profit of ${form.currencySymbol || 'R'} ${form.profitAmount || '12,432'} is ready for payout.`" class="fi" />
          </div>
          <div class="fg">
            <label class="fl">Fee sentence</label>
            <textarea v-model="form.feeSentence" class="fi-area" rows="3" :placeholder="`A processing fee of ${form.currencySymbol || 'R'} ${form.processingFee || '453'} is required before funds can be released.`"></textarea>
          </div>
        </div>

        <!-- 5. Billing Warning -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon sec-icon--warn" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <h3 class="sec-title">Billing Warning</h3>
          </div>
          <textarea v-model="form.billingWarning" class="fi-area" rows="4" placeholder="Optional: Add a warning about why payment is not successful..."></textarea>
        </div>

        <!-- 6. Status / Progress Steps -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <h3 class="sec-title">Status / Progress Steps</h3>
          </div>
          <div class="list-header">
            <span class="fl">Status Steps</span>
            <button class="add-btn" @click="steps.push({ title: '', subtitle: '' })">+ Add Step</button>
          </div>
          <p class="sec-desc">Add the steps shown on the receipt. First step = completed ✓, middle = in-progress, last = pending.</p>
          <div v-if="steps.length" class="dynamic-list">
            <div v-for="(step, i) in steps" :key="i" class="step-entry">
              <div class="dynamic-row">
                <input v-model="step.title" type="text" class="fi" placeholder="Step title (e.g. Payment initiated)" />
                <button class="remove-btn" @click="steps.splice(i, 1)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <input v-model="step.subtitle" type="text" class="fi" placeholder="Subtitle (e.g. Funds are on their way)" />
            </div>
          </div>
        </div>

        <!-- 7. Action Button -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <h3 class="sec-title">Action Button</h3>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="fl">Button Text</label>
              <input v-model="form.actionBtnText" type="text" placeholder="Pay Release Fee Now" class="fi" />
            </div>
            <div class="fg">
              <label class="fl">Button URL</label>
              <input v-model="form.actionBtnUrl" type="text" placeholder="https://..." class="fi" />
            </div>
          </div>
        </div>

        <!-- 8. Copyable Details -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <h3 class="sec-title">Copyable Details</h3>
          </div>
          <p class="sec-desc">Add any details the recipient should copy â€" a wallet address, a reference, an account number. Each gets its own copy button.</p>
          <div class="list-header">
            <span class="fl">Copyable details</span>
            <button class="add-btn" @click="copyFields.push({ label: '', value: '' })">+ Add field</button>
          </div>
          <p class="sec-desc">Add a <span class="hl">wallet address</span>, a <span class="hl">fee address</span>, a <span class="hl">memo/tag</span> â€" each gets a copy button on the receipt.</p>
          <div v-if="copyFields.length" class="dynamic-list">
            <div v-for="(field, i) in copyFields" :key="i" class="dynamic-row">
              <input v-model="field.label" type="text" class="fi" placeholder="Label (e.g. Wallet)" style="flex:0.6" />
              <input v-model="field.value" type="text" class="fi" placeholder="Value (e.g. 0x...)" />
              <button class="remove-btn" @click="copyFields.splice(i, 1)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 9. Contact & Live Chat -->
        <div class="sec-card">
          <div class="sec-head">
            <svg class="sec-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h3 class="sec-title">Contact & Live Chat</h3>
          </div>
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span class="fl">Live chat on the receipt</span>
              </div>
              <p class="sec-desc">Adds a real chat box. The <span class="hl">recipient messages you</span>; you reply from <span class="hl">"Manage"</span>.</p>
            </div>
            <button :class="['toggle-switch', { 'toggle-switch--on': form.liveChatEnabled }]" @click="form.liveChatEnabled = !form.liveChatEnabled" />
          </div>
          <div class="toggle-row">
            <div class="toggle-info">
              <span class="fl">External chat link instead</span>
              <p class="sec-desc">Only used when the in-app chat above is off.</p>
            </div>
            <button :class="['toggle-switch', { 'toggle-switch--on': form.externalChatEnabled }]" @click="form.externalChatEnabled = !form.externalChatEnabled" />
          </div>
          <div class="list-header" style="margin-top:4px">
            <span class="fl">Contact / Social Links</span>
            <button class="add-btn" @click="socialLinks.push({ label: '', url: '' })">+ Add Link</button>
          </div>
          <p class="sec-desc">Add <span class="hl">WhatsApp</span>, <span class="hl">Telegram</span>, a website â€" any label and link.</p>
          <div v-if="socialLinks.length" class="dynamic-list">
            <div v-for="(link, i) in socialLinks" :key="i" class="dynamic-row">
              <input v-model="link.label" type="text" class="fi" placeholder="Label (e.g. WhatsApp)" style="flex:0.6" />
              <input v-model="link.url" type="text" class="fi" placeholder="URL or number" />
              <button class="remove-btn" @click="socialLinks.splice(i, 1)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Error -->
        <p v-if="formError" class="form-error">{{ formError }}</p>

        <!-- Generate Button -->
        <button :class="['generate-btn', { 'generate-btn--loading': generating }]"
          :style="{ background: form.accentColor }" @click="generate">
          <template v-if="!generating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            Generate Receipt
          </template>
          <template v-else>
            <span class="spinner" /> Generating...
          </template>
        </button>

        <!-- My receipts -->
        <div class="my-receipts-card">
          <h3 class="my-receipts-title">My transaction receipts</h3>
          <div v-if="generatedReceipts.length === 0" class="my-receipts-empty">
            <p>Your generated receipts will appear here.</p>
          </div>
          <div v-else class="receipts-list">
            <div v-for="r in generatedReceipts" :key="r.id" class="receipt-item">
              <div class="receipt-item__dot" :style="{ background: r.accent }" />
              <div class="receipt-item__info">
                <span class="receipt-item__name">{{ r.company }}</span>
                <span class="receipt-item__meta">{{ r.slug }}{{ r.domain }} &middot; {{ r.time }}</span>
              </div>
              <span class="receipt-item__badge">Live</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── RIGHT: Live Preview ── -->
      <div class="rt-preview-col">
        <p class="preview-label">LIVE PREVIEW</p>
        <div class="receipt-preview-card" :style="{ background: form.bgColor || '#0c0c0a' }">

          <!-- Status icon circle -->
          <div class="rp-circle" :style="{ borderColor: form.accentColor || '#f05025' }">
            <img v-if="statusIconUrl" :src="statusIconUrl" class="rp-circle-img" />
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none"
              :stroke="form.accentColor || '#f05025'" stroke-width="2.5" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <!-- Company name -->
          <p class="rp-company" :style="{ color: form.accentColor || '#f05025' }">
            {{ (form.companyName || 'YOUR COMPANY').toUpperCase() }}
          </p>

          <!-- Big status title -->
          <h2 class="rp-big-title" :style="{ color: form.accentColor || '#f05025' }">
            {{ form.statusTitle || 'Payment Pending' }}
          </h2>

          <!-- Headline -->
          <p class="rp-headline">
            {{ form.headline || `Your profit of ${form.currencySymbol || 'R'} ${form.profitAmount || '12,432'} is ready for payout.` }}
          </p>

          <!-- Fee sentence -->
          <p v-if="form.processingFee || form.feeSentence" class="rp-fee" :style="{ color: form.accentColor || '#f05025' }">
            {{ form.feeSentence || `A processing fee of ${form.currencySymbol || 'R'} ${form.processingFee} is required before funds can be released.` }}
          </p>

          <!-- Tabs -->
          <div class="rp-tabs">
            <button :class="['rp-tab', { 'rp-tab--active': previewTab === 'status' }]"
              :style="previewTab === 'status' ? { background: form.accentColor || '#f05025', color: '#000' } : {}"
              @click="previewTab = 'status'">Status</button>
            <button :class="['rp-tab', { 'rp-tab--active': previewTab === 'details' }]"
              :style="previewTab === 'details' ? { background: form.accentColor || '#f05025', color: '#000' } : {}"
              @click="previewTab = 'details'">Details</button>
          </div>

          <!-- ── Status tab ── -->
          <template v-if="previewTab === 'status'">

            <!-- Steps timeline -->
            <div v-if="steps.length" class="rp-steps">
              <div v-for="(step, i) in steps" :key="i" class="rp-step">
                <div class="rp-step__track">
                  <div class="rp-step__icon"
                    :style="i === 0 ? { borderColor: form.accentColor || '#f05025' }
                          : i < steps.length - 1 ? { borderColor: form.accentColor || '#f05025' }
                          : { borderColor: 'rgba(255,255,255,0.25)' }">
                    <svg v-if="i === 0" width="10" height="10" viewBox="0 0 24 24" fill="none"
                      :stroke="form.accentColor || '#f05025'" stroke-width="3.5" stroke-linecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <div v-else-if="i < steps.length - 1" class="rp-step__dot"
                      :style="{ background: form.accentColor || '#f05025' }" />
                  </div>
                  <div v-if="i < steps.length - 1" class="rp-step__line"
                    :style="{ background: i === 0 ? (form.accentColor || '#f05025') : 'rgba(255,255,255,0.12)' }" />
                </div>
                <div class="rp-step__body">
                  <span class="rp-step__title">{{ step.title }}</span>
                  <span v-if="step.subtitle" class="rp-step__sub" :style="{ color: form.accentColor || '#f05025' }">{{ step.subtitle }}</span>
                </div>
              </div>
            </div>

            <!-- Copyable fields -->
            <div v-for="(field, i) in copyFields.filter(f => f.label || f.value)" :key="i" class="rp-copy-box">
              <span class="rp-copy-label">{{ (field.label || 'REFERENCE NO.').toUpperCase() }}</span>
              <div class="rp-copy-row">
                <span class="rp-copy-value">{{ field.value || '—' }}</span>
                <button class="rp-copy-btn" @click.prevent>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>

          </template>

          <!-- ── Details tab ── -->
          <template v-else>
            <div class="rp-details-list">
              <div class="rp-details-row">
                <span class="rp-details-key" :style="{ color: form.accentColor || '#f05025' }">Recipient</span>
                <span class="rp-details-val">{{ form.recipientName || 'Ben' }}</span>
              </div>
              <div class="rp-details-row">
                <span class="rp-details-key" :style="{ color: form.accentColor || '#f05025' }">Profit Amount</span>
                <span class="rp-details-val" :style="{ color: form.accentColor || '#f05025' }">{{ form.currencySymbol || 'R' }} {{ form.profitAmount || '12,432.00' }}</span>
              </div>
              <div v-if="form.processingFee" class="rp-details-row">
                <span class="rp-details-key" :style="{ color: form.accentColor || '#f05025' }">Processing Fee</span>
                <span class="rp-details-val rp-fee-val">{{ form.currencySymbol || 'R' }} {{ form.processingFee }}</span>
              </div>
              <div class="rp-details-row">
                <span class="rp-details-key" :style="{ color: form.accentColor || '#f05025' }">Issuer</span>
                <span class="rp-details-val">{{ form.issuer || form.companyName || 'Your Company' }}</span>
              </div>
              <div class="rp-details-row">
                <span class="rp-details-key" :style="{ color: form.accentColor || '#f05025' }">Date &amp; time</span>
                <span class="rp-details-val">{{ receiptDate }}</span>
              </div>
            </div>
            <div v-if="form.billingWarning" class="rp-warning-box">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              <p>{{ form.billingWarning }}</p>
            </div>
            <!-- Copyable fields also on details tab -->
            <div v-for="(field, i) in copyFields.filter(f => f.label || f.value)" :key="'d' + i" class="rp-copy-box">
              <span class="rp-copy-label">{{ (field.label || 'REFERENCE NO.').toUpperCase() }}</span>
              <div class="rp-copy-row">
                <span class="rp-copy-value">{{ field.value || '—' }}</span>
                <button class="rp-copy-btn" @click.prevent>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </template>

          <!-- Action button -->
          <button v-if="form.actionBtnText" class="rp-action-btn"
            :style="{ background: form.accentColor || '#f05025' }">
            {{ form.actionBtnText }}
          </button>

          <!-- Live chat -->
          <button v-if="form.liveChatEnabled" class="rp-chat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Live chat
          </button>

          <!-- Footer -->
          <p class="rp-footer">{{ form.companyName || 'Your Company' }} Receipt &middot; Secure &amp; Verified</p>
        </div>
      </div>

    </div>

    <!-- Success Toast -->
    <Transition name="toast-pop">
      <div v-if="showSuccess" class="success-toast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        Receipt generated successfully!
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const receiptDate = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
         ' • ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
})

const logoRef        = ref(null)
const statusIconRef  = ref(null)
const logoUrl        = ref(null)
const statusIconUrl  = ref(null)
const generating     = ref(false)
const showSuccess    = ref(false)
const formError      = ref('')
const previewTab     = ref('status')
const steps = ref([
  { title: 'Payment initiated',   subtitle: 'Funds are on their way' },
  { title: 'Processing',          subtitle: 'Awaiting release fee clearance' },
  { title: 'Released to account', subtitle: 'Funds transferred' },
])
const copyFields     = ref([{ label: 'Reference No.', value: 'TXN-20260524-9821' }])
const socialLinks    = ref([])
const generatedReceipts = ref([])

const form = reactive({
  companyName:        '',
  receiptSlug:        '',
  domain:             '.qst1x.com',
  accentColor:        '#f05025',
  bgColor:            '#0c0c0a',
  receiptMode:        'dark',
  recipientName:      '',
  issuer:             '',
  currencySymbol:     'R',
  profitAmount:       '',
  processingFee:      '',
  statusTitle:        'Payment Pending',
  headline:           '',
  feeSentence:        '',
  billingWarning:     '',
  actionBtnText:      'Pay Release Fee Now',
  actionBtnUrl:       '',
  liveChatEnabled:    true,
  externalChatEnabled:false,
})

function handleFile(e, type) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    if (type === 'logo') logoUrl.value = ev.target.result
    else statusIconUrl.value = ev.target.result
  }
  reader.readAsDataURL(file)
}
function handleDrop(e, type) {
  const file = e.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = ev => {
    if (type === 'logo') logoUrl.value = ev.target.result
    else statusIconUrl.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function validateHex(field) {
  if (!/^#[0-9a-fA-F]{6}$/.test(form[field])) {
    form[field] = field === 'accentColor' ? '#f05025' : '#0c0c0a'
  }
}

function generate() {
  formError.value = ''
  if (!form.companyName.trim())  { formError.value = 'Company name is required.'; return }
  if (!form.recipientName.trim()){ formError.value = 'Recipient name is required.'; return }
  if (!form.profitAmount.trim()) { formError.value = 'Profit amount is required.'; return }

  generating.value = true
  setTimeout(() => {
    generating.value = false
    showSuccess.value = true
    generatedReceipts.value.unshift({
      id:      Date.now(),
      company: form.companyName,
      slug:    form.receiptSlug || 'receipt-' + Date.now().toString(36),
      domain:  form.domain,
      accent:  form.accentColor,
      time:    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })
    setTimeout(() => { showSuccess.value = false }, 3500)
  }, 1800)
}
</script>

<style scoped>
.rt-page { display: flex; flex-direction: column; gap: 24px; }

/* Header */
.rt-header { display: flex; align-items: center; gap: 14px; }
.rt-icon-box {
  width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.15); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.3);
  display: flex; align-items: center; justify-content: center;
}
.rt-title { font-size: 1.45rem; font-weight: 800; color: var(--t1); margin: 0; letter-spacing: -0.025em; }
.rt-sub   { font-size: 0.82rem; color: var(--t1); font-weight: 600; margin: 0; }
.rt-sub-hl { color: var(--accent); font-weight: 500; }

/* Layout */
.rt-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

/* Form column */
.rt-form-col { display: flex; flex-direction: column; gap: 16px; }

/* Section card */
.sec-card {
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sec-head { display: flex; align-items: center; gap: 8px; }
.sec-icon { color: var(--accent); flex-shrink: 0; }
.sec-icon--warn { color: var(--accent); }
.sec-title { font-size: 0.9rem; font-weight: 700; color: var(--t1); margin: 0; }
.sec-desc { font-size: 0.78rem; color: var(--t2); line-height: 1.6; margin: 0; }
.sec-desc .hl { color: var(--accent); font-weight: 500; }

/* Fields */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.fg { display: flex; flex-direction: column; gap: 6px; }
.fl { font-size: 0.78rem; font-weight: 600; color: var(--t1); }
.req { color: #ef4444; }

.fi {
  width: 100%; padding: 9px 12px; border-radius: 9px;
  border: 1px solid var(--border-soft); background: var(--glass-hover); color: var(--t1);
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem;
  transition: border-color 0.18s; box-sizing: border-box;
}
.fi:focus { outline: none; border-color: var(--accent); }
.fi::placeholder { color: var(--t3); }

.fi-area {
  width: 100%; padding: 9px 12px; border-radius: 9px;
  border: 1px solid var(--border-soft); background: var(--glass-hover); color: var(--t1);
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem;
  resize: none; min-height: 80px;
  transition: border-color 0.18s; box-sizing: border-box;
}
.fi-area:focus { outline: none; border-color: var(--accent); }
.fi-area::placeholder { color: var(--t3); }

/* Logo upload */
.logo-row { display: flex; gap: 8px; align-items: stretch; }
.logo-preview-box {
  width: 60px; height: 60px; border-radius: 10px; flex-shrink: 0;
  border: 1px solid var(--border-soft); background: var(--glass-hover);
  display: flex; align-items: center; justify-content: center; color: var(--t3); overflow: hidden;
}
.logo-img { width: 100%; height: 100%; object-fit: contain; }
.logo-drop {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  border: 1.5px dashed var(--border); border-radius: 10px; padding: 10px;
  font-size: 0.75rem; color: var(--t2); cursor: pointer; transition: border-color 0.18s;
}
.logo-drop:hover { border-color: var(--accent); }
.click-link { background: none; border: none; padding: 0; color: var(--accent); font-size: 0.75rem; font-weight: 600; cursor: pointer; font-family: inherit; }

/* Subdomain box */
.subdomain-box {
  border: 1.5px solid var(--accent); border-radius: 12px; padding: 14px 16px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.04); display: flex; flex-direction: column; gap: 10px;
}
.subdomain-head { display: flex; flex-direction: column; gap: 6px; }
.subdomain-title-row { display: flex; align-items: center; gap: 8px; }
.subdomain-name { font-size: 0.85rem; font-weight: 700; color: var(--t1); }
.subdomain-free {
  font-size: 0.65rem; font-weight: 700; color: var(--accent);
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25);
  padding: 2px 8px; border-radius: 999px;
}
.subdomain-hint { font-size: 0.75rem; color: var(--t2); margin: 0; }
.subdomain-hint .hl { color: var(--accent); font-weight: 500; }
.slug-row { display: flex; gap: 8px; }
.slug-input  { flex: 1; }
.slug-domain { width: 140px; padding: 9px 10px; border-radius: 9px; border: 1px solid var(--border-soft); background: var(--glass-hover); color: var(--t1); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; cursor: pointer; flex-shrink: 0; }
.slug-domain:focus { outline: none; border-color: var(--accent); }
.slug-note { font-size: 0.72rem; color: var(--t2); margin: 0; }
.slug-note .hl { color: var(--accent); font-weight: 500; }

/* Color picker */
.color-field { display: flex; gap: 8px; align-items: center; }
.color-swatch-wrap {
  width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
  border: 1px solid var(--border-soft); cursor: pointer; overflow: hidden; position: relative;
}
.color-native {
  position: absolute; inset: 0; opacity: 0; cursor: pointer;
  width: 100%; height: 100%; border: none; padding: 0;
}
.color-hex { flex: 1; }

/* Receipt mode */
.mode-row { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
.mode-pills { display: flex; gap: 6px; }
.mode-pill {
  display: flex; align-items: center; gap: 6px; padding: 7px 16px;
  border-radius: 999px; border: 1px solid var(--border-soft); background: var(--glass-hover);
  color: var(--t2); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; font-weight: 600;
  cursor: pointer; transition: all 0.18s;
}
.mode-pill--active { background: var(--accent); border-color: var(--accent); color: #fff; }

/* Toggle switch */
.toggle-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.toggle-info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.toggle-label-row { display: flex; align-items: center; gap: 6px; }
.toggle-switch {
  width: 44px; height: 24px; border-radius: 12px; border: none;
  background: #e2e8f0; position: relative; cursor: pointer; flex-shrink: 0;
  transition: background 0.2s; margin-top: 2px;
}
.toggle-switch::after {
  content: ''; position: absolute; width: 18px; height: 18px;
  border-radius: 50%; background: #fff; top: 3px; left: 3px;
  transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-switch--on { background: var(--accent); }
.toggle-switch--on::after { transform: translateX(20px); }

/* Dynamic list */
.list-header { display: flex; align-items: center; justify-content: space-between; }
.dynamic-list { display: flex; flex-direction: column; gap: 8px; }
.dynamic-row { display: flex; gap: 8px; align-items: center; }
.remove-btn {
  width: 30px; height: 30px; flex-shrink: 0; border-radius: 8px;
  border: 1px solid var(--border-soft); background: var(--glass-hover); color: var(--t3);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.remove-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; }
.add-btn {
  font-size: 0.75rem; font-weight: 700; color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1);
  border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25); border-radius: 8px; padding: 5px 12px;
  cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.18s;
  white-space: nowrap;
}
.add-btn:hover { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.18); }

/* Form error */
.form-error {
  font-size: 0.78rem; color: #ef4444; background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 10px 14px; margin: 0;
}

/* Generate button */
.generate-btn {
  width: 100%; padding: 15px; border-radius: 12px; border: none; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.92rem; font-weight: 700;
  cursor: pointer; transition: filter 0.2s, transform 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.generate-btn:hover:not(.generate-btn--loading) { filter: brightness(1.1); transform: translateY(-1px); }
.generate-btn--loading { opacity: 0.75; cursor: not-allowed; }

/* Spinner */
.spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* My receipts */
.my-receipts-card {
  border: 1px solid var(--border-soft); border-radius: 14px;
  padding: 18px 22px; display: flex; flex-direction: column; gap: 12px;
}
.my-receipts-title { font-size: 0.9rem; font-weight: 700; color: var(--t1); margin: 0; }
.my-receipts-empty p { font-size: 0.8rem; color: var(--t3); margin: 0; }
.my-receipts-empty .hl { color: var(--accent); }
.receipts-list { display: flex; flex-direction: column; gap: 8px; }
.receipt-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: var(--glass-hover); border: 1px solid var(--border-soft); }
.receipt-item__dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.receipt-item__info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.receipt-item__name { font-size: 0.82rem; font-weight: 600; color: var(--t1); }
.receipt-item__meta { font-size: 0.7rem; color: var(--t3); }
.receipt-item__badge { font-size: 0.65rem; font-weight: 700; color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25); padding: 2px 8px; border-radius: 999px; white-space: nowrap; }

/* â"€â"€ RIGHT: Preview column â"€â"€ */
.rt-preview-col {
  position: sticky; top: 24px;
  display: flex; flex-direction: column; gap: 10px;
}
.preview-label {
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--t3); margin: 0;
}

/* Receipt preview card */
.receipt-preview-card {
  border-radius: 20px; padding: 32px 24px 24px;
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; min-height: 280px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}
.rp-circle {
  width: 72px; height: 72px; border-radius: 50%;
  border: 2px solid var(--accent); display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}
.rp-circle-img { width: 100%; height: 100%; object-fit: contain; }
.rp-company { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; margin: 0; }

/* Big status title */
.rp-big-title {
  font-size: 1.6rem; font-weight: 800; text-align: center; margin: 0;
  letter-spacing: -0.02em; line-height: 1.2;
}

/* Headline & fee */
.rp-headline { font-size: 0.76rem; color: rgba(255,255,255,0.82); text-align: center; margin: 0; line-height: 1.55; }
.rp-fee      { font-size: 0.72rem; text-align: center; margin: 0; line-height: 1.5; opacity: 0.9; }

/* Tabs */
.rp-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.07); border-radius: 999px; padding: 4px; width: 100%; }
.rp-tab {
  flex: 1; padding: 8px 0; border-radius: 999px; border: none;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; font-weight: 700;
  cursor: pointer; color: rgba(255,255,255,0.4); background: transparent; transition: all 0.18s;
}
.rp-tab--active { color: #000 !important; }

/* Steps timeline */
.rp-steps { display: flex; flex-direction: column; gap: 0; width: 100%; }
.rp-step  { display: flex; gap: 12px; align-items: flex-start; }
.rp-step__track { display: flex; flex-direction: column; align-items: center; width: 24px; flex-shrink: 0; }
.rp-step__icon  {
  width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: transparent;
}
.rp-step__dot { width: 8px; height: 8px; border-radius: 50%; }
.rp-step__line { width: 2px; flex: 1; min-height: 20px; margin: 3px 0; }
.rp-step__body {
  display: flex; flex-direction: column; gap: 2px; padding-bottom: 16px; flex: 1;
}
.rp-step:last-child .rp-step__body { padding-bottom: 0; }
.rp-step__title { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.9); }
.rp-step__sub   { font-size: 0.7rem; }

/* Copyable fields */
.rp-copy-box {
  width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px;
}
.rp-copy-label { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); }
.rp-copy-row   { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.rp-copy-value { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.85); flex: 1; }
.rp-copy-btn   {
  width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6);
  display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
  transition: background 0.18s;
}
.rp-copy-btn:hover { background: rgba(255,255,255,0.15); }

/* Details tab */
.rp-details-list { display: flex; flex-direction: column; gap: 0; width: 100%; }
.rp-details-row  { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
.rp-details-row:last-child { border-bottom: none; }
.rp-details-key  { font-size: 0.75rem; font-weight: 500; }
.rp-details-val  { font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.92); }
.rp-fee-val      { color: #f87171; }
.rp-warning-box  {
  background: rgba(255,180,0,0.08); border: 1px solid rgba(255,180,0,0.2);
  border-radius: 9px; padding: 10px 12px; display: flex; align-items: flex-start; gap: 8px;
  color: rgba(255,220,80,0.9); font-size: 0.72rem; line-height: 1.5; width: 100%;
}
.rp-warning-box p { margin: 0; }
.rp-warning-box svg { flex-shrink: 0; margin-top: 1px; }

/* Action button */
.rp-action-btn {
  width: 100%; padding: 13px; border-radius: 999px; border: none;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; font-weight: 700;
  color: #000; cursor: default; letter-spacing: 0.01em;
}

/* Live chat */
.rp-chat {
  display: flex; align-items: center; gap: 7px;
  padding: 11px 0; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18);
  background: transparent; color: rgba(255,255,255,0.7);
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 600; cursor: default;
  width: 100%; justify-content: center;
}
.rp-footer { font-size: 0.66rem; color: rgba(255,255,255,0.28); margin: 0; text-align: center; }

/* Step entry in form */
.step-entry { display: flex; flex-direction: column; gap: 6px; }

/* Success Toast */
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

/* Tablet landscape (901px â€" 1100px) */
@media (max-width: 1100px) {
  .rt-layout { grid-template-columns: 1fr 300px; gap: 20px; }
}

/* Tablet portrait (601px â€" 900px): stack preview above form */
@media (max-width: 900px) {
  .rt-page        { gap: 20px; }
  .rt-layout      { grid-template-columns: 1fr; gap: 18px; }
  .rt-preview-col { position: static; order: -1; }
  .receipt-preview-card { min-height: 220px; padding: 28px 20px 20px; }
  .two-col        { grid-template-columns: 1fr 1fr; }
}

/* Mobile (â‰¤ 600px) */
@media (max-width: 600px) {
  .rt-page        { gap: 16px; }
  .rt-layout      { gap: 14px; }
  .rt-header      { gap: 10px; }
  .rt-icon-box    { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; }
  .rt-title       { font-size: 1.2rem; }
  .rt-sub         { font-size: 0.76rem; }

  .rt-form-col    { gap: 12px; }
  .sec-card       { padding: 16px 14px; gap: 12px; border-radius: 12px; }
  .sec-title      { font-size: 0.84rem; }
  .two-col        { grid-template-columns: 1fr; }
  .slug-row       { flex-direction: column; }
  .slug-domain    { width: 100%; }
  .logo-row       { gap: 6px; }
  .logo-preview-box { width: 50px; height: 50px; }

  .receipt-preview-card { padding: 24px 16px 18px; border-radius: 16px; gap: 12px; }
  .rp-circle      { width: 56px; height: 56px; }
  .rp-company     { font-size: 0.72rem; }
  .rp-tab         { padding: 6px 14px; font-size: 0.72rem; }
  .rp-chat        { padding: 8px 20px; font-size: 0.74rem; }
  .rp-footer      { font-size: 0.62rem; }

  .generate-btn   { padding: 13px; font-size: 0.86rem; border-radius: 11px; }
  .success-toast  { bottom: 90px; right: 14px; left: 14px; font-size: 0.8rem; padding: 12px 16px; }
}

/* Small phones (â‰¤ 430px) */
@media (max-width: 430px) {
  .rt-title       { font-size: 1.1rem; }
  .sec-card       { padding: 14px 12px; gap: 10px; }
  .sec-title      { font-size: 0.8rem; }
  .fi, .fi-area, .fs, .slug-domain { font-size: 0.78rem; padding: 8px 10px; }
  .fl             { font-size: 0.72rem; }
  .receipt-preview-card { padding: 20px 14px 16px; }
  .rp-circle      { width: 50px; height: 50px; }
  .rp-tab         { padding: 5px 12px; font-size: 0.68rem; }
  .generate-btn   { padding: 12px; font-size: 0.82rem; }
}

/* Tiny phones (â‰¤ 360px) */
@media (max-width: 360px) {
  .rt-title       { font-size: 1rem; }
  .sec-card       { padding: 12px 10px; }
  .fi, .fi-area   { font-size: 0.74rem; padding: 7px 9px; }
  .receipt-preview-card { padding: 18px 12px 14px; gap: 10px; }
  .rp-circle      { width: 44px; height: 44px; }
  .generate-btn   { padding: 11px; font-size: 0.78rem; }
}
</style>
