import { BufferGeometry, Camera, Group, Material, RawShaderMaterial, Scene, Vector3, WebGLRenderer, MeshBasicMaterial } from "three"
import { PickingPriorityType } from "../const/12529"
import * as l from "../const/53203"
import { getBoundingBox, mergeGeometries } from "./56512"
import { RenderLayers } from "../core/layers"
import { MeshChunk, StandardMaterial } from "../modules/modelMesh.module"
import { ShowcaseMesh } from "./showcaseMesh"
export class RoomMesh extends ShowcaseMesh<BufferGeometry, (StandardMaterial | RawShaderMaterial | MeshBasicMaterial)[]> {
  _opacity: number
  _chunks: MeshChunk[]
  size: Vector3
  center: Vector3
  built: boolean
  meshGroup: number
  meshSubgroup: number
  onBuild?: Function
  onOpacityUpdate?: Function
  onMaterialUpdate?: Function
  constructor(meshGroup: number, meshSubgroup: number, renderLayer = RenderLayers.ALL) {
    super()
    this._opacity = 1
    this._chunks = []
    this.size = new Vector3()
    this.center = new Vector3()
    this.built = !1
    this.layers.mask = renderLayer.mask
    this.name = `RoomMesh:${meshGroup}-${meshSubgroup}`
    this.meshGroup = meshGroup
    this.meshSubgroup = meshSubgroup
    this.renderOrder = PickingPriorityType.default
    this.onBeforeRender = (renderer: WebGLRenderer, scene: Scene, camera: Camera, geometry: BufferGeometry, material: Material, group: Group) => {
      this.updateUniforms(material, group)
    }
  }
  dispose() {
    this.reset()
  }
  reset() {
    this._chunks.length = 0
    this.geometry.dispose()
    delete this.onBuild
    delete this.onOpacityUpdate
    this.built = !1
  }
  addChunk(chunk: MeshChunk) {
    if (-1 === this._chunks.indexOf(chunk)) this._chunks.push(chunk)
  }
  getChunk(index: number) {
    return this._chunks[index]
  }
  build() {
    if (this.built) throw new Error("build() should only be called once")
    if (!this._chunks.length) return
    const geometry = mergeGeometries(this._chunks.map(item => item.geometry))
    geometry.clearGroups()
    let start = 0
    this.material = []
    this._chunks.forEach((item, index) => {
      if (item.geometry && item.geometry.index) {
        geometry.addGroup(start, item.geometry.index.count, index)
        start += item.geometry.index.count
        item.geometry.dispose()
        item.geometry = geometry
        item.notifyOnMaterialUpdated((material: StandardMaterial | RawShaderMaterial | MeshBasicMaterial) => {
          Array.isArray(this.material) && (this.material[index] = material)
          this.onMaterialUpdate && this.onMaterialUpdate()
        })
        item.onOpacityUpdate = (value: number) => {
          this.opacity = value
        }
      }
    })
    this.geometry = geometry
    this.geometry.computeBoundingBox()
    this.geometry.computeBoundingSphere()
    this.material = this._chunks.map(item => item.material)
    this.size = this.boundingBox.getSize(this.size)
    this.center = this.boundingBox.getCenter(this.center)
    this.built = !0
    this.onBuild && this.onBuild()
  }
  buildWithSingleChunk(chunk: MeshChunk) {
    if (this.built) return
    const { meshGroup, meshSubgroup, lod } = chunk
    this.name = `RoomMesh:${lod}-${meshGroup}-${meshSubgroup}-${chunk.chunkIndex}`
    this.meshGroup = meshGroup
    this.meshSubgroup = meshSubgroup
    this._chunks.push(chunk)
    chunk.notifyOnMaterialUpdated(material => {
      this.material = material
      this.onMaterialUpdate && this.onMaterialUpdate()
    })
    chunk.onOpacityUpdate = (value: number) => {
      this.opacity = value
    }
    this.size = this.boundingBox.getSize(this.size)
    this.center = this.boundingBox.getCenter(this.center)
    this.built = !0
    this.onBuild && this.onBuild()
  }
  updateUniforms(material: Material, group: Group) {
    if (material instanceof RawShaderMaterial) {
      group ? this.chunks[group["materialIndex"]].onBeforeDraw(material) : this.chunks.length && this.chunks[0].onBeforeDraw(material)
    }
  }
  get boundingBox() {
    return getBoundingBox(this.geometry)
  }
  set opacity(value) {
    if (value !== this.opacity) {
      this._opacity = value
      this.raycastEnabled = value > l.xx.FADE_CLICKABLE_THRESHOLD
      this.renderOrder = value < l.xx.FADE_OPAQUE ? PickingPriorityType.ghostFloor : PickingPriorityType.default
      this.onOpacityUpdate && this.onOpacityUpdate(value)
    }
  }
  get opacity() {
    return this._opacity
  }
  get chunks() {
    return this._chunks
  }
  getSortKey() {
    return this.chunks.length ? this._chunks[0].getSortKey() : 0
  }
}
