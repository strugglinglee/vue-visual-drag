<script setup lang="ts">
// import ToolBar from "@/components/ToolBar.vue";
import ComponentList from "@/components/ComponentList.vue";
import componentList from "@/custom-component/component-list"; // 左侧列表数据
import { deepCopy } from "@/utils/utils";
import Editor from "@/components/Editor/Index.vue";
import { useComposeStore } from "@/stores/compose";
import { useContextMenuStore } from "@/stores/contextMenu";
import { useMainStore } from "@/stores/main";
import generateID from "@/utils/generateID";

const composeStore = useComposeStore();
const contextMenuStore = useContextMenuStore();
const mainStore = useMainStore();
const handleDrop = (e: any) => {
  e.preventDefault();
  e.stopPropagation();

  const index = e.dataTransfer.getData("index");
  const rectInfo = (
    composeStore.editor as HTMLBaseElement
  ).getBoundingClientRect();
  if (index) {
    const component = deepCopy(componentList[index]);
    component.style.top = e.clientY - rectInfo.y;
    component.style.left = e.clientX - rectInfo.x;
    component.id = generateID();
    // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
    // changeComponentSizeWithScale(component);
    mainStore.addComponent({ component });
    console.log(
      "e.clientY",
      e.clientY,
      "rectInfo.y",
      rectInfo.y,
      "e.clientX",
      e.clientX,
      "rectInfo.x",
      rectInfo.x,
      "com",
      e.clientY - rectInfo.y,
      component.style.top,
      component.style.left,
      e.clientX - rectInfo.x
    );
    // this.$store.commit("recordSnapshot");
  }
};

const handleDragOver = (e: any) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
};

const handleMouseDown = (e: MouseEvent) => {
  mainStore.$patch({
    isInCurComponentArea: false,
  });
  // this.$store.commit("setInEditorStatus", true);
};

const deselectCurComponent = (e: any) => {
  if (!mainStore.isInCurComponentArea) {
    mainStore.$patch({
      curComponent: null,
      curComponentIndex: null,
    });
  }

  // 0 左击 1 滚轮 2 右击
  if (e.button != 2) {
    contextMenuStore.hideContextMenu();
  }
};
</script>

<template>
  <div class="home">
    <!-- <ToolBar></ToolBar> -->
    <main>
      <section class="left">
        <ComponentList></ComponentList>
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @mousedown.stop="handleMouseDown"
          @mouseup="deselectCurComponent"
        >
          <Editor />
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  background: #fff;

  main {
    height: calc(100% - 64px);
    position: relative;

    .left {
      position: absolute;
      height: 100%;
      width: 200px;
      left: 0;
      top: 0;

      & > div {
        overflow: auto;

        &:first-child {
          border-bottom: 1px solid #ddd;
        }
      }
    }

    .right {
      position: absolute;
      height: 100%;
      width: 288px;
      right: 0;
      top: 0;

      .el-select {
        width: 100%;
      }
    }

    .center {
      margin-left: 200px;
      margin-right: 288px;
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;

      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
  }

  .global-attr {
    padding: 10px;
  }
}
</style>
