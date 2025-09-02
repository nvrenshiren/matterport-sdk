import x from "classnames"
import * as ss from "react"
import * as n from "react/jsx-runtime"
import * as f from "./44877"
import * as C from "./54473"
import * as l from "./57623"
import * as R from "./61092"
import * as p from "./61531"
import * as d from "./65596"
import * as N from "./66102"
import * as q from "./72252"
import * as se from "./84151"
import * as L from "./84242"
import * as U from "./84426"
import * as Q from "./89936"
import * as g from "./93001"
import * as ee from "./93958"
import * as ae from "./96348"
import * as J from "../const/36892"
import { NotesPhase } from "../const/38965"
import * as E from "../const/39693"
import * as c from "../const/73536"
import { ToolPanelLayout, ToolsList } from "../const/tools.const"
import { modelAccessType } from "../const/typeString.const"
import { AppReactContext } from "../context/app.context"
import * as o from "./15501"
import * as P from "./21149"
import * as h from "./2429"
import * as u from "./2478"
import * as O from "./26314"
import * as ie from "./32875"
import * as V from "./36773"
import * as G from "./38772"
import * as X from "./39361"
import * as r from "./40216"
import * as W from "./42619"
import * as I from "./4311"
function k(e) {
  const t = []
  return (
    e &&
      e.comments.forEach(e => {
        t.push(...e.attachments)
      }),
    t
  )
}
function j() {
  const e = (0, g.v)(),
    [t, i] = (0, ss.useState)((null == e ? void 0 : e.getUsersWhoMayNeedAccess()) || {})
  return (
    (0, ss.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        i((null == e ? void 0 : e.getUsersWhoMayNeedAccess()) || {})
      }
      const n = e.onChanged(t)
      return t(), () => n.cancel()
    }, [e]),
    t
  )
}
const _ = useDataHook(HashtagData)
function H() {
  const e = _(),
    [t, i] = (0, ss.useState)((null == e ? void 0 : e.getHashtags()) || [])
  return (
    (0, ss.useEffect)(() => {
      if (!e) return () => {}
      function t() {
        i((null == e ? void 0 : e.getHashtags()) || [])
      }
      const n = e.onChanged(t)
      return (
        t(),
        () => {
          n.cancel()
        }
      )
    }, [e]),
    t
  )
}
const { EMBED: oe } = PhraseKey.WORKSHOP
function re(e) {
  const { parentType: t, parentId: i, onEmbed: a, onCancel: r } = e,
    { locale: d } = (0, ss.useContext)(AppReactContext),
    l = (0, o.R)(),
    h = d.t(oe.MEDIA_LINK_LABEL),
    u = l === c.P.MEDIA_EMBED_POPUP
  return (0, n.jsx)(
    se.H,
    Object.assign(
      { open: u, title: h, fullModal: !1, className: "media-embed-popup", onClose: r },
      { children: (0, n.jsx)(ae.M, { parentId: i, parentType: t, onEmbed: a }) }
    )
  )
}

import * as de from "./22804"

