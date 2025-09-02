import { Intersection, Mesh, Object3D, Vector2 } from "three"
import { CheckThreshold } from "../utils/49827"
import { hasPointerId } from "../other/54106"
import { GutterTouchScrollDisableCommand, GutterTouchScrollEnableCommand } from "../command/scroll.command"
import { Comparator } from "../utils/comparator"
import { InputPointerType } from "../const/41927"
import { dragLimit, holdLimit, minPointerDelta, pincherThreshold, pressConfirmThreshold, rotaterThreshold, scrollerThreshold } from "../const/input.const"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { MouseKeyCode, MouseKeyIndex } from "../const/mouse.const"
import { CanvasSymbol, InputSymbol, RaycasterSymbol, SettingsSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { Event } from "../core/event"
import { Module } from "../core/module"
import { ISubscription } from "../core/subscription"
import { TypeLookup, getClassConstructor, getClassName } from "../core/typeLookup"
import { CanvasData } from "../data/canvas.data"
import { DoubleClicker } from "../utils/doubleClicker"
import { DoubleClickerStopEvent, InputClickerEndEvent, InputClickerStartEvent } from "../events/click.event"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent, DraggerWaitingEvent, DraggeringEvent } from "../events/drag.event"
import { GestureEvent } from "../events/gesture.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { LongPressDoneEvent, LongPressEndEvent, LongPressMoveEvent, LongPressProgressEvent, LongPressStartEvent } from "../events/longPress.event"
import { MousePosition, OnMouseDownEvent, OnMoveEvent } from "../events/mouse.event"
import { MultiswiperMoveEvent, MultiswiperStopEvent } from "../events/multiswiper.event"
import { PincherMoveEvent, PincherStopEvent } from "../events/pinch.ecvent"
import { MovePointerEvent } from "../events/pointer.event"
import { RotaterMoveEvent, RotaterStopEvent } from "../events/rotate.const"
import { WheelBindEvent } from "../events/wheel.event"
import { isScrollGutter } from "../utils/isScrollGutter"
import { EventsSubscription } from "../subscription/events.subscription"
import { isIPad, isIPhone, isWebkit, sameWindow, winCanTouch } from "../utils/browser.utils"
import { supportedPassive } from "../utils/event.utils"
import { checkButtonCode } from "../utils/func.utils"
import { MapListHelper } from "../utils/mapList.utils"
import RaycasterModule from "./raycaster.module"
declare global {
  interface SymbolModule {
    [InputSymbol]: InputIniModule
  }
}
const Index2Code = (e: MouseKeyIndex) => {
  const t = MouseKeyCode[MouseKeyIndex[e]]
  return "number" == typeof t ? t : void 0
}
const Code2Index = (e: MouseKeyCode) => {
  const t = MouseKeyIndex[MouseKeyCode[e]]
  return "number" == typeof t ? t : void 0
}
class InputPointer {
  config: { pointerPreventDefault: any }
  canvasData: CanvasData
  gutterScrollEnabled: any
  handledTouchesAsPointer: number
  lastTouchEnd: number
  scrollGutterStart: boolean
  bindings: ISubscription[]
  activeButtons: MouseKeyCode
  preventDoubleTap: (e: any) => void
  static doubleTapThreshold: number
  preventMultiTouchGesture: (e: any) => void
  onEventCallback: InputIniModule["onPointerEvent"]
  constructor(e, t: HTMLCanvasElement, n, i: InputIniModule["onPointerEvent"], s) {
    this.config = e
    this.canvasData = n
    this.gutterScrollEnabled = s
    this.handledTouchesAsPointer = 0
    this.lastTouchEnd = 0
    this.scrollGutterStart = !1
    this.bindings = []
    this.activeButtons = MouseKeyCode.NONE
    this.preventDoubleTap = e => {
      e.cancelable && e.timeStamp - this.lastTouchEnd <= InputPointer.doubleTapThreshold && e.preventDefault(), (this.lastTouchEnd = e.timeStamp)
    }
    this.preventMultiTouchGesture = e => {
      const t = e.touches && e.touches.length > 1,
        n = "scale" in e && 1 !== e.scale
      ;(t || n) && e.cancelable && e.preventDefault()
    }

    this.onEventCallback = i
    if (!window.PointerEvent) {
      this.bindings.push(
        new EventsSubscription(t, "mousedown", e => this.onMouseDown(e)),
        new EventsSubscription(t, "mouseup", e => this.onMouseUp(e)),
        new EventsSubscription(t, "mousemove", e => this.onMouseMove(e)),
        new EventsSubscription(t, "mouseenter", e => this.onMouseEnter(e))
      )
    }
    this.bindings.push(
      new EventsSubscription(t, "contextmenu", e => e.preventDefault()),
      new EventsSubscription(t, "touchstart", e => this.onTouchStart(e)),
      new EventsSubscription(t, "touchend", e => this.onTouchEnd(e)),
      new EventsSubscription(t, "touchmove", e => this.onTouchMove(e)),
      new EventsSubscription(t, "touchcancel", e => this.onTouchEnd(e)),
      new EventsSubscription(t, "pointerdown", e => this.onPointerDown(e)),
      new EventsSubscription(t, "pointerup", e => this.onPointerUp(e)),
      new EventsSubscription(t, "pointermove", e => this.onPointerMove(e)),
      new EventsSubscription(t, "pointercancel", e => this.onPointerUp(e)),
      new EventsSubscription(t, "pointerenter", e => this.onMouseEnter(e))
    )
    if (isIPhone() || isIPad()) {
      const e = supportedPassive
        ? {
            passive: !1
          }
        : void 0
      this.bindings.push(
        new EventsSubscription(t, "touchmove", this.preventMultiTouchGesture, e),
        new EventsSubscription(t, "touchend", this.preventDoubleTap, e)
      )
    }
  }
  dispose() {
    for (const e of this.bindings) e.cancel()
    this.bindings.length = 0
  }
  toggleTouchScrolling(e) {
    this.gutterScrollEnabled = e
  }
  onMouseDown(e: MouseEvent) {
    e.currentTarget?.["focus"]()
    this.tryPreventDefault(e)
    const button = e.button
    if (isWebkit() && this.isMouseHeld()) return
    this.activeButtons |= 1 << button
    const { ndc, client } = this.getPointerPosition(e)
    this.onEventCallback(new OnMouseDownEvent(this.getPointerId(e), ndc, client, button, !0, InputPointerType.MOUSE, e))
  }
  onMouseUp(e: MouseEvent) {
    this.tryPreventDefault(e)
    const t = Code2Index(this.activeButtons),
      n = isWebkit() && null != t ? t : e.button
    this.activeButtons &= ~(1 << n)
    const { ndc, client } = this.getPointerPosition(e)
    this.onEventCallback(new OnMouseDownEvent(this.getPointerId(e), ndc, client, n, !1, InputPointerType.MOUSE, e))
  }
  onMouseMove(e: MouseEvent) {
    this.tryPreventDefault(e)
    const { ndc, client } = this.getPointerPosition(e)
    this.onEventCallback(new OnMoveEvent(this.getPointerId(e), ndc, client, this.activeButtons, InputPointerType.MOUSE, e))
  }
  onMouseEnter(e: MouseEvent) {
    this.checkMissingButtons(e)
  }
  isMouseHeld() {
    return this.activeButtons !== MouseKeyCode.NONE
  }
  checkMissingButtons(e: MouseEvent) {
    const t = checkButtonCode(e.buttons, MouseKeyIndex.MIDDLE, MouseKeyIndex.SECONDARY)
    const n = (this.activeButtons ^ t) & ~t
    for (let button = MouseKeyIndex.PRIMARY; button < MouseKeyIndex.COUNT; ++button) {
      const i = Index2Code(button)
      if (i && (n & i) > 0) {
        const { ndc, client } = this.getPointerPosition(e)
        this.onEventCallback(new OnMouseDownEvent(this.getPointerId(e), ndc, client, button, !1, InputPointerType.MOUSE, e))
      }
    }
    this.activeButtons = t
  }
  onTouchStart(e: TouchEvent) {
    this.scrollGutterStart = this.isScrollGutter(e)
    e.currentTarget?.["focus"]()
    this.scrollGutterStart || this.tryPreventDefault(e)
    if (this.handledTouchesAsPointer) {
      --this.handledTouchesAsPointer
    } else {
      for (let t = 0; t < e.changedTouches.length; t++) {
        const n = e.changedTouches.item(t)!
        const { ndc, client } = this.getTouchPosition(n)
        this.onEventCallback(new OnMouseDownEvent(n.identifier, ndc, client, MouseKeyIndex.PRIMARY, !0, InputPointerType.TOUCH, e))
      }
    }
  }
  onTouchEnd(e: TouchEvent) {
    this.scrollGutterStart ? (this.scrollGutterStart = !1) : this.tryPreventDefault(e)
    if (this.handledTouchesAsPointer) {
      --this.handledTouchesAsPointer
    } else {
      for (let t = 0; t < e.changedTouches.length; t++) {
        const n = e.changedTouches.item(t)!
        const { ndc, client } = this.getTouchPosition(n)
        this.onEventCallback(new OnMouseDownEvent(n.identifier, ndc, client, MouseKeyIndex.PRIMARY, !1, InputPointerType.TOUCH, e))
      }
    }
  }
  onTouchMove(e: TouchEvent) {
    this.scrollGutterStart && (this.isScrollGutter(e) || (this.scrollGutterStart = !1))
    this.scrollGutterStart || this.tryPreventDefault(e)
    if (this.handledTouchesAsPointer) {
      --this.handledTouchesAsPointer
    } else {
      for (let t = 0; t < e.changedTouches.length; t++) {
        const n = e.changedTouches.item(t)!
        const { ndc, client } = this.getTouchPosition(n)
        this.onEventCallback(new OnMoveEvent(n.identifier, ndc, client, MouseKeyCode.PRIMARY, InputPointerType.TOUCH, e))
      }
    }
  }
  onPointerDown(e: PointerEvent) {
    const { ndc, client } = this.getPointerPosition(e)
    this.scrollGutterStart = this.isScrollGutter(e)
    this.scrollGutterStart || this.tryPreventDefault(e)
    switch (e.pointerType) {
      case InputPointerType.MOUSE:
        this.onMouseDown(e)
        break
      case InputPointerType.GAMEPAD:
      case InputPointerType.TOUCH:
        ++this.handledTouchesAsPointer
        this.onEventCallback(new OnMouseDownEvent(e.pointerId, ndc, client, MouseKeyIndex.PRIMARY, !0, e.pointerType, e))
    }
  }
  onPointerUp(e: PointerEvent) {
    this.scrollGutterStart ? (this.scrollGutterStart = !1) : this.tryPreventDefault(e)
    switch (e.pointerType) {
      case InputPointerType.MOUSE:
        this.onMouseUp(e)
        break
      case InputPointerType.GAMEPAD:
      case InputPointerType.TOUCH:
        ++this.handledTouchesAsPointer
        const { ndc, client } = this.getPointerPosition(e)
        this.onEventCallback(new OnMouseDownEvent(e.pointerId, ndc, client, MouseKeyIndex.PRIMARY, !1, e.pointerType, e))
    }
  }
  onPointerMove(e: PointerEvent) {
    this.scrollGutterStart && (this.isScrollGutter(e) || (this.scrollGutterStart = !1))
    this.scrollGutterStart || this.tryPreventDefault(e)
    switch (e.pointerType) {
      case InputPointerType.MOUSE:
        ;-1 !== e.button ? (this.activeButtons < e.buttons ? this.onMouseDown(e) : this.activeButtons > e.buttons && this.onMouseUp(e)) : this.onMouseMove(e)
        break
      case InputPointerType.GAMEPAD:
      case InputPointerType.TOUCH:
        ++this.handledTouchesAsPointer
        const { ndc, client } = this.getPointerPosition(e)
        this.onEventCallback(new OnMoveEvent(e.pointerId, ndc, client, MouseKeyCode.PRIMARY, e.pointerType, e))
    }
  }
  getPointerId(e: MouseEvent): number {
    return hasPointerId(e) ? e["pointerId"] : 0
  }
  getPointerPosition(e: PointerEvent | MouseEvent) {
    return {
      ndc: this.normalizePosition(e.clientX, e.clientY),
      client: {
        x: e.clientX - this.canvasData.x,
        y: e.clientY - this.canvasData.y
      }
    }
  }
  getTouchPosition(e: Touch) {
    return {
      ndc: this.normalizePosition(e.clientX, e.clientY),
      client: {
        x: e.clientX - this.canvasData.x,
        y: e.clientY - this.canvasData.y
      }
    }
  }
  normalizePosition(clientX: number, clientY: number) {
    return {
      x: (2 * (clientX - this.canvasData.x)) / this.canvasData.width - 1,
      y: (-2 * (clientY - this.canvasData.y)) / this.canvasData.height + 1
    }
  }
  isScrollGutter(e: TouchEvent | PointerEvent) {
    if (!this.gutterScrollEnabled) return !1
    let x: number
    if (!(e instanceof PointerEvent)) {
      if (1 !== e.changedTouches.length) return !1
      const n = e.changedTouches.item(0)!
      x = this.getTouchPosition(n).client.x
    } else {
      if (e.pointerType !== InputPointerType.TOUCH) return !1
      x = this.getPointerPosition(e).client.x
    }
    return isScrollGutter(x, e.currentTarget as HTMLElement)
  }
  tryPreventDefault(e: MouseEvent | TouchEvent | PointerEvent) {
    if (!e.cancelable) return
    ;(!(e instanceof MouseEvent || e instanceof PointerEvent) || this.config.pointerPreventDefault) && e.preventDefault()
  }
}
InputPointer.doubleTapThreshold = 300
enum FirefoxKeys {
  DASHUNDERSCORE = 173,
  PLUSEQUALS = 61,
  SEMICOLON = 59
}

