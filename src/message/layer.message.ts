import { Message } from "../core/message"
export class ModelViewChangeCompleteMessage extends Message {}
export class LayersBatchItemsCompleteMessage extends Message {
  items: any
  constructor(e: any[]) {
    super()
    this.items = e
  }
}
export class LayerAddedMessage extends Message {
  layerId: string
  /**
   *
   * @param e 图层ID
   */
  constructor(e: string) {
    super()
    this.layerId = e
  }
}
