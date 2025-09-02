import { AllowCheck } from "./host.utils"
let appVersion: string | null = null
export const setAppVersion = (name: string | null) => {
  appVersion = name
}
export const setAuthHeaderVersion = (host: string, header: Record<string, string>) => {
  if (appVersion && AllowCheck(host)) {
    header["x-matterport-application-version"] = appVersion
    return header
  }
}
