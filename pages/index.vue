<template>
  <div>
    <v-container class="text-center">
      <v-form @submit.prevent="sumbitForm">
        <v-card class="bg-grey-darken-4">
          <v-tabs v-model="tab" align-tabs="center" class="mb-8">
            <v-tab v-for="(step, index) in steps" :key="index">
              {{ step.title }}
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item
              :value="index"
              v-for="(step, index) in steps"
              :key="index"
            >
              <v-container>
                <div class="mb-4">
                  <p class="text-h6 text-blue-lighten-3">{{ step.description }}</p>
                </div>
                <v-textarea v-model="form[step.formName]"></v-textarea>
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
                :disabled="tab === steps.length - 1"
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
          <div style="white-space: pre-wrap;">{{ response?.data?.res }}</div>
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
      loading: false,
    })
    const steps = ref([
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
    ])

    const showSubmit = computed(() => {
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
      if (steps.value.length - 1 !== tab.value) {
        return false
      }
      return true
    })

    const sumbitForm = async () => {
      response.value.show = false
      form.value.loading = true
      response.value.data = {}
      const { data } = await useFetch('/api/chat', {
        method: 'post',
        body: form.value,
      })
      form.value.loading = false

      response.value.data = data
      response.value.show = true
    }

    return { route, tab, steps, form, showSubmit, sumbitForm, response }
  },
})
</script>
