import a from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"

import * as c from "./38772"
import * as u from "../utils/scroll.utils"
import * as d from "./87170"
import { KeyboardCode } from "../const/keyboard.const"
import { AppReactContext } from "../context/app.context"
import { HandleTextBoxFocusMessage } from "../message/ui.message"
import { winCanTouch } from "../utils/browser.utils"

@c.Z
class f extends s.Component {
  constructor(e) {
    super(e),
      (this.el = (0, s.createRef)()),
      (this.touchDevice = winCanTouch()),
      (this.isUnmounting = !1),
      (this.handleOutsideClick = e => {
        if (!this.state.editing || !this.input.current) return
        const t = this.getTextString(this.input.current.value, this.props.defaultText)
        this.stopEditing(t, !0)
      }),
      (this.stopEditing = (e, t = !0) => {
        this.setState({
          editing: !1
        })
        const n = this.props.validator ? this.props.validator(e) : this.props.text !== e
        t && n
          ? (this.setState({
              currentText: e
            }),
            this.props.onEdited && this.props.onEdited(e))
          : this.props.onCancelEditing && this.props.onCancelEditing()
      }),
      (this.stopPropagation = e => {
        e.stopPropagation()
      }),
      (this.onBlur = () => {
        this.input.current && this.context.engine.broadcast(new HandleTextBoxFocusMessage(this.input.current, !1))
      }),
      (this.onFocus = () => {
        this.input.current && this.context.engine.broadcast(new HandleTextBoxFocusMessage(this.input.current, !0))
      }),
      (this.startEditing = e => {
        clearTimeout(this.startEditingTimeout),
          (this.startEditingTimeout = window.setTimeout(() => {
            if (!this.input.current || this.isUnmounting) return
            e && e.stopPropagation()
            const { onStartEditing: t, autoSelect: n, defaultText: i } = this.props,
              { currentText: s } = this.state
            this.setState({
              editing: !0
            }),
              t && t(),
              this.input.current.focus(),
              (n || (i && this.input.current.select && s === i)) && this.input.current.select()
          }, 0))
      }),
      (this.onKeyPress = e => {
        var t
        if ((e.stopPropagation(), this.props.onKeyPress && this.props.onKeyPress(e))) return
        const n = e.which || e.keyCode
        if (!(("keydown" === e.type && n !== KeyboardCode.TAB) || (n !== KeyboardCode.RETURN && n !== KeyboardCode.TAB) || e.shiftKey)) {
          e.preventDefault(), null === (t = this.input.current) || void 0 === t || t.blur()
          const n = this.getTextString(e.target.value, this.props.defaultText)
          this.stopEditing(n)
        }
      }),
      (this.onInput = e => {
        const t = e.target.value
        this.setState({
          currentText: t
        }),
          this.props.validator &&
            this.props.validator(t) &&
            this.setState({
              lastValidText: t
            }),
          this.props.onInput && this.props.onInput(t)
      }),
      (this.state = {
        editing: !1,
        currentText: this.props.text,
        lastValidText: this.props.text
      }),
      (this.input = (0, s.createRef)())
  }
  componentDidMount() {
    this.input.current &&
      (this.props.closeOnFocusOut && this.input.current.addEventListener("focusout", this.handleOutsideClick),
      (this.props.editing || this.props.autofocus) && this.startEditing())
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0),
      this.input.current &&
        (this.props.closeOnFocusOut && this.input.current.removeEventListener("focusout", this.handleOutsideClick), this.input.current.blur())
  }
  UNSAFE_componentWillReceiveProps(e) {
    if ((e.editing && !this.props.editing && this.startEditing(), e.text !== this.props.text)) {
      const t = this.getTextString(e.text, e.defaultText)
      this.setState({
        currentText: t
      })
    }
  }
  componentDidUpdate(e, t) {
    this.input.current && (!t.editing && this.state.editing ? this.input.current.focus() : t.editing && !this.state.editing && this.input.current.blur())
  }
  getElement() {
    return this.el.current
  }
  getTextString(e, t) {
    return this.props.validator ? (this.props.validator(e) ? e : this.state.lastValidText) : "" === e && void 0 !== t ? t : e
  }
  setCurrentText(e) {
    this.setState({
      currentText: e
    }),
      this.focusInput(),
      this.props.onEdited && this.props.onEdited(e)
  }
  getCurrentText() {
    return this.state.currentText
  }
  focusInput() {
    this.input.current && this.input.current.focus()
  }
  getFractionalCounter() {
    if (this.props.maxLength && this.props.fractionalCounter) return `${this.state.currentText.length}/${this.props.maxLength}`
  }
  render() {
    const { editing: e, currentText: t } = this.state,
      {
        hint: n,
        isDisabled: r,
        placeholder: o,
        noFocusedPlaceholder: l,
        clickToEdit: c,
        maxLength: h,
        tabIndex: p,
        textarea: m,
        readOnlyText: f,
        autocapitalize: g,
        fractionalCounter: v,
        showUnderline: y,
        className: b
      } = this.props,
      E = !(t || !o || (e && l)),
      S = E ? o : void 0,
      O = !1 !== c ? this.startEditing : void 0,
      T = (0, i.jsx)(
        "div",
        Object.assign(
          {
            className: "current-text",
            onClick: O,
            "data-hint": n
          },
          {
            children: t || o || ""
          }
        )
      )
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: a("text-input", "modifiable-text", b, {
            editing: e,
            "fractional-counter": v,
            default: !t,
            "has-hint": !!n,
            "has-placeholder": E
          }),
          "data-hint": n,
          "data-fractional-counter": this.getFractionalCounter(),
          ref: this.el
        },
        {
          children: [
            m
              ? (0, i.jsx)(
                  d.Z,
                  Object.assign(
                    {
                      name: "text-input",
                      singleScrollDirection: u.Nm.vertical,
                      forceHidden: !1
                    },
                    {
                      children: T
                    }
                  )
                )
              : T,
            (0, s.createElement)(m ? "textarea" : "input", {
              ref: this.input,
              className: a("inputDiv", {
                editing: e
              }),
              type: "text",
              value: t,
              placeholder: S,
              maxLength: h,
              onInput: this.onInput,
              onClick: this.props.propagateMouseEvent ? void 0 : this.stopPropagation,
              onKeyPress: this.onKeyPress,
              disabled: r,
              readOnly: this.props.readOnlyMode,
              onKeyDown: this.onKeyPress,
              onKeyUp: this.stopPropagation,
              tabIndex: p,
              autoCapitalize: g,
              onBlur: this.touchDevice ? this.onBlur : void 0,
              onFocus: this.touchDevice ? this.onFocus : void 0
            }),
            f &&
              (0, i.jsx)(
                "div",
                Object.assign(
                  {
                    className: "read-only-text"
                  },
                  {
                    children: f
                  }
                )
              ),
            y &&
              (0, i.jsx)("div", {
                className: "editable-line"
              })
          ]
        }
      )
    )
  }
}
f.contextType = AppReactContext

export const Z = f
