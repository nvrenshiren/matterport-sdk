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
        const { id, position, quaternion, zoom, renderId } = res.data
        resolve([
          {
            id,
            model: {
              image: {
                snapshotLocation: {
                  position: position,
                  rotation: quaternion,
                  zoom,
                  anchor: {
                    id: renderId,
                    pano: {
                      id: renderId,
                      placement: "unplaced"
                    }
                  }
                }
              }
            }
          }
        ])
      })
  })
}
