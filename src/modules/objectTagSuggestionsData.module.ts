import * as S from "react"
import * as A from "react/jsx-runtime"
import { Color, ColorRepresentation, Vector3 } from "three"
import * as M from "../other/27741"
import * as L from "../other/27839"
import * as I from "../other/66102"
import * as E from "../other/75182"
import * as N from "../other/84426"
import { AnnotationCloseCommand, AnnotationPreviewCommand } from "../command/annotation.command"
import { MattertagNewSaveCommand } from "../command/mattertag.command"
import { FocusOnPinInsideCommand } from "../command/navigation.command"
import {
  CreateObjectTagCommand,
  DismissObjectTagCommand,
  DockObjectTagCommand,
  FilterTagSuggestionCommand,
  NavigateToTagSuggestionCommand,
  ObjectsAnnotationsEnabledCommand,
  ToggleObjectEnabledCommand,
  ToggleObjectTagEnabledCommand
} from "../command/objectTag.command"
import {
  ChangePinTypeVisibilityCommand,
  RemovePinCommand,
  SelectPinCommand,
  UnselectPinCommand,
  UpdatePinCommand,
  UpdatePinViewsCommand
} from "../command/pin.command"
import { RegisterRoomAssociationSourceCommand } from "../command/room.command"
import { SaveCommand } from "../command/save.command"
import { SearchGroupDeregisterCommand, SearchGroupRegisterCommand, SelectSearchResultCommand } from "../command/searchQuery.command"
import { TagDeleteCommand, TagOpenCommand, TagSaveCommand } from "../command/tag.command"
import { CloseToolCommand, OpenToolCommand } from "../command/tool.command"
import { LockViewmodeCommand, UnlockViewmodeCommand } from "../command/viewmode.command"
import { PinType } from "../const/62612"
import { TransitionTypeList } from "../const/64918"
import { DataType } from "../const/79728"
import * as Y from "../const/998"
import { AnnotationType } from "../const/annotationType.const"
import { PhraseKey } from "../const/phrase.const"
import { LocaleSymbol, ObjectTagSuggestionsDataSymbol } from "../const/symbol.const"
import { ToolsList } from "../const/tools.const"
import { searchModeType } from "../const/typeString.const"
import { AppReactContext } from "../context/app.context"
import { DebugInfo } from "../core/debug"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { AnnotationsViewData } from "../data/annotations.view.data"
import { AppData, AppMode } from "../data/app.data"
import { LayersData } from "../data/layers.data"
import { ObjectTagsData } from "../data/object.tags.data"
import { PinsViewData } from "../data/pins.view.data"
// import { SearchData } from "../data/search.data"
import { TagData } from "../data/tag.data"
import { LoadTexture } from "../utils/loadTexture"
import { VisionParase } from "../math/2569"
import { ObservableObject } from "../observable/observable.object"
import { BaseParser } from "../parser/baseParser"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import * as U from "../utils/95724"
import { getDayTag, toDate } from "../utils/date.utils"
import { randomString } from "../utils/func.utils"
declare global {
  interface SymbolModule {
    [ObjectTagSuggestionsDataSymbol]: ObjectTagSuggestionsDataModule
  }
}
function D(e) {
  const t = e.toLowerCase().replace(" & ", " ").replace(" ", "-")
  return E.g.includes(`object-${t}`) ? `object-${t}` : "simple-tag-small"
}
class x extends BaseParser {
  suggestion: any
  mattertag: any
  title: any
  description: any
  icon: string
  color: any
  constructor(e, t, i, n, s) {
    var a, r, d
    super(e, t, i),
      (this.suggestion = n),
      (this.mattertag = s),
      (this.id = this.suggestion.id),
      (this.title = this.suggestion.displayLabel),
      (this.description = this.suggestion.displayCategory),
      (this.icon = `icon-${D(this.suggestion.displayLabel)}`),
      (this.color = this.suggestion.color),
      (this.enabled = this.suggestion.visible),
      (this.typeId = searchModeType.OBJECTANNOTATION),
      (this.floorId = this.suggestion.floorId),
      (this.roomId = this.suggestion.roomId || ""),
      (this.dateBucket = getDayTag(this.suggestion.created)),
      (this.layerId = this.suggestion.layerId),
      (this.onSelect = () => {
        super.onSelect(), this.commandBinder.issueCommand(new NavigateToTagSuggestionCommand(this.suggestion.id))
      }),
      (this.title = (null === (a = this.mattertag) || void 0 === a ? void 0 : a.label) ? this.mattertag.label : this.suggestion.displayLabel),
      (this.description = (null === (r = this.mattertag) || void 0 === r ? void 0 : r.description)
        ? this.mattertag.description
        : this.suggestion.displayCategory),
      (this.color = (null === (d = this.mattertag) || void 0 === d ? void 0 : d.color) ? `#${this.mattertag.color.getHexString()}` : this.suggestion.color)
  }
  supportsLayeredCopyMove() {
    return !0
  }
  supportsBatchDelete() {
    return !0
  }
}
const { OBJECT_TAG_SUGGESTION: j } = PhraseKey.WORKSHOP
const R = ({ item: e }) => {
  const { id: t, typeId: i } = e,
    { analytics: n, commandBinder: s, editMode: a } = (0, S.useContext)(AppReactContext),
    r = (0, I.b)()
  if (!a || i !== searchModeType.OBJECTANNOTATION) return null
  function d(e) {
    n.track("JMYDCase_gui", { tool: "object_tags", gui_action: e })
  }
  return (0, A.jsxs)(N.hE, {
    children: [
      (0, A.jsx)(M.q, {
        item: e,
        onToggle: e => {
          s.issueCommand(new ToggleObjectEnabledCommand(t, e)), d(e ? "object_tags_show_click" : "object_tags_hide_click")
        }
      }),
      (0, A.jsxs)(
        N.xz,
        Object.assign(
          { icon: "more-vert", ariaLabel: r.t(PhraseKey.MORE_OPTIONS), menuArrow: !0, menuClassName: "search-result-menu" },
          {
            children: [
              (0, A.jsx)(N.zx, {
                label: r.t(j.SEARCH_ITEM_EDIT),
                onClick: () => {
                  s.issueCommand(new SelectSearchResultCommand(t, i)), s.issueCommand(new DockObjectTagCommand(t)), d("object_tags_edit_click")
                },
                variant: N.Wu.TERTIARY,
                size: N.qE.SMALL
              }),
              (0, A.jsx)(N.zx, {
                className: "menu-delete-btn",
                label: r.t(j.SEARCH_ITEM_DELETE),
                onClick: () => {
                  s.issueCommand(new DismissObjectTagCommand(t)),
                    s.issueCommand(new RemovePinCommand(t, PinType.OBJECT)),
                    s.issueCommand(new AnnotationCloseCommand(t, AnnotationType.OBJECT)),
                    d("object_tags_delete_click")
                },
                variant: N.Wu.TERTIARY,
                size: N.qE.SMALL
              })
            ]
          }
        )
      )
    ]
  })
}
const { OBJECT_TAG_SUGGESTION: V } = PhraseKey.WORKSHOP
const B = ({ group: e }) => {
  const { analytics: t, commandBinder: i, editMode: n } = (0, S.useContext)(AppReactContext),
    s = (0, I.b)(),
    a = (0, L._)(),
    { matches: o } = e
  if (!n) return null
  if (0 === o.length) return null
  const r = o.filter(e => e.enabled).length,
    d = r === o.length,
    c = 0 === r
  function l(e) {
    t.track("JMYDCase_gui", { tool: "object_tags", gui_action: e })
  }
  const h = !a || !a.canBatchDeleteInActiveView()
  return (0, A.jsx)(N.hE, {
    children: (0, A.jsxs)(
      N.xz,
      Object.assign(
        { icon: "more-vert", ariaLabel: s.t(PhraseKey.MORE_OPTIONS), menuArrow: !0, menuClassName: "search-result-menu" },
        {
          children: [
            (0, A.jsx)(N.zx, {
              label: s.t(V.SEARCH_GROUP_HIDE_ALL),
              onClick: () => {
                i.issueCommand(new ToggleObjectTagEnabledCommand(!1, ...o.map(e => e.id))), l("hide_all_click")
              },
              variant: N.Wu.TERTIARY,
              size: N.qE.SMALL,
              disabled: c
            }),
            (0, A.jsx)(N.zx, {
              label: s.t(V.SEARCH_GROUP_SHOW_ALL),
              onClick: () => {
                i.issueCommand(new ToggleObjectTagEnabledCommand(!0, ...o.map(e => e.id))), l("show_all_click")
              },
              variant: N.Wu.TERTIARY,
              size: N.qE.SMALL,
              disabled: d
            }),
            h &&
              (0, A.jsx)(N.zx, {
                className: "menu-delete-btn",
                label: s.t(V.SEARCH_GROUP_DELETE_ALL),
                onClick: () => {
                  i.issueCommand(new DismissObjectTagCommand(...o.map(e => e.id))), l("delete_all_click")
                },
                variant: N.Wu.TERTIARY,
                size: N.qE.SMALL
              })
          ]
        }
      )
    )
  })
}
const z = 0.065
export class ObjectTagObject extends ObservableObject {
  created: Date
  modified: Date
  position: Vector3
  stemDirection: Vector3
  stemLength: number
  stemEnabled: boolean
  enabled: boolean
  icon: string
  keywords: any
  label: string
  localizedName: any
  localizedCategory: any
  color?: ColorRepresentation
  floorId: string
  roomId: string
  id: string
  layerId: string
  mattertagId: string
  constructor(e) {
    super()
    this.created = new Date()
    this.modified = new Date()
    this.position = new Vector3()
    this.stemDirection = new Vector3()
    this.stemLength = z
    this.stemEnabled = !1
    this.enabled = !0
    this.icon = "simple-tag"

    e && (Object.assign(this, e), (this.keywords = e.keywords || []), this.label && (this.icon = D(this.label)))
  }
  get displayLabel() {
    return this.localizedName ? this.localizedName : this.label
  }
  get displayCategory() {
    return this.localizedCategory ? this.localizedCategory : ""
  }
  get visible() {
    return this.enabled
  }
  set visible(e) {
    ;(this.enabled = e), this.commit()
  }
  getMattertagOptions() {
    return {
      color: new Color(this.color),
      description: this.displayCategory,
      enabled: !0,
      floorId: this.floorId,
      roomId: this.roomId,
      label: this.displayLabel,
      normal: this.stemDirection.clone(),
      objectAnnotationId: this.id,
      position: this.position.clone(),
      stemHeight: this.stemLength,
      stemVisible: !0,
      keywords: this.keywords.slice(),
      icon: this.icon
    }
  }
  getPin(e) {
    return {
      id: this.id,
      floorId: this.floorId,
      anchorPosition: this.position.clone(),
      stemNormal: this.stemDirection.clone(),
      stemEnabled: !1,
      stemLength: z,
      color: e ? `#${e.color.getHexString()}` : this.color,
      roomId: this.roomId,
      icon: this.icon
    }
  }
  toTagView(e) {
    return {
      id: this.id,
      label: e?.label || this.displayLabel,
      description: e?.description || this.displayCategory,
      enabled: this.enabled,
      backgroundTexture: he,
      attachments: e?.fileAttachments.values() || [],
      created: this.created,
      modified: this.modified,
      stemEnabled: this.stemEnabled,
      color: this.color,
      anchorPosition: this.position.clone(),
      stemNormal: this.stemDirection.clone(),
      stemLength: this.stemLength,
      floorId: this.floorId,
      roomId: this.roomId,
      layerId: this.layerId,
      keywords: e?.keywords.slice() || this.keywords.slice(),
      icon: this.icon
    }
  }
}
enum $ {
  APPLIANCE = "Appliance",
  CONSUMER_ELECTRONICS = "Consumer Electronics",
  FIXTURE = "Fixture",
  FURNITURE = "Furniture",
  LIGHTING = "Lighting"
}

