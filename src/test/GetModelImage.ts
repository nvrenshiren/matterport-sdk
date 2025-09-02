import { baseRes } from "@ruler3d/antd"
import { functionCommon, requestCommon } from "@ruler3d/common"

export default (tempId, edit) => {
  return new Promise<any>(resolve => {
    const url = edit ? `/v1/m/template/edit/${tempId}/camera/default/snapshots` : `/scene-portal/template/${tempId}/camera/default/snapshots`

    requestCommon
      .get<baseRes<any>>({
        url: functionCommon.requestHost("api") + url
      })
      .then(res => {
        if (!res.data) {
          resolve(null)
          return
        }
        const { id, thumb, position, quaternion, zoom, createTs, updateTs, renderId } = res.data
        resolve({
          id,
          label: "Entryway",
          classification: null,
          category: "snapshot",
          height: 3186,
          width: 5664,
          created: createTs,
          modified: updateTs,
          status: "available",
          // filename: "Entryway.jpg",
          format: "image",
          // url: "/images/headset-quest-2.png",
          resolutions: ["icon", "thumbnail", "preview", "web", "presentation", "original"],
          type: "photo2D",
          origin: "user",
          validUntil: "null",
          thumbnailUrl: thumb,
          presentationUrl: thumb,
          snapshotLocation: {
            viewMode: "panorama",
            position: position,
            rotation: quaternion,
            zoom: zoom,
            floorVisibility: [],
            anchor: {
              id: renderId,
              pano: {
                id: renderId,
                placement: "auto"
              }
            }
          }
        })
      })
  })
}
