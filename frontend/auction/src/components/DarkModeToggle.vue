<template>
  <q-toggle
    v-model="isDarkMode"
    checked-icon="dark_mode"
    color="black"
    label="Different icon for each state"
    unchecked-icon="light_mode"
    size="lg"
    :value="true"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'DarkModeToggle',
  setup() {
    const isDarkMode = ref(true);
    const $q = useQuasar();
    watch(isDarkMode, (isDarkMode) => {
      console.log(isDarkMode);
      $q.dark.set(isDarkMode);
      // Save preference to localStorage
      try {
        $q.localStorage.set('darkMode', isDarkMode);
      } catch (e) {
        console.log(
          'Error: Unable to store isDarkMode preference to localStorage',
        );
      }
    });
    onMounted(() => {
      // Read preference to localStorage. Defaults to Dark
      try {
        if ($q.localStorage.getItem('darkMode')) {
          isDarkMode.value = true;
        } else {
          isDarkMode.value = false;
        }
      } catch (e) {
        console.log('Info: Unable to read isDarkMode from localstorage');
        isDarkMode.value = true;
      }
      $q.dark.set(isDarkMode.value);
    });

    return {
      isDarkMode,
    };
  },
});
</script>
