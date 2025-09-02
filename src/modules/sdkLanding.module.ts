import * as r from "react"
import { Root, createRoot } from "react-dom/client"
import * as l from "react/jsx-runtime"
import * as c from "../other/86941"
import { PhraseKey } from "../const/phrase.const"
import { LocaleSymbol, SdkLandingSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
declare global {
  interface SymbolModule {
    [SdkLandingSymbol]: SdkLandingModule
  }
}
function d({ loadingMessage: e, messageDelay: t }) {
  const [n, i] = (0, r.useState)(!1)
  return (
    (0, r.useEffect)(() => {
      if (!n) {
        const e = setTimeout(() => {
          i(!0)
        }, t)
        return () => clearTimeout(e)
      }
      return () => {}
    }),
    (0, l.jsxs)("div", {
      children: [
        (0, l.jsx)(
          "div",
          Object.assign(
            {
              className: "spinner-container"
            },
            {
              children: (0, l.jsx)(c.$, {
                progress: 33,
                barWidth: 4,
                progressColor: "#ffffff"
              })
            }
          )
        ),
        n &&
          (0, l.jsx)(
            "div",
            Object.assign(
              {
                className: "message"
              },
              {
                children: e
              }
            )
          )
      ]
    })
  )
}

export default class SdkLandingModule extends Module {
  messageDelay: number
  locale
  reactContainer: HTMLDivElement
  container: HTMLDivElement
  reactRoot: Root
  constructor() {
    super(...arguments)
    this.name = "sdk-landing"
    this.messageDelay = 3e3
  }

  async init(e, t) {
    this.locale = await t.getModuleBySymbol(LocaleSymbol)
    this.reactContainer = document.createElement("div")
    this.reactContainer.id = "sdk-landing-container"
    this.container = e.container
  }

  show() {
    this.container.appendChild(this.reactContainer)
    this.reactRoot = createRoot(this.reactContainer)
    this.reactRoot.render(
      r.createElement(d, {
        loadingMessage: this.locale.t(PhraseKey.SDK.AWAITING),
        messageDelay: this.messageDelay
      })
    )
  }

  hide() {
    var e
    this.container.removeChild(this.reactContainer)
    this.reactRoot.unmount()
    e = this.reactContainer
    if (!e) {
      e.remove()
    }
  }
}
