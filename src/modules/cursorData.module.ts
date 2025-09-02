import { MathUtils, Vector2 } from "three"
import { CursorSymbol, InputSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { CursorData } from "../data/cursor.data"
import { PointerData } from "../data/pointer.data"
import { OnMoveEvent } from "../events/mouse.event"
import InputIniModule from "./inputIni.module"
import EngineContext from "../core/engineContext"
declare global {
  interface SymbolModule {
    [CursorSymbol]: CursorDataModule
  }
}
export default class CursorDataModule extends Module {
  fadeOutDelay: number
  fadeOutDuration: number
  fadeInDuration: number
  movementThreshold: number
  cursorState: CursorData
  position: Vector2
  timeToFade: number
  input: InputIniModule
  raycasterData: PointerData
  constructor() {
    super(...arguments),
      (this.name = "cursor-data"),
      (this.fadeOutDelay = 700),
      (this.fadeOutDuration = 700),
      (this.fadeInDuration = 300),
      (this.movementThreshold = 0.003),
      (this.cursorState = new CursorData()),
      (this.position = new Vector2()),
      (this.timeToFade = 0)
  }
  async init(_e, t: EngineContext) {
    ;(this.input = await t.getModuleBySymbol(InputSymbol)),
      (this.raycasterData = await t.market.waitForData(PointerData)),
      t.market.register(this, CursorData, this.cursorState),
      this.bindings.push(this.input.registerHandler(OnMoveEvent, this.onPointerMove.bind(this))),
      this.fadeInDuration > this.fadeOutDelay && this.log.warn("fadeInDuration should be less than fadeOutDelay!")
  }
  onUpdate(e) {
    let t = !1
    this.timeToFade > 0 && ((this.timeToFade -= e), this.timeToFade <= 0 && (t = !0)),
      this.cursorState.opacity.tick(e),
      this.cursorState.commit(),
      t && this.cursorState.opacity.modifyAnimation(1, 0, this.fadeOutDuration)
  }
  setFadeProps(e) {
    const { fadeOut: t, fadeIn: i } = e
    ;(this.fadeOutDuration = t && t.duration ? t.duration : this.fadeOutDuration),
      (this.fadeOutDelay = t && t.delay ? t.delay : this.fadeOutDelay),
      (this.fadeInDuration = i && i.duration ? i.duration : this.fadeInDuration)
  }
  setTexture(e) {
    this.cursorState.texture = e
  }
  onPointerMove() {
    if (null !== this.raycasterData.hit && this.raycasterData.pointerNdcPosition.distanceToSquared(this.position) > this.movementThreshold) {
      this.position.copy(this.raycasterData.pointerNdcPosition), (this.timeToFade = this.fadeOutDelay)
      const e = MathUtils.lerp(0, this.fadeInDuration, 1 - this.cursorState.opacity.value)
      this.cursorState.opacity.modifyAnimation(this.cursorState.opacity.value, 1, e), this.cursorState.commit()
    }
  }
  dispose(e) {
    super.dispose(e)
  }
}
