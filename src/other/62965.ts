import * as s from "react/jsx-runtime"
import * as n from "./77230"
import * as a from "./60543"
import * as o from "./44472"
function r({ item: t }) {
  const { textParser: e, title: i, description: r } = t,
    d = (0, n.A)()
  let c = i
  c && (c = (0, a.vr)(c, d))
  let h = r
  return (
    h && (h = (0, a.zf)(h, d)),
    (0, s.jsxs)(
      "div",
      Object.assign(
        { className: "item-details" },
        {
          children: [
            (0, s.jsx)("div", Object.assign({ className: "item-header" }, { children: (0, s.jsx)(o.S, { text: c || "", textParser: e, markers: a.PP }) })),
            e &&
              (0, s.jsx)(
                "div",
                Object.assign({ className: "item-description" }, { children: (0, s.jsx)(o.S, { text: h || "", textParser: e, markers: a.PP }) })
              )
          ]
        }
      )
    )
  )
}
export const j = r
