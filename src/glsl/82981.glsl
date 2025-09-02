precision highp float;
precision highp int;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#define MAX_TRIMS_PER_FLOOR  10
#ifdef PANO_TEXTURE
uniform vec3 pano0Position;
uniform mat4 pano0Matrix1;
uniform mat4 pano0Matrix2;
varying vec3 pano0SweepDirection;
#endif
#ifdef PANO_TEXTURE_TRANSITION
uniform vec3 pano1Position;
uniform mat4 pano1Matrix1;
uniform mat4 pano1Matrix2;
varying vec3 pano1SweepDirection;
#endif
#ifdef PANO_OVERLAY
varying vec3 overlay0WorldPos;
uniform mat4 overlay0Matrix;
#endif
#ifdef PANO_OVERLAY_TRANSITION
varying vec3 overlay1WorldPos;
uniform mat4 overlay1Matrix;
#endif
#ifdef MESH_PREVIEW_SPHERE
#endif
#ifdef MESH_TEXTURE
varying vec2 vUv;
varying vec3 worldPos;
#ifdef MESH_TRIM_VERTEX
uniform mat4 meshTrimMatrices[MAX_TRIMS_PER_FLOOR];
varying vec3 trimPos[MAX_TRIMS_PER_FLOOR];
#endif
#ifdef FLOOR_TRIM_VERTEX
uniform float floorHeightMin;
uniform float floorHeightMax;
varying float floorHeightPercent;
#endif
#endif
#ifdef WIREFRAME
attribute vec3 barycentric;
varying vec3 vBarycentric;
#endif
#ifdef FLAT_SHADING
varying vec3 vNormal;
#endif
void main()
{
  vec4 worldPosition = modelMatrix * vec4(position, 1.);
#ifdef MESH_TEXTURE
  vUv = uv;
  worldPos = worldPosition.xyz;
#ifdef MESH_TRIM_VERTEX
#pragma unroll_loop_start
  for (int i = 0; i < 10; i++)
  {
    trimPos[UNROLLED_LOOP_INDEX] = (meshTrimMatrices[UNROLLED_LOOP_INDEX] * vec4(worldPos, 1.)).xyz;
  }
#pragma unroll_loop_end
#endif
#ifdef FLOOR_TRIM_VERTEX
  floorHeightPercent = (worldPos.y - floorHeightMin) / (floorHeightMax - floorHeightMin);
#endif
#endif
#ifdef WIREFRAME
  vBarycentric = barycentric;
#endif
#ifdef FLAT_SHADING
  vNormal = normal;
#endif
#ifdef PANO_TEXTURE
  vec3 positionLocalToPanoCenter0 = worldPosition.xyz - pano0Position;
  pano0SweepDirection = (pano0Matrix2 * pano0Matrix1 * vec4(positionLocalToPanoCenter0, 1.)).xyz;
#ifdef PANO_OVERLAY
  overlay0WorldPos = (overlay0Matrix * vec4(positionLocalToPanoCenter0, 1.)).xyz;
#endif
#endif
#ifdef PANO_TEXTURE_TRANSITION
  vec3 positionLocalToPanoCenter1 = worldPosition.xyz - pano1Position;
  pano1SweepDirection = (pano1Matrix2 * pano1Matrix1 * vec4(positionLocalToPanoCenter1, 1.)).xyz;
#ifdef PANO_OVERLAY_TRANSITION
  overlay1WorldPos = (overlay1Matrix * vec4(positionLocalToPanoCenter1, 1.)).xyz;
#endif
#endif
  vec4 projectedPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  gl_Position = projectedPosition;
}
