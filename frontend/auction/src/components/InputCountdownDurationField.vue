<template>
  <q-input
      v-model.number="model"
      type="number"
      label="Countdown Duration"
    :rules="[
      (val) =>
        (!isNaN(val) && val > 0) ||
        'Countdown duration must be a number greater than 0!',
    ]"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'CountdownDuration',
  setup() {
    return {
      model: ref(45),
    };
  },
});
</script>
