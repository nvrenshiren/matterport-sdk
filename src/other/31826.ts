import a from "classnames"
import * as ss from "react"
import * as i from "react/jsx-runtime"

import * as o from "./14355"
import * as l from "./66102"
import * as u from "./84426"
import { CloseModalCommand, ConfirmBtnSelect, ConfirmModalCommand, ConfirmModalState, ToggleModalCommand } from "../command/ui.command"
import * as h from "../const/73536"
import { OpenDeferred } from "../core/deferred"
function m({ commandBinder: e }) {
  const [t, n] = (0, ss.useState)(!1),
    [r, m] = (0, ss.useState)(),
    [f, g] = (0, ss.useState)(),
    v = (0, l.b)(),
    y = (0, ss.useCallback)(
      async t => {
        null == r || r.resolve(t), n(!1), e.issueCommand(new CloseModalCommand())
      },
      [e, r]
    ),
    b = (0, ss.useCallback)(() => {
      y(ConfirmBtnSelect.CLOSE)
    }, [y]),
    E = (0, ss.useCallback)(() => {
      y(ConfirmBtnSelect.CONFIRM)
    }, [y]),
    S = (0, ss.useCallback)(
      async i => {
        switch (i.action) {
          case ConfirmModalState.DISPLAY:
            if (t) {
              if (!(null == f ? void 0 : f.cancellable)) return Promise.reject("Cannot close non-cancellable modal")
              await y(ConfirmBtnSelect.CLOSE)
            }
            n(!0), e.issueCommand(new ToggleModalCommand(h.P.CONFIRM, !0)), g(i.properties)
            const s = new OpenDeferred()
            return m(s), s.nativePromise()
          case ConfirmModalState.UPDATE:
            return g(i.properties), null == r ? void 0 : r.nativePromise()
          case ConfirmModalState.CLOSE:
            return t ? (y(ConfirmBtnSelect.CLOSE), null == r ? void 0 : r.nativePromise()) : Promise.reject("Cannot cancel a closed modal")
        }
      },
      [y, e, f, t, r]
    )
  ;(0, ss.useEffect)(
    () => (
      e.addBinding(ConfirmModalCommand, S),
      () => {
        e.removeBinding(ConfirmModalCommand, S)
      }
    ),
    [e, S]
  )
  const O = (0, ss.useCallback)(e => e.stopPropagation(), [])
  if (!f) return null
  const {
    title: T,
    titleLocalizationOptions: _,
    message: w,
    messageLocalizationOptions: A,
    confirmPhraseKey: N,
    cancelPhraseKey: I,
    closeButton: P,
    modalClass: x,
    confirmDisabled: k,
    cancelVariant: L
  } = f
  let C = T
  if ("string" == typeof T) {
    const e = void 0 === _ ? {} : _,
      t = v.t(T, e)
    C = (0, i.jsx)("span", {
      children: t
    })
  }
  let D = w
  if ("string" == typeof w) {
    const e = void 0 === A ? {} : A,
      t = v.t(w, e)
    D = (0, i.jsx)(
      "p",
      Object.assign(
        {
          className: "modal-message"
        },
        {
          children: t
        }
      )
    )
  }
  return (0, i.jsx)(
    o.N,
    Object.assign(
      {
        open: t,
        className: a("modal-background", "confirm-modal-background", {
          open: t
        }),
        onClick: O,
        onPointerDown: O,
        onPointerUp: O
      },
      {
        children: (0, i.jsxs)(
          u.Vq,
          Object.assign(
            {
              testId: "confirm-modal",
              className: a("confirm-modal", x),
              onClose: b
            },
            {
              children: [
                (0, i.jsxs)(
                  "header",
                  Object.assign(
                    {
                      className: "modal-header"
                    },
                    {
                      children: [
                        (0, i.jsx)(
                          "div",
                          Object.assign(
                            {
                              className: "modal-title"
                            },
                            {
                              children: C
                            }
                          )
                        ),
                        P &&
                          (0, i.jsx)(u.zx, {
                            icon: "close",
                            onClick: b
                          })
                      ]
                    }
                  )
                ),
                (0, i.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: "modal-body"
                    },
                    {
                      children: D
                    }
                  )
                ),
                (0, i.jsxs)(
                  u.hE,
                  Object.assign(
                    {
                      spacing: "small"
                    },
                    {
                      children: [
                        I &&
                          (0, i.jsx)(
                            u.zx,
                            Object.assign(
                              {
                                size: "large",
                                onClick: b,
                                variant: L || u.Wu.SECONDARY
                              },
                              {
                                children: v.t(I)
                              }
                            )
                          ),
                        N &&
                          (0, i.jsx)(
                            u.zx,
                            Object.assign(
                              {
                                disabled: k,
                                variant: u.Wu.PRIMARY,
                                size: "large",
                                onClick: E
                              },
                              {
                                children: v.t(N)
                              }
                            )
                          )
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
}
export const s = m