const filterKey = [KeyboardCode.TAB, KeyboardCode.RETURN, KeyboardCode.SPACE, KeyboardCode.ESCAPE]
class KeyboardState {
  rootNode: any
  keysDown: {}
  bindings: ISubscription[]
  onEventCallback: any
  constructor(e, t) {
    this.rootNode = e
    this.keysDown = {}
    this.bindings = []
    this.onEventCallback = t
    this.bindHandlers()
  }
  dispose() {
    for (const e of this.bindings) e.cancel()
    this.bindings.length = 0
  }
  isKeyHeld(e) {
    return !!this.keysDown[e]
  }
  bindHandlers() {
    const e = this.rootNode
    this.bindings.push(
      new EventsSubscription(e, "focusout", ({ relatedTarget: e }) => {
        ;(e && e instanceof Node && this.rootNode.contains(e)) || Object.keys(this.keysDown).forEach(e => (this.keysDown[e] = !1))
      }),
      new EventsSubscription(e, "keydown", e => {
        if (e.ctrlKey || e.metaKey) return
        filterKey.includes(e.keyCode) || (e.preventDefault(), e.stopPropagation())
        const t = this.translateFirefoxKeys(e.which || e.keyCode)
        this.keysDown[t] = !0
        this.onEventCallback(new KeyboardCallbackEvent(t, KeyboardStateList.DOWN, e))
      }),
      new EventsSubscription(e, "keyup", e => {
        if (e.ctrlKey || e.metaKey) return
        filterKey.includes(e.keyCode) || (e.preventDefault(), e.stopPropagation())
        const t = this.translateFirefoxKeys(e.which || e.keyCode)
        this.keysDown[t] && this.onEventCallback(new KeyboardCallbackEvent(t, KeyboardStateList.PRESSED, e)),
          (this.keysDown[t] = !1),
          this.onEventCallback(new KeyboardCallbackEvent(t, KeyboardStateList.UP, e))
      })
    )
  }
  translateFirefoxKeys(e: number) {
    switch (e) {
      case FirefoxKeys.SEMICOLON:
        return KeyboardCode.SEMICOLON
      case FirefoxKeys.PLUSEQUALS:
        return KeyboardCode.PLUSEQUALS
      case FirefoxKeys.DASHUNDERSCORE:
        return KeyboardCode.DASHUNDERSCORE
    }
    return e
  }
}
enum InputState {
  GESTURING = 2,
  WAITING = 0,
  WAITINGTOEXCEEDTHRESHOLD = 1
}

