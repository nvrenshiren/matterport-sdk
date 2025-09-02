import { DragAndDropObject } from "../message/event.message"
import { Room } from "../webgl/room"
import { Data } from "../core/data"
import { AppData, AppMode } from "./app.data"
import { RoomBoundData } from "./room.bound.data"
const a = !0
export class RoomBoundViewData extends Data {
  data: RoomBoundData
  applicationData: AppData
  visibleInShowcase: boolean
  roomBoundsVisible: boolean
  _roomNamesVisible: boolean
  _roomDimensionsVisible: boolean
  _roomWallsVisible: boolean
  editorState: InstanceType<(typeof DragAndDropObject)["State"]>
  constructor(t: RoomBoundData, e: AppData, i: boolean) {
    super()
    this.data = t
    this.applicationData = e
    this.visibleInShowcase = i
    this.name = "room-bound-view-data"
    this.roomBoundsVisible = !1
    this._roomNamesVisible = a
    this._roomDimensionsVisible = a
    this._roomWallsVisible = a
    this.applicationData.onChanged(() => {
      this.commit()
    })
  }
  setEditorState(t) {
    this.editorState = t

    this.commit()
  }
  getSelectedRoom(t: string) {
    if (!t) return null
    const e = this.data.getEntity(t)
    return e instanceof Room ? e : null
  }
  setRoomBoundVisible(t: boolean) {
    this.roomBoundsVisible = t
    this.commit()
  }
  get roomNamesVisible() {
    return this.applicationData.application !== AppMode.SHOWCASE || this._roomNamesVisible
  }
  setRoomNamesVisible(t: boolean) {
    this._roomNamesVisible = t
    this.commit()
  }
  get roomWallsVisible() {
    return this.applicationData.application !== AppMode.SHOWCASE || this._roomWallsVisible
  }
  setRoomWallsVisible(t: boolean) {
    this._roomWallsVisible = t
    this.commit()
  }
  get roomDimensionsVisible() {
    return this.applicationData.application !== AppMode.SHOWCASE || this._roomDimensionsVisible
  }
  setRoomDimensionsVisible(t: boolean) {
    this._roomDimensionsVisible = t
    this.commit()
  }
}
