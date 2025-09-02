import * as s from "react"
import * as i from "react/jsx-runtime"
import * as a from "./other/84426"
import { MovetoFloorCommand } from "./command/floors.command"
import { TourStopCommand } from "./command/tour.command"
import { AppReactContext } from "./context/app.context"
import { DebugInfo } from "./core/debug"
const FloorControlsSwitchFloor = new DebugInfo("floor-controls-switch-floor")
export function FloorControlsSwitch({ name: e, id: t, active: n, theme: o = "dark" }) {
  const u = (0, s.useContext)(AppReactContext),
    { analytics: h } = u,
    p = (0, s.useCallback)(async () => {
      h.trackGuiEvent("floor_clicked"),
        (async function (e, t) {
          const { analytics: n, commandBinder: i } = t
          try {
            await i.issueCommand(new TourStopCommand())
            const t = null === e ? "click_toggle_all_floors_button" : "click_floor_select_button"
            n.trackGuiEvent(t)
            const s = new MovetoFloorCommand(e)
            await i.issueCommand(s)
          } catch (e) {
            FloorControlsSwitchFloor.debug(e)
          }
        })(t || null, u)
    }, [h, t])
  return (0, i.jsx)(a.zx, {
    className: "floor-button",
    label: e,
    variant: a.Wu.TERTIARY,
    size: a.qE.SMALL,
    theme: o,
    onClick: p,
    active: n
  })
}
