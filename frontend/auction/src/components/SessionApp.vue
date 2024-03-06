<template>
  <q-card-section class="settings-card">
    <div class="text-h6">Settings</div>

    <!-- https://quasar.dev/vue-components/list-and-list-items#introduction -->
    <p v-if:="Object.keys(room).length === 0">Session is not loaded!</p>
    <q-list align="center" dense v-if:="Object.keys(room).length > 0">
      <q-item> <q-item-section>name</q-item-section> <q-item-section>{{ room.name }}</q-item-section>
      </q-item>
      <q-item> <q-item-section>bidDurationInSeconds</q-item-section> <q-item-section>{{ room.bidDurationInSeconds
          }}</q-item-section> </q-item>
      <q-item> <q-item-section>countDownTimeInSeconds</q-item-section> <q-item-section>{{
      room.countDownTimeInSeconds }}</q-item-section> </q-item>
      <q-item> <q-item-section>organiserFee</q-item-section> <q-item-section>{{ room.organiserFee
          }}</q-item-section> </q-item>
      <q-item> <q-item-section>minimumBid</q-item-section> <q-item-section>{{ room.minimumBid }}</q-item-section>
      </q-item>
      <q-item> <q-item-section>minimumBidIncrement</q-item-section> <q-item-section>{{ room.minimumBidIncrement
          }}</q-item-section> </q-item>
      <q-item> <q-item-section>enableDiscordProtection</q-item-section> <q-item-section>{{
      room.enableDiscordProtection }}</q-item-section> </q-item>
      <q-item> <q-item-section>restrictBidsToEquipable</q-item-section> <q-item-section>{{
      room.restrictBidsToEquipable }}</q-item-section> </q-item>
      <q-item> <q-item-section>hideNameOfHighestBidder</q-item-section> <q-item-section>{{
      room.hideNameOfHighestBidder }}</q-item-section> </q-item>
      <q-item> <q-item-section>hidePayoutDetails</q-item-section> <q-item-section>{{ room.hidePayoutDetails
          }}</q-item-section> </q-item>
    </q-list>
  </q-card-section>

  <q-card-section class="justify-around" horizontal>
    <q-card class="user-card">
      <div class="text-h6">User</div>
      <q-card-actions class="justify-around">
        <q-input ref="qinputMyNameRef" v-model="myName" label="UserName" :rules="[
      (val) => typeof val == 'string' || 'Name must be a string',
      (val) =>
        /^[a-zA-Z0-9]{1,12}$/.test(val) ||
        'Name can only contain alphanumeric characters and be max 12 chars',
    ]" />
      </q-card-actions>
    </q-card>
    <q-card class="sync-session-card">
      <div class="text-h6">Synchronize Session</div>
      <q-card-actions class="justify-around">
        <q-btn unelevated icon="sync" @click="onSubmitSyncRoom" type="submit" color="secondary" label="Synchronize" />
      </q-card-actions>
    </q-card>
  </q-card-section>

  <div class="text-h6">Auctions</div>
  <q-table :rows-per-page-options="[0]" dense class="auction-table" flat bordered v-model:rows="room.auctions"
    v-model:columns="columns">
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
          <a :href="getWowheadURL(props.row.itemId, room.namespace)" :class="`q${props.row.quality}`">[{{
      props.row.itemName }}]</a>

        </q-td>
        <q-td key="bidderName" :props="props">
          {{ props.row.status == Status.Pending ? "Pending..." : props.row.bidderName }}
        </q-td>
        <q-td key="bid" :props="props">
          <q-badge color="secondary">
            {{ props.row.bid ? props.row.bid : props.row.minimumPrice }}
          </q-badge>
        </q-td>
        <q-td key="myBid" :props="props">
          <q-badge color="purple">
            {{ bids.getBid(props.row.itemId, props.row.rowId)
      ? bids.getBid(props.row.itemId, props.row.rowId) : 'Click to bid' }}
          </q-badge>
          <q-popup-edit :props="props" v-model.number="bids.bids[`${props.row.itemId}-${props.row.rowId}`]" auto-save
            autofocus v-slot="scope">
            <q-input ref="qinputMyBidRef" type="number" :min="minimumAcceptableBid(props.row, room)"
              :step="props.row.minimumIncrement" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set"
              :rules="[
      (val) =>
        (!isNaN(val) && val >= minimumAcceptableBid(props.row, room)) ||
        `Minimum bid is ${minimumAcceptableBid(props.row, room)}!`,
    ]" />
          </q-popup-edit>
        </q-td>
        <q-td key="minimum" :props="props">
          <q-btn icon="remove" @click="onMinimum(props.row)"></q-btn>
        </q-td>
        <q-td key="increment" :props="props">
          <q-btn icon="keyboard_arrow_up" @click="onIncrement(props.row)"></q-btn>
        </q-td>
        <q-td key="submit" :props="props">
          <q-btn icon="shopping_cart" @click="onSubmitBid(props.row)"
            :disable="props.row.status != Status.Bidding"></q-btn>
        </q-td>
        <q-td key="status" :props="props">
          <q-badge v-if:="props.row.status === Status.Pending" color="primary">
            Pending
          </q-badge>
          <q-badge v-if:="props.row.status === Status.Bidding" color="secondary">
            Bidding
          </q-badge>
          <q-badge v-if:="props.row.status === Status.Assigned && !(props.row.bidderName === myName)" color="orange">
            Assigned
          </q-badge>
          <q-badge v-if:="props.row.status === Status.Assigned && (props.row.bidderName === myName)" color="green">
            Won
          </q-badge>
        </q-td>
      </q-tr>

      <q-tr :props="props" :key="`e_${props.row.index}`" class="q-virtual-scroll--with-prev">
        <q-td colspan="100%">
          <q-linear-progress :value="calcProgress(props.row)" :color="calcColor(props.row)" />
        </q-td>
      </q-tr>

      <q-tr :props="props" :key="`e_${props.row.index}`">
        <q-td colspan="100%">
          <div class="row">
            <div class="text-h7">Admin control</div>
            <q-input class="q-mx-xs" label="Set Minimum Price" type="number" min="0"
              v-model.number="props.row.minimumPrice" dense auto-save hint="For start auction, restart, reopen">
              <template v-slot:before>
                <q-icon name="clear" @click="() => { props.row.minimumPrice = room.minimumBid }"
                  class="cursor-pointer"></q-icon>
              </template>

            </q-input>

            <q-btn-group>
              <q-btn :disable="props.row.status != Status.Bidding" label="Award/Close" icon="check"
                @click="onClose(props.row)" />
              <q-btn :disable="props.row.status != Status.Bidding" label="Countdown" icon="more_time"
                @click="onCountdown(props.row)" />
              <q-btn :disable="props.row.status == Status.Pending" label="Restart" icon="history"
                @click="onRestart(props.row)" />
              <q-btn :disable="props.row.status != Status.Assigned" label="Reopen" icon="more_time"
                @click="onReopen(props.row)" />
              <q-btn label="Delete" icon="delete" @click="onDelete(props.row)" />
            </q-btn-group>
          </div>
        </q-td>
      </q-tr>

    </template>

    <template v-slot:bottom>
      Bottom
    </template>
  </q-table>


