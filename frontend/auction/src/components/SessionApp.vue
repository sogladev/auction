<template>
  <q-card class="settings-card">
    <div class="text-h6">Settings</div>

    <!-- https://quasar.dev/vue-components/list-and-list-items#introduction -->
    <p v-if:="Object.keys(room).length === 0">Session is not loaded!</p>
    <q-list dense v-if:="Object.keys(room).length > 0">
      <q-item> <q-item-section>name</q-item-section> <q-item-section>{{ room.name }}</q-item-section>
      </q-item>
      <q-item> <q-item-section>enableDiscordProtection</q-item-section> <q-item-section>{{
        room.enableDiscordProtection }}</q-item-section> </q-item>
      <q-item> <q-item-section>bidDurationInSeconds</q-item-section> <q-item-section>{{ room.bidDurationInSeconds
      }}</q-item-section> </q-item>
      <q-item> <q-item-section>countDownTimeInSeconds</q-item-section> <q-item-section>{{
        room.countDownTimeInSeconds }}</q-item-section> </q-item>
      <q-item> <q-item-section>restrictBidsToEquipable</q-item-section> <q-item-section>{{
        room.restrictBidsToEquipable }}</q-item-section> </q-item>
      <q-item> <q-item-section>hideNameOfHighestBidder</q-item-section> <q-item-section>{{
        room.hideNameOfHighestBidder }}</q-item-section> </q-item>
      <q-item> <q-item-section>hidePayoutDetails</q-item-section> <q-item-section>{{ room.hidePayoutDetails
      }}</q-item-section> </q-item>
      <q-item> <q-item-section>organiserFee</q-item-section> <q-item-section>{{ room.organiserFee
      }}</q-item-section> </q-item>
      <q-item> <q-item-section>minimumBid</q-item-section> <q-item-section>{{ room.minimumBid }}</q-item-section>
      </q-item>
      <q-item> <q-item-section>minimumBidIncrement</q-item-section> <q-item-section>{{ room.minimumBidIncrement
      }}</q-item-section> </q-item>
    </q-list>
  </q-card>

  <q-card class="sync-session-card">
    <div class="text-h6">Synchronize Session with Database</div>
    <q-card-actions align="center">
      <q-btn unelevated icon="sync" @click="onSubmitSyncRoom" type="submit" color="secondary" label="Synchronize" />
    </q-card-actions>
  </q-card>

  <q-card class="sync-session-card">
    <div class="text-h6">User</div>
    <q-card-actions align="left">
      <q-input ref="qinputMyName" v-model="myName" label="UserName" :rules="[
        (val) => typeof val == 'string' || 'Name must be a string',
        (val) =>
          /^[a-zA-Z0-9]{0,12}$/.test(val) ||
          'Name can only contain alphanumeric characters and be max 12 chars',
      ]" />
    </q-card-actions>
  </q-card>

  <div class="text-h6">Auctions</div>
  <q-table flat bordered v-model:rows="room.auctions" v-model:columns="columns">
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="rowId" :props="props">
          <q-badge color="primary">
            {{ props.row.rowId }}
          </q-badge>
        </q-td>

        <q-td key="itemId" :props="props">
          <q-badge color="secondary">
            {{ props.row.itemId }}
          </q-badge>
        </q-td>
        <q-td key="itemName" :props="props">
          {{ props.row.itemName }}
        </q-td>
        <q-td key="bidderName" :props="props">
          {{ props.row.bidderName }}
        </q-td>
        <q-td key="bid" :props="props">
          <q-badge color="secondary">
            {{ props.row.bid }}
          </q-badge>
        </q-td>
        <q-td key="myBid" :props="props">
          <q-badge color="purple">
            {{ props.row.myBid ? props.row.myBid : 'Click to bid' }}
          </q-badge>
          <q-popup-edit :props="props" v-model.number="props.row.myBid" auto-save v-slot="scope">
            <q-input type="number" :min="minimumAcceptableBid(props.row, room)" :step="props.row.minimumIncrement"
              v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" :rules="[
                (val) =>
                  (!isNaN(val) && val >= minimumAcceptableBid(props.row, room)) ||
                  `Minimum bid is ${minimumAcceptableBid(props.row, room)}!`,
              ]" />
          </q-popup-edit>
        </q-td>
        <q-td key="expiration" :props="props">
          <q-badge color="orange">
            {{ props.row.expiration }}
          </q-badge>
        </q-td>
        <q-td key="increment" :props="props">
          <q-btn icon="keyboard_arrow_up" @click="onIncrement(props.row)"></q-btn>
        </q-td>
        <q-td key="submit" :props="props">
          <q-btn icon="shopping_cart" @click="onSubmitBid(props.row)"></q-btn>
        </q-td>
        <!--
          <q-td key="Delete" :props="props">
              <q-btn icon="delete" @click="onDelete(props.row)"></q-btn>
            </q-td>
