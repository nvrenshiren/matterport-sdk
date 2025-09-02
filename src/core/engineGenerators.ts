import { EngineTickState } from "../const/engineTick.const"

export enum GeneratorsProcess {
  Duration = 1,
  None = 0,
  Phase = 2,
  Promise = 3
}
class EngineGeneratorResult {
  type: GeneratorsProcess
  constructor(e) {
    this.type = e
  }
}
export class NullGeneratorResult extends EngineGeneratorResult {
  constructor() {
    super(GeneratorsProcess.None)
  }
}
class WaitDurationGeneratorResult extends EngineGeneratorResult {
  duration: number
  startTime: number
  constructor(e) {
    super(GeneratorsProcess.Duration), (this.duration = e), (this.startTime = Date.now())
  }
}
class WaitForPhaseGeneratorResult extends EngineGeneratorResult {
  phase: number
  constructor(e) {
    super(GeneratorsProcess.Phase), (this.phase = e)
  }
}
enum GeneratorsState {
  Fulfilled = 1,
  Pending = 0,
  Rejected = 2
}
export class WaitForPromiseGeneratorResult extends EngineGeneratorResult {
  promise: Promise<any>
  promiseState: GeneratorsState
  constructor(e: Promise<any>) {
    super(GeneratorsProcess.Promise),
      (this.promise = e),
      (this.promiseState = GeneratorsState.Pending),
      e
        .then(() => {
          this.promiseState = GeneratorsState.Fulfilled
        })
        .catch(() => {
          this.promiseState = GeneratorsState.Rejected
        })
  }
}
class EngineGenerator {
  generator: () => Generator
  started: boolean
  iterator: Generator
  currentResult: any
  constructor(e: () => Generator, t = !0) {
    ;(this.generator = e), t && this.start()
  }
  start() {
    this.started || (this.iterator = this.generator()), (this.started = !0)
  }
  iterate() {
    const e = this.iterator.next()
    ;(this.currentResult = e.value), e.done && (this.started = !1)
  }
}
export class EngineGenerators {
  generators: EngineGenerator[]
  constructor() {
    this.generators = []
  }
  startGenerator(e: () => Generator) {
    let t = this.generators.length
    for (let n = 0; n < this.generators.length; n++) {
      this.generators[n].generator === e && (t = n)
    }
    this.generators[t] = new EngineGenerator(e)
  }
  stopGenerator(e: () => Generator) {
    for (const t of this.generators) t.generator === e && (t.started = !1)
  }
  processGenerators(e: GeneratorsProcess, t?: EngineTickState) {
    for (const n of this.generators) {
      if (n.started) {
        switch (e) {
          case GeneratorsProcess.None:
            ;(!n.currentResult || n.currentResult instanceof NullGeneratorResult) && n.iterate()
            break
          case GeneratorsProcess.Phase:
            if (n.currentResult instanceof WaitForPhaseGeneratorResult) {
              const e = n.currentResult
              void 0 !== t && e.phase === t && n.iterate()
            }
            break
          case GeneratorsProcess.Promise:
            if (n.currentResult instanceof WaitForPromiseGeneratorResult) {
              n.currentResult.promiseState === GeneratorsState.Fulfilled && n.iterate()
            }
            break
          case GeneratorsProcess.Duration:
            if (n.currentResult instanceof WaitDurationGeneratorResult) {
              const e = n.currentResult
              Date.now() - e.startTime >= e.duration && n.iterate()
            }
        }
      }
    }
  }
}
