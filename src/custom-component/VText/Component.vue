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
  <div class="item" :style="style">文字输入哈哈哈哈哈</div>
</template>

<style lang="scss" scoped>
.item {
  position: absolute;
}
</style>
