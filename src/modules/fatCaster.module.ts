import * as a from "../other/53058"
import { DirectionVector } from "../webgl/vector.const"
import { RaycastFatSymbol, RaycasterSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import RaycasterModule from "./raycaster.module"
import { ArrowHelper, Quaternion, Ray, Vector3 } from "three"
declare global {
  interface SymbolModule {
    [RaycastFatSymbol]: FatCasterModule
  }
}
export default class FatCasterModule extends Module {
  rayAssembly: any[]
  static rayCount: number
  rayPlaneOrientation: Quaternion
  rayVisuals: any[]
  config: { debug: boolean }
  raycaster: RaycasterModule
  constructor() {
    super(...arguments)
    this.name = "fat-caster"
    this.rayAssembly = new Array(FatCasterModule.rayCount)
    this.rayPlaneOrientation = new Quaternion()
    this.rayVisuals = []
  }
  async init(e, t) {
    this.config = { debug: !!e.debug }
    this.raycaster = await t.getModuleBySymbol(RaycasterSymbol)
    for (let e = 0; e < FatCasterModule.rayCount; ++e) this.rayAssembly[e] = new Ray()
    if (e.debug) {
      const e = (await t.getModuleBySymbol(WebglRendererSymbol)).getScene()
      for (let t = 0; t < FatCasterModule.rayCount; ++t) {
        this.rayVisuals[t] = new ArrowHelper(new Vector3(), new Vector3())
        const i = this.rayVisuals[t]
        i.remove(i.cone)
        i.setLength(1e3)
        e.add(this.rayVisuals[t])
      }
    }
  }
  async dispose(e) {
    const t = (await e.getModuleBySymbol(WebglRendererSymbol)).getScene()
    for (const e of this.rayVisuals) t.remove(e)
  }
  get ray() {
    return this.raycaster.pointer.pointerRay.clone()
  }
  cast(e: number, t: Function, i = a.a.Filter.AVERAGE) {
    const n = this.ray
    this.updateRayAssembly(n.origin, n.direction, e)
    return this.castRays(t, i)
  }
  castRays(e, t) {
    const i = []
    let n = null
    for (const t of this.rayAssembly) {
      const s = this.raycaster.picking.pick(t.origin, t.direction, e)
      s && (t === this.rayAssembly[0] && (n = s), s.point.add(this.rayAssembly[0].origin).sub(t.origin), i.push(s))
    }
    return t(i, n, this.rayAssembly)
  }
  updateRayAssembly(e, t, i) {
    for (const e of this.rayAssembly) e.direction.copy(t)
    if (
      (this.rayPlaneOrientation.setFromUnitVectors(DirectionVector.FORWARD, t),
      this.rayAssembly[0].origin.copy(e),
      this.rayAssembly[1].origin.copy(DirectionVector.RIGHT).multiplyScalar(i).applyQuaternion(this.rayPlaneOrientation).add(e),
      this.rayAssembly[2].origin.copy(DirectionVector.UP).multiplyScalar(i).applyQuaternion(this.rayPlaneOrientation).add(e),
      this.rayAssembly[3].origin.copy(DirectionVector.LEFT).multiplyScalar(i).applyQuaternion(this.rayPlaneOrientation).add(e),
      this.rayAssembly[4].origin.copy(DirectionVector.DOWN).multiplyScalar(i).applyQuaternion(this.rayPlaneOrientation).add(e),
      this.rayAssembly[5].origin.copy(DirectionVector.UP).add(DirectionVector.RIGHT).setLength(i).applyQuaternion(this.rayPlaneOrientation).add(e),
      this.rayAssembly[6].origin.copy(DirectionVector.UP).add(DirectionVector.LEFT).setLength(i).applyQuaternion(this.rayPlaneOrientation).add(e),
      this.rayAssembly[7].origin.copy(DirectionVector.DOWN).add(DirectionVector.RIGHT).setLength(i).applyQuaternion(this.rayPlaneOrientation).add(e),
      this.rayAssembly[8].origin.copy(DirectionVector.DOWN).add(DirectionVector.LEFT).setLength(i).applyQuaternion(this.rayPlaneOrientation).add(e),
      this.config.debug)
    )
      for (let e = 0; e < this.rayVisuals.length; ++e) {
        const i = this.rayVisuals[e]
        i.setDirection(t), i.position.copy(this.rayAssembly[e].origin)
      }
  }
}
FatCasterModule.rayCount = 9
