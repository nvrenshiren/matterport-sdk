import { ReactElement, JSXElementConstructor } from "react"
import { Command } from "../core/command"

export enum ConfirmBtnSelect {
  CLOSE = 1,
  CONFIRM = 0
}

export enum ConfirmModalState {
  CLOSE,
  DISPLAY,
  UPDATE
}

const Properties = {
  message: "",
  title: "",
  modalClass: "",
  cancellable: !0,
  closeButton: !0,
  confirmDisabled: !1
}

export class ConfirmModalCommand extends Command {
  static id: string
  /**
   * @param e 模态框的行为（action）
   * @param t 模态框的属性（properties）对象，默认为空对象
   * @throws 当尝试打开一个空的模态框时，将抛出错误
   */
  constructor(e: ConfirmModalState, t?: any) {
    super()
    if (e && !t) throw new Error("Cannot open empty modal")
    this.payload = {
      action: e,
      properties: Object.assign(Object.assign({}, Properties), t)
    }
  }
}

ConfirmModalCommand.id = "CONFIRM_MODAL"
export class ToggleModalCommand extends Command {
  static id: string
  /**
   * @param e modal对象
   * @param t 是否打开modal的标志
   */
  constructor(e: string, t: boolean) {
    super(),
      (this.payload = {
        modal: e,
        open: t
      })
  }
}
ToggleModalCommand.id = "TOGGLE_MODAL"
export class CloseModalCommand extends Command {
  static id: string
  /**
   * @class 关闭modal的命令
   */
  constructor() {
    super()
  }
}
CloseModalCommand.id = "CLOSE_MODAL"
export class ShowToastrCommand extends Command {
  constructor(e: {
    messagePhraseKey: string
    timeout: number
    dismissesOnAction: boolean
    ctaPhraseKey?: string
    multiline?: boolean
    actionHandler?: (() => void) | (() => Promise<void>)
  }) {
    super()
    this.id = "SHOW_TOASTR"
    this.payload = e
  }
}
export class HideToastrCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "HIDE_TOASTR"
  }
}
