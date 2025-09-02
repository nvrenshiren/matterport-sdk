import * as s from "react"
import * as i from "react/jsx-runtime"
import * as u from "./38242"
import * as d from "./56064"
import * as c from "./66102"
import * as h from "./95229"
import { PhraseKey } from "../const/phrase.const"
import { UserPreferencesKeys } from "../const/user.const"
import { AppReactContext } from "../context/app.context"
import { UnitTypeKey } from "../utils/unit.utils"
function p() {
  const { settings: e, analytics: t } = (0, s.useContext)(AppReactContext),
    n = (0, c.b)(),
    p = (0, d.O)(),
    m = (0, u.e)(),
    f = n => {
      n.stopPropagation()
      const i = p === UnitTypeKey.IMPERIAL ? UnitTypeKey.METRIC : UnitTypeKey.IMPERIAL
      t.trackGuiEvent(`units_click_${i}`, {
        tool: m
      }),
        e.setLocalStorageProperty(UserPreferencesKeys.UnitType, i)
    },
    g = n.t(PhraseKey.MEASUREMENT_UNITS),
    v = n.t(PhraseKey.MEASUREMENT_IMPERIAL),
    y = n.t(PhraseKey.MEASUREMENT_METRIC),
    b = p === UnitTypeKey.METRIC
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "settings-toggle units-setting"
      },
      {
        children: [
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "settings-label"
              },
              {
                children: g
              }
            )
          ),
          (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: "radio-group radio-buttons"
              },
              {
                children: [
                  (0, i.jsx)(
                    h.E,
                    Object.assign(
                      {
                        name: "unit",
                        value: UnitTypeKey.IMPERIAL,
                        id: "unit-imperial",
                        enabled: !0,
                        checked: !b,
                        onChange: f
                      },
                      {
                        children: v
                      }
                    )
                  ),
                  (0, i.jsx)(
                    h.E,
                    Object.assign(
                      {
                        name: "unit",
                        value: UnitTypeKey.METRIC,
                        id: "unit-metric",
                        enabled: !0,
                        checked: b,
                        onChange: f
                      },
                      {
                        children: y
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
export const Q = p
