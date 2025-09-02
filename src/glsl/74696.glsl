precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
varying vec3 vWorldPos;
uniform float alpha;
uniform samplerCube tDiffuse;
void main()
{
  vec4 texColor = textureCube(tDiffuse, vWorldPos);
  gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
}
