import r from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"
import * as a from "./38772"

import * as g from "./38490"
import * as p from "./63548"
import { ToggleViewAttachmentsCommand } from "../command/attachment.command"
import { ToggleModalCommand } from "../command/ui.command"
import * as c from "../const/73536"
import { KeyboardCode } from "../const/keyboard.const"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { CloseAttachmentViewerMessage, ViewAttachmentsMessage } from "../message/attachment.message"
import { ModalToggledMeeage } from "../message/ui.message"

const { ATTACHMENTS: w } = PhraseKey.SHOWCASE
@a.Z
class b extends s.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.onKey = async e => {
        const { attachments: t, attachmentIndex: i } = this.state,
          n = t.length
        let s = -1
        switch (e.keyCode) {
          case KeyboardCode.ESCAPE:
            e.stopPropagation(), this.closeAttachmentViewer()
            break
          case KeyboardCode.LEFTARROW:
            e.stopPropagation(), (s = i - 1), s < 0 && (s = n - 1)
            break
          case KeyboardCode.RIGHTARROW:
            e.stopPropagation(), (s = i + 1), s >= n && (s = 0)
        }
        ;-1 !== s && this.setState({ attachmentIndex: s })
      }),
      (this.closeAttachmentViewer = () => {
        this.state.open && this.context.commandBinder.issueCommand(new ToggleViewAttachmentsCommand(!1))
      }),
      (this.onModalToggled = e => {
        e.modal !== c.P.ATTACHMENT || e.open || this.closeAttachmentViewer()
      }),
      (this.onViewerClosed = () => {
        this.state.open &&
          (this.context.mainDiv.getRootNode().removeEventListener("keydown", this.onKey, { capture: !0 }),
          this.context.commandBinder.issueCommand(new ToggleModalCommand(c.P.ATTACHMENT, !1)),
          this.setState({ open: !1 }))
      }),
      (this.onNavigate = e => {
        this.setState({ attachmentIndex: e })
      }),
      (this.onViewAttachments = e => {
        const { attachments: t, attachmentId: i } = e,
          n = i || this.getCurrentAttachmentId(),
          s = t.findIndex(e => e.id === n)
        0 === t.length || -1 === s
          ? this.closeAttachmentViewer()
          : (this.state.open ||
              (this.context.mainDiv.getRootNode().addEventListener("keydown", this.onKey, { capture: !0 }),
              this.context.commandBinder.issueCommand(new ToggleModalCommand(c.P.ATTACHMENT, !0)),
              this.setState({ open: !0 })),
            this.setState({ attachments: t, attachmentIndex: s }))
      }),
      (this.state = { open: !1, attachmentIndex: -1, attachments: [] })
  }
  componentDidMount() {
    const { messageBus: e } = this.context
    this.bindings.push(
      e.subscribe(ViewAttachmentsMessage, this.onViewAttachments),
      e.subscribe(CloseAttachmentViewerMessage, this.onViewerClosed),
      e.subscribe(ModalToggledMeeage, this.onModalToggled)
    )
  }
  componentWillUnmount() {
    for (const e of this.bindings) e.cancel()
    this.context.mainDiv.getRootNode().removeEventListener("keydown", this.onKey, { capture: !0 })
  }
  getCurrentAttachmentId() {
    var e
    const { attachmentIndex: t, attachments: i } = this.state
    return (null === (e = i[t]) || void 0 === e ? void 0 : e.id) || void 0
  }
  render() {
    const { open: e, attachments: t, attachmentIndex: i } = this.state,
      { locale: s } = this.context,
      a = s.t(w.CLOSE_TOOLTIP),
      o = s.t(w.VIEWER_INDEX_COUNT, { currentNumber: i + 1, totalNumber: t.length })
    return (0, n.jsx)(
      "div",
      Object.assign(
        { className: r("overlay-layer", "attachment-overlay", { open: e }) },
        {
          children:
            e &&
            (0, n.jsxs)(n.Fragment, {
              children: [
                (0, n.jsxs)(
                  "div",
                  Object.assign(
                    { className: "overlay-top-bar" },
                    {
                      children: [
                        (0, n.jsx)("div", Object.assign({ className: "overlay-label" }, { children: o })),
                        (0, n.jsx)(g.P, { theme: "overlay", tooltip: a, onClose: this.closeAttachmentViewer })
                      ]
                    }
                  )
                ),
                (0, n.jsx)(p.T, { attachments: t, startIndex: i, onNavigate: this.onNavigate })
              ]
            })
        }
      )
    )
  }
}
b.contextType = AppReactContext

export const I = b
