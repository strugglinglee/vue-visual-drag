<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { useComposeStore } from "@/stores/compose";
import { $ } from "@/utils/utils";
import Grid from "./Grid.vue";
import VText from "@/custom-component/VText/Component.vue";
import {
  //   getStyle,
  //   getComponentRotatedStyle,
  //   getShapeStyle,
  //   getSVGStyle,
  getCanvasStyle,
} from "@/utils/style";
import { changeStyleWithScale } from "@/utils/translate";
import { onMounted, reactive } from "vue";

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

const handleContextMenu = (e: any) => {
  e.stopPropagation();
  e.preventDefault();

  // 计算菜单相对于编辑器的位移
  let target = e.target;
  let top = e.offsetY;
  let left = e.offsetX;
  while (target instanceof SVGElement) {
    target = target.parentNode;
  }

  while (!target.className.includes("editor")) {
    left += target.offsetLeft;
    top += target.offsetTop;
    target = target.parentNode;
  }
  console.log(left, top);
  //   this.$store.commit("showContextMenu", { top, left });
};

const handleMouseDown = (e: any) => {
  //   // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
  //   if (!this.curComponent || isPreventDrop(this.curComponent.component)) {
  //     e.preventDefault();
  //   }
  //   this.hideArea();
  //   // 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
  //   const rectInfo = this.editor.getBoundingClientRect();
  //   this.editorX = rectInfo.x;
  //   this.editorY = rectInfo.y;
  //   const startX = e.clientX;
  //   const startY = e.clientY;
  //   this.start.x = startX - this.editorX;
  //   this.start.y = startY - this.editorY;
  //   // 展示选中区域
  //   this.isShowArea = true;
  //   const move = (moveEvent) => {
  //     this.width = Math.abs(moveEvent.clientX - startX);
  //     this.height = Math.abs(moveEvent.clientY - startY);
  //     if (moveEvent.clientX < startX) {
  //       this.start.x = moveEvent.clientX - this.editorX;
  //     }
  //     if (moveEvent.clientY < startY) {
  //       this.start.y = moveEvent.clientY - this.editorY;
  //     }
  //   };
  //   const up = (e) => {
  //     document.removeEventListener("mousemove", move);
  //     document.removeEventListener("mouseup", up);
  //     if (e.clientX == startX && e.clientY == startY) {
  //       hideArea();
  //       return;
  //     }
  //     createGroup();
  //   };
  //   document.addEventListener("mousemove", move);
  //   document.addEventListener("mouseup", up);
};
const hideArea = () => {
  state.isShowArea = false;
  state.width = 0;
  state.height = 0;

  //   this.$store.commit("setAreaData", {
  //     style: {
  //       left: 0,
  //       top: 0,
  //       width: 0,
  //       height: 0,
  //     },
  //     components: [],
  //   });
};

const createGroup = () => {
  //   // 获取选中区域的组件数据
  //   const areaData = getSelectArea();
  //   if (areaData.length <= 1) {
  //     this.hideArea();
  //     return;
  //   }
  //   // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
  //   // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
  //   let top = Infinity,
  //     left = Infinity;
  //   let right = -Infinity,
  //     bottom = -Infinity;
  //   areaData.forEach((component) => {
  //     let style = {};
  //     if (component.component == "Group") {
  //       component.propValue.forEach((item) => {
  //         const rectInfo = $(`#component${item.id}`).getBoundingClientRect();
  //         style.left = rectInfo.left - this.editorX;
  //         style.top = rectInfo.top - this.editorY;
  //         style.right = rectInfo.right - this.editorX;
  //         style.bottom = rectInfo.bottom - this.editorY;
  //         if (style.left < left) left = style.left;
  //         if (style.top < top) top = style.top;
  //         if (style.right > right) right = style.right;
  //         if (style.bottom > bottom) bottom = style.bottom;
  //       });
  //     } else {
  //       style = getComponentRotatedStyle(component.style);
  //     }
  //     if (style.left < left) left = style.left;
  //     if (style.top < top) top = style.top;
  //     if (style.right > right) right = style.right;
  //     if (style.bottom > bottom) bottom = style.bottom;
  //   });
  //   this.start.x = left;
  //   this.start.y = top;
  //   this.width = right - left;
  //   this.height = bottom - top;
  //   // 设置选中区域位移大小信息和区域内的组件数据
  //   this.$store.commit("setAreaData", {
  //     style: {
  //       left,
  //       top,
  //       width: this.width,
  //       height: this.height,
  //     },
  //     components: areaData,
  //   });
};
</script>

<template>
  <div
    id="editor"
    class="editor"
    :class="{ edit: isEdit }"
    :style="{
      ...getCanvasStyle(mainStore.canvasStyleData),
      width: changeStyleWithScale(mainStore.canvasStyleData.width) + 'px',
      height: changeStyleWithScale(mainStore.canvasStyleData.height) + 'px',
    }"
    @contextmenu="handleContextMenu"
    @mousedown="handleMouseDown"
  >
    <!-- 网格线 -->
    <Grid />
    <div v-for="item in mainStore.componentData">
      <component
        :is="COMPONENTS[item.component]"
        :id="'component' + item.id"
        class="component"
        :style="item.style"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />
    </div>
  </div>
</template>
