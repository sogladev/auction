<template>
  <div class="q-pa-md">
    <q-icon name="timer" />
    <q-badge color="primary">
      Bid Duration {{ value }}s {{ formatTime(value) }}(MM:SS)
    </q-badge>

    <q-slider
      v-model="value"
      :min="0"
      :max="720"
      :step="5"
      label
      :label-value="formatTime(value)"
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'BidDuration',
  methods: {
    formatTime(seconds: number) {
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  setup() {
    return {
      value: ref(240),
    };
  },
});
</script>
