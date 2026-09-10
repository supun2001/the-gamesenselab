<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { session } from '../lib/auth'
import BrandMark from './BrandMark.vue'
const open = ref(false)
const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
const nav = [
  ['Home', ''],
  ['AI Coach', '#ai-coach'],
  ['Read The Player', '#book'],
  ['Development', '#development'],
  ['Community', '#community'],
]
</script>
<template>
  <header class="site-header" @keydown.esc="open = false">
    <div class="nav-shell">
      <RouterLink to="/" aria-label="GameSense Lab home"><BrandMark /></RouterLink
      ><button
        class="menu-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="main-navigation"
        :aria-label="open ? 'Close navigation' : 'Open navigation'"
        @click="open = !open"
      >
        {{ open ? '✕' : '☰' }}
      </button>
      <nav id="main-navigation" :class="{ open }" aria-label="Main navigation">
        <RouterLink
          v-for="[label, hash] in nav"
          :key="label"
          :to="{ path: '/', hash }"
          @click="open = false"
          >{{ label }}</RouterLink
        ><RouterLink class="nav-signin" :to="session ? '/dashboard' : '/login'"
          >{{ session ? 'Dashboard' : 'Sign In' }} <span aria-hidden="true">↗</span></RouterLink
        >
      </nav>
    </div>
  </header>
</template>
