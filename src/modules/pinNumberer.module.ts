import { MeshBasicMaterial, PlaneGeometry } from "three"
import { TogglePinNumbersCommand } from "../command/pin.command"
import { RttSymbol, SweepPinMeshSymbol, WorkShopPinNumbersSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { SweepsData } from "../data/sweeps.data"
import { PinNumbererMessage } from "../message/sweep.message"
import { AlignmentType, PlacementType } from "../object/sweep.object"
import { getPlaneGeometry } from "../webgl/56512"
import { CreateOffScreenCanvas } from "../webgl/70817"
import { PlaneMesh } from "../webgl/87928"
import RenderToTextureModule from "./renderToTexture.module"
import SweepPinMeshModule from "./sweepPinMesh.module"
declare global {
  interface SymbolModule {
    [WorkShopPinNumbersSymbol]: PinNumbererModule
  }
}
export default class PinNumbererModule extends Module {
  numberMeshData: {}
  activated: boolean
  togglePinNumbers: (e: any) => Promise<void>
  updatePlacement: (e: any) => void
  engine: EngineContext
  renderToTexture: RenderToTextureModule
  sweepData: SweepsData
  sweepPinMesh: SweepPinMeshModule
  static numberGeometry: PlaneGeometry
  static numberTextureWidth: number
  static contextConfig: any
  constructor() {
    super(...arguments),
      (this.name = "pin-numberer"),
      (this.numberMeshData = {}),
      (this.activated = !1),
      (this.togglePinNumbers = async e => {
        e.enabled ? this.activate() : this.deactivate()
      }),
      (this.updatePlacement = e => {
        e.placed ? this.addNumberToMesh(e.sweepId, e.pinIndex + 1) : this.disposeMesh(e.sweepId)
      })
  }
  async init(e, t: EngineContext) {
    const [n, i, r] = await Promise.all([t.market.waitForData(SweepsData), t.getModuleBySymbol(SweepPinMeshSymbol), t.getModuleBySymbol(RttSymbol)])
    ;(this.engine = t),
      (this.renderToTexture = r),
      (this.sweepData = n),
      (this.sweepPinMesh = i),
      this.engine.commandBinder.addBinding(TogglePinNumbersCommand, this.togglePinNumbers)
  }
  dispose(e) {
    this.activated && this.deactivate(),
      this.engine.commandBinder.removeBinding(TogglePinNumbersCommand, this.togglePinNumbers),
      super.dispose(e),
      PinNumbererModule.numberGeometry.dispose()
  }
  activate() {
    this.activated ||
      (this.engine.subscribe(PinNumbererMessage, this.updatePlacement),
      this.sweepData
        .getSweepList()
        .filter(e => e.alignmentType === AlignmentType.UNALIGNED)
        .forEach((e, t) => {
          e.placementType === PlacementType.MANUAL && this.addNumberToMesh(e.id, t + 1)
        }),
      (this.activated = !0))
  }
  deactivate() {
    if (this.activated) {
      this.engine.unsubscribe(PinNumbererMessage, this.updatePlacement)
      for (const e in this.numberMeshData) this.disposeMesh(e)
      this.activated = !1
    }
  }
  disposeMesh(e) {
    const t = this.numberMeshData[e]
    if (t) {
      this.renderToTexture.disposeRenderTarget2D(t.renderTarget)
      const n = t.mesh
      n.parent && n.parent.remove(n), n.material.dispose(), delete this.numberMeshData[e]
    }
  }
  addNumberToMesh(e, t) {
    const n = PinNumbererModule.numberTextureWidth,
      i = new CreateOffScreenCanvas(n, n, PinNumbererModule.contextConfig).context,
      s = this.sweepPinMesh.mapSweepToMesh(e)
    if (!s) return void this.log.debug(`No pin mesh: ${e}`)
    const a = 0.5 * PinNumbererModule.numberTextureWidth
    i.fillText(t.toString(), a, a, PinNumbererModule.numberTextureWidth)
    const o = this.renderToTexture.createRenderTarget2D(PinNumbererModule.numberTextureWidth)
    this.renderToTexture.renderContext(o, i)
    const l = new PlaneMesh(
      PinNumbererModule.numberGeometry,
      new MeshBasicMaterial({
        transparent: !0,
        map: o.texture
      })
    )
    ;(l.renderOrder = s.renderOrder + 1),
      (l.position.y = 0.11),
      (l.position.z = 0.001),
      s.add(l),
      (this.numberMeshData[e] = {
        renderTarget: o,
        mesh: l
      })
  }
}
PinNumbererModule.numberGeometry = getPlaneGeometry()
PinNumbererModule.numberTextureWidth = 128
PinNumbererModule.contextConfig = {
  fillStyle: "white",
  font: 0.55 * PinNumbererModule.numberTextureWidth + "px Roboto",
  shadowColor: "black",
  textShadow: "1",
  textBaseline: "middle",
  textAlign: "center",
  strokeStyle: "black",
  lineWidth: 2
}
