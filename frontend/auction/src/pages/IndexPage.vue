<template>
  <div class="flex-center column">
    <div class="text-h6">Auction App</div>
    <q-card-section class="index-card-section">
      <div class="text-h6">Room</div>
      <q-form ref="for" @submit.prevent="onSubmitCreateRoom">
        <q-card-section>
          <div class="text-h7">
            This button allows you to create a room where you can configure and start a session. In this session, you
            can
            import items from your inventory or other sources and bid on them with other players. The settings for the
            room
            include options such as setting a name (like 'myname'), enabling Discord protection, specifying how long
            each
            bid lasts in seconds (240), determining the countdown time before bidding starts in seconds (40), and
            restricting bids to only items that are equipable.
          </div>
        </q-card-section>

        <q-card-section class="namespace-selection">
          <div class="text-h6">Select namespace</div>
          <div class="row">
            <div class="col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm">
                <q-img ratio="1" fit="contain" src="/src/assets/wow-logo/wow-classic_1_1_240.png" spinner-color="white"
                  img-class="img-namespace">
                </q-img>
              </div>
            </div>
            <div class=" col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm">
                <q-img ratio="1" fit="contain" src="/src/assets/wow-logo/wow-wrath_1_1_240.png" spinner-color="white"
                  img-class="img-namespace">
                </q-img>
              </div>
            </div>
            <div class="col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm">
                <q-img ratio="1" fit="contain" src="/src/assets/wow-logo/wow-dragonflight_1_1_240.png" spinner-color="white"
                  img-class="img-namespace">
                </q-img>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn unelevated type="submit" color="secondary" label="Create Room" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useRoomStore } from 'src/stores/RoomStore';

const $q = useQuasar();
const router = useRouter();

async function onSubmitCreateRoom() {
  console.log('@submet.prevent');
  useRoomStore().create().then((roomId) => router.push({ path: `/room/${roomId}` }))
    .catch(() => {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Creating room failed',
        icon: 'report_problem',
      });
    });
}
</script>

<style>
.index-card-section {
  display: flex;
  flex-direction: column;
  padding: 5px;
  max-width: 66%;
  min-width: 33em;
  margin: auto;
}

.namespace-select {
  border-radius: 15px;
  border: 3px solid #06485A;
  cursor: pointer;
  user-select: none;
  max-height: 180px;
}

.img-namespace {
  opacity: 0.8;
  max-height: 180px;
}

.img-namespace-selected {
  opacity: 1.0;
}
</style>
