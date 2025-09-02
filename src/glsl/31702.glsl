precision highp float;
uniform float borderSize;
uniform float panoRadius;
uniform float opacity;
uniform sampler2D circleProjection;
uniform vec4 borderColor;
varying vec2 vUv;
void main()
{
  vec2 uv = (vUv * 2.) - vec2(1., 1.);
  float d = length(uv);
  float f = d / panoRadius;
  vec4 projectionColor = texture2D(circleProjection, vUv);
  float isBorder = max(sign(borderSize), 0.) * step(1. - borderSize, f) * step(f, 1.);
  gl_FragColor = mix(projectionColor, borderColor, isBorder);
  gl_FragColor.a *= opacity;
}
