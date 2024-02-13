<template>
  <q-toggle
    v-model="showHighestBidder"
    color="primary"
    label="Show name of highest biddegr"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ShowHighestBidderToggle',
  setup() {
    const showHighestBidder = ref(true);
    return {
      showHighestBidder,
    };
  },
});
</script>
