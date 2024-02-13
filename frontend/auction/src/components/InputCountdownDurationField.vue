<template>
  <q-input
      v-model.number="model"
      type="number"
      label="Countdown Duration"
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
