import {
  Color,
  Euler,
  Intersection,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Raycaster,
  Scene,
  Sphere,
  SphereGeometry,
  Texture,
  Vector3
} from "three"
import { HoverSweepCommand } from "../command/sweep.command"
import { PickingPriorityType } from "../const/12529"
import { PuckImageryDefaultConfig } from "../const/puckImagery.const"
import { FeaturesSweepPucksKey } from "../const/sweep.const"
import { RenderLayer, RenderLayers } from "../core/layers"
import { ISubscription } from "../core/subscription"
import { SettingsData } from "../data/settings.data"
import { SweepsViewData, SweepsViewState } from "../data/sweeps.view.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { HandlePuckClickedMessage, HandlePuckHoverMessage } from "../message//sweep.message"
import InputIniModule from "../modules/inputIni.module"
import { AlignmentType, SweepObject } from "../object/sweep.object"
import { Comparator } from "../utils/comparator"
import { MarkerMesh } from "./marker.mesh"
import { DirectionVector } from "./vector.const"

const v: Intersection[] = []
const y = new Sphere()
class PanoMarker extends MarkerMesh {
  collider: ColliderMesh
}

export class ColliderMesh extends Mesh<PlaneGeometry | SphereGeometry, MeshBasicMaterial> {
  raycast(e: Raycaster, t: Intersection[]) {
    super.raycast(e, v)
    if (v.length) {
      const { geometry: n } = this
      n.boundingSphere || n.computeBoundingSphere()
      y.copy(n.boundingSphere!).applyMatrix4(this.matrixWorld)
      for (const n of v) {
        e.ray.intersectSphere(y, n.point)
        n.distance = e.ray.origin.distanceTo(n.point)
        t.push(n)
      }
      v.length = 0
    }
  }
}
//pw
//定位渲染
export class SweepPuckRender {
  scene: Scene
  input: InputIniModule
  settingsData: SettingsData
  sweepViewData: SweepsViewData
  puckImagery: Record<string, typeof PuckImageryDefaultConfig>
  onFloor: boolean
  checkRenderModes: () => boolean
  idleColor: Color
  selectionColor: Color
  idleOpacity: number
  editingOpacity: number
  selectionDuration: number
  puckSize: number
  layer: RenderLayer
  sweepToMesh: Record<string, PanoMarker>
  colliderToSweep: Record<number, string>
  editingEnabled: boolean
  dummyMat: MeshBasicMaterial
  puckOffset: Vector3
  bindings: ISubscription[]
  wasDrawing: boolean
  renderPuckHighlight: (e: string, t: boolean) => void
  isVisiblePuckCollider: (e: ColliderMesh) => boolean
  puckGeometry: PlaneGeometry
  sphereColliderGeometry: SphereGeometry
  constructor(e, t, n, s, r, a, o, c = new Color(16724312), d = new Color(16724312), u = 0.8, h = 0.8, p = 300, m = 0.4, f = RenderLayers.ALL) {
    this.scene = e
    this.input = t
    this.settingsData = n
    this.sweepViewData = s
    this.puckImagery = r
    this.onFloor = a
    this.checkRenderModes = o
    this.idleColor = c
    this.selectionColor = d
    this.idleOpacity = u
    this.editingOpacity = h
    this.selectionDuration = p
    this.puckSize = m
    this.layer = f
    this.sweepToMesh = {}
    this.colliderToSweep = {}
    this.editingEnabled = !1
    this.dummyMat = new MeshBasicMaterial()
    this.puckOffset = new Vector3(0, 0.05, 0)
    this.bindings = []
    this.wasDrawing = !1
    this.renderPuckHighlight = (e, t) => {
      this.sweepViewData.isSweepAligned(e) &&
        this.sweepToMesh[e].configure({
          tint: t ? this.selectionColor : this.idleColor
        })
    }
    this.isVisiblePuckCollider = e => {
      const n = e.userData.sid
      return e instanceof ColliderMesh && this.sweepViewData.getState(n)?.visible && this.sweepViewData.getSweepVisibility(this.sweepViewData.getSweep(n))
    }
  }
  init() {
    this.puckGeometry = new PlaneGeometry(this.puckSize, this.puckSize)
    if (this.onFloor) {
      const e = new Matrix4()
      e.makeRotationFromEuler(new Euler(-Math.PI / 2, 0, 0, "XYZ"))
      this.puckGeometry.applyMatrix4(e)
    }
    this.sphereColliderGeometry = new SphereGeometry(0.5 * this.puckSize, 10, 10)
    const e = this.sweepViewData.getCollection()
    const t = (e: SweepsViewState, t: string) => {
      this.wasDrawing = !1
      this.createPuck(this.sweepViewData.getSweep(t))
    }
    e.entries().forEach(([e, n]) => t(n, e))
    e.onElementChanged({
      onAdded: t,
      onRemoved: (e, t) => {
        this.removeSweepFromScene(t!)
        delete this.sweepToMesh[t!]
        delete this.colliderToSweep[t!]
      }
    })
  }
  get displayDisabled() {
    return void 0 !== this.puckImagery.disabled
  }
  createMesh(e: SweepObject) {
    const t = new PanoMarker({
      radius: this.puckSize / 2,
      normal: DirectionVector.UP
    })
    this.onFloor ? t.position.copy(e.floorPosition).add(this.puckOffset) : (t.position.copy(e.position), t.rotation.setFromQuaternion(e.rotation))
    t.name = e.id
    t.updateMatrixWorld(!1)
    t.renderOrder = PickingPriorityType.panoMarker
    t.material.depthWrite = !1
    const n = this.sweepViewData.getState(e.id)
    const i = () => this.updateMesh(e, n, t)

    this.bindings.push(n.onChanged(i), e.onPropertyChanged("enabled", i))
    i()
    t.layers.mask = this.layer.mask
    return t
  }
  updateMesh(e: SweepObject, t: SweepsViewState, n: PanoMarker) {
    if ((n.visible = t.visible)) {
      const { editingEnabled: s, puckImagery: r } = this
      const a = t.animation.value
      const o = s && a > 0
      const l = e.enabled ? (o ? r.enabledHover : r.enabled) : o ? r.disabledHover : r.disabled

      n.configure({
        texture: l instanceof Texture ? l : null,
        rings: l instanceof Texture ? void 0 : l,
        tint: this.editingEnabled && e.id === this.sweepViewData.selectedSweep ? this.selectionColor : this.idleColor,
        opacity: MathUtils.lerp(s ? this.editingOpacity : this.idleOpacity, 1, a)
      })
    }
  }
  createCollider(e: SweepObject, t: PanoMarker) {
    let n: ColliderMesh
    n = this.onFloor ? new ColliderMesh(this.puckGeometry, this.dummyMat) : new ColliderMesh(this.sphereColliderGeometry, this.dummyMat)
    n.userData.sid = e.id
    n.position.copy(t.position)
    n.rotation.copy(t.rotation)
    n.name = e.id
    n.updateMatrixWorld(!1)
    return n
  }
  createPuck(e: SweepObject) {
    if (e.alignmentType !== AlignmentType.ALIGNED) return
    const t = this.createMesh(e)
    const n = this.createCollider(e, t)

    t.collider = n
    this.sweepToMesh[e.id] = t
    this.colliderToSweep[n.id] = e.id
  }
  toggleEditingEnabled(e: boolean) {
    this.editingEnabled = e
    for (const t in this.sweepToMesh) {
      this.sweepToMesh[t].configure({
        opacity: e ? this.editingOpacity : this.idleOpacity
      })
    }
  }
  getSweepId(e: number) {
    return this.colliderToSweep[e]
  }
  updatePuckImagery(e: Record<string, typeof PuckImageryDefaultConfig>) {
    let t: boolean
    this.displayDisabled || void 0 === e.disabled ? this.displayDisabled && void 0 === e.disabled && (t = !1) : (t = !0)
    this.puckImagery = e
    this.sweepViewData.iterate((e, n) => {
      if (e.alignmentType === AlignmentType.ALIGNED && (this.updateMesh(e, n, this.sweepToMesh[e.id]), void 0 !== t)) {
        if (e.enabled) return
        t ? this.addSweepToScene(e.id) : this.removeSweepFromScene(e.id)
      }
    })
  }
  updateCheckRenderModes(e: () => boolean) {
    this.checkRenderModes = e
  }
  removeSweepFromScene(e: string) {
    const t = this.sweepToMesh[e]
    t && (this.scene.remove(t), this.input.unregisterMesh(t.collider))
  }
  addSweepToScene(e: string) {
    if (!this.sweepViewData.getSweep(e).enabled && !this.displayDisabled) return
    const t = this.sweepToMesh[e]
    this.scene.add(t)
    this.input.registerMesh(t.collider, !0, this.isVisiblePuckCollider)
  }
  render() {
    const e = this.checkRenderModes()
    const t = this.settingsData.tryGetProperty(FeaturesSweepPucksKey, !0)
    if (e && t) {
      if (!this.wasDrawing) {
        for (const e in this.sweepToMesh) this.addSweepToScene(e)
        this.wasDrawing = !0
      }
    } else if (this.wasDrawing) {
      for (const e in this.sweepToMesh) this.removeSweepFromScene(e)
      this.wasDrawing = !1
    }
  }
  dispose() {
    for (const e in this.sweepToMesh) this.sweepToMesh[e].dispose()
  }
  activate(e) {
    this.wasDrawing = !1
    const t = Comparator.is(this.isVisiblePuckCollider)
    this.bindings.push(
      this.input.registerMeshHandler(HoverMeshEvent, t, (t, n) => {
        e.commandBinder.issueCommand(new HoverSweepCommand(this.getSweepId(n.id), !0, this.selectionDuration)),
          e.broadcast(new HandlePuckHoverMessage(this.getSweepId(n.id), !0))
      })
    )
    this.bindings.push(
      this.input.registerMeshHandler(UnhoverMeshEvent, t, (t, n) => {
        e.commandBinder.issueCommand(new HoverSweepCommand(this.getSweepId(n.id), !1, this.selectionDuration)),
          e.broadcast(new HandlePuckHoverMessage(this.getSweepId(n.id), !1))
      })
    )
    this.bindings.push(
      this.input.registerMeshHandler(InputClickerEndEvent, t, (t, n) => {
        const i = this.sweepViewData.getSweep(this.colliderToSweep[n.id]).index,
          s = this.sweepViewData.getAlignedSweeps(!0).length
        e.broadcast(new HandlePuckClickedMessage(this.colliderToSweep[n.id], i, s))
      })
    )
  }
  deactivate(e) {
    for (const e in this.sweepToMesh) this.removeSweepFromScene(e)
    for (const e of this.bindings) e.cancel()
    this.bindings.length = 0
  }
}
