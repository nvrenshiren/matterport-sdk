import * as l from "../const/61282"
import { Module } from "../core/module"
import { createObservableValue, ObservableValue } from "../observable/observable.value"
import { FloorsViewData } from "../data/floors.view.data"
import { MeshData } from "../data/mesh.data"
import { VisibleMeshBoundsSymbol } from "../const/symbol.const"
import { DirectionVector } from "../webgl/vector.const"
import { Box3, Plane, Vector3 } from "three"

declare global {
  interface SymbolModule {
    [VisibleMeshBoundsSymbol]: VisibleMeshBoundsModule
  }
}

class VisibleMeshBoundsBase extends Module {
  visibleBounds: ObservableValue<Box3>
  fullBounds: ObservableValue<Box3>
  visibleCenterOfMass: ObservableValue<Vector3>
  getVisibleBounds() {
    return this.visibleBounds.value.clone()
  }

  getFullBounds() {
    return this.fullBounds.value.clone()
  }

  getCenterOfMass() {
    return this.visibleCenterOfMass.value.clone()
  }
  computeFocusPoint(e) {
    const visibleBounds = this.getVisibleBounds()
    const centerOfMass = this.getCenterOfMass()
    const y = Math.ceil(Math.abs(centerOfMass.y - visibleBounds.min.y) / 3)
    let r = Number.MAX_VALUE
    const a = new Vector3(),
      o = new Vector3()
    let d = !1
    if (Number.isFinite(y))
      for (let l = 0; l < y; l++) {
        const s = visibleBounds.min.y + 3 * l,
          u = new Plane().setFromNormalAndCoplanarPoint(DirectionVector.UP, new Vector3(visibleBounds.min.x, s, visibleBounds.min.z))
        d = !!e.intersectPlane(u, a)
        const h = centerOfMass.distanceTo(a)
        d && h < r && ((r = h), o.copy(a))
      }
    const u = visibleBounds.max.distanceTo(centerOfMass) * Math.SQRT2,
      h = !visibleBounds
        .clone()
        .expandByVector(new Vector3(u, 0, u))
        .containsPoint(o)
    if (!d || h) {
      e.closestPointToPoint(centerOfMass, o)
      e.origin.distanceTo(o) < l.qj && e.at(l.qj, o)
    }

    return o
  }
}

export default class VisibleMeshBoundsModule extends VisibleMeshBoundsBase {
  meshData: MeshData
  floorsViewData: FloorsViewData

  constructor() {
    super(...arguments)
    this.name = "visible-mesh-bounds"
    this.visibleBounds = createObservableValue(new Box3())
    this.visibleCenterOfMass = createObservableValue(new Vector3())
    this.fullBounds = createObservableValue(new Box3())
  }

  async init(e, t) {
    Promise.all([t.market.waitForData(MeshData), t.market.waitForData(FloorsViewData)]).then(([e, t]) => {
      this.meshData = e
      this.floorsViewData = t
      this.fullBounds.value = this.meshData.extendedBounds
      this.updateBounds()
      this.bindings.push(
        this.floorsViewData.makeFloorChangeSubscription(() => this.updateBounds()),
        ...this.floorsViewData.floors.getOrderedValues().map(e => e.onBoundsChanged(() => this.updateBounds()))
      )
    })
  }

  getVisibleBounds() {
    return this.visibleBounds.value.clone()
  }

  getFullBounds() {
    return this.fullBounds.value.clone()
  }

  getCenterOfMass() {
    return this.visibleCenterOfMass.value.clone()
  }

  onVisibleBoundsChanged(e) {
    return this.visibleBounds.onChanged(e)
  }

  onFullBoundsChanged(e) {
    return this.fullBounds.onChanged(e)
  }

  updateBounds() {
    this.floorsViewData.currentFloor
      ? ((this.visibleBounds.value = this.floorsViewData.currentFloor.boundingBox.clone()),
        (this.visibleCenterOfMass.value = this.floorsViewData.currentFloor.centerOfMass.clone()))
      : ((this.visibleBounds.value = this.meshData.extendedBounds), (this.visibleCenterOfMass.value = this.meshData.centerOfMass))
  }
}
