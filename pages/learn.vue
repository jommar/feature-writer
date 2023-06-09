<template>
  <div>
    <v-container class="text-center">
      <Form
        v-model="form"
        :systemMessage="{
          message:
            'You are a top notch tutor, you will help me teach my child with the information provided.',
        }"
        :context="[
          { message: 'Make it like an instruction coming from a book.' },
          {
            message:
              'Do not give me instructions on what to do, Give me the instructions on what the child is going to do.',
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
        title: 'Age',
        description:
          'How old is the child? This helps us give the right kind of lessons for their age.',
        value: null,
      },
      {
        title: 'Grade Level',
        description:
          "What school grade is the child in? This helps us match what they're learning in school.",
        value: null,
      },
      {
        title: 'Topics of Interest',
        description:
          'What does the child like? For example, math, science, or maybe animals or space. This helps us make learning fun and interesting for them.',
        value: null,
      },
      {
        title: 'Specific Areas for Improvement',
        description:
          'Is there anything the child finds hard or needs extra practice with? This helps us focus on those areas.',
        value: null,
      },
      {
        title: 'Duration',
        description:
          "How long does the child usually like to learn at one time? This helps us make lessons that aren't too short or too long.",
        value: null,
      },
      {
        title: 'Additional Information or Requests',
        description:
          'Anything else you want to tell us or ask for? This helps us understand what you and the child need or want.',
        value: null,
      },
    ])

    return { form }
  },
})
</script>
