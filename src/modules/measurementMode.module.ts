import * as $e from "../other/43909"
import { TextParser } from "../other/52528"
import * as S from "../other/62944"
import { DiffState } from "../other/71954"
import { VisionParase } from "../math/2569"

import * as y from "../const/54875"
import { ModelViewType } from "../const/63319"
import { TransitionTypeList } from "../const/64918"
import * as D from "../const/66990"
import * as K from "../const/72119"
import { MeasurementsKey } from "../const/72119"
import { DataType } from "../const/79728"
import * as Mt from "../const/85042"
import * as X from "../const/measure.const"
import { MouseKeyCode, MouseKeyIndex } from "../const/mouse.const"
import { MdsStore } from "../core/mds.store"
import { getScreenAndNDCPosition, isPitchFactorOrtho, transformPoint } from "../math/59370"

import { ConstraintMode, calculateConstrainedPosition } from "../math/83402"
import { BaseParser } from "../parser/baseParser"
import { delArrayItem } from "../utils/38042"
import * as ee from "../utils/80361"
import { getDayTag } from "../utils/date.utils"
import { isVisibleShowcaseMesh } from "../webgl/16769"
import * as Vt from "../webgl/26269"
import * as Qe from "../webgl/49416"
import { shouldDisplayLayer } from "../webgl/49416"
import { TextRenderer } from "../webgl/67971"

import { SetMouseCursorCommand } from "../command/cursor.command"
import {
  MeasureModeToggleCommand,
  MeasureStartCommand,
  MeasureStopCommand,
  MeasurementDeleteCommand,
  MeasurementDeleteSelectedCommand,
  MeasurementListDeletionCommand,
  MeasurementSelectCommand,
  MeasurementsSetVisibilityCommand,
  RenameMeasurementCommand
} from "../command/measurement.command"
import { ToggleMeshOverlayColorCommand } from "../command/mesh.command"
import { RegisterRoomAssociationSourceCommand } from "../command/room.command"
import { SaveCommand } from "../command/save.command"
import { GutterTouchScrollDisableCommand, GutterTouchScrollEnableCommand } from "../command/scroll.command"
import { SearchGroupDeregisterCommand, SearchGroupRegisterCommand } from "../command/searchQuery.command"
import { ToggleToolCommand } from "../command/tool.command"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { PhraseKey } from "../const/phrase.const"
import { ToolsList } from "../const/tools.const"
import { lineType, searchModeType } from "../const/typeString.const"
import { UserPreferencesKeys } from "../const/user.const"
import { Command } from "../core/command"
import { AppData, AppMode } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { RoomsData } from "../data/rooms.data"
import { SearchData } from "../data/search.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InvalidFloorExceptionError } from "../error/invalidFloorException.error"
import { DoubleClickerStopEvent } from "../events/click.event"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent } from "../events/drag.event"
import { LongPressEndEvent, LongPressStartEvent } from "../events/longPress.event"
import { cryptoString } from "../utils/92558"
import { toDate } from "../utils/date.utils"
import { UnitTypeKey } from "../utils/unit.utils"
import { SnapLine3, SnapVector3 } from "../webgl/snapping"

import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { OnMouseDownEvent, OnMoveEvent } from "../events/mouse.event"
import { createObservableArray } from "../observable/observable.array"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { isMobilePhone } from "../utils/browser.utils"

import { PickingPriorityType } from "../const/12529"
import { RoomBoundData } from "../data/room.bound.data"
import * as Qt from "../utils/isScrollGutter"
import { LoadTexture } from "../utils/loadTexture"
import { areVectorsNearlyParallel, calculateFieldOfView, calculateWorldUnitsFromScreenWidth, isPerspectiveProjection, isProjectionOrtho } from "../math/81729"
import { CheckThreshold } from "../utils/49827"
import { SkySphereMesh } from "../webgl/skySphere.mesh"

import {
  Box3,
  DoubleSide,
  GreaterStencilFunc,
  KeepStencilOp,
  Line,
  Line3,
  LineBasicMaterial,
  LinearFilter,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  Object3D,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Quaternion,
  RGBAFormat,
  Ray,
  Vector2,
  Vector3,
  Group as _Group
} from "three"
import { SetMeshOverLayColorCommand } from "../command/mesh.command"
import { LinePart } from "../const/54702"
import { defaultLineWidth } from "../const/66990"
import { CursorStyle } from "../const/cursor.const"
import { LabelVisible, MeasurePhase } from "../const/measure.const"
import {
  CursorControllerSymbol,
  InputSymbol,
  LinesSymbol,
  MeasurementModeSymbol,
  MeshQuerySymbol,
  NavigationSymbol,
  RaycasterSymbol,
  RttSymbol,
  SettingsSymbol,
  StorageSymbol,
  WebglRendererSymbol
} from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { RenderLayers } from "../core/layers"
import { Module } from "../core/module"
import { WatchedData } from "../core/subscription"
import { CursorData } from "../data/cursor.data"
import { FloorsViewData } from "../data/floors.view.data"
import { LayersData } from "../data/layers.data"
import { MeasureModeData } from "../data/measure.mode.data"
import { BtnText, PlayerOptionsData } from "../data/player.options.data"
import { PointerData } from "../data/pointer.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { checkLerpThreshold } from "../math/2569"
import { calculateRectangleSize, calculateScreenData } from "../math/27990"
import {
  MeasureAddMessage,
  MeasureAddTitleMessage,
  MeasureCancelledMessage,
  MeasureModeChangeMessage,
  MeasureRemoveMessage,
  MeasureSegmentAddMessage,
  MeasureUpdateMessage,
  MeasureUpdateTitleMessage
} from "../message/measure.message"
import { ToggleViewingControlsMessage } from "../message/panel.message"
import { Comparator } from "../utils/comparator"
import { deepDiffers } from "../utils/object.utils"
import { ViewModes } from "../utils/viewMode.utils"
import { getPlaneGeometry } from "../webgl/56512"
import { AnimationProgress } from "../webgl/animation.progress"
import { MatrixBase } from "../webgl/matrix.base"
import { ChildIDS } from "../webgl/showcase.scene"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { DirectionKey, DirectionVector } from "../webgl/vector.const"
import { RoomMeshCheck } from "../webgl/26269"
declare global {
  interface SymbolModule {
    [MeasurementModeSymbol]: MeasurementModeModule
  }
}
const I = new DebugInfo("line-data"),
  P = () => ({ lineVisibleByFeatureType: !0, labelVisibleByFeatureType: !0 })
