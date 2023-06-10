<template>
  <ClientOnly>
    <v-app>
      <v-app-bar theme="dark">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>
          AI Writer
        </v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" theme="dark">
        <v-list nav>
          <v-list-item :to="nav.to" v-for="nav in navs" :key="nav.title">
            <v-list-item-title>{{ nav.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <div class="position-absolute" style="bottom: 0; left: 0; right: 0;">
          <SavedItems />
        </div>
      </v-navigation-drawer>
      <v-main class="bg-blue-grey-darken-4">
        <v-sheet
          class="fill-height d-flex justify-center align-center bg-transparent"
        >
          <NuxtPage class="flex-grow-1" />
        </v-sheet>
      </v-main>
      <v-bottom-navigation
        theme="dark"
        class="bg-grey-darken-4"
        v-if="bottomNav.buttons.filter((i) => i.visible).length"
      >
        <template v-for="(nav, index) in bottomNav.buttons">
          <v-btn v-if="nav.visible" @click="nav.click" :key="index">
            <v-icon>{{ nav.icon }}</v-icon>
            {{ nav.title }}
          </v-btn>
        </template>
      </v-bottom-navigation>
    </v-app>
  </ClientOnly>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const bottomNav: any = useState('bottomNav', () => ({
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

    const drawer = ref(false)
    const navs = ref([
      { title: 'Home', to: '/' },
      { title: 'Learn', to: '/learn' },
      { title: 'Story', to: '/story' },
      { title: 'Content', to: '/content' },
    ])

    return { drawer, navs, bottomNav }
  },
})
</script>
