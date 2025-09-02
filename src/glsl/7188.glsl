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

#include <common>
uniform float linewidth;
uniform vec2 resolution;
attribute vec3 instanceStart;
attribute vec3 instanceEnd;
attribute vec3 instanceColorStart;
attribute vec3 instanceColorEnd;
varying vec2 vUv;
#ifdef USE_DASH
uniform float dashScale;
attribute float instanceDistanceStart;
attribute float instanceDistanceEnd;
varying float vLineDistance;
#endif
void trimSegment(const in vec4 start, inout vec4 end)
{
  float a = projectionMatrix[2][2];
  float b = projectionMatrix[3][2];
  float nearEstimate = -0.5 * b / a;
  float alpha = (nearEstimate - start.z) / (end.z - start.z);
  end.xyz = mix(start.xyz, end.xyz, alpha);
}
void main()
{
  #ifdef USE_COLOR
  vColor.xyz = (position.y < 0.5) ? instanceColorStart : instanceColorEnd;
#endif
#ifdef USE_DASH
  vLineDistance = (position.y < 0.5) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
#endif
  float aspect = resolution.x / resolution.y;
  vUv = uv;
  vec4 start = modelViewMatrix * vec4(instanceStart, 1.);
  vec4 end = modelViewMatrix * vec4(instanceEnd, 1.);
  bool perspective = (projectionMatrix[2][3] == -1.);
  if (perspective)
  {
    if (start.z < 0. && end.z >= 0.)
    {
      trimSegment(start, end);
    }
    else if (end.z < 0. && start.z >= 0.)
    {
      trimSegment(end, start);
    }
  }
  vec4 clipStart = projectionMatrix * start;
  vec4 clipEnd = projectionMatrix * end;
  vec2 ndcStart = clipStart.xy / clipStart.w;
  vec2 ndcEnd = clipEnd.xy / clipEnd.w;
  vec2 dir = ndcEnd - ndcStart;
  dir.x *= aspect;
  dir = normalize(dir);
  vec2 offset = vec2(dir.y, -dir.x);
  dir.x /= aspect;
  offset.x /= aspect;
  if (position.x < 0.)
    offset *= -1.;
  offset *= linewidth;
  offset /= resolution.y;
  vec4 clip = (position.y < 0.5) ? clipStart : clipEnd;
#ifdef USE_MASK
  offset *= (clipEnd.w + clipStart.w) * 0.5;
#else
  offset *= clip.w;
#endif
  clip.xy += offset;
  gl_Position = clip;
#include <worldpos_vertex>
}
