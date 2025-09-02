import { Vector3 } from "three"
import { MoveToSweepCommand } from "../command/navigation.command"
import { ModifySweepNeighborsCommand, ToggleSweepCommand } from "../command/sweep.command"
import { SnapshotCategory } from "../const/50090"
import { TransitionTypeList } from "../const/64918"
import { ModelMeshSymbol, NavigationSymbol, PucksSymbol, SnapshotsEditorSymbol, WorkShopSweepEditSymbol } from "../const/symbol.const"
import Engine from "../core/engine"
import { FloorsData } from "../data/floors.data"
import { StartLocationViewData } from "../data/start.location.view.data"
import { SweepsData } from "../data/sweeps.data"
import { SweepsViewData } from "../data/sweeps.view.data"
import { SnapshotsSerialize } from "../modules/snapshotsData.module"
import {ColliderMesh} from './../webgl/sweepPuck.render'

export class SweepInterface {
  engine: Engine | null = null
  constructor() {}
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {}
  //显示隐藏点位
  toggleVisibility(enabled: boolean, ...sweepIds: string[]) {
    this.engine?.commandBinder.issueCommand(new ToggleSweepCommand(enabled, ...sweepIds))
  }
  //激活点位编辑
  toggleEditing(active: boolean) {
    this.engine?.getModuleBySymbolSync(WorkShopSweepEditSymbol)?.activate(active)
  }
  get data() {
    const data = this.engine?.market.tryGetData(SweepsData)
    const o: any[] = []
    data?.iterate(n => {
      const { id, index, neighbours, name, floorId, floorPosition, roomId, rotation, enabled, vrenabled, alignmentType, placementType, uuid } = n
      o.push({ id, index, neighbours, name, floorId, floorPosition, roomId, rotation, enabled, vrenabled, alignmentType, placementType, uuid })
    })
    return o
  }
  //点位移动
  moveTo(sweep: string) {
    return this.engine?.commandBinder.issueCommand(
      new MoveToSweepCommand({
        sweep,
        transitionTime: 500,
        transition: TransitionTypeList.FadeToBlack
      })
    )
  }
  //创建当前点位快照
  createSnapshot() {
    const snapshotsEditorModule = this.engine?.getModuleBySymbolSync(SnapshotsEditorSymbol)
    return snapshotsEditorModule!.createSnapshot(SnapshotCategory.USER)
  }
  //创建开始点位
  createStartLocal() {
    const serialize = new SnapshotsSerialize()
    const snapshot = this.createSnapshot()
    const floorsData = this.engine?.market.getData(FloorsData)!
    return serialize.serialize(snapshot, { floorsData })
  }
  enable(sweepIds: string[]) {
    const sweepData = this.engine?.market.tryGetData(SweepsData)!
    const sweepViewData = this.engine?.market.tryGetData(SweepsViewData)!
    for (const t of sweepIds) toggleEnable(t, !0, sweepData, sweepViewData)
  }
  disable(sweepIds: string[]) {
    const sweepData = this.engine?.market.tryGetData(SweepsData)!
    const sweepViewData = this.engine?.market.tryGetData(SweepsViewData)!
    for (const t of sweepIds) toggleEnable(t, !1, sweepData, sweepViewData)
  }
  //添加临界点
  async addNeighbors(sweepId: string, toAdd: string[]) {
    const sweepData = this.engine?.market.tryGetData(SweepsData)!
    const n = sweepData.getSweep(sweepId)
    await this.engine?.commandBinder.issueCommand(new ModifySweepNeighborsCommand(n.id, toAdd))
    return sweepData.getSweep(sweepId).neighbours
  }
  //删除临界点
  async removeNeighbors(sweepId: string, toRemove: string[]) {
    const sweepData = this.engine?.market.tryGetData(SweepsData)!
    const n = sweepData.getSweep(sweepId)
    await this.engine?.commandBinder.issueCommand(new ModifySweepNeighborsCommand(n.id, [], toRemove))
    return sweepData.getSweep(sweepId).neighbours
  }
  //是否是初始相机位
  isStartSweep(sweepId: string) {
    const data = this.engine?.market.getData(StartLocationViewData)
    return !!data?.isStartLocation(sweepId)
  }
  toggleNearSweep(enable: boolean) {
    const pucksModule = this.engine?.getModuleBySymbolSync(PucksSymbol)
    pucksModule?.toggleNearSweep(enable)
  }
  async nearToSweep(position: Vector3) {
    const navigation = this.engine?.getModuleBySymbolSync(NavigationSymbol)
    navigation?.navigationPoint.goToNearestSweep(position)
  }

