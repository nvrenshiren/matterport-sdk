export const $ = function (e, t) {
  const n = new RegExp(e + "=([^;]+)|$").exec(document.cookie)
  if (!n) return t
  const i = n[1]
  return "boolean" == typeof t ? "true" === i || "1" === i : "number" == typeof t ? parseFloat(i) : i
}
