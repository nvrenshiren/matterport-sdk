import * as s from "react/jsx-runtime"
import * as n from "react"
import { AppReactContext } from "../context/app.context"
import * as a from "../const/54875"
import * as r from "./36893"
import * as h from "./96377"
import * as d from "./38242"
import * as l from "./77230"
import * as c from "./60543"
import * as u from "./84426"
import * as p from "./6608"
import * as m from "./44472"
const g = ({ item: t }) => {
  const { analytics: e } = (0, n.useContext)(AppReactContext),
    i = (0, r.l)(t.id),
    g = (0, l.A)(),
    f = (0, h.m)(),
    v = (0, d.e)()
  if (!i) return null
  const { id: w, textParser: y, title: b, description: D, icon: S } = t,
    I = w === f,
    P = i.info.type === a.T.FloorplanOnly ? "floorplan" : "dollhouse",
    T = g ? (0, c.vr)(b, g) : b,
    M = g ? (0, c.vr)(D, g) : D,
    E = (0, s.jsxs)(
      "div",
      Object.assign(
        { className: "item-details" },
        {
          children: [
            (0, s.jsxs)(
              "div",
              Object.assign(
                { className: "item-header" },
                {
                  children: [
                    (0, s.jsx)(m.S, { text: T || "", textParser: y, markers: c.PP }),
                    (0, s.jsx)("div", Object.assign({ className: "list-item-decal" }, { children: (0, s.jsx)(u.JO, { name: P }) }))
                  ]
                }
              )
            ),
            D && (0, s.jsx)("div", Object.assign({ className: "item-description" }, { children: (0, s.jsx)(m.S, { text: M, textParser: y, markers: c.PP }) }))
          ]
        }
      )
    )
  return (0, s.jsx)(
    u.HC,
    {
      id: w,
      className: "search-result-item",
      title: E,
      active: I,
      disabled: !t.enabled,
      onClick: async () => {
        e.trackGuiEvent("search_item_measurement_click", { tool: v }), t.onSelect()
      },
      badge: (0, s.jsx)(p.C, { iconClass: S })
    },
    w
  )
}

export const V = g
