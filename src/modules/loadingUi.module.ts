import { ExpandAppCommand, StartApplicationCommand } from "../command/application.command"
import { ShowcaseStartCommand, ShowcaseStopCommand } from "../command/showcase.command"
import { PhraseKey } from "../const/phrase.const"
import { brandingEnabledKey, discoverSpaceUrlKey, presentationMlsModeKey, presentationTitleKey } from "../const/settings.const"
import { InitUISymbol, LocaleSymbol } from "../const/symbol.const"
import { OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { AppStatus } from "../data/app.data"
import { ContainerData } from "../data/container.data"
import { ModelData } from "../data/model.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import yunzhanLogo from "../images/matterport-logo-light.svg"
import { AppPhaseChangeMessage } from "../message/app.message"
import { MeshProgressBindingMessage } from "../message/mesh.message"
import { ShowcaseExpandedMessage } from "../message/showcase.message"
import * as f from "../other/45059"
import * as k from "../other/76721"
import { isSmallScreen } from "../utils/61687"
import { featurePolicyCheck, isMobilePhone, isOculusBrowser, sameWindow } from "../utils/browser.utils"
import { waitRun } from "../utils/func.utils"
import { NavURLParam } from "../utils/nav.urlParam"
import { copyURLSearchParams } from "../utils/urlParams.utils"
import LocaleModule from "./locale.module"

declare global {
  interface SymbolModule {
    [InitUISymbol]: LoadingUiModule
  }
}

class ProgressUI {
  lastProgress: number
  currentProgress: number
  meshAlloc: {
    alloc: number
    loaded: number
  }
  showingProgress: boolean
  progressElm: SVGCircleElement
  engine: EngineContext
  meshProgressBinding: (e: MeshProgressBindingMessage) => void

  constructor(e, t) {
    this.lastProgress = 0
    this.currentProgress = 0
    this.meshAlloc = {
      alloc: 2e6,
      loaded: 0
    }
    this.showingProgress = !1
    this.progressElm = t.querySelector("#bar")
    this.engine = e
    this.meshProgressBinding = this.onMeshLoadProgress.bind(this)
    this.engine.subscribe(MeshProgressBindingMessage, this.meshProgressBinding)
  }

  dispose() {}

  showProgress() {
    this.showingProgress = !0
    this.setProgress(this.currentProgress)
  }

  setDone() {
    this.currentProgress = 100
    this.setProgress(this.currentProgress)
    this.engine.unsubscribe(MeshProgressBindingMessage, this.meshProgressBinding)
  }

  setProgress(e) {
    if (!this.progressElm || isNaN(e)) return
    this.lastProgress = Math.max(this.lastProgress, e)
    e = this.lastProgress
    const t = Number.parseFloat(this.progressElm.getAttribute("r") || "0"),
      n = Math.PI * (2 * t),
      i = ((100 - (e = Math.max(Math.min(e, 100), 0))) / 100) * n
    this.progressElm.style.strokeDasharray = n.toString(10)
    this.progressElm.style.strokeDashoffset = i.toString(10)
  }

  calcProgress() {
    let e = 0,
      t = 0

    e += this.meshAlloc.loaded
    t += this.meshAlloc.alloc
    this.currentProgress = 95 * Math.min(e / t, 1)
    this.showingProgress && this.setProgress(this.currentProgress)
  }

  onMeshLoadProgress(e: MeshProgressBindingMessage) {
    this.meshAlloc.loaded = (e.loaded / e.total) * this.meshAlloc.alloc
    this.calcProgress()
  }
}
function ScreenResize(e) {
  const { width, height } = window.screen
  return (
    sameWindow() &&
    isSmallScreen({
      width,
      height
    }) &&
    e.height < 0.6 * height
  )
}

function CheckBrowser() {
  return isOculusBrowser() && !featurePolicyCheck("xr-spatial-tracking")
}

class AutoPlayer {
  //是否出现点击进入页面的播放按钮
  config: {
    editMode: boolean
    allowPlayInIframe: boolean
    allowAutoPlay: any
    disabled: any
    openingTool: any
  }
  settingsData: SettingsData
  containerData: ContainerData
  bindings: any[]

  constructor(e, t, n) {
    this.config = e
    this.settingsData = t
    this.containerData = n
    this.bindings = []
  }

  async autoPlayIfWhenAllowed(e) {
    const { editMode, openingTool, disabled, allowAutoPlay } = this.config
    let r = !0
    if (!sameWindow() || !!(this.settingsData.getOverrideParam("play", !1) || editMode || openingTool)) {
      r = allowAutoPlay || this.sdkConnected
      if (!r) {
        if (!disabled && !(sameWindow() && CheckBrowser())) {
          r = !ScreenResize(this.containerData.size)
        }
        if (!r) {
          this.bindings.push(
            this.containerData.onPropertyChanged("size", t => {
              if (!ScreenResize(t)) {
                e()
                this.bindings.forEach(e => e.cancel())
              }
            })
          )
        }
      }
    }
    r && e()
    return r
  }

  get sdkConnected() {
    return !0
  }

  dispose() {
    this.bindings.forEach(e => e.cancel())
  }
}

function FindLinkElement(e: string, t: string) {
  let n = document.querySelector(`link[rel=${e}]`)
  if (!n) {
    n = document.createElement("link")
    document.head.appendChild(n)
  }
  n.setAttribute("rel", e), n.setAttribute("href", t)
}

export default class LoadingUiModule extends Module {
  playPromise: OpenDeferred
  autoPlaying: boolean
  engine: EngineContext
  config: {
    editMode: boolean
    allowPlayInIframe: boolean
    allowAutoPlay: any
    disabled: any
    openingTool: any
    quickstart: boolean
    hideTitle: boolean
    hideBranding: boolean
    hidePoweredBy: boolean
    baseUrl: string
    viewId: string
  }
  autoPlayer: AutoPlayer
  settings: SettingsData
  containerData: ContainerData
  progressUI: ProgressUI
  playIcon: HTMLButtonElement | null
  uiRoot: HTMLDivElement | null
  locale: LocaleModule
  presentedBy: HTMLDivElement | null
  poweredBy: HTMLDivElement | null
  mpLogo: HTMLImageElement | null
  circleLoader: HTMLDivElement | null
  nameHeader: HTMLDivElement | null
  background: HTMLDivElement | null
  tint: HTMLDivElement | null
  model: any
  onClick: () => void
  autoPlay: Function
  resolvePlayPromise: (e: boolean, t: boolean) => void
  toggleIframeExpansion: (e: any) => void
  onAppPhaseChangeMessage: (e: any) => void

  constructor() {
    super(...arguments)
    this.name = "loading-ui"
    this.playPromise = new OpenDeferred()
    this.onClick = () => {
      this.resolvePlayPromise(!0, !1)
    }
    this.autoPlay = () => {
      this.autoPlaying = !0
      // this.updatePlayAnalytics()
      this.resolvePlayPromise(!0, this.config.editMode)
    }
    this.resolvePlayPromise = async (e, editMode) => {
      this.autoPlayer?.dispose()
      if (!this.autoPlaying) {
        const e = this.config.allowPlayInIframe || (!isMobilePhone() && !CheckBrowser())
        if (!e && 1 === this.settings.getOverrideParam("nt", 0)) {
          const e = (0, k.m5)(window.location.href)
          return void window.open(e, "_blank")
        }
        if (sameWindow())
          if (editMode && (e || 1 === this.settings.getOverrideParam("expand", 0))) {
            this.toggleIframeExpansion(!0)
          } else if (!e) {
            const e = copyURLSearchParams()
            editMode && e.set("edit", "1")
            e.set("back", "1")
            e.delete("cloudEdit")
            const n = e.toString(),
              i = `${window.location.origin}${window.location.pathname}?${n}`
            try {
              return void (window.top && (window.top.location.href = i))
            } catch (e) {
              this.log.debug("Couldn't set top window location; was JMYDCase sandboxed?"), this.log.debug(e)
            }
          }
      }
      if (editMode) {
        this.settings.setProperty("quickstart", !0)
      }

      if (e) {
        if (!this.config.disabled) {
          this.uiRoot?.removeEventListener("click", this.onClick)
          this.playIcon?.remove()
          this.progressUI.showProgress()
        }
        this.playPromise.resolve()
      }
    }
    this.toggleIframeExpansion = e => {
      const t = e ? new ShowcaseStartCommand() : new ShowcaseStopCommand()
      this.engine.commandBinder.issueCommand(t)
      this.engine.broadcast(new ShowcaseExpandedMessage(e))
    }
    this.onAppPhaseChangeMessage = async e => {
      if ([AppStatus.STARTING, AppStatus.PLAYING, AppStatus.ERROR].includes(e.phase)) {
        this.progressUI.setDone()
        // this.config.quickstart ? this.showQuickstartUI() : this.uiRoot?.classList.add("faded-out")
        this.engine.unsubscribe(AppPhaseChangeMessage, this.onAppPhaseChangeMessage)
      }
    }
  }

  async init(e: any, t: EngineContext) {
    this.engine = t
    this.config = e
    const { market, commandBinder } = this.engine
    ;[this.locale, this.settings, this.containerData] = await Promise.all([
      t.getModuleBySymbol(LocaleSymbol),
      market.waitForData(SettingsData),
      market.waitForData(ContainerData)
    ])
    //zsy修改
    const modelData = await t.market.waitForData(ModelData)
    // this.getLoadingElements()
    this.model = modelData.model.details
    this.updateHtmlMetadata(modelData, this.settings)
    this.autoPlaying = 1 === this.settings.getOverrideParam("play", 0)
    this.bindings.push(
      commandBinder.addBinding(StartApplicationCommand, async e => {
        this.resolvePlayPromise(e.startup, e.editMode)
      }),
      commandBinder.addBinding(ExpandAppCommand, async e => {
        this.toggleIframeExpansion(e.expand)
      })
    )
    if (!e.disabled) {
      this.bindings.push(
        this.settings.onPropertyChanged(presentationTitleKey, () => this.renderTitle()),
        this.settings.onPropertyChanged(brandingEnabledKey, () => this.renderBranding()),
        this.settings.onPropertyChanged(presentationMlsModeKey, () => this.renderBranding()),
        t.subscribe(AppPhaseChangeMessage, this.onAppPhaseChangeMessage)
      )
      this.progressUI = new ProgressUI(t, this.containerData.element)
      //pw
      // this.loadUi()
      // this.renderSplashScreen()
      this.autoPlay()
    }
  }

  dispose(e) {
    this.progressUI?.dispose()
    this.autoPlayer?.dispose()
  }

  get waitForPlaying() {
    return this.playPromise.nativePromise()
  }

  loadUi() {
    this.uiRoot = this.containerData.element.querySelector("#loading-gui")
    if (!this.uiRoot) throw Error("Loading GUI root not found")
    this.uiRoot.classList.remove("hidden")
    this.config.quickstart && (this.uiRoot.style.pointerEvents = "none")
  }

  getPresentationOptions() {
    const { hideTitle, hideBranding, quickstart } = this.config
    const i = !quickstart && (hideTitle ? !hideTitle : this.settings.tryGetProperty(presentationTitleKey, !0))
    const s = this.settings.tryGetProperty(presentationMlsModeKey, !1)
    const r = this.settings.tryGetProperty(brandingEnabledKey, !0)
    return {
      title: i,
      presentedBy: hideBranding ? !hideBranding : r && !s
    }
  }

  getLoadingElements() {
    const e = this.containerData.element
    this.presentedBy = e.querySelector("#loading-presented-by")
    this.poweredBy = e.querySelector("#loading-powered-by")
    this.mpLogo = e.querySelector("#loading-mp-logo")
    this.mpLogo!.src = yunzhanLogo
    this.mpLogo!.alt = this.locale.t(PhraseKey.ALT_MATTERPORT_LOGO)
    this.circleLoader = e.querySelector("#circleLoader")
    this.nameHeader = e.querySelector("#loading-header")
    this.background = e.querySelector("#loading-background")
    this.tint = e.querySelector("#tint")
    this.playIcon = e.querySelector("#JMYDCase-play")
    this.playIcon?.setAttribute("aria-label", this.locale.t(PhraseKey.PLAY))
    this.playIcon?.setAttribute("alt", this.locale.t(PhraseKey.PLAY))
  }

  addCobrand() {
    if (this.model?.presentedBy) {
      const e = this.presentedBy?.querySelector(".loading-label")
      e && (e.textContent = this.locale.t(PhraseKey.PRESENTED_BY_CAPS))
      const t = this.presentedBy?.querySelector(".subheader")
      t && (t.textContent = this.model.presentedBy)
      this.presentedBy?.classList.remove("hidden")
    }
  }

  hidePlayButtonUI() {
    this.background!.style.backgroundImage = "none"
    this.presentedBy!.style.transition = "none"
    this.presentedBy?.classList.remove("faded-in")
    this.poweredBy!.style.transition = "none"
    this.poweredBy?.classList.remove("faded-in")
    this.nameHeader?.classList.add("hidden")
    this.tint?.classList.add("hidden")
    this.circleLoader?.classList.add("hidden")
    this.uiRoot?.classList.add("quickstart")
  }

  async showQuickstartUI() {
    this.background?.classList.add("faded-out")
    await waitRun(500)
    this.presentedBy!.style.transition = ""
    this.presentedBy?.classList.add("faded-in")
    this.poweredBy!.style.transition = ""
    this.poweredBy?.classList.add("faded-in")
    await waitRun(2500)
    this.presentedBy?.classList.remove("faded-in")
    this.poweredBy?.classList.remove("faded-in")
    this.uiRoot?.classList.add("faded-out")
  }

  showLoadingUI(e) {
    const t = document.createAttribute("data-status")
    t.value = this.locale.t(PhraseKey.LOADING)
    const n = this.containerData.element.querySelector("#loader-cont")
    if (n) {
      n.attributes.setNamedItem(t)
      n.classList.add(this.locale.languageCode)
      n.classList.add("loading")
    }
    e.classList.add("faded-out")
    this.presentedBy?.classList.add("faded-in")
  }

  renderTitle() {
    const { title: e } = this.getPresentationOptions()
    this.nameHeader?.classList.toggle("hidden", !e)
  }

  renderBranding() {
    const { presentedBy: e } = this.getPresentationOptions()
    e ? this.addCobrand() : this.presentedBy?.classList.add("hidden")
  }

  async renderSplashScreen() {
    const { editMode, allowPlayInIframe, allowAutoPlay, disabled, openingTool, quickstart, hidePoweredBy } = this.config
    this.renderTitle()
    this.renderBranding()
    hidePoweredBy && this.poweredBy?.classList.add("hidden")
    this.nameHeader!.textContent = this.model.name
    this.poweredBy?.classList.add("faded-in")
    this.tint?.classList.add("faded-in")
    const play_prompt: HTMLDivElement | null = this.containerData.element.querySelector("#play-prompt")
    this.playPromise.then(() => {
      quickstart ? this.hidePlayButtonUI() : this.showLoadingUI(play_prompt)
    })
    this.autoPlayer = new AutoPlayer(
      {
        editMode,
        allowPlayInIframe,
        allowAutoPlay,
        disabled,
        openingTool
      },
      this.settings,
      this.containerData
    )
    this.autoPlaying = await this.autoPlayer.autoPlayIfWhenAllowed(this.autoPlay)
    if (!this.autoPlaying) {
      play_prompt?.classList.remove("hidden")
      play_prompt!.innerText = this.locale.t(PhraseKey.EXPLORE_3D_SPACE)
      this.playIcon?.classList.remove("hidden")
      this.uiRoot?.addEventListener("click", this.onClick)
    }
    this.renderBackground()
    if (!allowPlayInIframe) {
      window.scrollTo(0, 0)
    }
  }

  async renderBackground() {
    const e = NavURLParam.deserialize()
    if (this.autoPlaying && e) {
      const t = await this.engine.market.waitForData(SweepsData)
      const n = f.J(e, t)
      if (n && f.l(n, t)) return
    }
    const t = window.devicePixelRatio || 1
    const n = Math.max(window.innerWidth, 400)
    this.background!.style.backgroundImage = `url(${this.config.baseUrl}/api/v1/player/models/${this.config.viewId}/thumb?width=${n}&dpr=${t}&disable=upscale)`
  }

  // updatePlayAnalytics() {
  //   this.engine.getModuleBySymbol(AnalyticsSymbol).then(e => {
  //     e.setOptions(Object.assign({}, u.vx(this.autoPlaying)))
  //   })
  // }

  updateHtmlMetadata(e, t) {
    if ("function" == typeof ShadowRoot && this.containerData.rootNode instanceof ShadowRoot) return
    const n = t.tryGetProperty(discoverSpaceUrlKey, null)
    if (e.hasDiscoverUrl() && n) {
      FindLinkElement("canonical", `${n}${e.model.sid}`)
    }
  }
}
