import { Command } from "../core/command"
export class ScheduleProcessCommand extends Command {
  constructor(e: string, t: Generator<undefined, void, unknown>, n: number, i = 1) {
    super()
    this.id = "SCHEDULE_PROCESS_COMMAND"
    this.payload = {
      type: e,
      func: t,
      maxDelay: n,
      steps: i
    }
  }
}
export class ScheduleTaskCommand extends Command {
  payload: {
    type: string
    func: any
    maxDelay: number
    steps: number
  }
  constructor(type: string, t: any, maxDelay: number) {
    super()
    this.id = "SCHEDULE_TASK_COMMAND"
    const i = (function* () {
      return t()
    })()
    this.payload = {
      type,
      func: i,
      maxDelay,
      steps: 1
    }
  }
}
