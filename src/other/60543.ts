const n = ["<mark>", "</mark>"]
function s(e) {
  return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}
function r(e, t) {
  const [i, r] = n,
    a = `${i}|${r}`
  let o = !1
  if ((e.match(new RegExp(a)) && ((e = e.replace(new RegExp(`(${a})`, "g"), (e, t) => t.split("").join("‌"))), (o = !0)), t)) {
    let n
    ;(n = o ? t.split("").map(s).join("[‌]?") : s(t)), (e = e.replace(new RegExp(`(${n})`, "gi"), (e, t) => `${i}${t}${r}`))
  }
  return e
}
const a = r
function o(e, t) {
  return r(
    (function (e, t) {
      var i
      const n = e.toLowerCase(),
        [r, a, o] = [n.indexOf(t), e.length, (null === (i = n.match(new RegExp(`${s(t)}`, "g"))) || void 0 === i ? void 0 : i.length) || 1]
      let c = e,
        l = r
      if (a > 20 && l > 0) {
        if (1 === o) {
          const e = Math.floor((20 - t.length) / 2)
          e > 0 && l > e && (l -= e)
        }
        ;(c = `...${c.substr(l)}`), c.length < 20 && ((l -= 20 - c.length), l > 0 && (c = `...${e.substr(l)}`))
      }
      return c
    })(e, t),
    t
  )
}

export const PP = n
export const vr = a
export const zf = o
