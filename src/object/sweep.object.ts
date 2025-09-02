import { Quaternion, Vector3 } from "three"
import { PanoSizeKey } from "../const/76609"
import { ObservableObject } from "../observable/observable.object"

const l = {
  [PanoSizeKey.BASE]: "512",
  [PanoSizeKey.STANDARD]: "1k",
  [PanoSizeKey.HIGH]: "2k",
  [PanoSizeKey.ULTRAHIGH]: "4k"
}
const c = {
  [PanoSizeKey.BASE]: "low",
  [PanoSizeKey.STANDARD]: "high",
  [PanoSizeKey.HIGH]: "2k",
  [PanoSizeKey.ULTRAHIGH]: "4k"
}
export class SweepObject extends ObservableObject {
  skyboxes: {}
  id: string
  index: number
  name: string
  position: Vector3
  floorPosition: Vector3
  floorId: string | null
  roomId: string | null
  rotation: Quaternion
  enabled: boolean
  vrenabled: boolean
  neighbours: string[]
  alignmentType: AlignmentType
  placementType: PlacementType
  uuid: string
  resolutions: PanoSizeKey[]
  constructor(e?: SweepObject) {
    super()
    this.skyboxes = {}
    if (e) {
      e.id && (this.id = e.id)
      void 0 !== e.index && (this.index = e.index)
      this.name = e.name || ""
      this.position = e.position || new Vector3()
      this.floorPosition = e.floorPosition || new Vector3()
      void 0 !== e.floorId && (this.floorId = e.floorId)
      this.roomId = e.roomId || null
      this.rotation = e.rotation || new Quaternion()
      this.enabled = e.enabled || !1
      this.vrenabled = e.vrenabled || !1
      this.neighbours = e.neighbours || []
      this.alignmentType = e.alignmentType || AlignmentType.ALIGNED
      this.placementType = e.placementType || PlacementType.UNPLACED
      void 0 !== e.uuid && (this.uuid = e.uuid)
      e.resolutions && (this.resolutions = e.resolutions.slice())
      e.skyboxes && (this.skyboxes = Object.assign({}, e.skyboxes))
    }
  }
  isAligned() {
    return this.alignmentType === AlignmentType.ALIGNED
  }
  isUnplaced() {
    return this.placementType === PlacementType.UNPLACED
  }
  get sid() {
    return this.id
  }
  deepEquals(e: SweepObject) {
    if (!this.equals(e)) return !1
    for (const t in this.skyboxes)
      for (const n in e.skyboxes) {
        const i = this.skyboxes[t],
          s = e.skyboxes[n]
        if (i && s && i.getCurrentValue() !== s.getCurrentValue()) return !1
      }
    return !0
  }
  equals(e: SweepObject) {
    return (
      this.id === e.id &&
      this.index === e.index &&
      this.name === e.name &&
      this.position.equals(e.position) &&
      this.floorId === e.floorId &&
      this.roomId === e.roomId &&
      this.rotation.equals(e.rotation) &&
      this.enabled === e.enabled &&
      this.vrenabled === e.vrenabled &&
      this.alignmentType === e.alignmentType &&
      this.placementType === e.placementType
    )
  }
  copy(e: SweepObject) {
    this.id = e.id
    this.index = e.index
    this.name = e.name
    this.position = new Vector3().copy(e.position)
    this.floorPosition = new Vector3().copy(e.floorPosition)
    this.floorId = e.floorId
    this.roomId = e.roomId
    this.rotation = new Quaternion().copy(e.rotation)
    this.enabled = e.enabled
    this.vrenabled = e.vrenabled
    this.neighbours = e.neighbours.slice()
    this.alignmentType = e.alignmentType
    this.placementType = e.placementType
    this.resolutions = e.resolutions
    this.skyboxes = Object.assign({}, e.skyboxes)
    return this
  }
  availableResolution(e: PanoSizeKey | null): PanoSizeKey {
    if (!e || !this.resolutions) throw new Error("No available resolution found for sweep")
    return this.resolutions.includes(e) ? e : this.availableResolution(this.getLowerResolution(e))
  }
  getLowerResolution(e: PanoSizeKey) {
    switch (e) {
      case PanoSizeKey.ULTRAHIGH:
        return PanoSizeKey.HIGH
      case PanoSizeKey.HIGH:
        return PanoSizeKey.STANDARD
      case PanoSizeKey.STANDARD:
        return PanoSizeKey.BASE
    }
    return null
  }
  refresh(e: SweepObject) {
    const n = this.equals(e)
    this.alignmentType = e.alignmentType
    this.enabled = e.enabled
    this.name = e.name
    this.neighbours = e.neighbours.slice()
    this.placementType = e.placementType
    this.resolutions = e.resolutions
    this.vrenabled = e.vrenabled
    for (const n in this.skyboxes) {
      const i = n
      const s = e.skyboxes[i]
      s && this.skyboxes[i]?.refreshFrom(s)
    }
    n || this.commit()
  }
  async getTileUrl(e: PanoSizeKey, t: number, n: number, i: number) {
    const r = await this.getSkybox(e)
    return (r?.tileUrlTemplate || `tiles/${this.id}/${l[e]}_face<face>_<x>_<y>.jpg`)
      .replace("<face>", `${t}`)
      .replace("<x>", `${n}`)
      .replace("<y>", `${i}`) as string
  }
  async getFaceUrl(e, t) {
    const i = await this.getSkybox(e)

    return (i?.urlTemplate || `pan/${c[e]}/${this.id}_skybox<face>.jpg`).replace("<face>", `${t}`)
  }
  async getSkybox(e) {
    const t = this.skyboxes[e]
    return t ? t.get() : t
  }
}

export enum AlignmentType {
  ALIGNED = "aligned",
  UNALIGNED = "unaligned"
}
export enum PlacementType {
  AUTO = "auto",
  MANUAL = "manual",
  UNPLACED = "unplaced"
}
