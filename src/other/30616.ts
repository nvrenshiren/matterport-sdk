import * as s from "react"
import * as n from "react/jsx-runtime"
import * as u from "./38242"
import * as p from "./44877"
import * as l from "./56509"
import * as v from "./57623"
import * as f from "./6608"
import * as r from "./66102"
import * as w from "./68830"
import * as d from "./77230"
import * as y from "./84426"
import * as cc from "./93001"
import * as h from "./96403"
import { NoteDeleteCommand, NotesOpenNoteCommentCommand } from "../command/notes.command"
import { AnnotationType } from "../const/annotationType.const"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"

const { NOTES: b } = PhraseKey.SHOWCASE,
  T = ({ item: e }) => (e ? (0, n.jsx)(C, { item: e }, e.id) : null),
  C = ({ item: e }) => {
    const t = (0, s.useRef)(null),
      { commandBinder: i, analytics: T, editMode: C } = (0, s.useContext)(AppReactContext),
      E = (0, r.b)(),
      D = (0, l.Y)(),
      x = (0, h.B)(),
      A = (0, v.M)(),
      S = (0, d.A)(),
      P = (0, cc.v)(),
      O = (0, u.e)()
    if (!P) return null
    const { id: I, title: k, description: N, color: M, resolved: j, user: R, numAttachments: L, numComments: V } = e,
      B = I,
      F = e.parentId
    if (!F || !B) return null
    const _ = F === (null == A ? void 0 : A.id),
      H = j || !e.isLayerVisible(),
      U = (0, p.CM)(P, AnnotationType.NOTE, R),
      G = (0, p.Kd)(P, AnnotationType.NOTE, R),
      z = E.t(b.EDIT_LIST_ITEM_OPTION_CTA),
      W = E.t(b.DELETE_LIST_ITEM_OPTION_CTA),
      $ =
        U || G
          ? (0, n.jsx)(y.hE, {
              children: (0, n.jsxs)(
                y.xz,
                Object.assign(
                  {
                    ref: t,
                    icon: "more-vert",
                    ariaLabel: E.t(PhraseKey.MORE_OPTIONS),
                    variant: y.Wu.TERTIARY,
                    menuArrow: !0,
                    menuClassName: "search-result-menu"
                  },
                  {
                    children: [
                      (0, n.jsx)(y.zx, {
                        label: z,
                        size: y.qE.SMALL,
                        disabled: !U,
                        variant: y.Wu.TERTIARY,
                        onClick: () => {
                          T.trackGuiEvent("notes_list_edit_note", { tool: O }), i.issueCommand(new NotesOpenNoteCommentCommand(F, !0, !0, B))
                        }
                      }),
                      (0, n.jsx)(y.zx, {
                        className: "menu-delete-btn",
                        label: W,
                        size: y.qE.SMALL,
                        disabled: !G,
                        variant: y.Wu.TERTIARY,
                        onClick: () => {
                          T.trackGuiEvent("notes_list_delete_note", { tool: O }), i.issueCommand(new NoteDeleteCommand(F))
                        }
                      })
                    ]
                  }
                )
              )
            })
          : void 0,
      K = (0, n.jsx)(w.j, { description: N, userName: k, numAttachments: L, numComments: V, searchText: S }),
      Z = (0, n.jsx)(f.C, { badgeStyle: M ? { backgroundColor: M, borderColor: M } : void 0, iconClass: "icon-comment" })
    return (0, n.jsx)(
      y.HC,
      {
        id: B,
        className: "search-result-item notes-list-item",
        title: K,
        badge: Z,
        active: _,
        disabled: H,
        onClick: async () => {
          T.trackGuiEvent("search_item_note_click", { tool: O }), e.onSelect(C, x, D)
        },
        actions: $
      },
      B
    )
  }

export const c = C
export const o = T
