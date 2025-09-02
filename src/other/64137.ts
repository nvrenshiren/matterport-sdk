import a from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"

import * as g from "./27250"
import * as y from "./59084"
import * as u from "./66102"
import * as f from "./84426"
import * as h from "./94526"
import { ViewModeCommand } from "../command/viewmode.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { FloorsViewData } from "../data/floors.view.data"
import { FloorControlsSwitch } from "../floorControlsSwitch"
import { ViewModes } from "../utils/viewMode.utils"
function v(e) {
  const { currentFloor: t, floors: n } = e,
    r = (0, u.b)(),
    { analytics: o } = (0, s.useContext)(AppReactContext),
    c = (0, h.B)(),
    v = (0, g.t)(),
    y = c !== ViewModes.Panorama && v,
    b = (0, s.useCallback)(() => {
      o.trackGuiEvent("floor_controls")
    }, [o]),
    E = t && t.index + 1,
    S = r.t(PhraseKey.HELP_MORE_FLOORS_A),
    O = a("floor-controls", {
      "two-digit": void 0 !== E && E >= 10
    }),
    T = E ? "floor-controls" : "floor-controls-all",
    _ = n.map(e => {
      const { id: n, name: s } = e,
        r = (null == t ? void 0 : t.id) === n
      return (0, i.jsx)(
        FloorControlsSwitch,
        {
          id: n,
          name: s,
          active: r
        },
        n
      )
    })
  return (
    y &&
      _.push(
        (0, i.jsx)(
          FloorControlsSwitch,
          {
            name: r.t(PhraseKey.FLOOR_ALL),
            active: !t
          },
          "all"
        )
      ),
    _.reverse(),
    (0, i.jsx)(
      f.xz,
      Object.assign(
        {
          buttonClassName: O,
          buttonDataAttribute: E,
          onClick: b,
          variant: f.Wu.TERTIARY,
          ariaLabel: S,
          tooltip: S,
          icon: T,
          theme: "overlay",
          menuClassName: "floor-controls-menu",
          menuTheme: "dark",
          menuPlacement: "top"
        },
        {
          children: _
        }
      )
    )
  )
}
class b extends s.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.isUnmounting = !1),
      (this.onCurrentFloorChanged = () => {
        var e, t
        const n = (null === (e = this.floorsViewData) || void 0 === e ? void 0 : e.currentFloor) || void 0,
          i = n && (null === (t = this.floorsViewData) || void 0 === t ? void 0 : t.getViewData(n.id))
        this.setState({
          currentFloor: i
        })
      }),
      (this.onFloorsChanged = () => {
        var e, t
        const n = (null === (e = this.floorsViewData) || void 0 === e ? void 0 : e.getNavigableFloorIds()).map(
          null === (t = this.floorsViewData) || void 0 === t ? void 0 : t.getViewData
        )
        this.setState({
          floors: n
        })
      }),
      (this.state = {
        currentFloorIndicator: !0,
        floors: []
      })
  }
  componentDidMount() {
    const { market: e } = this.context
    e &&
      e.waitForData(FloorsViewData).then(e => {
        this.isUnmounting ||
          ((this.floorsViewData = e),
          this.bindings.push(
            this.floorsViewData.makeFloorChangeSubscription(this.onCurrentFloorChanged),
            this.floorsViewData.floors.onNameChange(this.onFloorsChanged),
            this.floorsViewData.onNavigableFloorIdsChanged(this.onFloorsChanged)
          ),
          this.onCurrentFloorChanged(),
          this.onFloorsChanged())
      })
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0),
      this.bindings.forEach(e => {
        e.cancel()
      })
  }
  render() {
    const { className: e, viewmode: t, iconStyle: n } = this.props,
      { currentFloor: s, floors: r } = this.state
    return r.length > 1 && t !== ViewModeCommand.OUTSIDE
      ? (0, i.jsxs)(
          "div",
          Object.assign(
            {
              className: a("floor-selector", e)
            },
            {
              children: [
                n &&
                  (0, i.jsx)(v, {
                    floors: r,
                    currentFloor: s
                  }),
                !n &&
                  (0, i.jsx)("span", {
                    className: "divider"
                  }),
                !n && (0, i.jsx)(y.O, {})
              ]
            }
          )
        )
      : null
  }
}
b.contextType = AppReactContext
export const d = b
