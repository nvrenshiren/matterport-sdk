import { ObservableObject } from "../observable/observable.object"
import { DataLayerType } from "../const/63319"
export class DataLayer extends ObservableObject {
  created: Date
  modified: Date
  id: string
  name: string
  layerType: DataLayerType
  position: number
  toggled: boolean
  visible: boolean
  transactions: Set<() => Promise<any>>
  constructor(e = {}) {
    super()
    this.transactions = new Set()
    Object.assign(this, e)
  }
  onApply(e) {
    this.transactions.add(e)
    return {
      delete: () => {
        this.transactions.delete(e)
      }
    }
  }
  async applyTransactions() {
    for (const e of this.transactions) await e()
  }
}
