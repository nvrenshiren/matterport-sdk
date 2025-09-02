import { isRealNumber } from "../utils/37519"
function s(e) {
  if (e && "object" == typeof e && "x" in e && "y" in e && "z" in e) {
    const t = e
    return isRealNumber(t.x) && isRealNumber(t.y) && isRealNumber(t.z)
  }
  return !1
}

export const u = s
