import d from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"
import * as a from "./38772"

import { KeyboardCode } from "../const/keyboard.const"
import { AppReactContext } from "../context/app.context"
import { HandleTextBoxFocusMessage } from "../message/ui.message"

@a.Z
class u extends s.Component {
  constructor(e) {
    super(e),
      (this.focusTimeout = 0),
      (this.onInput = e => {
        if (this.props.onInput) {
          const t = e.target
          this.props.onInput(t.value)
        }
      }),
      (this.onKeyPress = e => {
        e.stopPropagation()
        const { allowTabbing: t } = this.props,
          i = e.which || e.keyCode,
          n = [KeyboardCode.TAB, KeyboardCode.RETURN, KeyboardCode.ESCAPE]
        if ("keydown" === e.type && !n.includes(i)) return !1
        const s = e.target
        switch ((this.props.maxLength && s.value.length > this.props.maxLength && e.preventDefault(), i)) {
          case KeyboardCode.ESCAPE:
            this.props.onCancel && this.props.onCancel()
            break
          case KeyboardCode.TAB:
          case KeyboardCode.RETURN:
            this.props.onBlur || e.shiftKey || ((i === KeyboardCode.TAB && t) || e.preventDefault(), this.blur())
        }
        return !1
      }),
      (this.stopPropagation = e => e.stopPropagation()),
      (this.onFocus = e => {
        this.context.messageBus.broadcast(new HandleTextBoxFocusMessage(this.input, !0)), this.props.onFocus && this.props.onFocus(e)
      }),
      (this.onBlur = e => {
        this.context.messageBus.broadcast(new HandleTextBoxFocusMessage(this.input, !1))
        const t = e.target.value,
          { onBlur: i, onDone: n } = this.props
        i ? i(t) : n && n(t)
      }),
      (this.setRef = e => (this.input = e)),
      (this.state = { currentText: e.text })
  }
  componentWillUnmount() {
    window.clearTimeout(this.focusTimeout), this.input && this.input.blur()
  }
  componentDidMount() {
    const { focusOnMount: e, readOnly: t } = this.props
    t ||
      (0 === e
        ? this.focus()
        : void 0 !== e &&
          (this.focusTimeout = window.setTimeout(() => {
            this.focus()
          }, e)))
  }
  UNSAFE_componentWillReceiveProps(e) {
    e.text !== this.props.text && this.setState({ currentText: e.text })
  }
  getText() {
    return this.input ? this.input.value : ""
  }
  focus() {
    this.input.focus()
  }
  blur() {
    this.input.blur()
  }
  scrollIntoView(e) {
    this.input.scrollIntoView(e)
  }
  render() {
    const { placeholder: e, tabIndex: t, maxLength: i, type: s, className: a, readOnly: o, disabled: r } = this.props,
      { currentText: c } = this.state
    return (0, n.jsx)(
      "div",
      Object.assign(
        { className: d("text-field", a) },
        {
          children: (0, n.jsx)("input", {
            ref: this.setRef,
            className: "text-input-box",
            type: s || "text",
            value: c,
            placeholder: e,
            "aria-label": e,
            maxLength: i,
            onInput: this.onInput,
            onKeyPress: this.onKeyPress,
            onKeyDown: this.onKeyPress,
            onKeyUp: this.stopPropagation,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            tabIndex: t,
            readOnly: o,
            disabled: !!r
          })
        }
      )
    )
  }
}
u.contextType = AppReactContext

export const Z = u
