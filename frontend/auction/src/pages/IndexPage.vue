<template>
  <example-component
    title="Example component"
    active
    :todos="todos"
    :meta="meta"
  ></example-component>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import { defineComponent, ref } from 'vue';

//
//  <q-layout view="hhh lpR fFf">
//    <q-page-container>
//      <router-view />
//    </q-page-container>
//  </q-layout>

export default defineComponent({
  name: 'IndexPage',
  components: { ExampleComponent },
  setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1',
      },
    ]);
    const meta = ref<Meta>({
      totalCount: 1200,
    });
    return { todos, meta };
  },
});
</script>
