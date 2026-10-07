<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
<template>
  <div class="billing-switch" role="group" aria-label="Billing period">
    <button type="button" :aria-pressed="!modelValue" @click="emit('update:modelValue', false)">
      Monthly</button
    ><button type="button" :aria-pressed="modelValue" @click="emit('update:modelValue', true)">
      Yearly <span>Save 30%</span>
    </button>
  </div>
</template>
