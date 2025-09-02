import * as i from "react"
import * as r from "./76253"
import { createObservableArray } from "../observable/observable.array"
const a = createObservableArray([])
function o() {
  const e = (0, r.o)()
  return (function (e) {
    const [t, n] = (0, i.useState)(e.values())
    return (
      (0, i.useEffect)(() => {
        const t = () => {
            n(e.values())
          },
          i = e.onChanged(t)
        return t(), () => i.cancel()
      }, [e]),
      t
    )
  })(e ? e.enabledTourStops : a)
}
function l() {
  return o().length
}

export const g = l
