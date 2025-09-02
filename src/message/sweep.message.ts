import { Message } from "../core/message"
import { AlignmentType, PlacementType } from "../object/sweep.object"
import { Vector3 } from "three"

import { SweepLinkItem } from "../modules/sweepPortalMesh.module"
import { SweepObject } from "../object/sweep.object"
export class SweepDataMessage extends Message {
  /**
   * 点位变化消息
   *
   * @param toSweep 终止点位ID
   * @param fromSweep 起始点位ID
   * @param timestamp 时间戳
   */
  fromSweep?: string
  toSweep: string
  timestamp: number
  constructor(e: string, t?: string) {
    super()
    this.fromSweep = t
    this.toSweep = e
    this.timestamp = Date.now()
  }
}
export class MoveToSweepBeginMessage extends SweepDataMessage {}
export class EndMoveToSweepMessage extends SweepDataMessage {
  alignmentType: AlignmentType
  placementType: PlacementType
  constructor(e: string, t: AlignmentType, n: PlacementType, i?: string) {
    super(e, i)
    this.alignmentType = t
    this.placementType = n
  }
}
export class HandlePuckClickedMessage extends Message {
  /**
   * 点位点击事件
   *
   * @param sweepId 点位ID
   * @param sweepIndex 点位索引
   * @param totalSweeps 总点位数
   */
  sweepId: string
  sweepIndex: number
  totalSweeps: number
  constructor(e: string, t: number, n: number) {
    super()
    this.sweepId = e
    this.sweepIndex = t
    this.totalSweeps = n
  }
}
export class HandlePuckHoverMessage extends Message {
  /**
   * 点位滑过消息
   *
   * @param sweepId 点位ID
   * @param hovered 是否悬停
   */
  sweepId: string
  hovered: boolean
  constructor(e: string, t: boolean) {
    super()
    this.sweepId = e
    this.hovered = t
  }
}
export class RestrictSweepsSetMessage extends Message {
  sweepIds: string[]
  constructor(e: string[]) {
    super()
    this.sweepIds = e
  }
}
export class RestrictedSweepsMessage extends Message {
  constructor() {
    super()
  }
}
export class UnalignedRotateStartMessage extends Message {
  sweepId: string
  constructor(e: string) {
    super()
    this.sweepId = e
  }
}
export class UnalignedRotateMessage extends Message {
  sweepId: string
  orientation: number
  deltaAngle: number
  /**
   *
   * @param e 点位ID
   * @param t 方向
   * @param i 角度增量
   */
  constructor(e: string, t: number, i: number) {
    super()
    this.sweepId = e
    this.orientation = t
    this.deltaAngle = i
  }
}
export class UnalignedRotateEndMessage extends Message {
  sweepId: string
  constructor(e: string) {
    super()
    this.sweepId = e
  }
}
export class UnalignedPlacedMessage extends Message {
  sweepId: string
  position: number
  constructor(e: string, t: number) {
    super()
    this.sweepId = e
    this.position = t
  }
}
export class UnalignedUnplacedMessage extends Message {
  sweepId: string
  constructor(e: string) {
    super()
    this.sweepId = e
  }
}
export class ScanVisibilityModifiedMessage extends Message {
  sweepId: string
  numSweeps: number
  numDisabledSweeps: number
  enabled: boolean
  batchMessage: boolean
  /**
   * 扫描点可见度
   * @param e 点位ID
   * @param t 点位个数
   * @param n 禁用点位个数
   * @param i 是否启用
   * @param s 是否批量发送消息，默认为false
   */
  constructor(e: string, t: number, n: number, i: boolean, s = !1) {
    super()
    this.sweepId = e
    this.numSweeps = t
    this.numDisabledSweeps = n
    this.enabled = i
    this.batchMessage = s
  }
}
export class UnalignedMovedMessage extends Message {
  sweepId: string
  toPosition: Vector3
  fromPosition: Vector3
  /**
   *
   * @param e 点位ID
   * @param t 目标位置
   * @param n 起始位置
   */
  constructor(e: string, t: Vector3, n: Vector3) {
    super()
    this.sweepId = e
    this.toPosition = t
    this.fromPosition = n
  }
}

export class MeshToDataMapMessage extends Message {
  toSweep: SweepObject
  toExterior: boolean
  fromInterior: boolean
  meshPosition: Vector3
  constructor(e: SweepLinkItem) {
    super()
    this.toSweep = e.toSweep
    this.toExterior = e.toExterior
    this.fromInterior = e.fromInterior
    this.meshPosition = e.position
  }
}
export class PortalHoverMessage extends Message {
  hovered: boolean
  constructor(e: boolean) {
    super()
    this.hovered = e
  }
}
export class SelectSweepViewDataMessage extends Message {
  sweepId: string
  selected: boolean
  constructor(e: string, t: boolean) {
    super()
    this.sweepId = e
    this.selected = t
  }
}
export class PinNumbererMessage extends Message {
  sweepId: string
  pinIndex: number
  placed: boolean
  constructor(e: string, t: number, i: boolean) {
    super()
    this.sweepId = e
    this.pinIndex = t
    this.placed = i
  }
}
