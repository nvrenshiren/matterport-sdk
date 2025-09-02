import r from "classnames"
import * as i from "react/jsx-runtime"

import * as c from "react"
import * as u from "./20334"
import * as v from "./27250"
import * as p from "./27525"
import * as g from "./66102"
import * as l from "./84426"
import * as m from "./94526"
import { PhraseKey } from "../const/phrase.const"
import { FloorControlsSwitch } from "../floorControlsSwitch"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { ViewModes } from "../utils/viewMode.utils"
function h(e) {
  return e ? e.getNavigableFloorIds().map(e.getViewData) : []
}
function y(e) {
  const t = (function () {
      const e = (0, u.I)(),
        [t, n] = (0, c.useState)(h(e))
      return (
        (0, c.useEffect)(() => {
          if (!e) return () => {}
          const t = () => n(h(e)),
            i = new AggregateSubscription(e.floors.onNameChange(t), e.onNavigableFloorIdsChanged(t))
          return t(), () => i.cancel()
        }, [e]),
        t
      )
    })(),
    n = (0, m.B)(),
    s = (0, p.m)(),
    y = (0, v.t)(),
    b = (0, g.b)(),
    E = t
      .map(e => {
        const { id: t, name: n } = e,
          r = (null == s ? void 0 : s.id) === t
        return (0, i.jsx)(
          FloorControlsSwitch,
          {
            id: t,
            name: n,
            active: r,
            theme: "light"
          },
          t
        )
      })
      .reverse()
  n !== ViewModes.Panorama &&
    y &&
    E.unshift(
      (0, i.jsx)(
        FloorControlsSwitch,
        {
          name: b.t(PhraseKey.FLOOR_ALL),
          active: !s,
          theme: "light"
        },
        "all"
      )
    )
  const S = r("floor-menu-selector", e.className),
    O = (null == s ? void 0 : s.name) || b.t(PhraseKey.FLOOR_ALL)
  return (0, i.jsx)(
    l.xz,
    Object.assign(
      {
        buttonClassName: S,
        variant: l.Wu.TERTIARY,
        label: O,
        ariaLabel: O,
        tooltip: O,
        theme: "overlay",
        menuClassName: "floor-controls-menu",
        menuPlacement: "top",
        caret: !0
      },
      {
        children: E
      }
    )
  )
}
export const O = y
