import { SweepObject } from "../object/sweep.object"

class ComparatorPath {
  comparator: (...args: pathItem[]) => number
  nodes: pathItem[]
  constructor(e) {
    this.comparator = e
    this.nodes = []
  }
  push(e: pathItem) {
    this.nodes.push(e)
    return this.siftdown(0, this.nodes.length - 1)
  }
  pop() {
    let e: pathItem | undefined, t: pathItem
    return this.nodes.length && ((e = this.nodes.pop()), e)
      ? (this.nodes.length ? ((t = this.nodes[0]), (this.nodes[0] = e), this.siftup(0)) : (t = e), t)
      : null
  }
  peek() {
    return this.nodes[0]
  }
  contains(e: pathItem) {
    return -1 !== this.nodes.indexOf(e)
  }
  replace(e: pathItem) {
    if (this.nodes.length) {
      const t = this.nodes[0]
      return (this.nodes[0] = e), this.siftup(0), t
    }
    return null
  }
  _pushpop(e: pathItem[], t: pathItem, n) {
    let i: [pathItem, pathItem]
    const s = n || this.defaultCompare
    return e.length && s(e[0], t) < 0 && ((i = [e[0], t]), (t = i[0]), (e[0] = i[1]), this._siftup(e, 0, s)), t
  }
  pushpop(e: pathItem) {
    return this._pushpop(this.nodes, e, this.comparator)
  }
  _heapify(e: pathItem[], t) {
    let n, i, s, r, a, o
    const l = Math.floor(e.length / 2)
    const c = function () {
      for (o = [], s = 0, a = l; 0 <= a ? s < a : s > a; 0 <= a ? s++ : s--) o.push(s)
      return o
    }
      .apply(this)
      .reverse()
    const d: pathItem[] = []
    for (i = 0, r = c.length; i < r; i++) (n = c[i]), d.push(this._siftup(e, n, t))
    return d
  }
  heapify() {
    let e, t, n, i, s, r
    const a = Math.floor(this.nodes.length / 2)
    const o = function () {
      for (r = [], n = 0, s = a; 0 <= s ? n < s : n > s; 0 <= s ? n++ : n--) r.push(n)
      return r
    }
      .apply(this)
      .reverse()
    const l: pathItem[] = []
    for (t = 0, i = o.length; t < i; t++) (e = o[t]), l.push(this.siftup(e))
    return l
  }
  updateItem(e) {
    const t = this.nodes.indexOf(e)
    return -1 === t ? null : (this.siftdown(0, t), this.siftup(t))
  }
  clear() {
    return (this.nodes = [])
  }
  empty() {
    return 0 === this.nodes.length
  }
  size() {
    return this.nodes.length
  }
  clone() {
    const e = new ComparatorPath(this.comparator)
    return (e.nodes = this.nodes.slice(0)), e
  }
  toArray() {
    return this.nodes.slice(0)
  }
  insert(e) {
    return this.push(e)
  }
  top() {
    return this.peek()
  }
  front() {
    return this.peek()
  }
  has(e) {
    return this.contains(e)
  }
  copy() {
    return this.clone()
  }
  nlargest(e) {
    let t, n, i
    const s = this.nodes.slice(0, e)
    if (!s.length) return s
    this._heapify(s, this.comparator)
    const r = this.nodes.slice(e)
    for (n = 0, i = r.length; n < i; n++) (t = r[n]), this._pushpop(s, t, this.comparator)
    return s.sort(this.comparator).reverse()
  }
  defaultCompare(e, t) {
    return e < t ? -1 : e > t ? 1 : 0
  }
  _siftdown(e: pathItem[], t: number, n: number, i) {
    let s: pathItem, r: number
    const a = i || this.defaultCompare
    const o = e[n]
    for (; n > t && ((r = (n - 1) >> 1), (s = e[r]), a(o, s) < 0); ) (e[n] = s), (n = r)
    return (e[n] = o)
  }
  siftdown(e: number, t: number) {
    return this._siftdown(this.nodes, e, t, this.comparator)
  }
  _siftup(e: pathItem[], t: number, n: ComparatorPath["comparator"]) {
    let i: number, s: number
    const r = n || this.defaultCompare
    const a = e.length
    const o = t
    const l = e[t]
    for (i = 2 * t + 1; i < a; ) (s = i + 1), s < a && !(r(e[i], e[s]) < 0) && (i = s), (e[t] = e[i]), (i = 2 * (t = i) + 1)
    e[t] = l
    return this._siftdown(e, o, t, r)
  }
  siftup(e: number) {
    return this._siftup(this.nodes, e, this.comparator)
  }
}
interface pathItem {
  parent?: pathItem
  data: SweepObject
  g: number
  heuristicValue: number
  f?: number
}
export enum SweepPathStatus {
  NoPath = 1,
  Success = 0,
  Timeout = 2
}
export function findShortestPath(e: {
  start: SweepObject
  isEnd: (e: SweepObject) => boolean
  neighbors: (e: SweepObject) => Generator<SweepObject>
  distance: (e: SweepObject, t: SweepObject) => number
  heuristic: (e: SweepObject, t?: SweepObject) => number
  timeout: number
}) {
  void 0 === e.timeout && (e.timeout = 1 / 0)
  const t: pathItem = {
    data: e.start,
    g: 0,
    heuristicValue: e.heuristic(e.start)
  }
  let n = t
  t.f = t.heuristicValue
  const r = new Set<SweepObject>()
  const l = new ComparatorPath(heapComparator)
  const c = new Map<SweepObject, pathItem>()
  l.push(t)
  c.set(t.data, t)
  const d = Date.now()
  for (; l.size(); ) {
    if (Date.now() - d > e.timeout) {
      return {
        status: SweepPathStatus.Timeout,
        cost: n.g,
        path: a(n)
      }
    }

    const t = l.pop()!
    c.delete(t.data)
    if (t && e.isEnd(t.data)) {
      return {
        status: SweepPathStatus.Success,
        cost: t.g,
        path: a(t)
      }
    }
    r.add(t.data)
    const i = e.neighbors(t.data)
    for (const s of i) {
      if (r.has(s)) continue
      const i = t.g + e.distance(t.data, s)
      let a = c.get(s)
      let o = !1
      if (void 0 === a) {
        a = {
          data: s,
          g: 0,
          heuristicValue: 0,
          f: 0
        }
        c.set(s, a!)
      } else {
        if (a.g < i) continue
        o = !0
      }
      a.parent = t || void 0
      a.g = i
      a.heuristicValue = e.heuristic(s)
      a.f = i + a.heuristicValue
      a.heuristicValue < n.heuristicValue && (n = a)
      o ? l.heapify() : l.push(a)
    }
  }
  return {
    status: SweepPathStatus.NoPath,
    cost: n.g,
    path: a(n)
  }
}
function a(e: pathItem): SweepObject[] {
  if (void 0 !== e.parent) {
    const t = a(e.parent)
    t.push(e.data)
    return t
  }
  return [e.data]
}
function heapComparator(e: pathItem, t: pathItem) {
  if (e.f && t.f) return e.f - t.f
  throw new Error('heapComparator() -> Property "f" is undefined.')
}
