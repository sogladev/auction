<template>
  <div class="flex flex-center column">
    <div class="text-h6">You are in a Room</div>
    <q-card class="create-room-card">
      <q-form ref="for">
        <q-card-section>
          <q-card-section class="justify-around" style="width: 50vmax">
            <div class="text-h7">
              Import items by pasting your import string
            </div>
            <q-input
              max
              debounce="500"
              label="Paste your string here"
              v-model="importString"
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
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
const validationHeader =
  'rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid';

const debugImportString = `rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
`;

import { ref } from 'vue';
const importString = ref(debugImportString);
console.log(importString);
</script>
