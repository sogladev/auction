<template>
  <q-field
    :model-value="text"
    bottom-slots
    label="Character name"
    stack-label
    counter
    maxlength="12"
    :dense="dense"
    :rules="[(val) => (typeof val == 'string') || 'Name must be a string', (val) => (/^[a-zA-Z0-9]{2,12}$/.test(val)) || 'Name can only contain alphanumeric characters and be max 12 chars']"
  >
    <template v-slot:before>
      <q-icon name="person" />
    </template>

    <template v-slot:control>
      <div class="self-center full-width no-outline" tabindex="0">
        {{ text }}
      </div>
    </template>

    <template v-slot:append>
      <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
    </template>

    <template v-slot:hint>max 12 chars</template>
  </q-field>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'CharacterNameField',
  setup() {
    return {
      text: ref('Lootmaster'),
      dense: ref(false),
    };
  },
});
</script>