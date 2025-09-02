import l from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"
import * as r from "./15501"
import * as d from "../const/73536"

import * as w from "./84151"
import * as u from "./84426"
import * as h from "./98813"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
const { MATTERTAGS: m } = PhraseKey.WORKSHOP
function p(e) {
  const { url: t, text: i, error: a, newLink: r } = e,
    { locale: d } = (0, s.useContext)(AppReactContext),
    c = "" === i && "" === t && r ? d.t(m.LINK_EDITOR_TIP_TEXT) : null,
    h = a ? d.t(m.LINK_EDITOR_INVALID_TIP) : null,
    u = l("modal-message", { "modal-message-error": !!a }),
    p = h || c || ""
  return (0, n.jsx)("div", Object.assign({ className: u }, { children: p }))
}
const { MATTERTAGS: g, MODAL: v } = PhraseKey.WORKSHOP
function y(e) {
  return (0, h.j)(e)
}
function f(e) {
  const { linkUrl: t, linkText: i, onSaveLink: a, onRemoveLink: r, onCancelLink: d } = e,
    { locale: c } = (0, s.useContext)(AppReactContext),
    [h, m] = (0, s.useState)(!1),
    [f, w] = (0, s.useState)(i),
    [b, T] = (0, s.useState)(t),
    [C, E] = (0, s.useState)(y(t))
  ;(0, s.useEffect)(() => (T(t), w(i), E(y(t)), m(!1), () => {}), [i, t])
  const D = (0, s.useCallback)(() => {
      C && window.open(b, "_blank", "noreferrer")
    }, [b, C]),
    x = (0, s.useCallback)(
      (e, t) => {
        const i = void 0 !== t ? t : b
        a((void 0 !== e ? e : f) || i, i)
      },
      [b, f, a]
    ),
    A = (0, s.useCallback)(() => {
      x(f, b)
    }, [f, b]),
    S = (0, s.useCallback)(
      (e, t) => {
        const i = y(e)
        E(i), m(!i && "" !== e), t && i && x(f, e)
      },
      [f, x]
    ),
    P = (0, s.useCallback)(e => {
      w(e)
    }, []),
    O = (0, s.useCallback)(
      e => {
        T(e)
        const t = y(e)
        E(t), h && t && m(!1)
      },
      [h]
    ),
    I = (0, s.useCallback)(() => {
      S(b, !1)
    }, [b, S]),
    k = (0, s.useCallback)(() => {
      S(b, !0)
    }, [b, S]),
    N = !t,
    M = c.t(g.LINK_EDITOR_TEXT_PLACEHOLDER),
    j = c.t(v.SAVE),
    R = c.t(v.CANCEL),
    L = c.t(g.LINK_EDITOR_PREVIEW_TIP),
    V = c.t(g.LINK_EDITOR_REMOVE_TIP),
    B = !N && r
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: "modal-contents" },
      {
        children: [
          (0, n.jsxs)(
            "div",
            Object.assign(
              { className: "modal-body" },
              {
                children: [
                  (0, n.jsx)(
                    "div",
                    Object.assign(
                      { className: "link-editor-field link-text-field" },
                      { children: (0, n.jsx)(u.oi, { text: f, placeholder: M, autofocus: !i, onInput: P, onCancel: d }) }
                    )
                  ),
                  (0, n.jsxs)(
                    "div",
                    Object.assign(
                      { className: "link-editor-field link-url-field" },
                      {
                        children: [
                          (0, n.jsx)(u.oi, {
                            text: b,
                            type: "url",
                            placeholder: "https://",
                            autofocus: !!i,
                            onBlur: I,
                            onReturn: k,
                            onInput: O,
                            onCancel: d
                          }),
                          C &&
                            b &&
                            (0, n.jsx)(u.zx, {
                              className: "preview-link",
                              icon: "ext-link",
                              variant: u.Wu.TERTIARY,
                              size: u.qE.SMALL,
                              tooltip: L,
                              onClick: D
                            })
                        ]
                      }
                    )
                  ),
                  (0, n.jsx)(p, { newLink: N, text: i, url: b, error: h })
                ]
              }
            )
          ),
          (0, n.jsx)(
            "div",
            Object.assign(
              { className: "modal-footer" },
              {
                children: (0, n.jsxs)(
                  u.hE,
                  Object.assign(
                    { className: l("modal-footer", { stretch: B }) },
                    {
                      children: [
                        B && (0, n.jsx)(u.zx, { icon: "delete", label: V, className: "remove-link", variant: u.Wu.TERTIARY, size: u.qE.SMALL, onClick: r }),
                        (0, n.jsxs)(
                          u.hE,
                          Object.assign(
                            { spacing: "small" },
                            {
                              children: [
                                (0, n.jsx)(u.zx, { label: R, variant: u.Wu.SECONDARY, size: u.qE.SMALL, onClick: d }),
                                (0, n.jsx)(u.zx, { label: j, variant: u.Wu.PRIMARY, disabled: !C, size: u.qE.SMALL, onClick: A })
                              ]
                            }
                          )
                        )
                      ]
                    }
                  )
                )
              }
            )
          )
        ]
      }
    )
  )
}
const { MATTERTAGS: b } = PhraseKey.WORKSHOP
function T(e) {
  const { linkUrl: t, linkText: i, onSaveLink: a, onRemoveLink: c, onCancelLink: l } = e,
    { locale: h } = (0, s.useContext)(AppReactContext),
    u = (0, r.R)(),
    m = "" === t ? h.t(b.LINK_EDITOR_LINK_ADD_LABEL) : h.t(b.LINK_EDITOR_LINK_EDIT_LABEL),
    p = u === d.P.LINK_EDITOR
  return (0, n.jsx)(
    w.H,
    Object.assign(
      { open: p, title: m, fullModal: !1, className: "link-editor-modal" },
      { children: (0, n.jsx)(f, { linkText: i, linkUrl: t, onCancelLink: l, onSaveLink: a, onRemoveLink: c }) }
    )
  )
}

export const I = T
