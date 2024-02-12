<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavigation from './components/TopNavigation.vue'
</script>

<template>
  <header>
    <TopNavigation />
</header>
<body>
<div>
    <RouterView />
</div>
</body>
</template>

<style scoped>
</style>
