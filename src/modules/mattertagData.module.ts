import { Vector2, Vector3 } from "three"
import * as x from "../other/40731"
import * as m from "../other/47620"
import * as P from "../other/52507"
import { FileDeserializer } from "../other/65222"
import { DiffState } from "../other/71954"
import {
  AddMattertagCommand,
  DeleteMattertagCommand,
  EditMattertagCommand,
  MattertagDiscPositionsCommand,
  MattertagNewSaveCommand,
  MattertagSaveCommand
} from "../command/mattertag.command"
import { DismissObjectTagCommand } from "../command/objectTag.command"
import { RegisterRoomAssociationSourceCommand } from "../command/room.command"
import { SaveCommand } from "../command/save.command"
import { AggregationType } from "../const/2541"
import { mediaTypeList } from "../const/30643"
import { DataType } from "../const/79728"
import { MattertagDataSymbol, MeshQuerySymbol, StorageSymbol } from "../const/symbol.const"
import { mattertagMediaType, searchModeType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { LayersData } from "../data/layers.data"
import { TagData } from "../data/tag.data"
import { VisionParase } from "../math/2569"
import { getScreenAndNDCPosition } from "../math/59370"
import { TagObject } from "../object/tag.object"
import { DescriptionParser } from "../parser/description.parser"
import { EmbedDeserializer } from "../parser/embedDeserializer"
import { SweepsMonitor } from "../observable/sweepsMonitor"
import { buildColorString, isColor } from "../utils/69984"
import * as f from "../utils/95724"
import { randomString } from "../utils/func.utils"
import EngineContext from "../core/engineContext"
import GetMattertags from "../test/GetMattertags"
import { TagDeserializer } from "../other/52507"
import { ArrayDeserializer } from "../utils/95724"
declare global {
  interface SymbolModule {
    [MattertagDataSymbol]: MattertagDataModule
  }
}
const A = new DebugInfo("mds-mattertag-serializer")
class CreateSerializer {
  constructor(e, t) {
    ;(this.updateSerializer = e), (this.mediaSerializer = t)
  }
  serialize(e, t) {
    const i = this.mediaSerializer.serialize(e),
      n = this.updateSerializer.serialize(e, t),
      s = null !== i ? Object.assign(Object.assign({}, i), n) : n
    return this.validate(s) ? s : null
  }
  validate(e) {
    if (!e) return !1
    const t = ["label", "description", "mediaUrl"].some(t => t in e),
      i = ["floorId", "enabled", "anchorPosition"].filter(t => !(t in e)),
      n = 0 === i.length,
      s = !!e.anchorPosition && (0, x.u)(e.anchorPosition),
      a = n && t && s
    return a || A.debug("Invalid MattertagDetails:", { missingFields: i, validPosition: s }), a
  }
}
class MediaRemovalSerializer {
  serialize(e) {
    return this.validate(e) ? { sid: e.sid } : null
  }
  validate(e) {
    const t = null !== e && !!e.mediaType && e.mediaType === mediaTypeList.none
    return null !== e && !!e.sid && t
  }
}
const I = new DebugInfo("mds-mattertag-serializer")
class MediaUpdateSerializer {
  serialize(e) {
    const t = this.extractMedia(e)
    return this.validate(t) ? t : null
  }
  validate(e) {
    if (!e) return !1
    const t = ["mediaUrl", "mediaType"].every(t => t in e),
      i = void 0 !== e.mediaType && ["rich", "photo", "video"].includes(e.mediaType),
      n = t && i
    return n || I.debug("invalid media", e, { hasRequiredFields: t, hasValidMediaType: i }), n
  }
  extractMedia(e) {
    const t = {}
    return e.mediaSrc && (t.mediaUrl = e.mediaSrc), e.mediaType && e.mediaType in N && (t.mediaType = e.mediaType), t.mediaUrl && t.mediaType ? t : null
  }
}
const N = {
  [mediaTypeList.photo]: [mattertagMediaType.PHOTO],
  [mediaTypeList.rich]: [mattertagMediaType.RICH],
  [mediaTypeList.video]: [mattertagMediaType.VIDEO]
}
const R = new DebugInfo("mds-mattertag-serializer")
class PatchSerializer {
  serialize(e, t) {
    var i
    if (!e) return null
    const n = {}
    return (
      void 0 !== e.enabled && (n.enabled = e.enabled),
      void 0 !== e.stemVisible && (n.stemEnabled = e.stemVisible),
      void 0 !== e.label && (n.label = e.label),
      void 0 !== e.description && (n.description = e.description),
      void 0 !== e.color && isColor(e.color) && (n.color = buildColorString(e.color)),
      void 0 !== e.anchorPosition && (0, x.u)(e.anchorPosition) && (n.anchorPosition = VisionParase.toVisionVector(e.anchorPosition)),
      void 0 !== e.anchorNormal && (0, x.u)(e.anchorNormal) && (n.stemNormal = VisionParase.toVisionVector(e.anchorNormal)),
      void 0 !== e.stemHeight && (n.stemLength = e.stemHeight),
      Object.prototype.hasOwnProperty.call(e, "icon") && (n.icon = null !== (i = e.icon) && void 0 !== i ? i : ""),
      void 0 !== e.keywords && (n.keywords = e.keywords),
      e.floorId && (n.floorId = e.floorId),
      e.roomId && (n.roomId = e.roomId),
      e.layerId && t && (n.layerId = e.layerId),
      e.objectAnnotationId && (n.objectAnnotationId = e.objectAnnotationId),
      n && this.validate(n) ? n : null
    )
  }
  validate(e) {
    if (!e) return !1
    const t = [
        "layerId",
        "floorId",
        "roomId",
        "color",
        "label",
        "description",
        "enabled",
        "stemEnabled",
        "stemLength",
        "stemNormal",
        "stemDirection",
        "anchorPosition",
        "objectAnnotationId",
        "keywords",
        "icon"
      ],
      i = Object.keys(e).length > 0,
      n = Object.keys(e).every(e => t.includes(e)),
      s = n && i
    return s || R.debug("Invalid MattertagPatch:", { hasContents: i, hasValidFields: n, data: e }), s
  }
}
class V {
  serialize(e) {
    const t = e.fileAttachments
    return void 0 === t ? null : { fileAttachments: t.map(e => e.id) }
  }
}
const F = new DebugInfo("MdsMattertagStore")
class MattertagStore extends MdsStore {
  includeObjectTags: boolean
  fileAttachmentDeserializer: FileDeserializer
  fileAttachmentSerializer: V
  patchSerializer: PatchSerializer
  mediaUpdateSerializer: MediaUpdateSerializer
  mediaRemovalSerializer: MediaRemovalSerializer
  createSerializer: CreateSerializer
  tagDeserializer: TagDeserializer
  deserializer: ArrayDeserializer

  constructor(e, t) {
    super(e)
    this.includeObjectTags = t
    this.layeredType = searchModeType.MATTERTAG
    this.prefetchKey = "data.model.mattertags"
    this.fileAttachmentDeserializer = new FileDeserializer()
    this.fileAttachmentSerializer = new V()
    this.patchSerializer = new PatchSerializer()
    this.mediaUpdateSerializer = new MediaUpdateSerializer()
    this.mediaRemovalSerializer = new MediaRemovalSerializer()
    this.createSerializer = new CreateSerializer(this.patchSerializer, this.mediaUpdateSerializer)
    this.tagDeserializer = new TagDeserializer(this.fileAttachmentDeserializer, new EmbedDeserializer())
    this.deserializer = new ArrayDeserializer({ deserializer: this.tagDeserializer })
  }
  async read(e) {
    const { readonly } = this.config
    //pw
    // const { includeDisabled: t = !1 } = this.config,
    //   i = { modelId: this.getViewId(), includeDisabled: t, prefetchKey: this.prefetchKey, includeLayers: this.readLayerId() }
    // return this.query(B.GetMattertags, i, e).then(e => {
    //   var t, i
    //   const n = null === (i = null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.model) || void 0 === i ? void 0 : i.mattertags
    //   if (!n || !Array.isArray(n)) return null
    //   return (this.deserializer.deserialize(n) || []).reduce((e, t) => ((!this.includeObjectTags && t.objectAnnotationId) || (e[t.sid] = t), e), {})
    // })
    return (this.deserializer.deserialize(await GetMattertags(this.getViewId(), !readonly)) || []).reduce(
      (e, t) => ((!this.includeObjectTags && t.objectAnnotationId) || (e[t.sid] = t), e),
      {}
    )
  }
  async refreshFileAttachments(e) {
    //pw
    // const { includeDisabled: t = !1 } = this.config,
    //   i = { modelId: this.getViewId(), includeDisabled: t }
    // return this.query(B.RefreshTagFileAttachments, i, e).then(e => {
    //   var t, i
    //   const n = null === (i = null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.model) || void 0 === i ? void 0 : i.mattertags
    //   if (!n || !Array.isArray(n)) return {}
    //   const s = []
    //   for (const e of n) {
    //     if (!e.id || !e.fileAttachments) throw (F.error("Failure refreshing tag file attachments"), new Error("Failure refreshing tag file attachments"))
    //     e.fileAttachments.forEach(e => {
    //       const t = this.fileAttachmentDeserializer.deserialize(e)
    //       t && s.push(t)
    //     })
    //   }
    //   return s.reduce((e, t) => ((e[t.id] = t), e), {})
    // })
    return {}
  }
  async create(e) {
    //pw
    // const t = this.getViewId(),
    //   i = []
    // for (const n of e) {
    //   const e = this.createSerializer.serialize(n, this.writeLayerId(n.layerId))
    //   if (!e) throw (F.error("Failure saving tag:", n.sid, n), new Error("Could not save Mattertag"))
    //   const s = n.sid
    //   let o = ", $data: MattertagDetails!"
    //   const r = { modelId: t, mattertagId: s, data: e },
    //     d = this.fileAttachmentSerializer.serialize(n)
    //   d && ((o += ", $fileAttachments: [ID!]"), (r.fileAttachments = d.fileAttachments))
    //   const c = `\n        addMattertag(\n          modelId: $modelId,\n          mattertagId: "${s}",\n          mattertag: $data) {\n            id\n            created\n            modified\n          }\n        ${d ? `addMattertagAttachments(\n            modelId: $modelId,\n            mattertagId: "${s}",\n            fileAttachments: $fileAttachments) {\n              id\n            }` : ""}\n      `,
    //     l = gql`
    //     mutation AddMattertag($modelId: ID! ${o}) {
    //       ${c}
    //     }
    //   `,
    //     h = await this.mutate(l, r),
    //     u = dataFromJsonByString(h, "data.addMattertag"),
    //     m = new TagObject().copy(n)
    //   ;(m.sid = u.id), m.commit(), i.push(m)
    // }
    // return i
    return []
  }
  async update(e, t) {
    //pw
    // if (!e || 0 === e.length) return
    // let i = ""
    // const n = {},
    //   s = this.getViewId()
    // n.modelId = s
    // let a = ""
    // for (const t of e) {
    //   const e = t.sid,
    //     s = this.mediaUpdateSerializer.serialize(t),
    //     o = this.mediaRemovalSerializer.serialize(t),
    //     r = this.patchSerializer.serialize(t, !1),
    //     d = r || o || s,
    //     c = this.fileAttachmentSerializer.serialize(t)
    //   if (!(r || s || o || c)) return void F.debug(`Nothing to update for tag ${e}`, t)
    //   if (d) {
    //     const t = r || {}
    //     ;(i += `, $patch${e}: MattertagPatch!`), o && (t.mediaUrl = ""), s && ((t.mediaUrl = s.mediaUrl), (t.mediaType = s.mediaType)), (n[`patch${e}`] = t)
    //   }
    //   c && ((i += `, $fileAttachments${e}: [ID!]`), (n[`fileAttachments${e}`] = c.fileAttachments)),
    //     (n[`mediaType${e}`] = s && s.mediaType),
    //     (n[`mediaUrl${e}`] = s && s.mediaUrl)
    //   a += `\n        update${e}:\n        ${d ? `patchMattertag(\n            modelId: $modelId,\n            mattertagId: "${e}",\n            patch: $patch${e}) {\n              id\n            }` : ""}\n        ${c ? `addMattertagAttachments(\n            modelId: $modelId,\n            mattertagId: "${e}",\n            fileAttachments: $fileAttachments${e}) {\n              id\n            }` : ""}\n      `
    // }
    // for (const { attachment: e } of t)
    //   (null == e ? void 0 : e.id) && (null == e ? void 0 : e.parentId) && e.parentType
    //     ? ((i += `, $parentType${e.id}: ParentType!`),
    //       (n[`parentType${e.id}`] = e.parentType),
    //       (a += `\n        unattach${e.id}:\n        removeFileAttachment(modelId: $modelId,\n                             attachmentId: "${e.id}",\n                             parentType: $parentType${e.id},\n                             parentId: "${e.parentId}") `))
    //     : F.debug("MattertagStore.update: unable to remove file attachment")
    // const o = gql`
    //   mutation tagUpdate($modelId: ID! ${i}) {
    //     ${a}
    //   }
    // `
    // await this.mutate(o, n)
    return !0
  }
  async delete(e) {
    //pw
    // if (!e || 0 === e.length) return
    // const t = this.getViewId()
    // let i = ""
    // for (const t of e) {
    //   if (!t || (t && !t.sid)) throw new Error("MattertagStore.delete failed")
    //   i += `delete${t.sid}: deleteMattertag(modelId: $modelId, mattertagId: "${t.sid}") `
    // }
    // const n = gql`
    //   mutation batchDeleteMattertag($modelId: ID!) {
    //     ${i}
    //   }
    // `
    // return this.mutate(n, { modelId: t }).then(() => {})
    return !0
  }
}
export default class MattertagDataModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "mattertag-data"),
      (this.monitor = null),
      (this.filesToUnattach = []),
      (this.getDiscPositions = (() => {
        const e = [],
          t = {},
          i = {},
          n = new Vector3()
        return async s => (
          (e.length = 0),
          s.tags.forEach(s => {
            const a = this.data.getTag(s)
            a &&
              (i[s] || (i[s] = new Vector3()),
              i[s].copy(a.anchorPosition).add(a.stemVector),
              t[s] || (t[s] = new Vector2()),
              getScreenAndNDCPosition(this.cameraData, i[s], t[s], n),
              e.push({ sid: s, screen: n.z > 1 ? null : t[s], world: i[s] }))
          }),
          e
        )
      })()),
      (this.addTag = async e => {
        const t = []
        return (
          this.data.atomic(() => {
            for (const i of e) {
              const { positionOptions: e, standardOptions: n, mediaOptions: s } = i,
                a = Object.assign(Object.assign({}, e), n),
                r = this.createTag(i.id || randomString(11), a, [], s)
              ;(r.modified = new Date()), r.commit(), t.push(r.sid)
            }
          }),
          t
        )
      }),
      (this.editTag = async e => {
        const { sid: t, positionOptions: i, standardOptions: n, mediaOptions: s } = e,
          a = Object.assign(Object.assign({}, i), n),
          o = this.data.getTag(t)
        o && (this.updateTag(o, a, s), (o.modified = new Date()), o.commit())
      }),
      (this.removeTag = async e => {
        const t = this.data.getTag(e.sid)
        if (void 0 !== t && this.data.removeTag(e.sid))
          return t && t.objectAnnotationId && this.engine.commandBinder.issueCommand(new DismissObjectTagCommand(t.objectAnnotationId)), e.sid
      }),
      (this.saveNewTag = async e => {
        const { id: t, properties: i, embed: n, fileAttachments: s } = e,
          a = n ? { mediaSrc: n.src, mediaType: (0, m.F5)(n.mediaType) } : void 0
        return this.createTag(t, i, s, a), this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.MATTERTAGS] }))
      }),
      (this.saveTag = async e => {
        const { id: t, properties: i, pendingAttachments: n, removedAttachments: s, embed: a } = e,
          o = this.data.getTag(t)
        if (!o) return void this.log.debug("Cannot save non-existent tag")
        const c = a ? (0, m.F5)(a.mediaType) : mediaTypeList.none,
          l = a ? a.src : ""
        void 0 !== a && ((l === o.mediaSrc && c !== o.mediaType) || this.updateExternalAttachment(o, a))
        const h = void 0 !== a ? { mediaSrc: l, mediaType: c } : void 0
        return (
          this.updateTag(o, i, h),
          n.forEach(e => {
            o.fileAttachments.push(e)
          }),
          this.removeFileAttachments(o, s),
          this.data.addTag(o),
          this.data.updateOnStaleCallbacks(t),
          this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.MATTERTAGS] }))
        )
      })
  }
  async init(e, t: EngineContext) {
    const { readonly: i, baseUrl: n } = e
    ;(this.engine = t),
      (this.descParser = new DescriptionParser({ supportLinks: !0, keepLinkLabels: !0 })),
      ([this.meshQueryModule, this.cameraData, this.layersData] = await Promise.all([
        t.getModuleBySymbol(MeshQuerySymbol),
        t.market.waitForData(CameraData),
        t.market.waitForData(LayersData)
      ])),
      (this.store = new MattertagStore({ context: this.layersData.mdsContext, readonly: i, includeDisabled: !i, baseUrl: n }, e.objectTagsEnabled))
    const a = await t.getModuleBySymbol(StorageSymbol)
    ;(this.data = new TagData()),
      this.bindings.push(
        this.store.onNewData(async i => {
          this.initializeTagData(i, t.market, e.parserOptions)
        }),
        t.commandBinder.addBinding(MattertagDiscPositionsCommand, this.getDiscPositions),
        t.commandBinder.addBinding(AddMattertagCommand, this.addTag),
        t.commandBinder.addBinding(EditMattertagCommand, this.editTag),
        t.commandBinder.addBinding(DeleteMattertagCommand, this.removeTag)
      ),
      //pw
      await this.store.refresh(),
      i ||
        (this.bindings.push(
          t.commandBinder.addBinding(MattertagNewSaveCommand, this.saveNewTag),
          t.commandBinder.addBinding(MattertagSaveCommand, this.saveTag),
          a.onSave(() => this.save(), { dataType: DataType.MATTERTAGS })
        ),
        (this.monitor = new SweepsMonitor(this.data.collection, { aggregationType: AggregationType.Manual, shallow: !0 }))),
      this.registerRoomAssociationSource(t),
      t.market.register(this, TagData, this.data)
  }
  dispose(e) {
    this.store.dispose(), super.dispose(e)
  }
  async save() {
    if ((this.monitor && this.monitor.commitChanges(), !this.store || !this.monitor)) return void this.log.warn("Mattertags changes will NOT be saved")
    const e = this.monitor.getDiffRecord()
    this.monitor.clearDiffRecord()
    const t = e
        .map(e => {
          var t
          const i = e.diff.layerId || (null === (t = this.data.getTag(e.index)) || void 0 === t ? void 0 : t.layerId)
          return Object.assign({ layerId: i }, e)
        })
        .filter(e => !this.layersData.isInMemoryLayer(e.layerId)),
      i = t.filter(e => e.action === DiffState.removed).map(e => ({ sid: e.index, layerId: e.layerId })),
      n = t.filter(e => e.action === DiffState.added).map(e => this.data.getTag(e.index)),
      s = t
        .filter(e => e.action === DiffState.updated)
        .map(e => {
          const t = Object.assign({ sid: e.index, layerId: e.layerId }, e.diff),
            i = this.data.getTag(e.index)
          return (
            "mediaSrc" in t && (t.mediaType = i.mediaType), (t.objectAnnotationId = i.objectAnnotationId), !t.roomId && i.roomId && (t.roomId = i.roomId), t
          )
        })
    await this.store.delete(i), await this.store.create(n), await this.store.update(s, this.filesToUnattach)
  }
  clearDiffRecord() {
    this.monitor && this.monitor.clearDiffRecord()
  }
  initializeTagData(e, t, i) {
    var n
    const s = i ? new DescriptionParser(i) : this.descParser
    this.data.atomic(() => {
      this.layersData.replaceBackendLayers(this.data.collection, {})
    }),
      this.data.atomic(() => {
        for (const t in e) {
          const i = e[t]
          ;(i.parsedDescription = s.parse(e[t].description, this.layersData.currentViewId)),
            this.meshQueryModule.inferMeshIdsFromPoint(i, i.anchorPosition, !1),
            this.data.addTag(i)
        }
      }),
      (this.data.onStale = () => this.store.refreshFileAttachments()),
      this.data.updateOnStaleCallbacks(),
      null === (n = this.monitor) || void 0 === n || n.clearDiffRecord()
  }
  createTag(e, t, i, n) {
    let s = e
    for (; this.data.getTag(s); ) s = randomString(11)
    const r = new TagObject()
    if (((r.sid = s), (r.layerId = this.layersData.activeLayerId), n)) {
      const e = (0, m.gj)(n.mediaType)
      if (n.mediaSrc && e) {
        const t = (0, m.Nc)(s, n.mediaSrc, e)
        t && r.externalAttachments.push(t)
      }
    }
    return (
      t.objectAnnotationId && (r.objectAnnotationId = t.objectAnnotationId),
      t.keywords && (r.keywords = t.keywords),
      i.forEach(e => {
        r.fileAttachments.push(e)
      }),
      this.updateTag(r, t, n),
      this.data.addTag(r),
      this.data.updateOnStaleCallbacks(s),
      r
    )
  }
  updateTag(e, t, i) {
    e.updateFromOptions(t, this.descParser, this.layersData.currentViewId),
      void 0 !== (null == i ? void 0 : i.mediaType) && (e.mediaType = i.mediaType),
      void 0 !== (null == i ? void 0 : i.mediaSrc) && (e.mediaSrc = i.mediaSrc.slice())
  }
  removeFileAttachments(e, t) {
    const { fileAttachments: i } = e
    t.forEach(t => {
      const n = i.findIndex(e => e.id === t.id)
      ;-1 !== n
        ? (i.splice(n, 1), this.filesToUnattach.push({ attachment: t, layerId: e.layerId }))
        : this.log.debug("Attempting to remove an attachment that is not in the tag")
    })
  }
  updateExternalAttachment(e, t) {
    const { mediaSrc: i } = e
    i && e.externalAttachments.replace([]), t && e.externalAttachments.replace([t])
  }
  registerRoomAssociationSource(e) {
    const t = this.data
    e.commandBinder.issueCommandWhenBound(
      new RegisterRoomAssociationSourceCommand({
        type: "mattertags",
        getPositionId: function* () {
          for (const e of t) yield { id: e.sid, roomId: e.roomId, floorId: e.floorId, position: e.anchorPosition, layerId: e.layerId }
        },
        updateRoomForId: (e, t) => {
          const i = this.data.getTag(e)
          if (!i) throw new Error("Invalid tag id!")
          i.roomId = t || void 0
        }
      })
    )
  }
}