class InputClicker {
  dragLimit: number
  holdLimit: number
  startPosition: Vector2
  pointerDelta: Vector2
  activeButtons: MouseKeyCode
  state: InputState
  startTime: number
  constructor(e = dragLimit, t = holdLimit) {
    this.dragLimit = e
    this.holdLimit = t
    this.startPosition = new Vector2()
    this.pointerDelta = new Vector2()
    this.activeButtons = MouseKeyCode.NONE
    this.state = InputState.WAITING
  }
  start(e: InputGesturePointerItem) {
    this.state === InputState.WAITING && this.startPosition.copy(e.position)
    if (0 == (e.buttons & (e.buttons - 1))) {
      this.startTime = Date.now()
      this.activeButtons = e.buttons
      this.state = InputState.WAITINGTOEXCEEDTHRESHOLD
    } else if (this.activeButtons) {
      this.state = InputState.GESTURING
      return new InputClickerStartEvent(e.position, this.activeButtons)
    }
  }
  stop() {
    let e: InputClickerEndEvent | undefined
    if (this.state === InputState.WAITINGTOEXCEEDTHRESHOLD && Date.now() - this.startTime < this.holdLimit) {
      e = new InputClickerEndEvent(this.startPosition.add(this.pointerDelta), Code2Index(this.activeButtons))
      this.pointerDelta.set(0, 0)
    }
    this.state = InputState.WAITING
    return e
  }
  onMove(e: InputGesturePointerItem) {
    if (
      this.state === InputState.WAITINGTOEXCEEDTHRESHOLD &&
      (this.pointerDelta.copy(e.position).sub(this.startPosition), this.pointerDelta.length() > this.dragLimit)
    ) {
      this.state = InputState.GESTURING
      return new InputClickerStartEvent(e.position, e.buttons)
    }
  }
  compareState(e) {
    return e === this.state
  }
}
class InputDragger {
  onEventCallback: InputIniModule["onEvent"]
  startPosition: Vector2
  previousPosition: Vector2
  pointerDelta: Vector2
  lastPointerMove: number
  state: InputState
  pointerId: number
  threshold: number
  device: null | InputPointerType
  constructor(e, t = dragLimit) {
    this.onEventCallback = e
    this.startPosition = new Vector2()
    this.previousPosition = new Vector2()
    this.pointerDelta = new Vector2()
    this.lastPointerMove = Date.now()
    this.state = InputState.WAITING
    this.pointerId = 0
    this.threshold = t
    this.device = null
  }
  start(e: InputGesturePointerItem) {
    if (this.state === InputState.WAITING) {
      this.startPosition.copy(e.position)
      this.previousPosition.copy(this.startPosition)
      this.state = InputState.WAITINGTOEXCEEDTHRESHOLD
      this.device = e.device
      this.pointerId = e.id
    }
    return new DraggerStartEvent(e.position, e.buttons, e.device, !!e.ctrlKey, e.id)
  }
  stop() {
    const e = new Vector2().copy(this.previousPosition).sub(this.startPosition)
    this.state === InputState.GESTURING && this.onEventCallback(new DraggeringEvent(this.startPosition, e))
    this.state === InputState.WAITING && this.pointerDelta.set(0, 0)
    this.state = InputState.WAITING
    const t = Date.now() - this.lastPointerMove
    const n = this.device
    if (((this.device = null), !n)) throw new Error("Cannot stop a drag gesture without a device that was tracked at the start")
    return new DraggerStopEvent(this.previousPosition, this.pointerDelta, MouseKeyCode.NONE, t, e, n, this.pointerId)
  }
  onMove(e: InputGesturePointerItem) {
    let t: DraggerMoveEvent | undefined
    if (this.state === InputState.WAITINGTOEXCEEDTHRESHOLD) {
      this.pointerDelta.copy(e.position).sub(this.startPosition)
      this.pointerDelta.length() > this.threshold && ((this.state = InputState.GESTURING), this.onEventCallback(new DraggerWaitingEvent(this.startPosition, e)))
    }
    if (this.state === InputState.GESTURING) {
      this.pointerDelta.copy(e.position).sub(this.previousPosition)
      this.device = e.device
      this.pointerDelta.length() > 0 && (t = new DraggerMoveEvent(this.previousPosition, this.pointerDelta, e.buttons, e.clientPosition, e.device, e.id))
    }
    this.previousPosition.copy(e.position)
    this.lastPointerMove = Date.now()
    return t
  }
  compareState(e) {
    return e === this.state
  }
  compareStartPoint(e) {
    return e.equals(this.startPosition)
  }
  compareDelta(e) {
    return e.equals(this.pointerDelta)
  }
}
class ScrollerMoveEvent extends GestureEvent {
  scrollY: number
  constructor(e) {
    super()
    this.scrollY = e
  }
}
class InputScroller {
  gutterScrollEnabled: boolean
  canvas: HTMLCanvasElement
  threshold: number
  state: InputState
  startPosition: Vector2
  previousY: number
  constructor(e, t, n = scrollerThreshold) {
    this.gutterScrollEnabled = e
    this.canvas = t
    this.threshold = n
    this.state = InputState.WAITING
  }
  toggleTouchScrolling(e: boolean) {
    this.gutterScrollEnabled = e
  }
  start(e: InputGesturePointerItem) {
    this.gutterScrollEnabled &&
      isScrollGutter(e.clientPosition.x, this.canvas) &&
      this.state === InputState.WAITING &&
      ((this.startPosition = Object.assign({}, e.clientPosition)), (this.previousY = e.clientPosition.y), (this.state = InputState.WAITINGTOEXCEEDTHRESHOLD))
  }
  stop() {
    this.gutterScrollEnabled && (this.state = InputState.WAITING)
  }
  onMove(e: InputGesturePointerItem) {
    if (!this.gutterScrollEnabled) return
    const { x: t, y: n } = e.clientPosition
    const i = isScrollGutter(t, this.canvas)
    if (i && this.state === InputState.WAITINGTOEXCEEDTHRESHOLD) {
      const e = Math.abs(t - this.startPosition.x),
        i = Math.abs(n - this.startPosition.y)
      i > e && i > this.threshold && (this.state = InputState.GESTURING)
    }
    const s = n - this.previousY
    if (((this.previousY = n - s), i && this.state === InputState.GESTURING)) return new ScrollerMoveEvent(-s)
    !i && [InputState.GESTURING, InputState.WAITINGTOEXCEEDTHRESHOLD].includes(this.state) && (this.state = InputState.WAITING)
  }
}
class PointerMovement {
  lastPosition: Vector2
  velocity: Vector2
  samePositionTicks: number
  constructor(e = new Vector2(), t = new Vector2(), n = 0) {
    this.lastPosition = e
    this.velocity = t
    this.samePositionTicks = n
  }
  start(e: Vector2) {
    this.lastPosition.copy(e)
    this.velocity.set(0, 0)
    this.samePositionTicks = 0
  }
  update(e: Vector2) {
    if (this.lastPosition.distanceTo(e) <= 0.01) {
      if ((this.samePositionTicks++, this.samePositionTicks < 2)) return
    } else this.samePositionTicks = 0
    this.velocity.copy(this.lastPosition).sub(e)
    this.lastPosition.copy(e)
  }
  stationary() {
    return this.samePositionTicks >= 2 || this.velocity.length() < 0.01
  }
}
const M = 2 * Math.SQRT2
class InputPincher {
  threshold: number
  startDistance: number
  previousDistance: number
  pointerDelta: Vector2
  lastPointerMove: number
  pinchDelta: number
  state: InputState
  pointerMovement1: PointerMovement
  pointerMovement2: PointerMovement
  constructor(e = pincherThreshold) {
    this.threshold = e
    this.startDistance = 0
    this.previousDistance = 0
    this.pointerDelta = new Vector2()
    this.lastPointerMove = Date.now()
    this.pinchDelta = 0
    this.state = InputState.WAITING
    this.pointerMovement1 = new PointerMovement()
    this.pointerMovement2 = new PointerMovement()
  }
  start(e: InputGesturePointerItem, t: InputGesturePointerItem) {
    this.state === InputState.WAITING && (this.restart(e, t), this.pointerMovement1.start(e.position), this.pointerMovement2.start(t.position))
  }
  stop() {
    this.state = InputState.WAITING
    const e = Date.now() - this.lastPointerMove
    return new PincherStopEvent(this.pinchDelta, e)
  }
  onMove(e: InputGesturePointerItem, t: InputGesturePointerItem) {
    this.pointerMovement1.update(e.position), this.pointerMovement2.update(t.position)
    if (!(this.pointerMovement1.stationary() || this.pointerMovement2.stationary() || this.pointerMovement1.velocity.dot(this.pointerMovement2.velocity) < 0)) {
      this.restart(e, t)
      return
    }
    this.pointerDelta.copy(e.position).sub(t.position)
    const n = this.pointerDelta.length() / M
    if (this.state === InputState.WAITINGTOEXCEEDTHRESHOLD) {
      const e = n - this.startDistance
      Math.abs(e) > this.threshold && (this.state = InputState.GESTURING)
    }
    let i: PincherMoveEvent | undefined
    if (this.state === InputState.GESTURING) {
      const e = n - this.previousDistance
      Math.abs(e) > 0 && ((this.pinchDelta = e), (i = new PincherMoveEvent(e)))
    }
    this.previousDistance = n
    this.lastPointerMove = Date.now()
    return i
  }
  restart(e: InputGesturePointerItem, t: InputGesturePointerItem) {
    this.state = InputState.WAITINGTOEXCEEDTHRESHOLD
    this.startDistance = e.position.distanceTo(t.position) / M
    this.previousDistance = this.startDistance
  }
}
class InputRotater {
  startPointerDelta: Vector2
  previousPointerDelta: Vector2
  pointerDelta: Vector2
  lastPointerMove: number
  angleWithDirection: number
  state: InputState
  threshold: number
  constructor(e = rotaterThreshold) {
    this.startPointerDelta = new Vector2()
    this.previousPointerDelta = new Vector2()
    this.pointerDelta = new Vector2()
    this.lastPointerMove = Date.now()
    this.angleWithDirection = 0
    this.state = InputState.WAITING
    this.threshold = e
  }

