import { Data } from "../core/data"
import { BuildOnStale } from "../utils/expiringResource"
import { TagObject } from "../object/tag.object"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class TagData extends Data {
  mattertags: ObservableMap<TagObject>
  hydrate: () => Promise<any>
  constructor(...e: TagObject[]) {
    super()
    this.name = "tag"
    this.mattertags = createObservableMap()
    if (e) for (const t of e) this.mattertags.set(t.sid, t)
    this.commit()
  }
  clear() {
    for (const e of this.mattertags.keys) this.removeTag(e)
  }
  clone() {
    return new TagData().copy(this)
  }
  copy(e: TagData) {
    return TagData.copyTagCollection(this, e), this
  }
  static copyTagCollection(e: TagData, t: TagData) {
    const n = e.mattertags
    const i = t.mattertags
    for (const t of n.keys) i.has(t) || e.removeTag(t)
    for (const t of i) e.addTag(t)
  }
  get collection() {
    return this.mattertags
  }
  addTag(e: TagObject) {
    this.mattertags.has(e.sid) ? this.mattertags.get(e.sid).copy(e) : this.mattertags.set(e.sid, e.clone())
  }
  removeTag(e: string) {
    return this.mattertags.delete(e)
  }
  getTag(e: string) {
    return this.mattertags.get(e)
  }
  getTagList() {
    return this.mattertags.keys
  }
  getTagCount() {
    return this.mattertags.length
  }
  getTagKeywords() {
    let e: string[] = []
    this.iterate(t => {
      t.enabled && t.keywords.length && (e = e.concat(t.keywords))
    })
    return e
  }
  iterate(e: (e: TagObject) => void) {
    for (const t of this.mattertags) e(t)
  }
  *[Symbol.iterator]() {
    for (const e of this.mattertags) yield e
  }
  set onStale(e: () => Promise<any>) {
    this.hydrate = e
  }
  updateOnStaleCallbacks(e: string) {
    if (!this.hydrate) return
    const t = e ? this.getTag(e) : this.mattertags
    BuildOnStale(t, async () => {
      const e = await this.hydrate()
      this.iterate(t => {
        t.refresh(e)
      })
    })
  }
}
