import { functionCommon, requestCommon } from "@ruler3d/common"
import { baseRes } from "@ruler3d/antd"

export default (tempId, edit) => {
  return new Promise<any>(resolve => {
    const url = edit ? `/v1/m/template/edit/${tempId}/guided/path` : `/scene-portal/template/${tempId}/guided/path`

    requestCommon
      .get<baseRes<any>>({
        url: functionCommon.requestHost("api") + url
      })
      .then(res => {
        if (!res.data) {
          resolve(null)
          return
        }
        const arr: any[] = []
        res.data.map(item => {
          const { gid, name, playName, thumb, width, height, pathAudio, backOpen, closePrev, metadata, overrides } = item
          const obj = {
            id: gid,
            label: name,
            playName,
            pathAudio,
            backOpen,
            closePrev,
            category: "tour",
            height,
            width,
            created: "2099-02-12T08:07:32Z",
            modified: "2099-02-12T08:07:32Z",
            status: "available",
            filename: "filename.jpg",
            format: "image",
            url: thumb,
            resolutions: ["icon", "thumbnail", "preview", "web", "presentation", "original"],
            type: "photo2D",
            origin: "user",
            validUntil: "2099-08-29T08:38:25Z",
            thumbnailUrl: thumb,
            presentationUrl: thumb,
            snapshotLocation: {
              viewMode: "panorama",
              position: metadata.cameraPosition,
              rotation: metadata.cameraQuaternion,
              zoom: metadata.ssZoom,
              floorVisibility: [
                {
                  id: "rulerFloor_ID",
                  meshId: 1,
                  sequence: 1
                }
              ],
              anchor: {
                id: metadata.scanId,
                pano: {
                  id: metadata.scanId,
                  placement: "auto"
                }
              }
            },
            description: "",
            title: name,
            overrides
          }
          arr.push(obj)
        })
        resolve(arr)
      })
  })
}
