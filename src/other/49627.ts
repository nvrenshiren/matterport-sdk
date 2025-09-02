import * as i from "react"
const s = "undefined" != typeof window ? i.useLayoutEffect : i.useEffect
const r = function (e, t, n) {
  const r = (0, i.useRef)(t)
  s(() => {
    r.current = t
  }, [t]),
    (0, i.useEffect)(() => {
      const t = (null == n ? void 0 : n.current) || window
      if (!t || !t.addEventListener) return
      const i = e => r.current(e)
      return (
        t.addEventListener(e, i),
        () => {
          t.removeEventListener(e, i)
        }
      )
    }, [e, n])
}
const a = function (e, t) {
  const n = (0, i.useCallback)(() => {
      if ("undefined" == typeof window) return t
      try {
        const n = window.localStorage.getItem(e)
        return n
          ? (function (e) {
              try {
                return "undefined" === e ? void 0 : JSON.parse(null != e ? e : "")
              } catch {
                return void console.log("parsing error on", {
                  value: e
                })
              }
            })(n)
          : t
      } catch (n) {
        return console.warn("Error reading localStorage key “".concat(e, "”:"), n), t
      }
    }, [t, e]),
    [s, a] = (0, i.useState)(n),
    o = (0, i.useCallback)(
      t => {
        "undefined" == typeof window && console.warn("Tried setting localStorage key “".concat(e, "” even though environment is not a client"))
        try {
          const n = t instanceof Function ? t(s) : t
          window.localStorage.setItem(e, JSON.stringify(n)), a(n), window.dispatchEvent(new Event("local-storage"))
        } catch (t) {
          console.warn("Error setting localStorage key “".concat(e, "”:"), t)
        }
      },
      [e, s]
    )
  ;(0, i.useEffect)(() => {
    a(n())
  }, [])
  const l = (0, i.useCallback)(() => {
    a(n())
  }, [n])
  return r("storage", l), r("local-storage", l), [s, o]
}
const o = function () {
  const e = (0, i.useRef)(!0)
  return e.current ? ((e.current = !1), !0) : e.current
}
const l = function (e, t) {
  const n = o()
  ;(0, i.useEffect)(() => {
    if (!n) return e()
  }, t)
}
const c = function () {
  const [e, t] = (0, i.useState)(null),
    [n, a] = (0, i.useState)({
      width: 0,
      height: 0
    }),
    o = (0, i.useCallback)(() => {
      a({
        width: (null == e ? void 0 : e.offsetWidth) || 0,
        height: (null == e ? void 0 : e.offsetHeight) || 0
      })
    }, [null == e ? void 0 : e.offsetHeight, null == e ? void 0 : e.offsetWidth])
  return (
    r("resize", o),
    s(() => {
      o()
    }, [null == e ? void 0 : e.offsetHeight, null == e ? void 0 : e.offsetWidth]),
    [t, n]
  )
}
const d = function (e) {
  const t = (0, i.useCallback)(() => {
      if ("undefined" == typeof window) return null
      try {
        const t = window.localStorage.getItem(e)
        return t ? JSON.parse(t) : null
      } catch (t) {
        return console.warn("Error reading localStorage key “".concat(e, "”:"), t), null
      }
    }, [e]),
    [n, s] = (0, i.useState)(t)
  ;(0, i.useEffect)(() => {
    s(t())
  }, [])
  const a = (0, i.useCallback)(() => {
    s(t())
  }, [t])
  return r("storage", a), r("local-storage", a), n
}
const u = function () {
  const [e, t] = (0, i.useState)({
      width: 0,
      height: 0
    }),
    n = () => {
      t({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  return (
    r("resize", n),
    s(() => {
      n()
    }, []),
    e
  )
}
export const h4 = c
export const OR = r
export const _ = a
export const Fx = d
export const rf = l
export const iP = u
