import { TransactionState } from "../const/45905"
import { Data } from "../core/data"
export class StorageData extends Data {
  lastPublished: null | number
  transactionState: TransactionState
  constructor(e = {}) {
    super()
    this.lastPublished = null
    this.transactionState = TransactionState.IDLE
    Object.assign(this, e)
  }
  setTransactionState(e: TransactionState) {
    if (e !== this.transactionState) {
      if (![this.transactionState, e].includes(TransactionState.IDLE)) throw new Error(`Cannot transition from ${this.transactionState} to ${e}`)
      this.transactionState = e
      this.commit()
    }
  }
}
