// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useLoader } from '../composables/useLoader.js'

import AuthView           from '../views/AuthView.vue'
import DashboardView      from '../views/DashboardView.vue'
import CustomersView      from '../views/CustomersView.vue'
import TransactionsView   from '../views/TransactionsView.vue'
import AnalyticsView      from '../views/AnalyticsView.vue'
import SettingsView       from '../views/SettingsView.vue'
import HelpView           from '../views/HelpView.vue'
import ComplaintView      from '../views/ComplaintView.vue'
import BrandedEmailsView  from '../views/BrandedEmailsView.vue'
import BrandedBillsView   from '../views/BrandedBillsView.vue'
import EmailComposerView  from '../views/EmailComposerView.vue'
import BankMailerView     from '../views/BankMailerView.vue'
import ToolsView               from '../views/ToolsView.vue'
import CryptoReceiptsView        from '../views/CryptoReceiptsView.vue'
import TransactionsTrackerView  from '../views/TransactionsTrackerView.vue'
import ReceiptsTrackingView    from '../views/ReceiptsTrackingView.vue'
import PaymentTrackingView    from '../views/PaymentTrackingView.vue'
import DigitalView            from '../views/DigitalView.vue'
import CurrencyConverterView   from '../views/CurrencyConverterView.vue'
import WalletFundingView       from '../views/WalletFundingView.vue'
import SmsSenderView           from '../views/SmsSenderView.vue'
import SpoofCallingView        from '../views/SpoofCallingView.vue'
import WalletView              from '../views/WalletView.vue'
import BillingView             from '../views/BillingView.vue'
import TutorialsView           from '../views/TutorialsView.vue'
import BankReceiptView         from '../views/BankReceiptView.vue'
import SupportPagesView        from '../views/SupportPagesView.vue'
import OnlineBankingView       from '../views/OnlineBankingView.vue'
import BrokerView              from '../views/BrokerView.vue'
import TrackingPagesView       from '../views/TrackingPagesView.vue'

const routes = [
  { path: '/auth',                         name: 'Auth',           component: AuthView,  meta: { public: true } },
  { path: '/',                            name: 'Dashboard',      component: DashboardView     },
  { path: '/customers',                   name: 'Customers',      component: CustomersView     },
  { path: '/email-services/branded-emails', name: 'BrandedEmails',  component: BrandedEmailsView },
  { path: '/email-services/branded-bills',  name: 'BrandedBills',   component: BrandedBillsView  },
  { path: '/email-services/composer',       name: 'EmailComposer',  component: EmailComposerView },
  { path: '/email-services/bank-mailer',    name: 'BankMailer',     component: BankMailerView    },
  { path: '/transactions',  name: 'Transactions', component: TransactionsView },
  { path: '/analytics',     name: 'Analytics',    component: AnalyticsView    },
  { path: '/settings',      name: 'Settings',     component: SettingsView     },
  { path: '/help',          name: 'Help',         component: HelpView         },
  { path: '/tools',                   name: 'Tools',          component: ToolsView          },
  { path: '/tools/crypto-receipts',        name: 'CryptoReceipts',       component: CryptoReceiptsView       },
  { path: '/tools/transactions-tracker',          name: 'TransactionsTracker',  component: TransactionsTrackerView  },
  { path: '/tools/transactions-tracker/receipts', name: 'ReceiptsTracking',  component: ReceiptsTrackingView  },
  { path: '/tools/transactions-tracker/payment', name: 'PaymentTracking',   component: PaymentTrackingView   },
  { path: '/tools/currency',       name: 'CurrencyConverter', component: CurrencyConverterView },
  { path: '/digital',              name: 'Digital',          component: DigitalView        },
  { path: '/tools/wallet-funding', name: 'WalletFunding',    component: WalletFundingView  },
  { path: '/tools/sms-sender',    name: 'SmsSender',     component: SmsSenderView    },
  { path: '/tools/spoof-calling', name: 'SpoofCalling',  component: SpoofCallingView },
  { path: '/tools/bank-receipt', name: 'BankReceipt',   component: BankReceiptView  },
  { path: '/wallet',        name: 'Wallet',       component: WalletView       },
  { path: '/billing',       name: 'Billing',      component: BillingView      },
  { path: '/tutorials',     name: 'Tutorials',    component: TutorialsView    },
  { path: '/support-pages',  name: 'SupportPages',  component: SupportPagesView  },
  { path: '/online-banking', name: 'OnlineBanking', component: OnlineBankingView },
  { path: '/broker',          name: 'Broker',         component: BrokerView         },
  { path: '/tracking-pages', name: 'TrackingPages', component: TrackingPagesView  },
  { path: '/complaint',     name: 'Complaint',    component: ComplaintView    },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const { loading } = useLoader()

router.beforeEach((to) => {
  loading.value = true
  const authed = localStorage.getItem('globalgle_auth') === 'true'
  if (!authed && !to.meta.public) return '/auth'
  if (authed && to.path === '/auth') return '/'
})
router.afterEach(() => { loading.value = false })

export default router