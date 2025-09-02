import * as a from "../object/attachments.object"
import { Data } from "../core/data"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
import { AttachmentsObject } from "../object/attachments.object"
export class AttachmentsData extends Data {
  name: string
  pendingAttachments: ObservableMap<unknown>
  removedAttachments: ObservableMap<unknown>
  currentUploads: ObservableMap<unknown>
  failedUploads: ObservableMap<unknown>
  constructor() {
    super()
    this.name = "attachments-data"
    this.pendingAttachments = createObservableMap()
    this.removedAttachments = createObservableMap()
    this.currentUploads = createObservableMap()
    this.failedUploads = createObservableMap()
  }
  iteratePending(e) {
    for (const t of this.pendingAttachments) e(t)
  }
  iterateRemoved(e) {
    for (const t of this.removedAttachments) e(t)
  }
  get pendings() {
    return this.pendingAttachments
  }
  get removals() {
    return this.removedAttachments
  }
  getPendingAttachment(e) {
    return this.pendingAttachments.get(e)
  }
  getRemovedAttachment(e) {
    return this.removedAttachments.get(e)
  }
  addPending(e) {
    this.pendingAttachments.set(e.id, e)
  }
  removePendingAttachment(e: string) {
    this.pendingAttachments.has(e) && this.pendingAttachments.delete(e)
  }
  clearPending() {
    this.pendingAttachments.clear()
  }
  getPendingAttachmentsForAsset(e, t) {
    const i = []
    return (
      this.iteratePending(n => {
        n.parentType === t && n.parentId === e && i.push(n)
      }),
      i
    )
  }
  getRemovedAttachmentsForAsset(e, t) {
    const i = []
    return (
      this.iterateRemoved(n => {
        n.parentType === t && n.parentId === e && i.push(n)
      }),
      i
    )
  }
  markAttachmentForDelete(e: Partial<a.AttachmentsObject>) {
    const t = new AttachmentsObject(e)
    this.removedAttachments.set(t.id, t)
  }
  clearRemovals() {
    this.removedAttachments.clear()
  }
  get uploads() {
    return this.currentUploads
  }
  addUpload(e) {
    this.uploads.set(e.id, e)
  }
  updateUpload(e) {
    this.uploads.has(e.id) && this.uploads.set(e.id, e)
  }
  removeUpload(e) {
    this.uploads.has(e) && this.uploads.delete(e)
  }
  clearUploads() {
    this.uploads.clear()
  }
  get failures() {
    return this.failedUploads
  }
  addFailure(e) {
    this.failures.set(e.id, e)
  }
  removeFailure(e) {
    this.failures.has(e) && this.failures.delete(e)
  }
  clearFailures() {
    this.failures.clear()
  }
}
