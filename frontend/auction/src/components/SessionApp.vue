
<template>
  <div class="q-pa-md">
    <q-card class="sync-session-card">
      <div class="text-h6">Update session from database</div>
      <q-card-actions align="center">
        <q-btn
          unelevated
          @click="onSubmitSyncRoom"
          type="submit"
          color="secondary"
          label="Synchronize"
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
import { useRoute } from 'vue-router';

const $q = useQuasar();
const route = useRoute();
const roomId = route.params.id;

const rows = ref([])
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowsFromResponseDataAuctions(data: any) {

  if (!data.hasOwnProperty('auctions')){
    return -1
  }
  const newRows = []
  for (const auction of data.auctions) { // TODO: data[0] should be data. Revisited later
    newRows.push({
      rowId: auction.rowId,
      name: auction.itemName,
      minimumPrice: auction.minimumPrice,
      expiration: auction.expiration,
    })

  }
  return newRows
}

async function onSubmitSyncRoom() {
  console.log('@submet.prevent');
  console.log(`onSubmitSyncRoom for roomId: ${roomId}`);
  api
    .get(`/api/rooms/${roomId}`)
    .then((response) => {
      console.log(response);
      rows.value = rowsFromResponseDataAuctions(response.data);
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

function onRowClick(data: string): void {
  alert(`${data} clicked`);
}

</script>
