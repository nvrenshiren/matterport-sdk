export class RoomObject {
  tags: string[]
  areaFloor: number
  depth?: number
  floorId: string
  height: number
  id: string
  meshSubgroup: number
  width: number
  constructor(t) {
    this.tags = []
    t && Object.assign(this, t)
  }
}
