import { Color, Texture, Vector3 } from "three"
import { Command } from "../core/command"
import { PinType } from "../const/62612"
import { TagObject } from "../object/tag.object"
export class PinUnselectCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "PIN_UNSELECT"
    this.payload = { id: e }
  }
}
export class HighlightPinCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "HIGHLIGHT_PIN"
    this.payload = { sweepId: e, highlight: t }
  }
}
export class TogglePinConnectionsCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "TOGGLE_PIN_CONNECTIONS"
    this.payload = {
      enabled: e
    }
  }
}
export class EnablePinCreationCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "ENABLE_PIN_CREATION"
    this.payload = {
      enabled: e
    }
  }
}
export class SelectPinCommand extends Command {
  /**
   *
   * @param e 标识符
   * @param t 引脚类型
   * @param n 是否可编辑
   */
  constructor(e: string, t: string, n: boolean) {
    super()
    this.id = "SELECT_PIN"
    this.payload = {
      id: e,
      pinType: t,
      editable: n
    }
  }
}
export class UnselectPinCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "UNSELECT_PIN"
    this.payload = {
      id: e,
      pinType: t
    }
  }
}
export class CreatePinCommand extends Command {
  constructor(
    e: string,
    t: {
      id: string
      anchorPosition: Vector3
      color: string
      floorId: string
      roomId: string
      stemEnabled: boolean
      stemNormal: Vector3
      stemLength: number
      pinType: string
      backgroundTexture: Texture
      icon: string
      visible: boolean
    },
    n: string,
    i: Texture
  ) {
    super()
    this.id = "CREATE_PIN"
    this.payload = {
      id: e,
      pin: t,
      pinType: n,
      backgroundTexture: i
    }
  }
}
export class PinCreationCancelCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "PIN_CREATION_CANCEL"
    this.payload = {
      id: e,
      pinType: t
    }
  }
}
export class RemovePinCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "REMOVE_PIN"
    this.payload = {
      id: e,
      pinType: t
    }
  }
}
export class RemovePinTypeCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "REMOVE_PIN_TYPE"
    this.payload = {
      pinType: e
    }
  }
}
export class UpdatePinViewsCommand extends Command {
  constructor(
    e: {
      id: string
      anchorPosition: Vector3
      color: string
      floorId: string
      roomId: string
      stemEnabled: boolean
      stemNormal: Vector3
      stemLength: number
      pinType: string
      backgroundTexture: Texture
      icon: string
      visible: boolean
    }[]
  ) {
    super()
    this.id = "UPDATE_PIN_VIEWS"
    this.payload = {
      pinViews: e
    }
  }
}
export class UpdatePinCommand extends Command {
  payload: {
    id: string
    pinType: PinType
    properties: ReturnType<TagObject["getPin"]>
  }
  constructor(id: string, pinType: PinType, properties: ReturnType<TagObject["getPin"]>) {
    super()
    this.id = "UPDATE_PIN"
    this.payload = {
      id,
      pinType,
      properties
    }
  }
}
export class TogglePinEditingCommand extends Command {
  constructor(e: string, t = !1) {
    super()
    this.id = "TOGGLE_PIN_EDITING"
    this.payload = {
      id: e,
      editable: t
    }
  }
}
export class ChangePinVisibilityCommand extends Command {
  constructor(e: string, t: string, n: boolean) {
    super()
    this.id = "CHANGE_PIN_VISIBILITY"
    this.payload = {
      id: e,
      pinType: t,
      visible: n
    }
  }
}
export class ChangePinTypeVisibilityCommand extends Command {
  constructor(pinType: PinType, visible: boolean) {
    super()
    this.id = "CHANGE_PIN_TYPE_VISIBILITY"
    this.payload = {
      pinType,
      visible
    }
  }
}
export class ChangePinOpacityCommand extends Command {
  constructor(e: string, t: string, n: number) {
    super()
    this.id = "CHANGE_PIN_OPACITY"
    this.payload = {
      id: e,
      pinType: t,
      opacity: n
    }
  }
}
export class ChangePinOpacityScaleCommand extends Command {
  constructor(e: string, t: string, n: number) {
    super()
    this.id = "CHANGE_PIN_OPACITY_SCALE"
    this.payload = {
      id: e,
      pinType: t,
      scale: n
    }
  }
}
export class ChangePinTypeOpacityCommand extends Command {
  constructor(e: string, t: number, n: string[] = []) {
    super()
    this.id = "CHANGE_PIN_TYPE_OPACITY"
    this.payload = {
      pinType: e,
      opacity: t,
      skipIds: n
    }
  }
}
export class PinSelectionClearCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "PIN_SELECTION_CLEAR"
  }
}
export class PinClickElsewhereCommand extends Command {
  constructor() {
    super()
    this.id = "PIN_CLICK_ELSEWHERE"
  }
}
export class PlacePinCommand extends Command {
  constructor() {
    super()
    this.id = "PLACE_PIN"
  }
}
export class MovePinCommand extends Command {
  constructor(
    e: string,
    t: { anchorPosition: number; stemNormal: string; floorId: string; roomId: string; stemLength: number; stemEnabled: boolean; color: Color },
    n: { enabled: boolean; previewCirclePosition: number; size: number }
  ) {
    super()
    this.id = "MOVE_PIN"
    this.payload = {
      id: e,
      pos: t,
      previousPos: n
    }
  }
}
export class ModuleTogglePinEditingCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "TOGGLE_PIN_EDITING"
    this.payload = {
      enabled: e
    }
  }
}
export class TogglePinNumbersCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "TOGGLE_PIN_NUMBERS"
    this.payload = {
      enabled: e
    }
  }
}