class T {
  constructor(t, e, i, s, n, o, a = P) {
    ;(this.cameraData = t),
      (this.viewmodeData = e),
      (this.floorsViewData = i),
      (this.isCurrentSweepAligned = s),
      (this.getUnits = n),
      (this.isFeatureEnabled = o),
      (this.visibleFilter = a),
      (this.derivedDataCache = {}),
      (this.dollhouseLineStyle = y.T.ThreeD),
      (this.setVisibilityFilter = t => {
        this.visibleFilter = t
      }),
      (this.resetVisibilityFilter = () => {
        this.visibleFilter = P
      }),
      (this.make = (t, e, i) => {
        const s = e(),
          { start_position: n, end_position: o, visible: a, floorId: r, type: h, text: d } = s,
          l = a && this.isFeatureEnabled(),
          c = l && this.visibleByFloorAndModes(r, h),
          u = void 0 !== i ? i.opacity.value : 0,
          p = 0 === u || (u === D.iV.LABEL_HIDDEN_OPACITY && c)
        if (i && p && (!l || !c)) return i
        let m = c,
          g = c
        if (c) {
          const e = this.visibleFilter(t)
          ;(m = m && e.lineVisibleByFeatureType), (g = g && e.labelVisibleByFeatureType)
        }
        let f = 0
        const v = n.distanceTo(o),
          y = (0, S.up)(v, this.getUnits())
        if (g || !p) {
          const { width: t, height: e } = calculateRectangleSize(d.length + y.length),
            i = calculateScreenData(n, o, this.cameraData)
          this.tmpVec.copy(i.startScreenPosition).sub(i.endScreenPosition)
          let s = Math.abs(this.tmpVec.y) < Math.abs(this.tmpVec.x) ? e : t
          D.iV.ALIGN_LABELS && ((s = t), (f = i.rotation)), (g = g && i.pixelDistance > s)
        }
        let I
        const P = m && g ? 1 : m && !g ? D.iV.LABEL_HIDDEN_OPACITY : 0
        i
          ? ((I = i.opacity), (I.endValue === P && m === i.visible && g === i.labelVisible) || I.modifyAnimation(I.value, P, D.iV.FADE_DURATION))
          : (I = new AnimationProgress(0, P, D.iV.FADE_DURATION))
        const T = { sid: t, rotation: f, labelVisible: g, visible: m, length: v, displayLength: y, labelContents: d.length > 0 ? `${y} ${d}` : y, opacity: I }
        return (this.derivedDataCache[t] = { getLineData: e, previousDerivedData: T }), T
      }),
      (this.update = t => {
        if (this.derivedDataCache[t]) {
          const { getLineData: e, previousDerivedData: i } = this.derivedDataCache[t]
          return this.make(t, e, i)
        }
        I.warn(`data not found for ${t}`)
      }),
      (this.get = t => {
        if (this.derivedDataCache[t]) return this.derivedDataCache[t].previousDerivedData
      }),
      (this.remove = t => {
        this.derivedDataCache[t] && delete this.derivedDataCache[t]
      }),
      (this.clear = () => {
        this.derivedDataCache = {}
      }),
      (this.visibleByFloorAndModes = (t, e) => {
        if (this.floorsViewData.transition.progress.active) return !1
        const i = this.viewmodeData.isInside(),
          s = this.viewmodeData.isFloorplan(),
          n = this.viewmodeData.isDollhouse(),
          o = this.cameraData.pose.pitchFactor(),
          a = this.floorsViewData.currentFloorId,
          r = !a,
          h = !(!a || a !== t),
          d = t === this.floorsViewData.topFloorId,
          l = e === y.T.FloorplanOnly && (s || (n && o <= 1e-5)) && (h || (d && r)),
          c = e === this.dollhouseLineStyle && n && !(n && o <= 0.9) && (h || r)
        return (e === y.T.ThreeD && i && this.isCurrentSweepAligned()) || c || l
      }),
      (this.tmpVec = new Vector2())
  }
  setDollhouseLineStyle(t) {
    this.dollhouseLineStyle = t
  }
}
class H extends Command {
  constructor(t) {
    super(), (this.payload = t), (this.id = "MEASURE_CONTENTS_REPLACE")
  }
}
class U extends Command {
  constructor(t) {
    super(), (this.id = "FILTER_MEASUREMENT_VISIBILITY"), (this.payload = { sids: t })
  }
}
class j extends Command {
  constructor(t) {
    super(), (this.id = "MEASUREMENT_VISIBILITY_FILTER_ENABLED"), (this.payload = { enabled: t })
  }
}
class z extends Command {
  constructor(t) {
    super(), (this.id = "NAVIGATE_TO_MEASUREMENT"), (this.payload = { groupId: t })
  }
}
class Grouper {
  constructor(t) {
    ;(this.contents = t), (this.groupInfo = []), (this.groupIndices = []), (this.groupInfoMap = {}), (this.groupIndicesMap = {})
  }
  startGroup(t) {
    const e = 0 === this.groupCount,
      i = this.contents.length !== this.groupIndices[this.groupCount - 1]
    if (e || i) {
      let e = t.sid
      if (!e) for (e = cryptoString(); this.groupInfoMap.hasOwnProperty(e); ) e = cryptoString()
      const i = Object.assign(Object.assign({}, t), { sid: e })
      this.groupInfo.push(i), (this.groupInfoMap[e] = i), this.groupIndices.push(this.contents.length), (this.groupIndicesMap[this.contents.length] = !0)
    }
    return this.groupIndices.length - 1
  }
  reset() {
    this.contents.atomic(() => {
      for (let t = this.contents.length - 1; t >= 0; --t) this.removeFromIdx(t)
      ;(this.groupIndices = []), (this.groupInfo = []), (this.groupIndicesMap = {})
    })
  }
  isStartIndex(t) {
    return !!this.groupIndicesMap[t]
  }
  *groups() {
    for (let t = 0; t < this.groupCount; ++t) yield this.getGroup(t)
  }
  *[Symbol.iterator]() {
    for (const t of this.contents) yield t
  }
  getGroupStartIndex(t) {
    return this.groupIndices[t]
  }
  getGroup(t) {
    const e = this.groupIndices[t],
      i = this.groupIndices[t + 1],
      s = isNaN(i) ? this.contents.length - 1 : i - 1
    return new Group(t, this.contents, e, s, Object.assign({}, this.groupInfo[t]))
  }
  getGroupById(t) {
    for (let e = 0; e < this.groupInfo.length; e++) if (t === this.groupInfo[e].sid) return this.getGroup(e)
  }
  indexOfGroup(t) {
    for (let e = 0; e < this.groupInfo.length; e++) if (t(this.groupInfo[e])) return e
    return -1
  }
  updateGroupInfo(t, e) {
    const i = this.groupInfo[t].sid
    delete this.groupInfoMap[i]
    const s = Object.assign({ sid: i }, e)
    this.groupInfo.splice(t, 1, s), (this.groupInfoMap[i] = s)
  }
  get groupCount() {
    return this.groupIndices.length
  }
  get length() {
    return this.contents.length
  }
  get(t) {
    return this.contents.get(t)
  }
  push(t) {
    if (0 === this.groupCount) throw Error("Grouper: Error pushing points when we have no groups!")
    return this.contents.push(t.clone()), this.contents.length
  }
  pop() {
    return this.removeFromIdx(this.contents.length - 1)
  }
  removeFromIdx(t) {
    if (t < this.contents.length && t >= 0 && this.contents.length >= 0) {
      const e = this.contents.get(t)
      return this.contents.remove(t), this.removeEmptyGroups(), e
    }
  }
  removeEmptyGroups() {
    this.contents.length <= this.groupIndices[this.groupCount - 1] && this.removeGroup(this.groupCount - 1)
  }
  groupFromPointIndex(t) {
    if (0 > t || t >= this.length) return -1
    let e = this.groupCount - 1
    for (; t < this.groupIndices[e]; ) --e
    return e
  }
  removeGroup(t) {
    if (t > this.groupCount || t < 0) return
    const e = this.getGroup(t)
    if (0 === e.count) return
    const i = this.groupIndices[t]
    this.groupIndices.splice(t, 1), this.groupInfo.splice(t, 1), delete this.groupInfoMap[e.info.sid], delete this.groupIndicesMap[i]
    for (let i = t; i < this.groupCount; ++i) {
      const t = this.groupIndices[i],
        s = t - e.count
      ;(this.groupIndices[i] = s), delete this.groupIndicesMap[t], (this.groupIndicesMap[s] = !0)
    }
    this.contents.splice(e.startIndex, e.count)
  }
  update(t, e) {
    this.contents.update(t, e.clone())
  }
  copy(t, e = !0) {
    return (
      e && this.reset(),
      this.contents.atomic(() => {
        for (const e of t) {
          this.startGroup(e.info)
          for (const t of e) this.push(t)
        }
      }),
      this
    )
  }
  toString() {
    return `Grouper: { groupCount: ${this.groupCount}, length: ${this.length}, groups: [${[...this.groups()].map(t => `${t}`)}]}`
  }
}
export class Group {
  constructor(t, e, i, s, n) {
    ;(this.index = t), (this.grouper = e), (this.startIndex = i), (this.endIndex = s), (this.data = n)
  }
  *[Symbol.iterator]() {
    for (let t = 0; t < this.count; ++t) yield this.get(t)
  }
  get(t) {
    if (!this.has(t)) throw RangeError(`Out of range error ${t} / ${this.count - 1}`)
    return this.grouper.get(this.startIndex + t)
  }
  has(t) {
    return t >= 0 && this.startIndex + t <= this.endIndex
  }
  get count() {
    return this.endIndex - this.startIndex + 1
  }
  get info() {
    return this.data
  }
  get isClosed() {
    const t = this.grouper.get(this.startIndex),
      e = this.grouper.get(this.endIndex)
    return this.count > 2 && t.distanceTo(e) <= K.NZ
  }
  get length() {
    let t = 0,
      e = null
    for (let i = 0; i < this.count; i++) e && (t += this.get(i).distanceTo(e)), (e = this.get(i))
    return t
  }
  get segmentLengths() {
    const t = []
    let e = null
    for (let i = 0; i < this.count; i++) e && t.push(this.get(i).distanceTo(e)), (e = this.get(i))
    return t
  }
  hasLength() {
    const t = this.grouper.get(this.startIndex),
      e = this.grouper.get(this.endIndex)
    return t && e && (this.isClosed || t.distanceTo(e) > K.NZ)
  }
  clone() {
    const t = [],
      e = { get: e => t[e], contents: t }
    for (let t = 0; t < this.count; t++) e.contents.push(this.get(t))
    return new Group(this.index, e, 0, e.contents.length - 1, Object.assign({}, this.data))
  }
  describe(t = this.endIndex) {
    return `GroupSegment${this.index}/${this.startIndex}/${t}}`
  }
  equals(t) {
    if (this.count !== t.count || this.index !== t.index) return !1
    if (deepDiffers(this.info, t.info)) return !1
    for (let e = 0; e < this.count; ++e) if (!this.get(e).equals(t.get(e))) return !1
    return !0
  }
}
enum st {
  ADDED = 0,
  COUNT = 3,
  REMOVED = 1,
  UPDATED = 2
}
enum nt {
  ADDED = 1,
  ALL = 7,
  REMOVED = 2,
  UPDATED = 4
}
const ht = (t, e) => {
  const i = e & nt.ADDED,
    s = e & nt.REMOVED,
    n = e & nt.UPDATED,
    o = {}
  let a
  return new WatchedData(
    () => t,
    e => (a = t.onElementChanged((t => ((o.onAdded = i ? t : void 0), (o.onRemoved = s ? t : void 0), (o.onUpdated = n ? t : void 0), o))(e))),
    t => {
      a && a.cancel()
    }
  )
}
var dt = {
  free: 16777215,
  laser: 16724312,
  white: 16777215,
  x: 16711680,
  xz: 16711935,
  y: 32768,
  yellow: 16776960,
  z: 255
}
class MeasurementLineRenderer {
  constructor(t, e, i, s, n, o, a = () => -1, r, h = 16777215) {
    ;(this.points = t),
      (this.createPointSubscription = e),
      (this.cameraData = i),
      (this.lineModule = s),
      (this.mainLayer = n),
      (this.lineLayer = o),
      (this.selectedGroup = a),
      (this.getLineDetails = r),
      (this.lineColor = h),
      (this.endpointGeometry = getPlaneGeometry()),
      (this.linePool = []),
      (this.groupToLines = {}),
      (this.pointToLines = {}),
      (this.activeLines = []),
      (this.cameraQuaternion = new Quaternion()),
      (this.cameraPosition = new Vector3()),
      (this.cameraProjection = new MatrixBase()),
      (this.getLinesForPoint = t => {
        const e = []
        if (this.pointToLines[t])
          for (const i of this.pointToLines[t]) {
            const t = i.getMesh(LinePart.line),
              { startIndex: s, endIndex: n, group: o } = t.userData
            e.push({ endIndex: n, startIndex: s, line: i, group: o })
          }
        return e
      }),
      this.updateMaterialColors(this.lineColor),
      (this.dataSubs = [
        this.createPointSubscription(nt.REMOVED, (t, e) => {
          this.resetLines()
        })
      ])
  }
  updateMaterialColors(t) {
    const e = defaultLineWidth.lineDefault
    ;(this.lineMaterial = this.lineModule.makeLineMaterial(t, !0, { linewidth: e })),
      this.setStencilState(this.lineMaterial),
      (this.endpointMaterial = this.lineModule.makeEndpointMaterial(t))
    const i = { dashed: !0, dashSize: 0.025, gapSize: 0.05, linewidth: defaultLineWidth.dottedLineDefault }
    ;(this.dottedLineMaterial = this.lineModule.makeLineMaterial(t, !1, i)),
      this.setStencilState(this.dottedLineMaterial),
      (this.xLineMaterial = this.lineModule.makeLineMaterial(dt.x, !1, i)),
      (this.yLineMaterial = this.lineModule.makeLineMaterial(dt.y, !1, i)),
      (this.zLineMaterial = this.lineModule.makeLineMaterial(dt.z, !1, i)),
      (this.xzLineMaterial = this.lineModule.makeLineMaterial(dt.xz, !1, i))
  }
  setStencilState(t) {
    ;(t.stencilRef = 1),
      (t.stencilFail = KeepStencilOp),
      (t.stencilZFail = KeepStencilOp),
      (t.stencilZPass = KeepStencilOp),
      (t.stencilFunc = GreaterStencilFunc),
      (t.stencilWrite = !0)
  }
  setLineOpacityByGroup(t, e) {
    const i = this.groupToLines[t]
    if (i) for (const t of i) t.opacity(e)
  }
  setLineOpacityByPoint(t, e) {
    const i = this.getLinesForPoint(t)
    if (i) for (const t of i) t.line.opacity(e)
  }
  resetLines() {
    for (const t of this.lines) t.opacity(0), t.hide()
    ;(this.groupToLines = {}), (this.pointToLines = {}), (this.lines.length = 0)
  }
  updateAllLines() {
    if (!(this.points.length < 1)) {
      for (let t = 0; t < this.points.length; t++) this.updateLine(t)
      for (const t in this.groupToLines) {
        const e = Number(t),
          i = this.groupToLines[e]
        for (const t of i) t.updateSelected(this.selectedGroup() === e)
      }
    }
  }
  init() {}
  dispose() {
    this.deactivate()
    for (const t of this.linePool) t.dispose()
    this.endpointGeometry.dispose(),
      this.dottedLineMaterial.dispose(),
      this.lineMaterial.dispose(),
      this.endpointMaterial.dispose(),
      this.xLineMaterial.dispose(),
      this.yLineMaterial.dispose(),
      this.zLineMaterial.dispose()
  }
  activate() {
    for (const t of this.dataSubs) t.renew()
  }
  deactivate() {
    for (const t of this.dataSubs) t.cancel()
    this.resetLines()
  }
  get lines() {
    return this.activeLines
  }
  get dottedMaterial() {
    return this.dottedLineMaterial
  }
  beforeRender() {
    this.cameraQuaternion.copy(this.cameraData.pose.rotation),
      this.cameraPosition.copy(this.cameraData.pose.position),
      this.cameraProjection.copy(this.cameraData.pose.projection)
  }
  get xMaterial() {
    return this.xLineMaterial
  }
  get yMaterial() {
    return this.yLineMaterial
  }
  get zMaterial() {
    return this.zLineMaterial
  }
  get xzMaterial() {
    return this.xzLineMaterial
  }
  render() {
    this.updateAllLines()
  }
  updateLine(t) {
    const e = this.points.get(t),
      i = this.points.get(t + 1),
      s = this.points.groupFromPointIndex(t) === this.points.groupFromPointIndex(t + 1)
    e && i && s && this.setLinePosition(t, e, i)
  }
  setLinePosition(t, e, i) {
    let s = this.linePool[t]
    if (!s) {
      const n = this.points.groupFromPointIndex(t)
      if (!this.getLineDetails(n, t, t + 1).visible) return
      const o = defaultLineWidth.endpointDefault > 0.01 ? this.endpointMaterial.clone() : void 0
      ;(s = this.lineModule.makeLine(e, i, this.lineMaterial.clone(), o, () => !isProjectionOrtho(this.cameraProjection))),
        this.setupLine(s, t),
        s.setRenderLayer(this.mainLayer)
    }
    s.visible || this.setupLine(s, t),
      (this.linePool[t] = s),
      s.updateResolution(this.cameraData.width, this.cameraData.height),
      s.updatePositions(e, i),
      s.updateBillboard({ rotation: this.cameraQuaternion, position: this.cameraPosition, projection: this.cameraProjection })
  }
  setupLine(t, e) {
    const i = this.points.groupFromPointIndex(e)
    t.children.forEach(t => {
      ;(t.userData.startIndex = e), (t.userData.endIndex = e + 1), (t.userData.group = i), (t.layers.mask = this.mainLayer.mask)
    }),
      (t.getMesh(LinePart.line).layers.mask = this.lineLayer.mask),
      this.activeLines.push(t),
      this.addLineToGroup(i, t),
      this.addLineToPoint(e, t),
      this.addLineToPoint(e + 1, t),
      t.show(),
      t.opacity(0)
  }
  addLineToGroup(t, e) {
    this.groupToLines[t] || (this.groupToLines[t] = []), this.groupToLines[t].push(e)
  }
  addLineToPoint(t, e) {
    this.pointToLines[t] || (this.pointToLines[t] = []), this.pointToLines[t].push(e)
  }
}
class MeasurementLabelBackgroundMesh extends Mesh {}
class MeasurementLabelRenderer {
  constructor(t, e, i, s, n, o, a, r, h, d, l) {
    ;(this.points = t),
      (this.input = e),
      (this.mobile = i),
      (this.cameraData = s),
      (this.renderLayer = n),
      (this.renderOrder = o),
      (this.textRenderer = a),
      (this.getLineDetails = r),
      (this.changeCursor = h),
      (this.getPhase = d),
      (this.setSelectedLine = l),
      (this.meshPool = []),
      (this.textContainer = new Object3D()),
      (this.textGeometry = new PlaneGeometry(1, 1)),
      (this.tmpMidpoint = new Vector3()),
      (this.tmpCamPos = new Vector3()),
      (this.cameraRotation = new Quaternion()),
      (this.cameraProjection = new MatrixBase()),
      (this.cameraPosition = new Vector3())
    ;(this.inputSubs = [
      this.input.registerMeshHandler(InputClickerEndEvent, Comparator.isType(MeasurementLabelBackgroundMesh), (t, e) => {
        var i, s
        if (this.getPhase() === MeasurePhase.IDLE)
          return (
            this.setSelectedLine(
              null === (s = null === (i = null == e ? void 0 : e.parent) || void 0 === i ? void 0 : i.userData) || void 0 === s ? void 0 : s.groupIndex
            ),
            !0
          )
      })
    ]),
      this.mobile || this.inputSubs.push(...this.registerHoverHandlers()),
      this.deactivate(),
      this.deactivateInteraction()
  }
  registerHoverHandlers() {
    return [
      this.input.registerMeshHandler(HoverMeshEvent, Comparator.isType(MeasurementLabelBackgroundMesh), () => {
        this.getPhase() === MeasurePhase.IDLE && this.changeCursor(CursorStyle.FINGER)
      }),
      this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(MeasurementLabelBackgroundMesh), () => {
        this.changeCursor(CursorStyle.DEFAULT)
      })
    ]
  }
  reset() {
    for (const t of this.meshPool) t && (this.input.unregisterMesh(t.collider), this.textContainer.remove(t))
    this.meshPool = []
  }
  init() {}
  dispose() {
    this.textGeometry.dispose()
  }
  activate() {}
  deactivate() {
    this.reset()
  }
  activateInteraction() {
    for (const t of this.inputSubs) t.renew()
  }
  deactivateInteraction() {
    for (const t of this.inputSubs) t.cancel()
  }
  get container() {
    return this.textContainer
  }
  beforeRender() {
    const t = this.cameraData.pose
    this.cameraRotation.copy(t.rotation), this.cameraPosition.copy(t.position), this.cameraProjection.copy(t.projection)
    const e = isPerspectiveProjection(this.cameraProjection),
      i = isProjectionOrtho(this.cameraProjection),
      s = this.cameraData.height,
      n = this.cameraData.zoom(),
      o = this.cameraData.aspect()
    for (let t = 1; t < this.points.length; ++t) {
      const a = t - 1,
        r = this.points.groupFromPointIndex(t),
        h = this.getLineDetails(r, a, t)
      if (!h || r !== this.points.groupFromPointIndex(a)) {
        this.removeLabelMesh(t)
        continue
      }
      const d = this.points.get(a),
        l = this.points.get(t),
        c = this.setMeshVisible(t, h.labelVisible)
      if (!c) continue
      c.text !== h.labelContents && (c.text = h.labelContents)
      const u = this.cameraPosition.distanceTo(c.position)
      if ((this.updateMeshPose(c, d, l, this.cameraRotation, this.cameraPosition, u, h.rotation, i), i || e)) c.scaleFactor = K.Hn.SCALE_DISTANCE * n
      else {
        const t = transformPoint(c.position, this.cameraPosition, this.cameraRotation, this.cameraProjection.asThreeMatrix4()),
          e = Math.abs(t.x)
        if (e < 1) {
          const t = calculateFieldOfView(this.cameraProjection, this.cameraPosition, c.position, s, K.Hn.SCALE),
            i = (CheckThreshold(o, 1, 2.5) + n) * K.Hn.SCALE_ASPECT,
            a = 1 + K.Hn.SCALE_NDC - e * K.Hn.SCALE_NDC - i
          c.scaleFactor = Math.max(Math.min((1 / t) * a, 3), 0.001)
        } else c.scaleFactor = 0.001
      }
    }
    for (let t = this.points.length; t < this.meshPool.length; t++) this.removeLabelMesh(t)
    this.meshPool = this.meshPool.slice(0, this.points.length)
  }
  setTextOpacityByPoint(t, e) {
    const i = this.meshPool[t]
    i && (i.opacity = e)
  }
  updateMeshPose(t, e, i, s, n, o, a, r) {
    this.tmpMidpoint.copy(e).add(i).multiplyScalar(0.5)
    const h = r
      ? t => this.tmpCamPos.copy(t).addScaledVector(DirectionVector.UP, 0.15)
      : t =>
          this.tmpCamPos
            .copy(n)
            .sub(t)
            .setLength(0.15 * o)
            .add(t)
    t.setPosition(this.tmpMidpoint, h), t.setOrientation(s, a)
  }
  render() {}
  setMeshVisible(t, e) {
    let i = this.meshPool[t]
    if (!i && e) {
      ;(i = this.textRenderer.createLabel()), i.setRenderLayer(this.renderLayer), (i.renderOrder = this.renderOrder), (i.opacity = 1), (i.visible = !1)
      const e = this.points.groupFromPointIndex(t)
      ;(i.userData.groupIndex = e), this.textContainer.add(i), this.input.registerMesh(i.collider, !1), (this.meshPool[t] = i)
    }
    if (i) {
      const t = e ? 0.001 : D.iV.LABEL_HIDDEN_OPACITY
      if (((i.visible = i.opacity > t), !i.visible)) return null
    }
    return i
  }
  removeLabelMesh(t) {
    const e = this.meshPool[t]
    e && (this.textContainer.remove(e), e.dispose(), this.input.unregisterMesh(e.collider), (this.meshPool[t] = null))
  }
}

