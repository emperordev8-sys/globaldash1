<!-- src/components/ui/ToastContainer.vue -->
<template>
  <Teleport to="body">
    <div class="toast-stack" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="['toast', `toast--${t.type}`]"
          role="alert"
        >
          <!-- Icon -->
          <div class="toast__icon">
            <svg v-if="t.type === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else-if="t.type === 'error'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <svg v-else-if="t.type === 'warning'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
          </div>

          <!-- Text -->
          <div class="toast__body">
            <p class="toast__title">{{ t.title }}</p>
            <p v-if="t.message" class="toast__msg">{{ t.message }}</p>
          </div>

          <!-- Close -->
          <button class="toast__close" @click="remove(t.id)" aria-label="Dismiss">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../../composables/useToast.js'
const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: 360px;
  width: calc(100vw - 40px);
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--border);
  pointer-events: all;
  background: linear-gradient(160deg, var(--surface-raised) 0%, var(--surface-sunken) 100%);
  box-shadow: 0 16px 48px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Left accent bar */
.toast::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 16px 0 0 16px;
}

/* Colour variants */
.toast--success::before { background: var(--accent); }
.toast--success .toast__icon { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.18); color: var(--accent); border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25); }
.toast--success .toast__title { color: var(--t1); }

.toast--error::before { background: #f87171; }
.toast--error .toast__icon { background: rgba(248,113,113,0.18); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }
.toast--error .toast__title { color: var(--t1); }

.toast--warning::before { background: #fbbf24; }
.toast--warning .toast__icon { background: rgba(251,191,36,0.18); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
.toast--warning .toast__title { color: var(--t1); }

.toast--info::before { background: #60a5fa; }
.toast--info .toast__icon { background: rgba(96,165,250,0.18); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }
.toast--info .toast__title { color: var(--t1); }

.toast__icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 6px;
}

.toast__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.toast__title {
  font-size: 0.83rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.3;
}
.toast__msg {
  font-size: 0.75rem;
  color: var(--t2);
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.toast__close {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--t2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
  margin-top: 2px;
}
.toast__close:hover { background: var(--glass-hover); color: var(--t1); }

/* Animations */
.toast-enter-active { transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.22s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(60px) scale(0.9); }
.toast-leave-to     { opacity: 0; transform: translateX(60px) scale(0.95); }
.toast-move         { transition: transform 0.22s ease; }

/* Mobile — bottom centre */
@media (max-width: 600px) {
  .toast-stack {
    top: auto;
    bottom: 90px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    align-items: center;
    width: calc(100vw - 32px);
  }
  .toast-enter-from,
  .toast-leave-to { transform: translateY(20px) scale(0.95); }
}

</style>
