import o from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import * as Y from "./11866"
import * as Ee from "./11889"
import { useAnalytics } from "./19564"
import * as _ from "./21149"
import * as W from "./31981"
import * as $ from "./33338"
import * as j from "./39496"
import * as A from "./4311"
import * as x from "./44761"
import { useDataHook } from "./45755"
import * as oe from "./51978"
import { TextParser } from "./52528"
import * as C from "./54253"
import * as R from "./61092"
import * as N from "./63548"
import * as O from "./6608"
import * as P from "./66102"
import * as B from "./72252"
import * as K from "./72475"
import * as X from "./78197"
import * as L from "./84242"
import * as Z from "./84426"
import * as u from "./86388"
import * as h from "./96766"
import { AnnotationCloseCommand, AnnotationDockCommand, AnnotationSelectCommand, AnnotationsCloseBillboardCommand } from "../command/annotation.command"
import { DockObjectTagCommand } from "../command/objectTag.command"
import * as H from "../const/25071"
import * as re from "../const/48945"
import { TagBillboardDockKey, TagBillboardShareKey } from "../const/48945"
import { PinPreviewDirectionType } from "../const/62612"
import { AnnotationType } from "../const/annotationType.const"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { ObjectTagsData } from "../data/object.tags.data"
import { TagData } from "../data/tag.data"
import { AnnotationAttachmentClickedMessage } from "../message/annotation.message"
const { UP: m, DOWN: p, LEFT: g, RIGHT: v, UP_LEFT: y, UP_RIGHT: f, DOWN_LEFT: w, DOWN_RIGHT: b } = PinPreviewDirectionType,
  T = (0, s.memo)(({ className: e, onClick: t, children: i }) => {
    const a = (0, h.v)(),
      [r, d] = (0, s.useState)(null),
      { width: c, height: l, ref: T } = (0, u.Z)(),
      [{ width: C, height: E }, D] = (0, s.useState)({ width: 0, height: 0 }),
      { ref: x } = (0, u.Z)({
        onResize: ({ width: e, height: t }) => {
          null === r && D({ width: e || 0, height: t || 0 })
        }
      })
    return (
      (0, s.useEffect)(() => {
        if (c && l && C && E && a) {
          let e = r
          const t = a.y < E,
            i = a.y > l - E,
            n = a.x < C,
            s = a.x > c - C
          t && i
            ? (e = s && !n ? g : v)
            : t
              ? (e = n ? b : s ? w : p)
              : i
                ? (e = n ? f : s ? y : m)
                : n && s
                  ? (e = t ? p : m)
                  : n
                    ? (e = v)
                    : s
                      ? (e = g)
                      : null === e && (e = v),
            e !== r && d(e)
        }
      }, [a, c, l, C, E, r]),
      (0, n.jsx)(
        "div",
        Object.assign(
          { ref: T, className: "annotations-preview-layer" },
          {
            children:
              a &&
              i &&
              (0, n.jsx)(
                "div",
                Object.assign(
                  {
                    ref: x,
                    className: o("annotation-preview", `annotation-preview-${r}`, e),
                    style: { top: a.y, left: a.x, visibility: null === r ? "hidden" : void 0 },
                    onClick: t
                  },
                  { children: i }
                )
              )
          }
        )
      )
    )
  })
