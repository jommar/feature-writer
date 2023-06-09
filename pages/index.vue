<template>
  <div>
    <v-container class="text-center">
      <div class="d-flex justify-center align-center full-width">
        <div>I Want to create</div>
        <div class="ml-4 flex-grow-1">
          <v-select :items="types" v-model="type" hide-details="auto" />
        </div>
      </div>
      <Form
        class="mt-8"
        v-if="type"
        v-model="messages[type]"
        placeholder="Please provide your answers to these questions and any additional details you think are important. Based on your responses, we will create a user story that captures your needs."
        :systemMessage="{
          message:
            'You are a world class business analyst and you will help create tickets on my application. The type of ticket is: BUG',
        }"
        :context="[
          {
            message: 'Risk Assessment: ',
          },
          {
            message:
              'With these information, what should the ticket look like? Be as descriptive as possible, do not leave out any details. Provide the neccessary details that are not covered. Feel free to modify the content to use the best practices.',
          },
        ]"
        type="ticket"
      />
    </v-container>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const types = ref([
      { title: 'a Bug', value: 'bug' },
      { title: 'a Feature', value: 'feature' },
      { title: 'an Epic', value: 'epic' },
    ])
    const type = ref(null)
    const messages = ref({
      feature: [
        {
          title: 'User Role',
          description:
            'Who is the primary user or persona that will be using the functionality of the product?',
          value: null,
        },
        {
          title: 'Goal/Desired Outcome',
          description:
            "What is the goal that this user is trying to achieve or the problem you're trying to solve?",
          value: null,
        },
        {
          title: 'Context',
          description:
            'In what scenario or under what conditions will the user typically perform this action?',
          value: null,
        },
        {
          title: 'Functional Requirement',
          description:
            'What specific functionality does the user need to be able to achieve their goal?',
          value: null,
        },
        {
          title: 'Acceptance Criteria',
          description:
            'How will we know when the user story has been fulfilled? What will be different for the user or the system once the user story is completed?',
          value: null,
        },
        {
          title: 'Non-Functional Requirement',
          description:
            'Are there any specific performance, security, or other non-functional requirements that the user story should satisfy?',
          value: null,
        },
      ],
      bug: [
        {
          title: 'User Role',
          description:
            'Who is the primary user or persona that encountered the bug? This could be any type of user, such as a customer, developer, tester, etc.',
          value: null,
        },
        {
          title: 'Problem Description',
          description:
            'What exactly is the problem or bug that was encountered?',
          value: null,
        },
        {
          title: 'Expected Behavior',
          description:
            "What was the expected behavior or outcome that didn't happen due to the bug?",
          value: null,
        },
        {
          title: 'Actual Behavior',
          description:
            'What was the actual behavior that occurred when the bug was encountered?',
          value: null,
        },
        {
          title: 'Steps to Reproduce',
          description:
            'Can you provide a detailed, step-by-step description of how to reproduce the bug?',
          value: null,
        },
        {
          title: 'Acceptance Criteria',
          description:
            'What should be the expected outcome once the bug is fixed?',
          value: null,
        },
        {
          title: 'Severity and Impact',
          description:
            'How severe is this bug and what is its impact on the system or the user experience?',
          value: null,
        },
      ],
      epic: [
        {
          title: 'Epic Title',
          description:
            'What would be a brief, descriptive name for the epic that captures its overall theme?',
          value: null,
        },
        {
          title: 'User Role(s)',
          description:
            'Who are the primary user or users involved in this epic?',
          value: null,
        },
        {
          title: 'Overview',
          description:
            "Can you give an overview of the epic? What is the big picture or the high-level functionality that you're aiming for?",
          value: null,
        },
        {
          title: 'Business Value',
          description:
            'What is the expected business value or benefit that will be gained from implementing this epic?',
          value: null,
        },
        {
          title: 'Non-Functional Requirements',
          description:
            'Are there any overarching non-functional requirements that apply to the epic as a whole, such as performance, security, or usability considerations?',
          value: null,
        },
        {
          title: 'Acceptance Criteria',
          description:
            'What are the broad acceptance criteria for this epic? How will we know when the entire epic has been completed successfully?',
          value: null,
        },
        {
          title: 'Potential User Stories',
          description:
            "Can you identify any potential user stories that might form part of this epic? These can be high-level ideas that we'll break down into more detailed user stories later.",
          value: null,
        },
      ],
    })

    return { messages, types, type }
  },
})
</script>
