import { Vector3 } from "three"

export interface SweepItem {
  skyboxes: SweepSkyboxes
  id: string
  index: number
  enabled: boolean
  vrenabled: boolean
  neighbours: string[]
  floorPosition: Vector3
  floorId: string
  roomId: string
  name: string
  alignmentType: string
  uuid: string
  placementType: string
  position: Vector3
  resolutions: string[]
  rotation: number[]
}

export interface SweepSkyboxes {
  high: SweepBase
  ultrahigh: SweepBase
  standard: SweepBase
  base: SweepBase
}

export interface SweepBase {
  value: SweepValue
  validUntil: string
}

export interface SweepValue {
  tileUrlTemplate: string
  tileResolution: number
  tileCount: number
  urlTemplate?: string
}

export interface SweepsData {
  model: SweepsModel
}

export interface SweepsModel {
  id: string
  locations: SweepsLocation[]
}

export interface SweepsLocation {
  id: string
  index: number
  enabled: boolean
  floor: SweepsFloor | null
  room: SweepsFloor | null
  neighbors: string[]
  tags: string[]
  position: PanoTion
  pano: SweepsPano
}

export interface SweepsFloor {
  id: string
  meshId: number
}

export interface SweepsPano {
  id: string
  sweepUuid: string
  label: string
  placement: string
  source: string
  position: PanoTion
  rotation: PanoTion
  resolutions: string[]
  skyboxes: SweepsSkybox[]
}

export interface PanoTion {
  x: number
  y: number
  z: number
  w?: number
}

export interface SweepsSkybox {
  resolution: string
  status: string
  urlTemplate: null | string
  tileResolution: string
  tileCount: number
  tileUrlTemplate: string
  validUntil: string
}
