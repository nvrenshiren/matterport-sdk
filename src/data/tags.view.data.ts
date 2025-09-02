import { Quaternion, Texture, Vector3 } from "three"
import { TextParser } from "../other/52528"
import { TagOrderBy, TagsMode } from "../const/12150"
import { Data } from "../core/data"
import { createFrustumFromMatrix } from "../math/2569"
import DeepLinkerModule from "../modules/deepLinker.module"
import { TagObject } from "../object/tag.object"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
import { ObservableOrder, ObservableOrderPriority } from "../observable/observable.order"
import { ObservableValue, createObservableValue } from "../observable/observable.value"
import { makePerspectiveFov } from "../utils/camera.utils"
import { DirectionVector } from "../webgl/vector.const"
import { CamStartData } from "./camstart.data"
import { FloorsData } from "./floors.data"
import { TagData } from "./tag.data"
function d(e, t, n, i, s) {
  if (isNaN(t) || isNaN(n) || isNaN(i)) return e
  var r,
    a,
    o,
    l,
    c,
    d,
    u,
    h,
    p,
    m,
    f,
    g,
    v = e._root,
    y = {
      data: s
    },
    b = e._x0,
    E = e._y0,
    S = e._z0,
    O = e._x1,
    T = e._y1,
    _ = e._z1
  if (!v) return (e._root = y), e
  for (; v.length; )
    if (
      ((h = t >= (a = (b + O) / 2)) ? (b = a) : (O = a),
      (p = n >= (o = (E + T) / 2)) ? (E = o) : (T = o),
      (m = i >= (l = (S + _) / 2)) ? (S = l) : (_ = l),
      (r = v),
      !(v = v[(f = (m << 2) | (p << 1) | h)]))
    )
      return (r[f] = y), e
  if (((c = +e._x.call(null, v.data)), (d = +e._y.call(null, v.data)), (u = +e._z.call(null, v.data)), t === c && n === d && i === u))
    return (y.next = v), r ? (r[f] = y) : (e._root = y), e
  do {
    ;(r = r ? (r[f] = new Array(8)) : (e._root = new Array(8))),
      (h = t >= (a = (b + O) / 2)) ? (b = a) : (O = a),
      (p = n >= (o = (E + T) / 2)) ? (E = o) : (T = o),
      (m = i >= (l = (S + _) / 2)) ? (S = l) : (_ = l)
  } while ((f = (m << 2) | (p << 1) | h) == (g = ((u >= l) << 2) | ((d >= o) << 1) | (c >= a)))
  return (r[g] = v), (r[f] = y), e
}
function u(e, t, n, i, s, r, a) {
  ;(this.node = e), (this.x0 = t), (this.y0 = n), (this.z0 = i), (this.x1 = s), (this.y1 = r), (this.z1 = a)
}
function h(e) {
  return e[0]
}
function p(e) {
  return e[1]
}
function m(e) {
  return e[2]
}
function f(e?, t = h, n = p, i = m) {
  var s = new g(t, n, i, NaN, NaN, NaN, NaN, NaN, NaN)
  return null == e ? s : s.addAll(e)
}
function g(e, t, n, i, s, r, a, o, l) {
  this._x = e
  this._y = t
  this._z = n
  this._x0 = i
  this._y0 = s
  this._z0 = r
  this._x1 = a
  this._y1 = o
  this._z1 = l
  this._root = void 0
}
function v(e) {
  for (
    var t = {
        data: e.data
      },
      n = t;
    (e = e.next);

  )
    n = n.next = {
      data: e.data
    }
  return t
}
var y = (f.prototype = g.prototype)
;(y.copy = function () {
  var e,
    t,
    n = new g(this._x, this._y, this._z, this._x0, this._y0, this._z0, this._x1, this._y1, this._z1),
    i = this._root
  if (!i) return n
  if (!i.length) return (n._root = v(i)), n
  for (
    e = [
      {
        source: i,
        target: (n._root = new Array(8))
      }
    ];
    (i = e.pop());

  )
    for (var s = 0; s < 8; ++s)
      (t = i.source[s]) &&
        (t.length
          ? e.push({
              source: t,
              target: (i.target[s] = new Array(8))
            })
          : (i.target[s] = v(t)))
  return n
}),
  (y.add = function (e) {
    var t = +this._x.call(null, e),
      n = +this._y.call(null, e),
      i = +this._z.call(null, e)
    return d(this.cover(t, n, i), t, n, i, e)
  }),
  (y.addAll = function (e) {
    var t,
      n,
      i,
      s,
      r,
      a = e.length,
      o = new Array(a),
      l = new Array(a),
      c = new Array(a),
      u = 1 / 0,
      h = 1 / 0,
      p = 1 / 0,
      m = -1 / 0,
      f = -1 / 0,
      g = -1 / 0
    for (n = 0; n < a; ++n)
      isNaN((i = +this._x.call(null, (t = e[n])))) ||
        isNaN((s = +this._y.call(null, t))) ||
        isNaN((r = +this._z.call(null, t))) ||
        ((o[n] = i), (l[n] = s), (c[n] = r), i < u && (u = i), i > m && (m = i), s < h && (h = s), s > f && (f = s), r < p && (p = r), r > g && (g = r))
    if (u > m || h > f || p > g) return this
    for (this.cover(u, h, p).cover(m, f, g), n = 0; n < a; ++n) d(this, o[n], l[n], c[n], e[n])
    return this
  }),
  (y.cover = function (e, t, n) {
    if (isNaN((e = +e)) || isNaN((t = +t)) || isNaN((n = +n))) return this
    var i = this._x0,
      s = this._y0,
      r = this._z0,
      a = this._x1,
      o = this._y1,
      l = this._z1
    if (isNaN(i)) (a = (i = Math.floor(e)) + 1), (o = (s = Math.floor(t)) + 1), (l = (r = Math.floor(n)) + 1)
    else {
      for (var c, d, u = a - i || 1, h = this._root; i > e || e >= a || s > t || t >= o || r > n || n >= l; )
        switch (((d = ((n < r) << 2) | ((t < s) << 1) | (e < i)), ((c = new Array(8))[d] = h), (h = c), (u *= 2), d)) {
          case 0:
            ;(a = i + u), (o = s + u), (l = r + u)
            break
          case 1:
            ;(i = a - u), (o = s + u), (l = r + u)
            break
          case 2:
            ;(a = i + u), (s = o - u), (l = r + u)
            break
          case 3:
            ;(i = a - u), (s = o - u), (l = r + u)
            break
          case 4:
            ;(a = i + u), (o = s + u), (r = l - u)
            break
          case 5:
            ;(i = a - u), (o = s + u), (r = l - u)
            break
          case 6:
            ;(a = i + u), (s = o - u), (r = l - u)
            break
          case 7:
            ;(i = a - u), (s = o - u), (r = l - u)
        }
      this._root && this._root.length && (this._root = h)
    }
    return (this._x0 = i), (this._y0 = s), (this._z0 = r), (this._x1 = a), (this._y1 = o), (this._z1 = l), this
  }),
  (y.data = function () {
    var e = []
    return (
      this.visit(function (t) {
        if (!t.length)
          do {
            e.push(t.data)
          } while ((t = t.next))
      }),
      e
    )
  }),
  (y.extent = function (e) {
    return arguments.length
      ? this.cover(+e[0][0], +e[0][1], +e[0][2]).cover(+e[1][0], +e[1][1], +e[1][2])
      : isNaN(this._x0)
        ? void 0
        : [
            [this._x0, this._y0, this._z0],
            [this._x1, this._y1, this._z1]
          ]
  }),
  (y.find = function (e, t, n, i) {
    var s,
      r,
      a,
      o,
      l,
      c,
      d,
      h,
      p,
      m = this._x0,
      f = this._y0,
      g = this._z0,
      v = this._x1,
      y = this._y1,
      b = this._z1,
      E = [],
      S = this._root
    for (
      S && E.push(new u(S, m, f, g, v, y, b)),
        null == i ? (i = 1 / 0) : ((m = e - i), (f = t - i), (g = n - i), (v = e + i), (y = t + i), (b = n + i), (i *= i));
      (h = E.pop());

    )
      if (!(!(S = h.node) || (r = h.x0) > v || (a = h.y0) > y || (o = h.z0) > b || (l = h.x1) < m || (c = h.y1) < f || (d = h.z1) < g))
        if (S.length) {
          var O = (r + l) / 2,
            T = (a + c) / 2,
            _ = (o + d) / 2
          E.push(
            new u(S[7], O, T, _, l, c, d),
            new u(S[6], r, T, _, O, c, d),
            new u(S[5], O, a, _, l, T, d),
            new u(S[4], r, a, _, O, T, d),
            new u(S[3], O, T, o, l, c, _),
            new u(S[2], r, T, o, O, c, _),
            new u(S[1], O, a, o, l, T, _),
            new u(S[0], r, a, o, O, T, _)
          ),
            (p = ((n >= _) << 2) | ((t >= T) << 1) | (e >= O)) && ((h = E[E.length - 1]), (E[E.length - 1] = E[E.length - 1 - p]), (E[E.length - 1 - p] = h))
        } else {
          var w = e - +this._x.call(null, S.data),
            A = t - +this._y.call(null, S.data),
            N = n - +this._z.call(null, S.data),
            I = w * w + A * A + N * N
          if (I < i) {
            var P = Math.sqrt((i = I))
            ;(m = e - P), (f = t - P), (g = n - P), (v = e + P), (y = t + P), (b = n + P), (s = S.data)
          }
        }
    return s
  }),
  (y.remove = function (e) {
    if (isNaN((r = +this._x.call(null, e))) || isNaN((a = +this._y.call(null, e))) || isNaN((o = +this._z.call(null, e)))) return this
    var t,
      n,
      i,
      s,
      r,
      a,
      o,
      l,
      c,
      d,
      u,
      h,
      p,
      m,
      f,
      g = this._root,
      v = this._x0,
      y = this._y0,
      b = this._z0,
      E = this._x1,
      S = this._y1,
      O = this._z1
    if (!g) return this
    if (g.length)
      for (;;) {
        if (
          ((u = r >= (l = (v + E) / 2)) ? (v = l) : (E = l),
          (h = a >= (c = (y + S) / 2)) ? (y = c) : (S = c),
          (p = o >= (d = (b + O) / 2)) ? (b = d) : (O = d),
          (t = g),
          !(g = g[(m = (p << 2) | (h << 1) | u)]))
        )
          return this
        if (!g.length) break
        ;(t[(m + 1) & 7] || t[(m + 2) & 7] || t[(m + 3) & 7] || t[(m + 4) & 7] || t[(m + 5) & 7] || t[(m + 6) & 7] || t[(m + 7) & 7]) && ((n = t), (f = m))
      }
    for (; g.data !== e; ) if (((i = g), !(g = g.next))) return this
    return (
      (s = g.next) && delete g.next,
      i
        ? (s ? (i.next = s) : delete i.next, this)
        : t
          ? (s ? (t[m] = s) : delete t[m],
            (g = t[0] || t[1] || t[2] || t[3] || t[4] || t[5] || t[6] || t[7]) &&
              g === (t[7] || t[6] || t[5] || t[4] || t[3] || t[2] || t[1] || t[0]) &&
              !g.length &&
              (n ? (n[f] = g) : (this._root = g)),
            this)
          : ((this._root = s), this)
    )
  }),
  (y.removeAll = function (e) {
    for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t])
    return this
  }),
  (y.root = function () {
    return this._root
  }),
  (y.size = function () {
    var e = 0
    return (
      this.visit(function (t) {
        if (!t.length)
          do {
            ++e
          } while ((t = t.next))
      }),
      e
    )
  }),
  (y.visit = function (e) {
    var t,
      n,
      i,
      s,
      r,
      a,
      o,
      l,
      c = [],
      d = this._root
    for (d && c.push(new u(d, this._x0, this._y0, this._z0, this._x1, this._y1, this._z1)); (t = c.pop()); )
      if (!e((d = t.node), (i = t.x0), (s = t.y0), (r = t.z0), (a = t.x1), (o = t.y1), (l = t.z1)) && d.length) {
        var h = (i + a) / 2,
          p = (s + o) / 2,
          m = (r + l) / 2
        ;(n = d[7]) && c.push(new u(n, h, p, m, a, o, l)),
          (n = d[6]) && c.push(new u(n, i, p, m, h, o, l)),
          (n = d[5]) && c.push(new u(n, h, s, m, a, p, l)),
          (n = d[4]) && c.push(new u(n, i, s, m, h, p, l)),
          (n = d[3]) && c.push(new u(n, h, p, r, a, o, m)),
          (n = d[2]) && c.push(new u(n, i, p, r, h, o, m)),
          (n = d[1]) && c.push(new u(n, h, s, r, a, p, m)),
          (n = d[0]) && c.push(new u(n, i, s, r, h, p, m))
      }
    return this
  }),
  (y.visitAfter = function (e) {
    var t,
      n = [],
      i = []
    for (this._root && n.push(new u(this._root, this._x0, this._y0, this._z0, this._x1, this._y1, this._z1)); (t = n.pop()); ) {
      var s = t.node
      if (s.length) {
        var r,
          a = t.x0,
          o = t.y0,
          l = t.z0,
          c = t.x1,
          d = t.y1,
          h = t.z1,
          p = (a + c) / 2,
          m = (o + d) / 2,
          f = (l + h) / 2
        ;(r = s[0]) && n.push(new u(r, a, o, l, p, m, f)),
          (r = s[1]) && n.push(new u(r, p, o, l, c, m, f)),
          (r = s[2]) && n.push(new u(r, a, m, l, p, d, f)),
          (r = s[3]) && n.push(new u(r, p, m, l, c, d, f)),
          (r = s[4]) && n.push(new u(r, a, o, f, p, m, h)),
          (r = s[5]) && n.push(new u(r, p, o, f, c, m, h)),
          (r = s[6]) && n.push(new u(r, a, m, f, p, d, h)),
          (r = s[7]) && n.push(new u(r, p, m, f, c, d, h))
      }
      i.push(t)
    }
    for (; (t = i.pop()); ) e(t.node, t.x0, t.y0, t.z0, t.x1, t.y1, t.z1)
    return this
  }),
  (y.x = function (e) {
    return arguments.length ? ((this._x = e), this) : this._x
  }),
  (y.y = function (e) {
    return arguments.length ? ((this._y = e), this) : this._y
  }),
  (y.z = function (e) {
    return arguments.length ? ((this._z = e), this) : this._z
  })
