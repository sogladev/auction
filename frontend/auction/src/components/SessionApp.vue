<template>
  <div class="q-pa-md">

    <q-card class="settings-card">
      <div class="text-h6">Settings</div>

      <!-- https://quasar.dev/vue-components/list-and-list-items#introduction -->
      <p v-if:="Object.keys(roomState).length === 0">Session is not loaded!</p>
      <q-list dense v-if:="Object.keys(roomState).length > 0">
        <q-item> <q-item-section>name</q-item-section> <q-item-section>{{ roomState.name }}</q-item-section>
        </q-item>
        <q-item> <q-item-section>enableDiscordProtection</q-item-section> <q-item-section>{{
          roomState.enableDiscordProtection }}</q-item-section> </q-item>
        <q-item> <q-item-section>bidDurationInSeconds</q-item-section> <q-item-section>{{ roomState.bidDurationInSeconds
        }}</q-item-section> </q-item>
        <q-item> <q-item-section>countDownTimeInSeconds</q-item-section> <q-item-section>{{
          roomState.countDownTimeInSeconds }}</q-item-section> </q-item>
        <q-item> <q-item-section>restrictBidsToEquipable</q-item-section> <q-item-section>{{
          roomState.restrictBidsToEquipable }}</q-item-section> </q-item>
        <q-item> <q-item-section>hideNameOfHighestBidder</q-item-section> <q-item-section>{{
          roomState.hideNameOfHighestBidder }}</q-item-section> </q-item>
        <q-item> <q-item-section>hidePayoutDetails</q-item-section> <q-item-section>{{ roomState.hidePayoutDetails
        }}</q-item-section> </q-item>
        <q-item> <q-item-section>organiserFee</q-item-section> <q-item-section>{{ roomState.organiserFee
        }}</q-item-section> </q-item>
        <q-item> <q-item-section>minimumBid</q-item-section> <q-item-section>{{ roomState.minimumBid }}</q-item-section>
        </q-item>
        <q-item> <q-item-section>minimumBidIncrement</q-item-section> <q-item-section>{{ roomState.minimumBidIncrement
        }}</q-item-section> </q-item>
      </q-list>
    </q-card>

    <q-card class="sync-session-card">
      <div class="text-h6">Synchronize Session with Database</div>
      <q-card-actions align="center">
        <q-btn unelevated icon="sync" @click="onSubmitSyncRoom" type="submit" color="secondary" label="Synchronize" />
      </q-card-actions>
    </q-card>

    <div class="text-h6">Auctions</div>
    <q-table flat bordered v-model:rows="rows" v-model:columns="columns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="rowId" :props="props">
            <q-badge color="green">
              {{ props.row.rowId }}
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
              <div v-if="props.row.bid">
                {{ props.row.bid }}
              </div>
              <div v-else>
                {{ props.row.minimumPrice }}
              </div>
            </q-badge>
          </q-td>
          <q-td key="myBid" :props="props">
            <q-badge color="purple">
              {{ props.row.myBid ? props.row.myBid : 'Click to bid' }}
            </q-badge>
            <q-popup-edit :props="props" v-model.number="props.row.myBid" auto-save v-slot="scope">
              <q-input type="number" :min="minimumAcceptableBid(props.row, roomState)" :step="props.row.minimumIncrement"
                v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" :rules="[
                  (val) =>
                    (!isNaN(val) && val >= minimumAcceptableBid(props.row, roomState)) ||
                    `Minimum bid is ${minimumAcceptableBid(props.row, roomState)}!`,
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
            <q-btn icon="shopping_cart" @click="onSubmit(props.row)"></q-btn>
          </q-td>
          <!--
          <q-td key="Delete" :props="props">
              <q-btn icon="delete" @click="onDelete(props.row)"></q-btn>
            </q-td>
-->
        </q-tr>
      </template>
    </q-table>

  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

import { AuctionState, Bid, RoomState } from 'src/components/models';
import { minimumAcceptableBid } from 'src/components/MinimumAcceptableBid';

const $q = useQuasar();
const route = useRoute();
const roomId = route.params.id;

// Export to CSV button
// https://quasar.dev/vue-components/table#introduction
const rows = ref([]);
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

const roomState = reactive<RoomState>({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateSessionSettingsFromResponse(data: any): RoomState {
  const newRoomState = <RoomState>{
    name: data.name,
    enableDiscordProtection: data.enableDiscordProtection,
    bidDurationInSeconds: data.bidDurationInSeconds,
    countDownTimeInSeconds: data.countDownTimeInSeconds,
    restrictBidsToEquipable: data.restrictBidsToEquipable,
    hideNameOfHighestBidder: data.hideNameOfHighestBidder,
    hidePayoutDetails: data.hidePayoutDetails,
    organiserFee: data.organiserFee,
    minimumBid: data.minimumBid,
    minimumBidIncrement: data.minimumBidIncrement,
  };
  return newRoomState
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowsFromResponseDataAuctions(data: any): Array<AuctionState> {
  // TODO: Update rows rather than overwriting
  const newRows: Array<AuctionState> = [];
  for (const auction of data.auctions) {
    const newAuction = <AuctionState>{
      expiration: auction.expiration,
      guid: auction.guid,
      itemId: auction.itemId,
      itemLevel: auction.itemLevel,
      itemName: auction.itemName,
      itemSubType: auction.itemSubType,
      itemType: auction.itemType,
      minLevel: auction.minLevel,
      minimumPrice: auction.minimumPrice,
      quality: auction.quality,
      rowId: auction.rowId,
      status: auction.status,
      // bid and bidderName are null if not started
      bid: auction.bid,
      bidderName: auction.bidderName,
    }
    newRows.push(newAuction)
  }
  return newRows;
}

async function onSubmitSyncRoom() {
  console.log('@submet.prevent');
  console.log(`onSubmitSyncRoom for roomId: ${roomId}`);
  api
    .get(`/api/rooms/${roomId}`)
    .then((response) => {
      console.log(response);
      // Some rooms do not have auctions
      if (response.data.hasOwnProperty('auctions')) {
        // Update Auctions
        if (response.data.auctions !== null) {
          const newRows: Array<AuctionState> = rowsFromResponseDataAuctions(response.data);
          Object.assign(rows.value, newRows)
        }
      }
      // Update Settings / Room State
      // Object.assign better than? `settings.value = updateSessionSettingsFromResponse(response.data);`
      const newRoomState: RoomState = updateSessionSettingsFromResponse(response.data);
      Object.assign(roomState, newRoomState)
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Loading failed',
        icon: 'report_problem',
      });
    });
}

// TODO: Instantly load room settings on navigation
// onSubmitSyncRoom()

function onIncrement(auction: AuctionState): void {
  console.log('@onIncrement');
  console.log(auction);
  console.log(roomState);
  auction.myBid = minimumAcceptableBid(auction, roomState);
}

async function onSubmit(auction: AuctionState): void {
  console.log('@onSubmit');
  console.log(auction);
  if (auction.myBid == undefined) {
    console.log('@onSubmit Bid undefined. Not submitting');
    return;
  }
  // Submit bid to API
  const myBid = <Bid>{
    itemId: auction.itemId,
    rowId: auction.rowId,
    myName: 'user1',
    myBid: auction.myBid,
  }
  console.log('@onSubmit Bid Submitted');
  api
    .patch(`/api/rooms/${roomId}`, myBid)
    .then((response) => {
      console.log('response next line');
      console.log(response);
      // BadRequest if bid is too low
      // 404 is something else went wrong
      // form is all is well
      if (response.data.hasOwnProperty('auctions')) {
        // Update Auctions
        const newRows: Array<AuctionState> = rowsFromResponseDataAuctions(
          response.data,
        );
        Object.assign(rows.value, newRows);
      }
      // Update Settings / Room State
      // Object.assign better than? `settings.value = updateSessionSettingsFromResponse(response.data);`
      const newRoomState: RoomState = updateSessionSettingsFromResponse(
        response.data,
      );
      Object.assign(roomState, newRoomState);
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
