import * as n from "react/jsx-runtime"
import * as s from "./66102"
import * as a from "./84426"
function o(e) {
  const { id: t, numItems: i, numSelected: o, selected: r, selectMode: d, onSelect: c } = e,
    l = (0, s.b)().t(`SHOWCASE.NOTES.${t}`),
    h = d ? `(${o}/${i})` : `(${i})`
  return (0, n.jsx)(a._m, {
    id: t,
    title: l,
    decals: (0, n.jsx)("span", Object.assign({ className: "mp-list-item-text" }, { children: h })),
    selectMode: d,
    selected: r,
    onSelect: c
  })
}
export const c = o
