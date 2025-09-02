import * as n from "react"
import * as s from "react/jsx-runtime"
import * as r from "./32279"
import * as d from "./37190"
import * as m from "./38242"
import * as w from "./38490"
import * as c from "../const/49571"
import * as g from "./5383"
import * as o from "./66102"
import * as h from "./84426"
import { SearchFilterClearCommand, SearchFilterToggleCommand } from "../command/searchQuery.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
function p({ id: t, icon: e, label: i, selected: a }) {
  const { commandBinder: o, analytics: r } = (0, n.useContext)(AppReactContext),
    d = (0, m.e)()
  return (0, s.jsx)(g.e, {
    id: t,
    icon: e,
    label: i,
    selected: a,
    onToggled: e => {
      e.stopPropagation(),
        "ALL" === t ? a || o.issueCommand(new SearchFilterClearCommand()) : o.issueCommand(new SearchFilterToggleCommand(t, !a)),
        a || r.trackGuiEvent(`items_filter_by_${t.toLowerCase()}`, { tool: d })
    }
  })
}

const { SEARCH: b } = PhraseKey.SHOWCASE
function S() {
  const t = (0, o.b)(),
    e = Object.values((0, r.b)()),
    i = (0, d.b)(),
    a = 0 === i.length,
    l = (0, n.useRef)(null),
    m = e
      .sort((t, e) => (t.groupOrder || c.Xs) - (e.groupOrder || c.Xs))
      .map(e => {
        const { id: n, groupIcon: o, groupPhraseKey: r } = e,
          d = t.t(r),
          c = !a && i.includes(n)
        return (0, s.jsx)(p, { id: n, icon: o, label: d, selected: c }, n)
      }),
    u = t.t(b.FILTER_SEARCH),
    g = t.t(b.FILTER_SEARCH_ALL)
  return (0, s.jsx)(
    "div",
    Object.assign(
      { className: "search-filter", onClick: t => t.stopPropagation() },
      {
        children: (0, s.jsxs)(
          h.xz,
          Object.assign(
            { ariaLabel: t.t(b.FILTER_SEARCH_LABEL), ref: l, icon: "filter", variant: h.Wu.TERTIARY, size: h.qE.SMALL, menuClassName: "search-filter-menu" },
            {
              children: [
                (0, s.jsxs)(
                  "div",
                  Object.assign(
                    { className: "search-filter-menu-header" },
                    {
                      children: [
                        (0, s.jsx)("div", { children: u }),
                        (0, s.jsx)(w.P, {
                          onClose: () => {
                            l.current && l.current.closeMenu()
                          }
                        })
                      ]
                    }
                  )
                ),
                (0, s.jsx)(p, { id: "ALL", icon: "fullscreen", label: g, selected: a }),
                m
              ]
            }
          )
        )
      }
    )
  )
}
export const a = S
