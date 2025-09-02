import * as n from "react/jsx-runtime"
import * as d from "./44472"
import * as o from "./60543"
import * as r from "./61092"
import * as a from "./66102"
import { PhraseKey } from "../const/phrase.const"
const { NOTES: c } = PhraseKey.SHOWCASE
function l({ userName: e, description: t, numAttachments: i, numComments: s, searchText: l }) {
  const h = (0, r.l)(),
    u = (0, a.b)(),
    m = s - 1,
    p = (l ? (0, o.vr)(e, l) : e).trim(),
    g = u.t(c.REPLIES, m)
  let v = ""
  return (
    "" === t ? (i > 0 ? (v = u.t(c.NUM_ATTACHMENTS, i)) : 0 === m && (v = u.t(c.CONTENT_DELETED))) : (v = (l ? (0, o.vr)(t, l) : t).trim()),
    (0, n.jsxs)(
      "div",
      Object.assign(
        { className: "item-details" },
        {
          children: [
            (0, n.jsxs)(
              "div",
              Object.assign(
                { className: "item-header" },
                {
                  children: [
                    h && (0, n.jsx)(d.S, { text: p.trim(), textParser: h, markers: o.PP }),
                    m > 0 && !l && (0, n.jsx)("span", Object.assign({ className: "note-summary-info note-replies" }, { children: g }))
                  ]
                }
              )
            ),
            h &&
              (0, n.jsx)(
                "div",
                Object.assign({ className: "item-description" }, { children: (0, n.jsx)(d.S, { text: v, textParser: h, markers: o.PP, linksActive: !1 }) })
              )
          ]
        }
      )
    )
  )
}
export const j = l
