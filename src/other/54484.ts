import * as i from "react"
function s(e) {
  return (0, i.useMemo)(() => {
    const t = e ? e.getRootNode() : document
    return t.querySelector("#react-overlay-root") || t.body || t.firstElementChild
  }, [e])
}

export const Z = s
