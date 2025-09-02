import { Box3, Quaternion, Vector3 } from "three"
import { calculateBestPositionAndRotation } from "./20898"
import { getNearestSidePose, getNearestTopPose } from "./48057"
import { Pose } from "./pose"
import { DirectionVector } from "./vector.const"
function createRotationQuaternion(axis: Vector3, angle: number) {
  const radians = (Math.PI * angle) / 180
  return new Quaternion().setFromAxisAngle(axis, radians)
}
export enum MeshTrimViewState {
  PERSPECTIVE = "PERSPECTIVE_VIEW",
  SIDE = "SIDE_VIEW",
  TOP = "TOP_VIEW"
}
export enum ViewChangeState {
  PERSPECTIVE = "PERSPECTIVE",
  TOP = "TOP",
  SIDE = "SIDE",
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}
const d = createRotationQuaternion(DirectionVector.UP, -90)
const u = createRotationQuaternion(DirectionVector.UP, 90)
const h = createRotationQuaternion(DirectionVector.RIGHT, -90)
const p = createRotationQuaternion(DirectionVector.RIGHT, 90)
const m = createRotationQuaternion(DirectionVector.RIGHT, -30)
  .multiply(createRotationQuaternion(DirectionVector.UP, 30))
  .multiply(createRotationQuaternion(DirectionVector.FORWARD, -15))
const f = createRotationQuaternion(DirectionVector.RIGHT, 60)
  .multiply(createRotationQuaternion(DirectionVector.UP, 30))
  .multiply(createRotationQuaternion(DirectionVector.FORWARD, -15))
function createViewChangeFunction(e: Quaternion) {
  return (t: Box3, n: Vector3, i: Pose) => calculateBestPositionAndRotation(t, n, i, e)
}
const viewChangeMap: Record<
  MeshTrimViewState,
  Partial<
    Record<
      ViewChangeState,
      {
        nextState: MeshTrimViewState
        viewChangeFunction: (
          e: Box3,
          t: Vector3,
          i: Pose
        ) => {
          position: Vector3
          rotation: Quaternion
        }
      }
    >
  >
> = {
  [MeshTrimViewState.PERSPECTIVE]: {
    [ViewChangeState.SIDE]: {
      nextState: MeshTrimViewState.SIDE,
      viewChangeFunction: getNearestSidePose
    },
    [ViewChangeState.TOP]: {
      nextState: MeshTrimViewState.TOP,
      viewChangeFunction: getNearestTopPose
    }
  },
  [MeshTrimViewState.SIDE]: {
    [ViewChangeState.TOP]: {
      nextState: MeshTrimViewState.TOP,
      viewChangeFunction: createViewChangeFunction(h)
    },
    [ViewChangeState.LEFT]: {
      nextState: MeshTrimViewState.SIDE,
      viewChangeFunction: createViewChangeFunction(d)
    },
    [ViewChangeState.RIGHT]: {
      nextState: MeshTrimViewState.SIDE,
      viewChangeFunction: createViewChangeFunction(u)
    },
    [ViewChangeState.PERSPECTIVE]: {
      nextState: MeshTrimViewState.PERSPECTIVE,
      viewChangeFunction: createViewChangeFunction(m)
    }
  },
  [MeshTrimViewState.TOP]: {
    [ViewChangeState.SIDE]: {
      nextState: MeshTrimViewState.SIDE,
      viewChangeFunction: createViewChangeFunction(p)
    },
    [ViewChangeState.PERSPECTIVE]: {
      nextState: MeshTrimViewState.PERSPECTIVE,
      viewChangeFunction: createViewChangeFunction(f)
    }
  }
}
function getViewChangeInfo(e: MeshTrimViewState, t: ViewChangeState) {
  return viewChangeMap[e][t] || null
}
export function isValidViewChange(e: MeshTrimViewState, t: ViewChangeState) {
  return !!getViewChangeInfo(e, t)
}
export function getCameraPose(e: MeshTrimViewState, t: ViewChangeState, n: Box3, i: Vector3, s: Pose) {
  const r = getViewChangeInfo(e, t)
  if (!r) throw new Error("invalid state change")
  const { nextState, viewChangeFunction } = r
  return [viewChangeFunction(n, i, s), nextState] as [
    {
      position: Vector3
      rotation: Quaternion
    },
    MeshTrimViewState
  ]
}