  start(e, t) {
    this.state === InputState.WAITING &&
      ((this.state = InputState.WAITINGTOEXCEEDTHRESHOLD),
      this.startPointerDelta.copy(e.position).sub(t.position).normalize(),
      this.pointerDelta.copy(this.startPointerDelta),
      this.previousPointerDelta.copy(this.pointerDelta))
  }
  stop() {
    this.state = InputState.WAITING
    const e = Date.now() - this.lastPointerMove
    return new RotaterStopEvent(this.angleWithDirection, e)
  }
  onMove(e: InputGesturePointerItem, t: InputGesturePointerItem) {
    this.pointerDelta.copy(e.position).sub(t.position).normalize()
    if (this.state === InputState.WAITINGTOEXCEEDTHRESHOLD) {
      Math.acos(CheckThreshold(this.pointerDelta.dot(this.startPointerDelta), -1, 1)) > this.threshold && (this.state = InputState.GESTURING)
    }
    let n: RotaterMoveEvent | undefined
    if (this.state === InputState.GESTURING) {
      const e = Math.acos(CheckThreshold(this.pointerDelta.dot(this.previousPointerDelta), -1, 1))
      if (e > 0) {
        const t = this.previousPointerDelta.x * this.pointerDelta.y - this.previousPointerDelta.y * this.pointerDelta.x
        ;(this.angleWithDirection = t >= 0 ? e : -e), (n = new RotaterMoveEvent(this.angleWithDirection))
      }
    }
    return this.previousPointerDelta.copy(this.pointerDelta), (this.lastPointerMove = Date.now()), n
  }
  compareState(e) {
    return e === this.state
  }
}
const B = function (e: Vector2[], t: Vector2) {
  if ((t.setLength(0), 0 === e.length)) return t
  let n = 0
  for (const i of e) t.add(i), n++
  return t.divideScalar(n), t
}
class InputMultiswiper {
  startEpicenter: Vector2
  previousEpicenter: Vector2
  deltaEpicenter: Vector2
  currentEpicenter: Vector2
  pointerCount: number
  lastPointerMove: number
  state: InputState
  pointerMovements: PointerMovement[]
  threshold: number
  constructor(e = dragLimit) {
    this.startEpicenter = new Vector2()
    this.previousEpicenter = new Vector2()
    this.deltaEpicenter = new Vector2()
    this.currentEpicenter = new Vector2()
    this.pointerCount = 0
    this.lastPointerMove = Date.now()
    this.state = InputState.WAITING
    this.pointerMovements = []
    this.threshold = e
  }
  start(e) {
    if (this.state === InputState.WAITING) {
      this.restart(e)
      this.pointerMovements = e.map(e => new PointerMovement())
      e.forEach((e, t) => {
        this.pointerMovements[t].start(e.position)
      })
    }
  }
  stop() {
    this.state = InputState.WAITING
    const e = this.pointerCount
    this.pointerCount = 0
    const t = Date.now() - this.lastPointerMove
    return new MultiswiperStopEvent(e, this.currentEpicenter, this.deltaEpicenter, t)
  }
  onMove(e: InputGesturePointerItem[]) {
    B(this.getPointerPositions(e), this.currentEpicenter)
    e.forEach((e, t) => {
      this.pointerMovements[t].update(e.position)
    })
    if (this.pointerMovements.find(e => e.stationary())) return void this.restart(e)
    const t = this.pointerMovements[0].velocity
    if (this.pointerMovements.find(e => t.dot(e.velocity) < 0)) return void this.restart(e)
    if (this.state === InputState.WAITINGTOEXCEEDTHRESHOLD) {
      this.currentEpicenter.distanceTo(this.startEpicenter) > this.threshold && (this.state = InputState.GESTURING)
    }
    let n: MultiswiperMoveEvent | undefined
    if (this.state === InputState.GESTURING) {
      this.deltaEpicenter.copy(this.currentEpicenter).sub(this.previousEpicenter),
        (n = new MultiswiperMoveEvent(e.length, this.currentEpicenter, this.deltaEpicenter))
    }
    this.previousEpicenter.copy(this.currentEpicenter)
    this.lastPointerMove = Date.now()
    return n
  }
  getPointerPositions(e: InputGesturePointerItem[]) {
    return e.map(e => e.position)
  }
  restart(e) {
    B(this.getPointerPositions(e), this.startEpicenter),
      this.previousEpicenter.copy(this.startEpicenter),
      this.currentEpicenter.copy(this.previousEpicenter),
      (this.state = InputState.WAITINGTOEXCEEDTHRESHOLD),
      (this.pointerCount = e.length)
  }
}
const debugInfo = new DebugInfo("longpress")

