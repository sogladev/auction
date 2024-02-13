<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavigation from './components/TopNavigation.vue'
</script>

<template>
  <TopNavigation />

    <RouterView />
</template>

<style scoped>
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.site-header__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
