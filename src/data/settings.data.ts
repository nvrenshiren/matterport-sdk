import { Data } from "../core/data"
import { OverrideParams, SettingsDataProperties } from "../interface/settings.interface"
import { ChangeObserver } from "../observable/observable"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
import { lsSetItem } from "../utils/localstorage.utils"
import { toJSONParams } from "../utils/urlParams.utils"

export class SettingsData extends Data {
  overrideParams: Partial<OverrideParams>
  name = "settings"
  properties: ObservableMap<any>
  constructor(e: Partial<OverrideParams> = {}) {
    super()
    this.overrideParams = e
    this.name = "settings"
    this.properties = createObservableMap()
  }
  setProperty<T extends keyof SettingsDataProperties = keyof SettingsDataProperties>(e: T, t: SettingsDataProperties[T]) {
    const n = this.properties.get(e)
    ;(null != t && n === t) || (this.properties.set(e, t), this.commit([e]))
  }

  setLocalStorageProperty<T extends keyof SettingsDataProperties = keyof SettingsDataProperties>(e: T, t: SettingsDataProperties[T]) {
    lsSetItem(e, t)
    this.setProperty(e, t)
  }
  hasProperty(e: string) {
    return this.properties.has(e)
  }
  tryGetProperty<T extends keyof SettingsDataProperties = keyof SettingsDataProperties>(e: T, t: SettingsDataProperties[T]): SettingsDataProperties[T] {
    return this.hasProperty(e) ? this.properties.get(e) : t
  }
  getProperty<T extends keyof SettingsDataProperties = keyof SettingsDataProperties>(e: T): SettingsDataProperties[T] {
    if (this.hasProperty(e)) return this.properties.get(e)
    throw new Error("SettingsData: " + e + " not found")
  }
  getOverrideParam<T extends keyof OverrideParams = keyof OverrideParams>(e: T, t: any = null, n = typeof t): OverrideParams[T] {
    return toJSONParams(this.overrideParams[e] || null, t, n)
  }
  iterate(e: Function) {
    for (const t of this.properties.keys) e(t, this.getProperty(t as keyof SettingsDataProperties))
  }
  //@ts-ignore
  onPropertyChanged<K extends keyof (SettingsData & SettingsDataProperties)>(name: K, t: ChangeObserver<(SettingsData & SettingsDataProperties)[K]>) {
    //@ts-ignore
    return super.onPropertyChanged(name, t)
  }
  notifyPropertyObserver(observer, key) {
    observer(this.properties.get(key))
  }
}
