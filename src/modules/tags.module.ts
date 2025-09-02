import Me from "classnames"
import * as De from "react"
import * as Ee from "react/jsx-runtime"
import { Color, Texture } from "three"
import * as ze from "../other/11866"
import * as Pe from "../other/15501"
import * as I from "../other/19280"
import * as le from "../other/21149"
import * as Ke from "../other/31457"
import * as Fe from "../other/33338"
import * as Ie from "../other/38490"
import * as Ge from "../other/39496"
import * as Se from "../other/40216"
import * as Je from "../other/44810"
import { useData } from "../other/45755"
import * as Te from "../other/51397"
import * as Ve from "../other/51978"
import { TextParser } from "../other/52528"
import * as qe from "../other/53001"
import * as ke from "../other/56843"
import * as Ae from "../other/65428"
import * as We from "../other/6608"
import * as Be from "../other/71330"
import * as Re from "../other/72252"
import * as Ue from "../other/72475"
import * as He from "../other/78197"
import * as _e from "../other/84426"
import {
  AnnotationCloseCommand,
  AnnotationDockCommand,
  AnnotationPreviewCommand,
  AnnotationSelectCommand,
  AnnotationsCloseAllCommand
} from "../command/annotation.command"
import { AttachmentsResetDataCommand, CancelAttachmentChangesCommand, ToggleViewAttachmentsCommand } from "../command/attachment.command"
import { DeleteMattertagCommand, MattertagNewSaveCommand, MattertagSaveCommand } from "../command/mattertag.command"
import { FocusOnPinInsideCommand } from "../command/navigation.command"
import { OrderedListNamedSaveCommand } from "../command/orderedList.command"
import {
  ChangePinTypeVisibilityCommand,
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
  UpdatePinCommand,
  UpdatePinViewsCommand
} from "../command/pin.command"
import { SaveCommand } from "../command/save.command"
import { SearchGroupDeregisterCommand, SearchGroupRegisterCommand } from "../command/searchQuery.command"
import {
  FilterVisibleTagsCommand,
  RegisterTagsToolCommand,
  SetEmbedErrorIdCommand,
  SetReorderingModeCommand,
  TagCancelEditsCommand,
  TagCloseCommand,
  TagDeleteCommand,
  TagDirtyToggleCommand,
  TagEditCommand,
  TagOpenCommand,
  TagOrderBySetCommand,
  TagOrderSaveCommand,
  TagSaveCommand,
  TagStartAddCommand,
  TagUpdateOpenTagviewCommand,
  TagVisibilityToggleCommand,
  TagsToggleCommand,
  TagsVisibilityFilterEnabledCommand
} from "../command/tag.command"
import {
  CloseToolCommand,
  OpenPreviousToolCommand,
  OpenToolCommand,
  RegisterToolsCommand,
  ToolBottomPanelCollapseCommand,
  ToolPanelToggleCollapseCommand
} from "../command/tool.command"
import { CloseModalCommand } from "../command/ui.command"
import { TagOrderBy, TagsMode } from "../const/12150"
import { OrderedListEntryType } from "../const/24102"
import { TAG_ORDERED_LIST_NAME } from "../const/25561"
import * as L from "../const/48945"
import { FeaturesTagIconsKey, TagBillboardShareKey } from "../const/48945"
import { PinType } from "../const/62612"
import { TransitionTypeList } from "../const/64918"
import * as Oe from "../const/73536"
import { DataType } from "../const/79728"
import { AnnotationType } from "../const/annotationType.const"
import { PhraseKey } from "../const/phrase.const"
import { presentationMlsModeKey } from "../const/settings.const"
import { DeepLinksSymbol, LocaleSymbol, TagsSymbol } from "../const/symbol.const"
import { featuresMattertagsKey } from "../const/tag.const"
import { ToolPanelLayout, ToolsList } from "../const/tools.const"
import { searchModeType } from "../const/typeString.const"
import { AppReactContext } from "../context/app.context"
import { CommandBinder } from "../core/commandBinder"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { ISubscription } from "../core/subscription"
import { AnnotationsViewData } from "../data/annotations.view.data"
import { AppData, AppMode } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { CamStartData } from "../data/camstart.data"
import { ContainerData } from "../data/container.data"
import { FloorsData } from "../data/floors.data"
import { FloorsViewData } from "../data/floors.view.data"
import { LayersData } from "../data/layers.data"
import { OrderedListData } from "../data/ordered.list.data"
import { PinsViewData } from "../data/pins.view.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { TagData } from "../data/tag.data"
import { TagsViewData } from "../data/tags.view.data"
import { ToolsData } from "../data/tools.data"
import { ViewmodeData } from "../data/viewmode.data"
import { LoadTexture } from "../utils/loadTexture"
import { AnnotationAttachmentClickedMessage } from "../message/annotation.message"
import { InteractionModeChangedMessage } from "../message/interaction.message"
import { ModelViewChangeCompleteMessage } from "../message/layer.message"
import { MattertagMovedMessage, MattertagRemoveMessage } from "../message/mattertag.message"
import { ToggleViewingControlsMessage } from "../message/panel.message"
import { PinAddCancelledMessage, PinMovedMessage, PinPlacedMessage } from "../message/pin.message"
import { SweepDataMessage } from "../message/sweep.message"
import { MattertagViewMessage, TagClosedMessage, TagOpenedMessage } from "../message/tag.message"
import { TagObject } from "../object/tag.object"
import { ToolObject } from "../object/tool.object"
import { BaseParser } from "../parser/baseParser"
import { DescriptionParser } from "../parser/description.parser"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { TagToolManger } from "../tagtoolmanger"
import { getDayTag } from "../utils/date.utils"
import { randomString } from "../utils/func.utils"
import { getValFromURL } from "../utils/urlParams.utils"
import { deepCopy } from "../utils/commo.utils"
declare global {
  interface SymbolModule {
    [TagsSymbol]: TagsModule
  }
}

import { getIconKey } from "../other/39689"
import h from "../images/tagColor.png"

