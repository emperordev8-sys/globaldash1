<!-- src/App.vue -->
<template>
  <template v-if="route.path === '/auth'">
    <router-view />
  </template>
  <AppLayout v-else />
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'

const route = useRoute()
</script>
