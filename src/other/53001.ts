import * as n from "react/jsx-runtime"
import * as s from "./15501"
import * as a from "./96403"
import * as o from "./31457"
import * as rr from "../const/48945"
import * as d from "./51978"
function c() {
  const e = (0, s.R)(),
    t = (0, a.B)(),
    i = (0, d.y)(rr.ek, "1")
  return e || t || !i
    ? null
    : (0, n.jsx)(
        "div",
        Object.assign(
          { className: "overlay grid-overlay tags-overlay" },
          { children: (0, n.jsx)(o.O, { overlay: !0, analyticAction: "tags_navigate_in_canvas" }) }
        )
      )
}
export const r = c
