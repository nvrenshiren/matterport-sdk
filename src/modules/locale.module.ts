import Polyglot from "node-polyglot"
import { load } from "js-yaml"
import * as Ue from "../other/10837"
import * as Me from "../other/41404"
import * as He from "../other/62944"
import * as o from "../const/51801"
import { PhraseKey } from "../const/phrase.const"
import { LocaleSymbol, SettingsSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { SettingsData } from "../data/settings.data"
import { getLanguage } from "../utils/browser.utils"
import { getValFromURL } from "../utils/urlParams.utils"

declare global {
  interface SymbolModule {
    [LocaleSymbol]: LocaleModule
  }
}
async function De(e, t, n = "./", i = "json") {
  const s = e === o.k$ ? `${n}locale/strings.${i}` : `${n}locale/messages/strings_${e}.${i}`
  const r = await t.get(s)
  return "json" === i ? JSON.parse(r) : load(r)
}

const Ve = e => e.replace(/-/g, "_").toUpperCase()

export default class LocaleModule extends Module {
  _languageCode: any
  polyglot: Polyglot
  static missingPrefix: string

  constructor(...rest: any[]) {
    super(...arguments)
    this.name = "locale"
  }

  async init(e, t: EngineContext) {
    const n = await t.market.waitForData(SettingsData)
    this._languageCode = (function (e, t = getValFromURL("lang", "")) {
      const n = getLanguage(),
        i = (0, Me.$)("SESSvl", ""),
        s = null != i ? i : "",
        r = "" === s || -1 !== s.search(/^en/),
        a = t || (e ? (r ? n : s) : n)
      return (0, Ue.i)(a)
    })(e.isLoggedIn, n.getOverrideParam("lang", ""))
    const locale = this._languageCode.substr(0, 2)
    this.polyglot = new Polyglot({
      locale,
      interpolation: {
        prefix: "%{",
        suffix: "}"
      },
      // onMissingKey: e => (this.log.warn("Missing phrase key:" + e), LocaleModule.missingPrefix + e)
      onMissingKey: e => e
    })
    const r = (await t.getModuleBySymbol(SettingsSymbol)).getProperty("assetBasePath")
    const l = await (async (e, t, n = "./", i = "json") => {
      //pw
      // const s = await De(e, t, n, i)
      // if (e === o.k$) return s
      // const r = await De(o.k$, t, n, i)
      const s = {}
      const r = {}
      return Object.assign(Object.assign({}, r), s)
    })(this._languageCode, e.queue, r)
    this.polyglot.extend(l)
    this.localizeUnitsDisplay()
    this.registerSettings(t)
  }

  t(e, t?) {
    return this.polyglot.t(e, t)
  }

  T(e, t, n = "PLUGIN_KEYS", i) {
    const s = t ? `${n}.${Ve(t)}.${e}` : `${n}.${Ve(e)}`
    return this.has(s)
      ? this.t(s, i)
      : t
        ? t
            .replace(/-/g, " ")
            .split(" ")
            .filter(e => e.length > 0)
            .map(e => e[0].toUpperCase() + e.substr(1).toLowerCase())
            .join(" ")
        : this.t(s, i)
  }

  has(e) {
    return this.polyglot.has(e)
  }

  get languageCode() {
    return this._languageCode
  }

  localizeUnitsDisplay() {
    ;(0, He.cL)({
      unitsDisplayFeetSymbol: this.t(PhraseKey.UNITS_DISPLAY.FEET_SYMBOL),
      unitsDisplayInchesSymbol: this.t(PhraseKey.UNITS_DISPLAY.INCHES_SYMBOL),
      unitsDisplayHalfSpace: this.t(PhraseKey.UNITS_DISPLAY.HALF_SPACE),
      unitsDisplayFeet: this.t(PhraseKey.UNITS_DISPLAY.FEET),
      unitsDisplayInches: this.t(PhraseKey.UNITS_DISPLAY.INCHES),
      unitsDisplayMeters: this.t(PhraseKey.UNITS_DISPLAY.METERS),
      unitsDisplaySquareFeet: this.t(PhraseKey.UNITS_DISPLAY.SQUARE_FEET),
      unitsDisplaySquareMeters: this.t(PhraseKey.UNITS_DISPLAY.SQUARE_METERS),
      dimensionsSeparator: this.t(PhraseKey.UNITS_DISPLAY.DIMENSIONS_SEPARATOR)
    })
  }

  async registerSettings(e) {
    const setting = await e.getModuleBySymbol(SettingsSymbol)
    setting.registerSetting("Locale", o.Zs, this.languageCode, !1)
  }
}
LocaleModule.missingPrefix = "FIX-"
