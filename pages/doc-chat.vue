<template>
  <v-container class="fill-height">
    <v-dialog v-model="form.showUpload">
      <v-card theme="dark">
        <v-card-text>
          <v-text-field label="Class Name" v-model="form.className" />
          <v-file-input v-model="form.file" label="CSV/JSON" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue"
            prepend-icon="mdi-upload"
            @click="upload"
            :loading="form.uploading"
            :disabled="!form.file[0] || !form.className"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div
      class="d-flex flex-column fill-height position-relative"
      style="width: 100%;"
    >
      <div>
        <v-hover
          v-for="item in schemas"
          :key="item.title"
          v-slot="{ isHovering }"
        >
          <!-- <v-btn
            class="mx-2"
            color="info"
            :variant="item.uploaded ? 'flat' : 'outlined'"
            density="compact"
          >
            {{ item.title }}
          </v-btn> -->
          <span>{{ item.title }}</span>
          <span>{{ isHovering }}</span>
        </v-hover>
      </div>
      <div class="flex-grow-1" style="overflow: auto;">
        <div
          v-for="(item, index) in memory"
          :key="index"
          class="my-4"
          style="white-space: pre-wrap;"
        >
          <div
            v-if="
              item.type === 'human' && !item?.data?.content.match(/^\*\*/gi)
            "
            class="text-blue-lighten-2 text-right"
            style="width: 70%; margin-left: auto;"
          >
            {{ item?.data?.content }}
          </div>
          <div
            v-if="item.type === 'ai'"
            class="text-light-blue-lighten-4"
            style="width: 70%;"
          >
            {{ item?.data?.content }}
          </div>
        </div>
      </div>
      <div
        class="position-sticky bg-blue-grey-darken-4"
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
          :loading="form.loading"
        >
          <template #append>
            <v-btn
              @click="form.showUpload = true"
              icon="mdi-upload"
              density="compact"
              color="blue-darken-4"
              :loading="form.loading"
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
    const bottomNav: any = useState('bottomNav')
    const schemas: any = ref()

    for (const btn of bottomNav.value.buttons) {
      btn.visible = false
    }
    const form = ref({
      file: [],
      className: '',
      prompt: '',
      messages: [],
      showUpload: false,
      uploading: false,
      loading: false,
    })
    const memory = ref()

    const send = async () => {
      form.value.loading = true
      const { data } = await useFetch('/api/chat-doc', {
        method: 'post',
        body: {
          prompt: form.value.prompt,
          reset: Array.isArray(memory.value) ? false : true,
        },
      })

      memory.value = data.value?.memory || []
      form.value.loading = false
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
      }, 0)
    }

    const upload = async () => {
      const className = form.value.className?.replace(/[ ]/gi, '')
      if (
        schemas.value?.length &&
        !schemas.value?.filter((i: any) => i.title === className).length
      ) {
        schemas.value.unshift({ title: className, uploaded: false })
      } else if (schemas.value?.find((i: any) => i.title === className)) {
        schemas.value.find((i: any) => i.title === className).uploaded = false
      }

      form.value.uploading = true
      form.value.showUpload = false
      const formData = new FormData()
      formData.append('file', form.value.file[0])
      formData.append('className', className)
      await useFetch('/api/upload', {
        method: 'post',
        body: formData,
      }).catch((e) => {
        console.log(e)
      })
      schemas.value.find((i: any) => i.title === className).uploaded = true
      form.value.uploading = false
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

    onMounted(async () => {
      const { data }: { data: any } = await useFetch('/api/classes', {
        method: 'get',
      })
      schemas.value =
        data.value?.classes?.map((i: any) => ({
          title: i.class,
          uploaded: true,
        })) || []
    })

    return { form, send, keydownHandler, upload, memory, schemas }
  },
})
</script>
