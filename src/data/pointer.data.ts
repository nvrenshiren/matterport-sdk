import { Event, Intersection, Object3D, Ray, Vector2, Vector3 } from "three"
import { Data } from "../core/data"
export class PointerData extends Data {
  name: string
  hit: Point | null
  hits: Intersection[]
  pointerNdcPosition: Vector2
  pointerScreenPosition: Vector2
  pointerOrigin: Vector3
  pointerDirection: Vector3
  pointerRay: Ray
  constructor() {
    super(...arguments)
    this.name = "pointer"
    this.hit = null
    this.hits = []
    this.pointerNdcPosition = new Vector2()
    this.pointerScreenPosition = new Vector2()
    this.pointerOrigin = new Vector3()
    this.pointerDirection = new Vector3()
    this.pointerRay = new Ray()
  }
}
export class Point {
  point: Vector3
  normal: Vector3
  object: Object3D
  intersection: Intersection
  face: { normal: Vector3 }
  constructor(e: Vector3, t: Vector3, n: Object3D<Event>, i: Intersection<Object3D<Event>>) {
    this.point = e
    this.normal = t
    this.object = n
    this.intersection = i
    this.face = {
      normal: t
    }
  }
}
