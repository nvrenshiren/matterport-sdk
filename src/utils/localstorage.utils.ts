import { DebugInfo } from "../core/debug"
const i = new DebugInfo("util-browser")
export const lsGetItem = <T = any>(e: string, t?: T): T | undefined => {
  if (!("localStorage" in window)) return t
  let n
  try {
    n = window.localStorage.getItem(e)
  } catch (e) {
    i.debug(e)
    return t
  }
  return null === n ? t : "boolean" == typeof t ? "true" === n : "number" == typeof t ? parseFloat(n) : n
}
export const lsSetItem = (e: string, t: any) => {
  try {
    window.localStorage.setItem(e, t)
  } catch (e) {
    i.error(e)
  }
}
