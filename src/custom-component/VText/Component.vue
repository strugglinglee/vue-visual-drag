<script setup lang="ts">
const props = defineProps({
  style: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>

<template>
  <div class="item" :style="style">
    <input />
  </div>
  {{ style }}
</template>

<style lang="scss" scoped>
.item {
  position: absolute;
}
</style>