enum InputProgressState {
  IDLE = 0,
  STARTED = 2,
  SUCCESSFUL = 3,
  WAITING = 1
}
class InputLongPress {
  onEventCallback: any
  state: InputProgressState
  ndcStartPosition: Vector2
  pointerDelta: Vector2
  ndcPosition: Vector2
  clientPosition: Vector2
  pressConfirmThreshold: number
  pressStartThreshold: number
  buttons: number
  holdTimeout: number
  startTime: number
  successTimeout: number
  constructor(e, t = pressConfirmThreshold) {
    this.onEventCallback = e
    this.state = InputProgressState.IDLE
    this.ndcStartPosition = new Vector2()
    this.pointerDelta = new Vector2()
    this.ndcPosition = new Vector2()
    this.clientPosition = new Vector2()
    this.pressConfirmThreshold = this.pressStartThreshold = Math.max(t, 1e-4)
  }
  start(e: InputGesturePointerItem) {
    this.state !== InputProgressState.IDLE && this.stop()

    if (this.state === InputProgressState.IDLE && 0 == (e.buttons & (e.buttons - 1))) {
      this.ndcStartPosition.copy(e.position)
      this.state = InputProgressState.WAITING
      this.buttons = e.buttons
      this.pointerDelta.set(0, 0)
      this.ndcPosition.copy(e.position)
      this.clientPosition.copy(e.clientPosition)
      this.holdTimeout = window.setTimeout(() => {
        this.state = InputProgressState.STARTED
        debugInfo.debug("STARTED")
        this.startTime = Date.now()
        this.progress(0)
        this.onEventCallback(new LongPressStartEvent(e.position, e.clientPosition, e.buttons))
        this.successTimeout = window.setTimeout(() => {
          debugInfo.debug("SUCCESSFUL")
          this.state = InputProgressState.SUCCESSFUL
          this.progress(1)
          this.onEventCallback(new LongPressDoneEvent(this.ndcPosition, this.clientPosition))
        }, this.pressConfirmThreshold)
      }, this.pressStartThreshold)
    }
  }
  stop() {
    const e = this.state
    if (
      ((this.state = InputProgressState.IDLE), window.clearTimeout(this.holdTimeout), window.clearTimeout(this.successTimeout), e > InputProgressState.WAITING)
    ) {
      debugInfo.debug("DONE, cancelled:", e < InputProgressState.SUCCESSFUL)
      const t = e < InputProgressState.SUCCESSFUL
      this.onEventCallback(new LongPressEndEvent(this.ndcPosition, this.clientPosition, t))
    }
  }
  onMove(e: InputGesturePointerItem) {
    const t = this.state === InputProgressState.STARTED || this.state === InputProgressState.WAITING
    const n = this.state === InputProgressState.STARTED || this.state === InputProgressState.SUCCESSFUL
    if (t || n) {
      this.ndcPosition.copy(e.position)
      this.clientPosition.copy(e.clientPosition)
      this.pointerDelta.copy(this.ndcPosition).sub(this.ndcStartPosition)
    }
    if (t && this.pointerDelta.length() > minPointerDelta) {
      this.stop()
    } else {
      n && this.onEventCallback(new LongPressMoveEvent(this.ndcPosition, this.clientPosition, this.pointerDelta, this.buttons))
    }
  }
  tick() {
    if (this.state === InputProgressState.STARTED) {
      const e = 1 - (this.pressStartThreshold - (Date.now() - this.startTime)) / this.pressStartThreshold
      this.progress(Math.min(1, e))
    }
  }
  progress(e) {
    this.onEventCallback(new LongPressProgressEvent(this.ndcPosition, this.clientPosition, this.pointerDelta, this.buttons, e))
  }
}
class InputDebug {
  displayTouches: boolean
  touches: Map<number, HTMLDivElement>
  constructor() {
    this.displayTouches = !1
    this.touches = new Map()
  }
  async init(e) {
    const [t] = await Promise.all([e.getModuleBySymbol(SettingsSymbol)])
    t.registerMenuButton({
      header: "Input",
      buttonName: "Toggle pointer visualization",
      callback: () => {
        this.displayTouches = !this.displayTouches
      }
    })
  }
  addPointer(e: number, t: MousePosition) {
    this.displayTouches && (this.touches.set(e, this.createPointer(t)), this.movePointer(e, t))
  }
  removePointer(e) {
    const t = this.touches.get(e)
    t && (document.body.removeChild(t), this.touches.delete(e))
  }
  movePointer(e: number, t: MousePosition) {
    const n = this.touches.get(e)
    n && ((n.style.left = t.x - 25 + "px"), (n.style.top = t.y - 25 + "px"))
  }
  createPointer(e) {
    const t = document.createElement("div")
    t.style.position = "fixed"
    t.style.backgroundColor = "#aa11aa"
    t.style.width = "50px"
    t.style.height = "50px"
    t.style.zIndex = "99999"
    t.style.pointerEvents = "none"
    t.style.touchAction = "none"
    t.style.borderRadius = "50px"
    document.body.appendChild(t)
    return t
  }
}

