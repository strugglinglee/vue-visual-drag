<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { keycodes, keyMap } from "@/utils/shortcutKey.js";
import { reactive, ref, nextTick } from "vue";
const textRef = ref(null);

const props = defineProps({
  request: {
    type: Object,
    default: () => {},
  },
  element: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["input", "update:element"]);

const mainStore = useMainStore();

const state = reactive({
  canEdit: false,
  ctrlKey: 17,
  isCtrlDown: false,
  cancelRequest: null,
});

const handleKeydown = (e: KeyboardEvent) => {
  // 阻止冒泡，防止触发复制、粘贴组件操作
  state.canEdit && e.stopPropagation();
  if (e.keyCode == state.ctrlKey) {
    state.isCtrlDown = true;
  } else if (
    state.isCtrlDown &&
    state.canEdit &&
    keycodes.includes(e.keyCode)
  ) {
    e.stopPropagation();
  } else if (e.keyCode == keyMap.deleteKey) {
    // deleteKey
    e.stopPropagation();
  }
};
const handleKeyup = (e: KeyboardEvent) => {
  // 阻止冒泡，防止触发复制、粘贴组件操作
  state.canEdit && e.stopPropagation();
  if (e.keyCode == state.ctrlKey) {
    state.isCtrlDown = false;
  }
};
const setEdit = () => {
  if (props.element.isLock) return;

  state.canEdit = true;
  // 全选
  selectText((textRef as any).value);
};
const selectText = (element: HTMLElement) => {
  const selection: Selection = window.getSelection() as Selection;
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
};
const clearStyle = (e: any) => {
  e.preventDefault();
  const clp = e.clipboardData;
  const text = clp.getData("text/plain") || "";
  if (text !== "") {
    document.execCommand("insertText", false, text);
  }

  emit("input", props.element, e.target.innerHTML);
};
const handleMousedown = (e: MouseEvent) => {
  if (state.canEdit) {
    e.stopPropagation();
  }
};
const handleBlur = (e: any) => {
  emit("update:element", {
    ...props.element,
    propValue: e.target.innerHTML || "&nbsp;",
  });
  const html = e.target.innerHTML;
  if (html !== "") {
    emit("update:element", {
      ...props.element,
      propValue: e.target.innerHTML,
    });
  } else {
    emit("update:element", {
      ...props.element,
      propValue: "",
    });
    nextTick(() => {
      emit("update:element", {
        ...props.element,
        propValue: "&nbsp;",
      });
    });
  }
  state.canEdit = false;
};
const handleInput = (e: any) => {
  emit("input", props.element, e.target.innerHTML);
};
</script>

<template>
  <div
    v-if="mainStore.editMode == 'edit'"
    class="v-text"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <!-- tabindex >= 0 使得双击时聚焦该元素 -->
    <div
      ref="textRef"
      :contenteditable="state.canEdit"
      :class="{ 'can-edit': state.canEdit }"
      tabindex="0"
      :style="{ verticalAlign: element.style.verticalAlign }"
      @dblclick="setEdit"
      @paste="clearStyle"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      @input="handleInput"
      v-html="element.propValue"
    ></div>
  </div>
  <div v-else class="v-text preview">
    <div
      :style="{ verticalAlign: element.style.verticalAlign }"
      v-html="element.propValue"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.v-text {
  width: 100%;
  height: 100%;
  display: table;

  div {
    display: table-cell;
    width: 100%;
    height: 100%;
    outline: none;
    word-break: break-all;
    padding: 4px;
  }

  .can-edit {
    cursor: text;
    height: 100%;
  }
}

.preview {
  user-select: none;
}
</style>
