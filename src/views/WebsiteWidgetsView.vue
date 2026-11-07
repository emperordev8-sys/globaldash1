<!-- src/views/WebsiteWidgetsView.vue -->
<template>
  <div class="site-page">

    <!-- Header -->
    <div class="sp-head">
      <div class="sp-head__text">
        <h1 class="sp-title">Website Widgets</h1>
        <p class="sp-sub">Paste a widget on any website you own — a live chat you answer yourself, or a contact button that opens your WhatsApp and socials.</p>
      </div>
    </div>

    <!-- Expired banner -->
    <div class="sp-banner">
      <div class="sp-banner__msg">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <p>Your plan has expired, so your chat widget are <strong>paused</strong> — nothing was deleted. Renew your plan to bring them back online and make changes again.</p>
      </div>
      <button class="sp-renew" @click="$router.push('/billing')">Renew plan</button>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped src="./site-template.css"></style>
