<script setup lang="ts">
defineProps<{ status: string }>()
</script>
<template>
  <span
    class="status-badge"
    :class="{
      'status-research': status === 'Future research',
      'status-prototype': status === 'Prototype',
    }"
    ><span></span>{{ status }}</span
  >
</template>
