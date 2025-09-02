import { AnimationClipCreator } from "three/examples/jsm/animation/AnimationClipCreator"
import { CCDIKHelper, CCDIKSolver } from "three/examples/jsm/animation/CCDIKSolver"
import { MMDAnimationHelper } from "three/examples/jsm/animation/MMDAnimationHelper"
import { MMDPhysics } from "three/examples/jsm/animation/MMDPhysics"
import { CinematicCamera } from "three/examples/jsm/cameras/CinematicCamera"
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls"
import { DragControls } from "three/examples/jsm/controls/DragControls"
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls"
import { FlyControls } from "three/examples/jsm/controls/FlyControls"

import { MapControls } from "three/examples/jsm/controls/MapControls"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
import { TransformControls, TransformControlsGizmo, TransformControlsPlane } from "three/examples/jsm/controls/TransformControls"
import { CSM } from "three/examples/jsm/csm/CSM"
//@ts-ignore
import { CSMFrustum } from "three/examples/jsm/csm/CSMFrustum"
import { CSMHelper } from "three/examples/jsm/csm/CSMHelper"
import { CSMShader } from "three/examples/jsm/csm/CSMShader"
import {
  CinquefoilKnot,
  DecoratedTorusKnot4a,
  DecoratedTorusKnot4b,
  DecoratedTorusKnot5a,
  DecoratedTorusKnot5c,
  FigureEightPolynomialKnot,
  GrannyKnot,
  HeartCurve,
  HelixCurve,
  KnotCurve,
  TorusKnot,
  TrefoilKnot,
  TrefoilPolynomialKnot,
  VivianiCurve
} from "three/examples/jsm/curves/CurveExtras"

import { NURBSCurve } from "three/examples/jsm/curves/NURBSCurve"

import { NURBSSurface } from "three/examples/jsm/curves/NURBSSurface"
import {
  calcBSplineDerivatives,
  calcBSplinePoint,
  calcBasisFunctionDerivatives,
  calcBasisFunctions,
  calcKoverI,
  calcNURBSDerivatives,
  calcRationalCurveDerivatives,
  calcSurfacePoint,
  findSpan
} from "three/examples/jsm/curves/NURBSUtils"

import { AnaglyphEffect } from "three/examples/jsm/effects/AnaglyphEffect"
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect"
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect"

