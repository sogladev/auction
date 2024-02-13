<template>
  <q-input
      v-model.number="model"
      type="number"
      label="Bid Duration"
    :rules="[
      (val) =>
        (!isNaN(val) && val > 0) ||
        'Duration must be a number greater than 0!',
    ]"
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
