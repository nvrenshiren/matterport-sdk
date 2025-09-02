import * as h from "../webgl/16769"
import * as d from "../math/59370"
import * as u from "../math/81729"
import { GetFloorIntersectCommand } from "../command/floors.command"
import { EngineTickState } from "../const/engineTick.const"
import { MeshQuerySymbol, RaycastFloorSymbol, RaycasterSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { FloorsData } from "../data/floors.data"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { DirectionVector } from "../webgl/vector.const"
import EngineContext from "../core/engineContext"
import WebglRendererModule from "./webglrender.module"
import RaycasterModule from "./raycaster.module"
import MeshQueryModule from "./meshQuery.module"
import { Plane, Vector3 } from "three"
import { isShowcaseMesh, isVisibleShowcaseMesh } from "../webgl/16769"
import { calculatePostDirection, convertScreenToNDC } from "../math/59370"
import { calculateRayIntersection, getRotationQuaternion } from "../math/81729"
declare global {
  interface SymbolModule {
    [RaycastFloorSymbol]: FloorCasterModule
  }
}
export default class FloorCasterModule extends Module {
  cameraPosition: Vector3
  forwardPosition: Vector3
  targetPlane: Plane
  engine: EngineContext
  renderer: WebglRendererModule
  cameraData: CameraData
  raycaster: RaycasterModule
  floorsData: FloorsData
  meshQuery: MeshQueryModule
  constructor() {
    super(...arguments)
    this.name = "floor-caster"
    this.cameraPosition = new Vector3()
    this.forwardPosition = new Vector3()
    this.targetPlane = new Plane()
  }
  async init(e, t: EngineContext) {
    this.engine = t
    ;[this.renderer, this.cameraData, this.raycaster, this.floorsData, this.meshQuery] = await Promise.all([
      t.getModuleBySymbol(WebglRendererSymbol),
      t.market.waitForData(CameraData),
      t.getModuleBySymbol(RaycasterSymbol),
      t.market.waitForData(FloorsData),
      t.getModuleBySymbol(MeshQuerySymbol)
    ])
    t.commandBinder.addBinding(GetFloorIntersectCommand, e => this.castToFloor(e.screenPosition, e.height, e.includeHiddenFloors))
  }
  async castToFloor(e, t, i = !0) {
    await this.engine.after(EngineTickState.End)
    const n = this.renderer.getScene().camera
    const s = convertScreenToNDC(e.x, e.y, this.cameraData.width, this.cameraData.height)
    let a,
      r: Vector3 | null = null
    this.cameraPosition.set(s.x, s.y, -1).unproject(n)
    this.forwardPosition.set(s.x, s.y, 1).unproject(n)
    const c = this.raycaster.picking.cast(
      this.cameraPosition,
      this.forwardPosition.clone().sub(this.cameraPosition).normalize(),
      i ? isShowcaseMesh : isVisibleShowcaseMesh
    )[0]
    if (c && c.object instanceof ShowcaseMesh) {
      r = (c && c.point) || null
      const e = this.meshQuery.floorIdFromObject(c.object)
      e ? (a = this.floorsData.getFloor(e)) : r && (a = this.floorsData.getClosestFloorAtHeight(r.y))
    }
    if (void 0 !== t) {
      this.cameraPosition.copy(this.cameraData.pose.position)
      const e = calculatePostDirection(this.cameraData, s)
      if (this.cameraData.isOrtho()) (e.y = t), (r = e)
      else {
        const i = getRotationQuaternion(this.cameraPosition, e)
        this.targetPlane.set(DirectionVector.DOWN, t), (r = calculateRayIntersection(this.cameraPosition, i, this.targetPlane) || null)
      }
    }
    const m = a ? a.index : -1
    return { position: r, floor: m, floorIndex: m }
  }
}
