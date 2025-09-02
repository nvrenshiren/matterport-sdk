import { Mesh, PlaneGeometry, Quaternion, Vector3 } from "three"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { getPlaneGeometry } from "./56512"
import * as r from "../math/81729"
import { PickingPriorityType } from "../const/12529"
import { LinePart } from "../const/54702"
import { defaultLineWidth, defaultMaxScale, defaultScale } from "../const/66990"
import { LineEndpointMaterial } from "../modules/lines.module"
import { LineMaterial } from "./line.material"
import { LineMesh } from "./line.mesh"
import { MatrixBase } from "./matrix.base"
import { RenderLayer } from "../core/layers"
import { calculateFieldOfView, isPerspectiveProjection } from "../math/81729"
class LineEndMesh extends Mesh<PlaneGeometry, LineEndpointMaterial> {
  part: LinePart
  selectedSize: number
  defaultSize: number
  currentSize: number
  constructor(
    geometry: PlaneGeometry,
    material: LineEndpointMaterial,
    selectedSize = defaultLineWidth.endpointSelected,
    defaultSize = defaultLineWidth.endpointDefault
  ) {
    super(geometry, material)
    this.selectedSize = selectedSize
    this.defaultSize = defaultSize
    this.currentSize = defaultLineWidth.endpointDefault
    this.currentSize = this.defaultSize
    this.scale.set(defaultScale, defaultScale, defaultScale)
  }
  dispose() {
    this.material.dispose()
    this.geometry.dispose()
  }
  billboardScale(cameraPosition: Vector3, projection: MatrixBase, viewPortWidth: number) {
    const s = calculateFieldOfView(projection, cameraPosition, this.position, viewPortWidth, 0.5)
    const factor = Math.max(Math.min((1 / s) * this.currentSize, defaultMaxScale), defaultScale)
    this.scale.set(factor, factor, factor)
  }
  updateSelected(value: boolean) {
    this.currentSize = value ? this.selectedSize : this.defaultSize
  }
}
export class ShowcaseLineSegments {
  lineMaterial: LineMaterial
  options: {
    beforeUpdatePositions?: (pos: Vector3) => Vector3
    onShow?: () => void
    onHide?: () => void
  }

