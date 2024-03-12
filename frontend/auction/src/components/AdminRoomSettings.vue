<template>
  <q-field bg-color="primary" color="primary" filled label="Admin secret key" stack-label>
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

  <div class="q-my-md q-pa-md admin-border">
    <q-form ref="for" @submit.prevent="onSubmit">
      <div>
        <div class="text-h6">General</div>
        <div class="row">
          <div class="q-px-sm col-md-6 col-sm-12">
            <q-input spellcheck="false" v-model="settings.name" color="primary" label="Name" :rules="[
        (val) => typeof val == 'string' || 'Name must be a string',
        (val) =>
          /^[a-zA-Z0-9]{0,12}$/.test(val) ||
          'Name can only contain alphanumeric characters and be max 12 chars',
      ]" />
          </div>

          <div class="q-px-sm col-md-6 col-sm-12">
            <q-input v-model.number="settings.organiserFee" color="primary" type="number" label="Organiser fee (%)"
              prefix="%" min="0" max="100" :rules="[
        (val) =>
          (!isNaN(val) && val <= 100 && val >= 0) ||
          'Fee must be a number between 0 and 100!',
      ]" />
          </div>

          <div class="q-px-sm col-md-6 col-sm-12">
            <q-icon name="timer" />
            <q-badge color="primary">
              Bid Duration {{ settings.bidDurationInSeconds }}s
              {{ formatTime(settings.bidDurationInSeconds) }}(MM:SS)
            </q-badge>
            <q-slider v-model="settings.bidDurationInSeconds" :min="0" :max="720" :step="5" label
              :label-value="formatTime(settings.bidDurationInSeconds)" color="primary" :rules="[
        (val: number) =>
          (!isNaN(val) && val >= 0) ||
          'Bid duration must be a number greater or equal than 0!',
      ]" />
          </div>

          <div class="q-px-sm col-md-6 col-sm-12">
            <q-icon name="timer" />
            <q-badge color="primary">
              Countdown Duration {{ settings.countDownTimeInSeconds }}s
              {{ formatTime(settings.countDownTimeInSeconds) }}(MM:SS)
            </q-badge>
            <q-slider v-model="settings.countDownTimeInSeconds" :min="15" :max="90" :step="5" label
              :label-value="formatTime(settings.countDownTimeInSeconds)" color="primary" :rules="[
        (val: number) =>
          (!isNaN(val) && val >= 20) ||
          'Countdown duration must be a number greater or equal than 20!',
      ]" />
          </div>

          <div class="q-px-sm col-md-6 col-sm-12">
            <q-input v-model.number="settings.minimumBid" color="primary" type="number" label="Minimum bid" min="0"
              :rules="[
        (val) =>
          (!isNaN(val) && val >= 0) ||
          'Min bid must be a positive numberl!',
      ]" />
          </div>

          <div class="q-px-sm col-md-6 col-sm-12">
            <q-input v-model.number="settings.minimumBidIncrement" color="primary" type="number"
              label="Minimum increment" min="1" :rules="[
        (val) =>
          (!isNaN(val) && val >= 0) ||
          'Field must be a number greater than 0!',
      ]" />
          </div>
        </div>
      </div>

      <div class="text-h6">Security</div>
      <div class="q-px-sm col-md-6 col-sm-12">
        <q-toggle v-model="settings.enableDiscordProtection" checked-icon="check" color="primary"
          label="Enable Discord verification" unchecked-icon="clear" />
      </div>

      <div class="text-h6">Extra</div>
      <div class="row">
        <div class="q-px-sm col-sm-4 col-xs-12">
          <q-toggle v-model="settings.restrictBidsToEquipable" color="primary"
            label="Restrict bids to equipable items" />
        </div>
        <div class="q-px-sm col-sm-4 col-xs-12">
          <q-toggle v-model="settings.hidePayoutDetails" color="primary" label="Hide payout details" />
        </div>
        <div class="q-px-sm col-sm-4 col-xs-12">
          <q-toggle v-model="settings.hideNameOfHighestBidder" color="primary" label="Hide name of highest bidder" />
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-sm-6 col-xs-12 q-pt-sm q-px-sm">
          <q-btn class="full-width" icon="save" elevated type="submit" color="primary"
            label="Save settings to Database" />
        </div>
      </div>
    </q-form>
  </div>

  <div class="q-my-md q-pa-md admin-border">
    <div class="text-h6">Items</div>

    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input clearable debounce="500" color="primary" label="Paste your string here" v-model="textAreaItemsCSV"
          filled type="textarea" :rules="[
        (val) =>
          (typeof val == 'string' &&
            val.startsWith(validationHeader)) ||
          'Invalid import string. Copy all output from /hlm e!',
      ]" />
      </div>
      <div class="col-sm-6 col-xs-12 q-pt-sm q-px-sm">
        <q-btn class="full-width" @click="onSubmitUpdateItems" icon="add" unelevated type="update" color="primary"
          label="Append items" />
      </div>
      <div class="col-sm-6 col-xs-12 q-pt-sm q-px-sm">
        <q-btn class="full-width" @click="onSubmitReplaceItems" icon="change_circle" unelevated type="replace"
          color="red" label="Replace items" />
      </div>
    </div>

    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input autogrow debounce="500" color="primary" label="Write itemIds here e.g. 19137,18814"
          v-model="textAreaItemIds" filled type="textarea" :rules="[
        (val) => {
          const values = val.split(',').map(v => v.trim());
          return values.every((v: string) => /^\d+$/.test(v)) ||
            'Invalid import string. Values must be integers seperated by commas.';
        }
      ]" />

      </div>
      <div class="col-sm-6 col-xs-12 q-pt-sm q-px-sm">
        <q-btn class="full-width" @click="onSubmitUpdateItemsById" icon="add" unelevated type="update" color="primary"
          label="Append items" />
      </div>
      <div class="col-sm-6 col-xs-12 q-pt-sm q-px-sm">
        <q-btn class="full-width" @click="onSubmitReplaceItemsById" icon="change_circle" unelevated type="replace"
          color="red" label="Replace items" />
      </div>
    </div>

  </div>

  <div class="q-my-md q-pa-md admin-border">
    <div class="text-h6">Auction controls</div>
    <div class="text-h7"> Starts auctions</div>

    <div class="row">
      <div class="col-sm-6 col-xs-12 q-pt-sm q-px-sm">
        <q-btn class="full-width" @click="onButtonStartAuctions" icon="timer" unelevated type="update" color="primary"
          label="Start Auctions">
          <q-tooltip class="bg-primary">changes items from pending to bidding</q-tooltip>
        </q-btn>
      </div>
      <div  class="col-sm-6 col-xs-12 q-pt-sm q-px-sm">
        <ExportToCSVButtonGroup />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { copyToClipboard } from 'quasar';

