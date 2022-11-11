<script setup lang="ts">
defineProps({
  style: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>

<template>
  <div class="item" :style="style">文字输入</div>
</template>

<style lang="scss" scoped>
.item {
  position: absolute;
}
</style>
