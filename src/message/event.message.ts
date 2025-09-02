import { DebugInfo } from "../core/debug"
import { Message } from "../core/message"
import { MessageBus } from "../core/messageBus"
import { ISubscription } from "../core/subscription"
import { BaseExceptionError } from "../error/baseException.error"
import { ObservableObject } from "../observable/observable.object"
import { ObservableValue } from "../observable/observable.value"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
const EditorDebugInfo = new DebugInfo("editor")

class EditEvent extends Message {
  static type = "edit"
}
class WaitForAddStart extends EditEvent {
  static type = "waitforaddstart"
}

class Exit extends EditEvent {
  static type = "editorexit"
}

class Start extends EditEvent {
  static type = "editorstart"
}

class StateChange extends EditEvent {
  static type = "toolchange"
  target: any
  previous: any
  constructor(t, e) {
    super(), (this.target = t), (this.previous = e)
  }
}

class EditTargetAndPrev extends EditEvent {
  static type = "edittp"
  target: any
  previous: any
  constructor(t, e) {
    super()
    this.target = t
    this.previous = e
  }
}
class EditTarget extends EditEvent {
  target: any
  static type = "editt"
  constructor(t) {
    super()
    this.target = t
  }
}
class ValidChange extends EditTargetAndPrev {
  static type = "valid"
}

class DimClear extends EditTarget {
  static type = "dimclear"
}

class DimAdd extends EditTarget {
  static type = "dim"
}

class HighlightClear extends EditTarget {
  static type = "highlightclear"
}

class HighlightAdd extends EditTarget {
  static type = "highlight"
}

class SelectChange extends EditTargetAndPrev {
  static type = "select"
}

class HoverChange extends EditTargetAndPrev {
  static type = "hover"
}

class CurrentChange extends EditTargetAndPrev {
  static type = "target"
}

class Move extends EditTarget {
  static type = "move"
  ev: any
  constructor(t, e) {
    super(t)
    this.target = t
    this.ev = e
  }
}

class Delete extends EditTarget {
  static type = "delete"
}
class EditDiscard extends EditTarget {
  static type = "editdiscard"
}
class EditConfirm extends EditTarget {
  static type = "editconfirm"
}

class AddDiscard extends EditTarget {
  static type = "adddiscard"
}

class AddConfirm extends EditTarget {
  static type = "addconfirm"
}

class EditStart extends EditTarget {
  static type = "editstart"
  placeOnly: any
  constructor(t, e) {
    super(t)
    this.placeOnly = e
  }
}

class AddStart extends EditTarget {
  static type = "addstart"
}

