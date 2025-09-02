import { PolicyData } from "../data/policy.data"

const i = "spaces.elements"
export function hasPolicySpacesElements(e: PolicyData) {
  return !!e.getPolicy(i)
}
function r(e, t) {
  return !!t && e.hasMembershipFlag(t, "cloud_ui/elements_beta_access")
}
function a(e, t) {
  e.trackFeatures(`elements:${hasPolicySpacesElements(t)}`)
}

export const ID = a
export const Z1 = i

export const tP = r
