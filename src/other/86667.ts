import { ContainerData } from "../data/container.data"
function s(e) {
  return (
    e.market.tryGetData(ContainerData)?.size ||
    e.mainDiv?.getBoundingClientRect() || {
      width: window.innerWidth,
      height: window.innerHeight
    }
  )
}

export const O = s
