import { ref } from "vue";
import { defineStore } from "pinia";

export const useComposeStore = defineStore("compose", () => {
  const editor = ref<HTMLBaseElement | null>(null);
  const count = ref<number>(1);
  return { editor, count };
});