  endpointMaterial?: LineEndpointMaterial | undefined
  startPosition: Vector3
  endPosition: Vector3
  endpoints: boolean
  isVisible: boolean
  meshToLinePartMap: Record<string, LineEndMesh | LineMesh>
  opacity: (value: number) => this
  lineMesh: LineMesh
  updatePositions: (start: Vector3, end: Vector3) => this
  endMesh: LineEndMesh
  startMesh: LineEndMesh
  lastBillboardOptions: { position: Vector3; rotation: Quaternion; projection: MatrixBase }
  updateSelected: (value: boolean) => this
  setRenderLayer: (layer: RenderLayer) => void
  setRenderOrder: (value: number) => void
  updateResolution: (width: number, height: number) => this
  hide: () => void
  show: () => void
  toggle: (value: boolean) => this
  dispose: () => void
  overrideLineMaterial: (material: LineMaterial) => void
  restoreLineMaterial: () => void
  updateBillboard: (cameraInfo: { position: Vector3; rotation: Quaternion; projection: MatrixBase }) => this
  constructor(
    startPosition: Vector3,
    endPosition: Vector3,
    material: LineMaterial,
    options: ShowcaseLineSegments["options"],
    endpointMaterial?: LineEndpointMaterial
  ) {
    this.lineMaterial = material
    this.options = options
    this.endpointMaterial = endpointMaterial
    this.startPosition = new Vector3()
    this.endPosition = new Vector3()
    this.endpoints = !1
    this.isVisible = !0
    this.meshToLinePartMap = {}
    this.opacity = (value: number) => (this.endpointMaterial && this.endpointMaterial.setOpacity(value), this.lineMesh.material.setOpacity(value), this)
    this.updatePositions = (start: Vector3, end: Vector3) => {
      this.startPosition.copy(start)
      this.endPosition.copy(end)

      if (this.options.beforeUpdatePositions) {
        start = this.options.beforeUpdatePositions(start)
        end = this.options.beforeUpdatePositions(end)
      }

      this.lineMesh.geometry.setPositions([start.x, start.y, start.z, end.x, end.y, end.z])
      if (this.endpoints) {
        this.endMesh.position.copy(end)
        this.startMesh.position.copy(start)
        this.lastBillboardOptions && this.updateBillboard(this.lastBillboardOptions)
      }

      this.lineMesh.material.dashed && this.lineMesh.computeLineDistances()
      return this
    }
    this.updateBillboard = (billboardOptions: { position: Vector3; rotation: Quaternion; projection: MatrixBase }) => {
      if (
        this.endpoints &&
        (billboardOptions.rotation && (this.endMesh.quaternion.copy(billboardOptions.rotation), this.startMesh.quaternion.copy(billboardOptions.rotation)),
        billboardOptions.position && billboardOptions.projection && !isPerspectiveProjection(billboardOptions.projection))
      ) {
        const e = this.lineMesh.material.resolution.y
        this.endMesh.billboardScale(billboardOptions.position, billboardOptions.projection, e)
        this.startMesh.billboardScale(billboardOptions.position, billboardOptions.projection, e)
      }
      this.lastBillboardOptions = billboardOptions
      return this
    }
    this.updateSelected = (value: boolean) => {
      this.lineMesh.material.updateSelected(value)
      if (this.endpoints) {
        this.endMesh.material.updateHovered(value)
        this.endMesh.updateSelected(value)
        this.startMesh.updateSelected(value)
      }
      return this
    }
    this.setRenderLayer = (layer: RenderLayer) => {
      this.children.forEach(e => (e.layers.mask = layer.mask))
    }
    this.setRenderOrder = (value: number) => {
      this.children.forEach(e => (e.renderOrder = value))
    }
    this.updateResolution = (width: number, height: number) => (this.lineMesh.material.resolution.set(width, height), this)
    this.hide = () => {
      this.options.onHide && this.options.onHide()
      this.isVisible = !1
    }
    this.show = () => {
      this.options.onShow && this.options.onShow()
      this.isVisible = !0
    }
    this.toggle = (value: boolean) => (value ? this.show() : this.hide(), this)
    this.dispose = () => {
      this.options.onHide && this.options.onHide()
      this.lineMesh.geometry.dispose()
      this.lineMesh.material.dispose()
      this.endMesh && this.endMesh.dispose()
      this.startMesh && this.startMesh.dispose()
      this.meshToLinePartMap = {}
    }
    this.overrideLineMaterial = (material: LineMaterial) => {
      this.lineMesh.material = material
    }
    this.restoreLineMaterial = () => {
      this.lineMesh.material = this.lineMaterial
    }
    this.startPosition.copy(startPosition)
    this.endPosition.copy(endPosition)
    this.lineMesh = new LineMesh(new LineGeometry(), material)
    this.lineMesh.matrixAutoUpdate = !1
    this.lineMesh.part = LinePart.line
    this.lineMesh.renderOrder = PickingPriorityType.lines
    this.meshToLinePartMap[LinePart.line] = this.lineMesh

    if (endpointMaterial) {
      this.endpoints = !0
      this.endMesh = new LineEndMesh(getPlaneGeometry(), endpointMaterial)
      this.endMesh.part = LinePart.end
      this.endMesh.renderOrder = PickingPriorityType.endpoints
      this.meshToLinePartMap[LinePart.end] = this.endMesh
      this.startMesh = new LineEndMesh(getPlaneGeometry(), endpointMaterial)
      this.startMesh.part = LinePart.start
      this.startMesh.renderOrder = PickingPriorityType.endpoints
      this.meshToLinePartMap[LinePart.start] = this.startMesh
    }

    this.updatePositions(this.startPosition, this.endPosition)
    this.updateSelected(!1)
  }

  get currentOpacity() {
    return this.lineMesh.material.getOpacity()
  }
  getMesh(id: string) {
    return this.meshToLinePartMap[id]
  }

  get children(): (LineEndMesh | LineMesh)[] {
    return Object.keys(this.meshToLinePartMap).map(t => this.meshToLinePartMap[t])
  }
  get visible(): boolean {
    return this.isVisible
  }
}
