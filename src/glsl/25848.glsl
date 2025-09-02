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

#ifdef INSTANCED
attribute mat4 instanceMatrix;
attribute float instanceAlpha;
varying float alpha;
#endif
varying vec2 vUv;
void main()
{
  vUv = uv;
#ifdef INSTANCED
  mat4 mvp = projectionMatrix * modelViewMatrix * instanceMatrix;
  alpha = instanceAlpha;
#else
  mat4 mvp = projectionMatrix * modelViewMatrix;
#endif
  gl_Position = mvp * vec4(position, 1.);
}
