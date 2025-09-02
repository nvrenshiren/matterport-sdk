import * as s from "react"
import * as n from "react/jsx-runtime"
import * as u from "./38242"
import * as r from "./51978"
import { AnnotationGrouping } from "../const/63319"
import * as d from "./66102"
import * as c from "./73085"
import { DataLayersFeatureKey } from "./76087"
import * as g from "./84426"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { SearchData } from "../data/search.data"
const h = (0, c.M)(SearchData, "searchMode", !1)
const { SEARCH: v } = PhraseKey.SHOWCASE
function y({ phraseKeys: e = {}, grouping: t, onGroupBy: i }) {
  const s = (0, d.b)(),
    a = (0, r.y)(DataLayersFeatureKey, !1),
    o = h(),
    c = [AnnotationGrouping.DATE, AnnotationGrouping.FLOOR]
  "boolean" == typeof o && c.unshift(AnnotationGrouping.TYPE), a && c.push(AnnotationGrouping.LAYER)
  const l = s.t(w(t, !0, e))
  return (0, n.jsx)(
    g.xz,
    Object.assign(
      { className: "grouping-sort-menu-button", ariaLabel: l, variant: g.Wu.TERTIARY, label: l, caret: !0 },
      { children: c.map(t => (0, n.jsx)(f, { onGroupBy: i, grouping: t, phraseKeys: e }, t)) }
    )
  )
}
function f({ grouping: e, onGroupBy: t, phraseKeys: i = {} }) {
  const { analytics: o } = (0, s.useContext)(AppReactContext),
    r = (0, d.b)().t(w(e, !1, i)),
    c = (0, u.e)()
  return (0, n.jsx)(
    g.zx,
    {
      label: r,
      size: g.qE.SMALL,
      variant: g.Wu.TERTIARY,
      onClick: () => {
        t(e), o.trackGuiEvent(`items_group_by_${e}`, { tool: c })
      }
    },
    e
  )
}
function w(e, t, i) {
  var n, s, a, o, r, d, c, l, h, u
  switch (e) {
    case AnnotationGrouping.TYPE:
      return t
        ? (null === (n = i[AnnotationGrouping.TYPE]) || void 0 === n ? void 0 : n.selectedTextKey) || v.GROUP_TYPE_SELECTED
        : (null === (s = i[AnnotationGrouping.TYPE]) || void 0 === s ? void 0 : s.textKey) || v.GROUP_TYPE
    case AnnotationGrouping.FLOOR:
      return t
        ? (null === (a = i[AnnotationGrouping.FLOOR]) || void 0 === a ? void 0 : a.selectedTextKey) || v.GROUP_FLOOR_SELECTED
        : (null === (o = i[AnnotationGrouping.FLOOR]) || void 0 === o ? void 0 : o.textKey) || v.GROUP_FLOOR
    case AnnotationGrouping.ROOM:
      return t
        ? (null === (r = i[AnnotationGrouping.ROOM]) || void 0 === r ? void 0 : r.selectedTextKey) || v.GROUP_ROOM_SELECTED
        : (null === (d = i[AnnotationGrouping.ROOM]) || void 0 === d ? void 0 : d.textKey) || v.GROUP_ROOM
    case AnnotationGrouping.LAYER:
      return t
        ? (null === (c = i[AnnotationGrouping.LAYER]) || void 0 === c ? void 0 : c.selectedTextKey) || v.GROUP_LAYER_SELECTED
        : (null === (l = i[AnnotationGrouping.LAYER]) || void 0 === l ? void 0 : l.textKey) || v.GROUP_LAYER
    case AnnotationGrouping.DATE:
    default:
      return t
        ? (null === (h = i[AnnotationGrouping.DATE]) || void 0 === h ? void 0 : h.selectedTextKey) || v.GROUP_DATE_SELECTED
        : (null === (u = i[AnnotationGrouping.DATE]) || void 0 === u ? void 0 : u.textKey) || v.GROUP_DATE
  }
}
export const $ = y
