<template>
  <v-form @submit.prevent="submit">
    <v-card class="bg-grey-darken-4">
      <v-card-text>
        <div>
          <v-switch
            color="success"
            v-model="modelValue.riskAssessment"
            label="Include Risk Assesment"
            hide-details="auto"
          />
        </div>
        <div v-for="(step, index) in steps[modelValue.type]" :key="index">
          <div>
            <span class="text-light-blue text-uppercase">{{ step.title }}</span>
          </div>
          <div class="text-h6 text-blue-lighten-3">{{ step.description }}</div>
          <div>
            <v-textarea
              placeholder="Please provide your answers to these questions and any additional details you think are important. Based on your responses, we will create a user story that captures your needs."
              v-model="modelValue[step?.formName]"
            />
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <div class="d-flex justify-center" style="width: 100%;">
          <v-btn
            color="success"
            type="submit"
            :loading="modelValue.loading"
          >
            Submit
          </v-btn>
        </div>
      </v-card-actions>
      <div v-if="showDialog && !loading">
        <v-btn variant="text" @click="$emit('showDialog')">
          Show Result
        </v-btn>
      </div>
    </v-card>
  </v-form>
</template>
<script>
export default {
  props: {
    modelValue: { type: Object },
    showDialog: { type: Boolean, default: () => false },
    loading: { type: Boolean, default: () => true },
  },
  setup(props, context) {
    const tab = ref(0)
    const steps = ref({
      feature: [
        {
          title: 'User Role',
          description:
            'Who is the primary user or persona that will be using the functionality of the product?',
          formName: 'userRole',
        },
        {
          title: 'Goal/Desired Outcome',
          description:
            "What is the goal that this user is trying to achieve or the problem you're trying to solve?",
          formName: 'goal',
        },
        {
          title: 'Context',
          description:
            'In what scenario or under what conditions will the user typically perform this action?',
          formName: 'context',
        },
        {
          title: 'Functional Requirement',
          description:
            'What specific functionality does the user need to be able to achieve their goal?',
          formName: 'functional',
        },
        {
          title: 'Acceptance Criteria',
          description:
            'How will we know when the user story has been fulfilled? What will be different for the user or the system once the user story is completed?',
          formName: 'acceptance',
        },
        {
          title: 'Non-Functional Requirement',
          description:
            'Are there any specific performance, security, or other non-functional requirements that the user story should satisfy?',
          formName: 'nonFunctional',
        },
      ],
      bug: [
        {
          title: 'User Role',
          description:
            'Who is the primary user or persona that encountered the bug? This could be any type of user, such as a customer, developer, tester, etc.',
          formName: 'userRole',
        },
        {
          title: 'Problem Description',
          description:
            'What exactly is the problem or bug that was encountered?',
          formName: 'problem',
        },
        {
          title: 'Expected Behavior',
          description:
            "What was the expected behavior or outcome that didn't happen due to the bug?",
          formName: 'expected',
        },
        {
          title: 'Actual Behavior',
          description:
            'What was the actual behavior that occurred when the bug was encountered?',
          formName: 'actual',
        },
        {
          title: 'Steps to Reproduce',
          description:
            'Can you provide a detailed, step-by-step description of how to reproduce the bug?',
          formName: 'steps',
        },
        {
          title: 'Acceptance Criteria',
          description:
            'What should be the expected outcome once the bug is fixed?',
          formName: 'acceptance',
        },
        {
          title: 'Severity and Impact',
          description:
            'How severe is this bug and what is its impact on the system or the user experience?',
          formName: 'severity',
        },
      ],
      epic: [
        {
          title: 'Epic Title',
          description:
            'What would be a brief, descriptive name for the epic that captures its overall theme?',
          formName: 'epicTitle',
        },
        {
          title: 'User Role(s)',
          description:
            'Who are the primary user or users involved in this epic?',
          formName: 'userRole',
        },
        {
          title: 'Overview',
          description:
            "Can you give an overview of the epic? What is the big picture or the high-level functionality that you're aiming for?",
          formName: 'overview',
        },
        {
          title: 'Business Value',
          description:
            'What is the expected business value or benefit that will be gained from implementing this epic?',
          formName: 'value',
        },
        {
          title: 'Non-Functional Requirements',
          description:
            'Are there any overarching non-functional requirements that apply to the epic as a whole, such as performance, security, or usability considerations?',
          formName: 'nonFunctional',
        },
        {
          title: 'Acceptance Criteria',
          description:
            'What are the broad acceptance criteria for this epic? How will we know when the entire epic has been completed successfully?',
          formName: 'acceptance',
        },
        {
          title: 'Potential User Stories',
          description:
            "Can you identify any potential user stories that might form part of this epic? These can be high-level ideas that we'll break down into more detailed user stories later.",
          formName: 'userStories',
        },
      ],
    })

    const composeFormData = () => {
      const request = {
        type: props.modelValue.type,
        riskAssessment: props.modelValue.riskAssessment,
        form: steps.value[props.modelValue.type].map((i) => ({
          title: i.title,
          value: props.modelValue[i.formName],
        })),
      }

      return request
    }

    const submit = () => {
      const request = composeFormData()
      context.emit('submitForm', request)
    }

    return { steps, tab, submit, composeFormData }
  },
}
</script>
