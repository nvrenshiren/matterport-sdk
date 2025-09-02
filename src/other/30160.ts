import h from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"
import * as c from "./15501"
import { useAnalytics } from "./19564"
import * as W from "./22804"
import * as ve from "./26340"
import * as D from "./31981"
import * as z from "./32875"
import * as y from "./33023"
import * as I from "../utils/38042"
import * as X from "./38242"
import * as T from "./38490"
import * as l from "./40216"
import * as G from "./47397"
import * as oe from "./49627"
import * as N from "./51978"
import * as b from "./54963"
import * as se from "./54975"
import * as Re from "./56843"
import * as we from "./58776"
import * as le from "./6493"
import * as v from "./65428"
import * as g from "./65596"
import * as m from "./66102"
import * as Te from "./72252"
import * as R from "./73085"
import * as En from "./74554"
import * as re from "./75182"
import * as E from "./7688"
import * as O from "./84426"
import * as B from "./89936"
import * as _e from "./93958"
import * as V from "./96348"
import { ObjectInsightsFeatureKey } from "./96776"
import * as ae from "./97593"
import { AttachmentRemoveCommand, ToggleViewAttachmentsCommand } from "../command/attachment.command"
import { CreateObjectTagCommand } from "../command/objectTag.command"
import { TagCancelEditsCommand, TagCloseCommand, TagSaveCommand, TagUpdateOpenTagviewCommand } from "../command/tag.command"
import * as be from "../const/25071"
import * as Se from "../const/36892"
import * as a from "../const/73536"
import * as Jj from "../const/998"
import { annotationTextMax, tagTextMax } from "../const/tag.const"
import { ToolPanelLayout, ToolsList } from "../const/tools.const"
import { AppReactContext } from "../context/app.context"
import { TagsViewData } from "../data/tags.view.data"
function S() {
  return (0, E.fo)().length > 0
}
;(0, En.M)("isUploading", S)

import { Color } from "three"
import * as k from "./7439"
import { OpenPreviousToolCommand, ToolBottomPanelCollapseCommand } from "../command/tool.command"
import { ToggleModalCommand } from "../command/ui.command"
import { AttachmentCategory } from "../const/32347"
import { FeaturesTagIconsKey } from "../const/48945"
import { AnnotationType } from "../const/annotationType.const"
import { BlockTypeList } from "../const/block.const"
import { PhraseKey } from "../const/phrase.const"
import { parentType } from "../const/typeString.const"
import { sameArray } from "../utils/38042"
function L(e) {
  const t = (0, k.g)(),
    n = (0, E.a_)(),
    [i, r] = (0, s.useState)(C(t, e, n))
  return (
    (0, s.useEffect)(() => {
      if (!t) return () => {}
      function i() {
        r(C(t, e, n))
      }
      const s = t.removals.onChanged(i)
      return i(), () => s.cancel()
    }, [t, e, n]),
    i
  )
}
function C(e, t, n) {
  const i = t.concat(n)
  return e ? i.filter(t => !e.removals.has(t.id)) : i
}
const j = (0, R.M)(TagsViewData, "openTagIsDirty", !1)
const $ = /[&?,%]/,
  K = `Keyword may not include these characters: "${(e => {
    const t = e.toString()
    return t
      .substring(t.indexOf("[") + 1, t.lastIndexOf("]"))
      .split("")
      .join('", "')
  })($)}"`,
  Y = e => ({
    id: e,
    text: e
  }),
  q = e => ($.test(e) ? K : void 0)
function Z({ keywords: e, availableKeywords: t, onChange: n }) {
  const s = (0, m.b)(),
    r = s.t(PhraseKey.WORKSHOP.MATTERTAGS.KEYWORDS_PLACEHOLDER),
    a = s.t(PhraseKey.WORKSHOP.MATTERTAGS.KEYWORDS_HELP_MESSAGE),
    o = s.t(PhraseKey.WORKSHOP.MATTERTAGS.KEYWORDS_MAXIMUM_TOKENS_MESSAGE)
  return (0, i.jsx)(O.rR, {
    placeholder: r,
    initialTokens: e.map(Y),
    options: t.map(Y),
    onChange: e => {
      n(e.map(e => e.text))
    },
    maxLength: 30,
    maxTokens: 10,
    maxTokensValidationMsg: a,
    helpMessage: o,
    validateNewToken: q
  })
}
var ee = PhraseKey.WORKSHOP.PINS,
  te = PhraseKey.COLORS
