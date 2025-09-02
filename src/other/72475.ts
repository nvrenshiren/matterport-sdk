import o from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import { AppReactContext } from "../context/app.context"
import * as c from "./63548"
import * as h from "./94639"
import { SetEmbedErrorIdCommand } from "../command/tag.command"
import { presentationMlsModeKey } from "../const/settings.const"
const u = ({ attachments: e, onClick: t }) => {
  const { settings: i, engine: a } = (0, s.useContext)(AppReactContext),
    u = (0, h.n)(),
    m = i.tryGetProperty(presentationMlsModeKey, !1)
  ;(0, s.useEffect)(() => {
    var t
    ;(null === (t = e[0]) || void 0 === t ? void 0 : t.parentId) !== u && a.commandBinder.issueCommand(new SetEmbedErrorIdCommand())
  }, [e])
  const p = (0, s.useCallback)(
      (i, n) => {
        0 !== e.length && (i.stopPropagation(), t(i, n))
      },
      [e, t]
    ),
    g = (0, s.useCallback)(t => {
      1 === e.length && a.commandBinder.issueCommand(new SetEmbedErrorIdCommand(t))
    }, [])
  return m || 0 === e.length
    ? null
    : (0, n.jsx)(
        "div",
        Object.assign({ className: o("tag-media", { "embed-error": !!u }) }, { children: (0, n.jsx)(c.T, { attachments: e, onClick: p, onError: g }) })
      )
}
export const v = u
