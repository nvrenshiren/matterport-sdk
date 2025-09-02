import { createElement } from "react"
import { Root, createRoot } from "react-dom/client"
import * as i from "../other/26837"
import { ErrorUISymbol, LocaleSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import LocaleModule from "./locale.module"
import { ErrorUI } from "../other/26837"
const l = "UdAIz89AxFx_htVI1gVZY"
declare global {
  interface SymbolModule {
    [ErrorUISymbol]: ErrorGuiModule
  }
}
export default class ErrorGuiModule extends Module {
  errorCode: string | null
  apiHost: string
  container: HTMLElement
  localeModule: LocaleModule
  reactContainer: HTMLDivElement
  reactRoot: Root
  constructor() {
    super(...arguments)
    this.name = "error-gui"
    this.errorCode = null
  }
  async init({ container, apiHost }, n: EngineContext) {
    this.apiHost = apiHost
    this.container = container
    this.localeModule = await n.getModuleBySymbol(LocaleSymbol)
    this.reactContainer = document.createElement("div")
    this.reactContainer.id = "error-container"
    this.reactContainer.dataset.testid = "error-gui"
    this.reactContainer.classList.add(l)
    this.reactRoot = createRoot(this.reactContainer)
  }
  get currentErrorCode() {
    return this.errorCode
  }
  showError(e: string) {
    this.errorCode = e
    const t = this.localeModule.t.bind(this.localeModule)
    this.container.appendChild(this.reactContainer)
    this.reactRoot.render(
      createElement(ErrorUI, {
        errorCode: e,
        t: t,
        apiHost: this.apiHost
      })
    )
  }
  hideError() {
    this.errorCode = null
    this.container.removeChild(this.reactContainer)
    this.reactRoot.unmount()
  }
}
