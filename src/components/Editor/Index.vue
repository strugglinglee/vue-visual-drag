<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { useComposeStore } from "@/stores/compose";
import { $ } from "@/utils/utils";
import Grid from "./Grid.vue";
import VText from "@/custom-component/VText/Component.vue";
import VButton from "@/custom-component/VButton/Component.vue";
import Picture from "@/custom-component/Picture/Component.vue";
import RectShape from "@/custom-component/RectShape/Component.vue";
import LineShape from "@/custom-component/LineShape/Component.vue";
import CircleShape from "@/custom-component/CircleShape/Component.vue";
import Shape from "./Shape.vue";
import { getShapeStyle, getStyle, getCanvasStyle } from "@/utils/style";
import { onMounted, reactive, type CSSProperties } from "vue";
import { changeStyleWithScale } from "@/utils/translate";

const COMPONENTS = {
  VText,
  VButton,
  Picture,
  RectShape,
  LineShape,
  CircleShape,
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

const getTextareaHeight = (element: any, text: string) => {
  let { lineHeight, fontSize, height } = element.style;
  if (lineHeight === "") {
    lineHeight = 1.5;
  }

  const newHeight =
    (text.split("<br>").length - 1) *
    lineHeight *
    (fontSize || mainStore.canvasStyleData.fontSize);
  return height > newHeight ? height : newHeight;
};

const handleInput = (element: any, value: string) => {
  // 根据文本组件高度调整 shape 高度
  mainStore.setShapeStyle({
    height: getTextareaHeight(element, value),
  });
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
    <div
      v-for="(item, index) in mainStore.testPoints"
      :style="item"
      :key="index"
      class="test_point"
    ></div>
    <Shape
      v-for="(item, index) in mainStore.componentData"
      :key="item.id"
      :element="item"
      :index="index"
      :active="item.id === (mainStore.curComponent || {}).id"
      :style="getShapeStyle(item.style)"
      :defaultStyle="item.style"
    >
      <component
        :is="(COMPONENTS as any)[item.component]"
        v-if="item.component != 'VText'"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />
      <component
        v-else
        :is="(COMPONENTS as any)[item.component]"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :request="item.request"
        v-model:element="mainStore.componentData[index]"
        @input="handleInput"
      />
    </Shape>
  </div>
</template>

<style lang="scss" scoped>
.test_point {
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: red;
  z-index: 9999;
  margin-left: -5px;
  margin-top: -5px;
}
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
