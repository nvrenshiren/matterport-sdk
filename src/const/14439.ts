import { PanoSizeKey } from "./76609"

import { DEFAULT_TRANSITION_TIME } from "../modules/viewmode.module"
import { SettingsData } from "../data/settings.data"
export const r = "TourSpeed &wts"
export const ToursMetersPerSecondKey = "ToursMetersPerSecond"
export const o = 0.4
export const l = 10
export const c = 1.25
export const d = 0.8
export const u = 6
export const h = 3
export const p = 1e3 * d
export const DefaultTransitionSpeed = 1e3 * c
export const f = 1e3 * u
export const DefaultTransitionTime = 600
export const v = 400
export const yy = 1200
export const b = 1200
export const E = 35
export const S = 15
export const O = 120
export const T = 1200
export const _ = 75
export const w = 400
export const A = DEFAULT_TRANSITION_TIME - DefaultTransitionTime
export const PanoSizeBaseKey = PanoSizeKey.BASE
export const I = "hlrUltra"
export const P = "kb"
export const x = "sspa"
export const panAngleDefault = 35
export const L = "st"
export const DefaultPanSpeed = (panAngleDefault / 3500) * 1e3
export const D = 2
export const R = 52
export const M = 0
export const j = 2e3
export const DefaultDollhousePanSpeed = 0.2 * DefaultPanSpeed
export const F = DefaultDollhousePanSpeed
export const H = 90
export const DefaultZoomDuration = 3500
export const V = 1e3
export const G = 7e3
export const W = (e: SettingsData) => 1 === e.getOverrideParam(P, 1)
export const z = (e: SettingsData) => e.getOverrideParam(L, 3500)
export const $ = (e: SettingsData) => e.getOverrideParam(x, panAngleDefault)
export const getTimeoutURL = e => e.getOverrideParam("ts", -1)
export const Y = Object.freeze({
  walkingTourIncludeExtraPanosDistance: 0.4,
  walkingStageMinimumDistance: 0.8,
  maxWalkingSweepsBetweenSnapshots: 40
})

export const BY = l
export const Cp = _

export const GS = j

export const HJ = A
export const Im = c
export const LO = d

export const N5 = u
export const NY = yy
export const O2 = E
export const OJ = o
export const Ot = H
export const Pv = p
export const Qo = h
export const T7 = I
export const WI = G
export const WQ = r
export const Xd = Y
export const _D = w
export const _c = P
export const b_ = R
export const dF = W
export const eu = v
export const f7 = T
export const gS = b
export const g_ = z

export const iN = F
export const lY = L
export const lk = f

export const mS = M

export const rM = S

export const xs = x
export const y = $
export const z$ = D
export const z3 = V
export const z8 = O
