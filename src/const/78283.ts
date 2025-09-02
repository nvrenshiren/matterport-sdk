const i = 0.3048,
  s = 0.0929,
  r = 1e3,
  a = e => e * r,
  o = e => e / r,
  l = e => e / i
export const setStemHeight = e => e * i,
  d = e => setStemHeight(e) / 12,
  u = e => e / s,
  h = e => e * s,
  p = e => {
    const t = e / i
    let n = Math.floor(t),
      s = (12 * t) % 12
    return (
      12 === Math.round(s) ? ((n += 1), (s = 0)) : (s = Math.round(s)),
      {
        feet: n,
        inches: s
      }
    )
  },
  m = e => {
    const t = 12 * l(e)
    const n = Math.floor(t),
      i = t - n > 0.5 ? n + 0.5 : n
    return t - i > 0.25 ? i + 0.5 : i
  }
export const Cb = d
export const Hr = a
export const KL = o
export const Nv = u
export const W3 = h
export const XJ = p
export const _F = setStemHeight
export const _w = m
export const zy = l
