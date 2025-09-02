import * as T from "../const/53203"
import * as l from "../const/66777"
import * as h from "../const/93642"
import * as g from "../math/96042"
import * as p from "../const/14439"
import { ToursMetersPerSecondKey } from "../const/14439"
import { Features360ViewsKey } from "../const/360.const"
import { FeaturesCursorKey } from "../const/cursor.const"
import { KeyboardCode } from "../const/keyboard.const"
import { FeaturesSweepPucksKey } from "../const/sweep.const"
import { DeepLinksSymbol, QuickMenusSymbol, ScanInfoSymbol, SettingsSymbol } from "../const/symbol.const"
import { featuresMattertagsKey } from "../const/tag.const"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import * as r from "./cameraData.module"
import { lookAccelerationKey } from "./panoramaControls.module"
import { TrimFloorKey } from "../const/53203"
import { TransitionTimeConfig } from "../const/66777"
import { clampAndInterpolate, interpolateValue } from "../math/96042"
declare global {
  interface SymbolModule {
    [QuickMenusSymbol]: QuickMenusModule
  }
}
export default class QuickMenusModule extends Module {
  constructor() {
    super(...arguments), (this.name = "quick-menus")
  }
  async init(e, t) {
    ;(this.settingsModule = await t.getModuleBySymbol(SettingsSymbol)),
      (this.scanInfoDataModule = await t.getModuleBySymbol(ScanInfoSymbol)),
      (this.settingsGui = this.settingsModule.getSettingsGui())
    const i = await t.getModuleBySymbol(DeepLinksSymbol),
      n = await t.market.waitForData(SweepsData),
      C = await t.market.waitForData(SettingsData),
      E = await t.market.waitForData(CameraData)
    this.uIndex = this.settingsGui.addPanel("Link to location", [KeyboardCode.U], { allowSubGroups: !1, width: 400, ratio: 90 })
    const D = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, KeyboardCode.O]
    ;(this.oIndex = this.settingsGui.addPanel("Scan Info", D, { allowSubGroups: !1, width: 400, ratio: 75 })),
      (this.pIndex = this.settingsGui.addPanel("Quick settings", [KeyboardCode.P], { allowSubGroups: !1 })),
      this.settingsGui.loadPromise.then(() => {
        this.settingsGui.addControl(this.uIndex, "", "Link", {}),
          this.settingsGui.addButton(this.uIndex, "", "Copy to clipboard", () => {
            const e = document.createElement("input")
            ;(e.type = "text"),
              (e.value = this.buildLink(i)),
              document.body.appendChild(e),
              e.select(),
              document.execCommand("copy"),
              document.body.removeChild(e)
          }),
          this.settingsGui.toggle(this.uIndex),
          this.settingsGui.addControl(this.oIndex, "", "Scan ID", {}),
          this.settingsGui.addControl(this.oIndex, "", "Anchor ID", {}),
          this.settingsGui.addControl(this.oIndex, "", "Created", {}),
          this.settingsGui.addControl(this.oIndex, "", "Time of Day", {}),
          this.settingsGui.addControl(this.oIndex, "", "Alignment", {}),
          this.settingsGui.addControl(this.oIndex, "", "Options", {}),
          this.settingsGui.addControl(this.oIndex, "", "Camera", {}),
          this.settingsGui.addControl(this.oIndex, "", "Camera Types", {}),
          this.settingsGui.addControl(this.oIndex, "", "Sensor Serials", {}),
          this.settingsGui.addControl(this.oIndex, "", "Serial Number", {}),
          this.settingsGui.addControl(this.oIndex, "", "Mount Calibration", {}),
          this.settingsGui.addControl(this.oIndex, "", "Software Version", {}),
          this.settingsGui.addButton(this.oIndex, "", "Copy Scan ID", async () => {
            if (n.currentSweep) {
              const e = await this.scanInfoDataModule.getScanInfo(n.currentSweep)
              if (e) {
                const t = document.createElement("input")
                ;(t.type = "text"), (t.value = e.id), document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t)
              }
            }
          }),
          this.settingsGui.addButton(this.oIndex, "", "Download Scan", async () => {
            if (n.currentSweep) {
              const e = await this.scanInfoDataModule.getScanDownloadURL(n.currentSweep)
              e && window.open(e)
            }
          }),
          this.settingsGui.toggle(this.oIndex)
        const e = h.WI * (180 / Math.PI) * 60
        this.settingsGui.addControl(this.pIndex, "", FeaturesSweepPucksKey, !0),
          this.settingsGui.addControl(this.pIndex, "", Features360ViewsKey, !0),
          this.settingsGui.addControl(this.pIndex, "", featuresMattertagsKey, !0),
          this.settingsGui.addControl(this.pIndex, "", FeaturesCursorKey, !0),
          this.settingsGui.addSlider(this.pIndex, "", TrimFloorKey, T.Kb, 0, 100, 1),
          this.settingsGui.addSlider(this.pIndex, "", lookAccelerationKey, e, 0.25, 10, 2),
          this.settingsGui.addSlider(this.pIndex, "", r.baseTransitionSpeedKey, TransitionTimeConfig.camera.baseTransitionTime, 1, 5e3, 0)
        const t = C.tryGetProperty(ToursMetersPerSecondKey, p.Im)
        this.settingsGui.addSlider(this.pIndex, "", p.WQ, clampAndInterpolate(t), 0.5, 10, 2),
          this.settingsGui.toggle(this.pIndex),
          this.settingsModule.registerSetting("Quick settings", lookAccelerationKey, e, !1),
          this.settingsModule.registerSetting("Quick settings", r.baseTransitionSpeedKey, TransitionTimeConfig.camera.baseTransitionTime, !1),
          this.settingsModule.registerSetting("Quick settings", TrimFloorKey, T.Kb, !1),
          this.settingsGui.onToggle(this.uIndex, e => {
            e && this.settingsGui.updateSetting(this.uIndex, "Link", this.buildLink(i))
          }),
          this.settingsGui.onToggle(this.oIndex, e => {
            e && this.refreshScanInfo(n)
          }),
          E.pose.onChanged(() => {
            this.settingsGui.isLoaded && this.settingsGui.isVisible(this.uIndex) && this.settingsGui.updateSetting(this.uIndex, "Link", this.buildLink(i)),
              this.settingsGui.isLoaded && this.settingsGui.isVisible(this.oIndex) && this.refreshScanInfo(n)
          }),
          C.onPropertyChanged(p.WQ, e => {
            C.setProperty(ToursMetersPerSecondKey, interpolateValue(e))
          })
      })
  }
  refreshScanInfo(e) {
    e.currentSweep
      ? this.scanInfoDataModule.getScanInfo(e.currentSweep).then(e => {
          this.updateScanInfo(e)
        })
      : this.updateScanInfo(void 0)
  }
  updateScanInfo(e) {
    this.settingsGui.updateSetting(this.oIndex, "Scan ID", e ? e.id : ""),
      this.settingsGui.updateSetting(this.oIndex, "Anchor ID", e ? e.anchorId : ""),
      this.settingsGui.updateSetting(this.oIndex, "Created", e ? e.created : ""),
      this.settingsGui.updateSetting(this.oIndex, "Time of Day", e ? e.timeOfDay : ""),
      this.settingsGui.updateSetting(this.oIndex, "Alignment", e ? e.alignment : ""),
      this.settingsGui.updateSetting(this.oIndex, "Options", e ? JSON.stringify(e.options) : ""),
      this.settingsGui.updateSetting(this.oIndex, "Camera", e ? `${e.camera.vendor} ${e.camera.model}` : ""),
      this.settingsGui.updateSetting(this.oIndex, "Camera Types", e ? JSON.stringify(e.camera.cameraTypes) : ""),
      this.settingsGui.updateSetting(this.oIndex, "Sensor Serials", e ? JSON.stringify(e.camera.sensorSerialNumbers) : ""),
      this.settingsGui.updateSetting(this.oIndex, "Serial Number", e ? e.camera.serialNumber : ""),
      this.settingsGui.updateSetting(this.oIndex, "Mount Calibration", e ? e.camera.mountCalibrationVersion : ""),
      this.settingsGui.updateSetting(this.oIndex, "Software Version", e ? e.camera.softwareVersion : "")
  }
  buildLink(e) {
    return decodeURIComponent(e.creator.createDeepLink().href)
  }
}
