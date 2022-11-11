import type { Point } from "@/types";
// import { useMainStore } from "@/stores/main";
import { getCenterPoint, angleToRadian } from "./translate";
// import { drawTestPoints } from "./utils";

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

function calculateLeftOrRight(
  style: Record<string, any>,
  curPositon: Point,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  const { symmetricPoint, curPoint } = pointInfo;
  // 辅助点1：将鼠标指针以curPoint为圆点逆时针旋转rotate角度
  const rotatedcurPositon = getPointByRotate(
    curPositon,
    curPoint,
    -style.rotate
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
    style.rotate
  );
  const newWidth = getTwoPointDistance(rotatedLeftMiddlePoint, symmetricPoint);
  const newCenter = getCenterPoint(rotatedLeftMiddlePoint, symmetricPoint);

  let height = style.height;
  if (needLockProportion) {
    height = newWidth / proportion;
  }

  style.height = height;
  style.width = Math.round(newWidth);
  style.top = Math.round(newCenter.y - style.height / 2);
  style.left = Math.round(newCenter.x - newWidth / 2);
}
function calculateTopOrBootom(
  style: Record<string, any>,
  curPositon: Point,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  const { symmetricPoint, curPoint } = pointInfo;
  // 辅助点1：将鼠标指针以curPoint为圆点逆时针旋转rotate角度
  const rotatedcurPositon = getPointByRotate(
    curPositon,
    curPoint,
    -style.rotate
  );
  // 辅助点2: 横坐标和curPoint一致 纵坐标和辅助点1一致
  const assistPoint2 = {
    x: curPoint.x,
    y: rotatedcurPositon.y,
  };
  const rotatedTopMiddlePoint = getPointByRotate(
    assistPoint2,
    curPoint,
    style.rotate
  );
  const newHeight = getTwoPointDistance(rotatedTopMiddlePoint, symmetricPoint);
  const newCenter = getCenterPoint(rotatedTopMiddlePoint, symmetricPoint);

  let width = style.width;
  if (needLockProportion) {
    width = newHeight / proportion;
  }

  style.height = newHeight;
  style.width = width;
  style.top = Math.round(newCenter.y - newHeight / 2);
  style.left = Math.round(newCenter.x - style.width / 2);
}
function calculateDoubleDirection(
  style: Record<string, any>,
  curPositon: Point,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  const { symmetricPoint } = pointInfo;
  //求两点之间的中点坐标
  const newCenterPoint = getCenterPoint(curPositon, symmetricPoint);
  const newTopLeftPoint = getPointByRotate(
    curPositon,
    newCenterPoint,
    -style.rotate
  );
  const newBottomRightPoint = getPointByRotate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  );

  const newWidth = Math.abs(newBottomRightPoint.x - newTopLeftPoint.x);
  const newHeight = Math.abs(newBottomRightPoint.y - newTopLeftPoint.y);

  style.width = Math.round(newWidth);
  style.height = Math.round(newHeight);
  style.left = Math.round(newCenterPoint.x - newWidth / 2);
  style.top = Math.round(newCenterPoint.y - newHeight / 2);
}

const funcs = {
  l: calculateLeftOrRight,
  lt: calculateDoubleDirection,
  t: calculateTopOrBootom,
  rt: calculateDoubleDirection,
  r: calculateLeftOrRight,
  rb: calculateDoubleDirection,
  b: calculateTopOrBootom,
  lb: calculateDoubleDirection,
};
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
  curPositon: Record<string, any>,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  (funcs as any)[name] &&
    (funcs as any)[name](
      style,
      curPositon,
      proportion,
      needLockProportion,
      pointInfo
    );
}
