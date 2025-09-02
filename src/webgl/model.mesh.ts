import { Box3, BufferAttribute, BufferGeometry, Matrix4, Mesh, Object3D, PlaneGeometry, Texture, Vector3 } from "three"
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { MeshChunkLOD } from "../const/21270"
import { MeshTextureQuality } from "../const/99935"
import { Apiv2Symbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { RenderLayer, RenderLayers } from "../core/layers"
import { RoomMeshData } from "../data/room.mesh.data"
import { BaseExceptionError } from "../error/baseException.error"
import * as chunkDecoder from "../lib/open-vector-tile/chunk.decoder"
import { Pbf } from "../lib/open-vector-tile/pbf"
import { MeshProgressBindingMessage } from "../message/mesh.message"
import InputIniModule from "../modules/inputIni.module"
import { CreateModelMeshParams, MeshChunk, MeshTextureLoader } from "../modules/modelMesh.module"
import { UserApiClient } from "../modules/userInfo.module"
import { isGooglebot } from "../utils/browser.utils"
import { ExpiringResource } from "../utils/expiringResource"
import { MapListHelper } from "../utils/mapList.utils"
import { parseGeometryAttributes } from "./75730"
import { DepthPassRoomMesh } from "./depthPassRoomMesh"
import { ModelMeshBase } from "./modelMeshBase"
import { RoomMesh } from "./roomMesh"
import { functionCommon } from "@ruler3d/common"
class MeshCreationExceptionError extends BaseExceptionError {
  constructor(e: Error | string) {
    super(e)
    this.name = "MeshCreationException"
  }
}
export class FloorMesh extends Object3D {
  renderLayer: RenderLayer
  roomMeshes: MapListHelper<RoomMesh>
  boundingBox: Box3
  size: Vector3
  center: Vector3
  _chunks: MeshChunk[]
  built: boolean
  meshGroup: number
  constructor(meshGroup: number, renderLayer = RenderLayers.ALL) {
    super()
    this.renderLayer = renderLayer
    this.roomMeshes = new MapListHelper(e => e.meshSubgroup)
    this.boundingBox = new Box3()
    this.size = new Vector3()
    this.center = new Vector3()
    this._chunks = []
    this.built = !1
    this.name = `FloorMesh:${meshGroup}`
    this.meshGroup = meshGroup
  }
  dispose() {
    this.reset()
    this.roomMeshes.clear()
  }
  reset() {
    for (const e of this.roomMeshes) e.dispose(), this.remove(e)
    this._chunks.length = 0
    this.built = !1
  }
  addChunk(chunk: MeshChunk) {
    const t = this.getOrCreateRoomMesh(chunk.meshSubgroup)
    this._chunks.push(chunk)
    t.addChunk(chunk)
  }
  build() {
    if (this.built) throw new Error("build() should only be called once")
    this.boundingBox.makeEmpty()
    for (const e of this.roomMeshes) this.add(e), this.boundingBox.union(e.boundingBox)
    this.center = this.boundingBox.getCenter(this.center)
    this.size = this.boundingBox.getSize(this.size)
    this.built = !0
  }
  get chunks() {
    return this._chunks
  }
  getOrCreateRoomMesh(subGroup: number) {
    let roomMesh = this.roomMeshes.get(subGroup)
    if (!roomMesh) {
      roomMesh = new RoomMesh(this.meshGroup, subGroup, this.renderLayer)
      const dpMesh = new DepthPassRoomMesh(roomMesh)
      this.roomMeshes.add(roomMesh), this.add(roomMesh), this.add(dpMesh)
    }
    return roomMesh
  }
}
const LoaderDebugger = new DebugInfo("dam-loader")
//zx
const use_glTF = true
const use_glTF_Texture = true
//zx
class ChunkLoader {
  chunkFactory: CreateModelMeshParams["chunkFactory"]
  decoder: typeof chunkDecoder
  constructor(chunkFactory: CreateModelMeshParams["chunkFactory"]) {
    this.chunkFactory = chunkFactory
    this.decoder = chunkDecoder
  }
  async load(url: string, api: UserApiClient, onProgress: Function) {
    LoaderDebugger.time("download")
    const s = await api.get(url, { responseType: "arraybuffer", onProgress })
    LoaderDebugger.timeEnd("download")
    return this.parse(s)
  }
  parse(dam_buffer: ArrayBufferLike) {
    LoaderDebugger.time("parse proto")
    const dam_data = this.decoder.binary_mesh.read(new Pbf(dam_buffer))

    LoaderDebugger.timeEnd("parse proto"), LoaderDebugger.time("convert to webgl")
    const chunks = this.convertProtobufToSceneObject(dam_data)
    LoaderDebugger.timeEnd("convert to webgl")
    return chunks
  }
  convertProtobufToSceneObject(dam_data: { chunk: any[] }) {
    if (0 === dam_data.chunk.length) {
      LoaderDebugger.warn("No chunks in damfile...")
      return []
    }

    //flip Y-Z
    const matrix = new Matrix4()
    matrix.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)
    return dam_data.chunk.map(chunk => {
      const geometry = new BufferGeometry()
      geometry.setAttribute("position", new BufferAttribute(new Float32Array(chunk.vertices.xyz, 0, 3), 3))
      chunk.vertices.uv.length > 0 && geometry.setAttribute("uv", new BufferAttribute(new Float32Array(chunk.vertices.uv, 0, 2), 2))
      geometry.setIndex(new BufferAttribute(new Uint32Array(chunk.faces.faces, 0, 1), 1))
      geometry.applyMatrix4(matrix)
      geometry.computeBoundingBox()
      const { group, subgroup } = parseGeometryAttributes(chunk.chunk_name)
      return this.chunkFactory(group, subgroup, geometry, chunk.material_name)
    })
  }
}
const MeshDebugger = new DebugInfo("mesh")
export class ModelMesh extends ModelMeshBase {
  api: UserApiClient
  renderLayer: RenderLayer
  damMeshUrls: Array<{ s3LocationKey: string; url: ExpiringResource; uuid: string }>
  floorMeshes: MapListHelper<FloorMesh>
  built: boolean
  constructor(uuid: string, api: UserApiClient, layer = RenderLayers.ALL, damMeshUrls: any[]) {
    super()
    this.uuid = uuid
    this.api = api
    this.renderLayer = layer
    this.damMeshUrls = damMeshUrls
    this.floorMeshes = new MapListHelper<FloorMesh>(e => e.meshGroup)
    this.built = !1
    this.name = `ModelMesh:${uuid}`
    this.layers.mask = layer.mask
  }
  dispose() {
    super.dispose()
    this.floorMeshes.mapElements(item => {
      item.dispose()
      this.remove(item)
    })
    this.floorMeshes.clear()
    this.built = !1
  }
  reset() {
    this.floorMeshes.mapElements(item => {
      item.reset()
      this.remove(item)
    })
    this._chunks.length = 0
    this.built = !1
  }
  async load(parameter: {
    roomMeshData: CreateModelMeshParams["roomMeshData"]
    chunkFactory: CreateModelMeshParams["chunkFactory"]
    onProgress: Function
    chunks?: MeshChunk[]
  }) {
    const { roomMeshData } = parameter
    isGooglebot() && (parameter.chunks = [])
    let chunks = parameter.chunks
      ? parameter.chunks
      : await class {
          static async load(
            api: UserApiClient,
            chunkFactory: CreateModelMeshParams["chunkFactory"],
            damMeshUrls: ModelMesh["damMeshUrls"],
            onProgress: Function,
            index = 0
          ): Promise<MeshChunk[]> {
            const loader = new ChunkLoader(chunkFactory)
            const damUrl = damMeshUrls[index]
            if (!damUrl) return Promise.reject("No suitable model file found...")
            const url = await damUrl.url.get()
            return loader.load(url, api, onProgress).catch(() => this.load(api, chunkFactory, damMeshUrls, onProgress, ++index))
          }
        }
          .load(this.api, parameter.chunkFactory, this.damMeshUrls, parameter.onProgress)
          .catch(e => {
            MeshDebugger.error(e)
            const message = e instanceof Error ? e.message : "Failed to load model mesh"
            throw new MeshCreationExceptionError(message)
          })
    if (0 === chunks.length) {
      MeshDebugger.warn("No geometry found for model, loading faux geometry, disabling outside view-mode")
      const geometry = new PlaneGeometry(5, 5, 1, 1)
      geometry.rotateX(-Math.PI / 2)
      geometry.computeBoundingBox()
      const chunk = parameter.chunkFactory(0, 0, geometry)
      chunk.sharedState.forEachChunkMaterial(e => (e.visible = !1))
      chunks = [chunk]
    }

    // exportToObj(i, "final_chunk.obj")
    chunks.forEach(item => {
      this.addChunk(item)
    })
    this.build(roomMeshData)
  }
  addChunk(chunk: MeshChunk) {
    const floorMesh = this.getOrCreateFloorMesh(chunk.meshGroup)
    this._chunks.push(chunk)
    floorMesh.addChunk(chunk)
  }
  build(roomMeshData: RoomMeshData) {
    if (this.built) throw new Error("build() should only be called once")
    let roomMeshesCount = 0
    let floorMeshesCount = 0
    for (const floorMesh of this.floorMeshes) {
      this.add(floorMesh)
      for (const roomMesh of floorMesh.roomMeshes) {
        roomMesh.build()
        roomMesh.geometry["boundsTree"] || roomMesh.geometry?.["computeBoundsTree"]?.call(roomMesh.geometry)
        roomMeshesCount++
      }
      floorMesh.build()
      floorMeshesCount++
    }
    MeshDebugger.debug(`FloorMeshes: ${floorMeshesCount} RoomMeshes: ${roomMeshesCount} Chunks: ${this._chunks.length}`)
    this.boundingBox.makeEmpty()
    for (const mesh of this.floorMeshes) this.boundingBox.union(mesh.boundingBox)
    this.size = this.boundingBox.getSize(this.size)
    this.center = this.boundingBox.getCenter(this.center)
    roomMeshData.root = this
    roomMeshData.floors = new Set(this.floorMeshes)
    roomMeshData.rooms = this.roomMeshes
    roomMeshData.commit()
    this.built = !0
  }
  get roomMeshes() {
    const e = new Set<RoomMesh>()
    for (const t of this.floorMeshes) for (const i of t.roomMeshes) e.add(i)
    return e
  }
  async initTextureLoader(meshTextureLoader: MeshTextureLoader, textures: Record<string, ExpiringResource>) {
    //Martian 如果是glb 文件，贴图已经加载了
    // if (this.chunks.length > 0 && this.chunks[0].embeddedTexture) return Promise.resolve()
    var i = meshTextureLoader.textureQualityMap
    i.reset()
    // pw
    //模型贴图,分片加载bug,先模糊后高清,现改为符合贴图尺寸的方法
    // i.registerQualities(MeshChunkLOD.Standard, 512, 0.048, 0.5, "low")
    // i.registerQualities(MeshChunkLOD.Standard, 2048, 0.012, 0.5, "high")
    // meshTextureLoader.limitMemoryUsage = !1
    // meshTextureLoader.setModel(this, this.chunks, textures)
    // await meshTextureLoader.loadAll(meshTextureLoader.textureQualityMap.min(MeshChunkLOD.Standard))
    i.registerQualities(MeshChunkLOD.Standard, 512, 0.048, 0.5, "low")
    i.registerQualities(MeshChunkLOD.High, 2048, 0.012, 0.5, "high")
    meshTextureLoader.limitMemoryUsage = !1
    meshTextureLoader.setModel(this, this.chunks, textures)
    await meshTextureLoader.loadAll(meshTextureLoader.textureQualityMap.min(MeshChunkLOD.High))
  }
  registerCollision(input: InputIniModule) {
    input.registerMesh(this, !0)
    for (const t of this.roomMeshes) input.registerSnappingMeshGeometry(t.name, t.geometry, { meshGroup: t.meshGroup })
  }
  unregisterCollision(input: InputIniModule) {
    input.unregisterMesh(this)
    for (const t of this.roomMeshes) input.unregisterSnappingMeshGeometry(t.name)
  }
  setTextureQuality(meshTextureLoader: MeshTextureLoader, limitMin: MeshTextureQuality, limitMax: MeshTextureQuality) {
    meshTextureLoader.setQuality(limitMin, limitMax)
  }
  onUpdate() {}

