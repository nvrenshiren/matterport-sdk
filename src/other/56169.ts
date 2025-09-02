import * as c from "./41404"
import * as u from "./76721"
import * as n from "../const/54165"
import { DebugInfo } from "../core/debug"
import { toISOString } from "../utils/date.utils"
import { lsGetItem, lsSetItem } from "../utils/localstorage.utils"
import { randomUUID } from "../utils/random.utils"

const SegmentDebugInfo = new DebugInfo("segment")
const LogAnalyticsDebugInfo = new DebugInfo("log-analytics")
const MpAnalyticsDebugInfo = new DebugInfo("mp-analytics")
const AjsAnonymousId = "ajs_anonymous_id"
const ScAnonymousId = "sc_anonymous_id"
const f = {
  [n.K.Segment]: {
    class: class {
      constructor(e) {
        ;(this.token = e), (this.endpointType = n.K.Segment), (this.options = {})
      }
      init(e, t) {
        return (
          this.setOptions(e),
          (this.context = t),
          this.token
            ? (window.analytics && window.analytics.initialize && (window.analytics = null),
              window.analytics ||
                (function () {
                  var e = (window.analytics = window.analytics || [])
                  if (!e.initialize)
                    if (e.invoked) window.console && console.error && console.error("Segment snippet included twice.")
                    else {
                      ;(e.invoked = !0),
                        (e.methods = [
                          "trackSubmit",
                          "trackClick",
                          "trackLink",
                          "trackForm",
                          "pageview",
                          "identify",
                          "reset",
                          "group",
                          "track",
                          "ready",
                          "alias",
                          "debug",
                          "page",
                          "once",
                          "off",
                          "on",
                          "addSourceMiddleware",
                          "addIntegrationMiddleware",
                          "setAnonymousId",
                          "addDestinationMiddleware"
                        ]),
                        (e.factory = function (t) {
                          return function () {
                            var i = Array.prototype.slice.call(arguments)
                            return i.unshift(t), e.push(i), e
                          }
                        })
                      for (var t = 0; t < e.methods.length; t++) {
                        var i = e.methods[t]
                        e[i] = e.factory(i)
                      }
                      ;(e.load = function (t, i) {
                        var n = document.createElement("script")
                        ;(n.type = "text/javascript"),
                          (n.async = !0),
                          (n.src =
                            ("https:" === document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js")
                        var s = document.getElementsByTagName("script")[0]
                        s.parentNode.insertBefore(n, s), (e._loadOptions = i)
                      }),
                        (e.SNIPPET_VERSION = "4.15.2")
                    }
                })(),
              window.analytics.load(this.token),
              new Promise((e, t) => {
                window.analytics.ready(e)
              }))
            : Promise.resolve()
        )
      }
      identify(e) {
        window.analytics.identify(e.id, { first_name: e.firstName, last_name: e.lastName, email: e.email })
      }
      track(e, t, i) {
        DebugInfo.level >= 3 && SegmentDebugInfo.debug(e, t ? JSON.stringify(t).replace('\\"', '"') : t), (t = Object.assign(t || {}, this.options))
        const n = this.context.integrations ? Object.assign({}, this.context.integrations) : {}
        n.Intercom = !!i
        try {
          window.analytics.track(e, t, Object.assign(Object.assign({}, this.context), { integrations: n }))
        } catch (t) {
          SegmentDebugInfo.error(`Failed to send data to segment for ${e}`)
        }
      }
      trackAsync(e, t, i) {
        if (((t = t || {}), navigator.sendBeacon))
          try {
            navigator.sendBeacon(
              "https://api.segment.io/v1/t",
              JSON.stringify({
                event: e,
                anonymousId: window.analytics.user().anonymousId(),
                properties: Object.assign({ data: t }, this.options),
                integrations: { Intercom: !!i },
                writeKey: this.token,
                sentAt: Date.now(),
                type: "track",
                context: this.context
              })
            )
          } catch (e) {
            SegmentDebugInfo.error("Failed to send async segment request")
          }
      }
      setOptions(e) {
        Object.assign(this.options, e)
      }
    },
    key: "segment_key",
    url: null
  },
  [n.K.Logging]: {
    class: class {
      init(e, t) {
        return LogAnalyticsDebugInfo.debug("logging analytics to console", { options: e, context: t }), Promise.resolve()
      }
      identify(e) {
        LogAnalyticsDebugInfo.debug("identify as", e)
      }
      track(e, t, i) {
        LogAnalyticsDebugInfo.debug({ eventName: e, data: t, intercom: i })
      }
      trackAsync(e, t, i) {
        LogAnalyticsDebugInfo.debug({ eventName: e, data: t, intercom: i })
      }
      setOptions(e) {
        LogAnalyticsDebugInfo.debug("set options", e)
      }
    },
    key: null,
    url: null
  },
  [n.K.Matterport]: {
    class: class {
      constructor(e, t, i) {
        ;(this.token = e),
          (this.url = t),
          (this.queue = i),
          (this.options = {}),
          (this.segmentStylePayload = (e, t, i) => ({
            timestamp: toISOString(new Date()),
            integrations: { Intercom: !!i },
            context: this.segmentStyleContext(this.context),
            properties: t,
            event: e,
            messageId: randomUUID(),
            anonymousId: this.anonymousId,
            type: "track",
            userId: this.user ? this.user.id : null,
            sentAt: toISOString(new Date())
          })),
          (this.segmentStyleContext = e => {
            const t = {
              page: {
                path: window.location.pathname,
                referrer: (0, u.an)(),
                search: window.location.search,
                title: window.document.title,
                url: window.location.href
              },
              userAgent: navigator.userAgent,
              library: { name: "JMYDCase", version: "1" },
              campaign: {}
            }
            return Object.assign(Object.assign({}, e), t)
          })
        const n = lsGetItem(ScAnonymousId)
        if (n) this.anonymousId = n
        else {
          const e = (0, c.$)(AjsAnonymousId)
          ;(this.anonymousId = e && "string" == typeof e ? e.replace(/%22/g, "") : randomUUID()), lsSetItem(ScAnonymousId, this.anonymousId)
        }
        this.headers = { "X-API-Key": this.token, "Content-Type": "application/json", Accept: "application/json" }
      }
      init(e, t) {
        return (
          this.setOptions(e),
          (this.context = t),
          MpAnalyticsDebugInfo.debug("init", { options: this.options, context: this.segmentStyleContext(this.context) }),
          Promise.resolve()
        )
      }
      identify(e) {
        MpAnalyticsDebugInfo.debug("identify as", e), (this.user = e)
      }
      track(e, t, i) {
        DebugInfo.level >= 3 && MpAnalyticsDebugInfo.debug(e, t ? JSON.stringify(t).replace('\\"', '"') : t), (t = Object.assign(t || {}, this.options))
        const n = this.segmentStylePayload(e, t, i)
        // this.queue.post(this.url, { body: n, headers: this.headers })
      }
      trackAsync(e, t, i) {
        if (((t = Object.assign(t || {}, this.options)), navigator.sendBeacon))
          try {
            const n = this.segmentStylePayload(e, t, i)
            navigator.sendBeacon(`${this.url}?api_key=${this.token}`, JSON.stringify(n))
          } catch (e) {
            MpAnalyticsDebugInfo.error("Failed to sendBeacon analytics request")
          }
      }
      setOptions(e) {
        Object.assign(this.options, e)
      }
    },
    key: "analytics_mp_key",
    url: "analytics_mp_url"
  }
}
export const H = f
