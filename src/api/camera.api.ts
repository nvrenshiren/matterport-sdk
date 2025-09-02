import { Euler, MathUtils, Vector2, Vector3 } from "three"
import Engine from "../core/engine"
import { ViewModes } from "../utils/viewMode.utils"
import { CameraData } from "../data/camera.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { EventCommon } from "@ruler3d/common"
import { calculatePostDirection, convertScreenToNDC } from "../math/59370"
import { ControlsCommonSymbol, NavigationSymbol } from "../const/symbol.const"
import CommonControlsModule from "../modules/commonControls.module"
import { DirectionKey, DirectionVector } from "../webgl/vector.const"
import { ZoomInCommand, ZoomResetCommand, ZoomSetCommand } from "../command/zoom.command"
declare global {
  namespace eventList {
    interface data {
      "camera.move": (data: PoseData) => void
    }
  }
}

interface PoseData {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  projection: Float32Array
  sweep: string
  mode: ViewModes | null
  inside?: boolean
}
const temp = new Euler()
const temp1 = new Euler()
function getPose(a: PoseData, o: CameraData, s: SweepsData, i: ViewmodeData) {
  const c = temp.setFromQuaternion(o.pose.rotation, "YXZ")

  const d = s.currentSweep && s.isSweepUnaligned(s.currentSweep)
  a.position.x = o.pose.position.x
  a.position.y = o.pose.position.y
  a.position.z = o.pose.position.z
  a.rotation.x = MathUtils.radToDeg(c.x)
  a.rotation.y = MathUtils.radToDeg(c.y)
  a.rotation.z = MathUtils.radToDeg(c.z)
  a.projection = Float32Array.from(o.pose.projection.asThreeMatrix4().transpose().elements)
  a.sweep = s.currentSweepObject ? s.currentSweepObject.uuid : ""
  a.mode = i.currentMode
  a.inside = !d
  return a
}
const rotateCamera = async (t: CommonControlsModule, n) => {
  const a = n.rotationSpeed
  let o = 0
  const s = Math.abs(n.xAngle)
  const i = Math.abs(n.yAngle)
  const r = Math.max(s, i)
  if (r >= Math.PI) {
    const e = r / Math.PI,
      t = Math.floor(e),
      n = s / e,
      a = i / e,
      c = s - n * t,
      d = i - a * t
    o = Math.acos(Math.cos(n) * Math.cos(a)) * t + Math.acos(Math.cos(c) * Math.cos(d))
  } else o = Math.acos(Math.cos(Math.abs(n.xAngle)) * Math.cos(Math.abs(n.yAngle)))
  if (o) {
    const s = new Vector2(-n.xAngle, n.yAngle)
    s.multiplyScalar(a / o)
    return t.startRotateTransition(o / a, s, !1)
  }
}
const orientCamera = (e: CameraData, s: CommonControlsModule, i: ViewmodeData, r) => {
  if (i.currentMode !== ViewModes.Panorama) throw Error("Camera.setRotation is only available in Panorama mode")
  const c = r.xAngle % (0.5 * Math.PI)
  const d = r.yAngle % (2 * Math.PI)
  const l = e.pose.rotation
  temp.setFromQuaternion(l, "YXZ")
  let h = d - temp.y
  Math.abs(h) > Math.PI && (h -= 2 * Math.sign(h) * Math.PI)
  temp1.set(c - temp.x, h, 0, "YXZ")
  temp1.y %= 2 * Math.PI
  return rotateCamera(s, { xAngle: -temp1.y, yAngle: temp1.x, zAngle: 0, rotationSpeed: r.rotationSpeed })
}
const defaultRotationSpeed = MathUtils.degToRad(80) / 1e3
const initRotateConfig = (e: { options?: { speed: number }; xAngle?: number; yAngle?: number; zAngle?: number }) => {
  const n = (e = e || {}).options || { speed: 80 },
    a = MathUtils.degToRad(e.xAngle || 0),
    s = MathUtils.degToRad(e.yAngle || 0),
    i = MathUtils.degToRad(e.zAngle || 0)
  let r = defaultRotationSpeed
  if (n.speed) {
    if (isNaN(n.speed) || n.speed <= 0) throw new Error(`${JSON.stringify(n)} does not contain valid rotation speed`)
    r = MathUtils.degToRad(n.speed) / 1e3
  }
  if (isNaN(a) || isNaN(s) || isNaN(i)) throw new Error(`${JSON.stringify(e)} does not contain valid rotation angles`)
  return { xAngle: a, yAngle: s, zAngle: i, rotationSpeed: r }
}
function noPanorama(t: ViewModes) {
  if (t !== ViewModes.Panorama) throw Error("Zoom controls are currently only supported in Panorama mode")
}
export class CameraInterface {
  engine: Engine | null = null
  constructor() {}
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {
    const cameraMoveMessage = async () => {
      const initData = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        projection: new Float32Array(16),
        sweep: "",
        mode: ViewModes.Transition as ViewModes | null,
        inside: !0
      }

      const cameraData = await this.engine?.market.waitForData(CameraData)!
      const sweepsData = await this.engine?.market.waitForData(SweepsData)!
      const viewmodeData = await this.engine?.market.waitForData(ViewmodeData)!
      const onChanged = (() => {
        let start = 0
        let stop = !1
        return () => {
          const now = Date.now()
          const next = start + 100
          if (now > next) {
            stop = !1
            start = now
            try {
              getPose(initData, cameraData, sweepsData, viewmodeData)
              EventCommon.EventBus.emit("camera.move", initData)
            } catch (e) {}
          } else stop || (setTimeout(() => onChanged(), next - now), (stop = !0))
        }
      })()
      cameraData.onChanged(onChanged)
      sweepsData.onChanged(onChanged)
    }
    cameraMoveMessage()
  }
  getPose() {
    const cameraData = this.engine?.market.getData(CameraData)!
    const sweepsData = this.engine?.market.getData(SweepsData)!
    const viewmodeData = this.engine?.market.getData(ViewmodeData)!
    const initData = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, projection: new Float32Array(16), sweep: "", mode: ViewModes.Transition }
    return getPose(initData, cameraData, sweepsData, viewmodeData)
  }
  lookAtScreenCoords(x = 0, y = 0) {
    const controls = this.engine?.getModuleBySymbolSync(ControlsCommonSymbol)!
    const cameraData = this.engine?.market.getData(CameraData)!
    const viewmodeData = this.engine?.market.getData(ViewmodeData)!
    if (!viewmodeData.isInside()) throw Error("Camera.lookAtScreenCoords must be called from Inside mode")
    const i = convertScreenToNDC(x, y, cameraData.width, cameraData.height)
    const r = new Vector3(0, 0, -1).applyQuaternion(cameraData.pose.rotation)
    const c = calculatePostDirection(cameraData, new Vector2(i.x, i.y), 1).normalize()
    const d = r.clone().setY(0).angleTo(c.clone().setY(0))
    const l = Math.asin(c.y - r.y)
    const h = d * Math.sign(i.x)
    const u = l
    return rotateCamera(controls, { xAngle: h, yAngle: u, zAngle: 0, rotationSpeed: (40 * Math.PI) / 180 / 1000 })
  }
  async moveInDirection(direction: DirectionKey) {
    const module = this.engine?.getModuleBySymbolSync(NavigationSymbol)!
    await module.navigateInLocalDirection(DirectionVector[direction])
  }
  async pan(position: { x: number; z: number }) {
    const cameraData = this.engine?.market.getData(CameraData)!
    const controls = this.engine?.getModuleBySymbolSync(ControlsCommonSymbol)!
    const o = cameraData.pose.position
    const s = position.x - o.x
    const i = position.z - o.z
    const r = new Vector2(s, i)
    const c = r.length()
    r.setLength(0.005)
    await controls.startTranslateTransition(c / 0.005, r, !1)
  }
  async rotate(xAngle = 0, yAngle = 0, options?: { speed: number }) {
    const controls = this.engine?.getModuleBySymbolSync(ControlsCommonSymbol)!

    return await rotateCamera(controls, initRotateConfig({ options, xAngle, yAngle }))
  }
  async setRotation(rotation: { x: number; y: number; z: number }, options?: { speed: number }) {
    const controls = this.engine?.getModuleBySymbolSync(ControlsCommonSymbol)!
    const cameraData = this.engine?.market.getData(CameraData)!
    const viewmodeData = this.engine?.market.getData(ViewmodeData)!
    return await orientCamera(cameraData, controls, viewmodeData, initRotateConfig({ xAngle: rotation.x, yAngle: rotation.y, zAngle: rotation.z, options }))
  }
  async zoomTo(zoom: number) {
    const viewmodeData = this.engine?.market.getData(ViewmodeData)!
    const cameraData = this.engine?.market.getData(CameraData)!
    noPanorama(viewmodeData.currentMode!)
    await this.engine?.commandBinder.issueCommand(new ZoomSetCommand(zoom))
    return cameraData.zoom()
  }
  async zoomBy(zoom: number) {
    const viewmodeData = this.engine?.market.getData(ViewmodeData)!
    const cameraData = this.engine?.market.getData(CameraData)!
    noPanorama(viewmodeData.currentMode!)
    await this.engine?.commandBinder.issueCommand(new ZoomInCommand(zoom))
    return cameraData.zoom()
  }
  async zoomReset() {
    const viewmodeData = this.engine?.market.getData(ViewmodeData)!
    noPanorama(viewmodeData.currentMode!)
    await this.engine?.commandBinder.issueCommand(new ZoomResetCommand())
  }
}
