// src/composables/useTheme.js
import { ref } from 'vue'

const STORAGE_KEY = 'globalgle_theme'
const mediaQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null

function readPref() {
  const v = localStorage.getItem(STORAGE_KEY)
  return (v === 'light' || v === 'dark' || v === 'auto') ? v : 'dark'
}

function resolve(pref) {
  if (pref === 'auto') return mediaQuery && mediaQuery.matches ? 'dark' : 'light'
  return pref
}

// themePref = what the user picked (light | dark | auto) — drives the checkmark
// theme     = the actual theme applied right now (light | dark)
const themePref = ref(readPref())
const theme = ref(resolve(themePref.value))

let transitionTimer = null

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
}

function apply(animated = true) {
  const resolved = resolve(themePref.value)
  const root = document.documentElement
  if (animated) {
    root.classList.add('theme-transitioning')
    clearTimeout(transitionTimer)
    transitionTimer = setTimeout(() => root.classList.remove('theme-transitioning'), 200)
  }
  theme.value = resolved
  applyTheme(resolved)
}

// initial paint (no transition flash)
applyTheme(theme.value)

// keep "auto" in sync with the device setting
if (mediaQuery) {
  const onChange = () => { if (themePref.value === 'auto') apply() }
  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onChange)
  else if (mediaQuery.addListener) mediaQuery.addListener(onChange) // older Safari
}

function setThemePref(pref) {
  themePref.value = pref
  localStorage.setItem(STORAGE_KEY, pref)
  apply()
}

export function useTheme() {
  return {
    theme,          // resolved: 'light' | 'dark'
    themePref,      // chosen:   'light' | 'dark' | 'auto'
    setThemePref,
    setTheme: setThemePref, // backward compat
    toggleTheme: () => setThemePref(theme.value === 'dark' ? 'light' : 'dark'),
  }
}
