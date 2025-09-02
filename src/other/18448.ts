function i(e) {
  const t = {}
  for (const n in e) t[e[n]] = n
  return t
}
function s(e, t) {
  if (null !== e && "object" == typeof e) for (const n in e) t(e[n], n, e), s(e[n], t)
}

export const S = i
export const y = s
