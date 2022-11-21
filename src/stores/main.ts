import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import type { ComponentInfo } from "@/types/index";

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
  const componentData = ref<ComponentInfo[]>([]); // 画布组件数据

  // 目前正在操作的组件信息
  const curComponent = ref<Record<string, any> | null>(null);
  const curComponentIndex = ref<number | null>(null);

  const isInCurComponentArea = ref<boolean>(false);
  const isInEditor = ref<boolean>(false);

  const addComponent = ({ component, index }: any) => {
    if (index !== undefined) {
      componentData.value.splice(index, 0, component);
    } else {
      componentData.value.push(component);
    }
  };

  const setShapeStyle = ({ top, left, width, height, rotate }: any) => {
    if (top) (curComponent.value as any).style.top = Math.round(top);
    if (left) (curComponent.value as any).style.left = Math.round(left);
    if (width) (curComponent.value as any).style.width = Math.round(width);
    if (height) (curComponent.value as any).style.height = Math.round(height);
    if (rotate) (curComponent.value as any).style.rotate = Math.round(rotate);
  };

  const testPoints = ref<any[]>([]);

  const editMode = ref<string>("edit"); // 编辑器模式 edit preview

  return {
    editMode,
    canvasStyleData,
    componentData,
    curComponent,
    addComponent,
    curComponentIndex,
    isInCurComponentArea,
    isInEditor,
    setShapeStyle,
    testPoints,
  };
});
