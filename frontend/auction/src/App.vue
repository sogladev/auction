<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Menubar from 'primevue/menubar';
import Topnav from './components/Topnav.vue'

</script>

<template>
  <header>
    <Topnav />
  </header>
  <RouterView />
</template>

<style scoped>
</style>
