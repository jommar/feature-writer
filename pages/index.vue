<template>
  <div>
    <v-container class="d-flex justify-center align-center">
      <div>I am writing a</div>
      <v-select
        :items="[
          { title: 'Feature', value: 'feature' },
          { title: 'Bug', value: 'bug' },
        ]"
        v-model="form.type"
        density="compact"
        hide-details="auto"
        class="ml-4"
        clearable
      />
    </v-container>
    <v-container class="text-center" v-if="form.type">
      <v-form @submit.prevent="sumbitForm">
        <v-card class="bg-grey-darken-4">
          <v-tabs v-model="tab" align-tabs="center" class="mb-8">
            <v-tab v-for="(step, index) in steps[form.type]" :key="index">
              {{ step?.title }}
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item
              :value="index"
              v-for="(step, index) in steps[form.type]"
              :key="index"
            >
              <v-container>
                <div class="mb-4">
                  <p class="text-h6 text-blue-lighten-3">
                    {{ step?.description }}
                  </p>
                </div>
                <v-textarea v-model="form[step?.formName]"></v-textarea>
                <p class="text-caption">
                  Please provide your answers to these questions and any
                  additional details you think are important. Based on your
                  responses, we will create a user story that captures your
                  needs.
                </p>
              </v-container>
            </v-window-item>
          </v-window>
          <v-card-actions>
            <div class="d-flex justify-center" style="width: 100%;">
              <v-btn
                color="info"
                @click="tab--"
                :disabled="tab === 0"
                :loading="form.loading"
              >
                Prev
              </v-btn>
              <v-btn
                color="info"
                @click="tab++"
                :disabled="tab === steps[form.type].length - 1"
                :loading="form.loading"
              >
                Next
              </v-btn>
              <v-btn
                color="success"
                v-if="showSubmit"
                type="submit"
                :loading="form.loading"
              >
                Submit
              </v-btn>
            </div>
          </v-card-actions>
          <div v-if="response.data.res">
            <v-btn variant="text" @click="response.show = true">
              Show Result
            </v-btn>
          </div>
        </v-card>
      </v-form>
    </v-container>
    <v-dialog v-model="response.show">
      <v-card class="bg-grey-darken-4">
        <v-container>
          <div style="white-space: pre-wrap;">{{ response?.data?.text }}</div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const route = useRoute()
    const tab = ref(0)
    const response = ref({
      show: false,
      data: {},
    })
    const form = ref({
      userRole: '',
      goal: '',
      context: '',
      functional: '',
      acceptance: '',
      nonFunctional: '',
      problem: '',
      expected: '',
      actual: '',
      steps: '',
      severity: '',
      loading: false,
      type: null,
    })
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
    })

    const showSubmit = computed(() => {
      if (form.value.type === 'feature') {
        if (!form.value.userRole?.trim()) {
          return false
        }
        if (!form.value.goal?.trim()) {
          return false
        }
        if (!form.value.context?.trim()) {
          return false
        }
        if (!form.value.functional?.trim()) {
          return false
        }
        if (!form.value.acceptance?.trim()) {
          return false
        }
        if (!form.value.nonFunctional?.trim()) {
          return false
        }
      } else if (form.value.type === 'bug') {
        if (!form.value.userRole.trim()) {
          return false
        }
        if (!form.value.problem.trim()) {
          return false
        }
        if (!form.value.expected.trim()) {
          return false
        }
        if (!form.value.actual.trim()) {
          return false
        }
        if (!form.value.steps.trim()) {
          return false
        }
        if (!form.value.acceptance.trim()) {
          return false
        }
        if (!form.value.severity.trim()) {
          return false
        }
      }
      if (steps.value[form.value.type].length - 1 !== tab.value) {
        return false
      }
      return true
    })

    watch(
      () => form.value.type,
      (val) => {
        form.value.userRole = ''
        form.value.goal = ''
        form.value.context = ''
        form.value.functional = ''
        form.value.acceptance = ''
        form.value.nonFunctional = ''
        form.value.problem = ''
        form.value.expected = ''
        form.value.actual = ''
        form.value.steps = ''
        form.value.severity = ''
        tab.value = 0
      },
    )

    const sumbitForm = async () => {
      response.value.show = false
      form.value.loading = true
      response.value.data = {}
      const request = {
        type: form.value.type,
        form: steps.value[form.value.type].map((i) => ({
          title: i.title,
          value: form.value[i.formName],
        })),
      }
      const { data } = await useFetch('/api/chat', {
        method: 'post',
        body: request,
      })
      form.value.loading = false

      response.value.data = data
      response.value.show = true
    }

    return { route, tab, steps, form, showSubmit, sumbitForm, response }
  },
})
</script>
