import * as c from "../68512"
import { ScanInfoSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { ObservableObject } from "../observable/observable.object"
declare global {
  interface SymbolModule {
    [ScanInfoSymbol]: ScaninfoDataModule
  }
}
class a extends ObservableObject {
  equals(t) {
    return this.id === t.id
  }
  copy(t) {
    return (
      (this.id = t.id),
      (this.name = t.name),
      (this.vendor = t.vendor),
      (this.model = t.model),
      (this.captureMode = t.captureMode),
      (this.depthCameraType = t.depthCameraType),
      (this.cameraTypes = t.cameraTypes.slice()),
      (this.sensorSerialNumbers = t.sensorSerialNumbers.slice()),
      (this.serialNumber = t.serialNumber),
      (this.mountCalibrationVersion = t.mountCalibrationVersion),
      (this.softwareVersion = t.softwareVersion),
      this
    )
  }
}
class r extends ObservableObject {
  constructor(t) {
    super(),
      t &&
        (t.id && (this.id = t.id),
        void 0 !== t.index && (this.index = t.index),
        (this.name = t.name || ""),
        (this.created = t.created || ""),
        (this.alignment = t.alignment || ""),
        (this.options = t.options || []),
        (this.camera = t.camera || new a()))
  }
  equals(t) {
    return this.id === t.id
  }
  copy(t) {
    return (
      (this.id = t.id),
      (this.index = t.index),
      (this.name = t.name),
      (this.created = t.created),
      (this.alignment = t.alignment),
      (this.options = t.options.slice()),
      (this.camera = new a().copy(t.camera)),
      this
    )
  }
}
const h = new DebugInfo("mds-scaninfo-serializer")
class d {
  deserialize(t) {
    if (!t || !this.validate(t)) return h.debug("Deserialized invalid ScanInfo data from MDS", t), null
    const e = t,
      i = new r()
    ;(i.id = e.id),
      (i.anchorId = (e.anchor && e.anchor.id) || ""),
      (i.index = e.index || -1),
      (i.name = e.name || ""),
      (i.created = e.created || ""),
      (i.alignment = e.alignment || ""),
      (i.url = e.url || ""),
      (i.timeOfDay = e.timeOfDay || ""),
      (i.options = e.options || [])
    const s = e.camera
    return (
      (i.camera = new a()),
      (i.camera.id = (s && s.id) || ""),
      (i.camera.name = (s && s.name) || ""),
      (i.camera.vendor = (s && s.vendor) || ""),
      (i.camera.model = (s && s.model) || ""),
      (i.camera.captureMode = (s && s.captureMode) || ""),
      (i.camera.depthCameraType = (s && s.depthCameraType) || ""),
      (i.camera.cameraTypes = ((null == s ? void 0 : s.cameraTypes) || []).filter(t => t)),
      (i.camera.sensorSerialNumbers = ((null == s ? void 0 : s.sensorSerialNumbers) || []).filter(t => t)),
      (i.camera.serialNumber = (s && s.serialNumber) || ""),
      (i.camera.mountCalibrationVersion = (null == s ? void 0 : s.mountCalibrationVersion) ? s.mountCalibrationVersion : void 0),
      (i.camera.softwareVersion = (s && s.softwareVersion) || ""),
      i
    )
  }
  validate(t) {
    if (!t) return !1
    return ["id"].every(e => e in t)
  }
}
class u {}
class p extends MdsStore {
  constructor() {
    super(...arguments), (this.deserializer = new d())
  }
  async fetch() {
    //pw
    // const t = this.getViewId()
    // return this.query(c.GetScans, { modelId: t }, { fetchPolicy: "no-cache" }).then(t => {
    //   var e, i, s
    //   const n =
    //       (null === (s = null === (i = null === (e = t.data) || void 0 === e ? void 0 : e.model) || void 0 === i ? void 0 : i.assets) || void 0 === s
    //         ? void 0
    //         : s.scans) || [],
    //     o = {},
    //     a = {}
    //   for (const t of n) {
    //     const e = this.deserializer.deserialize(t)
    //     e && ((o[e.id] = e), e.anchorId && (a[e.anchorId] = e))
    //   }
    //   const r = new u()
    //   return (r.scansById = o), (r.scansByAnchor = a), r
    // })
    return
  }
  async read() {
    return this.scans || (this.scans = this.fetch()), this.scans
  }
  async refresh() {
    return (this.scans = this.fetch()), this.scans
  }
}
export default class ScaninfoDataModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "scaninfo-data"),
      (this.getScanInfo = t => this.store.read().then(e => (e ? e.scansByAnchor[t] : void 0))),
      (this.getScanDownloadURL = t =>
        this.store.refresh().then(e => {
          if (e) {
            const i = e.scansByAnchor[t]
            return i ? i.url : void 0
          }
        }))
  }
  async init(t, e) {
    const i = await e.market.waitForData(LayersData)
    this.store = new p({ context: i.mdsContext, readonly: !0 })
  }
}
