<!-- src/views/AuthView.vue -->
<template>
  <div class="auth-page">

    <!-- Toast notification -->
    <Transition name="toast-slide">
      <div v-if="toast.show" class="auth-toast" :class="`auth-toast--${toast.type}`">
        <svg v-if="toast.type === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Background orbs -->
    <div class="auth-orb auth-orb--1" />
    <div class="auth-orb auth-orb--2" />

    <div class="auth-card">

      <!-- Icon -->
      <div class="auth-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>

      <!-- Title -->
      <div class="auth-titles">
        <h1 class="auth-title">Site Admin</h1>
        <p class="auth-sub">Sign in to <span class="auth-brand">Globalgle</span></p>
      </div>

      <!-- Form -->
      <form class="auth-form" @submit.prevent="unlock">
        <div class="auth-input-wrap">
          <svg class="auth-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            v-model="code"
            :type="showPass ? 'text' : 'password'"
            class="auth-input"
            placeholder="Enter access code"
            autocomplete="current-password"
            autofocus
          />
          <button type="button" class="auth-eye" @click="showPass = !showPass" tabindex="-1">
            <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>

        <button type="submit" class="auth-btn" :class="{ 'auth-btn--loading': loading }">
          <span v-if="!loading">Unlock Dashboard →</span>
          <span v-else class="auth-spinner" />
        </button>
      </form>

      <p class="auth-footer">Protected by Globalgle Security</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router   = useRouter()
const code     = ref('')
const showPass = ref(false)
const loading  = ref(false)
const toast    = ref({ show: false, type: 'error', message: '' })

let toastTimer = null

function showToast(type, message) {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

function unlock() {
  if (!code.value.trim()) {
    showToast('error', 'Please enter an access code.')
    return
  }
  loading.value = true

  setTimeout(() => {
    if (code.value.trim() === 'globalgle') {
      showToast('success', 'Access granted! Loading dashboard...')
      localStorage.setItem('globalgle_auth', 'true')
      setTimeout(() => router.push('/'), 800)
    } else {
      showToast('error', 'Incorrect access code. Please try again.')
      loading.value = false
      code.value    = ''
    }
  }, 600)
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* Ambient orbs */
.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.auth-orb--1 {
  width: 420px; height: 420px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.06);
  top: -100px; left: -100px;
}
.auth-orb--2 {
  width: 360px; height: 360px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.04);
  bottom: -80px; right: -80px;
}

/* Card */
.auth-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 360px;
  background: var(--modal-glass);
  backdrop-filter: blur(60px) saturate(180%) brightness(0.85);
  -webkit-backdrop-filter: blur(60px) saturate(180%) brightness(0.85);
  border: 1px solid var(--modal-border);
  border-radius: 22px;
  padding: 32px 28px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Lock icon box */
.auth-icon {
  width: 64px; height: 64px;
  border-radius: 18px;
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.12);
  border: 1px solid rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.25);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.15);
}

/* Titles */
.auth-titles { text-align: center; display: flex; flex-direction: column; gap: 4px; }
.auth-title  { font-size: 1.4rem; font-weight: 800; color: var(--t1); margin: 0; letter-spacing: -0.02em; }
.auth-sub    { font-size: 0.85rem; color: var(--t3); margin: 0; }
.auth-brand  { color: var(--accent); font-weight: 700; }

/* Form */
.auth-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-input-wrap {
  display: flex; align-items: center; gap: 10px;
  background: var(--modal-input);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0 14px;
  transition: border-color 0.2s, background 0.2s;
}
.auth-input-wrap:focus-within {
  border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.5);
  background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.04);
}
.auth-input-icon { color: var(--t3); flex-shrink: 0; }

.auth-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 14px 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.9rem;
  color: var(--t1);
  letter-spacing: 0.02em;
}
.auth-input::placeholder { color: var(--t3); }

.auth-eye {
  background: none; border: none; cursor: pointer;
  color: var(--t3); display: flex; align-items: center;
  padding: 0; flex-shrink: 0; transition: color 0.2s;
}
.auth-eye:hover { color: var(--t2); }

