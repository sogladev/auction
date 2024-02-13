<template>
  <q-layout view="hhh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Auction App </q-toolbar-title>
          <a href="/">Home</a> |
            <a href="/about">About</a> |
            <a href="/room/1">Broken Link</a>

        <div>Quasar v{{ $q.version }}</div>
        <DarkModeToggle />

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DarkModeToggle from 'src/components/DarkModeToggle.vue';

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    DarkModeToggle,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
