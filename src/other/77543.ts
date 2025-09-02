import a from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"

import * as g from "./84426"
import * as h from "./92915"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { diffOBJ } from "./16441"
import * as m from "./57151"
import { CheckThreshold } from "../utils/49827"
import { Animating } from "../utils/animating.utils"
import { easeOutQuad } from "../utils/ease.utils"
import * as u from "../utils/scroll.utils"
class y extends s.Component {
  constructor(e, t) {
    super(e, t),
      (this.outerWrapperRef = (0, s.createRef)()),
      (this.innerWrapperRef = (0, s.createRef)()),
      (this.contentContainerRef = (0, s.createRef)()),
      (this.dragStartScroll = 0),
      (this.listening = !1),
      (this.animation = null),
      (this.handlingPaused = !1),
      (this.isDragging = !1),
      (this.isUnmounting = !1),
      (this.handleEvent = e => {
        ;("mousedown" !== e.type && "pointerdown" !== e.type && "touchstart" !== e.type) || (this.handlingPaused = !1),
          this.props.suppressDrag || this.handlingPaused || this.inputFilter.handleEvent(e)
      }),
      (this.getScrolledOffset = () => {
        if (!this.innerWrapperRef.current || 0 === this.state.contentSize) return 0
        const e = this.props.direction === u.Nm.vertical ? "scrollTop" : "scrollLeft"
        return this.innerWrapperRef.current[e] / this.state.contentSize
      }),
      (this.getScrollableContainer = () => this.innerWrapperRef.current || void 0),
      (this.pauseScrollHandling = () => {
        ;(this.handlingPaused = !0), this.toggleDownEventListening(!1)
      }),
      (this.scrollWithScrollBar = e => {
        if (!this.props.suppressDrag) {
          const t = this.getAxis()
          e.hasOwnProperty(t) && this.scrollTo(e[t])
        }
      }),
      (this.scrollTo = e => {
        void 0 === e ||
          isNaN(e) ||
          (this.setScrollPosition(Math.max(Math.min(1, e) * this.state.contentSize, 0)),
          this.setState({
            scrollOffset: this.getScrollPosition()
          }))
      }),
      (this.handleDragStart = () => {
        this.setState({
          scrollCenter: null
        }),
          (this.isDragging = !0)
      }),
      (this.handlePressStart = () => {
        this.dragStartScroll = this.getScrollPosition()
      }),
      (this.handlePressMove = e => {
        if (!this.props.suppressDrag) {
          const t = (e[this.getAxis()] + this.dragStartScroll) / this.state.contentSize
          this.scrollTo(t)
        }
      }),
      (this.handleWheelEvent = e => {
        if (this.props.suppressDrag) return void e.preventDefault()
        this.props.direction === u.Nm.horizontal && 0 === e.deltaX && 0 !== e.deltaY
          ? (this.handlePressStart(),
            this.handlePressMove({
              x: e.deltaY,
              y: 0
            }))
          : (this.setState({
              scrollCenter: null
            }),
            this.handleExternalChange())
      }),
      (this.handleClick = e => {
        this.props.handleClick && this.props.handleClick(e)
      }),
      (this.handleDragEnd = (e, t) => {
        this.isDragging = !1
        const n = e[this.getAxis()] / t,
          i = Math.min(u.UI, Math.abs(u.UI * n)),
          s = this.getScrollPosition(),
          r = (n * i) / 2
        this.animation = new Animating({
          duration: i,
          startValue: s / this.state.contentSize,
          endValue: Math.max(0, Math.min((s + r) / this.state.contentSize, 1)),
          easingFunction: easeOutQuad
        })
      }),
      (this.handleResize = () => {
        !this.isUnmounting &&
          this.innerWrapperRef.current &&
          this.contentContainerRef.current &&
          this.state.scrollCenter &&
          this.scrollToElement(this.state.scrollCenter)
      }),
      (this.debouncedSetState = e => {
        new URL(`${document.location}`).searchParams.get("temp-disable-debounce-scroll")
          ? this.setState(e)
          : (cancelAnimationFrame(this.rAFHandle),
            (this.rAFHandle = requestAnimationFrame(() => {
              this.isUnmounting || this.setState(e)
            })))
      }),
      (this.onManualScroll = () => {
        this.props.onScrolled && this.props.onScrolled()
      }),
      (this.onButtonScroll = e => {
        if (this.contentContainerRef.current && this.props.steps) {
          const t = this.props.direction === u.Nm.vertical ? "offsetHeight" : "offsetWidth",
            n = this.contentContainerRef.current[t] / this.props.steps,
            i = this.getScrollPosition()
          let s
          ;(s = e ? (i + n) / this.state.contentSize : (i - n) / this.state.contentSize), this.scrollTo(CheckThreshold(s, 0, 1))
        }
      }),
      (this.onScrollBack = () => {
        this.onButtonScroll(!1)
      }),
      (this.onScrollForward = () => {
        this.onButtonScroll(!0)
      }),
      (this.onHoldScrollBack = () => {
        this.mouseInterval = window.setInterval(this.onScrollBack, 300)
      }),
      (this.onHoldScrollForward = () => {
        this.mouseInterval = window.setInterval(this.onScrollForward, 300)
      }),
      (this.onScrollButtonUp = () => {
        window.clearInterval(this.mouseInterval)
      }),
      (this.renderScrollBackButton = () => {
        const e = this.getScrollPosition(),
          t = this.props.direction === u.Nm.vertical ? "dpad-up" : "dpad-left",
          n = this.context.locale.t(PhraseKey.SCROLLING.SCROLL_BUTTON_LABEL),
          s = 0 === e
        return (0, i.jsx)(g.zx, {
          className: a("scroll-button", "scroll-back"),
          icon: t,
          ariaLabel: n,
          variant: g.Wu.TERTIARY,
          theme: "dark",
          disabled: s,
          onClick: this.onScrollBack,
          onPointerDown: this.onHoldScrollBack,
          onPointerUp: this.onScrollButtonUp
        })
      }),
      (this.renderScrollForwardButton = () => {
        const e = this.contentContainerRef.current,
          t = this.innerWrapperRef.current
        if (!e || !t) return null
        const n = this.getScrollPosition(),
          s = this.props.direction === u.Nm.vertical ? "offsetHeight" : "offsetWidth",
          r = this.props.direction === u.Nm.vertical ? "dpad-down" : "dpad-right",
          o = this.context.locale.t(PhraseKey.SCROLLING.SCROLL_BUTTON_LABEL),
          c = e[s] - t[s] - n <= 0
        return (0, i.jsx)(g.zx, {
          className: a("scroll-button", "scroll-forward"),
          icon: r,
          ariaLabel: o,
          variant: g.Wu.TERTIARY,
          theme: "dark",
          disabled: c,
          onClick: this.onScrollForward,
          onPointerDown: this.onHoldScrollForward,
          onPointerUp: this.onScrollButtonUp
        })
      }),
      (this.state = {
        scrollCenter: null,
        scrollOffset: 0,
        innerSize: 0,
        contentSize: 0
      }),
      (this.resizeObserver = new ResizeObserver(this.handleResize)),
      (this.inputFilter = new m.Z({
        handlePressStart: this.handlePressStart,
        handlePressMove: this.handlePressMove,
        handleDragStart: this.handleDragStart,
        handleDragEnd: this.handleDragEnd,
        handleClick: this.handleClick
      }))
  }
  componentDidMount() {
    this.outerWrapperRef.current && this.resizeObserver.observe(this.outerWrapperRef.current),
      this.props.thumbScrollingOnly
        ? this.innerWrapperRef.current && this.innerWrapperRef.current.addEventListener("click", this.handleClick)
        : this.toggleDownEventListening(!0),
      this.toggleDragHandling(!0),
      this.innerWrapperRef.current && this.innerWrapperRef.current.addEventListener("wheel", this.handleWheelEvent),
      this.inputFilter.setEnabled(!this.props.suppressDrag),
      this.handleExternalChange(!0)
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0),
      this.resizeObserver.disconnect(),
      this.innerWrapperRef.current && this.innerWrapperRef.current.removeEventListener("wheel", this.handleWheelEvent),
      this.toggleDragHandling(!1),
      this.props.thumbScrollingOnly
        ? this.innerWrapperRef.current && this.innerWrapperRef.current.removeEventListener("click", this.handleClick)
        : this.toggleDownEventListening(!1)
  }
  UNSAFE_componentWillReceiveProps(e) {
    e.thumbScrollingOnly && !this.props.thumbScrollingOnly
      ? (this.innerWrapperRef.current && this.innerWrapperRef.current.addEventListener("click", this.handleClick), this.toggleDownEventListening(!1))
      : !e.thumbScrollingOnly &&
        this.props.thumbScrollingOnly &&
        (this.toggleDownEventListening(!0), this.innerWrapperRef.current && this.innerWrapperRef.current.removeEventListener("click", this.handleClick)),
      e.suppressDrag !== this.props.suppressDrag && this.inputFilter.setEnabled(!e.suppressDrag)
  }
  componentDidUpdate(e, t) {
    this.props.waitToUpdate || this.handleExternalChange()
    const n = this.animation
    if (n)
      if (n.isAnimating) {
        const e = n.getUpdatedValue()
        window.requestAnimationFrame(() => {
          this.innerWrapperRef.current && this.scrollTo(e)
        })
      } else this.animation = null
    t.scrollOffset !== this.state.scrollOffset && this.props.onScrolled && this.props.onScrolled()
  }
  toggleDownEventListening(e) {
    const t = this.handleEvent
    this.innerWrapperRef.current &&
      (e
        ? window.PointerEvent
          ? this.innerWrapperRef.current.addEventListener("pointerdown", t)
          : (this.innerWrapperRef.current.addEventListener("mousedown", t), this.innerWrapperRef.current.addEventListener("touchstart", t))
        : window.PointerEvent
          ? this.innerWrapperRef.current.removeEventListener("pointerdown", t)
          : (this.innerWrapperRef.current.removeEventListener("mousedown", t), this.innerWrapperRef.current.removeEventListener("touchstart", t)))
  }
  toggleDragHandling(e) {
    const t = this.handleEvent
    !this.listening && e
      ? ((this.listening = !0),
        window.PointerEvent
          ? (window.addEventListener("pointermove", t), window.addEventListener("pointerup", t))
          : (window.addEventListener("mousemove", t),
            window.addEventListener("mouseleave", t),
            window.addEventListener("mouseup", t),
            window.addEventListener("touchmove", t),
            window.addEventListener("touchend", t),
            window.addEventListener("touchcancel", t)))
      : this.listening &&
        !e &&
        ((this.listening = !1),
        window.PointerEvent
          ? (window.removeEventListener("pointermove", t), window.removeEventListener("pointerup", t))
          : (window.removeEventListener("mousemove", t),
            window.removeEventListener("mouseleave", t),
            window.removeEventListener("mouseup", t),
            window.removeEventListener("touchmove", t),
            window.removeEventListener("touchend", t),
            window.removeEventListener("touchcancel", t)))
  }
  getScrollPosition() {
    if (!this.innerWrapperRef.current) return 0
    const e = this.props.direction === u.Nm.vertical ? "scrollTop" : "scrollLeft"
    return this.innerWrapperRef.current[e]
  }
  setScrollPosition(e) {
    if (!this.innerWrapperRef.current) return
    const t = this.props.direction === u.Nm.vertical ? "scrollTop" : "scrollLeft"
    this.innerWrapperRef.current[t] = e
  }
  getAxis() {
    return this.props.direction === u.Nm.vertical ? "y" : "x"
  }
  scrollToPercentage(e, t) {
    this.animation = new Animating({
      duration: t,
      startValue: this.getScrolledOffset(),
      endValue: Math.max(0, Math.min(1, e))
    })
  }
  scrollToElement(e) {
    const t = this.innerWrapperRef.current,
      n = this.outerWrapperRef.current
    if (!e || !t || !n) return
    if (!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINS)) return
    const i = this.props.direction === u.Nm.vertical
    this.setState({
      scrollCenter: e
    })
    const s = i ? "offsetTop" : "offsetLeft",
      r = i ? "offsetHeight" : "offsetWidth"
    let a = e[s] + e[r] / 2,
      o = e
    for (; o.parentElement && o !== t; ) (o = o.parentElement), (a += o[s])
    const l = (a - n.parentElement[r] / 2) / this.state.contentSize
    this.animation = new Animating({
      duration: u.UI,
      startValue: this.getScrollPosition() / this.state.contentSize,
      endValue: Math.max(0, Math.min(1, l))
    })
  }
  handleExternalChange(e) {
    if (this.isUnmounting || !this.innerWrapperRef.current || !this.contentContainerRef.current) return
    const t = this.props.direction === u.Nm.vertical ? "clientHeight" : "clientWidth",
      n = {
        innerSize: Number(this.innerWrapperRef.current && this.innerWrapperRef.current[t]) || 1,
        contentSize: Number(this.contentContainerRef.current && this.contentContainerRef.current[t]) || 1,
        scrollOffset: this.innerWrapperRef.current && this.getScrollPosition()
      }
    diffOBJ(this.state, n) && (e ? this.setState(n) : this.debouncedSetState(n))
  }
  needScrolling() {
    if (!this.contentContainerRef.current || !this.outerWrapperRef.current) return !1
    const e = this.props.direction === u.Nm.vertical ? "offsetHeight" : "offsetWidth"
    return this.contentContainerRef.current[e] > this.outerWrapperRef.current[e]
  }
  render() {
    const {
        hideScrollbar: e,
        children: t,
        onScrollableChanged: n,
        scrollButtons: s,
        steps: r,
        onScrollPositionChange: o,
        direction: l,
        className: c
      } = this.props,
      { innerSize: d, contentSize: u, scrollOffset: p } = this.state,
      m = s && !!r && this.needScrolling()
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: a("outerScrollbarWrapper", [l], [c], {
            "button-scrolling": m
          }),
          ref: this.outerWrapperRef
        },
        {
          children: [
            m && this.renderScrollBackButton(),
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "innerScrollbarWrapper",
                  ref: this.innerWrapperRef
                },
                {
                  children: (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "paddingScrollbarWrapper",
                        ref: this.contentContainerRef
                      },
                      {
                        children: t
                      }
                    )
                  )
                }
              )
            ),
            (0, i.jsx)(h.L, {
              direction: l,
              wrapperLength: d,
              childLength: u,
              scrollOffset: p,
              scrollTo: this.scrollWithScrollBar,
              forceHidden: !!e,
              onVisibilityChange: n,
              onScrollPositionChange: o,
              onThumbDrag: this.onManualScroll
            }),
            m && this.renderScrollForwardButton()
          ]
        }
      )
    )
  }
}
y.contextType = AppReactContext
export const Z = y
