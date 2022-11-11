<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { useComposeStore } from "@/stores/compose";
import { computed, ref } from "vue";
import type { ComponentStyle } from "@/types/index";
import { ShapePointCursor, type ShapePonitType } from "@/types/shape";
// import { mod360 } from "@/utils/translate";
import { NORMAL_POINT_DIRECTION } from "@/constant/shape";
import calculateComponentPositonAndSize from "@/utils/calculateComponentPositonAndSize";

let currentEl = ref(null);

const props = defineProps<{
  active: boolean;
  element: Record<string, any>;
  index: number;
  defaultStyle: ComponentStyle;
}>();
const mainStore = useMainStore();
const composeStore = useComposeStore();

// 获取八个点的坐标 只用top/right来定位
const getShapeStyle = (direction: ShapePonitType) => {
  let top = 0,
    left = 0;
  const hasRight = /r/.test(direction);
  const hasBottom = /b/.test(direction);
  const hasTop = /t/.test(direction);
  const hasLeft = /l/.test(direction);
  hasRight && (left = props.defaultStyle.width);
  hasBottom && (top = props.defaultStyle.height);
  if (direction.length === 1) {
    hasLeft && (top = props.defaultStyle.height / 2);
    hasRight && (top = props.defaultStyle.height / 2);
    hasTop && (left = props.defaultStyle.width / 2);
    hasBottom && (left = props.defaultStyle.width / 2);
  }
  return {
    left: `${left}px`,
    top: `${top}px`,
    cursor: ShapePointCursor[direction],
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

const handleRotate = (e: MouseEvent) => {
  mainStore.$patch({
    isInCurComponentArea: true,
  });
  e.preventDefault();
  e.stopPropagation();
  // 初始坐标和初始角度
  const pos = { ...props.defaultStyle };
  const startY = e.clientY;
  const startX = e.clientX;
  const startRotate = pos.rotate;
  // // 获取元素中心点位置
  const rect = (currentEl as any).value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // 旋转前的角度
  const rotateDegreeBefore =
    Math.atan2(centerY - startY, centerX - startX) / (Math.PI / 180);
  const move = (moveEvent: MouseEvent) => {
    const curX = moveEvent.clientX;
    const curY = moveEvent.clientY;
    // 旋转后的角度
    const rotateDegreeAfter =
      Math.atan2(centerY - curY, centerX - curX) / (Math.PI / 180);
    pos.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore;
    // 修改当前组件样式
    mainStore.setShapeStyle(pos);
  };

  const up = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  };

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
};

// 点击小圆点事件
const handleMouseDownOnPoint = (direction: any, e: any) => {
  mainStore.$patch({
    isInCurComponentArea: true,
    isInEditor: true,
  });
  e.stopPropagation();
  e.preventDefault();
  const style = { ...props.defaultStyle };
  // 组件宽高比
  const componentRatio = style.width / style.height;
  // 组件中心点
  const centerPoint = {
    x: style.left + style.width / 2,
    y: style.top + style.height / 2,
  };

  const editorRectInfo = (
    composeStore.editor as HTMLBaseElement
  ).getBoundingClientRect();
  const pointRect = e.target.getBoundingClientRect();

  // 当前点击圆点相对于画布的中心坐标
  const curPoint = {
    x: Math.round(
      pointRect.left - editorRectInfo.left + e.target.offsetWidth / 2
    ),
    y: Math.round(
      pointRect.top - editorRectInfo.top + e.target.offsetHeight / 2
    ),
  };

  // 获取对称点的坐标
  const symmetricPoint = {
    x: centerPoint.x + (centerPoint.x - curPoint.x),
    y: centerPoint.y + (centerPoint.y - curPoint.y),
  };
  let isFirst = true;
  const move = (moveEvent: MouseEvent) => {
    // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
    // 因此第一次点击时不触发 move 事件
    if (isFirst) return (isFirst = false);
    const curPositon = {
      // moveEvent.clientX 鼠标指针在点击元素（DOM）中的 X 坐标。
      x: moveEvent.clientX - Math.round(editorRectInfo.left),
      y: moveEvent.clientY - Math.round(editorRectInfo.top),
    };

    calculateComponentPositonAndSize(
      direction,
      style,
      curPositon,
      componentRatio,
      false,
      {
        center: centerPoint,
        curPoint,
        symmetricPoint,
      }
    );
    mainStore.setShapeStyle(style);
  };

  const up = () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  };

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
};
</script>

<template>
  <div
    :class="['shape', { active }]"
    @click="setCurComponent"
    @mousedown="handleMouseDownOnShape"
    ref="currentEl"
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
