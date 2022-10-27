<script setup lang="ts"></script>

<template>
  <div class="shape">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.shape {
  position: absolute;

  &:hover {
    cursor: move;
  }
}
</style>
