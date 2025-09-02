import * as i from "react/jsx-runtime"
import * as f from "./1358"
import * as l from "./1522"
import { useAnalytics } from "./19564"
import * as o from "./43108"
import * as m from "./51978"
import * as c from "./66102"
import { hasPolicySpacesElements } from "../utils/71570"
import * as h from "./84426"
import * as d from "./94859"
import { ToggleOptionCommand } from "../command/player.command"
import { PhraseKey } from "../const/phrase.const"
import { BtnText } from "../data/player.options.data"
function g() {
  const e = (0, l.r)(),
    t = (0, c.b)(),
    n = useAnalytics(),
    g = (0, d.O)(),
    v = (0, f.S)(),
    y = (0, m.y)(BtnText.Labels, !1) && (null == e ? void 0 : e.getCount()),
    b = (0, m.y)(BtnText.RoomBounds, !1) && (null == v ? void 0 : v.hasRooms()),
    E = y && b,
    S = (0, o.Y)(
      ToggleOptionCommand,
      () => (
        n.trackToolGuiEvent("settings", "click_settings_labels_from_banner"),
        [
          {
            key: BtnText.Labels,
            value: !1
          }
        ]
      )
    )
  return g && hasPolicySpacesElements(g) && E
    ? (0, i.jsx)(
        "div",
        Object.assign(
          {
            className: "views-banner"
          },
          {
            children: (0, i.jsx)(
              h.jL,
              Object.assign(
                {
                  className: "rb-conflict-banner",
                  title: t.t(PhraseKey.WORKSHOP.LABELS.BOTH_LABELS_AND_RB_ENABLED),
                  layout: "vertical"
                },
                {
                  children: (0, i.jsx)(h.zx, {
                    label: t.t(PhraseKey.WORKSHOP.LABELS.TURN_OFF_LABELS),
                    variant: h.Wu.PRIMARY,
                    theme: "dark",
                    onClick: S
                  })
                }
              )
            )
          }
        )
      )
    : null
}
export const b = g
