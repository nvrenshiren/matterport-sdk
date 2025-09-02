import * as n from "react/jsx-runtime"
import * as s from "./66102"
import * as o from "./84426"
import { PhraseKey } from "../const/phrase.const"
function r({ id: e, icon: t, label: i, selected: r, onToggled: d }) {
  const c = (0, s.b)()
  return (0, n.jsx)(
    o.zx,
    Object.assign(
      {
        icon: t,
        label: i,
        ariaLabel: r ? c.t(PhraseKey.SHOWCASE.SEARCH.FILTER_SEARCH_SELECTED) : i,
        size: o.qE.SMALL,
        variant: o.Wu.TERTIARY,
        onClick: d,
        appendChildren: !1
      },
      { children: (0, n.jsx)("div", Object.assign({ className: "search-filter-selected" }, { children: r && (0, n.jsx)(o.JO, { name: "checkmark" }) })) }
    ),
    e
  )
}
export const e = r
