import r from "classnames"
import * as i from "react/jsx-runtime"

import * as d from "react"
import * as c from "./other/14355"
import * as v from "./other/23043"
import * as P from "./other/23362"
import * as I from "./34646"
import * as p from "./38772"
import * as y from "./60934"
import * as j from "./other/6335"
import * as k from "./68473"
import * as l from "./70584"
import * as A from "./71652"
import * as L from "./71802"
import * as R from "./77543"
import { HighlightReelToggleOpenCommand, TourStartCommand, TourStepCommand, TourStopCommand } from "./command/tour.command"
import { PhraseKey } from "./const/phrase.const"
import { ToolsList } from "./const/tools.const"
import { TourMode } from "./const/tour.const"
import { TourTransitionTypes } from "./const/transition.const"
import { AppReactContext } from "./context/app.context"
import { DebugInfo } from "./core/debug"
import { TourTransitionError } from "./error/tour.error"
import { isMobilePhone } from "./utils/browser.utils"
import * as M from "./utils/scroll.utils"
class b extends d.Component {
  constructor(e) {
    super(e),
      (this.highlights = []),
      (this.highlightList = e => {
        const { currentStep: t, onHighlightClicked: n } = this.props
        return (0, i.jsx)(
          "div",
          Object.assign(
            {
              className: "hlr-container"
            },
            {
              children: (0, i.jsx)(
                "div",
                Object.assign(
                  {
                    className: "highlights",
                    role: "list"
                  },
                  {
                    children: e.items.map((e, s) =>
                      (0, i.jsx)(
                        y.y,
                        {
                          highlight: e,
                          index: s,
                          active: s === t,
                          editable: !1,
                          onClickHighlight: n,
                          getRef: this.addHighlightRef
                        },
                        `${e.id}_${s}`
                      )
                    )
                  }
                )
              )
            }
          )
        )
      }),
      (this.addHighlightRef = (e, t) => {
        ;(this.highlights[e] = t), e === this.props.currentStep && this.props.setActiveElement && this.props.setActiveElement(t)
      })
  }
  componentDidUpdate(e) {
    e.currentStep !== this.props.currentStep && this.props.setActiveElement(this.highlights[this.props.currentStep])
  }
  render() {
    const { highlights: e } = this.props
    return e && e.length
      ? (0, i.jsx)(this.highlightList, {
          items: e
        })
      : null
  }
}

