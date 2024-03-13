<template>
  <q-page padding class="row">
    <div class="col-lg-2 col-md-0 px-0"></div>
    <div class="col-lg-8 col-md-12 q-mt-md">
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
          <div class="col-6">
            <div class="text-h4">Room</div>
            <q-input v-model="roomId" color="primary"  label="RoomId" readonly />
          </div>
          <div class="col-6">
            <q-img ratio="1" style="max-height: 120px" fit="contain" :src="getNamespaceImageSrc(settings.namespace)" spinner-color="white" />
          </div>
        </div>

        <div class="justify-left">
          <q-toggle v-if:="roomStore.isAdmin" v-model="isShowAdminControls" color="primary" label="Show admin controls"
            size="lg" />

          <q-toggle v-model="isAdmin" color="primary" label="Test admin" size="lg" />
        </div>

        <div>
          <div>
            <div v-if="isAdmin && isShowAdminControls">
              <AdminRoomSettings />
              <q-separator spaced inset />
            </div>
            <div>
              <SessionApp />
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="col-lg-2 col-md-0 px-0"></div>
  </q-page>
</template>

<script lang="ts" setup>
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

import { getNamespaceImageSrc } from 'src/utils/GetNamespaceImgSrc';

const { settings, isAdmin, isShowAdminControls } = storeToRefs(roomStore);

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
  border: 1px solid $solarizedbase01;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
}
</style>
