import a from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"

import * as c from "./66102"
import * as o from "./84151"
import * as d from "./84426"
import { PhraseKey } from "../const/phrase.const"
const { MODAL: u } = PhraseKey.WORKSHOP
function h({
  initialText: e,
  onSave: t,
  title: n,
  label: r,
  maxLength: l,
  onValidate: h,
  placeholder: p,
  fullModal: m,
  className: f,
  onCancel: g,
  children: v
}) {
  const y = (0, c.b)(),
    [b, E] = (0, s.useState)(e),
    [S, O] = (0, s.useState)(h(e)),
    T = () => {
      g()
    },
    _ = (0, s.useCallback)(async () => {
      t(b)
    }, [b, t]),
    w = (0, s.useCallback)(e => {
      E(e), O(h(e))
    }, []),
    A = y.t(u.SAVE),
    N = y.t(u.CANCEL)
  return (0, i.jsxs)(
    o.H,
    Object.assign(
      {
        open: !0,
        title: n,
        fullModal: m,
        className: a("text-input-popup", f),
        onClose: T
      },
      {
        children: [
          (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: "modal-body"
              },
              {
                children: [
                  (0, i.jsx)(d.oi, {
                    text: b,
                    label: r,
                    placeholder: p,
                    autofocus: !0,
                    maxLength: l,
                    onReturn: _,
                    onInput: w,
                    onCancel: T
                  }),
                  v
                ]
              }
            )
          ),
          (0, i.jsxs)(
            d.hE,
            Object.assign(
              {
                className: "modal-footer",
                spacing: "small"
              },
              {
                children: [
                  (0, i.jsx)(d.zx, {
                    label: N,
                    variant: d.Wu.SECONDARY,
                    size: d.qE.SMALL,
                    onClick: T
                  }),
                  (0, i.jsx)(d.zx, {
                    label: A,
                    variant: d.Wu.PRIMARY,
                    size: d.qE.SMALL,
                    onClick: _,
                    disabled: !S
                  })
                ]
              }
            )
          )
        ]
      }
    )
  )
}
export const x = h
