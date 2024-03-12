<template>
  <q-page class="row">
  <div class="col-2 px-0"></div>
  <div class="col-8 q-mt-md">
    <div class="text-h4 text-center">Auction App</div>
    <div>
      <q-form ref="for" @submit.prevent="onSubmitCreateRoom">
        <div class="namespace-selection q-my-md">
          <div class="text-h5 text-left">Select namespace</div>
          <div class="row q-my-md">
            <div @click="onNamespaceSelection(Namespace.Era)" class="col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm" :class="isEraSelected">
                <q-img ratio="1" fit="contain" :src="getNamespaceImageSrc(Namespace.Era)" spinner-color="white"
                  img-class="img-namespace">
                </q-img>
              </div>
            </div>

            <div @click="onNamespaceSelection(Namespace.Progression)" class="col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm" :class="isProgressionSelected">
                <q-img ratio="1" fit="contain" :src="getNamespaceImageSrc(Namespace.Progression)" spinner-color="white"
                  img-class="img-namespace">
                </q-img>
              </div>
            </div>
            <div @click="onNamespaceSelection(Namespace.Retail)" class="col-sm-4 col-xs-12">
              <div class="namespace-select q-mx-sm" :class="isRetailSelected">
                <q-img ratio="1" fit="contain" :src="getNamespaceImageSrc(Namespace.Retail)" spinner-color="white"
                  img-class="img-namespace">
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
  <div class="col-2 px-0"></div>
</q-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { useRoomStore } from 'src/stores/RoomStore';
import { Namespace } from 'src/components/models';
import { getNamespaceImageSrc } from 'src/utils/GetNamespaceImgSrc';

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
