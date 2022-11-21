// import store from "@/stores";
// import eventBus from "@/utils/eventBus";

export const enum keyMap {
  ctrlKey = 17,
  commandKey = 91, // mac command
  vKey = 86, // 粘贴
  cKey = 67, // 复制
  xKey = 88, // 剪切
  yKey = 89, // 重做
  zKey = 90, // 撤销
  gKey = 71, // 组合
  bKey = 66, // 拆分
  lKey = 76, // 锁定
  uKey = 85, // 解锁
  sKey = 83, // 保存
  pKey = 80, // 预览
  dKey = 68, // 删除
  deleteKey = 46, // 删除
  eKey = 69, // 清空画布
}
export const keycodes = [
  keyMap.bKey,
  keyMap.cKey,
  keyMap.dKey,
  keyMap.eKey,
  keyMap.gKey,
  keyMap.lKey,
  keyMap.pKey,
  keyMap.sKey,
  keyMap.uKey,
  keyMap.vKey,
  keyMap.xKey,
  keyMap.yKey,
  keyMap.zKey,
];
