import type { Point } from "@/types";
import { calculateRotatedPointCoordinate, getCenterPoint } from "./translate";

const funcs = {
  l: calculateLeft,
  //   lt: calculateLeftTop,
  //   t: calculateTop,
  //   rt: calculateRightTop,
  //   r: calculateRight,
  //   rb: calculateRightBottom,
  //   b: calculateBottom,
  //   lb: calculateLeftBottom
};

function calculateLeft(
  style: Record<string, any>,
  curPositon: Point,
  proportion: number,
  needLockProportion: boolean,
  pointInfo: Record<string, any>
) {
  const { symmetricPoint, curPoint } = pointInfo;
  const rotatedcurPositon = calculateRotatedPointCoordinate(
    curPositon,
    curPoint,
    -style.rotate
  );
  const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: rotatedcurPositon.x,
      y: curPoint.y,
    },
    curPoint,
    style.rotate
  );

  const newWidth = Math.sqrt(
    (rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 +
      (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2
  );

  const newCenter = {
    x:
      rotatedLeftMiddlePoint.x -
      (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
    y:
      rotatedLeftMiddlePoint.y +
      (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
  };

  const height = style.height;
  //   if (needLockProportion) {
  //     height = newWidth / proportion;
  //   }

  style.height = height;
  style.width = Math.round(newWidth);
  style.top = Math.round(newCenter.y - style.height / 2);
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
