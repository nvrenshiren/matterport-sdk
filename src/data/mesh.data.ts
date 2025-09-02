import { Box3, Vector3 } from "three"
import { Data } from "../core/data"
const r = [-5, -5, -5, 5, 5, 5]
export class MeshData extends Data {
  meshCenter: Vector3
  name: string
  extendedBounds: Box3
  extendedSize: Vector3
  meshBounds: Box3
  centerOfMass: Vector3
  meshSize: Vector3
  meshRadius: number
  maxPlacementRadius: number
  _meshGroups: {
    floors: Map<number, { boundingBox: Box3; centerOfMass: Vector3; meshGroup: number; parentMeshGroup: number | null }>
    rooms: Map<number, { boundingBox: Box3; centerOfMass: Vector3; meshGroup: number; parentMeshGroup: number }>
    roomsByFloor: Map<number, number[]>
  }
  meshSubGroupsFromPoint: (e: any) => number[]
  constructor(e = r, t = r, n = new Vector3()) {
    super()
    this.name = "mesh-data"
    this.extendedBounds = new Box3()
    this.extendedSize = new Vector3()
    this.meshBounds = new Box3()
    this.meshCenter = new Vector3()
    this.centerOfMass = new Vector3()
    this.meshSize = new Vector3()
    this.meshRadius = 0
    this.maxPlacementRadius = 0
    this._meshGroups = {
      floors: new Map(),
      rooms: new Map(),
      roomsByFloor: new Map()
    }
    this.meshSubGroupsFromPoint = e => {
      const t: number[] = []
      for (const [n, i] of this.meshGroups.rooms) i.boundingBox.containsPoint(e) && t.push(n)
      return t
    }
    this.meshBounds.setFromArray(e)
    this.meshBounds.getCenter(this.meshCenter)
    this.meshBounds.getSize(this.meshSize)
    this.meshRadius = this.meshSize.clone().multiplyScalar(0.5).length()
    this.maxPlacementRadius = 3 * this.meshRadius
    this.extendedBounds.setFromArray(t)
    this.extendedBounds.getSize(this.extendedSize)
    this.centerOfMass.copy(n)
  }
  get meshGroups() {
    return this._meshGroups
  }
}