import St from "../images/scope.svg"
import Et from "../images/vert_arrows.png"
import xt from "../images/surface_grid_planar_256.png"
import GetMeasurements from "../test/GetMeasurements"
class Rt {
  constructor(t, e = RenderLayers.ALL) {
    ;(this.scene = t),
      (this.layer = e),
      (this.supportsMobile = !0),
      (this.style = Mt.L.GridPlane),
      (this.alignToNormal = !0),
      (this.xzTex = LoadTexture(Et)),
      (this.zyTex = LoadTexture(xt)),
      (this.bindings = []),
      (this.onOpacityUpdate = t => {
        this.container.children.forEach(e => {
          e.isMesh && (e.material.opacity = Math.max(0, t.opacity.value))
        })
      }),
      (this.onPositionUpdate = (t, e) => {
        this.container.position.copy(t).addScaledVector(e, 0.005), this.alignToNormal && areVectorsNearlyParallel(this.container, t, e)
      }),
      (this.scale = t => {
        this.container.scale.set(t, t, t)
      }),
      (this.onRaycasterUpdate = t => {
        t.hit && t.hit.face && this.onPositionUpdate(t.hit.point.clone(), t.hit.face.normal)
      }),
      (this.container = new _Group())
    const i = new PlaneGeometry(0.4, 0.4),
      s = { color: 16777215, side: DoubleSide, transparent: !0, depthTest: !0, depthWrite: !1 }
    ;(this.xzTex.generateMipmaps = !1),
      (this.xzTex.minFilter = LinearFilter),
      (this.xzMaterial = new MeshBasicMaterial(Object.assign(Object.assign({}, s), { color: 65280, map: this.xzTex }))),
      (this.xzMaterial.premultipliedAlpha = !1)
    const n = new Mesh(i, this.xzMaterial)
    n.rotateOnAxis(DirectionVector.LEFT, Math.PI / 2),
      (this.zyTex.generateMipmaps = !1),
      (this.zyTex.minFilter = NearestFilter),
      (this.zyMaterial = new MeshBasicMaterial(Object.assign(Object.assign({}, s), { map: this.zyTex }))),
      (this.zyMaterial.premultipliedAlpha = !1)
    const o = new Mesh(i, this.zyMaterial)
    this.container.add(n, o),
      this.container.children.forEach(t => {
        ;(t.renderOrder = PickingPriorityType.reticule), (t.layers.mask = this.layer.mask)
      })
  }
  init() {}
  render() {}
  dispose() {
    this.container.children.forEach(t => {
      if (t.isMesh) {
        t.geometry.dispose()
        const e = t.material
        e.dispose(), e.map && e.map.dispose()
      }
    })
  }
  async activate(t) {
    const e = await t.market.waitForData(CursorData),
      i = await t.market.waitForData(PointerData)
    this.bindings.push(e.onChanged(this.onOpacityUpdate), i.onChanged(this.onRaycasterUpdate)), this.scene.add(this.container)
  }
  deactivate(t) {
    for (const t of this.bindings) t.cancel()
    ;(this.bindings.length = 0), this.scene.remove(this.container)
  }
  setVisible(t) {
    this.container.visible = t
  }
}
class CursorPeekCamera {
  constructor(t, e, i, s, n, o, a) {
    ;(this.mobile = t),
      (this.pointer = e),
      (this.sceneInfo = i),
      (this.renderToTexture = s),
      (this.getLayer = n),
      (this.issueCommand = o),
      (this.editing = !1),
      (this.editingStateChange = !1),
      (this.setOverlay = t => {
        this.issueCommand(new SetMeshOverLayColorCommand({ color: t ? SetMeshOverLayColorCommand.COLOR_DIM : null }))
      }),
      (this.setupCursorRenderCamera = () => {
        const t = new PerspectiveCamera(K.X7.perspective.fov, 1, 0.1, 100)
        t.name = "Cursor Peek Camera"
        const e = RenderLayers.ALL,
          i = ["measurement-mode", "measurement3d"]
        for (const t of i) e.removeLayers(this.getLayer(t))
        ;(t.layers.mask = e.mask), t.updateProjectionMatrix()
        return {
          camera: t,
          update: (e, i, s) => {
            ;(t.fov = e), (t.near = i), (t.far = s), t.updateProjectionMatrix()
          }
        }
      })
    const r = LoadTexture(St),
      h = new Vector2(),
      d = t => {
        const e = this.rttView.height,
          i = this.rttView.width,
          s = this.sceneInfo.cameraData
        let n = e / 2
        const o = -i / 2
        n = t.y < e / 2 + n ? e + n : -n
        const a = t.x + o,
          r = s.height - t.y - n
        return h.set(a, r)
      }
    ;(this.cursorMesh = new Rt(this.sceneInfo.scene, this.getLayer("cursor-mesh"))), this.cursorMesh.setVisible(!1)
    const l = new Vector3(),
      c = new Quaternion(),
      u = new Vector2()
    let p,
      m,
      g = a(),
      f = K.X7.perspective
    this.renderIntersection = (t, e, n) => {
      p || ((m = this.setupCursorRenderCamera()), (p = m.camera), m.update(K.X7.perspective.fov, 0.1, 100)),
        g !== a() && ((f = a() ? K.X7.ortho : K.X7.perspective), this.cursorMesh.scale(f.scale), m.update(f.fov, 0.1, 100), (g = a()))
      const o = this.editingStateChange ? 1 : K.X7.smoothness
      if (e) {
        if ((i.playerCamera.getWorldPosition(l), i.playerCamera.getWorldQuaternion(c), a())) {
          const t = i.cameraData.zoom(),
            s = checkLerpThreshold(t, f.thresholdClose, f.thresholdFar, f.offsetClose, f.offsetFar)
          p.position.copy(e.point).addScaledVector(DirectionVector.UP, s), p.quaternion.copy(c)
        } else {
          const t = checkLerpThreshold(e.distance, f.thresholdClose, f.thresholdFar, f.offsetClose, f.offsetFar),
            i = l.sub(e.point).setLength(t).add(e.point)
          p.position.lerp(i, o), p.lookAt(e.point)
        }
        p.updateMatrixWorld(),
          K.E0 && this.setOverlay(!1),
          s.render(t, i.scene.scene, p),
          K.E0 && this.setOverlay(!0),
          u.lerp(d(n), o),
          s.renderToScreen(t, !1, u, r)
      }
      this.editingStateChange = !1
    }
  }
  init() {}
  dispose() {}
  activate() {
    this.sceneInfo.scene.addChild(ChildIDS.Root, this.cursorMesh.container)
    const t = this.mobile ? K.ox.mobileSize : this.sceneInfo.cameraData.height > K.ox.highResThreshold ? K.ox.desktopSizeHighRes : K.ox.desktopSize
    this.rttView = this.renderToTexture.createRenderTarget2D(t, t, { format: RGBAFormat }, !1)
  }
  setMeasuringPhase(t) {
    const e = this.mobile ? !!X.Pj.mobile[t] : !!X.Pj.desktop[t]
    e !== this.editing && ((this.editingStateChange = !0), (this.editing = e), this.cursorMesh.setVisible(this.editing))
  }
  deactivate() {
    this.sceneInfo.scene.removeChild(ChildIDS.Root, this.cursorMesh.container), this.renderToTexture.disposeRenderTarget2D(this.rttView), (this.editing = !1)
  }
  beforeRender() {
    this.editing &&
      ((this.hit = this.mobile ? this.pointer.lastIntersection : this.pointer.getIntersection()),
      this.hit && this.cursorMesh.onPositionUpdate(this.hit.point, this.hit.normal))
  }
  render() {
    if (this.editing && this.hit) {
      const { screenPosition: t } = getScreenAndNDCPosition(this.sceneInfo.cameraData, this.hit.point)
      this.renderIntersection(this.rttView, this.hit, t)
    }
  }
}
enum Ft {
  AxisAny = 3,
  AxisX = 4,
  AxisY = 5,
  AxisZ = 6,
  LinePoint = 9,
  LineSegment = 10,
  Mesh = 7,
  RoomMesh = 8,
  SnapLine = 2,
  SnapPoint = 1
}
class Nt extends SnapLine3 {
  constructor(t, e, i) {
    super(t, e), (this.featureType = i)
  }
}
class Gt extends SnapLine3 {
  constructor(t, e, i) {
    super(t, e), (this.featureType = i)
  }
}
const _t = {
  [DirectionKey.UP]: Ft.AxisY,
  [DirectionKey.DOWN]: Ft.AxisY,
  [DirectionKey.FORWARD]: Ft.AxisZ,
  [DirectionKey.BACK]: Ft.AxisZ,
  [DirectionKey.LEFT]: Ft.AxisX,
  [DirectionKey.RIGHT]: Ft.AxisX,
  [DirectionKey.HORIZONTAL_PLANE]: Ft.AxisY,
  NONE: void 0
}
enum Ht {
  ModelFeature = 4,
  UserAxis = 1,
  UserLine = 3,
  UserPoint = 2
}
const Ut = {
  [Ft.LinePoint]: Ht.UserPoint,
  [Ft.LineSegment]: Ht.UserLine,
  [Ft.AxisAny]: Ht.UserAxis,
  [Ft.AxisX]: Ht.UserAxis,
  [Ft.AxisY]: Ht.UserAxis,
  [Ft.AxisZ]: Ht.UserAxis,
  [Ft.Mesh]: Ht.ModelFeature,
  [Ft.RoomMesh]: Ht.ModelFeature,
  [Ft.SnapLine]: Ht.ModelFeature,
  [Ft.SnapPoint]: Ht.ModelFeature
}
class jt {
  constructor(t, e, i, s) {
    ;(this.constraint = e),
      (this.meshQuery = i),
      (this.point = new Vector3()),
      (this.normal = new Vector3()),
      zt(t, i) ? this.updateFromIntersection(t, e) : Wt(t, i) && s && this.updateFromSnapIntersection(t, e, s),
      (this.source = t)
  }
  updatePoint(t) {
    return this.point.copy(t), this.source.point.copy(t), this
  }
  updateFromIntersection(t, e) {
    return (this.source = t), this.updateContents(e, t.point, t.face.normal, t.distance, t.object), this
  }
  updateFromSnapIntersection(t, e, i) {
    return (this.source = t), this.updateContents(e, t.point, i, t.distance, t.object), this
  }
  copy({ constraint: t, point: e, normal: i, distance: s, object: n }) {
    this.updateContents(t, e, i, s, n)
  }
  clone() {
    return new jt(this.source, this.constraint, this.meshQuery)
  }
  updateContents(t, e, i, s, n) {
    ;(this.constraint = t), this.point.copy(e), this.normal.copy(i), (this.distance = s), (this.object = n)
    const o = this.meshQuery.roomIdFloorIdFromObject(n)
    o && ((this.roomId = o.roomId || null), (this.floorId = o.floorId)),
      (this.featureType = (t => {
        if (t)
          return "featureType" in t && void 0 !== t.featureType
            ? t.featureType
            : t instanceof Vector3 || t instanceof SnapVector3
              ? Ft.SnapPoint
              : RoomMeshCheck.isRoomMesh(t)
                ? Ft.RoomMesh
                : t instanceof ShowcaseMesh
                  ? Ft.Mesh
                  : t instanceof Line3 || t instanceof SnapLine3
                    ? Ft.SnapLine
                    : void 0
      })(n))
  }
}
const zt = (t, e) => t && "face" in t && void 0 !== t.face && (e.floorIdFromObject(t.object) || t.object.floorId),
  Wt = (t, e) => t && "isLineOctreeIntersection" in t && e.floorIdFromObject(t.object),
  $t = (() => {
    class t extends Object3D {
      constructor(t, e, i, s) {
        super(), (this.floorId = t), (this.roomId = e), (this.meshGroup = i), (this.meshSubGroup = s)
      }
    }
    return (e, i, s, n, o, a, r) => ({ point: e, object: new t(n, o, a, r), face: { a: 0, b: 1, c: 2, normal: i, materialIndex: 0 }, distance: s })
  })()
