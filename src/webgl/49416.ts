import { DataLayerType } from "../const/63319"
import { isBaseView } from "../utils/view.utils"

import { RoomBoundData } from "../data/room.bound.data"
import { LayersData } from "../data/layers.data"
export function shouldDisplayLayer(t: RoomBoundData, e: LayersData, i?: string) {
  const n = t && t.hasRooms()
  const a = i ? e.getLayer(i) : e.getActiveLayer()
  return a && a.layerType === DataLayerType.COMMON_USER_LAYER ? !n : !!isBaseView(e.getCurrentView()) || !n
}
