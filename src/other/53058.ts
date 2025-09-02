import { Vector3 } from "three"
var n
;(function (e) {
  let t
  !(function (e) {
    const t = e => {
        for (const t of e) if (t.face) return { point: t.point, object: t.object, distance: t.distance, face: t.face }
        return null
      },
      i = (e, t) => e.distance - t.distance
    ;(e.CENTER_FIRST = (e, i) => (i && i.face ? { point: i.point, normal: i.face.normal, object: i.object, distance: i.distance, face: i.face } : t(e))),
      (e.CLOSEST = e => t(e.sort(i))),
      (e.AVERAGE = e => {
        if (0 === e.length) return null
        const t = { point: new Vector3(), face: { a: 0, b: 1, c: 2, normal: new Vector3(), materialIndex: 0 }, distance: 0, object: e[0].object }
        for (const i of e) t.face && i.face && (t.point.add(i.point), t.face.normal.add(i.face.normal))
        return t.point.divideScalar(e.length), t.face && t.face.normal.divideScalar(e.length).normalize(), t
      })
    e.CENTER_GROUP = t => (i, s, a) => {
      if (s) {
        const n = [s]
        for (let e = 1; e < i.length && e < 3; ++e) {
          const o = i[e]
          if (o.face) {
            const i = Math.abs(a[e].direction.dot(o.face.normal))
            s.point.distanceTo(o.point) * i <= t && n.push(o)
          }
        }
        if (n.length >= 3) {
          const t = e.AVERAGE(n, null, a)
          if (t && t.face && s.face) return (t.face.normal = s.face.normal), t
        }
      }
      const o = n(i, a, t)
      return o ? e.AVERAGE(o, null, a) : e.CENTER_FIRST(i, s, a)
    }
    const n = (e, t, n) => {
      const s = e.slice().sort(i),
        a = [s[0]]
      let o
      for (o = 1; o < s.length && a.length < 3; ++o) {
        const e = s[o]
        if (e.face) {
          const i = Math.abs(t[o].direction.dot(e.face.normal))
          a[0].point.distanceTo(e.point) * i > n && (a.length = 0), a.push(e)
        }
      }
      return a.length < 3 ? null : a
    }
  })((t = e.Filter || (e.Filter = {})))
})(n || (n = {}))
export const a = n