class Kt extends Mesh {
  constructor(t, e, i, s, n, o, a, r, h, d, l, c) {
    super(),
      (this.pointGroups = t),
      (this.input = e),
      (this.cameraData = i),
      (this.mobile = s),
      (this.changeCursor = n),
      (this.getPhase = o),
      (this.changePhase = a),
      (this.restorePreviousPhase = r),
      (this.setSelectedLine = h),
      (this.getSelected = d),
      (this.onDragStart = l),
      (this.onDragEnd = c),
      (this.inputSubscriptions = []),
      (this.groupVisible = []),
      (this.raycast = (() => {
        const t = new Vector3(),
          e = new Vector3(),
          i = new Vector3(),
          s = (t, e, i) => {
            if (t.isOrtho()) return i.copy(e)
            {
              const s = D.iV.OFFSET_TOWARDS_CAMERA
              return i.copy(t.position).sub(e).setLength(s).add(e)
            }
          }
        return (n, o) => {
          const { pose: a, width: r } = this.cameraData,
            h = this.mobile ? 3 : -2,
            d = defaultLineWidth.lineDefault + h,
            l = a.projection.asThreeMatrix4(),
            c = a.position
          let u,
            p = 0,
            m = 0
          for (let o = 0; o < this.pointGroups.groupCount; ++o) {
            const h = this.pointGroups.getGroup(o)
            if (!(void 0 !== this.editingGroup && this.editingGroup !== o) && this.groupVisible[o]) {
              for (let g = 0; g < h.count - 1; ++g) {
                const f = s(a, h.get(g), e),
                  v = s(a, h.get(g + 1), i)
                if (f && v) {
                  const e = n.ray.distanceSqToSegment(f, v, void 0, t),
                    i = c.distanceTo(t)
                  let s = calculateWorldUnitsFromScreenWidth(i, l, r) * d
                  if (((s *= s), e < s)) {
                    let i,
                      a = t
                    this.editingPointIndex
                      ? (i = this.editingPointIndex)
                      : f.distanceToSquared(t) < 2 * s
                        ? ((i = m), (a = f))
                        : v.distanceToSquared(t) < 2 * s && ((i = m + 1), (a = v)),
                      (!u || e < p) && ((u = { distance: n.ray.origin.distanceTo(a), point: a, object: this, instanceId: o, index: i }), (p = e))
                  }
                }
                m++
              }
              m++
            } else m += h.count
          }
          u && o.push(u)
        }
      })()),
      this.inputSubscriptions.push(...this.registerCommonInput()),
      s || this.inputSubscriptions.push(...this.registerHoverInput()),
      this.deactivate()
  }
  activate() {
    this.input.registerMesh(this, !1), this.inputSubscriptions.forEach(t => t.renew())
  }
  deactivate() {
    this.input.unregisterMesh(this), this.inputSubscriptions.forEach(t => t.cancel())
  }
  dispose() {
    this.deactivate()
  }
  setEditingGroup(t) {
    this.editingGroup = t
  }
  setGroupVisible(t, e) {
    this.groupVisible[t] = e
  }
  validJoint(t) {
    return !!t && void 0 !== t.index
  }
  registerHoverInput() {
    return [
      this.input.registerMeshHandler(HoverMeshEvent, Comparator.isType(Kt), (t, e, i) => {
        this.getPhase() === MeasurePhase.IDLE && this.changeCursor(i && void 0 !== i.index ? CursorStyle.GRAB : CursorStyle.FINGER)
      }),
      this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(Kt), (t, e, i) => {
        this.getPhase() === MeasurePhase.IDLE && this.changeCursor(CursorStyle.DEFAULT)
      })
    ]
  }
  registerCommonInput() {
    return [
      this.input.registerMeshHandler(InputClickerEndEvent, Comparator.isType(Kt), (t, e, i) => {
        if (!(0, Qt._)(t)) return !1
        if (this.getPhase() !== MeasurePhase.IDLE) return !1
        const s = i && void 0 !== i.instanceId ? i.instanceId : -1,
          n = this.getSelected() === s ? -1 : s
        return this.setSelectedLine(n), !0
      }),
      this.input.registerMeshHandler(
        DraggerMoveEvent,
        Comparator.isType(Kt),
        (t, e, i) =>
          !!(0, Qt._)(t) &&
          !!X.WN[this.getPhase()] &&
          (!this.validJoint(i) ||
            !i ||
            void 0 === i.instanceId ||
            (this.getPhase() === MeasurePhase.EDITING ||
              ((this.editingPointIndex = i.index),
              this.onDragStart(i.instanceId),
              this.setSelectedLine(i.instanceId),
              this.changePhase(MeasurePhase.EDITING),
              this.mobile || this.changeCursor(CursorStyle.GRABBING)),
            !0))
      ),
      this.input.registerMeshHandler(
        DraggerStopEvent,
        Comparator.isType(Kt),
        (t, e, i) =>
          this.getPhase() === MeasurePhase.EDITING &&
          ((this.editingPointIndex = void 0), this.restorePreviousPhase(), this.onDragEnd(), this.mobile || this.changeCursor(CursorStyle.DEFAULT), !0)
      )
    ]
  }
}
const Jt = new DebugInfo("snapping")
class te {
  constructor(t, e, i, s, n, o, a) {
    ;(this.raycaster = t),
      (this.getConstraintStyle = e),
      (this.floorsViewData = s),
      (this.viewmodeData = n),
      (this.meshQuery = o),
      (this.cameraPoseData = a),
      (this.origin = null),
      (this.planeNormal = new Vector3()),
      (this.plane = new Plane()),
      (this.ray = new Ray()),
      (this.originChangedListeners = []),
      (this.registeredSnapFeatures = { [Ht.UserAxis]: [], [Ht.UserLine]: [], [Ht.UserPoint]: [], [Ht.ModelFeature]: [] }),
      (this.clearOrigin = () => {
        ;(this.origin = null), this.originChangedListeners.forEach(t => t(null))
      }),
      (this.setOrigin = (t, e = !1) => {
        ;(this.origin && !e) ||
          ((this.origin = t),
          this.plane.setFromNormalAndCoplanarPoint(this.origin.normal, this.origin.point),
          this.originChangedListeners.forEach(t => t(this.origin)),
          Jt.debug("Updating origin", this.origin, { forceUpdate: e }))
      }),
      (this.setOriginFromPointer = t => {
        if (this.origin) return
        const e = this.getMeshIntersection()
        if (!e) return
        const i = new jt(e, this.getConstraintStyle(), this.meshQuery)
        t && i.updatePoint(t), this.setOrigin(i, !0)
      }),
      (this.snapFeatures = t => this.registeredSnapFeatures[t].reduce((t, e) => t.concat(e.features), [])),
      (this.addSnapFeatures = (t, e, i) => {
        const s = Ut[e]
        this.registeredSnapFeatures[s].push({ owner: t, features: i }), Jt.debug(`Adding ${i.length} snap feature groups`, Ft[e], e)
      }),
      (this.removeSnapFeatures = (t, e) => {
        const i = Ut[e],
          s = this.registeredSnapFeatures[i].findIndex(e => e.owner === t)
        if (-1 !== s) {
          const t = this.registeredSnapFeatures[i].splice(s, 1)
          Jt.debug(`Removing ${t.length} snap feature groups`, Ft[e], e)
        } else Jt.debug(`removeTemporarySnapFeature: ${e} ${Ft[e]} not found from`, t, this.registeredSnapFeatures)
      }),
      (this.filters = {
        nop: t => !0,
        isNotMeasurementInput: t => !(t instanceof Kt),
        meshVisible: t => !!isVisibleShowcaseMesh(t) && (!this.viewmodeData.isDollhouse() || this.floorsViewData.isCurrentMeshGroupOrAllFloors(t.meshGroup)),
        visibleFloor: t => {
          const e = t.object
          return !e || !e.meta || null == e.meta.meshGroup || this.floorsViewData.isCurrentMeshGroupOrAllFloors(e.meta.meshGroup)
        },
        userPoints: t => {
          if (void 0 === t.object) return !1
          if ((e = t.object) && e instanceof Vector3) for (const e of this.snapFeatures(Ht.UserPoint)) if (e.equals(t.object)) return !0
          var e
          return !1
        },
        userLines: t => {
          if (void 0 === t.object) return !1
          if (
            ((e = t.object) && "isSnapAxisLine3" in e) ||
            "isSnapUserLine3" in e ||
            "isSnapLine3" in e ||
            ("start" in e && "end" in e && "closestPointToPoint" in e)
          ) {
            for (const e of this.snapFeatures(Ht.UserLine)) if (e.equals(t.object)) return !0
            for (const e of this.snapFeatures(Ht.UserAxis)) if (e.equals(t.object)) return !0
          }
          var e
          return !1
        },
        userFeatures: t => this.filters.userPoints(t) || this.filters.userLines(t)
      }),
      (this.meshSnapRadius = i ? K.Oq.mobile : K.Oq.desktop)
  }
  preload() {
    this.raycaster.snapping.preloadMeshSnapping()
  }
  getMeshIntersection(t) {
    let e = []
    const i = this.viewmodeData.isFloorplan() || (this.viewmodeData.isDollhouse() && this.cameraPoseData.pitchFactor() < 0.01)
    if (t && t.origin && t.normal) e = this.raycaster.picking.cast(t.origin, t.normal, this.filters.meshVisible)
    else if (i) {
      const t = this.floorsViewData.getHighestVisibleFloor(),
        i = new Vector3(0, 1, 0),
        s = new Plane().setFromNormalAndCoplanarPoint(i, new Vector3(0, t.boundingBox.max.y, 0)),
        n = new Vector3()
      if (this.raycaster.pointer.pointerRay.intersectPlane(s, n)) {
        const s = this.raycaster.pointer.pointerRay.origin.distanceTo(n)
        e = [$t(n, i, s, t.id, null, t.meshGroup, null)]
      }
    } else e = this.raycaster.pointer.cast(this.filters.meshVisible)
    const s = e[0]
    return zt(s, this.meshQuery) ? s : null
  }
  getIntersection(t) {
    const e = this.getMeshIntersection(t)
    if (!e) return null
    this.cachedHit || (this.cachedHit = new jt(e, this.getConstraintStyle(), this.meshQuery))
    const i = this.cachedHit.updateFromIntersection(e, this.getConstraintStyle()),
      s = this.raycaster.pointer.pointerRay
    this.ray.set(s.origin, s.direction), this.planeNormal.copy(i.normal)
    switch (this.getConstraintStyle()) {
      case ConstraintMode.Free:
        return i
      case ConstraintMode.Axes:
        return this.lockToWorldAxes(i)
      case ConstraintMode.PlanarAxes:
        const t = [...this.snapFeatures(Ht.UserAxis), ...this.snapFeatures(Ht.UserLine), ...this.snapFeatures(Ht.UserPoint)]
        return this.softSnapToEdges(i, t, this.filters.userFeatures)
      case ConstraintMode.Edges:
        const e = [...this.snapFeatures(Ht.UserLine), ...this.snapFeatures(Ht.UserPoint)]
        return this.softSnapToEdges(i, e, this.filters.visibleFloor)
      case ConstraintMode.EdgesAndPlanarAxes:
        const s = [...this.snapFeatures(Ht.UserAxis), ...this.snapFeatures(Ht.UserLine), ...this.snapFeatures(Ht.UserPoint)]
        return this.softSnapToEdges(i, s, this.filters.visibleFloor)
    }
    return i
  }
  get lastIntersection() {
    return this.cachedHit
  }
  onOriginChanged(t, e = !1) {
    const i = {
      renew: () => {
        this.originChangedListeners.push(t)
      },
      cancel: () => {
        delArrayItem(this.originChangedListeners, t)
      }
    }
    return e && i.renew(), i
  }
  lockToWorldAxes(t) {
    if (this.origin) {
      const e = calculateConstrainedPosition(this.origin.point, t.point, ConstraintMode.Axes)
      return (
        this.cachedHit.copy(t),
        this.cachedHit.point.copy(e.position),
        (this.cachedHit.constraint = "NONE" !== e.axisName ? ConstraintMode.Axes : ConstraintMode.Free),
        (this.cachedHit.featureType = _t[e.axisName]),
        this.cachedHit
      )
    }
    return t
  }
  softSnapToEdges(t, e, i) {
    const s = this.origin ? this.origin.point : t.point,
      n = this.origin ? this.origin.normal : t.normal
    this.raycaster.snapping.add(...e)
    const o = this.raycaster.snapping.cast(this.ray, this.meshSnapRadius, s, n).filter(i),
      a = this.findClosestVisible(o)
    return this.raycaster.snapping.remove(...e), a ? (this.cachedHit.updateFromSnapIntersection(a, this.getConstraintStyle(), n), this.cachedHit) : t
  }
  findClosestVisible(t) {
    let e = null
    const i = new Vector3()
    for (const s of t) {
      i.copy(s.point).sub(this.ray.origin).normalize()
      const t = this.raycaster.picking.pick(this.ray.origin, i, this.filters.meshVisible)
      if (!t || t.distance > s.distance - 0.05) {
        e = s
        break
      }
    }
    return e ? { isLineOctreeIntersection: !0, distance: e.distance, distanceToRay: e.distanceToRay, point: e.point, object: e.object } : null
  }
}
class ie {
  constructor(t, e, i, s) {
    ;(this.points = t),
      (this.createPointSubscription = e),
      (this.pointer = i),
      (this.mobileCreateHackJob = s),
      (this.subscriptions = []),
      (this.lineSegments = []),
      (this.updateSnapping = t => {
        this.lineSegments.length > 0 && (this.pointer.removeSnapFeatures(this, Ft.LineSegment), (this.lineSegments.length = 0))
        for (let e = 0; e < this.points.length; e++)
          if (e !== t && e !== t - 1 && e !== t + 1 && !this.points.isStartIndex(e)) {
            const t = this.points.get(e),
              i = this.points.get(e - 1)
            this.lineSegments.push(new Gt(i, t, Ft.LineSegment))
          }
        this.lineSegments.length > 0 && this.pointer.addSnapFeatures(this, Ft.LineSegment, this.lineSegments)
      })
  }
  init() {}
  dispose() {}
  activate(t) {
    let e = -1,
      i = -1
    const s = (0, ee.D)(() => this.updateSnapping(this.points.length), 16)
    this.subscriptions.push(
      this.createPointSubscription(nt.ADDED, s, !0),
      this.createPointSubscription(nt.REMOVED, s, !0),
      this.createPointSubscription(
        nt.UPDATED,
        (t, s) => {
          s === e || (this.mobileCreateHackJob() && s === i) || (this.updateSnapping(s), (i = e), (e = s))
        },
        !0
      )
    )
  }
  deactivate() {
    this.subscriptions.forEach(t => t.cancel()),
      (this.subscriptions.length = 0),
      this.pointer.removeSnapFeatures(this, Ft.LinePoint),
      this.pointer.removeSnapFeatures(this, Ft.LineSegment)
  }
  beforeRender() {}
  render() {}
}
class ne {
  constructor(t, e, i, s, n, o) {
    ;(this.points = t),
      (this.pointer = i),
      (this.getPhase = s),
      (this.onDrag = n),
      (this.onDragEnd = o),
      (this.inputSubscriptions = []),
      (this.dragging = !1),
      (this.onDragBegin = (t, e, i) => {
        if (!X.q8[this.getPhase()]) return !1
        if (!i || void 0 === i.index) return !1
        this.dragging = !0
        const s = this.points.isStartIndex(i.index) ? i.index + 1 : i.index - 1,
          n = this.points.get(s)
        return this.pointer.clearOrigin(), this.pointer.setOriginFromPointer(n), !0
      }),
      (this.onDragEndEvent = () => !!X.q8[this.getPhase()] && !!this.dragging && (this.onDragEnd(), this.pointer.clearOrigin(), (this.dragging = !1), !0)),
      (this.onDragEvent = (t, e, i) => {
        if (t.buttons !== MouseKeyCode.PRIMARY) return !1
        if (!X.q8[this.getPhase()]) return !1
        if (!i || void 0 === i.index || void 0 === i.instanceId) return !1
        const s = this.pointer.getIntersection()
        return s && this.points.update(i.index, s.point), this.onDrag(i.instanceId), !0
      }),
      this.inputSubscriptions.push(
        e.registerMeshHandler(DraggerStartEvent, Comparator.isType(Kt), this.onDragBegin),
        e.registerMeshHandler(DraggerMoveEvent, Comparator.isType(Kt), this.onDragEvent),
        e.registerMeshHandler(DraggerStopEvent, Comparator.isType(Kt), this.onDragEndEvent)
      ),
      this.deactivate()
  }
  activate() {
    for (const t of this.inputSubscriptions) t.renew()
  }
  deactivate() {
    for (const t of this.inputSubscriptions) t.cancel()
  }
}
class ae {
  constructor(t, e, i, s, n, o, a) {
    ;(this.lines = t),
      (this.getLinesForPoint = e),
      (this.editingMaterial = i),
      (this.createPointSubscription = s),
      (this.getPhase = o),
      (this.getSelected = a),
      (this.bindings = []),
      (this.onDragEnd = t => {
        for (const t of this.lines) t.restoreLineMaterial()
      }),
      (this.onClick = (t, e, i) => {
        if (this.getPhase() !== MeasurePhase.IDLE) return !1
        for (const t of this.lines) t.restoreLineMaterial()
        if (!i || void 0 === i.index) return !1
        if (t.down) {
          const t = i.index
          void 0 !== t && this.styleLines(t)
        }
        return !1
      }),
      (this.styleLines = t => {
        const e = this.getLinesForPoint(t)
        for (const t of e) t.group === this.getSelected() && t.line.overrideLineMaterial(this.editingMaterial)
      }),
      this.bindings.push(
        n.registerMeshHandler(OnMouseDownEvent, Comparator.isType(Kt), this.onClick),
        n.registerUnfilteredHandler(DraggerStopEvent, this.onDragEnd),
        ...this.setupLineStyler(this.createPointSubscription)
      ),
      this.deactivate()
  }
  activate() {
    for (const t of this.bindings) t.renew()
  }
  deactivate() {
    for (const t of this.bindings) t.cancel()
  }
  setupLineStyler(t) {
    return [
      t(
        nt.ADDED,
        () => {
          const t = this.lines[this.lines.length - 1]
          t && t.restoreLineMaterial()
        },
        !0
      ),
      t(
        nt.UPDATED,
        (t, e) => {
          this.styleLines(e)
        },
        !0
      )
    ]
  }
}
class de {
  constructor(t, e, i, s, n, o, a, r, h, d) {
    ;(this.points = t),
      (this.setSelected = e),
      (this.pointer = i),
      (this.changePhase = s),
      (this.getPhase = n),
      (this.isFloorplan = o),
      (this.currentFloorId = a),
      (this.currentRoomId = r),
      (this.currentLayerId = h),
      (this.inferRoomAssociation = d),
      (this.id = de),
      (this.onGroupCreated = t => null),
      (this.onGroupAddPoint = () => null),
      (this.onDone = () => null),
      (this.onEdit = t => null),
      (this.previousPhase = MeasurePhase.IDLE),
      (this.currentLinePoints = 0),
      (this.previousPoint = new Vector3()),
      (this.inputSubscriptions = []),
      (this.log = new DebugInfo("measurement-creator")),
      (this.isReadonly = !1),
      (this.createNewLine = t => {
        const e = this.inferRoomAssociation(t),
          i = t.roomId || e.roomId || this.currentRoomId() || void 0,
          s = t.floorId || e.floorId || this.currentFloorId()
        if ((this.log.debug(`Starting measurement: floorId="${s}" roomId="${i}"`), !s))
          throw new InvalidFloorExceptionError(`Cannot create new line on invalid floor '${s}'`)
        const n = {
            visible: !0,
            roomId: i,
            floorId: s,
            type: this.isFloorplan() ? y.T.FloorplanOnly : y.T.ThreeD,
            text: "",
            created: new Date(),
            modified: new Date(),
            temporary: this.isReadonly,
            layerId: this.currentLayerId()
          },
          o = this.points.startGroup(n)
        ;(this.currentGroup = o), this.points.push(t.point), (this.currentLinePoints = 1), this.setSelected(o)
        const a = this.points.getGroup(o)
        this.onGroupCreated(a.info.sid), this.pointer.setOrigin(t, !0)
      }),
      (this.addPointToLine = t => {
        this.previousPoint.copy(t.point), this.points.push(t.point), ++this.currentLinePoints, this.onGroupAddPoint(), this.pointer.setOrigin(t, !0)
      }),
      (this.updateLastPoint = t => {
        this.points.update(this.points.length - 1, t.point)
      }),
      (this.getIntersection = () => this.pointer.getIntersection()),
      (this.setPhase = t => {
        const e = this.getPhase()
        t !== e && ((this.previousPhase = e), this.changePhase(t))
      }),
      (this.restorePreviousPhase = () => {
        this.setPhase(this.previousPhase)
      })
  }
  start() {
    if (this.getPhase() === MeasurePhase.IDLE) {
      this.previousPoint.set(1e3, 1e3, 1e3), this.setPhase(MeasurePhase.CREATING), this.setSelected(-1)
      for (const t of this.inputSubscriptions) t.renew()
    }
  }
  cancelSubs() {
    for (const t of this.inputSubscriptions) t.cancel()
  }
  stop() {
    this.cancelSubs(), (this.currentLinePoints = 0), this.setSelected(-1), this.setPhase(MeasurePhase.IDLE), this.pointer.clearOrigin(), this.onDone()
  }
  syncReadonly(t) {
    this.isReadonly = t
  }
}
class le extends de {
  constructor(t, e, i, s, n, o, a, r, h, d, l, c, u, p, m) {
    super(t, e, s, n, h, l, c, u, p, m),
      (this.setCreatePointProgress = o),
      (this.updateCreatePointHit = a),
      (this.toggleCameraMovement = r),
      (this.continuous = d),
      (this.onLongPressSuccess = t => {
        this.log.debug("onLongPressSuccess while in phase:", MeasurePhase[this.getPhase()]),
          this.getPhase() === MeasurePhase.CREATING
            ? (this.createNewLine(t), this.addPointToLine(t))
            : this.getPhase() === MeasurePhase.CREATING_NEXT_POINT &&
              (this.continuous() ? (this.updateLastPoint(t), this.addPointToLine(t)) : this.updateLastPoint(t)),
          this.setPhase(MeasurePhase.POINT_PLACED)
      }),
      (this.onLongPressStart = t => {
        if (t.buttons === MouseKeyCode.PRIMARY && (this.getPhase() === MeasurePhase.CREATING || this.getPhase() === MeasurePhase.CREATING_NEXT_POINT)) {
          const t = this.getIntersection()
          t &&
            (this.previousPoint.equals(t.point) ||
              (this.setPhase(MeasurePhase.CONFIRMING_POINT),
              this.toggleCameraMovement(!1),
              this.setCreatePointProgress(Date.now(), le.longPressCreateThreshold),
              this.updateCreatePointHit(t),
              this.previousPhase === MeasurePhase.CREATING_NEXT_POINT && (this.updateLastPoint(t), this.toggleLastPointDraggable(!1)),
              (this.creatingPointTimeout = window.setTimeout(() => {
                this.restorePreviousPhase(), this.onLongPressSuccess(t), this.toggleLastPointDraggable(!0)
              }, le.longPressCreateThreshold))))
        }
      }),
      (this.onLongPressEnd = () => {
        this.getPhase() === MeasurePhase.CONFIRMING_POINT &&
          (this.log.debug("onLongPressEnd, cancelling confirmation"),
          this.setCreatePointProgress(0, le.longPressCreateThreshold),
          window.clearTimeout(this.creatingPointTimeout),
          this.toggleCameraMovement(!0),
          this.restorePreviousPhase()),
          this.getPhase() === MeasurePhase.CREATING_NEXT_POINT && this.points.update(this.points.length - 1, this.points.get(this.points.length - 2)),
          this.setPlacedtoCreatePhase()
      }),
      (this.onDrag = () => {
        const t = this.getIntersection()
        t &&
          (this.setPlacedtoCreatePhase(),
          this.setPhase(MeasurePhase.EDITING),
          this.previousPhase === MeasurePhase.CREATING_NEXT_POINT
            ? this.updateLastTwoPoints(t)
            : this.previousPhase === MeasurePhase.CREATING && this.updateLastPoint(t))
      }),
      (this.onDragEnd = () => {
        this.getPhase() === MeasurePhase.EDITING && this.restorePreviousPhase(),
          (this.getPhase() !== MeasurePhase.CREATING && this.getPhase() !== MeasurePhase.CREATING_NEXT_POINT) ||
            (this.toggleLastPointDraggable(!1), this.toggleCameraMovement(!0))
      }),
      (this.toggleLastPointDraggable = t => {
        t ? (this.dragSub.renew(), this.dragEndSub.renew()) : (this.dragSub.cancel(), this.dragEndSub.cancel())
      }),
      (this.updateLastTwoPoints = t => {
        this.points.update(this.points.length - 1, t.point), this.points.update(this.points.length - 2, t.point)
      }),
      (this.dragSub = i(DraggerMoveEvent, this.onDrag)),
      (this.dragEndSub = i(DraggerStopEvent, this.onDragEnd)),
      this.inputSubscriptions.push(
        i(LongPressStartEvent, this.onLongPressStart),
        i(LongPressEndEvent, this.onLongPressEnd),
        i(DoubleClickerStopEvent, t => t.preventDefault())
      ),
      this.dragSub.cancel(),
      this.dragEndSub.cancel(),
      this.cancelSubs()
  }
  start() {
    super.start()
  }
  stop() {
    if (this.getPhase() === MeasurePhase.CREATING_NEXT_POINT)
      if (this.continuous()) this.points.pop()
      else {
        const t = this.points.getGroup(this.currentGroup)
        this.points.removeFromIdx(t.startIndex)
      }
    super.stop()
  }
  setPlacedtoCreatePhase() {
    this.getPhase() === MeasurePhase.POINT_PLACED &&
      (this.continuous()
        ? (this.previousPhase === MeasurePhase.CREATING || this.previousPhase === MeasurePhase.CREATING_NEXT_POINT) &&
          this.setPhase(MeasurePhase.CREATING_NEXT_POINT)
        : this.previousPhase === MeasurePhase.CREATING
          ? this.setPhase(MeasurePhase.CREATING_NEXT_POINT)
          : this.previousPhase === MeasurePhase.CREATING_NEXT_POINT && this.setPhase(MeasurePhase.CREATING))
  }
}
le.longPressCreateThreshold = 500
class ce extends de {
  constructor(t, e, i, s, n, o, a, r, h, d, l, c, u) {
    super(t, e, s, n, o, a, r, h, d, c),
      (this.continuous = l),
      (this.meshQuery = u),
      (this.onCreate = t => {
        const e = this.previousPoint.distanceTo(t.point) > K.yV
        if (this.getPhase() === MeasurePhase.CREATING)
          return this.createNewLine(t), this.addPointToLine(t), void this.setPhase(MeasurePhase.CREATING_NEXT_POINT)
        e &&
          this.getPhase() === MeasurePhase.CREATING_NEXT_POINT &&
          (this.continuous() ? (this.updateLastPoint(t), this.addPointToLine(t)) : this.finishLine(t))
      }),
      (this.onMouseMove = () => {
        if (this.getPhase() === MeasurePhase.CREATING_NEXT_POINT) {
          const t = this.getIntersection()
          t && this.updateLastPoint(t)
        }
      }),
      (this.onMouseClick = t => {
        if (t.button !== MouseKeyIndex.PRIMARY || this.getPhase() === MeasurePhase.IDLE) return
        const e = this.getIntersection()
        e && this.onCreate(e)
      }),
      (this.onDoubleClick = t => {
        if ((t.preventDefault(), t.button !== MouseKeyIndex.PRIMARY || this.getPhase() === MeasurePhase.IDLE)) return
        const e = this.getIntersection()
        if (e && 2 === this.currentLinePoints) {
          const t = { origin: e.point.addScaledVector(e.normal, 0.05), normal: e.normal },
            i = this.pointer.getMeshIntersection(t)
          if (i)
            if (this.continuous()) {
              this.points.pop()
              const t = new jt(i, ConstraintMode.Free, this.meshQuery)
              this.addPointToLine(t), this.addPointToLine(t), this.setPhase(MeasurePhase.CREATING_NEXT_POINT)
            } else this.finishLine(new jt(i, ConstraintMode.Free, this.meshQuery))
        }
      }),
      this.inputSubscriptions.push(i(OnMoveEvent, this.onMouseMove), i(InputClickerEndEvent, this.onMouseClick), i(DoubleClickerStopEvent, this.onDoubleClick)),
      this.cancelSubs()
  }
  start() {
    super.start()
  }
  stop() {
    this.getPhase() === MeasurePhase.CREATING_NEXT_POINT && (this.points.pop(), this.currentLinePoints < 3 && this.points.pop()), super.stop()
  }
  finishLine(t) {
    this.points.pop(), this.addPointToLine(t), this.setPhase(MeasurePhase.CREATING), this.onDone()
  }
}
class be {
  constructor(t, e, i, s, n) {
    ;(this.pointer = t),
      (this.mobile = e),
      (this.getPhase = i),
      (this.scene = s),
      (this.getLayer = n),
      (this.subscriptions = []),
      (this.editing = !1),
      (this.axisLines = []),
      (this.axisAlignmentHelper = new Object3D()),
      (this.updateSnapping = t => {
        if ((this.axisLines.length > 0 && (this.pointer.removeSnapFeatures(this, Ft.AxisAny), (this.axisLines.length = 0)), t)) {
          this.axisAlignmentHelper.position.copy(t.point)
          const e = areVectorsNearlyParallel(this.axisAlignmentHelper, t.point, t.normal)
          this.axisAlignmentHelper.updateMatrixWorld(!0)
          const i = this.axisAlignmentHelper.matrixWorld,
            s = 100,
            n = (t, e, i, n) => {
              const o = new Nt(t.clone().multiplyScalar(s), e.clone().multiplyScalar(s), n)
              return o.applyMatrix4(i), o
            },
            o = new Matrix4().copyPosition(i)
          this.axisLines.push(n(DirectionVector.UP, DirectionVector.DOWN, o, Ft.AxisY)),
            e ||
              this.axisLines.push(
                n(DirectionVector.FORWARD, DirectionVector.BACK, i, Ft.AxisY),
                n(DirectionVector.UP, DirectionVector.DOWN, i, Ft.AxisX),
                n(DirectionVector.LEFT, DirectionVector.RIGHT, i, Ft.AxisZ)
              ),
            this.axisLines.length > 0 && this.pointer.addSnapFeatures(this, Ft.AxisAny, this.axisLines)
        }
      })
  }
  init() {}
  dispose() {}
  activate() {
    this.subscriptions.push(this.pointer.onOriginChanged(this.updateSnapping, !0)), (this.axisLineRenderer = new De(this.scene, this.getLayer("cursor-mesh")))
  }
  deactivate() {
    this.subscriptions.forEach(t => t.cancel()),
      (this.subscriptions.length = 0),
      this.pointer.removeSnapFeatures(this, Ft.AxisAny),
      this.axisLineRenderer.dispose(),
      (this.axisLineRenderer = null)
  }
  beforeRender() {
    const t = this.getPhase(),
      e = this.mobile ? !!X.Pj.mobile[t] : !!X.Pj.desktop[t]
    e !== this.editing && ((this.editing = e), this.axisLineRenderer.clearLines())
  }
  render() {
    this.editing && this.axisLineRenderer.render(this.pointer.lastIntersection, this.axisLines)
  }
}
class De {
  constructor(t, e) {
    ;(this.scene = t),
      (this.layer = e),
      (this.offsetFromMesh = 0.0075),
      (this.featureColors = { [Ft.AxisX]: dt.x, [Ft.AxisZ]: dt.z, [Ft.AxisY]: dt.y }),
      (this.axesVisibleInConstraints = { [ConstraintMode.EdgesAndPlanarAxes]: !0, [ConstraintMode.Axes]: !0, [ConstraintMode.PlanarAxes]: !0 }),
      (this.linesActive = []),
      (this.linesFree = []),
      (this.axesVisible = []),
      (this.axisMat = new LineBasicMaterial({ color: 4095, linewidth: 1, opacity: 0.75, transparent: !0, depthWrite: !1, depthTest: !0 })),
      (this.render = (t, e) => {
        if (t && this.axesVisibleInConstraints[t.constraint] && e.length > 0) {
          if (e.length !== this.axesVisible.length) this.clearLines()
          else {
            this.axesVisible.every((t, i) => t.equals(e[i])) || this.clearLines()
          }
          if (this.container.parent !== this.scene.scene) {
            for (const t of e) {
              const e = this.getMesh(t)
              e.material.color.setHex(this.featureColors[t.featureType]), this.container.add(e), this.linesActive.push(e)
            }
            ;(this.axesVisible = e.map(t => t)),
              this.scene.addChild(ChildIDS.Root, this.container),
              this.container.position.copy(t.normal).multiplyScalar(this.offsetFromMesh),
              this.container.updateMatrixWorld(!0)
          }
        } else this.clearLines()
      }),
      (this.clearLines = () => {
        if (0 !== this.linesActive.length) {
          for (; this.linesActive.length > 0; ) {
            const t = this.linesActive.pop()
            t && (this.container.remove(t), this.linesFree.push(t))
          }
          this.scene.removeChild(ChildIDS.Root, this.container)
        }
      }),
      (this.container = new Object3D())
  }
  getMesh(t) {
    let e = this.linesFree.pop()
    return e ? e.geometry.setFromPoints([t.start, t.end]) : ((e = new Se(t, this.axisMat.clone())), (e.layers.mask = this.layer.mask)), e
  }
  dispose() {
    for (this.clearLines(); this.linesFree.length > 0; ) {
      const t = this.linesFree.pop()
      t && (this.container.remove(t), t.geometry.dispose(), t.material.dispose())
    }
    ;(this.linesActive = []), (this.linesFree = []), (this.container = null)
  }
}
class Se extends Line {
  constructor(t, e) {
    super(void 0, e), (this.material = e), (this.geometry = new BufferGeometry().setFromPoints([t.start, t.end]))
  }
}
const Ae = { [y.T.FloorplanOnly]: lineType.LINETYPE_2D, [y.T.ThreeD]: lineType.LINETYPE_3D },
  Oe = { [lineType.LINETYPE_2D]: y.T.FloorplanOnly, [lineType.LINETYPE_3D]: y.T.ThreeD }
