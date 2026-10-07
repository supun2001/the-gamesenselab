<script setup lang="ts">
import Icon from './Icon.vue'
withDefaults(
  defineProps<{
    to?: string
    variant?: 'primary' | 'secondary' | 'text'
    arrow?: boolean
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', arrow: false, type: 'button' },
)
</script>
<template>
  <RouterLink v-if="to" :to="to" :class="['btn', `btn-${variant}`]"
    ><slot /><Icon v-if="arrow" name="arrow"
  /></RouterLink>
  <button v-else :type="type" :disabled="disabled" :class="['btn', `btn-${variant}`]">
    <slot /><Icon v-if="arrow" name="arrow" />
  </button>
</template>
