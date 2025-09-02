import {
  Box3,
  Box3Helper,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CameraHelper,
  Color,
  Euler,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Scene,
  SphereGeometry,
  Vector3
} from "three"
import { ColorSpace } from "../const/color.const"
import { makeLineMaterial } from "../modules/lines.module"
import { TextLabel, TextRenderer } from "./67971"
import { ShowcaseLineSegments } from "./line.segments"
import { DirectionVector } from "./vector.const"
import { ShowCaseScene } from "./showcase.scene"
const c = 0.01
const l = new Vector3(c, c, c)
const h = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
class DrawBase<
  T extends Mesh<BufferGeometry, MeshBasicMaterial> | LineSegments<BufferGeometry, Material> | CameraHelper | Line<BufferGeometry, LineBasicMaterial> = Mesh<
    BufferGeometry,
    MeshBasicMaterial
  >
> {
  thisType: any
  container: Group
  mesh: T
  material: T["material"]
  geometry: T["geometry"]
  animationInit: boolean
  animState: { scale: Vector3; position: Vector3; target: { scale: Vector3; position: Vector3 }; temp: { pos: Vector3; scale: Vector3; makeScale: Vector3 } }
  style: string
  constructor(e, t, i) {
    this.animationInit = !1
    this.thisType = e
    this.container = t
    this.mesh = i()
    this.mesh.name = `${e.name}`
    this.material = this.mesh.material
    this.geometry = this.mesh.geometry
    return this
  }
  isVisible: boolean
  toggle(e: boolean) {
    e ? this.container.add(this.mesh) : this.container.remove(this.mesh)
    this.isVisible = e
    return this
  }
  opacity(e: number) {
    //@ts-ignore
    this.material!.opacity = e
    return this
  }
  initAnimationMixin(e?: Vector3, t?: Vector3) {
    this.animState = {
      scale: t ? t.clone() : new Vector3(1, 1, 1),
      position: e ? e.clone() : new Vector3(),
      target: { scale: t ? t.clone() : new Vector3(1, 1, 1), position: e ? e.clone() : new Vector3() },
      temp: { pos: new Vector3(), scale: new Vector3(), makeScale: new Vector3() }
    }
    this.animationInit = !0
  }
  update(e: Vector3, t: Vector3 | number) {
    if (!this.animationInit) throw Error(`${DrawBase.name} call this.initAnimationMixin() in ${this.style} constructor to enable update, because I said so.`)
    this.mesh.position.copy(e)
    const i = this.vector3From(t)
    i.equals(this.mesh.scale) || this.mesh.scale.copy(i)
    this.animState.scale.copy(this.mesh.scale)
    this.animState.position.copy(this.mesh.position)
    this.mesh.updateMatrixWorld(!0)
    return this
  }
  animate(e: number, t: Vector3, i: Vector3 | number) {
    if (!this.animationInit)
      throw Error(`${DrawBase.name} call this.initAnimationMixin() in ${this.style} constructor to enable animations, because I said so.`)
    const s = this.vector3From(i)
    this.animState.target.scale.copy(s)
    this.animState.target.position.copy(t)
    const n = this.animState.temp.pos.copy(this.mesh.position).lerp(t, e)
    const o = this.animState.temp.scale.copy(this.mesh.scale).lerp(s, e)
    this.update(n, o)
    return this
  }
  vector3From(e: Vector3 | number) {
    if (e instanceof Vector3) return this.animState.temp.makeScale.copy(e).clamp(l, h)
    if ("number" == typeof e) return this.animState.temp.makeScale.set(e, e, e).clamp(l, h)
    throw Error("Unexpected scale input")
  }
}

class DrawBox extends DrawBase {
  constructor(e, t) {
    super(DrawBox, e, () => new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial(t)))
    this.container = e
    this.style = "Box"
    this.mesh.frustumCulled = !1
    this.geometry.computeBoundingBox()
    this.initAnimationMixin()
  }
}

class DrawBoxWire extends DrawBase<LineSegments<BufferGeometry, Material>> {
  constructor(e, t) {
    super(DrawBoxWire, e, () => {
      const e = new Box3Helper(new Box3().setFromCenterAndSize(new Vector3(), new Vector3(1, 1, 1)))
      return new LineSegments(e.geometry, e.material)
    })
    this.container = e
    this.style = "BoxWireframeMesh"
    t && this.material.setValues(t)
    this.mesh.frustumCulled = !1
    this.initAnimationMixin()
  }
}

class DrawCameraHelper extends DrawBase<CameraHelper> {
  constructor(e, t) {
    super(DrawCameraHelper, e, () => new CameraHelper(t))
    this.container = e
    this.style = "CameraHelper"
    this.updateCamera(t)
  }
  updateCamera(e) {
    this.mesh.camera.copy(this.camWithSaneFarDistance(e))
    this.mesh.update()
    return this
  }
  camWithSaneFarDistance(e) {
    const t = e.clone()
    t.far = 5
    return t
  }
}