const { ANNOTATIONS: le } = PhraseKey.SHOWCASE
@G.Z
class he extends ss.Component {
  constructor(e) {
    super(e),
      (this.uploadTooltipTimeout = 0),
      (this.bindings = []),
      (this.isUnmounting = !1),
      (this.getAttachmentsState = () => {
        if (!this.attachmentsData) return
        const { active: e, parentId: t, parentType: i } = this.props
        if (!e) return
        return {
          pendingAttachments: this.attachmentsData.getPendingAttachmentsForAsset(t, i),
          removedAttachments: this.attachmentsData.getRemovedAttachmentsForAsset(t, i),
          failures: this.attachmentsData.failures.values,
          uploads: this.attachmentsData.uploads.values
        }
      }),
      (this.updateAttachments = () => {
        const e = this.getAttachmentsState()
        e && this.setState(e)
      }),
      (this.cancelEdits = () => {
        this.props.onCancelEditing && this.props.onCancelEditing()
      }),
      (this.saveEdits = () => {
        this.onDoneEditing()
      }),
      (this.onDoneEditing = () => {
        const { onDoneEditing: e } = this.props
        if (e) {
          const t = this.getMarkdown()
          e(t, "" === t && 0 === this.getAttachmentCount())
        }
      }),
      (this.onInput = e => {
        this.setState({ textChanged: e.trim() !== this.props.text, charCount: e.length })
      }),
      (this.openLinkEditor = () => {
        !(this.props.openModal === c.P.LINK_EDITOR) &&
          this.textEditor &&
          (this.context.analytics.trackGuiEvent("annotation_open_link_editor", { tool: "notes" }), this.textEditor.prepareLinkForEdit())
      }),
      (this.onClickBlock = (e, t) => {
        const { active: i, annotationType: n, annotationId: s, linkHandler: a } = this.props,
          o = e.blockType
        if (o === BlockTypeList.LINK && i)
          this.setState({ selectedBlock: e }), this.context.commandBinder.issueCommand(new ToggleModalCommand(c.P.LINK_EDITOR, !0))
        else if (!i) {
          if (o === BlockTypeList.LINK && a && e.value) {
            t && t.preventDefault()
            const i = (0, W.V)(e.value),
              { url: o, modelId: r, pose: d } = i
            r
              ? a.handler.openLink({ fullLink: o, modelId: r })
              : d
                ? (a.handler.openLink({ fullLink: o, pose: d }), this.context.commandBinder.issueCommand(new AnnotationCloseCommand(s, n)))
                : a.handler.openLink(o)
          }
          this.context.messageBus.broadcast(new AnnotationBlockClickedMessage(n, s, e))
        }
      }),
      (this.closeLinkEditor = async () => (
        this.setState({ selectedBlock: null }), this.context.commandBinder.issueCommand(new ToggleModalCommand(c.P.LINK_EDITOR, !1))
      )),
      (this.onCancelLink = async () => {
        await this.closeLinkEditor()
      }),
      (this.openEmbedEditor = () => {
        this.context.analytics.trackGuiEvent("annotation_open_embed_editor", { tool: "notes" }),
          this.context.commandBinder.issueCommand(new ToggleModalCommand(c.P.MEDIA_EMBED_POPUP, !0))
      }),
      (this.closeEmbedEditor = () => {
        this.context.commandBinder.issueCommand(new ToggleModalCommand(c.P.MEDIA_EMBED_POPUP, !1))
      }),
      (this.onRemoveLink = () => {
        this.onSaveLink("", "")
      }),
      (this.onSaveLink = (e, t) => {
        this.props.openModal === c.P.LINK_EDITOR &&
          this.textEditor &&
          (this.setState({ textChanged: !0 }), this.textEditor.saveLink(e, t), this.closeLinkEditor())
      }),
      (this.onClickFileInput = () => {
        const { active: e, onClickToEdit: t } = this.props
        this.isAtMaxAttachments()
          ? (window.clearTimeout(this.uploadTooltipTimeout),
            this.setState({ showUploadTooltip: !0 }),
            (this.uploadTooltipTimeout = window.setTimeout(() => {
              this.setState({ showUploadTooltip: !1 })
            }, 2500)))
          : !e && t && t()
      }),
      (this.onFileUpload = e => {
        const { parentId: t, parentType: i } = this.props,
          n = Array.from(e),
          s = this.getAttachmentCount()
        e.length + s > J.yk && n.splice(J.yk - s), this.context.commandBinder.issueCommand(new UploadAttachmentsCommand(t, i, n)), this.edit()
      }),
      (this.onDrop = e => {
        this.context.analytics.trackGuiEvent("attachment_drag_and_dropped", { tool: "notes" }), this.onFileUpload(e)
      }),
      (this.onFilesChosen = e => {
        this.context.analytics.trackGuiEvent("annotation_files_chosen", { tool: "notes" }), this.onFileUpload(e)
      }),
      (this.dropActivated = () => {
        const { active: e, creating: t, onClickToEdit: i } = this.props
        t && !e && i && i()
      }),
      (this.setTextEditorRef = e => (this.textEditor = e)),
      (this.state = {
        textChanged: !1,
        charCount: e.text.length,
        selectedBlock: null,
        showUploadTooltip: !1,
        pendingAttachments: [],
        removedAttachments: [],
        uploads: [],
        failures: []
      })
  }
  componentDidMount() {
    this.context.market.waitForData(AttachmentsData).then(e => {
      ;(this.attachmentsData = e), this.bindings.push(this.attachmentsData.onChanged(this.updateAttachments)), this.isUnmounting || this.updateAttachments()
    })
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0), window.clearTimeout(this.uploadTooltipTimeout)
    for (const e of this.bindings) e.cancel()
  }
  componentDidUpdate(e, t) {
    const { active: i, parentId: n, parentType: s } = this.props
    e.active && !i
      ? this.setState({ textChanged: !1, pendingAttachments: [], removedAttachments: [], uploads: [], failures: [] })
      : (n === e.parentId && s === e.parentType) || this.updateAttachments()
  }
  edit() {
    this.textEditor && this.textEditor.toggleEditing(!0)
  }
  focus() {
    this.textEditor && this.textEditor.focus()
  }
  getMarkdown() {
    let e
    return (e = this.textEditor ? this.textEditor.getMarkdown() : this.props.text), e.trim()
  }
  getAttachmentCount() {
    const { attachments: e } = this.props,
      { pendingAttachments: t, removedAttachments: i, uploads: n } = this.state
    return e.length + t.length + n.length - i.length
  }
  isAtMaxAttachments() {
    return this.getAttachmentCount() >= J.yk
  }
  inEmptyState() {
    const { active: e, text: t } = this.props
    return !e && "" === t.trim() && 0 === this.getAttachmentCount()
  }
  renderButtonBar() {
    const { active: e, creating: t, parentId: i, maxLength: s } = this.props
    if (!e) return null
    const { pendingAttachments: a, removedAttachments: o, textChanged: r, charCount: d, uploads: c, showUploadTooltip: l } = this.state,
      h = this.isAtMaxAttachments(),
      u = r || o.length > 0 || a.length > 0,
      m = c.length > 0,
      p = !h && !m,
      g = u && e && !m && !(s && d > s),
      v = h ? ButtonState.DIMMED : m ? ButtonState.DISABLED : ButtonState.ENABLED,
      y = this.context.locale.t(h ? le.MAX_ATTACHMENTS_TOOLTIP : le.UPLOAD_TOOLTIP, J.yk),
      f = this.context.locale.t(h ? le.MAX_ATTACHMENTS_TOOLTIP : le.EMBED_TOOLTIP, J.yk),
      w = this.context.locale.t(t ? le.ADD_CTA : le.SAVE_CTA),
      b = this.context.locale.t(le.LINK_TOOLTIP),
      T = this.context.locale.t(le.CANCEL_CTA)
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: "annotation-button-bar" },
        {
          children: [
            (0, n.jsxs)(
              "div",
              Object.assign(
                { className: "annotation-editors" },
                {
                  children: [
                    (0, n.jsx)(
                      X.p,
                      Object.assign(
                        { id: `${i}-annotation`, multi: !0, enabled: p, onUpload: this.onFilesChosen },
                        {
                          children: (0, n.jsx)(SettingsLabel, {
                            iconClass: "icon-attach",
                            buttonStyle: IconButtonAttribute.PLAIN,
                            buttonState: v,
                            onClick: this.onClickFileInput,
                            tooltipMsg: y,
                            tooltipPersist: l
                          })
                        }
                      )
                    ),
                    (0, n.jsx)(SettingsLabel, {
                      iconClass: "icon-media-mix",
                      buttonStyle: IconButtonAttribute.PLAIN,
                      buttonState: v,
                      tooltipMsg: f,
                      onClick: this.openEmbedEditor
                    }),
                    (0, n.jsx)(SettingsLabel, {
                      iconClass: "icon-add-link",
                      buttonStyle: IconButtonAttribute.PLAIN,
                      tooltipMsg: b,
                      onClick: this.openLinkEditor
                    })
                  ]
                }
              )
            ),
            (0, n.jsxs)(
              U.hE,
              Object.assign(
                { className: "annotation-cta-buttons", spacing: "small" },
                {
                  children: [
                    (0, n.jsx)(U.zx, { variant: U.Wu.TERTIARY, size: "small", onClick: this.cancelEdits, label: T }, "cancel"),
                    (0, n.jsx)(U.zx, { variant: U.Wu.TERTIARY, size: "small", disabled: !g, onClick: this.saveEdits, label: w }, "save")
                  ]
                }
              )
            )
          ]
        }
      )
    )
  }
  renderAttachments() {
    const { attachments: e, active: t, onViewAttachment: i, annotationType: s, parentId: a } = this.props,
      { pendingAttachments: o } = this.state,
      r = this.attachmentsData ? e.filter(e => !this.attachmentsData.removals.get(e.id)) : e
    if ((o.forEach(e => r.push(e)), t)) return (0, n.jsx)(q.s, { annotationType: s, parentId: a, canDelete: t, inline: t, attachments: r, onViewAttachment: i })
    const d = (r || []).reduce(
      (e, t) => {
        const i = (0, P.lV)(t) ? "viewable" : "nonViewable"
        return (e[i] = [...e[i], t]), e
      },
      { viewable: [], nonViewable: [] }
    )
    return (0, n.jsxs)(n.Fragment, {
      children: [
        (0, n.jsx)(q.s, { annotationType: s, parentId: a, canDelete: t, inline: t, attachments: d.viewable, onViewAttachment: i }),
        (0, n.jsx)(q.s, { annotationType: s, parentId: a, canDelete: t, inline: t, attachments: d.nonViewable, nonViewable: !0, onViewAttachment: i })
      ]
    })
  }
  renderSmartEditor() {
    const {
        placeholder: e,
        hashtags: t,
        text: i,
        creating: s,
        textParser: a,
        active: o,
        maxLength: r,
        tabIndex: d,
        annotationType: c,
        onClickToEdit: l
      } = this.props,
      h = c === AnnotationType.NOTE,
      u = this.inEmptyState() && h && !s ? this.context.locale.t(le.CONTENT_DELETED) : e
    return (0, n.jsx)(Q.b, {
      ref: this.setTextEditorRef,
      textParser: a,
      text: i,
      active: !!o,
      clickToEdit: !!l,
      placeholder: u,
      onClickBlock: this.onClickBlock,
      onStartEditing: o ? void 0 : l,
      onDoneEditing: this.onDoneEditing,
      onCancelEditing: this.cancelEdits,
      onInput: this.onInput,
      tabIndex: d,
      maxLength: r,
      hashtags: t || [],
      userMentions: h
    })
  }
  render() {
    const {
        className: e,
        creating: t,
        active: i,
        parentId: s,
        parentType: a,
        annotationType: o,
        onClickToEdit: r,
        edited: d,
        title: c,
        maxLength: l
      } = this.props,
      { uploads: h, selectedBlock: u, charCount: m } = this.state,
      p = this.getAttachmentCount() < J.yk,
      g = !(h.length > 0) && (i || t) && p,
      v = o === AnnotationType.NOTE,
      f = this.inEmptyState() && !t && v,
      w = !i && d && !f,
      b = { annotating: i, "editor-box": i || !!r, "annotation-emptied": f, invalid: i && !!l && m > l }
    let T = "",
      C = ""
    return (
      u && u.blockType === BlockTypeList.LINK && ((T = u.text), (C = u.value || "")),
      (0, n.jsxs)(
        ee.Z,
        Object.assign(
          { className: "annotation-box", onDropped: this.onDrop, disabled: !g, onActivate: this.dropActivated },
          {
            children: [
              c,
              (0, n.jsxs)(
                "div",
                Object.assign(
                  { className: x("annotation-text-box", b, e) },
                  {
                    children: [
                      this.renderSmartEditor(),
                      i && this.renderAttachments(),
                      i && this.renderButtonBar(),
                      i && l && l - m < 50 && (0, n.jsx)(de.R, { current: m, max: l })
                    ]
                  }
                )
              ),
              w && (0, n.jsx)("div", Object.assign({ className: "annotation-edited" }, { children: "(edited)" })),
              !i && !t && this.renderAttachments(),
              i && !!s && (0, n.jsx)(re, { parentId: s, parentType: a, onEmbed: this.closeEmbedEditor, onCancel: this.closeEmbedEditor }),
              i &&
                !!s &&
                (0, n.jsx)(ie.I, { linkText: T, linkUrl: C, onCancelLink: this.onCancelLink, onSaveLink: this.onSaveLink, onRemoveLink: this.onRemoveLink })
            ]
          }
        )
      )
    )
  }
}
he.contextType = AppReactContext

