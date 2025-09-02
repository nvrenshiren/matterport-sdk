import * as s from "react"
import * as i from "react/jsx-runtime"
import * as l from "./20334"
import * as o from "./66102"
import * as u from "./67243"
import * as d from "./84426"
import { RenameFloorCommand } from "../command/floors.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
const { RENAME_HEADER_OPTION_CTA: h } = PhraseKey.WORKSHOP.ACCORDION
function p(e) {
  const { id: t, numItems: n, numSelected: p, selected: m, selectMode: f, onSelect: g } = e,
    [v, y] = (0, s.useState)(!1),
    { commandBinder: b } = (0, s.useContext)(AppReactContext),
    E = (0, l.I)(),
    S = (0, o.b)()
  if (!E) return null
  const O = (0, i.jsx)(
    d.xz,
    Object.assign(
      {
        icon: "more-vert",
        ariaLabel: S.t(PhraseKey.MORE_OPTIONS),
        variant: d.Wu.TERTIARY,
        menuArrow: !0,
        menuClassName: "search-group-menu"
      },
      {
        children: (0, i.jsx)(d.zx, {
          label: S.t(h),
          variant: d.Wu.TERTIARY,
          size: d.qE.SMALL,
          onClick: () => {
            y(!0)
          }
        })
      }
    )
  )
  let T
  try {
    T = E.getFloorName(t)
  } catch (e) {
    return null
  }
  const _ = v
      ? (0, i.jsx)(u.Z, {
          editing: !0,
          className: "inline-text-input",
          text: T,
          closeOnFocusOut: !0,
          onEdited: e => {
            v && (b.issueCommand(new RenameFloorCommand(t, e)), y(!1))
          },
          maxLength: 24,
          showUnderline: !0,
          onCancelEditing: () => {
            y(!1)
          }
        })
      : T,
    w = f ? `(${p}/${n})` : `(${n})`,
    A = v
      ? void 0
      : (0, i.jsx)(
          "span",
          Object.assign(
            {
              className: "mp-list-item-text"
            },
            {
              children: w
            }
          )
        )
  return (0, i.jsx)(d._m, {
    id: t,
    title: _,
    decals: A,
    actions: O,
    className: "floor-group-header",
    selectMode: f,
    selected: m,
    onSelect: g
  })
}
export const J = p
