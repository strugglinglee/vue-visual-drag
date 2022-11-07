<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { useComposeStore } from "@/stores/compose";
import { $ } from "@/utils/utils";
import Grid from "./Grid.vue";
import VText from "@/custom-component/VText/Component.vue";
import Shape from "./Shape.vue";
import { getShapeStyle, getStyle, getCanvasStyle } from "@/utils/style";
import { onMounted, reactive, type CSSProperties } from "vue";
import { changeStyleWithScale } from "@/utils/translate";

const COMPONENTS = {
  VText,
};

defineProps({
  isEdit: Boolean,
});
const mainStore = useMainStore();
const composeStore = useComposeStore();
const state = reactive({
  editorX: 0,
  editorY: 0,
  start: {
    // 选中区域的起点
    x: 0,
    y: 0,
  },
  width: 0,
  height: 0,
  isShowArea: false,
  svgFilterAttrs: ["width", "height", "top", "left", "rotate"],
});

onMounted(() => {
  composeStore.$patch({
    editor: $("#editor"),
  });
});

const getComponentStyle = (style: CSSProperties) => {
  return getStyle(style, state.svgFilterAttrs);
};
</script>

<template>
  <div
    id="editor"
    class="editor"
    :style="{
      ...getCanvasStyle(mainStore.canvasStyleData),
      width: changeStyleWithScale(mainStore.canvasStyleData.width) + 'px',
      height: changeStyleWithScale(mainStore.canvasStyleData.height) + 'px',
    }"
  >
    <!-- 网格线 -->
    <Grid />
    <Shape
      v-for="(item, index) in mainStore.componentData"
      :key="item.id"
      :element="item"
      :index="index"
      :active="item.id === (mainStore.curComponent || {}).id"
      :style="getShapeStyle(item.style)"
    >
      <component
        :is="COMPONENTS[item.component]"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :request="item.request"
      />
    </Shape>
  </div>
</template>

<style lang="scss" scoped>
.editor {
  position: relative;
  background: #fff;
  margin: auto;

  .lock {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
}

.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
