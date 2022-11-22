<script setup lang="ts">
import VText from "../VText/Component.vue";
defineProps({
  propValue: {
    type: String,
    required: true,
    default: "",
  },
  element: {
    type: Object,
    default: () => {},
  },
});
</script>

<template>
  <div class="rect-shape">
    <VText :prop-value="element.propValue" :element="element" />
  </div>
</template>

<style lang="scss" scoped>
.rect-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