import * as it from "./44761"
import { useDataHook } from "./45755"
import * as tt from "./46362"
import * as We from "./56843"
import * as ht from "./62752"
import * as Ze from "./65428"
import * as $e from "./68549"
import * as lt from "./73372"
import * as ct from "./77230"
import * as nt from "./85535"
import * as yt from "./97273"
import { AnnotationCloseCommand } from "../command/annotation.command"
import { ToggleViewAttachmentsCommand, UploadAttachmentsCommand } from "../command/attachment.command"
import {
  CommentAddCommand,
  CommentCancelChangesCommand,
  CommentDeleteCommand,
  CommentUpdateCommand,
  NoteAddCommand,
  NoteAppearanceSaveCommand,
  NoteCancelAddCommand,
  NoteCloseCommand,
  NoteCommentEditCommand,
  NoteDeleteCommand,
  NotePopupEditorToggleCommand,
  NoteResolveCommand,
  NoteSaveChangesCommand,
  NotesOpenNoteCommentCommand,
  NotesToggleFilterCommand
} from "../command/notes.command"
import { CloseToolCommand, OpenPreviousToolCommand, ToolBottomPanelCollapseCommand } from "../command/tool.command"
import { ToggleModalCommand } from "../command/ui.command"
import { UserInviteCommand } from "../command/users.command"
import { PinType } from "../const/62612"
import { TransitionTypeList } from "../const/64918"
import { UserStatus } from "../const/66197"
import { AnnotationType } from "../const/annotationType.const"
import { BlockTypeList } from "../const/block.const"
import { NotesFilter } from "../const/notes.const"
import { PhraseKey } from "../const/phrase.const"
import { parentType } from "../const/typeString.const"
import { AttachmentsData } from "../data/attachments.data"
import { HashtagData } from "../data/hashtag.data"
import { AnnotationBlockClickedMessage } from "../message/annotation.message"
import { FocusCommentMessage } from "../message/notes.message"
import { NewPinReadyMessage } from "../message/pin.message"
import { createObservableValue } from "../observable/observable.value"
import { randomString } from "../utils/func.utils"
import * as Fe from "./11866"
import { ButtonState, IconButtonAttribute, SettingsLabel } from "./16507"
import * as Je from "./36964"
import * as at from "./38490"
import * as ue from "./39496"
import * as mt from "./5383"
import * as me from "./6608"

