export default async (model: string) => {
  return {
    data: {
      model: {
        id: model,
        name: "",
        visibility: "public",
        discoverable: false,
        state: "active",
        options: {
          urlBrandingEnabled: true,
          socialSharingEnabled: true,
          vrEnabled: true
        },
        assets: {
          meshes: [
            // {
            //   id: rulerSweep[0].model_id,
            //   status: "available",
            //   filename: `${rulerSweep[0].model_id}_50k.dam`,
            //   format: "dam",
            //   resolution: "50k",
            //   url: `https://mo-obs.3dyunzhan.com/scenes/${rulerSweep[0].model_id}/${rulerSweep[0].model_id}_50k.dam`,
            //   validUntil: "2099-08-21T11:13:34Z"
            // }
          ],
          textures: [
            // {
            //   id: "50k-high",
            //   status: "available",
            //   format: "jpg",
            //   resolution: "50k",
            //   quality: "high",
            //   urlTemplate: `https://mo-obs.3dyunzhan.com/scenes/${rulerSweep[0].model_id}/${rulerSweep[0].model_id}_50k_texture_jpg_high/<texture>`,
            //   validUntil: "2099-08-21T11:13:34Z"
            // },
            // {
            //   id: "50k-low",
            //   status: "available",
            //   format: "jpg",
            //   resolution: "50k",
            //   quality: "low",
            //   urlTemplate: `https://mo-obs.3dyunzhan.com/scenes/${rulerSweep[0].model_id}/${rulerSweep[0].model_id}_50k_texture_jpg_low/<texture>`,
            //   validUntil: "2099-08-21T11:13:34Z"
            // }
          ],
          tilesets: [
            // {
            //   status: "available",
            //   tilesetVersion: "1.2.0",
            //   url: "https://cdn-2.matterport.com/models/7dfc15177def4c6a9047ddef9d2a47c0/assets/mesh_tiles/~/tileset.json?t=2-d2c1fc9a12deca6469b9bbe1fc034435f3bec620-1725591475-1&k=models%2F7dfc15177def4c6a9047ddef9d2a47c0%2Fassets%2Fmesh_tiles",
            //   urlTemplate:
            //     "https://cdn-2.matterport.com/models/7dfc15177def4c6a9047ddef9d2a47c0/assets/mesh_tiles/~/<file>?t=2-d2c1fc9a12deca6469b9bbe1fc034435f3bec620-1725591475-1&k=models%2F7dfc15177def4c6a9047ddef9d2a47c0%2Fassets%2Fmesh_tiles",
            //   validUntil: "2099-09-06T02:57:55Z",
            //   tilesetDepth: 3,
            //   tilesetPreset: "basic2"
            // }
          ]
        },
        lod: {
          options: ["lod2"]
        }
      }
    }
  }
}

export interface ViewInfoRes {
  id: string
  name: string
  owner: ViewInfoOwner
  sceneId: string
  smallMap: string
  description: string
  aliStatic: number
  viewCount: number
  likeCount: number
  startCameraZoom?: number
  enLang: boolean
  lockY?: number
  lockYAngle: number
  access: ViewInfoAccess
  music: ViewInfoMusic
  loading: ViewInfoLoading
  buttonPower: ViewInfoButtonPower
  contact: ViewInfoContact
  permission: ViewInfoPermission
}

export interface ViewInfoAccess {
  password?: string
  status: number
}

export interface ViewInfoButtonPower {
  birdEye: boolean
  comment: boolean
  likes: boolean
  logo: boolean
  share: boolean
  smallMap: boolean
  visualAngle: boolean
  zoom: boolean
  floor: boolean
}

export interface ViewInfoContact {
  address: string
  email: string
  name: string
  phone: string
  wxQrcode: string
}

export interface ViewInfoLoading {
  pcCover: string
  pcVideo: string
  mobileCover: string
  mobileVideo: string
}

export interface ViewInfoMusic {
  autoPlay: boolean
  closed?: boolean
  musicFile: string
  name: string
}

export interface ViewInfoOwner {
  nickname: string
  avatar: string
  email: string
}

export interface ViewInfoPermission {
  headerLink?: string
  showDescription: boolean
  showName: boolean
}

// export default async (model: string) => {
//   const { data } = await requestCommon.get<{ data: ViewInfoRes }>({
//     url: `${functionCommon.requestHost("api")}/scene-portal/template/${model}/viewInfo.json`
//   })
//   return {
//     data: {
//       model: {
//         id: data.id,
//         created: "",
//         name: data.name,
//         organization: null,
//         visibility: "public",
//         discoverable: false,
//         state: "active",
//         publication: {
//           published: true,
//           summary: data.description,
//           contact: {
//             ...data.contact,
//             name: data.contact.name,
//             email: data.contact.email,
//             phoneNumber: data.contact.phone
//           }
//         },
//         options: {
//           urlBrandingEnabled: true,
//           socialSharingEnabled: true,
//           vrEnabled: true
//         },

//         assets: {
//           meshes: [
//             // {
//             //   id: rulerSweep[0].model_id,
//             //   status: "available",
//             //   filename: `${rulerSweep[0].model_id}_50k.dam`,
//             //   format: "dam",
//             //   resolution: "50k",
//             //   url: `https://mo-obs.3dyunzhan.com/scenes/${rulerSweep[0].model_id}/${rulerSweep[0].model_id}_50k.dam`,
//             //   validUntil: "2099-08-21T11:13:34Z"
//             // }
//           ],
//           textures: [
//             // {
//             //   id: "50k-high",
//             //   status: "available",
//             //   format: "jpg",
//             //   resolution: "50k",
//             //   quality: "high",
//             //   urlTemplate: `https://mo-obs.3dyunzhan.com/scenes/${rulerSweep[0].model_id}/${rulerSweep[0].model_id}_50k_texture_jpg_high/<texture>`,
//             //   validUntil: "2099-08-21T11:13:34Z"
//             // },
//             // {
//             //   id: "50k-low",
//             //   status: "available",
//             //   format: "jpg",
//             //   resolution: "50k",
//             //   quality: "low",
//             //   urlTemplate: `https://mo-obs.3dyunzhan.com/scenes/${rulerSweep[0].model_id}/${rulerSweep[0].model_id}_50k_texture_jpg_low/<texture>`,
//             //   validUntil: "2099-08-21T11:13:34Z"
//             // }
//           ],
//           tilesets: [
//             // {
//             //   status: "available",
//             //   tilesetVersion: "1.2.0",
//             //   url: "https://cdn-2.matterport.com/models/7dfc15177def4c6a9047ddef9d2a47c0/assets/mesh_tiles/~/tileset.json?t=2-d2c1fc9a12deca6469b9bbe1fc034435f3bec620-1725591475-1&k=models%2F7dfc15177def4c6a9047ddef9d2a47c0%2Fassets%2Fmesh_tiles",
//             //   urlTemplate:
//             //     "https://cdn-2.matterport.com/models/7dfc15177def4c6a9047ddef9d2a47c0/assets/mesh_tiles/~/<file>?t=2-d2c1fc9a12deca6469b9bbe1fc034435f3bec620-1725591475-1&k=models%2F7dfc15177def4c6a9047ddef9d2a47c0%2Fassets%2Fmesh_tiles",
//             //   validUntil: "2099-09-06T02:57:55Z",
//             //   tilesetDepth: 3,
//             //   tilesetPreset: "basic2"
//             // }
//           ]
//         },
//         lod: {
//           options: ["lod2"]
//         }
//       }
//     }
//   }
// }
