import { SnapshotCategory } from "../const/50090"
import { PanoSizeAspect, PanoSizeKey } from "../const/76609"
import { Command } from "../core/command"
import { SnapshotObject } from "../object/snapshot.object"
import { ObservableValue } from "../observable/observable.value"
export class CaptureSnapshotCommand extends Command {
  /**
   * @param e.maxSize 最大文件大小，默认为 a.SL.ULTRAHIGH
   * @param e.aspect 宽高比，默认为 PanoSizeAspect
   * @param e.category 类别，默认为 SnapshotCategory.USER
   * @param e.onProgress 进度回调，可选
   * @param e.waitForUpload 是否等待上传完成，默认为 true（如果未传入则也为 true）
   */
  payload: { waitForUpload: boolean; maxSize: PanoSizeKey; onProgress?: ObservableValue<number>; category: SnapshotCategory; aspect: number }
  constructor(e: Partial<CaptureSnapshotCommand["payload"]>) {
    super()
    this.id = "CAPTURE_SNAPSHOT"
    this.payload = {
      maxSize: e.maxSize || PanoSizeKey.ULTRAHIGH,
      aspect: e.aspect || PanoSizeAspect,
      category: e.category || SnapshotCategory.USER,
      onProgress: e.onProgress,
      waitForUpload: void 0 === e.waitForUpload || e.waitForUpload
    }
  }
}
export class EquirectangularSnapshotCommand extends Command {
  /**
   * @param e.onProgress 上传进度回调函数
   * @param e.waitForUpload 是否等待上传完成，默认为false
   */
  constructor(e: { onProgress: () => void; waitForUpload: boolean }) {
    super()
    this.id = "EQUIRECTANGULAR_SNAPSHOT"
    this.payload = { onProgress: e.onProgress, waitForUpload: void 0 === e.waitForUpload || e.waitForUpload }
  }
}
export class RenameSnapshotCommand extends Command {
  /**
   * 重命名快照
   *
   * @param e 快照ID
   * @param t 快照名称
   */
  constructor(e: string, t: string) {
    super()
    this.id = "RENAME_SNAPSHOT"
    this.payload = {
      id: e,
      name: t
    }
  }
}
export class DeleteSnapshotCommand extends Command {
  /**
   * 删除快照
   *
   * @param e 快照ID
   */
  constructor(e: string) {
    super()
    this.id = "DELETE_SNAPSHOT"
    this.payload = {
      id: e
    }
  }
}
export class UploadSnapshotCommand extends Command {
  /**
   *
   * @param e 上传的快照
   */
  payload: {
    snapshot: SnapshotObject
  }
  constructor(e: SnapshotObject) {
    super()
    this.id = "UPLOAD_SNAPSHOT"
    this.payload = {
      snapshot: e
    }
  }
}
export class SetCurrentSnapshotPhotoCommand extends Command {
  /**
   * 设置当前快照的照片
   *
   * @param e 照片ID
   */
  constructor(e: string) {
    super()
    this.id = "SET_CURRENT_SNAPSHOT_PHOTO"
    this.payload = {
      id: e
    }
  }
}
