import g from "rbush"
import { RoomBoundEdgeView } from "../roomBoundEdgeView"
import { RoomBoundHandleView } from "../roomBoundHandleView"
import * as u from "../webgl/87732"
import { RoomBoundViewMesh } from "../roomBoundViewMesh"
import { RoomBoundOpeningView } from "../webgl/98120"
import { UnitTypeKey } from "../utils/unit.utils"
class c extends RoomBoundHandleView {}

import { PickingPriorityType } from "../const/12529"
import * as D from "../math/27990"
import * as C from "../const/28941"
import * as v from "../utils/37519"
import * as b from "../math/59370"
import { getScreenAndNDCPosition, isPitchFactorOrtho } from "../math/59370"
import * as x from "../other/62944"
import { DollhousePeekabooKey } from "../const/66777"
import * as f from "../webgl/67971"
import * as S from "../const/72119"
import * as V from "../utils/comparator"
import * as I from "../math/81729"
import { calculateFieldOfView, calculateWorldUnitsFromScreenWidth, isProjectionOrtho } from "../math/81729"
import * as E from "../const/82403"
import { PhraseKey } from "../const/phrase.const"
import { InputSymbol, LocaleSymbol, RoomBoundRendererSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { UserPreferencesKeys } from "../const/user.const"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { RoomBoundViewData } from "../data/room.bound.view.data"
import { SettingsData } from "../data/settings.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { EndMoveToFloorMessage } from "../message/floor.message"
import { StartMoveToFloorMessage } from "../message//floor.message"
import { winCanTouch } from "../utils/browser.utils"
import { AnimationProgress } from "../webgl/animation.progress"
import { DirectionVector } from "../webgl/vector.const"
import EngineContext from "../core/engineContext"
import { RoomBoundData } from "../data/room.bound.data"
import { Box2, DoubleSide, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Vector2, Vector3 } from "three"
import { Comparator } from "../utils/comparator"
import { TextRenderer } from "../webgl/67971"
import { getMin } from "../utils/37519"
import { calculateRectangleSize, calculateScreenData } from "../math/27990"
declare global {
  interface SymbolModule {
    [RoomBoundRendererSymbol]: RoomBoundRendererModule
  }
}
class T {
  constructor() {
    ;(this.corner = [new Vector2(), new Vector2(), new Vector2(), new Vector2()]),
      (this.axis = [new Vector2(), new Vector2()]),
      (this.origin = [0, 0]),
      (this.aabb = new Box2())
  }
  set(t) {
    if (4 !== t.length) throw new Error("Obb needs four points!")
    for (let e = 0; e < t.length; e++) this.corner[e].copy(t[e])
    this.aabb.setFromPoints(this.corner), this.axis[0].subVectors(this.corner[1], this.corner[0]), this.axis[1].subVectors(this.corner[3], this.corner[0])
    for (let t = 0; t < 2; t++) this.axis[t].divideScalar(this.axis[t].lengthSq()), (this.origin[t] = this.corner[0].dot(this.axis[t]))
  }
  overlaps(t) {
    return this.overlaps1Way(t) && t.overlaps1Way(this)
  }
  overlaps1Way(t) {
    for (let e = 0; e < 2; e++) {
      let i = t.corner[0].dot(this.axis[e]),
        s = i,
        n = i
      for (let o = 1; o < 4; o++) (i = t.corner[o].dot(this.axis[e])), (s = Math.min(s, i)), (n = Math.max(n, i))
      if (s > 1 + this.origin[e] || n < this.origin[e]) return !1
    }
    return !0
  }
}
enum M {
  PERIMETER = 2,
  ROOM = 0,
  WALL = 1
}
class R {
  constructor(t, e, i, s, n, o) {
    ;(this.cameraData = i),
      (this.getCurrFloorId = s),
      (this.isMultiFloor = n),
      (this.debugContainer = o),
      (this.labels = new Set()),
      (this.tree = new g()),
      (this.roomLabelMaker = new TextRenderer({
        assetBasePath: t,
        lang: e,
        color: "white",
        outline: !0,
        background: !1,
        backgroundColor: "#000000",
        backgroundColliderType: F,
        disableDepth: !0
      })),
      (this.wallLabelMaker = new TextRenderer({
        assetBasePath: t,
        color: "black",
        lang: e,
        background: !0,
        backgroundColor: "#ffffff",
        backgroundColliderType: O,
        disableDepth: !0
      }))
  }
  createRoomLabel(t, e) {
    const i = new L(M.ROOM, t, this.roomLabelMaker.createLabel())
    return (i.label.collider.userData = { roomId: e }), this.labels.add(i), i
  }
  createWallLabel(t) {
    const e = new A(M.WALL, t, this.wallLabelMaker.createLabel(), this.cameraData)
    return this.labels.add(e), e
  }
  createPerimeterLabel(t, e = !1) {
    const i = new A(M.PERIMETER, t, this.wallLabelMaker.createLabel(), this.cameraData)
    return this.labels.add(i), e || this.update(), i
  }
  deleteLabel(t) {
    t.label.parent && t.removeFrom(t.label.parent), this.labels.delete(t), t.dispose()
  }
  tickAnimations(t) {
    for (const e of this.labels) e.tickAnimations(t)
  }
  update() {
    const t = new Vector2(),
      e = new Vector3(),
      i = new Vector3(),
      s = [
        { x: -1, y: -1, screenPos: new Vector2() },
        { x: 1, y: -1, screenPos: new Vector2() },
        { x: 1, y: 1, screenPos: new Vector2() },
        { x: -1, y: 1, screenPos: new Vector2() }
      ],
      n = []
    this.debugContainer && this.debugContainer.clear()
    const o = isProjectionOrtho(this.cameraData.pose.projection)
    for (const t of this.labels) t.update()
    const a = this.getCurrFloorId(),
      r = Array.from(this.labels)
        .filter(t => {
          const e = !this.isMultiFloor || a === t.floorId
          return t.labelVisible && t.fitsWall && e
        })
        .map(t => {
          const e = t.label
          return {
            label: t,
            cameraDistance: o ? Math.abs(e.position.y - this.cameraData.pose.position.y) : this.cameraData.pose.position.distanceTo(e.position)
          }
        })
        .sort((t, e) => {
          const i = t.label,
            s = e.label,
            n = Number(!i.getDisplayingTooltip()) - Number(!s.getDisplayingTooltip())
          if (0 !== n) return n
          const o = i.type - s.type
          if (0 !== o) return o
          const a = Number(i.getDimmed()) - Number(s.getDimmed())
          if (0 !== a) return a
          const r = t.cameraDistance - e.cameraDistance
          if (r < 0) return r
          const h = s.length - i.length
          return 0 !== h ? h : i.label.id - s.label.id
        })
        .map(o => {
          const { label: a, cameraDistance: r } = o,
            h = a.label,
            d = calculateWorldUnitsFromScreenWidth(r, this.cameraData.pose.projection.asThreeMatrix4(), this.cameraData.width) * E.bk
          getScreenAndNDCPosition(this.cameraData, h.position, t, e)
          const { width: c, height: u } = h.getUnscaledSize()
          this.debugContainer && (n.length = 0), h.updateMatrixWorld()
          for (const t of s)
            i.set(c * t.x * 0.5 + d * t.x, u * t.y * 0.5 + (d + t.y), 0),
              i.applyMatrix4(h.matrixWorld),
              this.debugContainer && n.push(i.clone()),
              getScreenAndNDCPosition(this.cameraData, i, t.screenPos)
          if (this.debugContainer) {
            const t = new Mesh(
              new ShapeGeometry(new Shape(n.map(t => new Vector2(t.x, t.z)))).rotateX(Math.PI / 2),
              new MeshBasicMaterial({ color: "red", depthTest: !1, side: DoubleSide })
            )
            this.debugContainer.add(t)
          }
          const p = new T()
          p.set(s.map(t => t.screenPos))
          const m = p.aabb
          return { label: a, oob: p, minX: m.min.x, minY: m.min.y, maxX: m.max.x, maxY: m.max.y, distance: r }
        }),
      h = new Set()
    this.tree.clear()
    for (const t of r) {
      const e = this.tree.search(t).find(e => e.oob.overlaps(t.oob)),
        i = t.label.labelGroupId,
        s = i && h.has(i),
        n = !(e || (s && i))
      t.label.setCollides(!n), n && (this.tree.insert(t), i && h.add(i))
    }
  }
}
class L {
  constructor(t, e, i) {
    ;(this.type = t),
      (this.floorId = e),
      (this.label = i),
      (this.length = 0),
      (this.labelGroupId = null),
      (this.labelOpacityAnimation = new AnimationProgress(1)),
      (this.labelVisible = !1),
      (this.collides = !1),
      (this.dimmed = !1),
      (this.displayingTooltip = !1),
      (this.fitsWall = !0),
      this.label.setRenderOrder(PickingPriorityType.labels),
      this.updateOpacityTarget(0)
  }
  addTo(t) {
    return t.add(this.label), this
  }
  removeFrom(t) {
    t.remove(this.label)
  }
  dispose() {
    this.label.dispose()
  }
  tickAnimations(t) {
    this.labelOpacityAnimation.tick(t)
  }
  setVisible(t) {
    t !== this.labelVisible && ((this.labelVisible = t), this.updateOpacityTarget())
  }
  setCollides(t) {
    t !== this.collides && ((this.collides = t), this.updateOpacityTarget(t ? 0 : E.rP))
  }
  setFitsWall(t) {
    t !== this.fitsWall && ((this.fitsWall = t), this.updateOpacityTarget())
  }
  setDimmed(t) {
    t !== this.dimmed && ((this.dimmed = t), this.updateOpacityTarget())
  }
  getDimmed() {
    return this.dimmed
  }
  setDisplayingTooltip(t) {
    ;(this.displayingTooltip = t), this.updateOpacityTarget()
  }
  getDisplayingTooltip() {
    return this.displayingTooltip
  }
  update() {
    this.updateOpacity()
  }
  getSize() {
    const t = this.label.text.split("\n"),
      e = t.reduce((t, e) => Math.max(t, e.length), 0),
      i = calculateRectangleSize(e, 0, 0)
    return { width: i.width, height: i.height * t.length }
  }
  updateOpacity() {
    this.label.opacity = this.labelOpacityAnimation.value
  }
  updateOpacityTarget(t = E.rP) {
    const e = this.dimmed && !this.displayingTooltip ? 0.5 : 1,
      i = this.labelVisible && !this.collides && this.fitsWall ? e : 0
    this.labelOpacityAnimation.modifyAnimation(t > 0 ? this.labelOpacityAnimation.value : i, i, t)
  }
}
class A extends L {
  constructor(t, e, i, s) {
    super(t, e, i),
      (this.cameraData = s),
      (this.start = new Vector3()),
      (this.end = new Vector3()),
      (this.width = 0.1),
      (this.getLinePositions = (() => {
        const t = new Vector3(),
          e = new Vector3(),
          i = new Vector3(),
          s = new Vector3(),
          n = new Vector3()
        return () => {
          t.copy(this.start), e.copy(this.end)
          const o = calculateScreenData(t, e, this.cameraData),
            a = calculateRectangleSize(this.label.text.length),
            r = o.pixelDistance > a.width && this.labelVisible
          this.setFitsWall(r)
          const h = this.cameraData.isOrtho(),
            d = h ? Math.abs(this.label.position.y - this.cameraData.pose.position.y) : this.cameraData.pose.position.distanceTo(this.label.position)
          i.addVectors(t, e).multiplyScalar(0.5),
            h ? (n.subVectors(e, t), n.applyAxisAngle(DirectionVector.UP, 0.5 * Math.PI).normalize()) : n.copy(DirectionVector.UP)
          const l = calculateWorldUnitsFromScreenWidth(d, this.cameraData.pose.projection.asThreeMatrix4(), this.cameraData.width),
            c = h ? 4 : 10
          return (
            s.copy(i),
            s.addScaledVector(n, 0.5 * this.width + 0.75 * this.label.scale.x + l * c),
            { start: t, end: e, center: i, labelPosition: s, lineRotation: o.rotation }
          )
        }
      })())
  }
  updateDimensions(t, e, i, s) {
    this.start.copy(t), this.end.copy(e), (this.width = i)
    const n = this.start.distanceTo(this.end)
    this.length = n
    const o = (0, x.up)(n, s)
    this.label.text = o
  }
  update() {
    super.update(), this.updateBillboard()
  }
  updateBillboard() {
    const { labelPosition: t, lineRotation: e } = this.getLinePositions(),
      { label: i } = this
    i.setPosition(t), i.setOrientation(this.cameraData.pose.rotation, e)
    const { position: s, projection: n } = this.cameraData.pose,
      o = this.cameraData.aspect(),
      { height: a } = this.cameraData,
      r = this.cameraData.zoom(),
      h = calculateFieldOfView(n, s, i.position, a, S.Hn.SCALE),
      d = isProjectionOrtho(n) ? 0 : (getMin(o, 1, 2.5) + r) * S.Hn.SCALE_ASPECT,
      l = 1 + S.Hn.SCALE_NDC - d,
      c = Math.max(Math.min((1 / h) * l, 3), 0.001)
    i.scaleFactor = c
  }
}
class O extends Mesh {
  raycast(t, e) {}
}
class F extends Mesh {
  constructor() {
    super(...arguments), (this.intersectionPriority = C.e.Labels)
  }
}
class RoomBoundRenderer {
  constructor(t, e, i, s, n, o, d, c, u, m, g, f) {
    ;(this.readonly = t),
      (this.data = e),
      (this.scene = i),
      (this.input = s),
      (this.viewListener = n),
      (this.isAdding = o),
      (this.floorsViewData = d),
      (this.cameraData = c),
      (this.locale = u),
      (this.settingsData = g),
      (this.roomBoundsViewData = f),
      (this.currentFloorId = ""),
      (this.rootObjects = {}),
      (this.viewMap = new Map()),
      (this.nodeMap = new Map()),
      (this.roomMap = new Map()),
      (this.openingMap = new Map()),
      (this.visibleWallLabels = new Set()),
      (this.hideCurrentFloorViews = () => {
        if (this.currentFloorId) {
          const t = this.rootObjects[this.currentFloorId]
          for (const e of t.children) e instanceof RoomBoundViewMesh && this.unregisterViewToInput(e)
          this.scene.remove(t)
        }
      }),
      (this.showCurrentFloorViews = () => {
        var t
        const e = (null === (t = this.floorsViewData.singleFloor) || void 0 === t ? void 0 : t.id) || this.floorsViewData.currentFloorId
        if (e) {
          const t = this.rootObjects[e]
          this.scene.add(t)
          for (const e of t.children) e instanceof RoomBoundViewMesh && this.registerViewToInput(e)
          this.currentFloorId = e
        }
      }),
      (this.updateOpeningView = (() => {
        const t = new Vector3(),
          e = new Vector3(),
          i = new Vector3(),
          s = new Vector3(),
          n = new Vector3(),
          o = new Vector3()
        return a => {
          const r = this.data.getWall(a.wallId),
            h = this.baseHeightForFloor(r.floorId)
          o.set(0, h, 0),
            r.getBiasAdjustmentVec(n),
            r.from.getVec3(i).add(n).add(o),
            r.to.getVec3(s).add(n).add(o),
            e.subVectors(s, i).normalize(),
            t.copy(i),
            t.lerp(s, a.relativePos),
            i.copy(t).addScaledVector(e, -0.5 * a.width),
            s.copy(t).addScaledVector(e, 0.5 * a.width)
          const d = this.openingMap.get(a.id)
          if (!d) throw new Error("Unable to find view for opening while updating")
          d.onEdgePositionChanged(i, s, r.width, a.type)
        }
      })()),
      (this.onMoveEnd = () => {
        for (const t of this.data.rooms.values()) this.updateRoomView(t, !0)
      }),
      this.floorsViewData.floors.iterate(t => {
        this.rootObjects[t.id] = new Object3D()
      }),
      (this.bindings = [
        this.data.onWallsChanged({
          onRemoved: t => this.removeViewForWall(t),
          onUpdated: t => this.updateWallView(t),
          onChildUpdated: t => this.updateWallView(t),
          onAdded: t => this.makeWallView(t)
        }),
        this.data.onNodesChanged({
          onRemoved: t => this.removeViewForNode(t),
          onUpdated: t => this.updateNodeView(t),
          onChildUpdated: t => this.updateNodeView(t),
          onAdded: t => this.makeNodeView(t)
        }),
        this.data.onRoomsChanged({
          onRemoved: t => this.removeViewForRoom(t),
          onUpdated: t => this.updateRoomView(t, !1),
          onChildUpdated: t => this.updateRoomView(t, !1),
          onAdded: t => this.makeRoomView(t)
        }),
        this.data.onOpeningsChanged({
          onRemoved: t => this.removeViewForOpening(t),
          onUpdated: t => this.updateOpeningView(t),
          onChildUpdated: t => this.updateOpeningView(t),
          onAdded: t => this.makeOpeningView(t)
        }),
        this.data.afterFinalize(this.onMoveEnd),
        m.subscribe(StartMoveToFloorMessage, this.hideCurrentFloorViews),
        m.subscribe(EndMoveToFloorMessage, this.showCurrentFloorViews),
        this.settingsData.onPropertyChanged(UserPreferencesKeys.UnitType, t => {
          for (const t of this.data.rooms.values()) this.updateRoomView(t, !0)
          for (const t of this.data.walls.values()) this.updateWallView(t)
        }),
        this.roomBoundsViewData.onChanged(() => {
          for (const t of this.data.rooms.values()) this.updateRoomView(t, !0)
        })
      ]),
      winCanTouch() ||
        this.bindings.push(
          this.input.registerMeshHandler(HoverMeshEvent, Comparator.isInstanceOf(F), (t, e) => this.roomLabelHover(e, !0)),
          this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isInstanceOf(F), (t, e) => this.roomLabelHover(e, !1))
        ),
      this.settingsData.tryGetProperty(DollhousePeekabooKey, !1) &&
        this.bindings.push(this.input.registerMeshHandler(InputClickerEndEvent, Comparator.isInstanceOf(F), (t, e) => this.roomLabelClick(e))),
      this.bindings.forEach(t => t.cancel()),
      (this.labelManager = new R(g.tryGetProperty("assetBasePath", ""), u.languageCode, c, () => d.currentFloorId, this.floorsViewData.isMultifloor()))
  }
  init() {}
  render(t) {
    this.labelManager.tickAnimations(t)
    const e = this.cameraData.pose.pitchFactor()
    for (const i of [this.viewMap, this.nodeMap, this.roomMap, this.openingMap]) for (const s of i.values()) s.setPitchFactor(e), s.tickAnimations(t)
  }
  dispose() {}
  beforeRender() {
    this.labelManager.update(), this.updateRoomViews()
  }
  activate(t) {
    if (!this.readonly) for (const [t, e] of this.data.nodes) this.makeNodeView(e)
    for (const [t, e] of this.data.walls) this.makeWallView(e)
    for (const [t, e] of this.data.rooms) this.makeRoomView(e)
    for (const [t, e] of this.data.wallOpenings) this.makeOpeningView(e)
    this.bindings.forEach(t => t.renew()), this.showCurrentFloorViews()
  }
  deactivate() {
    this.bindings.forEach(t => t.cancel())
    for (const t in this.rootObjects) {
      const e = this.rootObjects[t]
      this.scene.remove(e)
      for (const t of e.children.slice()) t instanceof RoomBoundViewMesh && (t.dispose(), this.unregisterViewToInput(t)), e.remove(t)
    }
  }
  updateRoomViews() {
    for (const t of this.roomMap.values()) t.beforeRender()
  }
  registerViewToInput(...t) {
    var e
    for (const i of t) (null === (e = i.parent) || void 0 === e ? void 0 : e.parent) && this.input.registerMesh(i, !1)
  }
  unregisterViewToInput(...t) {
    for (const e of t) this.input.unregisterMesh(e)
  }
  makeNodeView(t) {
    const e = new c(t.id, this.cameraData, this.roomBoundsViewData),
      i = this.baseHeightForFloor(t.floorId)
    e.updatePosition(new Vector3(t.x, i, t.z)),
      this.nodeMap.set(t.id, e),
      this.rootObjects[t.floorId].add(e),
      this.registerViewToInput(e),
      this.viewListener.addView(e, t.id)
  }
  updateNodeView(t) {
    const e = this.nodeMap.get(t.id)
    if (e) {
      const i = this.baseHeightForFloor(t.floorId)
      e.updatePosition(new Vector3(t.x, i, t.z))
    }
  }
  removeViewForNode(t) {
    const e = this.nodeMap.get(t.id)
    e && (this.rootObjects[t.floorId].remove(e), this.nodeMap.delete(t.id), e.dispose(), this.unregisterViewToInput(e), this.viewListener.removeView(t.id))
  }
  makeWallView(t) {
    const e = this.labelManager.createWallLabel(t.floorId)
    e.updateDimensions(t.from.getVec3(), t.to.getVec3(), t.width, this.getUnits())
    const i = new RoomBoundEdgeView(t.id, this.cameraData, this.roomBoundsViewData, e, this.isAdding)
    this.viewMap.set(t.id, i),
      this.rootObjects[t.floorId].add(i, i.stencilMesh),
      e.addTo(this.rootObjects[t.floorId]),
      this.updateWallView(t),
      e.update(),
      this.registerViewToInput(i),
      this.viewListener.addView(i, t.id)
  }
  updateWallView(t) {
    const e = this.viewMap.get(t.id)
    if (e) {
      const i = this.baseHeightForFloor(t.floorId)
      e.onEdgePositionChanged(this.data, i, this.getUnits())
    }
  }
  removeViewForWall(t) {
    const e = this.viewMap.get(t.id)
    e &&
      (this.rootObjects[t.floorId].remove(e, e.stencilMesh),
      this.labelManager.deleteLabel(e.lineLabel),
      this.viewMap.delete(t.id),
      this.visibleWallLabels.delete(e),
      e.dispose(),
      this.unregisterViewToInput(e),
      this.viewListener.removeView(t.id))
  }
  makeRoomView(t) {
    const e = this.rootObjects[t.floorId]
    this.roomMap.has(t.id) && this.removeViewForRoom(t)
    const i = this.baseHeightForFloor(t.floorId),
      s = new u.c(t, i, this.cameraData, this.roomBoundsViewData, this.labelManager, this.getUnits(), !0)
    e.add(s), this.roomMap.set(t.id, s), this.registerViewToInput(s), this.updateRoomView(t, !0), this.viewListener.addView(s, t.id)
  }
  updateRoomView(t, e) {
    const i = this.roomMap.get(t.id)
    if (!i) throw new Error("Unable to find view for room while updating.")
    const s = this.baseHeightForFloor(t.floorId)
    i.updateGeo(t, s, this.getUnits()), i.beforeRender()
    const n = this.data.getPotentialRoomCanvasLabels(
      t.id,
      this.locale.t(PhraseKey.SHOWCASE.ROOMS.DEFAULT_NAME),
      this.getUnits(),
      this.roomBoundsViewData.roomNamesVisible,
      this.roomBoundsViewData.roomDimensionsVisible
    )
    i.updateText(n, e)
  }
  removeViewForRoom(t) {
    const e = this.roomMap.get(t.id)
    if (!e) throw new Error("Unable to find view for room while deleting.")
    this.rootObjects[t.floorId].remove(e), this.roomMap.delete(t.id), e.dispose(), this.input.unregisterMesh(e), this.viewListener.removeView(t.id)
  }
  makeOpeningView(t) {
    const e = this.data.getWall(t.wallId),
      i = new RoomBoundOpeningView(t.id, e.floorId, this.cameraData, this.roomBoundsViewData)
    this.rootObjects[e.floorId].add(i, i.stencilPrepass, i.startHandle, i.endHandle),
      this.openingMap.set(t.id, i),
      this.registerViewToInput(i, i.startHandle, i.endHandle)
    for (const e of [i, i.startHandle, i.endHandle]) this.viewListener.addView(e, t.id)
    this.updateOpeningView(t)
  }
  removeViewForOpening(t) {
    const e = this.openingMap.get(t.id)
    if (!e) throw new Error("Unable to find view for opening while deleting.")
    this.rootObjects[e.floorId].remove(e, e.stencilPrepass, e.startHandle, e.endHandle),
      this.openingMap.delete(t.id),
      e.dispose(),
      this.unregisterViewToInput(e, e.startHandle, e.endHandle),
      this.viewListener.removeView(t.id)
  }
  isPeekabooDollhouse() {
    return !isPitchFactorOrtho(this.cameraData.pose.pitchFactor()) && !this.settingsData.tryGetProperty(DollhousePeekabooKey, !1)
  }
  roomLabelHover(t, e) {
    if (this.isPeekabooDollhouse()) return
    const i = t.userData.roomId,
      s = this.roomMap.get(i)
    s && s instanceof u.c && s.hoverRoomLabel(e)
  }
  roomLabelClick(t) {
    return !!this.isPeekabooDollhouse()
  }
  getUnits() {
    return this.settingsData.tryGetProperty(UserPreferencesKeys.UnitType, UnitTypeKey.IMPERIAL)
  }
  baseHeightForFloor(t) {
    var e
    return (null === (e = this.floorsViewData.floors.getFloor(t)) || void 0 === e ? void 0 : e.medianSweepFloorHeight()) || 0
  }
}
export default class RoomBoundRendererModule extends Module {
  constructor() {
    super(...arguments), (this.name = "room-bound-renderer")
  }
  async init(t, e: EngineContext) {
    ;(this.engine = e),
      ([this.data, this.renderer, this.input, this.floorsViewData, this.cameraData, this.locale, this.settingsData, this.roomBoundViewData] = await Promise.all(
        [
          e.market.waitForData(RoomBoundData),
          e.getModuleBySymbol(WebglRendererSymbol),
          e.getModuleBySymbol(InputSymbol),
          e.market.waitForData(FloorsViewData),
          e.market.waitForData(CameraData),
          e.getModuleBySymbol(LocaleSymbol),
          e.market.waitForData(SettingsData),
          e.market.waitForData(RoomBoundViewData)
        ]
      ))
  }
  async dispose(t) {
    this.roomBoundRenderer && this.engine.removeComponent(this, this.roomBoundRenderer)
  }
  startRendering(t, e, i) {
    if (this.roomBoundRenderer) throw new Error("Already rendering!!")
    ;(this.roomBoundRenderer = new RoomBoundRenderer(
      t,
      this.data,
      this.renderer.getScene(),
      this.input,
      e,
      i,
      this.floorsViewData,
      this.cameraData,
      this.locale,
      this.engine,
      this.settingsData,
      this.roomBoundViewData
    )),
      this.engine.addComponent(this, this.roomBoundRenderer)
  }
  stopRendering() {
    if (!this.roomBoundRenderer) throw new Error("Not rendering!")
    this.engine.removeComponent(this, this.roomBoundRenderer), this.roomBoundRenderer.dispose(), (this.roomBoundRenderer = null)
  }
}

// export const RoomBoundView = RoomBoundViewMesh
