import GetModelPolicies from "../test/GetModelPolicies"

import { LayersPolicy } from "../other/76087"
import { PolicySymbol } from "../const/symbol.const"
import { availabilityType } from "../const/typeString.const"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { PolicyData } from "../data/policy.data"
declare global {
  interface SymbolModule {
    [PolicySymbol]: PolicyModule
  }
}
export interface PolicyItem {
  name: string
  value?: LayersPolicy
  options?: string[]
}
class PolicyStore extends MdsStore {
  constructor(e) {
    super(e)
  }
  async fetchModelPolicies(): Promise<PolicyItem[]> {
    // const e = this.getViewId()
    // return this.query(r.GetModelPolicies, {
    //   modelId: e
    // })
    return Promise.resolve(GetModelPolicies).then(e => {
      return (e || [])
        .filter(e => {
          switch (e.__typename) {
            case "PolicyFlag":
              return e.enabled
            case "PolicyValue":
              return null !== e.value
            case "PolicyOptions":
              return e.options && e.options.length > 0
            case "PolicyFeature":
              return e.availability === availabilityType.UNLOCKED
            default:
              return !1
          }
        })
        .map(e => ({
          name: e.name,
          value: e.value as LayersPolicy,
          options: e.options
        }))
    })
  }
}

export default class PolicyModule extends Module {
  store: PolicyStore
  policyData: PolicyData
  constructor() {
    super(...arguments)
    this.name = "policy-module"
  }
  async init(e, t: EngineContext) {
    this.store = new PolicyStore({
      context: e.mdsContext,
      readonly: !0,
      baseUrl: e.baseUrl,
      viewId: e.viewId
    })
    const n = await this.store.fetchModelPolicies()
    this.policyData = new PolicyData(n)
    t.market.register(this, PolicyData, this.policyData)
  }
  dispose(e) {
    super.dispose(e)
    e.market.unregister(this, PolicyData)
  }
}

// export const WORKSHOP_EDIT_POLICY = d.S
