import h from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"
import * as a from "./92915"
import { Animating } from "../utils/animating.utils"
import { easeOutQuad } from "../utils/ease.utils"
import * as r from "../utils/scroll.utils"
import { diffOBJ } from "./16441"
import * as c from "./57151"

class m extends s.Component {
  constructor(e) {
    super(e),
      (this.horizontal = (0, r.Sv)()),
      (this.vertical = (0, r.Sv)()),
      (this.prevSuppressDrag = !1),
      (this.manuallyMoved = !1),
      (this.isUnmounting = !1),
      (this.scrollPosition = {
        horizontal: r.Ij.Beginning,
        vertical: r.Ij.End
      }),
      (this.handleEvent = e => {
        this.inputFilter.handleEvent(e)
      }),
      (this.getScrollableContainer = () => this.innerWrapper),
      (this.getScrolledOffset = e => {
        const t = r.uG[e].scrollOffset
        return this.innerWrapper[t] / this.state[e].childLength
      }),
      (this.debouncedSetState = e => {
        new URL(`${document.location}`).searchParams.get("temp-disable-debounce-scroll")
          ? this.setState(e)
          : (cancelAnimationFrame(this.rAFHandle),
            (this.rAFHandle = requestAnimationFrame(() => {
              this.isUnmounting || this.setState(e)
            })))
      }),
      (this.state = {
        horizontal: (0, r.cL)(),
        vertical: (0, r.cL)()
      }),
      (this.scrollTo = this.scrollTo.bind(this)),
      (this.handlePressStart = this.handlePressStart.bind(this)),
      (this.handlePressMove = this.handlePressMove.bind(this)),
      (this.handleDragEnd = this.handleDragEnd.bind(this)),
      (this.handleDragStart = this.handleDragStart.bind(this)),
      (this.handleWheelEvent = this.handleWheelEvent.bind(this)),
      (this.handleClick = this.handleClick.bind(this)),
      (this.toggleVisibility = this.toggleVisibility.bind(this)),
      (this.hasManuallyMoved = this.hasManuallyMoved.bind(this)),
      (this.prevSuppressDrag = !!e.suppressDrag),
      (this.inputFilter = new c.Z({
        handlePressStart: this.handlePressStart,
        handlePressMove: this.handlePressMove,
        handleDragStart: this.handleDragStart,
        handleDragEnd: this.handleDragEnd,
        handleClick: this.handleClick
      }))
    const t = this.handleEvent
    window.PointerEvent || (window.addEventListener("mousemove", t), window.addEventListener("mouseleave", t), window.addEventListener("mouseup", t)),
      window.addEventListener("pointermove", t),
      window.addEventListener("pointerup", t),
      window.addEventListener("touchmove", t),
      window.addEventListener("touchend", t),
      window.addEventListener("touchcancel", t)
  }
  componentDidMount() {
    if (
      ((this.resizeObserver = new ResizeObserver(() => this.handleResize())),
      this.resizeObserver.observe(this.outerWrapper),
      this.innerWrapper.addEventListener("wheel", this.handleWheelEvent, !0),
      this.props.thumbScrollingOnly)
    )
      this.innerWrapper.addEventListener("click", this.handleClick)
    else {
      const e = this.handleEvent
      this.innerWrapper.addEventListener("mousedown", e),
        this.innerWrapper.addEventListener("pointerdown", e),
        this.innerWrapper.addEventListener("touchstart", e)
    }
    ;(this.firstChild = this.innerWrapper.firstElementChild),
      this.props.onScrollPositionChange && this.props.onScrollPositionChange(),
      this.props.hasOwnProperty("suppressDrag") && this.inputFilter.setEnabled(!!this.props.suppressDrag)
  }
  componentWillUnmount() {
    var e
    this.isUnmounting = !0
    const t = this.handleEvent
    null === (e = this.resizeObserver) || void 0 === e || e.disconnect(),
      window.PointerEvent ||
        (window.removeEventListener("mousemove", t), window.removeEventListener("mouseleave", t), window.removeEventListener("mouseup", t)),
      window.removeEventListener("pointermove", t),
      window.removeEventListener("touchmove", t),
      window.removeEventListener("pointerup", t),
      window.removeEventListener("touchend", t),
      window.removeEventListener("touchcancel", t),
      this.innerWrapper.removeEventListener("wheel", this.handleWheelEvent, !0),
      this.props.thumbScrollingOnly
        ? this.innerWrapper.removeEventListener("click", this.handleClick)
        : (this.innerWrapper.removeEventListener("mousedown", t),
          this.innerWrapper.removeEventListener("pointerdown", t),
          this.innerWrapper.removeEventListener("touchstart", t))
  }
  componentDidUpdate() {
    if (
      (this.props.waitToUpdate || this.handleExternalChange(),
      this.prevSuppressDrag !== this.props.suppressDrag &&
        (this.inputFilter.setEnabled(!!this.props.suppressDrag),
        this.props.suppressDrag && (this.manuallyMoved = !1),
        (this.prevSuppressDrag = !!this.props.suppressDrag)),
      !this.horizontal.animation && !this.vertical.animation)
    )
      return
    const e = {}
    for (const t in this.state) {
      const n = t
      this[n].animation && (this[n].animation.isAnimating ? (e[(0, r.O1)(n)] = this[n].animation.getUpdatedValue()) : (this[n].animation = null))
    }
    Object.keys(e).length > 0 &&
      window.requestAnimationFrame(() => {
        this.innerWrapper && this.scrollTo(e)
      })
  }
  scrollTo(e) {
    if (!e.hasOwnProperty(r.RD.x) && !e.hasOwnProperty(r.RD.y)) return
    const t = {}
    for (const n of this.getVisibleAxes(e)) {
      const i = (0, r.UC)(n),
        s = r.uG[i].scrollOffset,
        a = e[n]
      if (void 0 !== a) {
        if (isNaN(a)) return
        ;(this.innerWrapper[s] = Math.max(Math.min(1, a) * this.state[i].childLength, 0)),
          (t[i] = Object.assign(Object.assign({}, this.state[i]), {
            scrollOffset: this.innerWrapper[s]
          }))
      }
    }
    this.setState(t)
  }
  animatedScrollTo(e, t) {
    if (e.hasOwnProperty(r.RD.x) || e.hasOwnProperty(r.RD.y))
      for (const n of this.getVisibleAxes(e)) {
        const i = (0, r.UC)(n),
          s = r.uG[i].scrollOffset
        this[i].animation = new Animating({
          duration: t || r.UI,
          startValue: this.innerWrapper[s] / this.state[i].childLength,
          endValue: Math.max(0, Math.min(1, e[n]))
        })
      }
  }
  setScrollCenter(e) {
    if (!(e && e.compareDocumentPosition(this.innerWrapper) & Node.DOCUMENT_POSITION_CONTAINS)) return
    this.scrollCenter = e
    const t = {},
      n = {}
    for (const i of this.getVisibleAxes(this.state)) {
      const s = (0, r.O1)(i)
      t[s] = e[r.uG[i].positionOffset] + e[r.uG[i].offsetLength] / 2
      let a = e
      for (; a.parentElement && a !== this.innerWrapper; ) (a = a.parentElement), (t[s] += a[r.uG[i].positionOffset])
      const o = this.outerWrapper.parentElement[r.uG[i].offsetLength]
      n[s] = (t[s] - o / 2) / this.state[i].childLength
    }
    Object.keys(n).length > 0 && this.animatedScrollTo(n)
  }
  getVisibleAxes(e) {
    const t = []
    for (const n in e)
      (e[n] || "number" == typeof e[n]) && ((n in r.RD && this.state[(0, r.UC)(n)].isVisible) || (n in r.Nm && this.state[n].isVisible)) && t.push(n)
    return t
  }
  handleDragStart() {
    delete this.scrollCenter, this.hasManuallyMoved()
  }
  handlePressStart() {
    ;(this.horizontal.dragStartScroll = this.innerWrapper.scrollLeft), (this.vertical.dragStartScroll = this.innerWrapper.scrollTop)
  }
  handlePressMove(e) {
    const t = {}
    for (const n of this.getVisibleAxes(e)) {
      const i = (0, r.UC)(n)
      t[n] = (e[n] + this[i].dragStartScroll) / this.state[i].childLength
    }
    this.scrollTo(t)
  }
  handleWheelEvent(e) {
    this.props.singleScrollDirection === r.Nm.horizontal && 0 === e.deltaX && 0 !== e.deltaY
      ? (this.handlePressStart(),
        this.handlePressMove({
          x: e.deltaY,
          y: 0
        }))
      : (this.hasManuallyMoved(), this.handleExternalChange())
  }
  handleClick(e) {
    this.props.handleClick && this.props.handleClick(e)
  }
  toggleVisibility(e) {
    return t => {
      const n = Object.assign(Object.assign({}, this.state[e]), {
        isVisible: t
      })
      if (diffOBJ(this.state[e], n)) {
        const t = {}
        ;(t[e] = n), this.setState(t), this.props.onScrollbarVisibilityChange && this.props.onScrollbarVisibilityChange()
      }
    }
  }
  toggleScrollPosition(e) {
    return t => {
      ;(this.scrollPosition[e] = t), this.props.onScrollPositionChange && this.props.onScrollPositionChange(t)
    }
  }
  handleDragEnd(e, t) {
    for (const n of this.getVisibleAxes(e)) {
      const i = (0, r.UC)(n),
        s = e[n] / t,
        a = Math.min(r.UI, Math.abs(r.UI * s)),
        o = this.innerWrapper[r.uG[i].scrollOffset],
        c = (s * a) / 2
      this[i].animation = new Animating({
        duration: a,
        startValue: o / this.state[i].childLength,
        endValue: Math.max(0, Math.min((o + c) / this.state[i].childLength, 1)),
        easingFunction: easeOutQuad
      })
    }
    this.setState({})
  }
  handleResize() {
    this.isUnmounting || (this.scrollCenter && this.setScrollCenter(this.scrollCenter), this.handleExternalChange())
  }
  handleExternalChange() {
    if (this.isUnmounting) return
    const e = {}
    for (const t in this.state) {
      const n = t,
        i = r.uG[n].clientLength,
        s = Object.assign(Object.assign({}, this.state[n]), {
          wrapperLength: Number(this.innerWrapper && this.innerWrapper[i]) || 1,
          childLength: Number(this.firstChild && this.firstChild[i]) || 1,
          scrollOffset: this.innerWrapper && this.innerWrapper[r.uG[n].scrollOffset]
        })
      diffOBJ(this.state[n], s) && (e[n] = s)
    }
    Object.keys(e).length > 0 && this.debouncedSetState(e)
  }
  hasManuallyMoved() {
    ;(this.manuallyMoved = !0), this.props.onScrolled && this.props.onScrolled()
  }
  resetManuallyMoved() {
    this.manuallyMoved = !1
  }
  renderScrollbar(e, t) {
    const { forceHidden: n } = this.props,
      { wrapperLength: s, childLength: r, scrollOffset: o } = t
    return (0, i.jsx)(a.L, {
      direction: e,
      ref: e => {
        this.horizontal.scrollbar = e
      },
      wrapperLength: s,
      childLength: r,
      scrollOffset: o,
      scrollTo: this.scrollTo,
      onVisibilityChange: this.toggleVisibility(e),
      onScrollPositionChange: this.toggleScrollPosition(e),
      forceHidden: n,
      onThumbDrag: this.hasManuallyMoved
    })
  }
  render() {
    const { scrollbarHeight: e, singleScrollDirection: t, name: n, children: s } = this.props,
      a = {
        maxHeight: e || ""
      },
      o = t || `${r.Nm.vertical} ${r.Nm.horizontal}`
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: h("outerScrollbarWrapper", o, `scrollbar-${n}`),
          ref: e => {
            this.outerWrapper = e
          },
          style: a
        },
        {
          children: [
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "innerScrollbarWrapper",
                  ref: e => {
                    this.innerWrapper = e
                  }
                },
                {
                  children: (0, i.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "paddingScrollbarWrapper"
                      },
                      {
                        children: s
                      }
                    )
                  )
                }
              )
            ),
            t !== r.Nm.vertical && this.renderScrollbar(r.Nm.horizontal, this.state.horizontal),
            t !== r.Nm.horizontal && this.renderScrollbar(r.Nm.vertical, this.state.vertical)
          ]
        }
      )
    )
  }
}
export const Z = m
