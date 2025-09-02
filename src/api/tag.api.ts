import { Color } from "three"
import { TagDeleteCommand, TagSaveCommand, TagStartAddCommand, TagsToggleCommand } from "../command/tag.command"
import Engine from "../core/engine"
import { TagsViewData } from "../data/tags.view.data"
import { PinsViewData } from "../data/pins.view.data"
import { PinClickedMessage, PinHoverChangeMessage, PinPlacedMessage } from "../message/pin.message"
import { EventCommon } from "@ruler3d/common"
import { TagClosedMessage, TagOpenedMessage } from "../message/tag.message"
import { PinType } from "../const/62612"
import { FloorsData } from "../data/floors.data"
import { TagData } from "../data/tag.data"
import { CameraData } from "../data/camera.data"
import { getScreenAndNDCPosition } from "../math/59370"
import { AssetTypes } from "../object/tag.object"
import { deepCopy } from "../utils/commo.utils"
//todo暂时用测试数据 其实需要真实的楼层数据
import GetFloors from "../test/GetFloors"
import { PinsSymbol } from "../const/symbol.const"
import { FocusOnPinInsideCommand } from "../command/navigation.command"

declare global {
  namespace eventList {
    interface data {
      "tag.hover": (status: PinHoverChangeMessage) => void
      "tag.open": (status: TagOpenedMessage) => void
      "tag.close": (status: TagClosedMessage) => void
      "tag.click": (status: PinClickedMessage) => void
      "pin.placed": (status: PinPlacedMessage) => void
    }
  }
}

interface IHotInfo {
  id: string
  label: string
  openMode: number
  enabled: boolean
  link: {
    url: string
    btnText: string
    target: number //3 新窗口打开
  }
  openDetail: {
    detail_album?: {
      fileType: number
      picPath: string
      picName: string
    }[]
    albumDescription?: string
    articleDescription?: string
    detail_article?: {
      id?: string
      name?: string
      title?: string
    }
    detail_audio?: {
      name?: string
      musicFile?: string
    }
  }
  hotPoint: {
    color: string
    stemEnabled: boolean
    showTitle: boolean
    iconSize: number,
    iconUrl: string
    stemLength: number
  }
}

// floor没有 layer没有 但是有id externalAttachments没有 fileAttachments没有
interface IMattertagSaveData {
  id: string
  label: string
  openMode: number
  enabled: boolean
  link: any
  openDetail: any
  hotPoint: {
    color: string
    stemEnabled: boolean
    showTitle: boolean
    iconSize: number
    iconUrl: string
    stemLength: number
  }
  //y是-z z是y 应该沿着x轴翻转了
  anchorPosition: { x: number; y: number; z: number }
  stemNormal: { x: number; y: number; z: number }
  created: string
  modified: string
}

export class TagInterface {
  engine: Engine | null = null

