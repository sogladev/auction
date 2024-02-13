<template>
  <q-input
      v-model.number="model"
      type="number"
      label="Bid Duration"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'BidDuration',
  setup() {
    return {
      model: ref(220),
    };
  },
});
</script>
