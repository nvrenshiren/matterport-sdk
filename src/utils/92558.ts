export function cryptoString(e = 11, t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  let n = ""
  const i = window.crypto || window["msCrypto"]
  let s
  s = i ? i.getRandomValues(new Uint8Array(e)) : new Uint8Array(e).map(() => 255 * Math.random())
  for (let i = 0; i < e; i++) n += t.charAt(s[i] % t.length)
  return n
}
export function randomString11() {
  return cryptoString(11, "0123456789abcdefghijklmnopqrstuvwxyz")
}
function r(e, t) {
  return (function (e, t) {
    return ((e % t) + t) % t
  })(a(e), t)
}
function a(e) {
  let t,
    n = 0
  for (let i = 0; i < e.length; i++) (t = e.charCodeAt(i)), (n = (n << 5) - n + t), (n |= 0)
  return n
}
export const Wm = r

export const un = a
