import { AlwaysDepth, DoubleSide, Line3, MathUtils, Quaternion, Raycaster, Vector2, Vector3 } from "three"
import { DragAndDropObject } from "../message/event.message"

import { FeaturesSweepPucksKey } from "../const/sweep.const"
import {
  CameraSymbol,
  InputSymbol,
  ModelMeshSymbol,
  RaycasterSymbol,
  RoomBoundDataSymbol,
  RoomBoundRendererSymbol,
  WebglRendererSymbol,
  WorkShopRoomBoundToolSymbol
} from "../const/symbol.const"
import { ToolPanelLayout } from "../const/tools.const"
import { RelativePosType, WallOpening } from "../webgl/80978"
import { DirectionVector } from "../webgl/vector.const"
import ue from "classnames"
import * as Ft from "react"
import * as Ht from "react/jsx-runtime"
import * as Qt from "../other/2098"
import * as $t from "../other/6608"
import { NoTransitionViewmodeCommand, TransitionViewmodeCommand } from "../command/camera.command"
import { UnlockFloorNavCommand } from "../command/floors.command"
import * as lt from "../const/61282"
import { AnnotationGrouping } from "../const/63319"
import { TargetPhi } from "../const/64918"
import { AppReactContext } from "../context/app.context"
import { DebugInfo } from "../core/debug"
import { DraggerMoveEvent, DraggerWaitingEvent, DraggeringEvent } from "../events/drag.event"
import * as le from "../other/17462"
import * as qt from "../other/21829"
import * as ce from "../other/31131"
import * as Kt from "../other/38242"
import * as oe from "../other/38490"
import * as Xt from "../other/44472"
import * as Zt from "../other/60543"
import * as Gt from "../other/66102"
import * as zt from "../other/77230"
import * as Jt from "../other/84426"
import * as de from "../other/89478"
import * as Yt from "../other/96403"
import * as he from "../other/98025"
import { winCanTouch } from "../utils/browser.utils"
import { LocationType, Room, extractRoomKeywords, getRoomConfig } from "../webgl/room"
declare global {
  interface SymbolModule {
    [WorkShopRoomBoundToolSymbol]: RoomToolModule
  }
}
enum B {
  LINE = 1,
  NONE = 0,
  POINT = 2
}
const x = (() => {
    const t = new Vector2(),
      e = { target: new Vector3(), closestLine: new Line3(), orthoLine: new Line3(), targetType: B.NONE }
    return (i, s, n, a) => {
      e.target.copy(a), (e.targetType = B.NONE)
      let o = Number.MIN_VALUE
      const r = P(i, n)
      for (const t of r) {
        const { dist: i, weight: n, closestPt: r } = V(t, a, s)
        i < 15 && n > o && ((o = n), e.target.copy(r), e.closestLine.copy(t), (e.targetType = B.LINE))
      }
      if (e.targetType === B.LINE) {
        let o = Number.MIN_VALUE
        const r = P(i, n)
        for (const i of r)
          if (L(i, e.closestLine)) {
            const { dist: n, weight: r } = V(i, a, s)
            if (n < 7.5 && r > o) {
              checkLineSegmentsIntersection(
                i.start.x,
                i.start.z,
                i.end.x,
                i.end.z,
                e.closestLine.start.x,
                e.closestLine.start.z,
                e.closestLine.end.x,
                e.closestLine.end.z,
                t
              ) && ((o = r), e.target.set(t.x, 0, t.y), e.orthoLine.copy(i), (e.targetType = B.POINT))
            }
          }
      }
      return e
    }
  })(),
  P = (() => {
    const t = new Line3(new Vector3(), new Vector3()),
      e = new Vector3(),
      i = new Vector3(),
      s = new Vector3(),
      n = new Vector3(0, 1, 0)
    return function* (a, o) {
      const r = a.getWallsForNode(o),
        d = a.getWallsForFloor(o.floorId)
      if (d)
        for (const a of d)
          if (!r.has(a)) {
            const o = a.from.getVec3(e),
              r = a.to.getVec3(i)
            t.set(o, r), yield t, s.subVectors(r, o).normalize(), s.applyAxisAngle(n, Math.PI / 2)
            const d = i.addVectors(o, s)
            t.set(o, d), yield t
            const c = a.to.getVec3(e),
              h = i.addVectors(c, s)
            t.set(c, h), yield t
          }
    }
  })(),
  A = (() => {
    const t = new Vector2(),
      e = new Vector2(),
      i = new Vector3()
    return (s, n, a) => {
      const o = getScreenAndNDCPosition(s, n, t, i).screenPosition,
        r = getScreenAndNDCPosition(s, a, e, i).screenPosition
      return o.distanceTo(r)
    }
  })(),
  V = (() => {
    const t = { dist: 0, weight: 0, closestPt: new Vector3() }
    return (e, i, s) => {
      const n = e.closestPointToPoint(i, !1, t.closestPt),
        a = A(s, n, i)
      t.dist = a
      const o = A(s, e.start, n)
      return (t.weight = Math.max(5 - 0.0025 * o, 0)), t
    }
  })(),
  L = (() => {
    const t = new Vector3(),
      e = new Vector3()
    return (i, s) => (t.subVectors(i.end, i.start).normalize(), e.subVectors(s.end, s.start).normalize(), Math.abs(t.dot(e)) < 0.1)
  })()
enum N {
  DOORS = 1,
  OPENINGS = 2,
  WALLS = 0
}
enum j {
  END = 2,
  MOVE = 0,
  START = 1
}
class _ extends DragAndDropObject.State {
  constructor() {
    super(...arguments),
      (this.addType = N.WALLS),
      (this.wallType = WallType.SOLID),
      (this.wallOpeningType = RelativePosType.DOOR),
      (this.openingEditState = j.MOVE),
      (this.cursor = CursorStyle.ROOMBOUNDS_DEFAULT)
  }
}
const H = 0.0666
class F extends InputManager {
  constructor(t, e, i, s, n, a) {
    super(t, e),
      (this.roomBoundEditor = t),
      (this.getCursorOrigin = i),
      (this.cameraData = s),
      (this.snappingAxesRenderer = n),
      (this.keyboardState = a),
      (this.writeBindings = []),
      (this.edgeStateOnDragStart = {
        fromOffset: new Vector3(),
        toOffset: new Vector3(),
        initialGrabPt: new Vector3(),
        dragDir: new Vector3(),
        fromDirection: new Vector3(),
        toDirection: new Vector3()
      }),
      (this.openingStateOnDragStart = { relativeStart: 0, relativeEnd: 0, wallLine: new Line3() }),
      (this.onMoveStart = ({ target: t, placeOnly: e }) => {
        if (t && e) {
          const e = this.data.getEntity(t)
          e instanceof RoomWall
            ? this.onWallMoveStart(e)
            : e instanceof WallOpening
              ? this.onWallOpeningMoveStart(e)
              : e instanceof RbushBboxNode && this.onWallNodeMoveStart(e)
        }
      }),
      (this.mover = {
        onMove: (t, e) => {
          const { data: i, editor: s } = this
          if (!s.state.currentId) return
          const n = s.state.toolState === DragAndDropObject.ToolState.ADDING ? i.getWall(s.state.currentId).to : i.getEntity(s.state.currentId),
            a = this.getCursorOrigin()
          n instanceof RbushBboxNode
            ? this.onMoveNode(n, a)
            : n instanceof RoomWall
              ? this.onMoveWall(n, a)
              : n instanceof WallOpening && this.onMoveWallOpening(n, a)
        }
      }),
      (this.mergePointAndStartNewWall = ({ target: t }) => {
        const { editor: e } = this
        if (e.state.toolState === DragAndDropObject.ToolState.ADDING && t) {
          const e = this.data.getWall(t).to.id,
            i = this.data.getNode(e),
            s = i.getVec3(),
            n = this.data.findNodeOrWallForPosition(s, i.floorId, this.data.getAttachedEntities(i)),
            a = this.checkForNodeOrWallHit(e)
          if ((this.data.finalizeHistory(), a || n)) this.editor.discard(), this.editor.select(e), this.snappingAxesRenderer.hide()
          else {
            const { wall: t } = this.data.addTrailingEdgeToNode(
              this.roomBoundEditor.state.wallType,
              e,
              this.getCursorOrigin(),
              this.data.getLastWallWidth(this.roomBoundEditor.state.wallType)
            )
            this.editor.add(t)
          }
        }
      }),
      (this.finalizeMovePt = ({ target: t }) => {
        if (t) {
          const e = this.data.getEntity(t)
          ;(e instanceof RoomWall || e instanceof RbushBboxNode) && this.mergeOverlapsOnMoveEnd(e),
            this.data.finalizeHistory(),
            this.snappingAxesRenderer.hide()
        }
      }),
      (this.killLastWall = ({ target: t }) => {
        const { data: e, editor: i } = this
        i.state.toolState === DragAndDropObject.ToolState.ADDING &&
          (this.clearHighlightedViews(), t && this.data.undo(), e.finalizeHistory(), this.snappingAxesRenderer.hide())
      })
  }
  activate() {
    super.activate(),
      0 === this.writeBindings.length
        ? this.writeBindings.push(
            this.editor.subscribe(DragAndDropObject.Events.EditStart, this.onMoveStart),
            this.editor.subscribe(DragAndDropObject.Events.AddConfirm, this.mergePointAndStartNewWall),
            this.editor.subscribe(DragAndDropObject.Events.EditConfirm, this.finalizeMovePt),
            this.editor.subscribe(DragAndDropObject.Events.AddDiscard, this.killLastWall)
          )
        : this.writeBindings.forEach(t => t.renew())
  }
  deactivate() {
    super.deactivate(), this.writeBindings.forEach(t => t.cancel())
  }
  onWallMoveStart(t) {
    const e = this.getCursorOrigin()
    t.from.getVec3(this.edgeStateOnDragStart.fromOffset),
      t.to.getVec3(this.edgeStateOnDragStart.toOffset),
      this.edgeStateOnDragStart.fromOffset.sub(e),
      this.edgeStateOnDragStart.toOffset.sub(e),
      this.edgeStateOnDragStart.initialGrabPt.copy(e),
      t.getDirection(this.edgeStateOnDragStart.dragDir),
      this.edgeStateOnDragStart.dragDir.normalize(),
      this.edgeStateOnDragStart.dragDir.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2)
    const i = this.edgeStateOnDragStart.dragDir,
      s = this.needsWallJoint(t, t.from, i),
      n = this.needsWallJoint(t, t.to, i)
    ;(s || n) && this.data.addWallJoint(t.id, s ? t.from.id : void 0, n ? t.to.id : void 0),
      this.getWallDirection(t, t.from, i, this.edgeStateOnDragStart.fromDirection),
      this.getWallDirection(t, t.to, i, this.edgeStateOnDragStart.toDirection),
      i.dot(this.edgeStateOnDragStart.fromDirection) < 0 && this.edgeStateOnDragStart.fromDirection.multiplyScalar(-1),
      i.dot(this.edgeStateOnDragStart.toDirection) < 0 && this.edgeStateOnDragStart.toDirection.multiplyScalar(-1)
    const a = Array.from(this.data.getWallsForNode(t.from)).concat(Array.from(this.data.getWallsForNode(t.to)))
    this.editor.highlight(...a.map(t => t.id))
  }
  onWallOpeningMoveStart(t) {
    const e = this.data.getWall(t.wallId),
      { wallLine: i } = this.openingStateOnDragStart
    e.from.getVec3(i.start), e.to.getVec3(i.end)
    const s = (t.width / this.openingStateOnDragStart.wallLine.distance()) * 0.5
    ;(this.openingStateOnDragStart.relativeStart = t.relativePos - s), (this.openingStateOnDragStart.relativeEnd = t.relativePos + s)
  }
  onWallNodeMoveStart(t) {
    const e = Array.from(this.data.getWallsForNode(t))
    this.editor.highlight(...e.map(t => t.id))
  }
  onMoveNode(t, e) {
    const i = new Vector3(),
      s = this.tryApplySnapping(e, t, i)
    if (this.data.canMoveNode(t.id, i)) {
      if (s) {
        const { closestLine: t, orthoLine: e, targetType: i } = s
        i === B.LINE || i === B.POINT
          ? i === B.POINT
            ? this.snappingAxesRenderer.showAt(t, e)
            : this.snappingAxesRenderer.showAt(t)
          : this.snappingAxesRenderer.hide()
      } else this.snappingAxesRenderer.hide()
      this.data.moveNode(t.id, i)
    } else this.snappingAxesRenderer.hide()
  }
  onMoveWall(t, e) {
    const { initialGrabPt: i, dragDir: s, fromOffset: n, toOffset: a, fromDirection: o, toDirection: r } = this.edgeStateOnDragStart,
      d = e.clone().sub(i),
      c = s.dot(d),
      h = o.clone().multiplyScalar(c),
      l = i.clone().add(h).add(n),
      m = r.clone().multiplyScalar(c),
      u = i.clone().add(m).add(a)
    this.data.moveWall(t.id, l, u)
  }
  onMoveWallOpening(t, e) {
    const { roomBoundEditor: i, openingStateOnDragStart: s } = this,
      { relativeStart: n, relativeEnd: a, wallLine: o } = s,
      r = o.closestPointToPointParameter(e, !0)
    switch (i.state.openingEditState) {
      case j.MOVE:
        const e = (t.width / o.distance()) * 0.5
        r + e < 1 && r - e > 0 && this.data.editWallOpeningDetails(t.id, { relativePos: r })
        break
      case j.START:
        {
          const e = (a - r) * o.distance()
          if (e < H && e < t.width) return
          const i = 0.5 * (r + a)
          this.data.editWallOpeningDetails(t.id, { relativePos: i, width: e })
        }
        break
      case j.END: {
        const e = (r - n) * o.distance()
        if (e < H && e < t.width) return
        const i = 0.5 * (r + n)
        this.data.editWallOpeningDetails(t.id, { relativePos: i, width: e })
      }
    }
  }
  checkForNodeOrWallHit(t) {
    const e = this.data.getNode(t)
    return this.mergeOverlapsOnMoveEnd(e)
  }
  mergeOverlapsOnMoveEnd(t) {
    const e = this.data.findOverlappingEntities(t)
    if (e) {
      const { nodeOverlaps: i, nodeWallOverlaps: s, collinearWall: n, intersectingWall: a } = e
      return this.data.mergeOverlappingEntities(t, i, s, n, a), !0
    }
    return !1
  }
  isSnappingDisabled() {
    return this.keyboardState.isKeyHeld(KeyboardCode.ALT) || this.keyboardState.isKeyHeld(KeyboardCode.SHIFT)
  }
  tryApplySnapping(t, e, i) {
    if ((i.copy(t), !this.isSnappingDisabled())) {
      const s = x(this.data, this.cameraData, e, t)
      return i.copy(s.target), s
    }
    return null
  }
  getAttachedWall(t, e) {
    const i = this.data.getWallsForNode(e)
    if (i) for (const e of i) if (e !== t) return e
    return null
  }
  getWallDirection(t, e, i, s) {
    const n = this.getAttachedWall(t, e)
    if (!n) return void s.copy(i)
    n.getDirection(s).normalize().equals(DirectionVector.ZERO) && s.copy(i)
  }
  needsWallJoint(t, e, i) {
    const s = this.data.getWallsForNode(e)
    for (const e of s) {
      if (e === t) continue
      const s = i.dot(e.getDirection().normalize())
      if (Math.abs(s) < 0.8) return !0
    }
    return !1
  }
}

