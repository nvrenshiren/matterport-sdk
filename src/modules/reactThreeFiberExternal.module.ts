import { Vector2, Vector3 } from "three"
import { InputSymbol, ReactThreeFiberExternal, WebglRendererSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { createSubscription } from "../core/subscription"
import { InputClickerEndEvent } from "../events/click.event"
import { OnMouseDownEvent, OnMoveEvent } from "../events/mouse.event"
import { PixelRatioChangedMessage } from "../message//webgl.message"
import { SetCameraDimensionsMessage } from "../message/camera.message"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { Comparator } from "../utils/comparator"
declare global {
  interface SymbolModule {
    [ReactThreeFiberExternal]: ReactThreeFiberExternalModule
  }
}
const m = new Vector2()
class p {
  constructor(e, t) {
    ;(this.inputIni = e),
      (this.rendererModule = t),
      (this.registrations = new Map()),
      (this.hovered = new Map()),
      (this.checkPointerLeave = () => {
        if (this.hovered.size) {
          const e = v(this.inputIni.getCurrentRayHits())
          this.hovered.forEach((t, i) => {
            var n, s, a, o, r, d
            if (!e.find(e => e.object === i)) {
              this.hovered.delete(i)
              const c = Object.assign(Object.assign({}, t), { intersections: e })
              null === (a = null === (n = i.__r3f) || void 0 === n ? void 0 : (s = n.handlers).onPointerOut) || void 0 === a || a.call(s, c),
                null === (d = null === (o = i.__r3f) || void 0 === o ? void 0 : (r = o.handlers).onPointerLeave) || void 0 === d || d.call(r, c)
            }
          })
        }
      }),
      (this.checkPointerMissed = () => {
        var e, t, i
        const n = new Set(this.inputIni.getCurrentRayHits().map(e => e.object))
        for (const s of this.registrations.keys())
          n.has(s) ||
            null === (i = null === (e = s.__r3f) || void 0 === e ? void 0 : (t = e.handlers).onPointerMissed) ||
            void 0 === i ||
            i.call(t, new MouseEvent("click", this.lastPointerUp.nativeEvent))
      }),
      (this.handlers = [
        this.initMeshHandlers(),
        e.registerUnfilteredHandler(OnMoveEvent, this.checkPointerLeave),
        e.registerUnfilteredHandler(InputClickerEndEvent, this.checkPointerMissed),
        e.registerUnfilteredHandler(OnMouseDownEvent, e => {
          e.down ? (this.lastPointerDown = e) : (this.lastPointerUp = e)
        })
      ])
  }
  dispose() {
    ;[...this.handlers, ...this.registrations.values()].forEach(e => e.cancel())
  }
  registerObject3D(e) {
    const t = this.registrations.get(e)
    if (t) return t
    const i = createSubscription(
      () => {
        this.registrations.set(e, i),
          this.inputIni.registerMesh(
            e,
            !1,
            t =>
              (function (e) {
                let t = e
                for (; t && !g(t); ) t = t.parent
                return t
              })(t) === e
          )
      },
      () => {
        this.registrations.delete(e), this.hovered.delete(e), this.inputIni.unregisterMesh(e)
      },
      !1
    )
    return i.renew(), i
  }
  initMeshHandlers() {
    const e = new WeakMap(),
      t = (t, i, n) => {
        var s, a, o, d, c, u, p, y, f, w, b, T
        let C = null
        for (let e = i; e; e = e.parent) g(e) && (C || (C = [])).push(e)
        if (!C) return !1
        const E = this.rendererModule.getCamera(),
          D = new Vector2(t.position.x, t.position.y)
        let x
        n || (n = e.get(i) || {})
        let A = 0
        if (t instanceof InputClickerEndEvent) {
          const { x: e, y: t } = this.lastPointerDown.clientPosition,
            { x: i, y: n } = this.lastPointerUp.clientPosition
          ;(A = m.set(i - e, n - t).length()), (x = new MouseEvent("click", this.lastPointerUp.nativeEvent))
        } else x = t.nativeEvent
        const S = v(this.inputIni.getCurrentRayHits()),
          P = {}
        for (const e in x) "function" != typeof x[e] && (P[e] = x[e])
        const O = Object.assign(Object.assign(Object.assign({}, P), n), {
          intersections: S,
          camera: E,
          delta: A,
          eventObject: i,
          nativeEvent: x,
          sourceEvent: x,
          pointer: D,
          ray: this.inputIni.getCurrentPointerRay(),
          stopPropagation: () => {
            ;(O.stopped = !0), this.handleStopPropagation(O.eventObject, S), t.stopPropagation(), t.preventDefault()
          },
          stopped: !1,
          unprojectedPoint: new Vector3(D.x, D.y, 0).unproject(E),
          spaceX: D.x,
          spaceY: D.y
        })
        for (const i of C) {
          e.set(i, n)
          const r = i.__r3f
          if (
            r &&
            g(i) &&
            ((O.eventObject = i),
            t instanceof OnMouseDownEvent
              ? t.down
                ? null === (a = (s = r.handlers).onPointerDown) || void 0 === a || a.call(s, O)
                : null === (d = (o = r.handlers).onPointerUp) || void 0 === d || d.call(o, O)
              : t instanceof OnMoveEvent
                ? (this.hovered.has(i) ||
                    (this.hovered.set(i, O),
                    null === (u = (c = r.handlers).onPointerOver) || void 0 === u || u.call(c, O),
                    null === (y = (p = r.handlers).onPointerEnter) || void 0 === y || y.call(p, O)),
                  null === (w = (f = r.handlers).onPointerMove) || void 0 === w || w.call(f, O))
                : t instanceof InputClickerEndEvent && (null === (T = (b = r.handlers).onClick) || void 0 === T || T.call(b, O)),
            O.stopped)
          )
            return !0
        }
        return !1
      },
      i = [OnMouseDownEvent, OnMoveEvent, InputClickerEndEvent]
    return new AggregateSubscription(...i.map(e => this.inputIni.registerMeshHandler(e, Comparator.isAny(), t)))
  }
  handleStopPropagation(e, t) {
    if (this.hovered.has(e)) {
      const i = t.findIndex(t => t.object === e)
      if (i > -1) {
        const e = []
        for (let n = i + 1; n < t.length; n++)
          for (let i = t[n].object; i; i = i.parent) {
            const t = this.hovered.get(i)
            t && e.push({ obj: i, origEvent: t })
          }
        e.forEach(({ obj: e, origEvent: i }) => {
          var n, s, a
          const o = Object.assign(Object.assign({}, i), { intersections: t, eventObject: e })
          this.hovered.delete(e)
          const r = null === (n = e.__r3f) || void 0 === n ? void 0 : n.handlers
          null === (s = null == r ? void 0 : r.onPointerOut) || void 0 === s || s.call(r, o),
            null === (a = null == r ? void 0 : r.onPointerLeave) || void 0 === a || a.call(r, o)
        })
      }
    }
  }
}
function g(e) {
  const t = e.__r3f
  return !!t && (t.hasOwnProperty("eventCount") ? (t.eventCount || 0) > 0 : t.handlers && Object.keys(t.handlers).length > 0)
}
function v(e) {
  const t = new Set()
  return e.filter(e => {
    const i = t.has(e.object)
    return t.add(e.object), !i
  })
}
export default class ReactThreeFiberExternalModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "react-three-fiber-external"),
      (this.onPlayerResized = e => {
        var t
        null === (t = this.externalCallbacks) || void 0 === t || t.onSizeChange(e.width, e.height)
      }),
      (this.onPixelRatioChanged = e => {
        var t
        null === (t = this.externalCallbacks) || void 0 === t || t.onPixelRatioChange(e.pixelRatio)
      })
  }
  async init(e, t) {
    this.bindings.push(t.subscribe(SetCameraDimensionsMessage, this.onPlayerResized), t.subscribe(PixelRatioChangedMessage, this.onPixelRatioChanged))
    const [i, n] = await Promise.all([t.getModuleBySymbol(InputSymbol), t.getModuleBySymbol(WebglRendererSymbol)])
    ;(this.rendererModule = n), (this.eventsAdapter = new p(i, n))
  }
  dispose(e) {
    this.eventsAdapter.dispose(), super.dispose(e)
  }
  onUpdate(e) {
    var t
    null === (t = this.externalCallbacks) || void 0 === t || t.onFrame()
  }
  registerExternalR3F(e) {
    if (this.externalCallbacks) throw new Error("registerExternalR3F called twice")
    return (
      (this.externalCallbacks = e),
      {
        renderer: this.rendererModule.threeRenderer,
        scene: this.rendererModule.getScene().scene,
        camera: this.rendererModule.getCamera(),
        registerMeshEvents: e => this.eventsAdapter.registerObject3D(e)
      }
    )
  }
}
