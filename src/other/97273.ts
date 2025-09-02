import o from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import * as b from "./15130"
import * as A from "./19280"
import * as I from "./32279"
import * as y from "./37034"
import * as f from "./37190"
import * as h from "./40216"
import * as S from "./44523"
import * as x from "./47397"
import * as u from "./51588"
import * as m from "./66102"
import * as v from "./77230"
import * as C from "./84426"
import { SearchFilterToggleCommand, UpdateSearchQueryCommand } from "../command/searchQuery.command"
import { CloseCurrentToolCommand, ToolPanelToggleCollapseCommand } from "../command/tool.command"
import * as g from "../const/25071"
import { PhraseKey } from "../const/phrase.const"
import { socialSharingKey } from "../const/settings.const"
import { ToolPanelLayout } from "../const/tools.const"
import { AppReactContext } from "../context/app.context"
import { winCanTouch } from "../utils/browser.utils"
import * as T from "../utils/url.utils"
function D(e) {
  const { query: t, keywordFilters: i, typeFilters: a } = e,
    { locale: o, analytics: c, editMode: l, settings: h } = (0, s.useContext)(AppReactContext),
    [u, m] = (0, s.useState)(!1),
    p = l || h.tryGetProperty(socialSharingKey, !1),
    g = (0, s.useCallback)(() => {
      const e = (0, T.Uo)(t, i, a)
      ;(0, b.v)(e), m(!0)
      const n = l ? "workshop_gui" : "JMYDCase_gui"
      c.track(n, { gui_action: "space_search_share_link_clicked" })
    }, [t, i, a, l, c])
  return (
    (0, s.useEffect)(() => {
      if (!u) return () => {}
      const e = window.setTimeout(() => m(!1), 2500)
      return () => window.clearTimeout(e)
    }, [u]),
    p
      ? u
        ? (0, n.jsx)("span", Object.assign({ className: "link-copied" }, { children: o.t(PhraseKey.SHARE_COPIED) }))
        : (0, n.jsx)(C.zx, { onClick: g, icon: "share", variant: C.Wu.TERTIARY, tooltip: o.t(PhraseKey.COPY_URL) })
      : null
  )
}
const { SEARCH: P } = PhraseKey.SHOWCASE
function O({ filter: e, readOnly: t, shareEnabled: i }) {
  const { commandBinder: a } = (0, s.useContext)(AppReactContext),
    d = (0, s.useRef)(null),
    b = (0, s.useRef)(null),
    T = (0, m.b)(),
    E = (0, h.T)(),
    O = (0, u.E)(),
    I = (0, v.A)(),
    k = (0, y.f)(),
    N = (0, f.b)(),
    M = (0, s.useMemo)(() => winCanTouch(), []),
    j = E === ToolPanelLayout.BOTTOM_PANEL && O,
    R = (0, A.p)((0, S.O)()),
    L = (0, s.useCallback)(
      e => {
        a.issueCommand(new UpdateSearchQueryCommand(e))
      },
      [a]
    ),
    V = T.t(P.SEARCH_IN_TOOL_PLACEHOLDER),
    B = T.t(P.CLEAR_SEARCH).toLocaleUpperCase(),
    F = k.length > 0 || N.length > 0 || "" !== I,
    _ = i && F,
    H = M ? void 0 : g.El
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { ref: b, className: o("list-search", "search-panel-header") },
      {
        children: [
          (0, n.jsxs)(
            "div",
            Object.assign(
              { className: "search-bar" },
              {
                children: [
                  (0, n.jsx)("span", { className: o("search-header-icon", "icon", "icon-magnifying-glass", { "search-header-icon-active": F }) }),
                  (0, n.jsx)(x.Z, {
                    text: I,
                    onInput: L,
                    onDone: e => {
                      j && e && a.issueCommand(new ToolPanelToggleCollapseCommand(!1))
                    },
                    onCancel: () => {
                      a.issueCommand(new CloseCurrentToolCommand())
                    },
                    placeholder: V,
                    onFocus: () => {
                      R &&
                        j &&
                        M &&
                        (a.issueCommand(new ToolPanelToggleCollapseCommand(!1)),
                        window.setTimeout(() => {
                          b.current && b.current.scrollIntoView({ behavior: "smooth", block: "start" })
                        }, g.El))
                    },
                    ref: d,
                    focusOnMount: H,
                    readOnly: t
                  }),
                  (0, n.jsxs)(
                    "div",
                    Object.assign(
                      { className: "search-header-button-container" },
                      {
                        children: [
                          "" !== I &&
                            (0, n.jsx)(C.zx, {
                              onClick: () => {
                                L(""), d.current && !M && d.current.focus()
                              },
                              label: B,
                              size: C.qE.SMALL,
                              variant: C.Wu.TERTIARY
                            }),
                          _ && (0, n.jsx)(D, { query: I, keywordFilters: k, typeFilters: N })
                        ]
                      }
                    )
                  )
                ]
              }
            )
          ),
          e
        ]
      }
    )
  )
}
const { SEARCH: k } = PhraseKey.SHOWCASE
function N({ id: e, label: t }) {
  const { commandBinder: i } = (0, s.useContext)(AppReactContext),
    a = (0, m.b)().t(k.FILTER_SEARCH_REMOVE)
  return (0, n.jsx)(C.zx, {
    icon: "close",
    label: t,
    tooltip: a,
    tooltipOptions: { placement: "bottom" },
    size: C.qE.SMALL,
    variant: C.Wu.FAB,
    theme: "dark",
    onClick: () => {
      i.issueCommand(new SearchFilterToggleCommand(e, !1))
    },
    reverse: !0
  })
}
function M() {
  const e = (0, m.b)(),
    t = (0, I.b)(),
    i = (0, f.b)()
  if (0 === i.length) return null
  const s = []
  return (
    i.forEach(i => {
      const a = t[i]
      if (a) {
        const t = e.t(a.groupPhraseKey)
        s.push((0, n.jsx)(N, { id: i, label: t }, i))
      }
    }),
    (0, n.jsx)("div", Object.assign({ className: "search-filter-pills" }, { children: s }))
  )
}
function j(e) {
  const { shareEnabled: t = !1, filterPills: i = !1, filter: s } = e
  return (0, n.jsxs)(
    "div",
    Object.assign({ className: "list-subheaders" }, { children: [(0, n.jsx)(O, { filter: s, shareEnabled: t }), i && (0, n.jsx)(M, {})] })
  )
}
export const B = j