const bt = new DebugInfo("room-bounds-editor"),
  St = t => {
    const e = bt.debug
    return createSubscription(
      () => e(`${t}.renew()`),
      () => e(`${t}.cancel()`),
      !1
    )
  }
class Dt extends DragAndDropObject.DragAndDrop {
  constructor(t, e, i, s, n, a, o, r, d, c, h) {
    super(new _()),
      (this.roomBoundTool = t),
      (this.getCursorOrigin = e),
      (this.isPitchFactorOrtho = i),
      (this.input = s),
      (this.raycaster = n),
      (this.messageBus = a),
      (this.data = o),
      (this.floorsViewData = r),
      (this.settingsData = d),
      (this.commandBinder = c),
      (this.clearSelectionIfNeeded = t => {
        this.state.currentId === t.id && this.deselect()
      }),
      (this.allViewsComparator = Comparator.is(t => t instanceof RoomBoundViewMesh)),
      (this.draggableViewsComparator = Comparator.is(
        t => (t instanceof RoomBoundEdgeView || t instanceof RoomBoundOpeningView || t instanceof RoomBoundHandleView) && !!t.raycastEnabled
      )),
      (this.addPoint = t => {
        if (t.button !== MouseKeyIndex.PRIMARY || !this.isPitchFactorOrtho()) return
        const e = this.getCurrentRoomBoundHit(),
          i = this.getCursorOrigin(),
          s = { x: i.x, z: i.z }
        switch ((this.data.finalizeHistory(), this.state.addType)) {
          case N.WALLS:
            {
              const { wallType: t } = this.state,
                n = this.data.getLastWallWidth(t)
              if (e)
                if (e instanceof RbushBboxNode) {
                  const { wall: i } = this.data.addTrailingEdgeToNode(t, e.id, s, n)
                  this.add(i)
                } else if (e instanceof RoomWall) {
                  const a = e.getProjection(i),
                    { newTrailingWall: o } = this.data.addTrailingEdgeToEdge(t, e.id, a, s, n)
                  this.add(o.id)
                } else {
                  if (!(e instanceof Room || e instanceof WallOpening)) throw new Error("Trying to add a new Edge on an invalid object type")
                  this.addFirstFloatingPoint(s)
                }
              else this.addFirstFloatingPoint(s)
            }
            break
          case N.DOORS:
          case N.OPENINGS: {
            const t = this.state.tempHoverPreviewEntityId
            t && (this.data.finalizeHistory(), setTimeout(() => this.select(t), 1), (this.state.tempHoverPreviewEntityId = null))
          }
        }
      }),
      (this.moveTemporaryPreview = () => {
        const t = new Line3()
        return (() => {
          const e = this.state.tempHoverPreviewEntityId
          if (e) {
            if (this.state.addType !== N.DOORS && this.state.addType !== N.OPENINGS) return void this.deleteTemporaryPreview()
            const i = this.data.getOpening(e),
              s = this.data.getWall(i.wallId).getLine3(t),
              n = this.getCursorOrigin(),
              a = s.closestPointToPointParameter(n, !0),
              o = (i.width / s.distance()) * 0.5
            a + o < 1 && a - o > 0 && this.data.editWallOpeningDetails(e, { relativePos: a })
          }
        })()
      }),
      (this.mergePointAndStartNewWall = t => {
        this.tryCommit()
      }),
      (this.updateCursor = () => {
        const { toolState: t, pendingValid: e, pendingAdd: i, pendingEdit: s, currentId: n } = this.state
        let a = CursorStyle.ROOMBOUNDS_DEFAULT
        if ((t === DragAndDropObject.ToolState.ADDING || t === DragAndDropObject.ToolState.WAIT_FOR_ADD) && n) {
          a = CursorStyle.ROOMBOUNDS_PLACE_NODE
          const e = t === DragAndDropObject.ToolState.ADDING ? this.data.getWall(n).to.id : n
          if (e) {
            const t = this.data.tryGetEntity(e)
            if (!(t instanceof RbushBboxNode)) return
            const i = ((t, e, i, s = !1) => {
              const n = e.getAttachedEntities(t),
                a = s ? t.getVec3() : void 0
              return i.getCurrentRoomBoundHit(n, a)
            })(t, this.data, this)
            i && (i instanceof RoomWall || i instanceof RbushBboxNode) && (a = CursorStyle.ROOMBOUNDS_FINISH_ROOM)
          }
        }
        this.state.dragging && (a = CursorStyle.ROOMBOUNDS_MOVING),
          (i || s) && !1 === e && (a = CursorStyle.NOPE),
          this.state.cursor !== a && ((this.state.cursor = a), this.state.commit())
      })
    const l = [
      this.subscribe(DragAndDropObject.Events.StateChange, async ({ target: t }) => {
        this.inputStates || (this.inputStates = this.bindInputToEditorStates(h)),
          this.inputStates.cancel(),
          this.inputStates.renew(t),
          this.setPitchRangeForState(t)
      }),
      this.subscribe(DragAndDropObject.Events.CurrentChange, this.updateCursor),
      this.subscribe(DragAndDropObject.Events.ValidChange, this.updateCursor),
      this.subscribe(DragAndDropObject.Events.HoverChange, this.updateCursor),
      this.input.registerHandler(OnMoveEvent, this.updateCursor),
      this.data.onNodesChanged({ onRemoved: this.clearSelectionIfNeeded }),
      this.data.onWallsChanged({ onRemoved: this.clearSelectionIfNeeded }),
      this.data.onOpeningsChanged({ onRemoved: this.clearSelectionIfNeeded }),
      this.data.onRoomsChanged({ onRemoved: this.clearSelectionIfNeeded })
    ]
    l.forEach(t => t.cancel()), this.bindings.push(...l)
  }
  exit() {
    super.exit(), this.inputStates && this.inputStates.cancel()
  }
  bindInputToEditorStates(t) {
    const e = new AggregateSubscription(
      this.input.registerPriorityHandler(DraggerMoveEvent, ShowcaseMesh, () => !0),
      this.input.registerPriorityHandler(DraggerMoveEvent, SkySphereMesh, () => !0)
    )
    e.cancel()
    const i = () => this.setEnabled(!1),
      s = () => this.setEnabled(!0),
      n = new AggregateSubscription(
        createSubscription(
          () => this.messageBus.subscribe(TourStartedMessage, i),
          () => this.messageBus.unsubscribe(TourStartedMessage, i),
          !1
        ),
        createSubscription(
          () => this.messageBus.subscribe(TourStoppedMessage, s),
          () => this.messageBus.unsubscribe(TourStoppedMessage, s),
          !1
        ),
        this.messageBus.subscribe(StartMoveToFloorMessage, () => {
          this.state.toolState !== DragAndDropObject.ToolState.CLOSED && this.state.toolState !== DragAndDropObject.ToolState.DISABLED && this.discard()
        })
      ),
      a = new AggregateSubscription(
        this.input.registerUnfilteredHandler(KeyboardCallbackEvent, t => {
          t.key === KeyboardCode.ESCAPE && this.discard(), t.key === KeyboardCode.RETURN && this.tryCommit()
        })
      )
    a.cancel()
    const o = new EventsSubscription(t, "keydown", t => {
      "KeyZ" === t.code && (t.ctrlKey || t.metaKey) && this.roomBoundTool.undo()
    })
    o.cancel()
    const r = winCanTouch()
      ? new AggregateSubscription()
      : new AggregateSubscription(
          this.input.registerMeshHandler(HoverMeshEvent, this.allViewsComparator, (t, e) => this.hover(e.roomBoundsId, e)),
          this.input.registerMeshHandler(UnhoverMeshEvent, this.allViewsComparator, () => this.unhover())
        )
    r.cancel()
    const d = this.input.registerUnfilteredHandler(KeyboardCallbackEvent, t => {
      t.key === KeyboardCode.ESCAPE && this.deselect()
    })
    d.cancel()
    const c = this.input.registerUnfilteredHandler(KeyboardCallbackEvent, t => {
      const e = [KeyboardCode.DELETE, KeyboardCode.BACKSPACE].includes(t.key)
      if (this.state.pendingEdit && e) {
        const { currentId: t } = this.state
        t && (this.discard(), this.data.deleteEntity(t), this.data.finalizeHistory())
      }
    })
    c.cancel()
    const h = [this.input.registerPriorityHandler(InputClickerEndEvent, SkySphereMesh, () => (this.discard(), !0))]
    this.settingsData.tryGetProperty(DollhousePeekabooKey, !1) ||
      h.push(this.input.registerPriorityHandler(InputClickerEndEvent, ShowcaseMesh, () => (this.discard(), !0)))
    const l = new AggregateSubscription(...h)
    l.cancel()
    const m = new AggregateSubscription(
      this.input.registerMeshHandler(InputClickerEndEvent, this.allViewsComparator, this.onToggleSelectInput.bind(this)),
      this.input.registerMeshHandler(DraggerWaitingEvent, this.draggableViewsComparator, this.onToggleSelectInput.bind(this)),
      this.input.registerMeshHandler(DraggerMoveEvent, this.draggableViewsComparator, this.onToggleSelectInput.bind(this))
    )
    m.cancel()
    const u = this.input.registerUnfilteredHandler(InputClickerEndEvent, this.addPoint),
      g = this.input.registerUnfilteredHandler(InputClickerEndEvent, this.mergePointAndStartNewWall),
      p = new AggregateSubscription(
        this.input.registerMeshHandler(DraggerWaitingEvent, this.draggableViewsComparator, this.placeOnDrag.bind(this)),
        this.input.registerMeshHandler(DraggeringEvent, this.draggableViewsComparator, this.onDragEnd.bind(this))
      )
    p.cancel()
    const w = this.input.registerUnfilteredHandler(OnMoveEvent, t => this.move(t))
    w.cancel()
    const b = this.input.registerUnfilteredHandler(OnMouseDownEvent, this.dropOnPointerUp.bind(this))
    b.cancel()
    const S = this.input.registerUnfilteredHandler(OnMoveEvent, this.moveTemporaryPreview.bind(this))
    S.cancel()
    const v = this.input.registerUnfilteredHandler(OnMouseDownEvent, t => {
        t.button === MouseKeyIndex.PRIMARY && this.updateCursor()
      }),
      y = createSubscription(
        () => {
          this.commandBinder.issueCommand(new LockNavigationCommand()), this.commandBinder.issueCommand(new GutterTouchScrollDisableCommand())
        },
        () => {
          this.commandBinder.issueCommand(new UnlockNavigationCommand()), this.commandBinder.issueCommand(new GutterTouchScrollEnableCommand())
        },
        !1
      ),
      E = new AggregateSubscription(n, r, m, p, v, o, St("ToolState.IDLE -> bindings")),
      O = new AggregateSubscription(n, a, r, S, u, St("ToolState.WAIT_FOR_ADD -> bindings")),
      M = new AggregateSubscription(n, a, w, r, g, y, o, St("ToolState.ADDING -> bindings")),
      T = [n, m, r, v, d, l],
      C = [p, o, c],
      I = new AggregateSubscription(...T, ...C, St("ToolState.SELECTED -> bindings")),
      R = new AggregateSubscription(n, e, a, r, St("ToolState.PLACING -> (base) bindings")),
      B = new AggregateSubscription(...T, ...C, St("ToolState.EDITING -> bindings"))
    return new InputState([
      { state: DragAndDropObject.ToolState.DISABLED, subs: [n] },
      { state: DragAndDropObject.ToolState.IDLE, subs: [E] },
      { state: DragAndDropObject.ToolState.WAIT_FOR_ADD, subs: [O] },
      { state: DragAndDropObject.ToolState.ADDING, subs: [M] },
      { state: DragAndDropObject.ToolState.SELECTED, subs: [I] },
      { state: DragAndDropObject.ToolState.EDITING, subs: [B] },
      { state: DragAndDropObject.ToolState.PLACING, subs: [R, w, b] }
    ])
  }
  getCurrentRoomBoundHit(t, e) {
    let i
    const s = t => t instanceof RoomBoundViewMesh,
      n = t => s(t.object)
    if (null == e) i = this.input.getCurrentRayHits().filter(n)
    else {
      const t = e.clone().add(new Vector3(0, 1e3, 0))
      i = this.raycaster.picking.cast(t, DirectionVector.DOWN, s)
    }
    let a = i.filter(n).map(t => t.object.roomBoundsId)
    return t && (a = a.filter(e => !t.has(e))), a.length > 0 ? this.data.tryGetEntity(a[0]) : null
  }
  onToggleSelectInput(t, e) {
    this.updateOpeningEditState(e)
    const i = e.roomBoundsId
    if (i) {
      setTimeout(() => {
        if (e.parent) {
          if (this.state.selected === i) t instanceof InputClickerEndEvent && (this.discard(), this.deselect())
          else {
            const t = this.state.toolState
            ;(t !== DragAndDropObject.ToolState.EDITING && t !== DragAndDropObject.ToolState.PLACING) || this.discard(),
              this.select(i),
              this.edit(i),
              this.hover(i)
          }
        }
      }, 0)
      const s = this.data.tryGetEntity(i)
      return !(this.settingsData.tryGetProperty(DollhousePeekabooKey, !1) && s instanceof Room)
    }
    return !0
  }
  hover(t, e) {
    super.hover(t),
      e && this.handleOpeningHover(e),
      this.state.tempHoverPreviewEntityId && this.state.tempHoverPreviewEntityId !== t && this.deleteTemporaryPreview()
    const i = this.state.toolState === DragAndDropObject.ToolState.ADDING || this.state.toolState === DragAndDropObject.ToolState.WAIT_FOR_ADD,
      s = this.state.addType === N.DOORS || this.state.addType === N.OPENINGS
    if (i && s) {
      const t = this.getCurrentRoomBoundHit(),
        e = this.getCursorOrigin(),
        i = this.addOpeningOrDoor(t, e)
      i && (this.state.tempHoverPreviewEntityId = i)
    }
  }
  handleOpeningHover(t) {
    const e = t => {
      ;(t.hoverState.active = !1), t.hoverState.off()
    }
    if (t instanceof RoomBoundOpeningView) e(t.startHandle), e(t.endHandle)
    else if (t instanceof RoomBoundOpeningHandleView) {
      e(t instanceof RoomBoundStartHandleView ? t.parentOpeningView.endHandle : t.parentOpeningView.startHandle)
    }
  }
  placeOnDrag(t, e) {
    if (
      (t instanceof DraggerMoveEvent && t.buttons !== MouseKeyCode.PRIMARY) ||
      (t instanceof DraggerWaitingEvent && t.pointer.buttons !== MouseKeyCode.PRIMARY)
    )
      return
    this.updateOpeningEditState(e)
    const i = e.roomBoundsId
    this.state.selected !== i && this.select(i), this.place(i), (this.state.dragging = !0)
  }
  onDragEnd(t) {
    this.state.dragging = !1
  }
  updateOpeningEditState(t) {
    t instanceof RoomBoundStartHandleView
      ? (this.state.openingEditState = j.START)
      : t instanceof RoomBoundEndHandleView
        ? (this.state.openingEditState = j.END)
        : (this.state.openingEditState = j.MOVE)
  }
  dropOnPointerUp(t) {
    if (t.down) this.updateCursor()
    else {
      !1 !== this.state.pendingValid ? this.tryCommit() : this.discard()
    }
  }
  addOpeningOrDoor(t, e) {
    if (!(t instanceof RoomWall)) return null
    const i = t.getProjection(e) / t.length,
      s = Math.min(0.9 * t.length, 0.9144),
      n = (s / t.length) * 0.5,
      a = CheckThreshold(i, n, 1 - n)
    return this.data.addWallOpening({
      wallId: t.id,
      type: this.state.addType === N.DOORS ? RelativePosType.DOOR : RelativePosType.OPENING,
      relativePos: a,
      width: s
    })
  }
  deleteTemporaryPreview() {
    this.state.tempHoverPreviewEntityId &&
      this.data.tryGetEntity(this.state.tempHoverPreviewEntityId) &&
      (this.data.deleteEntity(this.state.tempHoverPreviewEntityId), (this.state.tempHoverPreviewEntityId = null))
  }
  addFirstFloatingPoint(t) {
    if (!this.floorsViewData.currentFloorId) throw new Error("Expected a floor when adding point.")
    const { wall: e } = this.data.addFloatingEdge(
      this.state.wallType,
      t,
      Object.assign({}, t),
      this.data.getLastWallWidth(this.state.wallType),
      this.floorsViewData.currentFloorId
    )
    this.add(e)
  }
  setPitchRangeForState(t) {
    const e = lt.pj * MathUtils.RAD2DEG
    t !== DragAndDropObject.ToolState.CLOSED &&
      (t === DragAndDropObject.ToolState.PLACING || t === DragAndDropObject.ToolState.ADDING
        ? this.commandBinder.issueCommand(new DollhouseVerticalLimitsCommand({ phiLowerLimitDegrees: e - 1e-4, phiUpperLimitDegrees: e, noTransition: !0 }))
        : this.commandBinder.issueCommand(
            new DollhouseVerticalLimitsCommand({ phiLowerLimitDegrees: lt.bp * MathUtils.RAD2DEG, phiUpperLimitDegrees: e, noTransition: !0 })
          ))
  }
}
const Tt = 0.5
class Ct {
  constructor(t) {
    ;(this.axis = new It(t)), (this.orthoAxis = new It(t))
  }
  showAt(t, e) {
    this.axis.setPosition(t), this.axis.show(), e ? (this.orthoAxis.setPosition(e), this.orthoAxis.show()) : this.orthoAxis.hide()
  }
  hide() {
    this.axis.hide(), this.orthoAxis.hide()
  }
  dispose() {
    this.axis.dispose(), this.orthoAxis.dispose()
  }
}
class It {
  constructor(t) {
    ;(this.scene = t),
      (this.setPosition = (() => {
        const t = new Vector3(),
          e = new Vector3(),
          i = new Vector3(),
          s = new Vector3()
        return n => {
          i.subVectors(n.end, n.start).normalize(),
            s.copy(i).applyAxisAngle(DirectionVector.UP, Math.PI / 2),
            t.copy(n.start).addScaledVector(i, -1e3),
            e.copy(n.start).addScaledVector(i, 1e3),
            this.alignedAxis.updateEndpoints([[t, e]]),
            t.copy(n.start).addScaledVector(s, Tt),
            e.copy(n.start).addScaledVector(i, Tt).addScaledVector(s, Tt),
            this.angleIndictorLine1.updateEndpoints([[t, e]]),
            t.copy(n.start).addScaledVector(s, -1e3),
            e.copy(n.start).addScaledVector(s, 1e3),
            this.orthoAxis.updateEndpoints([[t, e]]),
            t.copy(n.start).addScaledVector(i, Tt),
            e.copy(n.start).addScaledVector(s, Tt).addScaledVector(i, Tt),
            this.angleIndictorLine2.updateEndpoints([[t, e]])
        }
      })())
    const e = {
        dashed: !1,
        dashSize: 1,
        gapSize: 1,
        lineWidth: 1,
        color: ColorSpace.MP_BRAND,
        dashUnits: DashUnits.PIXELS,
        depthWrite: !1,
        depthTest: !1,
        depthFunc: AlwaysDepth,
        opacity: 1
      },
      i = {
        dashed: !0,
        dashSize: 5,
        gapSize: 2,
        lineWidth: 1,
        color: ColorSpace.MP_BRAND,
        dashUnits: DashUnits.PIXELS,
        depthWrite: !1,
        depthTest: !1,
        depthFunc: AlwaysDepth,
        opacity: 1
      }
    ;(this.alignedAxis = new ScreenLine([[new Vector3(), new Vector3()]], i)),
      (this.orthoAxis = new ScreenLine([[new Vector3(), new Vector3()]], i)),
      (this.angleIndictorLine1 = new ScreenLine([[new Vector3(), new Vector3()]], e)),
      (this.angleIndictorLine2 = new ScreenLine([[new Vector3(), new Vector3()]], e)),
      this.scene.add(this.alignedAxis),
      this.scene.add(this.orthoAxis),
      this.scene.add(this.angleIndictorLine1),
      this.scene.add(this.angleIndictorLine2),
      this.hide()
  }
  show() {
    ;(this.alignedAxis.visible = !0), (this.orthoAxis.visible = !0), (this.angleIndictorLine1.visible = !0), (this.angleIndictorLine2.visible = !0)
  }
  hide() {
    ;(this.alignedAxis.visible = !1), (this.orthoAxis.visible = !1), (this.angleIndictorLine1.visible = !1), (this.angleIndictorLine2.visible = !1)
  }
  dispose() {
    this.scene.remove(this.alignedAxis),
      this.scene.remove(this.orthoAxis),
      this.scene.remove(this.angleIndictorLine1),
      this.scene.remove(this.angleIndictorLine2)
  }
}
const { ROOMS: ie } = PhraseKey.SHOWCASE,
  se = ({ item: t }) => {
    const e = (0, Yt.B)() === ToolsList.ROOM_BOUNDS,
      i = (0, Qt.n)(),
      { analytics: s } = (0, Ft.useContext)(AppReactContext),
      n = (0, Kt.e)(),
      a = (0, zt.A)(),
      o = (0, Gt.b)(),
      r = tryGetModuleBySymbolSync(WorkShopRoomBoundToolSymbol),
      { id: d, title: h, description: l, typeId: m, onSelect: u, icon: g, textParser: p } = t
    if (m !== searchModeType.MODELROOM) return null
    const w = (null == i ? void 0 : i.id) === d,
      b = o.t(ie.LIST_PANEL_EDIT),
      S = e
        ? (0, Ht.jsx)(Jt.hE, {
            children: (0, Ht.jsx)(
              Jt.xz,
              Object.assign(
                { icon: "more-vert", ariaLabel: o.t(PhraseKey.MORE_OPTIONS), variant: Jt.Wu.TERTIARY, menuArrow: !0, menuClassName: "search-result-menu" },
                {
                  children: (0, Ht.jsx)(Jt.zx, {
                    label: b,
                    size: Jt.qE.SMALL,
                    variant: Jt.Wu.TERTIARY,
                    onClick: async t => {
                      r && (s.trackGuiEvent("rooms_list_edit_room", { tool: n }), await u(), r.edit(d))
                    }
                  })
                }
              )
            )
          })
        : void 0,
      D = a ? (0, Zt.vr)(h, a) : h,
      v = a && l ? (0, Zt.vr)(l, a) : l || "",
      y = (0, Ht.jsxs)(
        "div",
        Object.assign(
          { className: "item-details" },
          {
            children: [
              (0, Ht.jsx)(
                "div",
                Object.assign({ className: "item-header" }, { children: (0, Ht.jsx)(Xt.S, { text: D || "", textParser: p, markers: Zt.PP }) })
              ),
              l &&
                (0, Ht.jsx)(
                  "div",
                  Object.assign({ className: "item-description" }, { children: (0, Ht.jsx)(Xt.S, { text: v, textParser: p, markers: Zt.PP }) })
                )
            ]
          }
        )
      )

    return (0, Ht.jsx)(
      qt.F,
      {
        item: t,
        title: y,
        active: w,
        actions: S,
        badge: (0, Ht.jsx)($t.C, { iconClass: g }),
        onSelect: async () => {
          s.trackGuiEvent("rooms_list_select_room", { tool: n }), await u()
        }
      },
      d
    )
  }
