import { PerspectiveCamera } from "three"
import { ChangeViewmodeCommand, NotifyActivityAnalytic, ViewModeCommand } from "../command/viewmode.command"
import { RequestRenderTargetCommand, SetChunkRenderModeCommand } from "../command/webgl.command"
import { TransitionTypeList } from "../const/64918"
import { RttSymbol, ScreenshotsSymbol, SettingsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { RenderLayer, RenderLayers } from "../core/layers"
import { Module } from "../core/module"
import { CanvasData } from "../data/canvas.data"
import { ViewmodeData } from "../data/viewmode.data"
import { downloadFlies } from "../utils/browser.utils"
import { imageDataToBlob, SceneCapture } from "../utils/image.utils"
import { ViewModes } from "../utils/viewMode.utils"
import RenderToTextureModule, { RenderTarget } from "./renderToTexture.module"
import SettingsModule from "./settings.module"
import WebglRendererModule from "./webglrender.module"
declare global {
  interface SymbolModule {
    [ScreenshotsSymbol]: ScreenshotsModule
  }
}
export default class ScreenshotsModule extends Module {
  capturer: Capturer
  engine: EngineContext
  settingsModule: SettingsModule
  canvas: CanvasData
  renderer: WebglRendererModule
  renderToTexture: RenderToTextureModule
  renderTarget: RenderTarget
  constructor() {
    super(...arguments), (this.name = "screenshots-module"), (this.capturer = new Capturer())
  }
  async init(e, t: EngineContext) {
    this.engine = t
    ;[this.settingsModule, this.canvas, this.renderer, this.renderToTexture] = await Promise.all([
      t.getModuleBySymbol(SettingsSymbol),
      t.market.waitForData(CanvasData),
      t.getModuleBySymbol(WebglRendererSymbol),
      t.getModuleBySymbol(RttSymbol)
    ])
    this.settingsModule.registerButton("Debug", "Take screenshot", async () => {
      const e = Date.now()
      await this.takeAndDownloadScreenshot({ height: this.canvas.height, width: this.canvas.width }, `image_${e}.jpg`, RenderLayers.ALL)
    })
    this.settingsModule.registerButton("Debug", "Take 4k screenshot", async () => {
      const e = Date.now()
      await this.takeAndDownloadScreenshot({ height: 2304, width: 4096 }, `image_${e}.jpg`, RenderLayers.ALL)
    })
    this.settingsModule.registerButton("Debug", "Take 8k screenshot", async () => {
      const e = Date.now()
      await this.takeAndDownloadScreenshot({ height: 4608, width: 8192 }, `image_${e}.jpg`, RenderLayers.ALL)
    })
    this.settingsModule.registerButton("Debug", "Take 16k screenshot", async () => {
      const e = Date.now()
      await this.takeAndDownloadScreenshot({ height: 9000, width: 16000 }, `image_${e}.jpg`, RenderLayers.ALL)
    })
    this.settingsModule.registerButton("Debug", "Take FB 3D screenshot", async () => {
      const e = Date.now()
      const t = this.engine.getRenderLayer("model-mesh")
      const i = this.engine.getRenderLayer("skybox")
      const n = t.clone()
      n.addLayers(i)
      const s = (await this.engine.market.waitForData(ViewmodeData)).currentMode
      try {
        await this.takeAndDownloadScreenshot({ height: this.canvas.height, width: this.canvas.width }, `image_${e}.jpg`, n),
          await this.engine.commandBinder.issueCommand(new SetChunkRenderModeCommand(SetChunkRenderModeCommand.modes.Depth)),
          await this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.MESH, TransitionTypeList.Instant)),
          await this.takeAndDownloadScreenshot(
            { height: Math.floor(this.canvas.height / 4), width: Math.floor(this.canvas.width / 4) },
            `image_${e}_depth.jpg`,
            t
          )
      } catch (e) {
        throw (this.log.error("Could not take screenshot"), e)
      } finally {
        await this.engine.commandBinder.issueCommand(new SetChunkRenderModeCommand(null))
        await this.engine.commandBinder.issueCommand(new ChangeViewmodeCommand(NotifyActivityAnalytic[s || ViewModes.Panorama]))
      }
    })
  }
  async takeAndDownloadScreenshot(e: { width: number; height: number }, t: string, i: RenderLayer) {
    this.renderTarget || (this.renderTarget = await this.engine.commandBinder.issueCommandWhenBound(new RequestRenderTargetCommand()))
    const n = await this.capturer.capture(i, e, this.renderer, this.renderToTexture, this.renderTarget)
    downloadFlies(imageDataToBlob(n), t)
  }
  async takeScreenshot(e: { width: number; height: number }, i: RenderLayer) {
    this.renderTarget || (this.renderTarget = await this.engine.commandBinder.issueCommandWhenBound(new RequestRenderTargetCommand()))
    return await this.capturer.capture(i, e, this.renderer, this.renderToTexture, this.renderTarget)
  }
}
class Capturer {
  captureCamera: PerspectiveCamera
  constructor() {
    this.captureCamera = new PerspectiveCamera()
  }
  async capture(e: RenderLayer, t: { width: number; height: number }, i: WebglRendererModule, n: RenderToTextureModule, s: RenderTarget) {
    const { camera, scene } = i.getScene()
    camera.getWorldPosition(this.captureCamera.position)
    camera.getWorldQuaternion(this.captureCamera.quaternion)
    this.captureCamera.projectionMatrix.copy(camera.projectionMatrix)
    this.captureCamera.layers.mask = e.mask
    s.setSize(Math.floor(t.width), Math.floor(t.height))
    n.render(s.target, scene, this.captureCamera)
    return await SceneCapture(s)
  }
}
