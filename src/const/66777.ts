import { MathUtils } from "three"
import { InteractionMode } from "./57053"
import { TransitionTypeList } from "./64918"
export const DollhousePeekabooKey = "dollhouse-peekaboo"

export const TransitionTimeConfig = Object.freeze({
  camera: {
    transitionBlackoutTime: 300,
    transitionFadeTime: 800,
    baseTransitionTime: 200,
    transitionSpeed: 3,
    autoOrbitMinVelocity: 0.002,
    autoOrbitMaxVelocity: 0.08,
    autoOrbitTransitionTIme: 1e3,
    autoOrbitLowerPhiLimit: 30 * MathUtils.DEG2RAD,
    autoOrbitUpperPhiLimit: 90 * MathUtils.DEG2RAD
  }
})
export const SweepTransition = {
  [InteractionMode.Desktop]: TransitionTypeList.Interpolate,
  [InteractionMode.Mobile]: TransitionTypeList.Interpolate,
  [InteractionMode.VrOrientOnly]: TransitionTypeList.FadeToBlack,
  [InteractionMode.VrWithController]: TransitionTypeList.FadeToBlack,
  [InteractionMode.VrWithTrackedController]: TransitionTypeList.FadeToBlack
}
export const ZP = TransitionTimeConfig
