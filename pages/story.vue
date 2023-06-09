<template>
  <div>
    <v-container class="text-center">
      <Form
        v-model="form"
        :systemMessage="{
          message:
            'You are a story writer, write a story with the provided information.',
        }"
        :context="[
          {
            message:
              'Make it as descriptive as possible. Feel free to include details that are not provided. Use language that is appropriate to the age.',
          },
        ]"
      />
    </v-container>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const form = ref([
      {
        title: "Child's Name",
        description: "Child's name for a personalized story experience.",
        value: null,
      },
      {
        title: "Child's Age",
        description: "Helps adjust story's language and complexity.",
        value: null,
      },
      {
        title: "Child's Gender",
        description: "Influences the gender of the story's main character.",
        value: null,
      },
      {
        title: 'Preferred Theme',
        description:
          'Preferred story type (e.g., adventure, fantasy, mystery).',
        value: null,
      },
      {
        title: 'Story Length',
        description: 'Choose between short, medium, or long story.',
        value: null,
      },
      {
        title: 'Preferred Learning Message',
        description: 'Desired moral or lesson (e.g., kindness, bravery).',
        value: null,
      },
      {
        title: 'Personal Preferences',
        description:
          'Favorite things (e.g., color, food) to weave into the story.',
        value: null,
      },
      {
        title: 'Settings/Environment:',
        description: 'Desired story backdrop (e.g., jungle, space).',
        value: null,
      },
    ])

    return { form }
  },
})
</script>
