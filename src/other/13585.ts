import * as o from "react"
import * as i from "react/jsx-runtime"
import * as p from "./31131"
import * as d from "./51978"
import * as r from "./66102"
import * as f from "./84426"
import * as a from "./89478"
import * as h from "./91418"
import * as u from "./98025"
import { PhraseKey } from "../const/phrase.const"
import { UserPreferencesKeys } from "../const/user.const"
import { AppReactContext } from "../context/app.context"
function m() {
  const { settings: e } = (0, o.useContext)(AppReactContext),
    t = (0, r.b)(),
    n = (0, d.y)(UserPreferencesKeys.MeasurementSnapping, !1),
    a = (0, d.y)(UserPreferencesKeys.MeasurementContinuousLines, !1),
    m = (0, o.useCallback)(() => {
      e.setLocalStorageProperty(UserPreferencesKeys.MeasurementSnapping, !n)
    }, [e, n]),
    f = (0, o.useCallback)(() => {
      e.setLocalStorageProperty(UserPreferencesKeys.MeasurementContinuousLines, !a)
    }, [e, a]),
    g = t.t(PhraseKey.MEASUREMENT_CONTINUOUS_LINES),
    v = t.t(PhraseKey.MEASUREMENT_SNAPPING)
  return (0, i.jsxs)(u.J, {
    children: [
      (0, i.jsx)(h.w, {
        label: v,
        onToggle: m,
        enabled: !0,
        onOffLabel: !0,
        toggled: n
      }),
      (0, i.jsx)(h.w, {
        label: g,
        onToggle: f,
        enabled: !0,
        onOffLabel: !0,
        toggled: a
      }),
      (0, i.jsx)(p.Q, {})
    ]
  })
}
function g({ onOpenPopup: e, overlay: t }) {
  const n = (0, r.b)().t(PhraseKey.MEASUREMENT_SETTINGS),
    o = t ? "overlay" : "light",
    l = t ? f.Wu.FAB : f.Wu.TERTIARY,
    c = t ? "bottom" : "bottom-end"
  return (0, i.jsx)(
    a.P,
    Object.assign(
      {
        icon: "settings",
        tooltip: n,
        theme: o,
        variant: l,
        tooltipPlacement: c,
        analytic: "measurements_settings_click",
        className: "measurement-settings",
        popupSize: "large",
        onOpenPopup: e
      },
      {
        children: (0, i.jsx)(m, {})
      }
    )
  )
}
export const B = g
