<template>
  <div class="flex flex-center column">
    <div class="text-h6" style="text-align:center">You are in Room {{ roomId }}</div>
    <q-card class="room-card">
      <div class="admin-room-settings">
        <div class="text-h6">Admin Settings</div>
        <AdminRoomSettings />
      </div>
      <div class="session-app">
        <div class="text-h6">Session</div>
        <SessionApp />
      </div>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import AdminRoomSettings from 'components/AdminRoomSettings.vue';
import SessionApp from 'components/SessionApp.vue';

import { useRoute } from 'vue-router';

const route = useRoute();
const roomId = route.params.id;
</script>
