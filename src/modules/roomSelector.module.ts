import { SetMeshOverLayColorCommand } from "../command/mesh.command"
import { RoomSelectorEnableCommand } from "../command/room.command"
import { RoomsSelectorSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { PointerData } from "../data/pointer.data"
import { RoomsData } from "../data/rooms.data"
import { ObservableValue } from "../observable/observable.value"
import { RoomMesh } from "../webgl/roomMesh"
declare global {
  interface SymbolModule {
    [RoomsSelectorSymbol]: RoomSelectorModule
  }
}
class c {
  constructor(e) {
    ;(this.selected = new ObservableValue(null)),
      (this.previousRoom = null),
      (this.trySetRoom = e => {
        const t = this.selected.value !== e
        return (this.selected.value = e), null !== e && t
      }),
      (this.clear = () => !!this.selected.value && ((this.selected.value = null), !0)),
      this.selected.onChanged(t => {
        if (this.previousRoom) {
          const t = this.previousRoom.meshSubgroup
          e.issueCommand(
            new SetMeshOverLayColorCommand(
              {
                color: c.DefaultHighlightColor
              },
              {
                style: SetMeshOverLayColorCommand.selectBy.byMeshSubGroup,
                index: t
              }
            )
          )
        }
        t &&
          (e.issueCommand(
            new SetMeshOverLayColorCommand(
              {
                color: c.SelectedHighlightColor
              },
              {
                style: SetMeshOverLayColorCommand.selectBy.byMeshSubGroup,
                index: t.meshSubgroup
              }
            )
          ),
          (this.previousRoom = t))
      })
  }
  dispose() {
    this.clear()
  }
}
c.SelectedHighlightColor = {
  x: 1,
  y: 1,
  z: 1,
  w: 0.1
}
c.DefaultHighlightColor = null
export default class RoomSelectorModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "room-selector"),
      (this._enable = !1),
      (this._selectedRoom = null),
      (this.getRoomUnderPointer = e => {
        if (e.length > 0) {
          const t = e.filter(e => e.object instanceof RoomMesh)[0],
            n = t && t.object.meshSubgroup
          return (null !== n && this.roomData.getByMeshSubgroup(n)) || null
        }
        return null
      }),
      (this.onEnableCommand = async e => {
        this.enable = e.enable
      })
  }
  async init(e, t) {
    this.bindings.push(t.commandBinder.addBinding(RoomSelectorEnableCommand, this.onEnableCommand)),
      ([this.roomData, this.raycasterData] = await Promise.all([t.market.waitForData(RoomsData), t.market.waitForData(PointerData)])),
      (this.highlighter = new c(t.commandBinder))
  }
  dispose(e) {
    super.dispose(e), this.highlighter.clear()
  }
  onUpdate() {
    if (!this._enable) return
    const e = this.getRoomUnderPointer(this.raycasterData.hits)
    ;(this._selectedRoom = e), this.highlighter.trySetRoom(e)
  }
  set enable(e) {
    e !== this._enable && (e || ((this._selectedRoom = null), this.highlighter.clear())), (this._enable = e)
  }
  get selectedRoomId() {
    return this._selectedRoom ? this._selectedRoom.id : null
  }
}
