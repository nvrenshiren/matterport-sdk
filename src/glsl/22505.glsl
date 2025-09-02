precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
varying vec2 vUv;
uniform sampler2D tDiffuse;
#ifdef INSTANCED
varying float alpha;
#else
uniform float alpha;
#endif
void main()
{
  vec4 texColor = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
}
