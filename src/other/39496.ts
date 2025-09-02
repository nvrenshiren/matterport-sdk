import * as s from "react"
import * as n from "react/jsx-runtime"
import * as a from "./38772"
import * as d from "./42619"
import * as p from "./43415"
import * as m from "./72252"
import { AnnotationCloseCommand } from "../command/annotation.command"
import { BlockTypeList } from "../const/block.const"
import { presentationMlsModeKey } from "../const/settings.const"
import { AppReactContext } from "../context/app.context"
import { AnchorClickOpenMessage } from "../message/tag.message"
import { AnnotationBlockClickedMessage } from "../message/annotation.message"

@a.Z
class v extends s.Component {
  constructor(e) {
    super(e),
      (this.onTextReplaced = e => {
        const { onTruncationChange: t } = this.props,
          i = this.state.truncated
        this.setState({ truncated: e }), t && i !== e && t(e)
      }),
      (this.onClickAnchor = e => {
        const t = e.target,
          i = t.dataset.blocktype
        if ((e.stopPropagation(), i)) {
          const { annotationType: n, annotationId: s, linkHandler: a } = this.props,
            o = { blockType: i, text: t.innerText, value: t.dataset.value, id: t.dataset.id }
          if (i === BlockTypeList.LINK && a && o.value) {
            e.preventDefault()
            const t = (0, d.V)(o.value),
              { url: i, modelId: r, pose: l } = t
            r
              ? a.handler.openLink({ fullLink: i, modelId: r })
              : l
                ? (a.handler.openLink({ fullLink: i, pose: l }), this.context.commandBinder.issueCommand(new AnnotationCloseCommand(s, n)))
                : (a.handler.openLink(i), this.context.messageBus.broadcast(new AnchorClickOpenMessage(i)))
          }
          this.context.messageBus.broadcast(new AnnotationBlockClickedMessage(n, s, o))
        }
      }),
      (this.state = { truncated: !1 })
  }
  renderAttachments(e) {
    if (0 === e.length) return null
    const { onViewAttachment: t, annotationType: i } = this.props
    return (0, n.jsx)(m.s, { attachments: e, onViewAttachment: t, annotationType: i })
  }
  render() {
    const { settings: e } = this.context,
      { text: t, textParser: i, edited: s, attachments: a, maxLength: o, maxLines: r, readMore: d } = this.props,
      { truncated: c } = this.state,
      l = e.tryGetProperty(presentationMlsModeKey, !1)
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: "annotation-box" },
        {
          children: [
            (0, n.jsx)(
              "div",
              Object.assign(
                { className: "annotation-text-box" },
                {
                  children: (0, n.jsx)(p.Z, {
                    text: t,
                    textParser: i,
                    onClickAnchor: l ? void 0 : this.onClickAnchor,
                    clickableLinks: !l,
                    onTextReplaced: this.onTextReplaced,
                    maxLength: o,
                    maxLines: r,
                    readonly: !0
                  })
                }
              )
            ),
            s && (0, n.jsx)("div", Object.assign({ className: "annotation-edited" }, { children: "(edited)" })),
            d &&
              c &&
              (0, n.jsx)(
                "div",
                Object.assign(
                  { className: "annotation-read-more" },
                  { children: (0, n.jsx)("span", Object.assign({ className: "link link-more" }, { children: d })) }
                )
              ),
            a && !l && this.renderAttachments(a)
          ]
        }
      )
    )
  }
}
v.contextType = AppReactContext
export const e = v
