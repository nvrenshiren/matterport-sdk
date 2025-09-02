import * as s from "react"
import * as n from "react/jsx-runtime"
import * as a from "./38772"
import * as o from "./84426"
import { KeyboardCode } from "../const/keyboard.const"
import { AppReactContext } from "../context/app.context"

@a.Z
class l extends s.Component {
  constructor() {
    super(...arguments),
      (this.onKey = async e => {
        if (this.props.disabled) return
        switch (e.keyCode) {
          case KeyboardCode.COMMA:
            this.onGotoPrev()
            break
          case KeyboardCode.PERIOD:
            this.onGotoNext()
        }
      }),
      (this.onGotoNext = () => {
        const e = this.getNextIndex()
        ;-1 !== e && this.props.onNavigate(e)
      }),
      (this.onGotoPrev = () => {
        const e = this.getPrevIndex()
        ;-1 !== e && this.props.onNavigate(e)
      })
  }
  componentDidMount() {
    this.context.mainDiv.getRootNode().addEventListener("keydown", this.onKey, { capture: !0 })
  }
  componentWillUnmount() {
    this.context.mainDiv.getRootNode().removeEventListener("keydown", this.onKey, { capture: !0 })
  }
  getNextIndex() {
    const { total: e, index: t, wrapAround: i } = this.props
    return t + 1 < e ? t + 1 : i ? 0 : -1
  }
  getPrevIndex() {
    const { total: e, index: t, wrapAround: i } = this.props
    return t > 0 ? t - 1 : i ? e - 1 : -1
  }
  render() {
    const { total: e, index: t, disabled: i, overlay: s } = this.props
    if (e < 2 || -1 === t) return null
    const a = s ? "dark" : "light",
      r = s ? void 0 : o.qE.LARGE,
      d = `${t + 1} of ${e}`
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: "list-nav" },
        {
          children: [
            (0, n.jsx)(o.zx, { icon: "dpad-left", variant: o.Wu.TERTIARY, size: r, disabled: i, theme: a, onClick: this.onGotoPrev }),
            (0, n.jsx)("span", Object.assign({ className: "list-nav-label" }, { children: d })),
            (0, n.jsx)(o.zx, { icon: "dpad-right", variant: o.Wu.TERTIARY, size: r, disabled: i, theme: a, onClick: this.onGotoNext })
          ]
        }
      )
    )
  }
}
l.contextType = AppReactContext

export const $ = l
