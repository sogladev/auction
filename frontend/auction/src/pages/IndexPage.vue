<template>
  <div class="flex flex-center column">
    <div class="text-h6">Flex playground example</div>
    <div
      class="row bg-blue-grey-2"
      style="min-height: 320; max-width: 95%; padding: 24px"
    >
      <div id="parent" class="fit row wrap text-center content-start">
        <IndexForm />

        <example-component
          title="Example component"
          active
          :todos="todos"
          :meta="meta"
        ></example-component>
        <p>This is the main index page used as a starting point</p>

        <div class="col-12 bg-grey-6" style="overflow: auto">
          <q-field outlined label="Outlined" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                Field content
              </div>
            </template>
          </q-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import { defineComponent, ref } from 'vue';
import IndexForm from 'components/IndexForm.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { ExampleComponent, IndexForm},
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
