import { reactive, computed } from 'vue'

// Module-level singleton — shared across all component instances
const store = reactive({
  support: [
    { id: 1, title: 'Cash App support', template: 'cashapp', status: 'active',
      url: '#', address: 'cashapp.customers-help-center.com', reachType: 'subdomain',
      visitorSupport: 'widget', active: true },
  ],
  banking: [
    { id: 1, name: 'TradeBank', currency: 'USD', domain: 'tra.qst1x.com', url: '#', status: 'active' },
  ],
  broker: [],
  tracking: [
    { id: 1, name: 'GG', logoUrl: '', domain: 'quink.qst1x.com', adminUrl: 'admin.quink.qst1x.com',
      status: 'active', gradient: 'linear-gradient(135deg,#f97316,#9333ea)',
      template: 'express', reachType: 'subdomain', accessCode: '12345' },
  ],
})

export function useSiteStore() {
  const allSites = computed(() => [
    ...store.support,
    ...store.banking,
    ...store.broker,
    ...store.tracking,
  ])

  const totalSites   = computed(() => allSites.value.length)
  const liveSites    = computed(() => allSites.value.filter(s => s.status === 'active').length)
  const pendingSetup = computed(() => allSites.value.filter(s => s.status !== 'active').length)

  return { store, allSites, totalSites, liveSites, pendingSetup }
}
