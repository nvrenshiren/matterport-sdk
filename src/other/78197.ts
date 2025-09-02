import o from "classnames"
import * as ss from "react"
import * as n from "react/jsx-runtime"

import { AppReactContext } from "../context/app.context"
import * as r from "./84426"
import { UpdateSearchQueryKeywordsCommand } from "../command/searchQuery.command"
import { ToggleToolCommand } from "../command/tool.command"
import { ToolsList } from "../const/tools.const"
const u = ({ keywords: e, className: t, maxVisible: i = 2, theme: a }) => {
  const { engine: u, editMode: m } = (0, ss.useContext)(AppReactContext),
    p = (0, ss.useCallback)(
      ({ text: e }, t) => {
        t.stopPropagation()
        const i = m ? ToolsList.LAYERS : ToolsList.SEARCH
        u.commandBinder.issueCommand(new ToggleToolCommand(i, !0)), u.commandBinder.issueCommand(new UpdateSearchQueryKeywordsCommand([e]))
      },
      [u, m]
    )
  return (0, n.jsx)(r.no, {
    className: o("tag-keywords", t),
    tokens: e.map(e => ({ id: e, text: e })),
    onTokenClick: p,
    maxVisibleTruncated: i,
    tokenSize: "small",
    tokenTheme: a
  })
}
export const s = u
