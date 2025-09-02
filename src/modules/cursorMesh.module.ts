import { Group } from "three"
import { PickingPriorityType } from "../const/12529"
import * as c from "../const/85042"
import { CursorMeshSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { RenderLayer, RenderLayers } from "../core/layers"
import { Module } from "../core/module"
import { ISubscription } from "../core/subscription"
import { CursorData } from "../data/cursor.data"
import { PointerData } from "../data/pointer.data"
import { MarkerMesh } from "../webgl/marker.mesh"

declare global {
  interface SymbolModule {
    [CursorMeshSymbol]: CursorMeshModule
  }
}
const u = [
  { outerRadius: 0.977, innerRadius: 0.926, color: 16777215, opacity: 1 },
  { outerRadius: 0.898, innerRadius: 0.648, color: 16777215, opacity: 0.73 }
]
class Cursor {
  scene: any
  layer: RenderLayer
  supportsMobile: boolean
  style: c.L
  bindings: ISubscription[]
  onCursorDataUpdated: (e: any) => void
  mesh: MarkerMesh
  onPositionUpdate: (e: any) => void
  container: any
  constructor(e, t = RenderLayers.ALL) {
    ;(this.scene = e),
      (this.layer = t),
      (this.supportsMobile = !1),
      (this.style = c.L.Reticle),
      (this.bindings = []),
      (this.onCursorDataUpdated = e => {
        this.mesh.configure({ opacity: e.opacity.value, texture: e.texture })
      }),
      (this.onPositionUpdate = e => {
        if (e.hit && e.hit.face) {
          const t = e.hit.point.clone(),
            i = e.hit.face.normal
          this.container.position.copy(t), this.mesh.configure({ normal: i })
        }
      }),
      (this.container = new Group()),
      (this.container.name = "cursor"),
      (this.mesh = new MarkerMesh({ radius: 0.2, rings: u })),
      this.container.add(this.mesh),
      (this.mesh.renderOrder = PickingPriorityType.reticule),
      (this.mesh.layers.mask = this.layer.mask)
  }
  init() {}
  render() {}
  dispose() {
    this.mesh.dispose(),
      this.container.children.forEach(e => {
        if (e.isMesh && e !== this.mesh) {
          e.geometry.dispose()
          const t = e.material
          t.dispose(), t.map && t.map.dispose()
        }
      })
  }
  async activate(e) {
    const t = await e.market.waitForData(CursorData),
      i = await e.market.waitForData(PointerData)
    this.bindings.push(t.onChanged(this.onCursorDataUpdated), i.onChanged(this.onPositionUpdate)), this.scene.add(this.container)
  }
  deactivate() {
    for (const e of this.bindings) e.cancel()
    ;(this.bindings.length = 0), this.scene.remove(this.container)
  }
  setVisible(e) {
    this.container.visible = e
  }
}
export default class CursorMeshModule extends Module {
  setVisible: (e: any) => void
  cursor: any
  constructor() {
    super(...arguments),
      (this.name = "cursor-mesh"),
      (this.setVisible = e => {
        this.cursor && this.cursor.setVisible(e)
      })
  }
  async init(e, t) {
    const i = (await t.getModuleBySymbol(WebglRendererSymbol)).getScene(),
      n = t.claimRenderLayer(this.name)
    ;(this.cursor = new Cursor(i, n)), t.addComponent(this, this.cursor)
  }
  get container() {
    return this.cursor.container
  }
}