class DragAndDropState extends ObservableObject {
  toolState: ToolState
  previousToolState: ToolState
  pendingAdd: any
  pendingEdit: any
  selected: string | null
  previousSelected: any
  hovered: any
  previousHovered: any
  highlighted: Set<any>
  dimmed: Set<string>
  ndcPosition: ObservableValue<any>
  onBeforeDiscard: any
  pendingValid: any
  constructor() {
    super()
    this.toolState = ToolState.CLOSED
    this.previousToolState = ToolState.CLOSED
    this.pendingAdd = null
    this.pendingEdit = null
    this.selected = null
    this.previousSelected = null
    this.hovered = null
    this.previousHovered = null
    this.highlighted = new Set()
    this.dimmed = new Set()
    this.ndcPosition = new ObservableValue(null)
    this.onBeforeDiscard = null
    this.pendingValid = null
  }
  get currentId() {
    return this.pendingAdd || this.pendingEdit || this.selected || null
  }
  onCurrentIdChanged(t, e = !1) {
    let i = this.currentId
    const s = () => {
      this.currentId !== i && (t(this.currentId, i), (i = this.currentId))
    }
    const o = new AggregateSubscription(
      this.onPropertyChanged("selected", s),
      this.onPropertyChanged("pendingAdd", s),
      this.onPropertyChanged("pendingEdit", s)
    )
    e ? o.renew() : o.cancel()
    return o
  }
}
class DragAndDrop {
  state: DragAndDropState
  events: MessageBus
  bindings: ISubscription[]
  validator: null | { validate: Function }
  constructor(t = new DragAndDropState()) {
    this.state = t
    this.events = new MessageBus()
    this.bindings = []
    this.validator = null
    this.state.commit()
    this.bindings.push(
      this.state.onPropertyChanged("toolState", () => {
        EditorDebugInfo.debug("toolState:", { from: this.state.previousToolState, to: this.state.toolState }, this.state),
          this.events.broadcast(new StateChange(this.state.toolState, this.state.previousToolState))
      }),
      this.onSelectedChanged((t, e) => {
        this.events.broadcast(new SelectChange(t, e))
      }),
      this.onHoveredChanged((t, e) => {
        this.events.broadcast(new HoverChange(t, e))
      }),
      this.state.onCurrentIdChanged((t, e) => {
        this.events.broadcast(new CurrentChange(t, e))
      })
    )
    this.bindings.forEach(t => t.cancel())
  }
  subscribe(t, e) {
    return this.events.subscribe(t, e)
  }
  setState(t) {
    t !== this.state.toolState && ((this.state.previousToolState = this.state.toolState), (this.state.toolState = t), this.state.commit())
  }
  start() {
    const { toolState: t } = this.state
    if (t !== ToolState.CLOSED) throw new EditorStateExceptionError("Editor already started")
    this.bindings.forEach(t => t.renew()), this.setState(ToolState.IDLE), this.events.broadcast(new Start())
  }
  setEnabled(t) {
    if (this.state.toolState === ToolState.CLOSED) throw new EditorStateExceptionError("Editor not started")
    if (t) this.state.toolState === ToolState.DISABLED && this.setState(ToolState.IDLE)
    else
      switch (this.state.toolState) {
        case ToolState.DISABLED:
          break
        case ToolState.IDLE:
          this.setState(ToolState.DISABLED)
          break
        default:
          this.unhover({ commit: !1 }), this.deselect({ commit: !1 }), this.discard(), this.setState(ToolState.DISABLED)
      }
  }
  exit() {
    this.state.toolState !== ToolState.CLOSED &&
      (this.state.toolState !== ToolState.DISABLED && (this.unhover({ commit: !1 }), this.deselect({ commit: !1 }), this.discard()),
      this.setState(ToolState.CLOSED),
      this.bindings.forEach(t => t.cancel()),
      this.events.broadcast(new Exit()))
  }
  setValidator(t) {
    this.validator = t
  }
  onDiscard(t) {
    this.state.onBeforeDiscard = t || null
  }
  edit(t) {
    if ((this.assertActive(), null !== this.state.pendingEdit))
      throw (
        (EditorDebugInfo.error(`Trying to edit asset ${t}, but currently editing ${this.state.pendingEdit}`), new EditorStateExceptionError("Edit in progress"))
      )
    ;(this.state.pendingEdit = t), this.setState(ToolState.EDITING), this.events.broadcast(new EditStart(t, !1))
  }
  waitForAdd() {
    if ((this.assertActive(), null !== this.state.pendingAdd))
      throw (
        (EditorDebugInfo.error(`Entering wait for add state, but already adding ${this.state.pendingAdd}`), new EditorStateExceptionError("Add in progress"))
      )
    null !== this.state.selected &&
      (EditorDebugInfo.debug(`Entering the wait for add state, deselecting previous ${this.state.selected}`), this.deselect({ commit: !1 })),
      this.events.broadcast(new WaitForAddStart()),
      this.setState(ToolState.WAIT_FOR_ADD)
  }
  add(t) {
    if ((this.assertActive(), null !== this.state.pendingAdd))
      throw (
        (EditorDebugInfo.error(`Trying to add new asset ${t}, but already adding ${this.state.pendingAdd}`), new EditorStateExceptionError("Add in progress"))
      )
    null !== this.state.selected && (EditorDebugInfo.debug(`Add ${t} called, deselecting previous ${this.state.selected}`), this.deselect({ commit: !1 })),
      (this.state.pendingAdd = t),
      this.events.broadcast(new AddStart(t)),
      this.setState(ToolState.ADDING)
  }
  place(t) {
    this.assertActive()
    const { pendingAdd: s, pendingEdit: n } = this.state,
      o = s || n
    ;(o && t === o) || (this.state.pendingEdit = t), this.setState(ToolState.PLACING), this.events.broadcast(new EditStart(t, !0))
  }
  move(t) {
    this.assertActive(), this.validate(t)
    const { pendingAdd: e, pendingEdit: s, selected: n } = this.state,
      o = e || s || n
    o && this.events.broadcast(new Move(o, t)), (this.state.ndcPosition.value = t.clientPosition)
  }
  highlight(...t) {
    this.assertActive()
    for (const e of t) this.state.highlighted.add(e), this.events.broadcast(new HighlightAdd(e))
  }
  clearHighlight(...t) {
    this.assertActive()
    for (const e of t) this.state.highlighted.delete(e), this.events.broadcast(new HighlightClear(e))
  }
  clearAllHighlights() {
    this.assertActive()
    for (const t of this.state.highlighted) this.events.broadcast(new HighlightClear(t))
    this.state.highlighted.clear()
  }
  dim(t: string) {
    this.assertActive(), this.state.dimmed.add(t), this.events.broadcast(new DimAdd(t))
  }
  clearDim(t: string) {
    this.assertActive(), this.state.dimmed.delete(t), this.events.broadcast(new DimClear(t))
  }
  clearAllDims() {
    this.assertActive()
    for (const t of this.state.dimmed) this.events.broadcast(new DimClear(t))
    this.state.dimmed.clear()
  }
  select(t, i?) {
    this.assertActive(),
      this.state.pendingAdd ||
        this.state.pendingEdit ||
        ((this.state.previousSelected = this.state.selected),
        (this.state.selected = t),
        this.state.commit(),
        i && i.transitionTo ? this.setState(i.transitionTo) : this.setState(ToolState.SELECTED))
  }
  toggleSelect(t) {
    this.state.selected === t ? this.deselect() : this.select(t)
  }
  deselect(t: any = { commit: !0 }) {
    this.assertActive(),
      this.state.pendingAdd ||
        this.state.pendingEdit ||
        (null !== this.state.selected &&
          ((this.state.previousSelected = this.state.selected),
          (this.state.selected = null),
          t.commit && this.state.commit(),
          t && t.transitionTo ? this.setState(t.transitionTo) : this.setState(ToolState.IDLE)))
  }
  hover(t) {
    this.assertActive(), t !== this.state.hovered && ((this.state.previousHovered = this.state.hovered), (this.state.hovered = t), this.state.commit())
  }
  unhover(t = { commit: !0 }) {
    this.state.hovered && ((this.state.previousHovered = this.state.hovered), (this.state.hovered = null), t.commit && this.state.commit())
  }
  tryCommit() {
    this.assertActive()
    const t = this.state.pendingAdd,
      e = this.state.pendingEdit
    if (!1 === this.state.pendingValid) return EditorDebugInfo.warn("nop, pendingValid", this.state.pendingValid), !1
    let s = !1
    const n = this.state.selected,
      o = this.state.pendingAdd || this.state.pendingEdit
    if (o) {
      const a = null === this.state.pendingValid || !0 === this.state.pendingValid
      a &&
        ((this.state.pendingAdd = null),
        (this.state.pendingEdit = null),
        (this.state.pendingValid = null),
        (this.state.onBeforeDiscard = null),
        e && this.events.broadcast(new EditConfirm(e)),
        t && this.events.broadcast(new AddConfirm(t)),
        this.state.pendingAdd || this.state.pendingEdit || n !== this.state.selected || this.select(o)),
        (s = a)
    }
    return s
  }
  discard() {
    const s = this.state.pendingAdd || this.state.pendingEdit,
      n = this.state.pendingAdd,
      o = this.state.pendingEdit
    s &&
      (this.state.onBeforeDiscard && this.state.onBeforeDiscard(),
      o && ((this.state.pendingEdit = null), this.events.broadcast(new EditDiscard(o))),
      n && ((this.state.pendingAdd = null), this.events.broadcast(new AddDiscard(n))),
      this.events.broadcast(new ValidChange(null, null)),
      (this.state.pendingValid = null),
      (this.state.onBeforeDiscard = null)),
      this.unhover({ commit: !1 }),
      this.deselect({ commit: !1 }),
      this.state.toolState !== ToolState.IDLE && this.setState(ToolState.IDLE),
      this.state.commit()
  }
  validate(e) {
    const i = this.state.pendingAdd || this.state.pendingEdit || this.state.selected
    if (i) {
      const s = this.state.pendingValid
      let n = !0
      this.validator ? ((n = this.validator.validate(i, e)), (this.state.pendingValid = n)) : (this.state.pendingValid = null),
        null !== this.state.pendingValid && s !== this.state.pendingValid && this.events.broadcast(new ValidChange(n ? i : null, n ? null : i))
    }
  }
  assertActive() {
    if (this.state.toolState === ToolState.CLOSED) throw new EditorStateExceptionError("Editor closed")
    if (this.state.toolState === ToolState.DISABLED) throw new EditorStateExceptionError("Editor disabled")
  }
  onSelectedChanged(t) {
    return this.state.onPropertyChanged("selected", () => t(this.state.selected, this.state.previousSelected))
  }
  onHoveredChanged(t) {
    return this.state.onPropertyChanged("hovered", () => t(this.state.hovered, this.state.previousHovered))
  }
}
enum ToolState {
  CLOSED = "CLOSED",
  DISABLED = "DISABLED",
  IDLE = "IDLE",
  SELECTED = "SELECTED",
  WAIT_FOR_ADD = "WAIT_FOR_ADD",
  ADDING = "ADDING",
  EDITING = "EDITING",
  PLACING = "PLACING"
}
class EditorStateExceptionError extends BaseExceptionError {
  constructor(t = "invalid state") {
    super(t)
    this.name = "invalid state"
  }
}
export const DragAndDropObject = {
  DragAndDrop,
  State: DragAndDropState,
  ToolState,
  EditorException: EditorStateExceptionError,
  Events: {
    EditEvent,
    EditTarget,
    EditTargetAndPrev,
    StateChange,
    Start,
    Exit,
    WaitForAddStart,
    AddStart,
    EditStart,
    AddConfirm,
    AddDiscard,
    EditConfirm,
    EditDiscard,
    Delete,
    Move,
    CurrentChange,
    HoverChange,
    SelectChange,
    HighlightAdd,
    HighlightClear,
    DimAdd,
    DimClear,
    ValidChange,
    hasTarget: t => {
      return t instanceof EditTarget
    },
    hasTargetAndPrev: t => {
      return t instanceof EditTargetAndPrev
    }
  }
}
