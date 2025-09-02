import { Color, Plane, Ray, Vector3 } from "three"
import { DisableCursorMeshCommand, SetMouseCursorCommand } from "../command/cursor.command"
import { DollhouseVerticalLimitsCommand } from "../command/dollhouse.command"
import {
  LabelDeleteCommand,
  LabelEditorCreateCommand,
  LabelEditorDisableCommand,
  LabelEditorDiscardCommand,
  LabelEditorEditCommand,
  LabelEditorEnableCommand,
  LabelRenameCommand,
  LabelToggleSelectCommand,
  LabelVisibleCommand
} from "../command/label.command"
import { NavigateToLabelCommand } from "../command/navigation.command"
import { RoomSelectorEnableCommand } from "../command/room.command"
import { PickingPriorityType } from "../const/12529"
import { LinePart } from "../const/54702"
import { CursorStyle } from "../const/cursor.const"
import { KeyboardCode } from "../const/keyboard.const"
import {
  InputSymbol,
  LabelDataSymbol,
  LabelRenderSymbol,
  MeshQuerySymbol,
  RaycasterSymbol,
  WebglRendererSymbol,
  WorkShopLabelsEditSymbol
} from "../const/symbol.const"
import { searchModeType } from "../const/typeString.const"
import { UserLabels } from "../const/userLabels.const"
import { CommandBinder } from "../core/commandBinder"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MessageBus } from "../core/messageBus"
import { Module } from "../core/module"
import { createSubscription, ISubscription } from "../core/subscription"
import { FloorsViewData } from "../data/floors.view.data"
import { LabelData } from "../data/label.data"
import { LabelEditorData } from "../data/label.editor.data"
import { LayersData } from "../data/layers.data"
import { PointerData } from "../data/pointer.data"
import { SearchData } from "../data/search.data"
import { SweepsData } from "../data/sweeps.data"
import { EditorEntityAdapter } from "../editorEntityAdapter"
import { BaseExceptionError } from "../error/baseException.error"
import { InputClickerEndEvent } from "../events/click.event"
import { DraggerMoveEvent, DraggerWaitingEvent } from "../events/drag.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { LongPressDoneEvent, LongPressEndEvent, LongPressMoveEvent, LongPressProgressEvent } from "../events/longPress.event"
import { OnMouseDownEvent, OnMoveEvent } from "../events/mouse.event"
import { InputState } from "../webgl/input.state"
import { DragAndDropObject } from "../message/event.message"
import {
  AnnotationAddMessage,
  AnnotationCanceled,
  AnnotationPlaced,
  AnnotationRemove,
  AnnotationText,
  FocusLabelEditorMessage
} from "../message/annotation.message"
import { AppChangeMessage } from "../message/app.message"
import { ModelViewChangeCompleteMessage } from "../message/layer.message"
import { TourStartedMessage, TourStoppedMessage } from "../message/tour.message"
import { StartViewmodeChange } from "../message/viewmode.message"
import { LabelObject } from "../object/label.object"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { winCanTouch } from "../utils/browser.utils"
import { Comparator } from "../utils/comparator"
import { ViewModes } from "../utils/viewMode.utils"
import { createCommandBinderSubscription } from "../webgl/20043"
import { RoomMeshCheck } from "../webgl/26269"
import { AnimationProgress } from "../webgl/animation.progress"
import { LabelMakerMesh } from "../webgl/label.maker.mesh"
import { OpacityEnum } from "../webgl/label.mesh"
import { ShowcaseLineSegments } from "../webgl/line.segments"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import { DirectionVector } from "../webgl/vector.const"
import InputIniModule from "./inputIni.module"
import { makeLineMaterial } from "./lines.module"
import UserLabelsModule from "./userLabels.module"
declare global {
  interface SymbolModule {
    [WorkShopLabelsEditSymbol]: LabelsEditorModule
  }
}

class LabelseditorNotfound extends BaseExceptionError {
  constructor() {
    super()
    this.name = "LabelsEditor.NotFound"
  }
}