class TagParser extends BaseParser {
  containerData: ContainerData
  tag: ReturnType<TagsViewData["createTagView"]>
  tagIconsEnabled: boolean
  defaultTagLabel: string
  title: string
  description: string
  icon: string
  color: string
  constructor(e: CommandBinder, t: LayersData, i, s: ContainerData, a: ReturnType<TagsViewData["createTagView"]>, o, d, c) {
    super(e, t, i)
    this.containerData = s
    this.tag = a
    this.tagIconsEnabled = d
    this.defaultTagLabel = c
    this.id = this.tag.id
    this.title = this.tag.label || this.textParser.getPlainText(this.tag.description) || this.defaultTagLabel
    this.description = this.tag.label ? this.textParser.getPlainText(this.tag.description) : ""
    this.icon = `icon-${getIconKey(PinType.MATTERTAG, this.tag.icon, this.tagIconsEnabled)}`

    this.typeId = searchModeType.MATTERTAG
    this.floorId = this.tag.floorId
    this.roomId = this.tag.roomId || ""
    this.layerId = this.tag.layerId
    this.dateBucket = getDayTag(this.tag.created)
    this.color = (e => {
      const t = new Color(e)
      return `rgb(${255 * t.r}, ${255 * t.g}, ${255 * t.b})`
    })(this.tag.color)
    this.enabled = this.tag.enabled
    this.onSelect = async () => {
      await this.commandBinder.issueCommand(new AnnotationsCloseAllCommand())
      await this.commandBinder.issueCommand(new FocusOnPinInsideCommand({ pinPosition: this.tag, transition: TransitionTypeList.FadeToBlack }))
      ;(0, I.p)(this.containerData.size)
        ? this.commandBinder.issueCommand(new AnnotationDockCommand(this.id, AnnotationType.TAG))
        : this.commandBinder.issueCommand(new AnnotationSelectCommand(this.id, AnnotationType.TAG))
    }
    this.textParser = o
  }
  supportsLayeredCopyMove() {
    return !0
  }
  supportsBatchDelete() {
    return !0
  }
}
const { TAGS } = PhraseKey.SHOWCASE
const textParser = new TextParser({ links: !0 })
const F = "0" === getValFromURL("mt")
function tagInit(e: CommandBinder, t: TagData, i: TagsViewData, n: LayersData, s: ContainerData, a: SettingsData, o: AppData, d: string) {
  let c = o.application === AppMode.WORKSHOP
  const l = a.tryGetProperty(FeaturesTagIconsKey, !1)
  const getSimpleMatches = (t, a, o, r: any[] = []) => {
    const h: TagParser[] = []
    ;(i.tagOrder === TagOrderBy.ALPHABETICAL ? i.getAlphabeticTagViewMapFilter().values : i.getOrderedTagViewMapFilter().values).forEach(i => {
      if (!(c || (i.enabled && n.layerToggled(i.layerId)))) return
      if (i.objectAnnotationId) return
      let o = t(i.label, textParser.getPlainText(i.description))
      o && r.length > 0 && (o = i.keywords.length > 0 && i.keywords.some(e => r.includes(e))), o && h.push(new TagParser(e, n, a, s, i, textParser, l, d))
    })
    e.issueCommand(new FilterVisibleTagsCommand(h.map(e => e.id)))
    return h
  }
  const onSearchActivatedChanged = t => {
    e.issueCommand(new TagsVisibilityFilterEnabledCommand(!!t))
  }
  const registerChangeObserver = e => new AggregateSubscription(i.getOrderedTagViewMapFilter().onChanged(e), i.onPropertyChanged("tagOrder", e))
  const p = {
    renew: () => {
      e.issueCommandWhenBound(
        new SearchGroupRegisterCommand({
          id: searchModeType.MATTERTAG,
          groupPhraseKey: TAGS.SEARCH_GROUP_HEADER,
          getSimpleMatches,
          registerChangeObserver,
          onSearchActivatedChanged,
          getKeywords: t.getTagKeywords.bind(t),
          groupOrder: 20,
          groupIcon: "toolbar-mattertags",
          batchSupported: !0
        })
      )
    },
    cancel: () => {
      e.issueCommandWhenBound(new SearchGroupDeregisterCommand(searchModeType.MATTERTAG))
    }
  }
  const applicationChange = e => {
    c = e === AppMode.WORKSHOP
    !F || c ? p.renew() : p.cancel()
  }
  const v = o.onPropertyChanged("application", applicationChange)
  applicationChange(o.application)
  return new AggregateSubscription(p, v)
}
function $e() {
  const { commandBinder: e } = (0, De.useContext)(AppReactContext),
    t = (0, Be.P)(),
    i = (0, Fe.L)(),
    n = useData(TagData),
    s = useData(TagsViewData),
    a = useData(AnnotationsViewData),
    [o, r] = (0, De.useState)(null),
    [d, c] = (0, De.useState)(!0),
    l = (0, Ve.y)(TagBillboardShareKey, !0),
    h = (0, Ve.y)(presentationMlsModeKey, !1),
    u = (0, Ve.y)(FeaturesTagIconsKey, !1)
  ;(0, De.useEffect)(() => {
    if (!(n && s && t && (null == n ? void 0 : n.getTag(t.id)))) return
    const e = n.getTag(t.id)
    function i(e) {
      const t = null == a ? void 0 : a.getCapabilities(e)
      return t && c(t.share), t
    }
    r(Object.assign({}, t))
    const o = i(t.id),
      d = null == o ? void 0 : o.onChanged(() => i(t.id)),
      l = e.onChanged(() => {
        const e = s.getTagView(t.id)
        r(e ? Object.assign({}, e) : null)
      })
    return () => {
      l.cancel(), null == d || d.cancel()
    }
  }, [a, t, n, s])
  const m = t => {
    e.issueCommand(new ToggleViewAttachmentsCommand(!0, f, t))
  }
  if (!o) return null
  const { id: p, description: g, label: y, attachments: f, keywords: w, icon: b, color: T } = o,
    C = new TextParser({ links: !0 }),
    E = (0, le.Ug)(f),
    D = (0, le.ae)(f),
    x = E.length > 0,
    A = d && l
  return (0, Ee.jsxs)(
    "div",
    Object.assign(
      { className: Me("tag-view-panel", { "viewable-media": x }) },
      {
        children: [
          x &&
            !h &&
            (0, Ee.jsx)(Ue.v, {
              attachments: E,
              onClick: (e, t) => {
                m(t)
              }
            }),
          (0, Ee.jsxs)(
            "div",
            Object.assign(
              { className: Me("tag-view-panel-header", { "no-media": h || !x }) },
              {
                children: [
                  (0, Ee.jsx)(We.C, { badgeStyle: { background: T }, iconClass: `icon-${getIconKey(PinType.MATTERTAG, b, u)}` }),
                  (0, Ee.jsxs)(
                    "div",
                    Object.assign(
                      { className: "tag-view-panel-header-contents" },
                      {
                        children: [
                          (0, Ee.jsxs)(
                            "div",
                            Object.assign(
                              { className: "tag-view-panel-top" },
                              {
                                children: [
                                  y && (0, Ee.jsx)("div", Object.assign({ className: "tag-view-panel-title" }, { children: y })),
                                  (void 0 === A || A) &&
                                    (0, Ee.jsx)(
                                      ze.O,
                                      {
                                        prefix: "tag",
                                        pin: o,
                                        id: o.id,
                                        darkTheme: !1,
                                        includeCameraView: !0,
                                        analyticAction: "tags_copy_share_link",
                                        buttonVariant: _e.Wu.TERTIARY
                                      },
                                      o.id
                                    )
                                ]
                              }
                            )
                          ),
                          w && (0, Ee.jsx)(He.s, { className: "tag-view-panel-keywords", keywords: w, maxVisible: 5 }),
                          (0, Ee.jsx)(Ge.e, {
                            text: g,
                            textParser: C,
                            linkHandler: i,
                            annotationType: AnnotationType.TAG,
                            annotationId: p,
                            attachments: [],
                            onViewAttachment: m
                          })
                        ]
                      }
                    )
                  )
                ]
              }
            )
          ),
          D.length > 0 &&
            (0, Ee.jsxs)(
              "div",
              Object.assign(
                { className: "tag-view-panel-attachments" },
                { children: [(0, Ee.jsx)("h4", { children: "Attachments" }), (0, Ee.jsx)(Re.s, { annotationType: AnnotationType.TAG, attachments: D })] }
              )
            )
        ]
      }
    )
  )
}
function Ye() {
  const e = (0, Ae.A)(),
    t = (0, Se.T)(),
    i = (0, Pe.R)(),
    n = (0, Ve.y)(L.ek, "1"),
    { commandBinder: s, locale: a } = (0, De.useContext)(AppReactContext),
    o = e && (e === ToolsList.SEARCH || e === ToolsList.LAYERS),
    r = () => {
      o
        ? s.issueCommand(new OpenPreviousToolCommand()).then(() => {
            s.issueCommand(new ToolBottomPanelCollapseCommand(!1))
          })
        : s.issueCommand(new CloseToolCommand(ToolsList.TAGS))
    },
    d = e ? "back" : "close",
    c = a.t(o ? TAGS.NAV_BACK_LABEL : TAGS.CLOSE_TAG_LABEL),
    l = t === ToolPanelLayout.BOTTOM_PANEL,
    h = i && i !== Oe.P.CONFIRM,
    u = !l || !h
  return (0, Ee.jsxs)(
    ke.J,
    Object.assign(
      { className: "tags-panel", open: u, scrollingDisabled: !1, onClose: r },
      {
        children: [
          (0, Ee.jsxs)(
            "div",
            Object.assign(
              { className: "detail-panel-header" },
              { children: [(0, Ee.jsx)(Ie.P, { icon: d, label: c, onClose: r }), n && (0, Ee.jsx)(Ke.O, { analyticAction: "tags_navigate_in_panel" })] }
            )
          ),
          (0, Ee.jsx)($e, {})
        ]
      }
    )
  )
}
class ToolUI {
  renderPanel: () => De.ReactElement<any, string | De.JSXElementConstructor<any>>
  constructor() {
    this.renderPanel = () => (0, Ee.jsx)(Ye, {})
  }
  renderPersistentOverlay() {
    return (0, Ee.jsxs)("div", { children: [(0, Ee.jsx)(Je.w, { parentTool: ToolsList.TAGS }), (0, Ee.jsx)(qe.r, {})] }, "tags-panel-ui")
  }
}
export default class TagsModule extends Module {
  opening: null | string
  activated: boolean
  registered: boolean
  activeBindings: ISubscription[]
  updatePerSettings: () => void
  settingsData: SettingsData
  engine: EngineContext
  registerTagsTool: () => Promise<void>
  tagsToolToggled: (e: any) => Promise<void>
  updateViewingControls: () => void
  viewData: TagsViewData
  toolsData: ToolsData
  onCloseTag: () => Promise<void>
  pinAddCancelled: (e: any) => void
  cancelTagEdits: () => Promise<void>
  tagsWereChanged: () => void
  onTagRemoved: (e: any) => void
  handleModelViewChange: () => void
  tagsData: TagData
  onLayersChanged: () => void
  onOpenTagViewChanged: () => void
  startTagCreation: (info: any) => Promise<string>
  floorsViewData: FloorsViewData
  layersData: LayersData
  saveTag: (e: TagSaveCommand["payload"]) => Promise<void>
  saveTagVisibility: (e: any) => Promise<any>
  onDeleteTag: (e: any) => Promise<void>
  onEditTag: (e: any) => Promise<void>
  updateOpenTagView: (e: any) => Promise<void>
  onSaveCustomTagOrder: (e: any) => Promise<void>
  setEmbedErrorTagId: (e: any) => Promise<void>
  pinMoved: (e: any) => void
  isDocking: () => void
  refreshTagViews: (e?: any) => void
  cameraData: CameraData
  pinPlaced: (e: any) => void
  handlePinFocusChange: () => Promise<void>
  pinsViewData: PinsViewData
  annotationsViewData: AnnotationsViewData
  handlePinSelectionChange: () => Promise<void>
  appData: AppData
  containerData: ContainerData
  handleAnnotationsChanged: () => Promise<void>
  handleViewingAttachment: (e: any) => undefined
  onOpenTag: (e: any) => Promise<void>
  filterVisibleTags: (e: any) => Promise<void>
  tagVisbilityFilterEnabled: (e: any) => Promise<void>
  setTagOrderBy: (e) => Promise<void>
  setTagsMode: (e) => Promise<void>
  cancelTagCreation: (e: boolean) => void
  sweepData: SweepsData
  viewmodeData: ViewmodeData
  orderedListData: OrderedListData
  backgroundTexture: Texture
  descriptionParser: DescriptionParser
  constructor() {
    super(...arguments)
    this.name = "tags-module"
    this.opening = null
    this.activated = !1
    this.registered = !1
    this.activeBindings = []
    this.updatePerSettings = () => {
      const e = this.settingsData.tryGetProperty(featuresMattertagsKey, !1)
      const t = !this.in360View() && e
      this.engine.commandBinder.issueCommand(new ChangePinTypeVisibilityCommand(PinType.MATTERTAG, t))
      t || this.closeTagBillboard()
    }
    this.registerTagsTool = async () => {
      const e = new ToolObject({
        id: ToolsList.TAGS,
        namePhraseKey: PhraseKey.TOOLS.TAGS,
        deepLinkParam: "tag",
        panel: !0,
        icon: "icon-toolbar-mattertags",
        analytic: "tags",
        dimmed: !1,
        enabled: !0,
        hidesAppBar: !0,
        ui: new ToolUI(),
        manager: new TagToolManger(this.engine, this.settingsData)
      })
      this.engine.commandBinder.issueCommand(new RegisterToolsCommand([e]))
    }
    this.tagsToolToggled = async e => {
      e.opened ? this.activateTool() : this.deactivateTool()
    }
    this.updateViewingControls = () => {
      const { openTagView: e } = this.viewData,
        t = this.toolsData.toolPanelLayout === ToolPanelLayout.BOTTOM_PANEL,
        i = !this.activated || (!t && !e)
      this.engine.broadcast(new ToggleViewingControlsMessage(i))
    }
    this.onCloseTag = async () => {
      this.closeTag()
    }
    this.pinAddCancelled = e => {
      e.pinType === PinType.MATTERTAG && this.cancelTagCreation(!1)
    }
    this.cancelTagEdits = async () => {
      this.viewData.creatingTag ? this.cancelTagCreation(!0) : this.closeTag()
    }
    this.cancelTagCreation = e => {
      var t
      const i = this.viewData,
        n = null === (t = i.openTagView) || void 0 === t ? void 0 : t.id
      this.cancelAttachmentChanges(),
        i.setOpenTagView(null),
        (i.creatingTag = !1),
        (i.openTagIsDirty = !1),
        i.commit(),
        n &&
          (e && this.engine.commandBinder.issueCommand(new PinCreationCancelCommand(n, PinType.MATTERTAG)),
          this.engine.commandBinder.issueCommand(new AnnotationCloseCommand(n, AnnotationType.TAG)))
    }
    this.tagsWereChanged = () => {
      this.refreshTagViews()
      this.displayTags()
    }
    this.refreshTagViews = () => {
      this.viewData.refreshTagViews(this.getCustomTagOrder())
    }
    this.onTagRemoved = e => {
      const t = e.objectAnnotationId ? PinType.OBJECT : PinType.MATTERTAG
      this.engine.commandBinder.issueCommand(new RemovePinCommand(e.sid, t))
    }
    this.handleModelViewChange = () => {
      if (this.viewData.openTagView) {
        if (this.viewData.creatingTag) this.cancelTagCreation(!0)
        else {
          this.tagsData.getTag(this.viewData.openTagView.id) || this.closeTag()
        }
      }
    }
    this.onLayersChanged = () => {
      this.closeTagBillboard(), this.displayTags()
    }
    this.onOpenTagViewChanged = () => {
      const e = this.viewData.openTagView
      e && this.updateTagPin(e)
    }
    this.startTagCreation = async createInfo => {
      const e = this.viewData
      e.setTagsMode(TagsMode.DEFAULT)
      await this.closeTag()
      let t = randomString(11)
      for (; this.tagsData.getTag(t); ) t = randomString(11)
      const i = new TagObject(createInfo)
      i.sid = t
      i.floorId = this.floorsViewData.getHighestVisibleFloor().id
      i.layerId = this.layersData.activeLayerId
      const n = e.createTagView(i)
      e.creatingTag = !0
      e.commit()
      e.setOpenTagView(n)

      this.engine.commandBinder.issueCommand(new CreatePinCommand(n.id, this.getPinUpdate(n), PinType.MATTERTAG, n.backgroundTexture))
      return t
    }
    this.saveTag = async e => {
      const { id: t, properties: i, pendingAttachments: n, removedAttachments: s, embed: a } = e
      const o = this.viewData
      const { openTagView: r, creatingTag: d } = o
      if (!r) return void this.log.debug("No open tag")
      const c = Object.assign({}, r, i)
      this.trackChanges(t, c, a)
      d
        ? ((o.creatingTag = !1), (o.openTagIsDirty = !1), o.commit(), await this.engine.commandBinder.issueCommand(new MattertagNewSaveCommand(t, c, n, a)))
        : await this.engine.commandBinder.issueCommand(new MattertagSaveCommand(t, c, n, s, a)),
        c.objectAnnotationId || this.selectPin(t, !0)
      await this.engine.commandBinder.issueCommand(new AttachmentsResetDataCommand())
      this.closeTag()
    }
    this.saveTagVisibility = async e => {
      const { id: t, visible: i } = e,
        n = this.tagsData.getTag(t)
      if (!n) throw new Error("Tag not found!")
      this.engine.commandBinder.issueCommand(new ChangePinVisibilityCommand(t, PinType.MATTERTAG, this.getTagVisibility(t, n.layerId, i)))
      const s = { enabled: i }
      return this.trackChanges(t, s), i || this.closeTag(), this.engine.commandBinder.issueCommand(new MattertagSaveCommand(t, s))
    }
    this.onDeleteTag = async e => {
      const t = e.id
      this.tagsData.getTag(t)
        ? (this.toggleTagDirty(!1),
          this.engine.commandBinder.issueCommand(new CloseModalCommand()),
          this.engine.broadcast(new MattertagRemoveMessage(t, e.removalMethod)),
          this.engine.commandBinder.issueCommand(new DeleteMattertagCommand(t)).then(() => {
            this.saveTags().then(() => {
              this.engine.commandBinder.issueCommand(new RemovePinCommand(t, PinType.MATTERTAG))
              const e = this.viewData.openTagView
              e && e.id === t && this.closeTag()
            })
          }),
          this.engine.commandBinder.issueCommand(new AttachmentsResetDataCommand()))
        : this.log.debug("Cannot delete a non-existent tag")
    }
    this.onEditTag = async e => {
      const { tagId: t } = e
      this.tagsData.getTag(t)
        ? (await this.engine.commandBinder.issueCommand(new AttachmentsResetDataCommand()),
          await this.openTag(t, TransitionTypeList.FadeToBlack, !0, !0),
          this.openAnnotation(t, !0),
          this.selectPin(t, !0))
        : this.log.debug("Cannot edit a non-existent tag")
    }
    this.updateOpenTagView = async e => {
      const { updates: t } = e
      const i = this.viewData.openTagView
      console.log(i)
      if (i) {
        this.viewData.setOpenTagView(Object.assign(Object.assign({}, i), t))
        const e = i.objectAnnotationId || i.id,
          n = i.objectAnnotationId ? PinType.OBJECT : PinType.MATTERTAG
        await this.engine.commandBinder.issueCommand(new UpdatePinCommand(e, n, t))
      } else this.log.debug("No open tag to update")
    }
    this.onSaveCustomTagOrder = async e => {
      const { ids: t } = e,
        i = t.map(e => ({ id: e, type: OrderedListEntryType.TAG }))
      await this.engine.commandBinder.issueCommand(new OrderedListNamedSaveCommand(TAG_ORDERED_LIST_NAME, i)), this.viewData.refreshTagViews(t)
    }
    this.setEmbedErrorTagId = async e => {
      this.viewData.setEmbedErrorTagId(e.id)
    }
    this.pinMoved = e => {
      const { id: t, pinType: i, pinPos: n, previousPos: s } = e,
        a = this.viewData.openTagView
      if (a && i === PinType.MATTERTAG && t === a.id) {
        if (this.tagsData.getTag(t)) {
          const { anchorPosition: e, stemNormal: i, floorId: a, roomId: o } = n,
            r = { position: e, normal: i, floorId: a, roomId: o }
          this.engine.broadcast(
            new MattertagMovedMessage(t, r.position, r.position.distanceTo(this.cameraData.pose.position), s ? r.position.distanceTo(s.anchorPosition) : 0)
          ),
            this.engine.commandBinder.issueCommand(new MattertagSaveCommand(t, r))
        } else this.log.debug("Cannot move a non-existent tag")
      }
    }
    this.pinPlaced = e => {
      const { openTagView: t } = this.viewData
      t && e.pinType === PinType.MATTERTAG && e.id === t.id && (Object.assign(t, e.pinPos), this.openAnnotation(t.id, !0))
    }
    this.handlePinFocusChange = async () => {
      const { openTagView: e, creatingTag: t } = this.viewData
      if (t) return
      const { commandBinder: i } = this.engine,
        { focusedPin: n, selectedPinId: s } = this.pinsViewData,
        { billboardAnnotation: a } = this.annotationsViewData
      if (!n)
        return void (a && a.annotationType === AnnotationType.TAG && a.id !== s && (await i.issueCommand(new AnnotationCloseCommand(a.id, AnnotationType.TAG))))
      const o = this.getSelectedTag(),
        r = o && (null == o ? void 0 : o.id) === (null == e ? void 0 : e.id),
        d = e && (null == e ? void 0 : e.id) === (null == n ? void 0 : n.id)
      if ((e && r && !d && this.closeTag(), n.pinType === PinType.MATTERTAG)) {
        const t = this.viewData.getTagView(n.id)
        if (!t) return void this.log.debug("Focused pin changed, but no tag view.")
        t.id !== (null == e ? void 0 : e.id) &&
          (i.issueCommand(new AnnotationPreviewCommand(t.id, AnnotationType.TAG)), this.engine.broadcast(new MattertagViewMessage(t.id, Te.V.HOVER)))
      }
    }
    this.handlePinSelectionChange = async () => {
      const { openTagView: e, openTagIsDirty: t } = this.viewData
      const { selectedPinId: i } = this.pinsViewData
      if (t || e?.id === i) return
      const n = i ? this.pinsViewData.getPin(i) : null
      const s = this.appData.application === AppMode.WORKSHOP
      if (e && !n) {
        !s && this.activated ? await this.engine.commandBinder.issueCommand(new CloseToolCommand(ToolsList.TAGS)) : this.closeTag()
      } else if (n && n.pinType === PinType.MATTERTAG) {
        ;(0, I.p)(this.containerData.size) && (await this.engine.commandBinder.issueCommand(new AnnotationDockCommand(n.id, AnnotationType.TAG)))
        const e = this.isTagDocked() || !!this.getSelectedTag()
        const t = s && e
        this.engine.commandBinder.issueCommand(new TogglePinEditingCommand(n.id, t))
        this.engine.broadcast(new MattertagViewMessage(n.id, Te.V.OPEN))
        const i = this.isDocking()
        await this.openTag(n.id, TransitionTypeList.Interpolate, i)
        this.openAnnotation(n.id, i)
      }
    }
    this.isDocking = () => (0, I.p)(this.containerData.size) || (this.activated && this.isTagDocked())
    this.handleAnnotationsChanged = async () => {
      const { openTagView: e, creatingTag: t } = this.viewData
      if (t || this.opening) return
      const i = this.getDockedTag(),
        n = this.getSelectedTag(),
        s = i || n,
        a = !!i,
        { dockedAnnotation: o } = this.annotationsViewData
      if (e && !s && (null == o ? void 0 : o.annotationType) !== AnnotationType.OBJECT) this.closeTag()
      else if (s && s.id !== (null == e ? void 0 : e.id)) {
        this.engine.broadcast(new MattertagViewMessage(s.id, Te.V.OPEN))
        const e = this.appData.application !== AppMode.WORKSHOP || !a
        await this.openTag(s.id, TransitionTypeList.Interpolate, a, e), await this.selectPin(s.id, a)
      }
      a
        ? (this.activated || (await this.engine.commandBinder.issueCommand(new OpenToolCommand(ToolsList.TAGS, !0))), s && (await this.selectPin(s.id, a)))
        : this.activated && this.toolsData.softOpening && (await this.engine.commandBinder.issueCommand(new CloseToolCommand(ToolsList.TAGS)))
    }
    this.handleViewingAttachment = e => {
      const { annotationType: t, id: i, attachmentId: n } = e
      if (t !== AnnotationType.TAG) return
      const s = this.viewData.getTagView(i)
      if (!s) return void this.log.debug("Cannot view attachment for a non-existent tag")
      const a = s.attachments,
        o = a.find(e => e.id === n)
      if (o && (0, le.lV)(o)) {
        const e = a.filter(e => (0, le.lV)(e))
        this.engine.commandBinder.issueCommand(new ToggleViewAttachmentsCommand(!0, e, n))
      }
    }
    this.onOpenTag = async e => {
      const { tagId: t, dock: i, transition: n, objectTag: s, forceOpen: a } = e
      this.toggleTagDirty(!1)
      const o = this.annotationsViewData.getCapabilities(t).dock,
        r = !(!i || !o),
        d = null === i && this.isTagDocked() && o,
        c = r || d || !(!i || !a)
      c && s ? this.dockObjectTag(t) : (await this.openTag(t, n, c), this.openAnnotation(t, c, a), this.selectPin(t, c))
    }
    this.filterVisibleTags = async e => {
      const { idVisibility: t } = this.viewData
      t.clear(), e.ids.forEach(e => t.add(e)), this.viewData.commit(), this.displayTags()
    }
    this.tagVisbilityFilterEnabled = async e => {
      ;(this.viewData.idVisibilityEnabled = e.enabled), this.viewData.commit(), this.displayTags()
    }
    this.setTagOrderBy = async ({ order: e }) => {
      e !== this.viewData.tagOrder && ((this.viewData.tagOrder = e), this.viewData.commit())
    }
    this.setTagsMode = async ({ mode: e }) => {
      e === TagsMode.REORDERING && this.closeTag(), this.viewData.setTagsMode(e)
    }
  }

