import {
  DisableSweepSelectionCommand,
  EnableSweepSelectionCommand,
  HoverSweepCommand,
  SelectSweepCommand,
  ToggleNonPanoCurrentPuckCommand
} from "../command/sweep.command"
import { SweepViewdataSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { SweepsViewData } from "../data/sweeps.view.data"
import { ViewmodeData } from "../data/viewmode.data"
import { SweepsData } from "../data/sweeps.data"
import { FloorsViewData } from "../data/floors.view.data"
import { AppChangeMessage } from "../message/app.message"
import { EndMoveToFloorMessage } from "../message/floor.message"
import { AddViewMessage } from "../message/tour.message"

declare global {
  interface SymbolModule {
    [SweepViewdataSymbol]: SweepViewdataModule
  }
}
export default class SweepViewdataModule extends Module {
  selectionEnabled: boolean
  nonPanoCurrentPuckVisible: boolean
  viewData: SweepsViewData
  viewmodeData: ViewmodeData
  floorsViewData: FloorsViewData
  data: SweepsData
  enableSweepSelection: (e) => void
  disableSweepSelection: (e) => void
  toggleCurrentPuck: (e) => void
  onSweepSelectCommand: (e) => void
  onSweepHoverCommand: (e) => void
  updateVisibility: (e) => void

  constructor() {
    super(...arguments)
    this.name = "sweep-viewdata"
    this.selectionEnabled = !0
    this.nonPanoCurrentPuckVisible = !1
    this.enableSweepSelection = async e => {
      this.selectionEnabled = !0
    }
    this.disableSweepSelection = async e => {
      this.selectionEnabled = !1
    }
    this.toggleCurrentPuck = async e => {
      this.nonPanoCurrentPuckVisible = e.visible
      this.updateVisibility(this.viewData.data.currentSweep)
    }
    this.onSweepSelectCommand = async e => {
      this.selectionEnabled && this.viewData.modifySelectAnimation(e.id, e.selected, e.duration)
    }
    this.onSweepHoverCommand = async e => {
      this.viewData.modifySelectAnimation(e.id, e.hovered, e.duration)
    }
    this.updateVisibility = async e => {
      if (this.viewmodeData.isInside()) {
        if (e) {
          const t = this.viewData.getSweep(e).neighbours
          this.viewData.iterate(e => {
            const i = this.viewData.getSweepVisibility(e) && -1 !== t.indexOf(e.id)
            this.viewData.setVisible(e.id, i)
          })
          this.viewData.setVisible(e, !1)
        }
      } else {
        this.viewData.iterate(e => {
          this.viewData.setVisible(e.id, this.floorsViewData.isCurrentOrAllFloors(e.floorId))
        })
      }

      e && this.viewData.setVisible(e, this.nonPanoCurrentPuckVisible)
    }
  }

  async init(e, t) {
    this.data = await t.market.waitForData(SweepsData)
    this.viewData = t.market.tryGetData(SweepsViewData) || new SweepsViewData(this.data)
    t.market.register(this, SweepsViewData, this.viewData)
    this.bindings.push(
      t.commandBinder.addBinding(SelectSweepCommand, this.onSweepSelectCommand),
      t.commandBinder.addBinding(HoverSweepCommand, this.onSweepHoverCommand),
      t.commandBinder.addBinding(EnableSweepSelectionCommand, this.enableSweepSelection),
      t.commandBinder.addBinding(DisableSweepSelectionCommand, this.disableSweepSelection),
      t.commandBinder.addBinding(ToggleNonPanoCurrentPuckCommand, this.toggleCurrentPuck),
      t.msgBus.subscribe(AddViewMessage, () => this.viewData.updateViewData()),
      ...this.viewData.bindings
    )
    this.viewmodeData = await t.market.waitForData(ViewmodeData)
    this.floorsViewData = await t.market.waitForData(FloorsViewData)
    this.bindings.push(
      this.data.onPropertyChanged("currentSweep", this.updateVisibility),
      t.subscribe(EndMoveToFloorMessage, () => this.updateVisibility(this.viewData.data.currentSweep)),
      t.subscribe(AppChangeMessage, () => this.updateVisibility(this.viewData.data.currentSweep)),
      this.viewmodeData.makeModeChangeSubscription(() => this.updateVisibility(this.viewData.data.currentSweep))
    )
    this.updateVisibility(this.viewData.data.currentSweep)
  }

  onUpdate(e: number) {
    this.viewData.updateAnimations(e)
  }
}
