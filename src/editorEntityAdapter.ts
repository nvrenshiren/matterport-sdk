import { DragAndDropObject } from "./message/event.message"
import { ISubscription } from "./core/subscription"
import { RoomBoundsEditor } from "./modules/roomBound.module"

const e = {
  [DragAndDropObject.Events.HoverChange.type]: "hoverState",
  [DragAndDropObject.Events.SelectChange.type]: "selectState",
  [DragAndDropObject.Events.ValidChange.type]: "validState",
  [DragAndDropObject.Events.Move.type]: "mover",
  [DragAndDropObject.Events.HighlightAdd.type]: "highlightState",
  [DragAndDropObject.Events.HighlightClear.type]: "highlightState",
  [DragAndDropObject.Events.DimAdd.type]: "dimState",
  [DragAndDropObject.Events.DimClear.type]: "dimState"
}
export class EditorEntityAdapter {
  editor: RoomBoundsEditor
  bindings: ISubscription[]
  entities: Map<any, any>
  constructor(t) {
    this.editor = t
    this.bindings = []
    this.entities = new Map()
    this.bindings.push(
      this.editor.subscribe(DragAndDropObject.Events.HoverChange, t => this.bindTargetedCallback(DragAndDropObject.Events.HoverChange.type, t)),
      this.editor.subscribe(DragAndDropObject.Events.SelectChange, t => this.bindTargetedCallback(DragAndDropObject.Events.SelectChange.type, t)),
      this.editor.subscribe(DragAndDropObject.Events.ValidChange, t => this.bindTargetedCallback(DragAndDropObject.Events.ValidChange.type, t)),
      this.editor.subscribe(DragAndDropObject.Events.HighlightAdd, t => this.bindTargetedCallback(DragAndDropObject.Events.HighlightAdd.type, t)),
      this.editor.subscribe(DragAndDropObject.Events.HighlightClear, t => this.bindClearCallback(DragAndDropObject.Events.HighlightClear.type, t)),
      this.editor.subscribe(DragAndDropObject.Events.DimAdd, t => this.bindTargetedCallback(DragAndDropObject.Events.DimAdd.type, t)),
      this.editor.subscribe(DragAndDropObject.Events.DimClear, t => this.bindClearCallback(DragAndDropObject.Events.DimClear.type, t)),
      this.editor.subscribe(DragAndDropObject.Events.Move, t => this.bindMoveCallback(t))
    )
  }
  registerEntity(t, ...e) {
    let i = this.entities.get(t) || []
    i.push(...e)
    this.entities.set(t, i)
  }
  unregisterEntity(t) {
    return this.entities.delete(t)
  }
  bindTargetedCallback(t, i) {
    let s = null,
      a = null
    DragAndDropObject.Events.hasTargetAndPrev(i) ? ((s = i.target), (a = i.previous)) : DragAndDropObject.Events.hasTarget(i) && (s = i.target)
    const r = e[t]
    if (!r) throw Error(`implement targetted callback for ${t}`)
    ;(this.entities.get(a) || []).forEach(t => {
      r in t && ((t[r].active = !1), t[r].off())
    })
    ;(this.entities.get(s) || []).forEach(t => {
      r in t && ((t[r].active = !0), t[r].on())
    })
  }
  bindMoveCallback(t) {
    ;(this.entities.get(t.target) || []).forEach(e => {
      e.mover && t.target && e.mover.onMove(t.target, t.ev)
    })
  }
  bindClearCallback(t, i) {
    let s = null
    const a = e[t]
    DragAndDropObject.Events.hasTarget(i) && (s = i.target)
    ;(this.entities.get(s) || []).forEach(t => {
      a in t && ((t[a].active = !1), t[a].off())
    })
  }
}