import { storeToRefs } from 'pinia';

import { useRoomStore } from 'src/stores/RoomStore';
import { Auction } from './models';
import { newAuctionsFromCsv, newAuctionsFromItemIds } from 'src/utils/ParseTextImportNewAuctions';
import ExportToCSVButtonGroup from './ExportToCSVButtonGroup.vue';


const $q = useQuasar();
const route = useRoute();
const roomId = typeof route.params.id === 'string' ? route.params.id : route.params.id[0];
const roomStore = useRoomStore();
const { settings } = storeToRefs(roomStore);
const { fetch } = roomStore;

const adminKey = ref('this is some key'); // ajax bar

const validationHeader =
  'rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid';

const debugImportString = `rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
`;

const debugItemIds = '19137,18814,17076,12282';

const textAreaItemsCSV = ref(debugImportString);
const textAreaItemIds = ref(debugItemIds);


async function putAuctionsToDb(newAuctions: Array<Auction>) {
  console.log('putting these: ', newAuctions)
  api
    .put(`/api/rooms/${roomId}/items`, newAuctions)
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

async function onSubmitReplaceItems() {
  console.log('@replace.prevent');
  const newAuctions: Array<Auction> = newAuctionsFromCsv(textAreaItemsCSV.value);
  putAuctionsToDb(newAuctions);
}

async function onSubmitReplaceItemsById() {
  console.log('@replace.prevent');
  const newAuctions: Array<Auction> = newAuctionsFromItemIds(textAreaItemIds.value);
  putAuctionsToDb(newAuctions);
}

async function onSubmitUpdateItems() {
  console.log('@update.prevent');
  console.log('TODO: Update items');
}

async function onSubmitUpdateItemsById() {
  console.log('@update.prevent');
  console.log('TODO: onSubmitUpdateItemsById')
}

async function onButtonStartAuctions() {
  console.log('@update.prevent');
  console.log('onButtonStartAuctions')
  return api
    .patch(`/api/rooms/${roomId}/start`, roomStore.pendingAuctions)
    .then((response) => {
      console.log(response);
      fetch(roomId)
    });
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function onSubmit() {
  console.log('@submet.prevent');
  console.log('Put form and create room with given settings');
  console.log(settings.value);
  api
    .put(`/api/rooms/${roomId}/settings`, settings.value)
    .then((response) => {
      console.log('response submit put room settings');
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

<style lang="scss">
@import '/src/css/app.scss';

.admin-border {
  border-radius: 5px;
  border: 1px solid $warning-custom;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
}
</style>
