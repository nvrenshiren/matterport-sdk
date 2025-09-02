import { getValFromURL } from "../utils/urlParams.utils"
export const tilingPreloadQualityKey = "settings/tiling/preload_quality"
export const highQualityConfig = Object.freeze({
  overlayStyle: getValFromURL("tileoverlay", 0),
  uploadIntervalDelay: 50,
  highResUploadsPerFrame: 2,
  maxHighResUploadsPerFrame: 100,
  loadIndicatorDelay: 300,
  uploadsPerFrame: 6,
  maxUploadsPerFrame: 100,
  windowHeightHighQualityThreshold: 800,
  windowHeightHighQualityThresholdOverride: getValFromURL("threshold2k", void 0),
  concurrentDownloads: 3,
  maxConcurrentDownloads: 12,
  navigation: {
    directionFactor: 10,
    distanceFactor: -1
  }
})
export class PanoTilingSettings {
  downloadFullPano: boolean
  concurrentDownloads: number
  uploadsPerFrame: number
  highResUploadsPerFrame: number
  constructor() {
    this.reset()
  }
  reset() {
    this.downloadFullPano = !1
    this.concurrentDownloads = highQualityConfig.concurrentDownloads
    this.uploadsPerFrame = highQualityConfig.uploadsPerFrame
    this.highResUploadsPerFrame = highQualityConfig.highResUploadsPerFrame
  }
}
