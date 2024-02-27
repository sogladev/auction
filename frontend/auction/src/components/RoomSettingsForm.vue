<template>
  <!-- justify-around or justiy-between -->
  <q-card class="create-room-card" style="min-width: 25vw">
    <q-card-section class="justify-left" style="width: 50%">
      <q-field bg-color="primary" filled label="Admin secret key (click to copy)" stack-label>
        <template v-slot:prepend>
          <q-icon name="key" />
        </template>
        <template v-slot:append>
          <q-btn icon="content_copy" @click="copyToClipboard(adminKey)" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{ adminKey }}</div>
        </template>
      </q-field>
    </q-card-section>


    <q-form ref="for" @submit.prevent="onSubmit">
      <q-card-section>
        <div class="text-h6">General</div>

        <q-card-section class="justify-around" horizontal>
          <q-input v-model="formState.name" label="Name" :rules="[
            (val) => typeof val == 'string' || 'Name must be a string',
            (val) =>
              /^[a-zA-Z0-9]{0,12}$/.test(val) ||
              'Name can only contain alphanumeric characters and be max 12 chars',
          ]" />
          <q-input v-model.number="formState.organiserFee" type="number" label="Organiser fee (%)" prefix="%" min="0"
            max="100" :rules="[
              (val) =>
                (!isNaN(val) && val <= 100 && val >= 0) ||
                'Fee must be a number between 0 and 100!',
            ]" />
        </q-card-section>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Security</div>
        <q-card-section class="justify-around" horizontal>
          <q-toggle v-model="formState.enableDiscordProtection" checked-icon="check" color="green"
            label="Enable Discord verification" unchecked-icon="clear" />
        </q-card-section>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Bid</div>

        <q-card-section class="justify-around" horizontal>
          <div class="q-pa-md">
            <q-icon name="timer" />
            <q-badge color="primary">
              Bid Duration {{ formState.bidDurationInSeconds }}s
              {{ formatTime(formState.bidDurationInSeconds) }}(MM:SS)
            </q-badge>

            <q-slider v-model="formState.bidDurationInSeconds" :min="0" :max="720" :step="5" label
              :label-value="formatTime(formState.bidDurationInSeconds)" color="primary" :rules="[
                (val: number) =>
                  (!isNaN(val) && val >= 0) ||
                  'Bid duration must be a number greater or equal than 0!',
              ]" />
          </div>

          <div class="q-pa-md">
            <q-icon name="timer" />
            <q-badge color="primary">
              Countdown Duration {{ formState.countDownTimeInSeconds }}s
              {{ formatTime(formState.countDownTimeInSeconds) }}(MM:SS)
            </q-badge>

            <q-slider v-model="formState.countDownTimeInSeconds" :min="20" :max="120" :step="5" label
              :label-value="formatTime(formState.countDownTimeInSeconds)" color="primary" :rules="[
                (val: number) =>
                  (!isNaN(val) && val >= 20) ||
                  'Countdown duration must be a number greater or equal than 20!',
              ]" />
          </div>
        </q-card-section>

        <q-card-section class="justify-around" horizontal>
          <q-input v-model.number="formState.minimumBid" type="number" label="Minimum bid" min="0" :rules="[
            (val) =>
              (!isNaN(val) && val >= 0) ||
              'Min bid must be a positive numberl!',
          ]" />

          <q-input v-model.number="formState.minimumBidIncrement" type="number" label="Minimum increment" min="1" :rules="[
            (val) =>
              (!isNaN(val) && val >= 0) ||
              'Field must be a number greater than 0!',
          ]" />
        </q-card-section>
      </q-card-section>

      <q-expansion-item group="somegroup" label="Advanced" switch-toggle-side header-class="text-primary">
        <q-card>
          <q-card-section>
            <q-card-section class="justify-around">
              <q-toggle v-model="formState.restrictBidsToEquipable" color="primary"
                label="Restrict bids to equipable items" />
              <q-toggle v-model="formState.hidePayoutDetails" color="primary" label="Hide payout details" />
            </q-card-section>
            <q-card-section class="justify-around">
              <q-toggle v-model="formState.hideNameOfHighestBidder" color="primary" label="Hide name of highest bidder" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-card-actions align="right">
        <q-btn unelevated type="submit" color="primary" label="Update settings" />
      </q-card-actions>
    </q-form>
  </q-card>

  <q-ajax-bar ref="bar" position="bottom" color="accent" size="10px" skip-hijack />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { copyToClipboard } from 'quasar'

const bar = ref(null); // ajax bar
const adminKey = ref('this is some key'); // ajax bar
const $q = useQuasar();
const route = useRoute();
const roomId = route.params.id;

// TODO: Use Model type instead
type RoomSettingsFormState = {
  name: string;
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

const formState = reactive<RoomSettingsFormState>({
  name: 'myname',
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

async function onSubmit() {
  console.log('@submet.prevent');
  console.log('Post form and create room with given settings');
  console.log(formState);
  api
    .put(`/api/rooms/${roomId}`, formState)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      if (error.response.status === 400) {
        $q.notify({
          color: 'warning',
          position: 'right',
          message: error.response.data,
          icon: 'warning',
        });
      } else {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Something went wrong while handling response',
          icon: 'report_problem',
        });
      }
    });
}
</script>
