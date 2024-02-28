<template>
  <!-- justify-around or justiy-between -->
  <q-card class="admin-room-card">
    <q-card-section class="justify-left">
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
          <q-input v-model="roomState.name" label="Name" :rules="[
            (val) => typeof val == 'string' || 'Name must be a string',
            (val) =>
              /^[a-zA-Z0-9]{0,12}$/.test(val) ||
              'Name can only contain alphanumeric characters and be max 12 chars',
          ]" />
          <q-input v-model.number="roomState.organiserFee" type="number" label="Organiser fee (%)" prefix="%" min="0"
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
          <q-toggle v-model="roomState.enableDiscordProtection" checked-icon="check" color="green"
            label="Enable Discord verification" unchecked-icon="clear" />
        </q-card-section>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Bid</div>
        <q-card-section class="justify-around" horizontal>
          <div class="q-pa-md">
            <q-icon name="timer" />
            <q-badge color="primary">
              Bid Duration {{ roomState.bidDurationInSeconds }}s
              {{ formatTime(roomState.bidDurationInSeconds) }}(MM:SS)
            </q-badge>

            <q-slider v-model="roomState.bidDurationInSeconds" :min="0" :max="720" :step="5" label
              :label-value="formatTime(roomState.bidDurationInSeconds)" color="primary" :rules="[
                (val: number) =>
                  (!isNaN(val) && val >= 0) ||
                  'Bid duration must be a number greater or equal than 0!',
              ]" />
          </div>

          <div class="q-pa-md">
            <q-icon name="timer" />
            <q-badge color="primary">
              Countdown Duration {{ roomState.countDownTimeInSeconds }}s
              {{ formatTime(roomState.countDownTimeInSeconds) }}(MM:SS)
            </q-badge>
            <q-slider v-model="roomState.countDownTimeInSeconds" :min="20" :max="120" :step="5" label
              :label-value="formatTime(roomState.countDownTimeInSeconds)" color="primary" :rules="[
                (val: number) =>
                  (!isNaN(val) && val >= 20) ||
                  'Countdown duration must be a number greater or equal than 20!',
              ]" />
          </div>
        </q-card-section>

        <q-card-section class="justify-around" horizontal>
          <q-input v-model.number="roomState.minimumBid" type="number" label="Minimum bid" min="0" :rules="[
            (val) =>
              (!isNaN(val) && val >= 0) ||
              'Min bid must be a positive numberl!',
          ]" />
          <q-input v-model.number="roomState.minimumBidIncrement" type="number" label="Minimum increment" min="1" :rules="[
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
              <q-toggle v-model="roomState.restrictBidsToEquipable" color="primary"
                label="Restrict bids to equipable items" />
              <q-toggle v-model="roomState.hidePayoutDetails" color="primary" label="Hide payout details" />
            </q-card-section>
            <q-card-section class="justify-around">
              <q-toggle v-model="roomState.hideNameOfHighestBidder" color="primary" label="Hide name of highest bidder" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-card-actions align="right">
        <q-btn icon="save" elevated type="submit" color="secondary" label="Save settings to Database" />
      </q-card-actions>
    </q-form>

    <q-card-section>
      <div class="text-h6">Items</div>
      <q-card-section class="justify-around">
        <div class="text-h7">
          Import items by pasting your import string
        </div>
        <q-input max debounce="500" label="Paste your string here" v-model="csvString" filled type="textarea" :rules="[
          (val) =>
            (typeof val == 'string' &&
              val.startsWith(validationHeader)) ||
            'Invalid import string. Copy all output from /hlm e!',
        ]" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="onSubmitUpdateItems" icon="add" unelevated type="update" color="primary" label="Append items" />
        <q-btn @click="onSubmitReplaceItems" icon="change_circle" unelevated type="replace" color="red"
          label="Replace items" />
      </q-card-actions>
      <q-card-section class="justify-around">
        <div class="text-h7">
          Import items by writing itemIds seperated by commas
        </div>
        <q-input max debounce="500" label="Write itemIds here e.g. 19137,18814" v-model="itemIds" filled
          type="textarea" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="onSubmitUpdateItemsById" icon="add" unelevated type="update" color="primary"
          label="Append items" />
        <q-btn @click="onSubmitReplaceItemsById" icon="change_circle" unelevated type="replace" color="red"
          label="Replace items" />
      </q-card-actions>
    </q-card-section>
  </q-card>
  <q-ajax-bar ref="bar" position="bottom" color="accent" size="10px" skip-hijack />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useQuasar, copyToClipboard } from 'quasar';
import { api } from 'boot/axios';
import Papa from 'papaparse';

import { useRoomStore } from 'src/stores/RoomStore';
import { Room } from './models';

const bar = ref(null); // ajax bar
const adminKey = ref('this is some key'); // ajax bar
const $q = useQuasar();
const route = useRoute();
const roomId = route.params.id;

const roomState = <Room>useRoomStore().room;

const validationHeader =
  'rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid';

const debugImportString = `rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
`;

const debugItemIds = '19137,18814,17076,12282';

const csvString = ref(debugImportString);
const itemIds = ref(debugItemIds);

async function onSubmitUpdateItems() {
  console.log('@update.prevent');
  const output = Papa.parse(csvString.value);
  console.log(output);
  console.log('TODO: Update items');
  // TODO: Create session from import string
  // Populate "Auctions" data and start session
}

async function onSubmitReplaceItems() {
  console.log('@replace.prevent');
  const output = Papa.parse(csvString.value);
  console.log(output);
  console.log('TODO: Replace items');
  console.log(csvString.value)
  // TODO: Create session from import string
  // Populate "Auctions" data and start session
  api
    .put(`/api/rooms/${roomId}/items`, {
      csvData: JSON.stringify(debugImportString),
    })
    .then((response) => {
      console.log(response);
      console.log('AAAAAAAAAAA NO ERRORE');
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

async function onSubmitUpdateItemsById() {
  console.log('@update.prevent');
  const output = Papa.parse(csvString.value);
  console.log(output);
  console.log('TODO: Update items by Id');
  // TODO: Create session from import string
  // Populate "Auctions" data and start session
}

async function onSubmitReplaceItemsById() {
  console.log('@replace.prevent');
  const output = Papa.parse(csvString.value);
  console.log(output);
  console.log('TODO: Replace items by Id');
  // TODO: Create session from import string
  // Populate "Auctions" data and start session
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function onSubmit() {
  console.log('@submet.prevent');
  console.log('Put form and create room with given settings');
  console.log(roomState);
  api
    .put(`/api/rooms/${roomId}`, roomState)
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
