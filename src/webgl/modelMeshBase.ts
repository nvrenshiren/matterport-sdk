import { createSubscription } from "../core/subscription"
import { Box3, Object3D, Vector3 } from "three"
import { MeshChunk } from "../modules/modelMesh.module"
export class ModelMeshBase extends Object3D {
  boundingBox: Box3
  size: Vector3
  center: Vector3
  _detail: string
  _chunks: MeshChunk[]
  onChunksLoaded: Set<Function>
  constructor() {
    super()
    this.boundingBox = new Box3()
    this.size = new Vector3()
    this.center = new Vector3()
    this._detail = "default"
    this._chunks = []
    this.onChunksLoaded = new Set()
  }
  get detail() {
    return this._detail
  }
  get chunks() {
    return this._chunks
  }
  get visibleChunks() {
    return this._chunks
  }
  notifyOnChunksLoaded(e) {
    return createSubscription(
      () => this.onChunksLoaded.add(e),
      () => this.onChunksLoaded.delete(e),
      !0
    )
  }
  dispose() {
    for (const e of this._chunks) e.dispose()
    this._chunks.length = 0
  }
  overrideMaxDetail(e) {}
}