</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

import { api } from 'boot/axios';
import { storeToRefs } from 'pinia';

import { Auction, BidRequest, Status, Bids } from 'src/components/models';
import { useRoomStore } from 'src/stores/RoomStore';
import { minimumAcceptableBid, getNextIncrement } from 'src/components/BidMath';
import { getWowheadURL } from 'src/components/WowheadURLBuilder';

const bids = ref(new Bids());

const $q = useQuasar();
const route = useRoute();
const roomId = typeof route.params.id === 'string' ? route.params.id : route.params.id[0];

const roomStore = useRoomStore();
const { room } = storeToRefs(roomStore);
const { fetch } = roomStore;

fetch(roomId);


const currentTimeInUnixTimeStamp = ref(Math.floor(Date.now() / 1000))

// TODO:Add these to props
// TODO: Consider making Auction class. isPending, isAssigned etc
let interval
let fetchInterval

function calcColor(auction: Auction): string {
  const isPending = (auction.status === Status.Pending)
  const isAssigned = (auction.status === Status.Assigned)
  const isAssignedAndWon = (auction.status === Status.Assigned && auction.bidderName === myName.value)
  if (isAssignedAndWon) { return 'green' }
  if (isAssigned) { return 'orange' }
  if (isPending) { return 'primary' }
  if (auction.expiration === undefined) {
    return 'primary';
  }
  const isExpired = (auction.expiration - currentTimeInUnixTimeStamp.value) <= 0
  if (isExpired) {
    auction.status = Status.Assigned
    return 'orange'
  }
  const isCountdown = (auction.expiration - currentTimeInUnixTimeStamp.value) <= room.value.countDownTimeInSeconds + 2.0 // magic number 2
  if (isCountdown) {
    if (auction.bidderName !== undefined && auction.bidderName === myName.value) {
      return 'green'
    }
    else {
      return 'red'
    }
  }
  return 'secondary'
}

