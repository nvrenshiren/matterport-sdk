import { Message } from "../core/message"
export class SnapshotErrorMessage extends Message {
  error: Error
  /**
   * 快照错误消息
   *
   * @param e 错误对象
   */
  constructor(e: Error) {
    super()
    this.error = e
  }
}

import { SnapshotObject } from "../object/snapshot.object"
export class GalleryImageAddMessage extends Message {
  snapshot: SnapshotObject
  /**
   *
   * @param e 快照对象
   */
  constructor(e: SnapshotObject) {
    super()
    this.snapshot = e
  }
}