class ne {
  constructor(t, e, i) {
    ;(this.roomBoundTool = t), (this.searchData = e), (this.editorState = i), this.setSearchItemFC(se)
  }
  async dispose() {
    this.setSearchItemFC()
  }
  async activate() {
    await this.roomBoundTool.activate()
  }
  async deactivate() {
    await this.roomBoundTool.deactivate()
  }
  setSearchItemFC(t) {
    const e = this.searchData.getSearchDataTypeGroup(searchModeType.MODELROOM)
    e && (e.itemFC = t)
  }
}

import Slider from "rc-slider"
import * as Ze from "../6521"
import { DollhouseVerticalLimitsCommand, RestoreMouseBtnActionCommand, SwapMouseBtnActionCommand } from "../command/dollhouse.command"
import { DisableAllFloorsOptionCommand, EnableAllFloorsOptionCommand, LockFloorNavCommand } from "../command/floors.command"
import { LockNavigationCommand, UnlockNavigationCommand } from "../command/navigation.command"
import * as Ue from "../const/73536"
import * as ei from "../const/75668"
import * as hi from "../const/78283"
import * as Be from "../other/1358"
import * as Oe from "../other/14874"
import * as si from "../other/15004"
import * as He from "../other/15501"
import * as Te from "../other/19048"
import { useAnalytics } from "../other/19564"
import * as Me from "../other/25770"
import * as $e from "../other/29300"
import * as Re from "../other/33023"
import * as Ye from "../other/37749"
import * as Ie from "../other/38613"
import * as ke from "../other/40216"
import * as ci from "../other/41655"
import * as Se from "../other/43108"
import * as ge from "../other/51978"
import * as li from "../other/56064"
import * as Fe from "../other/56843"
import * as Qe from "../other/62944"
import * as _e from "../other/65596"
import * as ti from "../other/67243"
import * as Ee from "../other/73372"
import * as ze from "../other/84784"
import * as ye from "../other/85351"
import * as yi from "../other/86495"
import * as Ke from "../other/94109"
import * as di from "../other/95229"
import * as fe from "../other/97273"
import * as ri from "../utils/80361"
import { UnitTypeKey } from "../utils/unit.utils"

