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
varying vec2 vUv;
void main()
{
  float dist = length(vUv);
  float alpha = (1. - smoothstep(0.95, 1., dist)) * 0.3;
  gl_FragColor = vec4(1., 1., 1., alpha);
}
