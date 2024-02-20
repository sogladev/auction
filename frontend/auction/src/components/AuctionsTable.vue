
<template>
  <div class="q-pa-md">
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


const rows = defineModel('rows')

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

// rowId, name, minimumPrice, expiration
function onRowClick(data: string): void {
  alert(`${data} clicked`);
}

</script>
