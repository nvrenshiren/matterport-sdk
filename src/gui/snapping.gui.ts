import { ChunkConfig } from "../const/51524"
import { RaycasterSymbol, SettingsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import Engine from "../core/engine"
import { BuildSnappingDoneMessage } from "../webgl/snapcaster"
import { SnapLine3, SnapVector3 } from "../webgl/snapping"
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry
} from "three"
const l = "Snapping"
export default async (e: Engine) => {
  const [t, i, h] = await Promise.all([
      e.getModuleBySymbol(SettingsSymbol),
      await e.getModuleBySymbol(RaycasterSymbol),
      e.getModuleBySymbol(WebglRendererSymbol)
    ]),
    d = i.snapping,
    u = h.getScene().scene
  t.registerMenuEntry({
    header: l,
    setting: "snappingMaxLOD",
    initialValue: () => ChunkConfig.snappingMaxLOD,
    onChange: e => {
      ChunkConfig.snappingMaxLOD = e
    },
    urlParam: !0,
    rangePrecision: 0,
    range: [0, 3]
  }),
    (function (e, t, i) {
      const s = new BufferGeometry(),
        n = new LineSegments(s, new LineBasicMaterial({ vertexColors: !0 }))
      n.frustumCulled = !1
      const r = new SphereGeometry(0.02, 5, 5)
      let c
      const h = [16711680, 65280, 255, 16777215],
        d = new Color(),
        u = new Matrix4().identity(),
        p = new Group()
      let g
      function f() {
        const e = [],
          i = [],
          l = [],
          g = []
        t.forEachSnapFeature(t => {
          var s, n, o
          if (
            (d.setHex(
              h[
                (null === (o = null === (n = null === (s = t.meta) || void 0 === s ? void 0 : s.tile) || void 0 === n ? void 0 : n.extras) || void 0 === o
                  ? void 0
                  : o.level) || 0
              ]
            ),
            t instanceof SnapLine3)
          ) {
            const { start: s, end: n } = t
            e.push(s.x, s.y, s.z, n.x, n.y, n.z), i.push(d.r, d.g, d.b, d.r, d.g, d.b)
          } else t instanceof SnapVector3 && (l.push(t.x, t.y, t.z), g.push(d.r, d.g, d.b))
        }, !0),
          s.dispose(),
          s.setAttribute("position", new Float32BufferAttribute(e, 3)),
          s.setAttribute("color", new Float32BufferAttribute(i, 3)),
          (c && 3 * c.count === l.length) || (c && (p.remove(c), null == c || c.dispose()), (c = new InstancedMesh(r, new MeshBasicMaterial(), l.length / 3)))
        for (let e = 0; e < l.length; e += 3)
          c.setMatrixAt(e / 3, u.setPosition(l[e], l[e + 1], l[e + 2])), c.setColorAt(e / 3, d.setRGB(g[e], g[e + 1], g[e + 2]))
        p.add(n, c)
      }
      e.registerMenuEntry({
        header: l,
        setting: "Show Snapping Features",
        initialValue: () => !1,
        onChange(e) {
          e ? (i.add(p), (g = setInterval(f, 300))) : (null == c || c.dispose(), r.dispose(), s.dispose(), i.remove(p), clearInterval(g))
        }
      })
    })(t, d, u),
    (function (e, t, i, s) {
      const n = []
      let a, c
      function h() {
        c || ((c = new Mesh(new BufferGeometry(), new MeshBasicMaterial({ vertexColors: !0 }))), (c.frustumCulled = !1), i.add(c))
        const e = [],
          t = []
        for (const i of n) {
          let s = 0
          for (const n of i.surfaces) {
            const i = n.area > 0.1,
              o = Math.sin(s++) / 2 + 0.5,
              a = i ? 0 : 0.2 + 0.8 * o,
              r = i ? 0.2 + 0.8 * o : 0,
              c = 0
            for (const i of n.faces) {
              const s = i.va.vector,
                n = i.vb.vector,
                o = i.vc.vector
              e.push(s.x, s.y, s.z), e.push(n.x, n.y, n.z), e.push(o.x, o.y, o.z), t.push(a, r, c, a, r, c, a, r, c)
            }
          }
        }
        c.geometry.dispose(),
          c.geometry.setAttribute("position", new Float32BufferAttribute(e, 3)),
          c.geometry.setAttribute("color", new Float32BufferAttribute(t, 3))
      }
      function d(e) {
        n.push(e.edgeFinder)
      }
      ;[
        {
          header: l,
          setting: "Collect Snapping Surfaces",
          initialValue: () => !1,
          onChange(e) {
            e ? s.subscribe(BuildSnappingDoneMessage, d) : (s.unsubscribe(BuildSnappingDoneMessage, d), (n.length = 0))
          }
        },
        {
          header: "Snapping",
          setting: "Show Snapping Surfaces",
          initialValue: () => !1,
          onChange(e) {
            clearInterval(a),
              e
                ? (a = setInterval(() => {
                    t.preloadMeshSnapping(), h()
                  }, 1e3))
                : c && (c.geometry.dispose(), i.remove(c), (c = null))
          }
        }
      ].forEach(t => e.registerMenuEntry(t))
    })(t, d, u, e)
}
