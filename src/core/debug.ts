declare global {
  interface Window {
    navigationStart: number
  }
}
const startTime = window.navigationStart || Date.now()
export enum DebugLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}
export class DebugInfo {
  static level = DebugLevel.INFO
  timers: Record<string, number> = {}
  handlers = { [DebugLevel.DEBUG]: console.debug, [DebugLevel.INFO]: console.info, [DebugLevel.WARN]: console.warn, [DebugLevel.ERROR]: console.error }
  prefix: string
  constructor(filePath: string) {
    const name = filePath.split(new RegExp("/|\\\\"))
    this.prefix = "[" + name[name.length - 1].replace(".js", "") + "]"
  }
  message(level: DebugLevel) {
    if (DebugInfo.level >= level && console) {
      return (this.handlers[level] ? this.handlers[level] : console.log).bind(console, this.getPrefix())
    }
    return () => {}
  }
  get debug() {
    return this.message(DebugLevel.DEBUG)
  }
  get devInfo() {
    return () => {}
  }
  get debugInfo() {
    return this.debug
  }
  get debugWarn() {
    return this.message(DebugInfo.level >= DebugLevel.DEBUG ? DebugLevel.WARN : DebugLevel.DEBUG)
  }
  get info() {
    return this.message(DebugLevel.INFO)
  }
  get warn() {
    return this.message(DebugLevel.WARN)
  }
  get error() {
    return this.message(DebugLevel.ERROR)
  }
  time(key: string) {
    DebugInfo.level >= DebugLevel.DEBUG && (this.timers[key] = Date.now())
  }
  timeEnd(key: string) {
    if (DebugInfo.level >= DebugLevel.DEBUG) {
      const old = this.timers[key]
      if (!old) return
      const space = (Date.now() - old) / 1000
      this.debug(key, space + "s")
    }
  }
  getPrefix() {
    const space = (Date.now() - startTime) / 1000 + "s"
    return `${this.prefix} ${space}`
  }
}
