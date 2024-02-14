<template>
  <q-form ref="for">
    <q-input v-model="lootmaster" label="Lootmaster" />
    <q-input
      v-model.number="organiserFee"
      type="number"
      label="Organiser fee (%)"
      prefix="%"
    />
    <q-toggle
      v-model="enableDiscordProtection"
      checked-icon="check"
      color="green"
      label="Enable Discord verification"
      unchecked-icon="clear"
      size="lg"
    />
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
      :rules="[
        (val) =>
          (!isNaN(val) && val >= 0) || 'Min bid must be a positive numberl!',
      ]"
    />

    <q-input
      v-model.number="minimumBidIncrement"
      type="number"
      label="Minimum increment"
      :rules="[
        (val) =>
          (!isNaN(val) && val >= 0) || 'Field must be a number greater than 0!',
      ]"
    />

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

    <div>
      <q-btn
        unelevated
        @click="onSubmit"
        type="submit"
        color="primary"
        label="Create room"
      />
      <q-btn unelevated type="reset" color="primary" label="Reset" />
    </div>
  </q-form>
</template>

<script lang="ts">
// lootmaster :rules="[(val) => typeof val == 'string' || 'Name must be a string', (val) => /^[a-zA-Z0-9]{0,12}$/.test(val) || 'Name can only contain alphanumeric characters and be max 12 chars']"
// organiserfee :rules="[ (val) => (!isNaN(val) && val <= 100 && val >= 0) || 'Fee must be a number between 0 and 100!', ]"
import { defineComponent } from 'vue';

import { ref } from 'vue';

export default defineComponent({
  name: 'IndexForm',

  components: {},
  methods: {
    onSubmit: function () {
      console.log('Submit!');
      return true;
    },
    onReset: function () {
      console.log('Reset!');
      return true;
      },
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
    return {
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
