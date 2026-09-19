import { ref } from 'vue'

export const bookWaitlistOpen = ref(false)
export function openBookWaitlist() {
  bookWaitlistOpen.value = true
}
