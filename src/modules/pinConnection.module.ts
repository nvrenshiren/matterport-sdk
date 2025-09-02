import { Mesh, MeshBasicMaterial, Vector3 } from "three"
import { TogglePinConnectionsCommand } from "../command/pin.command"
import { EndPinConnectionCommand, InitPinConnectionCommand, MovePinConnectionCommand } from "../command/sweep.command"
import { PickingPriorityType } from "../const/12529"
import * as o from "../const/4359"
import { LinesSymbol, RaycasterSymbol, SweepPinMeshSymbol, WebglRendererSymbol, WorkShopPinConnectionSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { SweepsData } from "../data/sweeps.data"
import { diffSweep, enabledSweep, isAlignedSweep, sameFloorSweep } from "../utils/sweep.utils"
import { sweepScoreByDistance } from "../utils/sweepScore.utils"
import { isShowcaseMesh } from "../webgl/16769"
import { getPlaneGeometry } from "../webgl/56512"
import { LineMaterial } from "../webgl/line.material"
import { ChildIDS } from "../webgl/showcase.scene"
declare global {
  interface SymbolModule {
    [WorkShopPinConnectionSymbol]: PinConnectionModule
  }
}
export default class PinConnectionModule extends Module {
  sweepData: SweepsData
  raycaster: any
  constructor() {
    super(...arguments),
      (this.name = "pin-connection"),
      (this.connected = !1),
      (this.portalGeometry = getPlaneGeometry()),
      (this.portalMaterial = new MeshBasicMaterial({
        transparent: !0,
        map: null,
        depthWrite: !1,
        depthTest: !1
      })),
      (this.activated = !1),
      (this.registered = !1),
      (this.togglePinConnections = async e => {
        e.enabled ? this.activate() : this.deactivate()
      }),
      (this.connectPin = async e => {
        this.connected || ((this.connected = !0), this.updateMeshes(e.collider, !0))
      }),
      (this.disconnectPin = async () => {
        this.connected && ((this.connected = !1), this.removeMeshes())
      }),
      (this.movePin = async e => {
        this.updateMeshes(e.collider, !1)
      }),
      (this.updateMeshes = (e, t) => {
        if (!this.connected) return
        const n = this.pins.mapColliderToSweep(e)
        if (n) {
          const e = this.pins.mapSweepToMesh(n.id)
          if (e)
            try {
              const i = this.getPortalPosition(e.position, n)
              this.line.updatePositions(e.position, i),
                this.portalMesh.position.copy(i),
                t && (this.line.show(), this.scene.addChild(ChildIDS.Root, this.portalMesh)),
                this.portalMesh.quaternion.copy(e.quaternion)
            } catch (e) {
              this.log.debug(e.message)
            }
        }
      })
  }
  async init(e, t) {
    ;(this.engine = t),
      Promise.all([
        t.getModuleBySymbol(WebglRendererSymbol),
        t.getModuleBySymbol(SweepPinMeshSymbol),
        t.getModuleBySymbol(RaycasterSymbol),
        t.market.waitForData(SweepsData),
        t.getModuleBySymbol(LinesSymbol)
      ]).then(([e, t, n, i, s]) => {
        ;(this.renderer = e), (this.pins = t), (this.raycaster = n), (this.sweepData = i), (this.lines = s)
      }),
      this.engine.commandBinder.addBinding(TogglePinConnectionsCommand, this.togglePinConnections)
  }
  dispose(e) {
    this.activated && this.deactivate(),
      this.engine.commandBinder.removeBinding(TogglePinConnectionsCommand, this.togglePinConnections),
      (this.bindings = []),
      this.portalGeometry.dispose(),
      this.portalMaterial.dispose(),
      super.dispose(e)
  }
  activate() {
    if (this.activated) return
    ;(this.portalMaterial.map = o.P.get().toExteriorTexture),
      (this.portalMesh = new Mesh(this.portalGeometry, this.portalMaterial)),
      (this.portalMesh.renderOrder = PickingPriorityType.portals)
    const e = new LineMaterial({
      color: 16724312,
      linewidth: 3,
      dashed: !0,
      dashSize: 0.4,
      gapSize: 0.2,
      dashScale: 1
    })
    ;(this.line = this.lines.makeLine(new Vector3(), new Vector3(), e)),
      (this.scene = this.renderer.getScene()),
      this.registered
        ? this.bindings.forEach(e => {
            e.renew()
          })
        : (this.addHandlers(), (this.registered = !0)),
      (this.activated = !0)
  }
  deactivate() {
    this.activated &&
      (this.line && (this.removeMeshes(), this.line.dispose()),
      this.registered &&
        this.bindings.forEach(e => {
          e.cancel()
        }),
      (this.activated = !1))
  }
  addHandlers() {
    this.bindings.push(
      this.engine.commandBinder.addBinding(InitPinConnectionCommand, this.connectPin),
      this.engine.commandBinder.addBinding(EndPinConnectionCommand, this.disconnectPin),
      this.engine.commandBinder.addBinding(MovePinConnectionCommand, this.movePin)
    )
  }
  removeMeshes() {
    this.line.hide(), this.portalMesh.parent && this.portalMesh.parent.remove(this.portalMesh)
  }
  getPortalPosition(e, t) {
    const n = this.nearestAlignedSweep(e, t)
    if (!n) throw Error("Couldn't find the nearest sweep for a 360 on floor")
    const s = this.modelIntersection(e, n)
    let r,
      a = new Vector3()
    return (
      s.intersect && s.intersect.face
        ? ((a = s.intersect.face.normal.clone().setY(0).normalize()), (r = s.intersect.point.clone().addScaledVector(a, 0.1).setY(n.position.y)))
        : ((a = s.rayDirection.clone().negate()), (r = n.position.clone().addScaledVector(s.rayDirection, 2))),
      r
    )
  }
  modelIntersection(e, t) {
    const n = new Vector3().copy(e).sub(t.position)
    n.setY(0).normalize()
    return {
      intersect: this.raycaster.picking.pick(t.position, n, isShowcaseMesh),
      rayDirection: n
    }
  }
  nearestAlignedSweep(e, t) {
    const n = [diffSweep(t), enabledSweep(), isAlignedSweep(), sameFloorSweep(t)],
      i = [sweepScoreByDistance(e)],
      s = this.sweepData.sortByScore(n, i)
    return s.length > 0 ? s[0].sweep : null
  }
}
