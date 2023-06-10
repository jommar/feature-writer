// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Story Writer: AI',
    },
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    openai: {
      API_KEY: process.env.OPEN_AI_API_KEY,
    },
  },
  appConfig: {
    localStorageName: 'story-writer',
  },
})
