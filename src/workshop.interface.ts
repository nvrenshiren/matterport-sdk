import { AppInterface } from "./api/app.api"
import { CameraInterface } from "./api/camera.api"
import { FloorInterface } from "./api/floor.api"
import { MeasurementsInterface } from "./api/measurements.api"
import { ModeInterface } from "./api/mode.api"
import { ScreenInterface } from "./api/screen.api"
import { SettingsInterface } from "./api/settings.api"
import { SweepInterface } from "./api/sweep.api"
import { TagInterface } from "./api/tag.api"
import { TourInterface } from "./api/tour.api"
import { SDKInterface } from "./sdk.interface"
import { initWorkShop } from "./workshop.into"

export class WorkShopInterface extends SDKInterface {
  Tag = new TagInterface()
  Camera = new CameraInterface()
  Sweep = new SweepInterface()
  Tour = new TourInterface()
  App = new AppInterface()
  Screen = new ScreenInterface()
  Settings = new SettingsInterface()
  Mode = new ModeInterface()
  Floor = new FloorInterface()
  Measurements = new MeasurementsInterface()
  constructor() {
    super()
    window["workshop"] = this
  }
  detail: any = {}
  setDetail(data: any) {
    this.detail = Object.assign(this.detail, data || {})
    return this
  }
  init() {
    this.engine = initWorkShop({
      detail: this.detail
    })
    this.App.init(this.engine)
    this.Tag.init(this.engine)
    this.Camera.init(this.engine)
    this.Sweep.init(this.engine)
    this.Tour.init(this.engine)
    this.Screen.init(this.engine)
    this.Settings.init(this.engine)
    this.Mode.init(this.engine)
    this.Floor.init(this.engine)
    this.Measurements.init(this.engine)
  }
}
