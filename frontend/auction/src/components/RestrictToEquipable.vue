<template>
  <q-toggle
    v-model="restrictToEquipable"
    color="primary"
    label="Only allow bids for equipable items"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RestrictToEquipable',
  setup() {
    const restrictToEquipable = ref(true);
    return {
      restrictToEquipable,
    };
  },
});
</script>
