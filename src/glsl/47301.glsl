precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform vec3 color;
uniform float opacity;
void main()
{
  gl_FragColor = vec4(color, opacity);
}
