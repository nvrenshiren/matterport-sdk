import rulerSweep from "./ruler.sweep"
import { randomString } from "../utils/func.utils"

export default rulerSweep.floors.map(n => {
  return {
    id: "rulerFloor_ID",
    meshId: 0,
    classification: "",
    label: `Floor ${n.index + 1}`,
    sequence: n.index,
    dimensions: {
      areaFloor: 0,
      units: "imperial"
    }
  }
})
