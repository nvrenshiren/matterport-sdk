export const ignoredKey = (e: string) =>
  "propertyObservers" === e ||
  "changeObservers" === e ||
  "isObservable" === e ||
  "childChangeFunctions" === e ||
  "isObservableProxy" === e ||
  "diffRoot" === e ||
  "elementChangedHandlers" === e ||
  "knownKeysMap" === e ||
  "knownKeysList" === e ||
  "isVector2" === e ||
  "isVector3" === e ||
  "isQuaternion" === e ||
  "onPropertyChanged" === e ||
  "removeOnPropertyChanged" === e ||
  "onChanged" === e ||
  "target" === e
export const deepCopy = (e: any, t: any[] = []): typeof e => {
  if (void 0 !== e) {
    if (t.includes(e)) return Array.isArray(e) || ArrayBuffer.isView(e) ? [] : {}
    if (e instanceof Date) return new Date(e)
    if (null === e) return null
    if (e.deepCopy) return e.deepCopy()
    if (e.isQuaternion)
      return {
        x: e.x,
        y: e.y,
        z: e.z,
        w: e.w
      }
    if ("object" == typeof e) {
      const n: any = Array.isArray(e) || ArrayBuffer.isView(e) ? [] : {}
      for (const r in e) {
        if (ignoredKey(r)) continue
        const a = e[r]
        a instanceof Date ? (n[r] = new Date(a)) : "function" != typeof a && (t.push(e), (n[r] = "object" == typeof a ? deepCopy(a, t) : a), t.pop())
      }
      return n
    }
    return e
  }
}
export const merge = (e, t) => {
  for (const n in t) {
    if ("function" == typeof t[n]) continue
    if (ignoredKey(n) && !e.hasOwnProperty(n)) continue
    const a = t[n]
    if (e.hasOwnProperty(n)) {
      const t = e[n]
      ;(null === t ? null : typeof t) !== (null === a ? null : typeof a)
        ? (e[n] = deepCopy(a))
        : "object" == typeof t
          ? t instanceof Date
            ? (e[n] = new Date(a))
            : merge(t, a)
          : (e[n] = a)
    } else e[n] = deepCopy(a)
  }
}
export const diffObject = (e, t, n = !1) => {
  const i: any = {}
  for (const s in e) {
    const r = e[s]
    const l = t[s]
    deepDiffers(r, l) &&
      (void 0 === r || void 0 === l || typeof r != typeof l || "object" != typeof r
        ? (i[s] = l)
        : Array.isArray(l)
          ? deepDiffers(r, l) && (i[s] = l)
          : (i[s] = n ? l : diffObject(r, l)))
  }
  for (const n in t) n in e || (i[n] = t[n])
  return i
}
export const deepDiffers = (e, t) => {
  if (null === e || "object" != typeof e) return e !== t
  if (!t) return !0
  for (const n in t) if (!(n in e)) return !0
  for (const n in e) if (deepDiffers(e[n], t[n])) return !0
  return !1
}
export function isNumber(e) {
  return "number" == typeof e
}
export function dataFromJsonByString(e: any, t: string) {
  return t.split(".").reduce((e, t) => e && e[t], e || {})
}
export function NoNull(e) {
  return !!e && "object" == typeof e
}
