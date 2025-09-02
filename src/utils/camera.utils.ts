import { MatrixBase } from "../webgl/matrix.base"
export const CameraRigConfig = {
  fov: 75,
  near: 0.1,
  far: 3e3,
  minFov: 1
}
export const computeNearFar = (distance: number) => {
  const limit = CameraRigConfig.far - CameraRigConfig.near
  const near = Math.max(CameraRigConfig.near, distance - limit / 2)
  return {
    near,
    far: near + limit
  }
}
export const makePerspectiveFov = (e: number, t = new MatrixBase()) => {
  return t.makePerspectiveFov(CameraRigConfig.fov, e, CameraRigConfig.near, CameraRigConfig.far)
}
export const OrthographicProjection = (e: number, t: number, n = 1, r = 1, a = CameraRigConfig.near, o = CameraRigConfig.far, l = new MatrixBase()) => {
  const c = e / 2,
    d = t / 2,
    u = l.makeOrthographic(-c, c, d, -d, a * r, o * r)
  u.elements[0] *= n
  u.elements[5] *= n
  return u
}
