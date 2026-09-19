<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { bookWaitlistOpen } from '../lib/book-waitlist'
import WaitlistForm from './WaitlistForm.vue'

const dialog = ref(null)
const route = useRoute()
let previousOverflow = ''
function close() {
  dialog.value?.close()
}
function closeOnBackdrop(event) {
  if (event.target !== dialog.value) return
  const rect = dialog.value.getBoundingClientRect()
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    close()
}
onMounted(() => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
})
onUnmounted(() => {
  document.body.style.overflow = previousOverflow
})
watch(() => route.fullPath, close)
</script>
<template>
  <dialog
    ref="dialog"
    class="book-dialog"
    aria-labelledby="book-dialog-title"
    @close="bookWaitlistOpen = false"
    @click="closeOnBackdrop"
  >
    <div class="book-dialog-heading">
      <div>
        <p class="eyebrow">READ THE PLAYER</p>
        <h2 id="book-dialog-title">
          Join the waiting list.<br /><span class="gold">Get the book.</span>
        </h2>
      </div>
      <button
        type="button"
        class="dialog-close"
        aria-label="Close book waitlist"
        autofocus
        @click="close"
      >
        ✕
      </button>
    </div>
    <WaitlistForm modal />
  </dialog>
</template>
<style scoped>
.book-dialog {
  width: min(620px, calc(100% - 32px));
  max-height: calc(100dvh - 32px);
  padding: 28px;
  color: #f0f0eb;
  background: #0b0e0a;
  border: 1px solid #d6ad6066;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.book-dialog::backdrop {
  background: #000b;
  backdrop-filter: blur(5px);
}
.book-dialog-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}
.book-dialog-heading .eyebrow {
  margin-bottom: 12px;
}
.book-dialog-heading h2 {
  font-size: clamp(32px, 6vw, 44px);
  margin: 0;
}
.dialog-close {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  background: transparent;
  font-size: 20px;
}
@media (max-width: 560px) {
  .book-dialog {
    padding: 20px;
  }
}
</style>
