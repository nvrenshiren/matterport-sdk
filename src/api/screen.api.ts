import { ChangeViewmodeCommand, NotifyActivityAnalytic, ViewModeCommand } from "../command/viewmode.command"
import { SetChunkRenderModeCommand } from "../command/webgl.command"
import { TransitionTypeList } from "../const/64918"
import { ModelMeshSymbol, ScreenshotsSymbol } from "../const/symbol.const"
import Engine from "../core/engine"
import { RenderLayers } from "../core/layers"
import { PointerData } from "../data/pointer.data"
import { ViewmodeData } from "../data/viewmode.data"
import { ViewModes } from "../utils/viewMode.utils"

export class ScreenInterface {
  engine: Engine | null = null
  constructor() {}
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {}
  //截图
  takeScreenshot(options: { width: number; height: number }, showConfig = { measurements: !0, mattertags: !0, sweeps: !0, views: !0 }) {
    const layer = RenderLayers.ALL
    showConfig.mattertags || layer.removeLayers(this.engine!.getRenderLayer("pins"))
    showConfig.measurements || layer.removeLayers(this.engine!.getRenderLayer("measurements"))
    showConfig.sweeps || layer.removeLayers(this.engine!.getRenderLayer("sweep-pucks"))
    showConfig.views ||
      (layer.removeLayers(this.engine!.getRenderLayer("sweep-portal-mesh")), layer.removeLayers(this.engine!.getRenderLayer("sweep-pin-mesh")))
    return this.engine?.getModuleBySymbolSync(ScreenshotsSymbol)?.takeScreenshot(options, layer)
  }
  takeScreenshotModel(options: { width: number; height: number }) {
    const t = this.engine!.getRenderLayer("model-mesh")
    const i = this.engine!.getRenderLayer("skybox")
    const n = t.clone()
    n.addLayers(i)
    return this.engine?.getModuleBySymbolSync(ScreenshotsSymbol)?.takeScreenshot(options, n)
  }

  //获取鼠标屏幕位置
  get pointerScreenPosition() {
    return this.engine?.market.tryGetData(PointerData)?.pointerScreenPosition
  }
  get sceneModelMesh() {
    const modelMesh = this.engine?.getModuleBySymbolSync(ModelMeshSymbol)
    return Array.from(modelMesh?.meshes.values() || []).map(n => ({ box: n.modelMesh.boundingBox, center: n.modelMesh.center }))
  }
}
