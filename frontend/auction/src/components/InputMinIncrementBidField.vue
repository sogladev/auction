<template>
  <q-input
      v-model.number="model"
      type="number"
      label="Min Increment"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'InputMinIncrementBidField',
  setup() {
    return {
      model: ref(1),
    };
  },
});
</script>
