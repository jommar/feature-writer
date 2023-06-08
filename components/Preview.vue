<template>
  <v-card class="bg-grey-darken-4">
    <v-window v-model="window" theme="dark">
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

    <section v-if="data.length > 1" class="d-flex justify-center mt-4">
      <v-btn
        class="mx-2"
        variant="outlined"
        @click="window -= 1"
        :disabled="window === 0"
      >
        PREV
      </v-btn>
      <v-btn
        class="mx-2"
        variant="outlined"
        @click="window += 1"
        :disabled="window === data.length - 1"
      >
        NEXT
      </v-btn>
    </section>

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
  setup(props) {
    const window = ref(0)
    watch(
      () => props.data.length,
      () => {
        window.value = 0
      },
    )

    return { window }
  },
}
</script>
