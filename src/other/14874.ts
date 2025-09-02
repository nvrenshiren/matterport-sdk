import f from "classnames"
import * as ss from "react"
import * as i from "react/jsx-runtime"
import * as u from "./37975"
import * as c from "./60440"
import * as o from "./65796"
import * as l from "./69092"
import * as p from "./82513"
import * as h from "./86130"

import * as w from "./15258"
import * as _ from "./27839"
import * as P from "./27870"
import * as b from "./38242"
import * as y from "./51978"
import * as N from "./53536"
import * as v from "./66102"
import { ModelViewsFeatureKey } from "./76087"
import * as I from "./84426"
import * as A from "./86191"
import * as x from "./89478"
import {
  BatchSelectionAddItemsCommand,
  BatchSelectionRemoveItemsCommand,
  DataLayerDuplicateCommand,
  DeleteLayerCommand,
  LayerToggleCommonCommand,
  LayerToggleVisibleCommand,
  RenameLayerCommand
} from "../command/layers.command"
import { ConfirmBtnSelect, ConfirmModalCommand, ConfirmModalState } from "../command/ui.command"
import { MAX_LAYER_NAME_LENGTH } from "../const/23829"
import { AnnotationGrouping, DataLayerType } from "../const/63319"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
const { ACCORDION: k, MODAL: L, LAYERS: C } = PhraseKey.WORKSHOP
function D(e) {
  const { id: t, numItems: n, numSelected: o, selected: l, selectMode: c, onSelect: d } = e,
    { commandBinder: u, analytics: h } = (0, ss.useContext)(AppReactContext),
    p = (0, _._)(),
    m = null == p ? void 0 : p.getLayer(t),
    [D, R] = (0, ss.useState)(!1),
    M = (0, w.K)(),
    j = (0, A.W)(t, M),
    U = (0, v.b)(),
    F = (0, y.y)(ModelViewsFeatureKey, !1),
    H = (0, N.T)(),
    B = F && H,
    V = (0, b.e)()
  if (!m || !p) return null
  const G = m.layerType === DataLayerType.COMMON_USER_LAYER,
    W = m.layerType === DataLayerType.BASE_LAYER,
    z = m.layerType === DataLayerType.VIEW_DATA_LAYER,
    $ = W || z,
    K = e => {
      e.stopPropagation(),
        u.issueCommand(new LayerToggleVisibleCommand(t, !m.visible)),
        h.trackGuiEvent(m.visible ? "layers_layer_disable" : "layers_layer_enable", {
          tool: V
        })
    },
    Y = () => R("rename"),
    q = () => R("duplicate"),
    Z = async () => {
      if (B) {
        await u.issueCommand(new LayerToggleCommonCommand(t, !G))
        const e = G ? "layers_layer_convert_to_dedicated" : "layers_layer_convert_to_common"
        h.trackGuiEvent(e, {
          tool: V
        })
      }
    },
    Q = async () => {
      const e = U.t(C.DELETE_LAYER_CONFIRMATION_MESSAGE),
        n = U.t(C.DELETE_COMMON_LAYER_CONFIRMATION_MESSAGE),
        s = (0, i.jsxs)(i.Fragment, {
          children: [
            (0, i.jsx)(
              "p",
              Object.assign(
                {
                  className: "modal-message"
                },
                {
                  children: e
                }
              )
            ),
            G &&
              (0, i.jsx)(
                "p",
                Object.assign(
                  {
                    className: "modal-message"
                  },
                  {
                    children: n
                  }
                )
              )
          ]
        }),
        r = {
          title: G ? C.DELETE_COMMON_LAYER_MODAL_TITLE : C.DELETE_LAYER_MODAL_TITLE,
          message: s,
          cancellable: !0,
          cancelPhraseKey: L.CANCEL,
          confirmPhraseKey: L.DELETE
        }
      ;(await u.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, r))) === ConfirmBtnSelect.CONFIRM &&
        (u.issueCommand(new DeleteLayerCommand(t)),
        h.trackGuiEvent("layers_layer_delete", {
          tool: V
        }))
    },
    X = m.visible ? "eye-show" : "eye-hide",
    J = G ? U.t(C.DEDICATED_LAYER_ITEM) : U.t(C.COMMON_LAYER_ITEM),
    ee = m.visible ? U.t(C.HIDE_LAYER) : U.t(C.SHOW_LAYER),
    te = U.t(k.RENAME_HEADER_OPTION_CTA),
    ne = U.t(C.DELETE_LAYER_ITEM),
    ie = U.t(C.DUPLICATE_LAYER_ITEM),
    se = "rename" === D ? U.t(C.EDIT_LAYER_TITLE) : U.t(C.DUPLICATE_LAYER_TITLE),
    re = U.t(C.NEW_LAYER_LABEL),
    ae = U.t(C.LAYER_NAME_PLACEHOLDER),
    oe =
      "rename" === D
        ? j
        : U.t(C.DUPLICATE_LAYER_PLACEHOLDER, {
            "layer-name": j
          })
  let le
  c ||
    (le = $
      ? void 0
      : (0, i.jsxs)(I.hE, {
          children: [
            (0, i.jsx)(I.zx, {
              icon: X,
              onClick: K,
              tooltip: ee
            }),
            (0, i.jsxs)(
              I.xz,
              Object.assign(
                {
                  icon: "more-vert",
                  ariaLabel: U.t(PhraseKey.MORE_OPTIONS),
                  variant: I.Wu.TERTIARY,
                  menuClassName: "search-group-menu",
                  menuArrow: !0
                },
                {
                  children: [
                    (0, i.jsx)(I.zx, {
                      label: te,
                      size: I.qE.SMALL,
                      variant: I.Wu.TERTIARY,
                      onClick: Y
                    }),
                    B &&
                      (0, i.jsx)(I.zx, {
                        label: J,
                        size: I.qE.SMALL,
                        variant: I.Wu.TERTIARY,
                        onClick: Z
                      }),
                    (0, i.jsx)(I.zx, {
                      label: ie,
                      size: I.qE.SMALL,
                      variant: I.Wu.TERTIARY,
                      onClick: q
                    }),
                    (0, i.jsx)(I.zx, {
                      className: "menu-delete-btn",
                      label: ne,
                      size: I.qE.SMALL,
                      variant: I.Wu.TERTIARY,
                      onClick: Q
                    })
                  ]
                }
              )
            )
          ]
        }))
  const ce = U.t(C.COMMON_LAYER),
    de = c ? `(${o}/${n})` : `(${n})`,
    ue = (0, i.jsxs)(i.Fragment, {
      children: [
        (0, i.jsx)(
          "span",
          Object.assign(
            {
              className: "mp-list-item-text"
            },
            {
              children: de
            }
          )
        ),
        G &&
          B &&
          (0, i.jsx)(x.P, {
            icon: "layers",
            tooltip: ce,
            size: I.qE.SMALL,
            popupSize: "medium",
            variant: I.Wu.FAB,
            theme: "dark"
          })
      ]
    }),
    he = f("layers-group-header", {
      disabled: !m.visible
    })
  return (0, i.jsxs)(i.Fragment, {
    children: [
      (0, i.jsx)(I._m, {
        id: t,
        title: j,
        actions: le,
        decals: ue,
        className: he,
        selectMode: c,
        selected: l,
        onSelect: d
      }),
      D &&
        (0, i.jsx)(P.x, {
          title: se,
          initialText: oe,
          label: re,
          placeholder: ae,
          maxLength: MAX_LAYER_NAME_LENGTH,
          onSave: async e => {
            let n, i
            "rename" === D
              ? ((n = RenameLayerCommand), (i = "layers_layer_edit"))
              : "duplicate" === D && ((n = DataLayerDuplicateCommand), (i = "layers_layer_duplicate")),
              n &&
                i &&
                (await u.issueCommand(new n(t, e.trim())),
                h.trackGuiEvent(i, {
                  tool: V
                })),
              R(!1)
          },
          onValidate: e => (null == p ? void 0 : p.validateViewName(e.trim())) || !1,
          onCancel: () => R(!1)
        })
    ]
  })
}
const R = ({ group: e }) => {
  const { id: t, items: n, grouping: o } = e,
    m = n.length,
    { commandBinder: f } = (0, ss.useContext)(AppReactContext),
    g = (0, l.J)(),
    v = g && m > 0,
    y = (0, c.M)().filter(t => t.getGroupingId(o) === e.id).length,
    b = !!g && y === m,
    E = e => {
      if (0 === m) return
      const t = e.target
      if (!t) return
      const i = t.checked ? BatchSelectionAddItemsCommand : BatchSelectionRemoveItemsCommand
      f.issueCommand(new i(n))
    }
  switch (o) {
    case AnnotationGrouping.TYPE:
      return (0, i.jsx)(u.m, {
        id: t,
        numItems: m,
        selectMode: v,
        selectDisabled: !e.batchSupported,
        numSelected: y,
        onSelect: E,
        selected: b
      })
    case AnnotationGrouping.FLOOR:
      return (0, i.jsx)(p.J, {
        id: t,
        numItems: m,
        selectMode: v,
        numSelected: y,
        onSelect: E,
        selected: b
      })
    case AnnotationGrouping.ROOM:
      return (0, i.jsx)(M, {
        id: t,
        numItems: m
      })
    case AnnotationGrouping.LAYER:
      return (0, i.jsx)(D, {
        id: t,
        numItems: m,
        selectMode: v,
        numSelected: y,
        onSelect: E,
        selected: b
      })
    case AnnotationGrouping.DATE:
      return (0, i.jsx)(h.c, {
        id: t,
        numItems: m,
        selectMode: v,
        numSelected: y,
        onSelect: E,
        selected: b
      })
  }
  return null
}
function M({ id: e, numItems: t }) {
  const n = (0, o.g)(e)
  return (0, i.jsx)(I._m, {
    id: e,
    title: n,
    decals: (0, i.jsx)(
      "span",
      Object.assign(
        {
          className: "mp-list-item-text"
        },
        {
          children: `(${t})`
        }
      )
    )
  })
}
export const s = R