class DrawPlane extends DrawBase<Mesh<PlaneGeometry, MeshBasicMaterial>> {
  radius: number
  constructor(e, t) {
    super(DrawPlane, e, () => new Mesh(new PlaneGeometry(1), new MeshBasicMaterial(t)))
    this.container = e
    this.style = "PlaneMesh"
    this.radius = 1
    const i = new Matrix4()
    i.makeRotationFromEuler(new Euler(-Math.PI / 2, 0, 0, "XYZ"))
    this.geometry.applyMatrix4(i)
    this.mesh.frustumCulled = !1
    this.initAnimationMixin()
  }
}

export class DrawSphere extends DrawBase<Mesh<SphereGeometry, MeshBasicMaterial>> {
  radius: number
  name = "DrawSphere"
  constructor(e, t) {
    super(DrawSphere, e, () => new Mesh(new SphereGeometry(1), new MeshBasicMaterial(t)))
    this.container = e
    this.style = "SphereMesh"
    this.radius = 1
    this.mesh.frustumCulled = !1
    this.initAnimationMixin()
  }
}

class DrawSpline extends DrawBase<Line<BufferGeometry, LineBasicMaterial>> {
  positionsBuffer: BufferAttribute
  point: Vector3
  points: { start: Vector3; control: Vector3; end: Vector3 }
  updatePoints: (e: Vector3, t: Vector3, i: Vector3) => this
  curve: QuadraticBezierCurve3
  animatePoints: (e: number, t: Vector3, i: Vector3, s: Vector3) => this
  constructor(e, t) {
    super(
      DrawSpline,
      e,
      () => new Line(new BufferGeometry(), new LineBasicMaterial(Object.assign({ color: ColorSpace.MP_BRAND, opacity: 1, transparent: !0 }, t)))
    )
    this.container = e
    this.positionsBuffer = new BufferAttribute(new Float32Array(150), 3)
    this.point = new Vector3()
    this.points = { start: new Vector3(), control: new Vector3(), end: new Vector3() }
    this.updatePoints = (e, t, i) => {
      this.points.start.copy(this.curve.v0.copy(e))
      this.points.control.copy(this.curve.v1.copy(t))
      this.points.end.copy(this.curve.v2.copy(i))
      for (let e = 0; e < 50; e++) {
        const t = e / 49
        this.curve.getPoint(t, this.point), this.positionsBuffer.setXYZ(e, this.point.x, this.point.y, this.point.z)
      }
      return (this.positionsBuffer.needsUpdate = !0), this
    }
    this.animatePoints = (e, t, i, s) => {
      const { start: n, control: o, end: a } = this.points
      return n.equals(o) && n.equals(a) ? (this.updatePoints(t, i, s), this) : (n.lerp(t, e), o.lerp(i, e), a.lerp(s, e), this.updatePoints(n, o, a), this)
    }
    this.mesh.frustumCulled = !1
    this.curve = new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3())
    this.geometry.setAttribute("position", this.positionsBuffer)
    this.geometry.computeBoundingBox()
    return this
  }
}

