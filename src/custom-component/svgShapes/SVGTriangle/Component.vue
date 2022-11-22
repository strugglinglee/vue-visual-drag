<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import VText from "../../VText/Component.vue";
const props = defineProps({
  propValue: {
    type: String,
    default: "",
  },
  element: {
    type: Object,
    default: () => {},
  },
});

const state = reactive({
  points: "",
});

onMounted(() => {
  draw();
});

watch(props.element.style, () => {
  draw();
});

const draw = () => {
  const { width, height } = props.element.style;
  drawTriangle(width, height);
};

const drawTriangle = (width: number, height: number) => {
  // 五角星十个坐标点的比例集合
  const points = [
    [0.5, 0.05],
    [1, 0.95],
    [0, 0.95],
  ];

  const coordinatePoints = points.map(
    (point) => width * point[0] + " " + height * point[1]
  );
  state.points = coordinatePoints.toString();
};
</script>

<template>
  <div class="svg-triangle-container">
    <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
      <polygon
        ref="triangle"
        :points="state.points"
        :stroke="element.style.borderColor"
        :fill="element.style.backgroundColor"
        stroke-width="1"
      />
    </svg>
    <v-text :prop-value="element.propValue" :element="element" />
  </div>
</template>

<style lang="scss" scoped>
.svg-triangle-container {
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    height: 100%;
  }

  .v-text {
    position: absolute;
    top: 72%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 40%;
  }
}
</style>
