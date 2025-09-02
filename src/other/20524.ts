import r from "classnames"
import * as i from "react/jsx-runtime"

import * as a from "react"
import * as g from "./20334"
import * as E from "./27250"
import * as h from "./27525"
import * as m from "./36964"
import * as l from "./38490"
import * as y from "./40577"
import * as u from "./59581"
import { MovetoFloorCommand } from "../command/floors.command"
import { AppReactContext } from "../context/app.context"
import { AppStatus } from "../data/app.data"
import { ObservableValue } from "../observable/observable.value"
import { AnimationProgress } from "../webgl/animation.progress"
const v = new ObservableValue({
  from: null,
  to: null,
  progress: new AnimationProgress(0),
  promise: Promise.resolve()
})
function b() {
  const e = (function () {
    const e = (0, g.I)()
    return (0, m.y)(e ? e.transitionObservable : v)
  })()
  return (0, y.q)((null == e ? void 0 : e.to) || null)
}
function S(e) {
  const { commandBinder: t } = (0, a.useContext)(AppReactContext),
    n = (0, u.W)(),
    s = (function () {
      const e = (0, h.m)(),
        t = b(),
        [n, i] = (0, a.useState)(e ? e.name : "")
      return (0, a.useEffect)(() => (e ? i(e.name) : t && i(t.name), () => {}), [e, t]), n
    })(),
    p = (0, E.t)(),
    m = (0, a.useCallback)(() => {
      t.issueCommand(new MovetoFloorCommand(null, !1))
    }, [t])
  if (n !== AppStatus.PLAYING) return null
  const f = r("floor-container", e.className)
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: f
      },
      {
        children: [
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "floor-title h4"
              },
              {
                children: s || ""
              }
            )
          ),
          p &&
            (0, i.jsx)(l.P, {
              theme: "dark",
              onClose: m,
              tooltip: ""
            })
        ]
      }
    )
  )
}
export const Q = S
