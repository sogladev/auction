<template>
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
        <InputMinIncrementBidField />
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
      <InputBidDurationField />
      <InputCountdownDurationField />
    </div>

    <div class="col-6 bg-blue-8">
      <InputBidDurationSlider />
    </div>

  </div>
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
import InputBidDurationField from './InputBidDurationField.vue';
import InputCountdownDurationField from './InputCountdownDurationField.vue';
import RestrictToEquipable from './RestrictToEquipable.vue';
import InputBidDurationSlider from './InputBidDurationSlider.vue';

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
    InputBidDurationField,
    InputCountdownDurationField,
    RestrictToEquipable,
    InputBidDurationSlider
},
  props: {
    setup() {
      return {};
    },
  },
});
</script>
