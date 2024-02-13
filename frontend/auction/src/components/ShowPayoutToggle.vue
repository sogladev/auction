<template>
  <q-toggle
    v-model="isPayoutVisible"
    color="primary"
    label="Display payout details during bidding"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ShowPayoutToggle',
  setup() {
    const isPayoutVisible = ref(true);
    return {
      isPayoutVisible,
    };
  },
});
</script>
