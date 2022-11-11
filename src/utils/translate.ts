import { useMainStore } from "@/stores/main";
import type { Point } from "@/types";
import { divide, multiply } from "mathjs";

// 角度转弧度
// Math.PI = 180 度
export function angleToRadian(angle: number) {
  return (angle * Math.PI) / 180;
}

// 求两点之间的中点坐标
export function getCenterPoint(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
}

export function sin(rotate: number) {
  return Math.abs(Math.sin(angleToRadian(rotate)));
}

export function cos(rotate: number) {
  return Math.abs(Math.cos(angleToRadian(rotate)));
}

export function mod360(deg: number) {
  return (deg + 360) % 360;
}

export function changeStyleWithScale(value: number) {
  const { canvasStyleData } = useMainStore();
  return multiply(value, divide(canvasStyleData.scale, 100));
}

export function toPercent(val: number) {
  return val * 100 + "%";
}
