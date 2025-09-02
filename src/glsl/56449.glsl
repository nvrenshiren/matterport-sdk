precision highp float;
uniform vec3 color;
uniform float antialiasWidth;
uniform float lineWidth;
uniform float dashed;
uniform float dashSize;
uniform float gapSize;
uniform float opacity;
varying float vDistanceFromAxis;
varying float vDistanceAlong;
void main()
{
  float halfWidth = lineWidth * 0.5;
  float antialiasing = 1. - smoothstep(halfWidth, halfWidth + antialiasWidth, vDistanceFromAxis);
  float dashOpacity = 1.;
  if (dashed > 0.)
  {
  #ifdef WORLDSPACE_DASH
    float dashAA = fwidth(vDistanceAlong) * antialiasWidth * 0.5;
  #else
    float dashAA = antialiasWidth * 0.5;
  #endif
    float dashT = mod(vDistanceAlong, dashSize + gapSize);
    dashOpacity = smoothstep(0., dashAA, dashT) * (1. - smoothstep(dashSize - dashAA, dashSize, dashT));
  }
  gl_FragColor = vec4(color, opacity * dashOpacity * antialiasing);
}
