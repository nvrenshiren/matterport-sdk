import { SetMeshOverLayColorCommand } from "../command/mesh.command"
import { FlipYConfig } from "../const/53203"
import * as a from "../const/53613"
import { ModelMeshSymbol, SettingsSymbol } from "../const/symbol.const"
import Engine from "../core/engine"
import * as s from "../webgl/64210"
export default async (e: Engine) => {
  const t = await e.getModuleBySymbol(SettingsSymbol),
    n = await e.getModuleBySymbol(ModelMeshSymbol),
    d = t.addPanel(a.s.TITLE, a.s.HOTKEYS, { width: 350 })
  await t.loadPromise.then(() => {
    const a = "meshtextures"
    ;[
      {
        panel: d,
        header: a,
        setting: "disableTextureStreamBelowLod",
        initialValue: () => -1,
        onChange: e => {
          e > -1 && n.textureQualityMap.limitStreamingBelow(e)
        },
        urlParam: !0,
        rangePrecision: 0,
        range: [-1, 7]
      },
      {
        panel: d,
        header: a,
        setting: "textureStreamPause",
        initialValue: () => FlipYConfig.debugPauseTexStream,
        onChange: e => {
          FlipYConfig.debugPauseTexStream = e
        },
        urlParam: !0
      },
      {
        panel: d,
        header: a,
        setting: "textureStreamRaycastHits",
        initialValue: () => FlipYConfig.debugLOD,
        onChange: e => {
          ;(FlipYConfig.debugLOD = e), e || (0, s.dw)()
        },
        urlParam: !0
      },
      {
        panel: d,
        header: a,
        setting: "debugRTTQuality",
        initialValue: () => FlipYConfig.debugRttQuality,
        onChange: t => {
          ;(FlipYConfig.debugRttQuality = t),
            t || e.commandBinder.issueCommand(new SetMeshOverLayColorCommand({ color: null }, { style: SetMeshOverLayColorCommand.selectBy.all }))
        },
        urlParam: !0
      },
      {
        panel: d,
        header: a,
        setting: "debugRTTScores",
        initialValue: () => FlipYConfig.debugRttScores,
        onChange: t => {
          ;(FlipYConfig.debugRttScores = t),
            t || e.commandBinder.issueCommand(new SetMeshOverLayColorCommand({ color: null }, { style: SetMeshOverLayColorCommand.selectBy.all }))
        },
        urlParam: !0
      }
    ].forEach(e => t.registerMenuEntry(e))
  })
}