export class GUIDraw {
  cache: {
    [DrawType.box]: Record<string, DrawBox>
    [DrawType.boxWire]: Record<string, DrawBoxWire>
    [DrawType.cameraHelper]: Record<string, DrawCameraHelper>
    [DrawType.label]: Record<string, TextLabel>
    [DrawType.line]: Record<string, ShowcaseLineSegments>
    [DrawType.plane]: Record<string, DrawPlane>
    [DrawType.sphere]: Record<string, DrawSphere>
    [DrawType.triangle]: Record<string, DrawSphere>
    [DrawType.spline]: Record<string, DrawSpline>
  }
  helperCache: {
    [HelperType.color]: Record<string, Color>
    [HelperType.vector3]: Record<string, Vector3>
  }
  style: Partial<TextRenderer["currentTextConfig"]>
  toggle: (e: boolean) => this
  options: {
    lineColor: string
    linewidth: number
    color: string
    background: boolean
    backgroundColor: string
    backgroundOpacity: number
    container: Group
    scene?: ShowCaseScene
  }
  box: (e: string, t: any) => DrawBox
  boxWire: (e: string, t: any) => DrawBoxWire
  cam: (e: string, t: any) => DrawCameraHelper
  label: (e: string, t: string, i: Vector3, s?: number) => TextLabel
  labelCreator: TextRenderer
  line: (e: string, t?: string, i?: number) => ShowcaseLineSegments
  plane: (e: string, t: any) => DrawPlane
  setStyle: (e: any) => void
  sphere: (e: string, t: any) => DrawSphere
  triangle: (e: string, t: any, i: any, s: any, o: any) => DrawSphere
  spline: (e: string, t: any) => DrawSpline
  randomColor: (e?: string) => any
  randomVector3: (e?: string) => any
  toggleAll: (e: any) => this
  constructor(e: Partial<GUIDraw["options"]> = {}, t: Partial<TextRenderer["currentTextConfig"]> = {}) {
    //@ts-ignore
    this.cache = {}
    //@ts-ignore
    this.helperCache = {}
    this.style = {}
    this.toggle = e => (this.options.scene && (e ? this.options.scene.add(this.options.container) : this.options.scene.remove(this.options.container)), this)
    this.box = (e, t) => (this.cache[DrawType.box][e] ||= new DrawBox(this.options.container, t).toggle(!0))
    this.boxWire = (e, t) => (this.cache[DrawType.boxWire][e] ||= new DrawBoxWire(this.options.container, t).toggle(!0))
    this.cam = (e, t) => (this.cache[DrawType.cameraHelper][e] ||= new DrawCameraHelper(this.options.container, t).toggle(!0))
    this.label = (e, t, i, s = 0.25) => {
      if (!this.labelCreator) {
        const { color: e, backgroundColor: t, backgroundOpacity: i, background: s } = this.options
        this.labelCreator = new TextRenderer(
          Object.assign({ color: e, background: s, backgroundColor: t, backgroundOpacity: i, wordWrapWidth: 650 }, this.style)
        )
      }
      if (!this.cache[DrawType.label][e]) {
        const n = this.labelCreator.createLabel()
        this.cache[DrawType.label][e] = n
        n.position.copy(i)
        n.text = t
        n.scaleFactor = s
        this.options.container.add(n)
      }
      return this.cache[DrawType.label][e]
    }
    this.line = (e, t: string | Color = this.options.lineColor, i = this.options.linewidth) => {
      if (!this.cache[DrawType.line][e]) {
        const o = makeLineMaterial("string" == typeof t ? new Color(t).getHex() : t.getHex(), !1, { linewidth: i })
        const a = { onShow: () => this.options.container.add(...r.children), onHide: () => this.options.container.remove(...r.children) }
        const r = new ShowcaseLineSegments(DirectionVector.ZERO.clone(), DirectionVector.ZERO.clone(), o, a)
        r.updateResolution(window.innerWidth, window.innerHeight).opacity(1).toggle(!0)
        this.cache[DrawType.line][e] = r
      }
      return this.cache[DrawType.line][e]
    }
    this.plane = (e, t) => (this.cache[DrawType.plane][e] ||= new DrawPlane(this.options.container, t).toggle(!0))
    this.setStyle = e => {
      this.style = e
    }
    this.sphere = (e: string, t) => (this.cache[DrawType.sphere][e] ||= new DrawSphere(this.options.container, t).toggle(!0))
    this.triangle = (e, t, i, s, o) => {
      if (!this.cache[DrawType.triangle][e]) {
        const a = new Float32Array(9)
        t.toArray(a, 0), i.toArray(a, 3), s.toArray(a, 6)
        const r = new BufferGeometry()
        r.setAttribute("position", new BufferAttribute(a, 3))
        const c = new Mesh(r, new MeshBasicMaterial(o))
        this.options.container.add(c), (this.cache[DrawType.triangle][e] = new DrawSphere(this.options.container, o).toggle(!0))
      }
      return this.cache[DrawType.triangle][e]
    }
    this.spline = (e, t) => (this.cache[DrawType.spline][e] ||= new DrawSpline(this.options.container, t).toggle(!0))
    this.randomColor = e => {
      if (void 0 !== e) {
        if (!this.helperCache[HelperType.color][e]) {
          const t = new Color(randomNumber(), randomNumber(), randomNumber())
          this.helperCache[HelperType.color][e] = t
        }
        return this.helperCache[HelperType.color][e]
      }
      return new Color(randomNumber(), randomNumber(), randomNumber())
    }
    this.randomVector3 = e => {
      if (void 0 !== e) {
        if (!this.helperCache[HelperType.vector3][e]) {
          const t = new Vector3(2 * (0.5 - randomNumber()), 2 * (0.5 - randomNumber()), 2 * (0.5 - randomNumber()))
          this.helperCache[HelperType.vector3][e] = t
        }
        return this.helperCache[HelperType.vector3][e]
      }
      return new Vector3(2 * (0.5 - randomNumber()), 2 * (0.5 - randomNumber()), 2 * (0.5 - randomNumber()))
    }
    this.toggleAll = e => {
      for (const t of Object.values(DrawType)) {
        const i = Object.values(this.cache[t])
        for (const t of i) "toggle" in t && t.toggle(e)
      }
      return this
    }
    this.options = Object.assign(Object.assign({}, defaultOptions), e)
    this.style = t
    for (const e of Object.values(DrawType)) this.cache[e] = {}
    for (const e of Object.values(HelperType)) this.helperCache[e] = {}
    this.options.scene && this.toggle(!0)
  }
  async addToScene(e: ShowCaseScene) {
    this.options.scene = e
    this.toggle(!0)
    return this
  }
}
const randomNumber = () => Math.random()
const defaultOptions = {
  lineColor: "white",
  linewidth: 2,
  color: "white",
  background: !0,
  backgroundColor: "white",
  backgroundOpacity: 0.5,
  container: new Group()
}

export enum DrawType {
  box = "box",
  boxWire = "boxWire",
  cameraHelper = "cameraHelper",
  label = "label",
  line = "line",
  plane = "plane",
  sphere = "sphere",
  spline = "spline",
  triangle = "triangle"
}

enum HelperType {
  color = "color",
  vector3 = "vector3"
}
