import { BufferGeometry, Material, Mesh } from "three"
import { PickingPriorityType } from "../const/12529"
export class ShowcaseMesh<TGeometry extends BufferGeometry = BufferGeometry, TMaterial extends Material | Material[] = Material | Material[]> extends Mesh<
  TGeometry,
  TMaterial
> {
  meshGroup: number
  raycastEnabled: boolean
  constructor() {
    super(...arguments)
    this.raycastEnabled = !0
  }
  get2DPickingPriority() {
    return PickingPriorityType.default
  }
}
