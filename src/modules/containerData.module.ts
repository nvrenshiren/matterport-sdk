import * as r from "../const/screen.const"
import { ScreenOrientationType } from "../const/screen.const"
import { ContainerDataSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { ContainerData } from "../data/container.data"
import { ContainerOrientationMessage, ContainerResizeMessage } from "../message/container.message"

declare global {
  interface SymbolModule {
    [ContainerDataSymbol]: ContainerDataModule
  }
}
export default class ContainerDataModule extends Module {
  onResize: () => void
  data: ContainerData
  resizeObserver: ResizeObserver

  constructor() {
    super(...arguments)
    this.name = "container-data"
    this.onResize = () => {
      const { clientWidth, clientHeight } = this.data.element
      this.data.size = {
        width: clientWidth,
        height: clientHeight
      }
      this.data.orientation = clientWidth > clientHeight ? ScreenOrientationType.LANDSCAPE : ScreenOrientationType.PORTRAIT
      this.data.commit()
    }
  }

  async init(e, t) {
    this.data = new ContainerData(e.element)
    t.market.register(this, ContainerData, this.data)
    this.resizeObserver = new ResizeObserver(this.onResize)
    this.resizeObserver.observe(e.element)
    this.onResize()
    this.data.onPropertyChanged("size", e => {
      t.broadcast(new ContainerResizeMessage(e.width, e.height))
    })
    this.data.onPropertyChanged("orientation", e => {
      t.broadcast(new ContainerOrientationMessage(e))
    })
  }

  dispose(e) {
    e.market.unregister(this, ContainerData)
    this.resizeObserver.disconnect()
    super.dispose(e)
  }
}
