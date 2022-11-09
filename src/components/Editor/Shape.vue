<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { computed } from "vue";
import type { ComponentStyle } from "@/types/index";

const props = defineProps<{
  active: boolean;
  element: Record<string, any>;
  index: number;
  defaultStyle: ComponentStyle;
}>();
const mainStore = useMainStore();
const NORMAL_POINT_DIRECTION = ["lt", "rt", "lb", "rb", "l", "r", "t", "b"];

// 获取八个点的坐标 只用top/right来定位
const getShapeStyle = (direction: string) => {
  let top = 0,
    left = 0;
  const hasRight = /r/.test(direction);
  const hasBottom = /b/.test(direction);
  const hasTop = /t/.test(direction);
  const hasLeft = /l/.test(direction);
  hasRight && (left = props.element.style.width);
  hasBottom && (top = props.element.style.height);
  if (direction.length === 1) {
    hasLeft && (top = props.element.style.height / 2);
    hasRight && (top = props.element.style.height / 2);
    hasTop && (left = props.element.style.width / 2);
    hasBottom && (left = props.element.style.width / 2);
  }
  return {
    left: `${left}px`,
    top: `${top}px`,
  };
};

const isActive = computed(() => {
  return props.active && !props.element.isLock;
});

const setCurComponent = () => {};
const handleMouseDownOnShape = (e: any) => {
  mainStore.$patch({
    curComponent: props.element,
    curComponentIndex: props.index,
    isInCurComponentArea: true,
    isInEditor: true,
  });
  e.stopPropagation();
  const curStyle = { ...props.defaultStyle };
  const startX = e.clientX;
  const startY = e.clientY;
  const startLeft = Number(curStyle.left);
  const startTop = Number(curStyle.top);

  const move = (mouseEvent: any) => {
    const endX = mouseEvent.clientX;
    const endY = mouseEvent.clientY;
    curStyle.left = endX - startX + startLeft;
    curStyle.top = endY - startY + startTop;
    mainStore.setShapeStyle(curStyle);
  };
  const up = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
};

const handleRotate = () => {};

// 点击小圆点事件
const handleMouseDownOnPoint = (point: any, e: any) => {
  const style = { ...props.defaultStyle };
  const componentRatio = style.width / style.height;
  console.log(componentRatio, point, e);
};
</script>

<template>
  <div
    :class="['shape', { active }]"
    @click="setCurComponent"
    @mousedown="handleMouseDownOnShape"
  >
    <slot></slot>
    <!-- 八个操作点 -->
    <div
      class="shape-point"
      v-for="item in isActive ? NORMAL_POINT_DIRECTION : []"
      :style="getShapeStyle(item)"
      :key="item"
      @mousedown="handleMouseDownOnPoint(item, $event)"
    ></div>
    <!-- 旋转标识 -->
    <span
      v-show="isActive"
      class="iconfont icon-xiangyouxuanzhuan"
      @mousedown="handleRotate"
    ></span>
  </div>
</template>

<style lang="scss" scoped>
.shape {
  position: absolute;

  &:hover {
    cursor: move;
  }
}

.active {
  outline: 1px solid #70c0ff;
  user-select: none;
}

.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 1;
  margin-left: -4px;
  margin-top: -4px;
}

.icon-xiangyouxuanzhuan {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  cursor: grab;
  color: #59c7f9;
  font-size: 20px;
  font-weight: 600;

  &:active {
    cursor: grabbing;
  }
}
</style>
