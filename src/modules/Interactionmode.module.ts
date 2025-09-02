import { InputPointerType } from "../const/41927"
import { InteractionMode, InteractionSource } from "../const/57053"
import { InputSymbol, InteractionSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { InteractionData } from "../data/interaction.data"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { OnMouseDownEvent } from "../events/mouse.event"
import { InteractionModeChangedMessage, UpdateSourceMessage } from "../message/interaction.message"
import { isMobilePhone } from "../utils/browser.utils"
import EngineContext from "../core/engineContext"
import { WebGLRenderer } from "three"

declare global {
  interface SymbolModule {
    [InteractionSymbol]: InteractionmodeModule
  }
}
export default class InteractionmodeModule extends Module {
  data: InteractionData
  engine: EngineContext
  renderer: WebGLRenderer
  onPointerButtonEvent: (e) => void
  onKeyEvent: (e) => void
  mobileBrowser: boolean

  constructor() {
    super(...arguments)
    this.name = "interactionmode"
    this.onPointerButtonEvent = e => {
      let t = this.data.source
      switch (e.device) {
        case InputPointerType.TOUCH:
          t = InteractionSource.Touch
          break
        case InputPointerType.MOUSE:
          t = InteractionSource.Mouse
          break
        case InputPointerType.PEN:
          t = InteractionSource.Pen
          break
        case InputPointerType.GAMEPAD:
          this.renderer.xr.enabled && this.renderer.xr.isPresenting && (t = InteractionSource.XRController)
          break
        default:
          this.log.debug("source:", e.device, e)
      }
      this.updateSource(t)
    }
    this.onKeyEvent = () => {
      this.updateSource(InteractionSource.Key)
    }
  }

  async init(e, t: EngineContext) {
    this.engine = t
    this.data = new InteractionData()
    this.mobileBrowser = isMobilePhone()
    const i = await t.getModuleBySymbol(WebglRendererSymbol)
    this.renderer = i.threeRenderer
    this.updateMode(this.getInteractionMode(), this.data.mode)
    this.engine.market.register(this, InteractionData, this.data)
    t.getModuleBySymbol(InputSymbol).then(e => {
      this.bindings.push(e.registerHandler(OnMouseDownEvent, this.onPointerButtonEvent), e.registerHandler(KeyboardCallbackEvent, this.onKeyEvent))
    })
  }

  onUpdate(e) {
    const t = this.getInteractionMode()
    this.updateMode(t, this.data.mode)
  }

  getInteractionMode() {
    if (this.renderer.xr.enabled && this.renderer.xr.isPresenting) {
      const e = this.renderer.xr.getSession()
      if (e && e.inputSources.length > 0)
        switch (e.inputSources[0].targetRayMode) {
          case "gaze":
          case "screen":
            return InteractionMode.VrOrientOnly
          case "tracked-pointer":
            return InteractionMode.VrWithTrackedController
        }
      return InteractionMode.VrOrientOnly
    }
    return this.mobileBrowser ? InteractionMode.Mobile : InteractionMode.Desktop
  }

  updateMode(e, t) {
    e !== this.data.mode && (this.data.updateMode(e), this.data.commit(), this.engine.broadcast(new InteractionModeChangedMessage(this.data.mode, t)))
  }

  updateSource(e) {
    e !== this.data.source && (this.data.updateSource(e), this.data.commit(), this.engine.broadcast(new UpdateSourceMessage(this.data.source)))
  }
}
