import { BaseParser } from "../parser/baseParser"
import * as s from "../const/49571"
import { AnnotationGrouping } from "../const/63319"
function r(e, t, n) {
  var r
  switch (n) {
    case AnnotationGrouping.TYPE:
      return e.dataTypeGroups[t]?.groupOrder || s.Xs
    case AnnotationGrouping.FLOOR:
      return s.Wh
    case AnnotationGrouping.LAYER:
      return s.Vj
  }
  return -1
}
function a(e: BaseParser) {
  return `${e.id}-${e.typeId}`
}

export const j = r
export const w = a
