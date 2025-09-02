import {
  BackSide,
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Quaternion,
  RawShaderMaterial,
  RepeatWrapping,
  SphereGeometry,
  UniformsUtils,
  Vector2,
  Vector3,
  Vector4
} from "three"
import { ToggleRotationInteractionsCommand } from "../command/interaction.command"
import { EndRotateSweepCommand, FinRotateSweepCommand, InitRotateSweepCommand } from "../command/sweep.command"
import { PickingPriorityType } from "../const/12529"
import * as j from "../const/21646"
import * as p from "../const/71161"
import { PanoSizeKey } from "../const/76609"
import { ColorSpace } from "../const/color.const"
import { MouseKeyCode } from "../const/mouse.const"
import { Apiv2Symbol, InputSymbol, RttSymbol, WebglRendererSymbol, WorkShopRotationInteractionSymbol } from "../const/symbol.const"
import { OpenDeferred } from "../core/deferred"
import { NullGeneratorResult } from "../core/engineGenerators"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { SweepsData } from "../data/sweeps.data"
import { SweepsViewData } from "../data/sweeps.view.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent } from "../events/drag.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { OnMouseDownEvent } from "../events/mouse.event"
import n3 from "../glsl/15372.glsl"
import n4 from "../glsl/31702.glsl"
import n1 from "../glsl/4591.glsl"
import n2 from "../glsl/6066.glsl"
import { calculateAngleBetweenVectors, calculateObjectRotationMatrix, convertScreenToWorldCoordinates } from "../math/81729"
import { WebglRendererContextRestoredMessage } from "../message//webgl.message"
import { UnalignedRotateEndMessage, UnalignedRotateMessage, UnalignedRotateStartMessage } from "../message/sweep.message"
import { AlignmentType } from "../object/sweep.object"
import * as R from "../other/44237"
import { CheckThreshold } from "../utils/49827"
import { Comparator } from "../utils/comparator"
import { LoadTexture } from "../utils/loadTexture"
import { ViewModes } from "../utils/viewMode.utils"
import { CreateOffScreenCanvas } from "../webgl/70817"
import { MatrixBase } from "../webgl/matrix.base"
import { ShowcaseTextureLoader } from "../webgl/texture.loader"
import { DirectionVector } from "../webgl/vector.const"
declare global {
  interface SymbolModule {
    [WorkShopRotationInteractionSymbol]: RotationInteractionModule
  }
}
const P = {
  sphere: {
    uniforms: {
      map: {
        type: "t",
        value: null
      },
      opacity: {
        type: "f",
        value: 1
      },
      borderColor: {
        type: "v4",
        value: new Vector4()
      }
    },
    vertexShader: n1,
    fragmentShader: n2
  },
  circle: {
    uniforms: {
      borderSize: {
        type: "f",
        value: 0
      },
      panoRadius: {
        type: "f",
        value: 1
      },
      opacity: {
        type: "f",
        value: 1
      },
      borderColor: {
        type: "v4",
        value: new Vector4()
      },
      circleProjection: {
        type: "t",
        value: null
      }
    },
    vertexShader: n3,
    fragmentShader: n4
  }
}
class x extends RawShaderMaterial {
  constructor() {
    super({
      fragmentShader: P.circle.fragmentShader,
      vertexShader: P.circle.vertexShader,
      uniforms: UniformsUtils.clone(P.circle.uniforms),
      name: "CircleProjectionMaterial",
      transparent: !0,
      depthTest: !1,
      depthWrite: !0,
      side: DoubleSide
    })
  }
}
class k extends RawShaderMaterial {
  constructor() {
    super({
      fragmentShader: P.sphere.fragmentShader,
      vertexShader: P.sphere.vertexShader,
      uniforms: UniformsUtils.clone(P.sphere.uniforms),
      name: "SphereProjectionMaterial",
      transparent: !0,
      depthTest: !1,
      depthWrite: !0,
      side: BackSide
    })
  }
}

import H from "../images/cir_arrow.png"
import B from "../images/sphere_arrow.png"
const G = (0, R.Ot)(new Vector4(), ColorSpace.WHITE, 0.75),
  W = (0, R.Ot)(new Vector4(), ColorSpace.MP_BRAND, 0.75),
  z = ColorSpace.WHITE.clone()
