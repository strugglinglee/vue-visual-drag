import { ref, reactive } from "vue";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const canvasStyleData = reactive({
    // 页面全局数据
    width: 1200,
    height: 740,
    scale: 100,
    color: "#000",
    opacity: 1,
    background: "#fff",
    fontSize: 14,
  });
  const componentData = ref([]); // 画布组件数据

  const curComponent = ref(null);
  // function increment() {
  //   count.value++;
  // }

  const addComponent = ({ component, index }) => {
    if (index !== undefined) {
      componentData.value.splice(index, 0, component);
    } else {
      componentData.value.push(component);
    }
  };
  return { canvasStyleData, componentData, curComponent, addComponent };
});
