import { ScheduleProcessCommand } from "../command/schedule.command"
import { ScheduleTaskCommand } from "../command/schedule.command"
import { SchedulerSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { UndoBuffer } from "../webgl/undo.buffer"

declare global {
  interface SymbolModule {
    [SchedulerSymbol]: SchedulerModule
  }
}

class a {
  name: any
  taskDurations: UndoBuffer
  medianDuration: number

  constructor(e) {
    this.name = e
    this.taskDurations = new UndoBuffer(100)
    this.medianDuration = 1
  }

  get typicalStepDuration() {
    return this.medianDuration
  }

  addTaskDuration(e) {
    this.taskDurations.push(e)
    this.taskDurations.index % 10 == 0 && (this.medianDuration = this.taskDurations.median())
  }
}

var i = {
  DONE: "done",
  STARTED: "started",
  WAITING: "waiting"
}

class o {
  tasks: any[]
  types: any

  constructor() {
    this.tasks = []
    this.types = {}
  }

  getType(e) {
    if (!this.types[e]) {
      this.types[e] = new a(e)
    }
    return this.types[e]
  }

  addTask(e) {
    this.tasks.push(e)
  }

  update(e) {
    this.tasks = this.tasks.filter(e => e.status !== i.DONE)
    this.tasks.sort((e, t) => t.urgency - e.urgency)
    let t = 0
    eBudget: for (const n of this.tasks)
      for (; n.status !== i.DONE; ) {
        const time = performance.now(),
          s = t + n.type.typicalStepDuration > e,
          r = i >= n.deadline
        if (s && !r) break eBudget
        const a = time
        n.run()
        const o = performance.now() - a
        n.type.addTaskDuration(o)
        t += o
      }
  }
}

class d {
  type: any
  func: any
  deadline: any
  steps: any
  status: any
  promise: Promise<unknown>
  onSuccess: (value: unknown) => void
  onError: (reason?: any) => void

  constructor(e, t, n, s) {
    this.type = e
    this.func = t
    this.deadline = n
    this.steps = s
    this.status = i.WAITING
    this.promise = new Promise((e, t) => {
      this.onSuccess = e
      this.onError = t
    })
  }

  run() {
    let e
    this.status = i.STARTED
    try {
      e = this.func.next()
    } catch (e) {
      this.status = i.DONE
      return void this.onError(e)
    }
    this.steps -= 1
    e.done && ((this.status = i.DONE), this.onSuccess(e.value))
  }

  get estimatedDuration() {
    return this.steps * this.type.typicalStepDuration
  }

  get urgency() {
    const e = this.deadline - performance.now()
    return e <= 0 ? 1e6 - e : this.estimatedDuration / e / e
  }
}

export default class SchedulerModule extends Module {
  scheduler: o
  engine: EngineContext

  constructor() {
    super(...arguments)
    this.name = "scheduler-module"
    this.scheduler = new o()
  }

  async init(e, t: EngineContext) {
    this.engine = t
    this.engine.commandBinder.addBinding(ScheduleTaskCommand, async e => {
      const t = new d(this.scheduler.getType(e.type), e.func, performance.now() + e.maxDelay, e.steps)
      this.scheduler.addTask(t)
      return t
    })
    this.engine.commandBinder.addBinding(ScheduleProcessCommand, async e => {
      const t = new d(this.scheduler.getType(e.type), e.func, performance.now() + e.maxDelay, e.steps)
      this.scheduler.addTask(t)
      return t
    })
  }

  onUpdate(e) {
    this.scheduler.update(4)
  }
}
