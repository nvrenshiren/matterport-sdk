import { SesSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { Module } from "../core/module"
import { setAuthHeader } from "../utils/authHeader.utils"
import "ses"
declare global {
  interface SymbolModule {
    [SesSymbol]: SesModule
  }
}

function n(e, t) {
  return fetch(e, Object.assign(Object.assign({}, t), { credentials: "omit" }))
}

function a(e, t) {
  const i = e instanceof Request ? e.url : e,
    s = setAuthHeader(i, {})
  return fetch(e, Object.assign(Object.assign({}, t), { headers: Object.assign(Object.assign({}, null == t ? void 0 : t.headers), s) }))
}

const h = [
  1 / 0,
  Array,
  ArrayBuffer,
  Boolean,
  DataView,
  Date,
  Error,
  EvalError,
  Float32Array,
  Float64Array,
  Function,
  Int8Array,
  Int16Array,
  Int32Array,
  JSON,
  Map,
  Math,
  NaN,
  Number,
  Object,
  Promise,
  Proxy,
  RangeError,
  ReferenceError,
  Reflect,
  RegExp,
  Set,
  String,
  SyntaxError,
  TypeError,
  URIError,
  Uint8Array,
  Uint8ClampedArray,
  Uint16Array,
  Uint32Array,
  WeakMap,
  WeakSet,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  escape,
  eval,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  unescape,
  XMLHttpRequest,
  Headers,
  HTMLIFrameElement,
  Document,
  HTMLDocument,
  HTMLCanvasElement,
  DOMException,
  URLSearchParams,
  ResizeObserver
]

class l {
  originalSetFunc: (e, t) => void
  originalClearFunc: (e) => void
  disposed: boolean
  ids: Set<any>

  constructor(e, t) {
    this.originalSetFunc = e
    this.originalClearFunc = t
    this.disposed = !1
    this.ids = new Set()
  }

  setFunc(e, t) {
    if (this.disposed) return -1
    const i = this.originalSetFunc(() => e(), t)
    this.ids.add(i)
    return i
  }

  clearFunc(e) {
    !this.disposed && this.ids.has(e) && (this.ids.delete(e), this.originalClearFunc(e))
  }

  dispose() {
    if (!this.disposed) {
      this.disposed = !0
      for (const e of this.ids) this.originalClearFunc(e)
      this.ids.clear()
    }
  }
}

const d = function (e) {
  Object.freeze(e)
  Object.getOwnPropertyNames(e).forEach(function (t) {
    const i = Object.getOwnPropertyDescriptor(e, t)
    ;(null == i ? void 0 : i.value) && "object" == typeof i?.value && d(i?.value)
  })
  return e
}
export default class SesModule extends Module {
  overlayElement: HTMLDivElement | null
  frozen: boolean
  constructor() {
    super(...arguments)
    this.overlayElement = null
    this.name = "SesModule"
    this.frozen = !1
  }

  freezeForStrict() {
    if (!this.frozen) {
      for (const e of h) d(e)
      this.frozen = !0
    }
  }

  async init(e) {
    // await import("ses")
    globalThis.process && (globalThis.process.on = () => {})
    this.overlayElement = e.overlayRoot
  }

  async makeSecureEnvironment(e, t, i, s) {
    if (!this.overlayElement) return this.log.warn("Not creating a secure env due to missing overlay element"), null
    if (t.startsWith("http") || (t.startsWith("//") && window.location.href.match(/^https?:/)))
      try {
        const e = await fetch(t)
        t = await e.text()
      } catch (e) {
        return this.log.warn("There was an error retrieving the plugin source."), null
      }
    let r = this.overlayElement.querySelector(`.${e}`)
    r && this.overlayElement.removeChild(r)
    r = document.createElement("div")
    r.classList.add("plugin-root-element")
    r.classList.add(e)
    this.overlayElement.appendChild(r)
    const h = r.attachShadow({ mode: "closed" }),
      d = new DebugInfo(`plugin ${e}`)
    Object.freeze(d)
    const c = new l(
        (e, t) => window.setInterval(e, t),
        e => window.clearInterval(e)
      ),
      u = new l(
        (e, t) => window.setTimeout(e, t),
        e => window.clearTimeout(e)
      ),
      m = {
        log: (...e) => d.info(...e),
        error: (...e) => d.error(...e),
        info: (...e) => d.info(...e),
        warn: (...e) => d.warn(...e),
        time: e => d.time(e),
        timeEnd: e => d.timeEnd(e)
      }

    function p(e, t) {
      return c.setFunc(e, t)
    }

    function g(e) {
      return c.clearFunc(e)
    }

    function y(e, t) {
      return u.setFunc(e, t)
    }

    function f(e) {
      return u.clearFunc(e)
    }

    const v = {
        setInterval: p,
        clearInterval: g,
        setTimeout: y,
        clearTimeout: f,
        console: m,
        window: {
          setInterval: p,
          clearInterval: g,
          setTimeout: y,
          clearTimeout: f,
          console: m,
          parent: {
            postMessage(e, t, i) {
              "string" == typeof t ? window.parent.postMessage(e, t, i) : window.parent.postMessage(e, t)
            }
          }
        }
      },
      w = Object.assign(Object.assign({}, v.window), {
        HTMLIFrameElement: HTMLIFrameElement,
        location: { href: "" },
        document: document,
        getComputedStyle: getComputedStyle.bind(globalThis),
        parent: window.parent
      }),
      M = Object.assign(Object.assign({}, v), {
        window: w,
        HTMLIFrameElement: HTMLIFrameElement,
        Document: Document,
        HTMLDocument: HTMLDocument,
        HTMLCanvasElement: HTMLCanvasElement,
        DOMException: DOMException,
        URLSearchParams: URLSearchParams,
        ResizeObserver: ResizeObserver,
        Error: Error,
        Headers: Headers,
        DOMMatrix: DOMMatrix,
        DOMMatrixReadOnly: DOMMatrixReadOnly,
        document: document,
        navigator: { userAgent: navigator.userAgent, language: navigator.language },
        overlaySlot: () => h,
        notifyEvent(t, i) {
          ;((t, i) => {
            s.set(e.split("-").slice(1).join("-"), { name: t, eventData: i })
          })(t, i)
        }
      })
    if (i.canFetch) {
      const e = i.canFetchAsUser ? a : n
      w.fetch = e
      M.fetch = e
      M.XMLHttpRequest = XMLHttpRequest
    }
    if (i.canStoreLocal) {
      let e
      for (e of [M, w])
        (e.indexedDB = indexedDB),
          (e.IDBKeyRange = IDBKeyRange),
          (e.IDBTransaction = IDBTransaction),
          (e.IDBDatabase = IDBDatabase),
          (e.IDBObjectStore = IDBObjectStore),
          (e.IDBIndex = IDBIndex),
          (e.IDBCursor = IDBCursor),
          (e.IDBCursorWithValue = IDBCursorWithValue),
          (e.IDBRequest = IDBRequest),
          (e.IDBOpenDBRequest = IDBOpenDBRequest),
          (e.IDBVersionChangeEvent = IDBVersionChangeEvent),
          (e.IDBFactory = IDBFactory)
    }
    const { strict: b } = i,
      D = new Compartment(b ? v : M)
    D.evaluate(t, b ? void 0 : { __evadeImportExpressionTest__: !0, __evadeHtmlCommentTest__: !0 })
    let S = !1
    return {
      compartment: D,
      overlayElement: this.overlayElement,
      dispose: () => {
        !S && ((S = !0), this.overlayElement?.removeChild(r), c.dispose(), u.dispose())
      }
    }
  }
}
