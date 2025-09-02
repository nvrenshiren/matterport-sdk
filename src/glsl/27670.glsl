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
attribute vec4 instanceMaskRect;
attribute float instanceStrokeWidth;
varying vec2 vUv;
varying vec4 vMaskRect;
varying float vStrokeWidth;

#ifdef INSTANCED
attribute mat4 instanceMatrix;
attribute float instanceAlpha;
attribute vec3 instanceColor;
varying float alpha;
varying vec3 color;
#endif
void main()
{
  vUv = uv;
  vMaskRect = instanceMaskRect;
  vStrokeWidth = instanceStrokeWidth;
#ifdef INSTANCED
  alpha = instanceAlpha;
  color = instanceColor;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.);
#else
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
#endif
}
