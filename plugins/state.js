export default defineNuxtPlugin(() => {
  useState('bottomNav', () => ({
    buttons: [
      {
        title: 'Generate',
        visible: false,
        icon: 'mdi-content-save',
      },
      {
        title: 'Show',
        visible: false,
        icon: 'mdi-eye',
      },
    ],
  }))
})
