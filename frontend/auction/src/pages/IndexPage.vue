<template>
  <div class="flex flex-center column">
    <div class="text-h6">Auction App</div>
    <div class="row bg-blue-10"><IndexForm /></div>
  </div>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import { defineComponent, ref } from 'vue';
import IndexForm from 'components/IndexForm.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { IndexForm },
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
