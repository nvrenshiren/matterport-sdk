import { EventCommon } from "@ruler3d/common"
import Engine from "../core/engine"
import { FloorsData } from "../data/floors.data"
import { EndMoveToFloorMessage, StartMoveToFloorMessage } from "../message/floor.message"
import { FloorsViewData } from "../data/floors.view.data"
import { MovetoFloorNumberCommand, ShowAllFloorsCommand } from "../command/floors.command"

declare global {
  namespace eventList {
    interface data {
      "floors.changestart": (status: number[]) => void
      "floors.changeend": (status: [number, string]) => void
    }
  }
}
export class FloorInterface {
  engine: Engine | null = null
  constructor() {}
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {
    const start = [-1, -1]
    const end: [number, string] = [-1, ""]
    this.engine?.subscribe(StartMoveToFloorMessage, t => {
      const data = this.engine?.market.getData(FloorsData)
      EventCommon.EventBus.emit(
        "floors.changestart",
        (e => {
          if (data) {
            const t = e.to ? data.getFloor(e.to) : null
            const n = e.from ? data.getFloor(e.from) : null
            t && (start[0] = t.index), n && (start[1] = n.index)
          }
          return start
        })(t)
      )
    })
    this.engine?.subscribe(EndMoveToFloorMessage, t => {
      const data = this.engine?.market.getData(FloorsData)
      EventCommon.EventBus.emit(
        "floors.changeend",
        (e => {
          if (data) {
            const t = e.floorId ? data.getFloor(e.floorId) : null
            t && (end[0] = t.index)
          }
          end[1] = e.floorName
          return end
        })(t)
      )
    })
  }
  getData() {
    const data = this.engine?.market.getData(FloorsViewData)!
    try {
      const { currentFloor, totalFloors } = data
      const floorNames = data.getFloorNames()
      return { currentFloor: currentFloor ? currentFloor.index : -1, floorNames, totalFloors }
    } catch (e) {
      throw Error("no floors currently loaded")
    }
  }
  async moveTo(floorIndex: number, moveCamera: boolean) {
    const data = this.engine?.market.getData(FloorsViewData)!
    if ("number" != typeof floorIndex || floorIndex < 0) throw Error("floor index must be a non-negative number")
    try {
      const o = "boolean" == typeof moveCamera && !moveCamera
      const s = o ? 250 : void 0
      await this.engine?.commandBinder.issueCommand(new MovetoFloorNumberCommand(floorIndex, o, s))
      const i = data.currentFloor
      return i ? i.index : -1
    } catch (e) {
      throw Error(`Could not move to floor at index ${floorIndex}`)
    }
  }
  async showAll(moveCamera: boolean) {
    try {
      const data = this.engine?.market.getData(FloorsViewData)!
      await this.engine?.commandBinder.issueCommand(new ShowAllFloorsCommand({ moveCamera }))
      const e = data.currentFloor
      return e ? e.index : -1
    } catch (e) {
      throw Error("Could not show all floors")
    }
  }
}
