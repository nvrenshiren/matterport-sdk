precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform sampler2D bg;
uniform sampler2D mask;
varying vec2 vUv;
void main()
{
  vec4 existingColor = texture2D(bg, vUv);
  vec4 maskColor = texture2D(mask, vUv);
  gl_FragColor = vec4(existingColor.rgb * maskColor.rgb, maskColor.a);
}
