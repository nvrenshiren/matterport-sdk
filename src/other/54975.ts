import * as s from "react"
import * as n from "react/jsx-runtime"
import * as c from "./26340"
import * as o from "./56064"
import * as h from "./66102"
import * as d from "./69491"
import * as rr from "../const/78283"
import { setStemHeight } from "../const/78283"
import { PhraseKey } from "../const/phrase.const"
import { UnitTypeKey } from "../utils/unit.utils"
var u = PhraseKey.WORKSHOP.MATTERTAGS
function m(e) {
  const { stemEnabled: t, stemLength: i, onLengthUpdate: l, onLengthChanged: m, onStemEnabledChanged: p, variant: g, disabled: v, tabIndex: y } = e,
    f = (0, s.useRef)(null),
    w = (0, o.O)(),
    b = (0, h.b)()
  ;(0, s.useEffect)(() => {
    f.current && f.current.setValue((0, rr.zy)(i))
  }, [i])
  const T = b.t(u.SHOW_STEM_LABEL)
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: "stem-editor", onClick: e => e.stopPropagation() },
      {
        children: [
          (0, n.jsx)(
            "div",
            Object.assign(
              { className: "stem-slider" },
              {
                children: (0, n.jsx)(d.S, {
                  ref: f,
                  discrete: !1,
                  min: 0.1,
                  max: 9,
                  initialValue: (0, rr.zy)(i),
                  onChange: (e, t = !0) => {
                    const i = t ? setStemHeight(e) : e
                    m(i)
                  },
                  onInput: (e, t = !0) => {
                    const n = t ? setStemHeight(e) : e
                    n !== i && l(n)
                  },
                  displayBounds: !0,
                  width: 150,
                  formatNumbers: e => {
                    if (w === UnitTypeKey.IMPERIAL)
                      return (e => {
                        let t = ""
                        t += Math.floor(e) + "'"
                        const i = Math.floor((e % 1) * 12)
                        return i < 10 && (t += "0"), (t += i + "''"), t
                      })(e)
                    return `${Math.round(100 * setStemHeight(e)) / 100}m`
                  },
                  tooltipPosition: d.h.DOWN,
                  variant: g,
                  disabled: v,
                  tabIndex: y
                })
              }
            )
          ),
          (0, n.jsx)(c.X, {
            enabled: !0,
            checked: t,
            label: T,
            onChange: e => {
              const t = e.classList.contains("checked")
              p(t)
            }
          })
        ]
      }
    )
  )
}
export const r = m
