import * as i from "react/jsx-runtime"
import * as s from "react"
import * as r from "./16441"
import * as a from "./57151"
import * as o from "../utils/scroll.utils"
import * as l from "./44523"
import { diffOBJ } from "./16441"
class c extends s.Component {
  constructor(e) {
    super(e),
      (this.state = {
        visible: !1,
        trackLength: 1,
        thumbLength: 1,
        thumbOffset: 0
      }),
      (this.direction = o.uG[e.direction]),
      (this.handlePressStart = this.handlePressStart.bind(this)),
      (this.handlePressMove = this.handlePressMove.bind(this)),
      (this.handleTrackClick = this.handleTrackClick.bind(this)),
      (this.inputFilter = new a.Z({
        handlePressStart: this.handlePressStart,
        handlePressMove: this.handlePressMove
      })),
      window.PointerEvent ||
        (window.addEventListener("mousemove", this.inputFilter.handleEvent),
        window.addEventListener("mouseleave", this.inputFilter.handleEvent),
        window.addEventListener("mouseup", this.inputFilter.handleEvent)),
      window.addEventListener("pointermove", this.inputFilter.handleEvent),
      window.addEventListener("pointerup", this.inputFilter.handleEvent)
  }
  componentWillUnmount() {
    window.PointerEvent ||
      (window.removeEventListener("mousemove", this.inputFilter.handleEvent),
      window.removeEventListener("mouseleave", this.inputFilter.handleEvent),
      window.removeEventListener("mouseup", this.inputFilter.handleEvent)),
      window.removeEventListener("pointermove", this.inputFilter.handleEvent),
      window.removeEventListener("pointerup", this.inputFilter.handleEvent)
  }
  getTrackLength() {
    return Number((this.thumbTrack && this.thumbTrack[this.direction.clientLength]) || this.props.containerSize.width)
  }
  handleTrackClick(e) {
    if (e.target !== this.thumbTrack) return
    const t = this.direction.eventPosition,
      n = this.thumbTrack.getBoundingClientRect()[this.direction.offsetName],
      i = e[t] < n + this.state.thumbOffset,
      s = this.getTrackLength()
    let r = 0
    ;(r = i ? Math.max(0, (this.state.thumbOffset - this.state.thumbLength) / s) : Math.min(s, (this.state.thumbOffset + this.state.thumbLength) / s)),
      this.props.scrollTo({
        [(0, o.O1)(this.props.direction)]: r
      })
  }
  handlePressStart(e) {
    this.dragStartThumbOffset = this.state.thumbOffset
  }
  handlePressMove(e) {
    const t = this.getTrackLength(),
      n = (this.dragStartThumbOffset - e[this.direction.delta]) / t
    this.props.scrollTo({
      [(0, o.O1)(this.props.direction)]: n
    }),
      this.props.onThumbDrag && this.props.onThumbDrag()
  }
  componentDidUpdate() {
    const { wrapperLength: e, childLength: t, scrollOffset: n } = this.props
    if (e > 0 && t > 0) {
      const i = this.getTrackLength(),
        s = (e / t) * i,
        a = {
          thumbLength: s,
          visible: t > e,
          thumbOffset: Math.min((n / t) * i, i - s)
        }
      if (diffOBJ(this.state, a)) {
        const e = this.state.visible !== a.visible
        e && this.props.onVisibilityChange && this.props.onVisibilityChange(a.visible)
        const t = (0, o.w5)(a.thumbOffset / (i - s), a.visible)
        ;(t !== this.scrollPosition || e) && ((this.scrollPosition = t), this.props.onScrollPositionChange && this.props.onScrollPositionChange(t)),
          this.setState(a)
      }
    }
  }
  render() {
    const e = {
        [`${this.direction.lengthName}`]: this.state.thumbLength + "px",
        [`${this.direction.offsetName}`]: this.state.thumbOffset + "px"
      },
      t = this.inputFilter.handleEvent,
      n = window.PointerEvent,
      s = n ? t : void 0,
      r = n ? void 0 : t,
      a = n ? void 0 : t
    return (0, i.jsx)("div", {
      children:
        this.state.visible &&
        !this.props.forceHidden &&
        (0, i.jsx)(
          "div",
          Object.assign(
            {
              className: "scrollbarTrack " + this.props.direction,
              onClick: this.handleTrackClick,
              ref: e => {
                this.thumbTrack = e
              }
            },
            {
              children: (0, i.jsx)("div", {
                className: "scrollbarThumb",
                style: e,
                onPointerDown: s,
                onMouseDown: a,
                onTouchStart: r
              })
            }
          )
        )
    })
  }
}
const d = (0, l.P)(c)
export const L = d
