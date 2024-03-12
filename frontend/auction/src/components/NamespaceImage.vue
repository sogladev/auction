<template>
  <q-img ratio="1" fit="contain" :src="getSrc(namespace)" spinner-color="white">
  </q-img>
</template>

<script setup lang="ts">
import { Namespace } from 'src/components/models';
import { ref } from 'vue';

const namespace = ref(Namespace.Era);

function getSrc(namespace: Namespace) {
  if (namespace == Namespace.Era) {
    return '/src/assets/wow-logo/wow-classic_1_1_240.png'
  }
  else if (namespace == Namespace.Retail) {
    return '/src/assets/wow-logo/wow-dragonflight_1_1_240.png'

  }
  return '/src/assets/wow-logo/wow-wrath_1_1_240.png'
}
</script>

<style>
</style>
