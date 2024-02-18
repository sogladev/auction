<template>
  <!-- justify-around or justiy-between -->
  <q-card class="create-room-card" style="min-width: 25vw">
    <q-form ref="for" @submit.prevent="onSubmit" @reset="onReset">
      <q-card-section>
        <div class="text-h6">Create New Room</div>

        <q-card-section class="justify-around" horizontal>
          <q-input
            v-model="formState.lootmaster"
            label="Lootmaster"
            :rules="[
              (val) => typeof val == 'string' || 'Name must be a string',
              (val) =>
                /^[a-zA-Z0-9]{0,12}$/.test(val) ||
                'Name can only contain alphanumeric characters and be max 12 chars',
            ]"
          />
          <q-input
            v-model.number="formState.organiserFee"
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
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Security</div>
        <q-card-section class="justify-around" horizontal>
          <q-toggle
            v-model="formState.enableDiscordProtection"
            checked-icon="check"
            color="green"
            label="Enable Discord verification"
            unchecked-icon="clear"
          />
        </q-card-section>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Session Settings</div>

        <q-card-section class="justify-around" horizontal>
          <div class="q-pa-md">
            <q-icon name="timer" />
            <q-badge color="primary">
              Bid Duration {{ formState.bidDurationInSeconds }}s
              {{ formatTime(formState.bidDurationInSeconds) }}(MM:SS)
            </q-badge>

            <q-slider
              v-model="formState.bidDurationInSeconds"
              :min="0"
              :max="720"
              :step="5"
              label
              :label-value="formatTime(formState.bidDurationInSeconds)"
              color="primary"
              :rules="[
                (val: number) =>
                  (!isNaN(val) && val >= 0) ||
                  'Bid duration must be a number greater or equal than 0!',
              ]"
            />
          </div>

          <div class="q-pa-md">
            <q-icon name="timer" />
            <q-badge color="primary">
              Countdown Duration {{ formState.countDownTimeInSeconds }}s
              {{ formatTime(formState.countDownTimeInSeconds) }}(MM:SS)
            </q-badge>

            <q-slider
              v-model="formState.countDownTimeInSeconds"
              :min="20"
              :max="120"
              :step="5"
              label
              :label-value="formatTime(formState.countDownTimeInSeconds)"
              color="primary"
              :rules="[
                (val: number) =>
                  (!isNaN(val) && val >= 20) ||
                  'Countdown duration must be a number greater or equal than 20!',
              ]"
            />
          </div>
        </q-card-section>

        <q-card-section class="justify-around" horizontal>
          <q-input
            v-model.number="formState.minimumBid"
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
            v-model.number="formState.minimumBidIncrement"
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
      </q-card-section>

      <q-expansion-item
        group="somegroup"
        label="Advanced Settings"
        switch-toggle-side
        header-class="text-primary"
      >
        <q-card>
          <q-card-section>
            <q-card-section class="justify-around">
              <q-toggle
                v-model="formState.restrictBidsToEquipable"
                color="primary"
                label="Restrict bids to equipable items"
              />
              <q-toggle
                v-model="formState.hidePayoutDetails"
                color="primary"
                label="Hide payout details"
              />
            </q-card-section>
            <q-card-section class="justify-around">
              <q-toggle
                v-model="formState.hideNameOfHighestBidder"
                color="primary"
                label="Hide name of highest bidder"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-card-actions align="right">
        <q-btn unelevated type="submit" color="primary" label="Create room" />
        <q-btn unelevated type="reset" disable color="primary" label="Reset" />
      </q-card-actions>
    </q-form>
  </q-card>

  <q-ajax-bar
    ref="bar"
    position="bottom"
    color="accent"
    size="10px"
    skip-hijack
  />
</template>

<script lang="ts" setup>
//import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

//const router = useRouter();
const bar = ref(null); // ajax bar
const $q = useQuasar();

function loadData() {
  api
    .get('/api/auctions')
    .then((response) => {
      console.log(response);
      //data.value = response.data
    })
    .catch(() => {
     // TODO: still broken? q is not a function
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Loading failed',
        icon: 'report_problem',
      });
    });
}

type IndexFormState = {
  lootmaster: string;
  enableDiscordProtection: boolean;
  bidDurationInSeconds: number;
  countDownTimeInSeconds: number;
  restrictBidsToEquipable: boolean;
  hideNameOfHighestBidder: boolean;
  hidePayoutDetails: boolean;
  organiserFee: number;
  minimumBid: number;
  minimumBidIncrement: number;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const formState = reactive<IndexFormState>({
  lootmaster: 'Lootmaster',
  enableDiscordProtection: false,
  bidDurationInSeconds: 240,
  countDownTimeInSeconds: 40,
  restrictBidsToEquipable: false,
  hideNameOfHighestBidder: false,
  hidePayoutDetails: false,
  organiserFee: 10,
  minimumBid: 10,
  minimumBidIncrement: 1,
});

function onReset(): void {
  // just refresh to reset form
  console.log('onReset: Refresh page to reset form. Not implemented yet');
}

//function newRoomCode(): string {
//   router.push('/room/' + newRoomCode());
//  return formState.lootmaster;
//}

async function onSubmit() {
  console.log('@submet.prevent');
  console.log(formState);
  loadData();
  //const response = await api.post(
  //'/api/auction',
  //formState,
  //);
}
</script>
