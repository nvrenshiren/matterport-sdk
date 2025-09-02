import { useContext } from "react"
import { AppReactContext } from "../context/app.context"
export function useAnalytics() {
  const { analytics } = useContext(AppReactContext)
  return analytics
}