const ne = Jj.U.cerulean,
  ie = ({ selectedColor: e, onChange: t }) => {
    const n = (0, m.b)(),
      r = n.t(ee.COLOR_NO_SELECTION_TEXT),
      a = (0, s.useMemo)(
        () =>
          Object.entries(Jj.U).map(([e, t]) => ({
            text: n.t(te[e.toUpperCase()]),
            id: t,
            value: t
          })),
        [n]
      )
    return (0, i.jsx)(O.Q5, {
      onChange: t,
      options: a,
      selectedColor: e || ne,
      size: O.qE.LARGE,
      align: O.jr.JUSTIFY,
      noSelectionText: r,
      selectMenuClassName: "pin-color-select-menu"
    })
  }
var ce = PhraseKey.WORKSHOP.PINS
const de = "_recent",
  ue = "_space",
  he = (e, t) => {
    const [, n, ...i] = e.split("_"),
      s = i[i.length - 1],
      r = 1 === (a = s).length ? `Character ${a}` : a
    var a
    return {
      id: e,
      text: r,
      tooltip: r,
      group: t || n
    }
  },
  pe = e => e.startsWith("public_") && re.g.includes(e),
  me = re.g.filter(e => e.startsWith("public_")).map(e => he(e)),
  fe = (0, s.forwardRef)(({ initialValue: e, onChange: t }, n) => {
    const r = (0, le.P)(),
      a = (0, m.b)(),
      [o, l] = (0, oe._)("matterport_recent_icons", []),
      c = (0, s.useCallback)(
        e => {
          if ((t && t(e), e && !o.includes(e))) {
            const t = [e, ...o]
            ;(t.length = Math.min(t.length, 14)), l(t)
          }
        },
        [t, o, l]
      ),
      d = (0, s.useCallback)(() => {
        t && t(void 0)
      }, [t]),
      {
        allOptions: u,
        hasRecentOptions: h,
        hasSpaceOptions: p
      } = (0, s.useMemo)(() => {
        const e = []
        null == r ||
          r.iteratePins(t => {
            t.icon && !e.includes(t.icon) && e.push(t.icon)
          })
        const t = e.filter(pe).map(e => he(e, ue)),
          n = o.filter(pe).map(e => he(e, de))
        return {
          hasRecentOptions: n.length > 0,
          hasSpaceOptions: t.length > 0,
          allOptions: [...me, ...n, ...t]
        }
      }, [o, r]),
      f = (0, s.useMemo)(
        () =>
          [
            h && {
              id: de,
              icon: "public_symbols_clock",
              displayText: a.t(ce.ICON_GROUP_RECENT)
            },
            p && {
              id: ue,
              icon: "public_symbols_cube",
              displayText: a.t(ce.ICON_GROUP_IN_SPACE)
            },
            {
              id: "people",
              icon: "public_people_face-smile",
              displayText: a.t(ce.ICON_GROUP_PEOPLE)
            },
            {
              id: "furniture",
              icon: "public_furniture_chair",
              displayText: a.t(ce.ICON_GROUP_FURNITURE)
            },
            {
              id: "buildings",
              icon: "public_buildings_buildings",
              displayText: a.t(ce.ICON_GROUP_BUILDINGS)
            },
            {
              id: "objects",
              icon: "public_objects_box",
              displayText: a.t(ce.ICON_GROUP_OBJECTS)
            },
            {
              id: "symbols",
              icon: "public_symbols_shapes",
              displayText: a.t(ce.ICON_GROUP_SYMBOLS)
            },
            {
              id: "characters",
              icon: "public_characters_circle-1",
              displayText: a.t(ce.ICON_GROUP_CHARACTERS)
            }
          ].filter(e => !!e),
        [h, p]
      ),
      g = a.t(ce.ICON_PLACEHOLDER),
      v = a.t(ce.SEARCH_PLACEHOLDER),
      y = (0, s.useCallback)(
        e =>
          a.t(ce.SEARCH_NO_RESULTS, {
            searchTerm: e
          }),
        []
      )
    return (0, i.jsx)(O.xG, {
      options: u,
      selectedIcon: e,
      onChange: c,
      groups: f,
      align: O.jr.JUSTIFY,
      placeholder: g,
      searchPlaceholder: v,
      getNoResultsText: y,
      allowClear: !0,
      onClear: d,
      scrollbarComponent: ae.T,
      selectMenuClassName: "pin-icon-select-menu"
    })
  }),
  ge = ({ label: e, pinAppearance: t, onChange: n, tagIconsEnabled: r, hideStemEditor: a, tabIndex: o }) => {
    const l = useAnalytics(),
      c = (0, X.e)(),
      d = (0, s.useCallback)(
        e => {
          l.trackGuiEvent("pin_change_icon", {
            tool: c
          }),
            n({
              icon: e
            })
        },
        [n, l]
      ),
      u = (0, s.useCallback)(
        e => {
          l.trackGuiEvent("pin_change_color", {
            tool: c
          }),
            n({
              color: e
            })
        },
        [n, l]
      ),
      h = (0, s.useCallback)(
        e => {
          l.trackGuiEvent(e ? "pin_show_stem" : "pin_hide_stem", {
            tool: c
          }),
            n({
              stemEnabled: e
            })
        },
        [n, l]
      ),
      p = (0, s.useCallback)(
        e => {
          l.trackGuiEvent("pin_change_stem_height", {
            tool: c
          }),
            n({
              stemLength: e
            })
        },
        [n, l]
      )
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: "pin-appearance-editor"
        },
        {
          children: [
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "h6"
                },
                {
                  children: e
                }
              )
            ),
            r &&
              (0, i.jsx)(fe, {
                initialValue: t.icon,
                onChange: d
              }),
            (0, i.jsx)(ie, {
              onChange: u,
              selectedColor: t.color
            }),
            !a &&
              (0, i.jsx)(se.r, {
                stemLength: t.stemLength || 0.3048,
                stemEnabled: t.stemEnabled || !1,
                onLengthUpdate: p,
                onLengthChanged: p,
                onStemEnabledChanged: h,
                variant: "inline-value",
                tabIndex: o
              })
          ]
        }
      )
    )
  }
