export function getURLParams() {
  const e = new URLSearchParams(window.location.search)
  const t: Record<string, string> = {}
  e.forEach((e, n) => {
    t[n] = e
  })
  return t
}
export function copyURLSearchParams() {
  const e = new URLSearchParams(window.location.search)
  return new URLSearchParams(e.toString())
}
export function getValFromURL(e, t: any = null, n = typeof t) {
  return toJSONParams(new URLSearchParams(window.location.search).get(e), t, n)
}
export function toJSONParams(e, t: any = null, n = typeof t) {
  return null === e ? t : "boolean" === n ? "true" === e || "1" === e : "number" === n ? +e : e
}
