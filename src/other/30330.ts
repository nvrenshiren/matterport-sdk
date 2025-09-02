import * as i from "react/jsx-runtime"
import * as r from "./66102"
import * as a from "./71215"
import { PhraseKey } from "../const/phrase.const"
const { EDIT_BAR: o } = PhraseKey.WORKSHOP
function l({ tool: e }) {
  const { helpHref: t, helpMessagePhraseKey: n } = e,
    s = (0, r.b)(),
    l = s.t(o.HELP_LINK)
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "tool-help"
      },
      {
        children: [
          n && s.t(n),
          t &&
            (0, i.jsx)(
              a.r,
              Object.assign(
                {
                  href: t
                },
                {
                  children: l
                }
              )
            )
        ]
      }
    )
  )
}
export const B = l
