import { Message } from "../core/message"
export class ActivitycMessage extends Message {
  durationDollhouse: number
  durationFloorplan: number
  durationInside: number
  mainMode: number
  totalBytesDownloaded: number
  tilesDownloaded: number
  /**
   * @param e dollhouse模式的持续时间
   * @param t floorplan模式的持续时间
   * @param n inside模式的持续时间
   * @param i 主要模式
   * @param s 总共下载的字节数
   * @param r 下载的瓦片数量
   */
  constructor(e: number, t: number, n: number, i: number, s: number, r: number) {
    super()
    this.durationDollhouse = e
    this.durationFloorplan = t
    this.durationInside = n
    this.mainMode = i
    this.totalBytesDownloaded = s
    this.tilesDownloaded = r
  }
}
