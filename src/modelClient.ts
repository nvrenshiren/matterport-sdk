import { ApolloClient, ApolloError, ApolloLink, InMemoryCache, Observable, createHttpLink } from "@apollo/client"
import { print } from "graphql/language/printer"
import { __rest } from "tslib"
import * as o from "./other/18448"
import { graphServer } from "./const/mds.const"
import { DebugInfo } from "./core/debug"
import { MdsReadError, MdsUploadError, MdsWriteError } from "./error/mdsRead.error"
import { setAuthHeader } from "./utils/authHeader.utils"

const ModelApiClientDebugInfo = new DebugInfo("model-api-client")

export class ModelClient {
  graphUrl: string
  apollo: ApolloClient<any>
  static version: string
  constructor(e: { baseUrl?: string; server?: string; url?: string } = {}) {
    const baseUrl = e.baseUrl || window.location.origin
    const server = e.server || graphServer
    this.graphUrl = e.url || `${baseUrl}${server}`
    ModelApiClientDebugInfo.debug(`Initialized Model API client for ${this.graphUrl}`)
    const httpLink = createHttpLink({
      uri: this.graphUrl,
      fetch: (e, t) => {
        const { operationName } = JSON.parse(t!.body as string)
        //pw
        // return fetch(`${e}/${n}?operation=${n}`, t)
        return fetch(`${e}?operation=${operationName}`, t)
      }
    })
    var setHeader = (e, { headers: t = {} }) => {
      setAuthHeader(this.graphUrl, t)
      return {
        headers: t
      }
    }
    const apolloLink = new ApolloLink((e, t) => {
      var n = __rest(e, [])
      return new Observable(i => {
        var s
        Promise.resolve(n)
          .then(t => {
            return setHeader(t, e.getContext())
          })
          .then(e.setContext)
          .then(() => {
            s = t(e).subscribe({
              next: i.next.bind(i),
              error: i.error.bind(i),
              complete: i.complete.bind(i)
            })
          })
          .catch(i.error.bind(i))
        return () => {
          s && s.unsubscribe()
        }
      })
    })

    this.apollo = new ApolloClient({
      link: apolloLink.concat(httpLink),
      cache: new InMemoryCache()
    })
  }
  async query(e, t, n = {}) {
    const i = Object.assign(
      Object.assign(
        {
          errorPolicy: "all"
        },
        n
      ),
      {
        query: e,
        variables: t,
        fetchPolicy: "no-cache"
      }
    )
    return (
      this.apollo
        //@ts-ignore
        .query(i)
        .then(e => {
          const { data, errors } = e
          return {
            data,
            errors
          }
        })
        .catch(e => {
          ModelApiClientDebugInfo.error(e)
          throw new MdsReadError(e, this.getApolloErrorCode(e))
        })
    )
  }
  async mutate(e, t, n = {}) {
    const i = Object.assign(
      Object.assign(
        {
          errorPolicy: "all"
        },
        n
      ),
      {
        mutation: e,
        variables: t
      }
    )
    return (
      this.apollo
        //@ts-ignore
        .mutate(i)
        .then(e => {
          const { data: t, errors: n } = e
          return {
            data: t,
            errors: n
          }
        })
        .catch(e => {
          throw (ModelApiClientDebugInfo.error(e), new MdsWriteError(e, this.getApolloErrorCode(e)))
        })
    )
  }
  async upload(e, t, n, i?, s?) {
    const r = {}
    let a = 0
    ;(0, o.y)(n, (e, t, n) => {
      if (e && (i = e).filename && i.blob && i.blob instanceof Blob) {
        const i = "file" + a++
        ;(r[i] = e), (n[t] = `multipart:${i}`)
      }
      var i
    })
    const l = new FormData()
    //@ts-ignore
    for (const [e, t] of Object.entries(r)) l.append(e, t.blob, t.filename)
    l.append("query", print(e))
    l.append("operation", t)
    l.append("variables", JSON.stringify(n))
    const u = setAuthHeader(this.graphUrl, {})
    return this.uploadFormData(l, u, i, s).then((e: any) => {
      if (!ModelClient.isOk(e)) {
        const t = ModelClient.getErrorCode(e) || "54200"
        throw new MdsUploadError(ModelClient.getErrorMessage(e), t)
      }
      return e
    })
  }
  getApolloErrorCode(e) {
    if (e instanceof ApolloError) {
      const n = e.networkError?.["statusCode"]
      if (n) return `61${n}`
    }
    return "61000"
  }
  async uploadFormData(e, t, n, i = new XMLHttpRequest()) {
    i.open("POST", this.graphUrl, !0), (i.responseType = "json"), i.setRequestHeader("Accept", "application/json"), n && (i.upload.onprogress = n)
    for (const e in t) i.setRequestHeader(e, t[e])
    return new Promise((t, n) => {
      ;(i.onreadystatechange = () => {
        4 === i.readyState && (200 === i.status ? t(i.response) : 0 !== i.status && n(new MdsUploadError(`${i.status} ${i.statusText}`, `54${i.status}`)))
      }),
        (i.onerror = () => {
          n(new MdsUploadError("Network error", "54002"))
        }),
        (i.onabort = () => {
          ModelApiClientDebugInfo.info("upload canceled!")
        }),
        i.send(e)
    })
  }
  static isOk(e, t?: string) {
    if (t) {
      const n = t.split(".")
      return (
        0 ===
        (e.errors || []).filter(e => {
          if (!e.path) return !0
          for (let t = 0; t < Math.min(e.path.length, n.length); t++) if (e.path[t] !== n[t]) return !1
          return !0
        }).length
      )
    }
    return !e?.errors || 0 === e.errors.length
  }
  static getErrorCode({ errors: e }) {
    return e?.[0]?.extensions?.code || ""
  }
  static getErrorMessage({ errors: e }) {
    let t = ""
    Array.isArray(e) && ((t = e[0]?.message || e[0]?.toString()), e.length > 1 && (t += ` (+${e.length - 1})`))
    return t
  }
}
ModelClient.version = "2020.05.28"
