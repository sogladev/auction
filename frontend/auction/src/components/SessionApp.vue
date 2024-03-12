<template>
  <div>
    <div class="text-h6">Settings</div>
    <div class="row">
      <!-- https://quasar.dev/vue-components/list-and-list-items#introduction -->
      <p v-if:="settings == null">Session is not loaded!</p>
    </div>
    <div v-if:="settings" class="row">
      <RoomSettingsReadOnly :settings="settings" />
    </div>
  </div>

  <div class="justify-around" horizontal>
    <div class="user-card">
      <div class="text-h6">User</div>
      <div class="row">
        <div class="q-px-sm col-md-6 col-sm-12">
          <q-input ref="qinputMyNameRef" color="white" v-model="myName" label="UserName" :rules="[
        (val) => typeof val == 'string' || 'Name must be a string',
        (val) =>
          /^[a-zA-Z0-9]{1,12}$/.test(val) ||
          'Name can only contain alphanumeric characters and be max 12 chars',
      ]" />
        </div>
      </div>
    </div>
    <div>
      <div class="text-h6">Synchronize Session</div>
      <div class="row">
        <div class="col-sm-6 col-xs-12 q-pa-sm">
          <q-btn class="full-width" icon="sync" @click="onSubmitSyncRoom" type="submit" color="secondary" label="Synchronize" />
        </div>
      </div>
      </div>
    </div>

    <div class="text-h6">Auctions</div>
    <q-table :rows-per-page-options="[0]" dense class="auction-table" flat bordered v-model:rows="auctions"
      v-model:columns="columns" no-data-label="There are currently no active auctions">
      <template v-slot:body="props">
        <q-tr :props="props" v-if:="!(isShowOnlyWatched && !bids.watch[`${props.row.itemId}-${props.row.rowId}`])">
          <q-td key="watch" :props="props">
            <!-- visibility_off-->
            <q-btn size="md" :icon="bids.getWatchValue(props.row.itemId, props.row.rowId) ? 'visibility' : ''"
              color="purple" @click="bids.toggleWatch(props.row.itemId, props.row.rowId)">
            </q-btn>

          </q-td>
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
            <div style="text-align: left">
              <a :href="getWowheadItemURL(props.row.itemId, settings.namespace)" target="_blank"
                :class="`q${props.row.itemInfo.quality}`">
                <img class="q-mx-sm" v-if:="props.row.itemInfo.icon"
                  style="vertical-align: middle; box-shadow: 0 0 10px black"
                  :src="getWowheadImageURL(props.row.itemInfo.icon)" />
                <span style="vertical-align: baseline">
                  {{ props.row.itemInfo.name.length > 23 ? props.row.itemInfo.name.substring(0, 20) + '...' :
        props.row.itemInfo.name }}
                </span>
              </a>
            </div>
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
              <q-input ref="qinputMyBidRef" type="number" :min="minimumAcceptableBid(props.row, settings)"
                :step="props.row.minimumIncrement" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set"
                :rules="[
        (val) =>
          (!isNaN(val) && val >= minimumAcceptableBid(props.row, settings)) ||
          `Minimum bid is ${minimumAcceptableBid(props.row, settings)}!`,
      ]
        " />
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

        <q-tr :props="props" :key="`e_${props.row.index}_progressBar`" class="q-virtual-scroll--with-prev"
          v-if:="!(isShowOnlyWatched && !bids.watch[`${props.row.itemId}-${props.row.rowId}`])">
          <q-td colspan="100%">
            <q-linear-progress :value="calcProgress(currentTimeInUnixTimeStamp, props.row)"
              :color="calcColor(currentTimeInUnixTimeStamp, props.row)" />
            <br v-if:="!roomStore.isAdmin">
          </q-td>
        </q-tr>

        <q-tr :props="props" :key="`e_${props.row.index}_adminControls`"
          v-if:="roomStore.isAdmin && isShowAdminControls && !(isShowOnlyWatched && !bids.watch[`${props.row.itemId}-${props.row.rowId}`])">
          <q-td colspan="100%">
            <div class="row">
              <q-input color="primary" class="q-mx-xs" label="Set Minimum Price" type="number" min="0"
                v-model.number="props.row.minimumPrice" dense auto-save>
                <template v-slot:before>
                  <q-icon name="clear" @click="() => { props.row.minimumPrice = settings.minimumBid }"
                    class="cursor-pointer"></q-icon>
                </template>
              </q-input>
              <q-btn-group>
                <q-btn color="primary" :disable="props.row.status != Status.Bidding" label="Award/Close" icon="check"
                  @click="onClose(props.row)" />
                <q-btn color="primary" :disable="props.row.status != Status.Bidding" label="Countdown" icon="more_time"
                  @click="onCountdown(props.row)" />
                <q-btn color="primary" :disable="props.row.status == Status.Pending" label="Restart" icon="history"
                  @click="onRestart(props.row)" />
                <q-btn color="primary" :disable="props.row.status != Status.Assigned" label="Reopen" icon="more_time"
                  @click="onReopen(props.row)" />
                <q-btn color="primary" label="Delete" icon="delete" @click="onDelete(props.row)" />
              </q-btn-group>
            </div>
            <br>
            <br>
          </q-td>
        </q-tr>

      </template>
      <!--total items: 28  pending: 5 filtered: 28    bid total: 13 my total: 5 -->
      <template v-slot:bottom>
        <div class="flex justify-around">
          <div class="text-h8 q-px-md">total items: {{ Object.keys(auctions).length }}</div>
          <div class="text-h8 q-px-md">pending items: {{ auctions.filter(auction => auction.status ==
        Status.Pending).length }}</div>
          <div class="text-h8 q-px-md">filtered items: ?TODO </div>
          <div class="text-h8 q-px-md">bid total: {{ auctions.reduce((acc, auction) => acc + (auction.bid ?
        auction.bid : 0), 0) }}</div>
          <div class="text-h8 q-px-md">my total: {{ auctions.filter(auction => auction.bidderName == myName).reduce(
        (acc, auction) => acc + (auction.bid ? auction.bid : 0), 0) }}</div>
        </div>
      </template>

      <template v-slot:top-right>
        <q-toggle v-model="isShowOnlyWatched" icon="visibility" label="Show only watched" color="purple" size="lg"
          :value="isShowOnlyWatched"></q-toggle>
      </template>

      <template v-slot:top-left>

        <q-toggle v-model="isAutoFetch" icon="sync" label="Auto update table" color="secondary" size="lg"
          :value="true"></q-toggle>

        <q-toggle v-if:="roomStore.isAdmin" v-model="isShowAdminControls" color="primary" icon="visibility"
          label="Show admin controls" size="lg" :value="isShowAdminControls"></q-toggle>
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
import { minimumAcceptableBid, getNextIncrement } from 'src/utils/BidMath';
import { getWowheadImageURL, getWowheadItemURL } from 'src/utils/WowheadURLBuilder';

