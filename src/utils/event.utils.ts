import { DebugInfo } from "../core/debug"
const i = new DebugInfo("passive-support")
export const supportedPassive = (() => {
  let e = !1
  try {
    const t = Object.defineProperty({}, "passive", {
      get: () => {
        e = !0
      }
    })
    return window.addEventListener("testPassive", () => {}, t), window.removeEventListener("testPassive", () => {}, t), e
  } catch (e) {
    return i.warn(`Passive Option for addEventListener is not supported, Safari zoom may not perform as expected: ${e}`), !1
  }
})()
