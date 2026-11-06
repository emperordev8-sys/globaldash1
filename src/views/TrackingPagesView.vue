<template>
  <div class="tp-page">

    <!-- ── Page header ── -->
    <div class="tp-header">
      <div>
        <h1 class="tp-title">Tracking sites</h1>
        <p class="tp-sub">Each site is a branded tracking page you can share.</p>
      </div>
      <span class="tp-count">{{ sites.filter(s => s.status === 'active').length }}/∞ active</span>
    </div>

    <!-- ── Site cards grid ── -->
    <div v-if="sites.length" class="tp-grid">
      <div v-for="site in sites" :key="site.id" class="tp-card">

        <!-- Gradient banner -->
        <div class="tp-card__banner" :style="{ background: site.gradient }"></div>

        <!-- Card body -->
        <div class="tp-card__body">
          <div class="tp-card__top">
            <div>
              <div class="tp-card__name">{{ site.name }}</div>
              <div class="tp-card__domain">{{ site.domain }}</div>
            </div>
            <span class="tp-card__badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
              EXPRESS
            </span>
          </div>

          <span class="tp-status" :class="site.status === 'active' ? 'tp-status--active' : 'tp-status--off'">
            {{ site.status }}
          </span>

          <!-- Link buttons -->
          <div class="tp-links">
            <button class="tp-link-btn" @click="copyUrl(site.adminUrl, 'Admin URL')" title="Copy admin URL">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Admin URL
            </button>
            <button class="tp-link-btn" @click="copyUrl(site.domain, 'Public link')" title="Copy public link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Public link
            </button>
            <a :href="'https://' + site.domain" target="_blank" class="tp-link-btn tp-link-btn--visit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Visit
            </a>
          </div>

          <!-- Action row -->
          <div class="tp-actions">
            <button class="tp-action-main" @click="openEdit(site)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Admin dashboard
            </button>
            <div class="tp-action-icons">
              <!-- Domain settings -->
              <button class="tp-icon-btn" title="Domain settings" @click="openDomain(site)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </button>
              <!-- Admin login -->
              <button class="tp-icon-btn" title="Admin login" @click="adminLogin(site)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </button>
              <!-- Toggle active -->
              <button class="tp-icon-btn" :title="site.status === 'active' ? 'Deactivate' : 'Activate'"
                @click="toggleStatus(site)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M18.36 6.64A9 9 0 1 1 5.64 5.64"/>
                  <line x1="12" y1="2" x2="12" y2="12"/>
                </svg>
              </button>
              <!-- Delete -->
              <button class="tp-icon-btn tp-icon-btn--danger" title="Delete" @click="deleteSite(site)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Empty state ── -->
    <div v-else class="tp-empty">
      <div class="tp-empty__icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <path d="M16 8h4l3 3v5h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>
      <p class="tp-empty__title">No tracking sites yet</p>
      <p class="tp-empty__desc">Create your first branded tracking page — takes seconds.</p>
    </div>

    <!-- ── Create site button ── -->
    <div class="tp-fab">
      <button class="tp-fab__btn" @click="showCreate = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Create site
      </button>
    </div>

    <!-- ══════════════════════════════════════
         CREATE MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showCreate" class="modal-backdrop" @click.self="closeCreate">
        <div class="modal">
          <div class="modal-head">
            <h2 class="modal-head__title">Create tracking site</h2>
            <button class="modal-close modal-close--square" @click="closeCreate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">

            <!-- ① Sub-description -->
            <div class="mf-section" style="padding-bottom:0; border-bottom:none;">
              <p class="mf-hint" style="font-size:0.8rem; color:#6b7280; line-height:1.55;">
                Brand a new tracking portal. You'll get a public link to share, plus a private admin URL gated by the auth code you set.
              </p>
            </div>

            <!-- ② Live preview banner -->
            <div class="mf-section" style="border-bottom:none; padding-top:12px; padding-bottom:0;">
              <div class="tpl-preview" :style="{ background: selectedTemplate.gradient }">
                <div class="tpl-preview__brand">
                  <span class="tpl-preview__your">Your</span>
                  <span class="tpl-preview__brand-name">Brand</span>
                </div>
                <div class="tpl-preview__center">
                  <p class="tpl-preview__tag">SHIP · TRACK · DELIVER</p>
                  <p class="tpl-preview__headline">SHIP FAST. DELIVER NOW.</p>
                </div>
              </div>
            </div>

            <!-- ③ Site name -->
            <div class="mf-section">
              <label class="mf-label">Site name <span style="color:#ef4444;">*</span></label>
              <input v-model="cForm.name" type="text" class="mf-input" placeholder="Acme Logistics" />
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
                    placeholder="Choose an access code (min 4 characters)" />
                </div>
                <div v-else style="display:flex; flex-direction:column; gap:8px;">
                  <input v-model="cForm.adminEmail" type="email" class="mf-input" placeholder="Admin email" />
                  <input v-model="cForm.adminPassword" type="password" class="mf-input" placeholder="Admin password" />
                </div>
              </div>
            </div>

            <!-- ⑤ Choose a template -->
            <div class="mf-section">
              <label class="mf-label">Choose a template</label>
              <p class="mf-hint" style="margin-bottom:12px;">Pick a starting style. Colours and copy can be tweaked later inside the per-site designer.</p>
              <div class="tpl-grid">
                <div v-for="t in templates" :key="t.value"
                  class="tpl-card"
                  :class="{ 'tpl-card--active': cForm.template === t.value }"
                  @click="cForm.template = t.value">
                  <div class="tpl-card__banner" :style="{ background: t.gradient }"></div>
                  <div class="tpl-card__body">
                    <div class="tpl-card__row">
                      <span class="tpl-card__name">{{ t.label }}</span>
                      <span class="tpl-card__badge">{{ t.badge }}</span>
                    </div>
                    <p class="tpl-card__desc">{{ t.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ⑥ Where should customers reach this? -->
            <div class="mf-section">
              <label class="mf-label">Where should customers reach this?</label>
              <div class="reach-options">

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
                    <input v-model="cForm.subdomain" type="text" class="subdomain-input" placeholder="acme" />
                    <select v-model="cForm.suffix" class="subdomain-select">
                      <option>.qst1x.com</option>
                      <option>.globalgle.com</option>
                    </select>
                  </div>
                  <p v-if="cForm.reachType === 'subdomain'" class="reach-hint">
                    Lowercase letters, numbers and dashes -- then pick a domain. Locked in once created.
                  </p>
                </div>

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
                    <input v-model="cForm.ownDomain" type="text" class="mf-input" placeholder="track.yourdomain.com" />
                  </div>
                </div>

              </div>
            </div>

            <!-- ⑦ Live chat & contact channels -->
            <div class="mf-section">
              <button type="button" class="chat-toggle-hdr" @click="cForm.chatOpen = !cForm.chatOpen">
                <span class="chat-toggle-hdr__arrow">{{ cForm.chatOpen ? '▼' : '▶' }}</span>
                <span class="chat-toggle-hdr__label">Live chat &amp; contact channels</span>
              </button>

              <div v-if="cForm.chatOpen" style="margin-top:12px;">
                <!-- Mode tabs -->
                <div class="chat-tabs">
                  <button type="button" class="chat-tab"
                    :class="{ 'chat-tab--active': cForm.chatMode === 'contact' }"
                    @click="cForm.chatMode = 'contact'">Contact channels</button>
                  <button type="button" class="chat-tab"
                    :class="{ 'chat-tab--active': cForm.chatMode === 'widget' }"
                    @click="cForm.chatMode = 'widget'">Website Widget</button>
                  <button type="button" class="chat-tab"
                    :class="{ 'chat-tab--active': cForm.chatMode === 'off' }"
                    @click="cForm.chatMode = 'off'">Off</button>
                </div>

                <!-- Contact channels inputs -->
                <div v-if="cForm.chatMode === 'contact'" class="chat-fields">
                  <div class="chat-field">
                    <label class="mf-label">WhatsApp</label>
                    <input v-model="cForm.whatsapp" type="text" class="mf-input" placeholder="+1 555 555 5555" />
                  </div>
                  <div class="chat-field">
                    <label class="mf-label">Telegram</label>
                    <input v-model="cForm.telegram" type="text" class="mf-input" placeholder="@yourhandle" />
                  </div>
                  <div class="chat-field">
                    <label class="mf-label">Phone</label>
                    <input v-model="cForm.phone" type="tel" class="mf-input" placeholder="+1 555 555 5555" />
                  </div>
                  <div class="chat-field">
                    <label class="mf-label">Email</label>
                    <input v-model="cForm.contactEmail" type="email" class="mf-input" placeholder="hi@example.com" />
                  </div>
                </div>

                <!-- Website widget embed -->
                <div v-if="cForm.chatMode === 'widget'" style="margin-top:10px;">
                  <label class="mf-label">Widget embed code</label>
                  <textarea v-model="cForm.widgetCode" class="mf-input"
                    rows="4" placeholder="Paste your chat widget script here (Smartsupp, Tawk, Crisp, Tidio…)"
                    style="resize:vertical;"></textarea>
                </div>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button class="mf-btn-cancel" @click="closeCreate">Cancel</button>
            <button class="mf-btn-create" @click="createSite">Create site</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════
         DOMAIN SETTINGS MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showDomain" class="modal-backdrop" @click.self="closeDomain">
        <div class="modal modal--sm">
          <div class="modal-head">
            <div>
              <h2 class="modal-head__title">Domain settings</h2>
              <p class="al-sub">Set the address for "{{ domainSite?.name }}".</p>
            </div>
            <button class="modal-close modal-close--square" @click="closeDomain">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="mf-section">
              <div class="domain-box">
                <div class="domain-box__inner-label">Domain</div>
                <p class="domain-box__question">How should people reach this site?</p>
                <select v-model="dForm.reachType" class="mf-input" style="margin-top:6px;">
                  <option value="subdomain">Use our subdomain -- free</option>
                  <option value="own">Use my own domain</option>
                </select>
                <div class="address-box" style="margin-top:14px;">
                  <span class="address-box__label">YOUR ADDRESS</span>
                  <div class="address-row">
                    <span v-if="!editingDomain" class="address-value">{{ dForm.domain }}</span>
                    <input v-else v-model="dForm.domain" type="text" class="address-edit-input" />
                    <span class="address-live">live</span>
                    <button class="address-edit-btn" type="button"
                      @click="editingDomain ? saveDomain() : (editingDomain = true)">
                      {{ editingDomain ? 'Save' : 'Edit' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="justify-content:flex-end;">
            <button class="mf-btn-cancel" @click="closeDomain">Close</button>
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
            <h2 class="modal-head__title">Edit tracking site</h2>
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
              <label class="mf-label">Banner colour</label>
              <div class="gradient-grid">
                <div v-for="g in gradients" :key="g.value"
                  class="gradient-swatch"
                  :class="{ 'gradient-swatch--active': eForm.gradient === g.value }"
                  :style="{ background: g.value }"
                  @click="eForm.gradient = g.value">
                </div>
              </div>
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
            <div>
              <h2 class="modal-head__title">Admin login</h2>
              <p class="al-sub">How admins sign in to "{{ adminLoginSite?.name }}".</p>
            </div>
            <button class="modal-close" @click="closeAdminLogin">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">

            <!-- Tabs -->
            <div class="mf-section" style="border-bottom:none; padding-bottom:0;">
              <div class="al-tabs">
                <button type="button" class="al-tab"
                  :class="{ 'al-tab--active': adminTab === 'auth-code' }"
                  @click="adminTab = 'auth-code'">Auth code</button>
                <button type="button" class="al-tab"
                  :class="{ 'al-tab--active': adminTab === 'email' }"
                  @click="adminTab = 'email'">Email &amp; password</button>
              </div>
            </div>

            <!-- Auth code tab -->
            <template v-if="adminTab === 'auth-code'">
              <div class="mf-section">
                <label class="mf-label al-code-label">
                  New auth code
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" style="margin-left:4px;">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </label>
                <input v-model="newCode" type="text" class="mf-input" placeholder="At least 4 characters" />
                <p class="mf-hint" style="margin-top:6px;">Changing the code signs out anyone with the old one.</p>
                <button type="button" class="al-switch-link" style="margin-top:14px;"
                  @click="switchToAuthCode">
                  Use the auth code for sign-in
                </button>
              </div>
            </template>

            <!-- Email & password tab -->
            <template v-else>
              <div class="mf-section">
                <label class="mf-label">Admin email</label>
                <input v-model="adminEmail" type="email" class="mf-input" placeholder="admin@yourdomain.com" />
              </div>
              <div class="mf-section">
                <label class="mf-label">New password</label>
                <input v-model="adminPassword" type="password" class="mf-input" placeholder="At least 8 characters" />
                <p class="mf-hint" style="margin-top:6px;">Leave blank to keep the existing password.</p>
              </div>
            </template>

          </div>

          <div class="modal-footer">
            <button class="mf-btn-cancel" @click="closeAdminLogin">Cancel</button>
            <button class="mf-btn-create" @click="saveNewCode">Save code</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from '../composables/useToast.js'

const { success, error: toastError, info } = useToast()

const templates = [
  { value: 'express',   label: 'Express',        badge: 'MOST POPULAR', gradient: 'linear-gradient(135deg,#f97316,#9333ea)', desc: 'Bold orange hero on white. Live tracking widget and clean service grid.' },
  { value: 'business',  label: 'Business',       badge: 'ENTERPRISE',   gradient: 'linear-gradient(135deg,#2563eb,#1e1b4b)', desc: 'Deep navy with electric blue accents. Built for accounts and analytics.' },
  { value: 'returns',   label: 'Returns',        badge: 'RETURNS',      gradient: 'linear-gradient(135deg,#f05025,#16a34a)', desc: 'Green-accented portal for hassle-free returns and label printing.' },
  { value: 'freight',   label: 'Freight',        badge: 'FREIGHT',      gradient: 'linear-gradient(135deg,#f97316,#78350f)', desc: 'Industrial-strength layout for LTL/FTL shipping and freight quotes.' },
  { value: 'cinematic', label: 'Cinematic Dark', badge: '3D + NEON',    gradient: 'linear-gradient(135deg,#1e1b4b,#312e81)', desc: 'Dark space-command palette with a 3D-feel hero and neon accents. Replaces both homepage and tracking...' },
]

const visitorOpts = [
  { value: 'off',       label: 'Off',                desc: 'No support widget on the public site.' },
  { value: 'live-chat', label: 'Built-in live chat', desc: 'On-site chat bubble → your admin Live chat inbox.' },
  { value: 'widget',    label: 'Website Widget',     desc: 'Embed any chat widget or chatbot (Smartsupp, Tawk, Crisp, Tidio, Intercom, Chatling, ...).' },
  { value: 'external',  label: 'External link',      desc: 'Send visitors to a support link you set.' },
]

import { useSiteStore } from '../composables/useSiteStore.js'
const { store } = useSiteStore()
const sites = store.tracking

function copyUrl(text, label) {
  navigator.clipboard?.writeText(text).catch(() => {})
  info(`${label} copied`, text)
}

/* ── Create ── */
const showCreate = ref(false)
const cForm = reactive({
  name: '', template: 'express',
  signIn: 'access-code', accessCode: '', adminEmail: '', adminPassword: '',
  reachType: 'subdomain', subdomain: '', suffix: '.qst1x.com', ownDomain: '',
  chatOpen: true, chatMode: 'contact',
  whatsapp: '', telegram: '', phone: '', contactEmail: '', widgetCode: '',
})

const selectedTemplate = computed(() =>
  templates.find(t => t.value === cForm.template) || templates[0]
)

function createSite() {
  if (!cForm.name.trim()) { toastError('Name required', 'Please enter a site name.'); return }
  if (cForm.signIn === 'access-code' && cForm.accessCode && cForm.accessCode.length < 4) {
    toastError('Code too short', 'Access code must be at least 4 characters.'); return
  }
  if (cForm.reachType === 'subdomain' && !cForm.subdomain.trim()) {
    toastError('Subdomain required', 'Please enter a subdomain keyword.'); return
  }
  const domain = cForm.reachType === 'subdomain'
    ? `${cForm.subdomain}${cForm.suffix}` : cForm.ownDomain
  const tpl = templates.find(t => t.value === cForm.template) || templates[0]
  sites.push({
    id: Date.now(), name: cForm.name, logoUrl: '',
    gradient: tpl.gradient, template: cForm.template,
    domain, adminUrl: `admin.${domain}`,
    status: 'active', reachType: cForm.reachType,
    accessCode: cForm.accessCode || Math.random().toString(36).slice(2, 8).toUpperCase(),
  })
  success('Site created', `"${cForm.name}" is now live.`)
  closeCreate()
}

function closeCreate() {
  showCreate.value = false
  Object.assign(cForm, {
    name: '', template: 'express',
    signIn: 'access-code', accessCode: '', adminEmail: '', adminPassword: '',
    reachType: 'subdomain', subdomain: '', suffix: '.qst1x.com', ownDomain: '',
    chatOpen: true, chatMode: 'contact',
    whatsapp: '', telegram: '', phone: '', contactEmail: '', widgetCode: '',
  })
}

/* ── Domain settings ── */
const showDomain   = ref(false)
const domainSite   = ref(null)
const editingDomain = ref(false)
const dForm = reactive({ reachType: 'subdomain', domain: '' })

function openDomain(site) {
  domainSite.value     = site
  dForm.reachType      = site.reachType || 'subdomain'
  dForm.domain         = site.domain
  editingDomain.value  = false
  showDomain.value     = true
}

function saveDomain() {
  editingDomain.value = false
  if (domainSite.value) {
    const idx = sites.findIndex(s => s.id === domainSite.value.id)
    if (idx !== -1) {
      sites.splice(idx, 1, { ...sites[idx], domain: dForm.domain, reachType: dForm.reachType })
    }
  }
  success('Domain updated', 'Your address has been saved.')
}

function closeDomain() {
  showDomain.value    = false
  domainSite.value    = null
  editingDomain.value = false
}

/* ── Edit ── */
const showEdit      = ref(false)
const editingSiteId = ref(null)
const eForm = reactive({
  name: '', logoUrl: '', gradient: '', status: 'active',
  visitorSupport: 'live-chat', reachType: 'subdomain', domain: '',
})

function openEdit(site) {
  editingSiteId.value  = site.id
  editingDomain.value  = false
  eForm.name           = site.name
  eForm.logoUrl        = site.logoUrl    || ''
  eForm.gradient       = site.gradient
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
      name: eForm.name, logoUrl: eForm.logoUrl, gradient: eForm.gradient,
      status: eForm.status, visitorSupport: eForm.visitorSupport,
      reachType: eForm.reachType, domain: eForm.domain,
    })
  }
  success('Changes saved', 'Your tracking site has been updated.')
  closeEdit()
}

function closeEdit() {
  showEdit.value      = false
  editingSiteId.value = null
  editingDomain.value = false
}

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


function adminLogin(site) {
  adminLoginSite.value = site
  adminTab.value       = 'auth-code'
  newCode.value        = ''
  showAdminLogin.value = true
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
  newCode.value        = ''
  adminEmail.value     = ''
  adminPassword.value  = ''
}
</script>

<style scoped>
.tp-page {
  min-height: 100vh; padding: 32px 28px 60px;
  background: transparent; font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── Header ── */
.tp-header {
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
}
.tp-title { font-size: 1.7rem; font-weight: 800; color: var(--t1); margin-bottom: 4px; }
.tp-sub   { font-size: 0.82rem; color: var(--accent); }
.tp-count { font-size: 0.78rem; color: var(--t2); white-space: nowrap; padding-top: 6px; }

/* ── Cards grid ── */
.tp-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;
}

.tp-card {
  background: #fff; border-radius: 14px; overflow: hidden;
  border: 1px solid #e5e7eb; transition: box-shadow 0.2s;
}
.tp-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }

