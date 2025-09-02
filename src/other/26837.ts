import * as s from "react"
import * as i from "react/jsx-runtime"
import useSWR, { SWRConfig } from "swr"

var ie = {
  DEFAULT: "https://support.matterport.com/",
  MODEL_ARCHIVED: "https://support.matterport.com/s/article/What-is-an-Active-or-Archived-Space",
  MODEL_COMPLIANCE: "https://support.matterport.com/s/article/Matterport-IP-restrictions",
  MODEL_DELETED: "https://support.matterport.com/s/article/Restoring-a-Deleted-Space",
  MODEL_FAILED: "https://support.matterport.com/s/article/Why-did-my-model-fail-in-processing",
  MODEL_NOT_AVAILABLE: "https://support.matterport.com/s/article/Oops-Model-Not-Available",
  MODEL_PENDING: "https://support.matterport.com/s/article/How-to-Upload-Your-Model?parentCategoryLabel=#pending",
  MODEL_PROCESSING: "https://support.matterport.com/s/article/How-long-does-a-model-take-to-process",
  SYSTEM_REQUIREMENTS: "https://support.matterport.com/s/article/Workshop-System-Requirements"
}
const se = "images/matterport-logo.svg"
export const ErrorText = {
  ACCOUNT_INACTIVE: "unavailable.account_inactive",
  GENERIC: "generic",
  INTERNAL_ERROR: "internal.error",
  MODEL_ARCHIVED: "unavailable.archived",
  MODEL_COMPLIANCE: "unavailable.compliance",
  MODEL_CORRUPT: "model.corrupt",
  MODEL_FAILED: "model.failed",
  MODEL_DELETED: "unavailable.gone",
  MODEL_PENDING: "unavailable.pending",
  MODEL_PROCESSING: "unavailable.processing",
  MODEL_RESTRICTED: "unavailable.restricted",
  NOT_FOUND: "not.found",
  PASSWORD_REQUIRED: "password.required",
  REQUEST_INVALID: "request.invalid",
  WEBGL_CONTEXT_LOST: "webgl.context_lost",
  WEBGL_GENERIC: "webgl.generic",
  WEBGL_UNSUPPORTED: "webgl.unsupported"
}

import de from "classnames"
const oe = {
    errorCode: ErrorText.GENERIC,
    t: e => e
  },
  le = (0, s.createContext)(oe)

import * as Ge from "cross-fetch"
import * as Ue from "graphql/language/parser"
import * as Fe from "graphql/language/printer"
import * as ue from "./84426"
import { PhraseKey } from "../const/phrase.const"
import { isMac, isMobilePhone } from "../utils/browser.utils"
const he = "_34E0-iX67r3fxMYKpDS-LJ",
  pe = "Z1ocZiFDSwXUXSZNFwIi8",
  me = "_11Rym6ylpu0sbbOCJkNfJC",
  fe = "_3iEZMhcELmSuAqtL-7BpzG",
  ge = "Emzp6rf1HTBNzdM8roDMz"
