<template>
  <div class="d-flex align-center justify-center">
    <div>I am writing</div>
    <div>
      <v-select
        :items="[
          { title: 'a Feature', value: 'feature' },
          { title: 'a Bug', value: 'bug' },
          { title: 'an Epic', value: 'epic' },
        ]"
        v-model="modelValue.type"
        density="compact"
        hide-details="auto"
        class="ml-4"
        clearable
      />
    </div>
  </div>
</template>
<script>
export default {
  props: { modelValue: { type: Object } },
}
</script>
