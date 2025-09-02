import { Texture } from "three"
import { TextParser } from "../other/52528"
import { NotesPhase } from "../const/38965"
import * as c from "../const/62612"
import { NotesFilter } from "../const/notes.const"
import { Data } from "../core/data"
import DeepLinkerModule from "../modules/deepLinker.module"
import { NoteObject, NotesData } from "../modules/notes.module"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
import { ObservableOrder, ObservableOrderPriority } from "../observable/observable.order"
import { ObservableValue, createObservableValue } from "../observable/observable.value"
import { ChangeObserver } from "../observable/observable"
import { IconType, PinType } from "../const/62612"
export class NotesViewData extends Data {
  data: NotesData
  textParser: TextParser
  linkHandler: DeepLinkerModule
  backgroundTexture: Texture
  noteViewsMap: ObservableMap<NotesViewData["openNoteView"]>
  isNewNote: boolean
  openNoteViewObservable: ObservableValue<null | ReturnType<NotesViewData["createNoteView"]>>
  focusedCommentObservable: ObservableValue<null | any>
  activeNotationObservable: ObservableValue<null | string>
  idVisibilityEnabled: boolean
  idVisibility: Set<unknown>
  notesPhaseObservable: ObservableValue<NotesPhase>
  notesFilterObservable: ObservableValue<NotesFilter>
  updateNoteViews: () => void
  sortByDate: (e: any, t: any) => number
  filterByResolved: (e: any) => boolean
  noteViews: ObservableOrder
  constructor(e: NotesData, t: TextParser, i: DeepLinkerModule, n: Texture) {
    super()
    this.data = e
    this.textParser = t
    this.linkHandler = i
    this.backgroundTexture = n
    this.name = "notes-view-data"
    this.noteViewsMap = createObservableMap()
    this.isNewNote = !1
    this.openNoteViewObservable = createObservableValue(null)
    this.focusedCommentObservable = createObservableValue(null)
    this.activeNotationObservable = createObservableValue(null)
    this.idVisibilityEnabled = !1
    this.idVisibility = new Set()
    this.notesPhaseObservable = createObservableValue(NotesPhase.CLOSED)
    this.notesFilterObservable = createObservableValue(NotesFilter.OPEN)
    this.updateNoteViews = () => {
      const e: Record<string, NotesViewData["openNoteView"]> = {}
      this.data.iterate(t => {
        const n = this.createNoteView(t)
        e[t.id] = n
        this.openNoteView?.id === n.id && this.setOpenNoteView(n)
      })
      this.noteViewsMap.replace(e)
    }
    this.sortByDate = (e, t) => t.lastCommentMs - e.lastCommentMs
    this.filterByResolved = e => this.notesFilter === NotesFilter.ALL || e.resolved === (this.notesFilter === NotesFilter.RESOLVED)
    this.noteViews = new ObservableOrder(this.noteViewsMap)
    this.noteViews.priority = ObservableOrderPriority.LOW
    this.notesFilter !== NotesFilter.ALL && this.noteViews.setFilter(this.notesFilter, this.filterByResolved)
    this.noteViews.sort(this.sortByDate)
    this.updateNoteViews()
  }
  getFilteredNotesMap() {
    return this.noteViews
  }
  getNoteViewsMap() {
    return this.noteViewsMap
  }
  getNoteView(e: string) {
    return this.noteViewsMap.get(e)
  }
  getTextParser() {
    return this.textParser
  }
  getLinkHandler() {
    return this.linkHandler
  }
  getComment(e, t) {
    const i = this.getNoteView(e)
    return (null == i ? void 0 : i.comments.find(e => e.id === t)) || null
  }
  getReply(e, t) {
    const i = this.getNoteView(e)
    return (null == i ? void 0 : i.comments.find((e, i) => i > 0 && e.id === t)) || null
  }
  getAttachment(e, t, i) {
    var n
    const s = (null === (n = this.getNoteView(e)) || void 0 === n ? void 0 : n.comments.find(e => e.id === t)) || null
    return (null == s ? void 0 : s.attachments.find(e => e.id === i)) || null
  }
  createNoteView(e: NoteObject) {
    return Object.assign(Object.assign({}, e), { backgroundTexture: this.backgroundTexture, icon: IconType[PinType.NOTE] })
  }
  getCommentUserMentions(e, t) {
    const i: any[] = []
    return (
      this.textParser.getUserMentions(e).forEach(e => {
        const n = t[e]
        n && i.push(n)
      }),
      i
    )
  }
  getNoteAttachments(e) {
    const t: any[] = [],
      i = this.getNoteView(e)
    return (
      i &&
        i.comments.forEach(e => {
          t.push(...e.attachments)
        }),
      t
    )
  }
  getPendingNote() {
    return this.isNewNote && this.openNoteView ? this.openNoteView : null
  }
  setNotesPhase(e: NotesPhase) {
    this.notesPhaseObservable.value = e
  }
  get notesPhase() {
    return this.notesPhaseObservable.value
  }
  onNotesPhaseChanged(e) {
    return this.notesPhaseObservable.onChanged(e)
  }
  setNotesFilter(e) {
    const t = this.notesFilterObservable.value
    this.notesFilterObservable.value = e
    this.noteViews.atomic(() => {
      this.noteViews.clearFilter(t), e !== NotesFilter.ALL && this.noteViews.setFilter(e, this.filterByResolved)
    })
  }
  get notesFilter() {
    return this.notesFilterObservable.value
  }
  onNotesFilterChanged(e) {
    return this.notesFilterObservable.onChanged(e)
  }
  setActiveNotation(e: NotesViewData["activeNotation"]) {
    this.activeNotationObservable.value = e
  }
  get activeNotation() {
    return this.activeNotationObservable.value
  }
  onActiveNotationChanged(e: ChangeObserver<NotesViewData["activeNotation"]>) {
    return this.activeNotationObservable.onChanged(e)
  }
  setOpenNoteView(e: NotesViewData["openNoteView"]) {
    this.openNoteViewObservable.value = e
  }
  get openNoteView() {
    return this.openNoteViewObservable.value
  }
  onOpenNoteViewChanged(e: ChangeObserver<NotesViewData["openNoteView"]>) {
    return this.openNoteViewObservable.onChanged(e)
  }
  resetOpenNoteView() {
    const e = this.openNoteView
    if (e) {
      const t = this.data.getNoteProperties(e.id)
      t && this.updateOpenNoteView(t)
    }
  }
  updateOpenNoteView(e: Partial<NoteObject>) {
    const t = this.openNoteView
    t && Object.assign(t, e)
  }
  setFocusedComment(e) {
    this.focusedCommentObservable.value = e
  }
  get focusedComment() {
    return this.focusedCommentObservable.value
  }
  onFocusedCommentChanged(e) {
    return this.focusedCommentObservable.onChanged(e)
  }
}