enum GestureType {
  CLICK_DRAG_LONGPRESS = 1,
  MULTI_SWIPE_ONLY = 3,
  NONE = 0,
  PINCH_ROTATE = 2
}
export interface InputGesturePointerItem {
  id: number
  position: Vector2
  clientPosition: Vector2
  buttons: number
  activeButtons: number
  device: InputPointerType
  ctrlKey: boolean
}
class InputGesture {
  activeGesture: GestureType
  pointers: InputGesturePointerItem[]
  couldBeClick: boolean
  isScrolling: boolean
  bindings: ISubscription[]
  onEventCallback: InputIniModule["onEvent"]
  clicker: InputClicker
  doubleClicker: DoubleClicker
  longPress: InputLongPress
  dragger: InputDragger
  pincher: InputPincher
  rotater: InputRotater
  multiswiper: InputMultiswiper
  scroller: InputScroller
  inputDebug: InputDebug
  constructor() {
    this.activeGesture = GestureType.NONE
    this.pointers = []
    this.couldBeClick = !1
    this.isScrolling = !1
    this.bindings = []
  }
  async init(e, t, n: EngineContext) {
    this.onEventCallback = t
    const i = await n.getModuleBySymbol(CanvasSymbol)
    this.clicker = new InputClicker(e.dragThreshold)
    this.doubleClicker = new DoubleClicker(e.dragThreshold)
    this.longPress = new InputLongPress(t, e.holdThreshold)
    this.dragger = new InputDragger(t, e.dragThreshold)
    this.pincher = new InputPincher(e.pinchThreshold)
    this.rotater = new InputRotater(e.rotateThreshold)
    this.multiswiper = new InputMultiswiper(e.dragThreshold)
    const s = sameWindow() && winCanTouch()
    this.scroller = new InputScroller(s, i.element, e.scrollThreshold)
    e.disableWheel || this.bindWheelHandlers(i.element)
    this.inputDebug = new InputDebug()
    this.inputDebug.init(n)
  }
  dispose() {
    for (const e of this.bindings) null == e || e.cancel()
    this.bindings = []
  }
  get activePointers() {
    return this.pointers.length
  }
  onPointerChange(e: OnMouseDownEvent | OnMoveEvent) {
    this.isMoveEvent(e) ? this.onPointerMove(e as OnMoveEvent) : this.onPointerButton(e as OnMouseDownEvent)
  }
  toggleTouchScrolling(e: boolean) {
    this.scroller.toggleTouchScrolling(e)
  }
  isMoveEvent(e: OnMouseDownEvent | OnMoveEvent) {
    return !e.hasOwnProperty("down")
  }
  onPointerMove(e: OnMoveEvent) {
    this.movePointer(e), this.inputDebug.movePointer(e.id, e.clientPosition)
  }
  onPointerButton(e: OnMouseDownEvent) {
    e.down ? (this.addPointer(e), this.inputDebug.addPointer(e.id, e.clientPosition)) : (this.removePointer(e), this.inputDebug.removePointer(e.id))
  }
  bindWheelHandlers(e: HTMLCanvasElement) {
    this.bindings.push(
      new EventsSubscription(e, "wheel", (t: WheelEvent) => {
        if (!sameWindow() || !isScrollGutter(t.clientX, e)) {
          t.preventDefault()
          this.onEventCallback(
            new WheelBindEvent(
              {
                x: t.clientX,
                y: t.clientY
              },
              {
                x: this.normalizeWheelDelta(t.deltaMode, t.deltaX),
                y: this.normalizeWheelDelta(t.deltaMode, t.deltaY)
              }
            )
          )
        }
      })
    )
  }
  normalizeWheelDelta(e: number, t: number) {
    if (e === WheelEvent.DOM_DELTA_LINE) {
      return 0.7 * t * t * t + 13 * t
    }
    return t
  }
  addPointer(e: OnMouseDownEvent) {
    const { id, button, position, clientPosition, device } = e
    const a = Index2Code(button)
    if (!a) return
    const l = this.getPointer(id)
    l && 0 == (l.buttons & a)
      ? ((l.buttons |= a), l.activeButtons++, (l.device = device))
      : this.pointers.push({
          id,
          position: new Vector2(position.x, position.y),
          clientPosition: new Vector2(clientPosition.x, clientPosition.y),
          buttons: a,
          activeButtons: 1,
          device,
          ctrlKey: e.nativeEvent.ctrlKey
        }),
      this.toggleGestures(e)
  }
  removePointer(e: OnMouseDownEvent) {
    const { id: t, button: n } = e
    const i = Index2Code(n)
    if (!i) return
    const s = this.getPointerIndex(t)
    if (-1 !== s) {
      const t = this.pointers[s]
      0 != (t.buttons & i) && ((t.buttons &= ~i), t.activeButtons--)
      t.activeButtons || this.pointers.splice(s, 1)
      this.toggleGestures(e)
    }
  }
  movePointer(e: OnMoveEvent) {
    const { id, position, clientPosition, buttons } = e
    const r = this.getPointer(id)
    if (r) {
      r.position.copy(new Vector2(position.x, position.y))
      r.clientPosition.copy(new Vector2(clientPosition.x, clientPosition.y))
      r.buttons !== buttons ? this.updateOffscreenPointer(r, e) : this.onEventCallback(new MovePointerEvent(this.pointers))
      switch (this.activeGesture) {
        case GestureType.CLICK_DRAG_LONGPRESS:
          const e = this.scroller.onMove(r)
          this.isScrolling = !!e
          const t = this.clicker.onMove(r)
          t && this.onEventCallback(t)
          const n = this.dragger.onMove(r)
          n && !this.isScrolling && this.onEventCallback(n), this.longPress.onMove(r)
          break
        case GestureType.PINCH_ROTATE:
          const i = this.pincher.onMove(this.pointers[0], this.pointers[1]),
            s = this.rotater.onMove(this.pointers[0], this.pointers[1])
          i && this.onEventCallback(i), s && this.onEventCallback(s)
        case GestureType.MULTI_SWIPE_ONLY:
          const a = this.multiswiper.onMove(this.pointers)
          a && this.onEventCallback(a)
      }
    }
  }
  getPointer(e: number) {
    const t = this.getPointerIndex(e)
    if (-1 !== t) return this.pointers[t]
  }
  toggleGestures(e: OnMouseDownEvent | OnMoveEvent) {
    this.onEventCallback(new MovePointerEvent(this.pointers))
    const t = this.activeGesture
    if (((this.activeGesture = this.pointers.length), t === GestureType.CLICK_DRAG_LONGPRESS && this.activeGesture === GestureType.NONE && this.couldBeClick)) {
      const e = this.clicker.stop()
      if (e && !this.isScrolling) {
        this.onEventCallback(e)
        const t = this.doubleClicker.checkForDoubleClick(e)
        t && this.onEventCallback(t)
      }
    }
    this.couldBeClick = t === GestureType.NONE && this.activeGesture === GestureType.CLICK_DRAG_LONGPRESS
    if (this.activeGesture === GestureType.CLICK_DRAG_LONGPRESS) {
      const t = this.clicker.start(this.pointers[0])
      if ((t && this.onEventCallback(t), !e.defaultPrevented)) {
        this.scroller.start(this.pointers[0])
        const e = this.dragger.start(this.pointers[0])
        e && this.onEventCallback(e), this.longPress.start(this.pointers[0])
      }
    } else if (t === GestureType.CLICK_DRAG_LONGPRESS) {
      const e = this.dragger.stop()
      this.scroller.stop()
      this.isScrolling = !1
      this.longPress.stop()
      this.onEventCallback(e)
    }
    this.activeGesture === GestureType.PINCH_ROTATE
      ? (this.pincher.start(this.pointers[0], this.pointers[1]), this.rotater.start(this.pointers[0], this.pointers[1]), this.multiswiper.start(this.pointers))
      : t === GestureType.PINCH_ROTATE &&
        (this.onEventCallback(this.pincher.stop()), this.onEventCallback(this.rotater.stop()), this.onEventCallback(this.multiswiper.stop())),
      this.activeGesture === GestureType.MULTI_SWIPE_ONLY
        ? this.multiswiper.start(this.pointers)
        : t === GestureType.MULTI_SWIPE_ONLY && this.onEventCallback(this.multiswiper.stop())
  }
  getPointerIndex(e: number) {
    for (let t = 0; t < this.pointers.length; t++) {
      if (this.pointers[t].id === e) return t
    }
    return -1
  }
  updateOffscreenPointer(e: InputGesturePointerItem, t: OnMoveEvent) {
    if (((e.buttons = t.buttons), 0 === t.buttons)) {
      const n = this.getPointerIndex(e.id)
      this.pointers.splice(n, 1), this.toggleGestures(t)
    }
  }
  tick() {
    this.longPress.tick()
  }
}
export class FilteredHandler {
  _renew: any
  _cancel: any
  active: any
  constructor(e, t, n) {
    this._renew = e
    this._cancel = t
    this.active = n
  }
  renew() {
    this.active() || this._renew()
  }
  cancel() {
    this.active() && this._cancel()
  }
}

