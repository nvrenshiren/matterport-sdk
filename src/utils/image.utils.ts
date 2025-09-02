import { RenderTarget } from "../modules/renderToTexture.module"
import { WorkerRun } from "../worker/worker.run"
let s: WorkerRun | null = null

const filpY = (data, width, height) => {
  const start = Date.now()
  // 创建一个新的Uint8Array来存储翻转后的图像数据
  // 注意：这里为了简单起见，我们直接在原数组上操作，但实际应用中最好复制一份
  let newData = new Uint8Array(data)

  // 计算每行像素数据的长度（RGBA，所以每个像素4个字节）
  const rowLength = width * 4

  // 遍历图像的一半（因为我们要交换行）
  for (let y = 0; y < Math.floor(height / 2); y++) {
    // 计算当前行的起始索引和它的对称行的起始索引
    let start1 = y * rowLength
    let start2 = (height - y - 1) * rowLength

    // 交换这两行的数据
    for (let x = 0; x < rowLength; x++) {
      // 使用临时变量来交换值
      let temp = newData[start1 + x]
      newData[start1 + x] = newData[start2 + x]
      newData[start2 + x] = temp
    }
  }

  const end = Date.now()

  console.log(end - start, "翻转花的时间")

  return newData
}

// 假设你有一个Uint8Array类型的图片数据，名为imageData
function downloadImageFromUint8Array(data: Uint8Array, width: number, height: number) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  // const imageData = context!.createImageData(data, width, height)
  const imageData = new ImageData(new Uint8ClampedArray(data), width, height)
  context!.putImageData(imageData, 0, 0)
  const dataURL = canvas.toDataURL("image/jpeg", 0.5)
  return base64ToUint8Array(dataURL)
}

function base64ToUint8Array(base64: string) {
  // 移除Base64字符串中的URL前缀（如果有的话）
  const base64WithoutPrefix = base64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")

  // 对Base64字符串进行解码
  const binaryString = atob(base64WithoutPrefix)

  // 创建一个长度与二进制数据相同的ArrayBuffer
  const len = binaryString.length
  const bytes = new Uint8Array(new ArrayBuffer(len))

  // 将每个字符的ASCII码转换为二进制数据
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes
}

export const SceneCapture = async (e: RenderTarget) => {
  // const i = new Uint8Array(e.width * e.height * 4)
  // e.readRenderTargetData(i)

  // if (!s) {
  //   const e = await import("../worker/jpeg.encode")
  //   s = e.createJpegEncodeWorker()
  // }
  // const r = i.buffer
  // const a = await s.exec(
  //   {
  //     data: r,
  //     width: e.width,
  //     height: e.height,
  //     options: {
  //       quality: 85,
  //       flipY: !0
  //     }
  //   },
  //   [r]
  // )
  // return new Uint8Array(a.data)

  const pixelBuffer: any = new Uint8Array(e.width * e.height * 4) // RGBA格式
  e._renderer.readRenderTargetPixels(e._renderTarget, 0, 0, e.width, e.height, pixelBuffer)
  const data = filpY(pixelBuffer, e.width, e.height)
  //不知道为啥直接返回data没用 必须一道再返回
  const unit8data = downloadImageFromUint8Array(data, e.width, e.height)
  return unit8data
}
export const imageDataToBlob = (e: Uint8Array) =>
  new Blob([e], {
    type: "image/jpeg"
  })