const EditDebugInfo = new DebugInfo("edit")
const z = t => {
  const e = EditDebugInfo.debug
  return createSubscription(
    () => e(`${t}.renew()`),
    () => e(`${t}.cancel()`),
    !1
  )
}
class LabelsEditor extends DragAndDropObject.DragAndDrop {
  editorData: LabelEditorData
  input: InputIniModule
  labelRenderer: UserLabelsModule
  floorsViewData: FloorsViewData
  issueCommand: CommandBinder["issueCommand"]
  messageBus: MessageBus
  layersData: LayersData
  dragDuringCreateOccurred: boolean
  selectedInputBindings: ISubscription[]
  limitedSelectionBindings: ISubscription[]
  limitedEditing: boolean
  toggleLimitedEditing: (t: any) => void
  bindInputToEditorStates: () => InputState
  inputStates: InputState
  constructor(t, e, i, s, n, o, r) {
    super(),
      (this.editorData = t),
      (this.input = e),
      (this.labelRenderer = i),
      (this.floorsViewData = s),
      (this.issueCommand = n),
      (this.messageBus = o),
      (this.layersData = r),
      (this.dragDuringCreateOccurred = !1),
      (this.selectedInputBindings = []),
      (this.limitedSelectionBindings = []),
      (this.limitedEditing = !1),
      (this.toggleLimitedEditing = t => {
        this.limitedEditing = t
      }),
      (this.bindInputToEditorStates = () => {
        const t = winCanTouch()
        const e = Comparator.is(t => t instanceof LabelMakerMesh && t.labelVisible())
        const i = createCommandBinderSubscription(this.issueCommand)
        const s = new AggregateSubscription(...[ShowcaseMesh].map(t => this.input.registerPriorityHandler(DraggerMoveEvent, t, () => !0)))
        s.cancel()
        const n = new AggregateSubscription(
          this.input.registerHandler(DraggerMoveEvent, () => {
            this.dragDuringCreateOccurred = !0
          })
        )
        n.cancel()
        const o = t => {
            this.state.currentId && !this.validateViewmode(t.toMode) && this.discard()
          },
          r = () => this.setEnabled(!1),
          d = () => this.setEnabled(!0),
          c = () => this.exit(),
          h = new AggregateSubscription(
            createSubscription(
              () => this.messageBus.subscribe(TourStartedMessage, r),
              () => this.messageBus.unsubscribe(TourStartedMessage, r),
              !1
            ),
            createSubscription(
              () => this.messageBus.subscribe(TourStoppedMessage, d),
              () => this.messageBus.unsubscribe(TourStoppedMessage, d),
              !1
            ),
            createSubscription(
              () => this.messageBus.subscribe(StartViewmodeChange, o),
              () => this.messageBus.unsubscribe(StartViewmodeChange, o),
              !1
            ),
            createSubscription(
              () => this.messageBus.subscribe(ModelViewChangeCompleteMessage, o),
              () => this.messageBus.unsubscribe(ModelViewChangeCompleteMessage, o),
              !1
            ),
            createSubscription(
              () => this.messageBus.subscribe(AppChangeMessage, c),
              () => this.messageBus.unsubscribe(AppChangeMessage, c),
              !1
            )
          ),
          l = new AggregateSubscription(
            this.input.registerMeshHandler(HoverMeshEvent, e, (t, e) => this.hover(e.getId())),
            this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(LabelMakerMesh), () => this.unhover())
          )
        l.cancel()
        const m = this.input.registerUnfilteredHandler(KeyboardCallbackEvent, t => {
          t.key === KeyboardCode.ESCAPE && this.deselect()
        })
        m.cancel()
        const u = new AggregateSubscription(
          this.input.registerPriorityHandler(InputClickerEndEvent, ShowcaseMesh, () => (this.deselect(), !0)),
          this.input.registerPriorityHandler(InputClickerEndEvent, SkySphereMesh, () => (this.deselect(), !0))
        )
        u.cancel()
        const g = new AggregateSubscription(
          this.input.registerMeshHandler(InputClickerEndEvent, Comparator.isType(LabelMakerMesh), this.onToggleSelectInput.bind(this))
        )
        g.cancel()
        const p = new AggregateSubscription(this.input.registerMeshHandler(DraggerWaitingEvent, e, this.placeOnDrag.bind(this)))
        p.cancel()
        const w = this.input.registerUnfilteredHandler(KeyboardCallbackEvent, this.onDeleteKey.bind(this))
        w.cancel()
        const b = this.input.registerUnfilteredHandler(OnMoveEvent, t => this.move(t))
        b.cancel()
        const N = this.input.registerUnfilteredHandler(OnMouseDownEvent, this.editOnPointerUp.bind(this))
        N.cancel()
        const _ = this.input.registerUnfilteredHandler(OnMouseDownEvent, this.dropOnPointerUp.bind(this))
        _.cancel()
        const k = new AggregateSubscription(
          this.input.registerUnfilteredHandler(KeyboardCallbackEvent, t => {
            t.key === KeyboardCode.ESCAPE && this.discard(), t.key === KeyboardCode.RETURN && this.tryCommit()
          })
        )
        k.cancel()
        const H = new AggregateSubscription(
          this.input.registerUnfilteredHandler(LongPressProgressEvent, t => {
            this.editorData.setProgress(t.progress), this.editorData.setScreenPosition(t.clientPosition), this.move(t)
          }),
          this.input.registerUnfilteredHandler(LongPressMoveEvent, t => {
            this.editorData.setScreenPosition(t.clientPosition), this.move(t)
          }),
          this.input.registerUnfilteredHandler(LongPressDoneEvent, t => {
            this.editorData.setProgress(0), this.editorData.setScreenPosition(null)
            const e = this.editorData.getLabel(this.state.currentId)
            e && ((e.visible = !0), e.commit())
          }),
          this.input.registerUnfilteredHandler(LongPressEndEvent, t => {
            this.editorData.setProgress(0), this.editorData.setScreenPosition(null)
            !t.cancelled && this.state.pendingValid && this.state.currentId ? this.edit(this.state.currentId) : this.discard()
          }),
          z("ToolState.ADDING -> (touch) bindings")
        )
        H.cancel()
        const F = new AggregateSubscription(h, l, g, z("ToolState.IDLE -> bindings"))
        this.selectedInputBindings.push(h, i, g, m, u, l, p, w, z("ToolState.SELECTED -> bindings")),
          this.limitedSelectionBindings.push(h, g, m, u, l, z("ToolState.SELECTED (Limited) -> bindings"))
        const W = new AggregateSubscription(h, n, i, k, z("ToolState.ADDING -> (base) bindings")),
          G = new AggregateSubscription(h, i, s, k, z("ToolState.PLACING -> (base) bindings")),
          Z = new AggregateSubscription(h, l, i, z("ToolState.EDITING -> (all) bindings"))
        return new InputState([
          { state: DragAndDropObject.ToolState.DISABLED, subs: [h] },
          { state: DragAndDropObject.ToolState.IDLE, subs: [F, p] },
          { state: DragAndDropObject.ToolState.SELECTED, subs: this.selectedInputBindings },
          { state: DragAndDropObject.ToolState.ADDING, subs: t ? [W, H] : [W, b, N] },
          { state: DragAndDropObject.ToolState.PLACING, subs: [G, b, _] },
          { state: DragAndDropObject.ToolState.EDITING, subs: [Z] }
        ])
      })
    const d = [
      this.subscribe(DragAndDropObject.Events.StateChange, async ({ target: t }) => {
        this.inputStates || (this.inputStates = this.bindInputToEditorStates()),
          this.inputStates.cancel(),
          (this.dragDuringCreateOccurred = !1),
          this.limitedEditing
            ? this.inputStates.update(DragAndDropObject.ToolState.SELECTED, this.limitedSelectionBindings)
            : this.inputStates.update(DragAndDropObject.ToolState.SELECTED, this.selectedInputBindings),
          this.inputStates.renew(t),
          this.editorData.setToolState(t)
        const e = t !== DragAndDropObject.ToolState.CLOSED && t !== DragAndDropObject.ToolState.DISABLED,
          i = t === DragAndDropObject.ToolState.CLOSED || void 0
        await this.issueCommand(new DollhouseVerticalLimitsCommand({ phiLowerLimitDegrees: e ? 15 : void 0, noTransition: i }))
      }),
      this.subscribe(DragAndDropObject.Events.CurrentChange, ({ target: t }) => {
        this.editorData.setCurrentId(t), this.labelRenderer.setSelectedMeshId(t)
      }),
      this.subscribe(DragAndDropObject.Events.Move, t => {
        this.editorData.setScreenPosition(t.ev.clientPosition)
      }),
      this.subscribe(DragAndDropObject.Events.AddDiscard, () => this.editorData.setPending(null)),
      this.subscribe(DragAndDropObject.Events.AddConfirm, () => this.editorData.setPending(null)),
      this.editorData.onPendingChanged(t => {
        this.labelRenderer.setPendingMeshId(t ? t.sid : null)
      })
    ]
    d.forEach(t => t.cancel()), this.bindings.push(...d)
  }
  validateViewmode(t) {
    return t === ViewModes.Floorplan || t === ViewModes.Dollhouse
  }
  dropOnPointerUp(t) {
    if (!t.down) {
      !1 !== this.state.pendingValid ? this.tryCommit() : this.discard()
    }
  }
  editOnPointerUp(t) {
    if (!t.down && this.state.currentId) {
      if (this.dragDuringCreateOccurred) return void (this.dragDuringCreateOccurred = !1)
      !1 !== this.state.pendingValid ? (this.edit(this.state.currentId), this.select(this.state.currentId, { transitionTo: void 0 })) : this.discard()
    }
  }
  onDeleteKey(t) {
    if (t.key === KeyboardCode.DELETE) {
      const t = this.state.selected
      t && this.onDeleteLabelCommand({ sids: [t] }), this.discard()
    }
  }
  onToggleSelectInput(t, e) {
    setTimeout(() => this.toggleSelect(e.getId()), 0)
  }
  placeOnDrag(t, e) {
    const i = e.getId()
    this.state.selected !== i && this.select(i)
    const s = new LabelObject().copy(e.data)
    this.onDiscard(() => {
      e.data.copy(s)
    }),
      this.place(i)
  }
  async addLabel() {
    const t = new LabelObject()
    ;(t.sid = this.editorData.data.generateSid()),
      (t.layerId = this.layersData.activeLayerId),
      (t.text = "Label"),
      (t.visible = !winCanTouch()),
      (t.floorId = this.floorsViewData.getHighestVisibleFloorId()),
      t.commit(),
      this.labelRenderer.addLabelMesh(t, t.sid),
      this.editorData.setPending(t),
      this.add(t.sid)
  }
  async onToggleSelectCommand({ sid: t }) {
    this.state.toolState !== DragAndDropObject.ToolState.DISABLED &&
      (this.deselect(),
      this.issueCommand(new NavigateToLabelCommand(this.editorData.data.getLabel(t))).then(() => {
        this.state.toolState !== DragAndDropObject.ToolState.CLOSED && this.state.toolState !== DragAndDropObject.ToolState.DISABLED && this.toggleSelect(t)
      }))
  }
  onDeleteLabelCommand({ sids: t }) {
    for (const e of t) {
      e === this.editorData.currentId && this.deselect()
      const t = new LabelObject().copy(this.editorData.data.getLabel(e))
      if (!this.editorData.data.remove(e)) throw new LabelseditorNotfound(`Could not delete label ${e}`)
      this.messageBus.broadcast(new AnnotationRemove(t))
    }
  }
  onSetLabelTextCommand({ sid: t, text: e }) {
    const i = this.editorData.getLabel(t)
    if (i) {
      ;(i.text = e), i.commit()
      this.tryCommit() && this.deselect()
    }
  }
  onLabelVisibleCommand({ sids: t, visible: e }) {
    for (const i of t) {
      const t = this.editorData.getLabel(i)
      t &&
        ((t.visible = e), t.commit(), e || this.editorData.currentId !== i || (this.editorData.setCurrentId(null), this.labelRenderer.setSelectedMeshId(null)))
    }
  }
  deselect(t) {
    try {
      super.deselect(t)
    } catch (t) {}
  }
}
class J {
  raycaster: any
  raycasterData: any
  input: any
  editor: any
  renderer: any
  floorsViewData: any
  meshQuery: any
  sweepData: any
  appStateBindings: never[]
  state: { moveTarget: string; anchorRay: Ray; anchorOffset: Vector3; lastIntersectedFloorId: string; lastValidIntersectionHeight: number }
  onAdded: (t: any, e: any) => void
  editableEntities: any
  onRemoved: (t: any, e: any) => void
  mover: { onMove: (t: any, e: any) => void }
  constructor(t, e, i, s, n, a, o, r) {
    ;(this.raycaster = t),
      (this.raycasterData = e),
      (this.input = i),
      (this.editor = s),
      (this.renderer = n),
      (this.floorsViewData = a),
      (this.meshQuery = o),
      (this.sweepData = r),
      (this.appStateBindings = []),
      (this.state = { moveTarget: "", anchorRay: new Ray(), anchorOffset: new Vector3(), lastIntersectedFloorId: "", lastValidIntersectionHeight: 0 }),
      (this.onAdded = (t, e) => {
        this.input.registerMesh(t.text.collider, !1), this.editableEntities.registerEntity(e, this, t)
      }),
      (this.onRemoved = (t, e) => {
        this.input.unregisterMesh(t.text.collider), this.editableEntities.unregisterEntity(e)
      }),
      (this.mover = {
        onMove: (t, e) => {
          const { meshQuery: i, renderer: s } = this,
            n = s.getLabelMesh(t)
          if (n) {
            const t = this.getFallbackIntersection(),
              { valid: e, room: s } = this.validatePosition(t)
            if (t && e) {
              const e = i.mdsFloorIdFromObject(s)
              e && RoomMeshCheck.isVisibleRoomMesh(s) && ((n.data.floorId = e), (n.data.roomId = i.mdsRoomIdFromObject(s))), n.data.position.copy(t)
            } else this.raycasterData.pointerRay.at(10, n.data.position)
            n.data.commit()
          }
        }
      }),
      (this.validatePosition = (() => {
        const t = [DirectionVector.DOWN, DirectionVector.UP]
        return e => {
          if (!e) return { valid: !1 }
          const i = this.floorsViewData.getHighestVisibleFloorId()
          for (const s of t) {
            const t = this.raycaster.pick(e, s, RoomMeshCheck.isVisibleRoomMesh)
            if (t && RoomMeshCheck.isVisibleRoomMesh(t.object)) {
              const e = t.object,
                s = this.meshQuery.floorIdFromObject(t.object) === i
              if (s) return { valid: s, room: e }
            }
          }
          return { valid: !1 }
        }
      })()),
      (this.getFallbackIntersection = (() => {
        const t = new Plane(),
          e = new Vector3(),
          i = new Vector3(),
          s = new Vector3()
        return (n = this.raycasterData.pointerRay) => {
          this.floorsViewData.getHighestVisibleFloorId() !== this.state.lastIntersectedFloorId &&
            ((this.state.lastIntersectedFloorId = this.floorsViewData.getHighestVisibleFloorId()),
            (this.state.lastValidIntersectionHeight = this.getFloorHeight(this.state.lastIntersectedFloorId)))
          const a = this.raycaster.pick(n.origin, n.direction, RoomMeshCheck.isVisibleRoomMesh)
          if (a) {
            s.set(0, 1, 0).add(a.point)
            const t = this.sweepData.getClosestSweep(s, !0)
            t && (this.state.lastValidIntersectionHeight = t.position.y)
          }
          return t.setFromNormalAndCoplanarPoint(DirectionVector.UP, i.set(0, this.state.lastValidIntersectionHeight, 0)), n.intersectPlane(t, e)
        }
      })()),
      (this.getFloorHeight = t => {
        let e = this.floorsViewData.getHighestVisibleFloor()
        try {
          e = this.floorsViewData.getFloor(t)
        } catch (t) {}
        return e.medianSweepHeight()
      }),
      (this.editableEntities = new EditorEntityAdapter(this.editor)),
      this.editor.setValidator(this)
  }

