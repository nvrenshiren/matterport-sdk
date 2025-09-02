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
attribute mat4 instanceMatrix;
varying vec4 vCenter;
varying vec4 vPosition;
void main()
{
  vPosition = instanceMatrix * vec4(position, 1.);
  vCenter = instanceMatrix * vec4(0., 0., 0., 1.);
  gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}
