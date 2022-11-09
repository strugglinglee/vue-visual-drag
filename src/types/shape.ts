export type ShapePonitType = "lt" | "rt" | "lb" | "rb" | "l" | "r" | "t" | "b";
// 每个点对应的光标
export enum ShapePointCursor {
  lt = "nw-resize",
  t = "n-resize",
  rt = "ne-resize",
  r = "e-resize",
  rb = "se-resize",
  b = "s-resize",
  lb = "sw-resize",
  l = "w-resize",
}
