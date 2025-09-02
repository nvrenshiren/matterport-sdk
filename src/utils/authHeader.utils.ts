import { AuthenticationPassword } from "./authorizationPassword.utils"
import { setAuthHeaderKey } from "./apikey.utils"
import { setAuthHeaderName } from "./appname.utils"
import { setAuthHeaderVersion } from "./appversion.utils"
import { AuthorizationBearer } from "./authorizationBearer.utils"
import { AuthorizationKey } from "./authorizationKey.utils"
import { AllowCheck } from "./host.utils"
const Authorization = [new AuthorizationKey(), new AuthorizationBearer(), new AuthenticationPassword()]

const setAuth = [
  (host: string, header: Record<string, string>, auth = Authorization) => {
    const authorization = auth.map(e => e.getAuthorizationHeader()).find(Boolean)
    return authorization && AllowCheck(host) && (header.authorization = authorization), header
  },
  setAuthHeaderName,
  setAuthHeaderVersion,
  setAuthHeaderKey
]
export const setAuthHeader = (e: string, t: Record<string, string>, n = setAuth) => (n.forEach(n => n(e, t)), t)
