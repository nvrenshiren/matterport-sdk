import * as s from "react"
import * as n from "react/jsx-runtime"
import * as d from "./27839"
import * as u from "./31981"
import * as l from "./44158"
import * as r from "./56509"
import * as h from "./71330"
import * as p from "./75043"
import * as m from "./85535"
import { TagOpenCommand } from "../command/tag.command"
import { TransitionTypeList } from "../const/64918"
import { AppReactContext } from "../context/app.context"
function g(e) {
  const { overlay: t, analyticAction: i } = e,
    { analytics: g, commandBinder: v, editMode: y } = (0, s.useContext)(AppReactContext),
    f = (0, r.Y)(),
    w = (0, l.k)(!0),
    b = (0, h.P)(),
    T = (0, d._)(),
    C = (0, u.w)(),
    [E, D] = (0, s.useState)(!1),
    x = y || !T ? w : w.filter(e => T.layerToggled(e.layerId) && (!C || C.getCapabilities(e.id).focus))
  if (!(b && x.length > 1)) return null
  const A = x.findIndex(e => e.id === (null == b ? void 0 : b.id))
  if (-1 === A) return null
  const S = (0, n.jsx)(m.$, {
    index: A,
    total: x.length,
    disabled: E,
    overlay: t,
    wrapAround: !0,
    onNavigate: e => {
      const t = x[e]
      if (!t) return
      D(!0)
      const n = b ? (f ? TransitionTypeList.Instant : TransitionTypeList.FadeToBlack) : TransitionTypeList.Interpolate
      g.trackToolGuiEvent("tags", i),
        v.issueCommand(new TagOpenCommand(t.id, { transition: n })).then(() => {
          D(!1)
        })
    }
  })
  return t ? (0, n.jsx)(p.u, Object.assign({ className: "tags-navigation-overlay" }, { children: S })) : S
}
export const O = g
