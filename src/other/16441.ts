export const diffOBJ = (e, t) => {
  for (const n in t) if (e[n] !== t[n]) return !0
  return !1
}
