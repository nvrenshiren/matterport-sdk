precision highp float;
precision highp int;
uniform samplerCube tMap;
varying vec3 vUvw;
void main()
{
  vec4 color = textureCube(tMap, vec3(-vUvw.x, vUvw.yz));
  gl_FragColor = vec4(color.rgb, 1.);
}
