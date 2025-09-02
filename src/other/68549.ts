import r from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"
import * as a from "./38772"

@a.Z
class u extends s.Component {
  constructor(e) {
    super(e),
      (this.clickColor = e => {
        const t = e.currentTarget
        if (t && t.dataset) {
          const i = t.dataset.value
          i && (e.stopPropagation(), this.props.onColorPicked(i), this.setState({ activeColor: i }))
        }
      }),
      (this.renderColorSwatch = e => {
        const { activeColor: t } = this.state,
          i = { backgroundColor: e },
          s = r({ "color-swatch": !0, "icon-checkmark": !0, active: e === t })
        return (0, n.jsx)("div", { className: s, style: i, "data-value": e, onClick: this.clickColor }, e)
      }),
      (this.state = { activeColor: e.defaultColor || "" })
  }
  UNSAFE_componentWillReceiveProps(e) {
    e.defaultColor && !this.state.activeColor && this.setState({ activeColor: e.defaultColor })
  }
  render() {
    const { colors: e } = this.props
    return (0, n.jsx)("div", Object.assign({ className: "color-picker" }, { children: e.map(e => this.renderColorSwatch(e)) }))
  }
}

import * as p from "./38490"
import * as m from "./54975"
import { UpdatePinCommand } from "../command/pin.command"
import { PhraseKey } from "../const/phrase.const"
import { ToolPanelLayout } from "../const/tools.const"
import { AppReactContext } from "../context/app.context"

const { PINS: y } = PhraseKey.WORKSHOP
@a.Z
class f extends s.Component {
  constructor(e) {
    super(e),
      (this.closePinAssetEditor = () => {
        this.props.onClose()
      }),
      (this.handleColorPicked = e => {
        this.context.analytics.trackGuiEvent("pin_change_color"), this.props.onSave({ color: e })
      }),
      (this.saveStemEnabled = e => {
        this.context.analytics.trackGuiEvent(e ? "pin_show_stem" : "pin_hide_stem"), this.props.onSave({ stemEnabled: e })
      }),
      (this.saveStemLength = e => {
        this.context.analytics.trackGuiEvent("pin_change_stem_height"), this.props.onSave({ stemLength: e })
      }),
      (this.previewStemLength = e => {
        const { id: t, pinType: i } = this.props
        this.context.commandBinder.issueCommand(new UpdatePinCommand(t, i, { stemLength: e }))
      }),
      (this.stopPropagation = e => {
        e.stopPropagation()
      })
  }
  renderStemEditor() {
    const { pin: e } = this.props
    return (0, n.jsx)(m.r, {
      stemLength: e.stemLength,
      stemEnabled: e.stemEnabled,
      onLengthUpdate: this.previewStemLength,
      onLengthChanged: this.saveStemLength,
      onStemEnabledChanged: this.saveStemEnabled
    })
  }
  render() {
    const { toolPanelLayout: e, open: t, pin: i, colors: s } = this.props,
      a = e === ToolPanelLayout.BOTTOM_PANEL
    if (!t && !a) return null
    const o = this.context.locale.t(y.COLOR_STEM_EDITOR_TITLE)
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: r("pin-tool-editor", { "tool-popup": !a, open: a && t }), onClick: this.stopPropagation },
        {
          children: [
            (0, n.jsxs)(
              "div",
              Object.assign(
                { className: "tool-editor-title" },
                { children: [(0, n.jsx)("span", { children: o }), (0, n.jsx)(p.P, { theme: "dark", tooltip: "", onClose: this.closePinAssetEditor })] }
              )
            ),
            (0, n.jsx)(u, { colors: s, defaultColor: i.color, onColorPicked: this.handleColorPicked }),
            this.renderStemEditor()
          ]
        }
      )
    )
  }
}
f.contextType = AppReactContext

export const q = f
