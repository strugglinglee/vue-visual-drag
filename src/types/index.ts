export interface ComponentStyle {
  width: number;
  height: number;
  left?: number;
  top?: number;
  [props: string]: any;
}
export interface ComponentInfo {
  style: ComponentStyle;
  [props: string]: any;
}

export interface Point {
  x: number;
  y: number;
}
export interface Placement {
  left: number;
  bottom: number;
  right: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}

export interface CanvasStyle {
  width: number;
  height: number;
  scale: number;
  color: string;
  opacity: number;
  background: string;
  fontSize: number;
}
