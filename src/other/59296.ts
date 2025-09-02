export function Vector3ToJson(e) {
  return {
    x: e.x,
    y: e.y,
    z: e.z
  }
}
export function QuaternionToJson(e) {
  return {
    x: e.x || e._x,
    y: e.y || e._y,
    z: e.z || e._z,
    w: e.w || e._w
  }
}
