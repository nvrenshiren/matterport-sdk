import { Quaternion, Vector3 } from "three"
export enum DirectionKey {
  NONE = "NONE",
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  FORWARD = "FORWARD",
  BACK = "BACK",
  ZERO = "ZERO",
  UNIT = "UNIT",
  HORIZONTAL_PLANE = "HORIZONTAL_PLANE"
}

export class DirectionVector {
  static UP: Vector3
  static DOWN: Vector3
  static LEFT: Vector3
  static RIGHT: Vector3
  static FORWARD: Vector3
  static BACK: Vector3
  static ZERO: Vector3
  static UNIT: Vector3
  static HORIZONTAL_PLANE: Vector3
}
DirectionVector.UP = new Vector3(0, 1, 0)
DirectionVector.DOWN = new Vector3(0, -1, 0)
DirectionVector.LEFT = new Vector3(-1, 0, 0)
DirectionVector.RIGHT = new Vector3(1, 0, 0)
DirectionVector.FORWARD = new Vector3(0, 0, -1)
DirectionVector.BACK = new Vector3(0, 0, 1)
DirectionVector.ZERO = new Vector3(0, 0, 0)
DirectionVector.UNIT = new Vector3(1, 1, 1)
DirectionVector.HORIZONTAL_PLANE = new Vector3(1, 0, 1)

export class CameraQuaternion {
  static DOWNWARD: Quaternion
}
CameraQuaternion.DOWNWARD = new Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2)
