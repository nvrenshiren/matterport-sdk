export function copyAllProperties(target: any, source: any) {
  const keys = Object.getOwnPropertyNames(source)
  for (const key of keys) {
    if (target[key] !== undefined) {
      continue
    }
    if (typeof source[key] === "function") {
      Object.defineProperty(target, key, {
        value: source[key].bind(target)
      })
    } else {
      Object.defineProperty(target, key, {
        value: source[key],
        writable: true
      })
    }
  }

  if (Object.getPrototypeOf(Object.getPrototypeOf(source)) !== null) {
    copyAllProperties(target, Object.getPrototypeOf(source))
  }
}
function s(e, t) {
  return new Promise(n => {
    if (t(e)) n(undefined)
    else {
      const i = e.onChanged(() => {
        t(e) && (i.cancel(), n(undefined))
      })
    }
  })
}
export const Bx = copyAllProperties
export const PM = s
