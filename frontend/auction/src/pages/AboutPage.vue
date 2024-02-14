<template>
  <h1>About page</h1>
  <p>This is the about page</p>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { },
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
