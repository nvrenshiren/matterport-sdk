import { Object3D, PerspectiveCamera, Scene, Vector2, WebGL1Renderer, WebGLRenderer } from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { RenderLayers } from "../core/layers"
import { CameraData } from "../data/camera.data"
import { CameraRigConfig } from "../utils/camera.utils"
export enum ChildIDS {
  CameraRig = 1,
  Root = 0
}

class CameraRig extends Object3D {
  anchor: this
  update: (e: CameraData["pose"]) => void
  camera: PerspectiveCamera
  constructor(aspect: number) {
    super()
    this.anchor = this
    this.update = (e: CameraData["pose"]) => {
      this.anchor.position.copy(e.position)
      this.camera.quaternion.copy(e.rotation)
      this.camera.projectionMatrix.copy(e.projection.asThreeMatrix4())
      this.camera.projectionMatrixInverse.copy(e.projection.asThreeMatrix4())
      this.camera.projectionMatrixInverse.invert()
      this.updateMatrixWorld(!0)
    }
    this.camera = new PerspectiveCamera(CameraRigConfig.fov, aspect, CameraRigConfig.near, CameraRigConfig.far)
    this.add(this.camera)
    this.camera.layers.mask = RenderLayers.ALL.mask
    this.name = "CameraRig"
  }
  dispose() {
    this.remove(this.camera)
  }
}

export class ShowCaseScene {
  scene: Scene
  threeRenderer: WebGLRenderer | WebGL1Renderer
  cameraData: CameraData
  useEffectComposer: boolean
  ids: typeof ChildIDS
  rendering: boolean
  composer: EffectComposer | null
  cameraRigStale: boolean
  canvasSizeChanged: boolean
  updateComposer: () => void
  cameraRig: CameraRig
  cameraDataCallback: () => boolean
  constructor(scene: Scene, threeRenderer: WebGLRenderer | WebGL1Renderer, cameraData: CameraData, useEffectComposer: boolean) {
    this.scene = scene
    this.threeRenderer = threeRenderer
    this.cameraData = cameraData
    this.useEffectComposer = useEffectComposer
    this.ids = ChildIDS
    this.rendering = !1
    this.composer = null
    this.cameraRigStale = !0
    this.canvasSizeChanged = !0
    this.updateComposer = (() => {
      const size = new Vector2()
      return () => {
        if (this.canvasSizeChanged && this.composer) {
          this.composer.setPixelRatio(this.composer.renderer.getPixelRatio())
          this.composer.renderer.getSize(size)
          this.composer.setSize(size.x, size.y)
          this.canvasSizeChanged = !1
        }
      }
    })()
  }
  add(...object: Object3D[]) {
    for (const t of object) this.addChild(ChildIDS.Root, t)
  }
  remove(...object: Object3D[]) {
    for (const t of object) this.removeChild(ChildIDS.Root, t)
  }
  addChild(ID: ChildIDS, object: Object3D) {
    switch (ID) {
      case ChildIDS.Root:
        this.scene.add(object)
        break
      case ChildIDS.CameraRig:
        this.cameraRig.add(object)
        break
      default:
        return !1
    }
    return !0
  }
  removeChild(ID: ChildIDS, object: Object3D) {
    switch (ID) {
      case ChildIDS.Root:
        this.scene.remove(object)
        break
      case ChildIDS.CameraRig:
        this.cameraRig.remove(object)
        break
      default:
        return !1
    }
    return !0
  }
  get camera() {
    this.updateCameraRig()
    return this.cameraRig.camera
  }
  get effectComposer() {
    return this.composer
  }
  init() {
    this.cameraRig = new CameraRig(this.cameraData.aspect())
    if (this.useEffectComposer) {
      this.composer = new EffectComposer(this.threeRenderer)
      this.composer.addPass(new RenderPass(this.scene, this.cameraRig.camera))
      this.cameraRigStale = !0
    }

    this.cameraRigStale = !0
  }
  dispose() {
    this.cameraRig.dispose()
  }
  startRender(value: boolean) {
    this.rendering = value
  }
  activate(value?: any) {
    this.scene.add(this.cameraRig)
    this.cameraDataCallback = () => (this.cameraRigStale = !0)
    this.cameraData.pose.onChanged(this.cameraDataCallback)
  }
  deactivate(value?: any) {
    this.scene.remove(this.cameraRig)
    this.cameraData.pose.removeOnChanged(this.cameraDataCallback)
  }
  beforeRender() {
    this.updateCameraRig()
    this.updateComposer()
  }
  setCameraDirty() {
    this.cameraRigStale = !0
    this.cameraRig.camera.updateProjectionMatrix()
  }
  onCanvasSizeChanged() {
    this.canvasSizeChanged = !0
  }
  updateCameraRig() {
    if (this.cameraRigStale) {
      this.cameraRig.update(this.cameraData.pose)
      this.cameraRigStale = !1
    }
  }
  render(deltaTime?: number) {
    if (this.rendering) {
      if (this.composer) {
        this.composer.render(deltaTime)
      } else {
        this.threeRenderer.clear()
        this.threeRenderer.render(this.scene, this.cameraRig.camera)
      }
    }
  }
}
