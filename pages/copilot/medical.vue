<template>
  <div>
    <v-container class="text-center">
      <Form
        v-model="form"
        :systemMessage="{
          message:
            'You are a medical practitioner, analyze the information given. Your answer should include the following: Symptoms and Analysis, Possible Conditions, Other Factors to Consider, Recommendations heres a sample template\nSymptoms and Analysis\n...\nPossible Conditions\n...\nOther Factors to Consider\n...\nRecommendations\n...',
        }"
        :context="[
          {
            message:
              'Make it as descriptive as possible. Feel free to include details that are not provided.',
          },
        ]"
        type="copilot-med"
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
        title: 'Personal Information',
        description: 'Name',
        value: null,
        useDescription: true,
      },
      {
        title: 'Personal Information',
        description: 'Age',
        value: null,
        useDescription: true,
      },
      {
        title: 'Personal Information',
        description: 'Gender',
        value: null,
        useDescription: true,
      },
      {
        title: 'Medical History: Pre-existing Medical Conditions',
        description:
          'Do you have any pre-existing medical conditions? (if yes, provide details)',
        value: null,
        useDescription: true,
      },
      {
        title: 'Medical History: Current Medications',
        description:
          'Are you currently on any medication? (if yes, provide details)',
        value: null,
        useDescription: true,
      },
      {
        title: 'Medical History: Allergies',
        description:
          'Do you have any known allergies? (if yes, provide details)',
        value: null,
        useDescription: true,
      },
      {
        title: 'Family Medical History: Health Conditions',
        description:
          'Does anyone in your family have a history of chronic or serious health conditions? (if yes, provide details)',
        value: null,
        useDescription: true,
      },
      {
        title: 'Symptoms',
        description: 'What symptoms are you currently experiencing?',
        value: null,
        useDescription: true,
      },
      {
        title: 'Symptoms: Start',
        description: 'When did you first notice these symptoms?',
        value: null,
        useDescription: true,
      },
      {
        title: 'Symptoms',
        description:
          'Have your symptoms been getting better, worse, or staying the same?',
        value: null,
        useDescription: true,
      },
      {
        title: 'Symptoms: Severity',
        description:
          'How severe would you rate your symptoms on a scale of 1-10?',
        value: null,
        useDescription: true,
      },
      {
        title: 'Lifestyle: Stress Level',
        description:
          'How would you rate your current stress level on a scale of 1-10?',
        value: null,
        useDescription: true,
      },
      {
        title: 'Lifestyle: Sleep',
        description: 'How many hours of sleep do you typically get each night?',
        value: null,
        useDescription: true,
      },
      {
        title: 'Lifestyle: Exercise',
        description: 'How many days per week do you exercise, on average?',
        value: null,
        useDescription: true,
      },
      {
        title: 'Lifestyle: Smoking',
        description:
          'Do you smoke or use tobacco products? (if yes, provide details)',
        value: null,
        useDescription: true,
      },
      {
        title: 'Lifestyle: Alcohol Consumption',
        description: 'Do you drink alcohol? (if yes, provide details)',
        value: null,
        useDescription: true,
      },
      {
        title: 'Additional Information',
        value: null,
      },
    ])

    return { form }
  },
})
</script>
