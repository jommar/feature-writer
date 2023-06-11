<template>
  <v-container class="fill-height">
    <v-dialog v-model="form.showUpload">
      <v-card theme="dark">
        <v-card-text>
          <v-file-input v-model="form.file" label="CSV/JSON" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" prepend-icon="mdi-upload" @click="upload">
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div
      class="d-flex flex-column fill-height position-relative"
      style="width: 100%;"
    >
      <div class="flex-grow-1" style="overflow: auto;">
        <div>CHAT</div>
      </div>
      <div
        class="position-sticky bg-blur-grey-darken-4"
        style="left: 0; right: 0; bottom: 0;"
      >
        <v-textarea
          v-model="form.prompt"
          auto-grow
          rows="1.25"
          max-rows="4"
          clearable
          density="compact"
          label="Chat"
          @keydown="keydownHandler"
        >
          <template #append>
            <v-btn
              @click="form.showUpload = true"
              icon="mdi-upload"
              density="compact"
              color="blue-darken-4"
            />
          </template>
        </v-textarea>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const form = ref({
      file: [],
      prompt: '',
      messages: [],
      showUpload: false,
    })

    const send = async () => {
      const { data } = await useFetch('/api/chat-doc', {
        method: 'post',
        body: {
          prompt: form.value.prompt,
        },
      })

      console.log(data.value)
    }

    const upload = async () => {
      const formData = new FormData()
      formData.append('file', form.value.file[0])
      const { data } = await useFetch('/api/upload', {
        method: 'post',
        body: formData,
      })

      console.log(data.value)
    }

    const keydownHandler = (e: any) => {
      if (e.shiftKey) {
        return
      }
      if (e.keyCode === 13) {
        e.preventDefault()
        send()
      }
    }

    return { form, send, keydownHandler, upload }
  },
})
</script>
