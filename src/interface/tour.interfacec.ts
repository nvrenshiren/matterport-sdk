import { ExpiringResource } from "../utils/expiringResource"

export interface TourSnapshots {
  category: string
  sid: string
  thumbnailUrl: ExpiringResource
  imageUrl: ExpiringResource
  name: string
  is360: boolean
  height: number
  width: number
  created: Date
  modified: string
  visionLabel: string
  metadata: Metadata
}

export interface Metadata {
  cameraMode: number
  cameraPosition: CameraPosition
  cameraQuaternion: number[]
  scanId: string
  orthoZoom: number
  ssZoom: number
  floorId: string | null
  floorVisibility: number[]
}

export interface CameraPosition {
  x: number
  y: number
  z: number
}
