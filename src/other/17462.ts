import r from "classnames"
import * as i from "react/jsx-runtime"

import * as o from "./66102"
import { PhraseKey } from "../const/phrase.const"
function l(e) {
  const { id: t, onToggle: n, labelledBy: s, className: l, onOffLabel: c = !1, enabled: d = !0, toggled: u, testId: h } = e,
    p = (0, o.b)(),
    m = p.t(PhraseKey.GENERIC.SETTING_ON),
    f = p.t(PhraseKey.GENERIC.SETTING_OFF),
    g = u ? m : f
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: r("reusable-toggle", l, {
          "toggle-on": u,
          "has-labels": c,
          enabled: d
        }),
        id: t,
        onClick: e => {
          e.stopPropagation(), d && n && n(e, !u)
        },
        role: "checkbox",
        "aria-checked": u,
        "aria-labelledby": s,
        "data-testid": h
      },
      {
        children: [
          c &&
            (0, i.jsx)(
              "span",
              Object.assign(
                {
                  className: "toggle-label"
                },
                {
                  children: g
                }
              )
            ),
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "track"
              },
              {
                children: (0, i.jsx)("div", {
                  className: "thumb"
                })
              }
            )
          )
        ]
      }
    )
  )
}
export const Z = l