/* Button */
.auth-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, var(--accent), #d94010);
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.3);
  min-height: 50px;
}
.auth-btn:hover  { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.4); }
.auth-btn:active { transform: translateY(0); }
.auth-btn--loading { opacity: 0.7; pointer-events: none; }

/* Spinner */
.auth-spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Footer */
.auth-footer {
  font-size: 0.72rem;
  color: var(--t2);
  margin: 0;
  letter-spacing: 0.03em;
}

/* ── Responsive breakpoints ── */

/* Large desktop */
@media (min-width: 1200px) {
  .auth-card  { max-width: 380px; padding: 36px 32px 28px; }
  .auth-icon  { width: 64px; height: 64px; border-radius: 18px; }
  .auth-title { font-size: 1.45rem; }
  .auth-orb--1 { width: 600px; height: 600px; }
  .auth-orb--2 { width: 500px; height: 500px; }
}

/* Tablet landscape / small laptop */
@media (max-width: 1024px) {
  .auth-card  { max-width: 350px; padding: 30px 26px 24px; }
}

/* Tablet portrait */
@media (max-width: 768px) {
  .auth-card  { max-width: 340px; padding: 28px 24px 22px; gap: 14px; }
  .auth-title { font-size: 1.3rem; }
  .auth-orb--1 { width: 300px; height: 300px; }
  .auth-orb--2 { width: 260px; height: 260px; }
}

/* Large mobile */
@media (max-width: 600px) {
  .auth-page  { padding: 16px; align-items: center; }
  .auth-card  { max-width: 320px; padding: 26px 20px 20px; border-radius: 20px; gap: 13px; }
  .auth-icon  { width: 56px; height: 56px; border-radius: 15px; }
  .auth-title { font-size: 1.2rem; }
  .auth-input { font-size: 0.88rem; }
  .auth-btn   { font-size: 0.9rem; min-height: 46px; }
}

/* Mobile */
@media (max-width: 430px) {
  .auth-page  { padding: 14px; }
  .auth-card  { max-width: 100%; padding: 24px 16px 20px; border-radius: 18px; gap: 12px; }
  .auth-icon  { width: 50px; height: 50px; border-radius: 13px; }
  .auth-title { font-size: 1.1rem; }
  .auth-sub   { font-size: 0.8rem; }
  .auth-input { font-size: 0.85rem; padding: 11px 0; }
  .auth-btn   { font-size: 0.88rem; min-height: 44px; }
  .auth-footer { font-size: 0.68rem; }
  .auth-orb--1 { width: 200px; height: 200px; top: -60px; left: -60px; }
  .auth-orb--2 { width: 180px; height: 180px; bottom: -50px; right: -50px; }
}

/* Small mobile */
@media (max-width: 360px) {
  .auth-card  { padding: 20px 14px 18px; border-radius: 16px; gap: 11px; }
  .auth-icon  { width: 44px; height: 44px; border-radius: 12px; }
  .auth-title { font-size: 1rem; }
  .auth-btn   { font-size: 0.84rem; min-height: 42px; }
}

/* Toast responsive */
@media (max-width: 600px) {
  .auth-toast {
    white-space: normal;
    width: calc(100% - 32px);
    max-width: 340px;
    text-align: center;
    justify-content: center;
    font-size: 0.82rem;
    padding: 11px 16px;
  }
}

/* ── Toast ── */
.auth-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 20px;
  border-radius: 16px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.83rem;
  font-weight: 700;
  white-space: nowrap;
  background: linear-gradient(160deg, var(--surface-raised) 0%, var(--surface-sunken) 100%);
  border: 1px solid var(--border);
  color: var(--t1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4);
  pointer-events: none;
}
.auth-toast--error {
  border-left: 3px solid #f87171;
}
.auth-toast--error svg { color: #f87171; }
.auth-toast--success {
  border-left: 3px solid var(--accent);
}
.auth-toast--success svg { color: var(--accent); }

/* Toast transition */
.toast-slide-enter-active { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.toast-slide-leave-active { transition: all 0.25s ease; }
.toast-slide-enter-from  { opacity: 0; transform: translateX(-50%) translateY(-16px); }
.toast-slide-leave-to    { opacity: 0; transform: translateX(-50%) translateY(-8px); }
</style>
