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
uniform samplerCube map;
uniform float opacity;
uniform vec4 borderColor;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;
const float borderThickness = 0.25;
void main()
{
  vec4 color = textureCube(map, vec3(-vWorldPosition.x, vWorldPosition.yz));
  vec3 normal = normalize(vNormal);
  vec3 toVertex = normalize(vViewPosition);
  float a = dot(normal, toVertex);
  float adjustedA = sqrt(clamp(a, 0., 1.));
  vec4 outColor = vec4(color.rgb, adjustedA);
  gl_FragColor = mix(outColor, borderColor, step(a, borderThickness));
  gl_FragColor.a *= opacity;
}
