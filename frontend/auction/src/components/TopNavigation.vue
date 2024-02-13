<script setup lang="ts">
import Menubar from 'primevue/menubar'
import 'primeicons/primeicons.css'

import { ref } from 'vue'

const items = ref([])
</script>

<template>
  <Menubar id="topnavigationbar" :model="items" />
</template>

<style scoped>
#topnavigationbar {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  display: flex;
  align-items: center;
}
</style>

