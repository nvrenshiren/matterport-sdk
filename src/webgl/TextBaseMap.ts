import { EventDispatcher } from "three"
export interface ICanvasConfig {
  text?: string
  maxWidth?: number
  fontSize?: number
  fontFamily?: string
  lineSpacing?: number
  textAlign?: string
  fontBold?: number
  fontStyle?: string
  fillStyle?: string
  canvasPaddingTB?: number
  canvasPaddingLR?: number
  autoWidth?: boolean
  needBg?:boolean
  bgColor?:string
}

export class TextBaseMap extends EventDispatcher {
  protected id: number
  private canvasConfig: ICanvasConfig
  public canvas: HTMLCanvasElement

  constructor(id: number, canvasConfig: ICanvasConfig = {}) {
    super()
    this.id = id

    //canvas画图
    this.canvasConfig = canvasConfig
    this.canvas = this.createMap()
  }

  updateMap(canvasConfig: ICanvasConfig) {
    this.canvasConfig = canvasConfig
    this.canvas = this.createMap()
  }

  createMap() {
    let w = document.getElementById("anchor-canvas" + this.id) as HTMLCanvasElement
    if (!w) {
      w = document.createElement("canvas")
      w.id = "anchor-canvas" + this.id
    }
    this._draw(w)
    return w
  }

  _draw(canvas: HTMLCanvasElement) {
    const ctx: any = canvas.getContext("2d")
    let text = this.canvasConfig.text || "NONAME"
    let maxWidth = this.canvasConfig.maxWidth || 512
    let fontSize = this.canvasConfig.fontSize ? this.canvasConfig.fontSize * 1 : 60
    let fontFamily = this.canvasConfig.fontFamily || "Noto Sans"
    let lineSpacing = this.canvasConfig.lineSpacing || 0
    let textAlign = this.canvasConfig.textAlign || "center"
    let fontBold = this.canvasConfig.fontBold ? 700 : ""
    let fontStyle = this.canvasConfig.fontStyle || "normal"
    let fillStyle = this.canvasConfig.fillStyle || "#ffffff"
    let canvasPaddingTB = this.canvasConfig.canvasPaddingTB || 0
    let canvasPaddingLR = this.canvasConfig.canvasPaddingLR || 0

    // //在进行操作前 将文本属性样式设置好 (所有ctx样式设置需要在canvans画布调整后设置 避免比例出现问题)
    ctx.font = `${fontBold} ${fontStyle}  ${fontSize}px ${fontFamily}`
    // ctx.font = `normal italic  30px serif `;
    ctx.textBaseline = "middle"
    ctx.fillStyle = fillStyle

    if (this.canvasConfig.autoWidth) {
      //自动宽度不换行
      let canvasWidth = ctx.measureText(text).width + canvasPaddingLR * 2
      //首先清空canvas画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let canvasHeight: any = fontSize + canvasPaddingTB * 2
      //防止顶部被截取多加字体的1/5
      canvasHeight = canvasHeight + fontSize / 5
      canvas.setAttribute("width", canvasWidth)
      canvas.setAttribute("height", canvasHeight)

      //创建背景
      if(this.canvasConfig.needBg){
        createBg(ctx, canvas, canvasPaddingLR, canvasPaddingTB,this.canvasConfig.bgColor)
      }
      

      //在进行操作前 将文本属性样式设置好 (所有ctx样式设置需要在canvans画布调整后设置 避免比例出现问题)
      ctx.font = `${fontBold} ${fontStyle}  ${fontSize}px ${fontFamily}`
      ctx.textBaseline = "middle"
      ctx.fillStyle = fillStyle

      let top = fontSize / 2 + canvasPaddingTB
      let left = canvasPaddingLR

      //防止顶部被截取多加字体的1/5
      top = top + fontSize / 5
      ctx.fillText(text, left, top)
    } else {
      //固定宽度自适应高度 换行
      let textLineListInfo = getTextLineListInfo(text, maxWidth - canvasPaddingLR * 2, ctx)
      //首先清空canvas画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      //设置canvas画布的大小
      //自适应宽度
      // let canvasWidth = textLineListInfo.lineMaxWidth + this.canvasPaddingLR * 2 || 10;
      //固定宽度
      let canvasWidth = maxWidth || 512
      let lineNumber = textLineListInfo.textListInfo.length
      let canvasHeight: any = 10
      if (lineNumber > 0) {
        canvasHeight = lineNumber * fontSize + (lineNumber - 1) * fontSize * lineSpacing + canvasPaddingTB * 2
      } else {
        canvasHeight = 10
      }

      //防止顶部被截取多加字体的1/5
      canvasHeight = canvasHeight + fontSize / 5

      canvas.setAttribute("width", canvasWidth as any)
      canvas.setAttribute("height", canvasHeight)

      // // 设置背景色
      // ctx.fillStyle = "blue";
      // // 绘制一个填充整个Canvas的矩形
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      //创建背景
      if(this.canvasConfig.needBg){
        createBg(ctx, canvas, canvasPaddingLR, canvasPaddingTB,this.canvasConfig.bgColor)
      }
      

      //在进行操作前 将文本属性样式设置好 (所有ctx样式设置需要在canvans画布调整后设置 避免比例出现问题)
      ctx.font = `${fontBold} ${fontStyle}  ${fontSize}px ${fontFamily}`
      ctx.textBaseline = "middle"
      ctx.fillStyle = fillStyle

      //重新绘画
      textLineListInfo.textListInfo.forEach((item: { width: number; text: string }, index: number) => {
        //1:没有行距时 top值的系数为2n-1 n为index+1 因为是中线 常量为 1/2的fontSize
        //2:根据需求第一个值不需要加上行距
        let top = (2 * (index + 1) - 1) * (fontSize / 2) + index * fontSize * lineSpacing + canvasPaddingTB
        var left = 0
        if (textAlign === "left") {
          left = 0
        } else if (textAlign === "right") {
          //居中
          left = canvasWidth - item.width - canvasPaddingLR * 2
        } else if (textAlign === "center") {
          //居中
          left = (canvasWidth - item.width - canvasPaddingLR * 2) / 2
        }
        left = left + canvasPaddingLR

        //防止顶部被截取多加字体的1/5
        top = top + fontSize / 5
        ctx.fillText(item.text, left, top)
      })
    }
  }
}