const { NOTES: I } = PhraseKey.SHOWCASE
function k({ comment: e, noteView: t }) {
  const i = t ? t.created : e.created,
    { userData: a } = (0, s.useContext)(AppReactContext),
    o = (0, P.b)(),
    r = t ? t.user.email : e.user.email,
    d = a.getUserDisplay(r),
    c = d.color,
    l = t ? t.comments.length - 1 : 0,
    h = o.t(I.REPLIES, l),
    u = "" === e.text && !(e.attachments.length > 0) ? o.t(I.CONTENT_DELETED) : i.toLocaleString()
  return (0, n.jsxs)(
    "header",
    Object.assign(
      { className: "note-header" },
      {
        children: [
          (0, n.jsx)(O.C, { label: d.initials, badgeStyle: { color: c, borderColor: c } }),
          (0, n.jsxs)(
            "div",
            Object.assign(
              { className: "note-details" },
              {
                children: [
                  (0, n.jsx)("span", Object.assign({ className: "note-user" }, { children: d.name })),
                  l > 0 && (0, n.jsx)("span", Object.assign({ className: "note-summary-info note-replies" }, { children: h })),
                  (0, n.jsx)("div", Object.assign({ className: "note-subheader" }, { children: u }))
                ]
              }
            )
          )
        ]
      }
    )
  )
}
function M(e) {
  const { attachments: t } = e,
    { analytics: i } = (0, s.useContext)(AppReactContext)
  if (!(t.length > 0)) return null
  return (0, n.jsx)(N.T, {
    attachments: t,
    onClick: (t, n) => {
      i.trackToolGuiEvent("notes", "notes_preview_click_attachment"), t.stopPropagation(), e.onClick(n)
    }
  })
}
function V({ text: e, noteId: t }) {
  const i = (0, R.l)(),
    s = (0, L.x)()
  return (0, n.jsx)(
    "div",
    Object.assign(
      { className: o("note-post", { "note-summary-info": !e }) },
      { children: e && i && (0, n.jsx)(j.e, { text: e, textParser: i, linkHandler: s, maxLength: 150, annotationType: AnnotationType.NOTE, annotationId: t }) }
    )
  )
}
function F(e) {
  const t = (0, P.b)(),
    { moreAttachmentsCount: i } = e
  if (0 === i) return null
  const s = t.t(PhraseKey.SHOWCASE.ATTACHMENTS.MORE_ATTACHMENT, i)
  return (0, n.jsx)(
    "div",
    Object.assign(
      { className: "attachment attachments-truncated" },
      {
        children: (0, n.jsx)(
          "div",
          Object.assign(
            { className: "attachment-view attachment-other " },
            {
              children: (0, n.jsx)(
                "div",
                Object.assign({ className: "attachment-label" }, { children: (0, n.jsx)("div", Object.assign({ className: "file-label" }, { children: s })) })
              )
            }
          )
        )
      }
    )
  )
}
const { ANNOTATIONS: U } = PhraseKey.SHOWCASE
function G(e) {
  const { previewId: t } = e,
    i = (0, s.useRef)(null),
    a = (0, P.b)(),
    { commandBinder: c } = (0, s.useContext)(AppReactContext),
    l = (0, x.e)(t),
    h = (0, A.V)(t)
  if (((0, s.useEffect)(() => (h && i.current && i.current.focus(), () => {}), [i.current, h]), !h)) return null
  const u = h.comments.get(0),
    m = u && u.attachments.length > 0,
    p = u.attachments.values(),
    g = (0, _.Ug)(p),
    v = (0, _.ae)(p),
    y = v.slice(0, H.Ii),
    f = Math.max(v.length - H.Ii, 0),
    w = h.comments.length > 1 || f > 0,
    b = a.t(U.READ_MORE_MESSAGE),
    T = o("annotation-preview-contents", "note-preview-contents", { "viewable-media": m })
  return (0, n.jsxs)(
    "div",
    Object.assign(
      {
        ref: i,
        role: "dialog",
        tabIndex: 0,
        className: T,
        onClick: t => {
          t.stopPropagation(), e.onClick()
        },
        onKeyDown: e => {
          "Escape" === e.code && (e.stopPropagation(), c.issueCommand(new AnnotationsCloseBillboardCommand()))
        }
      },
      {
        children: [
          u &&
            (0, n.jsxs)(n.Fragment, {
              children: [
                (0, n.jsx)(M, { attachments: g, onClick: e.onClick }),
                (0, n.jsx)(k, { noteView: h, comment: u }),
                (0, n.jsx)(V, { text: u.text, noteId: t }),
                (0, n.jsx)(
                  B.s,
                  Object.assign({ annotationType: AnnotationType.NOTE, attachments: y }, { children: (0, n.jsx)(F, { moreAttachmentsCount: f }) })
                )
              ]
            }),
          l &&
            (0, n.jsxs)(
              "div",
              Object.assign({ className: "nested-comment-preview" }, { children: [(0, n.jsx)(k, { comment: l }), (0, n.jsx)(V, { text: l.text, noteId: t })] })
            ),
          w && (0, n.jsx)("div", Object.assign({ className: "link link-more" }, { children: b }))
        ]
      }
    )
  )
}
const { TAGS: q } = PhraseKey.SHOWCASE
function Q(e) {
  const { tag: t, tagType: i, capabilities: a } = e,
    { analytics: c, commandBinder: l, editMode: h, locale: u } = (0, s.useContext)(AppReactContext),
    m = h ? u.t(q.EDIT_TAG_LABEL) : void 0,
    p = h ? "toggle-pencil" : "dock",
    g = h ? void 0 : u.t(q.DOCK_TAG_LABEL),
    v = t.id,
    y = (0, s.useCallback)(
      e => {
        e.stopPropagation(),
          h && i === AnnotationType.OBJECT
            ? (c.trackToolGuiEvent("object_tags", "object_tags_billboard_edit_tag"), l.issueCommand(new DockObjectTagCommand(v)))
            : (c.trackToolGuiEvent("tags", h ? "tags_billboard_edit_tag" : "tags_billboard_dock_tag"), l.issueCommand(new AnnotationDockCommand(v, i)))
      },
      [v, h, i]
    )
  return i !== AnnotationType.OBJECT || h
    ? a.share || a.dock
      ? (0, n.jsxs)(
          "header",
          Object.assign(
            { className: o("tag-billboard-header", { editable: h }) },
            {
              children: [
                !h &&
                  a.share &&
                  (0, n.jsx)(Y.O, {
                    prefix: "tag",
                    pin: t,
                    id: t.id,
                    darkTheme: !0,
                    includeCameraView: !0,
                    analyticAction: "tags_copy_share_link",
                    buttonVariant: Z.Wu.TERTIARY
                  }),
                a.dock &&
                  (0, n.jsx)(Z.zx, {
                    icon: p,
                    label: m,
                    size: Z.qE.SMALL,
                    variant: Z.Wu.TERTIARY,
                    theme: "dark",
                    onClick: y,
                    reverse: !0,
                    tooltip: g,
                    tooltipOptions: { placement: "bottom" }
                  })
              ]
            }
          )
        )
      : (0, n.jsx)("div", {})
    : null
}
const ne = useDataHook(TagData)
const ae = useDataHook(ObjectTagsData)
const { ANNOTATIONS: de } = PhraseKey.SHOWCASE
function ce(e) {
  const t = new TextParser({ links: !0 }),
    i = useAnalytics(),
    { commandBinder: a, editMode: c } = (0, s.useContext)(AppReactContext),
    l = (0, C.P)(),
    h = (0, W.w)(),
    u = ne(),
    m = ae(),
    p = (0, P.b)(),
    g = (0, $.L)(),
    v = (0, s.useRef)(null),
    [y, f] = (0, s.useState)(!1),
    [w, b] = (0, s.useState)(null),
    [T, E] = (0, s.useState)({ dock: !0, share: !0 }),
    x = (0, oe.y)(TagBillboardShareKey, !0),
    A = (0, oe.y)(TagBillboardDockKey, !0),
    S = "true" === (0, oe.y)(re.QM, !1),
    O = (0, s.useCallback)(
      e => {
        i.trackToolGuiEvent("tags", e)
      },
      [i]
    ),
    I = (0, s.useCallback)(
      (t, i) => {
        O("tags_billboard_click_attachment"), e.onClick(i)
      },
      [e, O]
    ),
    k = (0, s.useCallback)(
      t => {
        O(c ? "tags_billboard_click_to_edit" : "tags_billboard_click_to_dock"), t.stopPropagation(), e.onClick()
      },
      [e, O, c]
    ),
    N = (0, s.useCallback)(e => {
      f(e)
    }, [])
  ;(0, s.useEffect)(() => (w && v.current && v.current.focus(), () => {}), [w, v.current]),
    (0, s.useEffect)(() => {
      const t = e.previewType,
        i = e.previewId
      if (h && u)
        switch (t) {
          case AnnotationType.OBJECT:
            const e = null == m ? void 0 : m.getObjectTag(i)
            if (!e) return
            const t = e.mattertagId ? u.getTag(e.mattertagId) : void 0,
              s = e.toTagView(t)
            b(Object.assign({}, s))
            break
          case AnnotationType.TAG:
            const a = u.getTag(i),
              o = h.getTagView(i)
            if (!a || !o) return void b(null)
            function n() {
              const e = null == l ? void 0 : l.getCapabilities(i)
              return e && E(Object.assign({}, e)), e
            }
            b(Object.assign({}, o))
            const d = n(),
              c = null == d ? void 0 : d.onChanged(n),
              p = a.onChanged(() => {
                const e = h.getTagView(i)
                e && b(Object.assign({}, e))
              })
            return () => {
              null == c || c.cancel(), p.cancel()
            }
        }
    }, [l, u, null == m ? void 0 : m.collection, e.previewId, e.previewType, h])
  if (!w) return null
  const { previewType: M } = e,
    { id: R, label: L, attachments: V, description: U, keywords: G } = w,
    Z = (0, _.Ug)(V),
    Y = Z.length > 0,
    J = (0, _.ae)(V),
    q = Math.max(J.length - H.Ii, 0)
  q > 0 && (J.length = H.Ii)
  const te = p.t(de.READ_MORE_MESSAGE),
    ie = !L && !U,
    se = (0, n.jsx)(K.v, { attachments: Z, onClick: I }),
    ce = L && (0, n.jsx)("div", Object.assign({ className: "tag-billboard-title" }, { children: L })),
    le = o("annotation-preview-contents", "tag-billboard", { "viewable-media": Y, "media-only": ie, "has-keywords": G && G.length > 0 })
  return (0, n.jsxs)(
    "div",
    Object.assign(
      {
        ref: v,
        role: "dialog",
        tabIndex: 0,
        className: le,
        onClick: k,
        onKeyDown: e => {
          "Escape" === e.code && (e.stopPropagation(), a.issueCommand(new AnnotationsCloseBillboardCommand()))
        }
      },
      {
        children: [
          (0, n.jsx)(Q, { tag: w, tagType: M, capabilities: { share: x && T.share, dock: A && T.dock } }),
          (0, n.jsxs)(
            "div",
            Object.assign(
              { className: "tag-billboard-contents" },
              {
                children: [
                  L
                    ? (() => {
                        const e = S ? ce : se,
                          t = S ? se : ce
                        return (0, n.jsxs)(n.Fragment, { children: [e, t] })
                      })()
                    : se,
                  U &&
                    (0, n.jsx)(
                      "div",
                      Object.assign(
                        { className: "tag-billboard-description" },
                        {
                          children: (0, n.jsx)(j.e, {
                            text: U,
                            textParser: t,
                            linkHandler: g,
                            annotationType: AnnotationType.TAG,
                            annotationId: R,
                            maxLength: 100,
                            maxLines: 4,
                            onTruncationChange: N
                          })
                        }
                      )
                    ),
                  G && (0, n.jsx)(X.s, { keywords: G, theme: "dark", className: "tag-previewer-keywords" }),
                  J.length > 0 &&
                    (0, n.jsx)(
                      B.s,
                      Object.assign({ annotationType: AnnotationType.TAG, attachments: J }, { children: (0, n.jsx)(F, { moreAttachmentsCount: q }) })
                    ),
                  y &&
                    (0, n.jsx)(
                      "div",
                      Object.assign(
                        { className: "annotation-read-more" },
                        { children: (0, n.jsx)("span", Object.assign({ className: "link link-more" }, { children: te })) }
                      )
                    )
                ]
              }
            )
          )
        ]
      }
    )
  )
}
const le = (0, s.memo)(({ notesEnabled: e, openModal: t }) => {
  const { messageBus: i, analytics: a, commandBinder: l } = (0, s.useContext)(AppReactContext),
    { billboardAnnotation: h, selectedAnnotation: u, dockedAnnotation: m } = (0, Ee.m)((0, C.P)()) || {},
    p = (null == h ? void 0 : h.annotationType) === AnnotationType.TAG,
    g = (null == h ? void 0 : h.annotationType) === AnnotationType.OBJECT,
    v = e && (null == h ? void 0 : h.annotationType) === AnnotationType.NOTE,
    y = (0, s.useCallback)(() => {
      h && (a.trackGuiEvent(`annotations_dock_${h.annotationType}`), l.issueCommand(new AnnotationDockCommand(h.id, h.annotationType)))
    }, [a, h, l]),
    f = (0, s.useCallback)(() => {
      h && (a.trackGuiEvent(`annotations_select_${h.annotationType}`), l.issueCommand(new AnnotationSelectCommand(h.id, h.annotationType)))
    }, [a, h, l]),
    w = (0, s.useCallback)(
      e => {
        if (h) {
          a.trackGuiEvent(v ? "click_note_preview" : "tags_click_tag_billboard")
          const { id: t, annotationType: n } = h
          ;(e && !m) || g || y(), e && i.broadcast(new AnnotationAttachmentClickedMessage(n, t, e))
        }
      },
      [h, a, m, g, v, y, i]
    ),
    b = (0, s.useCallback)(() => {
      if (h)
        if (u) l.issueCommand(new AnnotationCloseCommand(h.id, h.annotationType))
        else {
          v || m ? y() : f()
        }
    }, [h, l, y, m, v, f, u])
  return t
    ? null
    : (0, n.jsx)(
        T,
        Object.assign(
          { className: o({ "tag-preview": p || g, "note-preview": v }), onClick: b },
          {
            children:
              p || g
                ? (0, n.jsx)(ce, { previewId: h.id, previewType: h.annotationType, onClick: w })
                : v
                  ? (0, n.jsx)(G, { previewId: h.id, onClick: w })
                  : null
          }
        ),
        null == h ? void 0 : h.id
      )
})
export const E = le