export default class InputIniModule extends Module {
  fallbackHandlerMap: Record<string, any[]>
  meshHandlerMap: Record<string, any[]>
  priorityHandlerMap: {}
  unfilteredHandlerMap: {}
  captureHandlerMap: {}
  gesturing: boolean
  gestureCapture: MapListHelper<Intersection>
  activeIntersections: MapListHelper<Intersection>
  eventTypeLookup: TypeLookup
  meshTypeLookup: TypeLookup
  hoveredMesh: { object: Object3D | null; instanceId?: number; index?: number }
  registerUnfilteredHandler: <D extends typeof Event = typeof Event>(e: D, t: (e: InstanceType<D>) => void) => FilteredHandler
  registerMesh: <T extends Object3D = Object3D>(e: T, t: boolean, n?: any) => void
  raycaster: RaycasterModule
  unregisterMesh: <T extends Object3D = Object3D>(e: T) => void
  onPointerEvent: (e: OnMouseDownEvent | OnMoveEvent) => void
  inputGesture: InputGesture
  inputPointer: InputPointer
  keyboardState: KeyboardState
  onEvent: (
    e:
      | InputClickerStartEvent
      | MovePointerEvent
      | DraggerWaitingEvent
      | PincherMoveEvent
      | RotaterMoveEvent
      | MultiswiperMoveEvent
      | InputClickerEndEvent
      | DoubleClickerStopEvent
      | DraggeringEvent
      | DraggerStopEvent
      | DraggerStartEvent
      | OnMouseDownEvent
      | OnMoveEvent
      | WheelBindEvent
      | RotaterStopEvent
  ) => void
  constructor() {
    super(...arguments)
    this.name = "input-ini"
    this.fallbackHandlerMap = {}
    this.meshHandlerMap = {}
    this.priorityHandlerMap = {}
    this.unfilteredHandlerMap = {}
    this.captureHandlerMap = {}
    this.gesturing = !1
    this.gestureCapture = new MapListHelper(e => e.object.id)
    this.activeIntersections = new MapListHelper(e => e.object.id)
    this.eventTypeLookup = new TypeLookup()
    this.meshTypeLookup = new TypeLookup()
    this.hoveredMesh = {
      object: null,
      instanceId: void 0,
      index: void 0
    }

    this.registerUnfilteredHandler = (e, t) => {
      this.insertHandler(e, this.unfilteredHandlerMap, t)
      const n = this.eventTypeLookup.getKeyByType(e)
      return new FilteredHandler(
        () => this.registerUnfilteredHandler(e, t),
        () => this.unregisterUnfilteredHandler(e, t),
        () => -1 !== this.unfilteredHandlerMap[n].indexOf(t)
      )
    }
    this.registerMesh = (e, t, n) => {
      this.raycaster.targets.addTarget(e, t, n)
    }
    this.unregisterMesh = e => {
      this.raycaster.targets.removeTarget(e)
    }
    this.onPointerEvent = e => {
      const t = !e.hasOwnProperty("down")
      const n = !t && e["down"]
      const i = !n && !t
      this.raycaster.pointer.updatePointer(new Vector2(e.position.x, e.position.y))
      this.activeIntersections.clear()
      for (const e of this.raycaster.pointer.cast()) this.activeIntersections.add(e)
      if (t || n) {
        if (!this.gesturing) {
          this.gestureCapture.clear()
          for (const e of this.activeIntersections) this.gestureCapture.add(e)
          this.updateHoveredMesh(e)
        }
        n && (this.gesturing = !0), this.onEvent(e)
      }
      i && this.onEvent(e)
      this.inputGesture.onPointerChange(e)
      if (0 === this.inputGesture.activePointers) {
        this.activeIntersections.clear()
        this.gestureCapture.clear()
        this.gesturing && this.updateHoveredMesh(e)
        this.gesturing = !1
      }
    }
    this.onEvent = e => {
      const t = this.eventTypeLookup.getKeyByInstance(e)
      const n = this.captureHandlerMap[t]
      if (n && n.length > 0) {
        for (const t of n) t(e)
        return void (n.length = 0)
      }
      const i = this.unfilteredHandlerMap[t]
      if (i) for (const t of i) t(e)
      const s = this.iterateMeshCallbacks(e, this.gesturing ? this.gestureCapture : this.activeIntersections),
        r = this.fallbackHandlerMap[t]
      if (!s && r) for (const t of r) t(e)
    }
  }

