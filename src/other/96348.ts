import r from "classnames"
import * as a from "react"
import * as s from "react/jsx-runtime"

import { PhraseKey } from "../const/phrase.const"
import * as d from "./38772"
import * as u from "./47397"
import * as pp from "./56382"
import * as m from "./84426"
import * as l from "./98813"
import { EmbedMediaCommand } from "../command/attachment.command"
import { AppReactContext } from "../context/app.context"

const { EMBED: y } = PhraseKey.WORKSHOP
var f = {
  NONE: "none",
  INVALID_URL_SYNTAX: "invalid",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error"
}

@d.Z
class w extends a.Component {
  constructor(e) {
    super(e),
      (this.inputRef = (0, a.createRef)()),
      (this.isUnmounting = !1),
      (this.onInput = e => {
        const t = (0, l.j)(e) ? f.NONE : f.INVALID_URL_SYNTAX
        this.setState({ validationPhase: t, currentUrl: e })
      }),
      (this.onApply = () => {
        this.isDisabled() || this.onDoneEditing(this.state.currentUrl)
      }),
      (this.stopPropagation = e => {
        e.stopPropagation()
      }),
      (this.onDoneEditing = async e => {
        const { onEmbed: t, onEmbedCleared: i, url: n } = this.props
        if ("" === e) return i && i(), void this.setState({ validationPhase: f.NONE, error: void 0, currentUrl: "" })
        const s = (0, p.V0)(e)
        if (s && s !== n)
          try {
            const e = await this.loadMedia(s)
            if (this.isUnmounting) return
            e ? (this.setState({ validationPhase: f.LOADED, error: void 0, currentUrl: s }), t(e)) : this.onEmbedError(s)
          } catch (e) {
            if (this.isUnmounting) return
            this.onEmbedError(s, e)
          }
      }),
      (this.loadMedia = async e => {
        const { parentId: t, parentType: i } = this.props
        return this.setState({ validationPhase: f.LOADING }), this.context.commandBinder.issueCommand(new EmbedMediaCommand(t, i, e))
      }),
      (this.state = { currentUrl: e.url || "", validationPhase: f.NONE, error: void 0 })
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0), this.setState({ currentUrl: "", validationPhase: f.NONE, error: void 0 })
  }
  componentDidUpdate(e, t) {
    const { url: i, onValidationPhaseChange: n } = this.props
    let s = this.state.validationPhase
    i !== e.url && ((s = f.NONE), this.setState({ currentUrl: i || "", validationPhase: f.NONE, error: void 0 })), n && s !== t.validationPhase && n(s)
  }
  focus() {
    this.inputRef.current && this.inputRef.current.focus()
  }
  onEmbedError(e, t) {
    this.setState({ error: t, validationPhase: f.ERROR, currentUrl: e })
  }
  isDisabled() {
    const { validationPhase: e, currentUrl: t } = this.state
    return e === f.ERROR || e === f.LOADING || (e === f.INVALID_URL_SYNTAX && "" !== t) || "" === t
  }
  renderError() {
    const { locale: e } = this.context,
      { error: t } = this.state
    let i = e.t(y.ERROR_MESSAGE)
    return (
      t instanceof pp.HF ? (i = e.t(y.PROVIDER_NOT_SUPPORTED_MESSAGE)) : t instanceof p.t1 && (i = e.t(y.LINK_TYPE_NOT_SUPPORTED_MESSAGE)),
      (0, s.jsxs)(
        "div",
        Object.assign(
          { className: "popover-message popover-message-error" },
          {
            children: [
              i,
              " ",
              (0, s.jsx)("a", Object.assign({ className: "link", target: "_blank", rel: "noreferrer", href: w.supportPage }, { children: e.t(y.HELP_CTA) }))
            ]
          }
        )
      )
    )
  }
  renderHelpMessage() {
    const { locale: e } = this.context,
      { currentUrl: t, validationPhase: i } = this.state
    switch (i) {
      case f.ERROR:
        return this.renderError()
      case f.LOADING:
        return (0, s.jsx)("div", Object.assign({ className: "popover-message" }, { children: e.t(y.LOADING_MESSAGE) }))
      case f.INVALID_URL_SYNTAX:
        if ("" !== t) return (0, s.jsx)("div", Object.assign({ className: "popover-message popover-message-error" }, { children: e.t(y.INVALID_URL_MESSAGE) }))
    }
    return (0, s.jsx)(
      "div",
      Object.assign(
        { className: "popover-message" },
        {
          children: (0, s.jsx)(
            "a",
            Object.assign({ className: "link", target: "_blank", href: w.supportPage, tabIndex: -1 }, { children: e.t(y.SUPPORTED_FORMATS_MESSAGE) })
          )
        }
      )
    )
  }
  render() {
    const { locale: e } = this.context,
      { className: t, tabIndex: i } = this.props,
      { currentUrl: n } = this.state,
      a = void 0 !== i && i >= 0,
      o = e.t(y.MEDIA_EMBED_PLACEHOLDER)
    return (0, s.jsxs)(s.Fragment, {
      children: [
        (0, s.jsxs)(
          "div",
          Object.assign(
            { className: "media-embed-editor", onClick: this.stopPropagation },
            {
              children: [
                (0, s.jsx)(u.Z, {
                  ref: this.inputRef,
                  text: n,
                  type: "url",
                  className: r(t),
                  placeholder: o,
                  onDone: this.onDoneEditing,
                  onInput: this.onInput,
                  allowTabbing: a,
                  tabIndex: i
                }),
                (0, s.jsx)("div", Object.assign({ className: "popover-footer" }, { children: this.renderHelpMessage() }))
              ]
            }
          )
        ),
        (0, s.jsx)(
          "div",
          Object.assign(
            { className: "modal-footer embed-apply" },
            {
              children: (0, s.jsx)(m.zx, {
                variant: m.Wu.PRIMARY,
                size: "small",
                disabled: this.isDisabled(),
                onClick: this.onApply,
                label: e.t(y.APPLY_CTA)
              })
            }
          )
        )
      ]
    })
  }
}
w.contextType = AppReactContext
w.supportPage = "https://support.matterport.com/hc/en-us/articles/115006363868-Add-Multimedia-to-a-Mattertag-Post"

export const M = w
export const p = f
