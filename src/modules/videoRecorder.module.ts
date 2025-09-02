import { createSimpleResizeDimensions } from "../other/38319"
import { ResizeCanvasCommand, ResizeProperty } from "../command/screen.command"
import { TourStartCommand } from "../command/tour.command"
import { CanvasSymbol, SettingsSymbol, VideoSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { NullGeneratorResult } from "../core/engineGenerators"
import { Module } from "../core/module"
import { TourStoppedMessage } from "../message/tour.message"
import { downloadFlies } from "../utils/browser.utils"
import CanvasModule from "./canvas.module"
import SettingsModule from "./settings.module"
import WebMWriter from "webm-writer"
declare global {
  interface SymbolModule {
    [VideoSymbol]: VideoRecorderModule
  }
}

class FrostMage {
  _dateNow: () => number
  _performanceNow: () => DOMHighResTimeStamp
  nowOverride: number
  fps: any
  constructor() {
    this._dateNow = Date.now
    this._performanceNow = performance.now
    this.nowOverride = 0
  }
  slowTime(t) {
    this.fps = t
    this.nowOverride = Date.now()
    Date.now = () => this.nowOverride
    performance.now = () => this.nowOverride
  }
  tick() {
    this.nowOverride += 1000 / this.fps
  }
  resetTime() {
    Date.now = this._dateNow
    performance.now = this._performanceNow
  }
}
enum RecorderState {
  RECORDING = 1,
  STOPPED = 0
}
export default class VideoRecorderModule extends Module {
  state: RecorderState
  frostMage: FrostMage
  settingsModule: SettingsModule
  canvasModule: CanvasModule
  engine: EngineContext
  encoder: any
  constructor() {
    super(...arguments)
    this.name = "video-recorder-module"
    this.state = RecorderState.STOPPED
    this.frostMage = new FrostMage()
  }
  async init(t, e: EngineContext) {
    this.settingsModule = await e.getModuleBySymbol(SettingsSymbol)
    this.canvasModule = await e.getModuleBySymbol(CanvasSymbol)
    this.engine = e
    this.settingsModule.registerButton("Tour Recorder (Chrome Only)", "Download 1080p @ 60", () => {
      this.state === RecorderState.STOPPED && this.record(1920, 1080, 60)
    })
    this.settingsModule.registerButton("Tour Recorder (Chrome Only)", "Download 720p @ 30", () => {
      this.state === RecorderState.STOPPED && this.record(1280, 720, 30)
    })
    this.settingsModule.registerButton("Tour Recorder (Chrome Only)", "Download instagram", () => {
      this.state === RecorderState.STOPPED && this.record(1080, 1080, 30)
    })
    this.settingsModule.registerButton("Tour Recorder (Chrome Only)", "Download instagram story", () => {
      this.state === RecorderState.STOPPED && this.record(1080, 1920, 30)
    })
    this.settingsModule.registerButton("Tour Recorder (Chrome Only)", "Stop & download current", () => {
      this.state === RecorderState.RECORDING && this.stop()
    })
  }
  async record(t, e, s) {
    if (this.state !== RecorderState.STOPPED) return void this.log.warn("Can't start recording... we're already recording!")
    this.log.info("Starting recording of tour. Now is a good time to get a coffee :)")
    this.state = RecorderState.RECORDING
    this.encoder = new WebMWriter({ quality: 0.95, frameRate: s })
    this.frostMage.slowTime(s)
    await this.engine.commandBinder.issueCommand(
      new ResizeCanvasCommand({
        resizeDimensions: [
          { property: ResizeProperty.width, setDimension: t, duration: 0 },
          { property: ResizeProperty.height, setDimension: e, duration: 0 }
        ]
      })
    )
    await this.engine.commandBinder.issueCommand(new TourStartCommand())
    const o = this.engine.subscribe(TourStoppedMessage, () => {
      o.cancel(), this.state === RecorderState.RECORDING && this.stop()
    })
    const h = this
    const l = this.canvasModule.element
    this.engine.startGenerator(function* () {
      for (; h.state === RecorderState.RECORDING; ) {
        h.encoder.addFrame(l)
        yield new NullGeneratorResult()
        h.frostMage.tick()
        yield new NullGeneratorResult()
      }
    })
  }
  async stop() {
    if (this.state !== RecorderState.RECORDING) return void this.log.warn("Can't stop recording, we weren't recording at all")
    this.frostMage.resetTime()
    this.state = RecorderState.STOPPED
    await this.engine.commandBinder.issueCommand(new ResizeCanvasCommand(createSimpleResizeDimensions(0)))
    this.log.info("Encoding tour to video...")
    const t = await this.encoder.complete()
    this.log.info("Tour encoded! Prompting user to download.")
    downloadFlies(t, "tour.webm")
  }
}
