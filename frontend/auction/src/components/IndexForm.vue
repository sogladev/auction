<template>
  <div id="parent" class="fit row text-center">
    <div class="col-5 bg-grey-6" style="padding 2px">
      <div style="padding-bottom: 5px">
        <CharacterNameField />
      </div>

    </div>
    <div class="offset-1 col-5 bg-grey-6">
      <div style="padding-bottom: 5px">
      <OrganiserFeeInputField />
      </div>
    </div>

    <div class="col-3 bg-grey-6">
      <div style="padding-bottom: 5px">
      <InputMinBidField />
      </div>
    </div>

    <div class="col-3 bg-grey-6">
      <div style="padding-bottom: 5px">
      <InputMinIncrementBidField />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CharacterNameField from './CharacterNameField.vue';
import OrganiserFeeInputField from './OrganiserFeeInputField.vue';
import InputMinBidField from './InputMinBidField.vue';
import InputMinIncrementBidField from './InputMinIncrementBidField.vue';

export default defineComponent({
  name: 'IndexForm',
  components: { CharacterNameField, OrganiserFeeInputField, InputMinBidField, InputMinIncrementBidField },
  props: {
    setup() {
      return {};
    },
  },
});
</script>
