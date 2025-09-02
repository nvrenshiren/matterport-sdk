import p from "classnames"
import * as s from "react"
import * as u from "react/jsx-runtime"

import { ErrorType } from "../const/auth.const"
import { LocaleSymbol, PasswordSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { AuthenticationPassword } from "../utils/authorizationPassword.utils"

import { Root, createRoot } from "react-dom/client"
import { defaultContext } from "../other/19801"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import Engine from "../core/engine"
import { BaseExceptionError } from "../error/baseException.error"
import { AuthErrorTypeMessage, PasswordAuthenticationMessage } from "../message/auth.message"
declare global {
  interface SymbolModule {
    [PasswordSymbol]: ShowcasePasswordModule
  }
}
class g extends s.Component {
  render() {
    const { attributionLinkText: e, attributionLinkUrl: t } = this.props,
      { locale: n } = this.context
    return (0, u.jsxs)(
      "div",
      Object.assign(
        {
          className: "powered-by"
        },
        {
          children: [
            (0, u.jsx)(
              "p",
              Object.assign(
                {
                  className: "powered-by-label"
                },
                {
                  children: n.t(PhraseKey.POWERED_BY)
                }
              )
            ),
            (0, u.jsx)("img", {
              className: "powered-by-logo",
              alt: "Matterport",
              src: "images/matterport-logo-light.svg",
              width: "150",
              height: "32"
            }),
            t &&
              (0, u.jsx)(
                "a",
                Object.assign(
                  {
                    href: t,
                    className: "powered-by-link"
                  },
                  {
                    children: e || t
                  }
                )
              )
          ]
        }
      )
    )
  }
}

g.contextType = AppReactContext
const y = "images/showcase-password-background.jpg"

class InvalidPasswordError extends BaseExceptionError {
  constructor(e = "Invalid password") {
    super(e)

    this.name = "InvalidPassword"
  }
}

class TooManyAttemptsError extends BaseExceptionError {
  constructor(e = "Too many attempts, please try again in a few minutes") {
    super(e)
    this.name = "TooManyAttempts"
  }
}

const PasswordDebug = new DebugInfo("JMYDCase-password")

class T extends s.Component {
  constructor(e) {
    super(e),
      (this.isUnmounting = !1),
      (this.onInputChange = e => {
        const { name: t, value: n } = e.target
        "password" === t &&
          this.setState({
            password: n,
            hasError: !1
          })
      }),
      (this.onSubmit = async e => {
        e.preventDefault(),
          this.setState({
            formEnabled: !1
          }),
          await this.authenticate(),
          this.isUnmounting ||
            this.setState({
              formEnabled: !0
            })
      }),
      (this.state = {
        formEnabled: !0,
        hasError: !1,
        tooManyAttempts: !1,
        password: ""
      })
  }

  componentWillUnmount() {
    this.isUnmounting = !0
  }

  async authenticate() {
    const { authenticate: e } = this.props,
      { password: t } = this.state
    PasswordDebug.debug("Validating password input...")
    const n = await e(t).catch(
      e => (
        e instanceof S &&
          this.setState({
            hasError: !0,
            tooManyAttempts: !0
          }),
        !1
      )
    )
    this.isUnmounting ||
      this.setState({
        hasError: !n
      })
  }

  stopPropagation(e) {
    e.stopPropagation()
  }

  renderLockout() {
    const { locale: e } = this.context
    return (0, u.jsxs)(
      "div",
      Object.assign(
        {
          className: "sc-password-modal sc-password-lockout"
        },
        {
          children: [
            (0, u.jsx)(
              "header",
              Object.assign(
                {
                  className: "modal-header"
                },
                {
                  children: (0, u.jsx)(
                    "h1",
                    Object.assign(
                      {
                        className: "modal-title"
                      },
                      {
                        children: e.t(PhraseKey.SC_LOCKOUT_TITLE)
                      }
                    )
                  )
                }
              )
            ),
            (0, u.jsx)(
              "p",
              Object.assign(
                {
                  className: "modal-body"
                },
                {
                  children: e.t(PhraseKey.SC_LOCKOUT_MESSAGE)
                }
              )
            )
          ]
        }
      )
    )
  }

  renderLoginForm() {
    const { hasError: e, password: t, formEnabled: n } = this.state,
      { locale: i } = this.context
    return (0, u.jsxs)(
      "div",
      Object.assign(
        {
          className: "sc-password-modal sc-password-login"
        },
        {
          children: [
            (0, u.jsx)(
              "header",
              Object.assign(
                {
                  className: "modal-header"
                },
                {
                  children: (0, u.jsx)(
                    "h1",
                    Object.assign(
                      {
                        className: "modal-title"
                      },
                      {
                        children: i.t(PhraseKey.SC_PASSWORD_TITLE)
                      }
                    )
                  )
                }
              )
            ),
            (0, u.jsxs)(
              "div",
              Object.assign(
                {
                  className: "modal-body"
                },
                {
                  children: [
                    (0, u.jsxs)(
                      "form",
                      Object.assign(
                        {
                          onSubmit: this.onSubmit,
                          className: "sc-password-form"
                        },
                        {
                          children: [
                            (0, u.jsx)("input", {
                              type: "password",
                              name: "password",
                              placeholder: i.t(PhraseKey.SC_PASSWORD_PLACEHOLDER),
                              onInput: this.onInputChange,
                              onKeyDown: this.stopPropagation,
                              onKeyPress: this.stopPropagation,
                              onKeyUp: this.stopPropagation,
                              disabled: !n,
                              value: t,
                              className: p("sc-password-input", {
                                error: e
                              }),
                              autoComplete: "on"
                            }),
                            (0, u.jsx)(
                              "button",
                              Object.assign(
                                {
                                  type: "submit",
                                  disabled: !n,
                                  className: "sc-password-submit"
                                },
                                {
                                  children: i.t(PhraseKey.SC_PASSWORD_SUBMIT)
                                }
                              )
                            )
                          ]
                        }
                      )
                    ),
                    e &&
                      (0, u.jsxs)(
                        "p",
                        Object.assign(
                          {
                            className: "help-text error"
                          },
                          {
                            children: [
                              (0, u.jsx)("span", {
                                className: "icon icon-error"
                              }),
                              i.t(PhraseKey.SC_PASSWORD_INVALID)
                            ]
                          }
                        )
                      ),
                    !e &&
                      (0, u.jsx)("p", {
                        className: "help-text"
                      })
                  ]
                }
              )
            )
          ]
        }
      )
    )
  }

  render() {
    const { hasError: e, tooManyAttempts: t } = this.state,
      n = e && t ? this.renderLockout() : this.renderLoginForm()
    return (0, u.jsxs)(
      "div",
      Object.assign(
        {
          className: "sc-password-ui",
          style: {
            backgroundImage: `url(${y})`
          }
        },
        {
          children: [
            (0, u.jsx)(
              "div",
              Object.assign(
                {
                  className: "sc-password-content"
                },
                {
                  children: n
                }
              )
            ),
            (0, u.jsx)(
              "footer",
              Object.assign(
                {
                  className: "sc-password-footer"
                },
                {
                  children: (0, u.jsx)(g, {})
                }
              )
            )
          ]
        }
      )
    )
  }
}

T.contextType = AppReactContext
export default class ShowcasePasswordModule extends Module {
  authenticated: boolean
  config: {
    baseUrl: string
    modelId: string
    container: HTMLDivElement
  }
  engine: Engine
  reactContainer: HTMLDivElement
  auth: AuthenticationPassword
  reactRoot: Root

  constructor() {
    super(...arguments)
    this.name = "JMYDCase-password"
    this.authenticated = !1
  }

  async init(e, t) {
    this.config = e
    this.engine = t
    const n = e.baseUrl || window.location.origin
    this.auth = new AuthenticationPassword(n)
  }

  showPasswordScreen() {
    this.loadUi()
  }

  hidePasswordScreen() {
    this.unloadUi()
  }

  async loadUi() {
    const { container } = this.config
    const t = await this.engine.getModuleBySymbol(LocaleSymbol)
    const n = Object.assign(Object.assign({}, defaultContext), {
      locale: t
    })
    this.reactContainer = document.createElement("div")
    this.reactContainer.id = "JMYDCase-password-container"
    container.appendChild(this.reactContainer)
    this.reactRoot = createRoot(this.reactContainer)
    this.reactRoot.render(
      (0, s.createElement)(
        AppReactContext.Provider,
        {
          value: n
        },
        [
          (0, s.createElement)(T, {
            key: "JMYDCase-password",
            authenticate: e => this.authenticate(e)
          })
        ]
      )
    )
  }

  async unloadUi() {
    var e
    if (!!this.reactRoot) {
      this.reactRoot.unmount()
      e = this.reactContainer
      if (!!e) {
        e.remove()
        delete this.reactContainer
        return !0
      }
    }
  }

  async authenticate(e) {
    const { modelId } = this.config
    if (!(await this.auth.authenticate(modelId, e))) {
      switch ((this.engine.broadcast(new AuthErrorTypeMessage(this.auth.errorType)), this.auth.errorType)) {
        case ErrorType.INVALID_CREDENTIALS:
          throw new InvalidPasswordError()
        case ErrorType.TOO_MANY_ATTEMPTS:
          throw new TooManyAttemptsError()
      }
      return !1
    }
    this.log.debug("Password authentication was successful")
    this.engine.broadcast(new PasswordAuthenticationMessage())
    return !0
  }
}
