import { Data } from "../core/data"
import { PolicyItem } from "../modules/policy.module"
export class PolicyData extends Data {
  policies: PolicyItem[]
  constructor(e: PolicyItem[] = []) {
    super()
    this.policies = e
    this.name = "policy-data"
  }
  hasPolicy(e: string) {
    return !!this.getPolicy(e)
  }
  getPolicy(e: string) {
    return this.policies.find(t => t.name === e) || null
  }
}
