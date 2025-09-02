import h from "classnames"
import * as r from "react"
import * as c from "react/jsx-runtime"
import { AppReactContext } from "../context/app.context"
import * as g from "../other/38490"
import * as v from "../const/73698"
import { DefaultErrorCommand } from "../command/error.command"
import { AppAnalyticsSymbol, GuiSymbol, LocaleSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { Message } from "../core/message"
import { Module } from "../core/module"
import { GuiViewData } from "../data/gui.view.data"
import { SettingsData } from "../data/settings.data"
import { UsersData } from "../data/users.data"
import { hasCodeError } from "../utils/error.utils"
import EngineContext from "../core/engineContext"
import { defaultContext } from "../other/19801"
import Engine from "../core/engine"
import MarketContext from "../core/marketContext"
import { createRoot } from "react-dom/client"

declare global {
  interface SymbolModule {
    [GuiSymbol]: GuiModule
  }
}

class OpenStateChangeMessage extends Message {
  open: boolean
  constructor(e) {
    super()
    this.open = e
  }
}

const debugInfo = new DebugInfo("alert-notification")

class AlertComponent extends r.Component {
  constructor(e) {
    super(e),
      (this.throttledMessages = new Map()),
      (this.onClose = () => {
        clearTimeout(this.alertTimer),
          this.setState({
            open: !1
          })
      }),
      (this.state = {
        open: !1
      })
  }

  componentDidMount() {
    this.update()
  }

  componentWillUnmount() {
    this.state.open && this.props.messageBus.broadcast(new OpenStateChangeMessage(!1))
  }

  UNSAFE_componentWillReceiveProps(e) {
    this.update(e)
  }

  componentDidUpdate(e, t) {
    this.state.open !== t.open && this.props.messageBus.broadcast(new OpenStateChangeMessage(this.state.open))
  }

  update(e = this.props) {
    const { show: t, timeout: n, message: i, throttle: s, type: r } = e,
      { analytics: a } = this.context
    if (t) {
      if (s > 0) {
        if (this.throttledMessages.has(i) && this.throttledMessages.get(i) > Date.now())
          return void debugInfo.debug(`Suppressed alert dialog due to message throttling: ${i}`)
        this.throttledMessages.set(i, Date.now() + 1e3 * s)
      }
      clearTimeout(this.alertTimer),
        this.setState({
          open: !0
        }),
        n > 0 && (this.alertTimer = window.setTimeout(this.onClose, 1e3 * n)),
        a &&
          a.track("alert_gui", {
            alert_action: "show",
            alert_type: r,
            alert_message: i
          })
    }
  }

  render() {
    const { title: e, message: t, type: n } = this.props,
      { open: i } = this.state,
      s = {
        active: i,
        [`notification-${n}`]: !0
      }
    return (0, c.jsxs)(
      "aside",
      Object.assign(
        {
          className: h("alert-notification", s)
        },
        {
          children: [
            (0, c.jsxs)(
              "div",
              Object.assign(
                {
                  className: "notification-body"
                },
                {
                  children: [
                    e &&
                      (0, c.jsx)(
                        "h3",
                        Object.assign(
                          {
                            className: "notification-title"
                          },
                          {
                            children: e
                          }
                        )
                      ),
                    (0, c.jsx)(
                      "p",
                      Object.assign(
                        {
                          className: "notification-text"
                        },
                        {
                          children: t
                        }
                      )
                    )
                  ]
                }
              )
            ),
            i &&
              (0, c.jsx)(g.P, {
                theme: "dark",
                tooltip: "",
                onClose: this.onClose
              })
          ]
        }
      )
    )
  }
}
;(AlertComponent.contextType = AppReactContext),
  (AlertComponent.defaultProps = {
    type: v.N.INFO,
    show: !1,
    timeout: 10,
    throttle: 0
  })

class S extends r.Component {
  constructor(e) {
    super(e),
      (this.bindings = []),
      (this.state = {
        guiError: !1,
        errorMessagePhraseKey: ""
      })
  }

  componentDidMount() {
    const { commandBinder: e } = this.context
    this.bindings.push(
      e.addBinding(DefaultErrorCommand, async e => {
        this.showErrorMessage(e.messagePhraseKey, e.options)
      })
    )
  }

  componentWillUnmount() {
    this.bindings.forEach(e => e.cancel()), (this.bindings.length = 0)
  }

  componentDidUpdate(e, t) {
    const { guiError: n } = this.state
    n &&
      this.setState({
        guiError: !1
      })
  }

  showErrorMessage(e, t) {
    this.setState({
      guiError: !0,
      errorMessagePhraseKey: e,
      errorOptions: t
    })
  }

  render() {
    const { messageBus: e, locale: t } = this.context,
      { guiError: n, errorMessagePhraseKey: i, errorOptions: s } = this.state
    let r = i && t.t(i)
    const { error: a } = s || {}
    return (
      a && hasCodeError(a) && (r = `${r} (${a.code})`),
      (0, c.jsx)(
        AlertComponent,
        Object.assign(
          {
            messageBus: e,
            show: n,
            message: r
          },
          s
        )
      )
    )
  }
}

S.contextType = AppReactContext
export default class GuiModule extends Module {
  workshopApp: boolean
  onAppReadyChanged: Function
  mainDiv: HTMLDivElement
  container: HTMLDivElement
  reactContainer: Element
  queue: any
  engine: EngineContext
  messageBus: EngineContext
  market: MarketContext
  commandBinder: Engine["commandBinder"]
  mainArgs: any[]
  guiViewData: GuiViewData

  constructor() {
    super(...arguments)
    this.name = "gui"
    this.workshopApp = !1
    this.onAppReadyChanged = (e, t) => {
      this.workshopApp && (t && e ? this.mainDiv.classList.add("edit-mode") : this.mainDiv.classList.remove("edit-mode"))
    }
  }

  async init(e, t: EngineContext) {
    this.workshopApp = e.workshopApp
    this.mainDiv = e.mainDiv
    this.container = e.container
    this.reactContainer = e.reactContainer
    this.queue = e.queue
    this.engine = t
    this.messageBus = t
    this.market = t.market
    this.commandBinder = t.commandBinder
    const n = t.getModuleBySymbol(LocaleSymbol),
      i = t.getModuleBySymbol(AppAnalyticsSymbol),
      r = t.market.waitForData(UsersData),
      a = t.market.waitForData(SettingsData)
    this.mainArgs = await Promise.all([n, i, a, r])
    this.loadErrorBar(this.mainArgs)
    this.guiViewData = new GuiViewData()
    this.market.register(this, GuiViewData, this.guiViewData)
  }

  async loadUi(e: Function) {
    let t: any[] = []
    t = t.concat(this.mainArgs)
    t = t.concat([this.mainDiv, this.reactContainer, this.engine, this.messageBus, this.market, this.commandBinder, this.onAppReadyChanged, this.queue])
    return e.apply(this, t)
  }

  loadErrorBar(e) {
    const { dispose: t } = ((e, t, n, i, s, c, d) => {
      const u = document.createElement("div")
      u.className = "error-bar"
      i.insertBefore(u, i.firstElementChild)
      const h = Object.assign(Object.assign({}, defaultContext), {
          messageBus: e,
          commandBinder: t,
          market: n,
          analytics: s,
          settings: c,
          locale: d
        }),
        p = createRoot(u)
      return (
        p.render(
          (0, r.createElement)(
            AppReactContext.Provider,
            {
              value: h
            },
            [
              (0, r.createElement)(S, {
                key: "error-bar"
              })
            ]
          )
        ),
        {
          dispose: () => {
            p.unmount(), u.remove()
          }
        }
      )
    })(this.engine, this.commandBinder, this.market, this.container, e[1], e[2], e[0])
    this.bindings.push({
      renew: () => {},
      cancel: t
    })
  }
}
