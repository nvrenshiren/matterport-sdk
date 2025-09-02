import { functionCommon, requestCommon } from "@ruler3d/common"

export default (tempId, edit) => {
  return new Promise<any[]>(resolve => {
    const url = edit ? `/v1/m/template/edit/${tempId}/guided/path` : `/scene-portal/template/${tempId}/guided/path`
    requestCommon
      .get<any>({
        url: functionCommon.requestHost("api") + url
      })
      .then(res => {
        const arr: any[] = []
        res.data.map(item => {
          const { gid, name, overrides, playName, pathAudio, backOpen, closePrev } = item
          const obj = {
            asset: { id: gid },
            description: "",
            title: name,
            overrides,
            playName,
            pathAudio,
            backOpen,
            closePrev
          }
          arr.push(obj)
        })
        resolve(arr)
      })
  })
}
