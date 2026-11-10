// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useLoader } from '../composables/useLoader.js'

import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import CustomersView from '../views/CustomersView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import SettingsView from '../views/SettingsView.vue'
import HelpView from '../views/HelpView.vue'
import ComplaintView from '../views/ComplaintView.vue'
import BrandedEmailsView from '../views/BrandedEmailsView.vue'
import BrandedBillsView from '../views/BrandedBillsView.vue'
import EmailComposerView from '../views/EmailComposerView.vue'
import BankMailerView from '../views/BankMailerView.vue'
import ToolsView from '../views/ToolsView.vue'
import CryptoReceiptsView from '../views/CryptoReceiptsView.vue'
import TransactionsTrackerView from '../views/TransactionsTrackerView.vue'
import ReceiptsTrackingView from '../views/ReceiptsTrackingView.vue'
import PaymentTrackingView from '../views/PaymentTrackingView.vue'
import DigitalView from '../views/DigitalView.vue'
import CurrencyConverterView from '../views/CurrencyConverterView.vue'
import WalletFundingView from '../views/WalletFundingView.vue'
import SmsSenderView from '../views/SmsSenderView.vue'
import SpoofCallingView from '../views/SpoofCallingView.vue'
import WalletView from '../views/WalletView.vue'
import BillingView from '../views/BillingView.vue'
import TutorialsView from '../views/TutorialsView.vue'
import BankReceiptView from '../views/BankReceiptView.vue'
import SupportPagesView from '../views/SupportPagesView.vue'
import OnlineBankingView from '../views/OnlineBankingView.vue'
import BrokerView from '../views/BrokerView.vue'
import TrackingPagesView from '../views/TrackingPagesView.vue'
import ResellingView from '../views/ResellingView.vue'
import WebsiteCreatorView from '../views/WebsiteCreatorView.vue'
import TeslaGiveawayView from '../views/TeslaGiveawayView.vue'
import TeslaInvestmentView from '../views/TeslaInvestmentView.vue'
import CelebrityView from '../views/CelebrityView.vue'
import EcommerceView from '../views/EcommerceView.vue'
import WebsiteWidgetsView from '../views/WebsiteWidgetsView.vue'
import WalletsView from '../views/WalletsView.vue'
import VoiceNotesView from '../views/VoiceNotesView.vue'
import BuyAccountView from '../views/BuyAccountView.vue'
import SmsVerificationView from '../views/SmsVerificationView.vue'
import EsimView from '../views/EsimView.vue'
import AccountVerificationView from '../views/AccountVerificationView.vue'

const routes = [
  { path: '/auth', name: 'Auth', component: AuthView, meta: { public: true } },
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/customers', name: 'Customers', component: CustomersView },
  { path: '/email-services/branded-emails', name: 'BrandedEmails', component: BrandedEmailsView },
  { path: '/email-services/branded-bills', name: 'BrandedBills', component: BrandedBillsView },
  { path: '/email-services/composer', name: 'EmailComposer', component: EmailComposerView },
  { path: '/email-services/bank-mailer', name: 'BankMailer', component: BankMailerView },
  { path: '/transactions', name: 'Transactions', component: TransactionsView },
  { path: '/analytics', name: 'Analytics', component: AnalyticsView },
  { path: '/settings', name: 'Settings', component: SettingsView },
  { path: '/help', name: 'Help', component: HelpView },
  { path: '/tools', name: 'Tools', component: ToolsView },
  { path: '/tools/crypto-receipts', name: 'CryptoReceipts', component: CryptoReceiptsView },
  { path: '/tools/transactions-tracker', name: 'TransactionsTracker', component: TransactionsTrackerView },
  { path: '/tools/transactions-tracker/receipts', name: 'ReceiptsTracking', component: ReceiptsTrackingView },
  { path: '/tools/transactions-tracker/payment', name: 'PaymentTracking', component: PaymentTrackingView },
  { path: '/tools/currency', name: 'CurrencyConverter', component: CurrencyConverterView },
  { path: '/digital', name: 'Digital', component: DigitalView },
  { path: '/tools/wallet-funding', name: 'WalletFunding', component: WalletFundingView },
  { path: '/tools/sms-sender', name: 'SmsSender', component: SmsSenderView },
  { path: '/tools/sms-verification', name: 'SmsVerification', component: SmsVerificationView },
  { path: '/tools/esim', name: 'Esim', component: EsimView },
  { path: '/tools/account-verification', name: 'AccountVerification', component: AccountVerificationView },
  { path: '/tools/spoof-calling', name: 'SpoofCalling', component: SpoofCallingView },
  { path: '/tools/voice-notes', name: 'VoiceNotes', component: VoiceNotesView },
  { path: '/tools/buy-account', name: 'BuyAccount', component: BuyAccountView },
  { path: '/tools/bank-receipt', name: 'BankReceipt', component: BankReceiptView },
  { path: '/wallet', name: 'Wallet', component: WalletView },
  { path: '/billing', name: 'Billing', component: BillingView },
  { path: '/tutorials', name: 'Tutorials', component: TutorialsView },
  { path: '/support-pages', name: 'SupportPages', component: SupportPagesView },
  { path: '/online-banking', name: 'OnlineBanking', component: OnlineBankingView },
  { path: '/broker', name: 'Broker', component: BrokerView },
  { path: '/tracking-pages', name: 'TrackingPages', component: TrackingPagesView },
  { path: '/complaint', name: 'Complaint', component: ComplaintView },
  { path: '/reselling', name: 'Reselling', component: ResellingView },
  { path: '/website-creator', name: 'WebsiteCreator', component: WebsiteCreatorView },
  { path: '/tesla-giveaway', name: 'TeslaGiveaway', component: TeslaGiveawayView },
  { path: '/tesla-investment', name: 'TeslaInvestment', component: TeslaInvestmentView },
  { path: '/celebrity', name: 'Celebrity', component: CelebrityView },
  { path: '/ecommerce', name: 'Ecommerce', component: EcommerceView },
  { path: '/website-widgets', name: 'WebsiteWidgets', component: WebsiteWidgetsView },
  { path: '/wallets', name: 'Wallets2', component: WalletsView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const { loading } = useLoader()

router.beforeEach(() => {
  loading.value = true
})
router.afterEach(() => { loading.value = false })

export default router