const J = "WORKSHOP.OBJECT_TAG_SUGGESTION.VISION."
class q {
  locale: any
  log: DebugInfo
  keywordList: unknown[]
  constructor(e) {
    ;(this.locale = e), (this.locale = e), (this.log = new DebugInfo("Object-tag-deserializer")), (this.keywordList = Object.values($))
  }
  deserialize(e) {
    var t, i, n, s
    if (!e || !this.validate(e)) return null
    const a = e.region,
      o = (null == a ? void 0 : a.anchorPosition) ? VisionParase.fromVisionVector(a.anchorPosition) : void 0,
      r = (null == a ? void 0 : a.stemNormal) ? VisionParase.fromVisionVector(a.stemNormal) : void 0,
      d = new ObjectTagObject({
        id: e.id,
        confidence: null !== (t = e.confidence) && void 0 !== t ? t : 0,
        created: toDate(e.created),
        modified: toDate(e.created),
        enabled: e.enabled
      })
    ;(null === (i = e.region) || void 0 === i ? void 0 : i.stemLength) && (d.stemLength = e.region.stemLength),
      e.floor && e.floor.id && (d.floorId = e.floor.id),
      e.room && e.room.id && (d.roomId = e.room.id),
      e.layer && e.layer.id && (d.layerId = e.layer.id),
      o && (d.position = o),
      r && (d.stemDirection = r),
      (d.mattertagId = null === (n = e.tag) || void 0 === n ? void 0 : n.id)
    let c = e.keywords || [],
      l = e.label || ""
    if (e.classification) {
      const t = e.classification,
        i = J + this.formatStringToPhraseKey(t.label)
      this.locale.has(i) && (d.localizedName = this.locale.t(i))
      const { defaultKeywords: n } = t
      if (n && n.length > 0) {
        const e = n[n.length - 1],
          t = J + this.formatStringToPhraseKey(e)
        this.locale.has(t) && (d.localizedCategory = this.locale.t(t))
      }
      t.label && ((l = t.label), (d.icon = D(l))), t.defaultKeywords && (c = t.defaultKeywords)
      const s = []
      for (const e of c) {
        const t = J + this.formatStringToPhraseKey(e)
        this.locale.has(t) ? s.push(this.locale.t(t)) : s.push(e)
      }
      c = s
    }
    return (d.keywords = c), (d.label = l), this.postProcess(d, null === (s = e.classification) || void 0 === s ? void 0 : s.defaultKeywords), d
  }
  formatStringToPhraseKey(e) {
    return e.trim().replace(/\s/, "_").toUpperCase()
  }
  validate(e) {
    if (!e) return !1
    const t = ["id", "label", "created", "modified", "region"]
    for (const i of t) {
      if (!(i in e)) return this.log.error("Missing field: ", i), !1
    }
    return !0
  }
  postProcess(e, t) {
    let [i, n] = e.label.split(".").slice(1)
    if (i && !e.localizedCategory) {
      const t = J + i.toUpperCase()
      this.locale.has(t) ? (e.localizedCategory = this.locale.t(t)) : (e.localizedCategory = i)
    }
    if (n && !e.localizedName) {
      const t = J + n.toUpperCase()
      this.locale.has(t) ? (e.localizedName = this.locale.t(t)) : (e.localizedName = n)
    }
    if (t && t.length > 0)
      for (const e of this.keywordList)
        if (t.includes(e)) {
          i = e
          break
        }
    e.color = this.getCategoryColor(i)
  }
  getCategoryColor(e) {
    switch (e) {
      case "appliances":
        return Y.U.cerulean
      case "consumer_electronics":
        return Y.U.emerald
      case "fixtures":
        return Y.U.sunset
      case $.APPLIANCE:
        return Y.U.cerulean
      case $.CONSUMER_ELECTRONICS:
        return Y.U.emerald
      case $.FIXTURE:
        return Y.U.sunset
      case $.FURNITURE:
        return Y.U.canary
      case $.LIGHTING:
        return Y.U.fog
      default:
        return Y.U.forest
    }
  }
}
class Q extends MdsStore {
  classifications: never[]
  layeredType: string
  confidence: any
  objectDeserializer: q
  deserializer: ArrayDeserializer
  constructor(e, t, i) {
    super(e),
      (this.classifications = []),
      (this.layeredType = searchModeType.OBJECTANNOTATION),
      (this.confidence = i || 0.9),
      (this.objectDeserializer = new q(t)),
      (this.deserializer = new ArrayDeserializer({ deserializer: this.objectDeserializer }))
  }
  async read(e) {
    // const t = {
    //   modelId: this.getViewId(),
    //   minConfidence: this.confidence,
    //   includeDisabled: !0,
    //   inferenceEvents: null,
    //   ids: null,
    //   includeLayers: this.readLayerId()
    // }
    // return this.query(F.GetObjectAnnotations, t, e).then(e => {
    //   var t, i
    //   const n = null === (i = null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.model) || void 0 === i ? void 0 : i.objectAnnotations
    //   if (!n || !Array.isArray(n)) return null
    //   return (this.deserializer.deserialize(n) || []).reduce((e, t) => ((e[t.id] = t), e), {})
    // })
    //pw
    return {}
  }
  async toggleEnabled(e, t) {
    // const i = { modelId: this.getViewId(), objectAnnotationId: e, data: { enabled: t }, includeLayers: this.readLayerId() }
    // return this.mutate(F.PatchObjectAnnotation, i).then(e => {
    //   var t
    //   const i = null === (t = e.data) || void 0 === t ? void 0 : t.patchObjectAnnotation
    //   if (i) {
    //     const e = this.objectDeserializer.deserialize(i)
    //     if (e) return e
    //   }
    //   throw new Error("Could not update Object Annotation")
    // })
    //pw
    return
  }
  async toggleAllEnabled(e, ...t) {
    // const i = { modelId: this.getViewId(), objectAnnotationIds: t, setEnabled: e, includeLayers: this.readLayerId() }
    // return this.mutate(F.SetBulkObjectAnnotationsEnabled, i).then(e => {
    //   var t
    //   const i = null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.setBulkObjectAnnotationsEnabled
    //   if (!i) throw new Error("Could not update Object Annotations")
    //   return i.map(e => e.id)
    // })
    //pw
    return []
  }
  async deleteObjectAnnotation(e) {
    // const t = { modelId: this.getViewId(), objectAnnotationId: e }
    // return this.mutate(F.DeleteObjectAnnotation, t).then(e => {
    //   var t
    //   return !!(null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.deleteObjectAnnotation)
    // })
    //pw
    return !0
  }
  async createObjectTag(e) {
    // const t = {
    //     label: e.label,
    //     keywords: e.keywords || [],
    //     floorId: e.floorId,
    //     layerId: this.writeLayerId(e.layerId) ? e.layerId : void 0,
    //     enabled: !0,
    //     vectorRegion: { anchorPosition: VisionParase.toVisionVector(e.position), stemNormal: VisionParase.toVisionVector(e.stemDirection), stemLength: e.stemLength }
    //   },
    //   i = { modelId: this.getViewId(), objectAnnotation: t, includeLayers: this.readLayerId() }
    // return this.mutate(F.AddObjectAnnotation, i).then(e => {
    //   var t
    //   const i = null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.addObjectAnnotation
    //   if (i) {
    //     const e = this.objectDeserializer.deserialize(i)
    //     if (e) return e
    //   }
    //   throw new Error("Could not create Object Annotation")
    // })
    return
  }
}

