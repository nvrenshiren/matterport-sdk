import { Data } from "../core/data"
export class ModelRatingViewData extends Data {
  isDialogVisible: boolean
  setDialogVisible: (e: boolean) => void
  constructor() {
    super()
    this.name = "model-rating-view-data"
    this.isDialogVisible = !1
    this.setDialogVisible = e => {
      this.isDialogVisible = e || !this.isDialogVisible
      this.commit()
    }
  }
}