  activate() {
    this.renderer.toggleInput(!1),
      0 === this.appStateBindings.length && this.appStateBindings.push(this.renderer.subscribe({ onAdded: this.onAdded, onRemoved: this.onRemoved })),
      this.appStateBindings.forEach(t => t.renew())
    for (const t of this.renderer.labelMeshIterator()) this.onAdded(t, t.getId())
  }
  deactivate() {
    for (const t of this.renderer.labelMeshIterator()) this.onRemoved(t, t.getId())
    this.appStateBindings.forEach(t => t.cancel()), this.renderer.toggleInput(!0)
  }
  validate(t, e) {
    const i = this.getFallbackIntersection()
    return this.validatePosition(i).valid
  }
}
class ot {
  floorsViewData: any
  opacityAnim: AnimationProgress
  line: ShowcaseLineSegments
  constructor(t, e) {
    ;(this.floorsViewData = e), (this.opacityAnim = new AnimationProgress(0))
    const i = makeLineMaterial(new Color(16777215).getHex(), !0, { linewidth: 6 }),
      s = new ShowcaseLineSegments(new Vector3(), new Vector3(), i, {})
    s.setRenderOrder(PickingPriorityType.lines), s.opacity(0), (this.line = s), t.add(this.line.getMesh(LinePart.line))
  }
  setVisible(t) {
    const e = t ? 1 : 0
    this.opacityAnim.endValue !== e && this.opacityAnim.modifyAnimation(this.opacityAnim.value, e, UserLabels.FADE_DURATION)
  }
  update(t, e) {
    const i = new Vector3().copy(t),
      s = null != e ? e : this.floorsViewData.getHighestVisibleFloorId()
    ;(i.y = this.floorsViewData.getFloorMin(s)), this.line.updatePositions(t, i)
  }
  init() {}
  render(t) {
    this.opacityAnim.tick(t), this.line.opacity(this.opacityAnim.value)
  }
  dispose() {}
  activate(t) {}
  deactivate(t) {}
}
export default class LabelsEditorModule extends Module {
  toggleLimitedEditing: (t: any) => void
  labelsEditor: any
  selectedItemChanged: () => void

