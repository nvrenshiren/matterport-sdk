import * as n from "react/jsx-runtime"
import * as c from "./15258"
import * as r from "./20334"
import * as m from "./37975"
import { PhraseKey } from "../const/phrase.const"
import { AnnotationGrouping } from "../const/63319"
import * as d from "./65796"
import * as a from "./66102"
import * as h from "./84426"
import * as p from "./86130"
import * as l from "./86191"
function u({ id: e, numItems: t }) {
  const i = (0, c.K)(),
    s = (0, l.W)(e, i)
  return (0, n.jsx)(h._m, {
    id: e,
    title: s,
    className: "layers-group-header",
    decals: (0, n.jsx)("span", Object.assign({ className: "mp-list-item-text" }, { children: `(${t})` }))
  })
}
const g = ({ group: e }) => {
  const { id: t, items: i, grouping: s } = e
  switch (s) {
    case AnnotationGrouping.TYPE:
      return (0, n.jsx)(m.m, { id: t, numItems: i.length })
    case AnnotationGrouping.FLOOR:
      return (0, n.jsx)(vv, { id: t, numItems: i.length })
    case AnnotationGrouping.ROOM:
      return (0, n.jsx)(y, { id: t, numItems: i.length })
    case AnnotationGrouping.DATE:
      return (0, n.jsx)(p.c, { id: t, numItems: i.length })
    case AnnotationGrouping.LAYER:
      return (0, n.jsx)(u, { id: t, numItems: i.length })
  }
}
function vv({ id: e, numItems: t }) {
  const i = (0, r.I)()
  let o = (0, a.b)().t(PhraseKey.FLOOR_ALL)
  return (
    i && e && (o = i.getFloorName(e)),
    (0, n.jsx)(h._m, { id: e, title: o, decals: (0, n.jsx)("span", Object.assign({ className: "mp-list-item-text" }, { children: `(${t})` })) })
  )
}
function y({ id: e, numItems: t }) {
  const i = (0, d.g)(e)
  return (0, n.jsx)(h._m, { id: e, title: i, decals: (0, n.jsx)("span", Object.assign({ className: "mp-list-item-text" }, { children: `(${t})` })) })
}
export const v = g