const { MATTERTAGS: Ae } = PhraseKey.WORKSHOP
function Ne({ tag: e, onViewAttachments: t }) {
  const { id: n, attachments: a } = e,
    { commandBinder: o, analytics: l } = (0, s.useContext)(AppReactContext),
    c = (0, m.b)(),
    d = (0, E.eB)(),
    u = (0, E.fo)(),
    p = u.length > 0,
    f = L(a).filter(e => e.category === AttachmentCategory.UPLOAD),
    g = f.length + u.length,
    v = g >= Se.yk,
    y = e => {
      const t = Array.from(e)
      e.length + g > Se.yk && t.splice(Se.yk - g), o.issueCommand(new x.It(n, parentType.MATTERTAG, t))
    },
    b = 0 === g && 0 === d.length,
    S = v ? c.t(Ae.MAX_ATTACHMENTS_MESSAGE, Se.yk) : p ? c.t(Ae.UPLOAD_IN_PROGRESS) : b ? void 0 : c.t(Ae.UPLOAD_FILE),
    O = !v && !p,
    T = c.t(Ae.DROP_FILES_MESSAGE),
    _ = (0, i.jsx)(we.p, {
      addFileLabel: c.t(Ae.ADD_FILE),
      enabled: O,
      id: `file-upload-tag-${n}`,
      onUpload: e => {
        l.trackToolGuiEvent("tags", "tags_files_chosen"), y(e)
      },
      showAddFileLable: b,
      tooltip: S
    })
  return (0, i.jsxs)(
    _e.Z,
    Object.assign(
      {
        className: h("tag-attachments", {
          empty: b
        }),
        onDropped: e => {
          l.trackToolGuiEvent("tags", "tags_files_dropped"), y(e)
        },
        disabled: !O
      },
      {
        children: [
          (0, i.jsx)(
            Te.s,
            Object.assign(
              {
                annotationType: AnnotationType.TAG,
                parentId: n,
                inline: !0,
                canDelete: !0,
                attachments: f,
                onViewAttachment: t
              },
              {
                children: !b && _
              }
            )
          ),
          b &&
            (0, i.jsxs)(i.Fragment, {
              children: [
                _,
                (0, i.jsx)(
                  "div",
                  Object.assign(
                    {
                      className: "upload-msg"
                    },
                    {
                      children: (0, i.jsx)("div", {
                        children: T
                      })
                    }
                  )
                )
              ]
            })
        ]
      }
    )
  )
}
function Ie({ tag: e, onViewAttachments: t, handleEmbedValidation: n }) {
  const { id: a, attachments: o } = e,
    { commandBinder: l, analytics: c } = (0, s.useContext)(AppReactContext),
    d = L(o),
    [u, h] = (0, s.useState)(d.find(e => e.category === AttachmentCategory.EXTERNAL) || null)
  ;(0, s.useEffect)(() => {
    h(d.find(e => e.category === AttachmentCategory.EXTERNAL) || null)
  }, [d])
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "tag-editor-embeds"
      },
      {
        children: [
          (0, i.jsx)(V.M, {
            url: (null == u ? void 0 : u.src) || "",
            parentId: a,
            parentType: parentType.MATTERTAG,
            onEmbed: e => {
              c.trackToolGuiEvent("tags", "tags_editor_save_embed"), h(e)
              const t = d.find(t => t.category === AttachmentCategory.EXTERNAL && t.id !== e.id)
              t && l.issueCommand(new AttachmentRemoveCommand(t))
            },
            onEmbedCleared: () => {
              c.trackToolGuiEvent("tags", "tags_editor_clear_embed"), u && l.issueCommand(new AttachmentRemoveCommand(u))
            },
            onValidationPhaseChange: n,
            tabIndex: 0
          }),
          u &&
            (0, i.jsx)(Te.s, {
              annotationType: AnnotationType.TAG,
              canDelete: !0,
              inline: !1,
              attachments: u ? [u] : [],
              onViewAttachment: t
            })
        ]
      }
    )
  )
}
const { MATTERTAGS: Pe, OBJECT_TAG_SUGGESTION: xe } = PhraseKey.WORKSHOP
function ke(e) {
  const { manager: t, openTagView: n, isCreating: o, closing: l } = e,
    {
      id: u,
      anchorPosition: p,
      stemNormal: f,
      floorId: g,
      roomId: v,
      objectAnnotationId: y,
      attachments: b,
      keywords: S,
      enabled: T,
      stemEnabled: k,
      stemLength: C,
      color: R,
      icon: M,
      label: $
    } = n,
    { commandBinder: K, analytics: Y } = (0, s.useContext)(AppReactContext),
    q = (0, c.R)(),
    Q = (0, m.b)(),
    X = (0, N.y)(ObjectInsightsFeatureKey, !1),
    J = (0, N.y)(FeaturesTagIconsKey, !1),
    ee = !y && J,
    [te, ne] = (0, s.useState)(!1),
    ie = (function (e) {
      const t = (0, D.w)(),
        [n, i] = (0, s.useState)((null == t ? void 0 : t.getTagView(e)) || null)
      return (
        (0, s.useEffect)(() => {
          if (!t) return () => {}
          function n() {
            i((null == t ? void 0 : t.getTagView(e)) || null)
          }
          const s = t.getCollection().onElementChanged({
            onAdded: n,
            onUpdated: n,
            onRemoved: n
          })
          return n(), () => s.cancel()
        }, [t, e]),
        n
      )
    })(u),
    se = j(),
    [re, ae] = (0, s.useState)(!1),
    [oe, le] = (0, s.useState)(!1),
    [ce, de] = (0, s.useState)(V.p.NONE),
    [ue, he] = (0, s.useState)(n.description),
    pe = (0, s.useRef)(null),
    [me, fe] = (0, s.useState)(!1),
    [Ee, Se] = (0, s.useState)(null),
    Oe = (0, E.a_)(),
    Te = (0, E.rc)(),
    _e = (0, E.fo)(),
    we = _e.length > 0,
    Ae = L(b),
    ke = Ae.filter(e => e.category === AttachmentCategory.UPLOAD).length + _e.length,
    Le = Oe.filter(e => e.category === AttachmentCategory.UPLOAD),
    [Ce, De] = (0, s.useState)(Ae.find(e => e.category === AttachmentCategory.EXTERNAL) || null),
    Re = (0, s.useCallback)(() => {
      let e
      return (e = (null == pe ? void 0 : pe.current) ? pe.current.getMarkdown() : ue), e.trim()
    }, [ue, pe]),
    Me = (0, s.useCallback)(() => "" === Re() && "" === $.trim() && 0 === ke && null === Ce, [Re, $, ke, Ce]),
    je = Re().length,
    Ue = ce === V.p.LOADING,
    Fe = ce !== V.p.ERROR && ce !== V.p.INVALID_URL_SYNTAX && je <= annotationTextMax
  function He(e) {
    Y.trackToolGuiEvent("tags", e)
  }
  function Be(e) {
    K.issueCommand(new TagUpdateOpenTagviewCommand(e))
  }
  ;(0, s.useEffect)(() => {
    De(Ae.find(e => e.category === AttachmentCategory.EXTERNAL) || null)
  }, [Ae]),
    (0, s.useEffect)(() => {
      le(!(Ue || Me() || we || l || re))
    }, [Ue, Me, we, l, re]),
    (0, s.useEffect)(() => {
      if (l) return void t.setDirtyTagState(!1)
      if (we || Ue || o || !ie) return void t.setDirtyTagState(!0)
      const e = Te.length > 0 || Oe.length > 0,
        i = !!["label", "stemLength", "stemEnabled", "color", "icon"].find(e => n[e] !== ie[e]) || !1,
        s = ue !== ie.description,
        r = !sameArray(ie.keywords, S)
      t.setDirtyTagState(e || i || s || r)
    }, [t, n, ie, $, ue, S, k, C, R, M, Te, Oe, ce, l, we, Ue, o])
  const Ve = () => {
      l || K.issueCommand(new TagCancelEditsCommand())
    },
    Ge = () => {
      ae(!1), le(!1)
    },
    We = async () => K.issueCommand(new ToggleModalCommand(a.P.LINK_EDITOR, !1)),
    ze = (e, t) => {
      q === a.P.LINK_EDITOR && (null == pe ? void 0 : pe.current) && (He("tags_editor_save_link"), pe.current.saveLink(e, t), he(Re()), We())
    },
    $e = e => {
      Ae.length && (He("tags_editor_view_attachment"), K.issueCommand(new ToggleViewAttachmentsCommand(!0, Ae, e)))
    },
    Ke = Q.t(Pe.LINK_TOOLTIP_MESSAGE),
    Ye = je >= annotationTextMax,
    qe = Q.t(Pe.EDIT_BILLBOARD_CANCEL_CTA),
    Ze = Q.t(Pe.SAVE),
    Qe = Q.t(Pe.SAVE_PROCESSING),
    Xe = Q.t(Pe.SAVE_INVALID),
    Je = Q.t(Pe.DESCRIPTION_PLACEHOLDER),
    et = Q.t(xe.SHOW_ONLY_IN_SEARCH),
    tt = Q.t(Pe.TITLE_PLACEHOLDER),
    nt = Q.t(Pe.TITLE_DESC_LABEL),
    it = Q.t(Pe.ATTACHMENTS_LABEL),
    st = Q.t(Pe.APPEARANCE_LABEL),
    rt = Q.t(Pe.KEYWORDS_LABEL),
    at = !!y
  let ot = "",
    lt = ""
  Ee && Ee.blockType === BlockTypeList.LINK && ((ot = Ee.text), (lt = Ee.value || ""))
  const ct = !oe || !Fe || !se
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "tag-editor"
      },
      {
        children: [
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "h6"
              },
              {
                children: nt
              }
            )
          ),
          (0, i.jsx)(G.Z, {
            text: $,
            placeholder: tt,
            maxLength: tagTextMax,
            focusOnMount: be.El,
            onInput: e =>
              Be({
                label: e
              }),
            onCancel: Ve,
            tabIndex: 0,
            allowTabbing: !0
          }),
          (0, i.jsx)(W.R, {
            current: $.length,
            max: tagTextMax
          }),
          (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: h("annotation-text-box annotating editor-box", me && "has-focus", je > annotationTextMax && "invalid")
              },
              {
                children: [
                  (0, i.jsx)(B.b, {
                    className: "placeholder",
                    ref: pe,
                    textParser: t.textParser,
                    text: n.description,
                    active: !0,
                    clickToEdit: !1,
                    focusOnMount: !1,
                    maxLength: annotationTextMax,
                    placeholder: Je,
                    onClickBlock: e => {
                      e.blockType === BlockTypeList.LINK && (Se(e), K.issueCommand(new ToggleModalCommand(a.P.LINK_EDITOR, !0)))
                    },
                    onInput: e => he(e.trim()),
                    onFocusChange: e => fe(e),
                    onCancelEditing: Ve,
                    tabIndex: 0,
                    allowTabbing: !0,
                    allowReturnKey: !0
                  }),
                  (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "annotation-button-bar"
                      },
                      {
                        children: (0, i.jsx)(
                          "div",
                          Object.assign(
                            {
                              className: "annotation-editors"
                            },
                            {
                              children: (0, i.jsx)(O.zx, {
                                icon: "add-link",
                                ariaLabel: Ke,
                                tooltip: Ke,
                                tooltipOptions: {
                                  placement: "bottom"
                                },
                                size: O.qE.LARGE,
                                variant: O.Wu.TERTIARY,
                                disabled: Ye,
                                onClick: () => {
                                  !(q === a.P.LINK_EDITOR) &&
                                    (null == pe ? void 0 : pe.current) &&
                                    (He("tags_editor_add_link"), pe.current.prepareLinkForEdit())
                                }
                              })
                            }
                          )
                        )
                      }
                    )
                  )
                ]
              }
            )
          ),
          (0, i.jsx)(W.R, {
            current: je,
            max: annotationTextMax
          }),
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "h6"
              },
              {
                children: it
              }
            )
          ),
          (0, i.jsx)(Ne, {
            tag: n,
            onViewAttachments: $e
          }),
          (0, i.jsx)(Ie, {
            tag: n,
            onViewAttachments: $e,
            handleEmbedValidation: e => de(e)
          }),
          (0, i.jsx)(ge, {
            label: st,
            onChange: e => Be(e),
            pinAppearance: n,
            tagIconsEnabled: ee,
            hideStemEditor: at,
            tabIndex: -1
          }),
          (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: "annotation-keyword-input"
              },
              {
                children: [
                  (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "h6"
                      },
                      {
                        children: rt
                      }
                    )
                  ),
                  (0, i.jsx)(Z, {
                    keywords: S,
                    availableKeywords: t.getAvailableKeywords(),
                    onChange: e =>
                      Be({
                        keywords: e
                      })
                  })
                ]
              }
            )
          ),
          o &&
            X &&
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "tag-editor-search-only-checkbox"
                },
                {
                  children: (0, i.jsx)(ve.X, {
                    checked: te,
                    onChange: () => ne(!te),
                    stopPropagation: !0,
                    label: et
                  })
                }
              )
            ),
          (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: "button-sticky-footer"
              },
              {
                children: [
                  (0, i.jsxs)(O.hE, {
                    children: [
                      (0, i.jsx)(O.zx, {
                        label: qe,
                        variant: O.Wu.TERTIARY,
                        size: O.qE.SMALL,
                        disabled: re,
                        onClick: Ve
                      }),
                      (0, i.jsx)(O.zx, {
                        label: Ze,
                        variant: O.Wu.PRIMARY,
                        size: O.qE.SMALL,
                        disabled: ct,
                        onClick: async () => {
                          if (l) return
                          if (Me()) return void Ve()
                          ae(!0)
                          const e = {
                            position: p,
                            normal: f,
                            floorId: g,
                            roomId: v,
                            description: Re(),
                            label: $,
                            keywords: S,
                            color: new Color(R),
                            stemHeight: C,
                            stemVisible: k,
                            icon: M,
                            enabled: T,
                            objectAnnotationId: y
                          }
                          te
                            ? (t.setDirtyTagState(!1), await K.issueCommand(new CreateObjectTagCommand(u, e, Le, Ce)).catch(Ge))
                            : await K.issueCommand(new TagSaveCommand(u, e, Le, Te, Ce)).catch(Ge),
                            ae(!1)
                        }
                      })
                    ]
                  }),
                  (!Fe || we || Ue) &&
                    (0, i.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: h("tag-editor-status", {
                            "tag-validation-error": !Fe,
                            "tag-processing": we || Ue
                          })
                        },
                        {
                          children: Fe
                            ? (0, i.jsxs)(i.Fragment, {
                                children: [
                                  (0, i.jsx)(O.JO, {
                                    name: "info"
                                  }),
                                  " ",
                                  Qe
                                ]
                              })
                            : (0, i.jsxs)(i.Fragment, {
                                children: [
                                  (0, i.jsx)(O.JO, {
                                    name: "error"
                                  }),
                                  " ",
                                  Xe
                                ]
                              })
                        }
                      )
                    )
                ]
              }
            )
          ),
          (0, i.jsx)(z.I, {
            linkText: ot,
            linkUrl: lt,
            onCancelLink: async () => {
              await We(), (null == pe ? void 0 : pe.current) && pe.current.cancelLink()
            },
            onSaveLink: ze,
            onRemoveLink: () => {
              He("tags_editor_remove_link"), ze("", "")
            }
          })
        ]
      }
    )
  )
}
const { MATTERTAGS: Le } = PhraseKey.WORKSHOP,
  { TAGS: Ce } = PhraseKey.SHOWCASE
