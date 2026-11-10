<!-- src/views/BrandedEmailsView.vue -->
<template>
  <div class="cm-page">

    <!-- ══════════ COMPOSE (full page) ══════════ -->
    <template v-if="activeProvider">
      <button class="ce-back" @click="activeProvider = null">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Crypto Mails
      </button>

      <div class="ce-grid">
        <!-- Form -->
        <div class="ce-form-card">
          <div class="ce-hero" :style="{ background: `linear-gradient(160deg, ${activeProvider.topColor} 0%, rgba(0,0,0,0.28) 150%)` }">
            <div class="ce-hero__logo"><img :src="activeProvider.logo" :alt="activeProvider.name" @error="onImgError" /></div>
            <div class="ce-hero__title">Send via {{ activeProvider.name }}</div>
            <div class="ce-hero__sub">Generates a crypto deposit email styled like {{ activeProvider.name }}.</div>
          </div>

          <div class="ce-body">
            <div class="ce-field">
              <label class="ce-label">Previewing</label>
              <div class="ce-tabs">
                <button class="ce-tab" :class="{ 'ce-tab--on': form.type === 'Deposit' }" @click="form.type = 'Deposit'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                  Deposit
                </button>
                <button class="ce-tab" :class="{ 'ce-tab--on': form.type === 'Withdrawal' }" @click="form.type = 'Withdrawal'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                  Withdrawal
                </button>
              </div>
              <p class="ce-hint">Preview only — the deposit goes to the recipient and the withdrawal copy to you; both are always sent.</p>
            </div>

            <div class="ce-field">
              <label class="ce-label">Language</label>
              <select v-model="form.language" class="ce-input">
                <option v-for="l in languages" :key="l" :value="l">{{ l }}</option>
              </select>
              <p class="ce-hint">The email is translated into this language before it's sent — the preview updates to match. Amounts &amp; links stay as-is.</p>
            </div>

            <div class="ce-field">
              <label class="ce-label">Coin <span class="ce-req">*</span></label>
              <select v-model="form.coin" class="ce-input">
                <option v-for="c in coins" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div class="ce-field">
              <label class="ce-label">Quantity <span class="ce-req">*</span></label>
              <input v-model="form.quantity" type="number" min="0" step="any" class="ce-input" placeholder="0.00" />
            </div>

            <template v-if="activeProvider.template === 'coinbase'">
              <div class="ce-field">
                <label class="ce-label">Currency</label>
                <select v-model="form.currency" class="ce-input">
                  <option v-for="c in fiats" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div class="ce-field">
                <label class="ce-label">Total value</label>
                <input v-model="form.totalValue" class="ce-input" placeholder="0.00" />
              </div>
            </template>

            <div v-if="activeProvider.template === 'bitcoin'" class="ce-field">
              <label class="ce-label">Total value (USD)</label>
              <input v-model="form.totalValue" type="number" min="0" step="any" class="ce-input" placeholder="0.00" />
            </div>

            <div v-if="activeProvider.template === 'bybit'" class="ce-field">
              <label class="ce-label">Network <span class="ce-req">*</span></label>
              <select v-model="form.network" class="ce-input">
                <option v-for="n in networks" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>

            <div class="ce-field">
              <label class="ce-label">Receiver's wallet address</label>
              <input v-model="form.wallet" class="ce-input" placeholder="0x… or bc1…" />
            </div>

            <div class="ce-field">
              <label class="ce-label">Recipient's email <span class="ce-req">*</span></label>
              <input v-model="form.recipient" type="email" class="ce-input" placeholder="name@example.com" />
            </div>

            <label class="ce-check"><input type="checkbox" v-model="form.addNote" /> <span>Add a note</span></label>
            <p class="ce-hint ce-hint--tight">Off by default — toggle on to add a short note shown in the email.</p>
            <textarea v-if="form.addNote" v-model="form.note" class="ce-input ce-textarea" rows="3" placeholder="Add a short message to the recipient…"></textarea>

            <div class="ce-field">
              <label class="ce-label">Transaction ID</label>
              <div class="ce-txrow">
                <input v-model="form.txId" class="ce-input" />
                <button class="ce-regen" @click="regenTx">Regenerate</button>
              </div>
              <p class="ce-hint">Shown on both the deposit and withdrawal emails. Auto-filled to match the network — type your own or regenerate.</p>
            </div>

            <p class="ce-smtp">Want to send via your own SMTP? <span class="ce-smtp__link" @click="info('Manage SMTP', 'Configure your own SMTP server.')">Manage SMTP</span></p>

            <button class="ce-send" :style="{ background: activeProvider.topColor, color: btnText }" @click="sendMail">
              {{ sending ? 'Sending…' : `Send ${activeProvider.name} email` }}
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="ce-preview-wrap">
          <div class="ce-preview-bar">
            <span>{{ activeProvider.name.toUpperCase() }} {{ form.type.toUpperCase() }} EMAIL</span>
            <span class="ce-subject">Subject: <strong>{{ subject }}</strong></span>
          </div>

          <!-- Coinbase template -->
          <div v-if="activeProvider.template === 'coinbase'" class="ce-email ce-cb" :style="{ background: activeProvider.topColor }">
            <div class="ce-cb__brand">coinbase</div>
            <div class="ce-cb__card">
              <div class="ce-cb__check" :style="{ borderColor: activeProvider.topColor, color: activeProvider.topColor }">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p class="ce-cb__lead">You just {{ form.type === 'Deposit' ? 'received' : 'sent' }}</p>
              <p class="ce-cb__amt">{{ form.quantity || '0.00' }} {{ form.coin }} ({{ form.totalValue || '0.00' }} {{ form.currency }})</p>
              <p class="ce-cb__net">via Coinbase network</p>
              <div class="ce-cb__hr"></div>
              <p class="ce-cb__body">
                You just {{ form.type === 'Deposit' ? 'received' : 'sent' }} {{ form.quantity || '0.00' }} {{ form.coin }} ({{ form.totalValue || '0.00' }} {{ form.currency }})
                {{ form.type === 'Deposit' ? 'from' : 'to' }} an external {{ form.coin }} account. It may take up to 6 network confirmations before your {{ form.coin }} is available for trade.
                <a :style="{ color: activeProvider.topColor }">Learn more</a>
              </p>
              <p v-if="form.addNote && form.note" class="ce-cb__note">{{ form.note }}</p>
              <a class="ce-cb__btn" :style="{ background: activeProvider.topColor }">View transaction</a>
            </div>
            <p class="ce-cb__app-label">Get the latest Coinbase App for your phone</p>
            <div class="ce-cb__badges" v-html="storeBadges"></div>
          </div>

          <!-- Kraken template -->
          <div v-else-if="activeProvider.template === 'kraken'" class="ce-email ce-kr">
            <div class="ce-kr__brand" :style="{ color: activeProvider.topColor }">
              <img :src="activeProvider.logo" :alt="activeProvider.name" class="ce-kr__logo" @error="onImgError" /> Kraken
            </div>
            <div class="ce-kr__card">
              <p class="ce-kr__body">A {{ form.type.toLowerCase() }} has been made to your Kraken account.</p>
              <p class="ce-kr__body">To see the {{ form.type.toLowerCase() }}, sign in to your account and go to the Funding page</p>
              <p v-if="form.addNote && form.note" class="ce-kr__note">{{ form.note }}</p>
              <a class="ce-kr__btn" :style="{ background: activeProvider.topColor }">Sign in to view transaction</a>
            </div>
            <p class="ce-kr__foot">Thank you for choosing Kraken, the trusted and secure digital asset exchange.</p>
            <p class="ce-kr__team">The Kraken Team</p>
          </div>

          <!-- Blockchain.com template -->
          <div v-else-if="activeProvider.template === 'blockchain'" class="ce-email ce-bc2">
            <div class="ce-bc2__topbar"></div>
            <div class="ce-bc2__card">
              <div class="ce-bc2__wallet">Blockchain.com Wallet</div>
              <h2 class="ce-bc2__title">You've {{ form.type === 'Deposit' ? 'received' : 'sent' }} funds in your Private Key Wallet</h2>
              <p class="ce-bc2__body">You've {{ form.type === 'Deposit' ? 'received' : 'sent' }} {{ form.quantity || '0.00' }} {{ form.coin }} {{ form.type === 'Deposit' ? 'into' : 'from' }} your Private Key Wallet. You can also view this transaction in your transaction history.</p>
              <p v-if="form.addNote && form.note" class="ce-bc2__note">{{ form.note }}</p>
              <a class="ce-bc2__btn" :style="{ background: activeProvider.topColor }">Log In</a>
              <p class="ce-bc2__sign">Best,<br>The Blockchain.com Team</p>
              <div class="ce-bc2__hr"></div>
              <div class="ce-bc2__social" v-html="socialIcons"></div>
              <div class="ce-bc2__badges" v-html="storeBadges"></div>
              <div class="ce-bc2__hr"></div>
              <div class="ce-bc2__footer">© Blockchain.com<br>{{ stamp }}</div>
            </div>
          </div>

          <!-- Bitcoin.com template -->
          <div v-else-if="activeProvider.template === 'bitcoin'" class="ce-email ce-btc" style="background:#0ac18e">
            <div class="ce-btc__card">
              <div class="ce-btc__logo"><img :src="activeProvider.logo" :alt="activeProvider.name" @error="onImgError" /></div>
              <p class="ce-btc__label">{{ form.coin }} Received</p>
              <p class="ce-btc__amt">US$ {{ form.totalValue || '0.00' }}</p>
              <p class="ce-btc__body">{{ form.quantity || '0.00' }} {{ form.coin }} has been deposited to your Bitcoin.com wallet.</p>
              <p class="ce-btc__body">Login to view transaction.</p>
              <p v-if="form.addNote && form.note" class="ce-btc__note">{{ form.note }}</p>
            </div>
            <p class="ce-btc__support">Contact Support</p>
          </div>

          <!-- ByBit template -->
          <div v-else-if="activeProvider.template === 'bybit'" class="ce-email ce-bb">
            <div class="ce-bb__header">
              <span class="ce-bb__logo">BYB<span style="color:#f7a600">I</span>T</span>
              <span class="ce-bb__tag">Next Level Trading</span>
            </div>
            <div class="ce-bb__body">
              <p>Dear valued Bybit trader,</p>
              <p>Your {{ form.type.toLowerCase() }} has been confirmed.</p>
              <p>{{ form.type }} amount: {{ form.quantity || '0.00' }} {{ form.coin }}</p>
              <p>Chain type: {{ form.network }}</p>
              <p>{{ form.type }} address: {{ form.wallet || '—' }}</p>
              <p>Timestamp: {{ utcTime }} (UTC)</p>
              <p v-if="form.addNote && form.note" class="ce-bb__note">{{ form.note }}</p>
              <p>If you believe your account has been compromised, please contact us immediately via live chat or email <a style="color:#1652f0">support@bybit.com</a> using your registered email address.</p>
              <p>To enhance your account security, consider enabling Google Two-Factor Authentication (2FA) and setting up a Fund Password from the Account &amp; Security page.</p>
              <p>For more information, please visit our help center:</p>
              <p class="ce-bb__link">How to perform an asset exchange?</p>
              <p class="ce-bb__link">How to add your withdrawal wallet address?</p>
              <p>Regards,</p>
              <p>The Bybit Team</p>
            </div>
          </div>

          <!-- Standard template -->
          <div v-else class="ce-email">
            <div class="ce-email__header" :style="{ color: logoColor }">
              <img :src="activeProvider.logo" :alt="activeProvider.name" class="ce-email__logo" @error="onImgError" />
              <span>{{ activeProvider.name }}</span>
            </div>
            <div class="ce-email__body">
              <h2 class="ce-email__title">{{ form.coin }} {{ form.type }} {{ form.type === 'Deposit' ? 'Successful' : 'Processed' }}</h2>
              <p class="ce-email__p">
                Your {{ form.type.toLowerCase() }} of <strong>{{ form.quantity || '0.00' }} {{ form.coin }}</strong>
                {{ form.type === 'Deposit' ? 'is now available in' : 'has been processed from' }} your {{ activeProvider.name }} account.
                Log in to check your balance. Read our <a :style="{ color: activeProvider.topColor }">FAQs</a> if you are running into problems.
              </p>
              <p v-if="form.addNote && form.note" class="ce-email__note">{{ form.note }}</p>
              <a class="ce-email__btn" :style="{ background: activeProvider.topColor, color: btnText }">Visit Your Dashboard</a>
              <p class="ce-email__p">Don't recognize this activity? Please <a :style="{ color: activeProvider.topColor }">reset your password</a> and contact <a :style="{ color: activeProvider.topColor }">customer support</a> immediately.</p>
              <p class="ce-email__muted"><em>This is an automated message, please do not reply.</em></p>
              <div class="ce-email__divider" :style="{ borderColor: activeProvider.topColor + '66' }"></div>
              <p class="ce-email__connect" :style="{ color: activeProvider.topColor }">Stay connected!</p>
              <div class="ce-email__social" v-html="socialIcons"></div>
              <p class="ce-email__fine">To stay secure, setup your anti-phishing code <a :style="{ color: activeProvider.topColor }">here</a></p>
              <p class="ce-email__fine"><strong>Risk warning:</strong> Digital asset prices can be volatile. The value of your investment may go down or up and you may not get back the amount invested. You are solely responsible for your investment decisions and {{ activeProvider.name }} is not liable for any losses you may incur. Not financial advice.</p>
              <p class="ce-email__fine">You have received this email as a registered user of <a :style="{ color: activeProvider.topColor }">{{ domainOf(activeProvider) }}</a>.</p>
              <p class="ce-email__copy">© {{ year }} {{ activeProvider.name }}. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ══════════ GRID ══════════ -->
    <template v-else>
      <div class="cm-header">
        <button class="ce-back" @click="$router.push('/customers')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div class="cm-header__text">
          <h1 class="cm-title">Crypto Mails</h1>
          <p class="cm-sub">Pick a provider to send a brand-styled deposit / transaction email.</p>
        </div>
      </div>

      <div class="provider-grid">
        <div v-for="p in providers" :key="p.name" class="p-card" :style="{ '--accent-top': p.topColor }" @click="selectProvider(p)">
          <div class="p-card__top-bar" />
          <div class="p-card__badge" :style="{ background: p.badgeBg, color: p.badgeColor }">{{ p.badge }}</div>
          <div class="p-card__logo-wrap"><img :src="p.logo" :alt="p.name" class="p-card__logo" @error="onImgError" /></div>
          <h3 class="p-card__name">{{ p.name }}</h3>
          <p class="p-card__tag">{{ p.tagline }}</p>
          <span class="p-card__cta">Click Anywhere</span>
        </div>
      </div>

      <div class="recent-section">
        <h2 class="recent-title">Recently sent Crypto Mails</h2>
        <div v-if="sentMails.length === 0" class="recent-empty">
          <div class="recent-empty__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <p class="recent-empty__title">No Crypto Mails yet</p>
          <p class="recent-empty__sub">Pick a provider above and send your first Crypto Mail — it will appear here.</p>
        </div>
        <div v-else class="sent-list">
          <div v-for="m in sentMails" :key="m.id" class="sent-item">
            <img :src="m.logo" :alt="m.provider" class="sent-item__logo" />
            <div class="sent-item__info">
              <span class="sent-item__to">{{ m.recipient }}</span>
              <span class="sent-item__meta">{{ m.provider }} · {{ m.type }} · {{ m.amount }}</span>
            </div>
            <span class="sent-item__badge">Sent</span>
            <span class="sent-item__time">{{ m.time }}</span>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from '../composables/useToast.js'