  editorData: LabelEditorData
  updateMaxOpacity: (t: any, e: any) => void
  labelsData: any
  labelRenderer: any
  updateSelectedLine: ({ target: t }: { target: any }, e: any) => void
  selectedLabelMesh: any
  labelsDataModule: any
  layersData: any
  engine: any
  labelsInput: J
  constructor() {
    super(...arguments),
      (this.name = "labels-editor"),
      (this.toggleLimitedEditing = t => {
        this.labelsEditor.toggleLimitedEditing(!0 === t), !0 === t || t === searchModeType.LABEL ? this.enableEditing() : this.disableEditing()
      }),
      (this.selectedItemChanged = () => {
        // const { activeItemId: t, selectedType: e } = this.searchData,
        //   { currentId: i } = this.editorData
        // !i || (t && e === searchModeType.LABEL) || this.labelsEditor.deselect()
      }),
      (this.updateMaxOpacity = (t, e) => {
        this.labelsData.iterate((e, i) => {
          const s = this.labelRenderer.getLabelMesh(i)
          s && (t === i || null === t ? s.setMaxOpacity(OpacityEnum.OpacityMaxDefault) : s.setMaxOpacity(OpacityEnum.OpacityMaxNonSelected))
        })
      }),
      (this.updateSelectedLine = ({ target: t }, e) => {
        if ((e && this.selectedLabelMesh.setVisible(!!t), t)) {
          const e = this.labelRenderer.getLabelMesh(t)
          e ? this.selectedLabelMesh.update(e.data.position, e.data.floorId) : this.log.warn("Unable to find label mesh")
        }
      })
  }
  async init(t, e: EngineContext) {
    // ;([this.labelsData, this.labelsDataModule, this.layersData, this.searchData] = await Promise.all([
    ;([this.labelsData, this.labelsDataModule, this.layersData] = await Promise.all([
      e.market.waitForData(LabelData),
      e.getModuleBySymbol(LabelDataSymbol),
      e.market.waitForData(LayersData)
      // e.market.waitForData(SearchData)
    ])),
      (this.engine = e)
    const [i, s, a, o, r, d, c, w] = await Promise.all([
      e.getModuleBySymbol(InputSymbol),
      e.getModuleBySymbol(RaycasterSymbol),
      e.getModuleBySymbol(LabelRenderSymbol),
      e.market.waitForData(PointerData),
      e.market.waitForData(FloorsViewData),
      e.market.waitForData(SweepsData),
      e.getModuleBySymbol(WebglRendererSymbol),
      e.getModuleBySymbol(MeshQuerySymbol)
    ])
    ;(this.labelRenderer = a),
      (this.editorData = new LabelEditorData(this.labelsData)),
      e.market.register(this, LabelEditorData, this.editorData),
      (this.labelsEditor = new LabelsEditor(this.editorData, i, a, r, e.commandBinder.issueCommand, e.msgBus, this.layersData)),
      (this.labelsInput = new J(s.picking, o, i, this.labelsEditor, a, r, w, d)),
      (this.selectedLabelMesh = new ot(c.getScene(), r)),
      e.addComponent(this, this.selectedLabelMesh),
      this.observeEditorEvents(),
      this.bindings.push(
        e.commandBinder.addBinding(LabelEditorEnableCommand, async () => this.enableEditing()),
        e.commandBinder.addBinding(LabelEditorDisableCommand, async () => this.disableEditing()),
        e.commandBinder.addBinding(LabelEditorEditCommand, async ({ sid: t }) => this.labelsEditor.edit(t)),
        e.commandBinder.addBinding(LabelEditorCreateCommand, async () => this.labelsEditor.addLabel()),
        e.commandBinder.addBinding(LabelEditorDiscardCommand, async () => this.labelsEditor.discard()),
        e.commandBinder.addBinding(LabelToggleSelectCommand, async t => this.labelsEditor.onToggleSelectCommand(t)),
        e.commandBinder.addBinding(LabelRenameCommand, async t => {
          this.labelsEditor.onSetLabelTextCommand(t), this.labelsDataModule.save()
        }),
        e.commandBinder.addBinding(LabelDeleteCommand, async t => {
          this.labelsEditor.onDeleteLabelCommand(t), this.labelsDataModule.save()
        }),
        e.commandBinder.addBinding(LabelVisibleCommand, async t => {
          this.labelsEditor.onLabelVisibleCommand(t), this.labelsDataModule.save()
        }),
        this.layersData.onPropertyChanged("activeLayerId", () => this.updatePendingLabel())
        // this.searchData.onPropertyChanged("searchMode", this.toggleLimitedEditing),
        // this.searchData.onPropertyChanged("activeItemId", this.selectedItemChanged)
      )
    // this.toggleLimitedEditing(this.searchData.searchMode)
  }
  enableEditing() {
    this.labelsEditor.state.toolState === DragAndDropObject.ToolState.CLOSED && this.labelsEditor.start()
  }
  disableEditing() {
    this.labelsEditor.exit()
  }
  updatePendingLabel() {
    const t = this.editorData.pendingLabel
    if (t && !this.layersData.isInMemoryLayer(t.layerId)) {
      const e = this.layersData.activeLayerId
      ;(t.layerId = e), t.commit()
    }
  }
  observeEditorEvents() {
    this.bindings.push(
      this.labelsEditor.subscribe(DragAndDropObject.Events.Start, async () => {
        this.labelsInput.activate()
      }),
      this.labelsEditor.subscribe(DragAndDropObject.Events.Exit, () => {
        this.labelsInput.deactivate()
      }),
      this.labelsEditor.subscribe(DragAndDropObject.Events.SelectChange, ({ target: t, previous: e }) => this.updateMaxOpacity(t, e)),
      this.labelsEditor.subscribe(DragAndDropObject.Events.CurrentChange, this.updateCursors.bind(this)),
      this.labelsEditor.subscribe(DragAndDropObject.Events.ValidChange, this.updateCursors.bind(this)),
      this.labelsEditor.subscribe(DragAndDropObject.Events.HoverChange, this.updateCursors.bind(this)),
      this.labelsEditor.subscribe(DragAndDropObject.Events.AddDiscard, () => this.updateMaxOpacity(null, null)),
      this.labelsEditor.subscribe(DragAndDropObject.Events.AddStart, ({ target: t }) => this.updateMaxOpacity(t, null))
    ),
      this.bindings.push(
        this.labelsEditor.subscribe(DragAndDropObject.Events.EditStart, ({ placeOnly: t }) => {
          t || this.engine.broadcast(new FocusLabelEditorMessage())
        }),
        this.labelsEditor.subscribe(DragAndDropObject.Events.EditConfirm, ({ target: t }) => {
          const e = this.labelsDataModule.getDiffRecord()
          this.labelsDataModule.save()
          const i = this.labelRenderer.getLabelMesh(t)
          if (i) {
            const t = i.data,
              s = e.find(e => e.index === t.sid)
            s &&
              (void 0 !== s.diff.position && this.engine.broadcast(new AnnotationPlaced(t, t.position)),
              s.diff.text !== t.text && this.engine.broadcast(new AnnotationText(t)))
          }
        }),
        this.labelsEditor.subscribe(DragAndDropObject.Events.AddStart, async () => {
          ;(await this.engine.commandBinder.issueCommand(new NavigateToLabelCommand({ viewmodeOnly: !0 }))) || this.labelsEditor.setEnabled(!1),
            this.engine.commandBinder.issueCommandWhenBound(new RoomSelectorEnableCommand(!0))
        }),
        this.labelsEditor.subscribe(DragAndDropObject.Events.EditDiscard, ({ target: t }) => {}),
        this.labelsEditor.subscribe(DragAndDropObject.Events.AddConfirm, ({ target: t }) => {
          const e = this.labelRenderer.getLabelMesh(t)
          if ((this.log.debug("Label creation confirmed", { pendingMesh: e }), e)) {
            const t = e.data
            this.labelsData.add(e.data),
              this.labelsData.commit(),
              this.labelsDataModule.save(),
              this.engine.broadcast(new AnnotationPlaced(t, t.position)),
              this.engine.broadcast(new AnnotationAddMessage(t))
          }
          this.engine.commandBinder.issueCommandWhenBound(new RoomSelectorEnableCommand(!1))
        }),
        this.labelsEditor.subscribe(DragAndDropObject.Events.AddDiscard, ({ target: t }) => {
          const e = this.labelRenderer.getLabelMesh(t)
          e &&
            (this.engine.broadcast(new AnnotationCanceled(e.data)),
            this.labelRenderer.freeLabelMesh(e),
            this.log.debug("Label creation discarded", { pendingMesh: e })),
            this.engine.commandBinder.issueCommandWhenBound(new RoomSelectorEnableCommand(!1))
        }),
        this.labelsEditor.subscribe(DragAndDropObject.Events.ValidChange, t => this.updateSelectedLine(t, !0)),
        this.labelsEditor.subscribe(DragAndDropObject.Events.Move, t => this.updateSelectedLine(t, !1)),
        this.labelsEditor.subscribe(DragAndDropObject.Events.SelectChange, t => this.updateSelectedLine(t, !0))
      )
  }
  dispose(t) {
    this.labelsEditor.exit(), this.labelsInput.appStateBindings.forEach(t => t.cancel()), t.market.unregister(this, LabelEditorData), super.dispose(t)
  }
  updateCursors() {
    const { hovered: t, selected: e, pendingAdd: i, pendingEdit: s, pendingValid: n } = this.labelsEditor.state,
      a =
        (i || s) && !1 === n
          ? CursorStyle.NOPE
          : i || s
            ? CursorStyle.FINGER
            : e && t && e === t
              ? CursorStyle.MOVE
              : e && t && e !== t
                ? CursorStyle.GRAB
                : t
                  ? CursorStyle.FINGER
                  : CursorStyle.DEFAULT,
      c = a !== CursorStyle.DEFAULT
    this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(a)), this.engine.commandBinder.issueCommand(new DisableCursorMeshCommand(c))
  }
}