const { INVITE_USER: ye, INVITE_BUTTON: fe, INVITE_USERS: we, INVITE_VISIBLE_MSG: be } = PhraseKey.USERS
@G.Z
class Te extends ss.Component {
  constructor(e) {
    super(e),
      (this.onInviteUsers = () => {
        this.props.onInviteUsers(this.props.invitees)
      })
  }
  render() {
    const { invitees: e } = this.props
    if (0 === e.length) return null
    const { locale: t } = this.context
    let i
    const s = t.t(fe, e.length)
    i = 1 === e.length ? t.t(ye, { email: e[0] }) : t.t(we, { emails: e.join(", ") })
    const a = t.t(be)
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: "user-invite-card" },
        {
          children: [
            (0, n.jsxs)(
              "div",
              Object.assign(
                { className: "user-invite-info" },
                { children: [(0, n.jsx)("span", { className: "icon icon-eye-show" }), (0, n.jsx)("span", Object.assign({ className: "" }, { children: a }))] }
              )
            ),
            (0, n.jsx)("p", Object.assign({ className: "user-invite-msg" }, { children: i })),
            (0, n.jsx)(U.zx, { onClick: this.onInviteUsers, variant: U.Wu.TERTIARY, className: x("button-inline", "user-invite-button"), label: s })
          ]
        }
      )
    )
  }
}
Te.contextType = AppReactContext

const { INVITE_VISIBLE_MSG: Ee, INVITE_USER_FAILED: De, INVITE_USERS_FAILED: xe } = PhraseKey.USERS
@G.Z
class Ae extends ss.Component {
  constructor(e) {
    super(e)
  }
  render() {
    const { failedEmails: e } = this.props,
      { locale: t } = this.context
    if (0 === e.length) return null
    let i
    i = 1 === e.length ? t.t(De, { email: e[0] }) : t.t(xe, { failedEmails: e.join(", ") })
    const s = t.t(Ee)
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: "user-invite-card" },
        {
          children: [
            (0, n.jsxs)(
              "div",
              Object.assign(
                { className: "user-invite-info" },
                { children: [(0, n.jsx)("span", { className: "icon icon-eye-show" }), (0, n.jsx)("span", Object.assign({ className: "" }, { children: s }))] }
              )
            ),
            (0, n.jsx)("p", Object.assign({ className: "user-invite-msg" }, { children: i }))
          ]
        }
      )
    )
  }
}
Ae.contextType = AppReactContext

const { UNKNOWN_USER: Pe, UNKNOWN_USERS: Oe, INVITE_VISIBLE_MSG: Ie } = PhraseKey.USERS
@G.Z
class ke extends ss.Component {
  render() {
    const { locale: e } = this.context,
      { emails: t } = this.props
    if (0 === t.length) return null
    let i
    i = 1 === t.length ? e.t(Pe, { email: t[0] }) : e.t(Oe, { emails: t.join(", ") })
    const s = e.t(Ie)
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: "user-invite-card" },
        {
          children: [
            (0, n.jsxs)(
              "div",
              Object.assign(
                { className: "user-invite-info" },
                { children: [(0, n.jsx)("span", { className: "icon icon-eye-show" }), (0, n.jsx)("span", Object.assign({ className: "" }, { children: s }))] }
              )
            ),
            (0, n.jsx)("p", Object.assign({ className: "user-invite-msg" }, { children: i }))
          ]
        }
      )
    )
  }
}
ke.contextType = AppReactContext

