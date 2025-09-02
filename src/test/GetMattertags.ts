import { functionCommon, requestCommon } from "@ruler3d/common"
import { baseRes } from "@ruler3d/antd"
export default (tempId, edit) => {
  return new Promise(resolve => {
    const url = edit ? `/v1/m/template/edit/${tempId}/ext/obj` : `/scene-portal/template/${tempId}/ext/obj`
    requestCommon
      .get<baseRes<any>>({
        url: functionCommon.requestHost("api") + url
      })
      .then(res => {
        resolve(res.data)
      })
  })
}
