import * as _e from "react/jsx-runtime"
import { Texture, Vector3 } from "three"
import {
  AnnotationCloseCommand,
  AnnotationDockCommand,
  AnnotationPreviewCommand,
  AnnotationSelectCommand,
  AnnotationsCloseAllCommand,
  AnnotationsCloseDockedAnnotationCommand
} from "../command/annotation.command"
import { CancelAttachmentChangesCommand, ConfirmAttachmentChangesCommand, ToggleViewAttachmentsCommand } from "../command/attachment.command"
import { FocusOnPinInsideCommand } from "../command/navigation.command"
import {
  CommentAddCommand,
  CommentCancelChangesCommand,
  CommentDeleteCommand,
  CommentUpdateCommand,
  FilterVisibleNotesCommand,
  NoteAddCommand,
  NoteAppearanceSaveCommand,
  NoteCancelAddCommand,
  NoteCloseCommand,
  NoteCommentEditCommand,
  NoteDeleteCommand,
  NotePopupEditorToggleCommand,
  NoteResolveCommand,
  NoteSaveChangesCommand,
  NoteStartAddCommand,
  NotesModeToggleCommand,
  NotesOpenNoteCommentCommand,
  NotesToggleFilterCommand,
  NotesVisibilityFilterEnabledCommand,
  RegisterNotesToolsCommand
} from "../command/notes.command"
import {
  ChangePinTypeOpacityCommand,
  ChangePinVisibilityCommand,
  CreatePinCommand,
  EnablePinCreationCommand,
  PinCreationCancelCommand,
  PinSelectionClearCommand,
  RemovePinCommand,
  RemovePinTypeCommand,
  SelectPinCommand,
  TogglePinEditingCommand,
  UnselectPinCommand,
  UpdatePinViewsCommand
} from "../command/pin.command"
import { RegisterRoomAssociationSourceCommand } from "../command/room.command"
import { SaveCommand } from "../command/save.command"
import { SearchGroupDeregisterCommand, SearchGroupRegisterCommand, SelectSearchResultCommand, UpdateSearchQueryCommand } from "../command/searchQuery.command"
import { CloseToolCommand, OpenToolCommand, RegisterToolsCommand, ToolPanelToggleCollapseCommand } from "../command/tool.command"
import { CloseModalCommand } from "../command/ui.command"
import { UserMentionsFetchCommand } from "../command/users.command"
import { NotesPhase } from "../const/38965"
import * as Y from "../const/39693"
import { FeaturesNotesKey } from "../const/39693"
import { IconType, PinType } from "../const/62612"
import { AnnotationGrouping } from "../const/63319"
import { TransitionTypeList } from "../const/64918"
import { UserStatus } from "../const/66197"
import { DataType } from "../const/79728"
import { AnnotationType } from "../const/annotationType.const"
import { BlockTypeList } from "../const/block.const"
import { NotesFilter } from "../const/notes.const"
import { PhraseKey } from "../const/phrase.const"
import { DeepLinksSymbol, NotesSymbol } from "../const/symbol.const"
import { ToolPalette, ToolPanelLayout, ToolsList } from "../const/tools.const"
import { modelAccessType, parentType, resolutionType, searchModeType } from "../const/typeString.const"
import { Data } from "../core/data"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { ISubscription, createSubscription } from "../core/subscription"
import { AnnotationsViewData } from "../data/annotations.view.data"
import { AppData, AppMode } from "../data/app.data"
import { FloorsViewData } from "../data/floors.view.data"
import { HashtagData } from "../data/hashtag.data"
import { InteractionData } from "../data/interaction.data"
import { LayersData } from "../data/layers.data"
import { NotesViewData } from "../data/notes.view.data"
import { PinsViewData } from "../data/pins.view.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ToolsData } from "../data/tools.data"
import { UsersData } from "../data/users.data"
import { ViewmodeData } from "../data/viewmode.data"
import { VisionParase } from "../math/2569"
import { AnnotationAttachmentClickedMessage, AnnotationBlockClickedMessage } from "../message/annotation.message"
import { AppChangeMessage } from "../message/app.message"
import { InteractionModeChangedMessage } from "../message/interaction.message"
import { ModelViewChangeCompleteMessage } from "../message/layer.message"
import { FocusCommentMessage, NoteResolutionChangeMessage } from "../message/notes.message"
import { ToggleViewingControlsMessage } from "../message/panel.message"
import { PinAddCancelledMessage, PinMovedMessage, PinPlacedMessage } from "../message/pin.message"
import { SweepDataMessage } from "../message/sweep.message"
import { NoteToolManager } from "../noteToolManager"
import { ToolObject } from "../object/tool.object"
import { ObservableArray, createObservableArray } from "../observable/observable.array"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
import { ObservableObject } from "../observable/observable.object"
import * as U from "../other/21149"
import * as Ke from "../other/30616"
import * as ze from "../other/30851"
import { FeaturesNotesModeKey } from "../other/39586"
import * as le from "../other/40731"
import * as Qe from "../other/43072"
import * as $e from "../other/44145"
import * as Xe from "../other/44810"
import * as _ from "../other/44877"
import * as Ge from "../other/46362"
import { TextParser } from "../other/52528"
import * as Ue from "../other/57623"
import * as We from "../other/62752"
import { FileDeserializer } from "../other/65222"
import * as Ze from "../other/85351"
import * as Ye from "../other/95809"
import { BaseParser } from "../parser/baseParser"
import { EmbedDeserializer } from "../parser/embedDeserializer"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { isRealNumber } from "../utils/37519"
import { UnkownUser } from "../utils/67622"
import { getDayTag, toDate } from "../utils/date.utils"
import { randomString, waitRun } from "../utils/func.utils"
import { LoadTexture } from "../utils/loadTexture"
import DeepLinkerModule from "./deepLinker.module"
declare global {
  interface SymbolModule {
    [NotesSymbol]: NotesModule
  }
}
const d = "images/NoteColor.png"
export class NoteObject extends ObservableObject {
  id: string
  layerId: string
  color: string
  anchorPosition: Vector3
  stemNormal: Vector3
  stemLength: number
  stemEnabled: boolean
  created: Date
  modified: Date
  lastCommentMs: number
  resolved: boolean
  user: ReturnType<UsersData["getCurrentUser"] | typeof UnkownUser>
  comments: ObservableArray<any>
  floorId: string
  roomId?: string
  constructor(e?) {
    super()
    this.id = ""
    this.layerId = ""
    this.color = Y.Rn
    this.anchorPosition = new Vector3()
    this.stemNormal = new Vector3()
    this.stemLength = Y.ZP.stem.length
    this.stemEnabled = !0
    this.created = new Date()
    this.modified = new Date()
    this.lastCommentMs = new Date().getTime()
    this.resolved = !1
    this.user = UnkownUser("")
    this.comments = createObservableArray([])
    e && Object.assign(this, e)
  }
  copy(e) {
    this.id = e.id
    this.user = e.user
    this.resolved = e.resolved
    this.color = e.color
    this.floorId = e.floorId
    this.roomId = e.roomId
    this.anchorPosition.copy(e.anchorPosition)
    this.stemNormal.copy(e.stemNormal)
    this.stemLength = e.stemLength
    this.stemEnabled = e.stemEnabled
    this.created.setTime(e.created.getTime())
    this.modified.setTime(e.modified.getTime())
    this.lastCommentMs = e.lastCommentMs
    this.comments.replace(e.comments.values())
    this.commit()
    return this
  }
  getComment(e) {
    return this.comments.find(t => t.id === e) || null
  }
  updateComment(e) {
    const t = this.comments.findIndex(t => t.id === e.id)
    ;-1 !== t && ((e.assetId = this.id), this.comments.update(t, e))
  }
  deleteComment(e) {
    const t = this.comments.findIndex(t => t.id === e)
    ;-1 !== t && this.comments.splice(t, 1)
  }
}
export class NotesData extends Data {
  notes: ObservableMap<NoteObject>
  constructor(e) {
    super()
    this.name = "notes-data"
    this.notes = createObservableMap(e)
  }
  iterate(e: (e: NoteObject) => void) {
    for (const t of this.notes) e(t)
  }
  updateNote(e: NoteObject) {
    this.notes.has(e.id) ? this.notes.get(e.id).copy(e) : this.notes.set(e.id, e)
  }
  updateNoteProperties(e: string, t: Partial<NoteObject>) {
    if (this.notes.has(e)) {
      const i = this.notes.get(e)
      let n = !1
      void 0 !== t.resolved && t.resolved !== i.resolved && ((i.resolved = t.resolved), (n = !0))
      void 0 !== t.color && t.color !== i.color && ((i.color = t.color), (n = !0))
      void 0 !== t.anchorPosition && t.anchorPosition !== i.anchorPosition && ((i.anchorPosition = t.anchorPosition), (n = !0))
      void 0 !== t.stemNormal && t.stemNormal !== i.stemNormal && ((i.stemNormal = t.stemNormal), (n = !0))
      void 0 !== t.stemLength && t.stemLength !== i.stemLength && ((i.stemLength = t.stemLength), (n = !0))
      void 0 !== t.stemEnabled && t.stemEnabled !== i.stemEnabled && ((i.stemEnabled = t.stemEnabled), (n = !0))
      void 0 !== t.floorId && t.floorId !== i.floorId && ((i.floorId = t.floorId), (n = !0))
      void 0 !== t.roomId && t.roomId !== i.roomId && ((i.roomId = t.roomId), (n = !0))
      n && i.commit()
    }
  }
  removeNote(e: string) {
    this.notes.has(e) && (this.notes.delete(e), this.commit())
  }
  getNote(e: string) {
    return this.notes.get(e)
  }
  getNoteProperties(e: string) {
    const t = this.notes.get(e)
    if (!t) return null
    return Object.assign({}, t)
  }
  get collection() {
    return this.notes
  }
}
const ue = new DebugInfo("mds-note-serialize")
class CreateSerializer {
  getNoteDetails: (e: any, t: any, i: any) => { enabled: boolean; floorId: string; roomId: undefined } | null
  validate: (e: any) => boolean
  constructor() {
    this.getNoteDetails = (e, t, i) => {
      const n: any = { enabled: !0, floorId: "", roomId: void 0 }
      void 0 !== e.floorId && "" !== e.floorId && (n.floorId = e.floorId),
        void 0 !== e.roomId && "" !== e.roomId && (n.roomId = e.roomId),
        void 0 !== e.color && "" !== e.color && (n.color = e.color),
        void 0 !== e.stemEnabled && (n.stemEnabled = e.stemEnabled),
        void 0 !== e.stemLength && (n.stemLength = e.stemLength),
        void 0 !== e.anchorPosition && (0, le.u)(e.anchorPosition) && (n.anchorPosition = VisionParase.toVisionVector(e.anchorPosition)),
        void 0 !== e.stemNormal && (0, le.u)(e.stemNormal) && (n.stemNormal = VisionParase.toVisionVector(e.stemNormal)),
        void 0 !== e.resolved && (n.resolution = e.resolved ? resolutionType.RESOLVED : resolutionType.OPEN),
        i && e.layerId && (n.layerId = e.layerId)
      const s = { text: t }
      return (n.comment = s), Object.keys(n).length > 0 ? n : null
    }
    this.validate = e => {
      if (!e) return !1
      const t = ["floorId", "roomId", "enabled"].filter(t => !(t in e)),
        i = 0 === t.length,
        n = !!e.floorId && "string" == typeof e.floorId,
        s = !!e.anchorPosition && (0, le.u)(e.anchorPosition),
        a = i && n && s
      return a || ue.debug("Note invalid:", { missingFields: t, validPosition: s }), a
    }
  }
  serialize(e, t, i) {
    const n = this.getNoteDetails(e, t, i)
    return this.validate(n) ? n : null
  }
}
class PatchSerializer {
  getNotePatch: (e: any, t: any) => {} | null
  validate: (e: any) => boolean
  constructor() {
    this.getNotePatch = (e, t) => {
      if (!e) return null
      const i: any = {}
      return (
        void 0 !== e.floorId && "" !== e.floorId && (i.floorId = e.floorId),
        void 0 !== e.roomId && "" !== e.roomId && (i.roomId = e.roomId),
        void 0 !== e.color && "" !== e.color && (i.color = e.color),
        void 0 !== e.stemEnabled && (i.stemEnabled = e.stemEnabled),
        void 0 !== e.stemLength && (i.stemLength = e.stemLength),
        void 0 !== e.anchorPosition && (0, le.u)(e.anchorPosition) && (i.anchorPosition = VisionParase.toVisionVector(e.anchorPosition)),
        void 0 !== e.stemNormal && (0, le.u)(e.stemNormal) && (i.stemNormal = VisionParase.toVisionVector(e.stemNormal.normalize())),
        t && e.layerId && (i.layerId = e.layerId),
        Object.keys(i).length > 0 ? i : null
      )
    }
    this.validate = e => {
      if (!e) return !1
      const t = ["floorId", "roomId", "color", "anchorPosition", "stemNormal", "stemLength", "stemEnabled", "stemNormal", "enabled"]
      return Object.keys(e).every(e => t.includes(e))
    }
  }
  serialize(e, t) {
    const i = this.getNotePatch(e, t)
    return i && this.validate(i) ? i : null
  }
}
function ye(e) {
  const t = Object.assign({ modelAccess: modelAccessType.PUBLIC }, e)
  return t.__typename && delete t.__typename, t
}
const fe = new DebugInfo("mds-note-deserializer")
class Deserializer {
  commentDeserializer: any
  userData: any
  validate: (e: any) => boolean
  constructor(e, t) {
    this.commentDeserializer = e
    this.userData = t
    this.validate = e => {
      if (!e) return !1
      const t = ["id", "created", "modified", "floor", "resolution"].filter(t => !(t in e)),
        i = 0 === t.length,
        n = !(!e.floor || !e.floor.id)
      return (i && n) || fe.debug("Note invalid:", { missingFields: t, validFloor: n }), i && n
    }
  }
  deserialize(e) {
    var t
    if (!e || !this.validate(e) || !e.floor) return fe.debug("Deserialized invalid Note data from MDS", e), null
    const i = new NoteObject()
    ;(i.id = e.id),
      (i.layerId = (null === (t = e.layer) || void 0 === t ? void 0 : t.id) || ""),
      (i.floorId = e.floor.id),
      e.room && e.room.id && (i.roomId = e.room.id),
      (i.resolved = e.resolution === resolutionType.RESOLVED),
      (i.created = toDate(e.created)),
      (i.modified = toDate(e.modified)),
      (i.user = this.userData.loadContributor(ye(e.createdBy))),
      (i.lastCommentMs = toDate(e.lastCommentAt).getTime())
    const n = this.deserializeComments(e)
    if (!(n.length > 0)) return fe.error("Note without a comment:", i.id), null
    i.comments.replace(n), e.color && (i.color = e.color)
    const s = e.anchorPosition ? VisionParase.fromVisionVector(e.anchorPosition) : void 0
    s && (i.anchorPosition = s), isRealNumber(e.stemLength) && (i.stemLength = e.stemLength)
    const a = e.stemNormal ? VisionParase.fromVisionVector(e.stemNormal) : void 0
    return a ? ((i.stemNormal = a), (i.stemEnabled = !!e.stemEnabled)) : ((i.stemNormal = new Vector3(0, 0, 0)), (i.stemEnabled = !!e.stemEnabled)), i
  }
  deserializeComments(e) {
    const i = e.comments?.results || []
    const n: any[] = []
    i.forEach(t => {
      const i = this.commentDeserializer.deserialize(t)
      i && ((i.assetId = e.id), n.push(i))
    })
    return n
  }
}
class CommentSerializer {
  validate: (e: any) => boolean
  constructor() {
    this.validate = e => !!e
  }
  serialize(e) {
    if (void 0 === e.text) return null
    const t = { text: e.text }
    return t && this.validate(t) ? t : null
  }
}
class Comment extends ObservableObject {
  id: string
  assetId: string
  text: string
  user: { email: any; id: string; firstName: string; lastName: string; name: string; initials: string; color: string; userStatus: string; modelAccess: string }
  created: Date
  modified: Date
  edited: boolean
  attachments: ObservableArray<any>
  constructor(e?) {
    super(),
      (this.id = ""),
      (this.assetId = ""),
      (this.text = ""),
      (this.user = UnkownUser("")),
      (this.created = new Date()),
      (this.modified = new Date()),
      (this.edited = !1),
      (this.attachments = createObservableArray([])),
      e && Object.assign(this, e)
  }
  copy(e) {
    return (
      (this.id = e.id),
      (this.user = e.user),
      (this.assetId = e.assetId),
      this.created.setTime(e.created.getTime()),
      this.modified.setTime(e.modified.getTime()),
      (this.text = e.text),
      (this.edited = e.edited),
      (this.attachments = e.attachments),
      this.commit(),
      this
    )
  }
}
const Ce = new DebugInfo("mds-comment-deserializer")
class CommentDeserializer {
  fileDeserializer: any
  embedDeserializer: any
  userData: any
  constructor(e, t, i) {
    ;(this.fileDeserializer = e), (this.embedDeserializer = t), (this.userData = i)
  }
  deserialize(e) {
    if (!e || !this.validate(e)) return Ce.debug("Deserialized invalid Comment data from MDS", e), null
    const t = new Comment()
    t.id = e.id
    t.created = toDate(e.created)
    t.modified = toDate(e.modified)
    e.text && (t.text = e.text)
    t.edited = e.edited
    t.user = this.userData.loadContributor(ye(e.createdBy))
    const i = this.deserializeExternalAttachments(e)
    const n = this.deserializeFileAttachments(e)
    const s = i.concat(n).sort((e, t) => e.created.getTime() - t.created.getTime())
    return s.length > 0 && t.attachments.replace(s), t
  }
  deserializeExternalAttachments(e) {
    const t = e.externalAttachments || [],
      i: Comment[] = []
    return (
      t.forEach(t => {
        const n = this.embedDeserializer.deserialize(t)
        n && ((n.parentId = e.id), (n.parentType = parentType.COMMENT), i.push(n))
      }),
      i
    )
  }
  deserializeFileAttachments(e) {
    const t = e.fileAttachments || [],
      i: any[] = []
    return (
      t.forEach(t => {
        const n = this.fileDeserializer.deserialize(t)
        n && ((n.parentId = e.id), (n.parentType = parentType.COMMENT), i.push(n))
      }),
      i
    )
  }
  validate(e) {
    if (!e) return !1
    const t = ["id", "created", "modified", "edited", "createdBy"].filter(t => !(t in e)),
      i = 0 === t.length
    return i || Ce.debug("Comment invalid:", { missingFields: t }), i
  }
}
const Ae = new DebugInfo("MdsNoteStore")
class NoteStore extends MdsStore {
  userData: UsersData
  layeredType: string
  embedDeserializer: EmbedDeserializer
  fileDeserializer: FileDeserializer
  commentDeserializer: CommentDeserializer
  deserializer: Deserializer
  createSerializer: CreateSerializer
  patchSerializer: PatchSerializer
  commentSerializer: CommentSerializer
  constructor(e, t) {
    super(e)
    this.userData = t
    this.prefetchKey = "data.model.notes"
    this.layeredType = searchModeType.NOTE
    this.embedDeserializer = new EmbedDeserializer()
    this.fileDeserializer = new FileDeserializer()
    this.commentDeserializer = new CommentDeserializer(this.fileDeserializer, this.embedDeserializer, this.userData)
    this.deserializer = new Deserializer(this.commentDeserializer, this.userData)
    this.createSerializer = new CreateSerializer()
    this.patchSerializer = new PatchSerializer()
    this.commentSerializer = new CommentSerializer()
  }
  async read(e) {
    //pw
    // const t = { modelId: this.getViewId(), ids: null, includeLayers: this.readLayerId() }
    // return this.query(De.GetNotes, t, e).then(e => {
    //   var t, i
    //   const n = null === (i = null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.model) || void 0 === i ? void 0 : i.notes
    //   if (!n || !Array.isArray(n)) return {}
    //   const s: NoteObject[] = []
    //   for (const e of n) {
    //     const t = this.deserializer.deserialize(e)
    //     t && s.push(t)
    //   }
    //   return s.reduce((e, t) => ((e[t.id] = t), e), {})
    // })
    return {}
  }
  async readNote(e: string, t?) {
    //pw
    // const i = { modelId: this.getViewId(), ids: [e], includeLayers: this.readLayerId() }
    // return this.query(De.GetNotes, i, t).then(e => {
    //   var t, i
    //   const n = null === (i = null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.model) || void 0 === i ? void 0 : i.notes
    //   return n && Array.isArray(n) && 1 === n.length ? this.deserializer.deserialize(n[0]) : null
    // })
    return null
  }
  async create(e, t) {
    //pw
    // var i
    // const n = this.getViewId()
    // const s = this.createSerializer.serialize(e, t, this.writeLayerId(e.layerId))
    // if (!s) throw (Ae.error("Failure creating note:", e.id, e), new Error("Could not create Note"))
    // const a = { modelId: n, data: s, includeLayers: this.readLayerId() }
    // const o = await this.mutate(De.AddNote, a).catch(e => {
    //   throw new MdsWriteError(e)
    // })
    // if (null === (i = o.data) || void 0 === i ? void 0 : i.addNote) {
    //   const e = this.deserializer.deserialize(o.data.addNote)
    //   if (e) return e.layerId && (await this.context.updateForAutoProvisionedLayer(e.layerId)), e
    // }
    // throw new Error("Unable to create new Note")
    return null
  }
  async update(e) {
    //pw
    // const t = this.getViewId(),
    //   i = e.id,
    //   n = this.patchSerializer.serialize(e, !1)
    // if (!n || !i) throw (Ae.error("Failure updating note:", i), new Error("Could not update Note"))
    // const s = { modelId: t, noteId: i, data: n, includeLayers: this.readLayerId() }
    // return this.mutate(De.PatchNote, s).then(e => {
    //   var t, i
    //   return (null === (t = e.data) || void 0 === t ? void 0 : t.patchNote)
    //     ? this.deserializer.deserialize(null === (i = e.data) || void 0 === i ? void 0 : i.patchNote)
    //     : null
    // })
    return null
  }
  async updateResolution(e, t) {
    //pw
    // const i = { modelId: this.getViewId(), noteId: e }
    // return t
    //   ? this.mutate(De.ResolveNote, i).then(e => {
    //       return e.data?.resolveNote
    //     })
    //   : this.mutate(De.ReopenNote, i).then(e => {
    //       return e.data?.reopenNote
    //     })
    return null
  }
  async delete(e) {
    //pw
    // const t = this.getViewId()
    // for (const i of e) await this.mutate(De.DeleteNote, { modelId: t, noteId: i.id })
    return !0
  }
  async createComment(e, t) {
    //pw
    // const i = this.getViewId(),
    //   n = this.commentSerializer.serialize(t)
    // if (!n) throw (Ae.error("Failure creating comment:", t), new Error("Could not create Comment"))
    // const s = { modelId: i, noteId: e, data: n }
    // return this.mutate(De.AddNoteComment, s).then(e => {
    //   return e.data?.addNoteComment ? this.commentDeserializer.deserialize(e.data.addNoteComment) : null
    // })
    return null
  }
  async updateComment(e) {
    //pw
    // const t = this.getViewId(),
    //   i = e.id,
    //   n = this.commentSerializer.serialize(e)
    // if (!n || !i) throw (Ae.error("Failure updating comment:", i), new Error("Could not update Comment"))
    // const s = { modelId: t, commentId: i, data: n }
    // return this.mutate(xe.PatchComment, s).then(e => {
    //   var t, i
    //   return (null === (t = e.data) || void 0 === t ? void 0 : t.patchComment)
    //     ? this.commentDeserializer.deserialize(null === (i = e.data) || void 0 === i ? void 0 : i.patchComment)
    //     : null
    // })
    return null
  }
  async deleteComment(e) {
    //pw
    // const t = this.getViewId()
    // if (!e || !(null == e ? void 0 : e.id)) throw new Error("MdsNoteStore.deleteComment failed")
    // const i = { modelId: t, commentId: e.id }
    // await this.mutate(xe.DeleteComment, i)
    return !0
  }
}
export class NoteParser extends BaseParser {
  comment: any
  note: any
  asWholeNote: any
  parentId: string
  title: any
  description: string
  icon: string
  color: any
  resolved: any
  numAttachments: any
  numComments: any
  user: any
  constructor(e, t, i, n, s, a, r) {
    super(e, t, i)
    this.comment = n
    this.note = s
    this.textParser = a
    this.asWholeNote = r
    this.id = this.comment.id
    this.parentId = this.note.id
    this.title = this.comment.user.name
    this.description = this.textParser.getPlainText(this.comment.text)
    this.icon = "icon-comment"
    this.typeId = searchModeType.NOTE
    this.floorId = this.note.floorId
    this.roomId = this.note.roomId || ""
    this.layerId = this.note.layerId
    this.dateBucket = this.getNoteOrCommentDateBucket()
    this.color = this.note.color
    this.resolved = this.note.resolved
    this.numAttachments = this.comment.attachments.length
    this.numComments = this.note.comments.length
    this.user = this.comment.user
    this.enabled = !this.note.resolved
    this.onSelect = async (e, t, i) => {
      super.onSelect()
      await this.commandBinder.issueCommand(new AnnotationsCloseAllCommand())
      const n = t === ToolsList.NOTES || i || e
      this.commandBinder.issueCommand(new NotesOpenNoteCommentCommand(this.note.id, n, !1, this.comment.id))
    }
  }
  supportsLayeredCopyMove() {
    return !0
  }
  supportsBatchDelete() {
    return !0
  }
  getNoteOrCommentDateBucket() {
    return getDayTag(new Date(this.asWholeNote ? this.note.lastCommentMs : this.comment.created))
  }
}
const { NOTES: Re } = PhraseKey.SHOWCASE
const { NOTES: Je } = PhraseKey.SHOWCASE
function qe() {
  const e = (0, Ue.M)(),
    t = AnnotationGrouping.DATE,
    i = !!(0 === (0, Ge.s)().length) || void 0
  let n
  const s = (0, We.g)()
  if (!(0, ze.D)())
    switch (s) {
      case NotesFilter.OPEN:
        n = Je.HAVE_NONE_OPEN
        break
      case NotesFilter.RESOLVED:
        n = Je.HAVE_NONE_RESOLVED
        break
      default:
        n = Je.HAVE_NONE
    }
  return (0, _e.jsx)($e.s, {
    children: (0, _e.jsx)(
      "div",
      Object.assign(
        { className: "panel-list" },
        {
          children: (0, _e.jsx)(Ze.D, {
            renderItem: Ke.o,
            renderGroup: Ye.v,
            activeItemId: null == e ? void 0 : e.id,
            grouping: t,
            excludeEmptyGroups: i,
            emptyPhrase: n
          })
        }
      )
    )
  })
}
class NoteToolUI {
  renderPanel: any
  renderPersistentOverlay: any
  renderOverlay: any
  constructor() {
    ;(this.renderPanel = () => (0, _e.jsx)(qe, {})),
      (this.renderPersistentOverlay = () => (0, _e.jsx)(Xe.w, { parentTool: ToolsList.NOTES }, "notes-panel-ui")),
      (this.renderOverlay = () => (0, _e.jsx)(Qe.R, {}))
  }
}
export default class NotesModule extends Module {
  activated: boolean
  registered: boolean
  activeBindings: ISubscription[]
  refreshPromise: Promise<any> | null
  pollOnNotes: () => ISubscription
  modelViewChanged: () => void
  updatePerSettings: () => void
  settingsData: SettingsData
  interactionmodeData: InteractionData
  engine: EngineContext
  registerNotesTool: () => Promise<void>
  toggleNotesMode: (e: any) => Promise<void>
  togglePinAssetEditor: (e: any) => Promise<void>
  viewData: NotesViewData
  toggleNotesFilter: (e: any) => Promise<void>
  openNoteToComment: (e: any) => Promise<undefined>
  toolsData: ToolsData
  onAppChange: () => void
  onNotesPhaseChanged: () => void
  onCloseNote: () => Promise<void>
  pinAddCancelled: (e: any) => void
  onCancelNewNote: () => Promise<void>
  userData: UsersData
  notesWereChanged: () => void
  onNoteFilterChanged: () => void
  onViewModeOrFloorChanged: () => void
  onLayersChanged: () => void
  onOpenNoteViewChanged: () => void
  startNoteCreation: () => Promise<void>
  appData: AppData
  notesData: NotesData
  floorsViewData: FloorsViewData
  layersData: LayersData
  saveNewNote: (e: any) => Promise<undefined>
  store: NoteStore
  pinMoved: (e: any) => Promise<void>
  pinPlaced: (e: any) => void
  onEditComment: (e: any) => Promise<void>
  handlePinFocusChange: () => Promise<undefined>
  pinsViewData: PinsViewData
  annotationsViewData: AnnotationsViewData
  handleAnnotationsChanged: () => Promise<void>
  handlePinSelectionChange: () => Promise<void>
  handleViewingAttachment: (e: any) => void
  deleteNote: (e: any) => Promise<void>
  onResolveNoteCommand: (e: any) => Promise<void>
  onSaveNoteChanges: (e: any) => Promise<void>
  cancelCommentChanges: (e: any) => Promise<void>
  saveNoteAppearance: (e: any) => Promise<void>
  addComment: (e: any) => Promise<any>
  onUpdateComment: (e: any) => Promise<void>
  deleteComment: (e: any) => Promise<void>
  notationBlockClicked: (e: any) => Promise<void>
  filterVisibleNotes: (e: any) => Promise<void>
  noteVisbilityFilterEnabled: (e: any) => Promise<void>
  cancelNoteCreation: (e: boolean) => void
  changeNotesPhase: (e: NotesPhase) => void
  config: any
  sweepData: SweepsData
  viewmodeData: ViewmodeData
  linkHandler: DeepLinkerModule
  textParser: TextParser
  backgroundTexture: Texture
  hashtagData: HashtagData
  constructor() {
    super(...arguments)
    this.name = "notes"
    this.activated = !1
    this.registered = !1
    this.activeBindings = []
    this.refreshPromise = null
    this.pollOnNotes = () => {
      let e
      return createSubscription(
        () => {
          clearInterval(e),
            (e = window.setInterval(() => {
              this.refreshNotes()
            }, 1e3 * Y.GR))
        },
        () => {
          window.clearInterval(e)
        },
        !0
      )
    }
    this.modelViewChanged = () => {
      this.cancelNoteCreation(!0)
    }
    this.updatePerSettings = () => {
      const e = this.settingsData.tryGetProperty(FeaturesNotesKey, !1),
        t = !this.in360View(),
        i = !this.interactionmodeData.isVR(),
        n = t && i && e,
        s = n ? this.getFilteredNoteIds(!1) : []
      this.engine.commandBinder.issueCommand(new ChangePinTypeOpacityCommand(PinType.NOTE, n ? 1 : 0, s)), n || this.closeNoteBillboard()
    }
    this.registerNotesTool = async () => {
      const e = new ToolObject({
        id: ToolsList.NOTES,
        deepLinkParam: "note",
        searchModeType: searchModeType.NOTE,
        namePhraseKey: PhraseKey.TOOLS.NOTES,
        panel: !0,
        icon: "icon-comment-outline",
        analytic: "notes",
        palette: ToolPalette.VIEW_BASED,
        order: 80,
        dimmed: !1,
        enabled: this.settingsData.tryGetProperty(FeaturesNotesModeKey, !1),
        hidesAppBar: !0,
        ui: new NoteToolUI(),
        manager: new NoteToolManager(this.engine, this.settingsData),
        helpMessagePhraseKey: PhraseKey.TOOLS.NOTES_HELP_MESSAGE,
        helpHref: ""
      })
      this.engine.commandBinder.issueCommand(new RegisterToolsCommand([e]))
    }
    this.toggleNotesMode = async e => {
      e.opened ? this.activateTool() : this.deactivateTool()
    }
    this.togglePinAssetEditor = async e => {
      this.viewData.setActiveNotation(null)
      e.opened ? this.changeNotesPhase(NotesPhase.EDITING) : this.viewData.notesPhase === NotesPhase.EDITING && this.changeNotesPhase(NotesPhase.OPEN)
    }
    this.toggleNotesFilter = async e => {
      const { filter: t, enabled: i } = e
      i ? this.viewData.setNotesFilter(t) : this.viewData.setNotesFilter(NotesFilter.ALL)
    }
    this.openNoteToComment = async e => {
      const { noteId: t, commentId: i, dock: n, edit: s, transition: a } = e,
        o = this.viewData,
        r = o.getNoteView(t)
      if (!r) return void this.log.error(`Missing note ${t}`)
      const { notesFilter: d } = o,
        c = d === NotesFilter.RESOLVED
      d !== NotesFilter.ALL && r.resolved !== c && o.setNotesFilter(NotesFilter.ALL)
      const h = n || s,
        u = this.toolsData.toolPanelLayout === ToolPanelLayout.SIDE_PANEL ? TransitionTypeList.FadeToBlack : TransitionTypeList.Instant
      await this.openNote(t, a || u, h, i, s), this.openAnnotation(t, h)
    }
    this.onAppChange = () => {
      this.deactivateTool()
      this.updatePerSettings()
      this.displayNotes()
    }
    this.onNotesPhaseChanged = () => {
      let e = !0
      const t = this.toolsData.toolPanelLayout === ToolPanelLayout.BOTTOM_PANEL
      switch (this.viewData.notesPhase) {
        case NotesPhase.EDITING:
        case NotesPhase.CREATING:
          e = !1
          break
        case NotesPhase.OPENING:
        case NotesPhase.OPEN:
          e = !t
      }
      this.engine.broadcast(new ToggleViewingControlsMessage(e))
    }
    this.changeNotesPhase = e => {
      e !== this.viewData.notesPhase && this.viewData.setNotesPhase(e)
    }
    this.onCloseNote = async () => {
      this.closeNote()
    }
    this.pinAddCancelled = e => {
      e.pinType === PinType.NOTE && this.cancelNoteCreation(!1)
    }
    this.onCancelNewNote = async () => {
      this.cancelNoteCreation(!0)
    }
    this.cancelNoteCreation = e => {
      if (!this.userData.isCommenter()) return
      const i = this.viewData
      const n = i.openNoteView?.id
      n &&
        (e && this.engine.commandBinder.issueCommand(new PinCreationCancelCommand(n, PinType.NOTE)),
        this.engine.commandBinder.issueCommand(new AnnotationCloseCommand(n, AnnotationType.NOTE)))
      this.cancelAttachmentChanges()
      i.setActiveNotation(null)
      i.setOpenNoteView(null)
      i.setFocusedComment(null)
      i.isNewNote = !1
      i.commit()
      this.changeNotesPhase(NotesPhase.IDLE)
    }
    this.notesWereChanged = () => {
      this.parseNotes()
      this.updateNoteViewData()
      this.displayNotes()
    }
    this.onNoteFilterChanged = () => {
      this.viewData.setOpenNoteView(null)
      this.viewData.setFocusedComment(null)
      this.updateNoteViewData()
      this.displayNotes()
    }
    this.onViewModeOrFloorChanged = () => {
      this.updatePerSettings()
    }
    this.onLayersChanged = () => {
      this.closeNoteBillboard()
      this.displayNotes()
    }
    this.onOpenNoteViewChanged = () => {
      const e = this.viewData.openNoteView
      e && this.updateNotePin(e)
    }
    this.startNoteCreation = async () => {
      if (!this.userData.isCommenter()) return
      this.toolsData.softOpening && (await this.engine.commandBinder.issueCommand(new OpenToolCommand(ToolsList.NOTES, !1)))
      const e = this.viewData
      const t = this.appData.application === AppMode.WORKSHOP
      let i = randomString(11)
      for (; this.notesData.getNote(i); ) i = randomString(11)
      const n = new NoteObject()
      n.user = this.userData.getCurrentUser()
      n.id = i
      n.floorId = this.floorsViewData.getHighestVisibleFloorId()
      n.layerId = this.layersData.getNotesLayerId(t)
      const s = e.createNoteView(n)
      e.isNewNote = !0
      e.commit()
      this.changeNotesPhase(NotesPhase.CREATING)
      e.setOpenNoteView(s)
      e.setFocusedComment(null)
      this.engine.commandBinder.issueCommand(new CreatePinCommand(n.id, this.getPinUpdate(n), PinType.NOTE, s.backgroundTexture))
    }
    this.saveNewNote = async e => {
      if (!this.userData.isCommenter()) return
      const { text: t } = e,
        i = this.viewData,
        n = i.getPendingNote()
      if (n) {
        if (this.layersData.isInMemoryLayer(n.layerId)) {
          const e = new NoteObject(n)
          this.notesData.updateNote(e)
          i.setActiveNotation(null)
          i.isNewNote = !1
          i.commit()
          this.updateNoteViewData()
        }
        const e = await this.store.create(n, t)
        if (!e) return void this.log.error("MDS Note saved failed")
        const s = e.comments.get(0)
        if (!s) throw new Error("No root comment in the new note")
        const a = await this.confirmAttachmentChanges(s.id, n.id)
        this.notesData.updateNote(e)
        a && (await this.refreshNote(e.id))
        this.parseMarkdown(t)
        i.setOpenNoteView(i.getNoteView(e.id))
        const o = i.openNoteView
        if (o) {
          const t = (0, _.CM)(this.userData, AnnotationType.NOTE, o.user)
          this.engine.commandBinder.issueCommand(new SelectPinCommand(e.id, PinType.NOTE, t))
          this.engine.commandBinder.issueCommand(new RemovePinCommand(n.id, PinType.NOTE))
        }
        i.setActiveNotation(null)
        i.isNewNote = !1
        i.commit()
        this.updateNoteViewData()
      } else this.log.debug("No pending note")
    }
    this.pinMoved = async e => {
      const { id: t, pinType: i, pinPos: n } = e,
        s = this.viewData.openNoteView
      if (s && i === PinType.NOTE && t === s.id) {
        const e = this.notesData.getNote(t)
        if (e) {
          if (this.layersData.isInMemoryLayer(e.layerId)) return
          const { anchorPosition: i, stemNormal: s, floorId: a, roomId: o } = n
          this.store.update({ id: t, anchorPosition: i, stemNormal: s, floorId: a, roomId: o }).then(e => {
            e && this.notesData.updateNote(e)
          })
        } else this.log.debug("Cannot move a non-existent note")
      }
    }
    this.pinPlaced = e => {
      const t = this.viewData.openNoteView
      t &&
        e.pinType === PinType.NOTE &&
        e.id === t.id &&
        (this.viewData.updateOpenNoteView(e.pinPos),
        this.changeNotesPhase(NotesPhase.OPEN),
        this.viewData.setActiveNotation(t.id),
        this.openAnnotation(t.id, !0))
    }
    this.onEditComment = async e => {
      this.viewData.setActiveNotation(e.id)
    }
    this.handlePinFocusChange = async () => {
      const { openNoteView: e, isNewNote: t } = this.viewData
      if (t) return
      const { commandBinder: i } = this.engine,
        { focusedPin: n, selectedPinId: s } = this.pinsViewData,
        { billboardAnnotation: a, billboardSelected: o } = this.annotationsViewData
      if (!n) return void (a && a.annotationType === AnnotationType.NOTE && a.id !== s && this.closeNoteBillboard())
      const r = (null == e ? void 0 : e.id) === (null == a ? void 0 : a.id) && o,
        d = e && (null == e ? void 0 : e.id) === (null == n ? void 0 : n.id)
      if ((e && r && !d && this.closeNote(), n.pinType === PinType.NOTE)) {
        const t = this.viewData.getNoteView(n.id)
        if (!t) return void this.log.debug("Focused pin changed, but no note view.")
        t.id !== (null == e ? void 0 : e.id) && i.issueCommand(new AnnotationPreviewCommand(t.id, AnnotationType.NOTE))
      }
    }
    this.handleAnnotationsChanged = async () => {
      const { openNoteView: e, isNewNote: t, focusedComment: i } = this.viewData
      if (t) return
      const { softOpening: n } = this.toolsData,
        { dockedAnnotation: s, selectedAnnotation: a } = this.annotationsViewData,
        o = s || a,
        r = (null == s ? void 0 : s.annotationType) === AnnotationType.NOTE && s,
        d = (null == a ? void 0 : a.annotationType) === AnnotationType.NOTE && a,
        c = r || d,
        l = !!r
      c && c.id !== (null == e ? void 0 : e.id) ? await this.openNote(c.id, null, l) : e && e.id !== (null == o ? void 0 : o.id) && this.closeNote(),
        l
          ? (this.activated || (await this.engine.commandBinder.issueCommand(new OpenToolCommand(ToolsList.NOTES, !0))),
            i && this.engine.broadcast(new FocusCommentMessage(i.id)))
          : this.activated && n && (await this.engine.commandBinder.issueCommand(new CloseToolCommand(ToolsList.NOTES)))
    }
    this.handlePinSelectionChange = async () => {
      const { openNoteView: e, activeNotation: t } = this.viewData,
        { selectedPinId: i } = this.pinsViewData
      if (t || (null == e ? void 0 : e.id) === i) return
      const n = i ? this.pinsViewData.getPin(i) : null
      if (!e || (n && n.pinType === PinType.NOTE)) {
        if (i && n && n.pinType === PinType.NOTE) {
          const t = (0, _.CM)(this.userData, AnnotationType.NOTE, null == e ? void 0 : e.user)
          this.engine.commandBinder.issueCommand(new TogglePinEditingCommand(i, !!t))
          const n = !0
          await this.openNote(i, TransitionTypeList.Interpolate, n), this.openAnnotation(i, n)
        }
      } else {
        const e = !this.toolsData.softOpening
        this.activated && !e ? await this.engine.commandBinder.issueCommand(new CloseToolCommand(ToolsList.NOTES)) : this.closeNote()
      }
    }
    this.handleViewingAttachment = e => {
      const { annotationType: t, id: i, attachmentId: n } = e
      if (t !== AnnotationType.NOTE) return
      const s = this.viewData.getNoteAttachments(i),
        a = s.find(e => e.id === n)
      if (a && (0, U.lV)(a)) {
        const e = s.filter(e => (0, U.lV)(e))
        this.engine.commandBinder.issueCommand(new ToggleViewAttachmentsCommand(!0, e, n))
      }
    }
    this.deleteNote = async e => {
      const t = e.noteId,
        i = this.notesData.getNote(t)
      if (i) {
        this.engine.commandBinder.issueCommand(new CloseModalCommand()),
          this.layersData.isInMemoryLayer(i.layerId) || this.store.delete([i]),
          this.notesData.removeNote(t)
        const e = this.viewData.openNoteView
        e && e.id === t && this.closeNote(), this.engine.commandBinder.issueCommand(new RemovePinCommand(t, PinType.NOTE))
      } else this.log.debug("Cannot delete a non-existent note")
    }
    this.onResolveNoteCommand = async e => {
      const { noteId: t, resolved: i } = e
      i ? await this.resolveNote(t) : await this.reopenNote(t)
    }
    this.onSaveNoteChanges = async e => {
      const { noteId: t, text: i } = e,
        n = this.notesData.getNote(t)
      if (n) {
        const e = n.comments.get(0)
        if (e) return this.updateNoteComment(t, e.id, i)
        this.log.warn("no root comment")
      } else this.log.debug("Cannot update a non-existent note")
    }
    this.cancelCommentChanges = async e => {
      this.cancelAttachmentChanges(), this.viewData.setActiveNotation(null)
    }
    this.saveNoteAppearance = async e => {
      const t = this.notesData,
        { noteId: i, properties: n } = e,
        s = t.getNote(i)
      if (s) {
        const e = this.viewData,
          { openNoteView: a } = e
        if (Object.keys(n)) {
          const o = this.layersData.isInMemoryLayer(s.layerId) ? Object.assign(s, n) : await this.store.update(Object.assign({ id: i }, n))
          o && (this.updateNotePin(o), t.updateNote(o), (null == a ? void 0 : a.id) === i && e.updateOpenNoteView(n))
        }
      } else this.log.debug("Cannot update a non-existent note")
    }
    this.addComment = async e => {
      const { noteId: t, text: i, replyId: n } = e,
        s = this.notesData.getNote(t)
      if (s) {
        s.resolved && (this.viewData.setNotesFilter(NotesFilter.ALL), this.reopenNote(s.id))
        const e = await this.store.createComment(t, { text: i })
        return e
          ? (this.viewData.setActiveNotation(null),
            this.parseMarkdown(i),
            await this.confirmAttachmentChanges(e.id, n),
            await this.refreshNote(s.id),
            this.refreshNotes(),
            e)
          : (this.log.error("Cannot create MDS comment"), null)
      }
      return this.log.debug("Cannot add a comment to a non-existent note"), null
    }
    this.onUpdateComment = async e => {
      const { noteId: t, commentId: i, text: n } = e
      return this.updateNoteComment(t, i, n)
    }
    this.deleteComment = async e => {
      const { commentId: t, noteId: i } = e,
        n = this.notesData.getNote(i)
      if (n) {
        const e = n.getComment(t)
        e && (this.layersData.isInMemoryLayer(n.layerId) || (await this.store.deleteComment(e)), n.deleteComment(t)), this.refreshNotes()
      } else this.log.debug("Cannot delete a comment in a non-existent note")
    }
    this.notationBlockClicked = async e => {
      const { annotationType: t, block: i } = e
      t === AnnotationType.NOTE &&
        ((i.blockType !== BlockTypeList.USER && i.blockType !== BlockTypeList.HASH) ||
          ((this.activated && !this.toolsData.softOpening) || (await this.engine.commandBinder.issueCommand(new OpenToolCommand(ToolsList.NOTES, !1))),
          this.engine.commandBinder.issueCommand(new UpdateSearchQueryCommand(i.text || "")),
          i.text && this.closeNote()))
    }
    this.filterVisibleNotes = async e => {
      const { idVisibility: t } = this.viewData
      t.clear(), e.ids.forEach(e => t.add(e)), this.viewData.commit(), this.displayNotes()
    }
    this.noteVisbilityFilterEnabled = async e => {
      this.viewData.idVisibilityEnabled = e.enabled
      this.viewData.commit()
      this.displayNotes()
    }
  }