function calcProgress(auction: Auction): number {
  const isPending = (auction.status === Status.Pending)
  if (isPending) { return 1.0 }
  const isAssigned = (auction.status === Status.Assigned)
  if (isAssigned) { return 1.0 }

  if (auction.expiration === undefined) {
    auction.status = Status.Assigned
    return 0;
  }
  const isExpired = (auction.expiration - currentTimeInUnixTimeStamp.value) <= 0
  if (isExpired) { return 1.0 }

  const isCountdown = (auction.expiration - currentTimeInUnixTimeStamp.value) <= room.value.countDownTimeInSeconds + 2.0 // magic number 2
  let progress
  if (isCountdown) {

    progress = (auction.expiration - currentTimeInUnixTimeStamp.value) / room.value.countDownTimeInSeconds
  }
  else {
    progress = (auction.expiration - currentTimeInUnixTimeStamp.value) / room.value.bidDurationInSeconds
  }
  progress = Math.max(0, progress)
  progress = Math.min(1, progress)
  return progress
}

onMounted(() => {
  interval = setInterval(() => {
    currentTimeInUnixTimeStamp.value = Math.floor(Date.now() / 1000)
  }, 1000)

  fetchInterval = setInterval(() => {
    fetch(roomId)
  }, 2500)

})

onBeforeUnmount(() => {
  clearInterval(interval)
  clearInterval(fetchInterval)
})

// Export to CSV button
// https://quasar.dev/vue-components/table#introduction
// Not reactive
//const rows = room.value.auctions;
const myName = ref('DefaultAndy');
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
    label: 'Top Bidder',
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
  { name: 'minimum', label: 'Minimum' },
  { name: 'increment', label: 'Increment' },
  { name: 'submit', label: 'Submit' },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
  },
]);

async function onSubmitSyncRoom() {
  console.log('@submet.prevent');
  console.log(`onSubmitSyncRoom for roomId: ${roomId}`);
  //await fetch(roomId);
  console.log('room data: ', room.value)
}

function onClose(auction: Auction): void {
  console.log('@onClose');
  console.log(auction);
  api
    .patch(`/api/rooms/${roomId}/close`, auction)
    .then((response) => {
      console.log('response: ', response);
      console.log(response);
      //fetch(roomId).catch((error) => {
      //  console.log('Submit fetch error: ', error)
      //}); // update table
      $q.notify({
        type: 'positive',
        position: 'right',
        message: 'Auction closed',
        progress: true,
        timeout: 2000,
      });
    })
    .catch((error) => {
      if (error.response.status === 400) {
        $q.notify({
          type: 'warning',
          position: 'right',
          message: error.response.data,
        });
      } else {
        $q.notify({
          type: 'negative',
          position: 'bottom',
          message: 'Something went wrong while handling response',
        });
      }
    });
}

function onDelete(auction: Auction): void {
  console.log('@onDelete');
  console.log(auction);
  console.log('TODO: onDelete')
  api
    .patch(`/api/rooms/${roomId}/delete`, auction)
    .then((response) => {
      console.log('response: ', response);
      console.log(response);
      //fetch(roomId).catch((error) => {
      //  console.log('Submit fetch error: ', error)
      //}); // update table
      $q.notify({
        type: 'positive',
        position: 'right',
        message: 'Auction deleted',
        progress: true,
        timeout: 2000,
      });
    })
    .catch((error) => {
      if (error.response.status === 400) {
        $q.notify({
          type: 'warning',
          position: 'right',
          message: error.response.data,
        });
      } else {
        $q.notify({
          type: 'negative',
          position: 'bottom',
          message: 'Something went wrong while handling response',
        });
      }
    });
}

function onReopen(auction: Auction): void {
  console.log('@onReopen');
  console.log(auction);
  api
    .patch(`/api/rooms/${roomId}/reopen`, auction)
    .then((response) => {
      console.log('response: ', response);
      console.log(response);
      //fetch(roomId).catch((error) => {
      //  console.log('Submit fetch error: ', error)
      //}); // update table
      $q.notify({
        type: 'positive',
        position: 'right',
        message: 'Auction re opened',
        progress: true,
        timeout: 2000,
      });
    })
    .catch((error) => {
      if (error.response.status === 400) {
        $q.notify({
          type: 'warning',
          position: 'right',
          message: error.response.data,
        });
      } else {
        $q.notify({
          type: 'negative',
          position: 'bottom',
          message: 'Something went wrong while handling response',
        });
      }
    });
}