  async init(e, t: EngineContext) {
    const n = {
      disableWheel: !!e.disableWheel
    }
    const i = sameWindow() && winCanTouch()
    this.bindings.push(
      t.commandBinder.addBinding(GutterTouchScrollEnableCommand, async () => {
        i && (this.inputGesture.toggleTouchScrolling(!0), this.inputPointer.toggleTouchScrolling(!0))
      }),
      t.commandBinder.addBinding(GutterTouchScrollDisableCommand, async () => {
        i && (this.inputGesture.toggleTouchScrolling(!1), this.inputPointer.toggleTouchScrolling(!1))
      })
    )
    const s = await t.getModuleBySymbol(CanvasSymbol)
    const r = await t.market.waitForData(CanvasData)
    this.raycaster = await t.getModuleBySymbol(RaycasterSymbol)
    this.inputPointer = new InputPointer(
      {
        pointerPreventDefault: e.pointerPreventDefault
      },
      s.element,
      r,
      this.onPointerEvent,
      i
    )
    this.keyboardState = new KeyboardState(e.rootNode, this.onEvent)
    this.inputGesture = new InputGesture()
    this.inputGesture.init(n, this.onEvent, t)
  }
  dispose(e) {
    super.dispose(e)
    this.inputPointer.dispose()
    this.keyboardState.dispose()
    this.inputGesture.dispose()
  }
  registerHandler<D extends typeof Event = typeof Event>(e: D, t: (e: InstanceType<D>) => void) {
    this.insertHandler(e, this.fallbackHandlerMap, t)
    const n = this.eventTypeLookup.getKeyByType(e, !0)
    return new FilteredHandler(
      () => this.registerHandler(e, t),
      () => this.unregisterHandler(e, t),
      () => -1 !== this.fallbackHandlerMap[n].indexOf(t)
    )
  }
  unregisterHandler<D extends typeof Event = typeof Event>(e: D, t) {
    this.removeHandler(e, this.fallbackHandlerMap, t)
  }
  registerMeshHandler<T extends Mesh = Mesh, D extends typeof Event = typeof Event>(
    e: D,
    t: { compare: (e: T) => boolean },
    n: (e: InstanceType<D>, t: T, a?: Intersection) => void,
    i?: any
  ) {
    return this._registerMeshHandler(e, {
      comparator: t,
      callback: n,
      default: i?.default
    })
  }
  _registerMeshHandler<D extends typeof Event = typeof Event>(e: D, t) {
    const i = this.eventTypeLookup.getKeyByType(e, !0)
    this.meshHandlerMap[i] || (this.meshHandlerMap[i] = [])
    const s = this.meshHandlerMap[i]
    let r = s.length
    if (!t.default) for (; s[r - 1]?.default; ) r--
    s.splice(r, 0, t)
    return new FilteredHandler(
      () => this._registerMeshHandler(e, t),
      () => this.unregisterMeshHandler(e, t),
      () => -1 !== s.indexOf(t)
    )
  }
  unregisterMeshHandler<D extends typeof Event = typeof Event>(e: D, t) {
    const n = this.eventTypeLookup.getKeyByType(e, !0)
    if (this.meshHandlerMap[n]) {
      const e = this.meshHandlerMap[n],
        i = e.indexOf(t)
      i > -1 && e.splice(i, 1)
    }
  }
  registerPriorityHandler<D extends typeof Event = typeof Event>(e: D, t, n) {
    const i = this.eventTypeLookup.getKeyByType(e, !0)
    const r = this.meshTypeLookup.getKeyByType(t, !0)
    this.priorityHandlerMap[i] || (this.priorityHandlerMap[i] = {})
    const a = this.priorityHandlerMap[i]
    if (a[r]) {
      const n = getClassName(e)
      const i = getClassName(t)
      throw Error(`${n} already has a priority handler registered for mesh type: ${i}`)
    }
    a[r] = n
    return new FilteredHandler(
      () => this.registerPriorityHandler(e, t, n),
      () => this.unregisterPriorityHandler(e, t, n),
      () => void 0 !== a[r]
    )
  }
  unregisterPriorityHandler(e, t, n) {
    const i = this.eventTypeLookup.getKeyByType(e),
      s = this.priorityHandlerMap[i]
    if (s) {
      const e = this.meshTypeLookup.getKeyByType(t),
        i = s[e]
      i && n === i && delete s[e]
    }
  }
  unregisterUnfilteredHandler<D extends typeof Event = typeof Event>(e: D, t) {
    this.removeHandler(e, this.unfilteredHandlerMap, t)
  }
  captureNext(e, t) {
    return this.insertHandler(e, this.captureHandlerMap, t), t
  }
  removeCaptureHandler<D extends typeof Event = typeof Event>(e: D, t) {
    this.removeHandler(e, this.captureHandlerMap, t)
  }
  registerSnappingMeshGeometry(meshName: string, geometry, meta, filter?: Function) {
    this.raycaster.snapping.addMeshGeometry(meshName, geometry, meta, filter)
  }
  unregisterSnappingMeshGeometry(e) {
    this.raycaster.snapping.removeMeshGeometry(e)
  }
  getCurrentPointerRay() {
    return this.raycaster.pointer.pointerRay.clone()
  }
  getCurrentRayHits() {
    return this.activeIntersections.copyToList([])
  }
  updateHoveredMesh(e: OnMouseDownEvent | OnMoveEvent) {
    const t = this.activeIntersections.getByIndex(0),
      n = t && t.object === this.hoveredMesh.object && t.instanceId === this.hoveredMesh.instanceId && t.index === this.hoveredMesh.index
    let i = !1
    if (this.hoveredMesh.object && (void 0 === t || !n)) {
      const n = this.getMeshHandler(UnhoverMeshEvent, getClassConstructor(this.hoveredMesh.object), this.priorityHandlerMap)
      if ((n && (i = n(new UnhoverMeshEvent(e.nativeEvent), this.hoveredMesh.object, t) || !1), !i)) {
        const n = this.meshHandlerMap[this.eventTypeLookup.getKeyByType(UnhoverMeshEvent)]
        if (n) for (const i of n) i.comparator.compare(this.hoveredMesh.object) && i.callback(new UnhoverMeshEvent(e.nativeEvent), this.hoveredMesh.object, t)
      }
    }
    let r = !1
    if (t && !n) {
      const n = this.getMeshHandler(HoverMeshEvent, getClassConstructor(t.object), this.priorityHandlerMap)
      if ((n && (r = n(new HoverMeshEvent(e.nativeEvent), t.object, t) || !1), !r)) {
        const n = this.meshHandlerMap[this.eventTypeLookup.getKeyByType(HoverMeshEvent)]
        if (n) for (const i of n) i.comparator.compare(t.object) && i.callback(new HoverMeshEvent(e.nativeEvent), t.object, t)
      }
    }
    this.hoveredMesh.object = (t && t.object) || null
    this.hoveredMesh.instanceId = null == t ? void 0 : t.instanceId
    this.hoveredMesh.index = null == t ? void 0 : t.index
  }
  iterateMeshCallbacks(e, t) {
    let n = !1
    const i = this.eventTypeLookup.getKeyByInstance(e)

    for (let s = 0; s < t.count(); s++) {
      const r = t.getByIndex(s)
      if (!r) continue
      if (n) break
      const a = r.object
      const o = this.activeIntersections.get(a.id) || r
      for (const t in this.priorityHandlerMap[i]) {
        if (r.object instanceof this.meshTypeLookup.getTypeByKey(t)) {
          const s = this.priorityHandlerMap[i] && this.priorityHandlerMap[i][t]
          if (s && ((n = !0), s(e, a, o) || e.propagationStopped)) {
            return !0
          }
        }
      }

      const l = this.meshHandlerMap[i]

      if (l) {
        for (const t of l) {
          if (t.comparator.compare(a) && (!t.default || !e.defaultPrevented)) {
            const i = t.callback(e, a, o)
            ;(i || void 0 === i || e.propagationStopped) && (n = !0)
          }
        }
      }
    }
    return n
  }
  insertHandler<D extends typeof Event = typeof Event>(e: D, t: Record<string, Array<(e: InstanceType<D>) => void>>, n: (e: InstanceType<D>) => void) {
    const i = this.eventTypeLookup.getKeyByType(e, !0)
    t[i] || (t[i] = []), t[i].push(n)
  }
  removeHandler<D extends typeof Event = typeof Event>(e: D, t: Record<string, Array<(e: InstanceType<D>) => void>>, n: (e: InstanceType<D>) => void) {
    const i = t[this.eventTypeLookup.getKeyByType(e)]
    if (i)
      for (let e = 0; e < i.length; e++)
        if (i[e] === n) {
          i.splice(e, 1)
          break
        }
  }
  getMeshHandler(e, t, n) {
    const i = n[this.eventTypeLookup.getKeyByType(e)]
    if (i) {
      return i[this.meshTypeLookup.getKeyByType(t)]
    }
    return null
  }
  onUpdate() {
    this.inputGesture.tick()
  }
}
