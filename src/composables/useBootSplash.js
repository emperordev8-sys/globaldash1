// src/composables/useBootSplash.js
import { ref } from 'vue'

const booting = ref(true)

export function useBootSplash() {
  return {
    booting,
    finishBooting: () => { booting.value = false },
  }
}