-->
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

import { Auction, BidRequest } from 'src/components/models';
import { useRoomStore } from 'src/stores/RoomStore';

import { minimumAcceptableBid, getNextIncrement } from 'src/components/BidMath';
import { storeToRefs } from 'pinia';

const $q = useQuasar();
const route = useRoute();
const roomId = typeof route.params.id === 'string' ? route.params.id : route.params.id[0];

const roomStore = useRoomStore();
const { room } = storeToRefs(roomStore);
const { fetch } = roomStore;

// Export to CSV button
// https://quasar.dev/vue-components/table#introduction
// Not reactive
//const rows = room.value.auctions;
const myName = ref();
const columns = ref([
  {
    name: 'rowId',
    required: true,
    label: 'Row Id',
    align: 'left',
    field: 'rowId',
    sortable: true,
  },
  {
    name: 'itemId',
    required: true,
    label: 'Item Id',
    align: 'left',
    field: 'itemId',
    sortable: true,
  },
  {
    name: 'itemName',
    align: 'center',
    label: 'Item Name',
    field: 'itemName',
    sortable: true,
  },
  {
    name: 'bidderName',
    align: 'center',
    label: 'Highest Bidder',
    field: 'bidderName',
    sortable: true,
  },
  {
    name: 'bid',
    label: 'Bid',
    field: 'bid',
    sortable: true,
    sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: 'myBid',
    label: 'My Bid',
    field: 'myBid',
    sortable: false,
  },
  {
    name: 'expiration',
    label: 'Expiration',
    field: 'expiration',
    sortable: true,
    sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10),
  },
  { name: 'increment', label: 'Increment' },
  { name: 'submit', label: 'Submit' }
]);

async function onSubmitSyncRoom() {
  console.log('@submet.prevent');
  console.log(`onSubmitSyncRoom for roomId: ${roomId}`);
  await fetch(roomId);
  console.log('room data: ', room.value)
}

function onIncrement(auction: Auction): void {
  console.log('@onIncrement');
  console.log('auction: ', auction);
  console.log('room: ', room.value);
  auction.myBid = getNextIncrement(auction, room.value);
  console.log('myBid ', auction.myBid);
}

async function onSubmitBid(auction: Auction): Promise<void> {
  console.log('@onSubmit');
  console.log(auction);
  if (myName.value == undefined) {
    console.log('@onSubmit myName undefined. Not submitting');
    return;
  }
  const val: string = myName.value;
  // Copypasted from validate above. Can I call .validate() instead?
  if (!(typeof val == 'string')) {
    return console.log('Name must be a string');
  }
  if (!(/^[a-zA-Z0-9]{0,12}$/.test(val))) {
    return console.log('Name can only contain alphanumeric characters and be max 12 chars')
  }

  if (auction.myBid == undefined) {
    console.log('@onSubmit Bid undefined. Not submitting');
    return;
  }
  // Submit bid to API
  const myBid = <BidRequest>{
    itemId: auction.itemId,
    rowId: auction.rowId,
    myName: myName.value,
    myBid: auction.myBid,
  }
  console.log('@onSubmit Bid Submitted');
  // 400 BadRequest if bid is too low
  // 404 is something else went wrong
  api
    .patch(`/api/rooms/${roomId}`, myBid)
    .then((response) => {
      console.log('response: ', response);
      console.log(response);
      fetch(roomId); // update table
      $q.notify({
        color: 'positive',
        position: 'right',
        message: 'Bid success',
        icon: 'done',
      });
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
