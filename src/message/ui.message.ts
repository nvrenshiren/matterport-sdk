import { InputHTMLAttributes } from "react"
import { Message } from "../core/message"
export class ModalToggledMeeage extends Message {
  /**
   * 弹窗开关消息
   * @param modal modal实例
   * @param open 是否打开
   */
  modal: string
  open: boolean
  constructor(e: string, t: boolean) {
    super()
    this.modal = e
    this.open = t
  }
}

export class LoadSpinnerMessage extends Message {
  isOpen: boolean
  /**
   * 加载下拉列表
   * @param isOpen 是否打开
   */
  constructor(e: boolean) {
    super()
    this.isOpen = e
  }
}

export class LoadSpinnerSuppressMessage extends Message {
  suppress: boolean
  constructor(e: boolean) {
    super()
    this.suppress = e
  }
}

export class HandleTextBoxFocusMessage extends Message {
  /**
   * 搜索框获取焦点
   * @param textElement 文本元素
   * @param focused 是否聚焦状态
   */
  textElement: HTMLInputElement
  focused: boolean
  constructor(e: HTMLInputElement, t: boolean) {
    super()
    this.textElement = e
    this.focused = t
  }
}
