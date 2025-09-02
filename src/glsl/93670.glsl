#define ANTIALIAS_WIDTH  1.0
precision highp float;
uniform float selectedWidth;
uniform vec3 outlineColor;
uniform vec3 color;
uniform float opacity;
uniform float width;
uniform vec3 lineStart;
uniform vec3 lineEnd;
varying vec3 vWorldPos;
float distanceBetween(vec2 l1, vec2 l2, vec2 p)
{
  float D = length(l2 - l1);
  float N = abs((l2.x - l1.x) * (l1.y - p.y) - (l1.x - p.x) * (l2.y - l1.y));
  return N / D;
}
void main()
{
  float distanceToLine = distanceBetween(lineStart.xz, lineEnd.xz, vWorldPos.xz);
  float aaWidth = fwidth(distanceToLine) * ANTIALIAS_WIDTH;
  float lineLerp = smoothstep(selectedWidth - aaWidth, selectedWidth, distanceToLine);
  float halfWidth = width * 0.5;
  float aaOpacity = smoothstep(halfWidth, halfWidth - aaWidth, distanceToLine);
  gl_FragColor = mix(vec4(outlineColor, opacity * aaOpacity), vec4(color, opacity * aaOpacity), lineLerp);
  if (gl_FragColor.a < 0.01)
  {
    discard;
  }
}
