import { DragAndDropObject } from "../message/event.message"
import { Room } from "./room"
import { EditorEntityAdapter } from "../editorEntityAdapter"
import { ISubscription } from "../core/subscription"
import { RoomBoundData } from "../data/room.bound.data"
import { RoomBoundsEditor } from "../modules/roomBound.module"
import { RoomWall } from "./room.wall"
export class InputManager {
  editor: RoomBoundsEditor
  data: RoomBoundData
  readBindings: ISubscription[]
  mover: { onMove: (t: any, e: any) => void }
  onCurrentChange: ({ target }: { target: string }) => void
  onSelectChange: ({ target }: { target: string }) => void
  onHoverChange: ({ target, previous }: { target: string; previous: string }) => undefined
  editableEntities: EditorEntityAdapter
  constructor(t, e?) {
    this.editor = t
    this.data = e
    this.readBindings = []
    this.mover = { onMove: (t, e) => {} }
    this.onCurrentChange = ({ target }) => {
      this.editor.state.toolState !== DragAndDropObject.ToolState.ADDING && this.clearHighlightedViews(), this.highlightView(target)
    }
    this.onSelectChange = ({ target: t }) => {
      this.setSelectedView(t)
    }
    this.onHoverChange = ({ target: t, previous: e }) => {
      if (this.editor.state.toolState === DragAndDropObject.ToolState.ADDING) return
      if (!t)
        return (
          this.editor.clearAllDims(), this.editor.clearAllHighlights(), void (this.editor.state.selected && this.setSelectedView(this.editor.state.selected))
        )
      const i = this.data.getEntity(t)
      this.hoverView(i)
    }
    this.editableEntities = new EditorEntityAdapter(this.editor)
  }
  addEditableEntity(t, e) {
    this.editableEntities.registerEntity(e, this, t)
  }
  removeEditableEntity(t) {
    this.editableEntities.unregisterEntity(t)
  }
  activate() {
    0 === this.readBindings.length
      ? this.readBindings.push(
          this.editor.subscribe(DragAndDropObject.Events.CurrentChange, this.onCurrentChange),
          this.editor.subscribe(DragAndDropObject.Events.SelectChange, this.onSelectChange),
          this.editor.subscribe(DragAndDropObject.Events.HoverChange, this.onHoverChange)
        )
      : this.readBindings.forEach(t => t.renew())
  }
  deactivate() {
    this.readBindings.forEach(t => t.cancel())
  }
  clearHighlightedViews() {
    this.editor.clearAllHighlights()
  }
  highlightView(t: string) {
    if (!t) return
    const e = this.data.getEntity(t)
    e instanceof RoomWall && this.editor.highlight(t, e.from.id, e.to.id)
  }
  setSelectedView(t: string) {
    if (!t) return void this.editor.clearAllDims()
    const e = this.data.getEntity(t)
    e instanceof RoomWall && this.editor.highlight(e.from.id, e.to.id),
      e instanceof Room && (this.clearHighlightedViews(), this.dimAllRooms(), this.selectRoom(e))
  }
  dimAllRooms() {
    this.editor.clearAllDims()
    for (const [, t] of this.data.rooms) this.dimRoom(t)
  }
  hoverView(t) {
    t instanceof Room && this.hoverRoom(t)
  }
  hoverRoom(t: Room) {
    const e = t.id
    this.editor.clearDim(e)
    for (const e of t.walls) this.editor.clearDim(e.id)
    for (const e of t.points) this.editor.clearDim(e.id)
  }
  selectRoom(t: Room) {
    const e = t.id
    this.editor.clearDim(e)
    for (const e of t.walls) this.editor.clearDim(e.id)
    for (const e of t.points) this.editor.clearDim(e.id)
  }
  dimRoom(t: Room) {
    const e = t.id
    this.editor.dim(e)
    for (const e of t.walls) this.editor.dim(e.id)
    for (const e of t.points) this.editor.dim(e.id)
  }
}
