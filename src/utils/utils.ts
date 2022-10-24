interface Target {
  [key: string]: any;
}

export const deepCopy = (target: Target) => {
  if (typeof target == "object") {
    const result: Target = Array.isArray(target) ? [] : {};
    for (const key in target) {
      if (typeof target[key] == "object") {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }

    return result;
  }

  return target;
};
