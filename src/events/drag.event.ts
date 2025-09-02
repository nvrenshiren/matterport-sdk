import { Vector2 } from "three"
import { InputPointerType } from "../const/41927"
import { InputGesturePointerItem } from "../modules/inputIni.module"
import { GestureEvent } from "./gesture.event"
import { MouseKeyCode } from "../const/mouse.const"
export class DraggerStartEvent extends GestureEvent {
  position: Vector2
  buttons: number
  device: InputPointerType
  ctrlKey: boolean
  pointerId: number
  constructor(e: Vector2, t: number, n: InputPointerType, i: boolean, s = 0) {
    super()
    this.position = e
    this.buttons = t
    this.device = n
    this.ctrlKey = i
    this.pointerId = s
  }
}
export class DraggerMoveEvent extends GestureEvent {
  ctrlKey: boolean
  position: Vector2
  clientPosition: Vector2
  delta: Vector2
  buttons: number
  device: InputPointerType
  pointerId: number
  constructor(e: Vector2, t: Vector2, n: number, i: Vector2, s: InputPointerType, r = 0) {
    super()
    this.ctrlKey = !1
    this.position = e
    this.clientPosition = i
    this.delta = t
    this.buttons = n
    this.device = s
    this.pointerId = r
  }
}
export class DraggerStopEvent extends GestureEvent {
  ctrlKey: boolean
  position: Vector2
  delta: Vector2
  buttons: number
  timeSinceLastMove: any
  fullDelta: any
  device: InputPointerType
  pointerId: number
  constructor(e: Vector2, t: Vector2, n: MouseKeyCode, i: number, s: Vector2, r: InputPointerType, a = 0) {
    super()
    this.ctrlKey = !1
    this.position = e
    this.delta = t
    this.buttons = n
    this.timeSinceLastMove = i
    this.fullDelta = s
    this.device = r
    this.pointerId = a
  }
}
export class DraggerWaitingEvent extends GestureEvent {
  position: Vector2
  pointer: InputGesturePointerItem
  constructor(e: Vector2, t: InputGesturePointerItem) {
    super()
    this.position = e
    this.pointer = t
  }
}
export class DraggeringEvent extends GestureEvent {
  position: Vector2
  fullDelta: Vector2
  constructor(e: Vector2, t: Vector2) {
    super()
    this.position = e
    this.fullDelta = t
  }
}
