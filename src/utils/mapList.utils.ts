const i: (e: any) => any = e => "" + e
export class MapListHelper<T = any> {
  mappingFunction: (e: T) => any
  list: T[]
  map: Record<string, T>
  constructor(e: MapListHelper["mappingFunction"] = i) {
    this.mappingFunction = e
    this.list = []
    this.map = {}
  }
  add(e: T) {
    const t = this.mappingFunction(e)

    return !this.map[t] && (this.list.push(e), (this.map[t] = e), !0)
  }
  set(e: T) {
    const t = this.mappingFunction(e)

    return this.map[t] ? ((this.map[t] = e), !0) : (this.add(e), !0)
  }
  count() {
    return this.list.length
  }
  *[Symbol.iterator]() {
    for (const e of this.list) yield e
  }
  getByIndex(e: number) {
    return this.list[e]
  }
  get(e: string | number) {
    return this.map[e]
  }
  copyToList(e: T[]) {
    return e.push(...this.list), e
  }
  clear() {
    this.list = []
    this.map = {}
  }
  mapElements(e: Parameters<this["list"]["map"]>[0]) {
    return this.list.map(e)
  }
}
