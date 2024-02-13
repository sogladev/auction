<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ formatTime(value) }} MM:SS {{ value }} 0 to 600
    </q-badge>

    <q-slider
      v-model="value"
      :min="0"
      :max="600"
      :step="5"
      label
      :label-value="formatTime(value)"
      label-always
      color="red"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'BidDuration',
  methods: [
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
  ],
  setup() {
    return {
      value: ref(220),
    };
  },
});
</script>
