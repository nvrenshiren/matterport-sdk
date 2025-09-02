import { TextParser } from "../other/52528"
import { AnnotationGrouping } from "../const/63319"
import { SelectSearchResultCommand } from "../command/searchQuery.command"
import { CommandBinder } from "../core/commandBinder"
import { ISubscription } from "../core/subscription"
import { LayersData } from "../data/layers.data"
const textParser = new TextParser({})
export class BaseParser {
  parentId?: string
  commandBinder: CommandBinder
  layersData: LayersData
  dataTypeGroup: any
  textParser: TextParser
  enabled: boolean
  bindings: ISubscription[]
  dateBucket: any
  floorId: string
  roomId: string
  typeId: string
  layerId: string
  id: string

  constructor(e, t, i) {
    this.commandBinder = e
    this.layersData = t
    this.dataTypeGroup = i
    this.textParser = textParser
    this.enabled = !0
    this.bindings = []
  }
  getGroupingId(e) {
    switch (e) {
      case AnnotationGrouping.TYPE:
        return this.getTypeId()
      case AnnotationGrouping.FLOOR:
        return this.getFloorId()
      case AnnotationGrouping.ROOM:
        return this.getRoomId()
      case AnnotationGrouping.LAYER:
        return this.getLayerGroupId()
      case AnnotationGrouping.DATE:
        return this.dateBucket
    }
  }
  getFloorId() {
    return this.floorId
  }
  getRoomId() {
    return this.roomId
  }
  getDateBucket() {
    return this.dateBucket
  }
  getTypeId() {
    return this.typeId
  }
  supportsBatchDelete() {
    return !1
  }
  supportsLayeredCopyMove() {
    return !1
  }
  getLayerGroupId() {
    const i = this.layersData?.getBaseLayerId()
    const n = this.layersData?.getViewLayerId()
    return this.layerId && n && this.layerId === i ? n : this.layerId
  }
  isLayerVisible() {
    return !this.layersData || !this.layerId || this.layersData.layerVisible(this.layerId)
  }
  onSelect(e?, t?, i?) {
    this.commandBinder.issueCommand(new SelectSearchResultCommand(this.id, this.typeId))
  }
  registerBindings() {}
  cancelBindings() {
    this.bindings.forEach(e => e.cancel())
  }
}