  //算所有点位的mark位置（主要是高度未知）
  async rayFloorMark() {
    const sweepsData = await this.engine?.market.waitForData(SweepsData)
    const { raycasterModule } = await this.engine?.getModuleBySymbol(ModelMeshSymbol)!
    const { renderer: SweepPuckRender } = await this.engine?.getModuleBySymbol(PucksSymbol)!
    console.log(SweepPuckRender, "获取到的mark点模块")
    const info: Record<string, { x: number; y: number; z: number }> = {}
    if (!sweepsData) return info
    sweepsData.sweepList.forEach(sweepObject => {
      const origin = new Vector3().copy(sweepObject.position)
      const dir = new Vector3(0, -1, 0)
      let pointInfo = raycasterModule.picking.cast(origin, dir)[0]

      if(pointInfo.object instanceof ColliderMesh){
        pointInfo = raycasterModule.picking.cast(origin, dir)[1]
      }

      const position = pointInfo.point.clone()

      position.y += 0.05

      //如果大于1000 位置是相机位往下减去1.6m 兼容异常情况
      if(Math.abs(position.y)>=1000){
        position.y = 0.05
        // position.y = origin.y-1.6
      }

      SweepPuckRender.sweepToMesh[sweepObject.id].position.copy(position)
      sweepObject.floorPosition.copy(position)
      info[sweepObject.id] = {
        x: position.x,
        y: -position.z,
        z: position.y
      }
    })
    return info
  }

  //算邻接点
  async getNeighbors() {
    // console.log('进入即调用')
    const sweepsData = await this.engine?.market.waitForData(SweepsData)
    const { raycasterModule } = await this.engine?.getModuleBySymbol(ModelMeshSymbol)!
    const nearbyIndexsMap: Record<number, { links: number[] }> = {}
    if (!sweepsData) return nearbyIndexsMap

    const nearbyIDsMap: Record<string, { links: string[] }> = {}

    for (const obj of sweepsData.sweepMap) {
      const nearbyIndexs: number[] = []
      const nearbyIDs: string[] = []
      for (const otherObj of sweepsData.sweepMap) {
        if (obj.id !== otherObj.id) {
          const dist = obj.position.distanceTo(otherObj.position)
          //距离
          // const distEnabled = dist <= 10

          // 计算两个点之间的向量
          const vector = obj.position.clone().sub(otherObj.position)
          // 计算水平距离（X和Z坐标的差异）
          const horizontalDistance = Math.sqrt(vector.x * vector.x + vector.z * vector.z)
          // 计算垂直距离（Y坐标的差异）
          const verticalDistance = Math.abs(vector.y)

          //水平距离10m内 垂直距离2m内
          const distEnabled = horizontalDistance <= 10 && verticalDistance <= 2

          //楼层-不考虑
          const floorEnabled = true
          if (distEnabled && floorEnabled) {
            // 10米以内
            //遮挡
            const origin = obj.position.clone()
            const dir = otherObj.position.clone().sub(origin).normalize()
            const pointInfo = raycasterModule.picking.cast(origin, dir)[0]
            const modelDistance = pointInfo.distance
            if (dist < modelDistance) {
              //当两点间的距离小于与场景模型碰撞的距离 表示两点之间没有障碍
              //当点开邻接点功能时 会出现小圆球 小圆球外边缘(name:DrawSphere)与点的碰撞距离肯定小于中心点与点的距离 所以无法进入此判断
              //不过调用此功能的时候是自动调用 并不会进入邻接点功能再调用 故先不处理 需要处理的时候判断过滤掉小圆球外边缘(name:DrawSphere)即可
              nearbyIndexs.push(otherObj.index)
              nearbyIDs.push(otherObj.id)

              // obj.neighbours.push(otherObj.id)
            }
          }
        }
      }
      nearbyIndexsMap[obj.index] = {
        links: nearbyIndexs
      }
      nearbyIDsMap[obj.id] = {
        links: nearbyIDs
      }
    }
    //首次更新所有邻接点的渲染
    Object.keys(nearbyIDsMap).forEach(key => {
      sweepsData.sweepMap.get(key).neighbours = nearbyIDsMap[key].links
    })
    return nearbyIndexsMap
  }
}
function toggleEnable(e: string, enabled: boolean, n: SweepsData, a: SweepsViewData) {
  a.setVisible(e, enabled)
  const o = n.getSweep(e)
  o.enabled = enabled
  o.commit()
}