@G.Z
class Me extends ss.Component {
  constructor(e) {
    super(e),
      (this.inviteUsers = async e => {
        if (0 === e.length) return
        const { noteId: t, message: i } = this.props
        await this.context.commandBinder.issueCommand(new UserInviteCommand(e, i, E.AT, t))
      })
  }
  getInvitees() {
    const { userMentions: e } = this.props,
      t = []
    return (
      e.forEach(e => {
        ;(e.userStatus === UserStatus.MENTIONED || (e.userStatus === UserStatus.KNOWN && e.modelAccess === modelAccessType.PUBLIC)) && t.push(e.email)
      }),
      t
    )
  }
  getFailedEmails() {
    const { userMentions: e } = this.props,
      t = []
    return (
      e.forEach(e => {
        e.userStatus === UserStatus.FAILED && t.push(e.email)
      }),
      t
    )
  }
  render() {
    const { expires: e, noteId: t } = this.props
    if (new Date().getTime() > e) return null
    const { userData: i } = this.context,
      s = i.isInviter(),
      a = this.getInvitees(),
      o = this.getFailedEmails()
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: "user-mentions-unknown" },
        {
          children: [
            s && a.length > 0 && (0, n.jsx)(Te, { invitees: a, modelAccess: E.AT, noteId: t, onInviteUsers: this.inviteUsers }),
            !s && a.length > 0 && (0, n.jsx)(ke, { emails: a }),
            o.length > 0 && (0, n.jsx)(Ae, { failedEmails: o })
          ]
        }
      )
    )
  }
}
Me.contextType = AppReactContext
const { NOTES: je } = PhraseKey.SHOWCASE
function Re(e) {
  const { comment: t, noteId: i, onCancel: a, onViewAttachment: d } = e,
    { user: c, created: l, edited: h, id: u, text: p } = t,
    { analytics: v, commandBinder: w } = (0, ss.useContext)(AppReactContext),
    T = (0, g.v)(),
    C = (0, N.b)(),
    D = (0, o.R)(),
    A = (0, r.T)(),
    S = (0, ss.useRef)(null),
    P = (0, R.l)(),
    I = (0, L.x)(),
    k = (0, V.Q)(),
    B = (0, O.h)(),
    F = H(),
    _ = j()
  if (!k || !P || !T) return null
  function G(e) {
    v.trackToolGuiEvent("notes", e)
  }
  const z = B === u,
    W = t.attachments.values(),
    $ = (0, f.CM)(T, AnnotationType.NOTE, c),
    K = (0, f.Kd)(T, AnnotationType.NOTE, c),
    Z = t.modified.getTime() + 60 * E.E8 * 1e3,
    Y = T.getUserDisplay(c.email),
    J = Y.color,
    q = P.getPlainText(p),
    Q = k.getCommentUserMentions(p, _),
    X =
      !z && ($ || K)
        ? (0, n.jsxs)(
            U.xz,
            Object.assign(
              {
                icon: "more-vert",
                variant: U.Wu.TERTIARY,
                ariaLabel: C.t(PhraseKey.MORE_OPTIONS),
                menuArrow: !0,
                menuClassName: "search-result-menu",
                menuPlacement: "bottom-end"
              },
              {
                children: [
                  $ &&
                    (0, n.jsx)(U.zx, {
                      label: C.t(je.EDIT),
                      size: U.qE.SMALL,
                      variant: U.Wu.TERTIARY,
                      onClick: () => {
                        S.current && (G("notes_click_edit_comment"), w.issueCommand(new NoteCommentEditCommand(t.id)), S.current.edit())
                      }
                    }),
                  K &&
                    (0, n.jsx)(U.zx, {
                      className: "menu-delete-btn",
                      label: C.t(je.DELETE),
                      size: U.qE.SMALL,
                      variant: U.Wu.TERTIARY,
                      onClick: () => {
                        G("notes_click_delete_comment"), w.issueCommand(new CommentDeleteCommand(i, t.id))
                      }
                    })
                ]
              }
            )
          )
        : null
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: x("comment", { active: z }), "data-id": u },
      {
        children: [
          (0, n.jsxs)(
            "div",
            Object.assign(
              { className: "note-header comment-header" },
              {
                children: [
                  (0, n.jsx)(me.C, { badgeStyle: { color: J, borderColor: J }, label: Y.initials }),
                  (0, n.jsxs)(
                    "div",
                    Object.assign(
                      { className: "note-details" },
                      {
                        children: [
                          (0, n.jsx)("span", Object.assign({ className: "note-user" }, { children: Y.name })),
                          (0, n.jsx)("div", Object.assign({ className: "note-subheader" }, { children: l.toLocaleString() }))
                        ]
                      }
                    )
                  ),
                  X
                ]
              }
            )
          ),
          $
            ? (0, n.jsx)(he, {
                ref: S,
                textParser: P,
                linkHandler: I,
                annotationId: i,
                annotationType: AnnotationType.NOTE,
                parentId: u,
                parentType: parentType.COMMENT,
                attachments: W,
                active: z,
                edited: h,
                creating: !1,
                text: p,
                hashtags: F,
                toolPanelLayout: A,
                openModal: D,
                onViewAttachment: d,
                onDoneEditing: (e, n) => {
                  n
                    ? (G("notes_delete_empty_comment"), w.issueCommand(new CommentDeleteCommand(i, t.id)), a())
                    : w.issueCommand(new CommentUpdateCommand(i, t.id, e))
                },
                onCancelEditing: a,
                maxLength: E.Ko
              })
            : (0, n.jsx)(ue.e, {
                text: p,
                textParser: P,
                linkHandler: I,
                annotationType: AnnotationType.NOTE,
                annotationId: i,
                attachments: W,
                edited: h,
                onViewAttachment: d
              }),
          $ && Q.length > 0 && (0, n.jsx)(Me, { noteId: i, message: q, userMentions: Q, expires: Z })
        ]
      }
    )
  )
}
const { NOTES: Le } = PhraseKey.SHOWCASE
function Ve({ noteId: e, replyId: t, active: i, onCancel: a, onReply: d }) {
  const c = (0, N.b)(),
    { commandBinder: l, analytics: h } = (0, ss.useContext)(AppReactContext),
    u = (0, o.R)(),
    p = (0, r.T)(),
    g = (0, R.l)(),
    v = (0, L.x)(),
    f = H()
  if (!g) return null
  return (0, n.jsx)(he, {
    className: "reply-box",
    textParser: g,
    linkHandler: v,
    annotationType: AnnotationType.NOTE,
    annotationId: e,
    parentType: parentType.COMMENT,
    parentId: t,
    attachments: [],
    active: i,
    edited: !1,
    creating: !0,
    text: "",
    hashtags: f,
    toolPanelLayout: p,
    openModal: u,
    placeholder: c.t(Le.REPLY_PLACEHOLDER),
    onClickToEdit: () => {
      h.trackToolGuiEvent("notes", "notes_click_new_comment"), l.issueCommand(new NoteCommentEditCommand(t))
    },
    onDoneEditing: (e, i) => {
      i ? a() : d(t, e)
    },
    onCancelEditing: a,
    maxLength: E.Ko
  })
}
const { NOTES: _e } = PhraseKey.SHOWCASE
function He({ note: e, active: t, onCancelNote: i }) {
  const { analytics: a, commandBinder: o } = (0, ss.useContext)(AppReactContext),
    r = (0, g.v)(),
    d = (0, u.H)(),
    c = (0, N.b)()
  if (!r) return null
  const l = e.comments.get(0)
  function h(e) {
    a.trackToolGuiEvent("notes", e)
  }
  const p = (0, f.CM)(r, AnnotationType.NOTE, e.user),
    v = r.getUserDisplay(e.user.email),
    w = v.color,
    T = !d && !t,
    C = T && (0, f.Kd)(r, AnnotationType.NOTE, e.user),
    E = T && !e.resolved,
    D = T && e.resolved,
    x =
      !d && (p || D || C)
        ? (0, n.jsxs)(
            U.xz,
            Object.assign(
              {
                icon: "more-vert",
                ariaLabel: c.t(PhraseKey.MORE_OPTIONS),
                variant: U.Wu.TERTIARY,
                menuArrow: !0,
                menuClassName: "search-result-menu",
                menuPlacement: "bottom-end"
              },
              {
                children: [
                  p &&
                    (0, n.jsx)(U.zx, {
                      label: c.t(_e.EDIT),
                      size: U.qE.SMALL,
                      variant: U.Wu.TERTIARY,
                      onClick: () => {
                        h("notes_click_edit_note"), l && o.issueCommand(new NoteCommentEditCommand(l.id))
                      }
                    }),
                  D &&
                    (0, n.jsx)(U.zx, {
                      label: c.t(_e.UNRESOLVE),
                      size: U.qE.SMALL,
                      variant: U.Wu.TERTIARY,
                      onClick: () => {
                        h("notes_click_unresolve_note"), o.issueCommand(new NoteResolveCommand(e.id, !1))
                      }
                    }),
                  C &&
                    (0, n.jsx)(U.zx, {
                      className: "menu-delete-btn",
                      label: c.t(_e.DELETE),
                      size: U.qE.SMALL,
                      variant: U.Wu.TERTIARY,
                      onClick: () => {
                        h("notes_click_delete_note"), o.issueCommand(new NoteDeleteCommand(e.id))
                      }
                    })
                ]
              }
            )
          )
        : null,
    A = c.t(_e.MARK_AS_RESOLVED)
  return (0, n.jsxs)(
    "header",
    Object.assign(
      { className: "note-header" },
      {
        children: [
          (0, n.jsx)(me.C, { badgeStyle: { color: w, borderColor: w }, label: v.initials }),
          (0, n.jsxs)(
            "div",
            Object.assign(
              { className: "note-details" },
              {
                children: [
                  (0, n.jsx)("span", Object.assign({ className: "note-user" }, { children: v.name })),
                  (0, n.jsx)("div", Object.assign({ className: "note-subheader" }, { children: e.created.toLocaleString() }))
                ]
              }
            )
          ),
          (0, n.jsxs)(
            U.hE,
            Object.assign(
              { spacing: "small" },
              {
                children: [
                  d && (0, n.jsx)(U.zx, { icon: "close", tooltip: c.t(_e.CANCEL), onClick: i, tooltipOptions: { placement: "bottom-end" } }),
                  E &&
                    (0, n.jsx)(U.zx, {
                      icon: "checkmark",
                      size: U.qE.SMALL,
                      variant: U.Wu.FAB,
                      theme: "dark",
                      tooltip: A,
                      onClick: () => {
                        h("notes_click_resolve_note"), o.issueCommand(new NoteResolveCommand(e.id, !0))
                      }
                    }),
                  T && (0, n.jsx)(Fe.O, { prefix: "note", pin: e, id: e.id, darkTheme: !0, analyticAction: "copy_note_share_link", includeCameraView: !0 }),
                  x
                ]
              }
            )
          )
        ]
      }
    )
  )
}
const { NOTES: Ue } = PhraseKey.SHOWCASE
function Ge({ note: e, onViewAttachment: t, onCancel: i }) {
  var a
  const { commandBinder: d } = (0, ss.useContext)(AppReactContext),
    c = (0, N.b)(),
    l = (0, o.R)(),
    h = (0, r.T)(),
    v = (0, g.v)(),
    f = j(),
    w = (0, ss.useRef)(null),
    T = (0, V.Q)(),
    C = (0, O.h)(),
    D = (0, u.H)(),
    x = H(),
    A = (0, R.l)(),
    S = (0, L.x)(),
    P = e.comments.get(0),
    I = null == P ? void 0 : P.id,
    k = !!C && (C === I || D)
  if (
    ((0, p.U)(NewPinReadyMessage, () => {
      D && Y()
    }),
    (0, ss.useEffect)(() => {
      k && Y()
    }, [k]),
    !T || !A || !v)
  )
    return null
  const B = e.id,
    F = (null === (a = null == P ? void 0 : P.attachments) || void 0 === a ? void 0 : a.values()) || [],
    _ = (null == P ? void 0 : P.text) || "",
    U = (null == P ? void 0 : P.edited) || !1,
    G = (null == P ? void 0 : P.modified.getTime()) + 60 * E.E8 * 1e3,
    z = e.user.id === v.getCurrentUserId(),
    W = !!z && v.isCommenter(),
    $ = A.getPlainText(_),
    K = T.getCommentUserMentions(_, f),
    Z = k ? c.t(Ue.ADD_NOTE_MESSAGE) : void 0,
    Y = () => {
      w.current && C === B && w.current.edit()
    }
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: "note-post" },
      {
        children: [
          (0, n.jsx)(He, { note: e, active: k, onCancelNote: i }),
          W
            ? (0, n.jsx)(he, {
                ref: w,
                textParser: A,
                linkHandler: S,
                annotationId: B,
                annotationType: AnnotationType.NOTE,
                parentId: I || B,
                parentType: parentType.COMMENT,
                attachments: F,
                active: k,
                edited: U,
                creating: D,
                text: _,
                hashtags: x,
                placeholder: Z,
                toolPanelLayout: h,
                openModal: l,
                onViewAttachment: t,
                onDoneEditing: async (e, t) => {
                  t ? i() : D ? await d.issueCommand(new NoteAddCommand(e)) : await d.issueCommand(new NoteSaveChangesCommand(B, e))
                },
                onCancelEditing: i,
                maxLength: E.TM
              })
            : (0, n.jsx)(ue.e, {
                text: _,
                textParser: A,
                linkHandler: S,
                annotationType: AnnotationType.NOTE,
                annotationId: B,
                attachments: F,
                edited: U,
                onViewAttachment: t
              }),
          !D && P && z && K.length > 0 && (0, n.jsx)(Me, { message: $, noteId: B, expires: G, userMentions: K })
        ]
      }
    )
  )
}
function ze({ note: e }) {
  const { commandBinder: t, analytics: i } = (0, ss.useContext)(AppReactContext),
    a = (0, g.v)(),
    o = (0, O.h)(),
    r = (0, u.H)(),
    d = (function (e) {
      const t = (0, I.V)(e),
        [i, n] = (0, ss.useState)(k(t))
      return (
        (0, ss.useEffect)(() => {
          if (!t) return () => {}
          function e() {
            n(k(t))
          }
          const i = t.comments.onChanged(e)
          return (
            e(),
            () => {
              i.cancel()
            }
          )
        }, [t]),
        i
      )
    })(e.id),
    [c, l] = (0, ss.useState)(randomString(11)),
    h = () => {
      t.issueCommand(new CommentCancelChangesCommand())
    },
    p = e => {
      if (d.length) {
        i.trackToolGuiEvent("notes", "notes_click_view_attachment")
        const n = d.filter(e => (0, P.lV)(e))
        n.length > 0 && t.issueCommand(new ToggleViewAttachmentsCommand(!0, n, e))
      }
    },
    v = { annotating: !!o, creating: r },
    y = o === c,
    f = !r && (null == a ? void 0 : a.isCommenter()) && (y || !o)
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: x("note-widget", v) },
      {
        children: [
          e &&
            (0, n.jsx)(Ge, {
              note: e,
              onViewAttachment: p,
              onCancel: () => {
                r ? t.issueCommand(new NoteCancelAddCommand()) : o && h()
              }
            }),
          !r &&
            (0, n.jsx)(
              "div",
              Object.assign(
                { className: "note-comments" },
                {
                  children: e.comments.map((t, i) => (0 === i ? null : (0, n.jsx)(Re, { noteId: e.id, comment: t, onCancel: h, onViewAttachment: p }, t.id)))
                }
              )
            ),
          f &&
            (0, n.jsx)(Ve, {
              replyId: c,
              noteId: e.id,
              active: y,
              onCancel: () => {
                h(), l(randomString(11))
              },
              onReply: (i, n) => {
                t.issueCommand(new CommentAddCommand(e.id, n, i)), l(randomString(11))
              }
            })
        ]
      }
    )
  )
}
const qe = createObservableValue(!1)
function Qe(e) {
  qe.value = e
}
function Xe() {
  return [(0, Je.y)(qe), Qe]
}
function st(e) {
  const { analyticAction: t } = e,
    { analytics: i, commandBinder: a } = (0, ss.useContext)(AppReactContext),
    o = (0, tt.s)(),
    r = (0, l.M)(),
    d = (0, it.e)(null == r ? void 0 : r.id),
    [c, h] = Xe()
  if (!(r && o.length > 1)) return null
  const u = o.findIndex(e => {
    const t = e.id,
      i = e.parentId
    return i && i === (null == r ? void 0 : r.id) && (!d || t === (null == d ? void 0 : d.id))
  })
  return (0, n.jsx)(nt.$, {
    index: u,
    total: o.length,
    disabled: c,
    wrapAround: !0,
    onNavigate: e => {
      const n = o[e]
      if (!n) return
      const s = n.id,
        d = n.parentId
      if (!s || !d) return
      h(!0)
      const c = r ? null : TransitionTypeList.Interpolate
      i.trackToolGuiEvent("notes", t),
        a.issueCommand(new NotesOpenNoteCommentCommand(d, !0, !1, s, c)).then(() => {
          h(!1)
        })
    }
  })
}
const { NOTES: ot } = PhraseKey.SHOWCASE
function rt() {
  const e = (0, O.h)(),
    { commandBinder: t } = (0, ss.useContext)(AppReactContext),
    i = (0, N.b)(),
    o = (0, d.v)(),
    r = (0, Ze.A)(),
    [c] = Xe(),
    l = o && r && (r === ToolsList.SEARCH || r === ToolsList.LAYERS),
    h = l || !o,
    u = !e && !l,
    p = h ? i.t(ot.NAV_BACK) : i.t(ot.NAV_CLOSE),
    g = h ? "back" : "close"
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: "detail-panel-header" },
      {
        children: [
          (0, n.jsx)(at.P, {
            icon: g,
            label: p,
            onClose: () => {
              c ||
                (l
                  ? t.issueCommand(new OpenPreviousToolCommand()).then(() => {
                      t.issueCommand(new ToolBottomPanelCollapseCommand(!1))
                    })
                  : o
                    ? t.issueCommand(new CloseToolCommand(ToolsList.NOTES))
                    : t.issueCommand(new NoteCloseCommand()))
            }
          }),
          u && (0, n.jsx)(st, { analyticAction: "notes_navigate_in_panel" })
        ]
      }
    )
  )
}
function dt({ panelOpen: e, note: t }) {
  const { commandBinder: i } = (0, ss.useContext)(AppReactContext),
    o = (0, g.v)(),
    d = (0, r.T)(),
    c = (0, ss.useRef)(null),
    l = (0, C.Y)(),
    h = (0, u.H)(),
    D = null == t ? void 0 : t.id
  ;(0, p.U)(FocusCommentMessage, e => {
    c.current && c.current.scrollToSelector(`[data-id='${e.commentId}']`)
  }),
    (0, ss.useEffect)(() => {
      c.current && D && c.current.resetScrollTop()
    }, [D])
  const x = !(!t || !o) && (0, f.CM)(o, AnnotationType.NOTE, t.user),
    A = l === NotesPhase.EDITING,
    S = d === ToolPanelLayout.BOTTOM_PANEL,
    P = A && S
  return (0, n.jsxs)(
    We.J,
    Object.assign(
      {
        ref: c,
        open: e,
        className: "note-panel",
        scrollingDisabled: P,
        onClose: () => {
          i.issueCommand(new NoteCloseCommand())
        }
      },
      {
        children: [
          t && !h && (0, n.jsx)(rt, {}),
          t && (0, n.jsx)(ze, { note: t }),
          t &&
            D &&
            S &&
            x &&
            (0, n.jsx)(
              $e.q,
              {
                id: D,
                pin: t,
                pinType: PinType.NOTE,
                onSave: e => {
                  D && i.issueCommand(new NoteAppearanceSaveCommand(D, e))
                },
                onClose: () => {
                  i.issueCommand(new NotePopupEditorToggleCommand(!1))
                },
                colors: E.ZP.colors,
                open: A,
                toolPanelLayout: d
              },
              D
            )
        ]
      }
    )
  )
}

