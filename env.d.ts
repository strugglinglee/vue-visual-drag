/// <reference types="vite/client" />

// 解决ts报错module cant find
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const vueComponent: DefineComponent<{}, {}, any>;
  export default vueComponent;
}

declare interface Point {
  x: number;
  y: number;
}
declare interface Placement {
  left: number;
  bottom: number;
  right: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}

declare interface CanvasStyle {
  width: number;
  height: number;
  scale: number;
  color: string;
  opacity: number;
  background: string;
  fontSize: number;
}

declare interface AnyType {
  [propName: string]: any;
}
