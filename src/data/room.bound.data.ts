import RBush from "rbush"

import { Line3, MathUtils, Triangle, Vector2, Vector3 } from "three"
import * as J from "../const/75668"
import { edgeType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { createSubscription } from "../core/subscription"
import { isSegmentInsidePolygon } from "../math/65661"
import { isPointInPolygon } from "../math/69877"
import { RoomBoundErrorMessage } from "../message/room.message"
import * as g from "../other/15004"
import { reverseNodes } from "../other/15004"
import * as m from "../other/43517"
import * as re from "../other/62944"
import * as oe from "../other/84784"
import { CheckThreshold } from "../utils/49827"
import { randomString11 } from "../utils/92558"
import { substrString } from "../utils/func.utils"
import { MergeSets, SetHas } from "../webgl/58353"
import { WallOpening } from "../webgl/80978"
import { RbushBboxNode } from "../webgl/rbushBbox.node"
import { LocationType, NoneType, Room, containsKeyword, getRoomConfig } from "../webgl/room"
import { RoomWall, WallType } from "../webgl/room.wall"
import { UndoBuffer } from "../webgl/undo.buffer"
import { DirectionVector } from "../webgl/vector.const"
class UndoBufferItem {
  afterAction: Function
  actions: UndoBufferItem[]
  constructor(e: Function) {
    this.afterAction = e
    this.actions = []
  }
  run() {
    for (const e of this.actions) e.run(), this.afterAction()
  }
  invert() {
    for (let e = this.actions.length - 1; e >= 0; e--) {
      this.actions[e].invert()
      this.afterAction()
    }
  }
  merge(e) {
    if (0 === this.actions.length) this.actions.push(e)
    else {
      const t = this.actions[this.actions.length - 1]
      ;(t && t.merge(e)) || this.actions.push(e)
    }
    return !0
  }
  logInfo() {
    return this.actions.map(e => Object.assign({ undo: !0 }, e.logInfo()))
  }
  lastAction() {
    return this.actions.length ? this.actions[this.actions.length - 1] : null
  }
}
class RoomBoundUndoBuffer {
  afterAction: Function
  undoBuffer: UndoBuffer<UndoBufferItem>
  finalized: boolean
  constructor(e) {
    this.afterAction = e
    this.undoBuffer = new UndoBuffer(50)
    this.finalized = !1
  }
  push(e) {
    ;(this.undoBuffer.isEmpty() || this.finalized) && (this.undoBuffer.push(new UndoBufferItem(this.afterAction)), (this.finalized = !1))
    const t = this.undoBuffer.peek()
    t && t.merge(e)
  }
  pop() {
    return this.undoBuffer.pop()
  }
  peek() {
    return this.undoBuffer.peek()
  }
  finalize() {
    this.finalized = !0
  }
  availableUndos() {
    return this.undoBuffer.count
  }
  clear() {
    this.undoBuffer.clear()
  }
}
class RoomBoundNode<T = any> {
  data: Map<string, T>
  addedObservers: Set<Function>
  updatedObservers: Set<Function>
  childUpdatedObservers: Set<Function>
  deletedObservers: Set<Function>
  constructor() {
    this.data = new Map()
    this.addedObservers = new Set()
    this.updatedObservers = new Set()
    this.childUpdatedObservers = new Set()
    this.deletedObservers = new Set()
  }
  clear() {
    this.data.clear()
  }
  get(e: string) {
    return this.data.get(e)
  }
  set(e: string, t: T) {
    this.data.set(e, t)
  }
  delete(e: string) {
    this.data.delete(e)
  }
  has(e: string) {
    return this.data.has(e)
  }
  get size() {
    return this.data.size
  }
  onChanged(e) {
    return createSubscription(
      () => {
        e.onAdded && this.addedObservers.add(e.onAdded),
          e.onUpdated && this.updatedObservers.add(e.onUpdated),
          e.onChildUpdated && this.childUpdatedObservers.add(e.onChildUpdated),
          e.onRemoved && this.deletedObservers.add(e.onRemoved)
      },
      () => {
        e.onAdded && this.addedObservers.delete(e.onAdded),
          e.onUpdated && this.updatedObservers.delete(e.onUpdated),
          e.onChildUpdated && this.childUpdatedObservers.delete(e.onChildUpdated),
          e.onRemoved && this.deletedObservers.delete(e.onRemoved)
      },
      !0
    )
  }
}

class BaseAction {
  data: RoomBoundData
  inputs: any
  _outputCache: any
  onRun(e: any) {}
  onInvert(...e: any) {}
  name() {
    return ""
  }
  constructor(e, t) {
    this.data = e
    this.inputs = t
    this._outputCache = null
  }
  run() {
    this._outputCache = this.onRun(this.inputs)
  }
  invert() {
    if (!this._outputCache) throw new Error("Attempted to inverse a data action before running it")
    this.onInvert(this._outputCache, this.inputs), (this._outputCache = null)
  }
  merge(e) {
    return !1
  }
  get output() {
    if (this._outputCache) return this._outputCache
    throw new Error("Tried to read output of an action before it was run")
  }
  logInfo() {
    return Object.assign({ name: this.name() }, this.inputs)
  }
}
class MoveNode extends BaseAction {
  onRun(e) {
    const t = this.data.getNode(e.nodeId)!
    const o = { x: t.x, z: t.z }
    this.data._updateNode(e.nodeId, e.newPos)
    this.data._updateDependentsForNodes(t)
    return { prevPos: o }
  }
  onInvert(e, t) {
    this.data._updateNode(t.nodeId, e.prevPos)
    const o = this.data.getNode(t.nodeId)!
    this.data._updateDependentsForNodes(o)
  }
  merge(e) {
    return e instanceof MoveNode && e.inputs.nodeId === this.inputs.nodeId && ((this.inputs.newPos = e.inputs.newPos), !0)
  }
  name() {
    return "MoveNode"
  }
}
class AddFloatingEdge extends BaseAction {
  onRun(e) {
    const t = this.data._createNode(e.from, e.floorId)
    const o = this.data._createNode(e.to, e.floorId)
    const s = this.data._createWall(e.type, t, o, e.width, [], 0.5)
    return { fromId: t.id, toId: o.id, wall: s.id }
  }
  onInvert(e, t) {
    this.data._deleteWall(e.wall)
    this.data._deleteNode(e.fromId)
    this.data._deleteNode(e.toId)
  }
  merge(e) {
    return !!(e instanceof MoveNode && this._outputCache && e.inputs.nodeId === this._outputCache.toId) && ((this.inputs.to = e.inputs.newPos), !0)
  }
  name() {
    return "AddFloatingEdge"
  }
}
class MoveEdge extends BaseAction {
  onRun(e) {
    const t = this.data.getWall(e.wallId)!
    const o = t.from.getPoint()
    const s = t.to.getPoint()
    return (
      this.data._updateNode(t.from.id, e.newFromPos),
      this.data._updateNode(t.to.id, e.newToPos),
      this.data._updateDependentsForNodes(t.from, t.to),
      { prevFromPos: o, prevToPos: s }
    )
  }
  onInvert(e, t) {
    const o = this.data.getWall(t.wallId)!
    this.data._updateNode(o.from.id, e.prevFromPos)
    this.data._updateNode(o.to.id, e.prevToPos)
    this.data._updateDependentsForNodes(o.from, o.to)
  }
  merge(e) {
    return (
      e instanceof MoveEdge &&
      e.inputs.wallId === this.inputs.wallId &&
      ((this.inputs.newFromPos = e.inputs.newFromPos), (this.inputs.newToPos = e.inputs.newToPos), !0)
    )
  }
  name() {
    return "MoveEdge"
  }
}
class AddTrailingEdgeToNode extends BaseAction {
  onRun(e) {
    const t = this.data.getNode(e.fromId)!
    const o = this.data._createNode(e.to, t.floorId)
    const s = this.data._createWall(e.type, t, o, e.width, [], 0.5)
    return { toId: o.id, wall: s.id }
  }
  onInvert(e, t) {
    this.data._deleteWall(e.wall), this.data._deleteNode(e.toId)
  }
  merge(e) {
    return !!(e instanceof MoveNode && this._outputCache && e.inputs.nodeId === this._outputCache.toId) && ((this.inputs.to = e.inputs.newPos), !0)
  }
  name() {
    return "AddTrailingEdgeToNode"
  }
}
class WallBase extends BaseAction {
  modificationRecord: any
  run() {
    super.run()
    this.computeRooms()
    this._outputCache &&
      this._outputCache.updateNodeDependencies.length &&
      this.data._updateDependentsForNodes(...this._outputCache.updateNodeDependencies.map(e => this.data.getNode(e)))
  }

  invert() {
    let e
    if (!this._outputCache) throw new Error("Attempted to inverse a data action before running it")
    e = this.onInvert(this._outputCache, this.inputs)
    this._outputCache = null
    for (const e of this.modificationRecord.createdRooms) this.data._deleteRoom(e.id)
    const t = (e: Room) => ({
      points: e.points.map(e => this.data.getNode(e.id)!),
      walls: new Set(Array.from(e.walls.values()).map(e => this.data.getWall(e.id)!)),
      holesCW: e.holesCW.map(e => e.map(e => this.data.getNode(e.id)!)),
      holes: e.holes.map(e => new Set(Array.from(e.values()).map(e => this.data.getWall(e.id)!)))
    })
    for (const e of this.modificationRecord.updatedRooms) {
      const { points: o, walls: n, holesCW: i, holes: r } = t(e),
        a = new Room({
          id: e.id,
          name: e.name,
          points: o,
          walls: n,
          holesCW: i,
          holes: r,
          location: e.location,
          includeInAreaCalc: e.includeInAreaCalc,
          hide: e.hide,
          keywords: e.keywords.slice(),
          classifications: e.classifications.slice(),
          height: e.height
        })
      this.data._updateRoom(e.id, a)
    }
    for (const e of this.modificationRecord.deletedRooms) {
      const { points: o, walls: s, holesCW: n, holes: i } = t(e)
      this.data._createRoom({
        id: e.id,
        name: "",
        points: o,
        walls: s,
        holesCW: n,
        holes: i,
        location: e.location,
        includeInAreaCalc: e.includeInAreaCalc,
        hide: e.hide,
        keywords: e.keywords.slice(),
        classifications: e.classifications.slice(),
        height: e.height
      })
    }
    if (e) {
      const t = e.map(e => this.data.getNode(e))
      this.data._updateDependentsForNodes(...t)
    }
  }
  wallsForLoop(e) {
    const t = new Set()
    for (let o = 0; o < e.length; o++) t.add(this.data.getWallForNodes(e[o].id, e[(o + 1) % e.length].id))
    return t
  }
  computeRooms() {
    var e
    this.modificationRecord = { createdRooms: [], updatedRooms: [], deletedRooms: [] }
    const { regions: t, holes: o } = this.findEnclosedRegionsAndHoles(),
      i = this.mapHolesToRegions(o, t),
      r = i.map(e => e.map(e => this.wallsForLoop(e))),
      a = t.map(e => new Set(this.wallsForLoop(e))),
      l = new Array()
    for (const e of this.data.rooms.values())
      for (let t = 0; t < a.length; t++) {
        const o = a[t],
          s = Array.from(e.walls.values()).reduce((e, t) => (o.has(t) ? e + 1 : e), 0)
        s > 0 &&
          l.push({
            score: s / Math.max(o.size, e.walls.size),
            newWalls: o.size - s,
            oldRoomId: e.id,
            oldRoomClassifications: e.classifications,
            newRoomIndex: t
          })
      }
    const d = new Set(),
      h = new Array(t.length),
      c = new Array(t.length)
    l.sort((e, t) => {
      var o, s
      return (
        t.score - e.score ||
        ((null === (o = this.data.rooms.get(t.oldRoomId)) || void 0 === o ? void 0 : o.area) || 0) -
          ((null === (s = this.data.rooms.get(e.oldRoomId)) || void 0 === s ? void 0 : s.area) || 0)
      )
    })
    for (const { oldRoomId: e, newRoomIndex: t, oldRoomClassifications: o, newWalls: s } of l)
      d.has(e) || h[t] || ((h[t] = e), d.add(e)), !c[t] && s <= 2 && (c[t] = o)
    for (let e = 0; e < t.length; e++) h[e] || (h[e] = randomString11())
    for (let o = 0; o < t.length; o++) {
      const n = h[o],
        a = t[o],
        l = new Set<RoomWall>()
      for (let e = 0; e < a.length; e++) {
        const t = a[e],
          o = a[(e + 1) % a.length],
          s = this.data.getWallForNodes(t.id, o.id)!
        l.add(s)
      }
      const d = this.data.rooms.get(n)
      if (d) {
        const e = new Room({
          id: n,
          name: "",
          points: t[o],
          walls: l,
          holesCW: i[o],
          holes: r[o],
          location: d.location,
          includeInAreaCalc: d.includeInAreaCalc,
          hide: d.hide,
          keywords: d.keywords.slice(),
          classifications: d.classifications.slice(),
          height: d.height
        })
        ;(SetHas(d.walls, e.walls) && SetHas(MergeSets(...d.holes), MergeSets(...e.holes))) ||
          (this.data._updateRoom(n, e), this.modificationRecord.updatedRooms.push(d))
      } else {
        const a = c[o] || [],
          d = containsKeyword(a, NoneType.OUTDOOR) ? LocationType.OUTDOOR : LocationType.INDOOR,
          h = !containsKeyword(a, NoneType.NON_AREA),
          u = containsKeyword(a, NoneType.HIDE),
          g = this.data._createRoom({
            id: n,
            name: "",
            points: t[o],
            walls: l,
            holesCW: i[o],
            holes: r[o],
            classifications: a.slice(),
            location: d,
            includeInAreaCalc: h,
            hide: u,
            keywords: [],
            height: NaN
          })
        this.modificationRecord.createdRooms.push(g)
      }
    }
    const u = new Set(h)
    for (const e of this.data.rooms.values()) u.has(e.id) || (this.data._deleteRoom(e.id), this.modificationRecord.deletedRooms.push(e))
  }
  findEnclosedRegionsAndHoles() {
    const e = new Array(),
      t = new Array(),
      o = new Set(),
      s = new Set(),
      n = (n, i) => {
        const r = `${n.id}/${i.id}`,
          a = this.data.traceWallsFromTo(n, i),
          l = e => {
            if (e.has(r)) return !0
            for (let t = 0; t < a.length; t++) {
              const o = a[t],
                s = a[(t + 1) % a.length],
                n = `${o.id}/${s.id}`
              e.add(n)
            }
            return !1
          },
          d = (0, g.SV)(a, !0)
        d >= 0.01 ? l(o) || e.push(reverseNodes(a)) : d <= -0.01 && (l(s) || t.push(reverseNodes(a).reverse()))
      }
    for (const e of this.data.walls.values()) n(e.from, e.to), n(e.to, e.from)
    return { regions: e, holes: t }
  }
  mapHolesToRegions(e, t) {
    const o = t.map(e => []),
      s = t.map(e => (0, g.SV)(e)),
      n = t.map(e => e.map(e => [e.x, e.z]))
    for (const i of e) {
      const e = (0, g.SV)(i)
      let r = 9999999,
        a = -1
      const l = i.map(e => [e.x, e.z])
      for (let o = 0; o < t.length; o++) {
        const d = s[o]
        e >= d || i[0].floorId !== t[o][0].floorId || (isSegmentInsidePolygon(l, n[o]) && d < r && ((r = d), (a = o)))
      }
      a >= 0 && o[a].push(i)
    }
    return o
  }
}
function x(e: RoomBoundData, t) {
  const o = e.getWall(t.wallId)!.clone()
  const s = e.getEdgeCountForNode(o.from)
  const n = e.getEdgeCountForNode(o.to)
  e._deleteWall(t.wallId)
  let i = "none"
  1 === s && 1 === n
    ? ((i = "both"), e._deleteNode(o.from.id), e._deleteNode(o.to.id))
    : 1 === s
      ? ((i = "from"), e._deleteNode(o.from.id))
      : 1 === n
        ? ((i = "to"), e._deleteNode(o.to.id))
        : (i = "none")
  const r: string[] = []
  switch (i) {
    case "from":
      r.push(o.to.id)
      break
    case "to":
      r.push(o.from.id)
      break
    case "none":
      r.push(o.from.id, o.to.id)
  }
  return { deletedWall: o, deletedNodes: i, updateNodeDependencies: r }
}
function R(e: RoomBoundData, t) {
  const o = t.deletedWall
  let s, n
  switch (t.deletedNodes) {
    case "both":
      s = e._createNode({ x: o.from.x, z: o.from.z }, o.floorId, o.from.id)
      n = e._createNode({ x: o.to.x, z: o.to.z }, o.floorId, o.to.id)
      e._createWall(o.type, s, n, o.width, o.openings, o.bias, o.id)
      break
    case "none":
      e._createWall(o.type, o.from, o.to, o.width, o.openings, o.bias, o.id)
      break
    case "from":
      s = e._createNode({ x: o.from.x, z: o.from.z }, o.floorId, o.from.id)
      e._createWall(o.type, s, o.to, o.width, o.openings, o.bias, o.id)
      break
    case "to":
      n = e._createNode({ x: o.to.x, z: o.to.z }, o.floorId, o.to.id)
      e._createWall(o.type, o.from, n, o.width, o.openings, o.bias, o.id)
      break
    default:
      throw new Error(`${t.deletedNodes} is an invalid value`)
  }
  switch (t.deletedNodes) {
    case "from":
      return [o.to.id]
    case "to":
      return [o.from.id]
    case "none":
      return [o.from.id, o.to.id]
    case "both":
      return []
  }
}
class DeleteEdge extends WallBase {
  onRun(e) {
    return x(this.data, e)
  }
  onInvert(e, t) {
    return R(this.data, e)
  }
  name() {
    return "DeleteEdge"
  }
}
function A(e, t, o) {
  if (0 === e.openings.length) return
  const s = new Line3(e.from.getVec3(), e.to.getVec3()),
    n = t.map(e => ({ wall: e, line: new Line3(e.from.getVec3(), e.to.getVec3()) })),
    i = (e, t) => {
      const o = e.closestPointToPointParameter(t, !1)
      if (!(o < 0 || o > 1)) return o
    }
  for (const t of e.openings) {
    const { type: e, width: r, relativePos: a, id: l } = t,
      d = s.at(a, new Vector3())
    for (const { wall: t, line: s } of n) {
      const n = i(s, d)
      if (void 0 !== n) {
        o._createWallOpening(t, e, n, r, l)
        break
      }
    }
  }
}
function V(e, t) {
  return t._createWall(e.type, e.from, e.to, e.width, e.openings, e.bias, e.id)
}
class AddTrailingEdgeToEdge extends WallBase {
  onRun(e) {
    const t = this.data.getWall(e.fromWallId)!.clone()
    const o = t.getDirection().normalize().multiplyScalar(e.along)
    const s = t.from.getVec3().add(o)
    this.data._deleteWall(e.fromWallId)
    const n = this.data._createNode({ x: s.x, z: s.z }, t.floorId),
      i = this.data._createNode(e.to, t.floorId),
      r = this.data._createWall(e.type, n, i, e.width, [], 0.5),
      a = this.data._createWall(t.type, t.from, n, t.width, [], t.bias),
      l = this.data._createWall(t.type, n, t.to, t.width, [], t.bias)
    return A(t, [a, l], this.data), { deletedWall: t, newTrailingWall: r, newLeftWall: a, newRightWall: l, newNodeToId: i.id, updateNodeDependencies: [] }
  }
  onInvert(e, t) {
    const { deletedWall: o, newTrailingWall: s, newLeftWall: n, newRightWall: i } = e
    return (
      this.data._deleteWall(s.id),
      this.data._deleteWall(n.id),
      this.data._deleteWall(i.id),
      this.data._deleteNode(s.from.id),
      this.data._deleteNode(s.to.id),
      V(o, this.data),
      []
    )
  }
  merge(e) {
    return (
      !!(e instanceof MoveNode && this._outputCache && e.inputs.nodeId === this._outputCache.newTrailingWall.to.id) && ((this.inputs.to = e.inputs.newPos), !0)
    )
  }
  name() {
    return "AddTrailingEdgeToEdge"
  }
}
class SetEdgeProps extends BaseAction {
  onRun({ wallId: e, props: t }) {
    const o = this.data.getWall(e)!
    const s = {}
    for (const e of Object.keys(t)) s[e] = o[e]
    return this.data._setEdgeProps(e, t), { wallId: e, props: s }
  }
  onInvert({ wallId: e, props: t }, o) {
    this.data._setEdgeProps(e, t)
  }
  merge(e) {
    return (
      e instanceof SetEdgeProps &&
      e.inputs.wallId === this.inputs.wallId &&
      ((this.inputs.props.width = e.inputs.props.width), (this.inputs.props.bias = e.inputs.props.bias), !0)
    )
  }
  name() {
    return "SetEdgeProps"
  }
}
class AddJointToNode extends WallBase {
  onRun(e) {
    const t = this.data.getWall(e.wallId)!
    const o = []
    const s = []
    const n = []
    const i = {
      originalFromPos: t.from.getPoint(),
      originalToPos: t.to.getPoint(),
      deletedWalls: s,
      createdWalls: o,
      originalWallId: e.wallId,
      createdNodes: n,
      updateNodeDependencies: []
    }
    return e.fromNode && this.createJoint(t.from, t, s, o, n), e.toNode && this.createJoint(t.to, t, s, o, n), i
  }
  onInvert(e, t) {
    for (const t of e.createdWalls) this.data._deleteWall(t.id)
    for (const t of e.deletedWalls) V(t, this.data)
    for (const t of e.createdNodes) this.data._deleteNode(t.id)
    const o = this.data.getWall(this.inputs.wallId)!
    return this.data._updateNode(o.from.id, e.originalFromPos), this.data._updateNode(o.to.id, e.originalToPos), [o.from.id, o.to.id]
  }
  merge(e) {
    return (
      e instanceof MoveEdge &&
      e.inputs.wallId === this.inputs.wallId &&
      ((this.inputs.fromPos = e.inputs.newFromPos), (this.inputs.toPos = e.inputs.newToPos), !0)
    )
  }
  createJoint(e, t, o, s, n) {
    const i = this.data._createNode({ x: e.x, z: e.z }, e.floorId)
    const r = this.data.getWallsForNode(e)!
    for (const n of r) {
      const r = n.clone()
      if (r.id !== t.id) {
        const t = r.getOtherNode(e)
        o.push(r), this.data._deleteWall(r.id)
        const n = r.from === t ? this.data._createWall(r.type, t, i, r.width, [], r.bias) : this.data._createWall(r.type, i, t, r.width, [], r.bias)
        A(r, [n], this.data), s.push(n)
      }
    }
    n.push(i)
    const a = t.from === e ? this.data._createWall(t.type, i, t.from, t.width, [], t.bias) : this.data._createWall(t.type, t.to, i, t.width, [], t.bias)
    s.push(a)
  }
  name() {
    return "AddJointToNode"
  }
}
class DeleteNode extends WallBase {
  onRun(e) {
    const t = this.data.getNode(e.nodeId)!
    const o = Array.from(this.data.getWallsForNode(t)!.values())
    if (2 !== o.length) throw new Error("Can only delete nodes with two edges on it")
    const s = o[0].clone(),
      n = s.getOtherNode(t),
      i = o[1].clone(),
      r = i.getOtherNode(t)
    this.data._deleteWall(s.id), this.data._deleteWall(i.id), this.data._deleteNode(t.id)
    const a = this.data.newWallWouldIntersect({ n0: n, n1: r }) ? null : this.data._createWall(s.type, n, r, (s.width + i.width) / 2, [], (s.bias + i.bias) / 2)
    return a && (A(s, [a], this.data), A(i, [a], this.data)), { deletedNode: t, deletedWall1: s, deletedWall2: i, createdWall: a, updateNodeDependencies: [] }
  }
  onInvert(e, t) {
    const { createdWall: o, deletedNode: s, deletedWall1: n, deletedWall2: i } = e
    o && this.data._deleteWall(o.id), this.data._createNode(s.getPoint(), s.floorId, s.id)
    for (const e of [n, i]) V(e, this.data)
    return []
  }
  name() {
    return "DeleteNode"
  }
}
class AddBridgingEdge extends WallBase {
  onRun(e) {
    const t = this.data.getNode(e.fromId)!
    const o = this.data.getNode(e.toId)!
    return { wall: this.data._createWall(e.type, t, o, e.width, [], 0.5).id, updateNodeDependencies: [] }
  }
  onInvert(e, t) {
    return this.data._deleteWall(e.wall), []
  }
  name() {
    return "AddBridgingEdge"
  }
}
class EditOpeningDetails extends BaseAction {
  onRun(e) {
    const { id: t } = e
    const o = this.data.getOpening(t)!
    const { type: s, relativePos: n, width: i } = o
    return this.data._setOpeningDetails(t, e), { id: t, type: s, relativePos: n, width: i }
  }
  onInvert(e, t) {
    const { id: o } = e
    this.data._setOpeningDetails(o, e)
  }
  name() {
    return "EditOpeningDetails"
  }
}
class DeleteWallOpening extends BaseAction {
  onRun(e) {
    const { openingId: t } = e,
      o = this.data.getOpening(t)
    return this.data._deleteWallOpening(t), { deletedOpening: o }
  }
  onInvert(e, t) {
    const { id: o, wallId: s, type: n, relativePos: i, width: r } = e.deletedOpening,
      a = this.data.getWall(s)!
    this.data._createWallOpening(a, n, i, r, o)
  }
  name() {
    return "DeleteWallOpening"
  }
}
class AddOpeningAction extends BaseAction {
  onRun(e) {
    const { wallId: t, type: o, relativePos: s, width: n } = e,
      i = this.data.getWall(t)!
    return { openingId: this.data._createWallOpening(i, o, s, n).id }
  }
  onInvert(e, t) {
    const { openingId: o } = e
    this.data._deleteWallOpening(o)
  }
  name() {
    return "AddOpeningAction"
  }
}
function U(e, t, o, s) {
  const n = t.getOtherNode(o)
  return n !== s && !e.hasWallBetween(n, s)
}
function F(e: RoomBoundData, t) {
  const o: Array<
      {
        deleted: RoomWall | null
        created: RoomWall | null
      }[]
    > = [],
    s: RbushBboxNode[] = [],
    n: string[] = [],
    i: Array<{
      x: number
      z: number
    }> = [],
    r = new Set<string>()
  for (const a of t) {
    const t: Array<{ deleted: RoomWall | null; created: RoomWall | null }> = []
    const { mergeId: l, keepId: d } = a
    r.add(d)
    const h = e.getNode(l)!
    const c = e.getNode(d)!
    const u = e.getWallsForNode(c)!
    const g = c.getPoint()!
    s.push(h)
    n.push(d)
    i.push(g)
    e._updateNode(c.id, h.getPoint())
    const p = e.getWallsForNode(h)!
    for (const o of p) {
      const s = o.clone(),
        n = o.getOtherNode(h),
        i = o.width
      e._deleteWall(o.id)
      let r: RoomWall | null = null
      U(e, o, h, c) && (e.hasWallBetween(n, c) || ((r = e._createWall(o.type, n, c, i, [], o.bias)), A(s, [r], e), u.add(r)))
      t.push({ deleted: s, created: r })
      u.delete(o)
    }
    e._deleteNode(h.id), 0 === u.size && (e._deleteNode(c.id), s.push(c)), o.push(t)
  }
  return { deletedNodes: s, wallDiffs: o, oldKeepNodeIds: n, oldKeepNodePositions: i, updateNodeDependencies: r }
}
function k(e, t) {
  const o: string[] = []
  for (let s = t.deletedNodes.length - 1; s >= 0; s--) {
    const n = t.deletedNodes[s],
      i = t.wallDiffs[s],
      r = e._createNode(n.getPoint(), n.floorId, n.id)
    o.push(r.id)
    for (const t of i) {
      t.created && e._deleteWall(t.created.id)
      let o = r,
        s = t.deleted.getOtherNode(n)
      if (r.id !== t.deleted.from.id) {
        const e = o
        o = s
        s = e
      }
      e._createWall(t.deleted.type, o, s, t.deleted.width, t.deleted.openings, t.deleted.bias, t.deleted.id)
    }
    e._updateNode(t.oldKeepNodeIds[s], t.oldKeepNodePositions[s])
  }
  return t.oldKeepNodeIds
}
function G(e: RoomBoundData, t) {
  const o: Array<{
      deletedWall: RoomWall
      newLeftWall: RoomWall | null
      newRightWall: RoomWall | null
      prevNodePos: {
        x: number
        z: number
      }
      nodeId: string
    }> = [],
    s = new Set<string>()
  for (const n of t) {
    const t = e.getNode(n)!
    const r = e.getAttachedEntities(t)
    const a = e.findNodeOrWallForPosition(t.getVec3(), t.floorId, r)
    if (a && a instanceof RoomWall) {
      const i = a.getProjection(t.getVec3()),
        r = a.clone(),
        l = { x: t.x, z: t.z },
        d = r.getDirection().normalize().multiplyScalar(i),
        h = r.from.getVec3().add(d)
      e._deleteWall(r.id), e._updateNode(n, { x: h.x, z: h.z })
      const c = e.hasWallBetween(r.from, t) ? null : e._createWall(r.type, r.from, t, r.width, [], r.bias),
        u = e.hasWallBetween(t, r.to) ? null : e._createWall(r.type, t, r.to, r.width, [], r.bias)
      A(
        r,
        [c, u].filter(e => !!e),
        e
      ),
        o.push({ deletedWall: r, newLeftWall: c, newRightWall: u, prevNodePos: l, nodeId: t.id }),
        s.add(t.id)
    }
  }
  return { splitDiffs: o, updateNodeDependencies: s }
}
function H(e, t) {
  for (let o = t.splitDiffs.length - 1; o >= 0; o--) {
    const { newLeftWall: s, newRightWall: n, deletedWall: i, prevNodePos: r, nodeId: a } = t.splitDiffs[o]
    s && e._deleteWall(s.id), n && e._deleteWall(n.id), e._updateNode(a, r), V(i, e)
  }
  return t.splitDiffs.map(e => e.nodeId)
}
function K(e, t) {
  const o = [],
    s = (function (e) {
      const t = []
      for (const o of e) {
        if (2 !== o.length) throw new Error("Can only merge co-linear overlaps")
        if (0 === t.length) {
          t.push(o)
          continue
        }
        const e = t[t.length - 1],
          s = e[1]
        if (o[0].t < s.t + 0.001) {
          const n = o[1]
          n.t >= s.t && (t[t.length - 1] = [e[0], n])
        } else t.push(o)
      }
      return t
    })(t)
  if (s[0][0].t > 0) {
    const t = s[0][0].entity
    o.push([e.from, t])
  }
  for (let e = 0; e < s.length - 1; e++) {
    const t = s[e],
      n = s[e + 1],
      i = t[1].entity,
      r = n[0].entity
    o.push([i, r])
  }
  if (s[s.length - 1][1].t < 1) {
    const t = s[s.length - 1][1].entity
    o.push([t, e.to])
  }
  return o
}
class MergeOverlappingEntities extends WallBase {
  onRun(e) {
    return q(e, this.data)
  }
  onInvert(e, t) {
    return j(e, this.data)
  }
  name() {
    return "MergeOverlappingEntities"
  }
}
class ValidateGraphAndComputeRooms extends WallBase {
  onRun(e) {
    const t = {},
      o = []
    for (const e of this.data.getFloorsWithNodes()) {
      const s = this.data.getNodesByFloor(e)
      if (s.size > 0) {
        const n = Array.from(s.values())[0],
          i = this.data.findOverlappingEntities(n)
        if (i) {
          const s = q(
            {
              movedEntity: n,
              nodeOverlaps: i.nodeOverlaps,
              nodeWallOverlaps: i.nodeWallOverlaps,
              collinearWall: i.collinearWall,
              intersectingWall: i.intersectingWall
            },
            this.data
          )
          ;(t[e] = s), o.push(...s.updateNodeDependencies)
        }
      }
    }
    return { overlapsByFloor: t, updateNodeDependencies: o }
  }
  onInvert(e, t) {
    const o = []
    for (const t in e.overlapsByFloor) {
      const s = j(e.overlapsByFloor[t], this.data)
      o.push(...s)
    }
    return o
  }
  name() {
    return "ValidateGraphAndComputeRooms"
  }
}
function q(e, t) {
  const o = (function (e, t, o) {
    const s: any = [],
      n = new Set()
    let i = t,
      r = 0
    for (; (i.nodeOverlaps.length > 0 || i.nodeWallOverlaps.length > 0) && r < 10; ) {
      const t = F(e, i.nodeOverlaps)
      for (const e of t.updateNodeDependencies) n.add(e)
      const a = G(e, i.nodeWallOverlaps)
      for (const e of a.updateNodeDependencies) n.add(e)
      s.push({ nodeMergeInvertInfo: t, nodeWallInvertInfo: a }), (i = e.findOverlappingNodePairs(o)), r++
    }
    for (const e of s) {
      const t = e.nodeMergeInvertInfo.deletedNodes
      for (const e of t) n.delete(e.id)
    }
    return { nodeMergeBatches: s, updateNodeDependencies: Array.from(n) }
  })(t, { nodeOverlaps: e.nodeOverlaps, nodeWallOverlaps: e.nodeWallOverlaps }, e.movedEntity)
  let s = []
  e.collinearWall &&
    (s = (function (e, t) {
      const o = []
      let s = e.findWallWithWorstOverlaps(t, "colinear"),
        n = 0
      for (; null != s && n < 10; ) {
        const i = s.wall
        e._deleteWall(i.id)
        const r = K(s.wall, s.overlaps).map(t => e._createWall(i.type, t[0], t[1], i.width, [], i.bias))
        o.push({ deletedWall: i, createdWalls: r }), (s = e.findWallWithWorstOverlaps(t, "colinear")), n++
      }
      return o
    })(t, e.collinearWall.floorId))
  let n = []
  return (
    e.intersectingWall &&
      (n = (function (e, t) {
        const o = []
        let s = e.findWallWithWorstOverlaps(t, "intersection"),
          n = 0
        for (; null != s && n < 10; ) {
          const i = [],
            r = [],
            a = [],
            l = s.wall.clone()
          if ((i.push(l), e._deleteWall(s.wall.id), null != s)) {
            let n = s.wall.from
            const d = s.wall.getDirection()
            for (const o of s.overlaps) {
              if (1 !== o.length)
                throw new Error("possible bug in RoomBoundData.findWallWithWorstOverlaps, it should only return walls intersecting at ONE point")
              const h = o[0],
                c = h.entity.clone()
              i.push(c), e._deleteWall(h.entity.id)
              const u = s.wall.from.getVec3().addScaledVector(d, o[0].t),
                g = o[0].entity,
                p = e._createNode(u, t)
              r.push(p)
              const f = e._createWall(s.wall.type, n, p, s.wall.width, [], s.wall.bias)
              ;(n = p), a.push(f), A(l, [f], e)
              const m = e._createWall(g.type, g.from, p, g.width, [], g.bias)
              a.push(m)
              const w = e._createWall(g.type, g.to, p, g.width, [], g.bias)
              a.push(w), A(c, [m, w], e)
            }
            const h = e._createWall(s.wall.type, n, s.wall.to, s.wall.width, [], s.wall.bias)
            a.push(h), A(l, [h], e), o.push({ createdWalls: a, createdNodes: r, deletedWalls: i })
          }
          ;(s = e.findWallWithWorstOverlaps(t, "intersection")), n++
        }
        return o
      })(t, e.intersectingWall.floorId)),
    { nodeOverlapInvertInfo: o, intersectionSplitInvertInfo: n, collinearOverlapInvertInfo: s, updateNodeDependencies: o.updateNodeDependencies }
  )
}
function j(e, t) {
  !(function (e, t) {
    for (let o = t.length - 1; o >= 0; o--) {
      const s = t[o]
      for (const t of s.createdWalls) e._deleteWall(t.id)
      for (const t of s.createdNodes) e._deleteNode(t.id)
      for (const t of s.deletedWalls) V(t, e)
    }
  })(t, e.intersectionSplitInvertInfo),
    (function (e, t) {
      for (let o = t.length - 1; o >= 0; o--) {
        const s = t[o],
          n = s.deletedWall
        s.createdWalls.forEach(t => e._deleteWall(t.id)), V(n, e)
      }
    })(t, e.collinearOverlapInvertInfo)
  return (function (e, t) {
    const o = []
    for (let s = t.nodeMergeBatches.length - 1; s >= 0; s--) {
      const { nodeMergeInvertInfo: n, nodeWallInvertInfo: i } = t.nodeMergeBatches[s],
        r = H(e, i),
        a = k(e, n)
      o.push(...r, ...a)
    }
    return o
  })(t, e.nodeOverlapInvertInfo)
}
class SetRoomDetails extends BaseAction {
  onRun({ roomId: e, name: t, roomTypeIds: o, location: s, includeInAreaCalc: n, hide: i, keywords: r, showDimensions: a, showHeight: l }) {
    const d = this.data.getRoom(e)!,
      h = {
        roomId: e,
        name: d.name,
        roomTypeIds: d.roomTypeIds.slice(),
        includeInAreaCalc: d.includeInAreaCalc,
        hide: d.hide,
        keywords: d.keywords.slice(),
        showDimensions: d.showDimensions,
        showHeight: d.showHeight
      }
    return (
      this.data._updateRoomDetails(e, { name: t, roomTypeIds: o, location: s, includeInAreaCalc: n, hide: i, keywords: r, showDimensions: a, showHeight: l }), h
    )
  }
  onInvert({ roomId: e, name: t, roomTypeIds: o, location: s, includeInAreaCalc: n, hide: i, showDimensions: r, showHeight: a }, l) {
    this.data._updateRoomDetails(e, { name: t, roomTypeIds: o, location: s, includeInAreaCalc: n, hide: i, showDimensions: r, showHeight: a })
  }
  name() {
    return "SetRoomDetails"
  }
}
class DeleteRoom extends WallBase {
  onRun({ roomId: e }) {
    const t = { deletedEdges: [], updateNodeDependencies: [] },
      o = this.data.getRoom(e)!
    for (const e of o.walls) {
      if (1 === Array.from(this.data.getRoomsForWall(e)).filter(t => t.walls.has(e)).length) {
        const o = x(this.data, { wallId: e.id })
        t.deletedEdges.push(o), t.updateNodeDependencies.push(...o.updateNodeDependencies)
      }
    }
    for (const e of t.deletedEdges) {
      const o = []
      switch (e.deletedNodes) {
        case "from":
          o.push(e.deletedWall.from.id)
          break
        case "to":
          o.push(e.deletedWall.to.id)
          break
        case "both":
          o.push(e.deletedWall.from.id, e.deletedWall.to.id)
      }
      t.updateNodeDependencies = t.updateNodeDependencies.filter(e => -1 === o.indexOf(e))
    }
    return t
  }
  onInvert(e, t) {
    let o: any[] = []
    for (const t of e.deletedEdges.reverse()) o = o.concat(R(this.data, t))
    return o
  }
  name() {
    return "DeleteRoom"
  }
}
const le = new Set()

enum QueueType {
  CREATE = 0,
  DELETE = 2,
  UPDATE = 1
}
export class RoomBoundData {
  roomClassifications: Record<string, { id: string; label: string; defaultKeywords: string[] }>
  broadcast: EngineContext["broadcast"]
  name: string
  version: number
  legacyRoomIds: string[]
  raycast: null | ((e: Vector3, t: string) => any)
  onActionError: (e: any) => void
  logger: DebugInfo
  _nodes: RoomBoundNode<RbushBboxNode>
  _walls: RoomBoundNode<RoomWall>
  _rooms: RoomBoundNode<Room>
  _wallOpenings: RoomBoundNode<WallOpening>
  undoBuffer: RoomBoundUndoBuffer
  _nodeToWallMap: Map<RbushBboxNode, Set<RoomWall>>
  _nodesByFloor: Map<string, Set<RbushBboxNode>>
  _wallToRoomMap: Map<RoomWall, Set<Room>>
  _wallsByFloor: Map<Vector3, Set<RoomWall>>
  _wallsByCompositeKey: Map<string, RoomWall>
  _observerQueue: Array<{ observers: Set<Function>; param: RoomWall | WallOpening | Room | RbushBboxNode; type: QueueType }>
  _deleteSet: Set<RoomWall | Room | WallOpening | RbushBboxNode>
  _anythingChangeObservers: Set<Function>
  _afterFinalizeObservers: Set<Function>
  isLoading: boolean
  spatialIndex: Map<string, RBush<RoomWall | RbushBboxNode>>
  actionList: any[]
  getRelativeAngle: (n: RbushBboxNode, i: RbushBboxNode, r: RbushBboxNode) => number
  newWallWouldIntersect: (e: { n0: RbushBboxNode; n1: RbushBboxNode; n0OverridePos?: Vector2; n1OverridePos?: Vector2; wallToIgnore?: RoomWall }) => boolean
  _updateDependentsForNodes: (...o: RbushBboxNode[]) => void
  lowDiscrepancySampleTriangle: (l: number, d: number) => Vector3
  lastSolidWallWidth?: number
  constructor(e, t = {}, o = () => {}) {
    this.roomClassifications = t
    this.broadcast = o
    this.name = "wall-graph"
    this.version = 0
    this.legacyRoomIds = []
    this.raycast = null
    this.onActionError = e => {
      this.logger.error(e)
    }
    this._nodes = new RoomBoundNode()
    this._walls = new RoomBoundNode()
    this._rooms = new RoomBoundNode()
    this._wallOpenings = new RoomBoundNode()
    this.undoBuffer = new RoomBoundUndoBuffer(this.commit.bind(this))
    this._nodeToWallMap = new Map()
    this._nodesByFloor = new Map()
    this._wallToRoomMap = new Map()
    this._wallsByFloor = new Map()
    this._wallsByCompositeKey = new Map()
    this._observerQueue = []
    this._deleteSet = new Set()
    this._anythingChangeObservers = new Set()
    this._afterFinalizeObservers = new Set()
    this.logger = new DebugInfo("wall-graph")
    this.isLoading = !1
    this.spatialIndex = new Map()
    this.actionList = []
    this.getRelativeAngle = (() => {
      const e = new Vector2()
      const t = new Vector2()
      const o = new Vector2()
      const s = (t: Vector2, o: RbushBboxNode) => {
        if (0 === t.lengthSq()) {
          const s = this.getNodeNeighbors(o)
          if (0 === s.size) return
          const n = Array.from(s.values())[0]
          t.set(n.x, n.z).sub(e)
        }
      }
      return (n, i, r) => {
        if (i === r) return 2 * Math.PI
        e.set(n.x, n.z), t.set(i.x, i.z).sub(e), s(t, i), o.set(r.x, r.z).sub(e), s(o, r)
        const a = Math.atan2(t.y, t.x)
        let l = -(Math.atan2(o.y, o.x) - a)
        return l < 0 && (l += 2 * Math.PI), l
      }
    })()
    this.newWallWouldIntersect = (() => {
      const e = new Vector2(),
        t = new Vector2(),
        o = new Vector2(),
        s = new Vector2(),
        n = new Vector2(),
        i = new Vector2(),
        r = new Vector2(),
        a = new Vector2()
      return ({ n0: l, n1: d, n0OverridePos: h, n1OverridePos: c, wallToIgnore: u }) => {
        if (this.hasWallBetween(l, d)) {
          if (!u) return !0
          if (this.getWallForNodes(l.id, d.id) !== u) return !0
        }
        const p = e => Math.round(1e3 * e) / 1e3
        const f = (e, t) => {
          e === l && h ? t.copy(h) : e === d && c ? t.copy(c) : e.getVec2(t)
        }
        if ((f(l, e), f(d, t), o.subVectors(e, t).length() < 1e-4)) return !1
        const m = [
            [p(e.x), p(e.y)],
            [p(t.x), p(t.y)]
          ],
          w = [
            [0, 0],
            [0, 0]
          ]
        for (const e of this._walls.data.values()) {
          if (l.floorId !== e.floorId || e === u) continue
          if ((f(e.from, s), f(e.to, n), o.subVectors(s, n).length() < 1e-4)) continue
          if (((w[0][0] = p(s.x)), (w[0][1] = p(s.y)), (w[1][0] = p(n.x)), (w[1][1] = p(n.y)), (0, g.OH)(m, w))) return !0
          const t = e.to === l || e.from === l ? l : e.to === d || e.from === d ? d : void 0
          if (t) {
            const o = e.getOtherNode(t),
              s = t === l ? d : l
            f(t, i), f(o, r), f(s, a), r.sub(i), a.sub(i)
            const n = Math.atan2(r.y, r.x)
            let h = -(Math.atan2(a.y, a.x) - n)
            h < 0 && (h += 2 * Math.PI)
            const c = h,
              u = (2 * Math.PI) / 180
            if (c < u || c > 2 * Math.PI - u) return !0
          }
        }
        return !1
      }
    })()
    this._updateDependentsForNodes = (() => {
      const e = new Set()
      const t = new Set()
      return (...o: RbushBboxNode[]) => {
        e.clear()
        t.clear()
        const s = o => {
          if (!e.has(o)) {
            this.removeFromSpatialIndex(o), this.insertIntoSpatialIndex(o), this._scheduleUpdate(this._walls, o, !0)
            const s = this._wallToRoomMap.get(o)
            if (s) for (const e of s.values()) t.has(e) || (this._scheduleUpdate(this._rooms, e, !0), e.pointsMoved(), this.calculateRoomInsights(e), t.add(e))
            for (const e of o.openings) this._scheduleUpdate(this._wallOpenings, e, !0)
            e.add(o)
          }
        }
        for (const e of o) {
          const t = this._nodeToWallMap.get(e)
          if (null != t)
            for (const o of t) {
              s(o)
              const t = o.getOtherNode(e),
                n = this._nodeToWallMap.get(t)
              if (null != n) for (const e of n) s(e)
            }
        }
      }
    })()
    this.lowDiscrepancySampleTriangle = (() => {
      const e = new Vector2(1, 0)
      const t = new Vector2(0, 1)
      const o = new Vector2(0, 0)
      const s = new Vector2()
      const n = new Vector2()
      const i = new Vector2()
      const r = new Vector2()
      const a = new Vector3()
      return (l, d) => {
        e.set(1, 0)
        t.set(0, 1)
        o.set(0, 0)
        for (let r = 0; r < d; r++) {
          switch ((l >> (2 * r)) & 3) {
            case 0:
              s.addVectors(t, o).multiplyScalar(0.5), n.addVectors(e, o).multiplyScalar(0.5), i.addVectors(e, t).multiplyScalar(0.5)
              break
            case 1:
              s.copy(e), n.addVectors(e, t).multiplyScalar(0.5), i.addVectors(e, o).multiplyScalar(0.5)
              break
            case 2:
              s.addVectors(t, e).multiplyScalar(0.5), n.copy(t), i.addVectors(t, o).multiplyScalar(0.5)
              break
            case 3:
              s.addVectors(o, e).multiplyScalar(0.5), n.addVectors(o, t).multiplyScalar(0.5), i.copy(o)
          }
          e.copy(s), t.copy(n), o.copy(i)
        }
        r.addVectors(e, t)
          .add(o)
          .multiplyScalar(1 / 3)
        a.set(r.x, r.y, 1 - r.x - r.y)
        return a
      }
    })()
    e && ((this.version = e.version), this.load(e))
  }
  load(e) {
    this.isLoading = !0
    for (const e of Array.from(this.rooms.values())) this._deleteRoom(e.id)
    for (const e of Array.from(this.walls.values())) this._deleteWall(e.id)
    for (const e of Array.from(this.nodes.values())) this._deleteNode(e.id)
    for (const [e, t] of this.spatialIndex) t.clear()
    this.commit()
    for (const n in e.floors) {
      const r = e.floors[n]
      const a = r.vertices
      const l = new RBush<RbushBboxNode | RoomWall>()
      this.spatialIndex.set(n, l)
      const d: RbushBboxNode[] = []
      for (const e in a) {
        const t = a[e]
        const o = this._createNode({ x: t.x, z: -t.y }, n, e)
        o.updateRBushBBox()
        d.push(o)
      }
      l.load(d)
      const h: RoomWall[] = []
      for (const e in r.edges) {
        const s = r.edges[e]
        const [n, a] = s.vertices || e.split(":")
        const l = s.thickness
        const d = this.getNode(n)!
        const c = this.getNode(a)!
        const u = s.type === edgeType.INVISIBLE
        const g = this._createWall(u ? WallType.DIVIDER : WallType.SOLID, d, c, u ? J.kM : l, [], s.bias || 0.5, e)
        g.bias = 1 - g.bias
        g.updateRBushBBox()
        h.push(g)
        if (!u) {
          for (const e in s.openings) {
            const { relativePos: t, type: o, width: n } = s.openings[e]
            this._createWallOpening(g, o, t, n, e)
          }
        }
      }
      l.load(h)
      if (r.rooms)
        for (const e in r.rooms) {
          const t = r.rooms[e]
          const o: string[] = t.edges || []
          const n = t.holes || []
          if (!o.length && t.vertices)
            for (let e = 0; e < t.vertices.length; e++) {
              const s = t.vertices[e]
              const n = t.vertices[(e + 1) % t.vertices.length]
              o.push(this.getWallForNodes(s, n)!.id)
            }
          if (0 === o.length) {
            this.legacyRoomIds.push(e), this.logger.info("Skipping room with zero vertices", e)
            continue
          }
          const i = this.getWall(o[0])!
          const a = new Set(o.map(e => this.getWall(e)!))
          const l = this.traceWallsFromTo(i.from, i.to, a)
          const d = this.traceWallsFromTo(i.to, i.from, a)
          const h = l.length > d.length ? l : d
          if (0 === h.length) {
            this.logger.warn("No node loop found for room: ", e)
            continue
          }
          reverseNodes(h)
          const c = new Set<RbushBboxNode>()
          for (const e of a) c.add(e.from), c.add(e.to)
          SetHas(new Set(h), c) || this.logger.warn("Traced room does not match edge list!", e, h, c)
          const u: RbushBboxNode[][] = []
          const p: Set<RoomWall>[] = []
          for (const e of n) {
            if (0 === e.length) continue
            const t = new Set<RoomWall>(e.map(e => this.getWall(e)!))
            p.push(t)
            const o = this.getWall(e[0])!
            const s = this.traceWallsFromTo(o.from, o.to, t)
            reverseNodes(s).reverse()
            u.push(s)
          }
          const { location, includeInAreaCalc, hide, keywords: _ } = getRoomConfig(t.keywords || []),
            O = this._createRoom({
              id: e,
              name: t.label || "",
              points: h,
              walls: a,
              holesCW: u,
              holes: p,
              classifications: this.translateClassificationLabels(t.classifications),
              location,
              includeInAreaCalc,
              hide,
              keywords: _,
              height: t.height || NaN
            }),
            y = null != t.width && 0 === t.width
          null != t.length && 0 === t.length && y && (O.showDimensions = !1),
            (O.showHeight = null === t.height || 0 !== t.height),
            t.width &&
              !Number.isNaN(t.width) &&
              Math.abs(t.width - O.width) > 0.001 &&
              this.logger.warn(`Room ${e} has width of ${t.width} on MDS but calculated as ${O.width} locally`),
            t.length &&
              !Number.isNaN(t.length) &&
              Math.abs(t.length - O.length) > 0.001 &&
              this.logger.warn(`Room ${e} has length of ${t.length} on MDS but calculated as ${O.length} locally`),
            t.area &&
              !Number.isNaN(t.area) &&
              Math.abs(t.area - O.area) >= 0.01 &&
              this.logger.warn(`Room ${e} has area of ${t.area} on MDS but calculated as ${O.area} locally`)
        }
    }
    ;(this.lastSolidWallWidth = void 0), (this.isLoading = !1)
  }
  get walls() {
    return this._walls.data
  }
  get nodes() {
    return this._nodes.data
  }
  get rooms() {
    return this._rooms.data
  }
  get wallOpenings() {
    return this._wallOpenings.data
  }
  getNode(e: string) {
    const t = this._nodes.get(e)
    if (t) return t
    this.logAndThrow(new Error("WallNode does not exist in WallGraphData"))
  }
  getWall(e: string) {
    const t = this._walls.get(e)
    if (t) return t
    this.logAndThrow(new Error("Wall does not exist in WallGraphData"))
  }
  hasRoom(e) {
    return !!this._rooms.get(e)
  }
  hasRooms() {
    return this._rooms.size > 0
  }
  getRoom(e) {
    const t = this._rooms.get(e)
    return t || this.logAndThrow(new Error("Room id is invalid!")), t
  }
  getOpening(e: string) {
    const t = this._wallOpenings.get(e)
    return t || this.logAndThrow(new Error("Opening id is invalid")), t
  }
  getEntity(e: string) {
    const t = this._walls.get(e) || this._nodes.get(e) || this._rooms.get(e) || this._wallOpenings.get(e)
    return t || this.logAndThrow(new Error("No entity for id.")), t
  }
  tryGetEntity(e: string) {
    return this._walls.get(e) || this._nodes.get(e) || this._rooms.get(e) || this._wallOpenings.get(e) || null
  }
  getEdgeCountForNode(e: RbushBboxNode) {
    return this._nodeToWallMap.get(e)?.size || 0
  }
  getWallsForNode(e: RbushBboxNode) {
    const t = this._nodeToWallMap.get(e)
    if (t && t.size > 0) return t
    this.logAndThrow(new Error("WallNode has no associate walls, this should not happen unless inside an action"))
  }
  getFloorsWithNodes() {
    return Array.from(this._nodesByFloor.keys())
  }
  getWallsForFloor(e) {
    const t = this._wallsByFloor.get(e)
    return t && t.size > 0 ? t : null
  }
  getNodesByFloor(e) {
    const t = this._nodesByFloor.get(e),
      o = new Set<RbushBboxNode>()
    return t || (this._nodesByFloor.set(e, o), o)
  }
  getRoomsForWall(e) {
    return this._wallToRoomMap.get(e) || new Set()
  }
  getWallNeighbors(e, t) {
    const o = e[t],
      s = this.getEdgeCountForNode(o)
    if (1 === s) return null
    if (2 !== s) {
      const s = (() => {
          const e = new Vector2()
          return (t, o) => {
            const s = o.getOtherNode(t)
            e.set(s.x - t.x, s.z - t.z).normalize()
            return e.angle()
          }
        })(),
        n = this._nodeToWallMap.get(o)
      if (!n || 0 === n.size) return null
      const i = Array.from(n).sort((e, t) => s(o, e) - s(o, t)),
        r = i.indexOf(e)
      let a = (r + 1) % i.length,
        l = r - 1 < 0 ? i.length - 1 : r - 1
      if ("from" === t) {
        const e = l
        ;(l = a), (a = e)
      }
      return { left: i[a], right: i[l] }
    }
    {
      const t = this._nodeToWallMap.get(o)
      if (!t || 0 === t.size) return null
      for (const o of t) if (o.id !== e.id) return { left: o, right: o }
    }
    this.logAndThrow(new Error("Not finding both neighbors should never happen"))
  }
  getLastWallWidth(e) {
    return e === WallType.SOLID && this.lastSolidWallWidth ? this.lastSolidWallWidth : this.getMostCommonWallWidth(e)
  }
  getMostCommonWallWidth(e) {
    if (e === WallType.DIVIDER) return J.kM
    const t: Record<string, number> = {}
    for (const e of this._walls.data.values()) {
      const o = e.width.toFixed(2)
      t[o] = t[o] ? t[o] + 1 : 1
    }
    let o = J.Oz,
      s = 0
    for (const [e, n] of Object.entries(t)) n > s && Number(e) > J.kM && ((s = n), (o = Number(e)))
    return o
  }
  findRoomIdForPosition(e, t, o?) {
    const s = { x: e.x, y: e.z },
      n = this._rooms.get(o || "")
    if (n && o) {
      const e = n.points.map(e => ({ x: e.x, y: e.z }))
      if (isPointInPolygon(s, e)) return o
    }
    for (const e of this._rooms.data.values()) {
      if (e.floorId !== t) continue
      const o = e.points.map(e => ({ x: e.x, y: e.z }))
      if (isPointInPolygon(s, o)) return e.id
    }
    return null
  }
  findNodeOrWallForPosition(e: Vector3, t: string, o: Set<string>, s = J.et) {
    const n = this.spatialIndex.get(t)
    if (n) {
      const t = n.search({ minX: e.x - s, minY: e.z - s, maxX: e.x + s, maxY: e.z + s })
      let a: RoomWall | null = null,
        l: RbushBboxNode | null = null,
        d = Number.MAX_VALUE,
        h = Number.MAX_VALUE
      for (const n of t) {
        const t = n.overlapsCircle(e, s)
        null == t || o.has(n.id) || (n instanceof RoomWall && t < d && ((a = n), (d = t)), n instanceof RbushBboxNode && t < h && ((l = n), (h = t)))
      }
      return l || a
    }
    return null
  }
  findNodeAndWallsOverlappingLine(e: Vector3, t: Vector3, o: string, s = (e?: any) => !0) {
    const n = this.spatialIndex.get(o)
    const i = 0.05
    const r: Array<
      {
        entity: any
        t: number
      }[]
    > = []
    if (n) {
      const o = n.search({ minX: Math.min(e.x, t.x) - i, minY: Math.min(e.z, t.z) - i, maxX: Math.max(e.x, t.x) + i, maxY: Math.max(e.z, t.z) + i })
      for (const n of o)
        if (s(n)) {
          const o = n.overlapsLine(e, t)
          o.length > 0 && r.push(o)
        }
    }
    return r
  }
  findOverlappingNodePairs(e) {
    const t = e.floorId,
      o: Array<{ keepId: string; mergeId: string }> = [],
      s = new Set(),
      n = new Set(),
      a: string[] = [],
      l = this.getNodesByFloor(t)
    for (const d of l) {
      const l = this.getAttachedEntities(d),
        h = this.findNodeOrWallForPosition(d.getVec3(), t, l)
      if (h)
        if (h instanceof RbushBboxNode) {
          const t = [d.id, h.id].sort().join(":")
          if (!s.has(t)) {
            let i = d.id,
              r = h.id
            if (r === e.id) {
              const e = r
              ;(r = i), (i = e)
            }
            n.has(r) || n.has(i) || (o.push({ keepId: i, mergeId: r }), s.add(t), n.add(r))
          }
        } else h instanceof RoomWall && (n.has(d.id) || a.push(d.id))
    }
    return { nodeOverlaps: o, nodeWallOverlaps: a }
  }
  findWallWithWorstOverlaps(e, t) {
    let o: ReturnType<RoomBoundData["findNodeAndWallsOverlappingLine"]> = [],
      s: RoomWall | null = null
    const n = this.getWallsForFloor(e)
    const r = "colinear" === t ? 2 : 1
    if (n) {
      for (const e of n) {
        const n = "intersection" === t ? this.getAttachedEntities(e.from) : le
        const a = "intersection" === t ? this.getAttachedEntities(e.to) : le
        const l = this.findNodeAndWallsOverlappingLine(
          e.from.getVec3(),
          e.to.getVec3(),
          e.floorId,
          t => t instanceof RoomWall && t.id !== e.id && !n.has(t.id) && !a.has(t.id)
        ).filter(e => e.length === r)
        l.length > 0 && l.length > o.length && ((o = l), (s = e))
      }
    }

    return null != s ? { wall: s, overlaps: o.sort((e, t) => e[0].t - t[0].t) } : null
  }
  findOverlappingEntities(e) {
    const t = e.floorId,
      { nodeOverlaps: o, nodeWallOverlaps: s } = this.findOverlappingNodePairs(e),
      n = this.findWallWithWorstOverlaps(t, "colinear"),
      i = this.findWallWithWorstOverlaps(t, "intersection")
    if (o.length > 0 || s.length > 0 || i || n) {
      return { nodeOverlaps: o, nodeWallOverlaps: s, intersectingWall: i ? i.wall : void 0, collinearWall: n ? n.wall : void 0 }
    }
    return null
  }
  getSortedRoomClassifications() {
    return Object.values(this.roomClassifications).sort((e, t) => e.label.localeCompare(t.label))
  }
  hasWallBetween(e, t) {
    const o = RoomWall.getCompositeKey(e.id, t.id)
    return this._wallsByCompositeKey.has(o)
  }
  getWallForNodes(e: string, t: string) {
    const o = RoomWall.getCompositeKey(e, t)
    const s = this._wallsByCompositeKey.get(o)
    s || this.logAndThrow(new Error("getWallForNodes: No wall exists for these nodes!"))
    return s
  }
  canDeleteEntity(e) {
    if (null != e) {
      const t = this.getEntity(e)
      if (t instanceof RbushBboxNode) {
        if (2 !== this.getEdgeCountForNode(t)) return !1
        let e
        for (const o of this.getWallsForNode(t)!.values()) {
          if (void 0 !== e && o.type !== e) return !1
          e = o.type
        }
        return !0
      }
      if (t instanceof Room) {
        return !!Array.from(t.walls).find(e => 1 === Array.from(this.getRoomsForWall(e)).filter(t => t.walls.has(e)).length)
      }
      return t instanceof RoomWall || t instanceof WallOpening
    }
    return !1
  }
  undo() {
    const e = this.undoBuffer.pop()
    if (e) {
      try {
        this.actionList.push(e.logInfo()), e.invert()
      } catch (e) {
        return void this.onActionError(e)
      }
      this.commit(), this._triggerFinalizeObservers()
    }
  }
  availableUndos() {
    return this.undoBuffer.availableUndos()
  }
  clearUndoBuffer() {
    this.undoBuffer.clear()
  }
  resetHistory() {
    this.clearUndoBuffer(), (this._observerQueue.length = 0), this._deleteSet.clear()
  }
  finalizeHistory() {
    this.undoBuffer.finalize(), this._triggerFinalizeObservers()
  }
  getAndClearActionList() {
    const e = this.actionList.slice()
    return (this.actionList.length = 0), e
  }
  triggerAction(e) {
    try {
      e.run()
    } catch (e) {
      return (this._observerQueue.length = 0), this._deleteSet.clear(), void this.onActionError(e)
    }
    const s = this.undoBuffer.peek()?.lastAction()
    this.undoBuffer.push(e)
    s !== this.undoBuffer.peek()?.lastAction() && this.actionList.push(e.logInfo())
    this.commit()
  }
  onNodesChanged(e) {
    return this._nodes.onChanged(e)
  }
  onWallsChanged(e) {
    return this._walls.onChanged(e)
  }
  onRoomsChanged(e) {
    return this._rooms.onChanged(e)
  }
  onOpeningsChanged(e) {
    return this._wallOpenings.onChanged(e)
  }
  validateGraph() {
    this._recomputeRooms() && (this.commit(), this.finalizeHistory())
  }
  commit() {
    const e = this._observerQueue.length
    if ((this._flushObserverQueue(), e > 0)) for (const e of this._anythingChangeObservers) e(void 0)
  }
  onPropertyChanged(e, t) {
    const o = this["_" + e]
    if (o instanceof RoomBoundNode) {
      const s = o
      const n = () => {
        s.addedObservers.add(t)
        s.updatedObservers.add(t)
        s.deletedObservers.add(t)
      }
      const i = () => this.removeOnPropertyChanged(e, t)
      return createSubscription(n, i, !0, e)
    }
    this.logAndThrow(new Error(`Property: ${e} does not exist on wall-data`))
  }
  removeOnPropertyChanged(e, t) {
    const o = this["_" + e]
    if (o instanceof RoomBoundNode) {
      const e = o
      e.addedObservers.delete(t), e.updatedObservers.delete(t), e.deletedObservers.delete(t)
    } else this.logAndThrow(new Error(`Property: ${e} does not exist on wall-data`))
  }
  onChanged(e) {
    if (this._anythingChangeObservers.has(e))
      throw new Error("This observer function is already observing this Observable, and double subscriptions are not supported.")
    return createSubscription(
      () => this._anythingChangeObservers.add(e),
      () => this.removeOnChanged(e),
      !0
    )
  }
  removeOnChanged(e) {
    this._anythingChangeObservers.delete(e)
  }
  afterFinalize(e) {
    this._afterFinalizeObservers.has(e) && this.logAndThrow(new Error("Already subscribed!"))
    return createSubscription(
      () => this._afterFinalizeObservers.add(e),
      () => this._afterFinalizeObservers.delete(e),
      !0
    )
  }
  addFloatingEdge(e, t, o, s, n) {
    const i = new AddFloatingEdge(this, { from: t, to: o, width: s, floorId: n, type: e })
    return this.triggerAction(i), i.output
  }
  addBridgingEdge(e, t, o, s) {
    const n = new AddBridgingEdge(this, { fromId: t, toId: o, width: s, type: e })
    return this.triggerAction(n), n.output
  }
  addTrailingEdgeToNode(e, t, o, s) {
    const n = new AddTrailingEdgeToNode(this, { fromId: t, to: o, width: s, type: e })
    return this.triggerAction(n), n.output
  }
  addTrailingEdgeToEdge(e, t, o, s, n) {
    const i = new AddTrailingEdgeToEdge(this, { fromWallId: t, along: o, to: s, width: n, type: e })
    return this.triggerAction(i), i.output
  }
  canMoveNode(e, t) {
    const o = this.getNode(e)!
    const s = this.getWallsForNode(o)!
    for (const e of s) {
      if (0 === e.openings.length) continue
      const s = e.getOtherNode(o)
      const n = s.x - t.x
      const i = s.z - t.z
      const r = Math.sqrt(n * n + i * i)
      if (!(r > e.length))
        for (const t of e.openings) {
          const e = t.relativePos * r,
            o = 0.5 * t.width
          if (e + o > r || e - o < 0) return !1
        }
    }
    return !0
  }
  moveNode(e, t) {
    const o = { nodeId: e, newPos: t }
    this.triggerAction(new MoveNode(this, o))
  }
  moveWall(e, t, o) {
    const s = { wallId: e, newFromPos: t, newToPos: o }
    this.triggerAction(new MoveEdge(this, s))
  }
  deleteEntity(e) {
    if (this.canDeleteEntity(e)) {
      const t = this.getEntity(e)
      if (t instanceof RbushBboxNode) {
        const t = { nodeId: e }
        this.triggerAction(new DeleteNode(this, t))
      } else if (t instanceof RoomWall) {
        const t = { wallId: e }
        this.triggerAction(new DeleteEdge(this, t))
      } else if (t instanceof WallOpening) {
        const t = { openingId: e }
        this.triggerAction(new DeleteWallOpening(this, t))
      } else if (t instanceof Room) {
        const t = { roomId: e }
        this.triggerAction(new DeleteRoom(this, t))
      }
    }
  }
  setEdgeProperties(e, t) {
    const o = { wallId: e, props: t }
    this.triggerAction(new SetEdgeProps(this, o))
  }
  addWallOpening(e) {
    const t = new AddOpeningAction(this, e)
    this.triggerAction(t)
    return t.output.openingId
  }
  editWallOpeningDetails(e, t) {
    this.triggerAction(new EditOpeningDetails(this, Object.assign(Object.assign({}, t), { id: e })))
  }
  addWallJoint(e, t, o) {
    const s = { wallId: e, fromNode: t, toNode: o }
    this.triggerAction(new AddJointToNode(this, s))
  }
  setRoomDetails(e, t) {
    this.triggerAction(new SetRoomDetails(this, Object.assign({ roomId: e }, t)))
  }
  mergeOverlappingEntities(e, t, o, s, n) {
    const i = { movedEntity: e, nodeOverlaps: t, nodeWallOverlaps: o, collinearWall: s, intersectingWall: n }
    this.triggerAction(new MergeOverlappingEntities(this, i))
  }
  getRoomTypeName(e, t) {
    var o
    const s = this.getRoom(e)!
    s || this.logAndThrow(new Error("Room does not exist"))
    if (s.classifications && s.classifications.length > 0) {
      return (0, oe.ZJ)(s.classifications.map(e => e.id))
        .map(e => {
          var o
          return (null === (o = this.roomClassifications[e]) || void 0 === o ? void 0 : o.label) || t
        })
        .join(J.X9)
    }
    return (null === (o = this.roomClassifications[J.ub]) || void 0 === o ? void 0 : o.label) || t
  }
  getRoomLabel(e, t) {
    const o = this.getRoom(e)
    o || this.logAndThrow(new Error("Room does not exist"))
    return o?.name ? o.name : this.getRoomTypeName(e, t)
  }
  getPotentialRoomCanvasLabels(e, t, o, s, n) {
    const i = (...e) => e.filter(e => e.length > 0).join("\n")
    const r = this.getRoom(e)!
    const a = s && (!r.isOther() || r.name)
    const l = n && !r.hide
    const d = a ? this.getRoomLabel(e, t) : ""
    const h = l ? (0, re.dO)(o, r.getArea(o)).area : ""
    const c = l ? r.getMeasurementText(o) : ""
    const u: string[] = []
    for (let e = d.length; e >= 0; e--) u.push(i(substrString(d, e), h, c), i(substrString(d, e), h))
    for (let e = d.length; e >= 0 && d.length > 0; e--) u.push(substrString(d, e))
    return 0 === d.length && u.push("..."), u
  }
  getAttachedEntities(e: RbushBboxNode) {
    const t = new Set<string>()
    t.add(e.id)
    const o = this.getNode(e.id)!
    const s = this.getWallsForNode(o)!
    for (const e of s) {
      t.add(e.id)
      const s = e.getOtherNode(o)
      1 === this.getEdgeCountForNode(o) && 1 === this.getEdgeCountForNode(s) && t.add(s.id)
    }
    return t
  }
  translateClassificationLabels(e) {
    return e
      ? e.map(e => {
          const t = this.roomClassifications[e.id]
          return t ? Object.assign(Object.assign({}, e), { label: t.label }) : e
        })
      : []
  }
  traceWallsFromTo(e: RbushBboxNode, t: RbushBboxNode, o?: Set<RoomWall>) {
    const s = [e, t]
    let n = !1
    for (; (n = !this.hasLoop(s)); ) {
      const e = s[s.length - 1]
      const t = s[s.length - 2]
      const n = this.getNodeNeighbors(e, o)
      let i,
        r = 4 * Math.PI
      for (const o of n) {
        const s = this.getRelativeAngle(e, t, o)
        s < r && ((r = s), (i = o))
      }
      if ((i || this.logAndThrow(new Error("Expected a neighbor")), e === s[0] && i === s[1])) {
        s.pop()
        break
      }
      s.push(i)
    }
    return n ? s : []
  }
  getNodeNeighbors(e: RbushBboxNode, t?) {
    const o = new Set<RbushBboxNode>()
    const s = this.getWallsForNode(e)
    s || this.logAndThrow(new Error("Expecting node to wall map to be valid"))
    for (const n of s!.values()) (t && !t.has(n)) || o.add(n.getOtherNode(e))
    return o
  }
  hasLoop(e: RbushBboxNode[]) {
    if (0 === e.length || e.length % 100 != 0) return !1
    const t: RbushBboxNode[] = []
    for (let o = e.length - 1; o >= 0; o--) {
      t.unshift(e[o])
      const s = e.length - 2 * t.length
      if (s < 0) return !1
      let n = !0
      for (let o = 0; o < t.length; o++) e[s + o] !== t[o] && (n = !1)
      if (n)
        return (
          this.logger.error(
            "Found infinite loop!",
            t.map(e => e.id),
            "in sequence",
            e.map(e => e.id)
          ),
          !0
        )
    }
    return !1
  }
  _createNode(e: RbushBboxNode | { x: number; z: number }, t: string, o = randomString11()) {
    const s = new RbushBboxNode(o, t, e.x, e.z)
    this._nodes.set(s.id, s)
    this._addToDictHelper(t, s, this._nodesByFloor)
    this.insertIntoSpatialIndex(s)
    this._scheduleObserver({ observers: this._nodes.addedObservers, param: s, type: QueueType.CREATE })
    return s
  }
  _updateNode(e: string, t) {
    const o = this._nodes.get(e)
    o
      ? (this.removeFromSpatialIndex(o), (o.x = t.x), (o.z = t.z), this.insertIntoSpatialIndex(o), this._scheduleUpdate(this._nodes, o))
      : this.logAndThrow(new Error("Attempted to update WallNode that does not exist"))
  }
  _deleteNode(e: string) {
    const t = this._nodes.get(e)
    t
      ? (this.getEdgeCountForNode(t) > 0 && this.logAndThrow(new Error("Attempted to delete a node which has wall references still!")),
        this._nodes.delete(e),
        this._removeFromDictHelper(t.floorId, t, this._nodesByFloor),
        this.removeFromSpatialIndex(t),
        this._scheduleDelete(this._nodes, t))
      : this.logAndThrow(new Error("Attempted to delete WallNode that does not exist"))
  }
  _createRoom(e: {
    id: string
    name: string
    points: RbushBboxNode[]
    walls: Set<RoomWall>
    holesCW: RbushBboxNode[][]
    holes: Set<RoomWall>[]
    classifications: any[]
    location: LocationType
    includeInAreaCalc: boolean
    hide: boolean
    keywords: string[]
    height: number | null
  }) {
    this._validateRoomDetails(e.points, e.holesCW, e.walls, e.holes)
    const t = new Room(e)
    this.rooms.set(t.id, t)
    for (const e of t.allWalls()) {
      const o = this._wallToRoomMap.get(e) || new Set()
      o.add(t)
      this._wallToRoomMap.set(e, o)
    }
    this._scheduleObserver({ observers: this._rooms.addedObservers, param: t, type: QueueType.CREATE })
    this.calculateRoomInsights(t)
    return t
  }
  _updateRoom(e: string, t) {
    this._validateRoomDetails(t.points, t.holesCW, t.walls, t.holes)
    const o = this._rooms.get(e)
    if (o) {
      for (const e of o.allWalls()) {
        const t = this._wallToRoomMap.get(e)
        t && t.delete(o)
      }
      t.name = o.name
      t.classifications = o.classifications ? [...o.classifications] : []
      this.rooms.set(e, t)
      for (const e of t.allWalls().values()) {
        const o = this._wallToRoomMap.get(e) || new Set()
        o.add(t), this._wallToRoomMap.set(e, o)
      }
      this._scheduleUpdate(this._rooms, t), this.calculateRoomInsights(t)
    } else this.logAndThrow(new Error("Attempted to update Room that does not exist"))
  }
  _validateRoomDetails(e, t, o, s) {
    const n = e[0].floorId
    for (const o of e.concat(t.flat())) o.floorId !== n && this.logAndThrow(new Error("Room nodes have mismatching floor ids!"))
  }
  logAndThrow(e: Error) {
    throw (this.broadcast(new RoomBoundErrorMessage(e)), e)
  }
  _updateRoomDetails(e: string, t) {
    const { name: o, roomTypeIds: s, location: n, includeInAreaCalc: i, hide: r, keywords: a, showDimensions: l, showHeight: d } = t,
      h = this.getRoom(e)!
    h.name = null != o ? o : h.name
    s && (h.classifications = s.map(e => ({ id: e, label: this.roomClassifications[e].label })))
    h.location = null != n ? n : h.location
    h.includeInAreaCalc = null != i ? i : h.includeInAreaCalc
    h.hide = null != r ? r : h.hide
    h.keywords = null != a ? a : h.keywords
    h.showDimensions = null != l ? l : h.showDimensions
    h.showHeight = null != d ? d : h.showHeight
    this._scheduleUpdate(this._rooms, h)
  }
  _deleteRoom(e) {
    const t = this._rooms.get(e)
    if (t) {
      this._rooms.delete(t.id)
      for (const e of t.allWalls().values()) {
        const o = this._wallToRoomMap.get(e)
        null == o || o.delete(t)
      }
      this._scheduleDelete(this._rooms, t)
    } else this.logAndThrow(new Error("Attempted to delete Room that does not exist"))
  }
  _createWall(e: WallType, t: RbushBboxNode, o: RbushBboxNode, s: number, r: any[], a: number, l = randomString11()) {
    t.id === o.id && this.logAndThrow(new Error("Cannot create wall where the from node is the same as the to node."))
    t.floorId !== o.floorId && this.logAndThrow(new Error("Cannot create a wall between nodes on different floors."))
    this.hasWallBetween(t, o) && this.logAndThrow(new Error("Wall already exists between start and end nodes."))
    this._walls.has(l) && this.logAndThrow(new Error("Wall already exists!"))
    const d = this.getNode(t.id)
    const h = this.getNode(o.id)
    const c = new RoomWall(l, e, d, h, s, a)
    this._walls.set(c.id, c)
    this._addToWallDicts(c)
    this._scheduleObserver({ observers: this._walls.addedObservers, param: c, type: QueueType.CREATE })
    for (const e of r) {
      const { type: t, relativePos: o, width: s, id: n } = e
      this._createWallOpening(c, t, o, s, n)
    }
    this.insertIntoSpatialIndex(c)
    return c
  }
  _deleteWall(e: string) {
    const t = this.getWall(e)!
    for (const e of t.openings.slice()) this._deleteWallOpening(e.id)
    this._walls.delete(e)
    this._removeFromWallDicts(t)
    this.removeFromSpatialIndex(t)
    this._scheduleDelete(this._walls, t)
  }
  _setEdgeProps(e: string, t) {
    const { width: o, bias: s, type: n } = t,
      r = this.getWall(e)!
    void 0 !== n && (r.type = n)
    void 0 !== o && ((r.width = o), r.type === WallType.SOLID && (this.lastSolidWallWidth = o))
    void 0 !== s && (r.bias = s)
    this._scheduleUpdate(this._walls, r)
    this._updateDependentsForNodes(r.from, r.to)
  }
  _createWallOpening(e: RoomWall, t, o, s: number, i = randomString11()) {
    const r = new WallOpening(i, e.id, t, o, s)
    this._wallOpenings.set(r.id, r)
    e.openings.push(r)
    this._scheduleObserver({ observers: this._wallOpenings.addedObservers, param: r, type: QueueType.CREATE })
    return r
  }
  _setOpeningDetails(e: string, t) {
    const i = this.getOpening(e)!
    i.type = t.type || i.type
    i.relativePos = t.relativePos || i.relativePos
    i.width = t.width || i.width
    this._scheduleUpdate(this._wallOpenings, i)
  }
  _deleteWallOpening(e: string) {
    const t = this.getOpening(e)!
    const o = this.getWall(t.wallId)!
    const s = o.openings.findIndex(t => t.id === e)
    ;-1 !== s ? o.openings.splice(s, 1) : this.logAndThrow(new Error("Expected opening to exist in wall array!"))
    this._wallOpenings.delete(e)
    this._scheduleDelete(this._wallOpenings, t!)
  }
  _addToWallDicts(e: RoomWall) {
    this._addToDictHelper(e.from, e, this._nodeToWallMap)
    this._addToDictHelper(e.to, e, this._nodeToWallMap)
    this._addToDictHelper(e.floorId, e, this._wallsByFloor)
    this._wallsByCompositeKey.set(RoomWall.getCompositeKey(e.from.id, e.to.id), e)
  }
  _addToDictHelper(e: RbushBboxNode | string, t: RbushBboxNode | RoomWall, o) {
    let s = o.get(e)
    null != s ? s.add(t) : ((s = new Set()), s.add(t), o.set(e, s))
  }
  _removeFromDictHelper(e, t, o) {
    const s = o.get(e)
    null != s && (s.delete(t), 0 === s.size && o.delete(e))
  }
  _removeFromWallDicts(e: RoomWall) {
    this._removeFromDictHelper(e.from, e, this._nodeToWallMap)
    this._removeFromDictHelper(e.to, e, this._nodeToWallMap)
    this._removeFromDictHelper(e.floorId, e, this._wallsByFloor)
    this._wallToRoomMap.delete(e)
    this._wallsByCompositeKey.delete(RoomWall.getCompositeKey(e.from.id, e.to.id))
  }
  _scheduleObserver(e: { observers: Set<Function>; param: RoomWall | WallOpening | Room | RbushBboxNode; type: QueueType }) {
    this._observerQueue.push(e)
  }
  _scheduleUpdate(e: RoomBoundNode<RoomWall | Room | WallOpening | RbushBboxNode>, t: RoomWall | Room | WallOpening | RbushBboxNode, o = !1) {
    this._observerQueue.find(o => o.observers === e.addedObservers && o.param === t) ||
      this._scheduleObserver({ observers: o ? e.childUpdatedObservers : e.updatedObservers, param: t, type: QueueType.UPDATE })
  }
  _scheduleDelete(e: RoomBoundNode<RoomWall | Room | WallOpening | RbushBboxNode>, t: RoomWall | Room | WallOpening | RbushBboxNode) {
    this._scheduleObserver({ observers: e.deletedObservers, param: t, type: QueueType.DELETE }), this._deleteSet.add(t)
  }
  _flushObserverQueue() {
    const e = new Set()
    for (const t of this._observerQueue)
      if (t.type !== QueueType.UPDATE || !this._deleteSet.has(t.param))
        if (t.type === QueueType.CREATE && this._deleteSet.has(t.param)) e.add(t.param)
        else if (t.type !== QueueType.DELETE || !e.has(t.param))
          for (const e of t.observers) {
            const o = t.param
            e(o, o.id)
          }
    this._observerQueue.length = 0
    this._deleteSet.clear()
  }
  _triggerFinalizeObservers() {
    for (const e of this._afterFinalizeObservers.values()) e()
  }
  getSnapshot() {
    const e = { version: this.version, floors: {} },
      t = t => {
        e.floors[t] || (e.floors[t] = { edges: {}, vertices: {}, rooms: {} })
      }
    for (const [o, s] of this._nodes.data) {
      t(s.floorId)
      e.floors[s.floorId].vertices[s.id] = s.getSnapshot()
    }
    for (const [o, s] of this._walls.data) {
      t(s.floorId)
      e.floors[s.floorId].edges[s.id] = s.getSnapshot()
    }
    for (const [o, s] of this._rooms.data) {
      t(s.floorId)
      e.floors[s.floorId].rooms[s.id] = s.getSnapshot()
    }
    return e
  }
  insertIntoSpatialIndex(e: RoomWall | RbushBboxNode) {
    if (this.isLoading) return
    this.spatialIndex.has(e.floorId) || this.spatialIndex.set(e.floorId, new RBush())
    const t = this.spatialIndex.get(e.floorId)
    e.updateRBushBBox()
    t?.insert(e)
  }
  removeFromSpatialIndex(e: RoomWall | RbushBboxNode) {
    if (this.isLoading) return
    const t = this.spatialIndex.get(e.floorId)
    null != t && t.remove(e)
  }
  _recomputeRooms() {
    new ValidateGraphAndComputeRooms(this, {}).run()
    return this._observerQueue.length > 0
  }
  calculateRoomInsights(e: Room) {
    this.calculateRoomArea(e)
    this.calculateRoomPerimeter(e)
    this.calculateRoomMeasurements(e)
    this.isLoading || this.calculateRoomHeight(e)
  }
  calculateRoomArea(e: Room) {
    const t = new Array(new Vector3(), new Vector3(), new Vector3(), new Vector3())
    t.push(t[0])
    const o = e => {
        let o = 0
        for (let s = 0; s < e.length; s++) {
          e[s].getVec3(t[0]), e[(s + 1) % e.length].getVec3(t[1]), (0, g.A2)(e, s, !0, this, t[2]), (0, g.A2)(e, s, !1, this, t[3])
          o += (0, m.m)(t.map(e => [e.x, e.z]))
        }
        return o
      },
      s = o(e.getCWPoints())
    let n = 0
    for (const t of e.holesCW) (n += (0, g.SV)(t)), (n += o(t.slice().reverse()))
    const i = (0, g.SV)(e.points)
    e.area = Math.max(i - s - n, 0)
  }
  calculateRoomPerimeter(e: Room) {
    const t: Array<{ start: Vector3; end: Vector3 }> = []
    const o = e.getInnerLoops()
    for (const e of o) {
      const o = e.length
      for (let s = 0; s < o; s++) {
        const n = e[s]
        const i = e[(s + 1) % o]
        t.push({ start: n, end: i })
      }
    }
    const s: Array<{ start: Vector3; end: Vector3 }> = []
    s.push(t[0])
    const n = new Vector3()
    const i = new Vector3()
    const r = (e, t) => {
      const o = e.end.distanceTo(t.start) < 0.01
      n.subVectors(e.start, e.end).normalize(), i.subVectors(t.end, t.start).normalize()
      const s = Math.abs(Math.abs(n.dot(i)) - 1) < 0.01
      return o && s
    }
    const a = t.length
    for (let e = 1; e < a; e++) {
      const o = t[(e + a - 1) % a]
      const n = t[e]
      if (r(o, n)) {
        s[s.length - 1].end.copy(n.end)
      } else s.push(n)
    }
    const l = s[0]
    const d = s[s.length - 1]
    r(d, l) && (l.start.copy(d.start), s.pop())
    e.minimalInnerEdges = s
    let h = 0
    for (const e of s) h += e.start.distanceTo(e.end)
    e.perimeter = h
  }
  calculateRoomMeasurements(e: Room) {
    const { edges, thickness } = (0, g.B7)(e, this)
    let s = 0,
      n = [new Vector2(), new Vector2()],
      i = [new Vector2(), new Vector2()],
      r = new Vector2(0, 0)
    for (let e = 0; e < 2; e++) {
      let a = 0
      for (let l = 0; l < edges.length; l++) {
        const d = edges[l],
          h = edges[(l + 1) % edges.length]
        for (let c = 0; c < edges.length; c++) {
          if (l === c) continue
          const p = edges[c]
          const f = edges[(c + 1) % edges.length]
          const m = (0, g.bX)([d, h], new Vector2())
          const w = (0, g.bX)([p, f], new Vector2())
          if (m.dot(w) > Math.cos(Math.PI - J.S2)) continue
          const _ = new Vector2().subVectors(m, w).normalize()
          if (e > 0 && Math.abs(_.dot(r)) > Math.cos(Math.PI / 2 - J.LW)) continue
          const O = new Vector2().addVectors(p.getVec2(), f.getVec2()).multiplyScalar(0.5)
          if ((0, g.jH)(m, d.getVec2(), O) < 0) continue
          const y = new Vector2()
          const I = new Vector2()
          const W = (0, g.IQ)(
            [d.getVec2().addScaledVector(m, thickness[l]), h.getVec2().addScaledVector(m, thickness[l])],
            [p.getVec2().addScaledVector(w, thickness[c]), f.getVec2().addScaledVector(w, thickness[c])],
            y,
            I
          )
          W > a && ((a = W), 0 === e ? ((n = [y, I]), (r = m), (s = 1)) : ((i = [y, I]), (s = 2)))
        }
      }
    }
    if (2 === s) {
      const e = (n[1].y - n[0].y) / (n[1].x - n[0].x),
        t = (i[1].y - i[0].y) / (i[1].x - i[0].x)
      if (Math.abs(e) < Math.abs(t)) {
        const e = n
        n = i
        i = e
      }
    }
    e.length = NaN
    e.width = NaN
    s >= 2 &&
      ((e.length = new Vector2().subVectors(n[0], n[1]).length()),
      (e.l1 = n[0].clone()),
      (e.l2 = n[1].clone()),
      (e.width = new Vector2().subVectors(i[0], i[1]).length()),
      (e.w1 = i[0].clone()),
      (e.w2 = i[1].clone()),
      this.isRectangularIsh(e) || ((e.length = NaN), (e.width = NaN)))
  }
  isRectangularIsh(e: Room) {
    if (isNaN(e.length) || isNaN(e.width)) return !1
    const t = e.getCWPoints()
    return (0, g.t)(t, [e.l1, e.l2], [e.w1, e.w2], this) > 0.9
  }
  calculateRoomHeight(e: Room) {
    if (!this.raycast || e.area <= 1e-4) return
    const t = MathUtils.degToRad(10),
      o = 0.01
    let s = 0
    const n = new Vector3(),
      i: Array<{ height: number; weight: number }> = [],
      r = new Vector3(),
      a = new Vector3(),
      l = this.getRoomSamplePoints(e)
    for (const o of l) {
      n.copy(o.position), (n.y = 1e5), (s += o.area)
      const l = this.raycast(n, e.floorId)
      let d = 1e5,
        h = -1e5
      for (const { face: e, point: t } of l) {
        const o = null == e ? void 0 : e.normal
        if (!o) continue
        const s = o.dot(DirectionVector.UP)
        s < 0 && t.y > h && ((h = t.y), a.copy(o)), s > 0 && t.y < d && ((d = t.y), r.copy(o))
      }
      if (d >= h) continue
      const c = Math.acos(r.dot(DirectionVector.UP)),
        u = Math.acos(a.dot(DirectionVector.DOWN))
      if (c < t && u < t) {
        const e = ((1 - c / t) * (1 - u / t)) / (1 / o.area)
        i.push({ height: h - d, weight: e })
      }
    }
    if (i.length < 10) return void (e.height = NaN)
    const d = i.reduce((e, t) => Math.max(e, t.height), 0),
      h = 1 + Math.floor((d + 0.005) / o),
      c = new Array(h).fill(0)
    for (const { height: e, weight: t } of i) {
      c[Math.floor((e + 0.005) / o)] += t
    }
    const g = new Array(h).fill(0)
    for (let e = 0; e < c.length; e++)
      0 === e ? (g[e] = (c[e] + c[e + 1]) / 2) : e === c.length - 1 ? (g[e] = (c[e] + c[e - 1]) / 2) : (g[e] = (c[e - 1] + c[e] + c[e + 1]) / 3)
    const p = g.reduce((e, t, o) => (g[e] < t ? o : e), 0) * o
    let f = 0
    for (const { weight: e, height: t } of i) Math.abs(t - p) < 0.05 && (f += e)
    ;(f += 0.5), (e.height = p > 0 && s > 0 && f / s >= 0.3 ? p : NaN)
  }
  *getRoomSamplePoints(e: Room) {
    const { points, faces } = e.getGeometry(),
      s: Triangle[] = []
    for (const e of faces) {
      const o = e.map(e => new Vector3(points[e].x, 0, points[e].y))
      s.push(new Triangle(o[0], o[1], o[2]))
    }
    const n = s.reduce((e, t) => e + t.getArea(), 0),
      i = CheckThreshold(1 * n, 10, 200),
      r = new Vector3()
    for (const e of s) {
      const t = e.getArea(),
        o = Math.ceil(i * (t / n)),
        s = Math.ceil(Math.log2(o) / 2)
      for (let n = 0; n < o; n++) {
        const i = this.lowDiscrepancySampleTriangle(n, s)
        r.set(0, 0, 0)
        r.addScaledVector(e.a, i.x).addScaledVector(e.b, i.y).addScaledVector(e.c, i.z)
        yield { position: r, area: t / o }
      }
    }
  }
}
