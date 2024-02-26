<template>
  <q-layout view="hhh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Auction App </q-toolbar-title>

        <q-tabs inline-label>
          <q-route-tab icon="house" label="Home" to="/" exact />
          <q-route-tab icon="info" label="About" to="/about" exact />
          <q-route-tab
            icon="person"
            label="Room 1"
            to="/room/65d8c31d1c45e9467583d5f1"
            exact
          />
        </q-tabs>
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
