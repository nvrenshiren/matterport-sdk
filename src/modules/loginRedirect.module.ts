import c from "classnames"
import * as i from "react"
import * as o from "react/jsx-runtime"
import { OpenDeferred } from "../core/deferred"
import { Root, createRoot } from "react-dom/client"
import * as h from "../other/84426"
import { PhraseKey } from "../const/phrase.const"
import { LocaleSymbol, LoginRedirectSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
declare global {
  interface SymbolModule {
    [LoginRedirectSymbol]: LoginRedirectModule
  }
}
const u = "images/login-screen-background.jpg"
const { INVITED_MESSAGE: p, CREATE_ACCOUNT: m, HAVE_ACCOUNT: f, SIGN_IN: g } = PhraseKey.LOGIN

class v extends i.Component {
  signup: () => void
  constructor(e) {
    super(e)
    this.signup = () => {
      window.top && (window.top.location.href = this.props.registerUrl)
    }
  }

  render() {
    const { loginUrl: e, backgroundUrl: t, locale: n } = this.props,
      i = t || u
    return (0, o.jsx)(
      "div",
      Object.assign(
        {
          className: "login-redirect-screen",
          style: {
            backgroundImage: `url(${i})`
          }
        },
        {
          children: (0, o.jsx)(
            "div",
            Object.assign(
              {
                className: c("login-redirect", {
                  skrim: !!t
                })
              },
              {
                children: (0, o.jsxs)(
                  "div",
                  Object.assign(
                    {
                      className: "login-redirect-body"
                    },
                    {
                      children: [
                        (0, o.jsx)(
                          "h1",
                          Object.assign(
                            {
                              className: "login-redirect-title"
                            },
                            {
                              children: n.t(p)
                            }
                          )
                        ),
                        (0, o.jsx)(
                          "div",
                          Object.assign(
                            {
                              className: "login-redirect-create"
                            },
                            {
                              children: (0, o.jsx)(h.zx, {
                                variant: h.Wu.PRIMARY,
                                size: "large",
                                theme: "dark",
                                onClick: this.signup,
                                label: n.t(m)
                              })
                            }
                          )
                        ),
                        (0, o.jsxs)(
                          "div",
                          Object.assign(
                            {
                              className: "login-redirect-link"
                            },
                            {
                              children: [
                                n.t(f),
                                (0, o.jsx)(
                                  "a",
                                  Object.assign(
                                    {
                                      className: "link",
                                      href: e
                                    },
                                    {
                                      children: n.t(g)
                                    }
                                  )
                                )
                              ]
                            }
                          )
                        )
                      ]
                    }
                  )
                )
              }
            )
          )
        }
      )
    )
  }
}

export default class LoginRedirectModule extends Module {
  authenticated: boolean
  engine: EngineContext
  config: {
    container: HTMLDivElement
    loginUrl: string
    registerUrl: string
    baseUrl: string
    modelId: string
  }
  reactContainer: HTMLDivElement
  reactRoot: Root

  constructor() {
    super(...arguments)
    this.name = "login-redirect"
    this.authenticated = !1
  }

  async init(e, t: EngineContext) {
    this.config = e
    this.engine = t
  }

  async loadUi() {
    var e = window.top
    const { container, loginUrl, registerUrl } = this.config
    const o = await this.engine.getModuleBySymbol(LocaleSymbol)
    const l = encodeURIComponent((!e ? void 0 : e.location.href) || "")
    this.reactContainer = document.createElement("div")
    this.reactContainer.id = "login-redirect-container"
    container.appendChild(this.reactContainer)
    this.reactRoot = createRoot(this.reactContainer)
    this.reactRoot.render(
      i.createElement(v, {
        locale: o,
        backgroundUrl: this.getBackground(),
        loginUrl: `${loginUrl}?target=${l}`,
        registerUrl: `${registerUrl}?target=${l}`
      })
    )
    return new OpenDeferred()
  }

  async unloadUi() {
    if (!!this.reactContainer) {
      this.reactRoot.unmount()
      this.reactContainer.remove()
      delete this.reactContainer
      return !0
    }
  }

  getBackground() {
    const { baseUrl, modelId } = this.config
    if (!modelId || !baseUrl) return
    const n = window.devicePixelRatio || 1
    return `${baseUrl}/api/v1/player/models/${modelId}/thumb?width=${Math.max(this.config.container.clientWidth, 400)}&dpr=${n}&disable=upscale`
  }
}
