import * as i from "react/jsx-runtime"
import * as c from "./33023"
import * as s from "./434"
import * as r from "./51978"
import * as o from "./66102"
import { ModelViewsFeatureKey } from "./76087"
import * as d from "./84426"
import { ToolPalette } from "../const/tools.const"
function u({ toolId: e }) {
  const t = (0, r.y)(ModelViewsFeatureKey, !1),
    n = (0, s.X)().length > 1,
    u = (0, c.Q)(e),
    h = (0, o.b)()
  if (!(t && u && u.allViewsPhraseKey && u.palette === ToolPalette.MODEL_BASED && n)) return null
  const p = h.t(u.allViewsPhraseKey)
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: "views-banner applies-to-all-views"
      },
      {
        children: (0, i.jsx)(d.jL, {
          title: p,
          layout: "horizontal"
        })
      }
    )
  )
}
export const z = u
