<script setup lang="ts">
import { onMounted, reactive, watch, ref } from "vue";

const props = defineProps({
  propValue: {
    type: Object,
    required: true,
    default: () => {},
  },
  element: {
    type: Object,
    default: () => {},
  },
});
const state = reactive<any>({
  width: 0,
  height: 0,
  img: null,
  canvas: null,
  ctx: null,
  isFirst: true,
});
const canvasRef = ref(null);
onMounted(() => {
  state.canvas = canvasRef.value;
  state.ctx = state.canvas.getContext("2d");
  drawImage();
});
watch(props.element.style, () => {
  drawImage();
});
watch(props.propValue.flip, () => {
  mirrorFlip();
});
const drawImage = () => {
  const { width, height } = props.element.style;
  state.canvas.width = width;
  state.canvas.height = height;
  if (state.isFirst) {
    state.isFirst = false;
    state.img = document.createElement("img");
    state.img.src = props.propValue.url;
    state.img.onload = () => {
      state.ctx.drawImage(state.img, 0, 0, width, height);
      mirrorFlip();
    };
  } else {
    mirrorFlip();
  }
};
const mirrorFlip = () => {
  const { vertical, horizontal } = props.propValue.flip;
  const { width, height } = props.element.style;
  const hvalue = horizontal ? -1 : 1;
  const vValue = vertical ? -1 : 1;
  // 清除图片
  state.ctx.clearRect(0, 0, width, height);
  // 平移图片
  state.ctx.translate(
    width / 2 - (width * hvalue) / 2,
    height / 2 - (height * vValue) / 2
  );
  // 对称镜像
  state.ctx.scale(hvalue, vValue);
  state.ctx.drawImage(state.img, 0, 0, width, height);
  // 还原坐标点
  state.ctx.setTransform(1, 0, 0, 1, 0, 0);
};
</script>

<template>
  <div style="overflow: hidden">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style lang="scss" scoped></style>
