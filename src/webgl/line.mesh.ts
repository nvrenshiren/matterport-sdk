import { BufferGeometry, InstancedInterleavedBuffer, InterleavedBufferAttribute, Material, Mesh, Vector3 } from "three"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LinePart } from "../const/54702"
import { LineMaterial } from "./line.material"

export class LineMesh<B extends BufferGeometry = LineGeometry, M extends Material = LineMaterial> extends Mesh<B, M> {
  declare type: string
  declare part: LinePart
  computeLineDistances: () => this
  instanceDistanceBuffer: InstancedInterleavedBuffer
  constructor(geometry: LineGeometry, material: LineMaterial) {
    super()
    this.type = "Line"
    this.part = LinePart.line
    this.computeLineDistances = (() => {
      const startVec = new Vector3()
      const endVec = new Vector3()
      return () => {
        const geometry = this.geometry
        const startBuf = geometry.attributes.instanceStart as InterleavedBufferAttribute
        const endBuf = geometry.attributes.instanceEnd as InterleavedBufferAttribute
        const newDistanceBuf = new Float32Array(2 * startBuf.data.count)
        for (let i = 0, j = 0, count = startBuf.data.count; i < count; i++, j += 2) {
          startVec.fromBufferAttribute(startBuf, i)
          endVec.fromBufferAttribute(endBuf, i)
          newDistanceBuf[j] = 0 === j ? 0 : newDistanceBuf[j - 1]
          newDistanceBuf[j + 1] = newDistanceBuf[j] + startVec.distanceTo(endVec)
        }
        this.instanceDistanceBuffer
          ? (this.instanceDistanceBuffer.set(newDistanceBuf, 0), (this.instanceDistanceBuffer.needsUpdate = !0))
          : ((this.instanceDistanceBuffer = new InstancedInterleavedBuffer(newDistanceBuf, 2, 1)),
            geometry.setAttribute("instanceDistanceStart", new InterleavedBufferAttribute(this.instanceDistanceBuffer, 1, 0, !1)),
            geometry.setAttribute("instanceDistanceEnd", new InterleavedBufferAttribute(this.instanceDistanceBuffer, 1, 1, !1)))
        return this
      }
    })()
    this.geometry = geometry
    this.material = material
  }
}
