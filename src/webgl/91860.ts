import { DefaultLoadingManager, Cache } from "three"
import { TGALoader } from "three/examples/jsm/loaders/TGALoader"
import { DebugInfo } from "../core/debug"
import { ThreeLoadingManager } from "./loading.manager"
const o = ["FontLoader", "Font", "ParametricGeometry", "TextGeometry"]
const ThreeGlobalsDebugInfo = new DebugInfo("three-globals")
const c = (e, t) => {
  DefaultLoadingManager.addHandler(/\.tga$/i, new TGALoader(ThreeLoadingManager))
  DefaultLoadingManager.addHandler(/\.jpe?g$/i, e())
  DefaultLoadingManager.addHandler(/\.png$/i, t())
  Cache.enabled = !0
}
const d = async () => {
  const { modules: e } = await import("../three.global")
  for (const t of e) {
    const e = Object.keys(t)
    for (const n of e) {
      const e = t[n]
      const s = i
      if (n in s)
        if ("object" == typeof e) for (const t in e) t in s[n] || (s[n][t] = e[t])
        else
          "function" == typeof e &&
            (!(n in s) || o.includes(n)
              ? (s[n] = e)
              : ThreeGlobalsDebugInfo.debug(`"${n}" exists in THREE object but has not been listed as overrideable, skipping...`))
      else s[n] = e
    }
  }
}

export const O = c
export const W = d
