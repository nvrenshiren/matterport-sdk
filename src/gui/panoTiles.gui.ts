import { Quaternion, Vector3 } from "three"
import { MoveToSweepCommand } from "../command/navigation.command"
import { TransitionTypeList } from "../const/64918"
import { PanoSymbol, SettingsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import Engine from "../core/engine"
import { CameraData } from "../data/camera.data"
import { PointerData } from "../data/pointer.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { getRotationQuaternion } from "../math/81729"
import { SweepObject } from "../object/sweep.object"
import { MapListHelper } from "../utils/mapList.utils"
import { GUIDraw } from "../webgl/gui.draw"
import { DirectionVector } from "../webgl/vector.const"
import { TileDownloader, TilePrioritizer } from "../modules/sweepPanoTiling.module"
import { ISubscription } from "../core/subscription"

const debug = new DebugInfo("previs")
export class PanoPreloadVisualizer {
  engine: Engine
  downloadDescriptorGetter: TileDownloader
  prioritizer: TilePrioritizer
  allPreloadedSweeps: Set<string>
  active: boolean
  freezeCameraRotation: boolean
  sweepIndex: number
  useCurrentCriteria: boolean
  showPreloadIds: boolean
  visualTour: boolean
  showSweepLabels: boolean
  draw: GUIDraw
  subscription: ISubscription
  sweepData: SweepsData
  sweepMap: MapListHelper<any>
  tourMode: boolean
  criteria: any
  lastCriteria: any
  constructor(e: Engine, t: TileDownloader, i: TilePrioritizer) {
    this.engine = e
    this.downloadDescriptorGetter = t
    this.prioritizer = i
    this.allPreloadedSweeps = new Set()
    this.active = !1
    this.freezeCameraRotation = !1
    this.sweepIndex = 50
    this.useCurrentCriteria = !0
    this.showPreloadIds = !0
    this.visualTour = !1
    this.showSweepLabels = !1
    this.draw = new GUIDraw()
    this.engine.getModuleBySymbol(WebglRendererSymbol).then(e => this.draw.addToScene(e.getScene()))
    this.engine.market.waitForData(PointerData).then(e => {
      this.subscription = e.onChanged(() => this.update(this.draw))
      this.subscription.cancel()
    })
    const s = this.engine.market.tryGetData(SweepsData)
    if (s) {
      this.sweepData = s
      const e = s.getSweepList()
      const t = new MapListHelper(e => e.id)
      for (let i of e) i.isObservableProxy && (i = new SweepObject().copy(i)), t.add(i)
      this.sweepMap = t
    }
    this.engine.getModuleBySymbol(SettingsSymbol).then(e => {
      const t = "Pano Preload"
      const i = [
        { header: t, setting: "ShowVis", initialValue: () => this.active, onChange: e => this.toggle(e) },
        {
          header: t,
          setting: "Use Camera",
          initialValue: () => this.useCurrentCriteria,
          onChange: e => {
            this.useCurrentCriteria = e
            this.update(this.draw)
          }
        },
        {
          header: t,
          setting: "Freeze Rotation",
          initialValue: () => this.freezeCameraRotation,
          onChange: e => {
            this.freezeCameraRotation = e
            this.update(this.draw)
          }
        },
        {
          header: t,
          setting: "Show preload ids",
          initialValue: () => this.showPreloadIds,
          onChange: e => {
            this.showPreloadIds = e
            this.update(this.draw)
          }
        },
        {
          header: t,
          setting: "Visual tour",
          initialValue: () => this.visualTour,
          onChange: e => {
            this.visualTour = e
            this.update(this.draw)
          }
        },
        {
          header: t,
          setting: "Pano labels",
          initialValue: () => this.showSweepLabels,
          onChange: e => {
            this.showSweepLabels = e
            this.update(this.draw)
          }
        },
        { header: t, setting: "Override Sweep", initialValue: () => 0, onChange: e => this.updateSweepIndex(e), range: [0, this.sweepMap.count()] }
      ]
      e.registerMenuButton({
        header: "Pano Preload tour",
        buttonName: "Tour",
        callback: () => {
          this.activateTourMode()
        }
      })
      i.forEach(t => e.registerMenuEntry(t))
    })
  }
  updateSweepIndex(e: number) {
    const t = Math.round(e)
    this.sweepIndex = t
    this.update(this.draw)
  }
  toggle(e: boolean) {
    this.active !== e && (e && this.subscription.renew(), e || (this.subscription.cancel(), this.draw.toggleAll(!1)), (this.active = e))
  }
  update(e: GUIDraw) {
    const t = this.engine.market.tryGetData(SweepsData)
    const i = this.engine.market.tryGetData(CameraData)
    const s = this.engine.market.tryGetData(ViewmodeData)
    if (!(e && t && i && s)) return
    if (!this.active || !this.sweepMap) return
    if (this.tourMode && !this.visualTour) return
    const n = t.getSweepList()
    const o = this.useCurrentCriteria ? this.prioritizer.priorityCriteria : this.criteria
    if (this.useCurrentCriteria) {
      if (this.freezeCameraRotation) {
        if (!o.sweep) return
        o.set({
          position: o.sweep.position,
          rotation: this.lastCriteria?.rotation,
          direction: DirectionVector.FORWARD.clone().applyQuaternion(this.lastCriteria?.rotation || new Quaternion())
        })
      }
    } else if ((o.set({ sweep: this.sweepData.getSweepByIndex(this.sweepIndex) || null }), !this.freezeCameraRotation)) {
      if (!o.sweep) return
      o.set({ position: o.sweep.position, rotation: i.pose.rotation, direction: DirectionVector.FORWARD.clone().applyQuaternion(i.pose.rotation) })
    }
    this.lastCriteria = o.clone()
    if (!o.sweep) return
    this.tourMode || this.wipePreloadedData()
    const a: ReturnType<TileDownloader["buildDownloadDescriptorArray"]> = []
    this.prioritizer.priorityCriteria = o
    this.prioritizer.filterAndPrioritize(a, this.downloadDescriptorGetter)
    const r = new Set()
    let l = ""
    for (const e of a) {
      e &&
        e.sweep &&
        (r.has(e.sweep.id) || (r.add(e.sweep.id), (l += `${e.sweep.index}, `)),
        this.allPreloadedSweeps.has(e.sweep.id) || this.allPreloadedSweeps.add(e.sweep.id))
    }

    const u = new Vector3(0, 0, -1.5).applyQuaternion(i.pose.rotation)
    const f = new Vector3().copy(i.pose.position).add(u)
    const m = `Current Pano: ${o.sweep.index}\n    ${this.showPreloadIds ? `Panos: ${l}` : ""}\n    Preload Count (this pano): ${r.size}\n    Total Preloaded: ${this.allPreloadedSweeps.size}`
    const w = e.label("infoLabel", m, f, 0.1)
    w.lookAt(i.pose.position)
    w.setPosition(f)
    w.text = m
    this.drawSweepSpheres(r, o)
    if (this.showSweepLabels) {
      for (const t of n) {
        const s = `${t.index}`
        const n = e.label(t.id, s, t.position, 0.1)
        n.text = s
        n.setColor(16711680)
        n.lookAt(i.pose.position)
      }
    }
  }
  drawSweepSpheres(e, t) {
    const i = t.sweep
    if (!i) return
    this.draw.toggleAll(!1)
    const s = new Vector3().copy(i.position)
    s.y += -0.5
    for (const t of e) {
      const e = this.sweepData.getSweep(t),
        n = i === e,
        o = n ? "green" : "white",
        a = new Vector3().copy(e.position)
      if (
        ((a.y += -0.5),
        this.draw
          .sphere(e.id + "sphere" + (n && "source"), { color: o, opacity: 1 })
          .update(a, 0.2)
          .toggle(!0),
        !n)
      ) {
        const t = this.draw.line(`${e.id}-${i.id}`, "white", 0.05)
        t.updatePositions(a, s), t.toggle(!0)
      }
    }
  }
  activateTourMode() {
    this.tourMode = !0
    const e = {}
    const t = Math.round(this.sweepIndex)
    const i = this.sweepData.getSweepByIndex(t)
    i &&
      this.engine.commandBinder.issueCommand(new MoveToSweepCommand({ sweep: i.id })).then(() => {
        this.wipePreloadedData(), this.allPreloadedSweeps.clear()
        const t = this.sweepData.getSweepList(),
          s = Math.round(0.05 * t.length)
        i && this.tourStep(i, e, s)
      })
  }
  tourStep(e, t, i, s = 0, n = "") {
    const o = e,
      a = this.sweepData.getSweepList()
    let r = e
    if (!o || o.neighbours.length <= 0) return
    ;(t[o.id] = !0), (n += `Sweep: ${o.index} Loaded: ${this.allPreloadedSweeps.size}\n`)
    let c = 0
    for (; c < a.length; ) {
      const e = (o.index + 1 + c) % a.length,
        i = this.sweepData.getSweepByIndex(e)
      if ((c++, i && ((r = i), !t[r.id] && r.id !== o.id && r))) break
    }
    if (++s <= i)
      if (this.visualTour)
        this.engine.commandBinder
          .issueCommand(
            new MoveToSweepCommand({ sweep: o.id, rotation: getRotationQuaternion(o.position, r.position), transition: TransitionTypeList.Interpolate })
          )
          .then(() => {
            setTimeout(() => {
              this.tourStep(r, t, i, s, n)
            }, 500)
          })
      else {
        const e = getRotationQuaternion(o.position, r.position),
          a = new Vector3().copy(DirectionVector.FORWARD).applyQuaternion(e),
          c = this.prioritizer.priorityCriteria.clone()
        c.set({ direction: a, rotation: e, sweep: o, position: o.position })
        const l: ReturnType<TileDownloader["buildDownloadDescriptorArray"]> = []
        this.prioritizer.priorityCriteria = c
        this.prioritizer.filterAndPrioritize(l, this.downloadDescriptorGetter)
        this.queueToPanoSet(l).forEach(e => this.allPreloadedSweeps.add(e)), this.tourStep(r, t, i, s, n)
      }
    else
      debug.info(`TOUR END\n      Sweeps visited: ${s}\n      Visual: ${this.visualTour}\n      Sweeps preloaded: ${this.allPreloadedSweeps.size}`),
        debug.info(`TOUR INFO\n      ${n}`),
        (this.tourMode = !1)
  }
  queueToPanoSet(e: ReturnType<TileDownloader["buildDownloadDescriptorArray"]>) {
    const t = new Set<string>()
    for (const i of e) i && i.sweep && (t.has(i.sweep.id) || t.add(i.sweep.id))
    return t
  }
  wipePreloadedData() {
    const e = this.sweepData.getSweepList()
    for (const t of e) this.downloadDescriptorGetter.deleteAllTileDownloadDescriptors(t.id)
  }
}
export default (e: Engine) => {
  e.getModuleBySymbol(PanoSymbol).then(t => {
    const i = t
    "tileDownloader" in i && new PanoPreloadVisualizer(e, i.tileDownloader, i.tilePrioritizer)
  })
}
