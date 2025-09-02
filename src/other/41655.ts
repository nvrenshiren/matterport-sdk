import * as s from "react"
import * as i from "react/jsx-runtime"
import { AppReactContext } from "../context/app.context"
import { KeyboardCode } from "../const/keyboard.const"
import { HandleTextBoxFocusMessage } from "../message/ui.message"
import { winCanTouch } from "../utils/browser.utils"
function c(e) {
  const t = (0, s.useContext)(AppReactContext),
    n = (0, s.useRef)(null),
    c = (0, s.useMemo)(() => winCanTouch(), []),
    [d, u] = (0, s.useState)(!1),
    [h, p] = (0, s.useState)(e.value)
  function m(e) {
    e.stopPropagation()
  }
  function f() {
    var e
    n.current && (null === (e = n.current) || void 0 === e || e.blur(), g())
  }
  function g() {
    n.current && (t.engine.broadcast(new HandleTextBoxFocusMessage(n.current, !1)), v())
  }
  function v() {
    if ((u(!1), e.onDone)) {
      const t = b(!0)
      e.onDone(t)
    }
  }
  function y(t, n) {
    const i = b(n)
    p(i), e.onChanged && e.onChanged(i)
  }
  function b(t) {
    if (!n.current) return h
    const i = n.current.value,
      s = "" === i ? h.toString() : i
    let r = Number(s.replace(/[^\d.-]/g, ""))
    return isNaN(r) || (e.validator && !e.validator(r))
      ? h
      : (t && (e.fixValue && (r = e.fixValue(r)), void 0 !== e.min && r < e.min ? (r = e.min) : void 0 !== e.max && r > e.max && (r = e.max)),
        r !== Number(s) && (n.current.value = r.toString()),
        "" === i ? i : r)
  }
  ;(0, s.useEffect)(
    () => () => {
      f()
    },
    []
  ),
    (0, s.useEffect)(() => {
      p(e.value)
    }, [e.value])
  const { label: E, units: S, min: O, max: T, step: _, className: w } = e,
    A = !c && d ? "number" : "text",
    N = d || !S ? h : `${h} ${S}`,
    I = `number-input ${w || ""}`,
    P = d ? "[0-9]*" : void 0
  return (0, i.jsxs)(
    "label",
    Object.assign(
      {
        className: I,
        onClick: function () {
          u(!0)
        }
      },
      {
        children: [
          E &&
            (0, i.jsx)(
              "span",
              Object.assign(
                {
                  className: "number-input-label"
                },
                {
                  children: E
                }
              )
            ),
          (0, i.jsx)("input", {
            className: "input",
            type: A,
            pattern: P,
            ref: n,
            onChange: y,
            onInput: y,
            onKeyPress: function (e) {
              e.stopPropagation()
              const t = e.which || e.keyCode
              ;("keydown" === e.type && t !== KeyboardCode.TAB) ||
                ((t !== KeyboardCode.RETURN && t !== KeyboardCode.TAB) || (e.shiftKey || (e.preventDefault(), f()), v()), y())
            },
            onKeyDown: m,
            onKeyUp: m,
            onBlur: function (e) {
              y(e, !0), g()
            },
            onFocus: function () {
              n.current && t.engine.broadcast(new HandleTextBoxFocusMessage(n.current, !0))
            },
            min: O,
            max: T,
            step: _,
            value: N
          })
        ]
      }
    )
  )
}

export const Y = c
