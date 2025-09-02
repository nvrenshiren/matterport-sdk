precision highp float;
precision highp int;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
varying vec3 vUvw;
void main()
{
  vUvw = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
