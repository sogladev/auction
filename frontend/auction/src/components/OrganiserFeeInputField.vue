<template>
  <q-input
      v-model.number="model"
      type="number"
      label="Organiser fee"
      hint="in percentage (e.g. 15)"
      prefix="%"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'OrganiserFeeInput',
  setup() {
    return {
      model: ref(15)
    };
  },
});
</script>
