<template>
  <v-card theme="dark">
    <v-card-text>
      <v-form @submit.prevent="submit">
        <div v-for="(item, index) in modelValue" :key="index" class="mb-8">
          <div class="text-h6 text-blue-lighten-4">{{ item.title }}</div>
          <div class="text-h5 text-light-blue-lighten-3">
            {{ item.description }}
          </div>
          <v-textarea
            :label="getLabel(`${item.title}: ${item.description}`)"
            v-model="item.value"
          />
        </div>
      </v-form>
    </v-card-text>

    <v-dialog
      max-width="70vw"
      :persistent="loading"
      v-model="preview.show"
      scrollable
      theme="dark"
    >
      <v-card theme="dark">
        <SaveButton
          v-if="preview.details.length"
          :type="type"
          :content="preview.details[window]"
        />
        <v-card-text>
          <div
            class="d-flex justify-center pa-8"
            v-if="loading && preview.details.length === 0"
          >
            <v-progress-circular indeterminate size="large" />
          </div>
          <v-window v-model="window" v-else>
            <v-window-item
              v-for="(item, index) in preview.details"
              :key="index"
            >
              <!-- <div
                style="white-space: pre-wrap; font-size: 1.15rem;"
                class="text-light-blue-lighten-4"
              >
                {{ item }}
              </div> -->
              <Markdown :source="item" />
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions v-if="preview.details.length > 0">
          <div class="flex-grow-1 d-flex justify-center flex-column">
            <div class="text-center" v-if="preview.details.length > 1">
              <v-btn
                variant="outlined"
                @click="window -= 1"
                :disabled="window === 0"
              >
                Prev
              </v-btn>
              <v-btn
                variant="outlined"
                @click="window += 1"
                :disabled="window === preview.details.length - 1"
              >
                Next
              </v-btn>
            </div>
            <div class="text-center mt-4">
              <v-btn color="success" @click="submit" :loading="loading">
                Generate Again
              </v-btn>
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: { type: Array },
    context: { type: Array },
    systemMessage: { type: Object },
    placeholder: { type: String },
    type: { type: String },
  },
  setup(props) {
    const bottomNav = useState('bottomNav')
    const showButton = bottomNav.value.buttons.find((i) => i.title === 'Show')

    showButton.visible = false

    const loading = ref(false)
    const preview = ref({
      show: false,
      details: [],
    })
    const window = ref(0)

    const getLabel = (label) => {
      return props.placeholder || label
    }

    const form = computed(() => {
      return {
        systemMessage: props.systemMessage || undefined,
        formMessage: props.modelValue?.map((i) => ({
          message: `${i.title}: ${i?.value?.toUpperCase() || 'any'}`,
        })),
        context: props.context || undefined,
      }
    })

    const submit = async ({ reset = false }) => {
      loading.value = true

      preview.value.show = true
      if (reset) {
        preview.value.details = []
      }
      const { data } = await useFetch('/api/chat-v2', {
        method: 'post',
        body: form.value,
      })
      window.value = 0
      preview.value.details.unshift(data.value.text)

      showButton.visible = true
      showButton.click = () => {
        preview.value.show = !preview.value.show
      }

      loading.value = false
    }

    bottomNav.value.buttons.find((i) => i.title === 'Generate').click = () => {
      submit({ reset: true })
    }

    return { form, submit, loading, preview, getLabel, window }
  },
})
</script>