function ve({ brandIcon: e, children: t, title: n }) {
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        "data-testid": "error_message",
        className: de(he, {
          [ge]: !!e
        })
      },
      {
        children: [
          e &&
            (0, i.jsx)(ue.Vr, {
              name: e,
              theme: "dark",
              className: fe
            }),
          (0, i.jsxs)(
            "div",
            Object.assign(
              {
                className: pe
              },
              {
                children: [
                  (0, i.jsx)("header", {
                    children: (0, i.jsx)(
                      "h1",
                      Object.assign(
                        {
                          "data-testid": "error_title",
                          className: me
                        },
                        {
                          children: n
                        }
                      )
                    )
                  }),
                  t
                ]
              }
            )
          )
        ]
      }
    )
  )
}
const ye = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsx)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.GENERIC_TITLE)
        },
        {
          children: (0, i.jsx)("p", {
            "data-testid": "error_helptext",
            dangerouslySetInnerHTML: {
              __html: e(PhraseKey.OOPS.GENERIC_HELPTEXT, {
                url: ie.MODEL_NOT_AVAILABLE
              })
            }
          })
        }
      )
    )
  },
  be = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsx)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.MODEL_ARCHIVED_TITLE),
          brandIcon: "twinmaker"
        },
        {
          children: (0, i.jsx)("p", {
            "data-testid": "error_helptext",
            dangerouslySetInnerHTML: {
              __html: e(PhraseKey.OOPS.MODEL_ARCHIVED_HELPTEXT, {
                url: ie.MODEL_ARCHIVED
              })
            }
          })
        }
      )
    )
  },
  Ee = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsx)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.MODEL_COMPLIANCE_TITLE),
          brandIcon: "compliance-training"
        },
        {
          children: (0, i.jsx)("p", {
            "data-testid": "error_helptext",
            dangerouslySetInnerHTML: {
              __html: e(PhraseKey.OOPS.MODEL_COMPLIANCE_HELPTEXT, {
                url: ie.MODEL_COMPLIANCE
              })
            }
          })
        }
      )
    )
  },
  Se = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsx)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.MODEL_DELETED_TITLE)
        },
        {
          children: (0, i.jsxs)(
            "p",
            Object.assign(
              {
                "data-testid": "error_helptext"
              },
              {
                children: [
                  (0, i.jsx)(
                    "a",
                    Object.assign(
                      {
                        href: ie.MODEL_DELETED,
                        target: "_blank"
                      },
                      {
                        children: e(PhraseKey.LEARN_MORE)
                      }
                    )
                  ),
                  "."
                ]
              }
            )
          )
        }
      )
    )
  },
  Oe = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsx)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.MODEL_FAILED_TITLE)
        },
        {
          children: (0, i.jsx)("p", {
            "data-testid": "error_helptext",
            dangerouslySetInnerHTML: {
              __html: e(PhraseKey.OOPS.MODEL_FAILED_HELPTEXT, {
                url: ie.MODEL_FAILED
              })
            }
          })
        }
      )
    )
  },
  Te = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsx)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.MODEL_PENDING_TITLE),
          brandIcon: "delay"
        },
        {
          children: (0, i.jsx)("p", {
            "data-testid": "error_helptext",
            dangerouslySetInnerHTML: {
              __html: e(PhraseKey.OOPS.MODEL_PENDING_HELPTEXT, {
                url: ie.MODEL_PENDING
              })
            }
          })
        }
      )
    )
  },
  _e = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsx)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.MODEL_PROCESSING_TITLE),
          brandIcon: "process-data"
        },
        {
          children: (0, i.jsx)("p", {
            "data-testid": "error_helptext",
            dangerouslySetInnerHTML: {
              __html: e(PhraseKey.OOPS.MODEL_PROCESSING_HELPTEXT, {
                url: ie.MODEL_PROCESSING
              })
            }
          })
        }
      )
    )
  },
  we = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsx)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.WEBGL_CONTEXT_LOST_TITLE)
        },
        {
          children: (0, i.jsx)("p", {
            "data-testid": "error_helptext",
            dangerouslySetInnerHTML: {
              __html: e(PhraseKey.OOPS.WEBGL_CONTEXT_LOST_HELPTEXT, {
                url: ie.DEFAULT
              })
            }
          })
        }
      )
    )
  }