  async init(e, t: EngineContext) {
    const [i, n, a, c] = await Promise.all([
      t.market.waitForData(SettingsData),
      t.market.waitForData(InteractionData),
      t.market.waitForData(UsersData),
      t.market.waitForData(AppData)
    ])
    if (!a.isLoggedIn() || n.isVR() || !i.tryGetProperty(FeaturesNotesModeKey, !1)) return
    this.engine = t
    this.config = e
    this.interactionmodeData = n
    this.userData = a
    this.settingsData = i
    this.appData = c
    const [l, u, m, p, g, v, f] = await Promise.all([
      t.market.waitForData(ToolsData),
      t.market.waitForData(SweepsData),
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(FloorsViewData),
      t.market.waitForData(AnnotationsViewData),
      t.getModuleBySymbol(DeepLinksSymbol),
      t.market.waitForData(LayersData)
    ])
    this.toolsData = l
    this.sweepData = u
    this.viewmodeData = m
    this.floorsViewData = p
    this.annotationsViewData = g
    this.linkHandler = v
    this.layersData = f
    const { readonly: b, baseUrl: T } = this.config
    this.store = new NoteStore({ context: f.mdsContext, readonly: b, includeDisabled: !0, baseUrl: T }, this.userData)
    const k = () => {
      this.store.setStoreViewId(f.getNonworkshopViewId())
    }
    k()
    this.bindings.push(
      f.onPropertyChanged("currentViewId", k),
      f.onPropertyChanged("activeLayerId", () => this.updatePendingNote()),
      this.store.onNewData(async e => {
        this.loadNewNotes(e)
      })
    )
    this.notesData = new NotesData({})
    this.textParser = new TextParser({ links: !0, hashtags: !0, users: this.userData })
    this.backgroundTexture = LoadTexture(d)
    this.viewData = new NotesViewData(this.notesData, this.textParser, this.linkHandler, this.backgroundTexture)
    this.hashtagData = new HashtagData()
    t.market.register(this, HashtagData, this.hashtagData)
    this.pinsViewData = await t.market.waitForData(PinsViewData)
    this.bindings.push(
      i.onPropertyChanged(FeaturesNotesKey, this.updatePerSettings),
      t.commandBinder.addBinding(RegisterNotesToolsCommand, this.registerNotesTool),
      t.commandBinder.addBinding(NotesModeToggleCommand, this.toggleNotesMode),
      t.commandBinder.addBinding(NoteDeleteCommand, this.modifyInsideSaveCommand(this.deleteNote)),
      this.pinsViewData.onFocusedPinChanged(this.handlePinFocusChange),
      this.pinsViewData.onSelectedPinChanged(this.handlePinSelectionChange),
      g.onChanged(this.handleAnnotationsChanged),
      t.subscribe(AnnotationAttachmentClickedMessage, this.handleViewingAttachment),
      t.subscribe(AnnotationBlockClickedMessage, this.notationBlockClicked),
      t.commandBinder.addBinding(NotesOpenNoteCommentCommand, this.openNoteToComment),
      t.subscribe(AppChangeMessage, this.onAppChange),
      m.makeModeChangeSubscription(this.onViewModeOrFloorChanged),
      p.makeFloorChangeSubscription(this.onViewModeOrFloorChanged),
      t.subscribe(SweepDataMessage, this.updatePerSettings),
      t.subscribe(InteractionModeChangedMessage, this.updatePerSettings),
      this.layersData.onCurrentLayersChanged(this.onLayersChanged),
      t.commandBinder.addBinding(FilterVisibleNotesCommand, this.filterVisibleNotes),
      t.commandBinder.addBinding(NotesVisibilityFilterEnabledCommand, this.noteVisbilityFilterEnabled),
      this.pollOnNotes(),
      this.viewData.onOpenNoteViewChanged(this.onOpenNoteViewChanged),
      this.notesData.onChanged(this.notesWereChanged),
      this.notesData.collection.onElementChanged({
        onAdded: this.updateNotePin.bind(this),
        onUpdated: this.updateNotePin.bind(this),
        onRemoved: this.removeNotePin.bind(this)
      }),
      t.subscribe(ModelViewChangeCompleteMessage, this.modelViewChanged)
    )
    t.market.register(this, NotesViewData, this.viewData)
    this.updatePerSettings()
    this.parseNotes()
    this.registerRoomAssociationSource(t)
    ;(async function (e, t, i, n, s, a, r) {
      let d = n.application === AppMode.WORKSHOP
      const getSimpleMatches = (n, a, o, r = []) => {
        const c: NoteParser[] = []
        const l = t.getFilteredNotesMap().values
        const h = !o
        const u: string[] = []
        if (0 === r.length) {
          l.forEach(t => {
            if (!d && !i.layerToggled(t.layerId)) return
            let o = 0
            t.comments.forEach((r, d) => {
              ;(h && d > 0) || (n(r.user.name, s.getPlainText(r.text)) && (o++, c.push(new NoteParser(e, i, a, r, t, s, h))))
            })
            o > 0 && u.push(t.id)
          })
        }

        e.issueCommand(new FilterVisibleNotesCommand(u))
        return c
      }
      const onSearchActivatedChanged = t => {
        e.issueCommand(new NotesVisibilityFilterEnabledCommand(!!t))
      }
      const registerChangeObserver = e => new AggregateSubscription(t.getFilteredNotesMap().onChanged(e), a.onChanged(e))
      const u = {
        renew: () => {
          e.issueCommandWhenBound(
            new SearchGroupRegisterCommand({
              id: searchModeType.NOTE,
              groupPhraseKey: Re.SEARCH_GROUP_HEADER_NOTES,
              groupMatchingPhraseKey: Re.SEARCH_GROUP_HEADER,
              getSimpleMatches,
              registerChangeObserver,
              onSearchActivatedChanged,
              groupOrder: 50,
              groupIcon: "comment-outline",
              batchSupported: !0
            })
          )
        },
        cancel: () => {
          e.issueCommandWhenBound(new SearchGroupDeregisterCommand(searchModeType.NOTE))
        }
      }
      const m = () => {
        d = n.application === AppMode.WORKSHOP
        r.tryGetProperty(FeaturesNotesModeKey, !1) || d ? u.renew() : u.cancel()
      }
      const p = n.onPropertyChanged("application", m)
      const g = r.onPropertyChanged(FeaturesNotesModeKey, m)
      m()
      return new AggregateSubscription(u, p, g)
    })(t.commandBinder, this.viewData, this.layersData, c, this.textParser, this.userData, this.settingsData).then(e => this.bindings.push(e))
    await this.refreshNotes()
    t.market.register(this, NotesData, this.notesData)
  }
  dispose(e) {
    this.deactivateTool()
    this.bindings.forEach(e => {
      e.cancel()
    })
    this.bindings = []
    this.activeBindings = []
    this.engine.commandBinder.issueCommand(new RemovePinTypeCommand(PinType.NOTE))
    this.backgroundTexture.dispose()
    this.store.dispose()
    super.dispose(e)
  }
  onUpdate() {}
  async refreshNotes() {
    if (this.refreshPromise) return
    const e = this.viewData
    const { isNewNote: t, notesPhase: i } = e
    t ||
      i === NotesPhase.EDITING ||
      (this.refreshPromise = this.store.refresh().finally(() => {
        this.refreshPromise = null
      }))
  }
  loadNewNotes(e) {
    const { viewData: i } = this,
      n = i.openNoteView?.id,
      s = n ? { [n]: this.notesData.getNote(n) } : {}
    this.notesData.atomic(() => {
      this.layersData.replaceBackendLayers(this.notesData.collection, s)
    })
    this.notesData.atomic(() => {
      this.layersData.replaceBackendLayers(this.notesData.collection, e)
    })
    n &&
      !e[n] &&
      (this.log.debug("Open note was deleted"), i.setOpenNoteView(null), i.setFocusedComment(null), i.setActiveNotation(null), i.setNotesPhase(NotesPhase.IDLE))
  }
  async refreshNote(e: string) {
    if (this.refreshPromise) return
    const t = this.notesData.getNote(e)
    if (this.layersData.isInMemoryLayer(t?.layerId)) this.notesData.updateNote(t)
    else {
      const t = await this.store.readNote(e)
      t && this.notesData.updateNote(t)
    }
  }
  activateTool() {
    this.activated ||
      (this.engine.commandBinder.issueCommand(new AnnotationsCloseAllCommand(AnnotationType.NOTE)),
      this.userData.isCommenter() && this.engine.commandBinder.issueCommand(new EnablePinCreationCommand(!0)),
      this.changeNotesPhase(NotesPhase.IDLE),
      this.updateNoteViewData(),
      this.registered
        ? this.activeBindings.forEach(e => {
            e.renew()
          })
        : this.registerHandlers(),
      (this.activated = !0))
  }
  deactivateTool(e?) {
    var t
    if (!this.activated) return
    this.activated = !1
    const { isNewNote: i, openNoteView: n } = this.viewData
    const s = this.annotationsViewData.dockedAnnotation?.annotationType === AnnotationType.NOTE
    i ? this.cancelNoteCreation(!0) : n && (e || s) && this.closeNote(),
      this.changeNotesPhase(NotesPhase.CLOSED),
      this.engine.commandBinder.issueCommand(new PinSelectionClearCommand()),
      this.engine.commandBinder.issueCommand(new EnablePinCreationCommand(!1)),
      this.activeBindings.forEach(e => {
        e.cancel()
      })
  }
  registerHandlers() {
    const e = this.engine.commandBinder
    this.activeBindings.push(
      this.engine.subscribe(PinPlacedMessage, this.pinPlaced),
      this.engine.subscribe(PinMovedMessage, this.modifyInsideSaveCommand(this.pinMoved)),
      this.engine.subscribe(PinAddCancelledMessage, this.pinAddCancelled),
      e.addBinding(NoteStartAddCommand, this.startNoteCreation),
      e.addBinding(NoteAddCommand, this.modifyInsideSaveCommand(this.saveNewNote)),
      e.addBinding(NoteCancelAddCommand, this.onCancelNewNote),
      e.addBinding(NoteCloseCommand, this.onCloseNote),
      e.addBinding(NoteSaveChangesCommand, this.modifyInsideSaveCommand(this.onSaveNoteChanges)),
      e.addBinding(CommentCancelChangesCommand, this.cancelCommentChanges),
      e.addBinding(NoteCommentEditCommand, this.onEditComment),
      e.addBinding(NoteResolveCommand, this.modifyInsideSaveCommand(this.onResolveNoteCommand)),
      e.addBinding(CommentAddCommand, this.modifyInsideSaveCommand(this.addComment)),
      e.addBinding(CommentUpdateCommand, this.modifyInsideSaveCommand(this.onUpdateComment)),
      e.addBinding(CommentDeleteCommand, this.modifyInsideSaveCommand(this.deleteComment)),
      e.addBinding(NoteAppearanceSaveCommand, this.modifyInsideSaveCommand(this.saveNoteAppearance)),
      e.addBinding(NotePopupEditorToggleCommand, this.togglePinAssetEditor),
      e.addBinding(NotesToggleFilterCommand, this.toggleNotesFilter),
      this.viewData.onNotesFilterChanged(this.onNoteFilterChanged),
      this.viewData.onNotesPhaseChanged(this.onNotesPhaseChanged)
    ),
      (this.registered = !0)
  }
  async parseNotes() {
    const e: Array<{ email: string; userStatus: string }> = []
    const t: string[] = []
    return (
      this.notesData.iterate(i => {
        i.comments.forEach(i => {
          const n = this.getUserMentionsAndHashtags(i.text)
          n.emails.forEach(t => {
            e.push({ email: t, userStatus: UserStatus.MENTIONED })
          })
          t.push(...n.hashtags)
        })
      }),
      this.hashtagData.addHashtags(t),
      this.engine.commandBinder.issueCommand(new UserMentionsFetchCommand(e))
    )
  }
  async parseMarkdown(e) {
    const t: Array<{ email: string; userStatus: string }> = [],
      i = this.getUserMentionsAndHashtags(e)
    i.emails.forEach(e => {
      t.push({ email: e, userStatus: UserStatus.MENTIONED })
    })
    this.hashtagData.addHashtags(i.hashtags)
    return this.engine.commandBinder.issueCommand(new UserMentionsFetchCommand(t))
  }
  getUserMentionsAndHashtags(e: string) {
    const t: string[] = [],
      i: string[] = []
    for (const n of this.textParser.parse(e))
      n.blockType === BlockTypeList.USER && n.value ? t.push(n.value) : n.blockType === BlockTypeList.HASH && i.push(n.text)
    return { emails: t, hashtags: i }
  }
  closeNoteBillboard() {
    const { billboardAnnotation: e } = this.annotationsViewData
    e && e.annotationType === AnnotationType.NOTE && this.engine.commandBinder.issueCommand(new AnnotationCloseCommand(e.id, AnnotationType.NOTE))
  }
  openAnnotation(e, t) {
    t
      ? this.engine.commandBinder.issueCommand(new AnnotationDockCommand(e, AnnotationType.NOTE))
      : this.engine.commandBinder.issueCommand(new AnnotationSelectCommand(e, AnnotationType.NOTE))
  }
  in360View() {
    const e = this.sweepData.currentSweep ? this.sweepData.currentSweep : ""
    return this.viewmodeData.isInside() && this.sweepData.isSweepUnaligned(e)
  }
  async closeNote() {
    var e
    const { commandBinder: t } = this.engine,
      { openNoteView: i, notesPhase: n } = this.viewData
    if (
      (this.viewData.setActiveNotation(null),
      this.viewData.setOpenNoteView(null),
      this.viewData.setFocusedComment(null),
      n !== NotesPhase.CLOSED && this.changeNotesPhase(NotesPhase.IDLE),
      i)
    ) {
      const n = i.id
      this.cancelAttachmentChanges(), t.issueCommand(new SelectSearchResultCommand(null)), t.issueCommand(new ToggleViewAttachmentsCommand(!1))
      const s = this.notesData.getNote(n)
      s &&
        (t.issueCommand(new UnselectPinCommand(n, PinType.NOTE)),
        t.issueCommand(new ChangePinVisibilityCommand(n, PinType.NOTE, this.getNoteVisibility(n, s.layerId, i.resolved))))
      ;(null === (e = this.annotationsViewData.dockedAnnotation) || void 0 === e ? void 0 : e.annotationType) === AnnotationType.NOTE &&
        (await t.issueCommand(new AnnotationsCloseDockedAnnotationCommand()))
    }
  }
  updateNoteViewData() {
    this.viewData.updateNoteViews()
  }
  getFilteredNoteIds(e) {
    const t: string[] = []
    this.notesData.iterate(i => {
      this.getNoteVisibility(i.id, i.layerId, i.resolved) === e && t.push(i.id)
    })
    return t
  }
  getNoteVisibility(e: string, t: string, i: boolean) {
    if (!this.settingsData.tryGetProperty(FeaturesNotesKey, !1)) return !1
    const { notesFilter: n, openNoteView: s, idVisibilityEnabled: a, idVisibility: o } = this.viewData,
      r = this.appData.application === AppMode.WORKSHOP || this.layersData.layerToggled(t),
      d = this.layersData.layerVisible(t),
      c = (null == s ? void 0 : s.id) === e,
      l = !a || o.has(e),
      h = n === NotesFilter.ALL || (i && n === NotesFilter.RESOLVED) || (!i && n === NotesFilter.OPEN)
    return r && (c || (h && l && d))
  }
  displayNotes() {
    const e: Array<ReturnType<NotesModule["getPinUpdate"]>> = []
    this.notesData.iterate(t => {
      const i = this.getPinUpdate(t)
      e.push(i)
    })
    this.engine.commandBinder.issueCommand(new UpdatePinViewsCommand(e))
  }
  updateNotePin(e: NotesViewData["openNoteView"]) {
    const t = this.getPinUpdate(e)
    this.engine.commandBinder.issueCommand(new UpdatePinViewsCommand([t]))
  }
  getPinUpdate(e: NoteObject | NotesViewData["openNoteView"]) {
    const { id, layerId, resolved, anchorPosition, color, stemEnabled, floorId, roomId, stemNormal, stemLength } = e!
    return {
      id,
      anchorPosition,
      color,
      floorId,
      roomId,
      stemEnabled,
      stemNormal,
      stemLength,
      pinType: PinType.NOTE,
      backgroundTexture: this.backgroundTexture,
      icon: IconType[PinType.NOTE],
      visible: this.getNoteVisibility(id, layerId, resolved)
    }
  }
  removeNotePin(e) {
    this.engine.commandBinder.issueCommand(new RemovePinCommand(e.id, PinType.NOTE))
  }
  async confirmAttachmentChanges(e, t) {
    return this.engine.commandBinder.issueCommand(new ConfirmAttachmentChangesCommand(e, parentType.COMMENT, t))
  }
  async cancelAttachmentChanges() {
    return this.engine.commandBinder.issueCommand(new CancelAttachmentChangesCommand())
  }
  updatePendingNote() {
    const e = this.viewData.getPendingNote(),
      t = this.appData.application === AppMode.WORKSHOP
    e && t && !this.layersData.isInMemoryLayer(e.layerId) && (e.layerId = this.layersData.getNotesLayerId(t))
  }
  setFocusedNoteComment(e, t) {
    if (t) {
      const i = this.viewData.getComment(e, t)
      this.viewData.setFocusedComment(i)
    } else this.viewData.setFocusedComment(null)
  }
  async openNote(e: string, t, i, n?, s?) {
    var a
    const r = this.annotationsViewData.dockedAnnotation?.annotationType === AnnotationType.NOTE
    const d = null !== i ? i : r
    // this.engine.commandBinder.issueCommand(new SelectSearchResultCommand(e, searchModeType.NOTE))
    return d ? this.dockNote(e, t, n, s) : this.selectNote(e, t, n)
  }
  async selectNote(e, t, i) {
    var n
    const { commandBinder: s } = this.engine
    this.setFocusedNoteComment(e, i)
    const a = this.viewData.getNoteView(e)
    if (a) {
      const { openNoteView: i } = this.viewData,
        o = (null == i ? void 0 : i.id) === e,
        r = (null === (n = this.annotationsViewData.dockedAnnotation) || void 0 === n ? void 0 : n.id) === e
      if (o && !r && i) return void this.log.debug("Note is already selected")
      this.activated && (await s.issueCommand(new CloseToolCommand(ToolsList.NOTES))),
        s.issueCommand(new ToggleViewAttachmentsCommand(!1)),
        i && (s.issueCommand(new AnnotationCloseCommand(i.id, AnnotationType.NOTE)), s.issueCommand(new UnselectPinCommand(i.id, PinType.NOTE))),
        this.viewData.setOpenNoteView(a),
        await s.issueCommand(new SelectPinCommand(e, PinType.NOTE, !1)),
        null !== t && (await s.issueCommand(new FocusOnPinInsideCommand({ pinPosition: a, transition: t })))
    } else this.log.debug("Cannot select a non-existent note")
  }
  async dockNote(e: string, t, i, n = !1) {
    var s
    const { toolsData: a, viewData: o, engine: r, activated: d, userData: c } = this,
      l = o.getNoteView(e)
    if (l) {
      const { openNoteView: h, focusedComment: u } = this.viewData,
        m = (null == h ? void 0 : h.id) === e,
        v = (null === (s = this.annotationsViewData.dockedAnnotation) || void 0 === s ? void 0 : s.id) === e
      if ((a.toolCollapsed && r.commandBinder.issueCommand(new ToolPanelToggleCollapseCommand(!1)), this.setFocusedNoteComment(e, i), m && v))
        return void (o.focusedComment && i !== (null == u ? void 0 : u.id) && this.engine.broadcast(new FocusCommentMessage(o.focusedComment.id)))
      r.commandBinder.issueCommand(new CloseModalCommand()),
        d || (await r.commandBinder.issueCommand(new OpenToolCommand(ToolsList.NOTES, !0))),
        m || o.setOpenNoteView(l)
      const y = (0, _.CM)(c, AnnotationType.NOTE, l.user)
      if (
        (r.commandBinder.issueCommand(new SelectPinCommand(e, PinType.NOTE, y)),
        this.changeNotesPhase(NotesPhase.OPENING),
        null !== t && (await r.commandBinder.issueCommand(new FocusOnPinInsideCommand({ pinPosition: l, transition: t }))),
        this.changeNotesPhase(NotesPhase.OPEN),
        n)
      ) {
        const t = l.comments.get(0)
        let n = i ? o.getComment(e, i) : void 0
        if ((n || (n = t), !n)) throw new Error("No root comment in the note")
        const s = (0, _.CM)(c, AnnotationType.NOTE, n.user)
        o.setActiveNotation(s ? n.id : null)
      } else o.setActiveNotation(null)
    } else this.log.debug("Cannot open a non-existent note")
  }
  async resolveNote(e) {
    const t = this.notesData.getNote(e)
    if (t) {
      if (t.resolved) return
      this.closeNote(), await waitRun(350), this.engine.broadcast(new NoteResolutionChangeMessage(e, !0))
      !!this.layersData.isInMemoryLayer(t.layerId) || (await this.store.updateResolution(e, !0))
        ? this.notesData.updateNoteProperties(e, { resolved: !0 })
        : this.log.error("Resolving note failed")
    } else this.log.debug("Cannot resolve a non-existent note")
  }
  async reopenNote(e: string) {
    const t = this.notesData.getNote(e)
    if (t) {
      if (!t.resolved) return
      this.viewData.updateOpenNoteView({ resolved: !1 })
      !!this.layersData.isInMemoryLayer(t.layerId) || (await this.store.updateResolution(e, !1))
        ? this.notesData.updateNoteProperties(e, { resolved: !1 })
        : this.log.error("Reopen note failed")
    } else this.log.debug("Cannot reopen a non-existent note")
  }
  modifyInsideSaveCommand(e) {
    return async (...t) => {
      await this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.NOTES], onCallback: () => e(...t), skipDirtyUpdate: !0 }))
    }
  }
  async updateNoteComment(e, t, i) {
    const n = this.notesData.getNote(e)
    if (n) {
      const s = this.layersData.isInMemoryLayer(n.layerId),
        a = n.getComment(t)
      if (a)
        if (a.user.id === this.userData.getCurrentUserId()) {
          const r = !s && (await this.confirmAttachmentChanges(t, parentType.COMMENT)),
            d = i !== a.text
          if (d) {
            if (s) a.text = i
            else {
              const e = await this.store.updateComment({ id: t, text: i })
              e && n.updateComment(e)
            }
            this.parseMarkdown(i)
          }
          ;(r || d) && (await this.refreshNote(n.id), n.resolved && (this.viewData.setNotesFilter(NotesFilter.ALL), this.reopenNote(e))),
            this.viewData.setActiveNotation(null)
        } else this.log.debug("Cannot update another user's comment")
      else this.log.debug("Cannot update a non-existent comment")
    } else this.log.debug("Cannot update a comment in a non-existent note")
  }
  registerRoomAssociationSource(e: EngineContext) {
    const t = this.notesData
    e.commandBinder.issueCommandWhenBound(
      new RegisterRoomAssociationSourceCommand({
        type: "notes",
        getPositionId: function* () {
          for (const e of t.collection.values) yield { id: e.id, roomId: e.roomId, floorId: e.floorId, position: e.anchorPosition, layerId: e.layerId }
        },
        updateRoomForId: (e: string, t: string) => {
          const i = this.notesData.getNote(e)
          if (!i) throw new Error("Invalid note id!")
          i.roomId = t || void 0
        }
      })
    )
  }
}
