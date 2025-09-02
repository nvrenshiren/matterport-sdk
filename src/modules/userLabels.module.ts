import R from "rbush"
import { Matrix4, Object3D, Quaternion, Vector2, Vector3 } from "three"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { FocusOnPointInsideCommand, NavigateToLabelCommand } from "../command/navigation.command"
import { SearchGroupDeregisterCommand, SearchGroupRegisterCommand } from "../command/searchQuery.command"
import { ChangeViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { PickingPriorityType } from "../const/12529"
import { Features3DLabelsEnabledKey, FeaturesLabelsKey } from "../const/23037"
import { TransitionTypeList } from "../const/64918"
import { DollhousePeekabooKey } from "../const/66777"
import { CursorStyle } from "../const/cursor.const"
import { PhraseKey } from "../const/phrase.const"
import { InputSymbol, LabelRenderSymbol, LocaleSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { ToolsList } from "../const/tools.const"
import { searchModeType } from "../const/typeString.const"
import * as E from "../const/userLabels.const"
import { UserLabels } from "../const/userLabels.const"
import { Command } from "../core/command"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { RenderLayer } from "../core/layers"
import { Module } from "../core/module"
import { createSubscription, ISubscription } from "../core/subscription"
import { AppData, AppMode, AppStatus } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { LabelData } from "../data/label.data"
import { LayersData } from "../data/layers.data"
import { MeshData } from "../data/mesh.data"
import { BtnText } from "../data/player.options.data"
import { RoomsData } from "../data/rooms.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ToolsData } from "../data/tools.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { checkLerpThreshold } from "../math/2569"
import { getScreenAndNDCPosition } from "../math/59370"
import { LabelObject } from "../object/label.object"
import { createObservableMap, ObservableMap } from "../observable/observable.map"
import { ShowcaseDollhouseKey, ShowcaseFloorPlanKey } from "../other/65019"
import { BaseParser } from "../parser/baseParser"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { winCanTouch } from "../utils/browser.utils"
import { Comparator } from "../utils/comparator"
import { getDayTag } from "../utils/date.utils"
import { ViewModes } from "../utils/viewMode.utils"
import { ScaleType, TextRenderer } from "../webgl/67971"
import { LabelMakerMesh } from "../webgl/label.maker.mesh"
import { LabelMesh, TextMakerLabel } from "../webgl/label.mesh"
import { DirectionVector } from "../webgl/vector.const"
declare global {
  interface SymbolModule {
    [LabelRenderSymbol]: UserLabelsModule
  }
}

class LabelMaker {
  makeLabel: () => TextMakerLabel
  textStyle: TextRenderer["currentTextConfig"]
  layer: RenderLayer
  constructor(t: Partial<TextRenderer["currentTextConfig"]> = {}) {
    this.makeLabel = () => {
      const t = new TextMakerLabel(Object.assign({}, this.textStyle))
      t.scaleType = ScaleType.WORLD
      t.setRenderOrder(PickingPriorityType.labels)
      t.setRenderLayer(this.layer)
      t.opacity = 0
      return t
    }
    this.textStyle = TextRenderer.makeConfig(
      Object.assign(
        {
          color: "white",
          background: !1,
          backgroundAsCollider: !0,
          backgroundColliderType: LabelMakerMesh,
          backgroundColor: "#222",
          backgroundOpacity: 1,
          outline: !0,
          outlineWidth: 0.06,
          wordWrapWidth: void 0,
          disableDepth: !0
        },
        t
      )
    )
  }
  setRenderLayer(t: RenderLayer) {
    this.layer = t
  }
}
class w extends Command {
  constructor(t) {
    super(), (this.id = "FILTER_LABEL_VISIBILITY"), (this.payload = { ids: t })
  }
}
class y extends Command {
  constructor(t) {
    super(), (this.id = "VISIBILITY_FILTER_ENABLED"), (this.payload = { enabled: t })
  }
}
const P = new DebugInfo("label-spawner")
class Spawner {
  map: ObservableMap<LabelObject>
  maker: LabelMaker
  container: Object3D
  pool: LabelMesh[]
  bindings: ISubscription[]
  meshesMap: ObservableMap<LabelMesh>
  constructor(t: ObservableMap<LabelObject>, e) {
    this.map = t
    this.maker = e
    this.container = new Object3D()
    this.pool = []
    this.bindings = []
    this.meshesMap = createObservableMap()
    this.container.name = "RoomLabels"
    const i = t.keys
    for (const e of i) {
      const i = t.get(e)
      this.add(i, e)
    }
    this.bindings.push(
      t.onElementChanged({
        onAdded: (t, e) => {
          this.add(t!, e!)
          P.debug("LabelMesh: added:", e)
        },
        onRemoved: (t, e) => {
          P.debug("LabelMesh: removing:", e)
          const i = this.meshesMap.get(e!)
          i && this.free(i)
        }
      })
    )
  }
  subscribe(t) {
    return this.meshesMap.onElementChanged(t)
  }
  get(t: string) {
    return this.meshesMap.get(t)
  }
  free(t: LabelMesh) {
    const e = t.getId(),
      i = this.meshesMap.get(e)
    i.free()
    this.meshesMap.delete(e)
    this.container.remove(i)
    this.pool.push(i)
    P.debug("LabelMesh: removed:", i)
  }
  add(t: LabelObject, e: string) {
    const i = this.get(e)
    if (i) return i
    const s = this.pool.shift()
    if (void 0 !== s) {
      s.use(t)
      this.container.add(s)
      this.meshesMap.set(e, s)
      return s
    }
    {
      const i = new LabelMesh(this.maker.makeLabel())
      i.use(t)
      this.container.add(i)
      this.meshesMap.set(e, i)
      return i
    }
  }
  dispose() {
    for (const t of this.meshesMap.values) this.free(t), t.text.dispose()
    this.meshesMap.clear()
    for (const t of this.pool) t.text.dispose()
    this.pool.length = 0
    this.bindings.forEach(t => t.cancel())
  }
}
class LabelRenderer {
  meshes: ObservableMap<LabelMesh>
  cameraData: any
  screenFilter: any
  dirty: boolean
  bindings: ISubscription[]
  pendingMesh: null | LabelMesh
  setDirty: () => void
  constructor(t, e, i, s) {
    ;(this.meshes = t),
      (this.cameraData = i),
      (this.screenFilter = s),
      (this.dirty = !0),
      (this.bindings = []),
      (this.pendingMesh = null),
      (this.setDirty = () => {
        this.dirty = !0
      }),
      this.bindings.push(i.onChanged(this.setDirty), e.onChanged(this.setDirty))
    for (const t of this.meshes.values) t.text.onGeomUpdate(this.setDirty)
    this.meshes.onElementChanged({ onAdded: t => t?.text.onGeomUpdate(this.setDirty) })
  }
  dispose() {
    this.bindings.forEach(t => t.cancel()), (this.bindings.length = 0)
  }
  setPendingMeshId(t) {
    if (
      (!this.pendingMesh || this.pendingMesh.getId() !== t) &&
      (this.pendingMesh && (this.pendingMesh.data.removeOnChanged(this.setDirty), (this.pendingMesh = null)), t)
    ) {
      const e = this.meshes.get(t)
      e.data.onChanged(this.setDirty), (this.pendingMesh = e)
    }
  }
  beforeRender() {
    if (!this.dirty) return
    this.dirty = !1
    const { position: t, rotation: e, projection: i } = this.cameraData.pose,
      { height: s } = this.cameraData,
      n = this.cameraData.zoom(),
      o = this.cameraData.aspect(),
      a = checkLerpThreshold(64 - UserLabels.LABEL_SIZE, 0, 64, 0.02, 0.1)
    for (const r of this.meshes.values) r.isHidden() || (r.updatePose(r.data.position, e), r.billboard(t, e, i, n, s, o, a))
    this.screenFilter.update()
    for (const t of this.meshes.values) t.isHidden() || t.toggleFiltered(!this.screenFilter.visible(t.data.sid))
  }
  render(t) {
    for (const e of this.meshes) e.tickAnimations(t)
  }
  deactivate() {}
  init() {}
  activate() {}
}

class LabelFilter {
  meshes: any
  cameraData: any
  enabled: any
  tree: R<unknown>
  visibleMap: {}
  _screenPosition: Vector2
  _ndcPosition: Vector3
  _cornerWorldPosition: Vector3
  _cornerScreenPosition: Vector2
  _selectedId: null
  update: () => void
  constructor(t, e, i) {
    ;(this.meshes = t),
      (this.cameraData = e),
      (this.enabled = i),
      (this.tree = new R()),
      (this.visibleMap = {}),
      (this._screenPosition = new Vector2()),
      (this._ndcPosition = new Vector3()),
      (this._cornerWorldPosition = new Vector3()),
      (this._cornerScreenPosition = new Vector2()),
      (this._selectedId = null),
      (this.update = () => {
        this.enabled() ? ((this.visibleMap = {}), this.updatePositions()) : Object.keys(this.visibleMap).length && (this.visibleMap = {})
      })
  }
  visible(t) {
    if (!(t in this.visibleMap)) return !1
    return t in this.visibleMap
  }
  setSelectedMeshId(t) {
    this._selectedId = t
  }
  updatePositions() {
    this.tree.clear(),
      this.meshes()
        .filter(t => !t.isHidden())
        .map(t => {
          getScreenAndNDCPosition(this.cameraData, t.text.position, this._screenPosition, this._ndcPosition)
          const { width: e, height: i } = t.text.getUnscaledSize()
          this._cornerWorldPosition.set(0.5 * e, -0.5 * i, 0),
            t.text.updateMatrixWorld(),
            this._cornerWorldPosition.applyMatrix4(t.text.matrixWorld),
            getScreenAndNDCPosition(this.cameraData, this._cornerWorldPosition, this._cornerScreenPosition)
          const s = t.getId() !== this._selectedId ? this._ndcPosition.z : -999
          return this.describeBbox(t.text, this._screenPosition, this._cornerScreenPosition, s)
        })
        .sort((t, e) => t.depth - e.depth)
        .forEach(t => {
          this.tree.collides(t) || (this.tree.insert(t), (this.visibleMap[t.id] = t))
        })
  }
  describeBbox(t, e, i, s) {
    i.sub(e)
    const n = i.x,
      o = i.y
    return { id: t.userData.sid, depth: s, minX: e.x - n, minY: e.y - o, maxX: e.x + n, maxY: e.y + o }
  }
}
class _ {
  meshes: any
  initialized: boolean
  pendingMeshId: null
  selectedMeshId: null
  dirty: boolean
  bindings: ISubscription[]
  labelIdVisibility: {}
  visibilityFilterEnabled: boolean
  featureEnabled: () => any
  appData: any
  settingsData: any
  toolsData: any
  visibleByTool: () => boolean
  visibleByViewmode: () => any
  viewmodeData: any
  cameraData: any
  hiddenByTransition: () => any
  floorsViewData: any
  visibleByFloor: (t: any) => any
  setDirty: () => void
  layersData: any
  dirtyCb: any
  constructor(t) {
    ;(this.meshes = t),
      (this.initialized = !1),
      (this.pendingMeshId = null),
      (this.selectedMeshId = null),
      (this.dirty = !0),
      (this.bindings = []),
      (this.labelIdVisibility = {}),
      (this.visibilityFilterEnabled = !1),
      (this.featureEnabled = () => {
        if (!this.initialized) return !1
        const t = this.appData.phase === AppStatus.PLAYING,
          e = this.settingsData.tryGetProperty(FeaturesLabelsKey, !1),
          i = this.settingsData.tryGetProperty(BtnText.Labels, !1) || this.toolsData.activeToolName === ToolsList.LABELS,
          s = t && e && i
        return this.settingsData.setProperty(Features3DLabelsEnabledKey, s), s
      }),
      (this.visibleByTool = () => {
        if (!this.initialized) return !1
        const { activeToolName: t } = this.toolsData
        return null === t || t === ToolsList.LABELS || t === ToolsList.PHOTOS || t === ToolsList.SEARCH || t === ToolsList.LAYERS
      }),
      (this.visibleByViewmode = () => {
        const t = this.settingsData.tryGetProperty(BtnText.LabelsDollhouse, !1) || this.toolsData.activeToolName === ToolsList.LABELS,
          e = this.viewmodeData.isDollhouse() && t,
          i =
            this.viewmodeData.isFloorplan() &&
            ((this.appData.application === AppMode.WORKSHOP && this.visibleByTool()) || this.settingsData.tryGetProperty(BtnText.Labels, !1)),
          s =
            this.viewmodeData.isDollhouse() &&
            this.settingsData.tryGetProperty(BtnText.Labels, !1) &&
            this.settingsData.tryGetProperty(DollhousePeekabooKey, !1) &&
            this.cameraData.pose.isPitchFactorOrtho.value
        return i || e || s
      }),
      (this.hiddenByTransition = () => this.viewmodeData.transitionActive() || this.floorsViewData.transitionActive),
      (this.visibleByFloor = t => {
        if (!(this.toolsData.activeToolName === ToolsList.LABELS)) {
          const { roomSelectModeActive: t, floorSelectModeActive: e } = this.floorsViewData
          if (!t) return !1
          if (e) return !1
        }
        return this.viewmodeData.isFloorplan()
          ? this.floorsViewData.currentFloor
            ? this.floorsViewData.isCurrentOrAllFloors(t)
            : this.floorsViewData.topFloorId === t
          : this.floorsViewData.isCurrentOrAllFloors(t)
      }),
      (this.setDirty = () => {
        this.dirty = !0
      })
  }
  async init(t) {
    ;[this.viewmodeData, this.floorsViewData, this.settingsData, this.toolsData, this.appData, this.layersData, this.cameraData] = await Promise.all([
      t.waitForData(ViewmodeData),
      t.waitForData(FloorsViewData),
      t.waitForData(SettingsData),
      t.waitForData(ToolsData),
      t.waitForData(AppData),
      t.waitForData(LayersData),
      t.waitForData(CameraData)
    ])
    const e = await t.waitForData(LabelData)
    ;[this.viewmodeData, this.floorsViewData, this.settingsData, this.toolsData, this.appData, e].forEach(t => this.bindings.push(t.onChanged(this.setDirty))),
      this.bindings.push(this.layersData.onCurrentLayersChanged(this.setDirty), this.cameraData.pose.isPitchFactorOrtho.onChanged(this.setDirty)),
      this.meshes.onChanged(this.setDirty),
      (this.initialized = !0)
  }
  dispose() {
    this.bindings.forEach(t => t.cancel()), (this.bindings.length = 0)
  }
  setVisibilityFilterEnabled(t) {
    ;(this.visibilityFilterEnabled = t), this.setDirty()
  }
  updateLabelVisibility(t) {
    ;(this.labelIdVisibility = t.reduce((t, e) => ((t[e] = !0), t), {})), this.setDirty()
  }
  onUpdate() {
    if (!this.initialized || !this.dirty) return
    this.dirty = !1
    const t = this.featureEnabled() && !this.hiddenByTransition() && this.visibleByTool() && this.visibleByViewmode(),
      e = t =>
        t.visible && this.visibleByFloor(t.floorId) && this.visibleById(t.sid) && this.layerToggledOn(t.layerId) && this.layersData.layerVisible(t.layerId)
    for (const i of this.meshes.values) {
      const s = i.data.sid === this.pendingMeshId || i.data.sid === this.selectedMeshId,
        n = t && (s || e(i.data))
      i.toggleLabel(n)
    }
    this.dirtyCb && this.dirtyCb()
  }
  setPendingMeshId(t) {
    ;(this.pendingMeshId = t), this.setDirty()
  }
  setSelectedMeshId(t) {
    ;(this.selectedMeshId = t), this.setDirty()
  }
  setDirtyCallback(t) {
    this.dirtyCb = t
  }
  visibleById(t) {
    return !this.visibilityFilterEnabled || !!this.labelIdVisibility[t]
  }
  layerToggledOn(t) {
    return this.appData.application === AppMode.WORKSHOP || this.layersData.layerToggled(t)
  }
}
class LabelNavInput {
  labelRenderer: UserLabelsModule
  issueCommand: any
  input: any
  floorsViewData: any
  toolsData: any
  roomNavigationPose: any
  inputBindings: ISubscription[]
  appStateBindings: ISubscription[]
  raycasterRegistrationBindings: ISubscription[]
  active: boolean
  enabled: boolean
  refresh: () => void
  refreshColliders: () => void
  clearColliders: () => void
  constructor(t, e, i, s, n, o) {
    ;(this.labelRenderer = t),
      (this.issueCommand = e),
      (this.input = i),
      (this.floorsViewData = s),
      (this.toolsData = n),
      (this.roomNavigationPose = o),
      (this.inputBindings = []),
      (this.appStateBindings = []),
      (this.raycasterRegistrationBindings = []),
      (this.active = !0),
      (this.enabled = !0),
      (this.refresh = () => {
        this.shouldBeInteractive !== this.active &&
          (this.inputBindings.forEach(t => (this.shouldBeInteractive ? t.renew() : t.cancel())),
          this.raycasterRegistrationBindings.forEach(t => (this.shouldBeInteractive ? t.renew() : t.cancel())),
          (this.active = this.shouldBeInteractive))
      }),
      (this.refreshColliders = () => {
        for (const t of this.labelRenderer.labelMeshIterator())
          this.shouldBeInteractive ? this.input.registerMesh(t.text.collider, !1) : this.input.unregisterMesh(t.text.collider)
      }),
      (this.clearColliders = () => {
        for (const t of this.labelRenderer.labelMeshIterator()) this.input.unregisterMesh(t.text.collider)
      }),
      this.inputBindings.push(...this.setupInputBindings()),
      this.raycasterRegistrationBindings.push(...this.setupRaycasterBindings())
    const a = this.toolsData.onPropertyChanged("activeToolName", this.refresh),
      r = this.floorsViewData.makeFloorChangeSubscription(this.refresh),
      h = this.floorsViewData.onRoomSelectModeChange(this.refresh)
    this.appStateBindings.push(a, r, h), this.refresh()
  }
  toggleInput(t) {
    this.enabled !== t && ((this.enabled = t), this.appStateBindings.forEach(e => (t ? e.renew() : e.cancel())), this.refresh())
  }
  get shouldBeInteractive() {
    return this.enabled && null === this.toolsData.activeToolName && this.floorsViewData.roomSelectModeActive
  }
  setupRaycasterBindings() {
    return [
      createSubscription(
        () => this.refreshColliders(),
        () => this.clearColliders(),
        !0,
        "toggleLabelMeshInput"
      ),
      this.labelRenderer.subscribe({ onAdded: t => this.input.registerMesh(t.text.collider, !1), onRemoved: t => this.input.unregisterMesh(t.text.collider) })
    ]
  }
  setupInputBindings() {
    const t = Comparator.is(t => t instanceof LabelMakerMesh && t.labelVisible()),
      e = this.input.registerMeshHandler(InputClickerEndEvent, t, (t, e) => {
        const i = this.labelRenderer.getLabelMesh(e.getId())
        if (i) {
          const t = i.data.roomId
          if (t) {
            const e = this.roomNavigationPose.getPoseForRoom(t, i.data.position)
            e && this.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.INSIDE, TransitionTypeList.Interpolate, e))
          } else this.issueCommand(new FocusOnPointInsideCommand({ focusPosition: i.data.position, transition: TransitionTypeList.Interpolate }))
        }
      })
    if (winCanTouch()) return [e]
    let i: LabelMesh | null = null
    return [
      new AggregateSubscription(
        this.input.registerMeshHandler(HoverMeshEvent, t, (t, e) => {
          const s = this.labelRenderer.getLabelMesh(e.getId())
          s && ((s.hoverState.active = !0), s.hoverState.on(), (i = s), this.issueCommand(new SetMouseCursorCommand(CursorStyle.FINGER)))
        }),
        this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(LabelMakerMesh), (t, e) => {
          i && this.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT))
          const s = this.labelRenderer.getLabelMesh(e.getId())
          s && ((s.hoverState.active = !1), s.hoverState.off()), (i = null)
        }),
        createSubscription(
          () => {},
          () => {
            i && ((i.hoverState.active = !1), i.hoverState.off(), this.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT)), (i = null))
          },
          !0,
          "labelHoverClear"
        )
      ),
      e
    ]
  }
}
const et = new DebugInfo("room-with-a-view")
class RoomNavigationPose {
  sweepData: any
  roomData: any
  meshData: any
  constructor(t, e, i) {
    ;(this.sweepData = t), (this.roomData = e), (this.meshData = i)
  }
  getPoseForRoom(t, e) {
    const i = this.bestViewForRoom(t, e)
    if (i) {
      return { rotation: i.rotation, sweepID: i.sweepID, viewmode: ViewModes.Panorama }
    }
    return null
  }
  bestViewForRoom(t, e) {
    const i = this.sweepData.filter(e => e.roomId === t && e.enabled)
    if (0 === i.length) return et.debug("no sweeps in selected room", { roomId: t, scansInRoom: i }), null
    let s = 1
    const n = this.roomData.get(t),
      o = this.meshData.meshGroups.rooms.get(n.meshSubgroup),
      a = (null == o ? void 0 : o.boundingBox.getSize(new Vector3()).length()) || 1 / 0
    e && a > 10 && (s = 0.1)
    const r = i.sort((i, n) => {
        let o = 0,
          a = 0
        e && ((o = i.position.distanceTo(e)), (a = n.position.distanceTo(e)))
        const r = i.neighbours.map(t => this.sweepData.getSweep(t)).filter(e => e.roomId === t).length,
          h = n.neighbours.map(t => this.sweepData.getSweep(t)).filter(e => e.roomId === t).length
        return 1 * s * (h - r) - 3 * (a - o)
      }),
      h = r[0]
    if (!h) return et.debug("no start sweep", { roomId: t, scansInRoom: i, connectedness: r }), null
    const d = h.neighbours
        .map(t => this.sweepData.getSweep(t))
        .sort((e, i) => {
          let s = h.position.distanceTo(e.position),
            n = h.position.distanceTo(i.position)
          return e.roomId === t && (s *= 1e3), i.roomId === t && (n *= 1e3), n - s
        })
        .map(t => ({ sweep: t, dist: h.position.distanceTo(t.position), rm: t.roomId })),
      l = d[0]
    et.warn({ roomId: t, roomSize: a, scoring: r, byDistance: d, scansInRoom: i })
    const c = new Quaternion()
    if (1 === i.length && void 0 !== l) {
      const t = new Matrix4().setPosition(h.position)
      t.lookAt(l.sweep.position, h.position, DirectionVector.UP), c.setFromRotationMatrix(t)
    } else {
      const t = new Matrix4().setPosition(h.position)
      t.lookAt(h.position, l.sweep.position, DirectionVector.UP), c.setFromRotationMatrix(t)
    }
    return { sweepID: h.id, rotation: c }
  }
}
class dt extends BaseParser {
  editMode: any
  label: any
  title: any
  icon: string
  constructor(t, e, i, s, n) {
    super(t, e, i),
      (this.editMode = s),
      (this.label = n),
      (this.id = this.label.sid),
      (this.title = this.label.text),
      (this.icon = "icon-toolbar-labels"),
      (this.typeId = searchModeType.LABEL),
      (this.floorId = this.label.floorId),
      (this.roomId = this.label.roomId || ""),
      (this.layerId = this.label.layerId),
      (this.dateBucket = getDayTag(this.label.created)),
      (this.enabled = this.label.visible),
      (this.onSelect = () => {
        super.onSelect(), this.editMode || this.commandBinder.issueCommand(new NavigateToLabelCommand(this.label))
      })
  }
  supportsLayeredCopyMove() {
    return !0
  }
  supportsBatchDelete() {
    return !0
  }
}
const { LABELS: lt } = PhraseKey.SHOWCASE
async function ct(t, e, i) {
  const [s, n, o] = await Promise.all([t.market.waitForData(AppData), t.market.waitForData(LayersData), t.market.waitForData(ToolsData)])
  let a = s.application === AppMode.WORKSHOP
  const r = (i, s, o, r = []) => {
      const h: dt[] = []
      return (
        0 === r.length &&
          e.iterate(e => {
            ;(a || (e.visible && n.layerToggled(e.layerId))) && i(e.text) && h.push(new dt(t.commandBinder, n, s, a, e))
          }),
        t.commandBinder.issueCommand(new w(h.map(t => t.id))),
        h.sort((t, e) => t.title.localeCompare(e.title))
      )
    },
    d = e => {
      t.commandBinder.issueCommand(new y(!!e))
    },
    l = t => new AggregateSubscription(e.onChanged(t)),
    c = () => {
      t.commandBinder.issueCommandWhenBound(
        new SearchGroupRegisterCommand({
          id: searchModeType.LABEL,
          groupPhraseKey: lt.SEARCH_GROUP_HEADER,
          getSimpleMatches: r,
          registerChangeObserver: l,
          onSearchActivatedChanged: d,
          groupOrder: E._,
          groupIcon: "toolbar-labels",
          batchSupported: !0
        })
      )
    },
    u = () => {
      t.commandBinder.issueCommandWhenBound(new SearchGroupDeregisterCommand(searchModeType.LABEL))
    },
    p = () => {
      a = s.application === AppMode.WORKSHOP
      const t = o.activeToolName === ToolsList.LABELS,
        e = i.tryGetProperty(BtnText.Labels, !1),
        n = i.tryGetProperty(ShowcaseDollhouseKey, !1),
        r = i.tryGetProperty(ShowcaseFloorPlanKey, !1)
      ;(e || t) && (n || r || a) ? c() : u()
    },
    m = [s.onPropertyChanged("application", p), i.onChanged(p), o.onChanged(p)]
  return p(), new AggregateSubscription(...m)
}
export default class UserLabelsModule extends Module {
  labelMeshIterator: () => any
  spawner: Spawner
  filterVisibleLabels: (t: any) => Promise<void>
  visibilityRules: any
  changeVisibilityFilterEnabled: (t: any) => Promise<void>
  labelFilter: LabelFilter
  labelRenderer: LabelRenderer
  labelNavInput: LabelNavInput
  constructor() {
    super(...arguments),
      (this.name = "user-labels"),
      (this.labelMeshIterator = () => this.spawner.meshesMap.values),
      (this.filterVisibleLabels = async t => {
        this.visibilityRules.updateLabelVisibility(t.ids)
      }),
      (this.changeVisibilityFilterEnabled = async t => {
        this.visibilityRules.setVisibilityFilterEnabled(t.enabled)
      })
  }
  async init(t, e: EngineContext) {
    const [i, s, p, m, g, v, b, D, S, I, P] = await Promise.all([
      e.market.waitForData(LabelData),
      e.market.waitForData(CameraData),
      e.market.waitForData(FloorsViewData),
      e.market.waitForData(ToolsData),
      e.market.waitForData(SweepsData),
      e.market.waitForData(RoomsData),
      e.market.waitForData(MeshData),
      e.getModuleBySymbol(WebglRendererSymbol),
      e.getModuleBySymbol(InputSymbol),
      e.getModuleBySymbol(LocaleSymbol),
      e.market.waitForData(SettingsData)
    ])
    const M = D.getScene()
    const E = new LabelMaker({ assetBasePath: P.tryGetProperty("assetBasePath", ""), lang: I.languageCode })
    E.setRenderLayer(e.claimRenderLayer("labels"))
    this.spawner = new Spawner(i.getCollection(), E)
    M.add(this.spawner.container)
    this.visibilityRules = new _(this.spawner.meshesMap)
    this.visibilityRules.init(e.market)
    this.bindings.push(e.commandBinder.addBinding(w, this.filterVisibleLabels), e.commandBinder.addBinding(y, this.changeVisibilityFilterEnabled))
    this.labelFilter = new LabelFilter(this.labelMeshIterator, s, () => this.visibilityRules.featureEnabled() && this.visibilityRules.visibleByTool())
    this.labelRenderer = new LabelRenderer(this.spawner.meshesMap, i.getCollection(), s, this.labelFilter)
    e.addComponent(this, this.labelRenderer)
    this.visibilityRules.setDirtyCallback(this.labelRenderer.setDirty)
    const C = new RoomNavigationPose(g, v, b)
    this.labelNavInput = new LabelNavInput(this, e.commandBinder.issueCommand, S, p, m, C)
    this.toggleInput(!0)
    ct(e, i, P).then(t => this.bindings.push(t))
  }
  dispose(t) {
    super.dispose(t), this.visibilityRules.dispose(), this.spawner.dispose()
  }
  getLabelMesh(t: string) {
    return (t && this.spawner.get(t)) || null
  }
  addLabelMesh(t, e) {
    return this.spawner.add(t, e)
  }
  freeLabelMesh(t) {
    t && this.spawner.free(t)
  }
  setPendingMeshId(t) {
    this.visibilityRules.setPendingMeshId(t), this.labelRenderer.setPendingMeshId(t)
  }
  setSelectedMeshId(t) {
    this.labelFilter.setSelectedMeshId(t), this.visibilityRules.setSelectedMeshId(t)
  }
  toggleInput(t) {
    this.labelNavInput.toggleInput(t)
  }
  subscribe(t) {
    return this.spawner.subscribe(t)
  }
  onUpdate() {
    this.visibilityRules && this.visibilityRules.onUpdate()
  }
}
