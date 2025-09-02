import v from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"
import * as E from "./10664"
import * as f from "./14355"
import * as r from "./38490"
import * as l from "./49627"
import * as u from "./51978"
import * as yy from "./66102"
import * as o from "../const/86876"
import * as c from "./94526"
import { DollhousePeekabooKey } from "../const/66777"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { StopAndClearStateMessage } from "../message/dollhouse.message"
import { winCanTouch } from "../utils/browser.utils"
import { ViewModes } from "../utils/viewMode.utils"
const S = {
    rotate: {
      desktop: {
        icon: [o.W.mouse.ctrlClick, o.W.mouse.dragRight],
        phrase: PhraseKey.SHOWCASE.DOLLHOUSE.ROTATE_PROMPT.DESKTOP
      },
      touch: {
        icon: [o.W.gesture.dragTwoFingerRotate],
        phrase: PhraseKey.SHOWCASE.HELP.TOUCH_DOLLHOUSE_ROTATE
      }
    },
    inside: {
      desktop: {
        icon: [o.W.mouse.clickInside],
        phrase: PhraseKey.SHOWCASE.DOLLHOUSE.INSIDE_PROMPT.DESKTOP
      },
      touch: {
        icon: [o.W.gesture.tapInside],
        phrase: PhraseKey.SHOWCASE.DOLLHOUSE.INSIDE_PROMPT.TOUCH
      }
    }
  },
  O = () => {
    const { messageBus: e } = (0, s.useContext)(AppReactContext),
      t = (0, u.y)(DollhousePeekabooKey, !1),
      n = (0, yy.b)(),
      o = winCanTouch(),
      [g, O] = (0, l._)("peekaboo_dh_prompt_dismissed", 0),
      [T, _] = (0, s.useState)(!1),
      [w, A] = (0, s.useState)(!1),
      [N, I] = (0, s.useState)(S.rotate),
      P = (0, c.B)(),
      x = (0, E.x)(),
      k = n.t(PhraseKey.SHOWCASE.DOLLHOUSE.ROTATE_PROMPT.OR),
      L = t && P === ViewModes.Dollhouse && !x && !T && g < 3
    ;(0, s.useEffect)(() => {
      let e
      return (
        L &&
          (I(S.rotate),
          (e = setTimeout(() => {
            A(!0)
          }, 1e4))),
        () => {
          e && clearTimeout(e)
        }
      )
    }, [L]),
      (0, s.useEffect)(() => {
        const t =
          L && N === S.rotate
            ? e.subscribe(StopAndClearStateMessage, () => {
                I(S.inside)
              })
            : null
        return () => {
          null == t || t.cancel()
        }
      }, [L, e, N])
    const C = (0, s.useCallback)(() => {
      O(g + 1), _(!0), A(!1)
    }, [g, O])
    ;(0, s.useEffect)(() => {
      !L && w && C()
    }, [L, w, C])
    const { icon: D, phrase: R } = N[o ? "touch" : "desktop"],
      M = D.length > 0 && D[0],
      j = D.length > 1 && D[1],
      U = (0, i.jsx)(
        "svg",
        Object.assign(
          {
            width: "2",
            height: "16",
            viewBox: "0 0 2 16",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
          },
          {
            children: (0, i.jsx)("path", {
              d: "M1 0L1 16",
              stroke: "white"
            })
          }
        )
      )
    return (0, i.jsxs)(
      f.N,
      Object.assign(
        {
          open: w,
          className: v("peekaboo-dh-prompt", !w && "unloading")
        },
        {
          children: [
            M &&
              (0, i.jsx)("img", {
                src: D[0],
                alt: "",
                height: o ? 26 : 50
              }),
            j &&
              (0, i.jsxs)(
                "div",
                Object.assign(
                  {
                    className: "separator"
                  },
                  {
                    children: [
                      U,
                      (0, i.jsx)("span", {
                        children: k
                      }),
                      U
                    ]
                  }
                )
              ),
            j &&
              (0, i.jsx)("img", {
                src: D[1],
                alt: "",
                height: o ? 26 : 50
              }),
            (0, i.jsx)(
              "span",
              Object.assign(
                {
                  className: "text"
                },
                {
                  children: n.t(R)
                }
              )
            ),
            (0, i.jsx)(r.P, {
              theme: "dark",
              onClose: C,
              tooltip: ""
            })
          ]
        }
      )
    )
  }
export const y = O
