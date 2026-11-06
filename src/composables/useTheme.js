// src/composables/useTheme.js
import { ref } from 'vue'

const STORAGE_KEY = 'globalgle_theme'
const theme = ref(localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark')

let transitionTimer = null

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
}

applyTheme(theme.value)

function setTheme(value) {
  const root = document.documentElement
  root.classList.add('theme-transitioning')
  clearTimeout(transitionTimer)

  theme.value = value
  localStorage.setItem(STORAGE_KEY, value)
  applyTheme(value)

  transitionTimer = setTimeout(() => {
    root.classList.remove('theme-transitioning')
  }, 200)
}

export function useTheme() {
  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme(theme.value === 'dark' ? 'light' : 'dark'),
  }
}
