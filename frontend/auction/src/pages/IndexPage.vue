<template>
  <div class="flex-center column">
    <div class="text-h6">Auction App</div>
    <div class="index-card-section">
      <div class="text-h6">Room</div>
      <q-form ref="for" @submit.prevent="onSubmitCreateRoom">
        <div>
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
        </div>

        <div class="namespace-selection">
          <div class="text-h6">Select namespace</div>
          <div class="row">
            <div @click="onNamespaceSelection(Namespace.Era)" class="col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm" :class="isEraSelected">
                <q-img ratio="1" fit="contain" src="/src/assets/wow-logo/wow-classic_1_1_240.png" spinner-color="white"
                  img-class="img-namespace">
                </q-img>
              </div>
            </div>

            <div @click="onNamespaceSelection(Namespace.Progression)" class="col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm" :class="isProgressionSelected">
                <q-img ratio="1" fit="contain" src="/src/assets/wow-logo/wow-wrath_1_1_240.png" spinner-color="white"
                  img-class="img-namespace">
                </q-img>
              </div>
            </div>
            <div @click="onNamespaceSelection(Namespace.Retail)" class="col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm" :class="isRetailSelected">
                <q-img ratio="1" fit="contain" src="/src/assets/wow-logo/wow-dragonflight_1_1_240.png"
                  spinner-color="white" img-class="img-namespace">
                </q-img>
              </div>
            </div>
          </div>
        </div>

        <div class="q-my-md" align="center">
          <q-btn unelevated type="submit" :disable="isButtonDisable" color="primary" label="Create Room" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useRoomStore } from 'src/stores/RoomStore';
import { Namespace } from 'src/components/models';
import { ref } from 'vue';

const $q = useQuasar();
const router = useRouter();

const isEraSelected = ref('namespace-select-inactive')
const isProgressionSelected = ref('namespace-select-inactive')
const isRetailSelected = ref('namespace-select-inactive')

const isButtonDisable = ref(true)


async function onNamespaceSelection(namespace: Namespace) {
  isEraSelected.value = (namespace == Namespace.Era) ? 'namespace-select-active' : 'namespace-select-inactive';
  isProgressionSelected.value = (namespace == Namespace.Progression) ? 'namespace-select-active' : 'namespace-select-inactive';
  isRetailSelected.value = (namespace == Namespace.Retail) ? 'namespace-select-active' : 'namespace-select-inactive';
  isButtonDisable.value = false;
}

function getNamespaceFromCSS(): Namespace | false {
  if (isEraSelected.value == 'namespace-select-active') {
    return Namespace.Era;
  }
  if (isProgressionSelected.value == 'namespace-select-active') {
    return Namespace.Progression
  }
  if (isRetailSelected.value == 'namespace-select-active') {
    return Namespace.Retail
  }
  return false
}

async function onSubmitCreateRoom() {
  console.log('@submet.prevent');
  const selectedNamespace = getNamespaceFromCSS()

  // Validate if we have a namespace
  if (!selectedNamespace) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'You must selected a namespace!',
      icon: 'report_problem',
    });
    return;
  };
  useRoomStore().create(selectedNamespace).then((roomId) => router.push({ path: `/room/${roomId}` }))
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
  cursor: pointer;
  user-select: none;
  max-height: 180px;
}

.namespace-select-active {
  border: 3px solid #1976d2;
  opacity: 1.0;
}

.namespace-select-inactive {
  border: 3px solid #06485A;
  opacity: 0.8;
}

.img-namespace {
  max-height: 180px;
}

</style>
