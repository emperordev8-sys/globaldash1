// src/composables/useTour.js
// Lightweight product-tour state, shared app-wide (module-level singleton).
import { ref } from 'vue'

const active = ref(false)
const stepIndex = ref(0)
const steps = ref([])

// Default guided tour. Each step points at an element via a CSS selector
// (data-tour="..."). Steps whose target isn't on screen are skipped
// automatically, so the same tour works on desktop and mobile.
export const defaultTourSteps = [
  {
    target: null, // centered welcome card, no spotlight
    center: true,
    title: 'Welcome to your dashboard 👋',
    body: "This is your home base. Give us 20 seconds and we'll point out the essentials — you can skip anytime.",
  },
  {
    target: '[data-tour="stats"]',
    title: 'Your account at a glance',
    body: 'Wallet balance, your active plan and recent activity all live up here, so you always know where you stand.',
  },
  {
    target: '[data-tour="header-actions"]',
    title: 'Top up & choose a plan',
    body: 'These two buttons unlock everything: add money to your wallet, and pick or upgrade your plan. Most features draw from your wallet, and a plan adds discounts on top.',
  },
  {
    target: '[data-tour="recent"]',
    title: 'Your recent activity',
    body: "Your latest wallet transactions and payments show here — tap 'See all' on either to open the full history whenever you need it.",
  },
  {
    target: '[data-tour="quick-actions"]',
    title: 'Jump straight into anything',
    body: 'Quick Actions get you into any service in one click — and the sidebar on the left has every feature grouped by category.',
  },
]

export function useTour() {
  function start(tourSteps = defaultTourSteps) {
    steps.value = tourSteps
    stepIndex.value = 0
    active.value = true
  }
  function stop() {
    active.value = false
  }
  function next() {
    if (stepIndex.value < steps.value.length - 1) stepIndex.value++
    else stop()
  }
  function prev() {
    if (stepIndex.value > 0) stepIndex.value--
  }
  function goTo(i) {
    if (i >= 0 && i < steps.value.length) stepIndex.value = i
  }
  return { active, stepIndex, steps, start, stop, next, prev, goTo }
}
