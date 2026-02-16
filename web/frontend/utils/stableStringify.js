// FILE: web/frontend/utils/stableStringify.js

export function stableStringify(obj) {
  return JSON.stringify(sortDeep(obj));
}

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, k) => {
        acc[k] = sortDeep(value[k]);
        return acc;
      }, {});
  }
  return value;
}
