import { Data } from "../core/data"
import { TiledMesh } from "../webgl/tiled.mesh"
import { FloorMesh, ModelMesh } from "../webgl/model.mesh"
import { RoomMesh } from "../webgl/roomMesh"

export class RoomMeshData extends Data {
  name: string
  floors: Set<FloorMesh>
  rooms: Set<RoomMesh>
  root: ModelMesh | TiledMesh
  constructor() {
    super()
    this.name = "room-mesh-data"
    this.floors = new Set()
    this.rooms = new Set()
  }
}
