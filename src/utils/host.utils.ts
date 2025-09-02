const allowHost = ["matterport.com", "matterportvr.cn", "localhost"]
const allowPath = ["/api/"]
export const AllowCheck = (url: string) => {
  let urlOBJ: URL
  try {
    urlOBJ = new URL(url.toLowerCase())
  } catch (e) {
    return !1
  }
  const { hostname, pathname } = urlOBJ
  const canHost = allowHost.some(e => hostname === e || hostname.endsWith(`.${e}`))
  const canPath = allowPath.some(e => pathname.startsWith(e))
  return canHost && canPath
}
