import { lsGetItem } from "../utils/localstorage.utils"
const s = 54e5
const r = 1
export const BlurPipelineKey = "blur_pipeline"
export const BlurMeshKey = "blur_mesh"
export const BlurChunksKey = "blur_chunks",
  c = lsGetItem("mp/test-max-blurs-limit", 100),
  d = [
    {
      size: 256,
      sigma: 5
    },
    {
      size: 128,
      sigma: 5
    },
    {
      size: 64,
      sigma: 5
    },
    {
      size: 32,
      sigma: 5
    }
  ]
export const Dr = c
export const TW = d
export const U_ = r
export const gJ = s
