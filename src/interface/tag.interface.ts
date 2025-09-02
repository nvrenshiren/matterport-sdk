import { Quaternion, Vector3 } from "three"

export interface TagDescription {
  link?: {
    label: string
    url: string
    type: string
    navigationData?: {
      floorVisibility: boolean
      mode: string
      sweepIndex: number
      panoId: string
      position: Vector3
      quaternion: Quaternion
      zoom: number
    }
  }
  text: string
  type: string
}
