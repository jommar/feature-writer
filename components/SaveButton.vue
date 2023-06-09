<template>
  <div>
    <v-btn
      class="position-absolute"
      style="right: 10px; bottom: 10px;"
      :icon="icon.name"
      variant="outlined"
      :color="icon.disabled ? 'success' : 'info'"
      @click="save"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    type: { type: String },
    content: { type: String },
  },
  setup(props) {
    const icon = ref({
      disabled: false,
      name: 'mdi-content-save',
    })
    const save = () => {
      if (icon.value.disabled) {
        return
      }
      const LOCALSTORAGE_NAME = 'story-writer'
      const content = {
        type: props.type,
        text: props.content,
      }
      icon.value.name = 'mdi-check-circle'
      icon.value.disabled = true
      if (!localStorage.getItem(LOCALSTORAGE_NAME)) {
        localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify([]))
      }
      const items = JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME) || '[]')
      items.unshift(content)
      localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(items))
      setTimeout(() => {
        icon.value.name = 'mdi-content-save'
        icon.value.disabled = false
      }, 2000)
    }

    return { save, icon }
  },
})
</script>
