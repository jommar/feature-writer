<template>
  <v-card class="bg-grey-darken-4">
    <v-window v-model="window" :show-arrows="!loading" theme="dark">
      <template #prev="{props}">
        <v-btn color="info" variant="text" @click="props.onClick">
          Prev
        </v-btn>
      </template>
      <template #next="{props}">
        <v-btn color="info" variant="text" @click="props.onClick">
          Next
        </v-btn>
      </template>
      <v-window-item v-for="(res, index) in data" :key="index">
        <v-card theme="dark" class="d-flex justify-center align-center">
          <v-card-text style="overflow: auto; max-height: 80vh;">
            <div style="white-space: pre-wrap;">
              {{ res?.text }}
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-container class="text-center">
      <v-btn
        :loading="loading"
        @click="$emit('generate')"
        color="light-blue"
        variant="text"
      >
        Generate again
      </v-btn>
      <v-btn
        v-if="!loading"
        :loading="loading"
        @click="$emit('hide')"
        color="error"
        variant="text"
      >
        Close
      </v-btn>
    </v-container>
  </v-card>
</template>
<script>
export default {
  props: {
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: () => false },
  },
  setup() {
    const window = ref(0)

    return { window }
  },
}
</script>
