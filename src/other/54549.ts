import * as s from "react"
import * as i from "react/jsx-runtime"
import * as f from "./15501"
import * as R from "./17176"
import * as b from "./27839"
import * as w from "./27870"
import * as P from "./35290"
import * as c from "./38242"
import * as M from "./39156"
import * as u from "./46362"
import * as l from "./51978"
import * as E from "./53536"
import * as C from "./60440"
import * as o from "./66102"
import * as p from "./69092"
import * as O from "./73085"
import { DataLayersFeatureKey, ModelViewsFeatureKey } from "./76087"
import * as m from "./84426"
import * as A from "./95229"
import {
  BatchSelectionSelectAllCommand,
  LayerItemsCopyCommand,
  LayerItemsMoveCommand,
  LayerNewCancelCommand,
  LayerNewCommand,
  LayerNewSaveCommand,
  LayersToolSetGroupingCommand,
  SearchBatchToggleCommand,
  ViewItemsDeleteCommand
} from "../command/layers.command"
import { ConfirmBtnSelect, ConfirmModalCommand, ConfirmModalState, ToggleModalCommand } from "../command/ui.command"
import { MAX_LAYER_NAME_LENGTH } from "../const/23829"
import { AnnotationGrouping } from "../const/63319"
import * as g from "../const/73536"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { LayersToolData } from "../data/layers.tool.data"
const _ = (0, O.M)(LayersToolData, "newLayerAction", null)
const { LAYERS: N } = PhraseKey.WORKSHOP
function I() {
  const { analytics: e, commandBinder: t } = (0, s.useContext)(AppReactContext),
    n = (0, f.R)(),
    a = (0, b._)(),
    [c, u] = (0, s.useState)(!1),
    p = (0, l.y)(ModelViewsFeatureKey, !1),
    m = (0, E.T)(),
    O = _(),
    T = p && m && !O,
    I = (0, o.b)()
  if (n !== g.P.LAYER_ADD) return null
  function P() {
    t.issueCommand(new ToggleModalCommand(g.P.LAYER_ADD, !1))
  }
  const x = () => {
      u(!c)
    },
    k = I.t(N.DEDICATED_LAYER),
    L = I.t(N.DEDICATED_LAYER_DESCRIPTION),
    C = I.t(N.COMMON_LAYER),
    D = I.t(N.COMMON_LAYER_DESCRIPTION),
    R = I.t(N.LAYER_TYPE_LABEL),
    M = I.t(N.LAYER_NAME_PLACEHOLDER),
    j = I.t(N.NEW_LAYER_TITLE),
    U = I.t(N.NEW_LAYER_LABEL)
  return (0, i.jsx)(
    w.x,
    Object.assign(
      {
        title: j,
        initialText: "",
        label: U,
        placeholder: M,
        fullModal: !0,
        className: "add-layer-modal",
        maxLength: MAX_LAYER_NAME_LENGTH,
        onSave: async n => {
          const i = O ? `_${O}` : ""
          e.trackToolGuiEvent("layers", `layers_layer_add${i}`),
            await t.issueCommand(new LayerNewSaveCommand(n.trim(), c)),
            P(),
            t.issueCommand(new LayersToolSetGroupingCommand(AnnotationGrouping.LAYER))
        },
        onValidate: e => (null == a ? void 0 : a.validateLayerName(e.trim())) || !1,
        onCancel: async () => {
          await t.issueCommand(new LayerNewCancelCommand()), P()
        }
      },
      {
        children:
          T &&
          (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: "layer-types"
              },
              {
                children: [
                  (0, i.jsx)(
                    "label",
                    Object.assign(
                      {
                        className: "layer-type-title"
                      },
                      {
                        children: R
                      }
                    )
                  ),
                  (0, i.jsx)(
                    A.E,
                    Object.assign(
                      {
                        name: "layer_type",
                        value: "",
                        enabled: !0,
                        id: "layer-type-single",
                        checked: !c,
                        onChange: x
                      },
                      {
                        children: k
                      }
                    )
                  ),
                  (0, i.jsx)(
                    "p",
                    Object.assign(
                      {
                        className: "layer-type-message"
                      },
                      {
                        children: L
                      }
                    )
                  ),
                  (0, i.jsx)(
                    A.E,
                    Object.assign(
                      {
                        name: "layer_type",
                        value: "common",
                        enabled: !0,
                        id: "layer-type-common",
                        checked: c,
                        onChange: x
                      },
                      {
                        children: C
                      }
                    )
                  ),
                  (0, i.jsx)(
                    "p",
                    Object.assign(
                      {
                        className: "layer-type-message"
                      },
                      {
                        children: D
                      }
                    )
                  )
                ]
              }
            )
          )
      }
    )
  )
}
const { ADD_LAYER_BUTTON_LABEL: x } = PhraseKey.WORKSHOP.LAYERS
function k({ grouping: e }) {
  const { commandBinder: t } = (0, s.useContext)(AppReactContext),
    n = (0, l.y)(DataLayersFeatureKey, !1),
    a = (0, p.J)()
  const c = (0, o.b)().t(x)
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "layered-controls"
      },
      {
        children: [
          (0, i.jsx)(P.$, {
            grouping: e,
            onGroupBy: function (e) {
              t.issueCommand(new LayersToolSetGroupingCommand(e))
            }
          }),
          n &&
            !a &&
            (0, i.jsx)(m.zx, {
              icon: "plus",
              label: c,
              size: m.qE.SMALL,
              variant: m.Wu.FAB,
              onClick: function () {
                t.issueCommand(new LayerNewCommand())
              },
              theme: "dark"
            }),
          n && (0, i.jsx)(I, {})
        ]
      }
    )
  )
}
const { LAYERS: j } = PhraseKey.WORKSHOP
function U({ label: e, disabled: t, onSelectLayer: n, onAddLayer: s }) {
  const r = (0, o.b)().t(j.BATCH_NEW_LAYER)
  return (0, i.jsx)(
    M.u,
    Object.assign(
      {
        label: e,
        disabled: t,
        onClick: n
      },
      {
        children:
          !!s &&
          (0, i.jsx)(
            m.zx,
            {
              icon: "plus",
              label: r,
              size: m.qE.SMALL,
              variant: m.Wu.TERTIARY,
              onClick: s,
              theme: "light"
            },
            "new_layer"
          )
      }
    )
  )
}
const { BATCH_ITEMS_TYPE: F, BATCH_COPY_LABEL: H, BATCH_DELETE_LABEL: B, BATCH_MOVE_LABEL: Vv } = PhraseKey.WORKSHOP.ACCORDION
function G() {
  const { analytics: e, commandBinder: t } = (0, s.useContext)(AppReactContext),
    n = (0, o.b)(),
    l = (0, C.M)(),
    d = (0, b._)(),
    u = (0, c.e)(),
    p = null == d ? void 0 : d.canBatchDeleteInActiveView(),
    f = p ? l.filter(e => e.supportsBatchDelete()) : [],
    g = n.t(B, f.length),
    v = l.filter(e => e.supportsLayeredCopyMove()),
    y = n.t(H, v.length),
    E = n.t(Vv, v.length)
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: "layers-batch-select"
      },
      {
        children: [
          (0, i.jsxs)(
            m.hE,
            Object.assign(
              {
                className: "batch-actions"
              },
              {
                children: [
                  (0, i.jsx)(U, {
                    label: y,
                    disabled: 0 === v.length,
                    onSelectLayer: n => {
                      v.length > 0 &&
                        (t.issueCommand(new LayerItemsCopyCommand(n, v)),
                        e.trackGuiEvent("batch_item_copy", {
                          tool: u
                        }))
                    },
                    onAddLayer: () => {
                      t.issueCommand(new LayerNewCommand(v, "copy"))
                    }
                  }),
                  (0, i.jsx)(U, {
                    label: E,
                    disabled: 0 === v.length,
                    onSelectLayer: n => {
                      v.length > 0 &&
                        (t.issueCommand(new LayerItemsMoveCommand(n, v)),
                        e.trackGuiEvent("batch_item_move", {
                          tool: u
                        }))
                    }
                  })
                ]
              }
            )
          ),
          p &&
            (0, i.jsx)(
              m.xz,
              Object.assign(
                {
                  icon: "more-vert",
                  ariaLabel: n.t(PhraseKey.MORE_OPTIONS),
                  variant: m.Wu.TERTIARY,
                  menuArrow: !0
                },
                {
                  children: (0, i.jsx)(m.zx, {
                    label: g,
                    size: m.qE.SMALL,
                    disabled: 0 === f.length,
                    variant: m.Wu.TERTIARY,
                    onClick: async () => {
                      if (f.length > 0) {
                        const n = (0, R.P)(f.length, F)
                        if ((await t.issueCommand(new ConfirmModalCommand(ConfirmModalState.DISPLAY, n))) !== ConfirmBtnSelect.CONFIRM) return
                        t.issueCommand(new ViewItemsDeleteCommand(f)),
                          e.trackGuiEvent("batch_item_delete", {
                            tool: u
                          })
                      }
                    }
                  })
                }
              )
            )
        ]
      }
    )
  )
}
const { ACCORDION: W } = PhraseKey.WORKSHOP
function z({ grouping: e }) {
  const t = (0, o.b)(),
    { analytics: n, commandBinder: a } = (0, s.useContext)(AppReactContext),
    f = (0, l.y)(DataLayersFeatureKey, !1),
    g = (0, c.e)(),
    v = f,
    y = (0, p.J)(),
    b = 0 === (0, u.s)().length,
    E = y ? t.t(W.EXIT_SELECT_MODE_CTA) : t.t(W.ENTER_SELECT_MODE_CTA),
    S = y ? "checkmark" : void 0,
    O = !y && b,
    T = t.t(W.SELECT_ALL_CTA)
  return (0, i.jsxs)(i.Fragment, {
    children: [
      (0, i.jsxs)(
        m.w0,
        Object.assign(
          {
            className: "list-panel-controls"
          },
          {
            children: [
              (0, i.jsx)(k, {
                grouping: e
              }),
              y &&
                (0, i.jsx)(m.zx, {
                  className: "batch-select-all-btn",
                  size: m.qE.SMALL,
                  variant: m.Wu.FAB,
                  onClick: () => {
                    a.issueCommand(new BatchSelectionSelectAllCommand())
                  },
                  label: T,
                  theme: "dark"
                }),
              v &&
                (0, i.jsx)(m.zx, {
                  className: "batch-select-btn",
                  size: m.qE.SMALL,
                  variant: m.Wu.FAB,
                  onClick: () => {
                    n.trackGuiEvent("batch_mode_start", {
                      tool: g
                    }),
                      a.issueCommand(new SearchBatchToggleCommand(!y))
                  },
                  label: E,
                  icon: S,
                  theme: "dark",
                  disabled: O
                })
            ]
          }
        )
      ),
      y && (0, i.jsx)(G, {})
    ]
  })
}
export const V = z
