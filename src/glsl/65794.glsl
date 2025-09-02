precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
vec3 closestPointToRay(vec3 point, vec3 origin, vec3 direction)
{
  vec3 d = point - origin;
  float D = dot(d, direction);
  return origin + D * direction;
}
vec3 rayIntersectsSphere(vec3 origin, float radius, vec3 rayOrigin, vec3 rayDirection)
{
  vec3 chordPoint = closestPointToRay(origin, rayOrigin, rayDirection);
  float D1 = length(rayOrigin - chordPoint);
  float D = length(chordPoint - origin);
  float D2 = sqrt(radius * radius - D * D);
  return rayOrigin + (D1 + D2) * rayDirection;
}
uniform vec3 opacity;
uniform vec3 radius;
uniform vec3 feather;
uniform vec3 color;
varying vec4 vCenter;
varying vec4 vPosition;
void main()
{
  float fragRadius = length(vPosition.xyz - vCenter.xyz);
  vec3 featherStart = radius - feather;
  vec3 circleAlphaWithFeather = 1. - max(fragRadius - featherStart, 0.) / (feather * 2.);
  gl_FragColor = vec4(color.rgb * opacity * circleAlphaWithFeather, 1.);
}