const Ne = "images/chrome.png",
  Ie = "images/edge.png",
  Pe = "images/firefox.png",
  xe = "images/safari.png",
  ke = "_2RCe0qUX4FJuECaH3ROiLK",
  Le = "_2w7mP81olGOrlCzO9k7-C4",
  Ce = () =>
    (0, i.jsxs)(
      "ul",
      Object.assign(
        {
          className: ke,
          "data-testid": "browser_list"
        },
        {
          children: [
            (0, i.jsx)("li", {
              children: (0, i.jsx)(
                "a",
                Object.assign(
                  {
                    href: "https://www.google.com/chrome/browser/",
                    target: "_blank"
                  },
                  {
                    children: (0, i.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "tile"
                        },
                        {
                          children: (0, i.jsx)("img", {
                            src: Ne,
                            alt: "Chrome",
                            width: "35",
                            height: "35",
                            className: Le
                          })
                        }
                      )
                    )
                  }
                )
              )
            }),
            (0, i.jsx)("li", {
              children: (0, i.jsx)(
                "a",
                Object.assign(
                  {
                    href: "https://www.mozilla.org/en-US/firefox/new/",
                    target: "_blank"
                  },
                  {
                    children: (0, i.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "tile"
                        },
                        {
                          children: (0, i.jsx)("img", {
                            src: Pe,
                            alt: "Firefox",
                            width: "35",
                            height: "35",
                            className: Le
                          })
                        }
                      )
                    )
                  }
                )
              )
            }),
            (0, i.jsx)("li", {
              children: (0, i.jsx)(
                "a",
                Object.assign(
                  {
                    href: "https://www.microsoft.com/en-us/edge",
                    target: "_blank"
                  },
                  {
                    children: (0, i.jsx)(
                      "div",
                      Object.assign(
                        {
                          className: "tile"
                        },
                        {
                          children: (0, i.jsx)("img", {
                            src: Ie,
                            alt: "Edge",
                            width: "35",
                            height: "35",
                            className: Le
                          })
                        }
                      )
                    )
                  }
                )
              )
            }),
            isMac() &&
              (0, i.jsx)("li", {
                children: (0, i.jsx)(
                  "a",
                  Object.assign(
                    {
                      href: "https://support.apple.com/en-us/HT204416",
                      target: "_blank"
                    },
                    {
                      children: (0, i.jsx)(
                        "div",
                        Object.assign(
                          {
                            className: "tile"
                          },
                          {
                            children: (0, i.jsx)("img", {
                              src: xe,
                              alt: "Safari",
                              width: "35",
                              height: "35",
                              className: Le
                            })
                          }
                        )
                      )
                    }
                  )
                )
              })
          ]
        }
      )
    ),
  De = () => {
    const { t: e } = (0, s.useContext)(le),
      t = !isMobilePhone(),
      n = e(PhraseKey.OOPS.WEBGL_GENERIC_HELPTEXT, {
        url: ie.DEFAULT
      })
    return (0, i.jsxs)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.WEBGL_GENERIC_TITLE)
        },
        {
          children: [
            (0, i.jsx)("p", {
              "data-testid": "error_helptext",
              dangerouslySetInnerHTML: {
                __html: n
              }
            }),
            t && (0, i.jsx)(Ce, {})
          ]
        }
      )
    )
  },
  Re = () => {
    const { t: e } = (0, s.useContext)(le)
    return (0, i.jsxs)(
      ve,
      Object.assign(
        {
          title: e(PhraseKey.OOPS.WEBGL_UNSUPPORTED_TITLE)
        },
        {
          children: [
            (0, i.jsx)("p", {
              "data-testid": "error_helptext",
              dangerouslySetInnerHTML: {
                __html: e(PhraseKey.OOPS.WEBGL_UNSUPPORTED_HELPTEXT, {
                  url: ie.SYSTEM_REQUIREMENTS
                })
              }
            }),
            (0, i.jsx)(Ce, {})
          ]
        }
      )
    )
  },
  Me = ({ errorCode: e }) =>
    e === ErrorText.MODEL_ARCHIVED
      ? (0, i.jsx)(be, {})
      : e === ErrorText.MODEL_COMPLIANCE
        ? (0, i.jsx)(Ee, {})
        : e === ErrorText.MODEL_DELETED
          ? (0, i.jsx)(Se, {})
          : e === ErrorText.MODEL_FAILED
            ? (0, i.jsx)(Oe, {})
            : e === ErrorText.MODEL_PENDING
              ? (0, i.jsx)(Te, {})
              : e === ErrorText.MODEL_PROCESSING
                ? (0, i.jsx)(_e, {})
                : e === ErrorText.WEBGL_CONTEXT_LOST
                  ? (0, i.jsx)(we, {})
                  : e === ErrorText.WEBGL_GENERIC
                    ? (0, i.jsx)(De, {})
                    : e === ErrorText.WEBGL_UNSUPPORTED
                      ? (0, i.jsx)(Re, {})
                      : (0, i.jsx)(ye, {}),
  je = JSON
const He = e => {
    let t
    const n = e.definitions.filter(e => "OperationDefinition" === e.kind)
    return 1 === n.length && (t = n[0]?.name?.value), t
  },
  Be = e => {
    if ("string" == typeof e) {
      let t
      try {
        const n = (0, Ue.parse)(e)
        t = He(n)
      } catch (e) {}
      return {
        query: e,
        operationName: t
      }
    }
    const t = He(e)
    return {
      query: (0, Fe.print)(e),
      operationName: t
    }
  }