  constructor() {}

  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }

  addEvent() {
    this.engine?.subscribe(PinPlacedMessage, e => {
      EventCommon.EventBus.emit("pin.placed", e)
    })
    this.engine?.subscribe(PinHoverChangeMessage, e => {
      e.pinType === PinType.MATTERTAG && EventCommon.EventBus.emit("tag.hover", e)
    })
    this.engine?.subscribe(PinClickedMessage, e => {
      e.pinType === PinType.MATTERTAG && EventCommon.EventBus.emit("tag.click", e)
    })
    this.engine?.subscribe(TagOpenedMessage, e => {
      EventCommon.EventBus.emit("tag.open", e)
    })
    this.engine?.subscribe(TagClosedMessage, e => {
      EventCommon.EventBus.emit("tag.close", e)
    })
  }

  //激活编辑
  toggleEditing(active: boolean) {
    this.engine?.commandBinder.issueCommand(new TagsToggleCommand(active))
  }

  //开始添加tag
  async startAdd(info = { assetType: "hotPoint" }) {
    const id = await this.engine?.commandBinder.issueCommand(new TagStartAddCommand(info))
    return id as string
  }

  async delete(id: string) {
    return await this.engine?.commandBinder.issueCommand(new TagDeleteCommand(id, "ruler"))
  }

  //保存tag
  save(id: string) {
    const { openTagView } = this.engine?.market.getData(TagsViewData)!
    const tag = {
      position: openTagView?.anchorPosition,
      normal: openTagView?.stemNormal,
      floorId: openTagView?.floorId,
      roomId: openTagView?.roomId,
      description: openTagView?.description,
      label: openTagView?.label,
      keywords: openTagView?.keywords,
      color: new Color(openTagView?.color),
      stemHeight: openTagView?.stemLength,
      stemVisible: openTagView?.stemEnabled,
      icon: openTagView?.icon,
      enabled: openTagView?.enabled,
      objectAnnotationId: openTagView?.objectAnnotationId
    }
    this.engine?.commandBinder.issueCommand(new TagSaveCommand(id, tag, [], [], null)).catch()
  }

  //获取tag的屏幕坐标
  async getTagScreenPosition(id: string) {
    const [cameraData, tagsViewData] = await Promise.all([this.engine!.market.waitForData(CameraData), this.engine!.market.waitForData(TagsViewData)])
    if (tagsViewData.openTagView?.id === id) {
      const { anchorPosition } = tagsViewData.openTagView!
      return getScreenAndNDCPosition(cameraData, anchorPosition)
    } else {
      return null
    }
  }

  //获取tag数据
  async getData() {
    const [tagData, floorsData] = await Promise.all([this.engine!.market.waitForData(TagData), this.engine!.market.waitForData(FloorsData)])
    const data: any[] = []
    tagData.iterate(e => {
      const {
        sid,
        label,
        description,
        parsedDescription,
        externalAttachments,
        anchorNormal,
        anchorPosition,
        color,
        enabled,
        stemHeight,
        stemVisible,
        stemVector,
        floorId
      } = e
      const { id, index } = floorsData.getFloor(floorId)
      const attachments = externalAttachments.get(0)
      const mediaType = attachments?.mediaType || "none"
      const mediaSrc = attachments && mediaType !== "none" ? attachments.src : ""
      data.push({
        sid,
        label,
        description,
        parsedDescription,
        media: { type: mediaType, src: mediaSrc },
        anchorPosition: { x: anchorPosition.x, y: anchorPosition.y, z: anchorPosition.z },
        anchorNormal: { x: anchorNormal.x, y: anchorNormal.y, z: anchorNormal.z },
        color: { r: color.r, g: color.g, b: color.b },
        enabled: enabled,
        floorId: id,
        floorIndex: index,
        stemVector: { x: stemVector.x, y: stemVector.y, z: stemVector.z },
        stemHeight: stemHeight,
        stemVisible: stemVisible
      })
    })
    return data
  }

  //设置热点数据
  setHotParams(id, hotInfo?: Partial<IHotInfo>) {
    if (!hotInfo) return
    const tagsViewData = this.engine?.market.getData(TagsViewData)!
    const tagsViewDataCurrentInfo = tagsViewData.getTagView(id)
    const tagData = tagsViewData.data.mattertags.get(id)
    const pinsViewData = this.engine?.market.getData(PinsViewData)!
    const pinsViewDataCurrentInfo = pinsViewData.pins.get(id)
    if (!tagsViewDataCurrentInfo || !tagData) return
    //给当前的viewInfo赋值
    Object.keys(hotInfo).forEach(key => {
      //避免前端传入其他数据导致影响渲染
      if (key === "anchorPosition" || key === "stemNormal") return

      const value = hotInfo[key]
      //给tagobj赋值 避免后续引擎逻辑恢复成改之前的
      if (key === "color") {
        tagData[key] = new Color(value)
      } else if (key === "stemEnabled") {
        tagData["stemVisible"] = value
      } else if (key === "stemNormal") {
        tagData["stemVector"] = value
      } else if (key === "stemLength") {
        tagData["stemHeight"] = value
      } else {
        tagData[key] = value
      }
      //给tagview赋值 方便传入值到pin
      tagsViewDataCurrentInfo[key] = value
      //给render的值赋值-- 可能用不上
      pinsViewDataCurrentInfo[key] = value
      //渲染用到的值
      const pinsModule = this.engine?.getModuleBySymbolSync(PinsSymbol)
      const renderInfo = pinsModule?.pinRenderer?.idToMesh?.get(id)
      //icon大小,是否显示线段
      if (["iconSize", "stemEnabled", "stemLength", "color", "showTitle"].includes(key)) {
        renderInfo[key] = value
      }
      //改变文字
      if (key === "label") {
        renderInfo.changeText(value)
      }
      //改变贴图
      if (key === "iconUrl") {
        renderInfo.changeIcon(value)
      }
    })
  }

  //获取热点列表
  getMattertags() {
    const tagsViewData = this.engine?.market.getData(TagsViewData)!
    let list: IMattertagSaveData[] = []
    tagsViewData.tagViewsMap.forEach(e => {
      const info = {
        assetType: e.assetType || AssetTypes.hotPoint, //当前热点的类型
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
      list.push(info)
    })
    return list
  }

  toHotById(id) {
    const tagsViewData = this.engine?.market.getData(TagsViewData)!
    const tagsViewDataCurrentInfo = tagsViewData.getTagView(id)
    this.engine?.commandBinder.issueCommand(
      new FocusOnPinInsideCommand({
        pinPosition: tagsViewDataCurrentInfo,
        transition: 2
      })
    )
  }
}
