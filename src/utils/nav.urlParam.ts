import { Euler, Quaternion, Vector3 } from "three"
import * as o from "../math/2569"
import * as l from "../other/44237"
import { DollhousePeekabooKey } from "../const/66777"
import * as d from "../other/92306"
import { DebugInfo } from "../core/debug"
import { copyURLSearchParams } from "./urlParams.utils"
import { PanoramaOrMesh, ViewModes } from "./viewMode.utils"
import { CameraData } from "../data/camera.data"
import { ViewmodeData } from "../data/viewmode.data"
import { FloorsViewData } from "../data/floors.view.data"
import { SweepsData } from "../data/sweeps.data"
import { SettingsData } from "../data/settings.data"
import { createRotationMatrixFromQuaternion } from "../math/2569"
const Navurl = new DebugInfo("navurl")
class ViewModeInvalidError extends Error {
  constructor(e, t?) {
    super(`view mode ${e} is invalid${t ? ` when ${t}` : ""}`)
  }
}

interface PoseParams {
  cameraData: CameraData
  viewmodeData: ViewmodeData
  floorsViewData: FloorsViewData
  sweepData: SweepsData
  settingsData: SettingsData
}
interface ShortPose {
  ss: number
  sr: string
  sm: ViewModes
  sp: string
  sf: number[]
  sz: number
  sq: string
}
export class NavURLParam {
  static DEFAULT_VIEW_MODE = ViewModes.Panorama
  static VALID_URL_VIEW_MODES = [ViewModes.Panorama, ViewModes.Dollhouse, ViewModes.Floorplan, ViewModes.Outdoor, ViewModes.Mesh]
  static encodeVector3(e: Vector3, t = 2) {
    const { x, y, z } = e
    return NavURLParam.packFloats([x, y, z], t)
  }
  static decodeVector3(e: string) {
    const t = NavURLParam.unpackFloats(e, 3)
    return t ? new Vector3(...t) : null
  }
  static encodeQuaternion(e: Quaternion, t = 2) {
    return NavURLParam.packFloats([e.x, e.y, e.z, e.w], t)
  }
  static decodeQuaternion(e: string) {
    const t = NavURLParam.unpackFloats(e, 4)
    return t && !(0, l.mB)(t) ? new Quaternion(...t) : null
  }
  static encodeEuler(e: Euler, t = 2) {
    return NavURLParam.packFloats([e.x, e.y, e.z], t)
  }
  static decodeEuler(e: string) {
    const t = NavURLParam.unpackFloats(e, 3)
    return t ? new Euler(t[0], t[1], t[2], "XYZ") : void 0
  }
  static packFloats(e: number[], t = 2) {
    let n = e
      .map(e => {
        const n = parseFloat(e.toFixed(t))
          .toString()
          .replace(/^(\-)?0+.(\d+)/, "$1.$2")
        return "0" === n ? "" : n
      })
      .join(",")
    n = n.replace(/,+$/, "")
    return n
  }
  static unpackFloats(e: string, t = 0) {
    const n = e.split(",").map(e => ("" === e ? 0 : parseFloat(e)))
    if (!n || n.includes(NaN)) return []
    for (; n.length < t; ) n.push(0)
    return n
  }
  static getQueryString(e: PoseParams, t = !0) {
    return NavURLParam.serialize(e, t).toString()
  }
  static serialize(e: PoseParams, t = !0) {
    const n = NavURLParam.removeNavigationKeys()
    try {
      if (t) {
        const t = NavURLParam.getShortPose(e)
        //@ts-ignore
        for (const [e, i] of Object.entries(t)) n.set(e, i)
      } else {
        const t = NavURLParam.getStartPose(e),
          i = JSON.stringify(t)
        n.set("start", i)
      }
    } catch (e) {
      Navurl.debug(e)
    }
    return n
  }
  static deserialize(e = window.location.href) {
    try {
      const t = new URL(e.trim()).searchParams,
        n = t.get("start")
      return n ? NavURLParam.parseStartObject(n) : NavURLParam.parseShortUrl(t)
    } catch (e) {
      Navurl.debug(e)
    }
    return null
  }
  static removeNavigationKeys() {
    const e = copyURLSearchParams()
    for (const t of NavURLParam.navigationKeys) e.delete(t)
    return e
  }
  static get navigationKeys() {
    return new Set(["start", "sm", "sp", "sq", "sr", "ss", "sf", "sz"])
  }
  static parseShortUrl(e) {
    const t = e.get("sm"),
      n = e.get("sp"),
      r = e.get("sq"),
      a = e.get("sr"),
      l = e.get("ss"),
      c = e.get("sf"),
      d = e.get("sz"),
      m = NavURLParam.parseViewmode(t),
      f = NavURLParam.decodeEuler(a || "") || new Euler(0, 0, 0),
      g = NavURLParam.decodeQuaternion(r || "") || new Quaternion(0, 0, 0, 1),
      v = n ? NavURLParam.decodeVector3(n) : void 0,
      y = l ? parseInt(l, 10) - 1 : void 0,
      b = c ? NavURLParam.unpackFloats(c, 4) : void 0,
      E = d ? parseFloat(d) : void 0
    if (PanoramaOrMesh(m) && void 0 === y) throw new ViewModeInvalidError(m, "sweep index not defined")
    if (!PanoramaOrMesh(m) && !v) throw new ViewModeInvalidError(m, "position is falsy")
    let S = r ? g : new Quaternion().setFromEuler(f)
    PanoramaOrMesh(m) && (S = createRotationMatrixFromQuaternion(S))
    const O = {
      mode: m,
      quaternion: S,
      position: v || void 0,
      sweepIndex: y,
      floorVisibility: b,
      zoom: E
    }
    return Navurl.debug("Parsed short URL pose data:", O), O
  }
  static parseStartObject(e) {
    const t = JSON.parse(decodeURIComponent(e))
    if (!t.camera_quaternion) throw Error("Start override is missing camera_quaternion")
    if (!t.camera_position) throw Error("Start override is missing camera_position")
    const n = NavURLParam.parseViewmode(t.camera_mode),
      s = new Quaternion().copy(t.camera_quaternion),
      r = {
        mode: n,
        panoId: t.scan_id,
        position: new Vector3().copy(t.camera_position),
        quaternion: s,
        zoom: t.ortho_zoom,
        floorVisibility: t.floor_visibility
      }
    return Navurl.debug("Parsed &start URL pose data:", r), r
  }
  static getShortPose(rr: PoseParams) {
    const { cameraData: e, viewmodeData: t, floorsViewData: n, sweepData: r, settingsData: a } = rr
    const o = new Euler().setFromQuaternion(e.pose.rotation, "XYZ")
    const l = r.currentSweepIndex
    const h: Partial<ShortPose> = {}
    if (t.isInside()) {
      void 0 !== l && (h.ss = l + 1)
      o.z = 0
      h.sr = NavURLParam.encodeEuler(o)
      t.currentMode === ViewModes.Mesh && (h.sm = NavURLParam.validateViewmode(t.currentMode))
    } else {
      const i = a?.tryGetProperty(DollhousePeekabooKey, !1) || !1
      let r = e.pose.position
      let l = t.currentMode
      if (i) {
        const s = (0, d.pG)(e, n, t, i)
        r = s.position
        l = s.viewmode
      }
      h.sm = NavURLParam.validateViewmode(l)
      h.sr = NavURLParam.encodeEuler(o)
      h.sp = NavURLParam.encodeVector3(r)
      const u = n.getFloorsVisibility()
      u.length && n.totalFloors > 1 && (h.sf = u)
      l === ViewModes.Floorplan && (h.sz = parseFloat(e.zoom().toFixed(2)))
    }
    h.sq = NavURLParam.encodeQuaternion(e.pose.rotation)
    Navurl.debug(`Short URL params for current location ${JSON.stringify(h)}`)
    delete h.sq
    return h
  }
  static getStartPose(aa: PoseParams) {
    const { cameraData: e, viewmodeData: t, floorsViewData: n, sweepData: i, settingsData: r } = aa
    const a = {
      x: 0,
      y: 0,
      z: 0,
      w: 1
    }
    a.x = e.pose.rotation.x
    a.y = e.pose.rotation.y
    a.z = e.pose.rotation.z
    a.w = e.pose.rotation.w
    const o = r?.tryGetProperty(DollhousePeekabooKey, !1) || !1
    const { position: l, viewmode: u } = (0, d.pG)(e, n, t, o)
    const h = {
      x: 0,
      y: 0,
      z: 0
    }
    h.x = l.x
    h.y = l.y
    h.z = l.z
    const m = {
      camera_mode: NavURLParam.validateViewmode(u),
      camera_position: h,
      camera_quaternion: a,
      scan_id: undefined as string | undefined,
      floor_visibility: undefined as number[] | undefined,
      ortho_zoom: undefined as number | undefined
    }
    t.isInside() ? (m.scan_id = i.currentSweep) : (m.floor_visibility = n.getFloorsVisibility())
    u === ViewModes.Floorplan && (m.ortho_zoom = e.zoom())
    return m
  }
  static parseViewmode(e: string | null) {
    let t = NavURLParam.DEFAULT_VIEW_MODE
    return null != e && (t = parseInt(e, 10)), NavURLParam.validateViewmode(t)
  }
  static validateViewmode(e: ViewModes | null) {
    if (null === e || !NavURLParam.VALID_URL_VIEW_MODES.includes(e)) throw new ViewModeInvalidError(e)
    return e
  }
}
