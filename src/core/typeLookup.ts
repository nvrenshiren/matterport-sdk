import { randomUUID } from "../utils/random.utils"
import { Command } from "./command"
import { Data } from "./data"
import { Message } from "./message"
import { Module } from "./module"
import { Event } from "./event"
export const getClassName = e => e.prototype.constructor.name
export const getClassConstructor = e => e.constructor as Function
export const getKey = e => {
  if ("string" == typeof e) return e
  if (e && e.name) return e.name
  const t = e.toString()
  return t.substring(0, t.indexOf("\n")).split(" ")[1]
}
export type ClassModule = typeof Module | typeof Data | typeof Command | typeof Message | typeof Event | Function
export type ClassModuleInstance = Module | Data | Command | Message | Event
export class TypeLookup {
  typeLookupMap: Record<string, ClassModule>
  classUuids: WeakMap<ClassModule, string>
  constructor() {
    this.typeLookupMap = {}
    this.classUuids = new WeakMap()
  }
  getKey(e: ClassModule) {
    if ("string" == typeof e) return e
    {
      let t = this.classUuids.get(e)
      return t || ((t = e.name + randomUUID()), this.classUuids.set(e, t)), t
    }
  }
  addType(e: ClassModule) {
    if (!e) throw Error("Cannot index undefined type")
    const t = this.getKey(e)
    if (this.typeLookupMap[t]) throw Error(`Type ${t} already registered`)
    return (this.typeLookupMap[t] = e), t
  }
  getKeyByType(e: ClassModule, t?: boolean) {
    if (!e) throw Error("Cannot index undefined type")
    const n = this.getKey(e)
    let i = this.typeLookupMap[n]
    return !i && t && ((i = e), this.addType(i)), i ? n : ""
  }
  getKeyByInstance(e: ClassModuleInstance, t?: boolean) {
    if (!e) throw Error("Cannot index undefined data")
    const n = this.getKey(e.constructor)
    let i = this.typeLookupMap[n]
    return !i && t && ((i = e.constructor), this.addType(i)), i ? n : ""
  }
  getTypeByKey(e: string) {
    const t = this.typeLookupMap[e]
    if (!t) throw Error("Key not found")
    if ("string" == typeof t) throw Error("non type keyed result not supported")
    return t
  }
  getKnownTypes() {
    return Object.values(this.typeLookupMap)
  }
}
