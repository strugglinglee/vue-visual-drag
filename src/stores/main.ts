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
  const componentData = ref<Record<string, any>[]>([]); // 画布组件数据

  // 目前正在操作的组件信息
  const curComponent = ref<Record<string, any> | null>(null);
  const curComponentIndex = ref<number | null>(null);

  const isInCurComponentArea = ref<boolean>(false);

  const addComponent = ({ component, index }) => {
    if (index !== undefined) {
      componentData.value.splice(index, 0, component);
    } else {
      componentData.value.push(component);
    }
  };
  return {
    canvasStyleData,
    componentData,
    curComponent,
    addComponent,
    curComponentIndex,
    isInCurComponentArea,
  };
});