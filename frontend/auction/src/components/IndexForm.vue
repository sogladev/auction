<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <div id="parent" class="flex text-center">
      <div class="col-2 bg-blue-8" style="padding 2px">
        <div style="padding-bottom: 5px">
          <CharacterNameField />
        </div>
      </div>
      <div class="col-2 bg-blue-8">
        <div style="padding-bottom: 5px">
          <OrganiserFeeInputField />
        </div>
      </div>

      <div class="col-2 bg-blue-8">
        <div style="padding-bottom: 5px">
          <InputMinBidField />
          <InputMinIncrementBidField v-model:model="model" />

        </div>
      </div>

      <div class="col-3 bg-blue-8">
        <div style="padding-bottom: 5px">
          <DiscordProtectionToggle />
        </div>
      </div>

      <div class="col-6 bg-blue-8">
        <CreateRoomButton />
      </div>

      <div class="col-6 bg-blue-8">
        <CreatePlayRoomButton />
      </div>

      <div class="col-2 bg-blue-8">
        <ShowPayoutToggle />
      </div>

      <!-- TODO: Make an array of these options -->
      <div class="col-2 bg-blue-8">
        <RestrictToEquipable />
      </div>

      <div class="col-2 bg-blue-8">
        <ShowHighestBidderToggle />
      </div>

      <div class="col-6 bg-blue-8">
        <InputBidDurationSlider />
        <InputCountdownDurationSlider />
      </div>

      <div>
      <q-btn unelevated type="submit" color="primary" label="Create room" />
      <q-btn unelevated type="reset" color="primary" label="Reset" />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CharacterNameField from './CharacterNameField.vue';
import OrganiserFeeInputField from './OrganiserFeeInputField.vue';
import InputMinBidField from './InputMinBidField.vue';
import InputMinIncrementBidField from './InputMinIncrementBidField.vue';
import DiscordProtectionToggle from './DiscordProtectionToggle.vue';
import CreateRoomButton from './CreateRoomButton.vue';
import CreatePlayRoomButton from './CreatePlayRoomButton.vue';
import ShowPayoutToggle from './ShowPayoutToggle.vue';
import ShowHighestBidderToggle from './ShowHighestBidderToggle.vue';
import RestrictToEquipable from './RestrictToEquipable.vue';
import InputBidDurationSlider from './InputBidDurationSlider.vue';
import InputCountdownDurationSlider from './InputCountdownDurationSlider.vue';

import { useQuasar } from 'quasar';
import { ref } from 'vue';

export default defineComponent({
  name: 'IndexForm',

  components: {
    CharacterNameField,
    OrganiserFeeInputField,
    InputMinBidField,
    InputMinIncrementBidField,
    DiscordProtectionToggle,
    CreateRoomButton,
    CreatePlayRoomButton,
    ShowPayoutToggle,
    ShowHighestBidderToggle,
    InputCountdownDurationSlider,
    RestrictToEquipable,
    InputBidDurationSlider,
  },
  props: {
    setup() {
      const $q = useQuasar();

      const name = ref(null);
      const age = ref(null);
      const accept = ref(false);
      return {
        name,
        age,
        accept,
        onSubmit() {
          console.log('onSubmit!')
          if (accept.value !== true) {
            $q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'warning',
              message: 'You need to accept the license and terms first',
            });
          } else {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Submitted',
            });
          }
        },
        onReset() {
          name.value = null;
          age.value = null;
          accept.value = false;
        },
      };
    },
  },
});
</script>
