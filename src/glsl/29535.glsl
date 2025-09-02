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
varying vec3 vCenterWorldPos;
varying vec3 vFragWorldPos;
void main()
{
  vCenterWorldPos = (modelMatrix * vec4(0., 0., 0., 1.)).xyz;
  vFragWorldPos = (modelMatrix * vec4(position, 1.)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