const HighlightReelDebugInfo = new DebugInfo("highlight-reel")
@p.Z
class O extends d.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.mobile = isMobilePhone()),
      (this.setActiveElement = e => {
        this.setState({
          activeElement: e
        })
      }),
      (this.setHighlightClickable = (e => (this.highlightClickable = e)).bind(this)),
      (this.onHighlightClicked = async e => {
        const { commandBinder: t, analytics: n } = this.context
        if (this.highlightClickable)
          try {
            this.props.tourPlaying && (await t.issueCommand(new TourStopCommand())),
              this.props.transition.active ||
                (n.trackToolGuiEvent("hlr", "click_highlight"),
                await t.issueCommand(new TourStepCommand(e)).catch(e => {
                  if (!(e instanceof TourTransitionError)) throw e
                  HighlightReelDebugInfo.warn(e.message)
                }),
                this.setHighlightClickable(!1))
          } catch (e) {
            HighlightReelDebugInfo.debug(e)
          }
      }),
      (this.state = {
        activeElement: null
      })
  }
  componentWillUnmount() {
    this.bindings.forEach(e => {
      e.cancel()
    })
  }
  render() {
    const { activeStep: e, highlights: t, totalSteps: n } = this.props
    return (0, i.jsx)(
      "div",
      Object.assign(
        {
          id: "reel-container"
        },
        {
          children: (0, i.jsx)(
            v._,
            Object.assign(
              {
                totalSteps: n,
                activeElement: this.state.activeElement,
                mobile: this.mobile,
                highlightClickable: this.setHighlightClickable,
                thumbScrollingOnly: !1
              },
              {
                children: (0, i.jsx)(b, {
                  highlights: t,
                  currentStep: e,
                  onHighlightClicked: this.onHighlightClicked,
                  setActiveElement: this.setActiveElement
                })
              }
            )
          )
        }
      )
    )
  }
}
O.contextType = AppReactContext
const { HLR: _ } = PhraseKey.SHOWCASE
class w extends d.Component {
  render() {
    const { locale: e } = this.context,
      t = e.t(_.EMPTY_REEL_LEARN_MORE),
      n = e.t(_.EMPTY_REEL_TITLE),
      s = e.t(_.EMPTY_REEL_MESSAGE)
    return (0, i.jsx)(
      "div",
      Object.assign(
        {
          className: "empty-reel"
        },
        {
          children: (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: "no-highlights-message"
              },
              {
                children: [
                  (0, i.jsx)("p", {
                    children: n
                  }),
                  (0, i.jsxs)("p", {
                    children: [
                      s,
                      (0, i.jsx)(
                        "a",
                        Object.assign(
                          {
                            className: "link",
                            target: "_blank",
                            href: "https://support.matterport.com/hc/en-us/articles/360019401733"
                          },
                          {
                            children: t
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
      )
    )
  }
}
w.contextType = AppReactContext
function x() {
  const e = (0, I.s)(),
    t = (0, P.T)(),
    n = t === P.l.Paused,
    i = t === P.l.Idle,
    s = (0, d.useRef)(null),
    r = (0, d.useRef)(0)
  if (i) return (r.current = 0), r.current
  if (!n) return r.current
  if (e === s.current) return r.current
  if (!TourTransitionTypes.includes(e.type)) return r.current
  const { started: a, stopped: o, duration: l } = e,
    c = (o - a) / l,
    u = r.current + c * (1 - r.current)
  return (s.current = e), (r.current = u), u
}
function C({ index: e }) {
  const t = (0, A.g)(),
    n = x(),
    s = (0, P.T)(),
    a = (0, k.j)(),
    o = (0, L.l)(),
    l = (function () {
      var e, t
      const n = (0, I.s)(),
        i = (0, d.useRef)(null)
      return TourTransitionTypes.includes(n.type)
        ? n.toIndex === (null === (t = i.current) || void 0 === t ? void 0 : t.toIndex)
          ? i.current.duration
          : ((i.current = n), n.duration)
        : (null === (e = i.current) || void 0 === e ? void 0 : e.duration) || 0
    })(),
    c = o.duration,
    u = o.toIndex,
    h = u === e,
    p = a === e,
    m = ["story-tour-progress-bar"]
  if (s === P.l.Skipping) e >= u ? m.push("story-tour-progress-bar--incomplete") : m.push("story-tour-progress-bar--complete")
  else if (p)
    switch (s) {
      case P.l.Completed:
        m.push("story-tour-progress-bar--complete")
        break
      case P.l.Playing:
        m.push("story-tour-progress-bar--playing")
        break
      case P.l.Paused:
        m.push("story-tour-progress-bar--paused")
        break
      case P.l.Rewinding:
        m.push("story-tour-progress-bar--rewinding")
        break
      case P.l.FastForwarding:
        m.push("story-tour-progress-bar--fast-forwarding")
        break
      case P.l.Idle:
        m.push("story-tour-progress-bar--incomplete")
    }
  else
    a === t - 1 && 0 === u
      ? m.push("story-tour-progress-bar--complete")
      : h && s === P.l.Rewinding
        ? m.push("story-tour-progress-bar--full-rewinding")
        : e < a
          ? m.push("story-tour-progress-bar--complete")
          : e > a && m.push("story-tour-progress-bar--incomplete")
  const f = {}
  if (
    (p && (s === P.l.Playing || s === P.l.Paused ? (f.animationDuration = `${l}ms`) : s === P.l.FastForwarding && (f.animationDuration = `${c}ms`)),
    s === P.l.Rewinding)
  ) {
    const e = n / (n + 1)
    p && h
      ? (f.animationDuration = `${c}ms`)
      : p
        ? (f.animationDuration = e * c + "ms")
        : h && ((f.animationDuration = (1 - e) * c + "ms"), (f.animationDelay = e * c + "ms"))
  }
  return (0, i.jsx)("div", {
    className: r(...m),
    style: f
  })
}
function D() {
  const e = x()
  return (
    (0, d.useEffect)(() => {
      document.documentElement.style.setProperty("--currentTourScenePosition", 100 * e + "%")
    }, [e]),
    null
  )
}
function U(e) {
  const { snapshot: t, numberOfHighlights: n, currentIndex: s, xOffset: a } = e,
    { name: o } = t,
    l = s === n - 1,
    c = {}
  0 === s ? ((c.left = "15px"), (c.transform = "none")) : l ? ((c.right = "10px"), (c.transform = "none")) : (c.left = `${a}px`)
  const d = r("highlight-box", "active"),
    u = r("image-name", {
      shadowed: !!o
    })
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        style: c,
        className: d
      },
      {
        children: [
          (0, i.jsx)(j.X, {
            resource: t.thumbnailUrl,
            className: "highlight-image"
          }),
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: u
              },
              {
                children: (0, i.jsx)(
                  "span",
                  Object.assign(
                    {
                      className: "static-text"
                    },
                    {
                      children: o
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
class F extends d.Component {
  constructor(e) {
    super(e),
      (this.scrollbarRef = (0, d.createRef)()),
      (this.reelRef = (0, d.createRef)()),
      (this.onClickSceneBar = async e => {
        e.preventDefault()
        const t = e.target.getAttribute("data-index")
        if (t) {
          const e = parseInt(t, 10),
            { tourPlaying: n, transition: i } = this.props,
            { commandBinder: s, analytics: r } = this.context
          try {
            n &&
              (await s.issueCommand(
                new TourStopCommand({
                  willResume: !0
                })
              )),
              i.active ||
                (r.track("JMYDCase_gui", {
                  gui_action: "click_scene_bar"
                }),
                await s.issueCommand(new TourStepCommand(e)),
                n &&
                  (await s.issueCommand(
                    new TourStartCommand({
                      index: e
                    })
                  )))
          } catch (e) {}
        }
      }),
      (this.onEnterSceneBar = e => {
        const t = e.target.getAttribute("data-index")
        if (t) {
          const n = parseInt(t, 10)
          this.setState({
            focusedIndex: n,
            xOffset: e.clientX
          })
        }
      }),
      (this.onLeaveSceneBar = e => {
        const t = e.target.getAttribute("data-index")
        if (t) {
          parseInt(t, 10) === this.state.focusedIndex &&
            this.setState({
              focusedIndex: -1
            })
        }
      }),
      (this.onScrollableChanged = e => {
        this.setState({
          scrollable: e
        })
      }),
      (this.onScrollPositionChange = e => {
        this.setState({
          scrollPosition: e
        })
      }),
      (this.state = {
        focusedIndex: -1,
        xOffset: 0,
        scrollLeft: 0,
        scrollPosition: M.Ij.None,
        scrollable: !1
      })
  }
  componentDidUpdate() {
    var e
    const { activeStep: t, tourPlaying: n } = this.props,
      i = this.scrollbarRef.current
    if (i && !i.isDragging && n) {
      const n = null === (e = this.reelRef.current) || void 0 === e ? void 0 : e.querySelector(`#highlightbar_${t}`)
      n && i.scrollToElement(n)
    }
  }
  renderSceneBar(e, t) {
    const { focusedIndex: n } = this.state,
      s = r("highlight-bar", {
        "highlight-bar-hover": t <= n
      })
    return (0, i.jsx)(
      "div",
      Object.assign(
        {
          id: `highlightbar_${t}`,
          className: "highlight-compacted",
          "data-index": t,
          onClick: this.onClickSceneBar,
          onMouseEnter: this.onEnterSceneBar,
          onMouseLeave: this.onLeaveSceneBar,
          onMouseMove: this.onEnterSceneBar
        },
        {
          children: (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: s
              },
              {
                children: (0, i.jsx)(C, {
                  index: t
                })
              }
            )
          )
        }
      ),
      `${e.id}_bar_${t}`
    )
  }
  renderHighlightBox() {
    const { focusedIndex: e, xOffset: t } = this.state
    if (-1 === e) return null
    const { highlights: n } = this.props,
      s = n[e]
    return (0, i.jsx)(U, {
      snapshot: s.snapshot,
      numberOfHighlights: n.length,
      currentIndex: e,
      xOffset: t
    })
  }
  render() {
    const { highlights: e, tourPlaying: t } = this.props
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: r("tour-story-reel", {
            "tour-playing": t
          }),
          ref: this.reelRef
        },
        {
          children: [
            (0, i.jsx)(D, {}),
            (0, i.jsx)(
              R.Z,
              Object.assign(
                {
                  direction: M.Nm.horizontal,
                  ref: this.scrollbarRef,
                  hideScrollbar: !0,
                  thumbScrollingOnly: !1,
                  waitToUpdate: 0 === e.length,
                  handleClick: this.onClickSceneBar,
                  onScrollableChanged: this.onScrollableChanged,
                  onScrollPositionChange: this.onScrollPositionChange
                },
                {
                  children: (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "highlights"
                      },
                      {
                        children: e.map((e, t) => this.renderSceneBar(e, t))
                      }
                    )
                  )
                }
              )
            ),
            this.renderHighlightBox()
          ]
        }
      )
    )
  }
}
F.contextType = AppReactContext

@p.Z
class V extends d.Component {
  constructor() {
    super(...arguments),
      (this.handleClick = () => {
        this.context.analytics.trackToolGuiEvent("hlr", "tour_progress")
        const { reelOpen: e } = this.props
        e || this.context.commandBinder.issueCommand(new HighlightReelToggleOpenCommand(!0))
      })
  }
  getTourSteps() {
    const { totalSteps: e, activeStep: t } = this.props,
      n = []
    for (let s = 0; s < e; s++)
      n.push(
        (0, i.jsx)(
          "div",
          {
            className: r({
              active: s === t
            })
          },
          s.toString()
        )
      )
    return n
  }
  render() {
    const { reelOpen: e, tourPlaying: t, activeStep: n, totalSteps: s } = this.props,
      a = n + 1 + "/" + s,
      o = -1 !== n && !e && a,
      l = -1 !== n && e && t
    return s > 0
      ? (0, i.jsxs)(
          "div",
          Object.assign(
            {
              id: "tour-progress",
              className: r({
                "faded-in": t,
                "full-width": e
              }),
              onClick: this.handleClick,
              "data-balloon": o,
              "data-balloon-pos": "right",
              "data-balloon-size": "xs"
            },
            {
              children: [
                l &&
                  (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "progress-number"
                      },
                      {
                        children: a
                      }
                    )
                  ),
                -1 !== n &&
                  (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "progress-bar"
                      },
                      {
                        children: this.getTourSteps()
                      }
                    )
                  )
              ]
            }
          )
        )
      : null
  }
}
V.contextType = AppReactContext
function G(e) {
  const { activeStep: t, highlights: n, openTool: s, tourMode: d, tourPlaying: u, transition: h } = e,
    p = (0, l.O)(),
    m = s === ToolsList.HLR
  if (d === TourMode.STORIES)
    return m && !u
      ? null
      : (0, i.jsx)(F, {
          highlights: n,
          tourPlaying: u,
          activeStep: t,
          transition: h
        })
  {
    const e = p && (!m || u),
      s = (null == n ? void 0 : n.length) || 0,
      a = 0 === s

    return (0, i.jsxs)(i.Fragment, {
      children: [
        (0, i.jsx)(
          c.N,
          Object.assign(
            {
              className: r("highlight-reel", {
                "reel-empty": a,
                closed: !e
              }),
              open: e
            },
            {
              children: a
                ? (0, i.jsx)(w, {})
                : (0, i.jsx)(O, {
                    highlights: n,
                    tourPlaying: u,
                    activeStep: t,
                    totalSteps: s,
                    transition: h
                  })
            }
          )
        ),
        u &&
          (0, i.jsx)(V, {
            activeStep: t,
            tourPlaying: u,
            totalSteps: s,
            reelOpen: p
          })
      ]
    })
  }
}

export const e = G
