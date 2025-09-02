import { Command } from "../core/command"
export class RenameMeasurementCommand extends Command {
  constructor(t: string, e = "") {
    super()
    this.id = "RENAME_MEASUREMENT"
    this.payload = { sid: t, text: e }
  }
}
export class MeasurementDeleteSelectedCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "MEASUREMENT_DELETE_SELECTED"
  }
}
export class MeasurementDeleteCommand extends Command {
  constructor(e: number) {
    super()
    this.id = "MEASUREMENT_DELETE"
    this.payload = {
      index: e
    }
  }
}
export class MeasurementListDeletionCommand extends Command {
  constructor(...e: string[]) {
    super()
    this.id = "MEASUREMENT_LIST_DELETION"
    this.payload = {
      sids: e
    }
  }
}
export class MeasurementSelectCommand extends Command {
  constructor(e: number) {
    super()
    this.id = "MEASUREMENT_SELECT"
    this.payload = {
      index: e
    }
  }
}
export class MeasurementsSetVisibilityCommand extends Command {
  constructor(t: boolean, ...e: string[]) {
    super()
    this.id = "MEASUREMENTS_SET_VISIBILITY"
    this.payload = { sids: e, visible: t }
  }
}
export class MeasureModeToggleCommand extends Command {
  /**
   *
   * @param e 打开/关闭时触发的事件
   * @param t 在活动状态下是否调暗，默认为与 e 相同
   * @param n 是否可编辑，默认为 true
   */
  constructor(e: boolean, t: boolean, n = !0) {
    super()
    this.id = "MEASURE_MODE_TOGGLE"
    this.payload = {
      on: e,
      dimWhileActive: void 0 !== t ? t : e,
      editable: n
    }
  }
}
export class MeasureStartCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "MEASURE_START"
  }
}
export class MeasureStopCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "MEASURE_STOP"
  }
}
