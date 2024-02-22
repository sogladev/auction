<template>
  <div class="q-pa-md">

    <q-card class="settings-card">
      <div class="text-h6">Room Settings</div>

      <!-- https://quasar.dev/vue-components/list-and-list-items#introduction -->
      <p v-if:="Object.keys(roomState).length === 0">Session is not loaded!</p>
      <q-list bordered padding v-if:="Object.keys(roomState).length > 0">
        <q-item> <q-item-section>lootmaster</q-item-section> <q-item-section>{{ roomState.lootmaster }}</q-item-section>
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
        <q-btn unelevated @click="onSubmitSyncRoom" type="submit" color="secondary" label="Synchronize" />
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
          <q-td key="itemName" :props="props" @click="onRowClick(props.row.name)">
            {{ props.row.itemName }}
          </q-td>
          <q-td key="minimumPrice" :props="props">
            <q-badge color="purple">
              {{ props.row.minimumPrice }}
            </q-badge>
          </q-td>
          <q-td key="minimumPrice" :props="props">
            <q-badge color="purple">
              {{ props.row.myBid ? props.row.myBid : 'Click to bid' }}
            </q-badge>
            <q-popup-edit v-model.number="props.row.myBid" auto-save v-slot="scope">
              <q-input type="number" step="props.row.minimumIncrement" v-model.number="scope.value" dense autofocus
                @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="expiration" :props="props">
            <q-badge color="orange">
              {{ props.row.expiration }}
            </q-badge>
          </q-td>
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

const $q = useQuasar();
const route = useRoute();
const roomId = route.params.id;

const rows = ref([]);
const columns = ref([
  {
    name: 'rowId',
    required: true,
    label: 'RowId',
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
    name: 'minimumPrice',
    label: 'Bid',
    field: 'minimumPrice',
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
]);


type AuctionState = {
  // TODO: Missing, requires changes before changing this
  //name: auction.itemName,
  // mybid
  // bid
  expiration?: number,
  guid?: string,
  itemId?: number,
  itemLevel?: number,
  itemName?: string,
  itemSubType?: string,
  itemType?: string,
  minLevel?: number,
  minimumPrice?: number,
  quality?: number,
  rowId?: number,
  status?: number,
};

type RoomState = {
  lootmaster?: string;
  enableDiscordProtection?: boolean;
  bidDurationInSeconds?: number;
  countDownTimeInSeconds?: number;
  restrictBidsToEquipable?: boolean;
  hideNameOfHighestBidder?: boolean;
  hidePayoutDetails?: boolean;
  organiserFee?: number;
  minimumBid?: number;
  minimumBidIncrement?: number;
};

const roomState = reactive<RoomState>({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateSessionSettingsFromResponse(data: any): RoomState {
  const newRoomState = <RoomState>{
    lootmaster: data.name,
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
function rowsFromResponseDataAuctions(data: any): any[] {
// TODO: Update rows rather than overwriting
  const newRows = [];
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
      // TODO: Add bid, highestbidder
      bid: auction.minimumPrice
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
        const newRows = rowsFromResponseDataAuctions(response.data);
        Object.assign(rows.value, newRows)
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

function onRowClick(data: string): void {
  alert(`${data} clicked`);
}
</script>
