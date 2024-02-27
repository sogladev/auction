<template>
  <div class="flex flex-center column">
    <div class="text-h6" style="text-align:center">You are in Room {{ roomId }}</div>
    <q-card class="create-session-card">

      <div class="text-h6">Admin Settings</div>
      <RoomSettingsForm />
      <q-form ref="for" @submit.prevent="onSubmitUpdateItems">
        <q-card-section>
          <div class="text-h6">Items</div>
          <q-card-section class="justify-around">
            <div class="text-h7">
              Import items by pasting your import string
            </div>
            <q-input max debounce="500" label="Paste your string here" v-model="csvString" filled type="textarea" :rules="[
              (val) =>
                (typeof val == 'string' &&
                  val.startsWith(validationHeader)) ||
                'Invalid import string. Copy all output from /hlm e!',
            ]" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn unelevated type="submit" color="primary" label="Update items" />
          </q-card-actions>
        </q-card-section>
      </q-form>

      <div class="text-h6">Session</div>
      <SessionApp />
    </q-card>

    <q-ajax-bar ref="bar" position="bottom" color="accent" size="10px" skip-hijack />
  </div>
</template>

<script lang="ts" setup>
import RoomSettingsForm from 'components/RoomSettingsForm.vue';
import Papa from 'papaparse';

import { ref } from 'vue';

import { useRoute } from 'vue-router';
const route = useRoute();
const roomId = route.params.id;

import SessionApp from 'components/SessionApp.vue';

//const router = useRouter();
const bar = ref(null); // ajax bar

const validationHeader =
  'rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid';

const debugImportString = `rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
`;

const csvString = ref(debugImportString);

async function onSubmitUpdateItems() {
  console.log('@submet.prevent on submit roomsring');
  const output = Papa.parse(csvString.value);
  console.log(output);
  console.log('TODO: Create session from import string');
  // TODO: Create session from import string
  // Populate "Auctions" data and start session
}

</script>