function De(e) {
  const { tag: t, closing: n } = e,
    { analytics: a, commandBinder: l } = (0, s.useContext)(AppReactContext),
    c = (0, m.b)(),
    u = (0, g.v)(),
    p = (0, v.A)(),
    E = u && p && (p === ToolsList.SEARCH || p === ToolsList.LAYERS),
    _ = (0, b.v)(),
    w = S(),
    A = (0, y.Q)(ToolsList.TAGS),
    N = A ? A.manager : null
  if (!N) return null
  const I = E,
    P = I ? c.t(Le.BACK) : c.t(Ce.CLOSE_TAG_LABEL),
    x = I ? "back" : "close",
    k = c.t(Le.DELETE_LIST_ITEM_OPTION_CTA)
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: h("tag-widget", "annotating", {
          creating: _
        })
      },
      {
        children: [
          !_ &&
            (0, i.jsxs)(
              "div",
              Object.assign(
                {
                  className: "detail-panel-header"
                },
                {
                  children: [
                    (0, i.jsx)(T.P, {
                      label: P,
                      className: "return-btn",
                      icon: x,
                      disabled: w,
                      onClose: () => {
                        E
                          ? l.issueCommand(new OpenPreviousToolCommand()).then(() => {
                              l.issueCommand(new ToolBottomPanelCollapseCommand(!1))
                            })
                          : l.issueCommand(new TagCloseCommand())
                      }
                    }),
                    (0, i.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "tag-header-buttons"
                        },
                        {
                          children: (0, i.jsx)(O.zx, {
                            label: k,
                            className: "delete-btn",
                            icon: "delete",
                            size: O.qE.SMALL,
                            variant: O.Wu.TERTIARY,
                            disabled: w,
                            onClick: () => {
                              a.trackToolGuiEvent("tags", "tags_click_delete_tag"), N && N.confirmAndDeleteTag(t.id, "tags_detail_panel_widget")
                            }
                          })
                        }
                      )
                    )
                  ]
                }
              )
            ),
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "tag"
              },
              {
                children: (0, i.jsx)(
                  ke,
                  {
                    openTagView: t,
                    isCreating: _,
                    manager: N,
                    closing: n
                  },
                  t.id
                )
              }
            )
          )
        ]
      }
    )
  )
}
function Me(e) {
  const { tag: t, closing: n } = e,
    { commandBinder: u } = (0, s.useContext)(AppReactContext),
    h = (0, l.T)(),
    p = (0, c.R)(),
    m = (0, s.useRef)(null),
    f = null == t ? void 0 : t.id
  ;(0, s.useEffect)(() => {
    m.current && f && m.current.resetScrollTop()
  }, [f])
  const g = h === ToolPanelLayout.BOTTOM_PANEL,
    v = p && p !== a.P.CONFIRM,
    y = !(!t || n || (g && v))
  return (0, i.jsx)(
    Re.J,
    Object.assign(
      {
        ref: m,
        className: "tags-detail-panel",
        open: y,
        scrollingDisabled: !1,
        onClose: () => {
          u.issueCommand(new TagCancelEditsCommand())
        }
      },
      {
        children:
          t &&
          (0, i.jsx)(
            De,
            {
              tag: t,
              closing: n
            },
            f
          )
      }
    )
  )
}

export const J = Me
