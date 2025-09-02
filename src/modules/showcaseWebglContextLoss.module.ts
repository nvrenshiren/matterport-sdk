import { ErrorText } from "../other/26837"
import { AnalyticsSymbol, ErrorUISymbol, WebglContextLossSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { WebglRendererContextLostMessage, WebglRendererContextRestoredMessage } from "../message//webgl.message"
declare global {
  interface SymbolModule {
    [WebglContextLossSymbol]: ShowcaseWebglContextLossModule
  }
}
export default class ShowcaseWebglContextLossModule extends Module {
  contextLostEvent: any
  framesWithLostContext: number
  config: any
  engine: EngineContext
  constructor() {
    super(...arguments)
    this.name = "JMYDCase-webgl-context-loss"
    this.contextLostEvent = null
    this.framesWithLostContext = 0
  }
  async init(e, t: EngineContext) {
    this.config = e
    this.engine = t
    this.bindings.push(
      t.subscribe(WebglRendererContextLostMessage, e => {
        this.contextLostEvent = e.event
      }),
      t.subscribe(WebglRendererContextRestoredMessage, () => {
        this.contextLostEvent = null
        this.framesWithLostContext = 0
        t.getModuleBySymbol(ErrorUISymbol).then(e => {
          e.currentErrorCode === ErrorText.WEBGL_CONTEXT_LOST && e.hideError()
        })
      })
    )
  }
  onUpdate(e) {
    const { contextLostEvent } = this
    if (contextLostEvent) {
      if (++this.framesWithLostContext === this.config.notificationDelayFrames) {
        this.engine.getModuleBySymbol(ErrorUISymbol).then(e => {
          e.currentErrorCode || e.showError(ErrorText.WEBGL_CONTEXT_LOST)
        })
      }
    }
  }
}
