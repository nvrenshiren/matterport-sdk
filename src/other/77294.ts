import * as i from "react"
import { popperGenerator, defaultModifiers } from "../lib/popperjs"

var de = popperGenerator({
  defaultModifiers
})
import he from "react-fast-compare"

var pe = function (e) {
    return e.reduce(function (e, t) {
      var n = t[0],
        i = t[1]
      return (e[n] = i), e
    }, {})
  },
  me = "undefined" != typeof window && window.document && window.document.createElement ? i.useLayoutEffect : i.useEffect,
  fe = [],
  ge = function (e, t, n) {
    void 0 === n && (n = {})
    var s = i.useRef(null),
      r = {
        onFirstUpdate: n.onFirstUpdate,
        placement: n.placement || "bottom",
        strategy: n.strategy || "absolute",
        modifiers: n.modifiers || fe
      },
      a = i.useState({
        styles: {
          popper: {
            position: r.strategy,
            left: "0",
            top: "0"
          },
          arrow: {
            position: "absolute"
          }
        },
        attributes: {}
      }),
      o = a[0],
      l = a[1],
      c = i.useMemo(function () {
        return {
          name: "updateState",
          enabled: !0,
          phase: "write",
          fn: function (e) {
            var t = e.state,
              n = Object.keys(t.elements)
            l({
              styles: pe(
                n.map(function (e) {
                  return [e, t.styles[e] || {}]
                })
              ),
              attributes: pe(
                n.map(function (e) {
                  return [e, t.attributes[e]]
                })
              )
            })
          },
          requires: ["computeStyles"]
        }
      }, []),
      d = i.useMemo(
        function () {
          var e = {
            onFirstUpdate: r.onFirstUpdate,
            placement: r.placement,
            strategy: r.strategy,
            modifiers: [].concat(r.modifiers, [
              c,
              {
                name: "applyStyles",
                enabled: !1
              }
            ])
          }
          return he(s.current, e) ? s.current || e : ((s.current = e), e)
        },
        [r.onFirstUpdate, r.placement, r.strategy, r.modifiers, c]
      ),
      u = i.useRef()
    return (
      me(
        function () {
          u.current && u.current.setOptions(d)
        },
        [d]
      ),
      me(
        function () {
          if (null != e && null != t) {
            var i = (n.createPopper || de)(e, t, d)
            return (
              (u.current = i),
              function () {
                i.destroy(), (u.current = null)
              }
            )
          }
        },
        [e, t, n.createPopper]
      ),
      {
        state: u.current ? u.current.state : null,
        styles: o.styles,
        attributes: o.attributes,
        update: u.current ? u.current.update : null,
        forceUpdate: u.current ? u.current.forceUpdate : null
      }
    )
  }

export const D = ge
