import * as s from "react"
import * as n from "react/jsx-runtime"
import * as d from "./36375"
import * as r from "./66102"
import * as l from "./84426"
import { SelectSearchResultCommand } from "../command/searchQuery.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
const { WORKSHOP: h, HIDE: u, SHOW: m } = PhraseKey
function p({ item: e, onToggle: t }) {
  const { commandBinder: i } = (0, s.useContext)(AppReactContext),
    o = (0, r.b)(),
    { enabled: p, id: g, typeId: v } = e,
    y = !e.isLayerVisible(),
    f = !p || y ? "eye-hide" : "eye-show",
    w = (0, d.k)(),
    b = y ? o.t(h.LAYERS.HIDDEN_LAYER_ITEM_TOOLTIP) : p ? o.t(u) : o.t(m)
  return (0, n.jsx)(l.zx, {
    icon: f,
    dimmed: !p,
    variant: l.Wu.TERTIARY,
    onClick: e => {
      e.stopPropagation(), y || (p && w === g && i.issueCommand(new SelectSearchResultCommand(null, v)), t(!p))
    },
    tooltip: b
  })
}
export const q = p
