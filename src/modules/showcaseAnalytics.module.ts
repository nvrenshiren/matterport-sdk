import { NotifyActivityAnalytic } from "../command/viewmode.command"
import { DollhousePeekabooKey } from "../const/66777"
import { BlockTypeList } from "../const/block.const"
import { AnalyticsSymbol, Apiv2Symbol, AppAnalyticsSymbol, InputSymbol, LocaleSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { Data } from "../core/data"
import { DebugInfo } from "../core/debug"
import { Message } from "../core/message"
import { Module } from "../core/module"
import { AppData, AppStatus } from "../data/app.data"
import { FloorsData } from "../data/floors.data"
import { FloorsViewData } from "../data/floors.view.data"
import { InteractionData } from "../data/interaction.data"
import { PlayerOptionsData } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { TourData as _TourData } from "../data/tour.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InputClickerEndEvent } from "../events/click.event"
import { DraggerMoveEvent } from "../events/drag.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { OnMouseDownEvent } from "../events/mouse.event"
import { PincherMoveEvent } from "../events/pinch.ecvent"
import Ne from "../lib/ringbuffer/ringbuffer"
import { ModelRatedMessage } from "../message//model.message"
import { PixelRatioChangedMessage } from "../message//webgl.message"
import { ActivitycMessage } from "../message/activity.ping.message"
import { AnnotationBlockClickedMessage } from "../message/annotation.message"
import { AppPhaseChangeMessage } from "../message/app.message"
import { CameraZoomMessage } from "../message/camera.message"
import { EndMoveToFloorMessage, EndSwitchViewmodeMessage } from "../message/floor.message"
import { InteractionModeChangedMessage } from "../message/interaction.message"
import {
  MeasureAddMessage,
  MeasureAddTitleMessage,
  MeasureCancelledMessage,
  MeasureModeChangeMessage,
  MeasureRemoveMessage,
  MeasureSegmentAddMessage,
  MeasureUpdateMessage,
  MeasureUpdateTitleMessage
} from "../message/measure.message"
import { RoomVisitedMessage } from "../message/room.message"
import { EndMoveToSweepMessage, MoveToSweepBeginMessage } from "../message/sweep.message"
import { TileDownloadedMessage } from "../message/title.message"
import { LoadSpinnerMessage } from "../message/ui.message"
import { StartViewmodeChange, ViewModeChangeAnalyticsMessage } from "../message/viewmode.message"
import { AlignmentType, PlacementType } from "../object/sweep.object"
import * as je from "../other/41404"
import * as r from "../other/44239"
import * as Fe from "../other/76721"
import { SearchSplit } from "../utils/browser.utils"
import { toISOString } from "../utils/date.utils"
import { getErrorCode } from "../utils/error.utils"
import * as K from "../utils/func.utils"
import { getNumberListByPersent } from "../utils/func.utils"
import { lsGetItem, lsSetItem } from "../utils/localstorage.utils"
import { randomUUID } from "../utils/random.utils"
import { getValFromURL } from "../utils/urlParams.utils"
import { ViewModes } from "../utils/viewMode.utils"
import { UndoBuffer } from "../webgl/undo.buffer"
declare global {
  interface SymbolModule {
    [AppAnalyticsSymbol]: ShowcaseAnalyticsModule
  }
}
class l {
  constructor() {
    this.handlers = [
      {
        msgType: InteractionModeChangedMessage,
        func: (e, t, n) => {
          const i = n.tryGetData(InteractionData)
          i &&
            e.track("interaction_mode_changed", {
              interaction_mode_prev: t.fromMode,
              interaction_mode: t.mode,
              interaction_source: i.source
            })
        }
      }
    ]
  }
}
class u {
  constructor() {
    this.handlers = [
      {
        msgType: AnnotationBlockClickedMessage,
        func: (e, t, n) => {
          const { blockType: i } = t.block
          if (i === BlockTypeList.TEXT) return
          let s = t.block.text
          i === BlockTypeList.LINK && (s = t.block.value || ""),
            i === BlockTypeList.USER && (s = t.block.id || ""),
            e.track("annotation_block_clicked", {
              block_type: i,
              block_value: s,
              annotation_type: t.annotationType,
              annotation_id: t.id
            })
        }
      }
    ]
  }
}
enum h {
  TOUR = "tour",
  USER = "self-guided"
}
function v(e, t) {
  switch (e) {
    case AlignmentType.ALIGNED:
      return 1
    case AlignmentType.UNALIGNED:
      return 2
  }
  switch (t) {
    case PlacementType.MANUAL:
      return 3
  }
  return 0
}
class y {
  constructor() {
    ;(this.startLoadTime = Date.now()),
      (this.endLoadTime = Date.now()),
      (this.panosViewed = 0),
      (this.handlers = [
        {
          msgType: MoveToSweepBeginMessage,
          func: (e, t, n) => {
            this.onMoveToSweepBegin(t.timestamp)
          }
        },
        {
          msgType: EndMoveToSweepMessage,
          func: (e, t, n) => {
            const i = n.tryGetData(InteractionData),
              s = n.tryGetData(_TourData)
            this.endLoadTime = Date.now()
            const r = this.endLoadTime - this.startLoadTime
            e.track("pano_viewed", {
              pano_id: t.toSweep,
              pano_view_count: ++this.panosViewed,
              alignment_type: v(t.alignmentType, t.placementType),
              navigation_source: s && s.tourPlaying ? h.TOUR : h.USER,
              interaction_source: i ? i.source : InteractionData.defaultSource,
              interaction_mode: i ? i.mode : InteractionData.defaultMode,
              load_time: r / 1e3
            })
          }
        }
      ])
  }
  onMoveToSweepBegin(e) {
    this.startLoadTime = e
  }
}
class T {
  constructor(e) {
    ;(this.engine = e),
      (this.handlers = []),
      (this.send = (e, t, n) => {
        const i = n.tryGetData(InteractionData),
          s = {
            view_mode: t.toMode
          }
        i && ((s.interaction_source = i.source), (s.interaction_mode = i.mode)), e.track("mode_changed", s)
      }),
      this.handlers.push(
        {
          msgType: EndSwitchViewmodeMessage,
          func: (e, t, n) => {
            this.peekabooActive || this.send(e, t, n)
          }
        },
        {
          msgType: ViewModeChangeAnalyticsMessage,
          func: (e, t, n) => {
            this.peekabooActive && this.send(e, t, n)
          }
        }
      )
  }
  get peekabooActive() {
    var e
    return null === (e = this.engine.market.tryGetData(SettingsData)) || void 0 === e ? void 0 : e.tryGetProperty(DollhousePeekabooKey, !1)
  }
}
class N extends Message {
  constructor(e, t, n) {
    super(), (this.sweep = e), (this.from = t), (this.to = n)
  }
}
const P = (e, t) => {
  const n = t.tryGetData(FloorsData)
  if (!e || !n) return -1
  return n.getFloor(e).index
}
class x {
  constructor() {
    this.handlers = [
      {
        msgType: EndMoveToFloorMessage,
        func: (e, t, n) => {
          const i = n.tryGetData(InteractionData)
          e.track("floor_changed", {
            floor_id: t.floorName,
            interaction_source: i ? i.source : InteractionData.defaultSource,
            interaction_mode: i ? i.mode : InteractionData.defaultMode
          })
        }
      },
      {
        msgType: N,
        func: (e, t, n) => {
          const i = n.tryGetData(InteractionData)
          e.track("sweep_floor_fixup", {
            sweep_index: t.sweep.index,
            sweep_alignment: t.sweep.alignmentType,
            sweep_placement: t.sweep.placementType,
            sweep_floor_from: P(t.from, n),
            sweep_floor_to: P(t.to, n),
            interaction_source: i ? i.source : InteractionData.defaultSource,
            interaction_mode: i ? i.mode : InteractionData.defaultMode
          })
        }
      }
    ]
  }
}
class C {
  constructor() {
    ;(this.firstZoom = !0),
      (this.fromZoom = 1),
      (this.toZoom = 1),
      (this.handlers = [
        {
          msgType: CameraZoomMessage,
          func: (e, t, n) => {
            this.analytics || (this.analytics = e)
            const i = n.tryGetData(SweepsData)
            i && i.currentSweep !== this.currentPano && ((this.firstZoom = !0), (this.currentPano = i.currentSweep), (this.fromZoom = 1)),
              (this.toZoom = t.zoomLevel),
              clearTimeout(this.sendTimeout),
              (this.sendTimeout = window.setTimeout(this.trackZoomEvent.bind(this), 150))
          }
        }
      ])
  }
  trackZoomEvent() {
    const e = this.firstZoom ? "initial" : "followup"
    this.analytics.track("zoom_" + e, {
      from: this.fromZoom,
      to: this.toZoom,
      pano: this.currentPano
    }),
      (this.firstZoom = !1),
      (this.fromZoom = this.toZoom)
  }
}
class TimingData extends Data {
  constructor() {
    super(...arguments),
      (this.name = "timing"),
      (this.modelLoadingStartTime = 0),
      (this.waitingStartTime = 0),
      (this.appPlayingTime = 0),
      (this.appStartedTime = 0)
  }
  get totalTimeToAppStarting() {
    let e = this.appStartedTime - performance.timing.navigationStart
    return this.modelLoadingStartTime && this.waitingStartTime && (e -= this.modelLoadingStartTime - this.waitingStartTime), e
  }
  get totalTimeToAppPlaying() {
    let e = this.appPlayingTime - performance.timing.navigationStart
    return this.modelLoadingStartTime && this.waitingStartTime && (e -= this.modelLoadingStartTime - this.waitingStartTime), e
  }
}
const G = new DebugInfo("JMYDCase-session"),
  W = new TimingData()
class z {
  constructor(e, t) {
    ;(this.analytics = e),
      (this.engine = t),
      (this.handlers = [
        {
          msgType: AppPhaseChangeMessage,
          func: async (e, t, n) => {
            var i, r
            switch (t.phase) {
              case AppStatus.WAITING:
                ;(W.waitingStartTime = Date.now()),
                  W.commit(),
                  e.track("impression", {
                    url_params: SearchSplit(),
                    visible: !0
                  })
                break
              case AppStatus.LOADING:
                ;(W.modelLoadingStartTime = Date.now()), W.commit()
                break
              case AppStatus.STARTING: {
                ;(W.appStartedTime = Date.now()), W.commit(), G.info("First render, model loaded " + W.totalTimeToAppStarting / 1e3)
                const t = this.engine.market.tryGetData(PlayerOptionsData)
                this.renderer = await this.engine.getModuleBySymbol(WebglRendererSymbol)
                const n = this.renderer.getCapabilities(),
                  i = {
                    has_hlr: !t || t.options.highlight_reel,
                    duration: Date.now() - W.modelLoadingStartTime,
                    duration_from_navigation_start: Date.now() - performance.timing.navigationStart,
                    gl_v2: n.gl_v2,
                    gl_max_textures: n.gl_max_textures,
                    gl_max_texture_size: n.gl_max_texture_size,
                    gl_max_cubemap_size: n.gl_max_cubemap_size,
                    gl_instancing: n.gl_instancing,
                    gl_oes_texture_float: n.gl_oes_texture_float,
                    gl_oes_texture_half_float: n.gl_oes_texture_half_float,
                    gl_depth_texture: n.gl_depth_texture,
                    gl_draw_buffers: n.gl_draw_buffers,
                    gl_oes_fbo_render_mip_map: n.gl_oes_fbo_render_mip_map,
                    gl_shader_texture_lod: n.gl_shader_texture_lod,
                    gl_oes_vertex_array_obj: n.gl_oes_vertex_array_obj,
                    gl_ovr_multi_view: n.gl_ovr_multi_view,
                    gl_color_buffer_float: n.gl_color_buffer_float,
                    gl_astc_supported: n.gl_astc_supported,
                    gl_etc1_supported: n.gl_etc1_supported,
                    gl_etc2_supported: n.gl_etc2_supported,
                    gl_dxt_supported: n.gl_dxt_supported,
                    gl_bptc_supported: n.gl_bptc_supported,
                    gl_pvrtc_supported: n.gl_pvrtc_supported
                  }
                e.track("model_loaded", i)
                break
              }
              case AppStatus.PLAYING:
                ;(W.appPlayingTime = Date.now()),
                  W.commit(),
                  G.info("Playing, session started " + W.totalTimeToAppPlaying / 1e3),
                  e.track("session_started"),
                  window.addEventListener("unload", this.sessionEnded),
                  e.track("load_times", {
                    time_to_app_start: W.totalTimeToAppStarting,
                    time_to_app_playing: W.totalTimeToAppPlaying
                  })
                break
              case AppStatus.ERROR: {
                const t = await n.waitForData(AppData),
                  { error: s } = t,
                  a = s && s.name ? s.name : s && s.constructor ? s.constructor.name : null,
                  o = s ? s.message : null,
                  l = s && s.stack ? s.stack.split("\n") : [],
                  c = l.length >= 2 ? l[1].match(/\s+at\s+([^\s]+)/) : null,
                  d = getErrorCode(s),
                  u = !!getValFromURL("oops", ""),
                  h = null !== (r = null === (i = this.renderer) || void 0 === i ? void 0 : i.estimatedGPUMemoryAllocated()) && void 0 !== r ? r : -1,
                  p = {
                    error_dialog: "oops",
                    error_type: a || "",
                    exception: {
                      message: `${a}: ${o}`,
                      function: c ? c[1] : null,
                      stack: l.slice(1, 5).join("\n")
                    },
                    duration: W.modelLoadingStartTime > 0 ? Date.now() - W.modelLoadingStartTime : void 0,
                    duration_from_navigation_start: Date.now() - performance.timing.navigationStart,
                    gpu_memory: h < 0 ? void 0 : h,
                    mock_error: u
                  }
                d && (p.error_code = d), e.track("error_displayed", p)
                break
              }
            }
          }
        }
      ]),
      (this.sessionEnded = () => {
        this.analytics.trackAsync("session_ended", {
          duration: Date.now() - W.appPlayingTime
        })
      })
  }
  dispose() {
    window.removeEventListener("unload", this.sessionEnded)
  }
}
const X = new DebugInfo("/index.js")
class J {
  constructor(e) {
    ;(this.engine = e),
      (this.trackTime = 0),
      (this.trackTimeThreshold = 1 / 0),
      (this.currentPhase = null),
      (this.currentAppPhase = null),
      (this.pixelRatio = window.devicePixelRatio || 1),
      (this.recordedPhases = {}),
      (this.deltas = new UndoBuffer(1e3)),
      (this.memoryReadings = new UndoBuffer(1e3)),
      (this.handlers = [
        {
          msgType: StartViewmodeChange,
          func: (e, t, n) => {
            ;(this.currentAppPhase !== AppStatus.STARTING && this.currentAppPhase !== AppStatus.PLAYING) || this.startRecording(e, ViewModes[t.toMode], 1e4)
          }
        },
        {
          msgType: AppPhaseChangeMessage,
          func: async (e, t, n) => {
            const i = n.tryGetData(ViewmodeData)
            t.phase === AppStatus.LOADING
              ? this.startRecording(e, "Loading", 6e4)
              : t.phase === AppStatus.STARTING
                ? ((this.renderer = await this.engine.getModuleBySymbol(WebglRendererSymbol)), this.startRecording(e, "Starting", 6e4))
                : t.phase === AppStatus.PLAYING && i && i.currentMode && this.startRecording(e, ViewModes[i.currentMode], 1e4),
              (this.currentAppPhase = t.phase)
          }
        },
        {
          msgType: PixelRatioChangedMessage,
          func: (e, t, n) => {
            this.pixelRatio = t.pixelRatio
          }
        }
      ]),
      (this.resetRecording = () => {
        ;(this.currentPhase = null), this.deltas.clear(), this.memoryReadings.clear(), (this.trackTime = 0)
      })
  }
  onUpdate(e, t) {
    var n, i
    if (!this.currentPhase) return
    this.deltas.push(t)
    const s = null !== (i = null === (n = this.renderer) || void 0 === n ? void 0 : n.estimatedGPUMemoryAllocated()) && void 0 !== i ? i : -1
    s > -1 && this.memoryReadings.push(s), (this.trackTime += t), this.trackTime >= this.trackTimeThreshold && (this.sendRecord(e), this.resetRecording())
  }
  startRecording(e, t, n) {
    t !== this.currentPhase &&
      (this.currentPhase && (this.sendRecord(e), this.resetRecording()),
      this.recordedPhases[t] || ((this.currentPhase = t), (this.trackTimeThreshold = n), (this.recordedPhases[this.currentPhase] = !0)))
  }
  sendRecord(e) {
    if (0 === this.deltas.count) return
    const t = this.deltas.getList(),
      n = this.memoryReadings.getList()
    try {
      const i = this.calcPerformance(t, n)
      e.track("performance", i)
    } catch (e) {
      X.warn("Could not send performance metrics", e)
    }
  }
  calcPerformance(e, t) {
    let n = 0,
      i = 0,
      s = 0,
      r = 0,
      a = 0,
      o = 0
    for (const t of e) (n += t), t < 0 || (t <= 16.7 ? (i += t) : t <= 33.3 ? (s += t) : t <= 100 ? (r += t) : t <= 1e3 ? (a += t) : (o += t))
    if (n <= 0) throw Error("No positive timings, cannot calculate performance data")
    const l = n / e.length
    ;(i /= n), (s /= n), (r /= n), (a /= n), (o /= n)
    let c = e.slice()
    const d = getNumberListByPersent(c, 50),
      u = getNumberListByPersent(c, 95, !1),
      h = c[c.length - 1]
    let p, m, f, g, v
    return (
      t.length &&
        ((c = t.slice()),
        (g = getNumberListByPersent(c, 50, !0)),
        (v = getNumberListByPersent(c, 95, !1)),
        (f = Math.round((0, K.Y8)(t))),
        (p = c[0]),
        (m = c[c.length - 1])),
      {
        phase: this.currentPhase,
        frame_delta: l,
        frame_delta_avg: l,
        frame_delta_median: d,
        frame_delta_95th: u,
        frame_delta_max: h,
        duration: n,
        time_60_fps: i,
        time_60_30_fps: s,
        time_30_10_fps: r,
        time_10_1_fps: a,
        time_1_0_fps: o,
        gpu_memory_min: p,
        gpu_memory_max: m,
        gpu_memory_avg: f,
        gpu_memory_median: g,
        gpu_memory_95th: v,
        pixel_ratio: this.pixelRatio
      }
    )
  }
}
const ne = (e, t) => {
  const n = t.tryGetData(FloorsViewData)
  if (!n) return -1
  return (e ? n.floors.getFloor(e) : n.getHighestVisibleFloor()).index
}
class ie {
  constructor() {
    this.handlers = [
      {
        msgType: MeasureSegmentAddMessage,
        func: (e, t, n) => {
          const i = {
            measure_sid: t.data.sid,
            start_position: t.data.startPosition,
            end_position: t.data.endPosition,
            length: t.data.totalLength,
            segments: t.data.segments,
            temporary: t.data.temporary,
            viewmode: t.data.viewmode,
            floor: ne(t.data.floorId, n),
            feature_type: t.data.featureType,
            constraint_style: t.data.constraint,
            continuous: t.data.continuous
          }
          e.track("measure_segment_add", i)
        }
      },
      {
        msgType: MeasureAddMessage,
        func: (e, t, n) => {
          const i = {
            measure_sid: t.data.sid,
            length: t.data.totalLength,
            segments: t.data.segments,
            temporary: t.data.temporary,
            viewmode: t.data.viewmode,
            floor: ne(t.data.floorId, n),
            feature_type: t.data.featureType,
            measure_type: t.data.type,
            constraint_style: t.data.constraint,
            continuous: t.data.continuous
          }
          e.track("measure_add", i)
        }
      },
      {
        msgType: MeasureAddTitleMessage,
        func: (e, t) => {
          const n = {
            measure_sid: t.sid,
            measure_text: t.text
          }
          e.track("measure_add_title", n)
        }
      },
      {
        msgType: MeasureUpdateTitleMessage,
        func: (e, t) => {
          const n = {
            measure_sid: t.sid,
            measure_old_text: t.oldText,
            measure_new_text: t.newText
          }
          e.track("measure_update_title", n)
        }
      },
      {
        msgType: MeasureRemoveMessage,
        func: (e, t, n) => {
          const i = {
            measure_sid: t.data.sid,
            length: t.data.totalLength,
            segments: t.data.segments,
            temporary: t.data.temporary,
            viewmode: t.data.viewmode,
            floor: ne(t.data.floorId, n),
            measure_count: t.data.count,
            continuous: t.data.continuous
          }
          e.track("measure_remove", i)
        }
      },
      {
        msgType: MeasureUpdateMessage,
        func: (e, t, n) => {
          const i = {
            measure_sid: t.data.sid,
            length: t.data.totalLength,
            segments: t.data.segments,
            temporary: t.data.temporary,
            viewmode: t.data.viewmode,
            floor: ne(t.data.floorId, n),
            feature_type: t.data.featureType,
            constraint_style: t.data.constraint,
            continuous: t.data.continuous
          }
          e.track("measure_update", i)
        }
      },
      {
        msgType: MeasureModeChangeMessage,
        func: (e, t) => {
          const n = t.opened ? "measure_mode_enter" : "measure_mode_exit",
            i = {
              viewmode: t.viewmode,
              measure_count: t.count
            }
          e.track(n, i)
        }
      },
      {
        msgType: MeasureCancelledMessage,
        func: (e, t) => {
          e.track("measure_cancelled", {})
        }
      }
    ]
  }
}
class re {
  constructor() {
    this.handlers = [
      {
        msgType: ActivitycMessage,
        func: (e, t) => {
          const n = {
            duration_dollhouse: t.durationDollhouse,
            duration_floorplan: t.durationFloorplan,
            duration_inside: t.durationInside,
            duration: t.durationDollhouse + t.durationFloorplan + t.durationInside,
            main_mode: t.mainMode,
            bytes_downloaded: t.totalBytesDownloaded,
            tiles_downloaded: t.tilesDownloaded
          }
          e.track("activity_ping", n)
        }
      }
    ]
  }
}
enum ae {
  ACTIVE = "active",
  INACTIVE = "inactive",
  UNINITIALIZED = "uninitialized"
}
class ActivityAnalytics {
  constructor() {
    ;(this.name = "activity-analytics"),
      (this._state = ae.UNINITIALIZED),
      (this.activeModeMap = new Map()),
      (this.totalTilesDownloaded = 0),
      (this.onTileDownloaded = () => {
        this.totalTilesDownloaded++
      })
  }
  async init(e, t, n) {
    ;(this.engine = e),
      (this.requestQueue = n),
      ([this.input, this.viewmodeData, this.applicationData] = await Promise.all([
        await e.getModuleBySymbol(InputSymbol),
        await e.market.waitForData(ViewmodeData),
        await e.market.waitForData(AppData)
      ]))
    const i = [],
      r = [InputClickerEndEvent, DraggerMoveEvent, KeyboardCallbackEvent, OnMouseDownEvent, PincherMoveEvent],
      a = () => (this.active = !0)
    this.applicationData.phase === AppStatus.PLAYING
      ? (this._state = ae.INACTIVE)
      : i.push(
          e.subscribe(AppPhaseChangeMessage, () => {
            this.applicationData.phase === AppStatus.PLAYING && (this._state = ae.INACTIVE)
          })
        ),
      i.push(
        ...(() => {
          const e = []
          return (
            r.forEach(t => {
              e.push(this.input.registerUnfilteredHandler(t, a))
            }),
            e
          )
        })()
      ),
      i.push(
        e.subscribe(EndSwitchViewmodeMessage, e => {
          const t = e.fromMode,
            n = e.toMode
          t && t !== ViewModes.Transition && this.applicationData.phase === AppStatus.PLAYING && this.handleModeChange(t, n)
        })
      ),
      i.push(this.engine.subscribe(TileDownloadedMessage, this.onTileDownloaded)),
      t(i)
  }
  get active() {
    return this._state === ae.ACTIVE
  }
  set active(e) {
    this._state !== ae.UNINITIALIZED && (e && this._state === ae.INACTIVE && this.startActivityTimeout(), (this._state = e ? ae.ACTIVE : ae.INACTIVE))
  }
  handleModeChange(e, t) {
    this.activeModeMap.has(t)
      ? this.updateActivityTimeForMode(t, !0)
      : this.activeModeMap.set(t, {
          previousTime: Date.now(),
          totalTimeinMS: 0
        }),
      this.updateActivityTimeForMode(e)
  }
  updateActivityTimeForMode(e, t) {
    const n = this.activeModeMap.get(e)
    if (void 0 === n) return
    const { previousTime: i, totalTimeinMS: s } = n
    t
      ? this.activeModeMap.set(e, {
          previousTime: Date.now(),
          totalTimeinMS: s
        })
      : this.activeModeMap.set(e, {
          previousTime: Date.now(),
          totalTimeinMS: s + (Date.now() - i)
        })
  }
  startActivityTimeout() {
    this.activeModeMap.set(ViewModes.Dollhouse, {
      previousTime: Date.now(),
      totalTimeinMS: 0
    }),
      this.activeModeMap.set(ViewModes.Floorplan, {
        previousTime: Date.now(),
        totalTimeinMS: 0
      }),
      this.activeModeMap.set(ViewModes.Panorama, {
        previousTime: Date.now(),
        totalTimeinMS: 0
      }),
      window.setTimeout(this.notifyActivityAnalytic.bind(this), ActivityAnalytics.ACTIVITY_INTERVAL)
  }
  notifyActivityAnalytic() {
    if (
      (this.viewmodeData.currentMode && this.viewmodeData.currentMode !== ViewModes.Transition && this.updateActivityTimeForMode(this.viewmodeData.currentMode),
      this.active)
    ) {
      let e = 0,
        t = ViewModes.Panorama
      this.activeModeMap.forEach((n, i) => {
        n.totalTimeinMS > e && ((t = i), (e = n.totalTimeinMS))
      }),
        (this.active = !1)
      const [n, i, s] = [
        this.activeModeMap.get(ViewModes.Dollhouse),
        this.activeModeMap.get(ViewModes.Floorplan),
        this.activeModeMap.get(ViewModes.Panorama)
      ].map(e => (e ? e.totalTimeinMS : 0))
      this.engine.broadcast(new ActivitycMessage(n, i, s, NotifyActivityAnalytic[t], this.requestQueue.totalBytesDownloaded, this.totalTilesDownloaded))
    }
  }
}
ActivityAnalytics.ACTIVITY_INTERVAL = 15e3
enum fe {
  TOUR = "tour",
  USER = "self-guided"
}
class ve {
  constructor() {
    this.handlers = [
      {
        msgType: RoomVisitedMessage,
        func: (e, t, n) => {
          const i = n.tryGetData(InteractionData),
            s = n.tryGetData(_TourData),
            r = {
              room_id: t.roomId,
              room_index: t.meshSubgroup,
              room_type: t.roomType,
              viewmode: t.viewmode ? NotifyActivityAnalytic[t.viewmode] : t.viewmode,
              room_visit_count: t.visitCount,
              room_count: t.roomCount,
              navigation_source: s && s.tourPlaying ? fe.TOUR : fe.USER,
              interaction_source: i ? i.source : InteractionData.defaultSource,
              interaction_mode: i ? i.mode : InteractionData.defaultMode
            }
          e.track("room_visited", r)
        }
      }
    ]
  }
}
class ye {
  constructor() {
    this.handlers = []
  }
}
const Ee = e => e.sort((e, t) => e.localeCompare(t))
class Se {
  constructor() {
    this.handlers = [
      {
        msgType: ModelRatedMessage,
        func: (e, t) => {
          const { happiness: n, quality: i, navigation: s, feedback: r } = t.rating,
            a = {}
          n && (a.happiness = +n),
            ((s && s.length > 0) || (i && i.length > 0)) &&
              (a.issue_types = (function (e = [], t = []) {
                const n = []
                return Ee(t).forEach(e => n.push(`navigation-${e.trim()}`)), Ee(e).forEach(e => n.push(`quality-${e.trim()}`)), n.join(",")
              })(i || [], s || [])),
            r && r.length > 0 && (a.feedback = r),
            Object.keys(a).length > 0 && e.track("model_rated", a)
        }
      }
    ]
  }
}
const _e = [1e3, 3e3, 5e3, 15e3]
class we {
  constructor() {
    ;(this.currSpinnerSessionId = null),
      (this.currSpinnerSessionStartTime = null),
      (this.currIntervalIdx = 0),
      (this.pingTimeout = null),
      (this.handlers = [
        {
          msgType: LoadSpinnerMessage,
          func: (e, t) => {
            t.isOpen ? this.startPinging(e) : this.stopPinging(e)
          }
        }
      ])
  }
  startPinging(e) {
    null == this.currSpinnerSessionId &&
      ((this.currSpinnerSessionId = randomUUID()),
      (this.currSpinnerSessionStartTime = Date.now()),
      (this.currIntervalIdx = 0),
      (this.pingTimeout = window.setTimeout(() => this.pingAnalytics(e), _e[this.currIntervalIdx])))
  }
  stopPinging(e) {
    if (this.currSpinnerSessionId && this.currSpinnerSessionStartTime) {
      const t = Date.now() - this.currSpinnerSessionStartTime
      e.track("pano_tile_loading", {
        session_id: this.currSpinnerSessionId,
        duration: t,
        final_duration: t
      }),
        this.pingTimeout && (window.clearTimeout(this.pingTimeout), (this.pingTimeout = null)),
        (this.currSpinnerSessionId = null)
    }
  }
  pingAnalytics(e) {
    this.currSpinnerSessionId &&
      this.currSpinnerSessionStartTime &&
      (e.track("pano_tile_loading", {
        session_id: this.currSpinnerSessionId,
        duration: Date.now() - this.currSpinnerSessionStartTime,
        final_duration: null
      }),
      (this.currIntervalIdx = Math.min(this.currIntervalIdx + 1, _e.length - 1)),
      (this.pingTimeout = window.setTimeout(() => this.pingAnalytics(e), _e[this.currIntervalIdx])))
  }
}

enum Ie {
  DAM_MESH = "dam_mesh",
  DAM_TEXTURE = "dam_texture",
  GRAPH = "graph",
  PANO_TILE = "pano_tile",
  STATIC = "static",
  TILED_MESH = "tiled_mesh",
  TILED_TEXTURE = "tiled_texture"
}
class Pe {
  constructor() {
    ;(this.lastFlushTimestamp = null),
      (this.lastSendTimestamp = null),
      (this.isRecording = !1),
      (this.isSending = !1),
      (this.stats = {
        [Ie.DAM_MESH]: {
          sum: 0,
          count: 0
        },
        [Ie.TILED_MESH]: {
          sum: 0,
          count: 0
        },
        [Ie.PANO_TILE]: {
          sum: 0,
          count: 0
        },
        [Ie.DAM_TEXTURE]: {
          sum: 0,
          count: 0
        },
        [Ie.TILED_TEXTURE]: {
          sum: 0,
          count: 0
        },
        [Ie.STATIC]: {
          sum: 0,
          count: 0
        },
        [Ie.GRAPH]: {
          sum: 0,
          count: 0
        }
      }),
      (this.totalStatsCount = 0),
      (this.handlers = [
        {
          msgType: AppPhaseChangeMessage,
          func: (e, t) => {
            t.phase === AppStatus.STARTING ? (this.isRecording = !0) : t.phase === AppStatus.PLAYING && (this.isSending = !0)
          }
        }
      ])
  }
  get dataBuffer() {
    return null == this._dataBuffer ? ((this._dataBuffer = new Ne(300)), this._dataBuffer) : this._dataBuffer
  }
  onUpdate(e, t) {
    this.isRecording && (this.flushTimingDataThrottled(), this.updateStats(t), this.isSending && this.sendAnalyticsThrottled(e))
  }
  flushTimingDataThrottled() {
    if (null == this.lastFlushTimestamp || performance.now() - this.lastFlushTimestamp > 5e3) {
      const e = performance.getEntriesByType("resource")
      for (const t of e) t.transferSize > 0 && this.dataBuffer.enq(t)
      performance.clearResourceTimings(), (this.lastFlushTimestamp = performance.now())
    }
  }
  sendAnalyticsThrottled(e) {
    if ((null == this.lastSendTimestamp || performance.now() - this.lastSendTimestamp > 5e3) && this.totalStatsCount > 10) {
      const t = {}
      for (const e in this.stats) {
        const n = e,
          i = this.stats[n]
        i.count > 0 && ((t[n] = 0 | Math.round(i.sum / i.count)), (i.sum = 0), (i.count = 0))
      }
      e.track("resource_timing", t), (this.totalStatsCount = 0), (this.lastSendTimestamp = performance.now())
    }
  }
  updateStats(e) {
    if (e < 33.333333333333336) {
      let e = 0
      for (; e < 30 && !this.dataBuffer.isEmpty(); ) {
        const t = this.dataBuffer.deq(),
          n = xe(t)
        n && ((this.stats[n].sum += t.duration), (this.stats[n].count += 1), (this.totalStatsCount += 1)), (e += 1)
      }
    }
  }
}
const xe = e => {
  const t = new URL(e.name),
    n = t.hostname,
    i = t.pathname.split("/"),
    s = i[i.length - 1]
  return n.includes("static")
    ? Ie.STATIC
    : "graph" === s
      ? Ie.GRAPH
      : i.includes("mesh_tiles") && s.includes(".glb")
        ? Ie.TILED_MESH
        : i.includes("mesh_tiles") && (s.includes(".ktx2") || s.includes(".jpg"))
          ? Ie.TILED_TEXTURE
          : s.includes(".dam")
            ? Ie.DAM_MESH
            : i.includes("tiles")
              ? Ie.PANO_TILE
              : i[i.length - 2].includes("_texture_")
                ? Ie.DAM_TEXTURE
                : null
}
const LogAnalytics = new DebugInfo("log-analytics")
class Ce {
  init(e, t) {
    return (
      LogAnalytics.debug("logging analytics to console", {
        options: e,
        context: t
      }),
      Promise.resolve()
    )
  }
  identify(e) {
    LogAnalytics.debug("identify as", e)
  }
  track(e, t, n) {
    LogAnalytics.debug({
      eventName: e,
      data: t,
      intercom: n
    })
  }
  trackAsync(e, t, n) {
    LogAnalytics.debug({
      eventName: e,
      data: t,
      intercom: n
    })
  }
  setOptions(e) {
    LogAnalytics.debug("set options", e)
  }
}
const SegmentDebugInfo = new DebugInfo("segment")
class Re {
  constructor(e) {
    ;(this.token = e), (this.options = {})
  }
  init(e, t) {
    return (
      this.setOptions(e),
      (this.context = t),
      this.token
        ? (window.analytics && window.analytics.initialize && (window.analytics = null),
          window.analytics ||
            (function () {
              var e = (window.analytics = window.analytics || [])
              if (!e.initialize)
                if (e.invoked) window.console && console.error && console.error("Segment snippet included twice.")
                else {
                  ;(e.invoked = !0),
                    (e.methods = [
                      "trackSubmit",
                      "trackClick",
                      "trackLink",
                      "trackForm",
                      "pageview",
                      "identify",
                      "reset",
                      "group",
                      "track",
                      "ready",
                      "alias",
                      "debug",
                      "page",
                      "once",
                      "off",
                      "on",
                      "addSourceMiddleware",
                      "addIntegrationMiddleware",
                      "setAnonymousId",
                      "addDestinationMiddleware"
                    ]),
                    (e.factory = function (t) {
                      return function () {
                        var n = Array.prototype.slice.call(arguments)
                        return n.unshift(t), e.push(n), e
                      }
                    })
                  for (var t = 0; t < e.methods.length; t++) {
                    var n = e.methods[t]
                    e[n] = e.factory(n)
                  }
                  ;(e.load = function (t, n) {
                    var i = document.createElement("script")
                    ;(i.type = "text/javascript"),
                      (i.async = !0),
                      (i.src =
                        ("https:" === document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js")
                    var s = document.getElementsByTagName("script")[0]
                    s.parentNode.insertBefore(i, s), (e._loadOptions = n)
                  }),
                    (e.SNIPPET_VERSION = "4.15.2")
                }
            })(),
          window.analytics.load(this.token),
          new Promise((e, t) => {
            window.analytics.ready(e)
          }))
        : Promise.resolve()
    )
  }
  identify(e) {
    window.analytics.identify(e.id, {
      first_name: e.firstName,
      last_name: e.lastName,
      email: e.email
    })
  }
  track(e, t, n) {
    DebugInfo.level >= 3 && SegmentDebugInfo.debug(e, t ? JSON.stringify(t).replace('\\"', '"') : t), (t = Object.assign(t || {}, this.options))
    const i = this.context.integrations ? Object.assign({}, this.context.integrations) : {}
    i.Intercom = !!n
    try {
      window.analytics.track(
        e,
        t,
        Object.assign(Object.assign({}, this.context), {
          integrations: i
        })
      )
    } catch (t) {
      SegmentDebugInfo.error(`Failed to send data to segment for ${e}`)
    }
  }
  trackAsync(e, t, n) {
    if (((t = t || {}), navigator.sendBeacon))
      try {
        navigator.sendBeacon(
          "https://api.segment.io/v1/t",
          JSON.stringify({
            event: e,
            anonymousId: window.analytics.user().anonymousId(),
            properties: Object.assign(
              {
                data: t
              },
              this.options
            ),
            integrations: {
              Intercom: !!n
            },
            writeKey: this.token,
            sentAt: Date.now(),
            type: "track",
            context: this.context
          })
        )
      } catch (e) {
        SegmentDebugInfo.error("Failed to send async segment request")
      }
  }
  setOptions(e) {
    Object.assign(this.options, e)
  }
}
const MpAnalyticsDebugInfo = new DebugInfo("mp-analytics"),
  Be = "ajs_anonymous_id",
  Ve = "sc_anonymous_id"
class Ge {
  constructor(e, t, n) {
    ;(this.token = e),
      (this.url = t),
      (this.queue = n),
      (this.options = {}),
      (this.segmentStylePayload = (e, t, n) => ({
        timestamp: toISOString(new Date()),
        integrations: {
          Intercom: !!n
        },
        context: this.segmentStyleContext(this.context),
        properties: t,
        event: e,
        messageId: randomUUID(),
        anonymousId: this.anonymousId,
        type: "track",
        userId: this.user ? this.user.id : null,
        sentAt: toISOString(new Date())
      })),
      (this.segmentStyleContext = e => {
        const t = {
          page: {
            path: window.location.pathname,
            referrer: (0, Fe.an)(),
            search: window.location.search,
            title: window.document.title,
            url: window.location.href
          },
          userAgent: navigator.userAgent,
          library: {
            name: "JMYDCase",
            version: "1"
          },
          campaign: {}
        }
        return Object.assign(Object.assign({}, e), t)
      })
    const i = lsGetItem(Ve)
    if (i) this.anonymousId = i
    else {
      const e = (0, je.$)(Be)
      ;(this.anonymousId = e && "string" == typeof e ? e.replace(/%22/g, "") : randomUUID()), lsSetItem(Ve, this.anonymousId)
    }
    this.headers = {
      "X-API-Key": this.token,
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  }
  init(e, t) {
    return (
      this.setOptions(e),
      (this.context = t),
      MpAnalyticsDebugInfo.debug("init", {
        options: this.options,
        context: this.segmentStyleContext(this.context)
      }),
      Promise.resolve()
    )
  }
  identify(e) {
    MpAnalyticsDebugInfo.debug("identify as", e), (this.user = e)
  }
  track(e, t, n) {
    DebugInfo.level >= 3 && MpAnalyticsDebugInfo.debug(e, t ? JSON.stringify(t).replace('\\"', '"') : t), (t = Object.assign(t || {}, this.options))
    const i = this.segmentStylePayload(e, t, n)
    this.queue.post(this.url, {
      body: i,
      headers: this.headers
    })
  }
  trackAsync(e, t, n) {
    if (((t = Object.assign(t || {}, this.options)), navigator.sendBeacon))
      try {
        const i = this.segmentStylePayload(e, t, n)
        navigator.sendBeacon(`${this.url}?api_key=${this.token}`, JSON.stringify(i))
      } catch (e) {
        MpAnalyticsDebugInfo.error("Failed to sendBeacon analytics request")
      }
  }
  setOptions(e) {
    Object.assign(this.options, e)
  }
}
const We = {
  logging: async () => new Ce(),
  segment: async (e, t) => {
    const n = await t.getAppKey(e, "segment_key")
    return new Re(null != n ? n : void 0)
  },
  mp: async (e, t, n) => {
    const i = await t.getAppKey(e, "analytics_mp_key"),
      s = await t.getAppKey(e, "analytics_mp_url")
    return i && s ? new Ge(i, s, n) : null
  }
}

export default class ShowcaseAnalyticsModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "JMYDCase-analytics"),
      (this.loaded = !1),
      (this.handlers = []),
      (this.track = (e, t) => {
        this.analytics.track(e, t)
      })
  }
  async init(e, t) {
    ;(this.analyticsQueue = e.analyticsQueue),
      (this.analytics = await t.getModuleBySymbol(AnalyticsSymbol)),
      (this.apiClient = (await t.getModuleBySymbol(Apiv2Symbol)).getApi()),
      this.addMessageHandlers(this.analytics, t),
      (this.context = (0, r.bC)(e.apiQueue, "", e.appName)),
      (this.options = Object.assign(
        {
          mds_enabled: !0
        },
        (0, r.FW)(e.overrideParams)
      )),
      t.getModuleBySymbol(LocaleSymbol).then(e => {
        this.context.locale = e.languageCode
      }),
      (this.activityTracking = new ActivityAnalytics()),
      this.activityTracking.init(t, this.registerBindings.bind(this), e.apiQueue)
    const n = await this.createEndpoints(e)
    this.analytics.load(n, this.options, this.context).then(() => {
      this.loaded = !0
    }),
      this.apiClient.user.then(e => {
        this.analytics.setUser(e)
      })
  }
  addMessageHandlers(e, t) {
    //pw
  }
  addMessageHandler(e, t) {
    this.handlers.push(e),
      e.handlers.forEach((e, n) => {
        this.bindings.push(
          t.subscribe(e.msgType, n => {
            e.func(this.analytics, n, t.market)
          })
        )
      })
  }
  registerBindings(e) {
    this.bindings.push(...e)
  }
  async createEndpoint(e, t) {
    var n
    return null === (n = We[e]) || void 0 === n ? void 0 : n.call(We, t, this.apiClient, this.analyticsQueue)
  }
  async createEndpoints(e) {
    const t = (0, r.F$)(e.appName),
      n = void 0 !== e.provider ? e.provider : await this.apiClient.getAppKey(t, "analytics_provider"),
      i = []
    if (!n) return i
    const s = n.split(",")
    for (const e of s) {
      const n = await this.createEndpoint(e, t)
      null !== n ? i.push(n) : this.log.warn(`Failed to set up ${e}, token/url required but not found in config`)
    }
    return i.length < 1 && i.push(await this.createEndpoint("logging", t)), i
  }
  onUpdate(e) {
    if (this.loaded) for (const t of this.handlers) t.onUpdate && t.onUpdate(this.analytics, e)
  }
  dispose(e) {
    super.dispose(e)
    for (const e of this.handlers) e.dispose && e.dispose()
    this.handlers = []
  }
  getSessionId() {
    return this.options.session_id || ""
  }
  trackGuiEvent(e, t = {}) {
    const { tool: n, interactionSource: i, panoId: s } = t,
      r = {
        gui_action: e
      }
    n &&
      Object.assign(r, {
        tool: n
      }),
      i &&
        Object.assign(r, {
          interaction_source: i
        }),
      s &&
        Object.assign(r, {
          pano_id: s
        }),
      this.track("JMYDCase_gui", r)
  }
  trackToolGuiEvent(e, t, n = {}) {
    this.trackGuiEvent(
      t,
      Object.assign(
        {
          tool: e
        },
        n
      )
    )
  }
}
