<template>
    <div class="flex flex-center column">
    <div class="text-h6" style="text-align:center">You are in a Room</div>
    <q-card class="create-session-card">
      <div class="text-h6">Create session</div>
      <q-form ref="for" @submit.prevent="onSubmitRoomString">
        <q-card-section>
          <q-card-section class="justify-around">
            <div class="text-h7">
              Import items by pasting your import string
            </div>
            <q-input max debounce="500" label="Paste your string here"
              v-model="csvString"
              filled
              type="textarea"
              :rules="[
                (val) =>
                  (typeof val == 'string' &&
                    val.startsWith(validationHeader)) ||
                  'Invalid import string. Copy all output from /hlm e!',
              ]"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              unelevated
              type="submit"
              color="primary"
              label="Create session"
            />
          </q-card-actions>
        </q-card-section>
      </q-form>
    </q-card>

    <q-card class="sync-session-card">
      <div class="text-h6">Sync session</div>
      <q-card-actions align="center">
        <q-btn
          unelevated
          @click="onSubmitSyncRoom"
          type="submit"
          color="secondary"
          label="Sync"
        />
      </q-card-actions>
    </q-card>

    <q-card class="session-card">
      <div class="text-h6">Session</div>
      <AuctionsTable v-model:rows="rows"/>
    </q-card>

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
  </div>
</template>

<script lang="ts" setup>
import Papa from 'papaparse';

import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import AuctionsTable from 'components/AuctionsTable.vue';

//const router = useRouter();
const bar = ref(null); // ajax bar
const $q = useQuasar();

//const rows = ref(null);
const rows = ref([
        {
          rowId: 1,
          name: 'RoomPage init',
          minimumPrice: 5,
          expiration: 1234,
        },
      ])

function loadData() {
  api
    .get('/api/rooms')
    .then((response) => {
      console.log(response);
// rowId, name, minimumPrice, expiration
      //data.value = response.data
      rows.value = [
        {
          rowId: 1,
          name: 'name',
          minimumPrice: 10,
          expiration: 1234,
        },
        {
          rowId: 2,
          name: 'othername',
          minimumPrice: 12,
          expiration: 1234,
        },
        {
          rowId: 3,
          name: 'threename',
          minimumPrice: 11,
          expiration: 12098,
        },
      ]

    })
    .catch(() => {
      // TODO: still broken? q is not a function
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Loading failed',
        icon: 'report_problem',
      });
    });
}

const validationHeader =
  'rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid';

const debugImportString = `rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
`;

const csvString = ref(debugImportString);
const output = Papa.parse(csvString.value);
console.log(output);

async function onSubmitRoomString() {
  console.log('@submet.prevent on submit roomsring');
  // Post settings
}

async function onSubmitSyncRoom() {
  console.log('@submet.prevent sync room');
  // Get load data
  loadData();
}
</script>
