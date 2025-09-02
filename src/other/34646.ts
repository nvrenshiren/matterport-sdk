import * as i from "./36964"
import * as r from "./76253"
import { TransitionObservable } from "../data/tour.data"
import { createObservableValue } from "../observable/observable.value"
const o = createObservableValue(TransitionObservable)
function l() {
  const e = (0, r.o)()
  return (0, i.y)(e ? e.transitionObservable : o)
}

export const s = l
