import * as s from "react/jsx-runtime"
import * as n from "./84426"
import * as a from "./43108"
import * as o from "react"
import * as r from "./66102"
import * as d from "./36676"
const c = (t, e) => Number(e.isSelected) - Number(t.isSelected) || t.text.localeCompare(e.text),
  h = { fixtures: "KEYWORDS_FIXTURES" }
function l() {
  const t = (0, r.b)(),
    e = (function () {
      const t = (0, d.s)(),
        [e, i] = (0, o.useState)((null == t ? void 0 : t.getKeywordSummaries()) || [])
      return (
        (0, o.useEffect)(() => {
          if (!t) return () => {}
          function e() {
            t && i(t.getKeywordSummaries())
          }
          const s = t.keywordCounts.onChanged(e),
            n = t.keywordFilters.onChanged(e)
          return (
            e(),
            () => {
              s.cancel(), n.cancel()
            }
          )
        }, [t]),
        e
      )
    })()
  return (0, o.useMemo)(() => e.map(e => Object.assign(Object.assign({}, e), { text: h[e.id] ? t.t(h[e.id]) : e.text })).sort(c), [e, t])
}
const u = () => {
  const t = l(),
    e = (0, a.Y)(ToggleSearchQueryKeywordCommand, t => [t.id])
  return (0, s.jsx)(n.no, { className: "search-keyword-summary", tokens: t, onTokenClick: e, maxVisibleTruncated: 5, allowSelect: !0 })
}
import * as g from "./77543"
import * as p from "../utils/scroll.utils"
import * as w from "../const/tools.const"
import { ToolPanelLayout } from "../const/tools.const"
import * as b from "./51588"
import * as S from "./40216"
import * as D from "./15501"
import { ToggleSearchQueryKeywordCommand } from "../command/searchQuery.command"
function v() {
  const t = (0, b.E)(),
    e = (0, S.T)(),
    i = e === ToolPanelLayout.NARROW || e === ToolPanelLayout.BOTTOM_PANEL,
    n = !t && e === ToolPanelLayout.BOTTOM_PANEL
  return (0, D.R)() && n
    ? null
    : (0, s.jsx)(
        "div",
        Object.assign(
          { className: "search-tool-overlay" },
          { children: i ? (0, s.jsx)(g.Z, Object.assign({ direction: p.Nm.horizontal }, { children: (0, s.jsx)(u, {}) })) : (0, s.jsx)(u, {}) }
        )
      )
}
export const F = v
