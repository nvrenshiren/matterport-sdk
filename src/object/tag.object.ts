import { ObservableArray } from "../observable/observable.array"
import { ObservableObject } from "../observable/observable.object"
import { Color, Vector3 } from "three"
import { setStemHeight } from "../const/78283"
import { ColorSpace } from "../const/color.const"
import { mediaTypeList } from "../const/30643"
import { TagDescription } from "../interface/tag.interface"
import { deepCopy } from "./../utils/commo.utils"
export const ICON = "https://obs.3dyunzhan.com/pictures/202204241618499612613.png"

// export interface IExtdata {
//   info: {
//     custom: string //前端弹框自定义数据（里面存有弹框打开的内容 视频 模型 图片等）
//     discripe: string //描述
//     type: number //打开类型 1 2 3  详情 外链 音频 前端自定义
//     url: string //链接地址
//     target: number //打开外链方式
//     btnText: string //链接名称
//   }
// }

export enum AssetTypes {
  hotPoint = "hotPoint"
}
export class TagObject extends ObservableObject {
  assetType: string //加入热点类型 后期热点可能会加载不同的模块
  sid: string
  layerId: string
  created: Date
  modified: Date
  enabled: boolean
  label: string
  description: string
  parsedDescription: TagDescription[]
  anchorPosition: Vector3
  anchorNormal: Vector3
  stemVector: Vector3
  stemHeight: number
  stemVisible: boolean
  fileAttachments: ObservableArray<any>
  externalAttachments: ObservableArray<any>
  sandboxAttachments: ObservableArray<any>
  color: Color
  mediaType: string
  mediaSrc: string
  keywords: string[]
  floorId: string
  roomId: string
  objectAnnotationId: string
  icon: any

  //引擎渲染用到的字段
  iconSize: number
  iconUrl: string
  showTitle: boolean
  //前端拓展字段（引擎没用到）
  openMode: any
  link: any
  openDetail: any

  constructor(e?) {
    super()
    this.sid = ""
    this.layerId = ""
    this.created = new Date()
    this.modified = new Date()
    this.enabled = !0
    this.label = ""
    this.description = ""
    this.parsedDescription = []
    this.anchorPosition = new Vector3()
    this.anchorNormal = new Vector3(0, 1, 0)
    this.stemVector = new Vector3(0, 0, setStemHeight(1))
    this.stemHeight = setStemHeight(1)
    this.stemVisible = !0
    this.fileAttachments = new ObservableArray()
    this.externalAttachments = new ObservableArray()
    this.sandboxAttachments = new ObservableArray()
    this.color = ColorSpace.MATTERTAG_BLUE.clone()
    this.mediaType = mediaTypeList.none
    this.mediaSrc = ""
    this.keywords = []
    e && Object.assign(this, e)
  }
  copy(e: TagObject) {
    this.anchorNormal.copy(e.anchorNormal)
    this.anchorPosition.copy(e.anchorPosition)
    this.color.copy(e.color)
    this.created.setTime(e.created.getTime())
    this.description = e.description
    this.enabled = e.enabled
    this.layerId = e.layerId
    this.floorId = e.floorId
    this.roomId = e.roomId
    this.label = e.label
    this.mediaType = e.mediaType
    this.mediaSrc = e.mediaSrc
    this.modified.setTime(e.modified.getTime())
    this.sid = e.sid
    this.stemVector.copy(e.stemVector)
    this.stemHeight = e.stemHeight
    this.stemVisible = e.stemVisible
    this.fileAttachments = e.fileAttachments
    this.externalAttachments = e.externalAttachments
    this.sandboxAttachments = e.sandboxAttachments
    this.objectAnnotationId = e.objectAnnotationId
    this.keywords = e.keywords
    this.icon = e.icon
    //拓展字段
    // this.extdata = JSON.parse(JSON.stringify(e.extdata||""))
    this.iconSize = e.iconSize || 1
    this.iconUrl = e.iconUrl || ICON
    this.showTitle = e.showTitle === undefined ? true : e.showTitle
    this.label = e.label
    this.openDetail = deepCopy(e.openDetail)
    this.openMode = e.openMode || 1
    this.link = deepCopy(e.link)
    this.assetType = e.assetType
    this.parsedDescription = []
    for (const t of e.parsedDescription) {
      this.parsedDescription.push({
        link: t.link && {
          label: t.link.label.slice(),
          url: t.link.url.slice(),
          type: t.link.type,
          navigationData: t.link.navigationData && {
            floorVisibility: t.link.navigationData.floorVisibility,
            mode: t.link.navigationData.mode,
            sweepIndex: t.link.navigationData.sweepIndex,
            panoId: t.link.navigationData.panoId,
            position: t.link.navigationData.position && t.link.navigationData.position.clone(),
            quaternion: t.link.navigationData.quaternion.clone(),
            zoom: t.link.navigationData.zoom
          }
        },
        text: t.text,
        type: t.type
      })
    }
    this.commit()
    return this
  }
  clone() {
    return new TagObject().copy(this)
  }
  refresh(e) {
    this.fileAttachments.forEach(t => {
      const n = e[t.id]
      n && (t.thumbnailUrl.refreshFrom(n.thumbnailUrl), t.url.refreshFrom(n.url))
    })
  }
  getPin() {
    const {
      anchorPosition,
      color,
      stemVisible,
      floorId,
      roomId,
      stemVector,
      stemHeight,
      icon,
      iconSize,
      iconUrl,
      showTitle,
      label,
      openMode,
      link,
      openDetail,
      assetType
    } = this

    return {
      anchorPosition,
      color: `#${color.getHexString()}`,
      icon,
      floorId,
      roomId,
      stemEnabled: stemVisible,
      stemNormal: stemVector,
      stemLength: stemHeight,
      // extdata:JSON.parse(JSON.stringify(extdata)),
      iconSize,
      iconUrl,
      showTitle: showTitle === undefined ? true : showTitle,
      label,
      openDetail,
      openMode,
      link,
      assetType
    }
  }
  updateFromOptions(e, t, n) {
    void 0 !== e.color && (this.color = new Color(e.color.r, e.color.g, e.color.b))
    void 0 !== e.enabled && (this.enabled = e.enabled)
    void 0 !== e.stemHeight && ((this.stemHeight = e.stemHeight), this.stemVector.copy(this.anchorNormal).setLength(e.stemHeight))
    void 0 !== e.stemVisible && (this.stemVisible = e.stemVisible)
    void 0 !== e.label && (this.label = e.label.slice())
    void 0 !== e.description && ((this.description = e.description), (this.parsedDescription = t.parse(this.description, n)))
    void 0 !== e.floorId && (this.floorId = e.floorId)
    void 0 !== e.roomId && (this.roomId = e.roomId)
    void 0 !== e.normal && (this.anchorNormal.copy(e.normal).normalize(), this.stemVector.copy(e.normal).setLength(this.stemHeight))
    void 0 !== e.position && this.anchorPosition.copy(e.position)
    void 0 !== e.keywords && (this.keywords = e.keywords.slice())
    Object.prototype.hasOwnProperty.call(e, "icon") && (this.icon = e.icon)
    void 0 !== e.objectAnnotationId && (this.objectAnnotationId = e.objectAnnotationId)
    void 0 !== e.assetType && (this.assetType = e.assetType)
  }
}
