precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D mask;
#ifdef USE_DASH
uniform float dashSize;
uniform float gapSize;
#endif
varying float vLineDistance;
#include <common>
varying vec2 vUv;
void main()
{
  #ifdef USE_DASH
  if (vUv.y < -1. || vUv.y > 1.)
    discard;
  if (mod(vLineDistance, dashSize + gapSize) > dashSize)
    discard;
  #endif
  #ifdef USE_MASK
  vec2 modUv = vec2(vUv);
  modUv *= 2.;
  vec4 texelColor = texture2D(mask, modUv);
  gl_FragColor = vec4(texelColor.rgb, min(texelColor.a, opacity));
  #else
  gl_FragColor = vec4(diffuse, opacity);
  #endif
}
