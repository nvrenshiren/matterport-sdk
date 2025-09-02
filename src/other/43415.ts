import o from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import * as r from "./38772"
import { KeyboardCode } from "../const/keyboard.const"
import { AppReactContext } from "../context/app.context"
import { HandleTextBoxFocusMessage } from "../message/ui.message"

@r.A
class u extends s.Component {
  constructor(e) {
    super(e),
      (this.textElement = (0, s.createRef)()),
      (this.editing = !1),
      (this.isUnmounting = !1),
      (this.stopPropagation = e => e.stopPropagation()),
      (this.onPaste = e => {
        if (!e.clipboardData || !this.textElement.current) return
        let t = e.clipboardData.getData("text/plain")
        ;(t = this.props.textParser.sanitizeText(t)), e.preventDefault(), t && document.execCommand("insertText", !1, t)
      }),
      (this.onKeyDown = e => {
        if (!this.textElement.current) return
        const { onKeyDown: t } = this.props
        ;(e.which || e.keyCode) === KeyboardCode.RETURN && (e.shiftKey || e.altKey) ? document.execCommand("insertText", !1, "\n") : t && t(e)
      }),
      (this.onMouseDown = e => {
        const { onClick: t, clickToEdit: i, readonly: n } = this.props
        t && (e.stopPropagation(), t(e)), n || (!this.editing && i && this.toggleEditing(!0))
      }),
      (this.onFocus = e => {
        this.textElement.current &&
          (this.context.messageBus.broadcast(new HandleTextBoxFocusMessage(this.textElement.current, !0)), this.props.onFocus && this.props.onFocus(e))
      }),
      (this.onBlur = e => {
        this.textElement.current &&
          (this.context.messageBus.broadcast(new HandleTextBoxFocusMessage(this.textElement.current, !1)), this.props.onBlur && this.props.onBlur(e))
      })
  }
  componentDidMount() {
    this.replaceTextContent(this.props.text)
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0), this.textElement.current && this.textElement.current.blur()
  }
  componentDidUpdate(e) {
    const { text: t, active: i } = this.props
    ;(t === e.text && i === e.active) || this.replaceTextContent(t)
  }
  shouldComponentUpdate() {
    return !1
  }
  getTextElement() {
    return this.textElement.current
  }
  getPlainText() {
    var e
    return (null === (e = this.textElement.current) || void 0 === e ? void 0 : e.innerText) || ""
  }
  focus() {
    this.editing && this.textElement.current && this.textElement.current.focus()
  }
  toggleEditing(e, t = !0) {
    clearTimeout(this.toggleEditingTimeout),
      (this.toggleEditingTimeout = window.setTimeout(() => {
        this.textElement.current &&
          !this.isUnmounting &&
          (this.editing !== e &&
            ((this.editing = e),
            (this.textElement.current.contentEditable = e ? "true" : "false"),
            e ? this.textElement.current.classList.add("editing") : this.textElement.current.classList.remove("editing")),
          e && t ? this.textElement.current.focus() : this.textElement.current.blur())
      }, 0))
  }
  replaceTextContent(e) {
    clearTimeout(this.replaceTextContentTimeout),
      (this.replaceTextContentTimeout = window.setTimeout(() => {
        if (!this.textElement.current || this.isUnmounting) return
        for (; this.textElement.current.firstChild; ) this.textElement.current.removeChild(this.textElement.current.firstChild)
        const t = document.createDocumentFragment(),
          { textParser: i, markers: n, onClickAnchor: s, active: a, readonly: o, maxLength: r, clickableLinks: d } = this.props,
          c = void 0 !== d ? d : !a,
          l = i.deserialize(e, c, s, n)
        let h = 0,
          u = !l.every(e => {
            var i
            const n = (null === (i = e.textContent) || void 0 === i ? void 0 : i.length) || 0
            if (o && r && h + n > r) {
              if ("#text" === e.nodeName) {
                const i = e.textContent || ""
                ;(e.textContent = i.substring(0, r - h)), t.appendChild(e)
              }
              return !1
            }
            return !o && a && "A" === e.nodeName && (e.contentEditable = "true"), (h += n), t.appendChild(e), !0
          })
        u && t.appendChild(document.createTextNode("...")),
          this.textElement.current.appendChild(t),
          this.focus(),
          o &&
            !u &&
            this.props.maxLines &&
            this.textElement.current.scrollHeight > this.textElement.current.offsetHeight &&
            ((u = !0), this.textElement.current.appendChild(document.createTextNode("..."))),
          this.props.onTextReplaced && this.props.onTextReplaced(u)
      }, 0))
  }
  render() {
    const { placeholder: e, tabIndex: t, onInput: i, readonly: s, maxLines: a, text: r } = this.props,
      d = s && a,
      c = d ? { WebkitLineClamp: a } : {},
      l = o("text-box-text", { clamped: d, placeholder: !!e && !r })
    return (0, n.jsx)("div", {
      ref: this.textElement,
      className: l,
      style: c,
      role: "textbox",
      draggable: !1,
      spellCheck: !0,
      contentEditable: !1,
      placeholder: e,
      "aria-label": e,
      onMouseDown: this.onMouseDown,
      onKeyDown: s ? void 0 : this.onKeyDown,
      onKeyUp: s ? void 0 : this.stopPropagation,
      onFocus: s ? void 0 : this.onFocus,
      onBlur: s ? void 0 : this.onBlur,
      onInput: s ? void 0 : i,
      onPaste: s ? void 0 : this.onPaste,
      tabIndex: t
    })
  }
}
u.contextType = AppReactContext

export const Z = u
