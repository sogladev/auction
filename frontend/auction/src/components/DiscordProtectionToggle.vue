<template>
  <q-toggle
    v-model="isDiscord"
    checked-icon="check"
    color="green"
    label="Enable Discord verification"
    unchecked-icon="clear"
    size="lg"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DiscordProtectionToggle',
  setup() {
    const isDiscord = ref(true);
    return {
      isDiscord,
    };
  },
});
</script>
