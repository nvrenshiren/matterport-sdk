import { setAuthHeader } from "../utils/authHeader.utils"
import { array2Json } from "../utils/func.utils"

enum HttpMethod {
  DELETE = "DELETE",
  GET = "GET",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT"
}

class a extends class {
  constructor() {
    this._options = { responseType: "json" }
  }
  get options() {
    const t = this._options
    return (t.headers = setAuthHeader(this.url, this._options.headers || {})), t
  }
} {
  constructor(t) {
    super(), (this.config = t), (this.url = t.path)
  }
  async read() {
    const { deserialize: t } = this.config
    let e = null
    return (
      this.config.cachedData && this.config.cachedData.data
        ? (e = this.config.cachedData.data)
        : ((e = await this.config.queue.get(this.config.path, this.options)), this.config.cachedData && (this.config.cachedData.data = e)),
      t(e)
    )
  }
  clearCache() {
    this.config.cachedData && (this.config.cachedData.data = null)
  }
}
class r extends a {
  constructor(t) {
    super(t), (this.config = t), (this.acceptsPartial = !1), (this.config.batchUpdate = "batchUpdate" in this.config && this.config.batchUpdate)
  }
  async create(t) {
    throw Error("Not implemented")
  }
  updateBatch(t, e) {
    const { serialize: i } = this.config,
      o = [],
      n = [...new Set([...Object.keys(t), ...Object.keys(e)])]
    for (const i of n) {
      t[i] || e[i] || o.push(this.config.queue.delete(`${this.config.path}/${i}`, this.options))
    }
    const a = i(t, e),
      r = Object.assign(Object.assign({}, this.options), { body: a })
    return o.push(this.config.queue.request(this.config.httpMethod || HttpMethod.POST, this.config.path, r)), Promise.all(o)
  }
  updateInternal(t, e) {
    const { serialize: i } = this.config,
      n = [],
      a = Object.assign({}, this.options),
      r = Object.keys(t),
      h = Object.keys(e),
      c = array2Json(r.concat(h))
    for (const o in c) {
      const r = c[o],
        h = t[r] || e[r]
      if (h) {
        const t = {}
        t[r] = h
        const o = {},
          c = e[r]
        c && (o[r] = c)
        const l = i(t, o)
        ;(a.body = l), n.push(this.config.queue.request(this.config.httpMethod || HttpMethod.POST, this.config.path, a))
      } else n.push(this.config.queue.delete(`${this.config.path}/${r}`, this.options))
    }
    return Promise.all(n)
  }
  async update(t, e?) {
    this.clearCache(), await (this.config.batchUpdate ? this.updateBatch(t, e || {}) : this.updateInternal(t, e || {}))
  }
  async delete(t) {
    throw Error("Not implemented")
  }
}

export const MU = r
