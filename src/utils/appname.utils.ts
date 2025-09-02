import { AllowCheck } from "./host.utils"
let appName: string | null = null
export const setAppName = (name: string | null) => {
  appName = name
}
export const setAuthHeaderName = (host: string, header: Record<string, string>) => {
  if (appName && AllowCheck(host)) {
    header["x-matterport-application-name"] = appName
    return header
  }
}
