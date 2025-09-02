import { OutOfRangeExceptionError } from "../error/range.error"
export const waitRun = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time))
}

export const waitRunCancel = (time: number) => {
  let done: Function
  let timeIndex = -1
  return {
    promise: new Promise(resolve => {
      done = resolve
      timeIndex = window.setTimeout(done, time)
    }).then(() => {
      timeIndex = -1
    }),
    cancel: () => {
      timeIndex !== -1 && (window.clearTimeout(timeIndex), done())
    }
  }
}
const a = function (e, t) {
  if (0 === e.length) return null
  let n = 0,
    i = 0
  for (let s of e) (s = t ? s[t] : s), (n += s), i++
  return n / i
}
export const array2Json = function (e: string[]) {
  const t: Record<string, string> = {}
  for (const n of e) t[n] = n
  return t
}
export const setSame = (e: Set<any>, t: Set<any>) => {
  if (e.size !== t.size) return !1
  for (const n of e) if (!t.has(n)) return !1
  return !0
}
export const getNumberListByPersent = function (e: number[], t: number, sort = !0) {
  if (0 === e.length) return null
  sort &&
    e.sort((e, t) => {
      return e - t
    })
  const i = t / 100
  return e[Math.floor(e.length * i)]
}
export const dateToString = function (e: Date) {
  return [
    fillZeroForNumber(e.getMonth() + 1),
    ".",
    fillZeroForNumber(e.getDate()),
    ".",
    e.getFullYear(),
    "_",
    fillZeroForNumber(e.getHours()),
    ".",
    fillZeroForNumber(e.getMinutes()),
    ".",
    fillZeroForNumber(e.getSeconds())
  ].join("")
}
export const fillZeroForNumber = function (e: number, t = 2, n = "0", i = 10) {
  const s = e.toString(i)
  const r = t - s.length + 1
  return r > 0 ? new Array(r).join(n) + s : s
}
export const randomString = function (e: number) {
  let t = ""
  const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < e; i++) t += n.charAt(Math.floor(Math.random() * n.length))
  return t
}

export const booleanMap = (e: string[] = []) => {
  const t: Record<string, boolean> = {}
  for (const n of e) t[n] = !0
  return t
}
export const substrString = (e, t, n = "...") => (e.length <= t ? e : `${e.substr(0, t)}${n}`)
export const checkButtonCode = (e: number, t: number, n: number) => {
  if (!(Math.abs(e) < 4294967295) || !(t < 32) || !(n < 32)) throw new OutOfRangeExceptionError("argument out of range")
  const s = 1 & ((e >>> t) ^ (e >>> n))
  return (e ^= (s << t) | (s << n)) >>> 0
}

export const Y8 = a
