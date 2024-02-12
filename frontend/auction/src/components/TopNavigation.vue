<script setup lang="ts">
import Menubar from 'primevue/menubar'
import 'primeicons/primeicons.css'

import { ref } from 'vue'

const items = ref([
  {
    label: 'Explore',
    icon: 'pi pi-fw pi-compass',
    items: [
      {
        label: 'Categories',
        icon: 'pi pi-fw pi-th-large',
        items: [
          {
            label: 'Work',
            icon: 'pi pi-fw pi-briefcase'
          },
          {
            label: 'Relationships',
            icon: 'pi pi-fw pi-heart'
          },
          {
            label: 'Family',
            icon: 'pi pi-fw pi-sitemap'
          },
          {
            label: 'Friendship',
            icon: 'pi pi-fw pi-users'
          },
          {
            label: 'Health',
            icon: 'pi pi-fw pi-eye'
          }
        ]
      },
      {
        label: 'Randomize',
        icon: 'pi pi-fw pi-question-circle'
      },
      { separator: true },
      {
        label: 'Create Post',
        icon: 'pi pi-fw pi-plus'
      }
    ]
  },
  {
    label: 'My Posts',
    icon: 'pi pi-fw pi-bars',
    items: [
      {
        label: 'Create Post',
        icon: 'pi pi-fw pi-plus'
      },
      {
        label: 'View All',
        icon: 'pi pi-fw pi-bars'
      }
    ]
  },
  {
    label: 'Resources',
    icon: 'pi pi-fw pi-sync'
  },
  {
    label: 'Logout',
    icon: 'pi pi-fw pi-power-off'
  }
])
</script>

<template>
  <Menubar :model="items" />
</template>

<style scoped>
</style>

