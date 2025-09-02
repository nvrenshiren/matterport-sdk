precision highp float;
uniform vec2 screenSize;
vec2 rotate90(vec2 v)
{
  return vec2(-v.y, v.x);
}
vec2 ndcToScreen(vec4 pt)
{
  return pt.xy * screenSize / 2.;
}
vec2 screenToNdc(vec2 pt)
{
  return pt * 2. / screenSize;
}
uniform float lineWidth;
uniform float antialiasWidth;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute float offsetDirection;
attribute vec3 start;
attribute vec3 end;
attribute float t;
varying float vDistanceFromAxis;
varying float vDistanceAlong;
void main()
{
  vec4 startNdc = projectionMatrix * modelViewMatrix * vec4(start, 1.);
  vec4 endNdc = projectionMatrix * modelViewMatrix * vec4(end, 1.);
  float z = mix(startNdc.z, endNdc.z, t);
  float w = mix(startNdc.w, endNdc.w, t);
  vec2 startScreen = ndcToScreen(startNdc / startNdc.w);
  vec2 endScreen = ndcToScreen(endNdc / endNdc.w);
  float halfWidth = lineWidth * 0.5 + antialiasWidth;
  vec2 directionScreen = endScreen - startScreen;
  vec2 widthOffsetScreen = rotate90(normalize(directionScreen)) * offsetDirection * halfWidth;
  vec2 position = startScreen + directionScreen * t + widthOffsetScreen;
  vDistanceFromAxis = length(widthOffsetScreen);
#ifdef WORLDSPACE_DASH
  vDistanceAlong = length((end - start) * t);
#else
  vDistanceAlong = length(directionScreen * t);
#endif
  vec2 posNdc = screenToNdc(position);
  gl_Position = vec4(posNdc * w, z, w);
}
