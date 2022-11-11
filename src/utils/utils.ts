import { useMainStore } from "@/stores/main";
import type { Point } from "@/types";

interface Target {
  [key: string]: any;
}

export const deepCopy = (target: Target) => {
  if (typeof target == "object") {
    const result: Target = Array.isArray(target) ? [] : {};
    for (const key in target) {
      if (typeof target[key] == "object") {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }

    return result;
  }

  return target;
};

export const $ = (selector: any) => {
  return document.querySelector(selector);
};

// 测试点绘制方法
export const drawTestPoints = (points: Point[]) => {
  const mainStore = useMainStore();
  const TEST_COLORS = ["red", "blue", "yellow", "orange", "green", "black"];
  const testPoints = points.map((item, index) => {
    return {
      left: `${item.x}px`,
      top: `${item.y}px`,
      backgroundColor: TEST_COLORS[index] || "black",
    };
  });
  mainStore.$patch({ testPoints });
};
