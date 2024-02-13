<template>
  <example-component
    title="Example component"
    active
    :todos="todos"
    :meta="meta"
  ></example-component>
  <h1>Welcome to a Room</h1>
  <p>This is the main room page {{ $route.params.id }} where auctions happen</p>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import { defineComponent, ref } from 'vue';

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