function onRestart(auction: Auction): void {
  console.log('@onRestart');
  console.log(auction);
  api
    .patch(`/api/rooms/${roomId}/restart`, auction)
    .then((response) => {
      console.log('response: ', response);
      console.log(response);
      //fetch(roomId).catch((error) => {
      //  console.log('Submit fetch error: ', error)
      //}); // update table
      $q.notify({
        type: 'positive',
        position: 'right',
        message: 'Auction restart',
        progress: true,
        timeout: 2000,
      });
    })
    .catch((error) => {
      if (error.response.status === 400) {
        $q.notify({
          type: 'warning',
          position: 'right',
          message: error.response.data,
        });
      } else {
        $q.notify({
          type: 'negative',
          position: 'bottom',
          message: 'Something went wrong while handling response',
        });
      }
    });
}

function onCountdown(auction: Auction): void {
  console.log('@onCountdown');
  console.log(auction);
  console.log('TODO: onCountdown')

  api
    .patch(`/api/rooms/${roomId}/countdown`, auction)
    .then((response) => {
      console.log('response: ', response);
      console.log(response);
      //fetch(roomId).catch((error) => {
      //  console.log('Submit fetch: ', error)
      //}); // update table
      $q.notify({
        type: 'positive',
        position: 'right',
        message: 'Auction countdown',
        progress: true,
        timeout: 2000,
      });
    })
    .catch((error) => {
      if (error.response.status === 400) {
        $q.notify({
          type: 'warning',
          position: 'right',
          message: error.response.data,
        });
      } else {
        $q.notify({
          type: 'negative',
          position: 'bottom',
          message: 'Something went wrong while handling response',
        });
      }
    });
}

function onMinimum(auction: Auction): void {
  console.log('@onMinimum');
  const newBid: number = minimumAcceptableBid(auction, room.value);
  bids.value.setBid(auction.itemId, auction.rowId, newBid);
}

function onIncrement(auction: Auction): void {
  console.log('@onIncrement');
  const newBid: number = getNextIncrement(auction, room.value, bids.value);
  bids.value.setBid(auction.itemId, auction.rowId, newBid);
}

const qinputMyNameRef = ref({ validate: () => false });

async function onSubmitBid(auction: Auction): Promise<void> {
  console.log('@onSubmit');
  console.log({ auction });
  // TODO: Extract to validation.ts

  // Only allow bids if auction is in bidding state
  if (auction.status != Status.Bidding) {
    console.log('@onSubmit Auction not in Bidding state. Not submitting');
    $q.notify({
      progress: true,
      timeout: 1500,
      message: 'Auction not in bidding state!',
      type: 'warning',
      position: 'bottom',
    })
    return;
  }

  // Trigger validation of input field
  const isValidMyName: boolean = qinputMyNameRef.value.validate()
  if (!isValidMyName) {
    console.log('@onSubmit Myname invalid. Not submitting');
    return;
  }

  // Validate myBid
  const val = bids.value.getBid(auction.itemId, auction.rowId);
  const isValidMyBid: boolean = (val !== undefined) && (!isNaN(val)) && (val >= minimumAcceptableBid(auction, room.value))
  if (!isValidMyBid) {
    $q.notify({
      progress: true,
      timeout: 1500,
      message: `Minimum bid is ${minimumAcceptableBid(auction, room.value)}!`,
      type: 'warning',
      position: 'bottom',
    })
    return;
  }

  // Submit bid to API
  const myBid = <BidRequest>{
    itemId: auction.itemId,
    rowId: auction.rowId,
    myName: myName.value,
    myBid: bids.value.getBid(auction.itemId, auction.rowId),
  }
  console.log('@onSubmit Bid Submitted');
  // 400 BadRequest if bid is too low
  // 404 is something else went wrong
  api
    .patch(`/api/rooms/${roomId}`, myBid)
    .then((response) => {
      console.log('response: ', response);
      console.log(response);
      //fetch(roomId).catch((error) => {
      //  console.log('Submit fetch error: ', error)
      //}); // update table
      $q.notify({
        type: 'positive',
        position: 'right',
        message: 'Bid success',
        progress: true,
        timeout: 2000,
      });
    })
    .catch((error) => {
      if (error.response.status === 400) {
        $q.notify({
          type: 'warning',
          position: 'right',
          message: error.response.data,
        });
      } else {
        $q.notify({
          type: 'negative',
          position: 'bottom',
          message: 'Something went wrong while handling response',
        });
      }
    });
}
</script>

<style>
.auction-table {
  td {
    border-style: hidden !important;
  }
}
</style>
