precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform samplerCube map;
uniform float opacity;
varying vec3 vWorldPosition;
void main()
{
  vec4 color = textureCube(map, vec3(-vWorldPosition.x, vWorldPosition.yz));
  gl_FragColor = vec4(color.rgb, opacity);
}
