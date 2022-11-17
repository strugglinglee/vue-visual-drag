import type { Point } from "@/types";
import { getCenterPoint, angleToRadian } from "./translate";
/**
 * @method 计算根据圆心旋转后的点的坐标
 * @description 点a(x, y) 旋转中心c(x, y) 旋转后点n(x, y) 旋转角度θ
 * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
 * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
 * @param   {Object}  point  旋转前的点坐标
 * @param   {Object}  center 旋转中心
 * @param   {Number}  rotate 旋转的角度
 * @return  {Object}         旋转后的坐标
 * https://www.zhihu.com/question/67425734/answer/252724399 旋转矩阵公式
 */
export function getPointByRotate(point: Point, center: Point, rotate: number) {
  return {
    x:
      (point.x - center.x) * Math.cos(angleToRadian(rotate)) -
      (point.y - center.y) * Math.sin(angleToRadian(rotate)) +
      center.x,
    y:
      (point.x - center.x) * Math.sin(angleToRadian(rotate)) +
      (point.y - center.y) * Math.cos(angleToRadian(rotate)) +
      center.y,
  };
}
/**
 * @method 获取两点间的距离
 */
export const getTwoPointDistance = (point1: Point, point2: Point) => {
  return Math.round(
    Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)
  );
};
class CalculateComponentStyle {
  name: string;
  style: Record<string, any>;
  curPositon: Point;
  proportion: number;
  needLockProportion: boolean;
  pointInfo: Record<string, any>;
  constructor(
    name: string,
    style: Record<string, any>,
    curPositon: Point,
    proportion: number,
    needLockProportion: boolean,
    pointInfo: Record<string, any>
  ) {
    this.name = name;
    this.style = style;
    this.curPositon = curPositon;
    this.proportion = proportion;
    this.needLockProportion = needLockProportion;
    this.pointInfo = pointInfo;
  }
  calculateLeftOrRight() {
    const { symmetricPoint, curPoint } = this.pointInfo;
    // 辅助点1：将鼠标指针以curPoint为圆点逆时针旋转rotate角度
    const rotatedcurPositon = getPointByRotate(
      this.curPositon,
      curPoint,
      -this.style.rotate
    );
    // 辅助点2: 横坐标和辅助点1一致，纵坐标和curPoint一致
    const assistPoint2 = {
      x: rotatedcurPositon.x,
      y: curPoint.y,
    };
    // y不变
    const rotatedLeftMiddlePoint = getPointByRotate(
      assistPoint2,
      curPoint,
      this.style.rotate
    );
    const newWidth = getTwoPointDistance(
      rotatedLeftMiddlePoint,
      symmetricPoint
    );
    const newCenter = getCenterPoint(rotatedLeftMiddlePoint, symmetricPoint);

    let height = this.style.height;
    if (this.needLockProportion) {
      height = newWidth / this.proportion;
    }

    this.style.height = height;
    this.style.width = Math.round(newWidth);
    this.style.top = Math.round(newCenter.y - this.style.height / 2);
    this.style.left = Math.round(newCenter.x - newWidth / 2);
  }
  calculateTopOrBottom() {
    const { symmetricPoint, curPoint } = this.pointInfo;
    // 辅助点1：将鼠标指针以curPoint为圆点逆时针旋转rotate角度
    const rotatedcurPositon = getPointByRotate(
      this.curPositon,
      curPoint,
      -this.style.rotate
    );
    // 辅助点2: 横坐标和curPoint一致 纵坐标和辅助点1一致
    const assistPoint2 = {
      x: curPoint.x,
      y: rotatedcurPositon.y,
    };
    const rotatedTopMiddlePoint = getPointByRotate(
      assistPoint2,
      curPoint,
      this.style.rotate
    );
    const newHeight = getTwoPointDistance(
      rotatedTopMiddlePoint,
      symmetricPoint
    );
    const newCenter = getCenterPoint(rotatedTopMiddlePoint, symmetricPoint);

    let width = this.style.width;
    if (this.needLockProportion) {
      width = newHeight / this.proportion;
    }

    this.style.height = newHeight;
    this.style.width = width;
    this.style.top = Math.round(newCenter.y - newHeight / 2);
    this.style.left = Math.round(newCenter.x - this.style.width / 2);
  }
  calculateDoubleDirection() {
    const { symmetricPoint } = this.pointInfo;
    //求两点之间的中点坐标
    const newCenterPoint = getCenterPoint(this.curPositon, symmetricPoint);
    const newTopLeftPoint = getPointByRotate(
      this.curPositon,
      newCenterPoint,
      -this.style.rotate
    );
    const newBottomRightPoint = getPointByRotate(
      symmetricPoint,
      newCenterPoint,
      -this.style.rotate
    );

    const newWidth = Math.abs(newBottomRightPoint.x - newTopLeftPoint.x);
    const newHeight = Math.abs(newBottomRightPoint.y - newTopLeftPoint.y);

    this.style.width = Math.round(newWidth);
    this.style.height = Math.round(newHeight);
    this.style.left = Math.round(newCenterPoint.x - newWidth / 2);
    this.style.top = Math.round(newCenterPoint.y - newHeight / 2);
  }
  calculate() {
    if (["l", "r"].includes(this.name)) {
      this.calculateLeftOrRight();
      return;
    }
    if (["lt", "rt", "rb", "lb"].includes(this.name)) {
      this.calculateDoubleDirection();
      return;
    }
    if (["t", "b"].includes(this.name)) {
      this.calculateTopOrBottom();
      return;
    }
  }
}

/**
 * @method 计算组件坐标以及大小
 * @param name
 * @param style
 * @param curPositon
 * @param proportion
 * @param needLockProportion
 * @param pointInfo
 */
export default function calculateComponentPositonAndSize(
  name: string,
  style: Record<string, any>,
  curPositon: Point,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  const instance = new CalculateComponentStyle(
    name,
    style,
    curPositon,
    proportion,
    needLockProportion,
    pointInfo
  );
  instance.calculate();
}
