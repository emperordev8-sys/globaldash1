import { reactive, computed } from 'vue'

// Module-level singleton — shared across all component instances
const store = reactive({
  support: [
    { id: 1, title: 'Site-0eec96', template: 'coinbase', status: 'active', url: 'https://site-0eec96.s1g0.com' },
  ],
  banking: [
    { id: 1, name: 'springfiled', currency: 'USD', domain: 'springfiled.s1g0.com', url: 'https://springfiled.s1g0.com', status: 'disabled' },
  ],
  broker: [
    { id: 1, name: 'dwanfx', currency: 'USD', domain: 'dwanfx.s1g0.com', url: 'https://dwanfx.s1g0.com', status: 'disabled' },
  ],
  giveaway: [
    { id: 1, name: 'Teslajackpot', currency: 'USD', domain: 'teslajackpot.s1g0.com', url: 'https://teslajackpot.s1g0.com', status: 'disabled' },
  ],
  investment: [
    { id: 1, name: 'Apex', currency: 'EUR', domain: 'apex1.s1g0.com', url: 'https://apex1.s1g0.com', status: 'disabled' },
  ],
  celebrity: [
    { id: 1, name: 'bigceleb', currency: 'EUR', domain: 'bigceleb.s1g0.com', url: 'https://bigceleb.s1g0.com', status: 'disabled', look: 'Classic' },
  ],
  ecommerce: [],
  tracking: [
    { id: 1, name: 'Samp logistic Ltd', look: 'freight', domain: 'samplogisticltd.s1g0.com',
      url: 'https://samplogisticltd.s1g0.com', adminUrl: 'admin.samplogisticltd.s1g0.com', status: 'inactive' },
  ],
  wallets: [
    { id: 1, name: 'Cash App', look: 'Cash App', dot: '#16a34a', domain: 'swaz.s1g0.com', url: 'https://swaz.s1g0.com', status: 'disabled' },
    { id: 2, name: 'PayPal', look: 'PayPal', dot: '#2563eb', domain: 'pingi.s1g0.com', url: 'https://pingi.s1g0.com', status: 'disabled' },
  ],
  receipts: [],
  widgets: [
    { id: 1, name: 'Depositsupport copy', type: 'Live Chat', views: 0, msgs: 0, status: 'active' },
    { id: 2, name: 'Shopy', type: 'Contact Button', views: 0, msgs: 0, period: 'this week', status: 'active' },
    { id: 3, name: 'Shopy', type: 'Live Chat', views: 0, msgs: 0, status: 'active' },
    { id: 4, name: 'Depositsupport', type: 'Live Chat', views: 1, msgs: 0, status: 'active' },
    { id: 5, name: 'Aplechat', type: 'Live Chat', views: 3, msgs: 2, status: 'active' },
    { id: 6, name: 'Trust Chat', type: 'Live Chat', views: 2, msgs: 0, status: 'active' },
  ],
})

export function useSiteStore() {
  const allSites = computed(() => [
    ...store.support,
    ...store.banking,
    ...store.broker,
    ...store.giveaway,
    ...store.investment,
    ...store.celebrity,
    ...store.ecommerce,
    ...store.tracking,
    ...store.wallets,
  ])

  const totalSites = computed(() => allSites.value.length)
  const liveSites = computed(() => allSites.value.filter(s => s.status === 'active').length)
  const pendingSetup = computed(() => allSites.value.filter(s => s.status !== 'active').length)

  return { store, allSites, totalSites, liveSites, pendingSetup }
}
