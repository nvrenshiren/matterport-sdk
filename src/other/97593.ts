import o from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"
import * as r from "./38772"

import * as d from "./57151"
import * as u from "../utils/ease.utils"
import { supportedPassive } from "../utils/event.utils"
import { easeInOutExpo } from "../utils/ease.utils"

@r.Z
class p extends s.Component {
  constructor(e) {
    super(e),
      (this.usePointerEvents = window.PointerEvent),
      (this.scrollerRef = (0, s.createRef)()),
      (this.trackRef = (0, s.createRef)()),
      (this.thumbRef = (0, s.createRef)()),
      (this.focusedSelector = null),
      (this.listening = !1),
      (this.startY = 0),
      (this.onThumb = !1),
      (this.scrollTop = 0),
      (this.isUnmounting = !1),
      (this.handleResize = () => {
        this.isUnmounting || (this.computeStateValues(), this.focusedSelector && this.scrollToSelector(this.focusedSelector))
      }),
      (this.handleWheelEvent = e => {
        this.props.disabled || ((this.onThumb = !1), (this.focusedSelector = null), this.scrollBy(e.deltaY))
      }),
      (this.handleEvent = e => {
        if (this.scrollerRef.current && !this.props.disabled) {
          this.scrollVelocityPixelsMS = 0
          if ("mousedown" === e.type || "pointerdown" === e.type || "touchstart" === e.type) {
            const t = e.target
            this.onThumb = t && t.classList.contains("scroller-thumb")
          }
          ;(this.focusedSelector = null), this.inputFilter.handleEvent(e)
        }
      }),
      (this.handlePressStart = e => {
        this.onThumb ? (this.startY = this.getThumbTop()) : (this.startY = this.getScrollTop())
      }),
      (this.handlePressMove = e => {
        const { trackHeight: t, contentsHeight: n } = this.state
        let i
        this.onThumb ? ((i = (this.startY - e.y) / t), this.scrollToPercent(i)) : ((i = (e.y + this.startY) / n), this.scrollToPercent(i))
      }),
      (this.handleDragStart = () => {}),
      (this.handleDragEnd = (e, t) => {
        ;(this.scrollVelocityPixelsMS = e.y / t),
          (this.lastScrollTimeMS = void 0),
          Math.abs(this.scrollVelocityPixelsMS) < 1 ? (this.scrollVelocityPixelsMS = 0) : this.animateScroll()
      }),
      (this.onTrackClick = e => {
        const t = this.trackRef.current
        if (e.target !== t || !t) return
        const n = this.getThumbHeight(),
          i = this.getThumbTop(),
          s = t.getBoundingClientRect().top,
          r = this.state.trackHeight
        let a
        ;(a = e.clientY < s + i ? Math.max(0, (i - n) / r) : Math.min(r, (i + n) / r)), this.scrollToPercent(a)
      }),
      (this.scrollToPercent = e => {
        this.isOverflowing() && this.scrollerRef.current && !isNaN(e) && this.setScrollPosition(Math.max(Math.min(1, e) * this.state.contentsHeight, 0))
      }),
      (this.scrollBy = e => {
        this.isOverflowing() && this.scrollerRef.current && !isNaN(e) && this.setScrollPosition(Math.max(this.scrollerRef.current.scrollTop + e, 0))
      }),
      (this.computeStateValues = () => {
        if (this.props.disabled) return
        const e = this.scrollerRef.current,
          t = this.trackRef.current,
          n = Number(e && e.clientHeight) || 1,
          i = Number(t && t.clientHeight) || n,
          s = Number(this.contents && this.contents.clientHeight) || 1,
          r = Number(this.contents && this.contents.offsetTop) || 0
        this.debouncedSetState({
          scrollerHeight: n,
          contentsHeight: s,
          trackHeight: i,
          offsetTop: r
        })
      }),
      (this.debouncedSetState = e => {
        new URL(`${document.location}`).searchParams.get("temp-disable-debounce-scroll")
          ? this.setState(e)
          : (cancelAnimationFrame(this.rAFHandle),
            (this.rAFHandle = requestAnimationFrame(() => {
              this.isUnmounting || this.setState(e)
            })))
      }),
      (this.setContentsRef = e => {
        e ? ((this.contents = e), this.resizeObserver.observe(this.contents)) : this.contents && this.resizeObserver.unobserve(this.contents)
      }),
      (this.setContainerRef = e => {
        e ? ((this.container = e), this.resizeObserver.observe(e)) : this.container && this.resizeObserver.unobserve(this.container)
      }),
      (this.state = {
        scrollerHeight: 1,
        contentsHeight: 1,
        trackHeight: 1,
        offsetTop: 0
      }),
      (this.resizeObserver = new ResizeObserver(this.handleResize)),
      (this.inputFilter = new d.Z({
        handlePressStart: this.handlePressStart,
        handlePressMove: this.handlePressMove,
        handleDragStart: this.handleDragStart,
        handleDragEnd: this.handleDragEnd
      }))
  }
  componentDidMount() {
    this.toggleEventHandling(!0), this.computeStateValues()
  }
  componentWillUnmount() {
    ;(this.isUnmounting = !0), this.toggleEventHandling(!1), this.resizeObserver && this.resizeObserver.disconnect()
  }
  componentDidUpdate(e, t) {
    this.scrollerRef.current && e.disabled !== this.props.disabled && (this.props.disabled ? this.toggleEventHandling(!1) : this.toggleEventHandling(!0))
  }
  resetScrollTop() {
    ;(this.focusedSelector = null), this.setScrollPosition(0)
  }
  getScroller() {
    return this.scrollerRef.current
  }
  getScrollHeight() {
    return Number(this.contents && this.contents.clientHeight) || 0
  }
  scrollToElement(e, t = "center", n) {
    const i = this.scrollerRef.current
    if (!e || !i) return
    if (!(e.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINS)) return
    if (!this.isOverflowing()) return
    const { contentsHeight: s, scrollerHeight: r, offsetTop: a } = this.state
    let o = e.offsetTop
    if (!n) {
      let t = e
      for (; t.parentElement && ((t = t.parentElement), (o += t.offsetTop), t.offsetParent !== this.contents); );
    }
    let l = a + o
    "center" === t && (l += e.offsetHeight / 2 - r / 2), (l = Math.max(Math.min(s, l), 0))
    const c = i.scrollTop,
      d = l - c
    let h = 0
    const p = e => {
      h || (h = e)
      const t = e - h,
        n = easeInOutExpo(t, c, d, 500)
      i.scrollTo(0, n), t < 500 ? window.requestAnimationFrame(p) : this.setScrollPosition(l)
    }
    window.requestAnimationFrame(p)
  }
  scrollToSelector(e, t = "center", n) {
    const i = this.scrollerRef.current
    if (!i) return
    const s = i.querySelector(e)
    s ? ((this.focusedSelector = e), this.scrollToElement(s, t, n)) : (this.focusedSelector = null)
  }
  setScrollPosition(e) {
    const t = this.scrollerRef.current
    if (t) {
      const n = t.scrollTop
      ;(t.scrollTop = e), (this.scrollTop = this.getScrollTop()), this.props.onScrolled && n !== this.scrollTop && this.props.onScrolled(this.scrollTop)
      const i = this.thumbRef.current
      i && ((i.style.height = `${this.getThumbHeight()}px`), (i.style.top = `${this.getThumbTop()}px`))
    }
  }
  toggleEventHandling(e) {
    const t = this.scrollerRef.current,
      n = this.handleEvent,
      i = supportedPassive
        ? {
            passive: !0
          }
        : void 0
    !this.listening && e && t
      ? (t.addEventListener("wheel", this.handleWheelEvent, i),
        this.usePointerEvents
          ? (t.addEventListener("pointerdown", n, i), window.addEventListener("pointermove", n, i), window.addEventListener("pointerup", n, i))
          : (t.addEventListener("touchstart", n, i),
            t.addEventListener("mousedown", n, i),
            window.addEventListener("mousemove", n, i),
            window.addEventListener("mouseleave", n, i),
            window.addEventListener("mouseup", n, i),
            window.addEventListener("touchmove", n, i),
            window.addEventListener("touchend", n, i),
            window.addEventListener("touchcancel", n, i)))
      : this.listening &&
        !e &&
        t &&
        (t.removeEventListener("wheel", this.handleWheelEvent),
        this.usePointerEvents
          ? (t.removeEventListener("pointerdown", n), window.removeEventListener("pointermove", n), window.removeEventListener("pointerup", n))
          : (t.removeEventListener("touchstart", n),
            t.removeEventListener("mousedown", n),
            window.removeEventListener("mousemove", n),
            window.removeEventListener("mouseleave", n),
            window.removeEventListener("mouseup", n),
            window.removeEventListener("touchmove", n),
            window.removeEventListener("touchend", n),
            window.removeEventListener("touchcancel", n)))
  }
  animateScroll() {
    window.requestAnimationFrame(e => {
      void 0 === this.lastScrollTimeMS && (this.lastScrollTimeMS = e)
      let t = e - this.lastScrollTimeMS
      if (t > 0) {
        this.scrollBy(this.scrollVelocityPixelsMS * t)
        const e = this.scrollVelocityPixelsMS > 0 ? -1 : 1
        for (; t > 0; ) (this.scrollVelocityPixelsMS += this.scrollVelocityPixelsMS * this.scrollVelocityPixelsMS * 0.01 * e), (t -= 1)
      }
      Math.abs(this.scrollVelocityPixelsMS) > 0.001 && this.animateScroll()
    })
  }
  getThumbTop() {
    const { contentsHeight: e, trackHeight: t } = this.state
    return Math.min((this.scrollTop / e) * t, t - this.getThumbHeight())
  }
  getThumbHeight() {
    const { scrollerHeight: e, contentsHeight: t, trackHeight: n } = this.state
    return (e / t) * n
  }
  getScrollTop() {
    return this.scrollerRef.current ? this.scrollerRef.current.scrollTop : 0
  }
  isOverflowing() {
    const { contentsHeight: e, scrollerHeight: t, offsetTop: n } = this.state
    return e + n > t
  }
  renderTrack() {
    const e = {
      height: `${this.getThumbHeight()}px`,
      top: `${this.getThumbTop()}px`
    }
    return (0, i.jsx)(
      "div",
      Object.assign(
        {
          ref: this.trackRef,
          className: "scroller-track",
          onClick: this.onTrackClick
        },
        {
          children: (0, i.jsx)("div", {
            ref: this.thumbRef,
            className: "scroller-thumb",
            style: e,
            onPointerDown: this.usePointerEvents ? this.handleEvent : void 0,
            onMouseDown: this.usePointerEvents ? void 0 : this.handleEvent,
            onTouchStart: this.usePointerEvents ? void 0 : this.handleEvent
          })
        }
      )
    )
  }
  render() {
    const { children: e, className: t, hideThumb: n, disabled: s } = this.props,
      r = !s && this.isOverflowing()
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          ref: this.setContainerRef,
          className: o("scroller-container", t)
        },
        {
          children: [
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "scroller-scroller",
                  ref: this.scrollerRef
                },
                {
                  children: (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "scroller-contents",
                        ref: this.setContentsRef
                      },
                      {
                        children: e
                      }
                    )
                  )
                }
              )
            ),
            !n && r && this.renderTrack()
          ]
        }
      )
    )
  }
}

export const T = p
