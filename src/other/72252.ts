import a from "classnames"
import * as n from "react/jsx-runtime"

import * as c from "./74795"
import * as o from "./7688"
import * as d from "./96238"
import { AnnotationType } from "../const/annotationType.const"
function l(e) {
  const { inline: t, canDelete: i, attachments: s, annotationType: l, nonViewable: h, children: u, parentId: m, onViewAttachment: p } = e,
    g = (0, o.fo)(),
    v = (0, o.eB)(),
    y = (e, t) => {
      p && p(t)
    },
    f = e => (m !== e.parentId ? null : (0, n.jsx)(c.G, { id: e.id, fileName: e.file.name, className: "inline", progress: e.progress, error: e.error }, e.id)),
    w = l === AnnotationType.NOTE
  return (0, n.jsxs)(
    "div",
    Object.assign(
      {
        className: a("annotation-attachments", {
          "annotation-attachments-inline": !!t,
          "annotation-attachments-preview": !h,
          "annotation-attachments-list": h
        })
      },
      {
        children: [
          s.map((e, a) => {
            const o = s.length,
              r = !t && !h && (1 === o || (0 === a && o > 2))
            let c, l
            return (
              w && (t ? ((c = 60), (l = 60)) : r || ((c = 140), (l = 140))),
              (0, n.jsx)(d.P, { attachment: e, inline: !!t, canDelete: !!i, hero: r, onClick: y, thumbnail: !!t || !r, width: c, height: l }, e.id)
            )
          }),
          g && g.map(f),
          v && v.map(f),
          u
        ]
      }
    )
  )
}
export const s = l
