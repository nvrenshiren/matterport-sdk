export interface ModelDetailsData {
  model: ModelDetails
}

export interface ModelDetails {
  id: string
  name: string
  visibility: string
  discoverable: boolean
  state: string
  image?: ModelImage

  options: ModelOptions
  assets: ModelAssets
  lod: ModelLod
}

export interface ModelAssets {
  meshes: ModelMesh[]
  textures: ModelMesh[]
  tilesets: any[]
}

export interface ModelMesh {
  id: string
  status: string
  filename?: string
  format: string
  resolution: string
  url?: string
  validUntil: string

  quality?: string
  urlTemplate?: string
}

export interface ModelImage {
  id: string
  label: string
  classification: null | string
  category: string
  height: number
  width: number
  created: string
  modified: string
  status: string
  filename: string
  format: string
  url: string
  resolutions: string[]
  type: string
  origin: string
  validUntil: string
  thumbnailUrl: string
  presentationUrl: string
  snapshotLocation: ModelSnapshotLocation
}

export interface ModelSnapshotLocation {
  viewMode: string
  position: ModelTion
  rotation: ModelTion
  zoom: number
  floorVisibility: any[]
  anchor: ModelAnchor
}

export interface ModelAnchor {
  id: string
  pano: ModelPano
}

export interface ModelPano {
  id: string
  placement: string
}

export interface ModelTion {
  x: number
  y: number
  z: number

  w?: number
}

export interface ModelLod {
  options: string[]
}

export interface ModelOptions {
  urlBrandingEnabled: boolean
  socialSharingEnabled: boolean
  vrEnabled: boolean
}

export interface ModelContact {
  name: string
  email: string
  phoneNumber: string
}