import RoomSettingsReadOnly from './RoomSettingsReadOnly.vue';

const bids = ref(new Bids());
const isAutoFetch = ref(false);
const isShowOnlyWatched = ref(false);
const isShowAdminControls = ref(true);

const $q = useQuasar();
const route = useRoute();
const roomId = typeof route.params.id === 'string' ? route.params.id : route.params.id[0];

const roomStore = useRoomStore();
const { auctions, settings } = storeToRefs(roomStore);
const { fetch, fetchAuctions } = roomStore;

const currentTimeInUnixTimeStamp = ref(Math.floor(Date.now() / 1000))

// TODO:Add these to props
// TODO: Consider making Auction class. isPending, isAssigned etc
let interval;
let fetchInterval;

function calcColor(currentTimeStamp: number, auction: Auction): string {
  const isPending = (auction.status === Status.Pending)
  const isAssigned = (auction.status === Status.Assigned)
  const isAssignedAndWon = (auction.status === Status.Assigned && auction.bidderName === myName.value)
  if (isAssignedAndWon) { return 'green' }
  if (isAssigned) { return 'orange' }
  if (isPending) { return 'primary' }
  if (auction.expiration == null) {
    return 'primary';
  }
  const isExpired = (auction.expiration - currentTimeStamp) <= 0
  if (isExpired) {
    auction.status = Status.Assigned
    return 'orange'
  }
  const isCountdown = (auction.expiration - currentTimeStamp) <= settings.value.countDownTimeInSeconds + 2.0 // magic number 2
  if (isCountdown) {
    if (auction.bidderName !== null && auction.bidderName === myName.value) {
      return 'green'
    }
    else {
      return 'red'
    }
  }
  return 'secondary'
}

function calcProgress(currentTimeStamp: number, auction: Auction): number {
  const isPending = (auction.status === Status.Pending)
  if (isPending) { return 1.0 }
  const isAssigned = (auction.status === Status.Assigned)
  if (isAssigned) { return 1.0 }

  if (auction.expiration == null) {
    auction.status = Status.Assigned
    return 0;
  }
  const isExpired = (auction.expiration - currentTimeStamp) <= 0
  if (isExpired) { return 1.0 }

  const isCountdown = (auction.expiration - currentTimeStamp) <= settings.value.countDownTimeInSeconds + 2.0 // magic number 2
  let progress
  if (isCountdown) {

    progress = (auction.expiration - currentTimeStamp) / settings.value.countDownTimeInSeconds
  }
  else {
    progress = (auction.expiration - currentTimeStamp) / settings.value.bidDurationInSeconds
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
    if (isAutoFetch.value) {
      fetchAuctions(roomId)
    }
  }, 4000)

})

onBeforeUnmount(() => {
  clearInterval(interval)
  clearInterval(fetchInterval)
})


// Not reactive
const myName = ref('DefaultAndy');
const columns = ref([
  {
    name: 'watch',
    required: true,
    label: 'Watch',
    align: 'left',
    field: 'watch',
    sortable: true,
  },
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
  fetch(roomId);
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
  const newBid: number = minimumAcceptableBid(auction, settings.value);
  bids.value.setBid(auction.itemId, auction.rowId, newBid);
}

function onIncrement(auction: Auction): void {
  console.log('@onIncrement');
  const newBid: number = getNextIncrement(auction, settings.value, bids.value);
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
  const isValidMyBid: boolean = (val !== null) && (!isNaN(val)) && (val >= minimumAcceptableBid(auction, settings.value))
  if (!isValidMyBid) {
    $q.notify({
      progress: true,
      timeout: 1500,
      message: `Minimum bid is ${minimumAcceptableBid(auction, settings.value)}!`,
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
    .patch(`/api/rooms/${roomId}/auctions`, myBid)
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

<style lang="scss">
@import '/src/css/app.scss';

.auction-table {
  border-radius: 5px;
  border: 1px solid $solarizedbase00;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
  background: $solarizedbase03;
};
td {
  border-style: hidden !important;
};
</style>

