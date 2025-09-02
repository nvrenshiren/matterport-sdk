import { WorkShopAnalyticsSymbol, WorkShopAppSwitchSymbol } from "./const/symbol.const"
import Engine from "./core/engine"
import ShowCase from "./core/showcase"
import WorkShop from "./core/workshop"
import { getURLParams } from "./utils/urlParams.utils"
import * as WorkShopAppSwitch from "./modules/appSwitch.module"
import * as WorkShopAnalytics from "./modules/workshopAnalytics.module"
export const initWorkShop = (e: any) => {
  let config = e.detail && e.detail.config ? e.detail.config : {}
  const t = new Engine()
  t.registerModule({
    type: WorkShopAppSwitchSymbol,
    promise: () => Promise.resolve(WorkShopAppSwitch)
  })

  // t.registerModule({
  //   type: WorkShopAnalyticsSymbol,
  //   promise: () => Promise.resolve(WorkShopAnalytics)
  // })
  config = Object.assign(Object.assign({}, config), {
    appName: "workshop"
  })
  const { overrideParams = getURLParams() } = config
  const cloudEdit = "1" === overrideParams.cloudEdit
  const editMode = "1" === overrideParams.edit || !!overrideParams.tool

  if (editMode) {
    config.overrideParams = Object.assign(Object.assign({}, overrideParams), {
      qs: "1"
    })
  }

  const showcase = new ShowCase(!0, config, editMode)
  const workshop = new WorkShop(!0)
  workshop.overrideSyncs(t)
  t.loadApplication(showcase, showcase.setError.bind(showcase), editMode).then(() => {
    workshop.trackFeatures(t)
  })
  t.loadModuleBySymbol({
    type: WorkShopAppSwitchSymbol,
    config: {
      showcase,
      workshop,
      switchApp: t.loadApplication.bind(t),
      appContainer: (config.container || document.body).querySelector("#app-container") || document.body,
      cloudBarSetting: cloudEdit,
      editMode
    }
  })

  // t.loadModuleBySymbol({
  //   type: WorkShopAnalyticsSymbol
  // })
  return t
}
