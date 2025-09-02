import * as s from "react/jsx-runtime"
import * as r from "react"
import o from "classnames"

import * as l from "./38772"
enum PhaseType {
  CLOSED = "closed",
  OPEN = "open",
  UNLOADING = "unloading"
}
@l.Z
class d extends r.Component {
  constructor(e) {
    super(e),
      (this.ref = (0, r.createRef)()),
      (this.closeTimeout = 0),
      (this.onTransitionCancel = e => {
        e.target === e.currentTarget &&
          this.state.phase === PhaseType.UNLOADING &&
          (window.clearTimeout(this.closeTimeout),
          this.setState({
            phase: PhaseType.CLOSED,
            activeChild: null
          }))
      }),
      (this.onTransitionEnd = e => {
        e.target === e.currentTarget &&
          this.state.phase === PhaseType.UNLOADING &&
          (window.clearTimeout(this.closeTimeout),
          this.setState({
            phase: PhaseType.CLOSED,
            activeChild: null
          }))
      }),
      (this.state = {
        phase: e.open ? PhaseType.OPEN : PhaseType.CLOSED,
        activeChild: (e.selectChild && e.childKey) || null
      })
  }
  componentDidMount() {
    this.ref.current && this.ref.current.addEventListener("transitioncancel", this.onTransitionCancel), this.props.focus && this.focus()
  }
  componentWillUnmount() {
    window.clearTimeout(this.closeTimeout), this.ref.current && this.ref.current.removeEventListener("transitioncancel", this.onTransitionCancel)
  }
  UNSAFE_componentWillReceiveProps(e) {
    const { open: t, childKey: n } = this.props
    t && !e.open
      ? (this.setState({
          phase: PhaseType.UNLOADING
        }),
        window.clearTimeout(this.closeTimeout),
        (this.closeTimeout = window.setTimeout(() => {
          this.state.phase === PhaseType.UNLOADING &&
            this.setState({
              phase: PhaseType.CLOSED,
              activeChild: null
            })
        }, 1e3)))
      : !t && e.open
        ? (window.clearTimeout(this.closeTimeout),
          this.setState({
            phase: PhaseType.OPEN,
            activeChild: (e.selectChild && e.childKey) || null
          }))
        : n !== e.childKey &&
          this.setState({
            activeChild: (e.selectChild && e.childKey) || null
          })
  }
  focus() {
    this.ref.current && this.ref.current.focus()
  }
  renderChildren() {
    const { children: e, selectChild: t } = this.props,
      { phase: n, activeChild: s } = this.state
    return n === PhaseType.CLOSED || (t && !s) ? null : t ? (e && Array.isArray(e) && e.length && e.find(e => e && e.key === s)) || null : e
  }
  render() {
    const { className: e, firstChild: t, style: n, onKeyDown: r, onPointerDown: a, onPointerUp: l, onClick: c, focus: d } = this.props,
      { phase: u } = this.state,
      h = o(
        {
          unloading: u === PhaseType.UNLOADING
        },
        e
      )
    return (0, s.jsxs)(
      "div",
      Object.assign(
        {
          ref: this.ref,
          className: h,
          style: n,
          onTransitionEnd: this.onTransitionEnd,
          onClick: c,
          onPointerDown: a,
          onPointerUp: l,
          onKeyDown: r,
          tabIndex: d ? 0 : void 0,
          "aria-live": this.props["aria-live"],
          "aria-atomic": this.props["aria-atomic"]
        },
        {
          children: [t || null, this.renderChildren()]
        }
      )
    )
  }
}

export const N = d
