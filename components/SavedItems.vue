<template>
  <div>
    <v-dialog v-model="dialog.show" scrollable max-width="70vw">
      <v-card theme="dark">
        <v-card-title class="text-blue-darken-3">
          {{ dialog?.content?.[window]?.type?.toUpperCase() }}
        </v-card-title>
        <v-card-text>
          <v-window v-model="window" show-arrows>
            <v-window-item v-for="(item, index) in dialog.content" :key="index">
              <v-container class="px-16">
                <div
                  class="text-light-blue-lighten-4"
                  style="white-space: pre-wrap;"
                >
                  {{ item.text }}
                </div>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1 d-flex justify-center">
            <v-btn color="error" prepend-icon="mdi-delete" @click="removeItem">
              Delete
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn block color="light-blue-darken-4" @click="viewSaved">
      Saved Items
    </v-btn>
  </div>
</template>
<script lang="ts">
import { json } from 'stream/consumers'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    interface Dialog {
      show: boolean
      content: { type: string; text: string }[]
    }

    const dialog = ref<Dialog>({
      show: false,
      content: [],
    })
    const window = ref(0)
    const viewSaved = () => {
      const items = JSON.parse(localStorage.getItem('story-writer') || '[]')
      if (!items.length) {
        return
      }
      dialog.value.show = true
      dialog.value.content = items
    }

    const removeItem = () => {
      dialog.value.content.splice(window.value, 1)
      const jsonString = JSON.stringify(dialog.value.content)
      localStorage.setItem('story-writer', jsonString)
      if (!dialog.value.content.length) {
        dialog.value.show = false
      }
    }

    return { viewSaved, dialog, window, removeItem }
  },
})
</script>
