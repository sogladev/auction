<template>
  <q-page class="row">
    <div class="col-2 px-0"></div>
    <div class="col-8 q-mt-md">
      <div v-if="isValidRoom == null">
        <q-spinner color="primary" size="10em" />
      </div>
      <div v-if="isValidRoom === false">
        <q-field bg-color="red" filled>
          <template v-slot:prepend>
            <q-icon name="error" />
          </template>
          <template v-slot:control>
            <div class="self-center full-width no-outline text-h6" tabindex="0">Invalid Room!</div>
          </template>
        </q-field>
      </div>

      <div v-if="isValidRoom" class="room">
        <div class="row">
          <div class="col-8">
            <div class="text-h4" style="text-align:left">You are in Room</div>
            <div class="text-h5" style="text-align:left">{{ roomId }}</div>
          </div>
          <div class="col-4">
            <NamespaceImage style="max-width: 9em;" :namespace="Namespace.Era" />
          </div>
        </div>


        <div>
          <div>
            <q-field bg-color="green" filled>
              <template v-slot:prepend>
                <q-icon name="check" />
              </template>
              <template v-slot:control>
                <div class="self-center full-width no-outline text-h6" tabindex="0"> Valid Room </div>
              </template>
            </q-field>
          </div>
        </div>

        <div class="justify-left">
          <q-toggle v-model="isShowAdminControls" color="warning" label="Show admin controls" size="lg" />
          <q-field bg-color="warning" color="warning" filled label="Admin secret key" stack-label>
            <template v-slot:prepend>
              <q-icon name="key" />
            </template>

            <template v-slot:append>
              <q-btn icon="content_copy" @click="copyToClipboard(adminKey)" />
            </template>

            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{ adminKey }}</div>
            </template>
          </q-field>

          <q-toggle v-model="isAdmin" color="warning" label="Test admin" size="lg" />
        </div>

        <div>
          <div>
            <div v-if="isAdmin && isShowAdminControls">
              <div class="text-h6">Admin Settings</div>
              <div class="text-h7">configure settings, click save to update to db</div>
              <AdminRoomSettings />
              <q-separator spaced inset />
            </div>
            <div>
              <div class="text-h6">Session</div>
              <div class="text-h7">Shows settings, button to synchronize with database, auction displays auctions</div>
              <SessionApp />
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="col-2 px-0"></div>
  </q-page>
</template>

<script lang="ts" setup>
import { copyToClipboard } from 'quasar';
import { ref } from 'vue';

import AdminRoomSettings from 'components/AdminRoomSettings.vue';
import SessionApp from 'components/SessionApp.vue';
import { useRoomStore } from 'src/stores/RoomStore';

import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import NamespaceImage from 'src/components/NamespaceImage.vue'
import { Namespace } from 'src/components/models';


const route = useRoute();
const roomId = typeof route.params.id === 'string' ? route.params.id : route.params.id[0];
const roomStore = useRoomStore();
const { fetch } = roomStore;
const isValidRoom = ref();

const adminKey = ref('this is some key'); // ajax bar
const { isAdmin, isShowAdminControls } = storeToRefs(roomStore);

if (isAdmin.value) {
  // isAdmin and store is set from creation page, so we don't have to fetch
  isValidRoom.value = true;
}
else {
  fetch(roomId).then((isSuccess) => isValidRoom.value = isSuccess);
}
</script>

<style lang="scss">
@import '/src/css/app.scss';

.room {
  margin: 0 auto;
  padding: 20px 10px;
  background-color: $solarizedbase03;
  border-radius: 5px;
  border: 1px solid $solarizedbase00;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
}
</style>
