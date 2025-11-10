import { Mesh } from "three"
import Engine from "../core/engine"
import { RenderLayers } from "../core/layers"
import { ISubscription } from "../core/subscription"
import { SweepsViewData } from "../data/sweeps.view.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import InputIniModule from "../modules/inputIni.module"
import { Comparator } from "../utils/comparator"
import { DrawSphere, DrawType, GUIDraw } from "./gui.draw"
import { ShowCaseScene } from "./showcase.scene"

export class NearSweep {
  gui: GUIDraw
  scene: ShowCaseScene
  input: InputIniModule
  view: SweepsViewData
  selected: string
  hovered: string
  wasDrawing: boolean
  viewmodeData: ViewmodeData
  constructor(scene: ShowCaseScene, input: InputIniModule, view: SweepsViewData, viewmodeData: ViewmodeData) {
    this.scene = scene
    this.input = input
    this.view = view
    this.viewmodeData = viewmodeData
    this.gui = new GUIDraw()
    this.wasDrawing = !1
  }
  init() {
    this.gui.addToScene(this.scene)
  }

  addScene() {
    const list = this.view.data.getSweepList()
    list
      .filter(e => e.enabled)
      .forEach(e => {
        const { id, position } = e
        const sphere = this.gui
          .sphere(id, { color: this.selected === id ? "cyan" : "orange", opacity: this.hovered === id ? 1 : 0.8 })
          .update(position.clone(), 0.1)
        this.input.registerMesh(sphere.mesh, !0, this.isDrawSphere)
      })
  }
  enable = false
  render() {
    if (!this.enable) return
    if (!this.wasDrawing) {
      this.addScene()
      this.wasDrawing = !0
    } else {
      Object.keys(this.gui.cache[DrawType.sphere]).forEach(n => {
        this.gui.cache[DrawType.sphere][n].update(this.gui.cache[DrawType.sphere][n].mesh.position.clone(), this.viewmodeData.isDollhouse() ? 0.2 : 0.1)
        this.gui.cache[DrawType.sphere][n].material.opacity = this.hovered === n ? 1 : 0.8
        this.gui.cache[DrawType.sphere][n].material.color.setColorName(this.selected === n || this.hovered === n ? "cyan" : "orange")
      })
      Object.keys(this.gui.cache[DrawType.line]).forEach(n => {
        this.gui.cache[DrawType.line][n].toggle(!1)
      })
      if (this.selected || this.hovered) {
        const sweepObject = this.view.data.getSweep(this.selected || this.hovered)!
        const nearList = this.view.data.getSweepNeighbours(sweepObject)
        nearList
          .filter(e => e.enabled)
          .forEach(n => {
            if (n) {
              this.gui.line(`${sweepObject.uuid}-${n.uuid}`).toggle(!0).updatePositions(sweepObject.position, n.position)
            }
          })
      }
    }
  }
  isDrawSphere(e) {
    return e instanceof Mesh && e.name === DrawSphere.name
  }
  binds: ISubscription[] = []
  dispose() {}
  engine: Engine
  activate(e: Engine) {
    this.engine = e
    const comparator = Comparator.is(this.isDrawSphere)
    this.binds.length ||
      this.binds.push(
        this.input.registerMeshHandler(HoverMeshEvent, comparator, (e, t, n) => {
          const id = Object.keys(this.gui.cache[DrawType.sphere]).find(n => this.gui.cache[DrawType.sphere][n].mesh === t)
          if (id) {
            this.hovered = id
          }
          return !0
        }),
        this.input.registerMeshHandler(UnhoverMeshEvent, comparator, (e, t, n) => {
          const id = Object.keys(this.gui.cache[DrawType.sphere]).find(n => this.gui.cache[DrawType.sphere][n].mesh === t)
          if (id) {
            this.hovered = ""
          }
          return !0
        }),
        this.input.registerMeshHandler(InputClickerEndEvent, comparator, (e, t, n) => {
          const id = Object.keys(this.gui.cache[DrawType.sphere]).find(n => this.gui.cache[DrawType.sphere][n].mesh === t)
          if (id) {
            if (this.selected) {
              if (this.selected === id) {
                if (e.button === 0) {
                  this.selected = ""
                } else if (e.button === 2) {
                  const sweepObject = this.view.data.getSweep(this.selected)!
                  sweepObject.neighbours.forEach(i => {
                    const item = this.view.data.getSweep(i)!
                    item.neighbours = item.neighbours.filter(n => n !== this.selected)
                  })
                  sweepObject.neighbours = []
                }
              } else {
                const sweepObject = this.view.data.getSweep(this.selected)!
                const currentObject = this.view.data.getSweep(id)!

                if (sweepObject.neighbours.includes(id)) {
                  sweepObject.neighbours = sweepObject.neighbours.filter(n => n !== id)
                  currentObject.neighbours = currentObject.neighbours.filter(n => n !== this.selected)
                } else {
                  sweepObject.neighbours = Array.from(new Set(sweepObject.neighbours.concat(id)))
                  currentObject.neighbours = Array.from(new Set(currentObject.neighbours.concat(this.selected)))
                }
              }
            } else {
              this.selected = id
            }
          }
          return !0
        })
      )
  }
  deactivate() {
    this.binds.forEach(n => n.cancel())
    this.binds = []
    this.binds.length = 0
  }
  toggle(enable: boolean) {
    this.enable = enable
    const layer = RenderLayers.ALL
    if (enable) {
      layer.removeLayers(this.engine.getRenderLayer("pins"))
      layer.removeLayers(this.engine.getRenderLayer("measurements"))
      layer.removeLayers(this.engine.getRenderLayer("sweep-pucks"))
      layer.removeLayers(this.engine.getRenderLayer("sweep-portal-mesh"))
      layer.removeLayers(this.engine.getRenderLayer("sweep-pin-mesh"))
    } else {
      this.selected = ""
      this.hovered = ""
    }
    this.gui.toggleAll(enable)
    this.scene.camera.layers.mask = layer.mask
    enable ? this.activate(this.engine) : this.deactivate()
  }
}
