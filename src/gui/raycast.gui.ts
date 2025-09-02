import * as a from "../webgl/gui.draw"
import * as r from "../math/2569"
import { getBoundingBox } from "../webgl/56512"
import * as u from "../webgl/skySphere.mesh"
import { SettingsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import Engine from "../core/engine"
import { CameraData } from "../data/camera.data"
import { PointerData } from "../data/pointer.data"
import { DirectionVector } from "../webgl/vector.const"
import { Mesh, Quaternion, Vector3 } from "three"
import EngineContext from "../core/engineContext"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import { getPointOnRay } from "../math/2569"
import { GUIDraw } from "../webgl/gui.draw"
const debug = new DebugInfo("raycaster-debug")
enum g {
  hitBounds = "hitBounds",
  hitClass = "hitClass",
  normal = "normal"
}
const f = { color: "yellow" }
class m {
  engine: EngineContext
  cached: { v1: Vector3; v2: Vector3; quat: Quaternion }
  showClass: boolean
  showName: boolean
  showNormal: boolean
  showBounds: boolean
  drawRaycastHitNormal: (e: any) => void
  drawRaycastObjectInfo: (e: any, t: any, i: any, s: any) => void
  drawRaycastHitBounds: (e: any) => void
  onPointerDown: () => void
  data: any
  _draw: any
  constructor(e) {
    ;(this.engine = e),
      (this.cached = { v1: new Vector3(), v2: new Vector3(), quat: new Quaternion() }),
      (this.showClass = !1),
      (this.showName = !0),
      (this.showNormal = !1),
      (this.showBounds = !1),
      (this.drawRaycastHitNormal = e => {
        const t = this.draw.line(g.normal, "red", 4)
        e && t.updatePositions(e.point, this.cached.v1.copy(e.point).addScaledVector(e.normal, 0.2)), t.toggle(null !== e)
      }),
      (this.drawRaycastObjectInfo = (e, t, i, s) => {
        const n = this.draw.label(g.hitClass, "X", this.cached.v1, 1)
        if (((n.visible = !1), e && t && (i || s))) {
          const { position: o, rotation: a } = t.pose,
            { point: c, object: h } = e,
            d = i ? h.__proto__.constructor.name : "",
            u = s ? ("" !== h.name ? h.name : h.id) : ""
          ;(n.text = `${d} - ${u}`),
            n.setPosition(c, e => (t.isOrtho() ? e.addScaledVector(DirectionVector.UP, 10) : getPointOnRay(o, e, 1, e))),
            n.scaleBillboard(o, a, t.pose.projection, t.zoom(), t.height, t.aspect(), 0.1),
            n.setOrientation(a),
            (n.visible = !0)
        }
      }),
      (this.drawRaycastHitBounds = e => {
        const t = this.draw.boxWire(g.hitBounds, f).toggle(!1)
        if (e && e.object && !(e.object instanceof SkySphereMesh) && e.object instanceof Mesh) {
          const i = getBoundingBox(e.object.geometry),
            s = i.getCenter(this.cached.v1).applyMatrix4(e.object.matrixWorld),
            n = i.getSize(this.cached.v2).multiply(e.object.scale).multiplyScalar(0.5)
          t.mesh.quaternion.copy(e.object.quaternion), t.toggle(!0).update(s, n)
        }
      }),
      (this.onPointerDown = () => {
        const e = this.data.hit
        e && e.object && debug.warn(e.object, e)
      }),
      Promise.all([e.getModuleBySymbol(SettingsSymbol), e.market.waitForData(PointerData)]).then(([e, t]) => {
        this.data = t
        const i = t.onChanged(() => this.update(t))
        i.cancel()
        const s = e => {
          e
            ? (window.addEventListener("pointerdown", this.onPointerDown), i.renew())
            : (window.removeEventListener("pointerdown", this.onPointerDown), i.cancel(), this.draw.toggleAll(!1))
        }
        e.registerMenuEntry({
          header: "Raycaster",
          setting: "raycasterHitDebugging",
          initialValue: () => !1,
          onChange: e => {
            s(e)
          },
          urlParam: !0
        }),
          e.registerMenuEntry({
            header: "Raycaster",
            setting: "raycasterHitClass",
            initialValue: () => this.showClass,
            onChange: e => {
              this.showClass = e
            },
            urlParam: !0
          }),
          e.registerMenuEntry({
            header: "Raycaster",
            setting: "raycasterHitName",
            initialValue: () => this.showName,
            onChange: e => {
              this.showName = e
            },
            urlParam: !0
          }),
          e.registerMenuEntry({
            header: "Raycaster",
            setting: "raycasterHitNormal",
            initialValue: () => this.showNormal,
            onChange: e => {
              this.showNormal = e
            },
            urlParam: !0
          }),
          e.registerMenuEntry({
            header: "Raycaster",
            setting: "raycasterHitBounds",
            initialValue: () => this.showBounds,
            onChange: e => {
              this.showBounds = e
            },
            urlParam: !0
          })
      })
  }
  get draw() {
    return (
      this._draw ||
        ((this._draw = new GUIDraw({ background: !1, color: "red" })),
        this.engine.getModuleBySymbol(WebglRendererSymbol).then(e => this._draw.addToScene(e.getScene()))),
      this._draw
    )
  }
  update(e) {
    const t = this.engine.market.tryGetData(CameraData)
    this.showNormal && this.drawRaycastHitNormal(e.hit),
      this.showBounds && this.drawRaycastHitBounds(e.hit),
      this.drawRaycastObjectInfo(e.hit, t, this.showClass, this.showName)
  }
}
export default (e: Engine) => {
  new m(e)
}