const { success, info, error } = useToast()
const year = new Date().getFullYear()

const gf = d => `https://www.google.com/s2/favicons?domain=${d}&sz=128`
const providers = [
  { name: 'Binance', tagline: 'Binance Sets the Standard', badge: 'GLOBAL', badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f3ba2f', logo: gf('binance.com'), domain: 'binance.com' },
  { name: 'Coinbase', tagline: 'Coinbase, Accessible and Simple', badge: 'GOLD', badgeBg: '#3b82f6', badgeColor: '#fff', topColor: '#1652f0', logo: gf('coinbase.com'), domain: 'coinbase.com', template: 'coinbase' },
  { name: 'Kraken', tagline: 'Kraken, Trusted by Pros', badge: 'PRO', badgeBg: '#8b5cf6', badgeColor: '#fff', topColor: '#7132f5', logo: gf('kraken.com'), domain: 'kraken.com', template: 'kraken' },
  { name: 'Blockchain.com', tagline: 'Blockchain, the Original', badge: 'PREMIUM', badgeBg: '#60a5fa', badgeColor: '#fff', topColor: '#1267f2', logo: gf('blockchain.com'), domain: 'blockchain.com', template: 'blockchain' },
  { name: 'Bitcoin.com', tagline: 'Bitcoin, Reimagined', badge: 'PIONEER', badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f7931a', logo: gf('bitcoin.com'), domain: 'bitcoin.com', template: 'bitcoin' },
  { name: 'ByBit', tagline: 'Bybit, Speed and Precision', badge: 'SPEED', badgeBg: '#f59e0b', badgeColor: '#fff', topColor: '#f7a600', logo: gf('bybit.com'), domain: 'bybit.com', template: 'bybit' },
  { name: 'MetaMask', tagline: 'MetaMask, the Gateway', badge: 'PROFESSIONAL', badgeBg: '#f97316', badgeColor: '#fff', topColor: '#f6851b', logo: gf('metamask.io'), domain: 'metamask.io' },
  { name: 'OKX', tagline: 'OKX, Powerful. Secure. Global.', badge: 'POWERHOUSE', badgeBg: '#0f172a', badgeColor: '#fff', topColor: '#0f172a', logo: gf('okx.com'), domain: 'okx.com' },
  { name: 'LUNO', tagline: 'Luno, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#0052ff', logo: gf('luno.com'), domain: 'luno.com' },
  { name: 'VALR', tagline: "VALR, South Africa's Crypto Frontier", badge: 'AFRICA', badgeBg: '#0f172a', badgeColor: '#fff', topColor: '#1e293b', logo: gf('valr.com'), domain: 'valr.com' },
  { name: 'Yellow Card', tagline: 'Yellow Card, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#f5b400', logo: gf('yellowcard.io'), domain: 'yellowcard.io' },
  { name: 'Roqqu', tagline: 'Roqqu, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#1e293b', logo: gf('roqqu.com'), domain: 'roqqu.com' },
  { name: 'Bitso', tagline: "Bitso, Latin America's Crypto Bridge", badge: 'PROFESSIONAL', badgeBg: '#f05025', badgeColor: '#fff', topColor: '#09b1a4', logo: gf('bitso.com'), domain: 'bitso.com' },
  { name: 'Bitget', tagline: 'Bitget, Crypto Made Accessible', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#00f0ff', logo: gf('bitget.com'), domain: 'bitget.com' },
  { name: 'SuperEx', tagline: 'SuperEx, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#ef4444', logo: gf('superex.com'), domain: 'superex.com' },
  { name: 'XT Wallet', tagline: 'XT Wallet, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#3b82f6', logo: gf('xt.com'), domain: 'xt.com' },
  { name: 'AltCoin Trader', tagline: 'AltCoin Trader, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#1e63c7', logo: gf('altcointrader.co.za'), domain: 'altcointrader.co.za' },
  { name: 'Crypto.com', tagline: 'Crypto at the Speed of Life', badge: 'GOLD WINNER', badgeBg: '#3b82f6', badgeColor: '#fff', topColor: '#103f68', logo: gf('crypto.com'), domain: 'crypto.com' },
  { name: 'Cash App', tagline: 'Cash App, Everyday Crypto', badge: 'GOLD WINNER', badgeBg: '#f05025', badgeColor: '#fff', topColor: '#00d632', logo: gf('cash.app'), domain: 'cash.app' },
  { name: 'Zelle', tagline: 'Zelle, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#8b5cf6', badgeColor: '#fff', topColor: '#6d1ed4', logo: gf('zellepay.com'), domain: 'zellepay.com' },
  { name: 'Venmo', tagline: 'Venmo, Crypto for Emerging Markets', badge: 'EMERGENCE', badgeBg: '#1e293b', badgeColor: '#fff', topColor: '#008cff', logo: gf('venmo.com'), domain: 'venmo.com' },
  { name: 'GCash', tagline: 'GCash, Crypto in Your Wallet', badge: 'PHP', badgeBg: '#22d3ee', badgeColor: '#fff', topColor: '#007dfe', logo: gf('gcash.com'), domain: 'gcash.com' },
]

const coins = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'USDC', 'DOGE', 'ADA', 'TRX', 'LTC', 'MATIC']
const fiats = ['USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'CAD', 'AUD', 'INR']
const networks = ['Bitcoin', 'Ethereum (ERC20)', 'BNB Smart Chain (BEP20)', 'Tron (TRC20)', 'Solana', 'Polygon', 'Arbitrum One']
const languages = ["English (don't translate)", 'Spanish', 'French', 'German', 'Portuguese', 'Arabic', 'Chinese', 'Russian', 'Hindi', 'Turkish']

const storeBadges = [
  '<svg viewBox="0 0 120 40" width="120" height="40"><rect width="120" height="40" rx="6" fill="#000"/><text x="16" y="17" fill="#fff" font-family="Arial" font-size="8">Download on the</text><text x="16" y="30" fill="#fff" font-family="Arial" font-size="13" font-weight="700">App Store</text></svg>',
  '<svg viewBox="0 0 120 40" width="120" height="40"><rect width="120" height="40" rx="6" fill="#000"/><text x="16" y="17" fill="#fff" font-family="Arial" font-size="8">GET IT ON</text><text x="16" y="30" fill="#fff" font-family="Arial" font-size="13" font-weight="700">Google Play</text></svg>',
].join('')

const socialIcons = ['M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  'M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z',
  'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z',
  'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z',
  'M23.5 6.2a3 3 0 0 0-2.11-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.52A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 0 0 2.11-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z',
  'M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.21 11.4c-.11-.97-.21-2.46.04-3.52.22-.95 1.44-6.06 1.44-6.06s-.37-.74-.37-1.83c0-1.72 1-3 2.24-3 1.06 0 1.57.79 1.57 1.74 0 1.06-.68 2.65-1.03 4.12-.29 1.24.62 2.25 1.84 2.25 2.21 0 3.91-2.33 3.91-5.69 0-2.98-2.14-5.06-5.2-5.06-3.54 0-5.62 2.65-5.62 5.4 0 1.07.41 2.21.92 2.83.1.12.12.23.09.35l-.34 1.4c-.05.23-.18.28-.42.17-1.57-.73-2.55-3.02-2.55-4.86 0-3.96 2.88-7.6 8.3-7.6 4.35 0 7.74 3.1 7.74 7.25 0 4.33-2.73 7.81-6.51 7.81-1.27 0-2.47-.66-2.88-1.44l-.78 2.98c-.28 1.09-1.04 2.46-1.55 3.29A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z',
  'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.36 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z',
].map(d => `<svg viewBox="0 0 24 24" width="15" height="15" fill="#8b949e"><path d="${d}"/></svg>`).join('')

const activeProvider = ref(null)
const sending = ref(false)
const sentMails = ref([])

function randTx() { let s = ''; const h = '0123456789abcdef'; for (let i = 0; i < 64; i++) s += h[Math.floor(Math.random() * 16)]; return s }

const form = reactive({
  type: 'Deposit', language: languages[0], coin: 'BTC', quantity: '0.00',
  currency: 'USD', totalValue: '0.00', network: 'Bitcoin',
  wallet: '', recipient: '', addNote: false, note: '', txId: randTx(),
})

const stamp = ref(Date.now())
const utcTime = computed(() => new Date().toISOString().replace('T', ' ').slice(0, 19))

const subject = computed(() => {
  const p = activeProvider.value; if (!p) return ''
  const qty = form.quantity || '0.00'
  if (p.template === 'coinbase') return `Coinbase — You ${form.type === 'Deposit' ? 'received' : 'sent'} ${qty} ${form.coin}`
  if (p.template === 'kraken') return `Kraken — ${form.type} of ${qty} ${form.coin} confirmed`
  if (p.template === 'blockchain') return `Blockchain — Funds ${form.type === 'Deposit' ? 'received' : 'sent'}: ${qty} ${form.coin}`
  if (p.template === 'bitcoin') return `Bitcoin — Incoming transfer (${qty} ${form.coin})`
  if (p.template === 'bybit') return `[Bybit] ${form.type} confirmed — ${qty} ${form.coin}`
  return `[${p.name}] ${form.coin} ${form.type} Confirmed`
})

function luminance(hex) {
  const c = hex.replace('#', ''); const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b
}
const btnText = computed(() => activeProvider.value && luminance(activeProvider.value.topColor) > 150 ? '#181a20' : '#ffffff')
const logoColor = computed(() => activeProvider.value && luminance(activeProvider.value.topColor) < 70 ? '#ffffff' : (activeProvider.value?.topColor || '#fff'))
const domainOf = (p) => p.domain || (p.name.toLowerCase().replace(/[^a-z]/g, '') + '.com')

function selectProvider(p) {
  activeProvider.value = p
  Object.assign(form, { type: 'Deposit', language: languages[0], coin: 'BTC', quantity: '0.00', currency: 'USD', totalValue: '0.00', network: 'Bitcoin', wallet: '', recipient: '', addNote: false, note: '', txId: randTx() })
  stamp.value = Date.now()
}
function regenTx() { form.txId = randTx() }

function sendMail() {
  if (!form.recipient.trim() || !form.recipient.includes('@')) { error('Recipient required', 'Enter a valid email address.'); return }
  if (!form.quantity || Number(form.quantity) <= 0) { error('Quantity required', 'Enter a valid amount.'); return }
  sending.value = true
  setTimeout(() => {
    sentMails.value.unshift({
      id: Date.now(), provider: activeProvider.value.name, logo: activeProvider.value.logo,
      recipient: form.recipient, type: form.type, amount: `${form.quantity} ${form.coin}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })
    sending.value = false
    success('Crypto Mail sent', `${activeProvider.value.name} ${form.type.toLowerCase()} email sent to ${form.recipient}.`)
    activeProvider.value = null
  }, 1200)
}

function onImgError(e) {
  e.target.style.visibility = 'hidden'
}
</script>

<style scoped>
.cm-page { display: flex; flex-direction: column; gap: 22px; }

/* Header */
.cm-header { display: flex; align-items: flex-start; gap: 16px; }
.cm-header__text { display: flex; flex-direction: column; gap: 4px; }
.cm-title { font-size: 1.45rem; font-weight: 800; color: var(--t1); letter-spacing: -0.025em; margin: 0; }
.cm-sub { font-size: 0.82rem; color: var(--t2); font-weight: 500; margin: 0; }

.ce-back {
  display: inline-flex; align-items: center; gap: 6px; align-self: flex-start;
  padding: 8px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg);
  color: var(--t2); font-family: inherit; font-size: 0.82rem; font-weight: 700; cursor: pointer;
  transition: color 0.16s ease, border-color 0.16s ease;
}
.ce-back:hover { color: var(--t1); border-color: var(--accent-border); }

/* Provider grid */
.provider-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.p-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 0 18px 18px; border-radius: 16px; background: var(--bg); border: 1px solid var(--border-soft); cursor: pointer; overflow: hidden; transition: transform 0.2s ease, border-color 0.2s ease; text-align: center; }
.p-card:hover { transform: translateY(-4px); border-color: var(--accent-border); }
.p-card__top-bar { height: 5px; background: var(--accent-top); flex-shrink: 0; align-self: stretch; margin-left: -18px; width: calc(100% + 36px); margin-bottom: 6px; }
.p-card__badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 12px; border-radius: 999px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.06em; flex-shrink: 0; }
.p-card__logo-wrap { width: 68px; height: 68px; border-radius: 18px; background: #fff; border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.p-card__logo { width: 44px; height: 44px; object-fit: contain; border-radius: 10px; }
.p-card__name { font-size: 0.92rem; font-weight: 700; color: var(--t1); margin: 0; }
.p-card__tag { font-size: 0.75rem; color: var(--t3); margin: 0; line-height: 1.5; }
.p-card__cta { margin-top: auto; font-size: 0.72rem; color: var(--t4); padding-top: 8px; border-top: 1px solid var(--border-soft); width: 100%; text-align: center; }

/* Recently sent */
.recent-section { display: flex; flex-direction: column; gap: 14px; }
.recent-title { font-size: 1rem; font-weight: 700; color: var(--t1); margin: 0; }
.recent-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 48px 24px; border: 1.5px dashed var(--border); border-radius: 16px; text-align: center; }
.recent-empty__icon { width: 48px; height: 48px; border-radius: 50%; background: var(--bg); border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; color: var(--t4); }
.recent-empty__title { font-size: 0.9rem; font-weight: 700; color: var(--t1); margin: 0; }
.recent-empty__sub { font-size: 0.78rem; color: var(--t3); margin: 0; max-width: 320px; line-height: 1.55; }
.sent-list { display: flex; flex-direction: column; gap: 8px; }
.sent-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; background: var(--bg); border: 1px solid var(--border-soft); }
.sent-item__logo { width: 28px; height: 28px; border-radius: 6px; object-fit: contain; background: #fff; }
.sent-item__info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.sent-item__to { font-size: 0.82rem; font-weight: 600; color: var(--t1); }
.sent-item__meta { font-size: 0.7rem; color: var(--t3); }
.sent-item__badge { font-size: 0.65rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: var(--accent-dim); border: 1px solid var(--accent-border); color: var(--accent); }
.sent-item__time { font-size: 0.7rem; color: var(--t4); white-space: nowrap; }

/* ══════════ Compose ══════════ */
.ce-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }

.ce-form-card { background: var(--bg); border: 1px solid var(--t4); border-radius: 18px; overflow: hidden; }
.ce-hero { padding: 24px; text-align: center; color: #fff; }
.ce-hero__logo { width: 56px; height: 56px; border-radius: 14px; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; overflow: hidden; }
.ce-hero__logo img { width: 34px; height: 34px; object-fit: contain; }
.ce-hero__title { font-size: 1.3rem; font-weight: 800; }
.ce-hero__sub { font-size: 0.82rem; opacity: 0.9; margin-top: 4px; }

.ce-body { padding: 22px; display: flex; flex-direction: column; gap: 16px; }
.ce-field { display: flex; flex-direction: column; gap: 8px; }
.ce-label { font-size: 0.82rem; font-weight: 700; color: var(--t1); }
.ce-req { color: #ef4444; }
.ce-hint { margin: 0; font-size: 0.73rem; color: var(--t3); line-height: 1.5; }
.ce-hint--tight { margin-top: -10px; }
.ce-input { width: 100%; height: 44px; padding: 0 14px; border-radius: 11px; background: var(--bg); border: 1px solid var(--border); color: var(--t1); font-family: inherit; font-size: 0.88rem; outline: none; transition: border-color 0.16s ease; }
.ce-input:focus { border-color: var(--accent); }
select.ce-input { cursor: pointer; }
.ce-textarea { height: auto; padding: 12px 14px; resize: vertical; line-height: 1.5; }
.ce-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ce-tab { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 46px; border-radius: 11px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.86rem; font-weight: 700; }
.ce-tab:hover { border-color: var(--accent-border); }
.ce-tab--on { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
.ce-check { display: flex; align-items: center; gap: 9px; font-size: 0.86rem; font-weight: 600; color: var(--t1); cursor: pointer; }
.ce-check input { width: 17px; height: 17px; accent-color: #16a34a; cursor: pointer; }
.ce-txrow { display: flex; gap: 8px; }
.ce-regen { flex-shrink: 0; height: 44px; padding: 0 16px; border-radius: 11px; cursor: pointer; background: var(--bg); border: 1px solid var(--border); color: var(--t2); font-family: inherit; font-size: 0.82rem; font-weight: 700; }
.ce-regen:hover { color: var(--t1); border-color: var(--accent-border); }
.ce-smtp { margin: 0; font-size: 0.78rem; color: var(--t3); }
.ce-smtp__link { color: #16a34a; font-weight: 700; cursor: pointer; }
.ce-smtp__link:hover { text-decoration: underline; }
.ce-send { height: 50px; border-radius: 12px; border: none; cursor: pointer; font-family: inherit; font-size: 0.92rem; font-weight: 800; transition: filter 0.15s ease, transform 0.15s ease; }
.ce-send:hover { filter: brightness(1.05); transform: translateY(-1px); }

/* Preview */
.ce-preview-wrap { position: sticky; top: 16px; }
.ce-preview-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 4px 12px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em; color: var(--t3); flex-wrap: wrap; }
.ce-subject { font-weight: 500; }
.ce-subject strong { color: var(--t2); font-weight: 700; }
.ce-email { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; max-height: 560px; overflow-y: auto; }
.ce-email__header { background: #181a20; padding: 20px 28px; display: flex; align-items: center; gap: 10px; font-size: 1.25rem; font-weight: 800; }
.ce-email__logo { width: 24px; height: 24px; object-fit: contain; }
.ce-email__body { padding: 24px 28px; }
.ce-email__title { margin: 0 0 14px; font-size: 1.15rem; font-weight: 800; color: #111827; }
.ce-email__p { margin: 0 0 16px; font-size: 0.84rem; line-height: 1.6; color: #374151; }
.ce-email__p a, .ce-email__fine a { text-decoration: underline; cursor: pointer; }
.ce-email__note { margin: 0 0 16px; font-size: 0.82rem; color: #374151; background: #f9fafb; border-left: 3px solid #d1d5db; padding: 10px 12px; border-radius: 4px; }
.ce-email__btn { display: inline-block; padding: 11px 20px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; text-decoration: none; margin-bottom: 16px; }
.ce-email__muted { margin: 0 0 16px; font-size: 0.8rem; color: #6b7280; }
.ce-email__divider { border: none; border-top: 1px solid; margin: 4px 0 18px; }
.ce-email__connect { margin: 0 0 12px; text-align: center; font-weight: 800; font-size: 0.92rem; }
.ce-email__social { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 18px; }
.ce-email__fine { margin: 0 0 10px; font-size: 0.68rem; line-height: 1.55; color: #6b7280; }
.ce-email__copy { margin: 14px 0 0; text-align: center; font-size: 0.68rem; color: #9ca3af; }

/* Coinbase template */
.ce-cb { padding: 28px 24px; text-align: center; }
.ce-cb__brand { color: #fff; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 20px; }
.ce-cb__card { background: #fff; border-radius: 10px; padding: 28px 22px; }
.ce-cb__check { width: 60px; height: 60px; border-radius: 50%; border: 2.5px solid; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
.ce-cb__lead { margin: 0; font-size: 0.84rem; color: #6b7280; }
.ce-cb__amt { margin: 2px 0 0; font-size: 0.95rem; font-weight: 700; color: #111827; }
.ce-cb__net { margin: 2px 0 0; font-size: 0.78rem; color: #6b7280; }
.ce-cb__hr { height: 1px; background: #e5e7eb; margin: 18px 0; }
.ce-cb__body { margin: 0 0 16px; font-size: 0.8rem; line-height: 1.6; color: #6b7280; }
.ce-cb__body a { text-decoration: none; }
.ce-cb__note { margin: 0 0 16px; font-size: 0.8rem; color: #374151; background: #f3f4f6; border-radius: 6px; padding: 10px 12px; }
.ce-cb__btn { display: inline-block; padding: 11px 22px; border-radius: 6px; color: #fff; font-size: 0.84rem; font-weight: 700; text-decoration: none; }
.ce-cb__app-label { color: #fff; font-size: 0.78rem; font-weight: 700; margin: 20px 0 10px; }
.ce-cb__badges { display: flex; align-items: center; justify-content: center; gap: 10px; }

/* Kraken template */
.ce-kr { background: #e6e6ec; padding: 24px; text-align: center; }
.ce-kr__brand { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1.5rem; font-weight: 800; margin-bottom: 18px; }
.ce-kr__logo { width: 26px; height: 26px; object-fit: contain; }
.ce-kr__card { background: #fff; border-radius: 4px; padding: 30px 24px; }
.ce-kr__body { margin: 0 0 14px; font-size: 0.86rem; line-height: 1.6; color: #4b5563; }
.ce-kr__note { margin: 0 0 14px; font-size: 0.82rem; color: #374151; background: #f3f4f6; border-radius: 6px; padding: 10px 12px; }
.ce-kr__btn { display: inline-block; margin-top: 6px; padding: 11px 20px; border-radius: 4px; color: #fff; font-size: 0.84rem; font-weight: 700; text-decoration: underline; }
.ce-kr__foot { margin: 18px 0 0; font-size: 0.8rem; color: #6b7280; line-height: 1.6; }
.ce-kr__team { margin: 16px 0 0; font-size: 0.82rem; color: #6b7280; }

/* Blockchain.com template */
.ce-bc2 { background: #fff; }
.ce-bc2__topbar { height: 44px; background: #c7ccd4; }
.ce-bc2__card { padding: 26px 28px; }
.ce-bc2__wallet { font-size: 1rem; font-weight: 800; color: #111827; margin-bottom: 18px; }
.ce-bc2__title { margin: 0 0 14px; font-size: 1.2rem; font-weight: 800; color: #111827; line-height: 1.3; }
.ce-bc2__body { margin: 0 0 18px; font-size: 0.78rem; font-weight: 700; color: #111827; line-height: 1.5; }
.ce-bc2__note { margin: 0 0 16px; font-size: 0.8rem; color: #374151; background: #f3f4f6; border-radius: 6px; padding: 10px 12px; }
.ce-bc2__btn { display: inline-block; padding: 12px 26px; border-radius: 8px; color: #fff; font-size: 0.86rem; font-weight: 700; text-decoration: none; margin-bottom: 20px; }
.ce-bc2__sign { margin: 0 0 20px; font-size: 0.82rem; color: #111827; line-height: 1.7; }
.ce-bc2__hr { height: 1px; background: #111827; margin: 18px 0; }
.ce-bc2__social { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 14px; }
.ce-bc2__badges { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 16px; }
.ce-bc2__footer { background: #d7dbe0; border-radius: 4px; padding: 16px 18px; font-size: 0.72rem; font-weight: 700; color: #374151; line-height: 1.8; }

/* Bitcoin.com template */
.ce-btc { padding: 26px 22px; text-align: center; }
.ce-btc__card { background: #fff; border-radius: 14px; padding: 26px 22px; }
.ce-btc__logo { width: 46px; height: 46px; border-radius: 12px; margin: 0 auto 14px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.ce-btc__logo img { width: 100%; height: 100%; object-fit: contain; }
.ce-btc__label { margin: 0; font-size: 0.86rem; color: #374151; }
.ce-btc__amt { margin: 6px 0 16px; font-size: 1.6rem; font-weight: 800; color: #111827; }
.ce-btc__body { margin: 0 0 4px; font-size: 0.82rem; color: #6b7280; line-height: 1.6; }
.ce-btc__note { margin: 12px 0 0; font-size: 0.8rem; color: #374151; background: #f3f4f6; border-radius: 6px; padding: 10px 12px; }
.ce-btc__support { margin: 20px 0 0; text-align: center; color: #fff; font-size: 0.84rem; font-weight: 800; }

/* ByBit template */
.ce-bb { background: #fff; }
.ce-bb__header { background: #0b0e11; padding: 22px 26px; display: flex; align-items: center; gap: 10px; }
.ce-bb__logo { color: #fff; font-size: 1.7rem; font-weight: 900; letter-spacing: 0.02em; }
.ce-bb__tag { color: #8b949e; font-size: 0.68rem; font-weight: 700; line-height: 1.1; }
.ce-bb__body { padding: 22px 26px; }
.ce-bb__body p { margin: 0 0 11px; font-size: 0.8rem; color: #1f2937; line-height: 1.5; }
.ce-bb__body a { text-decoration: underline; }
.ce-bb__link { color: #1652f0 !important; cursor: pointer; }
.ce-bb__note { background: #f3f4f6; border-radius: 6px; padding: 10px 12px; color: #374151 !important; }

@media (max-width: 1024px) {
  .provider-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .ce-grid { grid-template-columns: 1fr; }
  .ce-preview-wrap { position: static; }
}
@media (max-width: 768px) {
  .provider-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
}
@media (max-width: 430px) { .provider-grid { grid-template-columns: 1fr 1fr; gap: 8px; } }
</style>
