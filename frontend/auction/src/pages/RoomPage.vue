<template>
  <div class="flex flex-center column">
    <div v-if="isValidRoom" class="text-h6" style="text-align:center">You are in Room {{ roomId }}</div>
    <q-card-section>
      <div v-if="isValidRoom == null">
        <q-spinner color="primary" size="10em" />
      </div>
      <div v-if="isValidRoom">
        <q-field bg-color="green" filled>
          <template v-slot:prepend>
            <q-icon name="check" />
          </template>
          <template v-slot:control>
            <div class="self-center full-width no-outline text-h6" tabindex="0"> Valid Room </div>
          </template>
        </q-field>

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
    </q-card-section>

    <q-card-section v-if="isValidRoom" class="justify-left">
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

      <q-toggle v-model="isAdmin" color="warning" label="Test admin" size="lg" :value="false" />
    </q-card-section>

    <div v-if="isValidRoom">
      <q-card class="room-card">
        <div v-if="isAdmin" class="admin-room-settings">
          <div class="text-h6">Admin Settings</div>
          <div class="text-h7">configure settings, click save to update to db</div>
          <AdminRoomSettings />
        </div>
        <q-separator spaced inset />
        <div class="session-app">
          <div class="text-h6">Session</div>
          <div class="text-h7">Shows settings, button to synchronize with database, auction displays auctions</div>
          <SessionApp />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipboard } from 'quasar';
import { ref } from 'vue';

import AdminRoomSettings from 'components/AdminRoomSettings.vue';
import SessionApp from 'components/SessionApp.vue';
import { useRoomStore } from 'src/stores/RoomStore';

import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';


const route = useRoute();
const roomId = typeof route.params.id === 'string' ? route.params.id : route.params.id[0];
const roomStore = useRoomStore();
const { fetch } = roomStore;
const isValidRoom = ref();

const adminKey = ref('this is some key'); // ajax bar
const { isAdmin } = storeToRefs(roomStore);

if (isAdmin.value) {
  // isAdmin and store is set from creation page, so we don't have to fetch
  isValidRoom.value = true;
}
else {
  fetch(roomId).then((isSuccess) => isValidRoom.value = isSuccess);
}
</script>

<style>
.room-card {
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin: auto;
}

.admin-room-settings {
  margin: 16px auto;
}

.session-app {
  margin: 16px auto;
}

p {
  width: 33em;
}
</style>
