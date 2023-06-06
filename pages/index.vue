<template>
  <div>
    <v-container class="d-flex justify-center align-center">
      <TypeSelector v-model="form" />
    </v-container>
    <v-container class="text-center" v-if="form.type">
      <FormLinear
        v-model="form"
        ref="formComponent"
        @submitForm="
          (payload) => {
            submitForm({ showCurrent: false, request: payload })
          }
        "
        :showDialog="!response.show && response.data.length"
        @showDialog="response.show = true"
        :loading="form.loading"
      />
    </v-container>
    <v-dialog v-model="response.show" v-if="response.show">
      <Preview
        :data="response.data"
        @hide="response.show = false"
        @generate="generateAgain"
        :loading="form.loading"
      />
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const route = useRoute()
    const response = ref({
      show: false,
      data: [],
    })
    const formComponent = ref()
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
      epicTitle: '',
      overview: '',
      value: '',
      userStories: '',
      loading: false,
      type: null,
      riskAssessment: true,
    })

    watch(
      () => form.value.type,
      (val) => {
        if (formComponent.value) {
          formComponent.value.tab = 0
        }
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
        form.value.epicTitle = ''
        form.value.overview = ''
        form.value.value = ''
        form.value.userStories = ''
      },
    )

    const submitForm = async ({ showCurrent = false, request }) => {
      form.value.loading = true
      if (!showCurrent) {
        response.value.show = false
        response.value.data = []
      }
      const { data } = await useFetch('/api/chat', {
        method: 'post',
        body: request,
      })
      form.value.loading = false

      response.value.data.unshift(data.value)
      response.value.show = true
    }

    const generateAgain = () => {
      const request = formComponent.value.composeFormData()
      submitForm({ showCurrent: true, request })
    }

    return { route, form, submitForm, response, generateAgain, formComponent }
  },
})
</script>
