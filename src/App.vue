<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { applyTheme } = useTheme()

onMounted(() => {
  // Apply theme on app mount
  applyTheme()
})
</script>

<template>
  <div id="app" class="min-h-screen transition-colors duration-200">
    <RouterView />
  </div>
</template>

<style>
#app {
  font-family: 'Inter', system-ui, sans-serif;
}

/* RTL Support for Arabic */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .ltr {
  direction: ltr;
  text-align: left;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