enum $ {
  None = 0,
  Circle = 1,
  Sphere = 2
}
class K extends Mesh {}
class Y extends Mesh {}
class q extends Mesh {}
class Z {
  constructor(e, t, n) {
    ;(this.webglscene = e),
      (this.renderToTextureModule = t),
      (this.cameraData = n),
      (this.collider = new K(
        new SphereGeometry(2.5),
        new MeshBasicMaterial({
          transparent: !0,
          opacity: 0,
          depthWrite: !1
        })
      )),
      (this.circleArrowContainer = new Object3D()),
      (this.sphereArrowContainer = new Object3D()),
      (this.activeMesh = null),
      (this.activeSweepIndex = -1),
      (this.activeAnimationPromise = null),
      (this.activeAnimationIn = null),
      (this.animationProgress = 0),
      (this.tempVector = new Vector3()),
      (this.tempLookVector = new Vector3()),
      (this.tempBackVector = new Vector3()),
      (this.tempMatrix = new MatrixBase())
    const s = Z.numberTextureWidth
    ;(this.numberRenderer = new CreateOffScreenCanvas(s, s, Z.contextConfig)),
      (this.numberTexture = t.createRenderTarget2D(128)),
      this.createCircleProjection(),
      this.createSphere(),
      this.collider.position.set(1 / 0, 1 / 0, 1 / 0),
      this.webglscene.scene.add(this.collider)
  }
  init() {}
  dispose() {
    this.circleProjectionMesh.geometry.dispose(),
      this.circleProjectionMesh.material.dispose(),
      this.numberMesh.geometry.dispose(),
      this.numberMesh.material.dispose(),
      this.sphereMesh.geometry.dispose(),
      this.sphereMesh.material.dispose(),
      this.collider.geometry.dispose(),
      this.collider.material.dispose(),
      this.renderToTextureModule.disposeRenderTarget2D(this.circleProjectionRenderTarget),
      this.renderToTextureModule.disposeRenderTarget2D(this.numberTexture)
  }
  activate(e) {
    this.engine = e
  }
  async deactivate(e) {
    try {
      await this.close()
    } finally {
      this.webglscene.scene.remove(this.circleProjectionMesh), this.webglscene.scene.remove(this.sphereMesh)
    }
  }
  beforeRender(e) {
    if ((this.tempVector.copy(DirectionVector.UP).applyQuaternion(this.cameraData.pose.rotation), this.activeMesh === this.circleProjectionMesh)) {
      this.numberMesh.getWorldPosition(this.tempLookVector),
        this.tempLookVector.add(this.tempBackVector.copy(DirectionVector.BACK).applyQuaternion(this.cameraData.pose.rotation)),
        calculateObjectRotationMatrix(this.numberMesh, this.tempLookVector, this.tempVector, this.tempMatrix)
      const e = this.tempMatrix.asThreeMatrix4()
      this.numberMesh.quaternion.setFromRotationMatrix(e), this.circleArrowContainer.quaternion.setFromRotationMatrix(e)
    } else
      this.activeMesh === this.sphereMesh &&
        (calculateObjectRotationMatrix(this.sphereArrowContainer, this.cameraData.pose.position, this.tempVector, this.tempMatrix),
        this.sphereArrowContainer.quaternion.setFromRotationMatrix(this.tempMatrix.asThreeMatrix4()))
  }
  render() {}
  getActiveMesh() {
    return this.activeMesh
  }
  getCollider() {
    return this.collider
  }
  animateRotationInteraction(e, t) {
    if (!this.activeMesh) return Promise.reject("No currently active mesh")
    if (this.activeAnimationPromise && this.activeAnimationIn === e) return this.activeAnimationPromise.nativePromise()
    const n = Date.now(),
      s = new OpenDeferred(),
      r = new Quaternion(),
      o = e => {
        const t = Math.max(this.animationProgress, j.Z.epsilon)
        this.activeMesh instanceof Y
          ? (r.setFromAxisAngle(DirectionVector.UP, e * Math.PI * 2),
            this.activeMesh.quaternion.multiply(r),
            this.collider.quaternion.copy(this.activeMesh.quaternion),
            this.activeMesh.scale.set(-t, t, -t))
          : this.activeMesh instanceof q && this.sphereMesh.scale.setScalar(t)
      },
      l = this
    return (
      (this.activeAnimationIn = e),
      (this.activeAnimationPromise = s),
      this.engine.startGenerator(function* () {
        let i = Date.now() - n
        for (; i < t; ) {
          let s = l.animationProgress
          const r = i / t
          ;(l.animationProgress = CheckThreshold(e ? r : 1 - r, 0, 1)),
            (s = l.animationProgress - s),
            o(s),
            yield new NullGeneratorResult(),
            (i = Date.now() - n)
        }
        let s = 0
        e ? ((s = 1 - l.animationProgress), (l.animationProgress = 1)) : ((s = l.animationProgress), (l.animationProgress = 0)),
          o(s),
          yield new NullGeneratorResult()
        const r = l.activeAnimationPromise
        r && (r.resolve(), (l.activeAnimationPromise = null)), (l.activeAnimationIn = null)
      }),
      s.nativePromise()
    )
  }
  async open(e, t, n, i, s) {
    var r
    if ((null === (r = this.contextRestoredSub) || void 0 === r || r.cancel(), this.activeSweepIndex === i))
      return this.activeAnimationPromise ? this.activeAnimationPromise.nativePromise() : Promise.resolve()
    switch (
      (this.activeAnimationPromise &&
        (!0 === this.activeAnimationIn
          ? (await this.activeAnimationPromise.nativePromise(), await this.close())
          : !1 === this.activeAnimationIn && (await this.activeAnimationPromise.nativePromise())),
      n)
    ) {
      case $.Circle:
        const e = () => {
          this.renderToTextureModule.renderSphericalProjection(t, this.circleProjectionRenderTarget, 5, 0.05, G), this.updateNumberTexture(i.toString())
        }
        ;(this.contextRestoredSub = this.engine.subscribe(WebglRendererContextRestoredMessage, e)), e(), (this.activeMesh = this.circleProjectionMesh)
        break
      case $.Sphere:
        ;(this.sphereMesh.material.uniforms.map.value = t), (this.activeMesh = this.sphereMesh)
        break
      case $.None:
      default:
        return
    }
    s && this.updateRotation(e.rotation),
      this.activeMesh.position.copy(e.position),
      this.collider.position.copy(this.activeMesh.position),
      this.collider.quaternion.copy(this.activeMesh.quaternion),
      this.webglscene.scene.add(this.activeMesh),
      await this.animateRotationInteraction(!0, 300),
      (this.activeSweepIndex = i)
  }
  async close() {
    var e
    if ((null === (e = this.contextRestoredSub) || void 0 === e || e.cancel(), this.activeAnimationPromise)) {
      if (!1 === this.activeAnimationIn) return this.activeAnimationPromise.nativePromise()
      !0 === this.activeAnimationIn && (await this.activeAnimationPromise.nativePromise())
    }
    this.collider.position.set(1 / 0, 1 / 0, 1 / 0),
      this.clearHoverState(),
      this.activeMesh &&
        (await this.animateRotationInteraction(!1, 300 * this.animationProgress),
        (this.activeSweepIndex = -1),
        this.activeMesh && this.webglscene.scene.remove(this.activeMesh),
        (this.activeMesh = null))
  }
  setHoverState() {
    this.circleProjectionMesh.material.uniforms.borderColor.value.copy(W), this.sphereMesh.material.uniforms.borderColor.value.copy(W)
  }
  clearHoverState() {
    this.circleProjectionMesh.material.uniforms.borderColor.value.copy(G), this.sphereMesh.material.uniforms.borderColor.value.copy(G)
  }
  updateRotation(e) {
    this.circleProjectionMesh.quaternion.copy(e), this.sphereMesh.quaternion.copy(e), this.collider.quaternion.copy(e)
  }
  createCircleProjection() {
    if (!this.circleProjectionMesh) {
      ;(this.circleProjectionRenderTarget = this.renderToTextureModule.createRenderTarget2D(1024, 1024)),
        (this.circleProjectionRenderTarget.texture.magFilter = LinearFilter),
        (this.circleProjectionRenderTarget.texture.minFilter = LinearFilter)
      const e = new PlaneGeometry(5, 5)
      e.lookAt(DirectionVector.UP), e.computeBoundingBox()
      const t = new x(),
        n = new PlaneGeometry(1, 1),
        s = LoadTexture(H),
        r = new MeshBasicMaterial({
          transparent: !0,
          map: s,
          depthTest: !1
        }),
        o = new Mesh(n, r),
        l = new Mesh(n, r),
        c = 2
      o.position.setY(c),
        l.position.setY(-c),
        o.rotateZ(Math.PI),
        (o.renderOrder = PickingPriorityType.rotators + 1),
        (l.renderOrder = PickingPriorityType.rotators + 1),
        (t.uniforms.borderSize.value = 0.05),
        (t.uniforms.circleProjection.value = this.circleProjectionRenderTarget.texture),
        t.uniforms.borderColor.value.copy(G),
        (this.circleProjectionMesh = new Y(e, t)),
        (this.circleProjectionMesh.renderOrder = PickingPriorityType.rotators),
        this.circleProjectionMesh.add(this.circleArrowContainer),
        this.circleArrowContainer.add(o),
        this.circleArrowContainer.add(l),
        this.circleProjectionMesh.scale.setScalar(j.Z.epsilon)
      const d = new PlaneGeometry(0.5, 0.5),
        u = new MeshBasicMaterial({
          transparent: !0,
          color: z.getHex(),
          map: this.numberTexture.texture,
          depthTest: !1
        })
      ;(this.numberMesh = new Mesh(d, u)), (this.numberMesh.renderOrder = PickingPriorityType.rotators + 2), this.circleProjectionMesh.add(this.numberMesh)
    }
  }
  updateNumberTexture(e) {
    const t = this.numberRenderer.context,
      n = Z.numberTextureWidth / 2
    t.save(),
      (t.fillStyle = `#${ColorSpace.MP_BRAND.getHexString()}`),
      (t.lineWidth = 3),
      t.beginPath(),
      t.arc(n, n, n - 2, 0, 2 * Math.PI),
      t.fill(),
      t.stroke(),
      t.restore(),
      t.fillText(e, n, n),
      this.renderToTextureModule.renderContext(this.numberTexture, t)
  }
  createSphere() {
    if (!this.sphereMesh) {
      const e = new SphereGeometry(2.5, 128, 128),
        t = new k()
      ;(this.sphereMesh = new q(e, t)),
        (this.sphereMesh.renderOrder = PickingPriorityType.rotators),
        t.uniforms.borderColor.value.copy(G),
        this.sphereMesh.scale.setScalar(j.Z.epsilon)
      const n = new PlaneGeometry(0.75, 0.75),
        s = (e, t) => {
          const s = new Mesh(
            n,
            new MeshBasicMaterial({
              transparent: !0,
              map: e,
              depthTest: !1
            })
          )
          ;(s.position.x = 2 * t), (s.renderOrder = PickingPriorityType.rotators + 1), this.sphereArrowContainer.add(s)
        },
        r = LoadTexture(B, () => {
          s(r, -1)
          const e = r.clone()
          ;(e.wrapS = RepeatWrapping), (e.repeat.x = -1), (e.needsUpdate = !0), s(e, 1)
        })
      this.sphereMesh.add(this.sphereArrowContainer)
    }
  }
}
Z.numberTextureWidth = 128
Z.contextConfig = {
  fillStyle: "white",
  strokeStyle: "white",
  textAlign: "center",
  textBaseline: "middle",
  font: 0.7 * Z.numberTextureWidth + "px Roboto"
}
export default class RotationInteractionModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "rotation-interaction"),
      (this.tempQuaternion = new Quaternion()),
      (this.rotatingSweepId = null),
      (this.editingFloorId = null),
      (this.startScreenCoord = new Vector2()),
      (this.endScreenCoord = new Vector2()),
      (this.startVector = new Vector3()),
      (this.endVector = new Vector3()),
      (this.meshCenter3D = new Vector3()),
      (this.startRotation = new Quaternion()),
      (this.meshQuaternion = new Quaternion()),
      (this.dragging = !1),
      (this.deltaAngle = 0),
      (this.activated = !1),
      (this.registered = !1),
      (this.toggleRotationInteractions = async e => {
        e.enabled ? this.activate() : this.deactivate()
      }),
      (this.hide = () => {
        const e = this.sweepViewData.toolState
        ;(e !== p._.ROTATING && e !== p._.ROTATED) || this.sweepViewData.setToolState(p._.IDLE)
        this.renderer &&
          this.renderer.getActiveMesh() &&
          this.rotatingSweepId &&
          (this.engine.broadcast(new UnalignedRotateEndMessage(this.rotatingSweepId)), this.renderer.close()),
          (this.rotatingSweepId = null)
      }),
      (this.onSelectedSweepChange = () => {
        this.hide()
      }),
      (this.onViewmodeChange = () => {
        this.hide()
      }),
      (this.onFloorViewDataChange = () => {
        this.floorsViewData.currentFloorId !== this.editingFloorId && this.floorsViewData.currentFloorId && this.hide()
      }),
      (this.startRotating = async e => {
        this.sweepViewData.setToolState(p._.ROTATING), this.show(this.getSweep(e.sweepId)), this.engine.broadcast(new UnalignedRotateStartMessage(e.sweepId))
      }),
      (this.onBeginDrag = (e, t, n) => {
        if (e.buttons === MouseKeyCode.PRIMARY) {
          const i = this.viewmodeData.currentMode,
            s = this.getRotationModeForView(i)
          this.startRotation.copy(t.quaternion),
            s === $.Circle
              ? this.computePointerVector(e.position, this.startScreenCoord, t)
              : s === $.Sphere && n && this.startVector.copy(n.point).sub(t.getWorldPosition(this.meshCenter3D)).setY(0),
            (this.deltaAngle = 0),
            (this.dragging = !0)
        }
        return this.dragging
      }),
      (this.onDrag = (e, t, n) => {
        if (this.dragging) {
          const i = this.viewmodeData.currentMode,
            s = this.getRotationModeForView(i)
          let r = 0
          s === $.Circle
            ? (this.computePointerVector(e.position, this.endScreenCoord, t), (r = this.endScreenCoord.angle() - this.startScreenCoord.angle()))
            : s === $.Sphere &&
              n &&
              (this.endVector.copy(n.point).sub(t.getWorldPosition(this.meshCenter3D)).setY(0),
              (r = -calculateAngleBetweenVectors(this.endVector, this.startVector))),
            (this.deltaAngle = r),
            this.tempQuaternion.setFromAxisAngle(DirectionVector.UP, r),
            this.tempQuaternion.premultiply(this.startRotation),
            this.renderer.updateRotation(this.tempQuaternion),
            this.meshQuaternion.copy(t.quaternion)
        }
        return this.dragging
      }),
      (this.onEndDragBg = e => {
        this.hide()
      }),
      (this.onEndDrag = (e, t) => {
        const n = this.dragging
        return (this.dragging = !1), this.meshQuaternion.copy(t.quaternion), this.sweepViewData.setToolState(p._.ROTATED), n
      }),
      (this.finalizeRotation = async e => {
        const t = e.sweepId
        if (t) {
          const e = this.getSweep(t)
          e && (e.rotation.copy(this.meshQuaternion), e.commit(), this.engine.broadcast(new UnalignedRotateMessage(t, this.meshQuaternion, this.deltaAngle)))
        }
        this.hide()
      }),
      (this.computePointerVector = (e, t, n) => {
        n.getWorldPosition(this.meshCenter3D),
          convertScreenToWorldCoordinates(this.meshCenter3D, this.cameraData.pose.position, this.cameraData.pose.rotation, this.cameraData.pose.projection, t),
          (t.x = (e.x - t.x) * this.cameraData.aspect()),
          (t.y = e.y - t.y)
      })
  }
  async init(e, t) {
    ;(this.engine = t),
      Promise.all([
        t.getModuleBySymbol(WebglRendererSymbol),
        t.getModuleBySymbol(RttSymbol),
        t.getModuleBySymbol(InputSymbol),
        t.market.waitForData(CameraData),
        t.market.waitForData(SweepsData),
        t.market.waitForData(SweepsViewData),
        t.market.waitForData(ViewmodeData),
        t.getModuleBySymbol(Apiv2Symbol),
        t.market.waitForData(FloorsViewData)
      ]).then(([e, t, n, i, s, r, a, o, l]) => {
        ;(this.webglRenderer = e),
          (this.renderToTextureModule = t),
          (this.inputModule = n),
          (this.cameraData = i),
          (this.sweepData = s),
          (this.sweepViewData = r),
          (this.viewmodeData = a),
          (this.apiModule = o),
          (this.floorsViewData = l)
      }),
      this.engine.commandBinder.addBinding(ToggleRotationInteractionsCommand, this.toggleRotationInteractions)
  }
  dispose(e) {
    this.activated && this.deactivate(),
      this.engine.commandBinder.removeBinding(ToggleRotationInteractionsCommand, this.toggleRotationInteractions),
      (this.bindings = []),
      super.dispose(e)
  }
  activate() {
    this.activated ||
      (this.registered
        ? ((this.dragging = !1),
          this.bindings.forEach(e => {
            e.renew()
          }))
        : ((this.unalignedSweepList = this.sweepData.filter(e => e.alignmentType === AlignmentType.UNALIGNED)),
          (this.sweepTextureLoader = new ShowcaseTextureLoader(this.apiModule.getApi())),
          (this.renderer = new Z(this.webglRenderer.getScene(), this.renderToTextureModule, this.cameraData)),
          this.setupHandlers(this.cameraData),
          this.addColliders(),
          (this.registered = !0)),
      this.engine.addComponent(this, this.renderer),
      this.inputModule.registerMesh(this.renderer.getCollider(), !1),
      (this.activated = !0))
  }
  deactivate() {
    this.activated &&
      (this.hide(),
      this.inputModule.unregisterMesh(this.renderer.getCollider()),
      this.engine.removeComponent(this, this.renderer),
      this.bindings.forEach(e => {
        e.cancel()
      }),
      (this.activated = !1))
  }
  setupHandlers(e) {
    this.bindings.push(
      this.inputModule.registerPriorityHandler(OnMouseDownEvent, K, () => !0),
      this.inputModule.registerPriorityHandler(DraggerStartEvent, K, this.onBeginDrag),
      this.inputModule.registerPriorityHandler(DraggerMoveEvent, K, this.onDrag),
      this.inputModule.registerPriorityHandler(DraggerStopEvent, K, this.onEndDrag),
      this.inputModule.registerHandler(DraggerStopEvent, this.onEndDragBg),
      this.inputModule.registerMeshHandler(HoverMeshEvent, Comparator.isType(K), () => this.renderer.setHoverState()),
      this.inputModule.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(K), () => this.renderer.clearHoverState()),
      this.sweepViewData.onSelectedSweepChanged(this.onSelectedSweepChange),
      this.viewmodeData.onChanged(this.onViewmodeChange),
      this.floorsViewData.onChanged(this.onFloorViewDataChange),
      this.engine.commandBinder.addBinding(InitRotateSweepCommand, this.startRotating),
      this.engine.commandBinder.addBinding(FinRotateSweepCommand, this.finalizeRotation),
      this.engine.commandBinder.addBinding(EndRotateSweepCommand, async () => this.hide())
    )
  }
  async show(e) {
    let t = this.viewmodeData.currentMode
    this.viewmodeData.isInside() || (t = this.cameraData.isOrtho() ? ViewModes.Floorplan : ViewModes.Dollhouse)
    const n = this.getRotationModeForView(t)
    if (n === $.None) throw Error(`Can't initiate sweep rotator from viewmode: ${t}`)
    await this.showRotator(e, n),
      this.inputModule.captureNext(InputClickerEndEvent, () => {
        this.rotatingSweepId === e.id && this.hide()
      })
  }
  getSweep(e) {
    const t = this.sweepData.getSweep(e)
    if (!t) throw Error(`${e} isn't a valid sweep id`)
    return t
  }
  addColliders() {
    const e = this.renderer.getCollider()
    this.inputModule.registerMesh(e, !1)
  }
  async showRotator(e, t) {
    const n = this.renderer,
      i = !this.rotatingSweepId
    ;(this.rotatingSweepId = e.id), (this.editingFloorId = this.floorsViewData.currentFloorId)
    try {
      const s = await this.sweepTextureLoader.load(e, PanoSizeKey.BASE)
      if (e.id === this.rotatingSweepId) return n.open(e, s, t, this.unalignedSweepList.indexOf(e) + 1 || 0, i)
    } catch (e) {
      this.log.error("The sweep rotator wasn't displayed because the viewmode isn't supported", e)
    }
  }
  getRotationModeForView(e) {
    switch (e) {
      case ViewModes.Dollhouse:
        return $.Sphere
      case ViewModes.Floorplan:
        return $.Circle
    }
    return $.None
  }
}