class Ve extends Error {
  constructor(e, t) {
    super(
      `${Ve.extractMessage(e)}: ${JSON.stringify({
        response: e,
        request: t
      })}`
    ),
      Object.setPrototypeOf(this, Ve.prototype),
      (this.response = e),
      (this.request = t),
      "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, Ve)
  }
  static extractMessage(e) {
    return e.errors?.[0]?.message ?? `GraphQL Error (Code: ${e.status})`
  }
}
const We = Ge.default.length
const ze = e => {
    let t = {}
    return (
      e &&
        (("undefined" != typeof Headers && e instanceof Headers) || (We && Ge.Headers && e instanceof Ge.Headers)
          ? (t = (e => {
              const t = {}
              return (
                e.forEach((e, n) => {
                  t[n] = e
                }),
                t
              )
            })(e))
          : Array.isArray(e)
            ? e.forEach(([e, n]) => {
                e && void 0 !== n && (t[e] = n)
              })
            : (t = e)),
      t
    )
  },
  $e = e => e.replace(/([\s,]|#[^\n\r]+)+/g, " ").trim(),
  Ke = e => async t => {
    const { url: n, query: i, variables: s, operationName: r, fetch: a, fetchOptions: o, middleware: l } = t,
      c = {
        ...t.headers
      }
    let d,
      u = ""
    "POST" === e
      ? ((d = Qe(i, s, r, o.jsonSerializer)), "string" == typeof d && (c["Content-Type"] = "application/json"))
      : (u = (e => {
          if (!Array.isArray(e.query)) {
            const t = e,
              n = [`query=${encodeURIComponent($e(t.query))}`]
            return (
              e.variables && n.push(`variables=${encodeURIComponent(t.jsonSerializer.stringify(t.variables))}`),
              t.operationName && n.push(`operationName=${encodeURIComponent(t.operationName)}`),
              n.join("&")
            )
          }
          if (void 0 !== e.variables && !Array.isArray(e.variables)) throw new Error("Cannot create query with given variable type, array expected")
          const t = e,
            n = e.query.reduce(
              (e, n, i) => (
                e.push({
                  query: $e(n),
                  variables: t.variables ? t.jsonSerializer.stringify(t.variables[i]) : void 0
                }),
                e
              ),
              []
            )
          return `query=${encodeURIComponent(t.jsonSerializer.stringify(n))}`
        })({
          query: i,
          variables: s,
          operationName: r,
          jsonSerializer: o.jsonSerializer ?? je
        }))
    const h = {
      method: e,
      headers: c,
      body: d,
      ...o
    }
    let p = n,
      m = h
    if (l) {
      const e = await Promise.resolve(
          l({
            ...h,
            url: n,
            operationName: r,
            variables: s
          })
        ),
        { url: t, ...i } = e
      ;(p = t), (m = i)
    }
    return u && (p = `${p}?${u}`), await a(p, m)
  }
class Ye {
  constructor(e, t = {}) {
    ;(this.url = e),
      (this.requestConfig = t),
      (this.rawRequest = async (...e) => {
        const [t, n, i] = e,
          s = ((e, t, n) =>
            e.query
              ? e
              : {
                  query: e,
                  variables: t,
                  requestHeaders: n,
                  signal: void 0
                })(t, n, i),
          { headers: r, fetch: a = Ge, method: o = "POST", requestMiddleware: l, responseMiddleware: c, ...d } = this.requestConfig,
          { url: u } = this
        void 0 !== s.signal && (d.signal = s.signal)
        const { operationName: h } = Be(s.query)
        return qe({
          url: u,
          query: s.query,
          variables: s.variables,
          headers: {
            ...ze(Je(r)),
            ...ze(s.requestHeaders)
          },
          operationName: h,
          fetch: a,
          method: o,
          fetchOptions: d,
          middleware: l
        })
          .then(e => (c && c(e), e))
          .catch(e => {
            throw (c && c(e), e)
          })
      })
  }
  async request(e, ...t) {
    const [n, i] = t,
      s = ((e, t, n) =>
        e.document
          ? e
          : {
              document: e,
              variables: t,
              requestHeaders: n,
              signal: void 0
            })(e, n, i),
      { headers: r, fetch: a = Ge, method: o = "POST", requestMiddleware: l, responseMiddleware: c, ...d } = this.requestConfig,
      { url: u } = this
    void 0 !== s.signal && (d.signal = s.signal)
    const { query: h, operationName: p } = Be(s.document)
    return qe({
      url: u,
      query: h,
      variables: s.variables,
      headers: {
        ...ze(Je(r)),
        ...ze(s.requestHeaders)
      },
      operationName: p,
      fetch: a,
      method: o,
      fetchOptions: d,
      middleware: l
    })
      .then(e => (c && c(e), e.data))
      .catch(e => {
        throw (c && c(e), e)
      })
  }
  batchRequests(e, t) {
    const n = ((e, t) =>
        e.documents
          ? e
          : {
              documents: e,
              requestHeaders: t,
              signal: void 0
            })(e, t),
      { headers: i, ...s } = this.requestConfig
    void 0 !== n.signal && (s.signal = n.signal)
    const r = n.documents.map(({ document: e }) => Be(e).query),
      a = n.documents.map(({ variables: e }) => e)
    return qe({
      url: this.url,
      query: r,
      variables: a,
      headers: {
        ...ze(Je(i)),
        ...ze(n.requestHeaders)
      },
      operationName: void 0,
      fetch: this.requestConfig.fetch ?? Ge,
      method: this.requestConfig.method || "POST",
      fetchOptions: s,
      middleware: this.requestConfig.requestMiddleware
    })
      .then(e => (this.requestConfig.responseMiddleware && this.requestConfig.responseMiddleware(e), e.data))
      .catch(e => {
        throw (this.requestConfig.responseMiddleware && this.requestConfig.responseMiddleware(e), e)
      })
  }
  setHeaders(e) {
    return (this.requestConfig.headers = e), this
  }
  setHeader(e, t) {
    const { headers: n } = this.requestConfig
    return (
      n
        ? (n[e] = t)
        : (this.requestConfig.headers = {
            [e]: t
          }),
      this
    )
  }
  setEndpoint(e) {
    return (this.url = e), this
  }
}
const qe = async e => {
  const { query: t, variables: n, fetchOptions: i } = e,
    s = Ke((e.method ?? "post").toUpperCase())
  const r = Array.isArray(e.query),
    a = await s(e),
    o = await Xe(a, i.jsonSerializer ?? je),
    l = Array.isArray(o) ? !o.some(({ data: e }) => !e) : Boolean(o.data),
    c = Array.isArray(o) || !o.errors || (Array.isArray(o.errors) && !o.errors.length) || "all" === i.errorPolicy || "ignore" === i.errorPolicy
  if (a.ok && c && l) {
    const { errors: e, ...t } = (Array.isArray(o), o),
      n = "ignore" === i.errorPolicy ? t : o
    return {
      ...(r
        ? {
            data: n
          }
        : n),
      headers: a.headers,
      status: a.status
    }
  }
  throw new Ve(
    {
      ...("string" == typeof o
        ? {
            error: o
          }
        : o),
      status: a.status,
      headers: a.headers
    },
    {
      query: t,
      variables: n
    }
  )
}
async function Ze(e, t, ...n) {
  const i = ((e, t, ...n) => {
    const [i, s] = n
    return e.document
      ? e
      : {
          url: e,
          document: t,
          variables: i,
          requestHeaders: s,
          signal: void 0
        }
  })(e, t, ...n)
  return new Ye(i.url).request({
    ...i
  })
}
const Qe = (e, t, n, i) => {
    const s = i ?? je
    if (!Array.isArray(e))
      return s.stringify({
        query: e,
        variables: t,
        operationName: n
      })
    if (void 0 !== t && !Array.isArray(t)) throw new Error("Cannot create request body with given variable type, array expected")
    const r = e.reduce(
      (e, n, i) => (
        e.push({
          query: n,
          variables: t ? t[i] : void 0
        }),
        e
      ),
      []
    )
    return s.stringify(r)
  },
  Xe = async (e, t) => {
    let n
    return (
      e.headers.forEach((e, t) => {
        "content-type" === t.toLowerCase() && (n = e)
      }),
      n &&
      (n.toLowerCase().startsWith("application/json") ||
        n.toLowerCase().startsWith("application/graphql+json") ||
        n.toLowerCase().startsWith("application/graphql-response+json"))
        ? t.parse(await e.text())
        : e.text()
    )
  },
  Je = e => ("function" == typeof e ? e() : e),
  et = ((e, ...t) => e.reduce((e, n, i) => `${e}${n}${i in t ? String(t[i]) : ""}`, ""))`
  query GetCurrentUser {
    currentSession {
      currentUser {
        id
        email
        firstName
        lastName
      }
    }
  }
`,
  tt = async ({ apiHost: e }) => {
    var t
    const n = `${e}/api/mp/accounts/graph`,
      i = await Ze(n, et),
      s = null === (t = null == i ? void 0 : i.currentSession) || void 0 === t ? void 0 : t.currentUser
    if (null == s ? void 0 : s.id)
      return {
        id: s.id,
        email: s.email || "",
        firstName: s.firstName || "",
        lastName: s.lastName || ""
      }
  },
  nt = "_1s2P0b_rDArxJRHGRYrU44",
  it = "_20IzbQl3zqg35KIQFsa4WP",
  st = "_2AlbqSOlIQU8EmVnuR2X4O",
  rt = ({ firstName: e, lastName: t, email: n }) => {
    const s = `${(null == e ? void 0 : e[0]) || ""}${(null == t ? void 0 : t[0]) || ""}`
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          "data-testid": "user_pill",
          className: it
        },
        {
          children: [
            (0, i.jsx)(
              "span",
              Object.assign(
                {
                  "data-testid": "user_avatar",
                  className: st
                },
                {
                  children: s
                }
              )
            ),
            (0, i.jsx)("span", {
              children: n
            })
          ]
        }
      )
    )
  },
  at = () => {
    const { t: e } = (0, s.useContext)(le),
      { user: t } = (() => {
        const { apiHost: e } = (0, s.useContext)(le),
          {
            isLoading: t,
            error: n,
            data: i
          } = useSWR(["CurrentUser"], () =>
            tt({
              apiHost: e
            })
          )
        return {
          isAuthenticated: !!i && !n,
          isLoading: t,
          user: i
        }
      })()
    return t
      ? (0, i.jsxs)(
          "div",
          Object.assign(
            {
              "data-testid": "user_info",
              className: nt
            },
            {
              children: [
                e(PhraseKey.OOPS.SIGNED_IN_AS),
                (0, i.jsx)(rt, {
                  firstName: t.firstName,
                  lastName: t.lastName,
                  email: t.email
                })
              ]
            }
          )
        )
      : null
  },
  ot = "_1Ivh0w_sChfeFim3NtTJtk",
  lt = "_3QJZ1aNmbRTroO8BwQpEnU",
  ct = "z6oc6QGfbwob2SMpLbhKn",
  dt = "_3aydo-8p6riD09OMJ2-wd",
  ut = ({ errorCode: e }) =>
    (0, i.jsxs)(
      "section",
      Object.assign(
        {
          "data-testid": "error_page",
          className: ot
        },
        {
          children: [
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: lt
                },
                {
                  children: (0, i.jsx)(Me, {
                    errorCode: e
                  })
                }
              )
            ),
            (0, i.jsxs)(
              "footer",
              Object.assign(
                {
                  className: ct
                },
                {
                  children: [
                    (0, i.jsx)(
                      "a",
                      Object.assign(
                        {
                          href: "https://matterport.com",
                          target: "_blank"
                        },
                        {
                          children: (0, i.jsx)("img", {
                            src: se,
                            alt: "Matterport logo",
                            width: "178",
                            height: "30",
                            className: dt
                          })
                        }
                      )
                    ),
                    (0, i.jsx)(at, {})
                  ]
                }
              )
            )
          ]
        }
      )
    )

export function ErrorUI({ apiHost: e, errorCode: t = ErrorText.GENERIC, t: n = e => e }) {
  const s = {
    apiHost: e,
    errorCode: t,
    t: n
  }
  return (0, i.jsx)(SWRConfig, {
    children: (0, i.jsx)(
      le.Provider,
      Object.assign(
        {
          value: s
        },
        {
          children: (0, i.jsx)(ut, {
            errorCode: t
          })
        }
      )
    )
  })
}
