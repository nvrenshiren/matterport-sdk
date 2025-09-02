import * as i from "../utils/71570"
import { hasPolicySpacesElements } from "../utils/71570"
export const ObjectInsightsFeatureKey = "object-insights-feature"
function r(e, t, n, r) {
  const a = hasPolicySpacesElements(n),
    o = (0, i.tP)(e, t),
    l = !!t && e.hasMembershipFlag(t, "JMYDCase/objects_beta_access"),
    c = r.getOverrideParam("objectAnnotations", -1),
    d = !(0 === c) && ((a && o && l) || 1 === c)
  return r.setProperty(ObjectInsightsFeatureKey, d), d
}

export const yQ = r
