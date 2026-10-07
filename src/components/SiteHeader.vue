<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { navigation } from '../config/site'
import Brand from './Brand.vue'
import Button from './Button.vue'
const open = ref(false),
  toggle = ref<HTMLButtonElement | null>(null)
const route = useRoute()
const homeNavigation = [
  { label: 'Product', to: '/freya' },
  { label: 'Freya', to: '/freya#review' },
  { label: 'Features', to: '/#features' },
  { label: 'About', to: '/about' },
]
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
function escape() {
  if (open.value) {
    open.value = false
    toggle.value?.focus()
  }
}
</script>
<template>
  <header :class="['site-header', { 'home-header': route.path === '/' }]" @keydown.esc="escape">
    <div class="shell header-inner">
      <RouterLink class="brand-link" to="/" aria-label="Altheia home"><Brand /></RouterLink>
      <nav
        id="site-navigation"
        aria-label="Main navigation"
        :class="['main-nav', { 'is-open': open }]"
      >
        <RouterLink
          v-for="item in route.path === '/' ? homeNavigation : navigation"
          :key="item.to"
          :to="item.to"
          >{{ item.label }}</RouterLink
        >
      </nav>
      <Button class="header-cta" to="/#waitlist"
        >Join the waitlist <span aria-hidden="true">↗</span></Button
      >
      <button
        ref="toggle"
        class="menu-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="site-navigation"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        @click="open = !open"
      >
        <span aria-hidden="true">{{ open ? '✕' : '☰' }}</span>
      </button>
    </div>
  </header>
</template>
