import a from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"

import * as u from "./6335"
import * as h from "./84426"
import { TransitionTypeList } from "../const/64918"
import { PhraseKey } from "../const/phrase.const"
import { PanDirectionList } from "../const/transition.const"
import { AppReactContext } from "../context/app.context"
import { ViewModes } from "../utils/viewMode.utils"
const { HLR: m } = PhraseKey.WORKSHOP
class f extends s.Component {
  constructor() {
    super(...arguments),
      (this.editHighlight = e => {
        e.stopPropagation(), this.props.onClickHighlight(this.props.index, !0)
      }),
      (this.removeHighlight = e => {
        e.stopPropagation(), this.props.onRemoveHighlight && this.props.onRemoveHighlight(this.props.highlight.snapshot.sid)
      }),
      (this.onClickHighlight = e => {
        e.preventDefault(), this.props.onClickHighlight(this.props.index, !1)
      }),
      (this.setContainerRef = e => {
        const { index: t, getRef: n } = this.props
        ;(this.element = e), n && n(t, this.element)
      })
  }
  renderTransitionSettings() {
    const { locale: e } = this.context,
      { transitionType: t, panDirection: n, transitionCondition: s, index: r } = this.props,
      a = n !== PanDirectionList.Auto
    let o = "pan-auto",
      d = e.t(m.PAN_DIRECTION_SETTING_AUTO)
    n === PanDirectionList.Left
      ? ((o = "icon icon-rotate-left"), (d = e.t(m.PAN_DIRECTION_SETTING_LEFT)))
      : n === PanDirectionList.Right && ((o = "icon icon-rotate-right"), (d = e.t(m.PAN_DIRECTION_SETTING_RIGHT)))
    let u = ""
    return (
      t === TransitionTypeList.FadeToBlack
        ? (u = e.t(m.TRANSITION_SETTING_SLIDESHOW))
        : t === TransitionTypeList.Interpolate && (u = e.t(m.TRANSITION_SETTING_WALKTHROUGH)),
      (0, i.jsxs)(
        "div",
        Object.assign(
          {
            className: "transition-settings"
          },
          {
            children: [
              (0, i.jsxs)(
                "span",
                Object.assign(
                  {
                    className: "transition-type"
                  },
                  {
                    children: [
                      r + 1,
                      " - ",
                      u,
                      s &&
                        (0, i.jsx)("span", {
                          children: "*"
                        })
                    ]
                  }
                )
              ),
              (0, i.jsx)(
                "span",
                Object.assign(
                  {
                    className: "pan-direction-type"
                  },
                  {
                    children: d
                  }
                )
              ),
              a &&
                (0, i.jsx)("span", {
                  className: `pan-icon ${o}`
                })
            ]
          }
        )
      )
    )
  }
  renderImageBar() {
    var e
    const { locale: t } = this.context,
      { highlight: n, editable: s } = this.props,
      r = n.snapshot.is360,
      o = n.snapshot.metadata.cameraMode,
      l = null !== (e = this.getMarker(o, r)) && void 0 !== e ? e : "",
      c = t.t(m.REMOVE_HIGHLIGHT_TOOLTIP_MESSAGE),
      d = t.t(m.EDIT_HIGHLIGHT_TOOLTIP_MESSAGE)
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: "image-bar"
        },
        {
          children: [
            (0, i.jsx)("span", {
              className: a("highlight-marker", {
                [l]: !s
              })
            }),
            s &&
              (0, i.jsxs)(i.Fragment, {
                children: [
                  (0, i.jsx)(h.zx, {
                    className: "highlight-remove",
                    onClick: this.removeHighlight,
                    tooltip: c,
                    ariaLabel: c,
                    icon: "delete",
                    theme: "overlay",
                    variant: h.Wu.FAB
                  }),
                  (0, i.jsx)(h.zx, {
                    className: "highlight-edit",
                    onClick: this.editHighlight,
                    tooltip: d,
                    ariaLabel: d,
                    icon: "toggle-pencil",
                    theme: "overlay",
                    variant: h.Wu.FAB
                  })
                ]
              })
          ]
        }
      )
    )
  }
  getMarker(e, t) {
    return e === ViewModes.Dollhouse || e === ViewModes.Floorplan ? null : t ? "icon-360" : "icon-panorama"
  }
  render() {
    const { highlight: e, active: t, editable: n } = this.props,
      { name: s } = e.snapshot,
      r = !!s || n
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: a("highlight-box", {
            active: t,
            editable: n
          }),
          onClick: this.onClickHighlight,
          ref: this.setContainerRef
        },
        {
          children: [
            (0, i.jsx)(u.X, {
              resource: e.snapshot.thumbnailUrl,
              className: "highlight-image"
            }),
            this.renderImageBar(),
            n && this.renderTransitionSettings(),
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: a("image-name", {
                    shadowed: r
                  })
                },
                {
                  children: (0, i.jsx)(
                    "span",
                    Object.assign(
                      {
                        className: "static-text",
                        role: "listitem",
                        "aria-label": s || "highlight"
                      },
                      {
                        children: s
                      }
                    )
                  )
                }
              )
            )
          ]
        }
      )
    )
  }
}
f.contextType = AppReactContext
export const y = f
