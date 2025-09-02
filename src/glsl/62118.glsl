precision highp float;
precision highp int;
varying vec2 vUv;
uniform sampler2D tMask;
uniform sampler2D tPinHole;
uniform vec3 pinColor;
uniform float opacity;
void main()
{
  vec4 maskColor = texture2D(tMask, vUv);
  vec4 pinHoleColor = vec4(texture2D(tPinHole, vec2(vUv.x, vUv.y - 0.11)).xyz, 1.);
  float redness = maskColor.r - maskColor.b;
  vec4 mixedPinColor = mix(vec4(pinColor, 1.), pinHoleColor, redness);
  mixedPinColor.a = min(mixedPinColor.a, maskColor.a) * opacity;
  gl_FragColor = mixedPinColor;
}
