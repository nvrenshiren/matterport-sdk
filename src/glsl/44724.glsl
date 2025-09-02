precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform float opacity;
uniform vec3 color;
uniform sampler2D bg;
varying vec2 vUv;
void main()
{
  vec4 bgColor = texture2D(bg, vUv);
  gl_FragColor = vec4(bgColor.rgb, bgColor.a * opacity);
}
