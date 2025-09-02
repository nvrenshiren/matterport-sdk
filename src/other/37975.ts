import * as n from "react/jsx-runtime"
import * as s from "./32279"
import * as a from "./77230"
import * as o from "./66102"
function r({ dataTypeGroup: e }) {
  return e.groupActionsFC ? (0, n.jsx)(e.groupActionsFC, { group: e }) : null
}
import * as d from "./84426"
function c(e) {
  const { id: t, numItems: i, numSelected: c, selected: l, selectDisabled: h, selectMode: u, onSelect: m } = e,
    p = (0, s.b)(),
    g = (0, a.A)(),
    v = (0, o.b)(),
    y = p[t]
  if (!y) return null
  const f = (g && y.groupMatchingPhraseKey) || y.groupPhraseKey,
    w = f ? v.t(f) : t,
    b = u ? `(${c}/${i})` : `(${i})`
  return (0, n.jsx)(d._m, {
    id: t,
    title: w,
    decals: (0, n.jsx)("span", Object.assign({ className: "mp-list-item-text" }, { children: b })),
    actions: (0, n.jsx)(r, { dataTypeGroup: y }),
    selectMode: u,
    selectDisabled: h,
    selected: l,
    onSelect: m
  })
}
export const m = c
