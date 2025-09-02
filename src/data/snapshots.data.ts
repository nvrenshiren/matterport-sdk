import * as a from "../other/92306"
import { Data } from "../core/data"
import { BuildOnStale } from "../utils/expiringResource"
import { SnapshotObject } from "../object/snapshot.object"
import { randomString } from "../utils/func.utils"

export class SnapshotsData extends Data {
  snapshots: Record<string, SnapshotObject>
  selectedPhotoId: string
  hydrate: () => Promise<Record<string, SnapshotObject>>

  constructor(e: Record<string, SnapshotObject>) {
    super()
    this.name = "snapshots"
    this.snapshots = {}
    for (const t in e) this.snapshots[t] = e[t].clone()
  }

  get(e: string) {
    return this.snapshots[e]
  }

  async getImageUrl(e: string) {
    const t = this.get(e),
      n = new URL(await t.imageUrl.get())
    return "panorama" === t.category && (n.searchParams.delete("height"), n.searchParams.delete("fit")), n.toString()
  }

  get collection() {
    return this.snapshots
  }

  get snapshotsCount() {
    return this.snapshots ? Object.keys(this.snapshots).length : 0
  }

  getSortedCollection(e) {
    if (!this.snapshotsCount) return []
    let t = Object.values(this.snapshots)
    return (null == e ? void 0 : e.filterFn) && (t = t.filter(e.filterFn)), t.sort((null == e ? void 0 : e.compareFn) || a.IA)
  }

  setSelectedPhoto(e: string) {
    this.selectedPhotoId = e
    this.commit()
  }

  add(e: SnapshotObject) {
    e.sid = this.validateSid(e.sid)
    this.snapshots[e.sid] = e
    this.updateOnStaleCallbacks()
    this.commit()
  }

  remove(e) {
    delete this.snapshots[e]
  }

  validateSid(e: string) {
    for (; !e || this.snapshots[e]; ) e = randomString(11)
    return e
  }

  set onStale(e: () => Promise<any>) {
    this.hydrate = e
    this.updateOnStaleCallbacks()
  }

  updateOnStaleCallbacks() {
    this.hydrate &&
      BuildOnStale(this.snapshots, async () => {
        const e = await this.hydrate()
        for (const t in this.snapshots) e && e[t] && this.snapshots[t].refresh(e[t])
      })
  }
}
