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
#define MIN_SCALE  0.4
#define MIN_METERS_PER_PX  0.006
#define MAX_METERS_PER_PX  0.012
uniform float paddingPx;
uniform float widthPx;
uniform float heightPx;
uniform float aaPaddingPx;
uniform float metersPerPx;
uniform float outline;
uniform vec2 tip;
uniform vec2 normal;
uniform float height;
attribute vec2 offset;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vOffsetPx;
varying vec2 scaledWidthHeightPx;
vec2 scaleByZoom()
{
  float t = clamp((metersPerPx - MIN_METERS_PER_PX) / (MAX_METERS_PER_PX - MIN_METERS_PER_PX), 0., 1.);
  float scale = mix(1., MIN_SCALE, t);
  return vec2(widthPx, heightPx) * scale;
}
void main()
{
  vec2 yAxis = normal;
  vec2 xAxis = rotate90(yAxis);
  vec4 tipWorld = vec4(tip.x, height, tip.y, 1.);
  vec4 xOffsetWorld = tipWorld + vec4(xAxis.x, 0., xAxis.y, 0.);
  vec4 yOffsetWorld = tipWorld + vec4(yAxis.x, 0., yAxis.y, 0.);
  vec4 ndcTip = projectionMatrix * modelViewMatrix * tipWorld;
  vec2 tipScreen = ndcToScreen(ndcTip / ndcTip.w);
  vec4 ndcXOffset = projectionMatrix * modelViewMatrix * xOffsetWorld;
  vec2 xOffsetScreen = ndcToScreen(ndcXOffset / ndcXOffset.w);
  vec4 ndcYOffset = projectionMatrix * modelViewMatrix * yOffsetWorld;
  vec2 yOffsetScreen = ndcToScreen(ndcYOffset / ndcYOffset.w);
  vec2 xAxisScreen = normalize(xOffsetScreen - tipScreen);
  vec2 yAxisScreen = normalize(yOffsetScreen - tipScreen);
  float padding = aaPaddingPx + outline;
  scaledWidthHeightPx = scaleByZoom();
  float halfWidth = scaledWidthHeightPx.x / 2. + padding;
  float quadHeight = scaledWidthHeightPx.y + padding * 2.;
  vec2 vertexScreen = (tipScreen + yAxisScreen * paddingPx) + xAxisScreen * halfWidth * offset.x + yAxisScreen * quadHeight * offset.y;
  vec2 ndcVert = screenToNdc(vertexScreen);
  vOffsetPx = vec2(offset.x * halfWidth, offset.y * quadHeight);
  gl_Position = vec4(ndcVert * ndcTip.w, ndcTip.z, ndcTip.w);
}
