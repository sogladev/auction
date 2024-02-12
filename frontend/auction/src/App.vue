<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavigation from './components/TopNavigation.vue'

</script>

<template>
  <div class="wrapper gap-3">
    <TopNavigation />
    <RouterView />
</div>
</template>

<style scoped>
</style>
