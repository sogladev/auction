<template>
  <!-- justify-around or justiy-between -->
  <q-form ref="for" @submit.prevent="onSubmit">
    <q-card-section>
      <div class="text-h6">General</div>
      <q-card-section class="justify-around" horizontal>
        <q-input v-model="room.name" color="warning" label="Name" :rules="[
    (val) => typeof val == 'string' || 'Name must be a string',
    (val) =>
      /^[a-zA-Z0-9]{0,12}$/.test(val) ||
      'Name can only contain alphanumeric characters and be max 12 chars',
  ]" />
        <q-input v-model.number="room.organiserFee" color="warning" type="number" label="Organiser fee (%)" prefix="%"
          min="0" max="100" :rules="[
    (val) =>
      (!isNaN(val) && val <= 100 && val >= 0) ||
      'Fee must be a number between 0 and 100!',
  ]" />
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <div class="text-h6">Security</div>
      <q-card-section class="justify-around" horizontal>
        <q-toggle v-model="room.enableDiscordProtection" checked-icon="check" color="warning"
          label="Enable Discord verification" unchecked-icon="clear" />
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <div class="text-h6">Bid</div>
      <q-card-section class="justify-around" horizontal>
        <div class="q-pa-md">
          <q-icon name="timer" />
          <q-badge color="warning">
            Bid Duration {{ room.bidDurationInSeconds }}s
            {{ formatTime(room.bidDurationInSeconds) }}(MM:SS)
          </q-badge>

          <q-slider v-model="room.bidDurationInSeconds" :min="0" :max="720" :step="5" label
            :label-value="formatTime(room.bidDurationInSeconds)" color="warning" :rules="[
    (val: number) =>
      (!isNaN(val) && val >= 0) ||
      'Bid duration must be a number greater or equal than 0!',
  ]" />
        </div>

        <div class="q-pa-md">
          <q-icon name="timer" />
          <q-badge color="warning">
            Countdown Duration {{ room.countDownTimeInSeconds }}s
            {{ formatTime(room.countDownTimeInSeconds) }}(MM:SS)
          </q-badge>
          <q-slider v-model="room.countDownTimeInSeconds" :min="20" :max="120" :step="5" label
            :label-value="formatTime(room.countDownTimeInSeconds)" color="warning" :rules="[
    (val: number) =>
      (!isNaN(val) && val >= 20) ||
      'Countdown duration must be a number greater or equal than 20!',
  ]" />
        </div>
      </q-card-section>

      <q-card-section class="justify-around" horizontal>
        <q-input v-model.number="room.minimumBid" color="warning" type="number" label="Minimum bid" min="0" :rules="[
    (val) =>
      (!isNaN(val) && val >= 0) ||
      'Min bid must be a positive numberl!',
  ]" />
        <q-input v-model.number="room.minimumBidIncrement" color="warning" type="number" label="Minimum increment"
          min="1" :rules="[
    (val) =>
      (!isNaN(val) && val >= 0) ||
      'Field must be a number greater than 0!',
  ]" />
      </q-card-section>
    </q-card-section>

    <q-expansion-item group="advancedSettings" label="Advanced" switch-toggle-side header-class="text-warning">
      <q-card>
        <q-card-section>
          <q-card-section class="justify-around">
            <q-toggle v-model="room.restrictBidsToEquipable" color="warning" label="Restrict bids to equipable items" />
            <q-toggle v-model="room.hidePayoutDetails" color="warning" label="Hide payout details" />
          </q-card-section>
          <q-card-section class="justify-around">
            <q-toggle v-model="room.hideNameOfHighestBidder" color="warning" label="Hide name of highest bidder" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-card-actions align="right">
      <q-btn icon="save" elevated type="submit" color="warning" label="Save settings to Database" />
    </q-card-actions>
  </q-form>

  <q-card-section>
    <div class="text-h6">Items</div>
    <div class="text-h7">
      <p>
        The web page allows users to import items into their existing listings. There are two methods for importing
        items:
        pasting an import string and writing item IDs separated by commas. These methods can be used to either append
        new
        items or replace existing ones in the user's listings. Below this section, the imported auctions will be
        appended
        or
        replaced based on the chosen option.
      </p>
    </div>

    <q-card-section class="justify-around">
      <div class="text-h7">
        Import items by pasting your import string
      </div>
      <q-input max debounce="500" color="warning" label="Paste your string here" v-model="textAreaItemsCSV" filled
        type="textarea" :rules="[
    (val) =>
      (typeof val == 'string' &&
        val.startsWith(validationHeader)) ||
      'Invalid import string. Copy all output from /hlm e!',
  ]" />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn @click="onSubmitUpdateItems" icon="add" unelevated type="update" color="warning" label="Append items" />
      <q-btn @click="onSubmitReplaceItems" icon="change_circle" unelevated type="replace" color="red"
        label="Replace items" />
    </q-card-actions>
    <q-card-section class="justify-around">
      <div class="text-h7">
        Import items by writing itemIds seperated by commas
      </div>
      <q-input max debounce="500" color="warning" label="Write itemIds here e.g. 19137,18814" v-model="textAreaItemIds"
        filled type="textarea" />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn @click="onSubmitUpdateItemsById" icon="add" unelevated type="update" color="warning"
        label="Append items" />
      <q-btn @click="onSubmitReplaceItemsById" icon="change_circle" unelevated type="replace" color="red"
        label="Replace items" />
    </q-card-actions>
  </q-card-section>
  <q-card-section class="justify-around">
    <div class="text-h6">Auction controls</div>
    <div class="text-h7"> Starts auctions
    </div>
    <q-btn @click="onButtonStartAuctions" icon="timer" unelevated type="update" color="warning" label="Start Auctions">
      <q-tooltip class="bg-warning">changes items from pending to bidding</q-tooltip>
    </q-btn>

  </q-card-section>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

import { storeToRefs } from 'pinia';

import { useRoomStore } from 'src/stores/RoomStore';
import { Auction } from './models';
import { newAuctionsFromCsv, newAuctionsFromItemIds } from 'src/components/ParseTextImportNewAuctions';

const $q = useQuasar();
const route = useRoute();
const roomId = typeof route.params.id === 'string' ? route.params.id : route.params.id[0];
const roomStore = useRoomStore();
const { room } = storeToRefs(roomStore);

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
      roomStore.fetch(roomId)
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
  console.log(room.value);
  api
    .put(`/api/rooms/${roomId}`, room.value)
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
