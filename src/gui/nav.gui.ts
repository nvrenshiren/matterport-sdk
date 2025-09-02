import { Intersection } from "three"
import { MeshQuerySymbol, NavigationSymbol, SettingsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { TransitionFactor } from "../const/transition.const"
import Engine from "../core/engine"
import { ISubscription } from "../core/subscription"
import { CameraData } from "../data/camera.data"
import { PointerData } from "../data/pointer.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { checkLerpThreshold } from "../math/2569"
import MeshQueryModule from "../modules/meshQuery.module"
import { NavigationWalk, PositionTracker } from "../modules/navigation.module"
import { getSweepByDirection, getSweepByIntersection } from "../webgl/20043"
import { GUIDraw } from "../webgl/gui.draw"
class NavigationVisuals {
  engine: Engine
  dynamicNumber: PositionTracker
  smoothWalk: NavigationWalk
  active: boolean
  draw: GUIDraw
  meshQuery: MeshQueryModule
  subscription: ISubscription
  constructor(e, t, i) {
    this.engine = e
    this.dynamicNumber = t
    this.smoothWalk = i
    this.active = !1
    this.draw = new GUIDraw()
    Promise.all([
      this.engine.getModuleBySymbol(WebglRendererSymbol),
      this.engine.market.waitForData(PointerData),
      this.engine.getModuleBySymbol(MeshQuerySymbol),
      this.engine.market.waitForData(SettingsData)
    ]).then(([e, t, i, s]) => {
      this.meshQuery = i
      this.draw.setStyle({ assetBasePath: s.getProperty("assetBasePath") || "" })
      this.draw.addToScene(e.getScene())
      this.subscription = t.onChanged(() => this.update(this.draw, t))
      this.subscription.cancel()
    })
    this.engine.getModuleBySymbol(SettingsSymbol).then(e => {
      const t = "Navigation"
      ;[
        { header: t, setting: "navDebugEnabled", initialValue: () => this.active, onChange: e => this.toggle(e), urlParam: !0 },
        {
          header: t,
          setting: "Max transition dist",
          initialValue: () => TransitionFactor.longerTransitionMaxDist,
          range: [3, 50],
          rangePrecision: 1,
          onChange: e => (TransitionFactor.longerTransitionMaxDist = e)
        },
        {
          header: t,
          setting: "accel",
          initialValue: () => this.dynamicNumber.acceleration,
          range: [1, 60],
          rangePrecision: 0.5,
          onChange: e => {
            this.dynamicNumber.setAccel(e)
          }
        },
        {
          header: t,
          setting: "top speed",
          initialValue: () => this.dynamicNumber.maxSpeed,
          range: [1, 40],
          rangePrecision: 0.5,
          onChange: e => this.dynamicNumber.setMaxSpeed(e)
        },
        {
          header: t,
          setting: "queue ms",
          initialValue: () => this.smoothWalk.repeatedQueueDelayMS,
          range: [0, 1e3],
          onChange: e => (this.smoothWalk.repeatedQueueDelayMS = e)
        }
      ].forEach(t => e.registerMenuEntry(t))
    })
  }
  toggle(e: boolean) {
    this.active !== e && (e || this.draw.toggleAll(!1), e || this.subscription?.cancel(), e && this.subscription?.renew(), (this.active = e))
  }
  update(e: GUIDraw, t: PointerData) {
    const i = this.engine.market.tryGetData(SweepsData)
    const s = this.engine.market.tryGetData(CameraData)
    const o = this.engine.market.tryGetData(ViewmodeData)
    if (e && i && s && o) {
      e.toggleAll(!1)
      t.hit &&
        this.meshQuery.floorIdFromObject(t.hit.object) &&
        (o.isInside() ? visPanoNavigation(e, i, s, t.hit.intersection) : visDollhouseNavigation(e, i, t.hit.intersection, this.meshQuery))
    }
  }
}
const visPanoNavigation = (e: GUIDraw, t: SweepsData, i: CameraData, s: Intersection) => {
  let o = 0
  const n = s.point.clone().sub(i.pose.position)
  const c = getSweepByDirection(t, n)
  const h = Math.max(...c.map(e => e.score))
  const l = h - 5
  for (const { sweep: t, score: i } of c) {
    if (t) {
      const n = 0 === o ? "cyan" : "orange"
      const r = checkLerpThreshold(i, l, h, 0, 0.6)
      e.line("panosphere" + o++, n)
        .toggle(!0)
        .updatePositions(s.point, t.position)
        .opacity(r)
      const c = checkLerpThreshold(r, 0, 0.6, 0, 0.1)
      e.sphere("panosphere" + o++, { color: n, opacity: 0.8 })
        .toggle(!0)
        .update(t.position, c)
    }
  }
}
const visDollhouseNavigation = (e: GUIDraw, t: SweepsData, i: Intersection, s: MeshQueryModule) => {
  let o = 0
  const n = getSweepByIntersection(t, !1, i, s)
  const c = Math.max(...n.map(e => e.score))
  const h = c - 15
  for (const { sweep: t, score: s } of n)
    if (t) {
      const n = 0 === o ? "cyan" : "orange"
      const r = checkLerpThreshold(s, h, c, 0, 1)
      e.line("panosphere" + o++, n)
        .toggle(!0)
        .updatePositions(i.point, t.position)
        .opacity(r)
      const l = checkLerpThreshold(r, 0, 1, 0, 0.3)
      e.sphere("panosphere" + o++, { color: n })
        .toggle(!0)
        .update(t.position, l)
    }
}

export default (e: Engine) => {
  e.getModuleBySymbol(NavigationSymbol).then(t => {
    const i = t.navigationWalk
    const s = i.positionTracker
    new NavigationVisuals(e, s, i)
  })
}
