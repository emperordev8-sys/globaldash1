<!-- src/components/ui/ActionsMenu.vue -->
<template>
  <div class="am-wrap" ref="wrapRef">
    <button class="am-dots" :class="{ 'am-dots--active': open }" aria-label="More actions" @click="open = !open">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5"  cy="12" r="2.1"/>
        <circle cx="12" cy="12" r="2.1"/>
        <circle cx="19" cy="12" r="2.1"/>
      </svg>
    </button>

    <Transition name="am-drop">
      <div v-if="open" class="am-dropdown" @click.stop>
        <button v-for="(item, i) in items" :key="i"
          :class="['am-item', { 'am-item--danger': item.variant === 'danger' }]"
          @click="trigger(item)">
          <span class="am-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" v-html="item.icon"/>
          </span>
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  items: { type: Array, required: true }, // [{ label, icon, onClick, variant?: 'danger' }]
})

const open    = ref(false)
const wrapRef = ref(null)

function trigger(item) {
  open.value = false
  item.onClick?.()
}

function handleOutsideClick(e) {
  if (!wrapRef.value?.contains(e.target)) open.value = false
}
onMounted(()       => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
.am-wrap { position: relative; flex: 0 0 auto; display: inline-flex; align-self: center; }

.am-dots {
  box-sizing: border-box;
  flex: 0 0 30px;
  width: 30px; height: 30px; min-width: 30px; max-width: 30px;
  aspect-ratio: 1 / 1; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  padding: 0; margin: 0;
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  color: var(--t3); cursor: pointer; transition: all 0.2s;
}
.am-dots:hover, .am-dots--active { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1); border-color: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.25); color: var(--accent); }

.am-drop-enter-active, .am-drop-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.am-drop-enter-from,   .am-drop-leave-to     { opacity: 0; transform: translateY(-6px) scale(0.97); }

.am-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  min-width: 180px; z-index: 30;
  background: linear-gradient(160deg, var(--surface-raised) 0%, var(--surface-sunken) 100%);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 12px 28px rgba(0,0,0,.35);
}
.am-item {
  width: 100%; display: flex; align-items: center; gap: 9px;
  background: none; border: none; border-radius: 8px;
  padding: 9px 10px; font-family: inherit; font-size: 0.8rem; font-weight: 600;
  color: var(--t2); cursor: pointer; text-align: left; transition: all 0.15s;
}
.am-item:hover { background: rgba(var(--accent-r),var(--accent-g),var(--accent-b),.1); color: var(--accent); }
.am-item--danger { color: #f87171; }
.am-item--danger:hover { background: rgba(248,113,113,.1); color: #f87171; }
.am-icon {
  width: 24px; height: 24px; border-radius: 7px; flex-shrink: 0;
  background: var(--glass-hover); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center;
}

[data-theme="light"] .am-dots { background: #f3f4f6; border-color: #e5e7eb; color: #6b7280; }
[data-theme="light"] .am-dots:hover, [data-theme="light"] .am-dots--active { background: var(--accent-dim); border-color: var(--accent-border); color: var(--accent); }
[data-theme="light"] .am-dropdown { background: #fff; border-color: #e5e7eb; box-shadow: 0 12px 28px rgba(0,0,0,.12); }
[data-theme="light"] .am-item { color: #374151; }
[data-theme="light"] .am-item:hover { background: var(--accent-dim); }
[data-theme="light"] .am-item--danger:hover { background: rgba(248,113,113,.08); }
[data-theme="light"] .am-icon { background: #f3f4f6; border-color: #e5e7eb; }
</style>
