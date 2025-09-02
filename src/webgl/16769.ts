import { Mesh } from "three"
import { ShowcaseMesh } from "./showcaseMesh"
const _isShowcaseMesh = e => e instanceof ShowcaseMesh
export const isShowcaseMesh = e => _isShowcaseMesh(e)
export const isVisibleShowcaseMesh = e => _isShowcaseMesh(e) && e.raycastEnabled && e.visible
export const defaultRaycastFilter = (e: Mesh) => {
  let t = e.visible
  t &&
    e.traverseAncestors(e => {
      t && (t = e.visible)
    })
  return (!isShowcaseMesh(e) && t) || (isVisibleShowcaseMesh(e) as boolean)
}
