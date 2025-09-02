import { PanoSize, PanoSizeClass, PanoSizeKey, PanoSizeWithKey } from "./const/76609"
import { highQualityConfig } from "./const/quality.const"

export class QualityManager {
  maxCubemapSize: number
  maxNavPanoSize: PanoSize
  maxZoomPanoSize: PanoSize
  overrideWindow: boolean
  navPanoSize: PanoSize
  zoomPanoSize: PanoSize
  defaultMaxNavPanoSize: PanoSize
  resolution: number
  highQualityThreshold: number
  constructor(e, t, i, o) {
    this.maxCubemapSize = e
    this.maxNavPanoSize = t
    this.maxZoomPanoSize = i
    this.overrideWindow = !1
    this.navPanoSize = PanoSize.STANDARD
    this.zoomPanoSize = PanoSize.STANDARD
    this.defaultMaxNavPanoSize = this.maxNavPanoSize
    this.resolution = o
    this.highQualityThreshold = highQualityConfig.windowHeightHighQualityThresholdOverride || highQualityConfig.windowHeightHighQualityThreshold
    this.updateMaximums()
  }
  update(e: { height: number }) {
    this.resolution = e.height
    this.updateMaximums()
  }
  overrideWindowMaximums(e: boolean) {
    this.overrideWindow = e
    this.updateMaximums()
  }
  overrideNavPanoSize(e: PanoSize | null) {
    this.maxNavPanoSize = null != e ? e : this.defaultMaxNavPanoSize
    this.updateMaximums()
  }
  updateMaximums() {
    this.resolution < this.highQualityThreshold && !this.overrideWindow
      ? ((this.navPanoSize = Math.min(QualityManager.getPanoSize(PanoSizeKey.STANDARD), this.maxNavPanoSize)),
        (this.zoomPanoSize = Math.min(QualityManager.getPanoSize(PanoSizeKey.HIGH), this.maxZoomPanoSize)))
      : ((this.navPanoSize = this.maxNavPanoSize), (this.zoomPanoSize = this.maxZoomPanoSize))
    this.zoomPanoSize < this.navPanoSize && (this.navPanoSize = this.zoomPanoSize)
    this.zoomPanoSize = Math.min(this.maxCubemapSize, this.zoomPanoSize)
    this.navPanoSize = Math.min(this.maxCubemapSize, this.navPanoSize)
  }
  static getPanoSize(e: PanoSizeKey) {
    if (e in PanoSizeWithKey) return PanoSizeWithKey[e]
    throw new Error(`Not a panoSizeClass: ${e}`)
  }
  static getPanoSizeClass(e: keyof typeof PanoSizeClass) {
    if (e in PanoSizeClass) return PanoSizeClass[e]
    throw new Error(`Not a valid pano resolution: ${e}`)
  }
  getNavPanoSize() {
    return this.navPanoSize
  }
  getZoomPanoSize() {
    return this.zoomPanoSize
  }
}
