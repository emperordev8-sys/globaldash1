// src/composables/useSidebar.js
import { ref } from 'vue'

const sidebarOpen  = ref(false)  // mobile overlay
const desktopOpen  = ref(true)   // desktop/tablet slide toggle

export function useSidebar() {
  return {
    sidebarOpen,
    desktopOpen,
    openSidebar:          () => { sidebarOpen.value = true  },
    closeSidebar:         () => { sidebarOpen.value = false },
    toggleSidebar:        () => { sidebarOpen.value = !sidebarOpen.value },
    toggleDesktopSidebar: () => { desktopOpen.value = !desktopOpen.value },
  }
}