.tp-card__banner { height: 120px; width: 100%; }

.tp-card__body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }

.tp-card__top {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
}
.tp-card__name   { font-size: 0.95rem; font-weight: 800; color: #111827; }
.tp-card__domain { font-size: 0.72rem; color: #6b7280; margin-top: 2px; }
.tp-card__badge {
  display: flex; align-items: center; gap: 4px; white-space: nowrap;
  font-size: 0.65rem; font-weight: 700; color: #6b7280; letter-spacing: 0.06em;
  background: #f3f4f6; padding: 3px 8px; border-radius: 999px; flex-shrink: 0;
}

.tp-status {
  display: inline-block; padding: 3px 10px; border-radius: 6px;
  font-size: 0.72rem; font-weight: 600; width: fit-content;
}
.tp-status--active { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.1); color: #16a34a; }
.tp-status--off    { background: #f3f4f6; color: #9ca3af; }

/* ── Link buttons ── */
.tp-links { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }
.tp-link-btn {
  display: flex; align-items: center; gap: 5px; padding: 5px 12px;
  border: 1px solid #e5e7eb; border-radius: 7px; background: #fff;
  color: #6b7280; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem; font-weight: 600; cursor: pointer; text-decoration: none;
  transition: all 0.18s; white-space: nowrap;
}
.tp-link-btn:hover { border-color: #d1d5db; color: #374151; }
.tp-link-btn--visit { border-color: #111827; color: #111827; font-weight: 700; }

/* ── Action row ── */
.tp-actions {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #f3f4f6; padding-top: 10px; margin-top: 2px;
}
.tp-action-main {
  display: flex; align-items: center; gap: 6px; padding: 6px 12px;
  border: 1px solid #e5e7eb; border-radius: 8px; background: #fff;
  color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
  flex-shrink: 0;
}
.tp-action-main:hover { background: #f9fafb; }

.tp-action-icons { display: flex; gap: 6px; margin-left: auto; }
.tp-icon-btn {
  width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e5e7eb;
  background: #fff; color: #9ca3af; display: flex; align-items: center;
  justify-content: center; cursor: pointer; transition: all 0.18s;
}
.tp-icon-btn:hover { border-color: #d1d5db; color: #374151; }
.tp-icon-btn--danger:hover { border-color: #fca5a5; color: #ef4444; background: rgba(239,68,68,0.05); }

/* ── Empty state ── */
.tp-empty {
  border: 2px dashed #d1d5db; border-radius: 14px; padding: 52px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  background: var(--glass); text-align: center;
}
.tp-empty__icon {
  width: 52px; height: 52px; border-radius: 50%; background: var(--glass-hover);
  display: flex; align-items: center; justify-content: center;
}
.tp-empty__title { font-size: 0.95rem; font-weight: 700; color: var(--t1); }
.tp-empty__desc  { font-size: 0.78rem; color: var(--t2); }

/* ── FAB ── */
.tp-fab { display: flex; justify-content: flex-end; margin-top: 16px; }
.tp-fab__btn {
  display: flex; align-items: center; gap: 8px; padding: 11px 22px;
  background: var(--accent); border: none; border-radius: 10px; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; font-weight: 700;
  cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 16px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.35);
}
.tp-fab__btn:hover { background: var(--accent-press); }

/* ── Live preview banner ── */
.tpl-preview {
  border-radius: 10px; overflow: hidden; height: 110px;
  display: flex; flex-direction: column; padding: 12px 16px;
  justify-content: space-between; position: relative;
}
.tpl-preview__brand { display: flex; align-items: center; gap: 4px; }
.tpl-preview__your  { font-size: 0.78rem; font-weight: 700; color: #fff; }
.tpl-preview__brand-name { font-size: 0.78rem; font-weight: 700; color: #fbbf24; }
.tpl-preview__center { text-align: center; }
.tpl-preview__tag  { font-size: 0.58rem; color: rgba(255,255,255,0.7); letter-spacing: 0.18em; margin-bottom: 4px; }
.tpl-preview__headline { font-size: 1rem; font-weight: 900; color: #fff; letter-spacing: 0.04em; }

/* ── Template grid ── */
.tpl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tpl-card {
  border: 1.5px solid #e5e7eb; border-radius: 10px; overflow: hidden;
  cursor: pointer; transition: border-color 0.18s;
}
.tpl-card:hover { border-color: #d1d5db; }
.tpl-card--active { border-color: #2563eb; border-width: 2px; }
.tpl-card__banner { height: 60px; width: 100%; }
.tpl-card__body   { padding: 10px 12px; }
.tpl-card__row    { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.tpl-card__name   { font-size: 0.82rem; font-weight: 700; color: #111827; }
.tpl-card__badge  { font-size: 0.58rem; font-weight: 700; color: #6b7280; letter-spacing: 0.06em; }
.tpl-card__desc   { font-size: 0.7rem; color: #9ca3af; line-height: 1.4; }

/* ── Live chat section ── */
.chat-toggle-hdr {
  display: flex; align-items: center; gap: 8px; background: none; border: none;
  cursor: pointer; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem; font-weight: 700; color: #111827;
}
.chat-toggle-hdr__arrow { font-size: 0.7rem; color: #6b7280; }
.chat-tabs { display: flex; gap: 6px; margin-bottom: 12px; }
.chat-tab {
  padding: 6px 14px; border-radius: 8px; border: 1.5px solid #e5e7eb;
  background: #fff; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
}
.chat-tab--active { background: #111827; color: #fff; border-color: #111827; }
.chat-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.chat-field  { display: flex; flex-direction: column; gap: 6px; }

/* ── Modal shared ── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;
}
.modal {
  background: #fff; border-radius: 16px; width: 100%; max-width: 520px;
  max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px 16px; border-bottom: 1px solid #f3f4f6; flex-shrink: 0;
}
.modal-head__title { font-size: 1rem; font-weight: 700; color: #111827; }
.modal-close {
  width: 32px; height: 32px; border-radius: 50%; border: none; background: #f3f4f6;
  color: #6b7280; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.18s;
}
.modal-close:hover { background: #e5e7eb; color: #111827; }
.modal-close--square {
  border-radius: 6px !important; border: 1.5px solid #d1d5db !important; background: #fff !important;
}
.modal-close--square:hover { border-color: #9ca3af !important; background: #f9fafb !important; }

.modal-body   { overflow-y: auto; padding: 0; flex: 1; }
.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 14px 24px; border-top: 1px solid #f3f4f6; flex-shrink: 0;
}

/* ── Form elements ── */
.mf-section { padding: 16px 24px; border-bottom: 1px solid #f9fafb; }
.mf-section:last-child { border-bottom: none; }
.mf-label { display: block; font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 8px; }
.mf-input {
  width: 100%; padding: 9px 12px; border: 1px solid #e5e7eb; border-radius: 8px;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; color: #111827;
  background: #fff; outline: none; transition: border-color 0.18s;
}
.mf-input:focus { border-color: var(--accent); }
.mf-hint { font-size: 0.74rem; color: #9ca3af; }
.mf-btn-cancel {
  padding: 9px 20px; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 9px;
  color: #374151; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; font-weight: 600; cursor: pointer;
}
.mf-btn-create {
  padding: 9px 22px; background: var(--accent); border: none; border-radius: 9px;
  color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.83rem; font-weight: 700;
  cursor: pointer; transition: background 0.2s;
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

/* ── Visitor support ── */
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
  border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 13px 15px;
  cursor: pointer; transition: all 0.18s;
}
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

/* ── Domain box ── */
.domain-box { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }
.domain-box__inner-label { font-size: 0.88rem; font-weight: 700; color: #111827; }
.domain-box__question    { font-size: 0.78rem; color: var(--accent); font-weight: 600; margin: 0; }
.address-box { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.address-box__label { display: block; padding: 5px 12px; font-size: 0.62rem; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.address-row  { display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
.address-value { font-size: 0.84rem; color: #111827; flex: 1; }
.address-live  { font-size: 0.68rem; font-weight: 700; color: var(--accent); background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.08); padding: 2px 8px; border-radius: 999px; }
.address-edit-btn { padding: 4px 12px; border: 1px solid #e5e7eb; border-radius: 7px; background: #fff; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
.address-edit-input { flex: 1; border: 1px solid var(--accent); border-radius: 7px; padding: 5px 9px; font-size: 0.84rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }

/* ── Admin login ── */
.al-sub { font-size: 0.78rem; color: #6b7280; margin-top: 2px; }
.al-tabs { display: flex; gap: 8px; padding: 16px 24px 0; margin: 0; }
.al-tab  {
  padding: 8px 18px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem;
  font-weight: 600; cursor: pointer; border: 1px solid #e5e7eb; border-radius: 8px;
  background: #fff; color: #374151; transition: all 0.18s;
}
.al-tab--active:first-child { background: var(--accent); color: #fff; border-color: var(--accent); }
.al-tab--active:not(:first-child) { border-color: var(--accent); color: var(--accent); }
.al-code-label {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 8px;
}
.al-switch-link {
  display: block; background: none; border: none; padding: 0;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem;
  font-weight: 700; color: #111827; cursor: pointer; text-align: left;
  text-decoration: underline; text-decoration-color: transparent;
  transition: text-decoration-color 0.18s;
}
.al-switch-link:hover { text-decoration-color: #111827; }

/* ── Modal transition ── */
.modal-fade-enter-active { transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.modal-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.modal-fade-enter-from   { opacity: 0; transform: scale(0.93) translateY(12px); }
.modal-fade-leave-to     { opacity: 0; transform: scale(0.97); }

@media (max-width: 768px) {
  .tp-page  { padding: 20px 14px 60px; }
  .tp-title { font-size: 1.35rem; }
  .tp-grid  { grid-template-columns: 1fr; }
  .vs-grid  { grid-template-columns: 1fr; }
  .gradient-grid { grid-template-columns: repeat(4, 1fr); }
}
</style>