const { NOTES: pt } = PhraseKey.SHOWCASE
function gt() {
  const e = (0, N.b)(),
    t = (0, ht.g)(),
    i = (0, ss.useRef)(null)
  return (0, n.jsx)(
    "div",
    Object.assign(
      { className: "search-filter" },
      {
        children: (0, n.jsxs)(
          U.xz,
          Object.assign(
            { ref: i, icon: "filter", ariaLabel: e.t(pt.FILTER), variant: U.Wu.TERTIARY, size: U.qE.SMALL, menuClassName: "search-filter-menu" },
            {
              children: [
                (0, n.jsxs)(
                  "div",
                  Object.assign(
                    { className: "search-filter-menu-header" },
                    {
                      children: [
                        (0, n.jsx)("div", { children: e.t(pt.FILTER_BY) }),
                        (0, n.jsx)(at.P, {
                          onClose: () => {
                            i.current && i.current.closeMenu()
                          }
                        })
                      ]
                    }
                  )
                ),
                (0, n.jsx)(vt, { id: NotesFilter.ALL, label: e.t(pt.FILTER_ALL), selected: t === NotesFilter.ALL }, NotesFilter.ALL),
                (0, n.jsx)(vt, { id: NotesFilter.OPEN, label: e.t(pt.FILTER_UNRESOLVED), selected: t === NotesFilter.OPEN }, NotesFilter.OPEN),
                (0, n.jsx)(vt, { id: NotesFilter.RESOLVED, label: e.t(pt.FILTER_RESOLVED), selected: t === NotesFilter.RESOLVED }, NotesFilter.RESOLVED)
              ]
            }
          )
        )
      }
    )
  )
}
function vt({ id: e, label: t, selected: i }) {
  const { commandBinder: a, analytics: o } = (0, ss.useContext)(AppReactContext)
  return (0, n.jsx)(mt.e, {
    id: e,
    label: t,
    selected: i,
    onToggled: () => {
      i || (o.trackToolGuiEvent("notes", "notes_list_change_filter"), a.issueCommand(new NotesToggleFilterCommand(e, !0)))
    }
  })
}
const { NOTES: ft } = PhraseKey.SHOWCASE
function wt({ children: e, title: t, hideBadge: i }) {
  const s = (0, N.b)(),
    o = (0, ct.A)(),
    r = (0, tt.s)().length,
    d = (0, n.jsx)(yt.B, { filter: (0, n.jsx)(gt, {}) }),
    c = t || s.t(o ? ft.COMMENTS : ft.NOTES, r)
  return (0, n.jsx)(lt.L, Object.assign({ toolId: ToolsList.NOTES, className: "notes-list-panel", title: c, subheader: d, hideBadge: i }, { children: e }))
}
function bt({ children: e, title: t, hideBadge: i }) {
  const m = (0, o.R)(),
    p = (0, r.T)(),
    g = (0, d.v)(),
    v = (0, l.M)(),
    y = (function () {
      const e = (0, l.M)(),
        t = (0, h.Y)()
      return (null == e ? void 0 : e.id) === (null == t ? void 0 : t.id) ? e : null
    })(),
    f = (0, u.H)(),
    [w, b] = (0, ss.useState)(y),
    T = g
  ;(0, ss.useEffect)(() => {
    v && (null == v ? void 0 : v.id) !== (null == w ? void 0 : w.id) && b(v)
  }, [null == v ? void 0 : v.id])
  const C = f ? y : v,
    E = p === ToolPanelLayout.BOTTOM_PANEL,
    D = m && m !== c.P.CONFIRM,
    x = !(!C || (E && D))
  return (0, n.jsxs)(n.Fragment, {
    children: [(0, n.jsx)(dt, { panelOpen: x, note: C || w }), !T && (0, n.jsx)(wt, Object.assign({ title: t, hideBadge: i }, { children: e }))]
  })
}
export const s = bt
