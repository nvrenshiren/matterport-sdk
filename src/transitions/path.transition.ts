import { Quaternion, Vector3 } from "three"
import * as b from "../math/2569"
import { TransitionTypeList } from "../const/64918"
import { TransitionType } from "../const/transition.const"
import { DebugInfo } from "../core/debug"
import { OpenDeferred } from "../core/deferred"
import { NullGeneratorResult, WaitForPromiseGeneratorResult } from "../core/engineGenerators"
import { SettingsData } from "../data/settings.data"
import { easeInOutQuad, easeInOutSine, easeLiner } from "../utils/ease.utils"
import { Pose } from "../webgl/pose"

import { TransitionFactory } from "./transition.factory"
import { SweepObject } from "../object/sweep.object"
import { CameraData } from "../data/camera.data"
import { SweepsData } from "../data/sweeps.data"
import SweepDataModule from "../modules/sweepData.module"
import CameraDataModule from "../modules/cameraData.module"
import EngineContext from "../core/engineContext"
import SweepPathModule from "../modules/sweepPath.module"
import { calculateQuaternionAngle, lerp } from "../math/2569"
const FastForwardFactor = 5
const G = new DebugInfo("tours")
const V = 0.001
const k = (t: Vector3, e: Vector3, i: number, s: number) => {
  const n = Math.max(0.75, Math.min(t.distanceTo(e), 5)),
    o = n * (1 / s) * 1e3
  let a = o
  const r = i / o
  if (r > V) {
    a += a * ((r - V) / V)
  }
  const h = Math.abs(t.clone().setX(0).setZ(0).distanceTo(e.clone().setX(0).setZ(0)) / Math.max(n, 1))
  if (h > 0.1) {
    a *= 0.9 + 0.75 * h
  }
  return a
}
export class MoveTransition {
  settingsData: SettingsData
  cameraPose: Pose
  moveToSweep: SweepDataModule["moveToSweep"]
  updateTransitionSpeed: CameraDataModule["updateTransitionSpeed"]
  setRestrictedSweeps: SweepPathModule["setRestrictedSweeps"]
  generators: EngineContext
  toIndex: number
  started: number
  stopped: number
  duration: number
  currentGenerator: null | (() => Generator<WaitForPromiseGeneratorResult>)
  currentTransitionPromise: null | Promise<any>
  type: TransitionType
  constructor(t, e, i, s, n, o) {
    this.settingsData = t
    this.cameraPose = e
    this.moveToSweep = i
    this.updateTransitionSpeed = s
    this.setRestrictedSweeps = n
    this.generators = o
    this.toIndex = -1
    this.started = -1
    this.stopped = -1
    this.duration = 0
    this.currentGenerator = null
    this.currentTransitionPromise = null
    this.type = TransitionType.Move
  }
  get active() {
    return null !== this.currentTransitionPromise || null !== this.currentGenerator
  }
  get promise() {
    return this.currentTransitionPromise ? this.currentTransitionPromise : Promise.resolve()
  }
  async stop() {
    this.currentTransitionPromise && (await this.onStopRequested(), await this.promise, (this.currentTransitionPromise = null), (this.stopped = Date.now())),
      this.currentGenerator && (this.generators.stopGenerator(this.currentGenerator), (this.currentGenerator = null))
  }

