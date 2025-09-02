function r(e, t = !1) {
  let n = 0
  for (let t = 0, r = e.length; t < r; t++) {
    const i = e[t],
      o = e[t === r - 1 ? 0 : t + 1]
    ;(n += i[0] * o[1]), (n -= o[0] * i[1])
  }
  return t ? n / 2 : Math.abs(n / 2)
}
export const m = r