  async init(e, t: EngineContext) {
    const [i, n, s, r, c, u, m, p, g, b, T, E, D] = await Promise.all([
      t.market.waitForData(CameraData),
      t.market.waitForData(TagData),
      t.market.waitForData(ToolsData),
      t.market.waitForData(SweepsData),
      t.market.waitForData(SettingsData),
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(AnnotationsViewData),
      t.market.waitForData(AppData),
      t.market.waitForData(FloorsViewData),
      t.market.waitForData(OrderedListData),
      t.market.waitForData(LayersData),
      t.market.waitForData(ContainerData),
      t.getModuleBySymbol(LocaleSymbol)
    ])
    const [x, A, S] = await Promise.all([t.market.waitForData(FloorsData), t.market.waitForData(CamStartData), t.getModuleBySymbol(DeepLinksSymbol)])
    this.cameraData = i
    this.tagsData = n
    this.toolsData = s
    this.sweepData = r
    this.settingsData = c
    this.viewmodeData = u
    this.annotationsViewData = m
    this.appData = p
    this.floorsViewData = g
    this.orderedListData = b
    this.layersData = T
    this.containerData = E
    this.engine = t
    this.backgroundTexture = LoadTexture(h)
    this.descriptionParser = new DescriptionParser({ supportLinks: !0, keepLinkLabels: !0 })
    const P = new TextParser({ links: !0, hashtags: !1 })
    const O = this.getCustomTagOrder()
    const I = D.t(PhraseKey.WORKSHOP.MATTERTAGS.DEFAULT_TAG_TITLE)
    this.viewData = new TagsViewData(this.tagsData, x, A, O, P, S, I, this.backgroundTexture, e.objectTagsEnabled)
    this.pinsViewData = await t.market.waitForData(PinsViewData)
    this.bindings.push(
      c.onPropertyChanged(featuresMattertagsKey, this.updatePerSettings),
      t.commandBinder.addBinding(RegisterTagsToolCommand, this.registerTagsTool),
      t.commandBinder.addBinding(TagsToggleCommand, this.tagsToolToggled),
      t.subscribe(AnnotationAttachmentClickedMessage, this.handleViewingAttachment),
      t.subscribe(SweepDataMessage, this.updatePerSettings),
      t.subscribe(InteractionModeChangedMessage, this.updatePerSettings),
      u.makeModeChangeSubscription(this.updatePerSettings),
      t.commandBinder.addBinding(TagCloseCommand, this.onCloseTag),
      t.commandBinder.addBinding(TagOpenCommand, this.onOpenTag),
      t.commandBinder.addBinding(SetReorderingModeCommand, this.setTagsMode),
      t.commandBinder.addBinding(TagOrderBySetCommand, this.setTagOrderBy),
      t.commandBinder.addBinding(TagSaveCommand, this.saveTag),
      t.commandBinder.addBinding(TagDirtyToggleCommand, async e => this.toggleTagDirty(e.dirty)),
      t.commandBinder.addBinding(TagDeleteCommand, this.onDeleteTag),
      t.commandBinder.addBinding(TagVisibilityToggleCommand, this.saveTagVisibility),
      t.commandBinder.addBinding(TagEditCommand, this.onEditTag),
      t.commandBinder.addBinding(TagUpdateOpenTagviewCommand, this.updateOpenTagView),
      t.commandBinder.addBinding(SetEmbedErrorIdCommand, this.setEmbedErrorTagId),
      this.pinsViewData.onSelectedPinChanged(this.handlePinSelectionChange),
      this.pinsViewData.onFocusedPinChanged(this.handlePinFocusChange),
      this.annotationsViewData.onChanged(this.handleAnnotationsChanged),
      this.viewData.onOpenTagViewChanged(this.onOpenTagViewChanged),
      this.orderedListData.onChanged(this.refreshTagViews),
      this.tagsData.onChanged(this.tagsWereChanged),
      this.tagsData.collection.onElementChanged({ onRemoved: this.onTagRemoved }),
      this.appData.onChanged(() => this.displayTags()),
      this.layersData.onCurrentLayersChanged(this.onLayersChanged),
      this.layersData.onPropertyChanged("activeLayerId", () => this.updatePendingTag()),
      t.commandBinder.addBinding(FilterVisibleTagsCommand, this.filterVisibleTags),
      t.commandBinder.addBinding(TagsVisibilityFilterEnabledCommand, this.tagVisbilityFilterEnabled),
      t.subscribe(ModelViewChangeCompleteMessage, this.handleModelViewChange)
    )
    t.market.register(this, TagsViewData, this.viewData)
    this.updatePerSettings()
    this.displayTags()
    const k = tagInit(t.commandBinder, this.tagsData, this.viewData, this.layersData, E, this.settingsData, this.appData, I)
    this.bindings.push(k)
  }
  dispose(e) {
    this.deactivateTool(),
      this.bindings.forEach(e => {
        e.cancel()
      }),
      (this.bindings = []),
      (this.activeBindings = []),
      this.engine.commandBinder.issueCommand(new RemovePinTypeCommand(PinType.MATTERTAG)),
      this.backgroundTexture.dispose(),
      super.dispose(e)
  }
  onUpdate() {}
  activateTool() {
    this.activated ||
      (this.engine.commandBinder.issueCommand(new AnnotationsCloseAllCommand(AnnotationType.TAG)),
      this.engine.commandBinder.issueCommand(new EnablePinCreationCommand(!0)),
      this.registered
        ? this.activeBindings.forEach(e => {
            e.renew()
          })
        : this.registerHandlers(),
      (this.activated = !0),
      this.updateViewingControls())
  }
  deactivateTool() {
    if (!this.activated) return
    this.activated = !1
    const { creatingTag: t, openTagView: i, tagsMode: n } = this.viewData
    n !== TagsMode.DEFAULT && this.viewData.setTagsMode(TagsMode.DEFAULT)
    t ? this.cancelTagCreation(!0) : i && this.closeTag()
    this.engine.commandBinder.issueCommand(new PinSelectionClearCommand())
    this.engine.commandBinder.issueCommand(new EnablePinCreationCommand(!1))
    this.activeBindings.forEach(e => {
      e.cancel()
    })
    this.updateViewingControls()
    // this.engine.commandBinder.issueCommand(new AttachmentsResetDataCommand())
  }
  registerHandlers() {
    const e = this.engine.commandBinder
    this.activeBindings.push(
      this.engine.subscribe(PinPlacedMessage, this.pinPlaced),
      this.engine.subscribe(PinMovedMessage, this.pinMoved),
      this.engine.subscribe(PinAddCancelledMessage, this.pinAddCancelled),
      e.addBinding(TagStartAddCommand, this.startTagCreation),
      e.addBinding(TagCancelEditsCommand, this.cancelTagEdits),
      e.addBinding(TagOrderSaveCommand, this.onSaveCustomTagOrder),
      this.viewData.onOpenTagViewChanged(this.updateViewingControls),
      this.viewData.onPropertyChanged("creatingTag", this.updateViewingControls),
      this.viewData.onPropertyChanged("tagsMode", () => this.displayTags())
    )
    this.registered = !0
  }
  closeTagBillboard() {
    const { billboardAnnotation: e } = this.annotationsViewData
    e && e.annotationType === AnnotationType.TAG && this.engine.commandBinder.issueCommand(new AnnotationCloseCommand(e.id, AnnotationType.TAG))
  }
  in360View() {
    const e = this.sweepData.currentSweep ? this.sweepData.currentSweep : ""
    return this.viewmodeData.isInside() && this.sweepData.isSweepUnaligned(e)
  }
  async closeTag() {
    const { commandBinder: e } = this.engine
    const t = this.viewData
    const { openTagView: i } = t
    if ((this.toggleTagDirty(!1), i)) {
      const { id: n, layerId: s, enabled: a } = i
      t.setOpenTagView(null)
      //pw
      this.engine.broadcast(new TagClosedMessage(n))
      // this.cancelAttachmentChanges()
      // e.issueCommand(new ToggleViewAttachmentsCommand(!1))
      const o = this.tagsData.getTag(n)
      o &&
        (e.issueCommand(new UnselectPinCommand(n, PinType.MATTERTAG)),
        o.objectAnnotationId
          ? e.issueCommand(new RemovePinCommand(n, PinType.MATTERTAG))
          : (e.issueCommand(new ChangePinVisibilityCommand(n, PinType.MATTERTAG, this.getTagVisibility(n, s, a))),
            e.issueCommand(new UpdatePinCommand(n, PinType.MATTERTAG, o.getPin())))),
        await e.issueCommand(new AnnotationCloseCommand(n, AnnotationType.TAG))
    }

    // this.engine.commandBinder.issueCommand(new AttachmentsResetDataCommand())
  }
  getTagVisibility(e: string, t: string, i: boolean) {
    const { openTagView, idVisibilityEnabled, idVisibility, tagsMode } = this.viewData
    const r = this.appData.application === AppMode.WORKSHOP || this.layersData.layerToggled(t)
    const d = this.layersData.layerVisible(t)
    const c = tagsMode === TagsMode.REORDERING
    const l = !idVisibilityEnabled || idVisibility.has(e)
    const h = openTagView?.id === e
    return r && (h || (i && c) || (i && l && d))
  }
  displayTags() {
    const e: Array<ReturnType<TagsModule["getPinUpdate"]>> = []
    this.viewData.getOrderedTags(!1).forEach(t => {
      if (!t.objectAnnotationId) {
        const i = this.getPinUpdate(t)
        e.push(i)
      }
    })
    this.engine.commandBinder.issueCommand(new UpdatePinViewsCommand(e))
  }
  updateTagPin(e) {
    if (!e.objectAnnotationId) {
      const t = this.getPinUpdate(e)
      this.engine.commandBinder.issueCommand(new UpdatePinViewsCommand([t]))
    }
  }
  getPinUpdate(e: ReturnType<TagsViewData["createTagView"]>) {
    const { openTagView } = this.viewData
    const i = openTagView && openTagView.id === e.id ? openTagView : e
    const {
      id,
      layerId,
      enabled,
      anchorPosition,
      color,
      icon,
      stemEnabled,
      floorId,
      roomId,
      stemNormal,
      stemLength,
      showTitle,
      iconSize,
      iconUrl,
      label,
      assetType
    } = i
    return {
      id,
      anchorPosition,
      color,
      floorId,
      roomId,
      stemEnabled,
      stemNormal,
      stemLength,
      pinType: PinType.MATTERTAG,
      backgroundTexture: this.backgroundTexture,
      icon,
      visible: this.getTagVisibility(id, layerId, enabled),
      //穿给render 方便随时改变
      // extdata:JSON.parse(JSON.stringify(extdata)),
      iconSize,
      iconUrl,
      showTitle,
      label,
      assetType
    }
  }
  updatePendingTag() {
    const { creatingTag, openTagView } = this.viewData
    creatingTag && openTagView && (this.layersData.isInMemoryLayer(openTagView.layerId) || (openTagView.layerId = this.layersData.activeLayerId))
  }
  async cancelAttachmentChanges() {
    return this.engine.commandBinder.issueCommand(new CancelAttachmentChangesCommand())
  }
  toggleTagDirty(e: boolean) {
    this.viewData.openTagIsDirty = e
    this.viewData.commit()
  }
  getCustomTagOrder() {
    const e = this.orderedListData.getOrderedList(TAG_ORDERED_LIST_NAME)
    return e ? e.entries.map(e => e.id) : []
  }
  async saveTags() {
    this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.MATTERTAGS] }))
  }
  openAnnotation(e, t, i = !1) {
    const n = this.annotationsViewData.getCapabilities(e)
    t
      ? (n.dock || i) && this.engine.commandBinder.issueCommand(new AnnotationDockCommand(e, AnnotationType.TAG, i))
      : (n.preview || i) && this.engine.commandBinder.issueCommand(new AnnotationSelectCommand(e, AnnotationType.TAG, i))
  }
  async selectPin(e: string, t = !1) {
    const i = t && this.activated && this.appData.application === AppMode.WORKSHOP
    t ? this.engine.broadcast(new MattertagViewMessage(e, Te.V.DOCKED)) : this.engine.broadcast(new MattertagViewMessage(e, Te.V.OPEN)),
      await this.engine.commandBinder.issueCommand(new SelectPinCommand(e, PinType.MATTERTAG, i))
  }
  dockObjectTag(e: string) {
    const t = this.viewData.getTagView(e)
    t
      ? (this.engine.commandBinder.issueCommand(new AnnotationDockCommand(e, AnnotationType.OBJECT)),
        this.viewData.setOpenTagView(Object.assign({}, t)),
        this.selectPin(e, !0),
        this.toolsData.toolCollapsed && this.engine.commandBinder.issueCommand(new ToolPanelToggleCollapseCommand(!1)))
      : this.log.debug("Cannot dock a non-existent tag")
  }
  getSaveInfoById(id: string) {
    const tagsModule = this.engine?.getModuleBySymbolSync(TagsSymbol)
    const e = tagsModule?.viewData.tagViewsMap.get(id)
    if (!e) return null
    return {
      type: e.assetType,
      id: e.id,
      label: e.label,
      openMode: e.openMode,
      enabled: e.enabled,
      link: deepCopy(e.link),
      openDetail: deepCopy(e.openDetail),
      hotPoint: {
        color: e.color,
        stemEnabled: e.stemEnabled,
        showTitle: e.showTitle,
        iconSize: e.iconSize,
        iconUrl: e.iconUrl,
        stemLength: e.stemLength
      },
      //y是-z z是y 应该沿着x轴翻转了
      anchorPosition: { x: e.anchorPosition.x, y: -e.anchorPosition.z, z: e.anchorPosition.y },
      stemNormal: { x: e.stemNormal.x, y: -e.stemNormal.z, z: e.stemNormal.y },
      created: typeof e.created === "string" ? e.created : e.created.toISOString(),
      modified: typeof e.modified === "string" ? e.modified : e.modified.toISOString()
    }
  }
  async openTag(e, t, i, n = !0) {
    const s = this.viewData
    const a = s.getTagView(e)
    if (a) {
      const { openTagView: o, tagsMode: d } = this.viewData,
        { commandBinder: c } = this.engine,
        { dockedAnnotation: l, selectedAnnotation: h } = this.annotationsViewData
      i && d === TagsMode.REORDERING && s.setTagsMode(TagsMode.DEFAULT)
      i && this.toolsData.toolCollapsed && this.activated && c.issueCommand(new ToolPanelToggleCollapseCommand(!1))
      const u = o?.id === e
      if (u && this.activated === i) return void this.log.debug("Tag is already open and " + (i ? "docked" : "undocked"))
      if (i !== !!l) {
        const t = this.annotationsViewData.getCapabilities(e)
        i
          ? t.dock && !this.activated && (await this.engine.commandBinder.issueCommand(new OpenToolCommand(ToolsList.TAGS, !0)))
          : l && (await this.engine.commandBinder.issueCommand(new AnnotationCloseCommand(l.id, l.annotationType)))
      }
      if (!u && this.opening !== e) {
        this.opening = e
        c.issueCommand(new CloseModalCommand())
        h && h.id !== e && (await this.engine.commandBinder.issueCommand(new AnnotationCloseCommand(h.id, h.annotationType)))
        s.setOpenTagView(Object.assign({}, a))
        const i = s.getCapabilities(e)
        null !== t &&
          i.focus &&
          (n || this.viewmodeData.isInside()) &&
          (await this.engine.commandBinder.issueCommand(new FocusOnPinInsideCommand({ pinPosition: a, transition: t })).then(() => {
            const info = this.getSaveInfoById(a.id)
            this.engine.broadcast(new TagOpenedMessage(a.id, info))
          }))
        // this.engine.commandBinder.issueCommand(new SelectSearchResultCommand(a.id, searchModeType.MATTERTAG))
        setTimeout(() => {
          this.opening = null
        }, 0)
      }
    } else this.log.debug("Cannot open a non-existent tag")
  }
  isTagDocked() {
    const { dockedAnnotation: e } = this.annotationsViewData
    return (null == e ? void 0 : e.annotationType) === AnnotationType.TAG
  }
  getDockedTag() {
    const { dockedAnnotation: e } = this.annotationsViewData
    return e && e.annotationType === AnnotationType.TAG ? this.viewData.getTagView(e.id) : null
  }
  getSelectedTag() {
    const { billboardAnnotation: e, billboardSelected: t } = this.annotationsViewData
    return (e && t && e.annotationType === AnnotationType.TAG) || e?.annotationType === AnnotationType.OBJECT ? this.viewData.getTagView(e.id) : null
  }
  trackChanges(e: string, t, i?) {
    const s = this.tagsData.getTag(e)
    const { position: a, color: o, description: r, label: d, stemHeight: c, stemVisible: l, enabled: h, keywords: u } = t
    // if (!s && a) return void this.engine.broadcast(new MattertagAddMessage(e, a, a.distanceTo(this.cameraData.pose.position)))
    // if ((void 0 !== h && s.enabled !== h && this.engine.broadcast(new MattertagEditMessage(e, U.z.ENABLED, h)), o)) {
    //   const t = new Color(o.r, o.g, o.b).getHexString()
    //   s.color.getHexString() !== t && this.engine.broadcast(new MattertagEditMessage(e, U.z.DISC_COLOR, `#${t}`))
    // }
    // void 0 !== c && s.stemHeight !== c && this.engine.broadcast(new MattertagEditMessage(e, U.z.STEM_LENGTH, c))
    // void 0 !== l && s.stemVisible !== l && this.engine.broadcast(new MattertagEditMessage(e, U.z.STEM_VISIBLE, l))
    // void 0 !== d &&
    //   s.label !== d &&
    //   (this.engine.broadcast(new MattertagEditMessage(e, U.z.TITLE, d.length)), this.engine.broadcast(new MattertagAddTitleMessage(e, d.length)))
    // if (void 0 !== r && s.description !== r) {
    //   this.engine.broadcast(new MattertagEditMessage(e, U.z.DESCRIPTION, r.length))
    //   const t = this.descriptionParser.parse(r, this.layersData.getNonworkshopViewId())
    //   this.engine.broadcast(new MattertagAddDescriptionMessage(e, r.length, t))
    //   const i = DescriptionParser.getNumLinks(t)
    //   DescriptionParser.getNumLinks(s.parsedDescription) !== i && this.engine.broadcast(new MattertagEditMessage(e, U.z.LINKS, i))
    // }
    // if (i) {
    //   const t = i ? i.src : "",
    //     n = i ? (0, b.F5)(i.mediaType) : mediaTypeList.none
    //   ;(s.mediaSrc === t && s.mediaType === n) ||
    //     (this.engine.broadcast(new MattertagEditMessage(e, U.z.MEDIA, n)), this.engine.broadcast(new MattertagAddMediaMessage(e, n, t)))
    // }
    // const m = s.keywords.every(e => u && u.includes(e))
    // if ((null == u ? void 0 : u.length) !== s.keywords.length || !m) {
    //   const t = (null == u ? void 0 : u.length) || 0
    //   this.engine.broadcast(new MattertagEditMessage(e, U.z.KEYWORDS, t))
    // }
  }
}