function createBg(ctx: any, canvas: any, canvasPaddingLR: any, canvasPaddingTB: any,bgColorString?:string) {
  // 设置背景颜色
  const bgColor = bgColorString||'rgba(0,0,0,0.5)'
  // 设置圆角半径
  const borderRadius = Math.min(canvasPaddingLR, canvasPaddingTB)
  // 绘制带圆角的矩形
  ctx.beginPath()
  ctx.moveTo(borderRadius, 0)
  ctx.lineTo(canvas.width - borderRadius, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, borderRadius)
  ctx.lineTo(canvas.width, canvas.height - borderRadius)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - borderRadius, canvas.height)
  ctx.lineTo(borderRadius, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - borderRadius)
  ctx.lineTo(0, borderRadius)
  ctx.quadraticCurveTo(0, 0, borderRadius, 0)
  ctx.closePath()
  // 填充背景颜色
  ctx.fillStyle = bgColor
  ctx.fill()
}

//根据用户输入的文字 截取成每一行文字 并返回最长文字的宽度以及每一行的宽度 此函数必须在设置完文字样式后使用 否则不准确
const getTextLineListInfo = (text: string, width: number, ctx: CanvasRenderingContext2D) => {
  //根据换行分割文本
  const textLineFeed = (text: string) => {
    let textList = text.split(/[(\r\n)\r\n]/)
    if (textList.length === 1 && textList[0] === "") {
      return []
    } else {
      return textList
    }
  }
  //根据最大宽度寻找切换断点
  const findBreakPoint = (text: string, width: number, ctx: CanvasRenderingContext2D) => {
    let min = 0
    let max = text.length - 1

    while (min <= max) {
      let middle = Math.floor((min + max) / 2)
      let middleWidth = ctx.measureText(text.substring(0, middle)).width
      let oneCharWiderThanMiddleWidth = ctx.measureText(text.substring(0, middle + 1)).width
      if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
        return middle
      }
      if (middleWidth < width) {
        min = middle + 1
      } else {
        max = middle - 1
      }
    }

    return -1
  }
  //将文本根据自动换行截取成一个数组
  const breakLinesForCanvas = (text: string, width: number) => {
    const result: string[] = []
    let breakPoint = 0
    while ((breakPoint = findBreakPoint(text, width, ctx)) !== -1) {
      result.push(text.substr(0, breakPoint))
      text = text.substr(breakPoint)
    }

    if (text) {
      result.push(text)
    }

    return result
  }

  //获取最终的数组文本 用来绘制的每一行
  //首先根据换行符进行分隔
  let listLineFeed = textLineFeed(text)

  //存储所有行
  let textList: any = []
  //循环listLineFeed数组 看是否每一行超出了最大宽度
  listLineFeed.forEach(text => {
    if (text === "") {
      textList.push(text)
    } else {
      let breakList = breakLinesForCanvas(text, width)
      if (breakList.length === 1) {
        textList.push(breakList[0])
      } else {
        breakList.forEach(text => {
          textList.push(text)
        })
      }
    }
  })
  //由于有左对齐中对齐 右对齐 所有需要知道每一行的宽度 以及 最大的宽度
  let widthList: any = []
  let textListInfo = textList.map((item: string) => {
    let textWidth = ctx.measureText(item).width
    widthList.push(Math.ceil(textWidth))
    return {
      text: item,
      width: Math.ceil(textWidth)
    }
  })
  return {
    textListInfo,
    lineMaxWidth: widthList.length === 0 ? 0 : Math.max(...widthList)
  }
}

export function resolveText(canvas: HTMLCanvasElement, text: string, font: string, margin: number): [CanvasRenderingContext2D, string] {
  const fontSize = 128

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Canvas 2D context is not supported.")
  }

  context.font = "700 " + fontSize + "px " + font

  let content: string = text
  let width: number
  for (let k = text.length - 1; ; --k) {
    width = context.measureText(content).width

    width += 2 * margin

    if (1024 >= width) {
      break
    }

    content = text.substring(0, k) + "..."
  }

  canvas.width = width
  canvas.height = 1.5 * fontSize

  const updatedContext = canvas.getContext("2d") as CanvasRenderingContext2D
  updatedContext.font = "700 " + fontSize + "px " + font

  return [updatedContext, content]
}
