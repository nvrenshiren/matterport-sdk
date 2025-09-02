import d from "classnames"
import * as l from "react"
import * as o from "react/jsx-runtime"

import { ContextType } from "react"
import * as u from "./38772"
import { AppReactContext } from "../context/app.context"
import { isIPad, isIPhone } from "../utils/browser.utils"

export enum ButtonState {
  ACTIVE = "active",
  BUSY = "busy",
  DECORATIVE = "decorative",
  DIMMED = "dimmed",
  DISABLED = "disabled",
  ENABLED = "enabled"
}
export enum ButtonSize {
  LARGE = 3,
  MINI = 1,
  SMALL = 2,
  STANDARD = 0
}
export enum IconButtonAttribute {
  CLEAR = "clear",
  OVERLAY = "overlay",
  PLAIN = "plain",
  PRIMARY = "primary",
  SOCIAL = "social",
  TOOLBAR = "toolbar"
}

@u.Z
export class SettingsLabel extends l.Component {
  onClick: (e: any) => void
  onMouseDown: (e: any) => void
  static iMobile = isIPhone() || isIPad()
  static contextType = AppReactContext
  declare context: ContextType<typeof AppReactContext>
  constructor(e) {
    super(e)
    this.onClick = e => {
      const t = this.props.buttonState
      t !== ButtonState.BUSY && t !== ButtonState.DISABLED && this.props.onClick && this.props.onClick(e)
    }
    this.onMouseDown = e => {
      const { onMouseDown: t, onClick: n, buttonState: r } = this.props
      if (t) t(e)
      else if (f.iMobile && n && r !== ButtonState.BUSY && r !== ButtonState.DISABLED) {
        const t = this.context.mainDiv.getRootNode().activeElement
        t && e.cancelable && (t.blur(), e.preventDefault())
      }
    }
  }
  render() {
    const {
        ariaLabel: e,
        breakoutTooltip: t,
        buttonSize: n,
        buttonState: i,
        buttonStyle: l,
        children: c,
        className: u,
        dataValue: h,
        iconClass: p,
        id: m,
        onClick: f,
        onMouseUp: g,
        tooltipMsg: v,
        tooltipPersist: y,
        tooltipPreformatted: b
      } = this.props,
      E = i === ButtonState.DISABLED,
      S = i === ButtonState.BUSY,
      O = i === ButtonState.DECORATIVE,
      T = !E && !S && !O,
      _ = v ? !!b : void 0,
      w = {
        "button-small": n === ButtonSize.SMALL,
        "button-large": n === ButtonSize.LARGE,
        "button-disabled": E,
        "button-dimmed": i === ButtonState.DIMMED,
        "button-active": i === ButtonState.ACTIVE,
        "button-busy": S,
        "button-interactive": T,
        "icon-button-primary": l === IconButtonAttribute.PRIMARY,
        "icon-button-overlay": l === IconButtonAttribute.OVERLAY,
        "icon-button-plain": l === IconButtonAttribute.PLAIN,
        "icon-button-social": l === IconButtonAttribute.SOCIAL,
        "icon-button-toolbar": l === IconButtonAttribute.TOOLBAR,
        "icon-button-breakout-tooltip": t
      },
      A = {
        id: m,
        role: "button",
        "aria-label": e || v,
        "aria-disabled": E,
        "data-value": h,
        className: d("icon-button", w, u),
        onClick: f ? this.onClick : void 0,
        onMouseUp: g,
        onMouseDown: this.onMouseDown
      },
      N = {
        "data-balloon-pre": _,
        "data-balloon-persist": y
      }
    return (
      t || Object.assign(A, N),
      (0, o.jsxs)(
        "div",
        Object.assign({}, A, {
          children: [
            t &&
              (0, o.jsx)(
                "div",
                Object.assign(
                  {
                    className: "icon-button-breakout-tooltip-container"
                  },
                  {
                    children: (0, o.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "icon-button-breakout-tooltip-trigger"
                        },
                        N
                      )
                    )
                  }
                )
              ),
            p &&
              (0, o.jsx)("span", {
                className: `icon ${p}`
              }),
            c
          ]
        })
      )
    )
  }
}