export class TagsViewData extends Data {
  data: TagData
  floorsData: FloorsData
  cameraStartData: CamStartData
  textParser: TextParser
  linkHandler: DeepLinkerModule
  tagDefaultTitle: string
  objectTagsEnabled: boolean
  name: string
  tagViewsMap: ObservableMap<ReturnType<TagsViewData["createTagView"]>>
  customSortIndexMap: Map<string, number>
  spatialSortOrderMap: Map<string, number>
  openTagViewObservable: ObservableValue<ReturnType<TagsViewData["createTagView"]> | null>
  tagsMode: TagsMode
  tagOrder: TagOrderBy
  openTagIsDirty: boolean
  creatingTag: boolean
  idVisibilityEnabled: boolean
  idVisibility: Set<string>
  capabilities: Map<string, { focus: boolean }>
  refreshTagViews: (e: any) => void
  sortByOrder: (e: any, t: any) => number
  sortByText: (e: any, t: any) => 1 | -1
  orderedTagViews: ObservableOrder<ReturnType<TagsViewData["createTagView"]>>
  alphabeticalTagViews: ObservableOrder<ReturnType<TagsViewData["createTagView"]>>
  embedErrorTagId?: string
  backgroundTexture: Texture
  constructor(e, t, n, i, s, l, d, u, h) {
    super()
    this.data = e
    this.floorsData = t
    this.cameraStartData = n
    this.textParser = s
    this.linkHandler = l
    this.tagDefaultTitle = d
    this.backgroundTexture = u
    this.objectTagsEnabled = h
    this.name = "tags-view-data"
    this.tagViewsMap = createObservableMap()
    this.customSortIndexMap = new Map()
    this.spatialSortOrderMap = new Map()
    this.openTagViewObservable = createObservableValue(null)
    this.tagsMode = TagsMode.DEFAULT
    this.tagOrder = TagOrderBy.ORDERED
    this.openTagIsDirty = !1
    this.creatingTag = !1
    this.idVisibilityEnabled = !1
    this.idVisibility = new Set()
    this.capabilities = new Map()
    this.refreshTagViews = e => {
      const t = {}
      this.data.iterate(e => {
        t[e.sid] = this.createTagView(e)
      })
      this.updateSortMaps(Object.values(t), e)
      this.tagViewsMap.atomic(() => {
        this.tagViewsMap.replace(t)
      })
    }
    this.sortByOrder = (e, t) => {
      const s = (this.customSortIndexMap.get(e.id) || Number.MAX_SAFE_INTEGER) - (this.customSortIndexMap.get(t.id) || Number.MAX_SAFE_INTEGER)
      if (s) return s
      const r = this.spatialSortOrderMap.get(e.id)
      const a = this.spatialSortOrderMap.get(t.id)
      if (void 0 === r || void 0 === a) throw new Error("All ids should exist in spatialPositions")
      return r - a
    }
    this.sortByText = (e, t) => {
      function n(e, t: string) {
        return (e.label.trim() || e.description || t).toLowerCase()
      }
      return n(e, this.tagDefaultTitle) < n(t, this.tagDefaultTitle) ? -1 : 1
    }
    this.orderedTagViews = new ObservableOrder(this.tagViewsMap)
    this.orderedTagViews.priority = ObservableOrderPriority.LOW
    this.orderedTagViews.setFilter("objectTag", e => !e.objectAnnotationId)
    this.refreshTagViews(i)
    this.orderedTagViews.sort(this.sortByOrder)
  }
  getAlphabeticTagViewMapFilter() {
    this.alphabeticalTagViews ||
      ((this.alphabeticalTagViews = new ObservableOrder(this.tagViewsMap)),
      (this.alphabeticalTagViews.priority = ObservableOrderPriority.LOW),
      this.alphabeticalTagViews.setFilter("objectTag", e => !e.objectAnnotationId),
      this.alphabeticalTagViews.sort(this.sortByText))
    return this.alphabeticalTagViews
  }
  getCollection() {
    return this.tagViewsMap
  }
  getOrderedTagViewMapFilter() {
    return this.orderedTagViews
  }
  getOrderedTags(e: boolean) {
    return this.getEnabledTagViewsList(this.orderedTagViews, e)
  }
  getTagsByText(e: boolean) {
    const t = this.getAlphabeticTagViewMapFilter()
    return this.getEnabledTagViewsList(t, e)
  }
  getEnabledTagViewsList(e: TagsViewData["orderedTagViews"], t: boolean) {
    const n = e.values
    return t ? n.filter(e => e.enabled) : n
  }
  getTextParser() {
    return this.textParser
  }
  getLinkHandler() {
    return this.linkHandler
  }
  getCapabilities(e: string) {
    const t = {
      focus: !0
    }
    this.capabilities.has(e) || this.capabilities.set(e, t)
    const n = this.capabilities.get(e) || t
    return Object.assign({}, n)
  }
  updateCapabilities(e: string, t) {
    this.capabilities.set(e, Object.assign({}, t))
  }
  setEmbedErrorTagId(e?: string) {
    this.embedErrorTagId = e
    this.commit()
  }
  setTagsMode(e: TagsMode) {
    this.tagsMode = e
    this.commit()
  }
  getTagCount(e) {
    return this.getOrderedTags(e).length
  }
  hasCustomSortOrder() {
    return this.customSortIndexMap.size > 0
  }
  getTagView(e: string) {
    return this.tagViewsMap.get(e)
  }
  createTagView(e: TagObject) {
    const t = e.getPin()
    return Object.assign(Object.assign({}, t), {
      id: e.sid,
      created: e.created,
      modified: e.modified,
      label: e.label,
      description: e.description,
      enabled: e.enabled,
      layerId: e.layerId,
      attachments: [...e.externalAttachments, ...e.fileAttachments, ...e.sandboxAttachments],
      objectAnnotationId: e.objectAnnotationId,
      keywords: e.keywords,
      icon: e.icon,
      backgroundTexture: this.backgroundTexture
    })
  }
  setOpenTagView(e) {
    this.openTagViewObservable.value = e
  }
  get openTagView() {
    return this.openTagViewObservable.value
  }
  onOpenTagViewChanged(e) {
    return this.openTagViewObservable.onChanged(e)
  }
  getAvailableKeywords() {
    return Array.from(new Set(this.data.getTagKeywords()))
  }
  updateSortMaps(e, t) {
    t && this.updateCustomSortMap(t)
    this.updateSpatialSortMap(e)
    this.orderedTagViews.setDirty(!0)
  }
  updateCustomSortMap(e) {
    this.customSortIndexMap.clear()
    e.forEach((e, t) => this.customSortIndexMap.set(e, t))
  }
  updateSpatialSortMap(e) {
    const { floorsData: t, cameraStartData: n } = this
    const s = n.pose.camera.position || DirectionVector.ZERO
    const r = n.pose.camera.rotation || new Quaternion()
    const a = t.getClosestFloorAtHeight(s.y).index
    const o = createFrustumFromMatrix(s, r, makePerspectiveFov(1))
    this.spatialSortOrderMap.clear()
    let c = 0
    for (let n = 0; n < t.getFloorCount(); n++) {
      const r = (a + n) % t.getFloorCount(),
        l = t.getFloorAtIndex(r)
      if (!l) continue
      const d = e.filter(e => e.floorId === l.id)
      if (0 === d.length) continue
      let u,
        h = 1 / 0
      const p = new Vector3()
      const m = new f()
        .x(e => e.x)
        .y(e => e.y)
        .z(e => e.z)
      m.addAll(
        d.map(e => {
          p.copy(e.stemNormal).setLength(e.stemLength).add(e.anchorPosition)
          const t = {
              id: e.id,
              x: p.x,
              y: p.y,
              z: p.z
            },
            n = p.distanceToSquared(s)
          return n < h && o.containsPoint(p) && ((h = n), (u = t)), t
        })
      )
      let g = null != u ? u : m.find(s.x, s.y, s.z)
      this.spatialSortOrderMap.set(g.id, c++), m.remove(g)
      let v = d.length - 1
      for (; v > 0; ) (g = m.find(g.x, g.y, g.z)), this.spatialSortOrderMap.set(g.id, c++), m.remove(g), v--
    }
  }
}
