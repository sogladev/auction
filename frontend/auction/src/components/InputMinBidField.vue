<template>
  <q-input
      v-model.number="model"
      type="number"
      label="Minimum bid"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'InputMinBidField',
  setup() {
    return {
      model: ref(10),
    };
  },
});
</script>
