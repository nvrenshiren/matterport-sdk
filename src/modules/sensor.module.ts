import {
  AnimationClip,
  AnimationMixer,
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Frustum,
  InterpolateSmooth,
  LineBasicMaterial,
  LineSegments,
  LoopOnce,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  SphereGeometry,
  Vector3,
  VectorKeyframeTrack
} from "three"
import { InputSymbol, RaycasterSymbol, SensorsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { ObserverManager } from "../observable/observer.manager"
import { Comparator } from "../utils/comparator"
import { MatrixBase } from "../webgl/matrix.base"
import { DirectionVector } from "../webgl/vector.const"
declare global {
  interface SymbolModule {
    [SensorsSymbol]: SensorModule
  }
}
class l {
  constructor() {
    this.needsUpdate = !0
  }
  notify() {
    this.needsUpdate = !0
  }
}
class d {
  constructor(e) {
    ;(this.observable = new ObserverManager()),
      (this.notifier = new (class {
        constructor(e) {
          this.sensorObservable = e
        }
        notify() {
          this.sensorObservable.observable.notify()
        }
      })(this)),
      (this.dependencySub = e.sub(this.notifier))
  }
  dispose() {
    this.dependencySub.cancel()
  }
  observe(e) {
    return this.observable.observe(e)
  }
}
class u {
  constructor(e) {
    ;(this.cameraData = e),
      (this._forward = new Vector3()),
      (this.frustum = new Frustum()),
      (this.frustumTransform = new MatrixBase()),
      (this.frustumProjection = new MatrixBase()),
      (this.forwardObserver = new l()),
      (this.frustumObserver = new l()),
      (this.frustumObservable = new d(new h(e))),
      this.frustumObservable.observe(this.forwardObserver),
      this.frustumObservable.observe(this.frustumObserver)
  }
  dispose() {
    this.frustumObservable.dispose()
  }
  get fovx() {
    return this.cameraData.fovX()
  }
  get fovy() {
    return this.cameraData.fovY()
  }
  get forward() {
    return (
      this.forwardObserver.needsUpdate &&
        ((this.forwardObserver.needsUpdate = !1), this._forward.copy(DirectionVector.FORWARD), this._forward.applyQuaternion(this.cameraData.pose.rotation)),
      this._forward
    )
  }
  observe(e) {
    return this.frustumObservable.observe(e)
  }
  get origin() {
    return this.cameraData.pose.position
  }
  containsPoint(e) {
    return this.updateVolume(), this.frustum.containsPoint(e)
  }
  updateVolume() {
    if (this.frustumObserver.needsUpdate) {
      this.frustumObserver.needsUpdate = !1
      const e = this.cameraData.pose
      this.frustumTransform.compose(e.position, e.rotation, DirectionVector.UNIT).getInverse(this.frustumTransform),
        this.frustumProjection.copy(this.cameraData.pose.projection),
        this.frustum.setFromProjectionMatrix(this.frustumTransform.multiplyMatrices(this.frustumProjection, this.frustumTransform).asThreeMatrix4())
    }
  }
}
class h {
  constructor(e) {
    this.cameraData = e
  }
  sub(e) {
    return this.cameraData.onChanged(() => e.notify())
  }
}
class m {
  constructor() {
    this.sensors = new Set()
  }
  addSensor(e) {
    this.sensors.add(e)
  }
  removeSensor(e) {
    this.sensors.delete(e)
  }
  update() {
    for (const e of this.sensors) e.update()
  }
}
class f {
  constructor(e, t, n) {
    ;(this.frustum = e),
      (this.raycaster = t),
      (this.sensorDisposer = n),
      (this.volumeObserver = new l()),
      (this.sources = new Set()),
      (this.dirtySources = new Set()),
      (this.sourceWatchers = new Map()),
      (this.readingsCache = new Map()),
      (this.readingObservable = new ObserverManager()),
      (this.raycastDirection = new Vector3()),
      (this.volumeSub = e.observe(this.volumeObserver))
  }
  get origin() {
    return this.frustum.origin
  }
  dispose() {
    this.volumeSub.cancel(), this.sensorDisposer.disposeSensor(this)
  }
  addSource(...e) {
    for (const t of e) this.sources.add(t), this.dirtySources.add(t), this.sourceWatchers.set(t, new g(this.dirtySources, t))
  }
  get readings() {
    return this.readingsCache
  }
  update() {
    this.volumeObserver.needsUpdate
      ? ((this.volumeObserver.needsUpdate = !1), this.recomputeAllReadings(), this.readingObservable.notify())
      : this.dirtySources.size > 0 && (this.recomputeDirtyReadings(), this.readingObservable.notify())
  }
  recomputeAllReadings() {
    for (const e of this.sources) this.recomputeReading(e)
    this.dirtySources.clear()
  }
  recomputeDirtyReadings() {
    for (const e of this.dirtySources) this.recomputeReading(e)
    this.dirtySources.clear()
  }
  recomputeReading(e) {
    this.raycastDirection.copy(e.origin).sub(this.frustum.origin).normalize()
    const t = this.frustum.origin.distanceToSquared(e.origin),
      n = this.readingsCache.get(e) || {
        direction: new Vector3()
      }
    ;(n.inRange = (function (e, t) {
      return t.volume.containsPoint(e.origin)
    })(this, e)),
      (n.inView =
        n.inRange &&
        this.frustum.containsPoint(e.origin) &&
        !(function (e, t) {
          return !!t && e > t.distance ** 2
        })(t, this.raycaster.picking.pick(this.frustum.origin, this.raycastDirection))),
      n.direction.copy(this.raycastDirection),
      (n.distanceSq = t),
      this.readingsCache.set(e, n)
  }
  onReadingsUpdated(e) {
    return this.readingObservable.observe(e)
  }
}
class g {
  constructor(e, t) {
    this.sub = t.volume.observe({
      notify() {
        e.add(t)
      }
    })
  }
  dispose() {
    this.sub.cancel()
  }
}
const E = (e, t) =>
    e.type === SourceType.BOX
      ? O(t)
      : e.type === SourceType.CYLINDER
        ? (function (e) {
            const t = new CylinderGeometry(0.5, 0.5, 1)
            t.translate(0, 0.5, 0)
            const n = new Mesh(t, new MeshBasicMaterial())
            n.scale.set(0.05, 0.1, 0.05)
            const i = new MeshBasicMaterial({
                transparent: !0,
                opacity: 0.1,
                side: DoubleSide,
                depthWrite: !1
              }),
              s = new Mesh(
                t,
                new MeshBasicMaterial({
                  wireframe: !0
                })
              ),
              r = new Mesh(t, i)
            return (
              r.add(s),
              e.add(n),
              e.add(r),
              {
                interactionMesh: n,
                volumeMesh: r,
                dispose() {
                  e.remove(n),
                    e.remove(r),
                    n.geometry.dispose(),
                    n.material.dispose(),
                    r.geometry.dispose(),
                    r.material.dispose(),
                    s.geometry.dispose(),
                    s.material.dispose()
                },
                setColor(e) {
                  r.material.color.set(e), s.material.color.set(e)
                }
              }
            )
          })(t)
        : S(t),
  S = e => {
    const t = new SphereGeometry(1, 20, 20),
      n = new Mesh(t, new MeshBasicMaterial())
    n.scale.set(0.5, 0.5, 0.5)
    const i = new Mesh(
        t,
        new MeshBasicMaterial({
          wireframe: !0
        })
      ),
      s = new Mesh(
        t,
        new MeshBasicMaterial({
          transparent: !0,
          opacity: 0.1,
          side: DoubleSide,
          depthWrite: !1
        })
      )
    return (
      s.add(i),
      e.add(n),
      e.add(s),
      {
        interactionMesh: n,
        volumeMesh: s,
        dispose: () => {
          e.remove(n),
            e.remove(s),
            n.geometry.dispose(),
            n.material.dispose(),
            s.geometry.dispose(),
            s.material.dispose(),
            i.geometry.dispose(),
            i.material.dispose()
        },
        setColor: e => {
          s.material.color.set(e), i.material.color.set(e)
        }
      }
    )
  },
  O = e => {
    const t = new BoxGeometry(1, 1, 1),
      n = new Mesh(t, new MeshBasicMaterial())
    n.scale.set(0.1, 0.1, 0.1)
    const i = new MeshBasicMaterial({
        transparent: !0,
        opacity: 0.1,
        side: DoubleSide,
        depthWrite: !1
      }),
      s = new Mesh(t, i),
      r = new LineSegments(new EdgesGeometry(t), new LineBasicMaterial())
    return (
      s.add(r),
      e.add(n),
      e.add(s),
      {
        interactionMesh: n,
        volumeMesh: s,
        dispose: () => {
          e.remove(n),
            e.remove(s),
            n.geometry.dispose(),
            n.material.dispose(),
            s.geometry.dispose(),
            s.material.dispose(),
            r.geometry.dispose(),
            r.material.dispose()
        },
        setColor: e => {
          s.material.color.set(e), r.material.color.set(e)
        }
      }
    )
  }
const T = e => {
    if (e.type === SourceType.BOX) {
      const t = e
      return Object.assign({}, t.volume.size)
    }
    if (e.type === SourceType.CYLINDER) {
      const t = e
      return {
        x: t.volume.radius,
        y: t.volume.height,
        z: t.volume.radius
      }
    }
    {
      const t = e.volume.radius
      return {
        x: t,
        y: t,
        z: t
      }
    }
  },
  _ = new Quaternion().identity()
function w(e) {
  if (e.type === SourceType.BOX) {
    return e.volume.orientation
  }
  return _
}
class A {
  constructor(e, t, n) {
    ;(this.source = e),
      (this.scene = t),
      (this.inputIni = n),
      (this.subs = []),
      (this.stickyHover = !1),
      (this.sourceDirty = !0),
      (this.meshes = E(e, this.scene.scene)),
      this.meshes.interactionMesh.scale.set(0.1, 0.1, 0.1),
      this.meshes.interactionMesh.position.copy(this.source.origin),
      this.meshes.interactionMesh.material.color.set(16724312),
      this.meshes.volumeMesh.scale.set(0, 0, 0),
      this.meshes.volumeMesh.position.copy(this.source.origin),
      (this.meshes.volumeMesh.visible = !1)
    const i = w(e)
    this.meshes.volumeMesh.quaternion.copy(i)
    this.mixer = new AnimationMixer(this.meshes.volumeMesh)
    const s = T(e),
      r = new VectorKeyframeTrack(".scale", [0, 0.4], [0, 0, 0, s.x, s.y, s.z], InterpolateSmooth),
      a = new AnimationClip(void 0, 0.4, [r])
    ;(this.onHoverAction = this.mixer.clipAction(a)), (this.onHoverAction.clampWhenFinished = !0), (this.onHoverAction.loop = LoopOnce)
    const l = () => {
        const e = this.onHoverAction.time
        this.onHoverAction.reset(),
          (this.meshes.volumeMesh.visible = !0),
          (this.onHoverAction.timeScale = 1),
          (this.onHoverAction.time = e),
          this.onHoverAction.play()
      },
      c = () => {
        ;(this.stickyHover = !this.stickyHover),
          this.stickyHover ? this.meshes.interactionMesh.material.color.set(4473924) : this.meshes.interactionMesh.material.color.set(16724312)
      }
    this.subs.push(this.inputIni.registerMeshHandler(HoverMeshEvent, Comparator.isValue(this.meshes.interactionMesh), l)),
      this.subs.push(
        this.inputIni.registerMeshHandler(UnhoverMeshEvent, Comparator.isValue(this.meshes.interactionMesh), () => {
          if (!this.stickyHover) {
            const e = this.onHoverAction.time
            this.onHoverAction.reset(), (this.onHoverAction.time = e), (this.onHoverAction.timeScale = -1), this.onHoverAction.play()
          }
        })
      ),
      this.subs.push(this.inputIni.registerMeshHandler(InputClickerEndEvent, Comparator.isValue(this.meshes.interactionMesh), c)),
      this.inputIni.registerMesh(this.meshes.interactionMesh, !1),
      l(),
      c(),
      this.subs.push(e.volume.observe(this))
  }
  notify() {
    this.sourceDirty = !0
  }
  update(e, t) {
    if (this.sourceDirty) {
      ;(this.sourceDirty = !1),
        this.meshes.interactionMesh.position.copy(this.source.origin),
        this.meshes.volumeMesh.position.copy(this.source.origin),
        this.meshes.volumeMesh.quaternion.copy(w(this.source))
      const e = T(this.source),
        t = this.onHoverAction.getClip().tracks[0].values
      ;(t[3] = e.x), (t[4] = e.y), (t[5] = e.z)
    }
    this.meshes.setColor(t.inRange ? 65280 : 16711680), this.mixer.update(e / 1e3)
  }
  dispose() {
    this.meshes.dispose(), this.mixer.stopAllAction()
    for (const e of this.subs) e.cancel()
  }
}
class N {
  constructor(e, t, n) {
    ;(this.sensor = e), (this.scene = t), (this.inputIni = n), (this.subs = []), (this.visuals = new Map())
  }
  init() {
    this.subs.push(this.sensor.onReadingsUpdated(this))
  }
  render(e) {
    for (const [t, n] of this.sensor.readings) {
      let i = this.visuals.get(t)
      i || ((i = new A(t, this.scene, this.inputIni)), this.visuals.set(t, i)), i.update(e, n)
    }
  }
  dispose() {}
  activate() {}
  deactivate() {
    for (const e of this.subs) e.cancel()
    for (const e of this.visuals.values()) e.dispose()
    this.visuals.clear()
  }
  notify() {}
}
export default class SensorModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "sensor-module"),
      (this.sensorUpdater = new m()),
      (this.debugSensor = null),
      (this.sensorDisposer = new (class {
        constructor(e) {
          this.sensors = e
        }
        disposeSensor(e) {
          this.sensors.removeSensor(e)
        }
      })(this))
  }
  async init(e, t) {
    ;([this.cameraData, this.raycaster, this.renderer, this.inputIni] = await Promise.all([
      await t.market.waitForData(CameraData),
      await t.getModuleBySymbol(RaycasterSymbol),
      await t.getModuleBySymbol(WebglRendererSymbol),
      await t.getModuleBySymbol(InputSymbol)
    ])),
      (this.cameraVolume = new u(this.cameraData))
    var n, i, r, a
    this.sensorDebuggerFactory =
      ((n = e => {
        t.addComponent(this, e)
      }),
      (i = e => {
        t.removeComponent(this, e)
      }),
      (r = this.renderer.getScene()),
      (a = this.inputIni),
      e => {
        const t = new N(e, r, a)
        return (
          n(t),
          {
            dispose: () => {
              i(t)
            }
          }
        )
      })
  }
  dispose() {
    this.cameraVolume.dispose()
  }
  createSensor(e) {
    const t = new f(e, this.raycaster, this.sensorDisposer)
    return this.sensorUpdater.addSensor(t), t
  }
  createCameraBoundSensor() {
    return this.createSensor(this.cameraVolume)
  }
  setDebugSensor(e) {
    this.debugSensor && (this.debugSensor.dispose(), (this.debugSensor = null)), e && (this.debugSensor = this.sensorDebuggerFactory(e))
  }
  onUpdate() {
    this.sensorUpdater.update()
  }
  removeSensor(e) {
    this.sensorUpdater.removeSensor(e)
  }
}

enum SourceType {
  BOX = "sourcetype.box",
  CYLINDER = "sourcetype.cylinder",
  SPHERE = "sourcetype.sphere"
}
// export const SensorModule = SensorModule
// export const SourceType = C
// export const SphereVolume = k.b
