<template>
  <q-page class="fit row wrap content-start items-center justify-center">
    <q-card class="create-room-card">
      <q-form ref="for">
        <q-card-section>
          <div class="text-h6">Create New Room</div>
          <q-input
            v-model="lootmaster"
            label="Lootmaster"
            :rules="[
              (val) => typeof val == 'string' || 'Name must be a string',
              (val) =>
                /^[a-zA-Z0-9]{0,12}$/.test(val) ||
                'Name can only contain alphanumeric characters and be max 12 chars',
            ]"
          />
          <q-input
            v-model.number="organiserFee"
            type="number"
            label="Organiser fee (%)"
            prefix="%"
            min="0"
            max="100"
            :rules="[
              (val) =>
                (!isNaN(val) && val <= 100 && val >= 0) ||
                'Fee must be a number between 0 and 100!',
            ]"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Security</div>
          <q-toggle
            v-model="enableDiscordProtection"
            checked-icon="check"
            color="green"
            label="Enable Discord verification"
            unchecked-icon="clear"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Session Settings</div>
          <div class="q-pa-md">
            <q-icon name="timer" />
            <q-badge color="primary">
              Bid Duration {{ bidDurationInSeconds }}s
              {{ formatTime(bidDurationInSeconds) }}(MM:SS)
            </q-badge>

            <q-slider
              v-model="bidDurationInSeconds"
              :min="0"
              :max="720"
              :step="5"
              label
              :label-value="formatTime(bidDurationInSeconds)"
              color="primary"
            />
          </div>

          <div class="q-pa-md">
            <q-icon name="timer" />
            <q-badge color="primary">
              Countdown Duration {{ countDownTimeInSeconds }}s
              {{ formatTime(countDownTimeInSeconds) }}(MM:SS)
            </q-badge>

            <q-slider
              v-model="countDownTimeInSeconds"
              :min="20"
              :max="120"
              :step="5"
              label
              :label-value="formatTime(countDownTimeInSeconds)"
              color="primary"
            />
          </div>

          <q-input
            v-model.number="minimumBid"
            type="number"
            label="Minimum bid"
            min="0"
            :rules="[
              (val) =>
                (!isNaN(val) && val >= 0) ||
                'Min bid must be a positive numberl!',
            ]"
          />

          <q-input
            v-model.number="minimumBidIncrement"
            type="number"
            label="Minimum increment"
            min="1"
            :rules="[
              (val) =>
                (!isNaN(val) && val >= 0) ||
                'Field must be a number greater than 0!',
            ]"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Advanced Settings</div>
          <q-toggle
            v-model="restrictBidsToEquipable"
            color="primary"
            label="Restrict bids to equipable items"
          />
          <q-toggle
            v-model="hideNameOfHighestBidder"
            color="primary"
            label="Hide name of highest bidder"
          />
          <q-toggle
            v-model="hidePayoutDetails"
            color="primary"
            label="Hide payout details"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            unelevated
            @click="onSubmit"
            type="submit"
            color="primary"
            label="Create room"
          />
          <q-btn unelevated type="reset" color="primary" label="Reset" />
        </q-card-actions>
      </q-form> </q-card
  ></q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ref } from 'vue';

export default defineComponent({
  name: 'IndexForm',

  components: {},
  methods: {
    formatTime(seconds: number) {
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  setup() {
    const lootmaster = ref('Lootmaster');
    const enableDiscordProtection = ref(false);
    const bidDurationInSeconds = ref(240);
    const countDownTimeInSeconds = ref(40);
    const restrictBidsToEquipable = ref(false);
    const hideNameOfHighestBidder = ref(false);
    const hidePayoutDetails = ref(false);
    const organiserFee = ref(10);
    const minimumBid = ref(10);
    const minimumBidIncrement = ref(1);
    const onSubmit = () => {
      console.log('onSubmit!');
    };
    return {
      onSubmit,
      lootmaster,
      enableDiscordProtection,
      bidDurationInSeconds,
      countDownTimeInSeconds,
      restrictBidsToEquipable,
      hideNameOfHighestBidder,
      hidePayoutDetails,
      organiserFee,
      minimumBid,
      minimumBidIncrement,
    };
  },
});
</script>