import { ParallaxBarrierEffect } from "three/examples/jsm/effects/ParallaxBarrierEffect"
import { PeppersGhostEffect } from "three/examples/jsm/effects/PeppersGhostEffect"
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect"
import { DebugEnvironment } from "three/examples/jsm/environments/DebugEnvironment"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment"
import { ColladaExporter } from "three/examples/jsm/exporters/ColladaExporter"
import { DRACOExporter } from "three/examples/jsm/exporters/DRACOExporter"
import { EXRExporter, NO_COMPRESSION, ZIPS_COMPRESSION, ZIP_COMPRESSION } from "three/examples/jsm/exporters/EXRExporter"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import { KTX2Exporter } from "three/examples/jsm/exporters/KTX2Exporter"
import { MMDExporter } from "three/examples/jsm/exporters/MMDExporter"
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter"
import { PLYExporter } from "three/examples/jsm/exporters/PLYExporter"
import { STLExporter } from "three/examples/jsm/exporters/STLExporter"
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter"
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry"
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry"
import { DecalGeometry, DecalVertex } from "three/examples/jsm/geometries/DecalGeometry"
import { LightningStrike } from "three/examples/jsm/geometries/LightningStrike"
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries"
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry"
import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { LightProbeHelper } from "three/examples/jsm/helpers/LightProbeHelper"
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper"
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper"
import { VertexTangentsHelper } from "three/examples/jsm/helpers/VertexTangentsHelper"
import { ViewHelper } from "three/examples/jsm/helpers/ViewHelper"
import { HTMLMesh } from "three/examples/jsm/interactive/HTMLMesh"
import { InteractiveGroup } from "three/examples/jsm/interactive/InteractiveGroup"
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox"
import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper"
import IESSpotLight from "three/examples/jsm/lights/IESSpotLight"
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator"
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib"
import { Line2 } from "three/examples/jsm/lines/Line2"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2"
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry"
import { Wireframe } from "three/examples/jsm/lines/Wireframe"
import { WireframeGeometry2 } from "three/examples/jsm/lines/WireframeGeometry2"
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader"
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader"
import { AMFLoader } from "three/examples/jsm/loaders/AMFLoader"
import { BVHLoader } from "three/examples/jsm/loaders/BVHLoader"
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader"
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { GCodeLoader } from "three/examples/jsm/loaders/GCodeLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader"
import { IESLoader } from "three/examples/jsm/loaders/IESLoader"
import { KMZLoader } from "three/examples/jsm/loaders/KMZLoader"
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader"
import { KTXLoader } from "three/examples/jsm/loaders/KTXLoader"
import { LDrawLoader } from "three/examples/jsm/loaders/LDrawLoader"
import { LogLuvLoader } from "three/examples/jsm/loaders/LogLuvLoader"
import { LottieLoader } from "three/examples/jsm/loaders/LottieLoader"
import { LUT3dlLoader } from "three/examples/jsm/loaders/LUT3dlLoader"
import { LUTCubeLoader } from "three/examples/jsm/loaders/LUTCubeLoader"
import { IFFParser } from "three/examples/jsm/loaders/lwo/IFFParser"
import { LWO2Parser } from "three/examples/jsm/loaders/lwo/LWO2Parser"
import { LWO3Parser } from "three/examples/jsm/loaders/lwo/LWO3Parser"
import { LWOLoader } from "three/examples/jsm/loaders/LWOLoader"
import { MaterialXLoader } from "three/examples/jsm/loaders/MaterialXLoader"
import { MD2Loader } from "three/examples/jsm/loaders/MD2Loader"
import { MDDLoader } from "three/examples/jsm/loaders/MDDLoader"
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader"
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader"
import { PRWMLoader } from "three/examples/jsm/loaders/PRWMLoader"
import { PVRLoader } from "three/examples/jsm/loaders/PVRLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { RGBMLoader } from "three/examples/jsm/loaders/RGBMLoader"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader"
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader"
import { TGALoader } from "three/examples/jsm/loaders/TGALoader"
import { TIFFLoader } from "three/examples/jsm/loaders/TIFFLoader"
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader"
import { USDZLoader } from "three/examples/jsm/loaders/USDZLoader"
import { VRMLLoader } from "three/examples/jsm/loaders/VRMLLoader"
import { VTKLoader } from "three/examples/jsm/loaders/VTKLoader"
import { XYZLoader } from "three/examples/jsm/loaders/XYZLoader"
import { MeshGouraudMaterial } from "three/examples/jsm/materials/MeshGouraudMaterial"
import { Capsule } from "three/examples/jsm/math/Capsule"
import { ColorConverter } from "three/examples/jsm/math/ColorConverter"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise"
import { ColorMapKeywords, Lut } from "three/examples/jsm/math/Lut"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler"
import { OBB } from "three/examples/jsm/math/OBB"
import { Octree } from "three/examples/jsm/math/Octree"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"
import { ConvexObjectBreaker } from "three/examples/jsm/misc/ConvexObjectBreaker"
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer"
import { Gyroscope } from "three/examples/jsm/misc/Gyroscope"
import { MD2Character } from "three/examples/jsm/misc/MD2Character"
import { MD2CharacterComplex } from "three/examples/jsm/misc/MD2CharacterComplex"
import { MorphAnimMesh } from "three/examples/jsm/misc/MorphAnimMesh"
import { MorphBlendMesh } from "three/examples/jsm/misc/MorphBlendMesh"
import { ProgressiveLightMap } from "three/examples/jsm/misc/ProgressiveLightMap"
import { TubePainter } from "three/examples/jsm/misc/TubePainter"
import { Volume } from "three/examples/jsm/misc/Volume"
import { VolumeSlice } from "three/examples/jsm/misc/VolumeSlice"
import { EdgeSplitModifier } from "three/examples/jsm/modifiers/EdgeSplitModifier"
import { SimplifyModifier } from "three/examples/jsm/modifiers/SimplifyModifier"
import { TessellateModifier } from "three/examples/jsm/modifiers/TessellateModifier"
import { GroundProjectedSkybox } from "three/examples/jsm/objects/GroundProjectedSkybox"
import { LightningStorm } from "three/examples/jsm/objects/LightningStorm"
import { Reflector } from "three/examples/jsm/objects/Reflector"
import { ReflectorForSSRPass } from "three/examples/jsm/objects/ReflectorForSSRPass"
import { Refractor } from "three/examples/jsm/objects/Refractor"
import { ShadowMesh } from "three/examples/jsm/objects/ShadowMesh"
import { Sky } from "three/examples/jsm/objects/Sky"
import { Water } from "three/examples/jsm/objects/Water"
import { AmmoPhysics } from "three/examples/jsm/physics/AmmoPhysics"
import { OimoPhysics } from "three/examples/jsm/physics/OimoPhysics"
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass"
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass"
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"
import { ClearPass } from "three/examples/jsm/postprocessing/ClearPass"
import { CubeTexturePass } from "three/examples/jsm/postprocessing/CubeTexturePass"
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass"
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass"
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass"
import { LUTPass } from "three/examples/jsm/postprocessing/LUTPass"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { RenderPixelatedPass } from "three/examples/jsm/postprocessing/RenderPixelatedPass"
import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass"
import { SavePass } from "three/examples/jsm/postprocessing/SavePass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass"
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass"
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass"
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass"
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass"
import { TexturePass } from "three/examples/jsm/postprocessing/TexturePass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass"
import { MaskPass, ClearMaskPass } from "three/examples/jsm/postprocessing/MaskPass"
import { Water as Water2 } from "three/examples/jsm/objects/Water2"
import { MarchingCubes, edgeTable, triTable } from "three/examples/jsm/objects/MarchingCubes"
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare"
import { Flow, InstancedFlow, getUniforms, initSplineTexture, modifyShader, updateSplineTexture } from "three/examples/jsm/modifiers/CurveModifier"
import {
  RollerCoasterGeometry,
  RollerCoasterLiftersGeometry,
  RollerCoasterShadowGeometry,
  SkyGeometry,
  TreesGeometry
} from "three/examples/jsm/misc/RollerCoaster"
import { ConvexHull, Face, HalfEdge, VertexList, VertexNode } from "three/examples/jsm/math/ConvexHull"
import { VOXData3DTexture, VOXLoader, VOXMesh } from "three/examples/jsm/loaders/VOXLoader"
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"
import { CSS3DObject, CSS3DRenderer, CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer"
import { Projector, RenderableFace, RenderableLine, RenderableObject, RenderableSprite, RenderableVertex } from "three/examples/jsm/renderers/Projector"
import { SVGObject, SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer"
import { ACESFilmicToneMappingShader } from "three/examples/jsm/shaders/ACESFilmicToneMappingShader"
import { AfterimageShader } from "three/examples/jsm/shaders/AfterimageShader"
import { BasicShader } from "three/examples/jsm/shaders/BasicShader"
import { BleachBypassShader } from "three/examples/jsm/shaders/BleachBypassShader"
import { BlendShader } from "three/examples/jsm/shaders/BlendShader"
import { BokehShader } from "three/examples/jsm/shaders/BokehShader"
import { BrightnessContrastShader } from "three/examples/jsm/shaders/BrightnessContrastShader"
import { ColorCorrectionShader } from "three/examples/jsm/shaders/ColorCorrectionShader"
import { ColorifyShader } from "three/examples/jsm/shaders/ColorifyShader"
import { ConvolutionShader } from "three/examples/jsm/shaders/ConvolutionShader"
import { CopyShader } from "three/examples/jsm/shaders/CopyShader"
import { DepthLimitedBlurShader, BlurShaderUtils } from "three/examples/jsm/shaders/DepthLimitedBlurShader"
import { DigitalGlitch } from "three/examples/jsm/shaders/DigitalGlitch"
import { DOFMipMapShader } from "three/examples/jsm/shaders/DOFMipMapShader"
import { DotScreenShader } from "three/examples/jsm/shaders/DotScreenShader"
import { FilmShader } from "three/examples/jsm/shaders/FilmShader"
import { FocusShader } from "three/examples/jsm/shaders/FocusShader"
import { FreiChenShader } from "three/examples/jsm/shaders/FreiChenShader"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader"
import { HalftoneShader } from "three/examples/jsm/shaders/HalftoneShader"
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader"
import { HorizontalTiltShiftShader } from "three/examples/jsm/shaders/HorizontalTiltShiftShader"
import { HueSaturationShader } from "three/examples/jsm/shaders/HueSaturationShader"
import { KaleidoShader } from "three/examples/jsm/shaders/KaleidoShader"
import { LuminosityHighPassShader } from "three/examples/jsm/shaders/LuminosityHighPassShader"
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader"
import { MirrorShader } from "three/examples/jsm/shaders/MirrorShader"
import { MMDToonShader } from "three/examples/jsm/shaders/MMDToonShader"
import { NormalMapShader } from "three/examples/jsm/shaders/NormalMapShader"
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader"
import { SAOShader } from "three/examples/jsm/shaders/SAOShader"
import { SepiaShader } from "three/examples/jsm/shaders/SepiaShader"
import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader"
import { SubsurfaceScatteringShader } from "three/examples/jsm/shaders/SubsurfaceScatteringShader"
import { TechnicolorShader } from "three/examples/jsm/shaders/TechnicolorShader"
import { ToneMapShader } from "three/examples/jsm/shaders/ToneMapShader"
import { TriangleBlurShader } from "three/examples/jsm/shaders/TriangleBlurShader"
import { UnpackDepthRGBAShader } from "three/examples/jsm/shaders/UnpackDepthRGBAShader"
import { VelocityShader } from "three/examples/jsm/shaders/VelocityShader"
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader"
import { VerticalTiltShiftShader } from "three/examples/jsm/shaders/VerticalTiltShiftShader"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader"
import { VolumeRenderShader1 } from "three/examples/jsm/shaders/VolumeShader"
import { WaterRefractionShader } from "three/examples/jsm/shaders/WaterRefractionShader"
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture"
import { frameCorners } from "three/examples/jsm/utils/CameraUtils"
import { compressNormals, compressPositions, compressUvs } from "three/examples/jsm/utils/GeometryCompressionUtils"
import { gosper, hilbert2D, hilbert3D } from "three/examples/jsm/utils/GeometryUtils"
import { GPUStatsPanel } from "three/examples/jsm/utils/GPUStatsPanel"
import { LDrawUtils } from "three/examples/jsm/utils/LDrawUtils"
import { PackedPhongMaterial } from "three/examples/jsm/utils/PackedPhongMaterial"
import { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer"
import { UVsDebug } from "three/examples/jsm/utils/UVsDebug"
import { WorkerPool } from "three/examples/jsm/utils/WorkerPool"
import { ARButton } from "three/examples/jsm/webxr/ARButton"
import { OculusHandModel } from "three/examples/jsm/webxr/OculusHandModel"
import { OculusHandPointerModel } from "three/examples/jsm/webxr/OculusHandPointerModel"
import { createText } from "three/examples/jsm/webxr/Text2D"
import { VRButton } from "three/examples/jsm/webxr/VRButton"
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory"
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight"
import { XRHandMeshModel } from "three/examples/jsm/webxr/XRHandMeshModel"
import { XRHandPrimitiveModel } from "three/examples/jsm/webxr/XRHandPrimitiveModel"
import { XRHandModelFactory } from "three/examples/jsm/webxr/XRHandModelFactory"
import {
  clone,
  findBoneTrackData,
  getBoneByName,
  getBones,
  getEqualsBonesNames,
  getHelperFromSkeleton,
  getNearestBone,
  getSkeletonOffsets,
  renameBones,
  retarget,
  retargetClip
} from "three/examples/jsm/utils/SkeletonUtils"
import {
  createMeshesFromInstancedMesh,
  createMeshesFromMultiMaterialMesh,
  createMultiMaterialObject,
  reduceVertices,
  sortInstancedMesh
} from "three/examples/jsm/utils/SceneUtils"
import {
  computeMikkTSpaceTangents,
  computeMorphedAttributes,
  deepCloneAttribute,
  deinterleaveAttribute,
  deinterleaveGeometry,
  estimateBytesUsed,
  interleaveAttributes,
  mergeAttributes,
  mergeBufferAttributes,
  mergeBufferGeometries,
  mergeGeometries,
  mergeGroups,
  mergeVertices,
  toCreasedNormals,
  toTrianglesDrawMode
} from "three/examples/jsm/utils/BufferGeometryUtils"
import { ToonShader1, ToonShader2, ToonShaderDotted, ToonShaderHatching } from "three/examples/jsm/shaders/ToonShader"
import { SSAOBlurShader, SSAODepthShader, SSAOShader } from "three/examples/jsm/shaders/SSAOShader"
import { SSRBlurShader, SSRDepthShader, SSRShader } from "three/examples/jsm/shaders/SSRShader"
import { SMAABlendShader, SMAAEdgesShader, SMAAWeightsShader } from "three/examples/jsm/shaders/SMAAShader"
import { GodRaysCombineShader, GodRaysDepthMaskShader, GodRaysFakeSunShader, GodRaysGenerateShader } from "three/examples/jsm/shaders/GodRaysShader"
import { BokehDepthShader, BokehShader as BokehShader2 } from "three/examples/jsm/shaders/BokehShader2"
export const modules = [
  { AnimationClipCreator },
  { CCDIKHelper, CCDIKSolver },
  { MMDAnimationHelper },
  { MMDPhysics },
  { CinematicCamera },
  { ArcballControls },
  { DragControls },
  { FirstPersonControls },
  { FlyControls },
  { MapControls },
  { OrbitControls },
  { PointerLockControls },
  { TrackballControls },
  { TransformControls, TransformControlsGizmo, TransformControlsPlane },
  { CSM },
  { CSMFrustum },
  { CSMHelper },
  //@ts-ignore
  { CSMShader },
  {
    CinquefoilKnot,
    DecoratedTorusKnot4a,
    DecoratedTorusKnot4b,
    DecoratedTorusKnot5a,
    DecoratedTorusKnot5c,
    FigureEightPolynomialKnot,
    GrannyKnot,
    HeartCurve,
    HelixCurve,
    KnotCurve,
    TorusKnot,
    TrefoilKnot,
    TrefoilPolynomialKnot,
    VivianiCurve
  },
  { NURBSCurve },
  { NURBSSurface },
  {
    calcBSplineDerivatives,
    calcBSplinePoint,
    calcBasisFunctionDerivatives,
    calcBasisFunctions,
    calcKoverI,
    calcNURBSDerivatives,
    calcRationalCurveDerivatives,
    calcSurfacePoint,
    findSpan
  },
  { AnaglyphEffect },
  { AsciiEffect },
  { OutlineEffect },
  { ParallaxBarrierEffect },
  { PeppersGhostEffect },
  { StereoEffect },
  { DebugEnvironment },
  { RoomEnvironment },
  { ColladaExporter },
  { DRACOExporter },
  { EXRExporter, NO_COMPRESSION, ZIPS_COMPRESSION, ZIP_COMPRESSION },
  { GLTFExporter },
  { KTX2Exporter },
  { MMDExporter },
  { OBJExporter },
  { PLYExporter },
  { STLExporter },
  { USDZExporter },
  { BoxLineGeometry },
  { ConvexGeometry },
  { DecalGeometry, DecalVertex },
  { LightningStrike },
  { ParametricGeometries },
  { ParametricGeometry },
  { RoundedBoxGeometry },
  { TeapotGeometry },
  { TextGeometry },
  { LightProbeHelper },
  { OctreeHelper },
  { PositionalAudioHelper },
  { RectAreaLightHelper },
  { VertexNormalsHelper },
  { VertexTangentsHelper },
  { ViewHelper },
  { HTMLMesh },
  { InteractiveGroup },
  { SelectionBox },
  { SelectionHelper },
  { IESSpotLight },
  { LightProbeGenerator },
  { RectAreaLightUniformsLib },
  { Line2 },
  { LineGeometry },
  { LineMaterial },
  { LineSegments2 },
  { LineSegmentsGeometry },
  { Wireframe },
  { WireframeGeometry2 },

  { Rhino3dmLoader },
  { ThreeMFLoader },
  { AMFLoader },
  { BVHLoader },
  { ColladaLoader },
  { DDSLoader },
  { DRACOLoader },
  { EXRLoader },
  { FBXLoader },
  { FontLoader },
  { GCodeLoader },
  { GLTFLoader },
  { HDRCubeTextureLoader },
  { IESLoader },
  { KMZLoader },
  { KTX2Loader },
  { KTXLoader },
  { LDrawLoader },
  { LogLuvLoader },
  { LottieLoader },
  { LUT3dlLoader },
  { LUTCubeLoader },
  { IFFParser },
  { LWO2Parser },
  { LWO3Parser },
  { LWOLoader },
  { MaterialXLoader },
  { MD2Loader },
  { MDDLoader },
  { MMDLoader },
  { MTLLoader },
  { NRRDLoader },
  { OBJLoader },
  { PCDLoader },
  { PDBLoader },
  { PLYLoader },
  { PRWMLoader },
  { PVRLoader },
  { RGBELoader },
  { RGBMLoader },
  { STLLoader },
  { SVGLoader },
  { TDSLoader },
  { TGALoader },
  { TIFFLoader },
  { TTFLoader },
  { USDZLoader },
  { VOXData3DTexture, VOXLoader, VOXMesh },
  { VRMLLoader },
  { VTKLoader },
  { XYZLoader },
  { MeshGouraudMaterial },
  { Capsule },
  { ColorConverter },
  { ConvexHull, Face, HalfEdge, VertexList, VertexNode },
  { ImprovedNoise },
  //@ts-ignore
  { ColorMapKeywords, Lut },

  { MeshSurfaceSampler },
  { OBB },
  { Octree },
  { SimplexNoise },
  { ConvexObjectBreaker },
  { GPUComputationRenderer },
  { Gyroscope },
  { MD2Character },
  { MD2CharacterComplex },
  { MorphAnimMesh },
  { MorphBlendMesh },
  { ProgressiveLightMap },
  { RollerCoasterGeometry, RollerCoasterLiftersGeometry, RollerCoasterShadowGeometry, SkyGeometry, TreesGeometry },
  { TubePainter },
  { Volume },
  { VolumeSlice },
  { Flow, InstancedFlow, getUniforms, initSplineTexture, modifyShader, updateSplineTexture },
  { EdgeSplitModifier },
  { SimplifyModifier },
  { TessellateModifier },
  { GroundProjectedSkybox },
  { Lensflare, LensflareElement },
  { LightningStorm },
  { MarchingCubes, edgeTable, triTable },
  { Reflector },
  { ReflectorForSSRPass },
  { Refractor },
  { ShadowMesh },
  { Sky },
  { Water },
  { Water: Water2 },
  { AmmoPhysics },
  { OimoPhysics },
  { AdaptiveToneMappingPass },
  { AfterimagePass },
  { BloomPass },
  { BokehPass },
  { ClearPass },
  { CubeTexturePass },
  { DotScreenPass },
  { EffectComposer },
  { FilmPass },
  { GlitchPass },
  { HalftonePass },
  { LUTPass },
  { ClearMaskPass, MaskPass },
  { OutlinePass },
  { FullScreenQuad, Pass },
  { RenderPass },
  { RenderPixelatedPass },
  { SAOPass },
  { SavePass },
  { ShaderPass },
  { SMAAPass },
  { SSAARenderPass },
  { SSAOPass },
  { SSRPass },
  { TAARenderPass },
  { TexturePass },
  { UnrealBloomPass },
  { CSS2DObject, CSS2DRenderer },
  { CSS3DObject, CSS3DRenderer, CSS3DSprite },
  { Projector, RenderableFace, RenderableLine, RenderableObject, RenderableSprite, RenderableVertex },
  { SVGObject, SVGRenderer },
  { ACESFilmicToneMappingShader },
  { AfterimageShader },
  { BasicShader },
  { BleachBypassShader },
  { BlendShader },
  { BokehShader },
  { BokehDepthShader, BokehShader: BokehShader2 },
  { BrightnessContrastShader },
  { ColorCorrectionShader },
  { ColorifyShader },
  { ConvolutionShader },
  { CopyShader },
  { BlurShaderUtils, DepthLimitedBlurShader },
  { DigitalGlitch },
  { DOFMipMapShader },
  { DotScreenShader },
  { FilmShader },
  { FocusShader },
  { FreiChenShader },
  { FXAAShader },
  { GammaCorrectionShader },
  { GodRaysCombineShader, GodRaysDepthMaskShader, GodRaysFakeSunShader, GodRaysGenerateShader },
  { HalftoneShader },
  { HorizontalBlurShader },
  { HorizontalTiltShiftShader },
  { HueSaturationShader },
  { KaleidoShader },
  { LuminosityHighPassShader },
  { LuminosityShader },
  { MirrorShader },
  { MMDToonShader },
  { NormalMapShader },
  { RGBShiftShader },
  { SAOShader },
  { SepiaShader },
  { SMAABlendShader, SMAAEdgesShader, SMAAWeightsShader },
  { SobelOperatorShader },
  { SSAOBlurShader, SSAODepthShader, SSAOShader },
  { SSRBlurShader, SSRDepthShader, SSRShader },
  { SubsurfaceScatteringShader },
  { TechnicolorShader },
  { ToneMapShader },
  { ToonShader1, ToonShader2, ToonShaderDotted, ToonShaderHatching },
  { TriangleBlurShader },
  { UnpackDepthRGBAShader },
  { VelocityShader },
  { VerticalBlurShader },
  { VerticalTiltShiftShader },
  { VignetteShader },
  { VolumeRenderShader1 },
  { WaterRefractionShader },
  { FlakesTexture },
  {
    computeMikkTSpaceTangents,
    computeMorphedAttributes,
    deepCloneAttribute,
    deinterleaveAttribute,
    deinterleaveGeometry,
    estimateBytesUsed,
    interleaveAttributes,
    mergeAttributes,
    mergeBufferAttributes,
    mergeBufferGeometries,
    mergeGeometries,
    mergeGroups,
    mergeVertices,
    toCreasedNormals,
    toTrianglesDrawMode
  },
  { frameCorners },
  { compressNormals, compressPositions, compressUvs },
  { gosper, hilbert2D, hilbert3D },
  { GPUStatsPanel },
  { LDrawUtils },
  { PackedPhongMaterial },
  { createMeshesFromInstancedMesh, createMeshesFromMultiMaterialMesh, createMultiMaterialObject, reduceVertices, sortInstancedMesh },
  { ShadowMapViewer },
  {
    clone,
    findBoneTrackData,
    getBoneByName,
    getBones,
    getEqualsBonesNames,
    getHelperFromSkeleton,
    getNearestBone,
    getSkeletonOffsets,
    renameBones,
    retarget,
    retargetClip
  },
  { UVsDebug },
  { WorkerPool },
  { ARButton },
  { OculusHandModel },
  { OculusHandPointerModel },
  { createText },
  { VRButton },
  { XRControllerModelFactory },
  { XREstimatedLight },
  { XRHandMeshModel },
  { XRHandModelFactory },
  { XRHandPrimitiveModel }
]
