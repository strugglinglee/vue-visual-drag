import { ref } from "vue";
import { defineStore } from "pinia";

export const useComposeStore = defineStore("compose", () => {
  const editor = ref([]);
  return { editor };
});
