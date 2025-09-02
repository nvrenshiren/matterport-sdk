import { randomColorMap } from "../utils/69984"
import * as c from "../utils/92558"
import { ChunkConfig } from "../const/51524"
import { FeaturesTiledMeshKey } from "../const/53203"
import * as s from "../const/53613"
import { EngineTickState } from "../const/engineTick.const"
import { InputSymbol, ModelMeshSymbol, SettingsSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import Engine from "../core/engine"
import { createSubscription } from "../core/subscription"
import { waitRun } from "../utils/func.utils"
import { getValFromURL } from "../utils/urlParams.utils"
import { Vector3, Vector4 } from "three"
function d(e, t = 16) {
  let n
  const a = createSubscription(
    () => (n = window.setInterval(() => e(), t)),
    () => {
      n && clearInterval(n)
    }
  )
  return a.cancel(), a
}
const debug = new DebugInfo("tiled-mesh"),
  f = {
    hideMenu: "1" !== getValFromURL("dmenu", "0"),
    debug: "1" === getValFromURL("debugTiles", "0") || "1" === getValFromURL("debug-tiles", "0"),
    statsTiles: !1,
    statsTileset: !0,
    statsTextures: !0,
    statsTextureStream: !0
  }
let T = null
function b(e, t, n) {
  T ||
    ((T = document.createElement("div")),
    (T.style.color = "#FFFFFF"),
    (T.style.fontFamily = "Roboto"),
    (T.style.fontWeight = "300"),
    (T.style.fontSize = "12px"),
    (T.style.position = "absolute"),
    (T.style.top = "85px"),
    (T.style.width = "500px"),
    (T.style.pointerEvents = "none"),
    (T.style.whiteSpace = "pre"),
    (T.style.zIndex = "99999"),
    (T.style.textShadow = "0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black"),
    document.body.appendChild(T))
  let a = "\n\n"
  ;(a += (function (e) {
    const t = e.threeRenderer.info
    return `three:\n  drawCalls: ${t.render.calls}\n  geometries: ${t.memory.geometries}\n  textures: ${t.memory.textures}\n  triangles: ${t.render.triangles}\n  memory allocated (megs): ${Math.floor(e.estimatedGPUMemoryAllocated() / 2 ** 20)}`
  })(e)),
    (a += f.statsTextureStream
      ? (function (e) {
          const t = `\ntextureStreaming:\n  downloadingTiles: ${e.downloadingTiles} / ${e.totalTiles}\n  downloadingTextures: ${e.loadingTextures}\n`,
            n =
              "  downloaded:\n" +
              Object.keys(e.totalTextures)
                .map(t => `    ${t}: ${e.totalTextures[t]} `)
                .join("\n") +
              "\n"
          return t + n
        })(n)
      : ""),
    t.forEach((e, t) => {
      const n = e.modelMesh
      ;(a += `\n\n<mesh: id:${t}>`),
        (a += f.statsTileset
          ? (function (e, t) {
              var n, a, r
              const l = e.tilesRenderer,
                i = Object.values(null !== (n = l.tileSets) && void 0 !== n ? n : [])[0]
              return `\n  tileset: preset: ${null === (a = null == i ? void 0 : i.asset.extras) || void 0 === a ? void 0 : a.preset}, depth: ${null === (r = null == i ? void 0 : i.asset.extras) || void 0 === r ? void 0 : r.depth}, version: ${null == i ? void 0 : i.asset.tilesetVersion}\n  view: errorTarget: ${t.settings.errorTarget}, maxLOD: ${t.settings.maxLOD}, detail: '${t.detail}'\n`
            })(n.tileLoader, n)
          : ""),
        (a += f.statsTiles
          ? (function (e) {
              const t = e.tilesRenderer,
                n = t.visibleTiles,
                a = {}
              n.forEach(e => {
                var t
                const n = `lod${null === (t = e.extras) || void 0 === t ? void 0 : t.level}`,
                  r = a[n] || 0
                a[n] = r + 1
              })
              const { stats: r, downloadQueue: l, parseQueue: i, lruCache: s } = t,
                { active: o, downloading: d, inFrustum: u, parsing: g, used: c, visible: h } = r
              return (
                `  tiles:\n    tiles in frustum: ${u}\n    visible: ${h}` +
                Object.keys(a)
                  .sort()
                  .map(e => `\n     ${e} tiles: ${a[e] || 0}`)
                  .join() +
                `\n    downloading gltf: ${d}\n    parsing gltf: ${g}\n    active: ${o}\n    used: ${c}\n    queues:\n      download: ${l.currJobs} running, ${l.items.length} waiting\n      parse: ${i.currJobs} running, ${i.items.length} waiting\n    lruCache: ${s.itemSet.size}\n`
              )
            })(n.tileLoader)
          : ""),
        (a += `</mesh: id:${t}>`)
    }),
    (T.textContent = a)
}
function v(e, t, n, r, l, i) {
  C &&
    (e.forEach((e, n) => {
      x.has(e.modelMesh) ||
        (x.add(e.modelMesh),
        w.push(
          ...(function (e, t, n, r) {
            return [
              {
                panel: e,
                header: t.tile + ": " + n,
                setting: "maxLOD: " + n,
                initialValue: () => r.settings.maxLOD,
                onChange: e => {
                  r.settings.maxLOD = e
                },
                range: [0, 4],
                rangePrecision: 0
              },
              {
                panel: e,
                header: t.tile + ": " + n,
                setting: "nonMeshMaxLOD: " + n,
                initialValue: () => r.settings.nonMeshMaxLOD,
                onChange: e => {
                  r.settings.nonMeshMaxLOD = e
                },
                range: [0, 4],
                rangePrecision: 0
              },
              {
                panel: e,
                header: t.tile + ": " + n,
                setting: "minLOD: " + n,
                initialValue: () => r.settings.minLOD,
                onChange: e => {
                  r.settings.minLOD = e
                },
                range: [0, 4],
                rangePrecision: 0
              },
              {
                panel: e,
                header: t.tile + ": " + n,
                setting: "errorTarget:" + n,
                initialValue: () => r.settings.errorTarget,
                onChange: e => {
                  r.settings.errorTarget = e
                },
                range: [0, 20],
                rangePrecision: 1,
                urlParam: !0
              },
              {
                panel: e,
                header: t.tile + ": " + n,
                setting: "disableTileUpdates:" + n,
                initialValue: () => r.settings.disableTileUpdates,
                onChange: e => {
                  r.settings.disableTileUpdates = e
                }
              },
              {
                panel: e,
                header: t.tile + ": " + n,
                setting: "disposeModel: " + n,
                initialValue: () => r.settings.disposeModel,
                onChange: e => {
                  r.settings.disposeModel = e
                }
              },
              {
                panel: e,
                header: t.tile + ": " + n,
                setting: "pos on z axis: " + n,
                initialValue: () => 0,
                onChange: e => {
                  r.position.copy(new Vector3(0, 0, e)), r.updateMatrixWorld(!0)
                },
                range: [-100, 100],
                rangePrecision: 0
              }
            ]
          })(t, r, n, e.modelMesh)
        ),
        w.push(
          ...(function (e, t, n, a, r, l) {
            const i = a.tileLoader,
              s = P(i, l, (e, t) => e.setWireframe(t)),
              o = (function (e, t) {
                const n = { scale: 1 },
                  a = (t, a) => {
                    if (!t) return
                    const r = e.container.tilesByChunkId.get(t.id),
                      l = (null == r ? void 0 : r.__error) || 1e-4,
                      i = t.lod !== ChunkConfig.maxLOD && l > ChunkConfig.errorTarget ? 1 : 0.5,
                      s = Math.max(0, Math.min(1, 1 - n.scale / l)),
                      o = a ? O(t.lod, s, i) : null
                    t.setColorOverlay(o)
                  },
                  r = P(e, t, a),
                  l = d(() => r.colorize(e.container.chunks))
                return {
                  toggle: e => {
                    e ? l.renew() : l.cancel(), r.toggle(e)
                  },
                  colorize: r.colorize,
                  subscription: l,
                  config: n
                }
              })(i, l),
              u = P(i, l, (e, t) => {
                e.setColorOverlay(t ? O(e.lod, 1, 0.5) : null)
              }),
              g = P(i, l, (e, t) => {
                e.setColorOverlay(t ? randomColorMap(0.5, e.id || 0) : null)
              }),
              m = P(i, l, (e, t) => {
                var n
                const a = i.container.tilesByChunkId.get(e.id)
                e.setColorOverlay(
                  t ? randomColorMap(0.5, (0, c.un)((null === (n = null == a ? void 0 : a.content) || void 0 === n ? void 0 : n.uri) || "missing") || 0) : null
                )
              }),
              M = P(i, l, (e, t) => {
                e.setColorOverlay(t ? randomColorMap(0.5, (e.meshGroup << 16) + e.meshSubgroup || 0) : null)
              }),
              f = P(i, l, (e, t) => {
                e.setColorOverlay(t ? randomColorMap(0.5, e.meshSubgroup || 0) : null)
              }),
              T = P(i, l, (e, t) => {
                e.setColorOverlay(t ? randomColorMap(0.5, e.meshGroup || 0) : null)
              }),
              b = P(i, l, (e, t) => {
                e.setColorOverlay(t ? randomColorMap(0.5, (0, c.un)(e.textureName) || 0) : null)
              }),
              v = P(i, l, (e, t) => {
                const n = i.container.tilesByChunkId.get(e.id)
                e.setColorOverlay(t ? randomColorMap(0.5, (null == n ? void 0 : n.geometricError) || 0) : null)
              }),
              w = r.slots,
              x = r.textureQualityMap,
              C = P(i, l, (e, t) => {
                const n = w.find(t => t.textureName === e.textureName)
                if (n) {
                  const a = n.loading ? 1 : n.quality > x.min(e.lod) ? 0.7 : 0.3,
                    r = x.maxTexelSize / x.get(n.quality).texelSize
                  e.setColorOverlay(t ? O(e.lod, r, a) : null)
                }
              }),
              S = d(() => C.colorize(i.container.chunks))
            let E = "none"
            const V = {
              none: void 0,
              byError: o,
              byGeometricError: v,
              byTile: m,
              bySubgroup: f,
              byMeshgroup: T,
              bySubAndMeshgroup: M,
              byTexture: b,
              byStreamedTextures: {
                subscription: S,
                toggle: e => {
                  e ? S.renew() : S.cancel(),
                    e && debug.info("colorize=byStreamedTextures solid color: loading, dark color: streamed, light color: basis"),
                    C.toggle(e)
                }
              },
              byChunk: g,
              byLod: u
            }
            return [
              {
                panel: e,
                header: `${t.viz}: ${n}`,
                setting: "disableTileUpdates:" + n,
                initialValue: () => a.settings.disableTileUpdates,
                onChange: e => {
                  a.settings.disableTileUpdates = e
                },
                urlParam: !0
              },
              { panel: e, header: `${t.viz}: ${n}`, setting: "wireframe:" + n, initialValue: () => !1, onChange: s.toggle, urlParam: !0 },
              {
                panel: e,
                header: `${t.viz}: ${n}`,
                setting: "colorize:" + n,
                initialValue: () => "none",
                onChange: e => {
                  var t, n
                  null === (t = V[E]) || void 0 === t || t.toggle(!1), null === (n = V[e]) || void 0 === n || n.toggle(!0), (E = e)
                },
                options: Object.keys(V),
                urlParam: !0
              },
              {
                panel: e,
                header: `${t.viz}: ${n}`,
                setting: "colorizeByErrorScale:" + n,
                initialValue: () => 1,
                onChange: e => {
                  o.config.scale = e
                },
                range: [0, 6],
                rangePrecision: 3,
                urlParam: !0
              }
            ]
          })(t, r, n, e.modelMesh, l, i)
        ))
    }),
    w.length && (w.forEach(e => n.registerMenuEntry(e)), (w.length = 0)))
}
const w = [],
  x = new Set()
let C = !1,
  S = null

function P(e, t, n) {
  let a = !1
  const r = e => {
      t.after(EngineTickState.End).then(() => {
        e.forEach(e => {
          e && n(e, a)
        })
      })
    },
    l = e.notifyOnChunksLoaded(r)
  l.cancel()
  return {
    toggle: t => {
      t ? l.renew() : l.cancel(), t !== a && ((a = t), r([...e.container.chunks]))
    },
    colorize: r,
    subscription: l
  }
}
const V = {
  0: new Vector4(1, 0, 0, 1),
  1: new Vector4(0, 1, 0, 1),
  2: new Vector4(0, 0, 1, 1),
  3: new Vector4(1, 1, 1, 1),
  4: new Vector4(1, 0, 1, 1),
  5: new Vector4(0, 1, 1, 1),
  6: new Vector4(1, 1, 0, 1),
  7: new Vector4(0, 0, 0, 1)
}
function O(e, t, n) {
  var r, l
  const i = null !== (l = null === (r = V[e]) || void 0 === r ? void 0 : r.clone()) && void 0 !== l ? l : new Vector4()
  return i.multiplyScalar(t), i.setW(n), i
}

export default async (e: Engine) => {
  if (!f.debug) return
  const t = await e.getModuleBySymbol(SettingsSymbol),
    n = await e.getModuleBySymbol(InputSymbol),
    a = await e.getModuleBySymbol(WebglRendererSymbol),
    r = a.getScene(),
    o = await e.getModuleBySymbol(ModelMeshSymbol)
  await o.firstMeshLoadPromise, await waitRun(100)
  const d = o.meshes,
    u = o.meshTextureLoader,
    c = t.tryGetProperty(FeaturesTiledMeshKey, !1),
    h = t.addPanel(s.s.TITLE, s.s.HOTKEYS, { width: 350 }),
    m = { viz: "visualize", stats: "stats", tile: "tileset", log: "log" }
  function T() {
    S ||
      (S = setInterval(() => {
        b(a, d, u), v(d, h, t, m, u, e)
      }, 150))
  }
  const w = [
      {
        panel: h,
        header: m.stats,
        setting: "tilesetStatsOverlay",
        initialValue: () => f.statsTileset,
        onChange: e => {
          ;(f.statsTileset = e), e && T()
        },
        urlParam: !0
      },
      {
        panel: h,
        header: m.stats,
        setting: "tileStatsOverlay",
        initialValue: () => f.statsTiles,
        onChange: e => {
          ;(f.statsTiles = e), e && T()
        },
        urlParam: !0
      },
      {
        panel: h,
        header: m.stats,
        setting: "textureStatsOverlay",
        initialValue: () => f.statsTextures,
        onChange: e => {
          ;(f.statsTextures = e), e && T()
        },
        urlParam: !0
      },
      {
        panel: h,
        header: m.stats,
        setting: "textureStreamingOverlay",
        initialValue: () => f.statsTextureStream,
        onChange: e => {
          ;(f.statsTextureStream = e), e && T()
        },
        urlParam: !0
      }
    ],
    x = [
      {
        panel: h,
        header: m.log,
        buttonName: "Log: App State",
        callback: () => {
          debug.warn(d), debug.warn(n), debug.warn(r), debug.warn(t)
        }
      }
    ]
  c &&
    (f.hideMenu ||
      (await waitRun(1e3).then(() => {
        t.getSettingsGui()
          .loadGuiPackage()
          .then(() => {
            t.getSettingsGui().toggle(t.getMainPanelId()), t.getSettingsGui().toggle(t.getMainPanelId())
          })
      })),
    await waitRun(16),
    C ||
      (await waitRun(16),
      (C = !0),
      (function (e, t, n, a) {
        return [
          {
            panel: e,
            header: t.tile,
            setting: "smallMeshThreshold",
            initialValue: () => ChunkConfig.smallMeshThreshold,
            onChange: e => {
              ;(ChunkConfig.smallMeshThreshold = e),
                a.forEach(t => {
                  t.modelMesh.settings.smallMeshThreshold = e
                })
            },
            range: [0, 100],
            rangePrecision: 1,
            urlParam: !0
          },
          {
            panel: e,
            header: t.tile,
            setting: "smallMeshErrorMultiplier",
            initialValue: () => ChunkConfig.smallMeshErrorMultiplier,
            onChange: e => {
              ;(ChunkConfig.smallMeshErrorMultiplier = e),
                a.forEach(t => {
                  t.modelMesh.settings.smallMeshErrorMultiplier = e
                })
            },
            range: [0.01, 2],
            rangePrecision: 2,
            urlParam: !0
          },
          {
            panel: e,
            header: t.tile,
            setting: "displayActiveTiles",
            initialValue: () => ChunkConfig.displayActiveTiles,
            onChange: e => {
              ;(ChunkConfig.displayActiveTiles = e),
                a.forEach(t => {
                  t.modelMesh.settings.displayActiveTiles = e
                })
            },
            urlParam: !0
          },
          {
            panel: e,
            header: t.tile,
            setting: "loadSiblings",
            initialValue: () => ChunkConfig.loadSiblings,
            onChange: e => {
              ;(ChunkConfig.loadSiblings = e),
                a.forEach(t => {
                  t.modelMesh.settings.loadSiblings = e
                })
            },
            urlParam: !0
          },
          {
            panel: e,
            header: t.tile,
            setting: "autoDisableRendererCulling",
            initialValue: () => ChunkConfig.autoDisableRendererCulling,
            onChange: e => {
              ;(ChunkConfig.autoDisableRendererCulling = e),
                a.forEach(t => {
                  t.modelMesh.settings.autoDisableRendererCulling = e
                })
            },
            urlParam: !0
          },
          {
            panel: e,
            header: t.tile,
            setting: "stopAtEmptyTiles",
            initialValue: () => ChunkConfig.stopAtEmptyTiles,
            onChange: e => {
              ;(ChunkConfig.stopAtEmptyTiles = e),
                a.forEach(t => {
                  t.modelMesh.settings.stopAtEmptyTiles = e
                })
            },
            urlParam: !0
          },
          {
            panel: e,
            header: t.tile,
            setting: "limitMemoryUsage",
            initialValue: () => ChunkConfig.limitMemoryUsage,
            onChange: e => {
              ;(ChunkConfig.limitMemoryUsage = e),
                a.forEach(t => {
                  t.modelMesh.settings.limitMemoryUsage = e
                })
            },
            urlParam: !0
          },
          {
            panel: e,
            header: t.tile,
            setting: "allocatedMegsBeforeLimitingLod",
            initialValue: () => ChunkConfig.allocatedMegsBeforeLimitingLod,
            onChange: e => {
              ;(ChunkConfig.allocatedMegsBeforeLimitingLod = e),
                a.forEach(t => {
                  t.modelMesh.settings.allocatedMegsBeforeLimitingLod = e
                })
            },
            urlParam: !0,
            range: [100, 1e3]
          },
          {
            panel: e,
            header: t.tile,
            setting: "lruMinExtraTiles",
            initialValue: () => ChunkConfig.lruMinExtraTiles,
            onChange: e => {
              ;(ChunkConfig.lruMinExtraTiles = e),
                a.forEach(t => {
                  t.modelMesh.settings.lruMinExtraTiles = e
                })
            },
            urlParam: !0,
            range: [0, 2e3]
          },
          {
            panel: e,
            header: t.tile,
            setting: "lruMaxTiles",
            initialValue: () => ChunkConfig.lruMaxTiles,
            onChange: e => {
              ;(ChunkConfig.lruMaxTiles = e),
                a.forEach(t => {
                  t.modelMesh.settings.lruMaxTiles = e
                })
            },
            urlParam: !0,
            range: [0, 2e3]
          },
          {
            panel: e,
            header: t.tile,
            setting: "lruUnloadPercent",
            initialValue: () => ChunkConfig.lruUnloadPercent,
            onChange: e => {
              ;(ChunkConfig.lruUnloadPercent = e),
                a.forEach(t => {
                  t.modelMesh.settings.lruUnloadPercent = e
                })
            },
            urlParam: !0,
            range: [0, 1]
          },
          {
            panel: e,
            header: "Priority",
            setting: "errorMultiplierRaycastOcclusion",
            initialValue: () => ChunkConfig.errorMultiplierRaycastOcclusion,
            onChange: e => {
              ;(ChunkConfig.errorMultiplierRaycastOcclusion = e),
                a.forEach(t => {
                  t.modelMesh.settings.errorMultiplierRaycastOcclusion = e
                })
            },
            range: [0.001, 1],
            rangePrecision: 2
          },
          {
            panel: e,
            header: "Priority",
            setting: "errorMultiplierHiddenFloors",
            initialValue: () => ChunkConfig.errorMultiplierHiddenFloors,
            onChange: e => {
              ;(ChunkConfig.errorMultiplierHiddenFloors = e),
                a.forEach(t => {
                  t.modelMesh.settings.errorMultiplierHiddenFloors = e
                })
            },
            range: [0.001, 1],
            rangePrecision: 2
          }
        ]
      })(h, m, 0, d).forEach(e => t.registerMenuEntry(e)),
      w.forEach(e => t.registerMenuEntry(e)),
      x.forEach(e => t.registerMenuButton(e))))
}
