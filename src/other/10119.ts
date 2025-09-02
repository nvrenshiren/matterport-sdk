import * as r from "react"
import * as s from "react/jsx-runtime"
import * as a from "./38772"

import classNames from "classnames"
import { AppReactContext } from "../context/app.context"
import { KeyboardCode } from "../const/keyboard.const"
import { HandleTextBoxFocusMessage } from "../message/ui.message"

enum i {
  ADJUSTABLE = 1,
  OUTLINED = 0
}
const p = (function* () {
  let e = 0
  for (;;) yield e++
})()
@a.Z
class m extends r.Component {
  constructor(e) {
    super(e),
      (this.elementRef = (0, r.createRef)()),
      (this.onInput = e => {
        if (this.props.onInput) {
          const t = e.target
          this.props.onInput(t.value)
        }
      }),
      (this.onKeyPress = e => {
        e.stopPropagation()
        const t = e.which || e.keyCode,
          n = [KeyboardCode.RETURN]
        if ("keydown" === e.type && !n.includes(t)) return !1
        const i = e.target
        switch ((this.props.maxLength && i.value.length > this.props.maxLength && e.preventDefault(), t)) {
          case KeyboardCode.RETURN:
            e.shiftKey || (e.preventDefault(), this.blur(), this.props.onDone(i.value))
        }
        return !1
      }),
      (this.stopPropagation = e => e.stopPropagation()),
      (this.onChange = e => {
        this.updateHeight()
      }),
      (this.onFocus = e => {
        this.context.messageBus.broadcast(new HandleTextBoxFocusMessage(this.input, !0)),
          this.props.onFocus && this.props.onFocus(e),
          this.setState({
            isFocused: !0
          })
      }),
      (this.onBlur = e => {
        this.context.messageBus.broadcast(new HandleTextBoxFocusMessage(this.input, !1)),
          this.props.onBlur && this.props.onBlur(e),
          this.setState({
            isFocused: !1
          })
      }),
      (this.setRef = e => (this.input = e)),
      (this.instanceId = `textarea-${p.next().value}`),
      (this.state = {
        currentText: e.text,
        isFocused: !1
      })
  }
  componentDidMount() {
    this.props.focusOnMount && this.input && this.input.focus(),
      this.props.scrollIntoViewOnMount && this.input && this.input.scrollIntoView(),
      this.updateHeight()
  }
  componentWillUnmount() {
    this.input && this.input.blur()
  }
  UNSAFE_componentWillReceiveProps(e) {
    e.text !== this.props.text &&
      this.setState({
        currentText: e.text
      })
  }
  componentDidUpdate(e, t) {
    t.currentText !== this.state.currentText && this.updateHeight()
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
  updateHeight() {
    if (this.props.inputStyle === i.ADJUSTABLE) {
      const e = this.elementRef.current
      if (!this.input || !e) return
      ;(e.style.height = ""), (this.input.style.overflowY = "")
      const t = this.input.scrollHeight
      ;(e.style.height = `${t}px`), t > e.scrollHeight && (this.input.style.overflowY = "auto")
    }
  }
  render() {
    const { placeholder: e, tabIndex: t, maxLength: n, inputStyle: r = i.OUTLINED, label: a, name: o, readOnly: c, rows: d } = this.props,
      { currentText: u, isFocused: h } = this.state,
      p = o || this.instanceId,
      m = "" === u,
      f = a && (r !== i.ADJUSTABLE || h || !m),
      g = r === i.ADJUSTABLE ? 1 : d
    return (0, s.jsxs)(
      "div",
      Object.assign(
        {
          className: classNames("textarea-container", `textarea-style-${i[r].toLowerCase()}`, {
            focused: h,
            readonly: c,
            placeholder: m
          }),
          ref: this.elementRef
        },
        {
          children: [
            f &&
              (0, s.jsx)(
                "label",
                Object.assign(
                  {
                    className: "label",
                    htmlFor: p
                  },
                  {
                    children: a
                  }
                )
              ),
            (0, s.jsx)("textarea", {
              className: "textarea",
              value: u,
              ref: this.setRef,
              name: p,
              placeholder: e,
              maxLength: n,
              onInput: this.onInput,
              onChange: this.onChange,
              onKeyPress: this.onKeyPress,
              onKeyDown: this.onKeyPress,
              onKeyUp: this.stopPropagation,
              onBlur: this.onBlur,
              onFocus: this.onFocus,
              rows: g,
              tabIndex: t,
              readOnly: c
            })
          ]
        }
      )
    )
  }
}
m.contextType = AppReactContext

const f = m

export const P = i
export const Z = f
