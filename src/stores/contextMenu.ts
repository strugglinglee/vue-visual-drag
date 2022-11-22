import { ref } from "vue";
import { defineStore } from "pinia";
export const useContextMenuStore = defineStore("contextMenu", () => {
  const menuTop = ref<number>(0);
  const menuLeft = ref<number>(0);
  const menuShow = ref<boolean>(false);
  const showContextMenu: (info: any) => void = ({ top, left }) => {
    menuShow.value = true;
    menuTop.value = top;
    menuLeft.value = left;
  };
  const hideContextMenu = () => {
    menuShow.value = false;
  };
  return { menuTop, menuLeft, menuShow, showContextMenu, hideContextMenu };
});
