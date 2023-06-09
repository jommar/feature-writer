<template>
  <div>
    <v-container class="text-center">
      <Form
        v-model="form"
        :systemMessage="{
          message:
            'You are a social media publisher, help me write a social media post with the provided information.',
        }"
        :context="[
          {
            message:
              'Make it as descriptive as possible. Feel free to include details that are not provided.',
          },
        ]"
        type="content"
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
        title: 'Target Audience',
        description:
          'Who is the intended audience for this post? This helps set the tone, language, and style.',
        value: null,
      },
      {
        title: 'Platform',
        description:
          'Where will this content be posted? Content should be optimized to the conventions of the specific social media platform.',
        value: null,
      },
      {
        title: 'Content Objective',
        description:
          'What is the purpose of this post? (e.g., inform, entertain, inspire, promote something) This question is crucial for the AI to understand the intent of the message.',
        value: null,
      },
      {
        title: 'Main Content/Theme',
        description:
          'What is the primary message or theme of the post? This gives the AI the core content to work with.',
        value: null,
      },
      {
        title: 'Tone of Voice',
        description:
          'Should this post be formal, casual, humorous, etc.? This helps the AI understand how to formulate the content.',
        value: null,
      },
      {
        title: 'Call to Action',
        description:
          'What action should readers take after viewing this post? This is key for promotional or persuasive posts.',
        value: null,
      },
      {
        title: 'Visual Elements',
        description:
          'Are there any specific visual elements to be included, or is there a particular mood to evoke? This information can be useful for suggesting relevant images or videos.',
        value: null,
      },
    ])

    return { form }
  },
})
</script>
