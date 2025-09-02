export enum TransitionType {
  Burns = 1,
  Delay = 5,
  FloorChange = 4,
  Move = 0,
  Nop = 6,
  Path = 3,
  Zoom = 2
}
export enum BurnsTransitionType {
  Delay = 3,
  None = 4,
  Pan = 0,
  PanDollhouse = 1,
  Zoom = 2
}

export enum PanDirectionList {
  Auto = 0,
  Left = 1,
  Right = -1
}
export const TourTransitionTypes = [TransitionType.Burns, TransitionType.Zoom, TransitionType.Delay]
export const TransitionFactor = { longerTransitionMaxDist: 10, TRANSITION_TIME_DH: 650, TRANSITION_TIME_ROOM: 800 }
