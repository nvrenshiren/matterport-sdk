import { SettingsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import Engine from "../core/engine"
export default async (e: Engine) => {
  const [t, i] = await Promise.all([e.getModuleBySymbol(SettingsSymbol), e.getModuleBySymbol(WebglRendererSymbol)]),
    o = "WebGL Renderer"
  let a = null
  function r(e) {
    i.threeRenderer.forceContextLoss(),
      setTimeout(() => {
        i.threeRenderer.forceContextRestore()
      }, e)
  }
  t.registerMenuButton({
    header: o,
    buttonName: "Lose Context for 0.1 sec",
    callback: () => {
      r(100)
    }
  }),
    t.registerMenuButton({
      header: o,
      buttonName: "Lose Context for 5 sec",
      callback: () => {
        r(5e3)
      }
    }),
    t.registerMenuEntry({
      header: o,
      setting: "autoLoseContext",
      initialValue: () => !1,
      urlParam: !0,
      onChange(e) {
        if (e) {
          const e = () => r(100)
          e(), (a = setInterval(e, 1e4))
        } else clearInterval(a)
      }
    })
}
