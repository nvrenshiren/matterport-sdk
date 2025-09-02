const i = "referrer"
let s = ""
function r(e) {
  let t
  try {
    t = new URL(e)
  } catch (t) {
    return e
  }
  return t.searchParams.set(i, a()), t.href
}
function a() {
  return (
    ((function () {
      if (!window.document.referrer) return !1
      let e
      try {
        e = new URL(window.document.referrer)
      } catch (e) {
        return !1
      }
      return e.origin === window.location.origin
    })()
      ? (function () {
          const e = new URL(window.location.href)
          if (!e.searchParams.has(i)) return s
          const t = e.searchParams.get(i) || ""
          try {
            new URL(t), (s = t)
          } catch (e) {}
          return e.searchParams.delete(i), window.history.replaceState(null, "", e.href), s
        })()
      : "") || window.document.referrer
  )
}
export const an = a
export const m5 = r
