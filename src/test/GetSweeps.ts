import { functionCommon, requestCommon } from "@ruler3d/common"
import { SweepsLocation } from "../interface/sweep.interface"
import GetFloors from "./GetFloors"
const resolutions = ["L0", "L1", "L2", "L4"]
const resolutionsMap = {
  L0: "low",
  L1: "high",
  L2: "2k",
  L4: "4k"
}
const tileCountMap = {
  L0: 1,
  L1: 2,
  L2: 4,
  L4: 8
}
// const ids = rulerSweep.locations.reduce((prev, current) => {
//   prev[current.index] = current.id
//   return prev
// }, [] as string[])

export default (tempId, edit) => {
  return new Promise<SweepsLocation[]>(resolve => {
    Promise.all([
      edit
        ? requestCommon.get<any>({ url: `${functionCommon.requestHost("api")}/v1/m/template/edit/${tempId}/models/sweeps` })
        : requestCommon.get<any>({ url: `${functionCommon.requestHost("api")}/scene-portal/template/${tempId}/models/sweeps` }),
      requestCommon.get<any>({ url: `${functionCommon.requestHost("api")}/scene-portal/template/${tempId}/locations` })
    ]).then(([res, option]) => {
      const { locations, neighbors, sceneId = tempId, markerStatus = false } = res

      // const neighbors2 = JSON.parse('{"0":{"links":[1,2,20,29,30,31,32,33,34]},"1":{"links":[0,2,29,30,31,32,33]},"2":{"links":[0,1,3,20,29,30,31,32,33,34]},"3":{"links":[2,4,5,6,7,8,9,10,20,31,32,33,34]},"4":{"links":[3,5,6,7,8,9,10,29,30,33,34]},"5":{"links":[3,4,6,7,8,9,10,20,31,32,33,34]},"6":{"links":[3,4,5,7,8,9,31,32,33]},"7":{"links":[3,4,5,6,8,9,33]},"8":{"links":[3,4,5,6,7,9,31,32,33,34]},"9":{"links":[3,4,5,6,7,8,10,12,13,14,15,17,18,32,33,34]},"10":{"links":[3,4,5,9,12,16,32,33,34]},"11":{"links":[12,13,14,16,17]},"12":{"links":[9,10,11,13,14,15,16,17,18,19]},"13":{"links":[9,11,12,14,15,16,17,18,19,21]},"14":{"links":[9,11,12,13,16,17,18,19,21]},"15":{"links":[9,12,13,16,17,18,19,21,23]},"16":{"links":[10,11,12,13,14,15,17,19,23]},"17":{"links":[9,11,12,13,14,15,16,18,19,21,23]},"18":{"links":[9,12,13,14,15,17,19,21,22,23,24,25,26]},"19":{"links":[12,13,14,15,16,17,18,21,22,23,24,25,27,28]},"20":{"links":[0,2,3,5,29,30,31,32,33,34]},"21":{"links":[13,14,15,17,18,19,22,23,24,26,27,28]},"22":{"links":[18,19,21,23,24,25,26,27,28]},"23":{"links":[15,16,17,18,19,21,22,24,25,26,27]},"24":{"links":[18,19,21,22,23,25,26,27,28]},"25":{"links":[18,19,22,23,24,26,27,28]},"26":{"links":[18,21,22,23,24,25,27,28]},"27":{"links":[19,21,22,23,24,25,26,28]},"28":{"links":[19,21,22,24,25,26,27]},"29":{"links":[0,1,2,4,20,30,31,32,33,34]},"30":{"links":[0,1,2,4,20,29,31,32,33,34]},"31":{"links":[0,1,2,3,5,6,8,20,29,30,32,33,34]},"32":{"links":[0,1,2,3,5,6,8,9,10,20,29,30,31,33,34]},"33":{"links":[0,1,2,3,4,5,6,7,8,9,10,20,29,30,31,32,34]},"34":{"links":[0,2,3,4,5,8,9,10,20,29,30,31,32,33]}}')

      const ids = locations.reduce((prev, current) => {
        prev[current.index] = current.id
        return prev
      }, [] as string[])

      resolve(
        locations.map(m => {
          const { id, floorIdx, position, markerPosition, rotation, uuid, index, enabled } = m
          // Object.keys(position).forEach(key => {
          //   position[key] *= 1000
          // })
          // Object.keys(markerPosition).forEach(key => {
          //   markerPosition[key] *= 1000
          // })
          const floorItem = GetFloors.find(n => n.sequence === floorIdx)
          return {
            enabled: !option.data.includes(id),
            id,
            index,
            floor: floorItem || null,
            room: null,
            position: markerPosition,
            // neighbors: neighbors2[index]?.links.map(n => ids[n]) || [],
            neighbors: neighbors[index]?.links.map(n => ids[n]) || [],
            // neighbors: ids.filter(i => i !== id),
            tags: ["vr", "JMYDCase"],
            pano: {
              id,
              label: `${index}`,
              placement: "auto",
              position,
              rotation,
              resolutions: resolutions.map(n => resolutionsMap[n]),
              source: "vision",
              sweepUuid: uuid,
              skyboxes: resolutions.map(n => {
                return {
                  resolution: resolutionsMap[n],
                  status: "available",
                  urlTemplate: "",
                  tileResolution: "512",
                  tileCount: tileCountMap[n],
                  tileUrlTemplate: `${functionCommon.getHost("fileHost")}/scenes/${sceneId}/tiles/${index}/${n}_<face>_<x>_<y>.jpg`,
                  validUntil: "2099-12-31T01:27:31.554Z"
                }
              })
            }
          }
        })
      )
    })
  })
}
