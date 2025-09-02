import r from "classnames"
import * as i from "react/jsx-runtime"

import * as u from "./30330"
import * as a from "./66102"
import * as c from "./84426"
import * as l from "./89478"
import { PhraseKey } from "../const/phrase.const"
function d({ analytic: e, children: t, className: n }) {
  const s = (0, a.b)().t(PhraseKey.REUSABLES.HELP_BUTTON_TOOLTIP_MESSAGE)
  return (0, i.jsx)(
    l.P,
    Object.assign(
      {
        icon: "help",
        tooltip: s,
        popupSize: "medium",
        analytic: `${e}_help_click`,
        className: r("help-button", n),
        variant: c.Wu.TERTIARY
      },
      {
        children: t
      }
    )
  )
}
function h({ tool: e }) {
  const { analytic: t, helpMessagePhraseKey: n } = e
  return n
    ? (0, i.jsx)(
        d,
        Object.assign(
          {
            analytic: t,
            className: "tool-help-button"
          },
          {
            children: (0, i.jsx)(u.B, {
              tool: e
            })
          }
        )
      )
    : null
}
export const w = h
