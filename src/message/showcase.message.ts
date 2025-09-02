import { Message } from "../core/message"
export class ShowcaseExpandedMessage extends Message {
  expanded: boolean
  constructor(e: boolean) {
    super()
    this.expanded = e
  }
}