import { DisableCursorMeshCommand, SetMouseCursorCommand } from "../command/cursor.command"
import { ToggleOptionCommand } from "../command/player.command"
import { RoomBoundSetAllowRenderingCommand } from "../command/room.command"
import { GutterTouchScrollDisableCommand, GutterTouchScrollEnableCommand } from "../command/scroll.command"
import { RegisterToolsCommand } from "../command/tool.command"
import { ChangeViewmodeCommand, LockViewmodeCommand, UnlockViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { Features360ViewsKey } from "../const/360.const"
import { FeaturesNotesKey } from "../const/39693"
import { TransitionTypeList } from "../const/64918"
import { DollhousePeekabooKey } from "../const/66777"
import { ColorSpace } from "../const/color.const"
import { CursorStyle } from "../const/cursor.const"
import { KeyboardCode } from "../const/keyboard.const"
import { MouseKeyCode, MouseKeyIndex } from "../const/mouse.const"
import { PhraseKey } from "../const/phrase.const"
import { featuresMattertagsKey } from "../const/tag.const"
import { ToolPalette, ToolsList } from "../const/tools.const"
import { searchModeType } from "../const/typeString.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { SettingsToggler } from "../core/settingsToggler"
import { createSubscription } from "../core/subscription"
import { AppData } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { FloorsData } from "../data/floors.data"
import { FloorsViewData } from "../data/floors.view.data"
import { LayersData } from "../data/layers.data"
import { BtnText } from "../data/player.options.data"
import { RoomBoundData } from "../data/room.bound.data"
import { SearchData } from "../data/search.data"
import { SettingsData } from "../data/settings.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { OnMouseDownEvent, OnMoveEvent } from "../events/mouse.event"
import { checkLineSegmentsIntersection } from "../math/2569"
import { getScreenAndNDCPosition, isPitchFactorOrtho } from "../math/59370"
import { StartMoveToFloorMessage } from "../message//floor.message"
import { WorkShopFeatureMessage } from "../message/feature.message"
import { AssetDockedMessage, AssetUndockedMessage } from "../message/panel.message"
import {
  RoomToolModuleAddedMessage,
  RoomToolModuleClickedMessage,
  RoomToolModuleDeletedMessage,
  RoomToolModuleMovedMessage,
  RoomToolModuleUndoMessage
} from "../message/room.message"
import { TourStartedMessage, TourStoppedMessage } from "../message/tour.message"
import { ToolObject } from "../object/tool.object"
import { tryGetModuleBySymbolSync } from "../other/24085"
import { useData } from "../other/45755"
import { RoomBoundsKey } from "../other/47309"
import { RoomBoundEdgeView } from "../roomBoundEdgeView"
import { RoomBoundHandleView } from "../roomBoundHandleView"
import { RoomBoundViewMesh } from "../roomBoundViewMesh"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { EventsSubscription } from "../subscription/events.subscription"
import { sameArray } from "../utils/38042"
import { CheckThreshold } from "../utils/49827"
import { StartTransition } from "../utils/6282"
import { CameraRigConfig } from "../utils/camera.utils"
import { Comparator } from "../utils/comparator"
import { RoomBoundEndHandleView, RoomBoundOpeningHandleView, RoomBoundOpeningView, RoomBoundStartHandleView } from "../webgl/98120"
import { InputState } from "../webgl/input.state"
import { InputManager } from "../webgl/inputManager"
import { RbushBboxNode } from "../webgl/rbushBbox.node"
import { RoomWall, WallType } from "../webgl/room.wall"
import { RoomMesh } from "../webgl/roomMesh"
import { DashUnits, ScreenLine } from "../webgl/screen.line"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import { CameraQuaternion } from "../webgl/vector.const"
import { DEFAULT_TRANSITION_TIME } from "./viewmode.module"
const { ROOMS: De } = PhraseKey.WORKSHOP
function ve() {
  const t = (0, Gt.b)(),
    e = (0, ge.y)(BtnText.RoomBounds, !1),
    i = useAnalytics(),
    s = (0, Se.Y)(ToggleOptionCommand, () => {
      const t = e ? "off" : "on"
      return i.trackToolGuiEvent("settings", `click_settings_${BtnText.RoomBounds}_${t}`), [{ key: BtnText.RoomBounds, value: !e }]
    }),
    n = t.t(De.ROOM_BOUNDS_SETTINGS)
  return (0, Ht.jsx)(
    de.P,
    Object.assign(
      {
        icon: "settings",
        tooltip: n,
        variant: Jt.Wu.TERTIARY,
        tooltipPlacement: "bottom-end",
        analytic: "roombounds_settings_click",
        className: "roombounds-settings"
      },
      {
        children: (0, Ht.jsxs)(he.J, {
          children: [
            (0, Ht.jsxs)(
              "div",
              Object.assign(
                { className: "settings-toggle units-setting" },
                {
                  children: [
                    (0, Ht.jsx)(
                      "div",
                      Object.assign({ className: "settings-label" }, { children: t.t(PhraseKey.WORKSHOP.SETTINGS.ROOM_BOUND_TOGGLE_IN_TOOL) })
                    ),
                    (0, Ht.jsx)(le.Z, {
                      className: ue("player-option-toggle"),
                      onToggle: s,
                      enabled: !0,
                      onOffLabel: !1,
                      toggled: e,
                      testId: "RoomBoundSettingToggle"
                    })
                  ]
                }
              )
            ),
            (0, Ht.jsx)(ce.Q, {})
          ]
        })
      }
    )
  )
}
function xe() {
  const t = (0, Re.Q)(ToolsList.ROOM_BOUNDS)
  return t ? t.manager.editorState : null
}
function Pe() {
  const t = xe()
  return (0, Ie.h)(t, "selected", null)
}
function Ae() {
  const t = (0, Be.S)(),
    e = Pe()
  return e && t ? t.getEntity(e) : null
}
function Ve() {
  const t = xe()
  return (0, Ie.h)(t, "toolState", DragAndDropObject.ToolState.CLOSED)
}
const { ROOMS: Le } = PhraseKey.SHOWCASE
function Ne() {
  const t = (function () {
      const t = Ae()
      return t && t instanceof Room ? t : null
    })(),
    e = (0, Gt.b)().t(Le.LIST_PANEL_TITLE)
  return (0, Ht.jsx)(
    Ee.L,
    Object.assign(
      { toolId: ToolsList.ROOM_BOUNDS, subheader: (0, Ht.jsx)(je, {}), controls: (0, Ht.jsx)(ve, {}), title: e },
      {
        children: (0, Ht.jsx)(
          "div",
          Object.assign(
            { className: "panel-list" },
            {
              children: (0, Ht.jsx)(ye.D, {
                renderItem: se,
                renderGroup: Oe.s,
                grouping: AnnotationGrouping.FLOOR,
                activeItemId: (null == t ? void 0 : t.id) || null
              })
            }
          )
        )
      }
    )
  )
}
function je() {
  return (0, Ht.jsxs)(Ht.Fragment, {
    children: [(0, Ht.jsxs)("header", { children: [(0, Ht.jsx)(Me.z, { toolId: ToolsList.ROOM_BOUNDS }), (0, Ht.jsx)(Te.b, {})] }), (0, Ht.jsx)(fe.B, {})]
  })
}
const { ROOMS: Ge } = PhraseKey.SHOWCASE
const Je = PhraseKey.WORKSHOP.ROOMS
function qe({ room: t }) {
  const e = (0, Gt.b)(),
    i = tryGetModuleBySymbolSync(WorkShopRoomBoundToolSymbol),
    s = e.t(PhraseKey.SHOWCASE.ROOMS.ROOM_INFORMATION),
    n = !isNaN(t.width) && !isNaN(t.length)
  if (!i) return null
  return (0, Ht.jsxs)(
    "div",
    Object.assign(
      { className: "hideable-room-size-info" },
      {
        children: [
          (0, Ht.jsx)("div", Object.assign({ className: "hideable-room-size-info-title" }, { children: s })),
          (0, Ht.jsx)(
            Ke.d0,
            Object.assign(
              {
                containerClass: "hideable-room-detail",
                titleKey: PhraseKey.SHOWCASE.ROOMS.ROOM_AREA,
                measurementsInMetric: [t.area],
                measurementType: Qe.RV.AREA,
                isHideable: !1,
                visible: !0
              },
              {
                children: (0, Ht.jsxs)(
                  "div",
                  Object.assign(
                    { className: "room-detail-child-container" },
                    {
                      children: [
                        (0, Ht.jsx)(Xe, {
                          toggle: e => {
                            i.editRoomData("includeInAreaCalc", t.id, e)
                          },
                          guiEvent: "rooms_change_room_include_in_area",
                          labelKey: Je.ROOM_INCLUDE_IN_AREA,
                          tooltipKey: Je.ROOM_INCLUDE_IN_AREA_TOOLTIP,
                          checked: t.includeInAreaCalc
                        }),
                        (0, Ht.jsx)(Xe, {
                          toggle: e => {
                            i.editRoomData("location", t.id, e ? LocationType.OUTDOOR : LocationType.INDOOR)
                          },
                          guiEvent: "rooms_change_room_outside",
                          labelKey: Je.AREA_IS_OUTDOORS,
                          tooltipKey: Je.AREA_IS_OUTDOORS_TOOLTIP,
                          checked: t.location === LocationType.OUTDOOR
                        })
                      ]
                    }
                  )
                )
              }
            )
          ),
          (0, Ht.jsx)(
            Ke.d0,
            Object.assign(
              {
                containerClass: "hideable-room-detail",
                titleKey: PhraseKey.SHOWCASE.ROOMS.ROOM_DIMENSIONS,
                measurementsInMetric: [t.width, t.length],
                measurementType: Qe.RV.DISTANCE,
                isHideable: n,
                visible: t.showDimensions,
                onToggle: () => {
                  i.editRoomData("showDimensions", t.id, !t.showDimensions)
                }
              },
              { children: (0, Ht.jsx)($e.Vr, { room: t }) }
            )
          ),
          (0, Ht.jsx)(
            Ke.d0,
            Object.assign(
              {
                containerClass: "hideable-room-detail",
                titleKey: PhraseKey.SHOWCASE.ROOMS.ROOM_HEIGHT,
                measurementsInMetric: [t.height],
                measurementType: Qe.RV.DISTANCE,
                isHideable: !isNaN(t.height),
                visible: t.showHeight,
                onToggle: () => {
                  i.editRoomData("showHeight", t.id, !t.showHeight)
                }
              },
              { children: (0, Ht.jsx)($e.tL, { room: t }) }
            )
          ),
          (0, Ht.jsx)(Ke.d0, {
            containerClass: "hideable-room-detail",
            titleKey: PhraseKey.SHOWCASE.ROOMS.ROOM_PERIMETER,
            measurementsInMetric: [t.perimeter],
            measurementType: Qe.RV.DISTANCE,
            isHideable: !1,
            visible: !0
          })
        ]
      }
    )
  )
}
function Xe({ toggle: t, guiEvent: e, labelKey: i, tooltipKey: s, checked: n }) {
  const a = (0, Gt.b)(),
    o = useAnalytics(),
    [r, d] = (0, Ft.useState)(null),
    c = { tool: "rooms" }
  return (0, Ht.jsxs)(
    "div",
    Object.assign(
      { className: "area-option" },
      {
        children: [
          (0, Ht.jsx)("div", Object.assign({ className: "p5" }, { children: a.t(i) })),
          (0, Ht.jsx)(Jt.JO, { name: "question", style: { marginLeft: "4px" }, ref: t => d(t) }),
          (0, Ht.jsx)(Jt.u, { target: r, title: a.t(s) }),
          (0, Ht.jsx)(Jt.XZ, {
            defaultChecked: n,
            onChange: i => {
              o.trackGuiEvent(e, c), t(i.target.checked)
            }
          })
        ]
      }
    )
  )
}
function ii({ name: t, onSetRoomName: e }) {
  const i = (0, Gt.b)(),
    s = (0, Ft.useRef)(null),
    n = i.t(PhraseKey.WORKSHOP.ROOMS.LABEL) + ": ",
    a = i.t(PhraseKey.WORKSHOP.ROOMS.ADD_LABEL)
  return (0, Ht.jsxs)(
    "div",
    Object.assign(
      { className: "room-name" },
      {
        children: [
          (0, Ht.jsx)("span", Object.assign({ className: "room-name-header" }, { children: n })),
          (0, Ht.jsx)(ti.Z, {
            ref: s,
            className: "room-name-input",
            text: t,
            placeholder: a,
            onEdited: t => {
              var i
              const n = t.trim()
              t !== n && (null === (i = s.current) || void 0 === i || i.setCurrentText(n)), e(n)
            },
            closeOnFocusOut: !0,
            maxLength: ei.iE
          })
        ]
      }
    )
  )
}
const ni = (0, Ft.forwardRef)((t, e) => {
  const { handleRoomChange: i, selectedRoomTypes: s, handleCancel: n } = t,
    a = (function () {
      const t = (0, Be.S)(),
        [e, i] = (0, Ft.useState)((null == t ? void 0 : t.getSortedRoomClassifications()) || [])
      return (0, Ft.useEffect)(() => (t ? (i(t.getSortedRoomClassifications()), () => {}) : () => {}), [t]), e
    })()
  ;(0, Ft.useEffect)(() => {
    var t
    const i = (null === (t = a.find(t => t.id === s.join(ei.Rt))) || void 0 === t ? void 0 : t.label) || ""
    e.current.setText(i)
  }, [s, e])
  const o = (0, Ft.useMemo)(() => {
      const t = []
      return (
        a.forEach(e => {
          t.push({ icon: (0, si.mX)(e.id.split(ei.Rt)), id: e.id, text: e.label })
        }),
        t
      )
    }, [a]),
    r = t => (t.stopPropagation(), !1)
  return (0, Ht.jsx)(Jt.R7, {
    ref: e,
    onChange: t => {
      if ("string" == typeof t) return void n()
      const e = t.id.split(ei.Rt)
      i(e)
    },
    onCancel: n,
    options: o,
    selectedOptionId: s.join(ei.Rt),
    insertOnSelect: !0,
    getNoResultsText: () => "No room types found",
    onFocus: () => {
      e.current.clear()
    },
    onKeyUp: r,
    onKeyDown: r
  })
})
function ai({ room: t }) {
  const { id: e, roomTypeIds: i, name: s } = t,
    { analytics: n } = (0, Ft.useContext)(AppReactContext),
    a = (0, Gt.b)(),
    o = (function (t) {
      const e = (0, Be.S)(),
        i = (0, Gt.b)().t(Ge.DEFAULT_NAME),
        [s, n] = (0, Ft.useState)(e ? e.getRoomTypeName(t, i) : i)
      return (
        (0, Ft.useEffect)(() => {
          if (!e) return () => {}
          const s = e.onRoomsChanged({
            onUpdated: (s, a) => {
              a === t && n(e.getRoomTypeName(t, i))
            }
          })
          return () => s.cancel()
        }, [e, t, i]),
        s
      )
    })(e),
    r = (0, Ft.useRef)(null),
    d = (0, ze.ZJ)(i),
    c = tryGetModuleBySymbolSync(WorkShopRoomBoundToolSymbol)
  if (!c) return null
  const h = a.t(PhraseKey.SHOWCASE.ROOMS.ROOM_TYPE),
    l = { tool: "rooms" }
  return (0, Ht.jsx)(Ht.Fragment, {
    children: (0, Ht.jsxs)(
      "div",
      Object.assign(
        { className: "roombound-editor-section" },
        {
          children: [
            (0, Ht.jsx)("div", Object.assign({ className: "h6" }, { children: h })),
            (0, Ht.jsx)(ni, {
              ref: r,
              handleCancel: () => {
                var t
                null === (t = r.current) || void 0 === t || t.setText(o)
              },
              handleRoomChange: t => {
                sameArray(t, i) || (n.trackGuiEvent("rooms_change_room_type", l), c.editRoomTypes(e, t))
              },
              selectedRoomTypes: d
            }),
            t.accessible()
              ? (0, Ht.jsxs)(Ht.Fragment, {
                  children: [
                    (0, Ht.jsx)(ii, {
                      name: s,
                      onSetRoomName: async t => {
                        t !== s && (n.trackGuiEvent("rooms_change_room_label", l), c.editRoomData("name", e, t))
                      }
                    }),
                    (0, Ht.jsx)(qe, { room: t })
                  ]
                })
              : (0, Ht.jsx)(Ye.M, { room: t }),
            (0, Ht.jsx)(Ze.X, { room: t })
          ]
        }
      )
    )
  })
}
function ui({ field: t, update: e }) {
  const i = (0, Gt.b)(),
    s = (0, Be.S)(),
    n = i.t(PhraseKey.WORKSHOP.ROOMS.RESET_TO_DEFAULT)
  return (0, Ht.jsx)(
    "div",
    Object.assign(
      {
        className: "link reset-to-default-btn",
        onClick: function () {
          let i
          switch (t) {
            case "bias":
              i = ei.Yb
              break
            case "width":
              i = (null == s ? void 0 : s.getMostCommonWallWidth(WallType.SOLID)) || ei.Oz
              break
            default:
              return
          }
          e({ field: t, value: i, shouldFinalize: !0, track: "reset" })
        }
      },
      { children: n }
    )
  )
}
const gi = { "-100": "-100%", "-50": "", 0: (0, Ht.jsx)("strong", { children: "0%" }), 50: "", 100: "+100%" },
  pi = { width: "wall-thickness", bias: "wall-offset" }
function wi(t) {
  const { wall: e } = t,
    { analytics: i } = (0, Ft.useContext)(AppReactContext),
    s = (0, Be.S)(),
    n = (0, li.O)(),
    a = (0, Gt.b)(),
    o = xe(),
    r = n === UnitTypeKey.IMPERIAL,
    d = a.t(PhraseKey.SHOWCASE.ROOMS.WALL_TYPE),
    c = a.t(PhraseKey.SHOWCASE.ROOMS.WALL_THICKNESS),
    h = a.t(PhraseKey.SHOWCASE.ROOMS.WALL_TYPE_SOLID),
    l = a.t(PhraseKey.SHOWCASE.ROOMS.WALL_TYPE_DIVIDER),
    m = r ? ei.j : ei.v1,
    u = r ? ei.Xw : ei._v,
    g = (0, ri.D)(() => {
      null == s || s.finalizeHistory()
    }, 250),
    p = ({ field: t, value: n, shouldFinalize: a = !1, shouldUpdate: o = !0, formatValue: r, track: d }) => {
      if (!s || !e || !o) return
      const c = {},
        h = r ? r(n) : n
      ;(c[t] = h), s.setEdgeProperties(e.id, c), a && g(), d && i.trackToolGuiEvent("rooms", `rooms_${d}_${pi[t]}`)
    },
    w = (t, e = 0) => Number(t.toFixed(e)),
    b = t => Math.round(100 * t) / 100,
    S = t => b(r ? (0, hi.Cb)(t) : (0, hi.KL)(10 * t)),
    D = t => {
      const e = t / 200 + ei.sf
      return w(e, 2)
    },
    v = t => {
      const n = t.target
      if (!s || !e || !o) return
      const a = n.value,
        r = { type: a, width: s.getLastWallWidth(a) }
      s.setEdgeProperties(e.id, r), s.finalizeHistory(), (o.wallType = a), i.trackToolGuiEvent("rooms", `rooms_wall_change_to_${a}`)
    },
    y = (0, Ft.useMemo)(
      () =>
        ((t = ei.Oz) => {
          if (r) {
            const e = (0, hi._w)(t)
            return w(e, 1)
          }
          return w(Math.round((0, hi.Hr)(t) / 10))
        })(null == e ? void 0 : e.width),
      [null == e ? void 0 : e.width]
    ),
    E = (0, Ft.useMemo)(
      () =>
        ((t = ei.Yb) => {
          const e = t - ei.sf
          return Math.floor(2 * e * 100)
        })(null == e ? void 0 : e.bias),
      [null == e ? void 0 : e.bias]
    )
  return e
    ? (0, Ht.jsxs)(Ht.Fragment, {
        children: [
          (0, Ht.jsxs)(
            "div",
            Object.assign(
              { className: "roombound-editor-section" },
              {
                children: [
                  (0, Ht.jsx)("div", Object.assign({ className: "h6" }, { children: d })),
                  (0, Ht.jsxs)("div", {
                    children: [
                      (0, Ht.jsx)(
                        di.E,
                        Object.assign(
                          { name: "wall_type_solid", value: `${WallType.SOLID}`, id: "solid", enabled: !0, checked: e.type === WallType.SOLID, onChange: v },
                          { children: h }
                        )
                      ),
                      (0, Ht.jsx)(
                        di.E,
                        Object.assign(
                          { name: "wall_type", value: `${WallType.DIVIDER}`, id: "divider", enabled: !0, checked: e.type === WallType.DIVIDER, onChange: v },
                          { children: l }
                        )
                      )
                    ]
                  })
                ]
              }
            )
          ),
          e.type !== WallType.DIVIDER &&
            (0, Ht.jsxs)(Ht.Fragment, {
              children: [
                (0, Ht.jsxs)(
                  "div",
                  Object.assign(
                    { className: "roombound-editor-section" },
                    {
                      children: [
                        (0, Ht.jsx)("div", Object.assign({ className: "h6" }, { children: c })),
                        (0, Ht.jsx)(ci.Y, {
                          value: y,
                          units: r ? "in" : "cm",
                          min: m,
                          max: u,
                          step: r ? ei.YU : ei.BC,
                          validator: t => /^-{0,1}\d*\.*\d*$/.test(t.toString()),
                          fixValue: r ? t => w(t, 1) : t => w(t),
                          onChanged: t => p({ field: "width", value: t, formatValue: S, shouldUpdate: t >= m && t <= u && ![0, ""].includes(t) }),
                          onDone: t => p({ field: "width", value: t, formatValue: S, shouldFinalize: !0, track: "change" })
                        }),
                        (0, Ht.jsx)(ui, { field: "width", update: p })
                      ]
                    }
                  )
                ),
                (0, Ht.jsxs)(
                  "div",
                  Object.assign(
                    { className: "roombound-editor-section" },
                    {
                      children: [
                        (0, Ht.jsx)("div", Object.assign({ className: "h6" }, { children: "Wall Offset" })),
                        (0, Ht.jsx)(Slider, {
                          value: E,
                          min: -100,
                          max: 100,
                          step: 1,
                          marks: gi,
                          included: !1,
                          onChange: t => p({ field: "bias", value: t, formatValue: D }),
                          onAfterChange: t => p({ field: "bias", value: t, formatValue: D, shouldFinalize: !0, track: "change" }),
                          handleRender: t =>
                            (0, Ht.jsx)(
                              "div",
                              Object.assign({}, t.props, {
                                children: (0, Ht.jsx)(
                                  "div",
                                  Object.assign(
                                    { className: "rc-slider-custom-tooltip" },
                                    {
                                      children: (0, Ht.jsxs)(
                                        "div",
                                        Object.assign(
                                          { className: "rc-slider-custom-tooltip-content" },
                                          {
                                            children: [
                                              (0, Ht.jsx)("div", { className: "rc-slider-custom-tooltip-arrow" }),
                                              (0, Ht.jsx)("div", Object.assign({ className: "rc-slider-custom-tooltip-inner" }, { children: E }))
                                            ]
                                          }
                                        )
                                      )
                                    }
                                  )
                                )
                              })
                            )
                        }),
                        (0, Ht.jsx)(ui, { field: "bias", update: p })
                      ]
                    }
                  )
                )
              ]
            })
        ]
      })
    : null
}
function bi({ wallOpening: t }) {
  const { analytics: e } = (0, Ft.useContext)(AppReactContext),
    i = (0, Be.S)(),
    s = (0, Gt.b)(),
    n = xe()
  if (!t) return null
  const a = s.t(PhraseKey.SHOWCASE.ROOMS.DOORWAY_TYPE),
    o = s.t(PhraseKey.SHOWCASE.ROOMS.DOORWAY_TYPE_DOOR),
    r = s.t(PhraseKey.SHOWCASE.ROOMS.DOORWAY_TYPE_OPENING),
    d = s => {
      const a = s.target
      if (!i || !t || !n) return
      const o = a.value,
        r = { type: o }
      e.trackToolGuiEvent("rooms", `rooms_opening_change_to_${o}`), i.editWallOpeningDetails(t.id, r), i.finalizeHistory(), (n.wallOpeningType = o)
    }
  return (0, Ht.jsxs)(
    "div",
    Object.assign(
      { className: "roombound-editor-section" },
      {
        children: [
          (0, Ht.jsx)("div", Object.assign({ className: "h6" }, { children: a })),
          (0, Ht.jsxs)(
            "div",
            Object.assign(
              { className: "wall-opening-type-selector" },
              {
                children: [
                  (0, Ht.jsx)(
                    di.E,
                    Object.assign(
                      {
                        name: "wall_type_solid",
                        value: `${RelativePosType.DOOR}`,
                        id: "wall-type-selection-solid",
                        enabled: !0,
                        checked: t.type === RelativePosType.DOOR,
                        onChange: d
                      },
                      { children: o }
                    )
                  ),
                  (0, Ht.jsx)(
                    di.E,
                    Object.assign(
                      {
                        name: "wall_type",
                        value: `${RelativePosType.OPENING}`,
                        id: "wall-type-selection-divider",
                        enabled: !0,
                        checked: t.type === RelativePosType.OPENING,
                        onChange: d
                      },
                      { children: r }
                    )
                  )
                ]
              }
            )
          )
        ]
      }
    )
  )
}
function Si(t, e) {
  const i = xe(),
    s = (0, Ie.h)(i, e, null),
    n = (0, Be.S)()
  if (!n || !s) return null
  const a = n.getEntity(s)
  return a instanceof t ? a : null
}
function Di() {
  const t = (0, Be.S)(),
    e = Ve(),
    i = Pe()
  return !(!i || (e !== DragAndDropObject.ToolState.SELECTED && e !== DragAndDropObject.ToolState.EDITING) || !(null == t ? void 0 : t.canDeleteEntity(i)))
}
function vi() {
  const { entity: t } = (function () {
      const [t, e] = (0, Ft.useState)({ entity: null }),
        i = Si(RoomWall, "selected"),
        s = Si(RoomWall, "pendingAdd"),
        n = i || s,
        a = (0, Be.S)()
      return (
        (0, Ft.useEffect)(() => {
          function t(t) {
            e({ entity: t })
          }
          const i =
            null == a
              ? void 0
              : a.onWallsChanged({
                  onUpdated: e => {
                    e.id === (null == n ? void 0 : n.id) && t(e)
                  },
                  onRemoved: () => t(null)
                })
          return t(n), () => (null == i ? void 0 : i.cancel())
        }, [n, a]),
        t
      )
    })(),
    { entity: e } = (function () {
      const [t, e] = (0, Ft.useState)({ entity: null }),
        i = Si(WallOpening, "selected"),
        s = Si(WallOpening, "pendingAdd"),
        n = i || s,
        a = (0, Be.S)()
      return (
        (0, Ft.useEffect)(() => {
          function t(t) {
            e({ entity: t })
          }
          const i =
            null == a
              ? void 0
              : a.onOpeningsChanged({
                  onUpdated: e => {
                    e.id === (null == n ? void 0 : n.id) && t(e)
                  },
                  onRemoved: () => t(null)
                })
          return t(n), () => (null == i ? void 0 : i.cancel())
        }, [n, a]),
        t
      )
    })(),
    { entity: i } = (function () {
      const [t, e] = (0, Ft.useState)({ entity: null }),
        i = Si(Room, "selected"),
        s = Si(Room, "pendingEdit"),
        n = i || s,
        a = (0, Be.S)()
      return (
        (0, Ft.useEffect)(() => {
          function t(t) {
            e({ entity: t })
          }
          const i = e => {
              e.id === (null == n ? void 0 : n.id) && t(e)
            },
            s = null == a ? void 0 : a.onRoomsChanged({ onUpdated: i, onChildUpdated: i, onRemoved: () => t(null) })
          return t(n), () => (null == s ? void 0 : s.cancel())
        }, [n, a]),
        t
      )
    })(),
    s = Ae(),
    n = Di(),
    a = (0, _e.v)(),
    o = (0, Gt.b)(),
    { analytics: r, engine: d } = (0, Ft.useContext)(AppReactContext),
    h = tryGetModuleBySymbolSync(WorkShopRoomBoundToolSymbol),
    l = (0, ke.T)(),
    m = (0, He.R)(),
    u = o.t(PhraseKey.SHOWCASE.ROOMS.BACK),
    g = o.t(PhraseKey.WORKSHOP.ROOMS.DELETE)
  if (
    ((0, Ft.useEffect)(() => {
      i || t || e ? d.broadcast(new AssetDockedMessage()) : d.broadcast(new AssetUndockedMessage())
    }, [i, t, e, d]),
    !h)
  )
    return null
  async function p() {
    h && (await h.cancelEdit(), d.broadcast(new AssetUndockedMessage()))
  }
  const w = l === ToolPanelLayout.BOTTOM_PANEL,
    b = m && m !== Ue.P.CONFIRM,
    S = !!(t || e || i) && (!w || !b)
  return (0, Ht.jsxs)(Ht.Fragment, {
    children: [
      (0, Ht.jsxs)(
        Fe.J,
        Object.assign(
          { open: S, onClose: p },
          {
            children: [
              (0, Ht.jsxs)(
                "div",
                Object.assign(
                  { className: "detail-panel-header" },
                  {
                    children: [
                      (0, Ht.jsx)(oe.P, { label: u, className: "return-btn", size: Jt.qE.SMALL, icon: "back", onClose: p }),
                      n &&
                        (0, Ht.jsx)(Jt.zx, {
                          label: g,
                          className: "delete-btn",
                          icon: "delete",
                          iconSize: Jt.Jh.SMALL,
                          size: Jt.qE.SMALL,
                          variant: Jt.Wu.TERTIARY,
                          onClick: function () {
                            n && s && h && (r.trackToolGuiEvent("rooms", `rooms_delete_${s.getEntityAnalytic()}`), h.deleteEntity(s.id), h.exitEdit())
                          }
                        })
                    ]
                  }
                )
              ),
              (0, Ht.jsxs)(
                "div",
                Object.assign(
                  { className: "room-editor" },
                  { children: [i && (0, Ht.jsx)(ai, { room: i }), (0, Ht.jsx)(wi, { wall: t }), (0, Ht.jsx)(bi, { wallOpening: e })] }
                )
              )
            ]
          }
        )
      ),
      !a && (0, Ht.jsx)(Ne, {})
    ]
  })
}
function Ei() {
  const { analytics: t } = (0, Ft.useContext)(AppReactContext),
    e = Ve(),
    i = (function () {
      const t = useData(RoomBoundData),
        [e, i] = (0, Ft.useState)(t ? t.availableUndos() : 0)
      return (
        (0, Ft.useEffect)(() => {
          if (!t) return () => {}
          const e = t.onChanged(() => i(t.availableUndos()))
          return i(t.availableUndos()), () => e.cancel()
        }, [t]),
        e
      )
    })(),
    s = (function () {
      const t = xe()
      return (0, Ie.h)(t, "addType", N.WALLS)
    })(),
    n = (function () {
      const t = xe()
      return (0, Ie.h)(t || null, "wallType", WallType.SOLID)
    })(),
    a = (0, Gt.b)(),
    o = Di(),
    r = tryGetModuleBySymbolSync(WorkShopRoomBoundToolSymbol)
  if (!r) return null
  const d = e === DragAndDropObject.ToolState.ADDING || e === DragAndDropObject.ToolState.WAIT_FOR_ADD,
    c = a.t(PhraseKey.WORKSHOP.ROOMS.SELECT),
    h = a.t(PhraseKey.WORKSHOP.ROOMS.DELETE),
    l = a.t(PhraseKey.WORKSHOP.ROOMS.UNDO),
    m = i > 0,
    u = a.t(PhraseKey.SHOWCASE.ROOMS.WALL_TYPE_SOLID),
    g = a.t(PhraseKey.SHOWCASE.ROOMS.WALL_TYPE_DIVIDER),
    p = d && s === N.WALLS && n === WallType.SOLID,
    w = d && s === N.WALLS && n === WallType.DIVIDER,
    b = a.t(PhraseKey.SHOWCASE.ROOMS.DOORWAY_TYPE_DOOR),
    S = a.t(PhraseKey.SHOWCASE.ROOMS.DOORWAY_TYPE_OPENING),
    y = d && s === N.DOORS,
    E = d && s === N.OPENINGS,
    f = "dark-monochromatic",
    M = "bottom"
  return (0, Ht.jsx)(
    "div",
    Object.assign(
      { className: "overlay grid-overlay" },
      {
        children: (0, Ht.jsx)(
          yi.o,
          Object.assign(
            { className: "roombound-action-bar" },
            {
              children: (0, Ht.jsxs)(
                Jt.hE,
                Object.assign(
                  { className: "roombound-button-group" },
                  {
                    children: [
                      (0, Ht.jsx)(Jt.zx, {
                        icon: "arrow",
                        variant: Jt.Wu.TERTIARY,
                        theme: f,
                        active: !d,
                        onClick: () => {
                          r.cancelEdit()
                        },
                        tooltip: c,
                        tooltipOptions: { placement: M }
                      }),
                      (0, Ht.jsx)("div", { className: "bar-divider" }),
                      (0, Ht.jsx)(Jt.zx, {
                        icon: "wall",
                        variant: Jt.Wu.TERTIARY,
                        theme: f,
                        active: p,
                        onClick: () => {
                          t.trackToolGuiEvent("rooms", "rooms_wall_add_clicked"), r.addEntity(N.WALLS, WallType.SOLID)
                        },
                        tooltip: u,
                        tooltipOptions: { placement: M }
                      }),
                      (0, Ht.jsx)(Jt.zx, {
                        icon: "invisible-wall",
                        variant: Jt.Wu.TERTIARY,
                        theme: f,
                        active: w,
                        onClick: () => {
                          t.trackToolGuiEvent("rooms", "rooms_invisible_wall_add_clicked"), r.addEntity(N.WALLS, WallType.DIVIDER)
                        },
                        tooltip: g,
                        tooltipOptions: { placement: M }
                      }),
                      (0, Ht.jsx)(Jt.zx, {
                        icon: "door",
                        variant: Jt.Wu.TERTIARY,
                        theme: f,
                        active: y,
                        onClick: () => {
                          t.trackToolGuiEvent("rooms", "rooms_door_add_clicked"), r.addEntity(N.DOORS)
                        },
                        tooltip: b,
                        tooltipOptions: { placement: M }
                      }),
                      (0, Ht.jsx)(Jt.zx, {
                        icon: "opening",
                        variant: Jt.Wu.TERTIARY,
                        theme: f,
                        active: E,
                        onClick: () => {
                          t.trackToolGuiEvent("rooms", "rooms_opening_add_clicked"), r.addEntity(N.OPENINGS)
                        },
                        tooltip: S,
                        tooltipOptions: { placement: M }
                      }),
                      (0, Ht.jsx)("div", { className: "bar-divider" }),
                      (0, Ht.jsx)(Jt.zx, {
                        icon: "revert",
                        variant: Jt.Wu.TERTIARY,
                        theme: f,
                        disabled: !m,
                        onClick: () => {
                          r.undo()
                        },
                        tooltip: l,
                        tooltipOptions: { placement: M }
                      }),
                      (0, Ht.jsx)(Jt.zx, {
                        icon: "trash",
                        variant: Jt.Wu.TERTIARY,
                        theme: f,
                        disabled: !o,
                        onClick: () => {
                          o && r.deleteEntity(null)
                        },
                        tooltip: h,
                        tooltipOptions: { placement: M }
                      })
                    ]
                  }
                )
              )
            }
          )
        )
      }
    )
  )
}
class fi {
  constructor() {}
  renderOverlay() {
    return (0, Ht.jsx)(Ei, {})
  }
  renderPanel() {
    return (0, Ht.jsx)(vi, {})
  }
}
export default class RoomToolModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "room-tool-module"),
      (this.disabledAssets = { [FeaturesSweepPucksKey]: !1, [Features360ViewsKey]: !1, [featuresMattertagsKey]: !1, [FeaturesNotesKey]: !1 }),
      (this.viewListener = { addView: (t, e) => this.inputManager.addEditableEntity(t, e), removeView: t => this.inputManager.removeEditableEntity(t) }),
      (this.activate = async () => {
        await this.roomBoundDataModule.setReadOnly(!1),
          this.disableUnrelatedAssets.toggle(!0),
          (this.floorsViewData.onlyShowActiveFloor.value = !0),
          await this.commandBinder.issueCommand(new RoomBoundSetAllowRenderingCommand(!1)),
          await StartTransition(this.cameraData, this.viewmodeData),
          await this.transitionViewmode(),
          await this.commandBinder.issueCommand(new DisableCursorMeshCommand(!0)),
          await StartTransition(this.cameraData, this.viewmodeData),
          await this.commandBinder.issueCommand(new LockViewmodeCommand()),
          await this.commandBinder.issueCommand(new DisableAllFloorsOptionCommand()),
          await this.commandBinder.issueCommand(new LockFloorNavCommand()),
          await this.cameraModule.moveTo({ transitionType: TransitionTypeList.OrbitTo, pose: {}, autoOrtho: !0, targetPhi: TargetPhi.Top }),
          this.updateCursor(),
          this.editor.start(),
          this.renderer.startRendering(!1, this.viewListener, () => this.editor.state.toolState === DragAndDropObject.ToolState.ADDING),
          this.inputManager.activate()
      }),
      (this.transitionViewmode = async () => {
        this.isPeekabooActive()
          ? this.cameraData.isOrtho() || (await this.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.FLOORPLAN)))
          : (await this.commandBinder.issueCommand(
              new ChangeViewmodeCommand(ViewModeCommand.DOLLHOUSE, TransitionTypeList.FadeToBlack, this.getStartCameraPose(), DEFAULT_TRANSITION_TIME / 2)
            ),
            await this.commandBinder.issueCommand(
              new DollhouseVerticalLimitsCommand({ phiUpperLimitDegrees: 90, phiLowerLimitDegrees: lt.bp * MathUtils.RAD2DEG, noTransition: !0 })
            ),
            await this.commandBinder.issueCommand(new TransitionViewmodeCommand()),
            await this.commandBinder.issueCommand(new SwapMouseBtnActionCommand()))
      }),
      (this.deactivate = async () => {
        await this.roomBoundDataModule.setReadOnly(!1),
          this.editor.exit(),
          this.renderer.stopRendering(),
          this.inputManager.deactivate(),
          this.disableUnrelatedAssets.toggle(!1),
          this.snappingAxesRenderer.hide()
        const t = this.cameraData.isOrtho(),
          e = this.cameraData.orthoZoom(),
          i = this.cameraData.pose.fovCorrectedPosition(),
          s = this.cameraData.pose.rotation.clone()
        await this.commandBinder.issueCommand(new UnlockViewmodeCommand()),
          await this.commandBinder.issueCommand(new DollhouseVerticalLimitsCommand({ noTransition: !0 })),
          t || this.isPeekabooActive() || (await this.commandBinder.issueCommand(new NoTransitionViewmodeCommand())),
          await this.commandBinder.issueCommand(new RestoreMouseBtnActionCommand()),
          await this.commandBinder.issueCommand(new EnableAllFloorsOptionCommand()),
          await this.commandBinder.issueCommand(new DisableCursorMeshCommand(!1)),
          await this.commandBinder.issueCommand(new UnlockFloorNavCommand()),
          await this.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT)),
          (this.floorsViewData.onlyShowActiveFloor.value = !1),
          t &&
            (await this.commandBinder.issueCommand(
              new ChangeViewmodeCommand(ViewModeCommand.FLOORPLAN, TransitionTypeList.Instant, { position: i, rotation: s, zoom: e })
            )),
          await this.commandBinder.issueCommand(new RoomBoundSetAllowRenderingCommand(!0))
      }),
      (this.undo = async () => {
        await this.ensureValidViewMode(), this.editor.discard(), this.data.undo(), this.engine.broadcast(new RoomToolModuleUndoMessage())
      }),
      (this.edit = t => {
        const e = this.editor.state
        e.toolState === DragAndDropObject.ToolState.EDITING && e.currentId && this.editor.tryCommit(), this.editor.edit(t)
      }),
      (this.cancelEdit = async () => {
        await this.ensureValidViewMode(), this.editor.discard()
      }),
      (this.exitEdit = () => {
        this.editor.discard()
      }),
      (this.deleteEntity = async t => {
        await this.ensureValidViewMode()
        const e = this.editor.state,
          i = t || e.currentId
        i && (this.engine.broadcast(new RoomToolModuleDeletedMessage(i)), this.editor.discard(), this.data.deleteEntity(i), this.data.finalizeHistory())
      }),
      (this.addEntity = async (t, e) => {
        await this.ensureValidViewMode()
        const i = this.editor.state.toolState
        i !== DragAndDropObject.ToolState.IDLE && i !== DragAndDropObject.ToolState.SELECTED && this.editor.discard(),
          (this.editor.state.addType = t),
          void 0 !== e && (this.editor.state.wallType = e),
          this.editor.waitForAdd()
      }),
      (this.updateCursor = () => {
        this.commandBinder.issueCommand(new SetMouseCursorCommand(this.editor.state.cursor))
      }),
      (this.raycastModel = (() => {
        const t = new Raycaster()
        let e = -1,
          i = ""
        return (s, n) => {
          const a = this.modelMesh.setChunkSide(DoubleSide)
          t.set(s, DirectionVector.DOWN)
          const o = this.raycaster.getOctree(),
            r = n === i ? e : this.floorsData.getFloor(n).meshGroup
          ;(i = n), (e = r)
          const d = o.raycast(t).filter(t => {
            return (e = t.object) instanceof RoomMesh && e.meshGroup === r
            var e
          })
          return this.modelMesh.setChunkSide(a), d
        }
      })())
  }
  async init(t, e: EngineContext) {
    ;(this.commandBinder = e.commandBinder), (this.engine = e)
    const [i, n, r, d, c, h, l, m, u, g, p, w, b, S, E, f] = await Promise.all([
      e.getModuleBySymbol(InputSymbol),
      e.getModuleBySymbol(RaycasterSymbol),
      e.getModuleBySymbol(RoomBoundDataSymbol),
      e.market.waitForData(RoomBoundData),
      e.getModuleBySymbol(WebglRendererSymbol),
      e.market.waitForData(SettingsData),
      e.market.waitForData(FloorsViewData),
      e.getModuleBySymbol(CameraSymbol),
      e.market.waitForData(CameraData),
      e.market.waitForData(ViewmodeData),
      e.market.waitForData(AppData),
      e.market.waitForData(FloorsData),
      e.getModuleBySymbol(ModelMeshSymbol),
      e.getModuleBySymbol(RoomBoundRendererSymbol),
      e.market.waitForData(SearchData),
      e.market.waitForData(LayersData)
    ])
    if ((await b.firstMeshLoadPromise, f.isWorkshopSessionView())) return void this.log.warn("Room plan not available in workshop session.")
    ;(this.roomBoundDataModule = r),
      e.broadcast(new WorkShopFeatureMessage(RoomBoundsKey)),
      (this.data = d),
      (this.data.raycast = this.raycastModel),
      (this.data.onActionError = t => {
        ;(this.applicationData.error = t), this.applicationData.commit()
      }),
      (this.floorsViewData = l),
      (this.cameraModule = m),
      (this.cameraData = u),
      (this.viewmodeData = g),
      (this.applicationData = p),
      (this.settingsData = h),
      (this.raycaster = n),
      (this.floorsData = w),
      (this.modelMesh = b),
      (this.renderer = S),
      (this.disableUnrelatedAssets = new SettingsToggler(h, this.disabledAssets)),
      (this.snappingAxesRenderer = new Ct(c.getScene()))
    const O = new Vector3(),
      M = () => {
        var t
        const e = i.getCurrentPointerRay()
        return O.set(0, 0, 0), l.currentFloor && e.intersectPlane(null === (t = l.currentFloor) || void 0 === t ? void 0 : t.groundPlane, O), O
      }
    ;(this.editor = new Dt(
      this,
      M,
      () => isPitchFactorOrtho(u.pose.pitchFactor()),
      i,
      n,
      e.msgBus,
      d,
      this.floorsViewData,
      this.settingsData,
      e.commandBinder,
      t.rootNode
    )),
      this.addToolPanel(E),
      (this.inputManager = new F(this.editor, d, M, u, this.snappingAxesRenderer, i.keyboardState)),
      this.bindings.push(
        this.editor.subscribe(DragAndDropObject.Events.CurrentChange, ({ target: t }) => {
          this.engine.broadcast(new RoomToolModuleClickedMessage(t))
        }),
        this.editor.subscribe(DragAndDropObject.Events.EditConfirm, ({ target: t }) => {
          this.engine.broadcast(new RoomToolModuleMovedMessage(t))
        }),
        this.editor.subscribe(DragAndDropObject.Events.AddConfirm, ({ target: t }) => {
          this.engine.broadcast(new RoomToolModuleAddedMessage(t))
        }),
        this.editor.state.onPropertyChanged("cursor", this.updateCursor)
      )
  }
  dispose(t) {
    super.dispose(t)
  }
  async addToolPanel(t) {
    const e = new ToolObject({
      id: ToolsList.ROOM_BOUNDS,
      searchModeType: searchModeType.MODELROOM,
      panel: !0,
      icon: "icon-edit-floorplan",
      palette: ToolPalette.MODEL_BASED,
      enabled: !0,
      dimmed: !1,
      manager: new ne(this, t, this.editor.state),
      ui: new fi(),
      namePhraseKey: PhraseKey.TOOLS.ROOMPLAN,
      badgePhraseKey: PhraseKey.WORKSHOP.EDIT_BAR.NEW_BADGE,
      allViewsPhraseKey: PhraseKey.WORKSHOP.ROOMS.APPLY_TO_ALL_VIEWS_ROOMS,
      analytic: "rooms",
      showModeControls: !1,
      showTourControls: !1,
      helpMessagePhraseKey: PhraseKey.TOOLS.ROOMPLAN_HELP_MESSAGE,
      helpHref: "https://support.matterport.com/s/article/Automated-Rooms-Measurements-and-Property-Report"
    })
    this.engine.commandBinder.issueCommand(new RegisterToolsCommand([e]))
  }
  editRoomData(t, e, i) {
    this.data.getRoom(e)[t] !== i && (this.data.setRoomDetails(e, { [t]: i }), this.data.finalizeHistory())
  }
  editRoomTypes(t, e) {
    const i = this.data.getRoom(t).classifications.map(t => t.id)
    if (!sameArray(e, i)) {
      const i = e.map(t => this.data.roomClassifications[t]),
        { location: s, includeInAreaCalc: n, hide: a, keywords: o } = getRoomConfig(extractRoomKeywords(i))
      this.data.setRoomDetails(t, { roomTypeIds: e, location: s, includeInAreaCalc: n, hide: a, keywords: o }), this.data.finalizeHistory()
    }
  }
  getStartCameraPose() {
    const t = this.floorsViewData.currentFloor || this.floorsViewData.getFloor(this.floorsViewData.bottomFloorId),
      e = t.bottom,
      i = t.boundingBox.getCenter(new Vector3())
    i.y = e
    const s = t.boundingBox.max.clone()
    s.y = e
    const n = i.distanceTo(s) / Math.tan((CameraRigConfig.fov / 2) * MathUtils.DEG2RAD),
      a = CameraQuaternion.DOWNWARD.clone().multiply(new Quaternion().setFromAxisAngle(DirectionVector.RIGHT, 45 * MathUtils.DEG2RAD)),
      o = DirectionVector.FORWARD.clone()
        .applyQuaternion(a)
        .multiplyScalar(-1 * n)
    return { position: i.clone().add(o), rotation: a }
  }
  async ensureValidViewMode() {
    this.cameraData.pose.autoOrthoApplied &&
      (await this.cameraModule.moveTo({ transitionType: TransitionTypeList.OrbitTo, pose: {}, autoOrtho: !0, targetPhi: TargetPhi.Top }))
  }
  isPeekabooActive() {
    return this.settingsData.tryGetProperty(DollhousePeekabooKey, !1)
  }
}
