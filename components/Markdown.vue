<template>
  <MarkdownItem :source="source" class="text-light-blue-lighten-5" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import MarkdownItem from 'vue3-markdown-it'

export default defineComponent({
  components: {
    MarkdownItem,
  },
  props: {
    source: { type: String, required: true },
  },
})
</script>
<style scoped>
::v-deep(pre) {
  background-color: black !important;
  padding: 0.7rem !important;
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
}
::v-deep(code) {
  background-color: black !important;
  color: white !important;
  padding: 0.2rem !important;
}
::v-deep(p) {
  margin-top: 0.65rem !important;
  margin-bottom: 0.65rem !important;
}
::v-deep(table) {
  width: 100%;
  margin: auto;
}
::v-deep(table thead) {
  background-color: #37474f !important;
}
::v-deep(table td),
::v-deep(table th) {
  padding: 0.15rem !important;
}
::v-deep(table tbody tr:nth-child(even)) {
  background-color: #424242 !important;
}
::v-deep(ol),
::v-deep(ul) {
  margin-left: 2.5rem !important;
}
</style>