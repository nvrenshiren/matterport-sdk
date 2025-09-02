declare global {
  const XDomainRequest: typeof XMLHttpRequest
}

export enum HttpPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  HIGHEST = 3
}
enum HttpStatus {
  PENDING = 0,
  SENDING = 1,
  FAILED = 2,
  DONE = 3
}
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS"
}

const requestQueue = new WeakMap<Request, Function>()
export class RequestManager {
  totalBytesDownloaded: number
  queue: Request[]
  retries: number
  concurrency: number
  updateTimeout: number | null
  constructor(config: { retries?: number; concurrency?: number } = {}) {
    this.totalBytesDownloaded = 0
    this.queue = []
    this.retries = config.retries || 0
    this.concurrency = config.concurrency || 6
  }
  get<T = any>(url: string, config: Partial<RequestConfig>) {
    return this.request<T>(HttpMethod.GET, url, config)
  }
  head<T = any>(url: string, config: Partial<RequestConfig>) {
    return this.request<T>(HttpMethod.HEAD, url, config)
  }
  options<T = any>(url: string, config: Partial<RequestConfig>) {
    return this.request<T>(HttpMethod.OPTIONS, url, config)
  }
  post<T = any>(url: string, config: Partial<RequestConfig>) {
    return this.request<T>(HttpMethod.POST, url, config)
  }
  put<T = any>(url: string, config: Partial<RequestConfig>) {
    return this.request<T>(HttpMethod.PUT, url, config)
  }
  patch<T = any>(url: string, config: Partial<RequestConfig>) {
    return this.request<T>(HttpMethod.PATCH, url, config)
  }
  delete<T = any>(url: string, config: Partial<RequestConfig>) {
    return this.request<T>(HttpMethod.DELETE, url, config)
  }
  request<T = any>(method: HttpMethod, url: string, config: Partial<RequestConfig>) {
    const req = new Request<T>(method, url, config)
    if (config?.signal) {
      const Aborted = () => {
        this.queue.includes(req) && (req.status === HttpStatus.SENDING && req.abort(), this.dequeue(req), req.onFail(new DOMException("Aborted", "AbortError")))
      }
      config.signal.addEventListener("abort", Aborted)
      requestQueue.set(req, () => {
        config.signal?.removeEventListener("abort", Aborted)
        requestQueue.delete(req)
      })
    }
    this.enqueue(req)
    return req.promise
  }
  update() {
    let e: Request | null
    for (; (e = this.getNextPendingRequest()); ) this.sendRequest(e)
    for (; (e = this.getNextOverflowingGet()); ) e.abort(), (e.status = HttpStatus.PENDING)
    this.updateTimeout = null
  }
  enqueue(req: Request) {
    let t = 0
    for (t = 0; t < this.queue.length; t++) {
      if (this.queue[t].priority < req.priority) break
    }
    this.queue.splice(t, 0, req),
      this.updateTimeout ||
        (this.updateTimeout = window.setTimeout(() => {
          this.update()
        }, 1))
  }
  dequeue(req: Request) {
    requestQueue.get(req)?.()
    const i = this.queue.indexOf(req)
    if (-1 === i) throw new Error("Can't dequeue request not in queue")
    this.queue.splice(i, 1)
    this.update()
  }
  getNextPendingRequest() {
    for (let e = 0; e < this.queue.length && e < this.concurrency; e++) {
      const t = this.queue[e]
      if (t.status === HttpStatus.PENDING) return t
    }
    return null
  }
  getNextOverflowingGet() {
    for (let e = this.concurrency; e < this.queue.length; e++) {
      const t = this.queue[e]
      if (t.status === HttpStatus.SENDING && t.priority !== HttpPriority.HIGHEST && "GET" === t.method) return t
    }
    return null
  }
  static doNotRetryStatusCodes = { 400: !0, 401: !0, 403: !0, 404: !0, 405: !0, 406: !0, 410: !0, 411: !0, 414: !0, 415: !0, 421: !0, 431: !0, 451: !0 }
  shouldRetryStatusCode(e) {
    return !RequestManager.doNotRetryStatusCodes[e]
  }
  sendRequest(req: Request) {
    req.status = HttpStatus.SENDING
    req
      .send()
      .then(t => {
        req.status = HttpStatus.DONE
        this.dequeue(req)
        req.contentLength && req.contentLength > 0 && (this.totalBytesDownloaded += Number(req.contentLength))
        req.onDone(t)
      })
      .catch(t => {
        const i = req.maxRetries || this.retries
        let n = req.sendAttempts < i
        if ("object" == typeof t) {
          const e = t.status_code || 0
          n = n && this.shouldRetryStatusCode(e)
        }
        n
          ? ((req.status = HttpStatus.PENDING), this.update(), console.warn(`Retried ${req.url}`), console.warn(t))
          : ((req.status = HttpStatus.FAILED), this.dequeue(req), console.warn(`Failed ${req.url}`), req.onFail(t))
      })
  }
}
interface RequestConfig {
  auth: Request["auth"]
  withCredentials: Request["withCredentials"]
  priority: HttpPriority
  responseType: Request["responseType"]
  body: Request["body"]
  headers: Request["headers"]
  maxRetries: Request["maxRetries"]
  onProgress: Request["onProgress"]
  signal: AbortSignal
}
class Request<T = any> {
  status: HttpStatus
  sendAttempts: number
  contentLength: number
  isAborting: boolean
  url: string
  method: HttpMethod
  auth: string | null
  withCredentials: boolean
  priority: HttpPriority
  responseType: string | null
  body: any
  headers: Record<string, string>
  maxRetries: number | null
  onProgress: XMLHttpRequestEventTarget["onprogress"]
  onDone: (value: T) => void
  xhr: XMLHttpRequest
  onFail: (reason?: any) => void
  promise: Promise<T>
  constructor(method: HttpMethod, url: string, config: Partial<RequestConfig> = {}) {
    const {
      auth = null,
      withCredentials = false,
      priority = HttpPriority.MEDIUM,
      responseType = null,
      body = null,
      headers = {},
      maxRetries = null,
      onProgress = null
    } = config
    this.sendAttempts = 0
    this.status = HttpStatus.PENDING
    this.contentLength = 0
    this.isAborting = !1
    this.url = url
    this.method = method
    this.auth = auth
    this.withCredentials = withCredentials
    this.priority = priority
    this.responseType = responseType
    this.body = body
    this.headers = headers
    this.maxRetries = maxRetries
    this.onProgress = onProgress
    this.promise = new Promise((resolve, reject) => {
      this.onDone = resolve
      this.onFail = reject
    })
  }
  send() {
    if ("undefined" != typeof XMLHttpRequest) {
      this.xhr = new XMLHttpRequest()
      this.xhr.withCredentials = this.withCredentials
    } else {
      if ("undefined" == typeof XDomainRequest) throw new Error("No XMLHTTPRequest or XDomainRequest... are you trying to run me in node? :(")
      this.xhr = new XDomainRequest()
    }
    this.xhr.open(this.method, this.url, !0)
    if (this.responseType) {
      if ("arraybuffer" === this.responseType || "text" === this.responseType || "json" === this.responseType || "blob" === this.responseType) {
        this.xhr.responseType = this.responseType
      } else {
        if ("image" !== this.responseType) throw new Error('reponseType can only be one of "arraybuffer", "text", "json", "blob", "image"')
        this.xhr.responseType = "blob"
      }
    }
    "json" === this.responseType && this.xhr.setRequestHeader("Accept", "application/json")
    this.auth && this.xhr.setRequestHeader("Authorization", this.auth)
    for (var i in this.headers) this.xhr.setRequestHeader(i, this.headers[i])

    if ("object" == typeof this.body && !(this.body instanceof FormData)) {
      this.body = JSON.stringify(this.body)
      this.xhr.setRequestHeader("Content-Type", "application/json")
    }
    this.xhr.onprogress = this.onProgress || null
    return new Promise((resolve, reject) => {
      this.xhr.onreadystatechange = async () => {
        if (4 === this.xhr.readyState) {
          if ([200, 201, 204].includes(this.xhr.status))
            return this.parseResponse(this.xhr).then(e => {
              resolve(e)
            })
          if (!this.isAborting) {
            return this.parseResponse(this.xhr)
              .then(t => {
                reject(Object.assign({ status_code: this.xhr.status }, t))
              })
              .catch(() => {
                reject({ status_code: this.xhr.status })
              })
          }

          this.isAborting = !1
        }
      }
      this.xhr.onerror = e => {
        reject(e)
      }
      this.xhr.send(this.body)
      this.sendAttempts++
    })
  }
  parseResponse(xml: XMLHttpRequest) {
    return new Promise((resolve, reject) => {
      try {
        if (!xml) throw new Error(`No request received. Trying ${this.method} on ${this.url} and expecting ${this.responseType}, but request was ${this.xhr}`)
        let i = xml.response
        this.contentLength = parseInt(xml.getResponseHeader("Content-Length") || "0", 10)
        if ("json" === this.responseType && "object" != typeof i) resolve(JSON.parse(xml.responseText))
        else if ((200 !== xml.status && 201 !== xml.status && 204 !== xml.status) || "image" !== this.responseType) resolve(i)
        else {
          const src = URL.createObjectURL(i)
          i = new Image()
          i.onload = function () {
            URL.revokeObjectURL(src)
            resolve(i)
          }
          i.src = src
          i.crossOrigin = "Anonymous"
        }
      } catch (e) {
        reject({ error: "Payload was not valid JSON" })
      }
    })
  }
  abort() {
    if (null === this.xhr) throw new Error("Cannot abort unsent Request")
    this.isAborting = !0
    this.xhr.abort()
  }
}