  start(t: { path: SweepObject[]; orientations: Quaternion[] }, e: number) {
    if (this.active) throw Error("Transition already active")
    const { generator: i, deferred: s } = this.build(t.path, t.orientations)
    this.generators.startGenerator(i)
    this.currentGenerator = i
    this.currentTransitionPromise = s.nativePromise()
    this.toIndex = e
    this.started = Date.now()
    this.stopped = -1
    return this
  }
  build(t: SweepObject[], e: Quaternion[]) {
    const i = new OpenDeferred()
    const n = this
    let o = !1

    this.onStopRequested = async () => {
      o = !0
      await this.updateTransitionSpeed(FastForwardFactor)
    }
    return {
      generator: function* () {
        let a = 1
        for (; a < t.length && !o; ) {
          const i = a - 1
          const o = t[a]
          const r = o.position
          const h = t[i]
          const d = e[a]
          const l = calculateQuaternionAngle(n.cameraPose.rotation, d)
          const u = TransitionFactory.getTransitionSpeed(n.settingsData)
          const p = k(h.position, r, l, u)
          const m = { transitionType: TransitionTypeList.Interpolate, sweepId: o.id, rotation: d, transitionTime: p, easing: easeLiner }
          n.duration = p
          n.setRestrictedSweeps(t, i)
          const g = n.moveToSweep(m)
          yield new WaitForPromiseGeneratorResult(g.nativePromise()), a++
        }
        n.setRestrictedSweeps(null)
        i.resolve()
        n.currentTransitionPromise = null
        n.stop()
      },
      deferred: i
    }
  }
}
export class PathTransition {
  settingsData: SettingsData
  cameraPose: Pose
  cameraTransition: CameraData["transition"]
  sweepTransition: SweepsData["transition"]
  sweepControl: SweepDataModule
  cameraControl: CameraDataModule
  generators: EngineContext
  setRestrictedSweeps: TransitionFactory["setRestrictedSweeps"]
  getCurve: TransitionFactory["getCurveForPath"]
  type: TransitionType
  toIndex: number
  started: number
  stopped: number
  duration: number
  currentTransitionGenerator: null | (() => Generator<WaitForPromiseGeneratorResult | NullGeneratorResult, void, unknown>)
  currentTransitionPromise: null | Promise<any>
  canceling: boolean
  buildTransition: (
    t: SweepObject[],
    e: Quaternion[]
  ) => { generator: () => Generator<WaitForPromiseGeneratorResult | NullGeneratorResult, void, unknown>; deferred: OpenDeferred<any> }
  constructor(t, e, i, n, o, a, r, h, d) {
    this.settingsData = t
    this.cameraPose = e
    this.cameraTransition = i
    this.sweepTransition = n
    this.sweepControl = o
    this.cameraControl = a
    this.generators = r
    this.setRestrictedSweeps = h
    this.getCurve = d
    this.type = TransitionType.Path
    this.toIndex = -1
    this.started = -1
    this.stopped = -1
    this.duration = 0
    this.currentTransitionGenerator = null
    this.currentTransitionPromise = null
    this.canceling = !1
    this.buildTransition = (t, e) => {
      if (t.length <= 2) throw (G.debug(`invalid path: ${t}`), new Error("smooth path requires more than 2 stops"))
      const i = this
      const n = new OpenDeferred()
      i.setRestrictedSweeps(t)
      const o = t.map(t => t.position)
      const a = i.getCurve(o)
      const r = easeLiner
      const h = easeInOutSine
      const d = easeInOutQuad
      const l = TransitionFactory.getTransitionSpeed(i.settingsData)
      this.duration = ((t, e, i) => {
        let s = 0
        for (let n = 0; n < t.length - 1; n++) {
          const o = calculateQuaternionAngle(e[n], e[n + 1])
          s += k(t[n].position, t[n + 1].position, o, i)
        }
        return s
      })(t, e, l)
      G.debug(`path duration: ${this.duration.toFixed(0)}ms, at speed: ${l}m/s`)
      i.cameraControl.beginExternalTransition()
      return {
        generator: function* () {
          n.notify(0)
          const o = new Vector3(),
            u = new Quaternion()
          let p = 0,
            m = 0,
            g = 0,
            f = 1,
            v = t[f].id
          yield new WaitForPromiseGeneratorResult(
            i.sweepControl.activateSweepUnsafe({ sweepId: v }).then(() => {
              i.sweepControl.beginSweepTransition({ sweepId: v, transitionTime: i.duration, internalProgress: !1 })
            })
          ),
            t.length > 2 && i.sweepControl.activateSweepUnsafe({ sweepId: t[2].id })
          let w = i.cameraPose.rotation.clone()
          for (; p < i.duration && !i.canceling; ) {
            const l = p / i.duration
            g > 0 && (w = e[g].clone())
            const c = e[f],
              y = a.normalSourceDistances[g],
              D = a.normalSourceDistances[f],
              S = t[f]
            if (((m = lerp(l, y, D, 0, 1)), m <= 1)) {
              const t = d(m, 0, 1, 1)
              i.sweepTransition.progress.modifyAnimation(t, 1, 0)
              const e = h(m, 0, 1, 1)
              u.copy(w).slerp(c, e)
            }
            l < 1 && o.copy(a.curve.getPointAt(r(l, 0, 1, 1))),
              i.cameraControl.updateCameraPosition(o),
              i.cameraControl.updateCameraRotation(u),
              l >= D &&
                (i.sweepControl.endSweepTransition({ sweepId: S.id }),
                g++,
                f++,
                (v = t[g + 1].id),
                yield new WaitForPromiseGeneratorResult(
                  i.sweepControl.activateSweepUnsafe({ sweepId: v }).then(() => {
                    i.sweepControl.beginSweepTransition({ sweepId: v, transitionTime: i.duration, internalProgress: !1 })
                  })
                ),
                t.length > g + 2 && i.sweepControl.activateSweepUnsafe({ sweepId: t[g + 2].id })),
              n.notify(l),
              (p = Date.now() - i.cameraTransition.startTime),
              yield new NullGeneratorResult()
          }
          if ((i.cameraControl.endExternalTransition(), i.canceling)) {
            i.canceling = !1
            const e = t[f].position,
              n = k(i.cameraPose.position, e, 0, l),
              o = i.cameraControl.moveTo({ transitionTime: n / FastForwardFactor, transitionType: TransitionTypeList.Interpolate, pose: { position: e } })
            o.progress(t => {
              const e = lerp(t, 0, 1, m, 1)
              i.sweepTransition.progress.modifyAnimation(e, 1, 0)
            }),
              yield new WaitForPromiseGeneratorResult(o.nativePromise())
          }
          i.sweepControl.endSweepTransition({ sweepId: v }), i.setRestrictedSweeps(null), n.notify(1), n.resolve()
        },
        deferred: n
      }
    }
  }
  get active() {
    return null !== this.currentTransitionPromise || null !== this.currentTransitionGenerator
  }
  get promise() {
    return this.currentTransitionPromise ? this.currentTransitionPromise : Promise.resolve()
  }
  async stop() {
    ;(this.canceling = !0),
      this.currentTransitionPromise && (await this.promise, (this.currentTransitionPromise = null), (this.stopped = Date.now())),
      this.currentTransitionGenerator && (this.generators.stopGenerator(this.currentTransitionGenerator), (this.currentTransitionGenerator = null))
  }
  start(t: { path: SweepObject[]; orientations: Quaternion[] }, e: number) {
    if ((G.debug(`starting smooth transition with ${t.path.length - 1} stops`), this.active)) throw Error("Transition already active")
    this.canceling = !1
    const { generator: i, deferred: s } = this.buildTransition(t.path, t.orientations)
    this.generators.startGenerator(i)
    this.currentTransitionGenerator = i
    this.currentTransitionPromise = s.nativePromise().then(() => {
      ;(this.currentTransitionPromise = null), (this.currentTransitionGenerator = null), (this.stopped = Date.now())
    })
    this.toIndex = e
    this.started = Date.now()
    this.stopped = -1
    return this
  }
}
