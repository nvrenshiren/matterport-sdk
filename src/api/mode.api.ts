import { EventCommon } from "@ruler3d/common"
import { ChangeViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import Engine from "../core/engine"
import { SweepsData } from "../data/sweeps.data"
import { EndMoveToSweepMessage } from "../message/sweep.message"
import { AlignmentType } from "../object/sweep.object"
import { ViewmodeData } from "../data/viewmode.data"
import { ViewModes } from "../utils"
import { StartViewmodeChange, ViewModeChangeAnalyticsMessage } from "../message/viewmode.message"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { TransitionTypeList } from "../const/64918"
import { ModelMeshSymbol } from "../const/symbol.const"
import { Box3, BoxGeometry, MeshBasicMaterial, Vector3,Mesh,AmbientLight, Color } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

function isSweepAligned(data?: SweepsData, id?: string) {
  if (!data || !id) return !1
  const n = id && data.getSweep(id)
  return !!n && n.alignmentType === AlignmentType.ALIGNED
}
declare global {
  namespace eventList {
    interface data {
      "viewmode.changeend": (mode: [string | undefined | ViewModes, string | ViewModes]) => void
      "viewmode.changestart": (mode: [ViewModes | undefined, ViewModes]) => void
    }
  }
}
export class ModeInterface {
  engine: Engine | null = null
  constructor() { }
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {
    // this.engine?.subscribe(EndMoveToSweepMessage, e => {
    //   const sweepData = this.engine?.market.getData(SweepsData)!
    //   isSweepAligned(sweepData, e.fromSweep) !== isSweepAligned(sweepData, e.toSweep) &&
    //     EventCommon.EventBus.emit("viewmode.changeend", [e.fromSweep, e.toSweep])
    // })
    this.engine?.subscribe(StartViewmodeChange, e => {
      EventCommon.EventBus.emit("viewmode.changestart", [e.fromMode, e.toMode])
    })
    // this.engine?.subscribe(EndSwitchViewmodeMessage, e => {
    //   EventCommon.EventBus.emit("viewmode.changeend", [e.fromMode, e.toMode])
    // })
    this.engine?.subscribe(ViewModeChangeAnalyticsMessage, e => {
      EventCommon.EventBus.emit("viewmode.changeend", [e.fromMode, e.toMode])
    })
  }
  async moveTo(mode: ViewModeCommand, options: ChangeViewmodeCommand["payload"]["pose"] & { transition?: TransitionTypeList } = {}) {
    try {
      let t = options.transition || TransitionTypeList.Interpolate
      await this.engine?.commandBinder.issueCommand(
        new ChangeViewmodeCommand(mode, t, { position: options.position, rotation: options.rotation, zoom: options.zoom })
      )
      return mode
    } catch (t) {
      throw Error(t)
    }
  }

  async addWaterModel(modelUrl: string) {
    return new Promise(async (r, j) => {
      const { webglScene } = await this.engine?.getModuleBySymbol(ModelMeshSymbol)!
      // const {bounds} = webglScene.scene.children.find(child=>child.name === 'FallbackMesh')
      new GLTFLoader().load(modelUrl, (gltf) => {
        setTimeout(() => {
          const scene = gltf.scene
          scene.scale.multiplyScalar(15);
          ;(scene.children[0] as any).material.color = new Color("#A7A7A7")

          ;(window as any).setColor = (color)=>{
            ;(scene.children[0] as any).material.color = new Color(color)
          }

          const FallbackMesh = webglScene.scene.children.find(child=>child.name ==="FallbackMesh")!
          const box3 = new Box3().setFromObject(FallbackMesh)
          const center = box3.getCenter(new Vector3());
          const size = box3.getSize(new Vector3());
          
          const mesh = new Mesh(new BoxGeometry(1,1,1),new MeshBasicMaterial({color:'red'}))
          // webglScene.scene.add(mesh)

          //n的3次方个
          const divisions = 3; // 每个轴的分割数（8等分为2x2x2）
          const subBoxSize = new Vector3(
            size.x / divisions,
            size.y / divisions,
            size.z / divisions
          );

          const subBoxes:Vector3[] = [];
          for (let x = 0; x < divisions; x++) {
            for (let y = 0; y < divisions; y++) {
              for (let z = 0; z < divisions; z++) {
                // 子空间的最小角坐标
                const min = new Vector3(
                  box3.min.x + x * subBoxSize.x,
                  box3.min.y + y * subBoxSize.y,
                  box3.min.z + z * subBoxSize.z
                );
                // 子空间的最大角坐标
                const max = new Vector3(
                  min.x + subBoxSize.x,
                  min.y + subBoxSize.y,
                  min.z + subBoxSize.z
                );
                // 创建子空间Box3并计算中心点
                const subBox = new Box3(min, max);
                const subCenter = subBox.getCenter(new Vector3());
                subBoxes.push(subCenter);
              }
            }
          }

          subBoxes.forEach((subCenter) => {
            const clone = scene.clone(); // 克隆模型
            clone.position.copy(subCenter); // 移动到子空间中心
            webglScene.scene.add(clone); // 添加到场景
          });

          //添加全局光
          const ambient = new AmbientLight('#fff',1)
          webglScene.scene.add(ambient)

        }, 1000)
      })
    })


  }

  ViewModeCommand = ViewModeCommand
}
