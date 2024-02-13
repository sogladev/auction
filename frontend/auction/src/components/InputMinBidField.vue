<template>
  <q-input
      v-model.number="model"
      type="number"
      label="Minimum bid"
    :rules="[
      (val) =>
        (!isNaN(val) && val >= 0) ||
        'Field must be a positive numberl!',
    ]"
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
