import * as i from "react"
function s(e, t, n) {
  return e[t] ? (e[t][0] ? e[t][0][n] : e[t][n]) : "contentBoxSize" === t ? e.contentRect["inlineSize" === n ? "width" : "height"] : void 0
}
function r(e) {
  void 0 === e && (e = {})
  var t = e.onResize,
    n = (0, i.useRef)(void 0)
  n.current = t
  var r = e.round || Math.round,
    a = (0, i.useRef)(),
    o = (0, i.useState)({
      width: void 0,
      height: void 0
    }),
    l = o[0],
    c = o[1],
    d = (0, i.useRef)(!1)
  ;(0, i.useEffect)(function () {
    return (
      (d.current = !1),
      function () {
        d.current = !0
      }
    )
  }, [])
  var u = (0, i.useRef)({
      width: void 0,
      height: void 0
    }),
    h = (function (e, t) {
      var n = (0, i.useRef)(null),
        s = (0, i.useRef)(null)
      s.current = t
      var r = (0, i.useRef)(null)
      ;(0, i.useEffect)(function () {
        a()
      })
      var a = (0, i.useCallback)(
        function () {
          var t = r.current,
            i = s.current,
            a = t || (i ? (i instanceof Element ? i : i.current) : null)
          ;(n.current && n.current.element === a && n.current.subscriber === e) ||
            (n.current && n.current.cleanup && n.current.cleanup(),
            (n.current = {
              element: a,
              subscriber: e,
              cleanup: a ? e(a) : void 0
            }))
        },
        [e]
      )
      return (
        (0, i.useEffect)(function () {
          return function () {
            n.current && n.current.cleanup && (n.current.cleanup(), (n.current = null))
          }
        }, []),
        (0, i.useCallback)(
          function (e) {
            ;(r.current = e), a()
          },
          [a]
        )
      )
    })(
      (0, i.useCallback)(
        function (t) {
          return (
            (a.current && a.current.box === e.box && a.current.round === r) ||
              (a.current = {
                box: e.box,
                round: r,
                instance: new ResizeObserver(function (t) {
                  var i = t[0],
                    a = "border-box" === e.box ? "borderBoxSize" : "device-pixel-content-box" === e.box ? "devicePixelContentBoxSize" : "contentBoxSize",
                    o = s(i, a, "inlineSize"),
                    l = s(i, a, "blockSize"),
                    h = o ? r(o) : void 0,
                    p = l ? r(l) : void 0
                  if (u.current.width !== h || u.current.height !== p) {
                    var m = {
                      width: h,
                      height: p
                    }
                    ;(u.current.width = h), (u.current.height = p), n.current ? n.current(m) : d.current || c(m)
                  }
                })
              }),
            a.current.instance.observe(t, {
              box: e.box
            }),
            function () {
              a.current && a.current.instance.unobserve(t)
            }
          )
        },
        [e.box, r]
      ),
      e.ref
    )
  return (0, i.useMemo)(
    function () {
      return {
        ref: h,
        width: l.width,
        height: l.height
      }
    },
    [h, l.width, l.height]
  )
}
export const Z = r
