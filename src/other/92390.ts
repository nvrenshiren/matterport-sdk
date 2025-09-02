import a from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"

import * as m from "./15258"
import * as g from "./16326"
import * as v from "./46108"
import * as d from "./51978"
import * as y from "./60770"
import * as c from "./66102"
import { DataLayersFeatureKey } from "./76087"
import * as b from "./84426"
import * as f from "./86191"
import * as p from "./90055"
import { LayerSelectCommand } from "../command/layers.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
var E = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const { LAYERS: S } = PhraseKey.WORKSHOP,
  O = (0, s.forwardRef)((e, t) => {
    var { allowLayerChange: n, onChangeLayer: r } = e,
      l = E(e, ["allowLayerChange", "onChangeLayer"])
    const O = (0, s.useRef)(null),
      T = (0, s.useRef)(null),
      _ = (0, d.y)(DataLayersFeatureKey, !1),
      { editMode: w, commandBinder: A } = (0, s.useContext)(AppReactContext),
      N = (0, p.LP)(),
      I = (0, m.K)(),
      P = (0, f.W)(null == N ? void 0 : N.id, I),
      x = (0, g.Y)(),
      k = (0, p.LP)(),
      L = (0, c.b)()
    ;(0, s.useImperativeHandle)(
      t,
      () => ({
        dismissNudge: () => {
          O.current && O.current.dismissNudge()
        }
      }),
      []
    )
    const C = (0, i.jsx)(
      y.H,
      Object.assign(
        {
          ref: O
        },
        l
      )
    )
    if (!_ || !w || x.length < 2) return C
    const D = e => {
        e !== (null == N ? void 0 : N.id) && (A.issueCommand(new LayerSelectCommand(e, !0)), r && r(e))
      },
      R = N ? P : L.t(S.UNLAYERED_LAYER_LABEL),
      M = (0, i.jsxs)(i.Fragment, {
        children: [
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "button-menu-label"
              },
              {
                children: L.t(S.LAYER_ADDING_TO_LABEL)
              }
            )
          ),
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "active-layer-name"
              },
              {
                children: R
              }
            )
          )
        ]
      }),
      j = (0, i.jsxs)(i.Fragment, {
        children: [
          (0, i.jsx)(
            "span",
            Object.assign(
              {
                className: "menu-title",
                onClick: e => e.stopPropagation()
              },
              {
                children: L.t(S.LAYER_ADDING_TO_CHOICE_LABEL)
              }
            )
          ),
          (0, i.jsx)(b.zx, {
            icon: "close",
            variant: b.Wu.TERTIARY,
            size: b.qE.SMALL,
            onClick: () => {
              T.current && T.current.closeMenu()
            }
          })
        ]
      })
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: a("layered-add-button", {
            "with-layer-menu": n
          })
        },
        {
          children: [
            C,
            (0, i.jsxs)(
              b.xz,
              Object.assign(
                {
                  ref: T,
                  label: M,
                  className: "add-menu-button",
                  menuClassName: "add-button-layer-menu",
                  menuPlacement: "top",
                  variant: b.Wu.FAB,
                  size: b.qE.SMALL,
                  theme: "dark",
                  caret: !0
                },
                {
                  children: [
                    j,
                    x.map(e => {
                      const { id: t } = e,
                        n = (null == k ? void 0 : k.id) === t
                      return (0, i.jsx)(
                        v.H,
                        {
                          layer: e,
                          onClick: D,
                          active: n
                        },
                        t
                      )
                    })
                  ]
                }
              )
            )
          ]
        }
      )
    )
  })
export const W = O