class Fe {
  serialize(t, e) {
    if (!t) return null
    const i = [],
      { text: s, visible: n, type: o, floorId: a, roomId: h, layerId: d } = t.info
    for (const e of t) {
      const t = { position: VisionParase.toVisionVector(e) }
      a && (t.floorId = a), h && (t.roomId = h), i.push(t)
    }
    const l = { enabled: n, label: s, version: "3.2", lineType: Ae[o] || lineType.LINETYPE_3D, points: i }
    return e && (l.layerId = d), this.validate(l) ? l : null
  }
  validate(t) {
    return !!t && !(t.points.length < 2)
  }
}
const ke = new DebugInfo("mds-measurement-serializer")
class Be {
  constructor() {
    ;(this.points = createObservableArray([])), (this.grouper = new Grouper(this.points))
  }
  deserialize(t) {
    var e
    if (!t || !Array.isArray(t)) return ke.debug("No contents", t), null
    this.grouper.reset()
    for (const i of t)
      if (this.validate(i)) {
        const t = i.lineType || lineType.LINETYPE_3D,
          s = Oe[t],
          n = this.getModelContextFromPoint(i.points[0]),
          o = Object.assign(
            Object.assign(
              { layerId: (null === (e = i.layer) || void 0 === e ? void 0 : e.id) || "", sid: i.id, text: i.label || "", visible: i.enabled, type: s },
              n
            ),
            { created: toDate(i.created), modified: toDate(i.modified), temporary: !1 }
          )
        this.grouper.startGroup(o), i.points.forEach(t => this.grouper.push(VisionParase.fromVisionVector(t.position)))
      } else ke.debug("Deserialized invalid Measurement data from MDS", i)
    return 0 === this.grouper.length ? null : this.grouper
  }
  validate(t) {
    if (!t || "object" != typeof t) return !1
    const e = ["id", "points"].every(e => e in t),
      i = t.points && Array.isArray(t.points) && t.points.length > 0,
      s = e && i
    return s || ke.debug("Invalid MDS.MeasurementPath:", { hasRequiredFields: e, hasPoints: i, data: t }), s
  }
  getModelContextFromPoint(t) {
    return { floorId: t.floor && t.floor.id ? t.floor.id : "", roomId: t.room && t.room.id ? t.room.id : "" }
  }
}
class Ne extends MdsStore {
  constructor() {
    super(...arguments),
      (this.serializer = new Fe()),
      (this.deserializer = new Be()),
      (this.prefetchKey = "data.model.measurementPaths"),
      (this.layeredType = searchModeType.MEASUREMENTPATH)
  }
  async read(t) {
    // const { readonly: e } = this.config,
    //   i = { modelId: this.getViewId(), includeDisabled: !e, includeLayers: this.readLayerId() }
    // return this.query(Le.GetMeasurements, i, t).then(t => {
    //   var e, i
    //   if (!ModelClient.isOk(t, "model.measurementPaths")) throw new MdsReadError("MdsMeasurementModeStore.read failed")
    //   return this.deserializer.deserialize(t.data?.model?.measurementPaths)
    // })
    const data = GetMeasurements
    return this.deserializer.deserialize(data)
    // return null
  }
  async create(t) {
    //pw
    // const e = this.getViewId()
    // const i = this.serializer.serialize(t, this.writeLayerId(t.info.layerId))
    // if (!i) throw new Error("Could not create Measurement")
    // return this.mutate(Le.AddMeasurement, { modelId: e, data: i }).then(t => {
    //   var e, i
    //   const s = t.data?.addMeasurementPath?.id
    //   if (!s) throw new Error("Unable to add measurement!")
    //   return s
    // })
    return null
  }
  async update(t) {
    // if (!t || 0 === t.length) return PromiMouseKeyCodeesolve()
    // const e = this.getViewId()
    // let i = ""
    // const s = {}
    // s.modelId = e
    // let n = ""
    // for (const e of t) {
    //   const t = e.info.sid,
    //     o = this.serializer.serialize(e, !1)
    //   if (!o) throw new Error("Could not update Measurement")
    //   ;(s[`data${t}`] = o),
    //     (i += `, $data${t}: MeasurementPathPatch!`),
    //     (n += `patch${t}: patchMeasurementPath(modelId: $modelId, pathId: "${t}", patch: $data${t}) {\n        id\n      }`)
    // }
    // const o = gql`
    //   mutation PatchMeasurements($modelId: ID! ${i}) {
    //     ${n}
    //   }
    // `
    // return this.mutate(o, s).then(() => {})
    return !0
  }
  async delete(...t) {
    // if (!t || 0 === t.length) return
    // const e = this.getViewId()
    // let i = ""
    // for (const e of t) {
    //   const { pathId: t } = e
    //   i += `delete${t}: deleteMeasurementPath(modelId: $modelId, pathId: "${t}")`
    // }
    // const s = gql`
    //   mutation DeleteMeasurements($modelId: ID!) {
    //     ${i}
    //   }
    // `
    // return this.mutate(s, { modelId: e }).then(() => {})
    //pw
  }
}
class je extends BaseParser {
  constructor(t, e, i, s, n, o) {
    super(t, e, i),
      (this.group = s),
      (this.units = n),
      (this.id = this.group.info.sid),
      (this.title = je.getTitle(this.group, this.units, this.textParser)),
      (this.description = je.getDescription(this.group, this.units)),
      (this.label = je.getLabel(this.group, this.textParser)),
      (this.icon = "icon-tape-measure"),
      (this.enabled = this.group.info.visible),
      (this.typeId = searchModeType.MEASUREMENTPATH),
      (this.floorId = this.group.info.floorId),
      (this.roomId = this.group.info.roomId || ""),
      (this.layerId = this.group.info.layerId),
      (this.dateBucket = getDayTag(this.group.info.created)),
      (this.onSelect = async () => {
        super.onSelect(), this.commandBinder.issueCommand(new z(this.id))
      }),
      (this.textParser = o)
  }
  supportsLayeredCopyMove() {
    return !0
  }
  supportsBatchDelete() {
    return !0
  }
  static getTitle(t, e, i) {
    const s = (0, S.up)(t.length, e),
      n = je.getLabel(t, i)
    return n ? `${s} ${n}` : s
  }
  static getLabel(t, e) {
    return e.getPlainText(t.info.text)
  }
  static getDescription(t, e) {
    if (t.count > 2) {
      return t.segmentLengths.map(t => (0, S.up)(t, e)).join(" – ")
    }
    return ""
  }
}
const { MEASUREMENTS: Ye } = PhraseKey.SHOWCASE,
  Ze = new TextParser({})