import ee from "../images/objectColor.png"
import { ArrayDeserializer } from "../utils/95724"
const he = LoadTexture(ee)
export default class ObjectTagSuggestionsDataModule extends Module {
  visibilityEnabled: boolean
  idVisibility: Set<unknown>
  createdTag: null
  onPinSelectionChange: (e: any) => void
  engine: { commandBinder: any }
  annotationsViewData: { billboardAnnotation: any }
  data: any
  onPinFocusChange: () => Promise<undefined>
  pinsViewData: { focusedPin: any; selectedPinId: any }
  onLayersChanged: () => void
  toggleObjectAnnotations: (e: any) => Promise<void>
  selectedItemChanged: () => void
  searchData: { activeItemId: any; selectedType: any }
  setAllObjectTagsEnabled: (e: any) => Promise<void>
  store: any
  toggleObjectTagEnabled: (e: any) => Promise<void>
  deleteTags: (e: any) => Promise<void>
  createObjectTag: (e: any) => Promise<void>
  layersData: any
  dockObjectTag: (e: any) => Promise<void>
  locale: any
  mattertagsData: any
  appData: any
  constructor() {
    super(...arguments),
      (this.name = "object-tag-suggestions-data"),
      (this.visibilityEnabled = !1),
      (this.idVisibility = new Set()),
      (this.createdTag = null),
      (this.onPinSelectionChange = e => {
        const { commandBinder: t } = this.engine,
          { billboardAnnotation: i } = this.annotationsViewData,
          n = e ? this.data.getObjectTag(e) : null
        n
          ? (t.issueCommand(new SelectSearchResultCommand(n.id, searchModeType.OBJECTANNOTATION)),
            t.issueCommand(new AnnotationPreviewCommand(n.id, AnnotationType.OBJECT)))
          : i && i.annotationType === AnnotationType.OBJECT && t.issueCommand(new AnnotationCloseCommand(i.id, AnnotationType.OBJECT))
      }),
      (this.onPinFocusChange = async () => {
        const { commandBinder: e } = this.engine,
          { focusedPin: t, selectedPinId: i } = this.pinsViewData,
          { billboardAnnotation: n, dockedAnnotation: s } = this.annotationsViewData
        if (!t)
          return void (
            n &&
            n.annotationType === AnnotationType.OBJECT &&
            n.id !== i &&
            (await e.issueCommand(new AnnotationCloseCommand(n.id, AnnotationType.OBJECT)))
          )
        const a = i ? this.pinsViewData.getPin(i) : null
        a &&
          a.pinType === PinType.OBJECT &&
          (e.issueCommand(new UnselectPinCommand(a.id, PinType.OBJECT)), e.issueCommand(new SelectSearchResultCommand(null))),
          t.pinType === PinType.OBJECT && t.id !== (null == s ? void 0 : s.id) && e.issueCommand(new AnnotationPreviewCommand(t.id, AnnotationType.OBJECT))
      }),
      (this.onLayersChanged = () => {
        this.unselectObjectPin(), this.unselectObjectSearchResult(), this.displayObjects()
      }),
      (this.toggleObjectAnnotations = async e => {
        const { enabled: t } = e
        ;(this.visibilityEnabled = t),
          this.engine.commandBinder.issueCommand(new ChangePinTypeVisibilityCommand(PinType.OBJECT, t)),
          t || (this.unselectObjectPin(), this.unselectObjectSearchResult()),
          this.displayObjects()
      }),
      (this.selectedItemChanged = () => {
        // const { activeItemId: e, selectedType: t } = this.searchData
        // if (e && t === searchModeType.OBJECTANNOTATION) {
        //   const t = this.data.getObjectTag(e)
        //   t && this.updatePin(t)
        // }
      }),
      (this.setAllObjectTagsEnabled = async e => {
        const { ids: t, enabled: i } = e
        0 !== t.length &&
          (await this.store.toggleAllEnabled(i, ...t),
          this.data.atomic(() => {
            for (const e of this.data.collection) t.includes(e.id) && ((e.enabled = i), e.commit())
          }),
          this.unselectObjectPin(),
          this.unselectObjectSearchResult())
      }),
      (this.toggleObjectTagEnabled = async e => {
        const { id: t, enabled: i } = e,
          n = this.data.getObjectTag(t)
        if (!n) throw new Error("Object tag not found!")
        if (n.enabled === i) return
        ;(await this.store.toggleEnabled(t, i)) && ((n.enabled = i), n.commit(), this.unselectObjectPin(t), this.unselectObjectSearchResult(t))
      }),
      (this.deleteTags = async e => {
        const { ids: t } = e
        if (0 === t.length) return
        const i = this.annotationsViewData.billboardAnnotation
        ;(null == i ? void 0 : i.annotationType) === AnnotationType.OBJECT &&
          this.engine.commandBinder.issueCommand(new AnnotationCloseCommand(i.id, i.annotationType))
        for (const e of t) {
          if (!(await this.store.deleteObjectAnnotation(e))) throw new Error("Could not delete Object Annotation")
          {
            this.data.removeObjectTag(e)
            const t = this.data.getObjectTag(e)
            t && t.mattertagId && (await this.engine.commandBinder.issueCommand(new TagDeleteCommand(t.mattertagId, "search_menu_object_tag")))
          }
        }
      }),
      (this.createObjectTag = async e => {
        const { id: t, options: i, pendingAttachments: n, embed: s } = e,
          r = new ObjectTagObject(),
          d = null == i ? void 0 : i.color,
          c = d ? `#${new Color(d.r, DataType, d.b).getHexString()}` : "#ffffff"
        if (
          ((r.label = i.label || ""),
          (r.floorId = i.floorId || ""),
          (r.keywords = i.keywords || []),
          (r.stemDirection = i.normal || new Vector3()),
          (r.stemLength = i.stemHeight ? Math.max(i.stemHeight, z) : z),
          (r.position = i.position || new Vector3()),
          (r.color = c),
          (r.layerId = this.layersData.activeLayerId),
          await this.modifyInsideSaveCommand(async () => {
            this.createdTag = await this.store.createObjectTag(r)
          })(),
          !this.createdTag)
        )
          return
        const l = this.createdTag.id,
          { commandBinder: m } = this.engine
        ;(i.objectAnnotationId = l),
          await m.issueCommand(new TagSaveCommand(t, i, n, void 0, s)),
          (this.createdTag.mattertagId = t),
          this.data.updateObjectTag(this.createdTag)
        const p = this.getPinUpdate(this.createdTag)
        ;(this.createdTag = null),
          m.issueCommand(new UpdatePinCommand(l, PinType.OBJECT, p)),
          await m.issueCommand(new CloseToolCommand(ToolsList.TAGS)),
          m.issueCommand(new LockViewmodeCommand()),
          await m.issueCommand(new OpenToolCommand(ToolsList.LAYERS)),
          m.issueCommand(new UnlockViewmodeCommand()),
          m.issueCommand(new SelectSearchResultCommand(l, searchModeType.OBJECTANNOTATION)),
          await m.issueCommand(new NavigateToTagSuggestionCommand(l))
      }),
      (this.dockObjectTag = async e => {
        const { id: t } = e,
          i = this.data.getObjectTag(t)
        if (!i) return
        const { commandBinder: n } = this.engine
        if (!i.mattertagId) {
          const e = i.getMattertagOptions(),
            t = randomString(11)
          n.issueCommand(new MattertagNewSaveCommand(t, e)), (i.mattertagId = t)
        }
        n.issueCommand(new TagOpenCommand(i.mattertagId, { dock: !0, objectTag: !0 }))
      })
  }
  async init(e, t) {
    super.init(e, t),
      (this.engine = t),
      ([this.locale, this.pinsViewData, this.annotationsViewData, this.mattertagsData, this.layersData, this.appData] = await Promise.all([
        t.getModuleBySymbol(LocaleSymbol),
        t.market.waitForData(PinsViewData),
        t.market.waitForData(AnnotationsViewData),
        t.market.waitForData(TagData),
        t.market.waitForData(LayersData),
        // t.market.waitForData(SearchData),
        t.market.waitForData(AppData)
      ])),
      (this.store = new Q({ context: this.layersData.mdsContext, readonly: !1, baseUrl: e.baseUrl }, this.locale, e.minConfidence)),
      this.engine.commandBinder.issueCommand(new ChangePinTypeVisibilityCommand(PinType.OBJECT, !1)),
      (this.data = new ObjectTagsData()),
      this.store.onNewData(this.loadNewData.bind(this))
    const { commandBinder: i } = this.engine
    this.bindings.push(
      i.addBinding(ObjectsAnnotationsEnabledCommand, this.toggleObjectAnnotations),
      i.addBinding(FilterTagSuggestionCommand, async e => this.filterObjectTagSuggestions(e.ids)),
      i.addBinding(NavigateToTagSuggestionCommand, async ({ id: e }) => this.navigateToSuggestion(e)),
      i.addBinding(ToggleObjectTagEnabledCommand, this.modifyInsideSaveCommand(this.setAllObjectTagsEnabled)),
      i.addBinding(ToggleObjectEnabledCommand, this.modifyInsideSaveCommand(this.toggleObjectTagEnabled)),
      i.addBinding(DismissObjectTagCommand, this.modifyInsideSaveCommand(this.deleteTags)),
      i.addBinding(CreateObjectTagCommand, this.createObjectTag),
      i.addBinding(DockObjectTagCommand, async e => this.dockObjectTag(e)),
      this.appData.onChanged(() => this.displayObjects()),
      this.layersData.onCurrentLayersChanged(this.onLayersChanged),
      // this.searchData.onPropertyChanged("activeItemId", this.selectedItemChanged),
      this.pinsViewData.onSelectedPinChanged(this.onPinSelectionChange),
      this.pinsViewData.onFocusedPinChanged(() => this.onPinFocusChange()),
      this.data.onChanged(() => this.displayObjects()),
      this.data.collection.onElementChanged({
        onAdded: this.updatePin.bind(this),
        onUpdated: this.updatePin.bind(this),
        onRemoved: this.removePin.bind(this)
      })
    ),
      await this.store.refresh(),
      this.engine.market.register(this, ObjectTagsData, this.data),
      this.registerRoomAssociationSource(t),
      (async function (e, t, i, n) {
        const s = await e.market.waitForData(AppData)
        let a = s.application === AppMode.WORKSHOP
        const r = (s, o, r, c = []) => {
            const l = []
            return (
              t.iterate(t => {
                if (!(a || (t.visible && n.layerToggled(t.layerId)))) return
                const r = [t.displayLabel, t.displayCategory],
                  d = [...t.keywords],
                  h = t.mattertagId ? i.getTag(t.mattertagId) : void 0
                h && ((r.length = 0), (d.length = 0), r.push(h.label, h.description), d.push(...h.keywords))
                const u = r.filter(e => !!e)
                let m = s(...u)
                m && c.length > 0 && (m = d.length > 0 && d.some(e => c.includes(e))), m && l.push(new x(e.commandBinder, n, o, t, h))
              }),
              e.commandBinder.issueCommand(new FilterTagSuggestionCommand(l.map(e => e.id))),
              d(l),
              l
            )
          },
          d = e => {
            e.sort((e, t) => {
              var i
              const n = e,
                s = t,
                a = null === (i = n.description) || void 0 === i ? void 0 : i.localeCompare(s.description)
              return 0 !== a ? a : n.title.localeCompare(s.title)
            })
          },
          c = t => {
            e.commandBinder.issueCommand(new ObjectsAnnotationsEnabledCommand(!!t))
          },
          l = () => {
            let e = []
            return (
              t.iterate(t => {
                t.visible && t.keywords.length && !t.mattertagId && (e = e.concat(t.keywords))
              }),
              e
            )
          },
          h = e => new AggregateSubscription(t.onChanged(e), i.onChanged(e)),
          u = () => {
            e.commandBinder.issueCommandWhenBound(
              new SearchGroupRegisterCommand({
                id: searchModeType.OBJECTANNOTATION,
                groupPhraseKey: "WORKSHOP.OBJECT_TAG_SUGGESTION.SEARCH_GROUP_HEADER",
                getSimpleMatches: r,
                registerChangeObserver: h,
                onSearchActivatedChanged: c,
                getKeywords: l,
                groupOrder: 90,
                groupIcon: "snap",
                groupActionsFC: B,
                itemActionsFC: R,
                batchSupported: !0
              })
            )
          },
          m = () => {
            e.commandBinder.issueCommandWhenBound(new SearchGroupDeregisterCommand(searchModeType.OBJECTANNOTATION))
          },
          p = { renew: u, cancel: m },
          g = e => {
            ;(a = e === AppMode.WORKSHOP), m(), u()
          },
          y = s.onPropertyChanged("application", g)
        return g(s.application), new AggregateSubscription(p, y)
      })(t, this.data, this.mattertagsData, this.layersData).then(e => this.bindings.push(e))
  }
  loadNewData(e) {
    this.data.atomic(() => {
      this.layersData.replaceBackendLayers(this.data.collection, e || {})
    })
  }
  dispose(e) {
    super.dispose(e), this.data && e.market.unregister(this, ObjectTagsData)
  }
  modifyInsideSaveCommand(e) {
    return async (...t) => {
      await this.engine.commandBinder.issueCommand(
        new SaveCommand({ dataTypes: [DataType.OBJECT_ANNOTATIONS], onCallback: () => e(...t), skipDirtyUpdate: !0 })
      )
    }
  }
  displayObjects() {
    const e = []
    this.data.collection.values.forEach(t => {
      e.push(this.getPinUpdate(t))
    }),
      this.engine.commandBinder.issueCommand(new UpdatePinViewsCommand(e))
  }
  removePin(e) {
    this.engine.commandBinder.issueCommand(new RemovePinCommand(e.id, PinType.OBJECT))
  }
  updatePin(e) {
    const t = this.getPinUpdate(e)
    this.engine.commandBinder.issueCommand(new UpdatePinViewsCommand([t]))
  }
  getPinUpdate(e) {
    const t = this.mattertagsData.getTag(e.mattertagId || ""),
      i = e.getPin(t)
    return Object.assign(
      {
        id: e.id,
        pinType: PinType.OBJECT,
        backgroundTexture: he,
        visible: this.getObjectVisibility(e.id, e.layerId, e.visible),
        scale: new Vector3(0.75, 0.75, 0.75)
      },
      i
    )
  }
  getObjectVisibility(e, t, i) {
    if (!this.visibilityEnabled) return !1
    const { activeItemId: n, selectedType: s } = this.searchData
    const a = this.appData.application === AppMode.WORKSHOP || this.layersData.layerToggled(t),
      r = this.layersData.layerVisible(t),
      d = this.idVisibility.has(e)
    //pw
    // c = n === e && s === searchModeType.OBJECTANNOTATION
    // return a && (c || (i && d && r))
    return a && i && d && r
  }
  async filterObjectTagSuggestions(e) {
    this.idVisibility.clear(), e.forEach(e => this.idVisibility.add(e)), this.displayObjects()
  }
  async navigateToSuggestion(e) {
    const t = this.data.getObjectTag(e)
    if (!t) return
    const i = {
      anchorPosition: t.position.clone(),
      stemNormal: t.stemDirection.clone(),
      stemLength: t.stemLength,
      stemEnabled: !0,
      color: "",
      floorId: t.floorId,
      roomId: t.roomId
    }
    await this.engine.commandBinder.issueCommand(new FocusOnPinInsideCommand({ pinPosition: i, transition: TransitionTypeList.FadeToBlack })),
      this.engine.commandBinder.issueCommand(new SelectPinCommand(e, PinType.OBJECT, !1))
  }
  unselectObjectPin(e) {
    const { selectedPinId: t } = this.pinsViewData
    if (t) {
      const i = this.pinsViewData.getPin(t)
      i && (i.pinType !== PinType.OBJECT || (e && e !== t) || this.engine.commandBinder.issueCommand(new UnselectPinCommand(t, PinType.OBJECT)))
    }
  }
  unselectObjectSearchResult(e) {
    // const { selectedType: t, activeItemId: i } = this.searchData
    // i && t === searchModeType.OBJECTANNOTATION && ((e && e !== i) || this.engine.commandBinder.issueCommand(new SelectSearchResultCommand(null)))
  }
  registerRoomAssociationSource(e) {
    const t = this.data
    e.commandBinder.issueCommandWhenBound(
      new RegisterRoomAssociationSourceCommand({
        type: "objectAnnotations",
        getPositionId: function* () {
          for (const e of t.collection.values) yield e
        },
        updateRoomForId: (e, i) => {
          const n = t.getObjectTag(e)
          if (!n) throw new Error("Invalid object detection id!")
          n.roomId = i || void 0
        }
      })
    )
  }
}
