import * as s from "../const/78283"
import { UnitTypeKey } from "../utils/unit.utils"
let r = "′",
  a = "″",
  o = " ",
  l = "ft",
  c = "in",
  d = "m",
  u = "sq. ft.",
  h = "m²",
  p = "×"

function g(e) {
  ;(r = e.unitsDisplayFeetSymbol),
    (a = e.unitsDisplayInchesSymbol),
    (o = e.unitsDisplayHalfSpace),
    (l = e.unitsDisplayFeet),
    (c = e.unitsDisplayInches),
    (d = e.unitsDisplayMeters),
    (u = e.unitsDisplaySquareFeet),
    (h = e.unitsDisplaySquareMeters),
    (p = e.dimensionsSeparator)
}

enum m {
  FEET = "feet",
  INCHES = "inches"
}

export enum PropertyList {
  DISTANCE = "distance",
  AREA = "area"
}

const v = (e, t, n = m.FEET) => {
    const s = t.toString()
    return e === UnitTypeKey.IMPERIAL
      ? {
          [PropertyList.AREA]: `${s} ${u}`,
          [PropertyList.DISTANCE]: n === m.FEET ? `${s}${r}` : `${s}${a}`
        }
      : {
          [PropertyList.AREA]: `${s} ${h}`,
          [PropertyList.DISTANCE]: `${s} ${d}`
        }
  },
  y = (e: number, t = UnitTypeKey.IMPERIAL) => {
    const { IMPERIAL: n, METRIC: r } = UnitTypeKey
    const { FEET: a, INCHES: l } = m
    let c = v(n, 0, l).distance
    switch (t) {
      case n:
        const { feet: t, inches: i } = (0, s.XJ)(e)
        let d = v(n, t, a).distance,
          u = v(n, i, l).distance
        t < 1 && (d = ""), d.length > 0 && (d += o), (c = d + u)
        break
      case r:
        c = v(r, e.toFixed(2)).distance
    }
    return c
  }
export const B5 = l
export const Ep = d
export const FP = c
export const G8 = h
export const QK = u
export const RQ = p
export const RV = PropertyList
export const cL = g
export const dO = v
export const up = y
