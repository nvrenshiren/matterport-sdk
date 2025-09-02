import a from "classnames"
import * as s from "react"
import * as i from "react/jsx-runtime"

import * as l from "./77543"
import * as c from "../utils/scroll.utils"

import * as h from "./86667"
import { AppReactContext } from "../context/app.context"
import { ContainerData } from "../data/container.data"
import { isSmallScreen } from "../utils/61687"
class p extends s.Component {
  constructor(e, t) {
    super(e, t),
      (this.scrollbarRef = (0, s.createRef)()),
      (this.elementRef = (0, s.createRef)()),
      (this.isUnmounting = !1),
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
      (this.getScrollableContainer = () => {
        const e = this.scrollbarRef.current
        return (null == e ? void 0 : e.getScrollableContainer()) || void 0
      }),
      (this.handleHighlightClickable = () => {
        this.props.highlightClickable(!0)
      }),
      (this.state = {
        scrollLeft: 0,
        hideScrollbar: isSmallScreen((0, h.O)(t)),
        scrollPosition: c.Ij.None,
        scrollable: !1
      })
  }
  componentDidMount() {
    this.context.market.waitForData(ContainerData).then(e => {
      this.isUnmounting ||
        (this.resizeSubscription = e.onPropertyChanged("size", e => {
          this.setState({
            hideScrollbar: isSmallScreen(e)
          })
        }))
    }),
      this.onScrollableChanged(!0),
      this.onScrollPositionChange(c.Ij.Beginning)
  }
  componentWillUnmount() {
    var e
    ;(this.isUnmounting = !0), null === (e = this.resizeSubscription) || void 0 === e || e.cancel()
  }
  componentDidUpdate(e) {
    const { activeElement: t } = this.props
    if (null !== t && e.activeElement !== t) {
      const e = this.scrollbarRef.current
      e && e.scrollToElement(t)
    }
  }
  setSorting(e) {
    const t = this.elementRef.current
    if (t)
      if (e) {
        if ((t.classList.add("sorting"), this.props.mobile)) {
          const e = this.scrollbarRef.current
          e && e.pauseScrollHandling()
        }
      } else t.classList.remove("sorting")
  }
  render() {
    const { thumbScrollingOnly: e, children: t, totalSteps: n } = this.props,
      { hideScrollbar: s, scrollPosition: r, scrollable: o } = this.state,
      d = a({
        scrollable: o,
        [r]: !0
      })
    return (0, i.jsx)(
      "div",
      Object.assign(
        {
          id: "reel",
          className: d,
          ref: this.elementRef
        },
        {
          children: (0, i.jsx)(
            l.Z,
            Object.assign(
              {
                direction: c.Nm.horizontal,
                ref: this.scrollbarRef,
                hideScrollbar: s,
                thumbScrollingOnly: e,
                waitToUpdate: 0 === n,
                handleClick: this.handleHighlightClickable,
                onScrollableChanged: this.onScrollableChanged,
                onScrollPositionChange: this.onScrollPositionChange
              },
              {
                children: t
              }
            )
          )
        }
      )
    )
  }
}
p.contextType = AppReactContext
export const _ = p
