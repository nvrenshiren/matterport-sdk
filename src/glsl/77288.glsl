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
varying vec4 maskPosition;
varying vec4 panoPosition;
uniform mat4 maskMatrix;
uniform mat4 panoMatrix1;
uniform mat4 panoMatrix2;
void main()
{
  vec4 worldPosition = modelMatrix * vec4(position, 1.);
  maskPosition = maskMatrix * worldPosition;
  panoPosition = panoMatrix2 * panoMatrix1 * worldPosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
