import { RaycasterSymbol, SettingsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import Engine from "../core/engine"
import { randomColor } from "../utils/69984"
const debug = new DebugInfo("raycaster-debug")
class c {
  constructor(e) {
    Promise.all([e.getModuleBySymbol(SettingsSymbol), e.getModuleBySymbol(WebglRendererSymbol), e.getModuleBySymbol(RaycasterSymbol)]).then(([e, t, i]) => {
      const o = t.getScene(),
        n = []
      let a = !1
      const c = () => {
          n &&
            n.forEach(e => {
              e.geometry.dispose(), e.material.dispose(), o.remove(e)
            })
        },
        h = (e, t, a) => {
          debug.info("draw", { from: e, to: t, faces: a })
          const c = i.getOctree().getDebugBoundsMesh(randomColor().getHex(), e, t, a)
          ;(c.frustumCulled = !1), c.updateMatrixWorld(!0), o.add(c), n.push(c)
        }
      e.registerMenuButton({
        header: "Raycaster",
        buttonName: "Add Octree Level Buttons",
        callback: () => {
          if (!a) {
            for (let t = 0; t <= i.getOctree().depth; t++)
              e.registerMenuButton({
                header: "Octree Levels",
                buttonName: `Anything on Level: ${t}`,
                callback: () => {
                  c(), h(t, t, !1)
                }
              })
            for (let t = 0; t <= i.getOctree().depth; t++)
              e.registerMenuButton({
                header: "Octree Faces",
                buttonName: `Faces on Level: ${t}`,
                callback: () => {
                  c(), h(t, t, !0)
                }
              })
            a = !0
          }
        }
      }),
        e.registerMenuButton({
          header: "Raycaster",
          buttonName: "Visualize Octree - All",
          callback: () => {
            c()
            for (let e = 0; e <= i.getOctree().depth; e++) h(e, e, !1)
          }
        }),
        e.registerMenuButton({
          header: "Raycaster",
          buttonName: "Visualize Octree - Faces",
          callback: () => {
            c()
            for (let e = 0; e <= i.getOctree().depth; e++) h(e, e, !0)
          }
        }),
        e.registerMenuButton({ header: "Raycaster", buttonName: "Clear Octree Visuals", callback: c })
    })
  }
}
export default (e: Engine) => {
  new c(e)
}