  /**
   *
   * @param meshGroup floor index
   * @returns
   */
  getOrCreateFloorMesh(meshGroup: number) {
    let floorMesh = this.floorMeshes.get(meshGroup)
    if (!floorMesh) {
      floorMesh = new FloorMesh(meshGroup, this.renderLayer)
      this.floorMeshes.add(floorMesh)
      this.add(floorMesh)
    }
    return floorMesh
  }
}

export const createModelMesh = async (params: CreateModelMeshParams) => {
  const { model, renderLayer, engine, chunkFactory, roomMeshData } = params
  const a = await (engine as EngineContext).getModuleBySymbol(Apiv2Symbol)
  const meshUrls = model.meshUrls || []
  const sceneId = model.sceneId
  let chunks: MeshChunk[] | undefined
  //test
  const glb = functionCommon.replaceHost(`/scenes/${sceneId}/model/${sceneId}.glb`, "fileHost")
  chunks = use_glTF
    ? await LoadGLTFChunk(glb, chunkFactory, e => {
        engine.broadcast(new MeshProgressBindingMessage(e.loaded, e.total))
      })
    : undefined

  //end
  const modelMesh = new ModelMesh(meshUrls[0]?.uuid || sceneId, a.getApi(), renderLayer, meshUrls)
  await modelMesh.load({
    roomMeshData,
    chunkFactory,
    onProgress: e => {
      engine.broadcast(new MeshProgressBindingMessage(e.loaded, e.total))
    },
    chunks
  })
  return modelMesh
}

