import * as ii from "react/jsx-runtime"

import a from "classnames"

import * as o from "react"
import * as l from "./16507"
import * as c from "./38772"

var u = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
var h = {
  DOWN: "down",
  UP: "up"
}
@c.Z
class p extends o.Component {
  constructor(e) {
    super(e),
      (this.elementRef = (0, o.createRef)()),
      (this.onOutsideClick = e => {
        this.toggleDropdown(!1)
      }),
      (this.onToggleClick = e => {
        e.stopPropagation(), this.toggleDropdown()
      }),
      (this.onTransitionEnd = e => {
        ;(e && e.target !== e.currentTarget) ||
          (window.clearTimeout(this.transitionTimeout),
          this.setState({
            transitioning: !1
          }))
      }),
      (this.toggleDropdown = e => {
        const { open: t } = this.state,
          n = void 0 !== e ? e : !t
        n ? window.addEventListener("click", this.onOutsideClick) : window.removeEventListener("click", this.onOutsideClick),
          (this.transitionTimeout = window.setTimeout(this.onTransitionEnd, 1e3)),
          this.setState({
            open: n,
            transitioning: !0
          })
      }),
      (this.state = {
        open: !1,
        transitioning: !1
      })
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.onOutsideClick)
  }
  render() {
    const { open: e, transitioning: t } = this.state,
      n = this.props,
      { children: s, className: r, direction: o } = n,
      c = u(n, ["children", "className", "direction"]),
      d = {
        up: o === h.UP,
        open: e,
        transitioning: t
      }
    return (0, ii.jsxs)(
      "div",
      Object.assign(
        {
          ref: this.elementRef,
          className: a("dropdown", d, r)
        },
        c,
        {
          children: [
            (0, ii.jsx)(
              "div",
              Object.assign(
                {
                  className: "dropdown-mask"
                },
                {
                  children: (0, ii.jsx)(
                    "div",
                    Object.assign(
                      {
                        className: "dropdown-menu",
                        onTransitionEnd: this.onTransitionEnd
                      },
                      {
                        children: s
                      }
                    )
                  )
                }
              )
            ),
            (0, ii.jsx)(
              "div",
              Object.assign(
                {
                  className: "dropdown-toggle"
                },
                {
                  children: (0, ii.jsx)(SettingsLabel, {
                    iconClass: "icon-toolbar-more-horiz",
                    onClick: this.onToggleClick,
                    className: "dropdown-toggle"
                  })
                }
              )
            )
          ]
        }
      )
    )
  }
}
p.defaultProps = {
  direction: h.DOWN
}

import * as f from "./95941"
import { SettingsLabel } from "./16507"
import { functionCommon } from "@ruler3d/common"

var v = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const y = "collapsed"
@c.Z
class b extends o.Component {
  constructor(e) {
    super(e),
      (this.contentRef = (0, o.createRef)()),
      (this.collapsedRef = (0, o.createRef)()),
      (this.toggleRef = (0, o.createRef)()),
      (this.onResize = () => {
        this.update()
      }),
      (this.update = functionCommon.debounce(() => {
        var e
        const t = null === (e = this.toggleRef.current) || void 0 === e ? void 0 : e.elementRef.current,
          n = this.contentRef.current,
          i = this.collapsedRef.current
        if (!n || !i || !t) return
        const s = n.children,
          r = i.children
        if (!s || s.length !== r.length) return
        const a = n.offsetWidth,
          o = t.offsetWidth || 0
        let l = 0,
          c = 0
        for (let e = 0; e < s.length; e++) {
          let t = s[e].offsetWidth || 0
          c || e !== s.length - 1 || (t -= o),
            (l += t),
            l <= a ? (s[e].classList.remove(y), r[e].classList.add(y)) : (c++, s[e].classList.add(y), r[e].classList.remove(y))
        }
        c !== this.state.collapsedCount &&
          this.setState({
            collapsedCount: c
          })
      }, 50)),
      (this.state = {
        collapsedCount: 0
      }),
      (this.observer = new ResizeObserver(this.onResize))
  }
  componentDidMount() {
    this.connectObserver(), this.update()
  }
  componentDidUpdate() {
    this.update()
  }
  componentWillUnmount() {
    this.disconnectObserver(), this.reset()
  }
  connectObserver() {
    const e = this.contentRef.current
    e && this.observer.observe(e)
  }
  disconnectObserver() {
    this.observer && this.observer.disconnect()
  }
  reset() {
    const e = this.contentRef.current
    if (!e) return
    const t = e.querySelectorAll(".collapsed")
    Array.from(t).forEach(e => e.classList.remove(y))
  }
  getExpandedChildren() {
    const { children: e } = this.props,
      { collapsedCount: t } = this.state,
      n = o.Children.count(e) - t,
      s = []
    return (
      o.Children.forEach(e, (e, t) => {
        t < n &&
          s.push(
            (0, ii.jsx)(
              o.Fragment,
              {
                children: e
              },
              t
            )
          )
      }),
      s
    )
  }
  getCollapsedChildren() {
    const { children: e } = this.props,
      { collapsedCount: t } = this.state,
      n = o.Children.count(e) - t,
      s = []
    return (
      o.Children.forEach(e, (e, t) => {
        t >= n &&
          s.push(
            (0, ii.jsx)(
              o.Fragment,
              {
                children: e
              },
              t
            )
          )
      }),
      s
    )
  }
  render() {
    const e = this.props,
      { children: t, className: n } = e,
      s = v(e, ["children", "className"]),
      { collapsedCount: r } = this.state,
      o = `collapsible-list ${n}`,
      l = {
        hidden: 0 === r
      }
    if (!t || !Array.isArray(t)) return t
    const c = this.getExpandedChildren(),
      d = this.getCollapsedChildren()
    return (0, ii.jsxs)(
      "div",
      Object.assign(
        {
          className: a(o)
        },
        s,
        {
          children: [
            (0, ii.jsxs)(
              "div",
              Object.assign(
                {
                  ref: this.contentRef,
                  className: "collapsible-list-items"
                },
                {
                  children: [
                    (0, ii.jsx)(
                      f.H.Provider,
                      Object.assign(
                        {
                          value: {
                            outOfScope: !1
                          }
                        },
                        {
                          children: c
                        }
                      )
                    ),
                    (0, ii.jsx)(
                      f.H.Provider,
                      Object.assign(
                        {
                          value: {
                            outOfScope: !0
                          }
                        },
                        {
                          children: d
                        }
                      )
                    )
                  ]
                }
              )
            ),
            (0, ii.jsx)(
              p,
              Object.assign(
                {
                  ref: this.toggleRef,
                  direction: h.UP,
                  className: a(l)
                },
                {
                  children: (0, ii.jsxs)(
                    "div",
                    Object.assign(
                      {
                        ref: this.collapsedRef,
                        className: "collapsible-list-menu"
                      },
                      {
                        children: [
                          (0, ii.jsx)(
                            f.H.Provider,
                            Object.assign(
                              {
                                value: {
                                  outOfScope: !0
                                }
                              },
                              {
                                children: c
                              }
                            )
                          ),
                          (0, ii.jsx)(
                            f.H.Provider,
                            Object.assign(
                              {
                                value: {
                                  outOfScope: !1
                                }
                              },
                              {
                                children: d
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
          ]
        }
      )
    )
  }
}
b.defaultProps = {}
export const i = b
