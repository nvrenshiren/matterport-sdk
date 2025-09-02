precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

#ifdef INSTANCED
varying float alpha;
#else
uniform float alpha;
#endif
void main()
{
  gl_FragColor = vec4(1., 1., 1., alpha);
}
