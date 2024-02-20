
<template>
  <div class="q-pa-md">
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

    <q-table flat bordered title="Auctions" v-model:rows="rows" v-model:columns="columns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="rowId" :props="props">
            <q-badge color="green">
              {{ props.row.rowId }}
            </q-badge>
          </q-td>
          <q-td key="name" :props="props" @click="onRowClick(props.row.name)">
            {{ props.row.name }}
          </q-td>
          <q-td key="minimumPrice" :props="props">
            <q-badge color="purple">
              {{ props.row.minimumPrice }}
            </q-badge>
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
import { ref } from 'vue';

import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
const $q = useQuasar();

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

const rows = ref([
        {
          rowId: 1,
          name: 'RoomPage init',
          minimumPrice: 5,
          expiration: 1234,
        },
      ])

const columns = ref([
  {
    name: 'rowId',
    required: true,
    label: 'RowId',
    align: 'left',
    field: 'rowId',
    sortable: true
  },
  { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
  { name: 'minimumPrice', label: 'Bid', field: 'minimumPrice', sortable: true, sort: (a: string, b:string) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'expiration', label: 'Expiration', field: 'expiration', sortable: true, sort: (a:string, b:string) => parseInt(a, 10) - parseInt(b, 10) },
])

async function onSubmitSyncRoom() {
  console.log('@submet.prevent sync room');
  // Get load data
  loadData();
}

// rowId, name, minimumPrice, expiration
function onRowClick(data: string): void {
  alert(`${data} clicked`);
}

</script>