export default class MeasurementModeModule extends Module {
  constructor() {
    super(),
      (this.name = "measurement-mode"),
      (this.mutationRecord = { [DiffState.added]: new Set(), [DiffState.updated]: new Set(), [DiffState.removed]: new Set() }),
      (this.removedLayerMap = new Map()),
      (this.store = null),
      (this.newDataBinding = null),
      (this.roomboundData = null),
      (this.longPressStart = Date.now()),
      (this.threshold = 800),
      (this.lineSidToPointMap = {}),
      (this.mobile = !1),
      (this.cameraAndDragBlocked = !1),
      (this.blockNavigation = () => !1),
      (this.visibilityFilterEnabled = !1),
      (this.editable = !0),
      (this.changeCursor = t => {
        this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(t))
      }),
      (this.onEdit = t => {
        const e = this.data.getGroupInfo(t),
          i = (e && e.info.sid) || null
        this.data.editingGroupId !== i && ((this.data.editingGroupId = i), this.colliders.setEditingGroup(t))
      }),
      (this.onEditEnd = () => {
        if (this.data.editingGroupId) {
          const t = this.pointGroups.getGroupById(this.data.editingGroupId)
          t &&
            (this.mutationRecord.updated.add(t.info.sid), this.save(), this.engine.broadcast(new MeasureUpdateMessage(this.buildAnalyticsMessageFromGroup(t))))
        }
        ;(this.data.editingGroupId = null), this.colliders.setEditingGroup(void 0)
      }),
      (this.onCreatorAddNewLine = t => {
        this.log.debug("onCreatorAddNewLine", t), (this.data.creatingGroupId = t)
      }),
      (this.onCreatorAddPoint = () => {
        if (this.data.creatingGroupId) {
          this.log.debug("onCreatorAddNewSegment", this.data.creatingGroupId)
          const t = this.pointGroups.getGroupById(this.data.creatingGroupId)
          if (t && t.count > 1 && t.length > 0) {
            const e = this.buildAnalyticsMessageFromGroup(t)
            this.engine.broadcast(
              new MeasureSegmentAddMessage(
                Object.assign(Object.assign({}, e), { startPosition: this.pointGroups.get(t.startIndex), endPosition: this.pointGroups.get(t.endIndex) })
              )
            )
          }
        }
      }),
      (this.onCreatorStop = () => {
        if (this.data.creatingGroupId) {
          const t = this.pointGroups.getGroupById(this.data.creatingGroupId)
          t &&
            (t.count > 1 && t.hasLength()
              ? (this.engine.broadcast(new MeasureAddMessage(Object.assign({}, this.buildAnalyticsMessageFromGroup(t)))),
                this.mutationRecord.added.add(t.info.sid),
                this.save())
              : this.engine.broadcast(new MeasureCancelledMessage()))
        }
        this.data.creatingGroupId = null
      }),
      (this.onToggleMeasurementMode = async (t, e, i) => {
        this.toggleMeasuringMode(t, i), await this.engine.commandBinder.issueCommand(new ToggleMeshOverlayColorCommand(t && e))
      }),
      (this.onViewmodeChange = () => {
        this.getPhase() !== MeasurePhase.CLOSED && this.stopMeasuring()
      }),
      (this.onSweepChange = () => {
        const t = this.getPhase()
        t !== MeasurePhase.CREATING && t !== MeasurePhase.CREATING_NEXT_POINT && this.setSelected(-1)
      }),
      (this.initStorageOnApplicationChange = async () => {
        var t
        const e = this.loadSavedMeasurements()
        this.data.modeActive() && this.engine.commandBinder.issueCommand(new MeasureModeToggleCommand(!1)),
          this.store && e && !this.newDataBinding
            ? (this.newDataBinding = this.store.onNewData(async t => {
                this.getPhase() !== MeasurePhase.CLOSED && this.stopMeasuring(),
                  this.loadSavedMeasurements() ? this.replaceContents(null == t ? void 0 : t.groups()) : this.replaceContents(),
                  this.clearMutationRecord()
              }))
            : this.newDataBinding && !e && (this.newDataBinding.cancel(), (this.newDataBinding = null)),
          e && (await (null === (t = this.store) || void 0 === t ? void 0 : t.refresh()))
      }),
      (this.getPhase = () => this.data.phase),
      (this.toggleCameraMovement = t => {
        t || this.cameraAndDragBlocked
          ? t &&
            this.cameraAndDragBlocked &&
            (this.dragInterceptor.cancel(), this.navigation.removeNavigationRule(this.blockNavigation), (this.cameraAndDragBlocked = !1))
          : (this.dragInterceptor.renew(), this.navigation.addNavigationRule(this.blockNavigation), (this.cameraAndDragBlocked = !0))
      }),
      (this.getConstraint = () =>
        this.settings.tryGetProperty(UserPreferencesKeys.MeasurementSnapping, !1)
          ? this.viewmodeData.isFloorplan() || isPitchFactorOrtho(this.cameraData.pose.pitchFactor())
            ? K.xh.floorplan
            : this.constraint
          : K.xh.disabled),
      (this.selectedItemChanged = () => {
        // const { activeItemId: t, selectedType: e } = this.searchData
        // ;-1 === this.getSelected() || (t && e === searchModeType.MEASUREMENTPATH) || this.setSelectedById(null)
      }),
      (this.getSelected = () => this.data.selectedGroupIndex),
      (this.setSelected = t => {
        this.data.selectedGroupIndex !== t && this.data.setSelectedGroupIndex(t)
      }),
      (this.setSelectedById = t => {
        if (null === t) this.setSelected(-1)
        else {
          const e = this.pointGroups.getGroupById(t)
          e && this.setSelected(e.index)
        }
      }),
      (this.deleteSelectedMeasurement = () => {
        ;-1 !== this.data.selectedGroupIndex &&
          (this.deleteMeasurement(this.data.selectedGroupIndex),
          this.setSelected(-1),
          this.changePhase(MeasurePhase.IDLE),
          this.mobile ||
            (this.navigation.removeNavigationRule(this.blockNavigation),
            this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT))))
      }),
      (this.deleteMeasurementBySids = async t => {
        const e = t.sids
        for (const i of e) {
          const e = this.pointGroups.getGroupById(i)
          if (!e) throw (this.log.error("Measurement delete failed", Object.assign({}, t)), Error("Measurement delete failed, not found"))
          this.deleteMeasurement(e.index, !0)
        }
        this.save()
      }),
      (this.onToggleContinuous = () => {
        this.stopMeasuring()
      }),
      (this.changePhase = t => {
        this.getPhase() !== t &&
          (this.log.debug(`Phase Change: ${MeasurePhase[this.getPhase()]} -> ${MeasurePhase[t]}`),
          (this.previousPhase = this.getPhase()),
          this.data.setPhase(t))
      }),
      (this.restorePreviousPhase = () => {
        this.changePhase(this.previousPhase)
      }),
      (this.onPhaseChange = t => {
        if ((this.intersectionVisualizer.setMeasuringPhase(t), this.previousPhase !== t))
          switch (t) {
            case MeasurePhase.CLOSED:
            case MeasurePhase.IDLE:
              this.engine.broadcast(new ToggleViewingControlsMessage(!0)), this.engine.commandBinder.issueCommand(new GutterTouchScrollEnableCommand())
              break
            case MeasurePhase.EDITING:
            case MeasurePhase.CREATING:
            case MeasurePhase.POINT_PLACED:
            case MeasurePhase.CREATING_NEXT_POINT:
            case MeasurePhase.CONFIRMING_POINT:
              this.engine.broadcast(new ToggleViewingControlsMessage(!1)), this.engine.commandBinder.issueCommand(new GutterTouchScrollDisableCommand())
          }
      }),
      (this.buildAnalyticsMessage = t => {
        const e = this.pointGroups.getGroup(t)
        return e && e.hasLength() ? this.buildAnalyticsMessageFromGroup(e) : null
      }),
      (this.buildAnalyticsMessageFromGroup = t => {
        const e = y.T[t.info.type]
        return Object.assign(
          Object.assign(
            {
              sid: t.info && t.info.sid ? t.info.sid : t.describe(),
              totalLength: t ? t.length : 0,
              segments: t ? t.count : 0,
              temporary: !!t.info.temporary,
              viewmode: this.viewmodeData.currentMode,
              floorId: t.info.floorId,
              continuous: this.settings.tryGetProperty(UserPreferencesKeys.MeasurementContinuousLines, !1)
            },
            this.getAnalyticsForConstraints()
          ),
          { type: e }
        )
      }),
      (this.getAnalyticsForConstraints = () => {
        const t = this.pointer.lastIntersection
        if (t) {
          const e = t.featureType,
            i = t.constraint
          return { featureType: void 0 !== e ? Ft[e] : "None", constraint: ConstraintMode[i] }
        }
        return null
      }),
      (this.toggleMeasuringMode = (t, e) => {
        console.log(t !== (this.getPhase() !== MeasurePhase.CLOSED))
        this.log.debug("toggleMeasuringMode", t)
        t !== (this.getPhase() !== MeasurePhase.CLOSED) &&
          (t
            ? ((this.editable = e),
              this.engine.toggleRendering(this, !0),
              this.changePhase(MeasurePhase.IDLE),
              this.lineStyler.activate(),
              this.renderer.activate(),
              this.textRenderer.activate(),
              this.editable && (this.editor.activate(), this.colliders.activate(), this.textRenderer.activateInteraction()),
              this.scene.addChild(ChildIDS.Root, this.textRenderer.container),
              this.engine.broadcast(new MeasureModeChangeMessage(!0, this.viewmodeData.currentMode, this.pointGroups.groupCount)))
            : (this.engine.toggleRendering(this, !1),
              this.stopMeasuring(),
              this.changePhase(MeasurePhase.CLOSED),
              this.toggleCameraMovement(!0),
              this.editable && (this.editor.deactivate(), this.colliders.deactivate(), this.textRenderer.deactivateInteraction()),
              this.lineStyler.deactivate(),
              this.renderer.deactivate(),
              this.textRenderer.deactivate(),
              this.scene.removeChild(ChildIDS.Root, this.textRenderer.container),
              this.engine.broadcast(new MeasureModeChangeMessage(!1, this.viewmodeData.currentMode, this.pointGroups.groupCount))))
      }),
      (this.startMeasuring = () => {
        this.settings.tryGetProperty(UserPreferencesKeys.MeasurementSnapping, !1) && this.pointer.preload(),
          this.mobile ||
            (this.navigation.addNavigationRule(this.blockNavigation), this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.XHAIR))),
          this.creator.start()
      }),
      (this.stopMeasuring = () => {
        if (this.getPhase() === MeasurePhase.CLOSED) return
        const t = this.isMeasurementComplete(this.data.selectedGroupIndex)
        this.isCreating() && !t && this.deleteSelectedMeasurement(),
          this.creator.stop(),
          this.mobile ||
            (this.navigation.removeNavigationRule(this.blockNavigation), this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT)))
      }),
      (this.setupIntersectionVisuals = (t, e, i, s, n, o, a, r) => {
        e.addVisibilityRule(() => {
          const t = this.getPhase()
          return !(
            (!o && t === MeasurePhase.CREATING) ||
            t === MeasurePhase.CONFIRMING_POINT ||
            t === MeasurePhase.CREATING_NEXT_POINT ||
            t === MeasurePhase.EDITING
          )
        })
        const h = { cameraData: s, playerCamera: i.camera, scene: i }
        return new CursorPeekCamera(o, n, h, t, a, this.engine.commandBinder.issueCommand, r.isFloorplan)
      }),
      (this.renameMeasurement = async t => {
        const e = this.pointGroups.getGroupById(t.sid)
        if (!e) throw (this.log.error("Measurement rename failed", Object.assign({}, t)), Error("Measurement rename failed, not found"))
        const i = void 0 !== t.text && t.text.length <= 24
        if (!e || !i)
          throw (
            (this.log.error("Measurement text invalid, text must be between 0 and 24 charachters in length.", Object.assign({}, t)),
            new Error("Measurement text invalid"))
          )
        {
          const i = "" === e.info.text && t.text.length > 0,
            s = !i && e.info.text !== t.text
          this.pointGroups.updateGroupInfo(e.index, Object.assign(Object.assign({}, e.info), { text: t.text })),
            this.mutationRecord.updated.add(e.info.sid),
            this.save(),
            i && this.engine.broadcast(new MeasureAddTitleMessage(t.sid, t.text)),
            s && this.engine.broadcast(new MeasureUpdateTitleMessage(t.sid, e.info.text, t.text))
        }
      }),
      (this.onChangeVisibility = async t => {
        const { sids: e, visible: i } = t
        for (const s of e) {
          const e = this.pointGroups.getGroupById(s)
          if (!e)
            throw (
              (this.log.error("Measurement visibility toggle failed", Object.assign(Object.assign({}, t), { group: e })),
              new Error("Measurement visibility toggle failed, not found"))
            )
          {
            this.pointGroups.updateGroupInfo(e.index, Object.assign(Object.assign({}, e.info), { visible: i })), this.mutationRecord.updated.add(e.info.sid)
            const t = this.buildAnalyticsMessage(e.index)
            t && this.engine.broadcast(new MeasureUpdateMessage(t)), i || e.index !== this.getSelected() || this.setSelected(-1)
          }
        }
        this.save()
      }),
      (this.filterVisibility = async t => {
        ;(this.data.idVisibility = new Set(t.sids)), this.data.commit()
      }),
      (this.changeVisibilityFilterEnabled = async t => {
        ;(this.data.idVisibility = new Set()), (this.visibilityFilterEnabled = t.enabled), this.data.commit()
      }),
      (this.currentRoomId = () =>
        shouldDisplayLayer(this.roomboundData, this.layersData, this.layersData.activeLayerId) ? this.roomData.selected.value : null),
      (this.clearMutationRecord = this.clearMutationRecord.bind(this)),
      (this.deleteMeasurement = this.deleteMeasurement.bind(this)),
      (this.replaceContents = this.replaceContents.bind(this)),
      (this.navigateToMeasurement = this.navigateToMeasurement.bind(this))
  }
  async init(t, e) {
    var i
    const { readonly: s, baseUrl: n } = t
    ;(this.config = t), (this.mobile = isMobilePhone()), (this.engine = e)
    const [h, d, l, c, g, f, v, w, y, b] = await Promise.all([
      e.getModuleBySymbol(WebglRendererSymbol),
      e.getModuleBySymbol(RttSymbol),
      e.getModuleBySymbol(InputSymbol),
      e.getModuleBySymbol(LinesSymbol),
      e.getModuleBySymbol(RaycasterSymbol),
      e.market.waitForData(FloorsViewData),
      e.market.waitForData(CameraData),
      e.market.waitForData(ViewmodeData),
      e.market.waitForData(SweepsData),
      e.market.waitForData(RoomsData)
    ])
    // ;([this.settings, this.playerOptions, this.layersData, this.searchData] = await Promise.all([
    ;([this.settings, this.playerOptions, this.layersData] = await Promise.all([
      e.market.waitForData(SettingsData),
      e.market.waitForData(PlayerOptionsData),
      e.market.waitForData(LayersData)
      // e.market.waitForData(SearchData)
    ])),
      e.market.waitForData(RoomBoundData).then(t => (this.roomboundData = t)),
      (this.playerOptions = await e.market.waitForData(PlayerOptionsData)),
      (this.layersData = await e.market.waitForData(LayersData)),
      (this.scene = h.getScene()),
      (this.viewmodeData = w),
      (this.cameraData = v),
      (this.floorsViewData = f),
      (this.roomData = b),
      (this.input = l),
      (this.navigation = await e.getModuleBySymbol(NavigationSymbol)),
      (this.meshQueryModule = await e.getModuleBySymbol(MeshQuerySymbol))
    const D = await e.getModuleBySymbol(StorageSymbol)
    ;(this.applicationData = await e.market.waitForData(AppData)),
      (this.lineDerivedDataFactory = new T(
        v,
        w,
        f,
        () => !!y.currentSweep && y.isSweepAligned(y.currentSweep),
        () => this.settings.tryGetProperty(UserPreferencesKeys.UnitType, UnitTypeKey.IMPERIAL),
        () => !0
      ))
    const S = e.claimRenderLayer(this.name)
    this.data = new MeasureModeData()
    const I = createObservableArray([])
    this.pointGroups = new Grouper(I)
    const P = (t, e, i = !1) => ht(I, t).createSubscription(e, i)
    ;(this.dataSubscription = I.onChanged(() => {
      this.data.repopulate(this.pointGroups.groups()), this.data.commit()
    })),
      (this.store = new Ne({ context: this.layersData.mdsContext, readonly: s, baseUrl: n })),
      this.registerRoomAssociationSource(e),
      (async function (t, e, i, s) {
        const n = await t.market.waitForData(AppData)
        let o = n.application === AppMode.WORKSHOP
        const a = (n, a, r, h = []) => {
            const d = s.tryGetProperty(UserPreferencesKeys.UnitType, UnitTypeKey.METRIC),
              l = [],
              c = e.groups()
            if (0 === h.length)
              for (const e of c)
                (o || (e.info.visible && i.layerToggled(e.info.layerId))) &&
                  n(je.getTitle(e, d, Ze), je.getDescription(e, d)) &&
                  l.push(new je(t.commandBinder, i, a, e, d, Ze))
            return t.commandBinder.issueCommand(new U(l.map(t => t.id))), l
          },
          h = e => {
            t.commandBinder.issueCommand(new j(!!e))
          },
          d = t => new AggregateSubscription(e.onDataChanged(t), s.onPropertyChanged(UserPreferencesKeys.UnitType, t)),
          l = {
            renew: () => {
              t.commandBinder.issueCommandWhenBound(
                new SearchGroupRegisterCommand({
                  id: searchModeType.MEASUREMENTPATH,
                  groupPhraseKey: Ye.SEARCH_GROUP_HEADER,
                  getSimpleMatches: a,
                  registerChangeObserver: d,
                  onSearchActivatedChanged: h,
                  groupOrder: 40,
                  groupIcon: "tape-measure",
                  batchSupported: !0,
                  itemFC: $e.V
                })
              )
            },
            cancel: () => {
              t.commandBinder.issueCommandWhenBound(new SearchGroupDeregisterCommand(searchModeType.MEASUREMENTPATH))
            }
          },
          c = () => {
            ;(o = n.application === AppMode.WORKSHOP), s.tryGetProperty(BtnText.Measurements, !0) || o ? l.renew() : l.cancel()
          },
          u = n.onPropertyChanged("application", c),
          p = s.onPropertyChanged(BtnText.Measurements, c)
        return c(), new AggregateSubscription(l, u, p)
      })(e, this.data, this.layersData, this.settings).then(t => this.bindings.push(t)),
      (this.constraint = this.mobile ? K.xh.mobile : K.xh.desktop),
      (this.pointer = new te(g, this.getConstraint, this.mobile, this.floorsViewData, this.viewmodeData, this.meshQueryModule, v.pose))
    const _ = new ie(this.pointGroups, P, this.pointer, () => {
      const t = this.settings.tryGetProperty(UserPreferencesKeys.MeasurementContinuousLines, !1),
        e =
          this.getPhase() === MeasurePhase.CREATING ||
          this.getPhase() === MeasurePhase.CREATING_NEXT_POINT ||
          (this.previousPhase === MeasurePhase.CREATING_NEXT_POINT && this.getPhase() === MeasurePhase.EDITING)
      return t && this.mobile && e
    })
    e.addComponent(this, _)
    const W = new be(this.pointer, this.mobile, this.getPhase, this.scene, e.getRenderLayer)
    e.addComponent(this, W)
    this.creator = this.instantiateCreator(v)
    //pw
    // this.initStorageOnApplicationChange()
    const $ = (t, e, i) => {
      const s = this.pointGroups.getGroup(t),
        n = s.describe(i)
      this.lineSidToPointMap[n] = i
      const o = this.lineDerivedDataFactory.get(n)
      return this.lineDerivedDataFactory.make(
        n,
        () => ({
          start_position: this.pointGroups.get(e),
          end_position: this.pointGroups.get(i),
          visible: this.getMeasurementVisibility(s.info.sid, s.info.layerId, s.info.visible),
          floorId: s.info.floorId,
          roomId: s.info.roomId,
          type: s.info.type,
          text: this.pointGroups.isStartIndex(e) ? s.info.text : ""
        }),
        o
      )
    }
    ;(this.renderer = new MeasurementLineRenderer(this.pointGroups, P, v, c, S, e.claimRenderLayer("measure-lines"), this.getSelected, $)),
      await e.addComponent(this, this.renderer)
    const q = new TextRenderer({
      assetBasePath: null !== (i = this.settings.getProperty("assetBasePath")) && void 0 !== i ? i : "",
      color: "black",
      background: !0,
      backgroundColor: "#ffffff",
      backgroundColliderType: MeasurementLabelBackgroundMesh
    })
    ;(this.textRenderer = new MeasurementLabelRenderer(
      this.pointGroups,
      l,
      this.mobile,
      v,
      S,
      PickingPriorityType.labels,
      q,
      $,
      this.changeCursor,
      this.getPhase,
      this.setSelected
    )),
      await e.addComponent(this, this.textRenderer),
      (this.editor = new ne(this.pointGroups, l, this.pointer, this.getPhase, this.onEdit, this.onEditEnd)),
      (this.colliders = new Kt(
        this.pointGroups,
        this.input,
        v,
        this.mobile,
        this.changeCursor,
        this.getPhase,
        this.changePhase,
        this.restorePreviousPhase,
        this.setSelected,
        this.getSelected,
        this.onEdit,
        this.onEditEnd
      )),
      (this.lineStyler = new ae(
        this.renderer.lines,
        this.renderer.getLinesForPoint,
        this.renderer.dottedMaterial,
        P,
        this.input,
        this.getPhase,
        this.getSelected
      ))
    const [Y] = await Promise.all([e.getModuleBySymbol(CursorControllerSymbol)])
    ;(this.intersectionVisualizer = this.setupIntersectionVisuals(d, Y, this.scene, v, this.pointer, this.mobile, e.getRenderLayer, this.viewmodeData)),
      e.addComponent(this, this.intersectionVisualizer),
      (this.dragInterceptor = new AggregateSubscription(
        this.input.registerPriorityHandler(DraggerMoveEvent, ShowcaseMesh, () => !0),
        this.input.registerPriorityHandler(DraggerMoveEvent, SkySphereMesh, () => !0)
      )),
      this.dragInterceptor.cancel(),
      this.mobile || this.bindings.push(...this.hotkeys()),
      this.bindings.push(
        // this.applicationData.onPropertyChanged("application", this.initStorageOnApplicationChange),
        w.makeModeChangeSubscription(this.onViewmodeChange),
        y.makeSweepChangeSubscription(this.onSweepChange),
        e.commandBinder.addBinding(MeasureModeToggleCommand, async t => {
          this.onToggleMeasurementMode(t.on, t.dimWhileActive, t.editable)
        }),
        e.commandBinder.addBinding(MeasureStartCommand, async () => this.startMeasuring()),
        e.commandBinder.addBinding(MeasurementSelectCommand, async t => this.setSelected(t.index)),
        e.commandBinder.addBinding(MeasureStopCommand, async () => this.stopMeasuring()),
        e.commandBinder.addBinding(MeasurementDeleteSelectedCommand, async () => this.deleteSelectedMeasurement()),
        e.commandBinder.addBinding(MeasurementDeleteCommand, async t => this.deleteMeasurement(t.index)),
        e.commandBinder.addBinding(MeasurementsSetVisibilityCommand, this.onChangeVisibility),
        e.commandBinder.addBinding(RenameMeasurementCommand, this.renameMeasurement),
        e.commandBinder.addBinding(MeasurementListDeletionCommand, this.deleteMeasurementBySids),
        e.commandBinder.addBinding(H, async t => {
          var e
          return this.replaceContents(null === (e = t.points) || void 0 === e ? void 0 : e.groups())
        }),
        e.commandBinder.addBinding(U, this.filterVisibility),
        e.commandBinder.addBinding(j, this.changeVisibilityFilterEnabled),
        e.commandBinder.addBinding(z, this.navigateToMeasurement),
        this.dataSubscription,
        this.settings.onPropertyChanged(UserPreferencesKeys.MeasurementContinuousLines, () => this.onToggleContinuous()),
        D.onSave(() => this.saveDiff(), { dataType: DataType.MEASUREMENTS }),
        this.layersData.onPropertyChanged("currentViewId", () => this.updateSettings()),
        this.layersData.onPropertyChanged("activeLayerId", () => this.updatePendingMeasurement()),
        this.data.onPropertyChanged("phase", this.onPhaseChange)
        // this.searchData.onPropertyChanged("activeItemId", this.selectedItemChanged)
      ),
      e.market.register(this, MeasureModeData, this.data),
      e.toggleRendering(this, !1),
      this.updateSettings(),
      this.registerDebugSettings()
  }
  replaceContents(t) {
    this.lineDerivedDataFactory.clear()
    for (let t = this.pointGroups.groupCount; t >= 0; t--) {
      const e = this.pointGroups.getGroup(t)
      this.layersData.isInMemoryLayer(e.info.layerId) || this.pointGroups.removeGroup(t)
    }
    t && this.pointGroups.copy(t, !1)
  }
  loadSavedMeasurements() {
    return (
      (this.config.readonly = this.applicationData.application !== AppMode.WORKSHOP),
      this.creator.syncReadonly(this.config.readonly),
      !this.config.readonly || this.playerOptions.options.measurements_saved
    )
  }
  isCreating() {
    const t = this.getPhase()
    return t === MeasurePhase.CREATING || t === MeasurePhase.CREATING_NEXT_POINT
  }
  setConstraintStyle(t) {
    this.log.debug("setConstraintStyle:", ConstraintMode[t]), (this.constraint = t)
  }
  deleteMeasurement(t, e = !1) {
    const i = this.buildAnalyticsMessage(t)
    i && this.engine.broadcast(new MeasureRemoveMessage(Object.assign(Object.assign({}, i), { count: this.pointGroups.groupCount - 1 })))
    const s = this.pointGroups.getGroup(t)
    if (s) {
      const { sid: i, layerId: n } = s.info
      this.pointGroups.removeGroup(t),
        i !== this.data.creatingGroupId &&
          (this.layersData.isInMemoryLayer(n) || (this.mutationRecord.removed.add(i), this.removedLayerMap.set(i, n), e || this.save()))
    }
  }
  isMeasurementComplete(t) {
    if (-1 === t || !this.isCreating()) return !0
    const e = this.getPhase(),
      i = this.pointGroups.getGroup(t)
    return this.settings.tryGetProperty(UserPreferencesKeys.MeasurementContinuousLines, !1)
      ? i.count > 2 && e === MeasurePhase.CREATING_NEXT_POINT
      : i.count >= 2 && e === MeasurePhase.CREATING
  }
  hotkeys() {
    return [
      this.input.registerHandler(KeyboardCallbackEvent, t => {
        if (t.state === KeyboardStateList.PRESSED)
          switch (t.key) {
            case KeyboardCode.ESCAPE:
              this.getPhase() === MeasurePhase.CONFIRMING_POINT
                ? (this.creator.stop(), this.creator.start(), this.changePhase(MeasurePhase.CREATING))
                : this.isCreating()
                  ? this.stopMeasuring()
                  : this.applicationData.application !== AppMode.WORKSHOP &&
                    this.getPhase() !== MeasurePhase.CLOSED &&
                    this.engine.commandBinder.issueCommand(new ToggleToolCommand(ToolsList.MEASUREMENTS, !1))
              break
            case KeyboardCode.BACKSPACE:
            case KeyboardCode.DELETE:
              this.getPhase() !== MeasurePhase.CLOSED && this.getPhase() !== MeasurePhase.EDITING && this.deleteSelectedMeasurement()
              break
            case KeyboardCode.RETURN:
              const t = this.pointGroups.groupCount - 1
              this.isMeasurementComplete(t) && this.stopMeasuring()
          }
      }),
      this.input.registerHandler(KeyboardCallbackEvent, t => {
        if (t.key === KeyboardCode.SHIFT || t.key === KeyboardCode.ALT) {
          const { altKey: e, shiftKey: i } = t.modifiers,
            s = i && e ? K.xh.shiftAlt : e ? K.xh.alt : i ? K.xh.shift : K.xh.desktop
          this.setConstraintStyle(s)
        }
      })
    ]
  }
  onUpdate(t) {
    if (this.getPhase() === MeasurePhase.CLOSED) return
    const e = this.data.selectedGroupIndex,
      i = this.mobile ? LabelVisible.mobile[this.getPhase()] : LabelVisible.desktop[this.getPhase()]
    for (const s in this.lineSidToPointMap) {
      const n = this.lineDerivedDataFactory.get(s)
      if (n) {
        n.opacity.tick(t)
        const o = this.lineSidToPointMap[s],
          a = this.pointGroups.groupFromPointIndex(o),
          r = a === e && n.visible ? 1 : n.opacity.value,
          h = i && !n.labelVisible ? 0 : r
        this.textRenderer.setTextOpacityByPoint(o, h), this.renderer.setLineOpacityByPoint(o, r), -1 !== a && this.colliders.setGroupVisible(a, r > 0)
      }
    }
    if (this.mobile)
      if (this.getPhase() === MeasurePhase.CONFIRMING_POINT) {
        const t = (Date.now() - this.longPressStart) / this.threshold
        t <= 1 && ((this.data.pressProgress = t), this.data.commit())
      } else this.getPhase() === MeasurePhase.CREATING && 0 !== this.data.pressProgress && ((this.data.pressProgress = 0), this.data.commit())
  }
  dispose() {
    var t, e
    this.data.modeActive() && (this.stopMeasuring(), this.engine.commandBinder.issueCommand(new MeasureModeToggleCommand(!1))),
      this.colliders.dispose(),
      this.textRenderer.dispose(),
      this.renderer.dispose(),
      this.engine.disposeRenderLayer(this.name),
      null === (t = this.store) || void 0 === t || t.dispose(),
      (this.store = null),
      null === (e = this.newDataBinding) || void 0 === e || e.cancel(),
      (this.newDataBinding = null),
      super.dispose(this.engine)
  }
  clearMutationRecord() {
    for (const t of Object.values(this.mutationRecord)) t.clear()
  }
  async save() {
    if (!this.config.readonly) return this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.MEASUREMENTS] }))
    this.clearMutationRecord()
  }
  async saveDiff() {
    var t, e
    if ((this.data.repopulate(this.pointGroups.groups()), this.data.commit(), this.data.notifyDataChanged(), this.config.readonly || !this.store))
      return void this.clearMutationRecord()
    const i = this.mutationRecord,
      s = []
    this.log.debug(
      "MDS mutation ops:",
      `{\n      added: '${[...i.added.keys()]}',\n      updated: '${[...i.updated.keys()]}',\n      removed: '${[...i.removed.keys()]}',\n    }`
    )
    const n = []
    for (const t of i[DiffState.removed]) {
      if (i[DiffState.added].has(t)) i[DiffState.added].delete(t)
      else {
        const e = this.removedLayerMap.get(t)
        n.push({ pathId: t, layerId: e })
      }
      i[DiffState.updated].delete(t)
    }
    this.removedLayerMap.clear()
    const o = this.store.delete(...n)
    s.push(o)
    for (const e of i[DiffState.added]) {
      if (this.layersData.isInMemoryLayer(null === (t = this.data.getGroupInfoBySid(e)) || void 0 === t ? void 0 : t.info.layerId)) continue
      const n = this.pointGroups.getGroupById(e)
      if (n) {
        const t = this.store.create(n).then(t => {
          t &&
            (this.log.debug(`Updating group id for new path: ${n.info.sid} -> ${t}`),
            this.pointGroups.updateGroupInfo(n.index, Object.assign(Object.assign({}, n.info), { sid: t }))),
            this.data.repopulate(this.pointGroups.groups()),
            this.data.commit(),
            this.data.notifyDataChanged()
        })
        s.push(t)
      }
      i[DiffState.updated].delete(e)
    }
    const a = []
    for (const t of i[DiffState.updated]) {
      if (this.layersData.isInMemoryLayer(null === (e = this.data.getGroupInfoBySid(t)) || void 0 === e ? void 0 : e.info.layerId)) continue
      const i = this.pointGroups.getGroupById(t)
      i && a.push(i)
    }
    const r = this.store.update(a)
    return s.push(r), this.clearMutationRecord(), Promise.all(s)
  }
  updatePendingMeasurement() {
    const t = this.data.creatingGroupId
    if (t) {
      const e = this.pointGroups.getGroupById(t)
      if (!e) return void this.log.error("Missing pending measurement group")
      if (!this.layersData.isInMemoryLayer(e.info.layerId)) {
        const i = this.layersData.activeLayerId
        this.pointGroups.updateGroupInfo(e.index, Object.assign(Object.assign({}, e.info), { layerId: i }))
        const s = this.data.getGroupInfoBySid(t)
        s && ((s.info.layerId = i), this.data.commit(), this.data.notifyDataChanged())
      }
    }
  }
  getMeasurementVisibility(t, e, i) {
    if (!this.data.modeActive()) return !1
    const { selectedGroupSid: s, creatingGroupId: n, editingGroupId: o, idVisibility: a } = this.data,
      r = this.applicationData.application === AppMode.WORKSHOP || this.layersData.layerToggled(e),
      h = this.layersData.layerVisible(e),
      d = [s, n, o].includes(t),
      l = !this.visibilityFilterEnabled || a.has(t)
    return r && (d || (i && l && h))
  }
  async registerDebugSettings() {
    const t = await this.engine.getModuleBySymbol(SettingsSymbol)
    t.registerMenuEntry({
      header: "Measurement Debug",
      setting: "measure/fp_in_dh",
      initialValue: () => !1,
      onChange: e => (this.lineDerivedDataFactory.setDollhouseLineStyle(e ? y.T.FloorplanOnly : y.T.ThreeD), t.updateSetting("measure/fp_in_dh", e))
    })
  }
  updateSettings() {
    const t = this.layersData.getCurrentView(),
      e = (null == t ? void 0 : t.viewType) === ModelViewType.TRUEPLAN,
      i = this.settings.tryGetProperty(MeasurementsKey, !0),
      s = e || i
    this.settings.setProperty(MeasurementsKey, s)
  }
  instantiateCreator(t) {
    let e
    const i = this.viewmodeData,
      s = () => {
        const e = i.isFloorplan(),
          s = i.isDollhouse() && t.pose.pitchFactor() < 0.01
        return e || s
      },
      n = t => {
        const e = { floorId: t.floorId || "", roomId: t.roomId || "", layerId: this.layersData.activeLayerId }
        return this.meshQueryModule.inferMeshIdsFromPoint(e, t.point, !0), e
      }
    if (this.mobile) {
      const i = (t, e) => {
          ;(this.longPressStart = t), (this.threshold = e)
        },
        o = e => {
          const i = getScreenAndNDCPosition(t, e.point)
          this.data.setPointPosition(i.screenPosition)
        }
      e = new le(
        this.pointGroups,
        this.setSelected,
        this.input.registerUnfilteredHandler,
        this.pointer,
        this.changePhase,
        i,
        o,
        this.toggleCameraMovement,
        this.getPhase,
        () => this.settings.tryGetProperty(UserPreferencesKeys.MeasurementContinuousLines, !1),
        s,
        () => this.floorsViewData.getHighestVisibleFloorId(),
        this.currentRoomId,
        () => this.layersData.activeLayerId,
        n
      )
    } else
      e = new ce(
        this.pointGroups,
        this.setSelected,
        this.input.registerUnfilteredHandler,
        this.pointer,
        this.changePhase,
        this.getPhase,
        s,
        () => this.floorsViewData.getHighestVisibleFloorId(),
        this.currentRoomId,
        () => this.layersData.activeLayerId,
        () => this.settings.tryGetProperty(UserPreferencesKeys.MeasurementContinuousLines, !1),
        n,
        this.meshQueryModule
      )
    return (
      (e.onGroupCreated = this.onCreatorAddNewLine),
      (e.onGroupAddPoint = this.onCreatorAddPoint),
      (e.onEdit = this.onEdit),
      (e.onDone = this.onCreatorStop),
      e.syncReadonly(this.config.readonly),
      e
    )
  }
  async navigateToMeasurement({ groupId: t }) {
    const e = this.data.getGroupInfoBySid(t)
    if (!e) return
    const i = []
    for (const t of e) i.push(t)
    const s = new Box3().setFromPoints(i),
      n = e.info.type === y.T.FloorplanOnly ? ViewModes.Floorplan : ViewModes.Dollhouse
    s.expandByScalar(n === ViewModes.Dollhouse ? 1.25 : 1)
    const o = { mode: n, transition: TransitionTypeList.Interpolate, floorId: e.info.floorId }
    try {
      await this.navigation.focus(s, o), this.setSelectedById(t)
    } catch (t) {
      this.log.info("Unable to navigateToMeasurement:", t)
    }
  }
  registerRoomAssociationSource(t) {
    const e = this.data
    t.commandBinder.issueCommandWhenBound(
      new RegisterRoomAssociationSourceCommand({
        type: "measurements",
        getPositionId: function* () {
          for (const t of e.groups()) yield { id: t.info.sid, roomId: t.info.roomId, floorId: t.info.floorId, position: t.get(0), layerId: t.info.layerId }
        },
        updateRoomForId: (t, i) => {
          const s = e.getGroupInfoBySid(t)
          if (!s) throw new Error("Invalid measurement group id")
          s.info.roomId = i || void 0
        }
      })
    )
  }
}

// export const MeasurementModeData = MeasureModeData
// export const MeasuringPhase = MeasurePhase
// export const labelVisible = LabelVisible
