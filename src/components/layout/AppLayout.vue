<!-- src/components/layout/AppLayout.vue -->
<template>
  <div class="app-layout">
    <BootSplash />
    <PageLoader />
    <ToastContainer />
    <TourOverlay />
    <TourLauncher />
    <AppSidebar />
    <div class="app-layout__main" :class="{ 'app-layout__main--collapsed': !desktopOpen }">
      <AppNavbar />
      <main class="app-layout__content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppNavbar from './AppNavbar.vue'
import PageLoader from '../ui/PageLoader.vue'
import BootSplash from '../ui/BootSplash.vue'
import ToastContainer from '../ui/ToastContainer.vue'
import TourOverlay from '../ui/TourOverlay.vue'
import TourLauncher from '../ui/TourLauncher.vue'
import { useSidebar } from '../../composables/useSidebar.js'

const { desktopOpen } = useSidebar()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: transparent;
  position: relative;
}

.app-layout__main {
  margin-left: 260px;
  min-height: 100vh;
  position: relative;
  transition: margin-left 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 769px) {
  .app-layout__main--collapsed { margin-left: 0; }
}

.app-layout__content {
  padding: 78px 24px 24px;
  max-width: 1320px;
  margin: 0 auto;
}

@media (max-width: 1366px) and (min-width: 769px) {
  .app-layout__main  { margin-left: 245px; }
  .app-layout__content { padding: 76px 18px 24px; }
}
@media (max-width: 768px) {
  .app-layout__main  { margin-left: 0; }
  .app-layout__content { padding: 84px 14px 90px; }
}
@media (max-width: 600px) {
  .app-layout__content { padding: 80px 12px 86px; }
}
@media (max-width: 430px) {
  .app-layout__content { padding: 76px 10px 84px; }
}
@media (max-width: 360px) {
  .app-layout__content { padding: 72px 8px 82px; }
}

.page-enter-active,
.page-leave-active { transition: all 0.3s ease; }
.page-enter-from   { opacity: 0; transform: translateY(12px); }
.page-leave-to     { opacity: 0; transform: translateY(-12px); }
</style>
