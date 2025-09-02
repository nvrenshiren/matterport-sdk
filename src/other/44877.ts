import { AnnotationType } from "../const/annotationType.const"
function s(e, t) {
  return !!t && t.id === e.getCurrentUserId()
}
function a(e, t, i) {
  if (t === AnnotationType.NOTE) {
    return e.isCommenter() && s(e, i)
  }
  return e.isEditor()
}
function o(e, t, i) {
  if (t === AnnotationType.NOTE) {
    return (e.isCommenter() && s(e, i)) || e.isOrgAdmin()
  }
  return e.isEditor()
}

export const CM = a
export const Kd = o
export const aP = s
