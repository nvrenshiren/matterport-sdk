import { BufferGeometry, Material, Mesh } from "three"
export class PlaneMesh<TGeometry extends BufferGeometry = BufferGeometry, TMaterial extends Material | Material[] = Material | Material[]> extends Mesh<
  TGeometry,
  TMaterial
> {
  constructor(e, t) {
    super(e, t)
  }
}