const LoadGLTFChunk = async (url: string, chunkFactory: CreateModelMeshParams["chunkFactory"], onProgress: (event: ProgressEvent) => void) => {
  const gltfLoader = new GLTFLoader()
  const gltf = await gltfLoader.loadAsync(url, onProgress)
  const data = gltf.parser.json
  const scene = gltf.scene
  const materials = data["materials"] || []
  const textures = data["textures"] || []
  const images = data["images"] || []

  const findImage = (mtl_name: string) => {
    const mtl = materials.find((value: any) => {
      return value.name === mtl_name
    })
    const texIndex = mtl?.pbrMetallicRoughness?.baseColorTexture?.index
    if (texIndex === undefined) return ""

    const imgIndex = textures[texIndex].source
    const image = images[imgIndex]
    let img = image.uri
    if (!img) {
      const { name, bufferView, mimeType } = image
      img = name
      if (mimeType.startsWith("image/")) {
        //const ext = mimeType.replace("image/", ".")
        //img += ext
        img += ".jpg"
      }
    }

    return img
  }

  const chunks: MeshChunk[] = []
  //pw ,不缩放,
  // const gltf_unit_ = 0.001//缩小1000兼容国内云展
  const gltf_unit_ = 1
  const matrix = new Matrix4()
  //matrix.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)
  matrix.makeScale(gltf_unit_, gltf_unit_, gltf_unit_)

  scene.traverse(child => {
    if (child instanceof Mesh) {
      //const chunk_name = child.name
      const chunk_name = child.material.name
      const { group, subgroup: subgroup } = parseGeometryAttributes(chunk_name)

      const geometry = child.geometry as BufferGeometry
      if (geometry) {
        geometry.deleteAttribute("normal")
        geometry.applyMatrix4(matrix)
        geometry.computeBoundingBox()
        geometry.computeBoundingSphere()
        // const texture_name = child.material.name
        const texture_name = findImage(chunk_name)
        const chunk = chunkFactory(group, subgroup, geometry, texture_name)

        if (use_glTF_Texture && child.material.map) {
          const texture = child.material.map as Texture

          chunk.embeddedTexture = child.material.map
        } else {
          const uvs = geometry.getAttribute("uv") as any
          for (let i = 0; i < uvs.count; i++) {
            uvs.array[i * 2 + 1] = 1 - uvs.array[i * 2 + 1]
          }
        }

        chunks.push(chunk)
      }
    }
  })

  // exportToObj(chunks, "gltf_chunk.obj")
  return chunks.length > 0 ? chunks : undefined
}

//test
function exportToObj(chunks: MeshChunk[], name: string) {
  function save(blob, filename) {
    const link = document.createElement("a")
    link.style.display = "none"
    document.body.appendChild(link)
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()

    link.parentNode?.removeChild(link)
  }

  function saveString(text, filename) {
    save(new Blob([text], { type: "text/plain" }), filename)
  }

  const root = new Object3D()
  name = name || "object.obj"

  chunks.forEach(chunk => {
    const geometry = chunk.geometry
    const mesh = new Mesh(geometry)
    root.add(mesh)
  })
  const exporter = new OBJExporter()

  const result = exporter.parse(root)
  saveString(result, name)
}
