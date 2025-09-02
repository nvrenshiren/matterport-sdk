import { AllowCheck } from "./host.utils"
let key: string | null = null
export const setKey = (key: string | null) => {
  key = key
}
export const getKey = () => key
export const setAuthHeaderKey = (host: string, header: Record<string, string>) => {
  if (key && AllowCheck(host)) {
    header["x-matterport-application-key"] = key
    return header
  }
}
