import { RoomMesh } from "./roomMesh"
export const isRoomMesh = t => !!t && t instanceof RoomMesh
export const RoomMeshCheck = {
  hasMeshGroup: t => "object" == typeof t && !!t && "meshGroup" in t,
  hasMeshSubgroup: t => "object" == typeof t && !!t && "meshSubgroup" in t,
  isRoomMesh,
  isVisibleRoomMesh: t => isRoomMesh(t) && t.raycastEnabled && t.visible
}
