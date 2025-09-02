import { MeasurementDeleteSelectedCommand, MeasureModeToggleCommand, MeasureStartCommand, MeasureStopCommand } from "../command/measurement.command"
import Engine from "../core/engine"
import { FloorsData } from "../data/floors.data"
import { MeasureModeData } from "../data/measure.mode.data"
declare global {
  namespace eventList {
    interface data {}
  }
}
interface MeasurementsItem {
  sid: string
  label: string
  floor: number
  start: { x: number; y: number; z: number }
  end: { x: number; y: number; z: number }
}
export class MeasurementsInterface {
  engine: Engine | null = null
  constructor() {}
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {}

  getData() {
    const measureModeData = this.engine?.market.getData(MeasureModeData)!
    const floorsData = this.engine?.market.getData(FloorsData)!
    const n: MeasurementsItem[] = []
    for (const a of measureModeData.groups()) {
      const e = a.info
      const o = floorsData.getFloor(e.floorId)
      for (let t = 1; t < a.count; t++) {
        const s = a.get(t - 1)
        const i = a.get(t)
        n.push({ sid: e.sid, label: e.text, floor: o.index, start: { x: s.x, y: s.y, z: s.z }, end: { x: i.x, y: i.y, z: i.z } })
      }
    }
    return n
  }
  get mode() {
    const measureModeData = this.engine?.market.getData(MeasureModeData)!
    return measureModeData.modeActive()
  }
  async toggleMode(active: boolean) {
    await this.engine?.commandBinder.issueCommand(new MeasureModeToggleCommand(active, active))
  }
  async start() {
    await this.engine?.commandBinder.issueCommand(new MeasureStartCommand())
  }
  async stop() {
    await this.engine?.commandBinder.issueCommand(new MeasureStopCommand())
  }

  async deleteSelected() {
    await this.engine?.commandBinder.issueCommand(new MeasurementDeleteSelectedCommand())
  }
}
