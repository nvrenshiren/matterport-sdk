#define ANTIALIAS_WIDTH  1.0
precision highp float;
uniform vec3 outlineColor;
uniform vec3 baseColor;
uniform float radius;
uniform float opacity;
uniform float outlinePct;
varying vec3 vPosition;
void main()
{
  float fragRadius = length(vPosition.xz);
  float outlineRadius = radius * outlinePct;
  float smoothAmt = fwidth(fragRadius) * ANTIALIAS_WIDTH;
  float mixAmt = smoothstep(outlineRadius - smoothAmt, outlineRadius, fragRadius);
  gl_FragColor = vec4(mix(baseColor, outlineColor, mixAmt), 1.);
  gl_FragColor.a = opacity * (1. - smoothstep(radius - smoothAmt, radius, fragRadius));
}
