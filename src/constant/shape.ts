import type { ShapePonitType } from "@/types/shape";

export const NORMAL_POINT_DIRECTION: ShapePonitType[] = [
  "lt",
  "rt",
  "lb",
  "rb",
  "l",
  "r",
  "t",
  "b",
];

export const ANGLE_TO_CURSOR = [
  // 每个范围的角度对应的光标
  { start: 338, end: 23, cursor: "nw" },
  { start: 23, end: 68, cursor: "n" },
  { start: 68, end: 113, cursor: "ne" },
  { start: 113, end: 158, cursor: "e" },
  { start: 158, end: 203, cursor: "se" },
  { start: 203, end: 248, cursor: "s" },
  { start: 248, end: 293, cursor: "sw" },
  { start: 293, end: 338, cursor: "w" },
];
