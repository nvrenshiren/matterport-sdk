import o from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import * as r from "./38772"
import * as m from "./84426"
import * as h from "./86941"
import { AttachmentRemoveFailedUploadCommand, CancelAttachmentUploadCommand } from "../command/attachment.command"
import { AttachmentUploadError } from "../const/32347"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"

const { ATTACHMENTS: g } = PhraseKey.SHOWCASE
@r.Z
class v extends s.Component {
  constructor(e) {
    super(e),
      (this.setContainerRef = e => {
        this.setState({ containerRef: e })
      }),
      (this.handleCancelClick = e => {
        e.preventDefault(), this.context.commandBinder.issueCommand(new CancelAttachmentUploadCommand(this.props.id))
      }),
      (this.onRemoveFailed = e => {
        const { id: t, error: i } = this.props
        i && (e.stopPropagation(), this.context.commandBinder.issueCommand(new AttachmentRemoveFailedUploadCommand(t)))
      }),
      (this.state = { containerRef: null })
  }
  render() {
    const { className: e, error: t, progress: i, fileName: s } = this.props
    let a = g.ERROR_UPLOAD_FAIL
    const r = this.context.locale.t(g.REMOVE_TOOLTIP),
      d = t ? this.onRemoveFailed : this.handleCancelClick
    switch (t) {
      case AttachmentUploadError.FILE_TOO_LARGE:
        a = g.ERROR_FILE_TOO_LARGE
        break
      case AttachmentUploadError.EMPTY_FILE:
        a = g.ERROR_EMPTY_FILE
        break
      case AttachmentUploadError.OVER_QUOTA:
        a = g.ERROR_OVER_QUOTA
        break
      case AttachmentUploadError.PERMISSION_DENIED:
        a = g.ERROR_PERMISSION_DENIED
    }
    const c = t ? this.context.locale.t(a) : s,
      u = { "upload-error": !!t }
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: o("attachment", "attachment-upload", u, e) },
        {
          children: [
            (0, n.jsx)(
              "div",
              Object.assign(
                { ref: this.setContainerRef, className: "upload-status" },
                { children: t ? (0, n.jsx)(m.JO, { name: "error", size: m.Jh.MEDIUM }) : (0, n.jsx)(h.$, { progress: i, innerRadius: 20, barWidth: 4 }) }
              )
            ),
            (0, n.jsx)(m.u, { target: this.state.containerRef, title: c }),
            (0, n.jsx)(m.zx, {
              icon: "close",
              className: "attachment-delete",
              size: m.qE.SMALL,
              variant: m.Wu.FAB,
              theme: "dark",
              tooltip: r,
              tooltipOptions: { placement: "bottom-start" },
              onClick: d
            })
          ]
        }
      )
    )
  }
}
v.contextType = AppReactContext
export const G = v
