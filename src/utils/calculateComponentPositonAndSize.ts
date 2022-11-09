import type { Point } from "@/types";
import { calculateRotatedPointCoordinate, getCenterPoint } from "./translate";

const funcs = {
  l: calculateLeft,
  //   lt: calculateLeftTop,
  t: calculateTop,
  //   rt: calculateRightTop,
  r: calculateRight,
  //   rb: calculateRightBottom,
  //   b: calculateBottom,
  //   lb: calculateLeftBottom
};
function calculateTop(
  style: Record<string, any>,
  curPositon: Point,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  const { symmetricPoint, curPoint } = pointInfo;
  const rotatedTopMiddlePoint = {
    x: curPoint.x,
    y: curPositon.y,
  };

  style.height = style.height + style.top - rotatedTopMiddlePoint.y;
  style.top = rotatedTopMiddlePoint.y;
}

function calculateLeft(
  style: Record<string, any>,
  curPositon: Point,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  const { symmetricPoint, curPoint } = pointInfo;
  // const rotatedcurPositon = calculateRotatedPointCoordinate(
  //   curPositon,
  //   curPoint,
  //   -style.rotate
  // );
  // const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate(
  //   {
  //     x: rotatedcurPositon.x,
  //     y: curPoint.y,
  //   },
  //   curPoint,
  //   style.rotate
  // );
  // const rotatedcurPositon = {
  //   x: curPositon.x,
  //   y: curPositon.y,
  // };
  const rotatedLeftMiddlePoint = {
    x: curPositon.x,
    y: curPoint.y,
  };

  const newWidth = symmetricPoint.x - rotatedLeftMiddlePoint.x;

  const newCenter = {
    x:
      rotatedLeftMiddlePoint.x -
      (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedLeftMiddlePoint.y,
  };
  style.width = Math.round(newWidth);
  style.left = Math.round(newCenter.x - newWidth / 2);
}

function calculateRight(
  style: Record<string, any>,
  curPositon: Point,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  const { symmetricPoint, curPoint } = pointInfo;
  const rotatedRightMiddlePoint = {
    x: curPositon.x,
    y: curPoint.y,
  };
  const newWidth = rotatedRightMiddlePoint.x - symmetricPoint.x;

  const newCenter = {
    x: rotatedRightMiddlePoint.x - newWidth / 2,
    y: rotatedRightMiddlePoint.y,
  };

  style.width = Math.round(newWidth);
  style.left = Math.round(newCenter.x - newWidth / 2);
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
