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
            :label="getLabel(`${item.title || ''}: ${item.description || ''}`)"
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
    temperature: { type: Number, default: () => 0.8 },
  },
  setup(props) {
    const bottomNav = useState('bottomNav')
    const showButton = bottomNav.value.buttons.find((i) => i.title === 'Show')
    const generateButton = bottomNav.value.buttons.find(
      (i) => i.title === 'Generate',
    )

    generateButton.visible = true
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
        formMessage: props.modelValue
          ?.map((i) => {
            let message = `${i.title}: ${i?.value?.toUpperCase() || 'any'}`
            if (i.useDescription) {
              message = i.value
                ? `${i.description}: ${i.value.toUpperCase()}`
                : ''
            }
            return {
              message,
            }
          })
          ?.filter((i) => i?.message),
        context: props.context || undefined,
      }
    })

    const submit = async ({ reset = false }) => {
      if (reset) {
        preview.value.details = []
      }
      preview.value.show = true
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form.value, temperature: props.temperature }),
      }
      fetch('/api/chat-v2', config)
        .then(async (response) => {
          const reader = response.body.getReader()
          preview.value.details.unshift('')

          const processChunk = ({ done, value }) => {
            if (done) {
              console.log('Stream finished')
              return
            }

            const chunk = new TextDecoder().decode(value)

            // Update the Vue data property
            if (chunk) {
              preview.value.details[0] += chunk
            }

            return reader.read().then(processChunk)
          }

          return reader.read().then(processChunk)
        })
        .catch((error) => {
          console.error(error)
        })
      showButton.visible = true
      showButton.click = () => {
        preview.value.show = !preview.value.show
      }
    }

    bottomNav.value.buttons.find((i) => i.title === 'Generate').click = () => {
      submit({ reset: true })
    }

    return { form, submit, loading, preview, getLabel, window }
  },
})
</script>
