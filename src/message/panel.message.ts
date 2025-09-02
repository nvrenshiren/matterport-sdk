import { Message } from "../core/message"

export class AssetDockedMessage extends Message {
  /**
   * 停靠
   */
}

export class AssetUndockedMessage extends Message {
  /**
   * 不停靠
   */
}

export class PanelCollapseMessage extends Message {
  collapsed: boolean
  /**
   * 面板折叠的消息
   * @param collapsed 侧边栏是否打开
   */
  constructor(e: boolean) {
    super()
    this.collapsed = e
  }
}
export class PanelTransitionEndMessage extends Message {
  active: boolean
  collapsed: boolean
  /**
   * 面板过渡结束的消息
   * @param e 是否激活状态
   * @param t 是否折叠
   */
  constructor(e: boolean, t: boolean) {
    super()
    this.active = e
    this.collapsed = t
  }
}

export class ToggleViewingControlsMessage extends Message {
  show: boolean
  /**
   * 点击搜索图标打开侧边栏的消息
   *
   * @param show 侧边栏是否打开
   */
  constructor(e: boolean) {
    super()
    this.show = e
  }
}
export class SetAppBarVisibleMessage extends Message {
  visible: boolean
  constructor(e: boolean) {
    super()
    this.visible = e
  }
}
