precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#define MAX_TRIMS_PER_FLOOR  10
#ifdef PANO_TEXTURE
uniform vec3 pano0Position;
uniform samplerCube pano0Map;
varying vec3 pano0SweepDirection;
uniform float panoOpacity;
#endif
#ifdef PANO_TEXTURE_TRANSITION
uniform float progress;
uniform vec3 pano1Position;
uniform samplerCube pano1Map;
varying vec3 pano1SweepDirection;
#endif
#ifdef PANO_OVERLAY
uniform samplerCube overlay0Map;
varying vec3 overlay0WorldPos;
#endif
#ifdef PANO_OVERLAY_TRANSITION
uniform samplerCube overlay1Map;
varying vec3 overlay1WorldPos;
#endif
#ifdef MESH_PREVIEW_SPHERE
uniform vec3 meshPreviewCenter;
uniform float meshPreviewSize;
#endif
#ifdef MESH_TEXTURE
varying vec2 vUv;
uniform sampler2D map;
uniform float meshOpacity;
uniform float opacity;
varying vec3 worldPos;
#ifdef MESH_TRIM_VERTEX
varying vec3 trimPos[MAX_TRIMS_PER_FLOOR];
uniform bool meshTrimsDiscardContents[MAX_TRIMS_PER_FLOOR];
uniform bool hasKeepVolume;
#endif
#ifdef MESH_TRIM_PIXEL
uniform mat4 meshTrimMatrices[MAX_TRIMS_PER_FLOOR];
uniform bool meshTrimsDiscardContents[MAX_TRIMS_PER_FLOOR];
uniform bool hasKeepVolume;
#endif
#ifdef FLOOR_TRIM_VERTEX
varying float floorHeightPercent;
#endif
#ifdef FLOOR_TRIM_PIXEL
uniform float floorTrimHeight;
#endif
#endif
#ifdef COLOR_OVERLAY
uniform vec4 colorOverlay;
#endif
#ifdef WIREFRAME
varying vec3 vBarycentric;
uniform float time;
uniform float thickness;
uniform float secondThickness;
uniform float dashRepeats;
uniform float dashLength;
uniform bool dashOverlap;
uniform bool dashEnabled;
uniform bool dashAnimate;
uniform bool fillEnabled;
uniform bool insideAltColor;
uniform bool dualStroke;
uniform bool squeeze;
uniform float squeezeMin;
uniform float squeezeMax;
uniform float wireframeOpacity;
uniform vec3 stroke;
uniform vec3 fill;
float aastep(float threshold, float dist)
{
  float afwidth = fwidth(dist) * 0.5;
  return smoothstep(threshold - afwidth, threshold + afwidth, dist);
}
float computeScreenSpaceWireframe(vec3 barycentric, float lineWidth)
{
  vec3 dist = fwidth(barycentric);
  vec3 smoothed = smoothstep(dist * ((lineWidth * 0.5) - 0.5), dist * ((lineWidth * 0.5) + 0.5), barycentric);
  return 1. - min(min(smoothed.x, smoothed.y), smoothed.z);
}
vec4 getStyledWireframe(vec3 barycentric)
{
  float PI = 3.14159265359;
  float d = min(min(barycentric.x, barycentric.y), barycentric.z);
  float positionAlong = max(barycentric.x, barycentric.y);
  if (barycentric.y < barycentric.x && barycentric.y < barycentric.z)
  {
    positionAlong = 1. - positionAlong;
  }
  float computedThickness = thickness;
  if (squeeze)
  {
    computedThickness *= mix(squeezeMin, squeezeMax, (1. - sin(positionAlong * PI)));
  }
  if (dashEnabled)
  {
    float offset = 1. / dashRepeats * dashLength / 2.;
    if (!dashOverlap)
    {
      offset += 1. / dashRepeats / 2.;
    }
    if (dashAnimate)
    {
      offset += time * 0.22;
    }
    float pattern = fract((positionAlong + offset) * dashRepeats);
    computedThickness *= 1. - aastep(dashLength, pattern);
  }
  float edge = computeScreenSpaceWireframe(barycentric, computedThickness);
  vec4 outColor = vec4(0., 0., 0., 0.);
  if (!fillEnabled)
  {
    outColor = vec4(stroke, edge);
    if (insideAltColor && !gl_FrontFacing)
    {
      outColor.rgb = fill;
    }
  }
  else
  {
    outColor.a = 1.;
    if (dualStroke)
    {
      float inner = 1. - aastep(secondThickness, d);
      vec3 wireColor = mix(fill, stroke, abs(inner - edge));
      outColor.rgb = wireColor;
    }
    else
    {
      outColor.rgb = mix(fill, stroke, edge);
    }
  }
  outColor.a *= wireframeOpacity;
  return outColor;
}
#endif
#ifdef FLAT_SHADING
varying vec3 vNormal;
#endif
void main()
{
  #ifdef PANO_TEXTURE_TRANSITION
  vec4 colorFromPano0 = textureCube(pano0Map, pano0SweepDirection.xyz);
  vec4 colorFromPano1 = textureCube(pano1Map, pano1SweepDirection.xyz);
#ifdef PANO_OVERLAY_TRANSITION
  vec4 colorFromOverlay0 = textureCube(overlay0Map, overlay0WorldPos.xyz);
  vec4 colorFromOverlay1 = textureCube(overlay1Map, overlay1WorldPos.xyz);
  colorFromPano0.rgb = mix(colorFromPano0.rgb, colorFromOverlay0.rgb, colorFromOverlay0.a);
  colorFromPano1.rgb = mix(colorFromPano1.rgb, colorFromOverlay1.rgb, colorFromOverlay1.a);
#endif
  vec4 color = mix(colorFromPano0, colorFromPano1, progress);
  color.a = panoOpacity;
#elif defined(PANO_TEXTURE)
  vec4 color = textureCube(pano0Map, pano0SweepDirection.xyz);
#ifdef PANO_OVERLAY
  vec4 colorFromOverlay0 = textureCube(overlay0Map, overlay0WorldPos.xyz);
  color.rgb = mix(color.rgb, colorFromOverlay0.rgb, colorFromOverlay0.a);
#endif
  color.a = panoOpacity;
#else
  vec4 color = vec4(0., 0., 0., 0.);
#endif
#ifdef MESH_TEXTURE
  vec4 colorFromTexture = texture2D(map, vUv);
#endif
#ifdef MESH_PREVIEW_SPHERE
  float previewDistance = distance(worldPos.xyz, meshPreviewCenter.xyz);
  float inSphere = step(previewDistance, meshPreviewSize);
  colorFromTexture += colorFromTexture * (0.2 * inSphere);
  color = mix(color, colorFromTexture, max(meshOpacity, inSphere));
#elif defined(MESH_TEXTURE)
  color = mix(color, colorFromTexture, meshOpacity);
#endif
#ifdef FLAT_SHADING
  float ao = 0.9 - abs(vNormal.y) * 0.1 - abs(vNormal.x) * 0.05 + abs(vNormal.z) * 0.05;
  color.rgb = vec3(ao, ao * 1.025, ao * 1.05);
#endif
#ifdef COLOR_OVERLAY
  color = mix(color, vec4(colorOverlay.rgb, 1.), colorOverlay.a);
#endif
#ifdef WIREFRAME
  vec4 colorFromWireframe = getStyledWireframe(vBarycentric);
  color = mix(color, vec4(colorFromWireframe.rgb, 1.), colorFromWireframe.a);
#endif
#ifdef MESH_TEXTURE
  color.a = opacity;
#if defined(FLOOR_TRIM_VERTEX) || defined(FLOOR_TRIM_PIXEL)
  if (floorHeightPercent > floorTrimHeight)
  {
    discard;
  }
#endif
#if defined(MESH_TRIM_VERTEX) || defined(MESH_TRIM_PIXEL)
  bool isWithinVolume = false;
  bool doKeepFragment = true;
  bool enabled = true;
  vec4 worldPos4 = vec4(worldPos.xyz, 1);
  vec3 compare = vec3(0.5);
#pragma unroll_loop_start
  for (int i = 0; i < 10; i++)
  {
  #ifdef MESH_TRIM_VERTEX
    enabled = !all(equal(trimPos[UNROLLED_LOOP_INDEX], vec3(0.)));
    if (enabled)
    {
      if (all(lessThan(abs(trimPos[UNROLLED_LOOP_INDEX]), compare)))
      {
        isWithinVolume = true;
        if (meshTrimsDiscardContents[UNROLLED_LOOP_INDEX])
        {
          doKeepFragment = false;
        }
      }
    }
#endif
#ifdef MESH_TRIM_PIXEL
    enabled = meshTrimMatrices[UNROLLED_LOOP_INDEX][3][3] > 0.;
    if (enabled)
    {
      if (all(lessThan(abs((meshTrimMatrices[UNROLLED_LOOP_INDEX] * worldPos4).xyz), compare)))
      {
        isWithinVolume = true;
        if (meshTrimsDiscardContents[UNROLLED_LOOP_INDEX])
        {
          doKeepFragment = false;
        }
      }
    }
#endif
  }
#pragma unroll_loop_end
  if (!isWithinVolume && hasKeepVolume)
  {
    discard;
  }
  else if (isWithinVolume && !doKeepFragment)
  {
    discard;
  }
#endif
#endif
  gl_FragColor = color;
}
